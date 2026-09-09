// api/chat.js
// ============================================================================
// Vercel serverless funkce — bezpečný proxy mezi HTML aplikací (Tuxík chat
// widget, viz assets/tuxik-agent.js) a Gemini API. Klíč GEMINI_API_KEY se
// NIKDY nedává do HTML/JS, které jde do prohlížeče žáka — nastavuje se
// v nastavení projektu na Vercelu:
//   Vercel → tento projekt → Settings → Environment Variables
//     GEMINI_API_KEY = <klíč z https://aistudio.google.com/apikey>
// Po přidání proměnné je potřeba udělat nový deploy (Redeploy), aby se
// funkce s novou hodnotou nasadila.
//
// Volitelně lze nastavit i GEMINI_MODEL (výchozí: gemini-flash-latest —
// alias, který Google udržuje nasměrovaný na aktuální doporučený rychlý
// model, takže se nemusí ručně měnit při vydání nové verze Gemini).
//
// Free tier Gemini modelů se v špičkách umí zahltit (Google vrátí 503
// "model is overloaded / high demand"). Proto funkce automaticky zkusí
// požadavek zopakovat (s krátkou pauzou) a případně přepnout na záložní
// model (GEMINI_FALLBACK_MODEL), než žákovi vrátí chybu.
// ============================================================================

const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || "gemini-2.5-flash";

const SYSTEM_PROMPT = `Jsi "Tuxík" – tučňák, maskot a průvodce výukou GNU/Linux (Debian)
pro žáky 4. ročníku střední průmyslové školy (SPŠ EI Ostrava, předmět Serverové služby).
Aplikace používá metodu challenge-based learning (fáze Engage → Investigate → Act).

Pravidla, která vždy dodržuj:
- Odpovídej výhradně česky, stručně (2–5 vět), přátelsky a věcně.
- NIKDY rovnou nenapiš hotový příkaz ani přesné řešení úlohy. Místo toho polož naváděcí
  otázku, dej dílčí nápovědu, nebo nasměruj na relevantní část manuálové stránky (man)
  či oficiální dokumentace.
- Pokud žák i po nápovědě zjevně tápe, můžeš odhalit jeden malý dílčí krok — nikdy ale
  celé řešení najednou.
- Vycházej z kontextu aktuální kapitoly uvedeného níže — drž se tématu, které žák právě
  probírá.
- Pokud se dotaz vůbec netýká Linuxu/informatiky/dané kapitoly, přátelsky žáka nasměruj
  zpět k tématu.
- Piš prostý text bez Markdown nadpisů, tabulek nebo odrážek — odpověď se zobrazuje
  v malém chatovém okně v postranním panelu.`;

function sleep(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

// Pozná, jestli šlo o dočasné přetížení modelu (503 / "overloaded" / "high demand" /
// "UNAVAILABLE") — u těch se má cenu to zkusit znovu. U jiných chyb (špatný klíč,
// zablokovaný obsah...) opakování nic nevyřeší.
function isOverloadError(status, data) {
  if (status === 503) return true;
  var msg = (data && data.error && data.error.message) || "";
  var statusStr = (data && data.error && data.error.status) || "";
  return /overloaded|high demand|unavailable/i.test(msg + " " + statusStr);
}

async function callGemini(model, apiKey, payload) {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/" +
    model +
    ":generateContent?key=" +
    apiKey;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await r.json();
  return { ok: r.ok, status: r.status, data: data };
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Endpoint přijímá pouze POST." });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error:
        "Na serveru chybí GEMINI_API_KEY. Nastavte ho ve Vercel → Settings → Environment Variables a udělejte Redeploy.",
    });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }
  body = body || {};

  const message = String(body.message || "").slice(0, 2000).trim();
  const context = String(body.context || "").slice(0, 4000);
  const history = Array.isArray(body.history) ? body.history.slice(-10) : [];

  if (!message) {
    res.status(400).json({ error: "Prázdná zpráva." });
    return;
  }

  // Historie konverzace pro Gemini (role "user" / "model")
  const contents = [];
  history.forEach(function (m) {
    if (m && (m.role === "user" || m.role === "model") && typeof m.text === "string") {
      contents.push({ role: m.role, parts: [{ text: m.text.slice(0, 2000) }] });
    }
  });
  contents.push({ role: "user", parts: [{ text: message }] });

  const payload = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT + "\n\n--- KONTEXT AKTUÁLNÍ KAPITOLY ---\n" + context }],
    },
    contents: contents,
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 800,
    },
  };

  // Až 3 pokusy: 2x hlavní model (s krátkou pauzou), pak 1x záložní model —
  // ale jen pokud šlo o dočasné přetížení. U jiné chyby se další pokusy přeskočí.
  const attempts = [
    { model: MODEL, delay: 0 },
    { model: MODEL, delay: 700 },
    { model: FALLBACK_MODEL, delay: 400 },
  ];

  let result = null;
  try {
    for (let i = 0; i < attempts.length; i++) {
      if (attempts[i].delay) await sleep(attempts[i].delay);
      result = await callGemini(attempts[i].model, apiKey, payload);
      if (result.ok) break;
      if (!isOverloadError(result.status, result.data)) break; // jiná chyba, opakování nepomůže
      console.warn(
        "Gemini overloaded (pokus " + (i + 1) + "/" + attempts.length + ", model " + attempts[i].model + "), zkouším znovu…"
      );
    }

    const data = result.data;

    if (!result.ok) {
      console.error("Gemini API error:", JSON.stringify(data));
      const friendly = isOverloadError(result.status, data)
        ? "Tuxíkovi se teď nedaří spojit s AI — Gemini je dočasně přetížené (velký provoz na free tier). Zkus to prosím za chvíli znovu."
        : (data && data.error && data.error.message) || "Chyba Gemini API.";
      res.status(502).json({ error: friendly, retryable: isOverloadError(result.status, data) });
      return;
    }

    const candidate = data && data.candidates && data.candidates[0];
    const reply =
      candidate &&
      candidate.content &&
      candidate.content.parts &&
      candidate.content.parts[0] &&
      candidate.content.parts[0].text;

    if (!reply) {
      const blockReason = data && data.promptFeedback && data.promptFeedback.blockReason;
      res.status(502).json({
        error: blockReason
          ? "Model odpověď zablokoval (" + blockReason + "). Zkus otázku přeformulovat."
          : "Model nevrátil žádnou odpověď. Zkus to prosím znovu.",
      });
      return;
    }

    res.status(200).json({ reply: reply.trim() });
  } catch (err) {
    console.error("Chat proxy error:", err);
    res.status(500).json({ error: "Chyba serveru při volání Gemini API." });
  }
};

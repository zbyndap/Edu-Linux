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
// ============================================================================

const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

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
      maxOutputTokens: 400,
    },
  };

  try {
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      MODEL +
      ":generateContent?key=" +
      apiKey;

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await r.json();

    if (!r.ok) {
      console.error("Gemini API error:", JSON.stringify(data));
      res.status(502).json({
        error: (data && data.error && data.error.message) || "Chyba Gemini API.",
      });
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

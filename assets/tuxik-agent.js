/* ============================================================================
   TUXÍK — chatovací agent (průvodce kapitolou) — Edu-Linux (SPŠ EI Ostrava)
   ============================================================================
   Jak zapojit do kapitoly: přidejte JEDEN řádek před </body>:
     <script src="../assets/tuxik-agent.js" defer></script>
   (viz _sablona-kapitoly.html — už tam je). Nic dalšího upravovat netřeba,
   widget se sám postará o vykreslení plovoucího tlačítka i chatu.

   Jak to funguje:
   - Skript vytvoří plovoucí tlačítko s Tuxíkem vpravo dole a po kliknutí
     rozbalí chatovací panel.
   - Při odeslání zprávy se z aktuální stránky vytáhne krátký kontext
     (název kapitoly, výzva, badatelské otázky, obsah fází ACT BEZ skrytých
     řešení — ta se do kontextu záměrně neposílají) a spolu se zprávou a
     historií konverzace se pošle na /api/chat.
   - /api/chat je Vercel serverless funkce (viz api/chat.js), která bezpečně
     volá Google Gemini API — API klíč je jen na serveru, nikdy v prohlížeči.

   Úprava osobnosti/pravidel agenta: viz SYSTEM_PROMPT v api/chat.js.
   Úprava vzhledu: barvy níže odpovídají grafickému manuálu projektu
   (Robot blue #47657D, Electric green #DBF02A).
   ========================================================================= */
(function () {
  "use strict";

  if (document.getElementById("tuxik-root")) return; // ochrana proti dvojímu načtení

  var COLORS = {
    ink: "#1E2E38",
    inkSoft: "#54666F",
    border: "#D7E3E8",
    surface: "#F2F6F8",
    robot: "#47657D",
    robotDeep: "#2E4657",
    robotTint: "#EAF0F3",
    electric: "#DBF02A",
    electricDeep: "#71801A",
    bad: "#B5453B",
    badTint: "#F6E9E7",
  };

  /* ---------------------------------------------------------------------- */
  /* CSS                                                                    */
  /* ---------------------------------------------------------------------- */
  var css =
    "#tuxik-root{font-family:'JetBrains Mono','Lilex','Fira Code',Consolas,'SF Mono',Menlo,monospace;}" +
    "#tuxik-root *{box-sizing:border-box;}" +
    ".tuxik-fab{position:fixed;right:1.2rem;bottom:1.2rem;z-index:9999;width:60px;height:60px;" +
    "border-radius:50%;background:linear-gradient(160deg," + COLORS.robot + "," + COLORS.robotDeep + ");" +
    "border:none;box-shadow:0 6px 20px rgba(30,46,56,.28),0 2px 6px rgba(30,46,56,.15);cursor:pointer;" +
    "display:flex;align-items:center;justify-content:center;transition:transform .15s ease,box-shadow .15s ease;padding:0;}" +
    ".tuxik-fab:hover{transform:translateY(-2px) scale(1.05);box-shadow:0 10px 26px rgba(30,46,56,.32);}" +
    ".tuxik-fab:active{transform:translateY(0) scale(.98);}" +
    ".tuxik-badge{position:absolute;top:5px;right:5px;width:11px;height:11px;border-radius:50%;" +
    "background:" + COLORS.electric + ";box-shadow:0 0 0 2px " + COLORS.robotDeep + ";animation:tuxik-pulse 2.2s ease-in-out infinite;}" +
    "@keyframes tuxik-pulse{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.35);opacity:.55;}}" +
    ".tuxik-greet{position:fixed;right:5.6rem;bottom:1.5rem;z-index:9998;max-width:200px;background:#fff;" +
    "border:1px solid " + COLORS.border + ";border-radius:14px 14px 4px 14px;box-shadow:0 6px 20px rgba(30,46,56,.15);" +
    "padding:.65rem .85rem;font-size:.82rem;color:" + COLORS.ink + ";cursor:pointer;opacity:0;transform:translateY(6px);" +
    "transition:opacity .35s ease,transform .35s ease;}" +
    ".tuxik-greet.show{opacity:1;transform:translateY(0);}" +
    ".tuxik-panel{position:fixed;right:1.2rem;bottom:5.6rem;z-index:9999;width:352px;max-width:calc(100vw - 2rem);" +
    "height:min(70vh,540px);background:#fff;border:1px solid " + COLORS.border + ";border-radius:20px;" +
    "box-shadow:0 16px 44px rgba(30,46,56,.28);display:none;flex-direction:column;overflow:hidden;}" +
    ".tuxik-panel.open{display:flex;}" +
    ".tuxik-head{flex:none;display:flex;align-items:center;gap:.6rem;padding:.8rem .95rem;" +
    "background:linear-gradient(180deg,#fff," + COLORS.robotTint + ");border-bottom:1px solid " + COLORS.border + ";}" +
    ".tuxik-head .tuxik-avatar{flex:none;width:34px;height:34px;border-radius:50%;background:" + COLORS.robotDeep + ";" +
    "display:flex;align-items:center;justify-content:center;}" +
    ".tuxik-head .tuxik-titles{flex:1;min-width:0;}" +
    ".tuxik-head .tuxik-name{font-weight:700;font-size:.9rem;color:" + COLORS.robotDeep + ";}" +
    ".tuxik-head .tuxik-sub{font-size:.72rem;color:" + COLORS.inkSoft + ";}" +
    ".tuxik-headbtn{flex:none;width:26px;height:26px;border:none;background:transparent;border-radius:8px;" +
    "color:" + COLORS.inkSoft + ";cursor:pointer;font-size:.95rem;display:flex;align-items:center;justify-content:center;}" +
    ".tuxik-headbtn:hover{background:" + COLORS.surface + ";color:" + COLORS.ink + ";}" +
    ".tuxik-msgs{flex:1;overflow-y:auto;padding:.9rem;display:flex;flex-direction:column;gap:.55rem;background:#fff;}" +
    ".tuxik-msg{max-width:86%;font-size:.85rem;line-height:1.55;padding:.55rem .75rem;border-radius:14px;white-space:pre-wrap;}" +
    ".tuxik-msg.user{align-self:flex-end;background:" + COLORS.robot + ";color:#fff;border-bottom-right-radius:4px;}" +
    ".tuxik-msg.model{align-self:flex-start;background:" + COLORS.surface + ";color:" + COLORS.ink + ";border-bottom-left-radius:4px;}" +
    ".tuxik-msg.error{align-self:flex-start;background:" + COLORS.badTint + ";color:" + COLORS.bad + ";border-bottom-left-radius:4px;}" +
    ".tuxik-retry-btn{margin-top:.4rem;display:inline-flex;align-items:center;gap:.3rem;font-family:inherit;font-size:.78rem;font-weight:700;" +
    "color:" + COLORS.bad + ";background:#fff;border:1px solid " + COLORS.bad + ";border-radius:999px;padding:.28rem .7rem;cursor:pointer;}" +
    ".tuxik-retry-btn:hover{background:" + COLORS.badTint + ";}" +
    ".tuxik-typing{align-self:flex-start;display:flex;gap:4px;padding:.6rem .8rem;background:" + COLORS.surface + ";border-radius:14px;border-bottom-left-radius:4px;}" +
    ".tuxik-typing span{width:6px;height:6px;border-radius:50%;background:" + COLORS.inkSoft + ";animation:tuxik-bounce 1.1s ease-in-out infinite;}" +
    ".tuxik-typing span:nth-child(2){animation-delay:.15s;}.tuxik-typing span:nth-child(3){animation-delay:.3s;}" +
    "@keyframes tuxik-bounce{0%,60%,100%{transform:translateY(0);opacity:.5;}30%{transform:translateY(-4px);opacity:1;}}" +
    ".tuxik-form{flex:none;display:flex;gap:.5rem;padding:.7rem;border-top:1px solid " + COLORS.border + ";background:#fff;}" +
    ".tuxik-input{flex:1;resize:none;border:1px solid " + COLORS.border + ";border-radius:12px;padding:.55rem .7rem;" +
    "font-family:inherit;font-size:.85rem;color:" + COLORS.ink + ";background:" + COLORS.surface + ";max-height:80px;line-height:1.4;}" +
    ".tuxik-input:focus{outline:2px solid " + COLORS.electricDeep + ";outline-offset:1px;}" +
    ".tuxik-send{flex:none;width:38px;height:38px;border:none;border-radius:11px;background:" + COLORS.robot + ";" +
    "color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s ease;}" +
    ".tuxik-send:hover{background:" + COLORS.robotDeep + ";}" +
    ".tuxik-send:disabled{background:" + COLORS.border + ";cursor:default;}" +
    "@media (max-width:480px){.tuxik-panel{right:.7rem;left:.7rem;width:auto;bottom:5.2rem;}.tuxik-greet{right:1rem;max-width:160px;}}" +
    "@media (prefers-reduced-motion:reduce){.tuxik-badge,.tuxik-typing span{animation:none!important;}.tuxik-greet{transition:none!important;}}";

  var styleEl = document.createElement("style");
  styleEl.id = "tuxik-style";
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ---------------------------------------------------------------------- */
  /* SVG Tuxík (jednoduchá vlastní kresba tučňáka, ne kopie konkrétní grafiky) */
  /* ---------------------------------------------------------------------- */
  function tuxSvg(size) {
    return (
      '<svg width="' + size + '" height="' + size + '" viewBox="0 0 48 48" aria-hidden="true">' +
      '<ellipse cx="24" cy="27" rx="14" ry="17" fill="#1E2E38"/>' +
      '<ellipse cx="11.5" cy="25" rx="3.4" ry="8.6" fill="#1E2E38" transform="rotate(-20 11.5 25)"/>' +
      '<ellipse cx="36.5" cy="25" rx="3.4" ry="8.6" fill="#1E2E38" transform="rotate(20 36.5 25)"/>' +
      '<ellipse cx="24" cy="30" rx="8.6" ry="12" fill="#FFFFFF"/>' +
      '<circle cx="19.6" cy="18.2" r="2.7" fill="#FFFFFF"/>' +
      '<circle cx="28.4" cy="18.2" r="2.7" fill="#FFFFFF"/>' +
      '<circle cx="20.4" cy="18.8" r="1.35" fill="#1E2E38"/>' +
      '<circle cx="29.2" cy="18.8" r="1.35" fill="#1E2E38"/>' +
      '<path d="M22 21.8 L26 21.8 L24 25.4 Z" fill="#E8A23E"/>' +
      '<ellipse cx="18.5" cy="43.6" rx="4" ry="2" fill="#E8A23E"/>' +
      '<ellipse cx="29.5" cy="43.6" rx="4" ry="2" fill="#E8A23E"/>' +
      "</svg>"
    );
  }

  /* ---------------------------------------------------------------------- */
  /* DOM                                                                    */
  /* ---------------------------------------------------------------------- */
  var root = document.createElement("div");
  root.id = "tuxik-root";
  root.innerHTML =
    '<div class="tuxik-greet" id="tuxik-greet">Ahoj, jsem Tuxík! 🐧 Mám otázku k téhle kapitole? Klidně se zeptej.</div>' +
    '<button class="tuxik-fab" id="tuxik-toggle" aria-label="Otevřít chat s Tuxíkem" aria-expanded="false">' +
      tuxSvg(34) +
      '<span class="tuxik-badge"></span>' +
    "</button>" +
    '<div class="tuxik-panel" id="tuxik-panel" role="dialog" aria-label="Chat s Tuxíkem">' +
      '<div class="tuxik-head">' +
        '<div class="tuxik-avatar">' + tuxSvg(22) + "</div>" +
        '<div class="tuxik-titles"><div class="tuxik-name">Tuxík</div><div class="tuxik-sub">průvodce kapitolou</div></div>' +
        '<button class="tuxik-headbtn" id="tuxik-reset" title="Vymazat konverzaci" aria-label="Vymazat konverzaci">↺</button>' +
        '<button class="tuxik-headbtn" id="tuxik-close" title="Zavřít" aria-label="Zavřít chat">✕</button>' +
      "</div>" +
      '<div class="tuxik-msgs" id="tuxik-msgs"></div>' +
      '<form class="tuxik-form" id="tuxik-form">' +
        '<textarea class="tuxik-input" id="tuxik-input" rows="1" placeholder="Napiš otázku…" aria-label="Zpráva pro Tuxíka"></textarea>' +
        '<button type="submit" class="tuxik-send" id="tuxik-send" aria-label="Odeslat">➤</button>' +
      "</form>" +
    "</div>";
  document.body.appendChild(root);

  var els = {
    toggle: document.getElementById("tuxik-toggle"),
    panel: document.getElementById("tuxik-panel"),
    close: document.getElementById("tuxik-close"),
    reset: document.getElementById("tuxik-reset"),
    msgs: document.getElementById("tuxik-msgs"),
    form: document.getElementById("tuxik-form"),
    input: document.getElementById("tuxik-input"),
    send: document.getElementById("tuxik-send"),
    greet: document.getElementById("tuxik-greet"),
  };

  /* ---------------------------------------------------------------------- */
  /* Kontext aktuální kapitoly (bez skrytých řešení)                        */
  /* ---------------------------------------------------------------------- */
  function cleanText(t) {
    return (t || "").replace(/\s+/g, " ").trim();
  }

  function getChapterContext() {
    try {
      var parts = [];
      var titleEl = document.getElementById("h1-title");
      parts.push("Kapitola: " + cleanText((titleEl && titleEl.textContent) || document.title));

      var engage = document.getElementById("engage-card");
      if (engage) parts.push("Výzva (Engage): " + cleanText(engage.textContent));

      var gq = document.getElementById("gq-list");
      if (gq) parts.push("Badatelské otázky: " + cleanText(gq.textContent));

      var act = document.getElementById("act-phases");
      if (act) {
        var clone = act.cloneNode(true);
        var solutions = clone.querySelectorAll(".solution");
        solutions.forEach(function (s) {
          s.parentNode.removeChild(s);
        });
        parts.push("Fáze ACT (bez skrytých řešení): " + cleanText(clone.textContent));
      }

      return parts.join("\n").slice(0, 3500);
    } catch (e) {
      return "";
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Historie konverzace (sessionStorage, per stránka)                      */
  /* ---------------------------------------------------------------------- */
  var STORAGE_KEY = "tuxik_chat_" + location.pathname;
  var history = [];
  try {
    var saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) history = JSON.parse(saved);
  } catch (e) {
    history = [];
  }

  function saveHistory() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-20)));
    } catch (e) {}
  }

  /* ---------------------------------------------------------------------- */
  /* Vykreslování zpráv                                                     */
  /* ---------------------------------------------------------------------- */
  function addMessageToUI(role, text, isError, onRetry) {
    var div = document.createElement("div");
    div.className = "tuxik-msg " + (isError ? "error" : role);
    div.textContent = text;
    if (isError && typeof onRetry === "function") {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tuxik-retry-btn";
      btn.textContent = "🔁 Zkusit znovu";
      btn.addEventListener("click", function () {
        div.parentNode && div.parentNode.removeChild(div);
        onRetry();
      });
      div.appendChild(document.createElement("br"));
      div.appendChild(btn);
    }
    els.msgs.appendChild(div);
    els.msgs.scrollTop = els.msgs.scrollHeight;
    return div;
  }

  function renderHistory() {
    els.msgs.innerHTML = "";
    if (history.length === 0) {
      addMessageToUI(
        "model",
        "Ahoj, jsem Tuxík! 🐧 Zeptej se mě na cokoli k téhle kapitole — poradím, ale hotové řešení ti nenapíšu, ať na to přijdeš sám. 😉"
      );
      return;
    }
    history.forEach(function (m) {
      addMessageToUI(m.role, m.text);
    });
  }

  var typingEl = null;
  function showTyping(on) {
    if (on) {
      typingEl = document.createElement("div");
      typingEl.className = "tuxik-typing";
      typingEl.innerHTML = "<span></span><span></span><span></span>";
      els.msgs.appendChild(typingEl);
      els.msgs.scrollTop = els.msgs.scrollHeight;
    } else if (typingEl && typingEl.parentNode) {
      typingEl.parentNode.removeChild(typingEl);
      typingEl = null;
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Odeslání zprávy na /api/chat                                           */
  /* ---------------------------------------------------------------------- */
  function sendMessage(text) {
    addMessageToUI("user", text);
    var historyBeforeThisMessage = history.slice();
    history.push({ role: "user", text: text });
    saveHistory();
    callChat(text, historyBeforeThisMessage);
  }

  // Zopakuje neúspěšný dotaz BEZ toho, aby se zpráva žáka objevila v chatu znovu
  // (uživatelská bublina i historie už jsou tam z prvního pokusu).
  function retryMessage(text, historyBeforeThisMessage) {
    callChat(text, historyBeforeThisMessage);
  }

  function callChat(text, historyBeforeThisMessage) {
    els.send.disabled = true;
    showTyping(true);

    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        history: historyBeforeThisMessage,
        context: getChapterContext(),
      }),
    })
      .then(function (r) {
        return r.json().then(function (data) {
          return { ok: r.ok, data: data };
        });
      })
      .then(function (res) {
        showTyping(false);
        els.send.disabled = false;
        if (!res.ok) {
          var canRetry = !!(res.data && res.data.retryable);
          addMessageToUI(
            "model",
            "⚠️ " + (res.data.error || "Něco se pokazilo, zkus to prosím znovu."),
            true,
            canRetry ? function () { retryMessage(text, historyBeforeThisMessage); } : null
          );
          return;
        }
        addMessageToUI("model", res.data.reply);
        history.push({ role: "model", text: res.data.reply });
        saveHistory();
      })
      .catch(function () {
        showTyping(false);
        els.send.disabled = false;
        addMessageToUI(
          "model",
          "⚠️ Nepodařilo se spojit se serverem. Zkontroluj připojení a zkus to znovu.",
          true,
          function () { retryMessage(text, historyBeforeThisMessage); }
        );
      });
  }

  /* ---------------------------------------------------------------------- */
  /* Ovládání panelu                                                        */
  /* ---------------------------------------------------------------------- */
  function openPanel() {
    els.panel.classList.add("open");
    els.toggle.setAttribute("aria-expanded", "true");
    hideGreet();
    if (els.msgs.children.length === 0) renderHistory();
    els.input.focus();
  }
  function closePanel() {
    els.panel.classList.remove("open");
    els.toggle.setAttribute("aria-expanded", "false");
  }
  function togglePanel() {
    if (els.panel.classList.contains("open")) closePanel();
    else openPanel();
  }

  function hideGreet() {
    els.greet.classList.remove("show");
  }

  els.toggle.addEventListener("click", togglePanel);
  els.close.addEventListener("click", closePanel);
  els.greet.addEventListener("click", function () {
    hideGreet();
    openPanel();
  });
  els.reset.addEventListener("click", function () {
    history = [];
    saveHistory();
    renderHistory();
    els.input.focus();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && els.panel.classList.contains("open")) closePanel();
  });

  els.form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = els.input.value.trim();
    if (!text || els.send.disabled) return;
    els.input.value = "";
    els.input.style.height = "auto";
    sendMessage(text);
  });

  els.input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      els.form.requestSubmit ? els.form.requestSubmit() : els.form.dispatchEvent(new Event("submit", { cancelable: true }));
    }
  });

  els.input.addEventListener("input", function () {
    els.input.style.height = "auto";
    els.input.style.height = Math.min(els.input.scrollHeight, 80) + "px";
  });

  /* ---------------------------------------------------------------------- */
  /* Uvítací bublina (jen jednou za prohlížečovou relaci)                   */
  /* ---------------------------------------------------------------------- */
  try {
    if (!sessionStorage.getItem("tuxik_greeted")) {
      sessionStorage.setItem("tuxik_greeted", "1");
      setTimeout(function () {
        if (els.panel.classList.contains("open")) return; // panel už otevřený, bublina zbytečná
        els.greet.classList.add("show");
        setTimeout(hideGreet, 7000);
      }, 1400);
    }
  } catch (e) {}
})();

// jUNgKRAUT Cookie Consent
// Fragt nach technisch notwendigen und nutzerfreundlichen Cookies / Speicherungen

(function () {
  const STORAGE_KEY = "jungkraut_cookie_consent";

  function getConsent() {
    try {
      const raw = globalThis.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      if (!parsed.necessary) return null;
      return {
        necessary: true,
        comfort: !!parsed.comfort,
      };
    } catch (e) {
      return null;
    }
  }

  function saveConsent(consent) {
    try {
      globalThis.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          necessary: !!consent.necessary,
          comfort: !!consent.comfort,
          // Optional: Timestamp der Zustimmung
          timestamp: new Date().toISOString(),
        }),
      );
    } catch (e) {
      // Wenn localStorage nicht verfügbar ist, ignorieren wir den Fehler still
    }
  }

  function createConsentBanner() {
    if (document.getElementById("cookie-consent-backdrop")) {
      return;
    }

    const backdrop = document.createElement("div");
    backdrop.id = "cookie-consent-backdrop";
    backdrop.className = "cookie-consent-backdrop";
    backdrop.setAttribute("role", "presentation");

    const modal = document.createElement("div");
    modal.className = "cookie-consent-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "cookie-consent-title");

    modal.innerHTML =
      '<h2 id="cookie-consent-title">Cookie-Einstellungen</h2>' +
      "<p>Wir verwenden Cookies und ähnliche Technologien, um diese Website bereitzustellen und optional Ihre Nutzungserfahrung zu verbessern.</p>" +
      '<div class="cookie-consent-category">' +
      '  <div class="cookie-consent-category-header">' +
      "    <strong>Technisch notwendige Cookies</strong>" +
      '    <span class="cookie-consent-badge">Immer aktiv</span>' +
      "  </div>" +
      "  <p>Diese Cookies und Speicherungen sind erforderlich, damit die Website technisch funktioniert, z.&nbsp;B. um Ihre Cookie-Auswahl zu speichern.</p>" +
      '  <label class="cookie-consent-toggle disabled">' +
      '    <input type="checkbox" checked disabled />' +
      "    <span>Erforderlich für die Nutzung der Website</span>" +
      "  </label>" +
      "</div>" +
      '<div class="cookie-consent-category">' +
      '  <div class="cookie-consent-category-header">' +
      "    <strong>Nutzerfreundliche Funktionen</strong>" +
      "  </div>" +
      "  <p>Mit diesen optionalen Cookies und Speicherungen können wir nutzerfreundliche Funktionen anbieten (z.&nbsp;B. Merken von Einstellungen oder zukünftige Verbesserungen der User Experience).</p>" +
      '  <label class="cookie-consent-toggle">' +
      '    <input type="checkbox" id="cookie-consent-comfort" />' +
      "    <span>Datenspeicherung für nutzerfreundliche Funktionen erlauben</span>" +
      "  </label>" +
      "</div>" +
      '<p class="cookie-consent-hint">Weitere Informationen finden Sie in unserer <a href="imprint.html">Datenschutzerklärung</a>.</p>' +
      '<div class="cookie-consent-actions">' +
      '  <button type="button" class="cookie-btn-primary" id="cookie-consent-necessary-only">Nur technisch notwendige speichern</button>' +
      '  <button type="button" class="cookie-btn-secondary" id="cookie-consent-accept-all">Alle akzeptieren</button>' +
      "</div>";

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    const btnNecessary = document.getElementById(
      "cookie-consent-necessary-only",
    );
    const btnAll = document.getElementById("cookie-consent-accept-all");

    function close(consent) {
      saveConsent(consent);
      if (backdrop && backdrop.parentNode) {
        backdrop.remove();
      }
    }

    if (btnNecessary) {
      btnNecessary.addEventListener("click", function () {
        close({
          necessary: true,
          comfort: false,
        });
      });
    }

    if (btnAll) {
      btnAll.addEventListener("click", function () {
        close({
          necessary: true,
          comfort: true,
        });
      });
    }

    // Schließen mit ESC-Taste (ohne Ablehnen-Option, nur zur Tastaturbedienung
    document.addEventListener(
      "keydown",
      function (event) {
        if (event.key === "Escape") {
          // Nur technisch notwendige speichern, um Nutzung zu ermöglichen
          close({
            necessary: true,
            comfort: false,
          });
        }
      },
      { once: true },
    );
  }

  function init() {
    const existingConsent = getConsent();
    if (!existingConsent) {
      createConsentBanner();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Optional global verfügbar machen, falls später benötigt
  globalThis.jungkrautCookieConsent = {
    getConsent,
  };
})();

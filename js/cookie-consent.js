// jUNgKRAUT Cookie Consent
// Fragt nach technisch notwendigen und nutzerfreundlichen Cookies / Speicherungen

(function () {
  const STORAGE_KEY = "jungkraut_cookie_consent";

  // Auslesen der Cookie-Zustimmung
  function getConsent() {
    const raw = globalThis.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.necessary) return null;
    return {
      necessary: true,
      comfort: !!parsed.comfort,
    };
  }

  // Speichern der Cookie-Zustimmung
  function saveConsent(consent) {
    globalThis.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        necessary: !!consent.necessary,
        comfort: !!consent.comfort,
        // Optional: Timestamp der Zustimmung
        timestamp: new Date().toISOString(),
      }),
    );
    
  }

  // Erstellen des Cookie-Zustimmungsbanners um diesen nicht mehrfach anlegen zu müssen
  function createConsentBanner() {
    if (document.getElementById("cookie-consent-backdrop")) {
      return;
    }

    // Hintergrund erstellen
    const backdrop = document.createElement("div");
    backdrop.id = "cookie-consent-backdrop";
    backdrop.className = "cookie-consent-backdrop";
    backdrop.setAttribute("role", "presentation");

    // Modal erstellen
    const modal = document.createElement("div");
    modal.className = "cookie-consent-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "cookie-consent-title");

    // Modal Inhalt erstellen in html syntax
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
      '  <button type="button" class="cookie-btn-secondary" id="cookie-consent-save-selection">Auswahl speichern</button>' +
      '  <button type="button" class="cookie-btn-secondary" id="cookie-consent-accept-all">Alle akzeptieren</button>' +
      "</div>";

    // Hintergrund und Modal zusammenfügen
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    // Buttons erstellen
    const btnNecessary = document.getElementById(
      "cookie-consent-necessary-only",
    );
    const btnSaveSelection = document.getElementById(
      "cookie-consent-save-selection",
    );
    const btnAll = document.getElementById("cookie-consent-accept-all");
    const comfortCheckbox = document.getElementById(
      "cookie-consent-comfort",
    );

    // Schließen des Cookie-Zustimmungsbanners und speichern der Zustimmung
    function close(consent) {
      saveConsent(consent);
      if (backdrop && backdrop.parentNode) {
        backdrop.remove(); // Hintergrund entfernen
      }
    }

    // Klick auf den Button "Nur technisch notwendige speichern"
    if (btnNecessary) {
      btnNecessary.addEventListener("click", function () {
        close({ // Zustimmung speichern
          necessary: true,
          comfort: false,
        });

        // Optische Rückmeldung im Dialog
        if (comfortCheckbox) {
          comfortCheckbox.checked = false;
        }
      });
    }

    // Klick auf den Button "Auswahl speichern"
    if (btnSaveSelection) {
      btnSaveSelection.addEventListener("click", function () {
        const comfort =
          comfortCheckbox && comfortCheckbox.checked ? true : false;
        close({
          necessary: true,
          comfort: comfort,
        });
      });
    }

    // Klick auf den Button "Alle akzeptieren"
    if (btnAll) {
      btnAll.addEventListener("click", function () {
        close({
          necessary: true,
          comfort: true,
        });

        if (comfortCheckbox) {
          comfortCheckbox.checked = true;
        }
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

  // Initialisierung des Cookie-Zustimmungsbanners
  function init() {
    const existingConsent = getConsent();
    if (!existingConsent) {
      createConsentBanner();
    }
  }
  
  // Initialisierung des Cookie-Zustimmungsbanners nur wenn das DOM geladen ist
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

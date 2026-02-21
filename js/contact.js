// jUNgKRAUT Kontaktformular – Validierung, Prefill & Navigationswarnung

(function () {
  const STORAGE_KEY_CONTACT = "jungkraut_contact_data";

  // Cookie Daten auslesen um herauszufinden ob Komfortdaten gespeichert werden dürfen
  function getComfortConsent() {
    if (
      globalThis.jungkrautCookieConsent &&
      typeof globalThis.jungkrautCookieConsent.getConsent === "function"
    ) {
      const consent = globalThis.jungkrautCookieConsent.getConsent();
      return !!(consent && consent.comfort);
    }
    return false;
  }

  // Laden von eventuell zuvor gespeicherten Kontaktformular Daten
  function loadStoredContact() {
    if (!getComfortConsent()) return null; // Abbrechen wenn kein Consent erteilt

    const raw = globalThis.localStorage.getItem(STORAGE_KEY_CONTACT);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;

  }

  // Speichern von Kontaktformular Daten
  function saveContact(data) {
    if (!getComfortConsent()) return; // Abbrechen wenn kein Consent erteilt
      globalThis.localStorage.setItem(
        STORAGE_KEY_CONTACT,
        JSON.stringify({
          name: data.name || "",
          email: data.email || "",
          rating: data.rating || "",
        }),
      );
  }

  // Fehleranzeige setzen
  function setError(field, message) {
    const group = field.closest(".form-group");
    if (!group) return;
    group.classList.add("has-error");
    field.setAttribute("aria-invalid", "true");

    let errorEl = group.querySelector(".field-error");
    if (!errorEl) {
      errorEl = document.createElement("div");
      errorEl.className = "field-error";
      group.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  // Fehleranzeige löschen
  function clearError(field) {
    const group = field.closest(".form-group");
    if (!group) return;
    group.classList.remove("has-error");
    field.setAttribute("aria-invalid", "false");
    const errorEl = group.querySelector(".field-error");
    if (errorEl) {
      errorEl.textContent = "";
    }
  }

  // Validierung des Namens
  function validateName(field) {
    const value = field.value.trim();
    if (!value) {
      setError(field, "Bitte gib deinen Namen ein.");
      return false;
    }
    if (value.length < 2) {
      setError(field, "Der Name sollte mindestens 2 Zeichen lang sein.");
      return false;
    }
    clearError(field);
    return true;
  }

  // Validierung der E-Mail-Adresse
  function validateEmail(field) {
    const value = field.value.trim();
    if (!value) {
      setError(field, "Bitte gib deine E-Mail-Adresse ein.");
      return false;
    }
    // Einfache, praxisnahe E‑Mail-Plausibilitätsprüfung
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      setError(field, "Diese E-Mail-Adresse scheint nicht gültig zu sein.");
      return false;
    }
    clearError(field);
    return true;
  }

  // Validierung der Nachricht
  function validateMessage(field) {
    const value = field.value.trim();
    if (!value) {
      setError(field, "Bitte schreibe uns eine Nachricht.");
      return false;
    }
    if (value.length < 10) {
      setError(
        field,
        "Deine Nachricht ist sehr kurz. Bitte formuliere sie etwas ausführlicher.",
      );
      return false;
    }
    clearError(field);
    return true;
  }

  // Validierung der Bewertung
  function validateRating(field) {
    const value = field.value;
    if (!value) {
      setError(field, "Bitte wähle eine Bewertung aus.");
      return false;
    }
    clearError(field);
    return true;
  }

  // Validierung des Formulars, alle Felder werden validiert
  function validateForm(fields) {
    const { name, email, message, rating } = fields;
    const results = [
      validateName(name),
      validateEmail(email),
      validateMessage(message),
      validateRating(rating),
    ];

    // Ersten fehlerhaften Fokus setzen
    if (results.includes(false)) {
      const invalid =
        (!results[0] && name) ||
        (!results[1] && email) ||
        (!results[2] && message) ||
        (!results[3] && rating);
      if (invalid && typeof invalid.focus === "function") {
        invalid.focus();
      }
      return false;
    }
    return true;
  }

  // Komposition der E-Mail-Adresse
  function composeMailto(fields) {
    const { name, email, message, rating } = fields;
    const subject = "Kontakt jUNgKRAUT";
    const bodyLines = [
      "Neue Nachricht über das Kontaktformular auf jUNgKRAUT:",
      "",
      "Name: " + name.value.trim(),
      "E-Mail: " + email.value.trim(),
      "Bewertung: " + rating.value,
      "",
      "Nachricht:",
      message.value.trim(),
    ];

    const body = bodyLines.join("\n");
    return (
      "mailto:ff062@hdm-stuttgart.de" +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body)
    );
  }

  // Initialisierung des Kontaktformulars
  function init() {
    const form = document.querySelector(".contact-form");
    if (!form) return;

    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const messageField = document.getElementById("message");
    const ratingField = document.getElementById("rating");
    const submitBtn = form.querySelector(".submit-btn");

    if (!nameField || !emailField || !messageField || !ratingField) {
      return;
    }

    // Prefill aus Storage, falls Komfort-Cookies erlaubt sind
    const stored = loadStoredContact();
    if (stored) {
      if (stored.name) nameField.value = stored.name;
      if (stored.email) emailField.value = stored.email;
      if (stored.rating) ratingField.value = stored.rating;
    }

    // Dirty-Tracking für Navigationswarnung
    let isDirty = false;
    const fields = [nameField, emailField, messageField, ratingField];

    fields.forEach((field) => {
      field.addEventListener("input", () => {
        isDirty = true;
      });

      field.addEventListener("blur", () => {
        // Feldweise, zeitnahe Validierung
        switch (field.id) {
          case "name":
            validateName(field);
            break;
          case "email":
            validateEmail(field);
            break;
          case "message":
            validateMessage(field);
            break;
          case "rating":
            validateRating(field);
            break;
        }
      });
    });

    globalThis.addEventListener("beforeunload", function (event) {
      if (!isDirty) return;
      event.preventDefault();
    });

    // Standard-Submit-Verhalten überschreiben
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const ok = validateForm({
        name: nameField,
        email: emailField,
        message: messageField,
        rating: ratingField,
      });

      if (!ok) {
        // Probleme sind bereits an den Feldern markiert
        return;
      }

      // Kontaktdaten nur bei Komfort-Einwilligung speichern
      saveContact({
        name: nameField.value,
        email: emailField.value,
        rating: ratingField.value,
      });

      isDirty = false;

      const mailto = composeMailto({
        name: nameField,
        email: emailField,
        message: messageField,
        rating: ratingField,
      });

      globalThis.location.href = mailto;
    });

    // Sicherheitsnetz: Klick auf den Button behandelt wie Submit
    if (submitBtn) {
      submitBtn.addEventListener("click", function (event) {
        // Browser führen bei type="submit" ohnehin ein Submit aus,
        // Listener oben kümmert sich um alles Weitere.
      });
    }
  }

  // Initialisierung des Kontaktformulars nur wenn das DOM geladen ist
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

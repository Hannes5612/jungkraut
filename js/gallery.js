// Bildgalerie 

// Defensive: Fall jQuery nicht verfügbar, wird die JS-Galerie deaktiviert und die CSS-Variante sichtbar gelassen.
(function () {
  if (typeof window === "undefined" || typeof window.jQuery === "undefined") {
    console.warn(
      "[jUNgKRAUT] Galerie konnte nicht initialisiert werden, jQuery ist nicht verfügbar.",
    );

    var jsGallery = document.querySelector(".mission-gallery-js");
    var cssGallery = document.querySelector(".mission-gallery-css");
    if (jsGallery) {
      jsGallery.style.display = "none";
    }
    if (cssGallery) {
      cssGallery.style.display = "block";
    }

    return;
  }

  var $ = window.jQuery;

  const INTERVAL_MS = 5000;
  // Array mit den Bildern und deren Beschreibungen
  const slides = [
    {
      src: "media/images/gallery/carousel-loewenzahn.jpg",
      alt: "Löwenzahn, der verblüht auf einer Wiese wächst",
      caption:
        "Unsere Mission: Wissen über die Kräfte der Natur teilen und zeigen, wie sehr sie uns im Alltag stärkt.",
      description:
        "Löwenzahn, der verblüht auf einer Wiese wächst. Löwenzahn ist ein Symbol für Wachstum und Lebensfreude, dem wir täglich begegnen.",
    },
    {
      src: "media/images/gallery/carousel-hand.jpg",
      alt: "Eine Hand im Grünen, auf die Wasser tröpfelt",
      caption:
        "Verbundenheit mit der Natur ist wichtig für unsere Gesundheit und unsere Umwelt.",
      description:
        "Eine Hand im Grünen, auf die Wasser tröpfelt. Dieses Bild symbolisiert die Verbindung mit der Natur und die Stärke, die wir aus ihr ziehen können.",
    },
    {
      src: "media/images/posts/post3.jpg",
      alt: "Hände, die eine Pflanze mit einer Harke entfernen",
      caption:
        "Vorurteile an der Wurzel packen – statt vorschnell zu rupfen, fragen wir nach den Geschichten dahinter.",
      description:
        "Hände, die eine Pflanze mit einer Harke entfernen. Diese Harke symbolisiert die Tatsache, dass wir oft vorschnell zu rupfen beginnen und erst nachdenken, wenn es zu spät ist.",
    },
    {
      src: "media/images/gallery/carousel-city.jpg",
      alt: "Begrünte Stadtfassaden der Zukunft",
      caption:
        "Wir träumen von Städten, in denen Wildwuchs nicht bekämpft, sondern als Klimaretter gefeiert wird.",
      description:
        "Diese Begrünten Stadtfassaden symbolisieren die Vision, dass wir in Zukunft in Städten leben, in denen Wildwuchs nicht bekämpft, sondern als Klimaretter gefeiert wird.",
    },
    {
      src: "media/images/gallery/carousel-soup.jpg",
      alt: "Grüne Suppe mit Croutons",
      caption:
        "Von der Wiese auf den Teller: jUNgKRAUT verbindet Naturwissen mit alltagstauglichen Inspirationen.",
      description:
        "Mit im Wald gesammeltem Bärlauch lässt sich diese Grüne Suppe mit Croutons zubereiten.",
    },
  ];

  let currentIndex = 0;
  let autoMode = true;
  let timerId = null;

  // jQuery-Selektoren für die Elemente der Galerie
  const $image = $("#gallery-image");
  const $caption = $("#gallery-caption");
  const $dialog = $("#gallery-dialog");
  const $dialogText = $("#gallery-dialog-text");
  const $current = $("#gallery-current");
  const $total = $("#gallery-total");
  const $btnFirst = $("#gallery-first");
  const $btnPrev = $("#gallery-prev");
  const $btnNext = $("#gallery-next");
  const $btnToggleAuto = $("#gallery-toggle-auto");
  const $jumpBtns = $(".gallery-jump");

  // Aktualisieren des Labels für den Automatik-Button
  function updateToggleLabel() {
    if (autoMode) {
      $btnToggleAuto.text("Automatik pausieren");
    } else {
      $btnToggleAuto.text("Automatik starten");
    }
  }

  // Anzeigen des nächsten Bildes
  function showSlide(newIndex) {
    if (newIndex < 0 || newIndex >= slides.length) {
      return;
    }
    // nächstes Bild setzen
    const slide = slides[newIndex];
    $image.attr("src", slide.src);
    $image.attr("alt", slide.alt);
    $image.attr("title", slide.alt);
    $caption.text(slide.caption);
    $current.text(newIndex + 1);
    $total.text(slides.length);

    // Aktiven Sprung-Button markieren
    $jumpBtns.removeClass("gallery-jump-active").attr("aria-current", null);
    $jumpBtns.each(function () {
      var btnIndex = $(this).data("index"); // hole Index vom Datenattribut
      if (btnIndex === (newIndex + 1)) {
        $(this).addClass("gallery-jump-active"); // aktiven Sprung-Button markieren
        $(this).attr("aria-current", "true"); 
      } else {
        $(this).removeClass("gallery-jump-active"); // nicht mehr aktiven Sprung-Button abmarkieren
        $(this).attr("aria-current", null); 
      }
    });

    currentIndex = newIndex;
  }

  // Timer löschen
  function clearTimer() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  // Timer starten
  function startTimer() {
    clearTimer();
    timerId = setInterval(function () {
      if (currentIndex >= slides.length - 1) {
        // Am letzten Bild stoppen – kein Zurückspringen
        setAutoMode(false);
        return;
      }
      showSlide(currentIndex + 1, true);
    }, INTERVAL_MS);
  }

  // Automatik-Modus setzen
  function setAutoMode(enabled) {
    if (enabled === autoMode) {
      return; // wenn der Automatik-Modus bereits aktiv ist, nichts tun
    }
    autoMode = enabled;
    console.log("mode changed"); // für debugging
    if (autoMode) {
      startTimer();
    } else {
      clearTimer();
    }
    updateToggleLabel();
  }

  // Initialisierung der Galerie
  $(function () {
    if (!$image.length) {
      return; // wenn das Bild nicht gefunden wird, nichts tun
    }

    // Dialog hinzufügen
    if ($dialog.length) {
      $dialog.dialog({
        autoOpen: false,
        modal: true, // Dialog ist modal, d.h. der Hintergrund ist schwarz und der Dialog ist in der Mitte des Bildschirms.
        width: 520,
        show: { effect: "fade", duration: 250 },
        hide: { effect: "fade", duration: 180 },
        classes: {
          "ui-dialog": "mission-dialog", // Dialog Klasse für styling
        },
      });

      // Dialog öffnen wenn das Bild angeklickt wird
      $image.on("click keypress", function (event) {
        if (
          event.type === "click" ||
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          $dialogText.text(slides[currentIndex].description); // Bildbeschreibung setzen
          $dialog.dialog("open");
        }
      });

      $image.attr("tabindex", "0"); // Bild ist fokussierbar
      $image.attr("role", "button");    // Bild ist ein Button, um die Bildbeschreibung anzuzeigen. Drücke Enter oder die Leertaste.
      $image.attr(
        "aria-label", 
        "Bildbeschreibung anzeigen. Drücke Enter oder die Leertaste."
      );
    }
    
    // Initial anzeigen, aber noch nicht als Betrachtung zählen
    showSlide(0, false);
    // Automatik starten und CSS-only Galerie ausblenden
    startTimer();
    $(".mission-gallery-css").hide();
    // Klick auf den Button "Zurück"
    $btnPrev.on("click", function () {
      if (currentIndex === 0) {
        return;
      }
      if (autoMode) {
        setAutoMode(false);
      }
      showSlide(currentIndex - 1, true);
    });

    // Klick auf den Button "Weiter"
    $btnNext.on("click", function () {
      if (currentIndex >= slides.length - 1) {
        return; // wenn das letzte Bild angeklickt wird, nichts tun
      }
      if (autoMode) {
        setAutoMode(false);
      }
      showSlide(currentIndex + 1, true);
    });

    // Klick auf den Button "Zum Startbild"
    $btnFirst.on("click", function () {
      if (currentIndex === 0) {
        return;
      }
      if (autoMode) {
        setAutoMode(false);
      }
      showSlide(0, true);
    });

    // Klick auf den Button "Automatik pausieren"
    $btnToggleAuto.on("click", function () {
      setAutoMode(!autoMode);
    });

    // Direkt zu Bild 1–5 springen
    $jumpBtns.on("click", function () {
      // hole index vom datenattribut
      var dataIndex = $(this).attr("data-index");
      var index = parseInt(dataIndex, 10) - 1;

      // überprüfe ob index gültig ist
      if (index == currentIndex) {
        return;
      }
      if (index < 0) {
        return;
      }
      if (index >= slides.length) {
        return;
      }
      if (autoMode) {
        setAutoMode(false);
      }
      showSlide(index, true);
    });

    updateToggleLabel();
  });
})();

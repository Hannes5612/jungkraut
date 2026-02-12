// Bildgalerie (Carousel) - nur für die Startseite von jUNgKRAUT
// Es wird gezählt, wie viele Bilder der Benutzer betrachtet hat.
var piccount = 0;

// Defensive: Wenn jQuery (z. B. wegen CDN-Fehler) nicht geladen wurde,
// wird die JS-Galerie deaktiviert und die CSS-Variante sichtbar gelassen.
(function () {
  if (typeof window === "undefined" || typeof window.jQuery === "undefined") {
    console.warn(
      "[jUNgKRAUT] Galerie konnte nicht initialisiert werden, jQuery ist nicht verfügbar.",
    );
    try {
      var jsGallery = document.querySelector(".mission-gallery-js");
      var cssGallery = document.querySelector(".mission-gallery-css");
      if (jsGallery) {
        jsGallery.style.display = "none";
      }
      if (cssGallery) {
        cssGallery.style.display = "block";
      }
    } catch (e) {
      // Wenn auch das fehlschlägt, geschieht nichts weiter – die Seite bleibt nutzbar.
    }
    return;
  }

  var $ = window.jQuery;

  const INTERVAL_MS = 5000;
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

  function updateToggleLabel() {
    if (autoMode) {
      $btnToggleAuto.text("Automatik pausieren");
    } else {
      $btnToggleAuto.text("Automatik starten");
    }
  }

  function showSlide(newIndex, countView) {
    if (newIndex < 0 || newIndex >= slides.length) {
      return;
    }
    const slide = slides[newIndex];
    $image.attr("src", slide.src);
    $image.attr("alt", slide.alt);
    $image.attr("title", slide.alt);
    $caption.text(slide.caption);
    $current.text(newIndex + 1);
    $total.text(slides.length);

    if (countView && newIndex !== currentIndex) {
      piccount++;
    }
    currentIndex = newIndex;
  }

  function clearTimer() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

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

  function setAutoMode(enabled) {
    if (enabled === autoMode) {
      return;
    }
    autoMode = enabled;
    console.log("mode changed");
    if (autoMode) {
      startTimer();
    } else {
      clearTimer();
    }
    updateToggleLabel();
  }

  $(function () {
    if (!$image.length) {
      return;
    }

    if ($dialog.length) {
      $dialog.dialog({
        autoOpen: false,
        modal: true,
        width: 520,
        show: { effect: "fade", duration: 250 },
        hide: { effect: "fade", duration: 180 },
        classes: {
          "ui-dialog": "mission-dialog",
        },
      });

      $image.on("click keypress", function (event) {
        if (
          event.type === "click" ||
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          $dialogText.text(slides[currentIndex].description);
          $dialog.dialog("open");
        }
      });

      $image.attr("tabindex", "0");
      $image.attr("role", "button");
      $image.attr(
        "aria-label",
        "Bildbeschreibung anzeigen. Drücke Enter oder die Leertaste.",
      );
    }

    // Initial anzeigen, aber noch nicht als Betrachtung zählen
    showSlide(0, false);
    // Automatik starten
    startTimer();
    // CSS-only Galerie ausblenden
    $(".mission-gallery-css").hide();

    $btnPrev.on("click", function () {
      if (currentIndex === 0) {
        return;
      }
      if (autoMode) {
        setAutoMode(false);
      }
      showSlide(currentIndex - 1, true);
    });

    $btnNext.on("click", function () {
      if (currentIndex >= slides.length - 1) {
        return;
      }
      if (autoMode) {
        setAutoMode(false);
      }
      showSlide(currentIndex + 1, true);
    });

    $btnFirst.on("click", function () {
      if (currentIndex === 0) {
        return;
      }
      if (autoMode) {
        setAutoMode(false);
      }
      showSlide(0, true);
    });

    $btnToggleAuto.on("click", function () {
      setAutoMode(!autoMode);
    });

    updateToggleLabel();
  });
})();

// Bildgalerie (Carousel) - nur für die Startseite von jUNgKRAUT
// Es wird gezählt, wie viele Bilder der Benutzer betrachtet hat.
var piccount = 0;

(function ($) {
  const INTERVAL_MS = 4723;
  const slides = [
    {
      src: "media/images/carousel-loewenzahn.jpg",
      alt: "Löwenzahn, der verblüht auf einer Wiese wächst",
      caption:
        "Unsere Mission: Wissen über die Kräfte der Natur teilen und zeigen, wie sehr sie uns im Alltag stärkt.",
    },
    {
      src: "media/images/carousel-hand.jpg",
      alt: "Eine Hand im Grünen, auf die Wasser tröpfelt",
      caption:
        "Verbundenheit mit der Natur schafft Stärke und Verbindung.",
    },
    {
      src: "media/images/post3.jpg",
      alt: "Hände, die eine Pflanze mit einer Harke entfernen",
      caption:
        "Vorurteile an der Wurzel packen – statt vorschnell zu rupfen, fragen wir nach den Geschichten dahinter.",
    },
    {
      src: "media/images/carousel-city.jpg",
      alt: "Begrünte Stadtfassaden der Zukunft",
      caption:
        "Wir träumen von Städten, in denen Wildwuchs nicht bekämpft, sondern als Klimaretter gefeiert wird.",
    },
    {
      src: "media/images/carousel-soup.jpg",
      alt: "Grüne Suppe mit Croutons",
      caption:
        "Von der Wiese auf den Teller: jUNgKRAUT verbindet Naturwissen mit alltagstauglichen Inspirationen.",
    },
  ];

  let currentIndex = 0;
  let autoMode = true;
  let timerId = null;

  const $image = $("#gallery-image");
  const $caption = $("#gallery-caption");
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

    // Initial anzeigen, aber noch nicht als Betrachtung zählen
    showSlide(0, false);
    // Automatik starten
    startTimer();

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
})(jQuery);


// Drag & Drop Spiel: Löwenzahn in den Korb ziehen
// Defensive: Wenn jQuery oder jQuery UI nicht verfügbar sind (z. B. CDN-Fehler),
// wird das Spiel ausgeblendet und der statische Hinweis angezeigt.
(function () {
  if (
    typeof window === "undefined" ||
    typeof window.jQuery === "undefined" ||
    !window.jQuery.ui ||
    !window.jQuery.ui.draggable ||
    !window.jQuery.ui.droppable
  ) {
    console.warn(
      "[jUNgKRAUT] Drag-&-Drop-Spiel konnte nicht initialisiert werden, jQuery oder jQuery UI fehlt.",
    );
    try {
      var gameField = document.querySelector(".dandelion-game-field");
      var noscriptHint = document.querySelector(".dandelion-game-noscript");
      if (gameField) {
        gameField.style.display = "none";
      }
      if (noscriptHint) {
        noscriptHint.style.display = "block";
        noscriptHint.innerHTML =
          "<p>Das Drag-&-Drop-Spiel konnte leider nicht geladen werden, da hierfür die Bibliothek jQuery benötigt wird. Bitte prüfen Sie Ihre Internetverbindung oder laden Sie die Seite erneut.<p>";
      }
    } catch (e) {
      // Wenn das auch fehlschlägt, bleibt einfach der aktuelle Zustand erhalten.
    }
    return;
  }

  var jQ = window.jQuery;
  jQ.noConflict();

  jQ(function () {
    var $draggables = jQ(".dandelion-draggable");
    var $basket = jQ("#dandelion-basket");
    var $count = jQ("#dandelion-count");
    var collected = 0;

    if (!$draggables.length || !$basket.length) {
      return;
    }

    $draggables.draggable({
      revert: "invalid",
      containment: ".dandelion-game-field",
      helper: "original",
      cancel: false, // Buttons trotzdem draggable machen
      start: function () {
        jQ(this).addClass("is-dragging");
      },
      stop: function () {
        jQ(this).removeClass("is-dragging");
      },
    });

    $basket.droppable({
      hoverClass: "dandelion-basket-hover",
      drop: function (event, ui) {
        var $original = ui.draggable;
        if ($original.hasClass("dandelion-collected")) {
          return;
        }
        $original.addClass("dandelion-collected").fadeTo(200, 0.15);
        collected += 1;
        $count.text(collected);

        jQ(this)
          .addClass("dandelion-basket-full")
          .find("#dandelion-basket-text")
          .fadeOut(100, function () {
            var msg =
              collected >= $draggables.length
                ? "Alle Löwenzähne sind im Korb – gar nicht so nutzlos, oder?"
                : "Weiter so – noch ein paar Löwenzähne warten auf dich!";
            jQ(this).text(msg).fadeIn(150);
          });
      },
    });
  });
})();
// Drag & Drop Spiel: Löwenzahn in den Korb ziehen
jQuery.noConflict();
jQuery(function () {
  var $draggables = jQuery(".dandelion-draggable");
  var $basket = jQuery("#dandelion-basket");
  var $count = jQuery("#dandelion-count");
  var collected = 0;

  if (!$draggables.length || !$basket.length) {
    return;
  }

  $draggables.draggable({
    revert: "invalid",
    containment: ".dandelion-game-field",
    helper: "original",
    cancel: false, // Buttons trotzdem draggable machen
    start: function () {
      jQuery(this).addClass("is-dragging");
    },
    stop: function () {
      jQuery(this).removeClass("is-dragging");
    },
  });

  $basket.droppable({
    hoverClass: "dandelion-basket-hover",
    drop: function (event, ui) {
      var $original = ui.draggable;
      if ($original.hasClass("dandelion-collected")) {
        return;
      }
      $original.addClass("dandelion-collected").fadeTo(200, 0.15);
      collected += 1;
      $count.text(collected);

      jQuery(this)
        .addClass("dandelion-basket-full")
        .find("#dandelion-basket-text")
        .fadeOut(100, function () {
          var msg =
            collected >= $draggables.length
              ? "Alle Löwenzähne sind im Korb – gar nicht so nutzlos, oder?"
              : "Weiter so – noch ein paar Löwenzähne warten auf dich!";
          jQuery(this).text(msg).fadeIn(150);
        });
    },
  });
});

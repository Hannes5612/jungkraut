// Drag & Drop Spiel: Löwenzahn in den Korb ziehen

// Defensive: Wenn jQuery nicht verfügbar, wird das Spiel ausgeblendet und der statische Hinweis angezeigt.
(function () {
  if (
    typeof window === "undefined" ||
    typeof window.jQuery === "undefined" ||
    !window.jQuery.ui ||
    !window.jQuery.ui.draggable ||
    !window.jQuery.ui.droppable
  ) {
    console.warn(
      "[jUNgKRAUT] Drag&Drop-Spiel konnte nicht initialisiert werden, jQuery oder jQuery UI fehlt.", 
    );

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

    return;
  }

  // jQuery initialisieren
  var jQ = window.jQuery;
  jQ.noConflict();

  // Drag & Drop Spiel initialisieren
  jQ(function () {
    let $draggables = jQ(".dandelion-draggable");
    let $weedSpots = jQ(".weed-spot");
    let $basket = jQ("#dandelion-basket");
    let $count = jQ("#dandelion-count");
    let collected = 0;

    if (!$draggables.length || !$basket.length) {
      return;
    }

    // Tooltip-Texte setzen: Welche Elemente sollen bewegt werden?
    $draggables.attr("title", "Diesen Löwenzahn kannst du in den Korb ziehen.");
    $weedSpots
      .not(".dandelion-draggable")
      .attr("title", "Lass mich lieber in der Wiese, ich bleibe hier.");

    // jQuery UI Tooltip aktivieren
    $weedSpots.tooltip({
      track: true,
      show: { effect: "fadeIn", duration: 150 },
      hide: { effect: "fadeOut", duration: 100 },
    });

    // Eigenschaften der draggable Elemente setzen
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

    // Eigenschaften der droppable Elemente setzen
    $basket.droppable({
      hoverClass: "dandelion-basket-hover",
      drop: function (event, ui) {
        var $original = ui.draggable;
        if ($original.hasClass("dandelion-collected")) {
          return;
        }
        // Tooltip für eingesammelten Löwenzahn entfernen
        $original
          .tooltip("destroy")
          .removeAttr("title")
          .addClass("dandelion-collected")
          .fadeTo(200, 0.15);
        collected += 1;
        $count.text(collected);

        jQ(this)
          .addClass("dandelion-basket-full")
          .find("#dandelion-basket-text-running")
          .fadeOut(100, function () {
            let msg;
              if (collected >= $draggables.length) {
                msg = "Alle Löwenzähne sind im Korb! Gar nicht so nutzlos, oder?";
              } else {
                msg = "Weiter so, noch ein paar Löwenzähne warten auf dich!";
              }
            jQ(this).text(msg).fadeIn(150);
          });
      },
    });
  });
})();

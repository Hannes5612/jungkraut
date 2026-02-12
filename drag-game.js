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


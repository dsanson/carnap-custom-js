// A script to make metavariable "boxes" and "circles"
// into live editable and "linked".
//
// For example:
//
// :::liveshapes
//   []{.P} → []{.Q}
//   []{.P}
//   ∴ []{.Q}
// :::
//
// Requires separate CSS to style the "boxes" and "circles".
//

export function makeShapesLive() {
  function initShape(shape) {
    $('.liveshapes').find(shape).each(function() {
        $(this).attr('contenteditable',true);
        $(this).keyup(function() {
          content = $(this).html();
          if ( $(this).attr('data-to') ) {
            filter = shape + '[data-to=' + $(this).attr('data-to') + ']';
            $(this).parents('.liveshapes').find(filter).not($(this)).html(content);
          }
          else {
            $(this).parents('.liveshapes').find(shape).not('[data-to]').not($(this)).html(content);
          }
        })
    })
  }

  const shapes = ['.A','.B','.C','.P','.Q','.R','.S'];
  shapes.forEach(initShape);
}

$(document).ready(makeShapesLive);

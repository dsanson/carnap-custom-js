/* eslint-env jquery */
// fix the hover dropdown menus for ios

function mobileHover () {
  $('*').on('touchstart', function () {
    $(this).trigger('hover');
  }).on('touchend', function () {
    $(this).trigger('hover');
  });
}

$(document).ready(function() {                                                                          
  mobileHover();
});

// Several classes that can be revealed by clicking.
//
// I use these to give students the ability to reveal "spoilers"
// or "hints", or toggle cheat sheets.


function initSpoiler() {
  $('.spoiler').click(function() { 
    $(this).children().css('visibility','visible') 
  })

  $('.hint').click(function() { 
    $(this).children().css('visibility','visible') 
  })

  $('.hideable').click(function() {
    $(this).children().toggle();
    $(this).toggleClass('shown');
  })
}

$(document).ready(initSpoiler);


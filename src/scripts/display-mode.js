// "Display Mode" for demonstrating solutions to exercises.
//
// In its current mode, only works for instructors. Provides
// a "display mode" that hides everything but the exercise,
// and centers the exerise on the page. 
//
// Also hides the exercise number, since I use this for creating screencast videos,
// demonstrating solutions, and I want to be able to use the same
// videos even if I change the exercise numbers in the future.
//
// Also provides keyboard shortcuts for easily jumping between exercises.
//
// To use keyboard shortcuts, an exercise div must be focused.
//
//  ctrl-<period>: toggles display mode
//  ctrl-w: toggles "wide" display mode
//  ctrl-n: jump to next exercise (works in display mode and in regular mode)
//  ctrl-p: jump to previous exercise (works in display mode and in regular mode)
//

function addDisplayMode() {                                                                            
  
  // check to see if user is logged in as instructor
  //   if there are more than 2 dropdown items in the navbar,
  //   then user is an instructor
  const dropdown = $('#navbar > ul > li:last-child ul')[0].children.length
  if (dropdown < 3) {
    return
  }

  $('.exercise').attr('tabindex',0)
  
  // key strokes only work when an exercise div
  // is focused:
  //   to toggle display mode: ctrl-.
  //   to toggle wide mode: ctrl-w
  const tog_disp = 190 //ctrl-.
  const tog_wide = 87 //ctrl-w
  const next_ex = 78 //ctrl-n
  const prev_ex = 80 //ctrl-p

  $('.exercise').on('keydown', function(event) {
    if (event.which == tog_disp && event.ctrlKey) { 
      if ($(this).parent().hasClass('backdrop')) {
        $(this).unwrap();
      } 
      else {
        $(this).wrap('<div class=backdrop tabindex=0></div>');
        $('.backdrop').on('keydown', function(event) {
          console.log(event.which)
          if (event.which == tog_disp && event.ctrlKey) { 
            $(this).children().each( function() {
              $(this).unwrap();
              $(this).toggleClass('demo');
              $('hypothesis-sidebar').toggle();
            });
          }
          else if (event.which == tog_wide && event.ctrlKey) {
            $(this).children().toggleClass('wide');
          }
        });
      }

      $(this).toggleClass('demo');
      $('hypothesis-sidebar').toggle();

      $(this).focus();
      $(this).find('.output > textarea').first().focus();
      $(this).find('.input').first().focus();
    } 
    else if (event.which == next_ex && event.ctrlKey) {
      next_exercise = $('.exercise').eq( $('.exercise').index( $(this) ) + 1 )
      next_exercise.get(0).scrollIntoView({behavior: "smooth", block: "center"});

      if ($(this).parent().hasClass('backdrop')) {
        $(this).unwrap();
        $(this).toggleClass('demo')
        next_exercise.wrap('<div class=backdrop tabindex=0></div>');
        $('.backdrop').on('keydown', function(event) {
          //console.log(event.which)
          if (event.which == tog_disp && event.ctrlKey) { 
            $(this).children().each( function() {
              $(this).unwrap();
              $(this).toggleClass('demo');
              $('hypothesis-sidebar').toggle();
            });
          }
          else if (event.which == tog_wide && event.ctrlKey) {
            $(this).children().toggleClass('wide');
          }
        });
        next_exercise.toggleClass('demo');
        if ($(this).hasClass('wide')) {
          next_exercise.addClass('wide')
        }
      } 
      
      next_exercise.focus();
      next_exercise.find('.output > textarea').first().focus();
      next_exercise.find('.input').first().focus();
    }
    else if (event.which == prev_ex && event.ctrlKey) {
      next_exercise = $('.exercise').eq( $('.exercise').index( $(this) ) - 1 )
      next_exercise.get(0).scrollIntoView({behavior: "smooth", block: "center"});

      if ($(this).parent().hasClass('backdrop')) {
        $(this).unwrap();
        $(this).toggleClass('demo')
        next_exercise.wrap('<div class=backdrop tabindex=0></div>');
        $('.backdrop').on('keydown', function(event) {
          console.log(event.which)
          if (event.which == tog_disp && event.ctrlKey) { 
            $(this).children().each( function() {
              $(this).unwrap();
              $(this).toggleClass('demo');
              $('hypothesis-sidebar').toggle();
            });
          }
          else if (event.which == tog_wide && event.ctrlKey) {
            $(this).children().toggleClass('wide');
          }
        });
        next_exercise.toggleClass('demo');
        if ($(this).hasClass('wide')) {
          next_exercise.addClass('wide')
        }
      } 
      
      next_exercise.focus();
      next_exercise.find('.output > textarea').first().focus();
      next_exercise.find('.input').first().focus();
    }

  });

}

$(document).ready(function() {                                                                          
    addDisplayMode();
});

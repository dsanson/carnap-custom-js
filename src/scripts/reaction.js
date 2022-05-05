// Provide feedback in reaction to Carnap exercise checking and submission

function register_events() {
  
  $('.exercise').on('exercise-failure', function() {

    let exercise = $(this).attr('data-carnap-label')
   
    // hide all elements with 'reaction' class for this exercise
    $('.reaction[data-ex="' + exercise + '"]').hide()
    
    // reveal elements with 'reaction' and 'incorrect', and no 'data-ans' attributes
    $('.reaction.incorrect[data-ex="' + exercise + '"]:not([data-ans]').show()

    // reveal elements with data-ans attributes
    let ex_div = $(this).find('div[data-carnap-type]')
    let ex_type = ex_div.attr('data-carnap-type')
    if ( ex_div.attr('data-carnap-type') == 'qualitative' ) {
      let inputs = ex_div.find('input')
      let selector = ""
      inputs.each(function(index) {
        if ( $(this).prop('checked') ) {
          selector = selector + index
        }
      })
      $('.reaction.incorrect[data-ex="' + exercise + '"][data-ans~="' + selector + '"').show()
    }
  })

  $('.exercise').on('exercise-success', function() {
    exercise = $(this).attr('data-carnap-label')
    $('.reaction.correct[data-ex="' + exercise + '"]').show()
  })
}

$(document).ready(function() {
  register_events()
});


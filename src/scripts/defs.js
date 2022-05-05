// A simple script that compiles a list of elements with the class 'def'
// and uses them to populate any div with the class 'defs'.
//
// I use this to provide a summary of definitions of key terms at the end
// of each chapter of my book.

function generate_definition_list() {

  let definition_list = $('<dl/>')
  
  $('.def').each(function() {

    let definition_item = $('<dd/>')
    definition_item.append($(this))

    let terms_item = $('<dt/>')
    let terms = $(this).find('.vocab')
    terms.each(function() {
      terms_item.append($(this).clone()) 
    })

    definition_list.append(terms_item)
    definition_list.append(definition_item)
  })

  $('.defs').append(definition_list)  

}

$(document).ready(function() {
  generate_definition_list()
});



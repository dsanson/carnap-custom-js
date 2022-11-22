// A simple script that compiles a list of elements with the class 'def'
// and uses them to populate any div with the class 'defs'.
//
// I use this to provide a summary of definitions of key terms at the end
// of each chapter of my book.

import * as utils from './utils.js'

function generate_definition_list() {
  // create a new empty definition list
  let definition_list = $('<dl/>')

  // loop over each definition 
  $('.def').each(function(index) {

    // add a unique id to the definition
    $(this).attr('id','definition-' + index)
    
    // create a definition description... 
    let definition_description = $('<dd/>')
    // ...and insert the content of definition 
    definition_description.append($(this).clone())

    // create a definition term...
    let terms_item = $('<dt/>')
    // extract all defined terms... 
    let terms = $(this).find('.vocab').get().map(function(v) {
      return v.outerHTML
    })
    // ...into a comma delimited list...
    let terms_list = terms.join(', ')
    // ...and create a new link...
    let terms_link = $('<a/>')
    // ...and add a link back...
    terms_link.attr('href','#definition-' + index)
    // ...and link should scroll definition to center of page...
    terms_link.click( function(e) {
      e.preventDefault()
      let id = ($(this).attr('href').split('#')[1])
      utils.scrollToView(id)
    })
    // ...and append terms list to terms link
    terms_link.append(terms_list)
    // ...and add to the definition term
    terms_item.append(terms_link)

    // append the definition term and definition description to the defintion list
    definition_list.append(terms_item)
    definition_list.append(definition_description)
  })
  
  // append the definition list to the defs element
  $('.defs').append(definition_list)  

}

$(document).ready(function() {
  generate_definition_list()
});



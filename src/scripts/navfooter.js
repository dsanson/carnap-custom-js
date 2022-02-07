// Add easy navigation links to the bottom of the page
//
// This script assumes you are using my course assignment
// naming scheme and structure.

function getPrevious(unit,type) {
  if ( type == 'R' ) {
    unit = String(parseInt(unit) - 1).padStart(2,'0')
    type = 'M'
  } else if ( type == 'E' ) {
    type = 'R'
  } else if ( type == 'M' ) {
    type = 'E'
  } else if ( type == 'S' ) {
    type = 'M'
  }

  if ( unit < 0 || type == 'o') {
    return false
  } else {
   return unit + type
  }
}

function getNext(unit,type) {
  if ( type == 'R' ) {
    type = 'E'
  } else if ( type == 'E' ) {
    type = 'M'
  } else if ( type == 'M' || type == 'S' ) {
    type = 'R'
    unit = String(parseInt(unit) + 1).padStart(2,'0')
  }

  if ( unit == 19 ) {
    return false
  } else if ( type == 'o' ) {
    return '00R'
  } else {
   return unit + type
  }
}

function addNavFooter() {
  let url = document.location.pathname.split('/')
  let assn = url.slice(-1)[0]
  let unit = assn.slice(0,2)
  let type = assn.slice(2,3)
  let version = ''
  console.log(assn)
  if ( assn.includes('_') ) {
    version = assn.slice(-4)
  }
  let prev = getPrevious(unit,type)
  let next = getNext(unit,type)

  let navfooter = $('<div class="navfooter"/>')
  let navfooterul = $('<ul/>')

  if (prev) { 
    prev = prev + version
    navfooterul.append(`<li><a href="${prev}">← Previous</a></li>`)
  }
  if ( type != 'o' ) {
    navfooterul.append(`<li><a href="Book${version}">Contents</a></li>`)
  }
  if (next) {
    next = next + version
    navfooterul.append(`<li><a href="${next}">Next →</a></li>`)
  }
  navfooter.append(navfooterul)
  $('#main').append(navfooter)
}

$(document).ready(function() {                                                                          
    addNavFooter()
});

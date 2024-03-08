// Persistent table of contents across all pages
//
// This script grabs a div with the id 'tableofcontents' from my "Book" on Carnap,
// and adds it as a drop down menu of links, under the "Book" link.
//
// It also does some filtering, disabling links with the "disabled" class (I use when I have not
// yet uploaded a given chapter or set of exercises).
//
// It also filters out links with the class 'enrolled', when the page is viewed as a "Shared"
// document rather than an assignment. (I use this to remove links to tests from publically 
// shared versions of my book.)


import * as utils from './utils.js'
import * as courseConfig from './course-config.js'

function buildTOC(config) {
  const current = document.location.pathname.split('/').slice(-1)[0]
  const sections = config.contents.sections
  const pages = config.contents.pages
  const toc = $('<ul>').addClass('toc')
  sections.map( s => {
    let label = ""
    if ( s.hasOwnProperty('label') ) {
      label = s.label
    }
    let title = `${label} ${s.title}`
    const sec = $(`<li>${title}</li>`)
    const chs = $('<ul>')
    pages.filter( p => p.section == s.title ).map( p => {
      let label = ""
      if ( p.hasOwnProperty('label') ) {
        label = p.label
      }
      let title = `${label} ${p.title}`
      if ( p.enabled ) {
        title = `<a href="${config.course.base_url}/${p.url}">${title}</a>`
      }
      const pag = $(`<li>${title}</li>`)
      const dates = $('<span class="dates">')
      if ( p.hasOwnProperty('start-date') ) {
        let start = $(`<span class="start-date">Start by ${p["start-date"].toLocaleDateString()}</span>`)
        dates.append(start)
      }
      if ( p.hasOwnProperty('expiration-date') ) {
        let exp = $(`<span class="expiration-date">Expires on ${p["expiration-date"].toLocaleDateString()}</span>`)
        dates.append('; ')
        dates.append(exp)
      }
      pag.append(dates)

      if ( current == p.url ) {
        pag.addClass('currentpage')

      }
      chs.append(pag)
    })
    sec.append(chs)
    toc.append(sec)
  })
  return toc 
}

async function dropDown(toc) {
  const doc_contents = $.map($('h2:not(.cover h2)'), v => `<li style="font-size:smaller"><a href="#${v.id}">${v.textContent}</a></li>`)
  const doc_ul = $('<ul>').append(doc_contents)
  toc.find('.currentpage').append(doc_ul)
  toc.appendTo('nav#navbar .book.dropdown')
}

async function initTOC() {
  const config = await courseConfig.config
  const toc = buildTOC(config) 
  $('#tableofcontents').html(toc)
  dropDown(toc.clone())
}

$(document).ready(function() {                                                                          
    initTOC();
});

// Customize the navigation bar on Carnap
//
// Adds links to the navigation bar menu
// 
// These links are likely to be course specific. For example,
// I add links to my course CMS, a course Discord server, and course
// Zoom links. So values are read from the "links" object inside the
// current course, in config.json.

import config from '../config.json';

function customizeNavbar() {                                                                            

  const bookicon = '<i class="bi bi-book"></i>';
  $('nav#navbar > ul > li:nth-child(3) > a').html(bookicon);
  $('nav#navbar > ul > li:nth-child(3)').addClass('book dropdown');

  let url = document.location.pathname.split('/')
  if ( url.slice(-3)[0] == "shared" ) {
    let assn = url.slice(-1)[0]
    let version = ''
    if ( assn.includes('_')) {
      let version = assn.slice(-4)
    }
    $('nav#navbar > ul > li:nth-child(3) > a').attr('href','Book' + version);

    return // no special links if not an assigned page
  }
  
  const linkargs = 'target="_blank" rel="noopener noreferrer"'
  
  // individual course settings
  let course = url.slice(-2)[0]

  let links = config[course].links

  for (const link of links) {
    // if no icon, use name 
    if (typeof link.icon === 'undefined') {
      link.icon = link.name
    }
   
    // if url, make icon a link
    if (typeof link.url !== 'undefined') {
      link.icon = `<a href="${link.url}" ${linkargs} >${link.icon}</a>\n`
    }

    let li

    if (typeof link.links !== 'undefined') {
      li  = $(`<li class='dropdown ${link.name}'>${link.icon}</li>`)
      let ul = $('<ul/>')
      const keys = Object.keys(link.links)   
      keys.forEach((key,index) => {
        ul.append(`<li><a href="${link.links[key]}" ${linkargs} >${key}</a></li>`)
      })
      li.append(ul)
    } else {
      li = $(`<li>${link.icon}</li>`)
    }

    $('nav#navbar > ul > li:nth-child(3)').before(li)
  }

} 


$(document).ready(function() {                                                                          
    customizeNavbar()
});

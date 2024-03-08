// Customize the navigation bar on Carnap
//
// Adds links to the navigation bar menu
// 
// These links are likely to be course specific. For example,
// I add links to my course CMS, a course Discord server, and course
// Zoom links. So values are read from the "links" object inside the
// current course config.json.

import * as courseConfig from './course-config.js'

async function customizeNavbar() {                                                                            

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

  // add a light/dark theme switch
  let theme = localStorage.getItem('theme')
  if ( theme === null ) {
    theme = "auto"
  }
  $('html').attr('data-theme', theme)

  let themeswitch = $(`<li class="themeswitch ${theme}">${theme}<br>mode</li>`);
  themeswitch.click(function() {
    let current = $(this).html().replace(/<.*/,'')
    if ( current == 'auto' ) {
      $(this).html('dark<br>mode')
      $(this).removeClass('auto')
      $(this).addClass('dark')
      $('html').attr('data-theme','dark')
      localStorage.setItem('theme','dark')
    } else if ( current == 'dark' ) {
      $(this).html('light<br>mode')
      $(this).removeClass('dark')
      $(this).addClass('light')
      $('html').attr('data-theme','light')
      localStorage.setItem('theme','light')
    } else {
      $(this).html('auto<br>mode')
      $(this).removeClass('light')
      $(this).addClass('auto')
      $('html').attr('data-theme','')
      localStorage.removeItem('theme')
    }
  });
  $('nav#navbar > ul > li:nth-child(3)').before(themeswitch)

  // add links
  
  // course links are defined in the global config file
  const config = await courseConfig.config
  const links = config.course.links
  for (const link of links) {
    // if no icon, use name 
    if (typeof link.icon === 'undefined') {
      link.icon = link.name
    }
    let linkargs = ''
    if ( link.external ) {
      linkargs = 'target="_blank" rel="noopener noreferrer"'
    }
   
    // if url, make icon a link
    if (typeof link.url !== 'undefined') {
      link.icon = `<a href="${link.url}" ${linkargs} >${link.icon}</a>\n`
    }

    let li

    if (typeof link.links !== 'undefined') {
      li  = $(`<li class="dropdown custom ${link.name}">${link.icon}</li>`)
      let ul = $('<ul/>')
      const keys = Object.keys(link.links)   
      keys.forEach((key,index) => {
        ul.append(`<li class="custom ${link.name}"><a href="${link.links[key]}" ${linkargs} >${key}</a></li>`)
      })
      li.append(ul)
    } else {
      li = $(`<li>${link.icon}</li>`)
    }

    $('nav#navbar > ul > li:nth-child(3)').after(li)
  }

} 

document.addEventListener("DOMContentLoaded", function(){
  customizeNavbar()
})

// $(document).ready(function() {                                                                          
//     customizeNavbar()
// });

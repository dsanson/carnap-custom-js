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


function tableOfContents() {                                                                            

    const current = document.location.pathname.split('/').slice(-1)[0]
    const course = document.location.pathname.split('/').slice(-2)[0]
    
    let version = ''
    if ( current.includes('-') ) {
      version = current.slice(-9,-5)
    } else if ( current.includes('_') ) {
      version = current.slice(-4)
    }
    else if ( course == 'ISU_112_FALL_2022' ) {
      version = '_f22'
    }
    const book = 'Book' + version

    // const menu_icon = '☰';
    // const menu_button = '<div class="toc_button">' + menu_icon + '</div>';

    let toc_ul = $('<ul></ul>')

    toc_ul.load(book + ' #tableofcontents > ul,ol', function() {

      $('a.disabled').removeAttr("href");

      try {
        if (typeof CarnapServerAPI.user !== 'undefined') {
          $('.book.dropdown a.no-link').removeAttr("href");
          $('#tableofcontents a.no-link').removeAttr("href");
        }
      } catch {
        $('.book.dropdown .enrolled').parent().remove()
        $('#tableofcontents .enrolled').parent().remove()
      }

    });

    // $(toc_ul).appendTo(toc);
    // $(menu_button).prependTo(toc);
    // $('nav#navbar > ul > li:nth-child(3)').before(toc);
    
    $(toc_ul).appendTo('nav#navbar .book.dropdown');
}   


$(document).ready(function() {                                                                          
    tableOfContents();
});

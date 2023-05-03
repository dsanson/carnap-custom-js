/* eslint-env jquery */
// Copy anchor links on click

function initAnchorLinks() {
  $('.anchor').on("click", function(e){
    e.preventDefault();
    navigator.clipboard.writeText($(this).prop('href'))
  }) 
}

document.addEventListener("carnap-loaded", initAnchorLinks)

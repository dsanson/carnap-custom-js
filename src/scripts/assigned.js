// Adds the class 'shared' or 'assignments' to the body element of the
// page.
//
// This makes it possible for CSS to target just assignments, or just 
// shared documents.
//

function addAssignmentStatus() {
 
  console.log('assigning status')

  // state should either be 'shared' or 'assignments'
  const state = window.location.pathname.split('/')[1]
  $('body').addClass(state)

  const doc =  window.location.pathname.split('/').slice(-1)[0];
  $('body').addClass('_' + doc)

}

$(document).ready(function() {                                                                          
    addAssignmentStatus()
});

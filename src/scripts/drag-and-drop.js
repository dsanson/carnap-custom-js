/* eslint-env jquery */
/* global CarnapServerAPI */
// a script that enables some simple drag-and-drop exercises.
//
// 1.  drag and drop sentences from a passage into standard form
// 2.  drag and drop parts of sentences into a logical form
//
//
// design notes:
//
// -   designate classes for elements that are draggable.
// -   designate classes for container elements to be dragged into.
// -   use classes (?) for checking correctness: e.g., 'premise' class needs to be dragged into 'premise' container
//     -    needs to be flexible enough to allow premises in whatever order
//     -    needs to be specific enough to allow multiple antecedents that are not interchangeable
//     -    do I want something that doesn't just reveal the answers upon DOM inspection?
// -   how does this get registered with carnap as an exercise?
//


function dragdrop() {
  // 
}

$(document).ready(function() {                                                                          
    dragdrop()
});

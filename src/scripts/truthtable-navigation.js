// Enable the use of arrows to navigate truth tables

function moveRight() {
  $(this).parent().nextAll().has('select').children().first().focus()
}

function moveLeft() {
  $(this).parent().prevAll().has('select').children().first().focus()
}

function moveDown() {
  position = $(this).parent().index()
  $(this).parent().parent('tr').next().children().eq(position).has('select').children().first().focus()
}

function moveUp() {
  position = $(this).parent().index()
  $(this).parent().parent('tr').prev().children().eq(position).has('select').children().first().focus()
}

function enableTruthtableArrowKeys() {

  const leftarrow = 37
  const uparrow = 38
  const rightarrow = 39
  const downarrow = 40

  $('[data-carnap-type="truthtable"] td select').on('keydown', function(event) {
    switch (event.which) {
      case leftarrow:
        event.preventDefault()
        moveLeft.apply($(this))
        break
      case uparrow:
        event.preventDefault()
        moveUp.apply($(this))
        break
      case rightarrow:
        event.preventDefault()
        moveRight.apply($(this)) 
        break
      case downarrow:
        event.preventDefault()
        moveDown.apply($(this))
        break
      }
  })
}

$(document).ready(function() {                                                                          
    enableTruthtableArrowKeys()
});

// {
//     e.preventDefault();
//     switch(e.keyCode)
//     {
//       case 37 : var first_cell = $(this).index();
//                 if(first_cell==0)
//                 {
//                   $(this).parent().prev().children("td:last-child").focus();
//                 }
//                 else
//                   $(this).prev("td").focus();break;//left arrow
//       case 39 : var last_cell=$(this).index();
//                 if(last_cell==cell-1)
//                 {
//                   $(this).parent().next().children("td").eq(0).focus();
//                 }
//                 $(this).next("td").focus();break;//right arrow
//       case 40 : var child_cell = $(this).index();	
//                 $(this).parent().next().children("td").eq(child_cell).focus();break;//down arrow
//       case 38 : var parent_cell = $(this).index();
//                 $(this).parent().prev().children("td").eq(parent_cell).focus();break;//up arrow
//     }
//
//     if(e.keyCode==113)
//     {
//         $(this).children().focus();
//     }
// });

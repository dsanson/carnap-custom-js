// Keyboard navigation for truth tables
//
// Movement using arrow keys, HJKL, or WASD.
//
// Delete (i.e., select '-') using delete or backspace

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

  const leftvim = 72 //h
  const upvim = 75 //k
  const rightvim = 76 //l
  const downvim = 74 //j

  const leftwasd = 65 //a 
  const upwasd = 87 //w
  const rightwasd = 68 //d
  const downwasd = 83 //s

  const backspace = 8 
  const deletekey = 46

  $('[data-carnap-type="truthtable"] td select').on('keydown', function(event) {

    switch (event.which) {
      case leftarrow:
      case leftvim:
      case leftwasd:
        event.preventDefault()
        moveLeft.apply($(this))
        break
      case uparrow:
      case upvim:
      case upwasd:
        event.preventDefault()
        moveUp.apply($(this))
        break
      case rightarrow:
      case rightvim:
      case rightwasd:
        event.preventDefault()
        moveRight.apply($(this)) 
        break
      case downarrow:
      case downvim:
      case downwasd:
        event.preventDefault()
        moveDown.apply($(this))
        break
      case backspace:
      case deletekey:
        event.preventDefault()
        $(this).children().eq(0).prop('selected',true)
        break
      }
  })
}

$(document).ready(function() {                                                                          
    enableTruthtableArrowKeys()
});


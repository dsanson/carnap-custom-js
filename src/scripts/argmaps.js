// Initializes argument maps for use with reasons.
// 
//



function initializeArgumentMaps() {

  let maps = {}
  let mapsRender = {}
  let n = 1

  let encodedMaps = {}
  try {
    encodedMaps = JSON.parse(localStorage.getItem('argmaps'))
  } catch(err) {
    console.log(err)
  }

  function decorate(id,map) {
    
    function reset(id) {
      encodedMaps = JSON.parse(localStorage.getItem('argmaps'))
      encodedMaps[id] = null
      localStorage.setItem('argmaps', encodedMaps)
      location.reload()
    }

    $('#' + id).before(`<a onclick=reset(${id})>reset</a>`)

  }

  $('.argmap').each( function() {
 
    // if the element does not have an ID, we create one.
    if ( ! $(this)[0].hasAttribute('id') ) {
       $(this).attr('id','argmap' + n)
       n = n + 1
    }
    const id = $(this).attr('id')
  
    const defaultGraph = [
          {id: "p1", text: "Double click me to edit", y: 100},
          {id: "c1", text: "Drag me onto the other", y: 200}
        ]

    let graph = defaultGraph

    if ( id in encodedMaps ) {
      graph = encodedMaps[id]
    } else {
      try {
         graph = $(this).attr('data-graph')
         graph = JSON.parse(graph)
      } catch(err) {
         console.log(err)
      }
    }

    maps[id] = Reasons.mapper('#' + id)
    mapsRender[id] = maps[id].render(graph)
    //decorate(id, maps[id])
  })
  
  return mapsRender

}

function initializeAutosaveMaps(mapsRender) {
 
  setInterval(function () {
    let encodedMaps = {}
    for (const id of Object.keys(mapsRender)) {
      encodedMaps[id] = mapsRender[id]["export"]()
    }
    localStorage.setItem('argmaps', JSON.stringify(encodedMaps))
  }, 2000)

}

$(document).ready(function() {                                                                          
  if (document.querySelector('.argmap') !== null) {
    let mapsRender = initializeArgumentMaps()
    initializeAutosaveMaps(mapsRender)    
  }
});

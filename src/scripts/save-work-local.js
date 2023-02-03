/* eslint-env jquery */
/* global AssignmentState, putAssignmentState, document, window */
// save_work.js
// A script to save student work on Carnap.io
//
// -   saves work to localStorage.
// -   doesn't work for truth tables, syntax problems, sequent calculus problems, or gentzen-prawtiz deductions
// -   buggy

function initSaveWork() {
  const debug = false;
  
  // get the assignment name
  a = location.pathname.split('/').slice(-1)[0]
  const namespace = 'saved-work-' + a;

  let items = new Object();
  let ids = []; // a list for tracking duplicate ids
  let firstload = true;

  if (debug) console.log('save-work-local.js debugging on')

  function getId($exercise) {

    let l = $exercise.parent().attr('data-carnap-label')
    let t = $exercise.attr('data-carnap-type')
    // qualitative problems come in many types
    if (t == 'qualitative') {
      t = $exercise.attr('data-carnap-qualitativetype')
    }

    // shorten type to use as label
    if (t == 'proofchecker') t = '-pr'
    if (t == 'truthtable') t = '-tt'
    if (t == 'countermodeler') t = '-cm'
    if (t == 'multiplechoice') t = '-mc'
    if (t == 'multipleselection') t = '-ms'
    if (t == 'shortanswer') t = '-sa'
    if (t == 'numerical') t = '-nu'
    if (t == 'translate') t = '-tr'
    
    let id = l + t 
    
    n = 0
    while ( ids.includes(id) ) {
      n = n + 1;
      id = id + '-' + n.toString();
    }
    ids.push(id);

    return id;
  }

  function saveSimple($exercise, workdiv) {
      const exerciseId = getId($exercise);
      const studentWork = $exercise.find(workdiv).val();
      items[exerciseId] = studentWork;
      if (debug) console.log('Saving ' + exerciseId + ': ' + studentWork);
  }

  function saveArray($exercise, workdiv) {
      const exerciseId = getId($exercise);
      items[exerciseId] = [];
      $exercise.find(workdiv).each(function () {
        items[exerciseId].push($(this).val());
      });
      if (debug) console.log('Saving ' + exerciseId + ': ' + JSON.stringify(items[exerciseId]));
  }

  function saveArraytoCheckboxes($exercise, workdiv) {
      const exerciseId = getId($exercise);
      items[exerciseId] = [];
      $exercise.find(workdiv).each(function () {
        items[exerciseId].push($(this).prop('checked'));
      });
      if (debug) console.log('Saving ' + exerciseId + ': ' + JSON.stringify(items[exerciseId]));
  }

  function saveWork() {

    if (debug) console.log('saving work');

    ids = [];  // reset found list of found ids

    // Translation and Numerical
    $('[data-carnap-type=translate], [data-carnap-qualitativetype=numerical]').each(function () {
      saveSimple($(this),'input');
    });

    // Qualitative Short Answer and Derivations
    $('[data-carnap-qualitativetype=shortanswer], [data-carnap-type=proofchecker]').each(function () {
      saveSimple($(this),'textarea');
    });

    // Countermodels
    $('[data-carnap-type=countermodeler]').each(function () {
      saveArray($(this),'textarea');
    });

    // Truth Tables
    // disabled, because caused trouble on reload
    $('[data-carnap-type=truthtable]').each(function () {
      saveArray($(this),'select');
    });

    // Multiple Choice and Multiple Selection
    $('[data-carnap-qualitativetype=multiplechoice], [data-carnap-qualitativetype=multipleselection]').each(function () {
      saveArraytoCheckboxes($(this),'input');
    });

    // Syntax Problems
    // Sequent Calculus Problems
    // Gentzen-Prawitz Natural Deduction Problems

    localStorage.setItem(namespace, JSON.stringify(items));
    if (debug) console.log('done saving work');
  }

  function loadSimple($exercise, workdiv) {
    const exerciseId = getId($exercise);
    if (typeof items[exerciseId] !== 'undefined') {
      const studentWork = items[exerciseId];
      // check that the saved data is a string or number
      if (typeof(studentWork) == "string" || typeof(studentWork) == "number")  {
        if (debug) console.log('loading ' + exerciseId + ': ' + studentWork)
        $exercise.find(workdiv).each( function() {
          $(this).val(studentWork);
          // trigger the keyup event to get Carnap to error check derivations
          $(this)[0].dispatchEvent(new Event('keyup', { 'bubbles': true }));
        })
      } else {
        console.log(exerciseId + ' not loaded: wrong type');
      }
    }
  }

  function loadArray($exercise, workdiv) {
    const exerciseId = getId($exercise);
    if (typeof items[exerciseId] !== 'undefined') {
      studentWork = items[exerciseId];
      // check that saved data is an array, not a string
      if (typeof(studentWork) == "object") {
        if (debug) console.log('loading ' + exerciseId)
        $exercise.find(workdiv).each(function () {
          const value = studentWork.shift();
          $(this).val(value);
          // we need to fire the change event for truthtables
          // and the keyup event for countermodels
          $(this)[0].dispatchEvent(new Event('change', { 'bubbles': true }));
          $(this)[0].dispatchEvent(new Event('keyup', { 'bubbles': true }));
        });
      } else {
        console.log(exerciseId + ' not loaded: wrong type');
      }
    }
  }

  function loadArraytoCheckboxes($exercise, workdiv) {
    const exerciseId = getId($exercise);
    if (typeof items[exerciseId] !== 'undefined') {
      studentWork = items[exerciseId];
      // check that saved data is an array, not a string
      if (typeof(studentWork) == "object") {
        if (debug) console.log('loading ' + exerciseId)
        $exercise.find(workdiv).each(function () {
          const value = studentWork.shift();
          $(this).prop('checked', value);
          if ( value ) {
            // when value is true, simulate click event to trigger carnap to process the input
            $(this)[0].dispatchEvent(new Event('click', { 'bubbles': true }));
          }
        });
      } else {
        console.log(exerciseId + ' not loaded: wrong type');
      }
    }
  }

  function loadWork() {

    if (debug) console.log('loading saved work');

    ids = [];  // reset found list of found ids

    // Translation and Numerical
    $('[data-carnap-type=translate], [data-carnap-qualitativetype=numerical]').each(function () {
      loadSimple($(this), 'input');
    });

    // Qualitative Short Answer and Derivations
    $('[data-carnap-qualitativetype=shortanswer], [data-carnap-type=proofchecker]').each(function () {
      loadSimple($(this), 'textarea');
    });

    // Countermodels
    $('[data-carnap-type=countermodeler]').each(function () {
      loadArray($(this), 'textarea');
    });

    // Truth Tables
    // disabled; caused trouble on reload
    $('[data-carnap-type=truthtable]').each(function () {
      loadArray($(this), 'select');
    });
    
    // Multiple Choice and Multiple Selection
    $('[data-carnap-qualitativetype=multiplechoice], [data-carnap-qualitativetype=multipleselection]').each(function () {
      loadArraytoCheckboxes($(this), 'input');
    });

    // Syntax Problems
    // Sequent Calculus Problems
    // Gentzen-Prawitz Natural Deduction Problems
    
    if (debug) console.log('done loading');

  }

  function fetchWork() {
    try {
        if (debug) console.log('Fetching saved work from local storage')
        items = JSON.parse(localStorage.getItem(namespace));
        if (items === null) {
          items = {};
        }
        loadWork();

    } catch {
        if (debug) console.log('no saved work to load')
    }


    // use Page Visibility API instead of beforeunload for mobile friendly saving
    // https://www.igvita.com/2015/11/20/dont-lose-user-and-app-state-use-page-visibility/
    
    // subscribe to visibility change events
    document.addEventListener('visibilitychange', function() {
      // fires when user switches tabs, apps, goes to homescreen, etc.
      if (document.visibilityState == 'hidden') saveWork();
      //if (document.visibilityState == 'visible') fetchWork();
    });

    $(window).on('beforeunload', saveWork);
    // $('input').on('blur', saveWork);
    // $('textarea').on('blur', saveWork);
    // $('select').on('blur', saveWork);
  }
  
  fetchWork();
}

document.addEventListener("carnap-loaded", initSaveWork)


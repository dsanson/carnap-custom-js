/* eslint-env jquery */
/* global CarnapServerAPI */
// A script that reports scores to students on the assignment page
//
// This script does too many things, and it builds in a bunch of assumptions
// about assignment structure specific to my own courses.
//
// Basic features:
//
// 1.  If an exercise has been submitted:
//     -    add class 'submitted' to the exercise
//     -    add class 'correct' if received points
//     -    add class 'incorrect' if received a zero.
// 
// Combined with custom CSS, this gives students immediately and persistant feedback
// on each exercise.
//
// 2.  Reveal hidden divs with the class 'reaction', as a way of giving feedback
//     upon submission.
//
// 3.  Create a "progress bar" at the top of the page, with extensive information 
//     about the student's progress through the assignment
//


function debuglog(message) {
  console.log(message)
}

function buildTally() {
  let exercises = $('.exercise').filter(function () {
    let sub = $(this).children("[data-carnap-submission]")
      .first()
      .attr("data-carnap-submission")
    if ( typeof sub === 'undefined' ) {
      return false }
    else { 
      return sub.substring(0,6) === 'saveAs' 
    }
  })
  let tally = $('.auto-tally').first() 
  if (! tally.length) { 
    tally = $('<div class="auto-tally"></div>')
  }
  let listdiv = $('<div/>')
    .attr('class','exercise-checklist')
  let list = $('<ul/>')
  exercises.each(function() {
    let label = $(this).attr('data-carnap-label')
    let li = $(`<li> <input type="checkbox" value="${label}"> </li>`) 
    let a = $(`<a href="#exercise-${label}">${label}</a>`)
    // scroll exercises to center of page
    a.click( function(e) {
      e.preventDefault()
      let id = ($(this).attr('href').split('#')[1])
      document.getElementById(id).scrollIntoView({behavior: 'smooth', block: 'center'})
    })
    li.append(a)
    list.append(li)
  })
  listdiv.append(list)
  tally.append(listdiv)
  return tally 
}

function createProgressReport(assn,standards,translation) {
  const pctreport = `<li>
    Percentage: 
      <span class="pct">${assn.percentage}%</span>
    </li>`
  const ptsreport = `<li>
    Score: 
      <span class="score">${assn.score}</span>/<span class="total">${assn.total_points}</span>
    </li>`
  const statusreport = `<li>
      Status: 
      <span class="status">${translation[assn['status']]}</span>
    </li>` 
  const tiptext = `<li>
    <span class="progresstip">Submissions not enabled. Perhaps you are not viewing this as an assignment?</span></li>`

  let progressbar = `<div id="progress" 
                              style="position:relative; 
                                     width:100%; 
                                     height:5px; 
                                     border:1px solid var(--border)"
                         >
                         <div class="progressbar" 
                              style="position:absolute;
                                     height:inherit; 
                                     background-color: var(--${assn['status']}); 
                                     width:${assn.percentage}%"
                         ></div>
                         <div style="position:absolute;
                                     top:-5px; 
                                     height:15px; 
                                     border-right: thick solid var(--meets); 
                                     width:${standards[assn.type].meets}%"
                         ></div>`
  if ( assn.type == 'M' ) {
    progressbar = progressbar + 
                         `<div style="position:absolute;
                                     top:-5px; 
                                     height:15px; 
                                     border-right: thick solid var(--excels); 
                                     width:${standards[assn.type].excels}%"
                         ></div>`
  }
  progressbar = progressbar + '</div>'

  let report = $(`<li class="report dropdown ${assn['status']}"></li>`)
  report.prepend(progressbar)

  let dropdown_ul = $('<ul></ul>')
  dropdown_ul.append(pctreport)
  dropdown_ul.append(ptsreport)
  dropdown_ul.append(statusreport)
  dropdown_ul.append(tiptext)
  let tally = buildTally()
  tally.first().appendTo(dropdown_ul)

  report.append(dropdown_ul)

  $('nav#navbar > ul > li:nth-child(3)').before(report);

}

function exerciseStatus(assn,scores) {
  // statuses:
  //   no_submission: no matching submissions for this exercise
  //   this_correct: matching correct submission for this assn
  //   this_incorrect: matching incorrect submission for this assn
  //   other_correct: matching correct submission on other assn
  //   other_incorrect: matching incorrect submission on other assn
  $('.exercise').each(function() {

    let ex = {
      'label': $(this).attr('data-carnap-label'),
      'source': assn.source,
      'status': [],
      'score': 0,
      'depends_on': $(this).children('[data-carnap-type]').attr('data-carnap-depends-on'),
      'dependent_status': [],
    }

    let matches = scores.filter(m => {
      return m.source.substring(0,3) == ex.source.substring(0,3) && m.label == ex.label
    })

    // score is highest score from all matches
    let the_scores = []
    for (const e of matches) {
      the_scores.push(e.score)
    }
    ex.score = the_scores.reduce((a,b) => Math.max(a,b), 0)

    // set statuses
    if ( matches.length === 0 ) {
      ex['status'].push('no_submission')
    }
    for (const match of matches) {
      if (
        match.source === assn.source &&
        match.score > 0
      ) {
        ex['status'].push('this_correct')
      }
      else if (
        match.source === assn.source &&
        match.score === 0
      ) {
        ex['status'].push('this_incorrect')
      }
      else if (
        match.score > 0
      ) {
        ex['status'].push('other_correct')
      }
      else if (
        match.score === 0
      ) {
        ex['status'].push('other_incorrect')
      }
    }
    assn.exercises.push(ex)
  })
}

function totalScore(assn,standards) {
  let the_scores = []
  for (const e of assn.exercises) {
    the_scores.push(e.score)
  }
  assn.score = the_scores.reduce((a,b) => a + b, 0)
  assn.percentage = Math.round(assn.score / assn.total_points * 100)
  if ( assn.type == 'M' && assn.percentage >= standards.M.excels ) {
    assn['status'] = 'excels'
  }
  else if ( assn.percentage >= standards[assn.type].meets ) {
    assn['status'] = 'meets' 
  }
}

function flagDependencies(assn) {
  for (const ex of assn.exercises) {
    if ( typeof ex.depends_on !== 'undefined' ) {
      assn.exercises.map(e => { 
        if ( e.label == ex.depends_on ) {
          e.dependent_status = ex.status
        }
      })
    }
  }
}

function indicateStatus(ex, status, message="") {
  $('[data-carnap-label="' + ex.label + '"]').addClass(status)
    .find('.buttonWrapper button')
    .attr('data-carnap-exercise-status',status)
  $('[data-carnap-label="' + ex.label + '"] > span')
    .attr('title',message)
  $('input[value="' + ex.label + '"]').prop('checked',true) 
  $('.exercise-checklist input[value="' + ex.label + '"]').next()
    .addClass(status) 
    .attr('title',message)
  $('.reaction.' + status +  '[data-ex="' + ex.label + '"]').show()
}

function updateExerciseDisplay(assn) {
  for (const ex of assn.exercises) {
    if ( ex['status'].includes('this_correct') ) {
      //add correct/submitted indicators
      indicateStatus(ex,'correct')
      indicateStatus(ex,'submitted')
    }
    else if ( 
      ex['status'].includes('this_incorrect') &&
      ex['status'].includes('other_correct') 
    ) {
      //add incorrect/submitted indicators 
      //add other correct indicator
      indicateStatus(ex,'incorrect')
      indicateStatus(ex,'submitted')
      indicateStatus(ex,'other_correct')
    }
    else if ( 
      ex['status'].includes('this_incorrect')
      // && (implicitly) not 'other_correct'
    ) {
      //add incorrect/submitted indicators 
      indicateStatus(ex,'incorrect')
      indicateStatus(ex,'submitted')
    }
    else if ( 
      ex['status'].includes('other_correct') &&
      ( ex.dependent_status.length === 0 || 
        ex.dependent_status.includes('other_correct')
      )
    ) {
      //add correct/submitted indicators
      indicateStatus(ex,'correct')
      indicateStatus(ex,'submitted')
      //hide
      $('div #exercise-' + ex.label).hide().empty()
      ex.status.push('hidden')
    }
    else if ( 
      ex.status.includes('other_correct')
      // && (implicitly) has a dependent that is not 'other_correct'
    ) {
      // add other_correct submission indicator
      indicateStatus(ex,'other_correct',
        'You already got this correct but you need to do it again, because your answer to the next question depends on your answer to this question.')
    }
  }
  // if all the exercises are hidden, display a message
  const hidden = assn.exercises.filter(e => {
    return e.status.includes('hidden')
  }).length
  if ( assn.exercises.length === hidden ) {
    $('article').append(
      $(`<div class='message complete'><p>You have gotten all problems correct on previous mastery checks,
         so there is nothing for you to retake.</p></div>`))
  }
}

function updateBar(assn,standards,translation) {

  $('#progress .progressbar').css('background-color', `var(--${assn['status']})`)
  $('#progress .progressbar').css('width', assn.percentage + '%')

  let tip = ''
  if ( assn.type == 'R' && assn['status'] == 'incomplete' ) {
    tip = `To complete this reading, you must score ${standards[assn.type].meets}%.`
  } else if ( assn.type == 'R' && assn['status'] == 'meets' ) {
    tip = `Congratulations! You have completed this reading.`
  } else if ( assn.type == 'E' && assn['status'] == 'incomplete' ) {
    tip = `To complete these exercises, you must score at least ${standards[assn.type].meets}%.`
  } else if ( assn.type == 'E' && assn['status'] == 'meets' ) {
    tip = `Congratulations! You have completed these exercises.`
  } else if ( assn.type == 'M' && assn['status'] == 'incomplete' ) {
    tip = `To complete this mastery check, you must score at least ${standards[assn.type].meets}%.
               To request a retake, please <a href="https://groupme.com/contact/99365935/isjWnqLN">DM me on GroupMe</a>.`
  } else if ( assn.type == 'M' && assn['status'] == 'meets' ) {
    tip = `Congratulations! You have completed this mastery check! 
               To <i>master</i> this unit, you must score at least ${standards[assn.type].excels}%.
               To request a retake, please <a href="https://groupme.com/contact/99365935/isjWnqLN">DM me on GroupMe</a>.`
  } else if ( assn.type == 'M' && assn['status'] == 'excels' ) {
    tip = `Congratulations! If you have also completed the reading and exercises, you have mastered this unit.` 
  } 

  $('.report li span.percentage').html(assn.percentage + '%')
  $('.report li span.score').html(assn.score)
  $('.report li span.status').html(translation[assn['status']])
  $('.report li span.progresstip').html(tip)
}

function scrapeScoresAndUpdate(userpage,scoreselector,assn,standards,translation) {
  let scores = [] 
  let scraped_scores = $('<div/>')
  scraped_scores.load(userpage + " " + scoreselector, function() {
    scraped_scores.find('tr').each(function() {
      let items = $(this).children('td');
      if (items.length === 0) {
        return
      }
      let source = items[0].innerText.trim()
      let label = items[1].innerText.trim()
      let score = parseInt(items[4].innerText)
      // adjust late work to full points
      if ( score == 5 ) {
        score = 10
      }
      scores.push({
        'source': source,
        'label': label,
        'score': score
      })
    })
  exerciseStatus(assn,scores) 
  totalScore(assn,standards)
  flagDependencies(assn)
  updateExerciseDisplay(assn)
  updateBar(assn,standards,translation)
  })
}

function initScoreKeeper() {                                                                            

  const url = document.location.pathname.split('/')
  // const course = url.slice(-2)[0]
  const current = url.slice(-1)[0]
  
  //TODO: move course specific config to config.json
  // grading standards
  let standards = { 
          R: { meets: 100 },
          E: { meets: 80 },
          M: { meets: 60, excels: 80 }
        }

  // translation of 'meets' and 'excels' into student facing terminology
  const translation = {
         incomplete: 'Not yet complete',
         meets: 'Complete',
         excels: 'Excellent'
    }

  const currenttype = current.slice(2,3).toUpperCase()
  if ( currenttype == "S" ) {
    return // don't calculate scores for supplements
  }

  // these settings work for students
  let userpage = '/user'
  let scoreselector = 'div.card:nth-child(8) table'

  // but instructors need some different settings
  //   (more than 2 dropdown items in the navbar means user is instructor)
  const dropdown = $('#navbar > ul > li:last-child ul')[0].children.length
  if (dropdown > 2) {
    debuglog('instructor mode')    
    let user = $('#navbar > ul > li:last-child ul li:first-child a').attr('href')
    user = user.split('/').slice(-1)[0]
    userpage = userpage + '/' + user
    scoreselector = 'div.card:nth-child(9) table'
  }

  if ( current.includes("Book") ) {
    //calculateCourseGrade(userpage,scoreselector)
    return // no on-going score checking for this page!
  }

  // create an empty div to load scores from userpage

  let points = 0
  try {
    if (typeof CarnapServerAPI.assignment.pointValue !== 'undefined') {
      points = CarnapServerAPI.assignment.pointValue
    }
  } catch {
    points = 0
  }

  let assn = { 
    'source': current,
    'score': 0,
    'total_points': points,
    'percentage': 0,
    'type': currenttype,
    'status': "incomplete",
    'exercises': [],
  }
 
  createProgressReport(assn,standards,translation)

  if ( url.slice(-3)[0] == "shared" ) {
    return // don't attempt to calculate scores on pages that aren't assigned
  }

  scrapeScoresAndUpdate(userpage,scoreselector,assn,standards,translation)
 
  $('.exercise .buttonWrapper button').on('problem-submission', function() { 
    assn.exercises = []
    scrapeScoresAndUpdate(userpage,scoreselector,assn,standards,translation)
  })
}

$(document).ready(function() {                                                                          
    initScoreKeeper()
});

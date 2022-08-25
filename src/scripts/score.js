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

function updateScores(userpage,scoreselector,assn,standards,translation) {

  let scores = $('<div/>')
  
  scores.load(userpage + " " + scoreselector, function() {
   
    assn.total = 0

    scores.find('tr').each(function() {
      let items = $(this).children('td');
      if (items.length === 0) {
        return
      }
      let source = items[0].innerText.trim()
      let exercise = items[1].innerText.trim()
      let score = parseInt(items[4].innerText)
      
      // adjust late work to full points
      if ( score == 5 ) {
        score = 10
      }
      if (source == assn.label) {
        assn.total = assn.total + score
        $('[data-carnap-label="' + exercise + '"]').addClass('submitted')
        $('[data-carnap-label="' + exercise + '"] .buttonWrapper button').attr('data-carnap-exercise-status','submitted')
        $('input[value="' + exercise + '"]').prop('checked',true) 
        if (score != 0) {
          $('[data-carnap-label="' + exercise + '"]').addClass('correct')
          $('.exercise-checklist input[value="' + exercise + '"]').next().addClass('correct') 
          $('.reaction.correct[data-ex="' + exercise + '"]').show()
        }
        else {
          $('[data-carnap-label="' + exercise + '"]').addClass('incorrect')
          $('.exercise-checklist input[value="' + exercise + '"]').next().addClass('incorrect') 
          $('.reaction.incorrect[data-ex="' + exercise + '"]').show()
        }
      }
    });

    assn.pct = Math.round(assn.total / assn.points * 100)
    if ( assn.pct >= standards[assn.type].meets ) {
      assn.status = 'meets' 
    }
    if ( assn.type == 'M' && assn.pct >= standards.M.excels ) {
      assn.status = 'excels'
    }
 
    $('#progress .progressbar').css('background-color', `var(--${assn.status})`)
    $('#progress .progressbar').css('width', assn.pct + '%')
   
    let tip = ''
    if ( assn.type == 'R' && assn.status == 'incomplete' ) {
       tip = `To complete this reading, you must score ${standards[assn.type].meets}%.`
    } else if ( assn.type == 'R' && assn.status == 'meets' ) {
       tip = `Congratulations! You have completed this reading.`
    } else if ( assn.type == 'E' && assn.status == 'incomplete' ) {
       tip = `To complete these exercises, you must score at least ${standards[assn.type].meets}%.`
    } else if ( assn.type == 'E' && assn.status == 'meets' ) {
       tip = `Congratulations! You have completed these exercises.`
    } else if ( assn.type == 'M' && assn.status == 'incomplete' ) {
       tip = `To complete this mastery check, you must score at least ${standards[assn.type].meets}%.
               To request a retake, please DM me on Discord.`
    } else if ( assn.type == 'M' && assn.status == 'meets' ) {
       tip = `Congratulations! You have completed this mastery check! 
               To <i>master</i> this unit, you must score at least ${standards[assn.type].excels}%.
               To request a retake, please DM me on Discord.` 
    } else if ( assn.type == 'M' && assn.status == 'excels' ) {
       tip = `Congratulations! If you have also completed the reading and exercises, you have mastered this unit.` 
    } 

    $('.report li span.pct').html(assn.pct + '%')
    $('.report li span.score').html(assn.total)
    $('.report li span.status').html(translation[assn.status])
    $('.report li span.progresstip').html(tip)
 
  });
}

function initScoreKeeper() {                                                                            

  const url = document.location.pathname.split('/')
  const course = url.slice(-2)[0]
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
               label: current,
               total: 0,
               points: points,
               type: currenttype,
               status: "incomplete"
             }



  const pctreport = `<li>Percentage: <span class="pct">${assn.pct}%</span></li>`
  const ptsreport = `<li>Score: <span class="score">${assn.total}</span>/<span class="total">${assn.points}</span></li>`
  const statusreport = `<li>Status: <span class="status">${translation[assn.status]}</span></li>` 
  const tiptext = `<li><span class="progresstip">Submissions not enabled. Perhaps you are not viewing this as an assignment?</span></li>`

  let progressbar = `<div id="progress" 
                              style="position:relative; 
                                     width:100%; 
                                     height:5px; 
                                     border:1px solid var(--border)"
                         >
                         <div class="progressbar" 
                              style="position:absolute;
                                     height:inherit; 
                                     background-color: var(--${assn.status}); 
                                     width:${assn.pct}%"
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

  let report = $(`<li class="report dropdown ${assn.status}"></li>`)
  report.prepend(progressbar)

  let dropdown_ul = $('<ul></ul>')
  dropdown_ul.append(pctreport)
  dropdown_ul.append(ptsreport)
  dropdown_ul.append(statusreport)
  dropdown_ul.append(tiptext)
  $('.auto-tally').first().appendTo(dropdown_ul)

  report.append(dropdown_ul)

  $('nav#navbar > ul > li:nth-child(3)').before(report);

  if ( url.slice(-3)[0] == "shared" ) {
    return // don't attempt to calculate scores on pages that aren't assigned
  }

  updateScores(userpage,scoreselector,assn,standards,translation)
 
  $('.exercise .buttonWrapper button').on('problem-submission', function() { 
    updateScores(userpage,scoreselector,assn,standards,translation)
  })
 
}

$(document).ready(function() {                                                                          
    initScoreKeeper();
});

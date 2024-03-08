/* eslint-env jquery */
/* global CarnapServerAPI */
// A script that gives students on overview of their course progress
//
// This script scrapes the student's user page for submission data and the toc page for assignment point totals.
//
// Script replaces any div with class '.grades' with a grade report
"use strict"

import * as courseConfig from './course-config.js'

function debuglog(message) {
  if ( debug ) {
    console.log(message)
  }
}

function tallyScores(user,la,ty) {
  let re = new RegExp("^" + la + ty + ".*$")
  let submissions = user.scores.filter( (s) => { return re.test(s.source) })
  let score_list = {}
  submissions.map( (s) => {
    // adjust late scores to no credit
    if ( s.score == 5 ) {
      s.score = 0
    }
    if ( s.label in score_list ) {
      score_list[s.label] = Math.max(s.score,score_list[s.label])
    }
    else {
      score_list[s.label] = s.score
    }
  })
  //return Object.values(score_list).reduce( (a,b) => a + b, 0)
  return score_list
}

function tallyPaperScores(sc,la,ty) {
  let re = new RegExp("^" + la + ty)
  let submissions = sc.filter( (s) => { return ( re.test(s.label) ) }) 
  let score_list = submissions.map( (s) => s.score ) 
  return Object.values(score_list).reduce( (a,b) => a + b, 0)
}

// Use the 'OVERRIDE' exercise to allow for quick entry of scores for several mastery checks
// the code is an integer, but read it as a string from left to right.
// -   the first digit is meaningless: we need it to preserve leading zeros
// -   the second digit is the score of 00M
// -   the third digit is the score of 01M
// -   and so on.
function overRides(user,la,mc_sc) {
  let code = user.scores.filter ( (s) => { return (s.source == "GradeBook" && s.label == "OVERRIDE" ) } )
  if ( code.length > 0 ) {
    code = code[0].score
    //console.log(code)
    let pos = Number(la) + 1
    let override = String(code).charAt(pos);
    if ( override != 0 ) {
      mc_sc = override * 10
    }
    //console.log(la + ": " + mc_sc)
  }
  return mc_sc
}

function met(grades,required) {
  for ( let u in required ) {
    if ( ! grades[required[u]].unit_complete ) {
      return false
    }
  }
  return true
}

function calculateGrades(course,user) {

  // calculate status of reading, mastery check, and unit for each unit
  course.units.map( unit => {
    let reading_score_list = tallyScores(user,unit.label,'R')
    let reading_score = Object.values(reading_score_list).reduce( (a,b) => a + b, 0)
    let mc_score = 0
    let mc_score_list = []
    if ( unit["mc-paper"] ) {
      mc_score = tallyPaperScores(user.scores,unit.label,'M') 
    } else {
      mc_score_list = tallyScores(user,unit.label,'M')
      mc_score = Object.values(mc_score_list).reduce( (a,b) => a + b, 0)
    }
    mc_score = overRides(user,unit.label,mc_score)
    let grade = {
      reading_score: reading_score,
      reading_total: unit.points,
      reading_percentage: Math.round(reading_score / unit.points * 100),
      mc_score: mc_score,
      mc_scores: mc_score_list,
      mc_total: unit["mc-points"],
      mc_percentage: Math.round(mc_score / unit["mc-points"] * 100)
    }

    if ( grade.reading_percentage >= course.standards.reading.meets ) {
      grade.reading_complete = true
    } else { 
      grade.reading_complete = false
    }
    if ( grade.mc_percentage >= course.standards.mc.excels ) {
      grade.mc_mastered = true 
    } else {
      grade.mc_mastered = false
    }
    if ( grade.mc_percentage >= course.standards.mc.meets ) {
      grade.mc_complete = true
    } else {
      grade.mc_complete = false
    } 
    grade.status = 'Not yet complete'
    if ( grade.reading_complete && grade.mc_complete ) {
      grade.unit_complete = true
      grade.status = 'Complete'
    } else {
      grade.unit_complete = false
    }
    if ( grade.reading_complete && grade.mc_mastered ) {
      grade.unit_mastered = true
      grade.status = 'Mastered and Complete'
    } else {
      grade.unit_mastered = false
    } 
    user.grades.by_unit[unit.label] = grade
  })
  
  // collaboration units
  let collab = user.scores.filter( (s) => s.label == 'COLLAB' ) 
  if ( collab.length > 0 ) {
    user.grades.collab_points = collab[0].score
  } else {
    user.grades.collab_points = 0
  }
  if ( user.grades.collab_points >= 200 ) {
    user.grades.collab_units = 2
  } else if ( user.grades.collab_points >= 100 ) {
    user.grades.collab_units = 1
  } else {
    user.grades.collab_units = 0
  }

  // how many units have status 'excels'?
  const mastered = Object.keys(user.grades.by_unit)
    .map( label => user.grades.by_unit[label].unit_mastered ) 
    .reduce(function(acc, val) {
      return val 
      ? acc+=1
      : acc;
    },0);
  const complete = Object.keys(user.grades.by_unit)
    .map( label => user.grades.by_unit[label].unit_complete ) 
    .reduce(function(acc, val) {
      return val 
      ? acc+=1
      : acc;
    },0);
  user.grades.total_units_complete = complete + user.grades.collab_units
  user.grades.total_units_mastered = mastered

  // // letter grade for course
  Object.entries(course.scale).map( ([grade,specs]) => {

    if ( user.grades.total_units_mastered >= specs.mastered  &&
         user.grades.total_units_complete >= specs.complete &&
         met(user.grades.by_unit,specs.required) ) {
          if ( grade < user.grades.letter_grade ) {
            // less than, meaning earlier in the alphabet, meaning a higher grade
            user.grades.letter_grade = grade
          }          
        }
    })
  
}

function getStudents(course,menu,button,userid) {
  const page = `https://carnap.io/instructor/${course.instructor_id}#course-${course.number}`
  const selector = 'div.scrollbox:nth-child(7) > table:nth-child(1)'
  course.students = {} 
  let scraped_students = $('<div/>')
  scraped_students.load(page + " " + selector, function() {
    scraped_students.find('tr').each(function() {
      let items = $(this).children('td');
      if (items.length === 0) {
        return
      }
      const id = items[0].innerText.trim()
      const name = items[1].innerText.trim()
      const student = new User(id)
      student.name = name
      course.students[id] = student
    })
    Object.keys(course.students).map( key => {
      const opt = $(`<option value="${key}">${course.students[key].name}</option>`)
      if ( key == userid ) {
        opt.prop('selected',true)
      }
      menu.append(opt)
    })
    $("#students").on("change", function() {
      const id = $(this).find(':selected').val()
      fetchScoresAndContinue(course,course.students[id])
    })
    // export button
    button.on("click", function() {
      exportGrades(course)
    })
  })
}

function displayGrades(course,user) {
  //debuglog(JSON.stringify(user.grades))

  // overview of course progress
  const message = `
    <p>
     Collaboration points and scores for on-paper mastery checks
     are entered manually. I plan to do so at once a week throughout
     the term.
    </p>
    <p>
     You have completed ${user.grades.total_units_complete} units, and completed and mastered  
     ${user.grades.total_units_mastered}.</p> 
    <p>
     You have ${user.grades.collab_points} collaboration points, giving you 
     ${user.grades.collab_units} complete collaboration units. These are included
     in the calculation of ${user.grades.total_units_complete} complete units, given above.
    </p>
    <!--
    <p>
     If you never did another thing in this course, your grade for the course would be
     a ${user.grades.letter_grade}.
    </p>
    -->`
  // construct table that displays status of each unit
  let units_table = $('<table>')
  units_table.css("width","100%").css("min-width","90vw").css("font-size","10pt").css("line-height","100%").css("margin-left","0")
  units_table.append('<tr><th>Unit</th><th>Status</th><th>Details</th><th>Dates</th></tr>')
  course.units.map( unit => {
    // create row and td elements
    let row = $('<tr>')
       .attr('id','unit-' + unit.label)
       .addClass('disabled')
    let name = $('<td>')
       .addClass('unit-name')
       .text(`${unit.label} ${unit.title}`)
    let status = $('<td>')
       .addClass('status')
       .text("Not yet enabled")
    let scores = $('<td>')
       .addClass('scores')
    let dates = $('<td>')
       .addClass('dates')

    if ( unit.enabled ) { 
      row.removeClass('disabled')
      name.wrapInner(`<a href="${course.base_url}/${unit.label}R">`)

      status.text(user.grades.by_unit[unit.label].status)
      if ( user.grades.by_unit[unit.label].unit_complete ) {
        status.addClass('complete')
        row.addClass('complete')
      }
      if ( user.grades.by_unit[unit.label].unit_mastered ) {
        status.addClass('mastered')
        row.addClass('mastered')
      }

      let reading = $('<span>')
        .addClass('reading-score')
        .text(user.grades.by_unit[unit.label].reading_percentage + '%')
      let mc = $('<span>')
        .addClass('mc-score')
        .text(user.grades.by_unit[unit.label].mc_percentage + '%')
      scores.html('R: ')
        .append(reading)
        .append('; MC: ')
        .append(mc)
      if ( user.grades.by_unit[unit.label].reading_complete ) {
        reading.addClass('complete')
      }
      if ( user.grades.by_unit[unit.label].mc_complete ) {
        mc.addClass('complete')
      }
      if ( user.grades.by_unit[unit.label].mc_mastered ) {
        mc.addClass('mastered')
      }

      if ( unit.hasOwnProperty('start-date') ) {
        let start = $(`<span class="start-date">Start by ${unit["start-date"].toLocaleDateString()}</span>`)
        dates.append(start)
      }
      if ( unit.hasOwnProperty('expiration-date') ) {
        let exp = $(`<span class="expiration-date">Expires on ${unit["expiration-date"].toLocaleDateString()}</span>`)
        dates.append('<br>')
        dates.append(exp)
      }
    }

    row.append(name)
    row.append(status)
    row.append(scores)
    row.append(dates)
    units_table.append(row)
  })

  // collaboration unit scores
  let row = $('<tr>')
    .attr('id','unit-collab')
  let name = $(`<td class=name><a href="${course.base_url}/00R#collaboration-units">Collaboration</a></td>`)
  let status = $(`<td class=status>${user.grades.collab_units} complete</td>`)
  let scores = $(`<td class=scores>Collaboration points: ${user.grades.collab_points}</td>`)
  row.append(name)
  row.append(status)
  row.append(scores)
  units_table.append(row)

  $('.grade-report #grade_message').html(message)
  $('.grade-report #units_table').html(units_table)
}

async function dummySubmit(exs) {

  const key = CarnapServerAPI.assignmentKey
  for ( const i in exs) {
    const ex = exs[i]
    const data = {
      "tag": "Submit",
      "contents": [
        "Qualitative",
        ex,
        {
          "tag": "QualitativeProblemDataOpts",
          "contents": [
            "A dummy question used to record on-paper mastery check scores",
            "",
            [
              [
                "content",
                ""
              ],
              [
                "goal",
                "A dummy question used to record on-paper mastery check scores",
              ],
              [
                "points",
                "0"
              ],
              [
                "qualitativetype",
                "shortanswer"
              ],
              [
                "submission",
                "saveAs:" + ex
              ],
              [
                "type",
                "qualitative"
              ]
            ]
          ]
        },
        {
          "tag": "Assignment",
          "contents": key
        },
        false,
        10,
        null,
        key
      ]
    }
      
    const upload = fetch("/command", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    }).then(response => console.log("Response status: ", response.status));
    let promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve("done!"), 500)
    });
    await promise; 
  }
}

function ghostSubmissions(course,user) {
  // 
  if ( user.type == 'student-viewed-by-instructor') {
    return
  }
  const sourceAssn = 'GradeBook'
  const paper_exs = []
  course.units.filter( u => u['mc-paper'] ).map( u => {
    paper_exs.push(`${u.label}M`)
  })
  paper_exs.push('COLLAB')
  paper_exs.push('OVERRIDE')
  // find any hidden exercises on the page that have not yet been submitted
  let subs = user.scores.filter( (s) => s.source == sourceAssn ).map( (s) => s.label )
  let unsubbed = paper_exs.filter( (e) => ! subs.includes(e) )
  dummySubmit(unsubbed)
}

async function fetchScoresAndContinue(course,user,display = true) {
  // display is a boolean: set to false to calculate grades without displaying
  let scores = [] 
  let scraped_scores = $('<div/>')
  scraped_scores.load(user.page + " " + user.scoreselector, function() {
    scraped_scores.find('tr').each(function() {
      let items = $(this).children('td');
      if (items.length === 0) {
        return
      }
      let source = items[0].innerText.trim()
      let label = items[1].innerText.trim()
      let score = parseInt(items[4].innerText)
      // adjust late work to zero points
      if ( score == 5 ) {
        score = 0
      }
      let submission_date = items[3].innerText
      scores.push({
        'source': source,
        'label': label,
        'score': score,
        'submission_date': submission_date
      })
    })
  user.scores = scores
  ghostSubmissions(course,user)
  calculateGrades(course,user)
  if ( display ) { displayGrades(course,user) }
  })
  return true
}

function determineStudent() {
  const dropdown = $('#navbar > ul > li:last-child ul')[0].children.length
  if (dropdown > 2) {
    const type = 'instructor'
    const id = $('#navbar > ul > li:last-child ul li:first-child a').attr('href').split('/').slice(-1)[0]
    const page =  `/user/${id}`
    const scoreselector = 'div.card:nth-child(9) table'
    return [type, id, page, scoreselector]
  } else {
    const type = 'student'
    const id = ""
    const page = '/user'
    const scoreselector = 'div.card:nth-child(8) table'
    return [type, id, page, scoreselector]
  }
}

function User(student)  {
  if ( student === 'auto' ) {
    [this.type, this.id, this.page, this.scoreselector] = determineStudent()
  }
  else {
    this.type = 'student-viewed-by-instructor'
    this.id = student
    this.page =  `/user/${this.id}`
    this.scoreselector = 'div.card:nth-child(8) table'
  }
  this.grades = {
    letter_grade: "F",
    total_units_complete: 0,
    total_units_mastered: 0,
    by_unit: {}
  }
}

// download as JSON
// download exportObj as JSON file named exportName.json
function downloadObjectAsJson(exportObj, exportName){
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

async function exportGrades(course,full = false) {
  // fetch scores and calculate grades for all students
  let rows = []
  for (const s in course.students) {
    console.log("fetching scores for " + course.students[s].name)
    await fetchScoresAndContinue(course,course.students[s],false)
    console.log(course.students[s])
    let promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve("done!"), 500)
    });
    await promise; 
    // this doesn't work. something wrong with the timing and async functions
    let row = {}
    row.id = course.students[s].id
    row.name = course.students[s].name
    row.letter_grade = course.students[s].grades.letter_grade
    row.total_units_complete = course.students[s].grades.total_units_complete
    row.total_units_mastered = course.students[s].grades.total_units_mastered
    row.collab_units = course.students[s].grades.collab_units
    row.collab_points = course.students[s].grades.collab_points
    // for (const [u, g] of Object.entries(course.students[s].grades.by_unit)) {
    //   if ( ! g.reading_complete ) {
    //     row[u] = "NR"
    //   } else if ( g.mc_mastered ) {
    //     row[u] = "M"
    //   } else {
    //     row[u] = course.students[s].grades.by_unit[u].mc_scores
    //   } 
    // }
    rows.push(row)
  }
  console.log(course)
  const d = new Date()
  downloadObjectAsJson(course.students,'course-data' + d.toISOString() )
  //downloadObjectAsJson(rows,'report')

  // // construct a synopsis of grade data
  // if ( ! full ) {
  //   let rows = []
  //   Object.entries(course.students).forEach( function(k,v) {
  //     const info = k[1]
  //     let row = {}
  //     row.id = info.id
  //     row.name = info.name
  //     row.letter_grade = info.grades.letter_grade
  //     row.total_units_complete = info.grades.total_units_complete
  //     row.total_units_mastered = info.grades.total_units_mastered
  //     row.collab_units = info.grades.collab_units
  //     row.collab_points = info.grades.collab_points
  //     Object.entries(info.grades.by_unit).forEach( (k,v) => { row[k] = v.status } )
  //     debuglog(row)
  //     return row
  //   })
  //   downloadObjectAsJson(report,'grades')
  // } else {
  //   downloadObjectAsJson(students,'grades-full-data')
  // }
}

function initDisplay(course,user) {
  // construct table that displays overall progress in course
  const header = $('<h1>GradeBook for </h1>')

  // instructors can view student grades
  if ( user.type == 'instructor' || user.type == 'student-viewed-by-instructor' ) {
    // create drop-down menu
    const menu = $('<select name="students" id="students">')
    const button = $('<button type="button" name="export" value="" id="export">Export Grades</button>')
    header.append(menu).append(button)
    getStudents(course,menu,button,user.id)
  } else {
    header.append(CarnapServerAPI.user.firstName + ' ' + CarnapServerAPI.user.lastName)
  }

  const message = $('<div id=grade_message>Loading grades...</div>')
  const table = $('<div id=units_table></div>')

  $('.grade-report').html(header).append(message).append(table)
}

async function initGrades() {                                                                            
  
  const url = document.location.pathname.split('/')
  const current = url.slice(-1)[0]

  if ( current != "GradeBook" ) {
    return
  }
  
  const config = await courseConfig.config

  const course = config.course
  course.units = config.contents.pages.filter((page) => page.points > 0)

  // initialize user
  const user = new User("auto")
  initDisplay(course,user)
  fetchScoresAndContinue(course,user)
}

const debug = true
document.addEventListener("carnap-loaded", initGrades)


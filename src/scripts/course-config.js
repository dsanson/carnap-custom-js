function calculateDueDates(config) {
  let weekDay = {
    'expiration': 5, 
    'start': 6,
  }
  const start = new Date(config.course["start-date"] + "T00:00")
  const end = new Date(config.course["end-date"] + "T23:59")
  const firstDay = new Date(config.course["first-day-of-classes"] + "T00:00")
  const lastDay = new Date(config.course["last-day-of-classes"] + "T17:00")
  const lastDayOfFinals = new Date(config.course["last-day-of-finals"] + "T23:59")
  const props = [ 'start', 'expiration' ]
  for ( const i in props) {
    config.contents.pages.forEach( p => {
      const orig = props[i] + '-week'
      const calc = props[i] + '-date'
      if ( p.hasOwnProperty(orig) ) {
        if ( p[orig] == 'last day of classes' ) {
          p[calc] = lastDay
        } else if ( p[orig] == 'last day of finals' ) {
          p[calc] = lastDayOfFinals
        } else if ( p[orig] == 'first day of classes' ) {
          p[calc] = firstDay
        } else if ( Number.isInteger( p[orig] ) ) {
          p[calc] = new Date(config.course["start-date"] + "T23:59")
          p[calc].setDate(start.getDate() - start.getDay() + weekDay[props[i]] + (p[orig] - 1) * 7)
        }
        if ( props[i] == 'start' ) {
          p[calc] = p[calc]
          //.toLocaleDateString('en-US')
        }
      }
    })
  }
}
async function fetchConfig(course_name) {
  const response = await fetch(`/shared/dsanson@gmail.com/${course_name}.js`)
  const config = await response.json()
  calculateDueDates(config)
  return config
}

const course_name = document.location.pathname.split('/').slice(-2)[0]
export const config = fetchConfig(course_name)

/* eslint-env jquery */
/* global availability_minutes:writable, token_time:writable, document */
/* eslint camelcase: ["error", {ignoreGlobals: true}] */
// timer.js
// a simple script to display time remaining for timed assignments

function initTimer() {
  if (typeof availability_minutes === 'undefined') {
    return;
  }

  if ($('#testTimer').length === 0) {
    $('#navbar').append('<div id="testTimer">');
  }

  // Helpful constants
  const second = 1000;
  const minute = 60 * second;
  const hour = 60 * minute;
  const day = hour * 24;
  const available = availability_minutes * minute;

  // Run testTimer every second
  const x = setInterval(testTimer, second);

  function testTimer() {
    const now = new Date().getTime();
    const elapsed = now - token_time;
    const remaining = available - elapsed;
    let display = '';

    // if (remaining > day) {
    //   const days = Math.floor(remaining / day);
    //   display = display + '<span class=days>' + days + 'd</span> ';
    // }
    //
    // if (remaining > hour) {
    //   const hours = Math.floor((remaining % day) / hour);
    //   display = display + '<span class=hours>' + hours + '<span>';
    // }

    const minutes = Math.floor(remaining / minute);
    const seconds = Math.floor((remaining % minute) / second);
    display = String(minutes).padStart(2,'0') + ':' + String(seconds).padStart(2,'0');

    if (remaining < 2 * minute) {
      $('#testTimer').css('color','orange')
    }

    if (remaining < 1 * minute) {
      $('#testTimer').css('color','red')
    }

    if (remaining < 0) {
      display = 'EXPIRED';
      $('#testTimer').css('color','red')
      clearInterval(x);
    }

    $('#testTimer').text(display);
  }
}

$(document).ready(initTimer);

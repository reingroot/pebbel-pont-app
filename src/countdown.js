var UI = require('ui');
var Vector2 = require('vector2');
var countdownCache = [];

function countdown(wind, mode, minutes, seconds, zeroTimeCallback)
{
  var endTime, hours, mins, msLeft, time, currentCount, el, countdownConfig = {};

  // Use different font size for current and next time
  switch (mode) {
    case 'currentDeparture':
      countdownConfig.font = 'bitham-30-black';
      countdownConfig.position = 60;
      break;
      
    case 'nextDeparture':
      countdownConfig.font = 'gothic-24-bold';
      countdownConfig.position = 100;
      break;
  }
  
  // Create the countdown element and add it to the window
  el = new UI.Text({position: new Vector2(0, countdownConfig.position), size: new Vector2(144, 168), font: countdownConfig.font, textAlign: 'center'});
  wind.add(el);
  
  // Cache the element so we can delete it easily when the countdown is done
  countdownCache.push(el);
  
  // Padd single digits with a zero
  function twoDigits( n )
  {
    return (n <= 9 ? "0" + n : n);
  }

  function updateTimer()
  {
    msLeft = endTime - (+new Date());
    if ( msLeft < 1000 ) {
      // Remove all countdown elements from the current window
      for (var i = 0; i < countdownCache.length; i++) {
        countdownCache[i].remove();
        countdownCache[i] = undefined;
      }
      countdownCache = [];
      
      // Call this function when the timer runs out
      zeroTimeCallback(wind);
    } else {
      time = new Date( msLeft );
      hours = time.getUTCHours();
      mins = time.getUTCMinutes();
      currentCount = (hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() );
      
      el.text(currentCount);
      
      setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
    }
  }

  endTime = (+new Date()) + 1000 * (60*minutes + seconds) + 500;
  updateTimer();
}

module.exports = countdown;
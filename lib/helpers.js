'use strict';

var {TimetrapTUI_Error} = require('./Errors');


// exports.requiredParam = function(param){

function requiredParam(param) {
  throw new TimetrapTUI_Error(`Error: Required parameter ${param} is missing`);
}

function zeropad(n) {
  if (n < 10) {
    n = '0' + n;
  }
  return n;
}


// ganked from:
// [date - Convert seconds to HH-MM-SS with JavaScript? - Stack Overflow]
// (https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript/25279340)
String.prototype.toHHMMSS = function() {
  /* extend the String by using prototypical inheritance,
     *  so that you can use it to any string directly across all your app. */
  var seconds = parseInt(this, 10); // don't forget the second param
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds - (hours * 3600)) / 60);
  var seconds = seconds - (hours * 3600) - (minutes * 60);

  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  const time = hours + ':' + minutes + ':' + seconds;
  return time;
};
String.prototype.toHMMSS = function() {
  /* extend the String by using prototypical inheritance,
     *  so that you can use it to any string directly across all your app. */
  var seconds = parseInt(this, 10); // don't forget the second param
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds - (hours * 3600)) / 60);
  var seconds = seconds - (hours * 3600) - (minutes * 60);

  if (hours < 10) {
    hours = hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  const time = hours + ':' + minutes + ':' + seconds;
  return time;
};


// module.exports = requiredParam;
module.exports.requiredParam = requiredParam;
module.exports.zeropad = zeropad;

//ganked from:
//[date - Convert seconds to HH-MM-SS with JavaScript? - Stack Overflow]
//(https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript/25279340)
String.prototype.toHHMMSS = function () {

    /* extend the String by using prototypical inheritance,
     *  so that you can use it to any string directly across all your app. */
    var seconds = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    var seconds = seconds - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}
String.prototype.toHMMSS = function () {

    /* extend the String by using prototypical inheritance,
     *  so that you can use it to any string directly across all your app. */
    var seconds = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    var seconds = seconds - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}


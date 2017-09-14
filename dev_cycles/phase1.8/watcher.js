//file-system/watcher.js
const fs = require('fs');

let watched_file = "/home/karl/Documents/Heorot/timetrap/timetrap.db"

fs.watch(watched_file, function() {

catcher();

});
console.log("Now watching "+watched_file+" for changes...");

var count=0;

//function catcher(command){
function catcher(){
	//verify command

	//start timer
	if ( count > 0) {
		//the kernel emits multiple IN_MODIFY events via libuv + sometimes
		// multiple writes occur for an action via timetrap -so we'll only
		// report the composite within a time window of 1 second.
        // see [fs.watch has double change events for file writes · Issue #3042 · nodejs/node](https://github.com/nodejs/node/issues/3042)
		setTimeout(function () {
			catch_timer(count);
			count=0;
		}, 1000);
	}

	//incriment counter
	count++;
}

function catch_timer(count) {
	if (count >= 1){
		console.log("File "+watched_file+" just changed "+count+" times!");
	}
}




// timetrap_tui.js
// entrypoint for timetrap_tui project
"use strict"

var {Timetrap, Timetrap_Error} = require('./Timetrap');

function main(callback) {


    var timetrap = new Timetrap({});

    //timetrap.callCommand();
    console.log("-------------------------------");
    //timetrap.callCommand({type:'changeSheet', sheet:'Projects'});
    timetrap.callCommand({type:'checkOut', sheet:'Personal'});
    timetrap.callCommand({type:'checkIn', sheet:'Personal', content:"testing1"});

}

// Process loop
if (!module.parent) {
    //process.chdir('/tmp');
    process.title = 'Timetrap TUI';
    main(process.argv.slice(), function(err) {
        if (err) throw err;
        return process.exit(0);
    });
} else {
    module.exports = main;
}

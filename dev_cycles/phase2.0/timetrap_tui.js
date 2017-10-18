// timetrap_tui.js
// entrypoint for timetrap_tui project
"use strict"

var {Timetrap, Timetrap_Error} = require('./Timetrap');

function main(callback) {


    var timetrap = new Timetrap({});

    ///////////////// Basic functionality
    // timetrap.callCommand();
    // timetrap.callCommand({type:'changeSheet', sheet:'default'});
    // timetrap.callCommand({type:'checkOut', sheet:'default'});
    // timetrap.callCommand({type:'checkIn', sheet:'default', content:"testing checkin"});
    // console.log("-------------------------------");


    ///////////////// Debugging
        Object.keys(timetrap.command_types).forEach(function(key){
            // expect(timetrap.command_types[key].description).toBeDefined();
            console.log(key+":"+timetrap.command_types[key].required);
        });
}

// Process loop
if (!module.parent) {
    process.title = 'Timetrap TUI';
    main(process.argv.slice(), function(err) {
        if (err) throw err;
        return process.exit(0);
    });
} else {
    module.exports = main;
}

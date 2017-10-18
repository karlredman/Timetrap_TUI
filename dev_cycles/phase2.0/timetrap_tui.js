// timetrap_tui.js
// entrypoint for timetrap_tui project
"use strict"

var {Timetrap, Timetrap_Error} = require('./Timetrap');

function register_actions(timetrap){
    timetrap.on('db_change', (payload) =>{
        console.log("got here: db_change");
    });
}

function main(callback) {

    // grab configurations
    // _this.watched_file = "/home/karl/Documents/Heorot/timetrap/timetrap.db"

    // new timetrap
    var timetrap = new Timetrap({});

    //register local catchers
    register_actions(timetrap);

    ///////////////// Basic functionality
    // TODO: ask user if it's ok to run this.
    // timetrap.callCommand();
    // timetrap.callCommand({type:'changeSheet', sheet:'default'});
    // timetrap.callCommand({type:'checkOut', sheet:'default'});
    // timetrap.callCommand({type:'checkIn', sheet:'default', content:"testing checkin"});
    // console.log("-------------------------------");

    ///////////////// DB monitor
    // console.log("starting db monitor: touch your db for results, C-c to break");
    // timetrap.monitorDBStart();
    // console.log("-------------------------------");


    // ///////////////// Debugging
    // Object.keys(timetrap.command_types).forEach(function(key){
    //     // expect(timetrap.command_types[key].description).toBeDefined();
    //     console.log(key+":"+timetrap.command_types[key].required);
    // });
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

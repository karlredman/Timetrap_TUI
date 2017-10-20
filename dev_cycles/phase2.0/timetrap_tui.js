// timetrap_tui.js
// entrypoint for timetrap_tui project
"use strict"

var util = require('util');

var {Timetrap, Timetrap_Error} = require('./Timetrap');

function register_actions(timetrap){
    timetrap.on(timetrap.emit_types.db_change.name, (payload) =>{
        console.log("main|got here: db_change");
        timetrap.dumpOutput(payload.data, 'console');
    });
    timetrap.on(timetrap.emit_types.command_complete.name, (payload) =>{
        console.log("main|got here: command_complete");
        timetrap.dumpOutput(payload.data, 'console');
    });
    timetrap.on(timetrap.emit_types.checkout_all_sheets.name, (payload) =>{
        console.log("main|got here: checkout_all_sheets");
        timetrap.dumpOutput(payload.data, 'console');
    });
}

function main(callback) {

    // grab configurations
    let watched_file = "/home/karl/Documents/Heorot/timetrap/timetrap.db"

    // new timetrap
    let timetrap = new Timetrap({watched_db_file: watched_file});

    //register local catchers
    register_actions(timetrap);


    // testing id
    let now = Date.now();


    /////////////////////////////////////////////
    ///////////////// Basic functionality
    /////////////////////////////////////////////

    // TODO: ask user if it's ok to run this.

    // Asynchronous calls:
    // timetrap.callCommand();
    // timetrap.callCommand({type:'changeSheet', sheet:'default'});
    // timetrap.callCommand({target: this, type:'checkOut', sheet:'default'});
    // timetrap.callCommand({type:'checkOut', sheet:'default'});
    // timetrap.callCommand({type:'checkIn', sheet:'default', content:"testing checkin"+now});
    // timetrap.callCommand({type:'edit', sheet:'default', content:"testing checkin"+now});
    // timetrap.callCommand({type:'week', sheet:'default'});
    // timetrap.callCommand({type:'list'});
    // console.log("-------------------------------");

    // Syncronous calls
    // timetrap.callCommand({type: 'now', sync: true});
    // timetrap.callCommand({type:'changeSheet', sheet:'default'});
    // timetrap.callCommand({target: this, type:'checkOut', sheet:'default', sync: true});
    // timetrap.callCommand({target: this, type:'checkIn', sheet:'default', content:"testing checkin"+now, sync: false});
    // timetrap.callCommand({type:'edit', sheet:'default', content:"testing checkin"+now, sync: true});
    // timetrap.callCommand({type:'week', sheet:'default', sync: true});
    // console.log("-------------------------------");


    /////////////////////////////////////////////
    ///////////////// Utilities
    /////////////////////////////////////////////

    ///////////////// checkout of all sheets

    // timetrap.checkoutAllSheets();

    // checkoutAllSheets is **synchronous**
    // timetrap.callCommand({type:'checkIn', sheet:'default', content:"testing checkin"+now, sync: true});
    // timetrap.callCommand({type:'checkIn', sheet:'Personal', content:"testing checkin"+now, sync: true});
    // timetrap.callCommand({type:'checkIn', sheet:'Projects', content:"testing checkin"+now, sync: true});
    // timetrap.callCommand({type:'checkIn', sheet:'testsheet', content:"testing checkin"+now, sync: true});
    // timetrap.checkoutAllSheets();
    // timetrap.callCommand({type:'checkIn', sheet:'default', content:"testing checkin"+now, sync: true});
    // timetrap.callCommand({type:'checkIn', sheet:'Personal', content:"testing checkin"+now, sync: true});
    // timetrap.callCommand({type:'checkIn', sheet:'Projects', content:"testing checkin"+now, sync: true});
    // timetrap.callCommand({type:'checkIn', sheet:'testsheet', content:"testing checkin"+now, sync: true});

    ///////////////// DB monitor

    // console.log("starting db monitor: touch your db for results, C-c to break");
    // timetrap.monitorDBStart();
    // console.log("-------------------------------");

    /////////////////////////////////////////////
    ///////////////// Special Notes
    /////////////////////////////////////////////

    // Note: **async** reads all at once work as expected
    // //
    // timetrap.callCommand({type:'display', sheet:'default'});
    // timetrap.callCommand({type:'display', sheet:'Personal'});
    // timetrap.callCommand({type:'display', sheet:'Projects'});
    // timetrap.callCommand({type:'display', sheet:'testsheet'});

    // NOTE: multiple **async** writing commands (i.e. edit, checkin) will happen in the wrong order
    // switching to different sheets is faster for timetrap to execute than checkins.
    //
    // timetrap.callCommand({type:'checkIn', sheet:'default', content:"testing checkin"+now});
    // timetrap.callCommand({type:'checkIn', sheet:'Personal', content:"testing checkin"+now});
    // timetrap.callCommand({type:'checkIn', sheet:'Projects', content:"testing checkin"+now});
    // timetrap.callCommand({type:'checkIn', sheet:'testsheet', content:"testing checkin"+now});

    // NOTE: multiple sheet's can be checked in **sync** without any issues
    //
    // timetrap.callCommand({type:'checkIn', sheet:'default', content:"testing checkin"+now, sync: true});
    // timetrap.callCommand({type:'checkIn', sheet:'Personal', content:"testing checkin"+now, sync: true});
    // timetrap.callCommand({type:'checkIn', sheet:'Projects', content:"testing checkin"+now, sync: true});
    // timetrap.callCommand({type:'checkIn', sheet:'testsheet', content:"testing checkin"+now, sync: true});

    /////////////////////////////////////////////
    ///////////////// Debugging
    /////////////////////////////////////////////


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

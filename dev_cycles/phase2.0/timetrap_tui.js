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
    let timetrap = new Timetrap({});

    //register local catchers
    register_actions(timetrap);


	// testing id
	let now = Date.now();


    ///////////////// Basic functionality
    // TODO: ask user if it's ok to run this.
    // // Asynchronous calls
    // timetrap.callCommand();
    // timetrap.callCommand({type:'changeSheet', sheet:'default'});
	// timetrap.callCommand({type:'checkOut', sheet:'default'});
	// timetrap.callCommand({type:'checkIn', sheet:'default', content:"testing checkin"+now});
	// timetrap.callCommand({type:'edit', sheet:'default', content:"testing checkin"+now});
	// timetrap.callCommand({type:'week', sheet:'default'});
    // console.log("-------------------------------");

    // Syncronous calls
	// timetrap.callCommand({sync: true});
    // timetrap.callCommand({type:'changeSheet', sheet:'default'});
	// timetrap.callCommand({type:'checkOut', sheet:'default', sync: true});
	// timetrap.callCommand({type:'checkIn', sheet:'default', content:"testing checkin"+now, sync: true});
	// timetrap.callCommand({type:'edit', sheet:'default', content:"testing checkin"+now, sync: true});
	timetrap.callCommand({type:'week', sheet:'default', sync: true});
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
    // timetrap.config.db_monitor.IN_MODIFY_count = 1;
    // timetrap.monitorDBCatchTimer();
    //console.log(typeof timetrap.emit_types.db_change);


	// const {spawn, spawnSync} = require('child_process');
	// const cmd = spawnSync('timetrap', ['out','default'], {cwd: '/tmp'});
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

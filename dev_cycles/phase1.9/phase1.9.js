"use strict";

// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib');

// app packages
var Configuration = require('./config');
var DirTree = require('./dirtree');
var ViewControl = require('./viewcontrol');

var screen = blessed.screen({
    autoPadding: true,
    smartCSR: true
});

// Quit on `q`, or `Control-C` when the focus is on the screen.
screen.key(['C-c'], function(ch, key) {
    //console.log(JSON.stringify(ch)+":"+JSON.stringify(key))
    process.exit(0);
});

function main(argv, callback) {
    //get config data
    let config = new Configuration();
    config.fetch();

    //adjust config with commandline

    // instantiate supporting objects
    let dirtree = new DirTree(config);

    // the controller of views
    //ViewControl.viewcontrol = new ViewControl(config, screen);
    ViewControl.viewcontrol = new ViewControl({config: config, screen: screen, dirtree: dirtree});

    // return start(data, function(err) {
    //     if (err) return callback(err);
    //     return callback();
    // });
    //
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

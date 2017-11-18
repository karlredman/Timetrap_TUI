"use strict";

// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib');
var BaseView = require('./ViewBase.js');
var DialogMessage = require('./DialogMessage.js');
var Configuration = require('./Configuration.js');

var screen = blessed.screen({
    autoPadding: true,
    dockBorders: true,
    ignoreDockContrast: true,
    ignoreLocked: ['C-c'],
    sendFocus: true,
    smartCSR: true,
});

// Quit on `Control-C`
screen.key(['C-c'], function(ch, key) {
    screen.destroy();
    process.exit();
    //process.exit(0);
});


function main(argv, callback) {

    let loading_dialog = new DialogMessage({target: this, parent: screen});
    loading_dialog.alert('got here');

    let config = new Configuration();
    config.fetch();
    let base = new BaseView({screen: screen, config: config});

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

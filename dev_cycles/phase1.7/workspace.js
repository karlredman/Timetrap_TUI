"use strict"
var blessed = require('blessed');


function Workspace(options) {

	// set overridable defaults
    options = options || {};

    options.keys = true;
    options.mouse = options.mouse || true;
    options.vi = options.vi || true;
    options.tags = options.tags || true;

    options.scrollable = options.scrollable || true;
    options.scrollbar = options.scrollbar || {};
    options.scrollbar.ch = options.scrollbar.ch || ' ';

    options.style = options.style || {};
    options.style.scrollbar = options.style.scrollbar || {};
    options.style.scrollbar.inverse = options.style.scrollbar.inverse || true;

    // failsafe: in case parent is not passed in options
    options.parent = options.parent || screen;

    // inherit from box
	blessed.box.call(this, options);

    this.screen.render();
}


MainWin.prototype = Object.create(blessed.listbar.prototype);
MainWin.prototype.constructor = MainWin;

// function prototypes go here


MainWin.prototype.type = 'MainWin';
module.exports = MainWin;

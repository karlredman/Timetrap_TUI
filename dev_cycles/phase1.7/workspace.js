"use strict"
var blessed = require('blessed'),
    Node = blessed.Node,
    Box = blessed.Box;

function Workspace(options) {
    if (!(this instanceof Node)) return new Workspace(options);

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
    this.data = {};
    this.nodeLines = [];
    this.lineNbr = 0;

	blessed.Box.call(this, options);

    // options.parent.render();
    this.screen.render();
}


Workspace.prototype = Object.create(Box.prototype);
Workspace.prototype.constructor = Workspace;

// function prototypes go here

Workspace.prototype.type = 'Workspace';
module.exports = Workspace;

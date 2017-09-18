"use strict"
var blessed = require('blessed'),
    Box = blessed.Box,
    Node = blessed.Node;

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

    options.wrap = true;

    // inherit from box
    this.data = {"text here": "things"};
    this.nodeLines = [];
    this.lineNbr = 0;


	blessed.Box.call(this, options);

    //this.screen.render();
}


Workspace.prototype = Object.create(Box.prototype);
Workspace.prototype.constructor = Workspace;

Workspace.prototype.register_actions = function(view){

	this.view = view;

    this.on('thing', function(node) {
		console.log("workspace thing received");
	});

}

Workspace.prototype.type = 'Workspace';
module.exports = Workspace;

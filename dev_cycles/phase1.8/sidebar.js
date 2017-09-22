"use strict";
var blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    Node = blessed.Node;
// Box = blessed.Box,


function SideBar(options) {
    if (!(this instanceof Node)) return new SideBar(options);

    //options
    // set overridable defaults
    options = options || {};

    //DO NOT SET HEIGHT -there's a bug according to blessed-contrib/tree.js
    //options.height = options.height || 1;
    options.width = options.width || "shrink";

    // to be overridden
    // default to undefined so parent takes over
    options.keys = options.keys || ['space'];

    options.vi = options.vi || true;
    options.mouse = options.mouse || true;
    options.autoCommandKeys = options.autoCommandKeys || true;

    options.tags = options.tags || true;
    options.align = options.align || "left";

    options.data = options.data || {};

    // causes crash
    // options.scrollable = options.scrollable || true;
    // options.scrollbar = options.scrollbar || true;

    options.template = options.template || {};
    options.template.lines = options.template.lines || true;

    options.style = options.style || {};
    options.style.bg = options.style.bg || undefined;
    options.style.fg = options.style.fg || "blue";

    options.style.selected = options.style.selected || {};
    options.style.selected.bg = options.style.selected.bg || "blue";
    options.style.selected.fg = options.style.selected.fg || "white";

    options.style.item = options.style.item || {};
    options.style.item.hover = options.style.item.hover || {};
    options.style.item.hover.bg = options.style.item.hover.bg || "green";
    options.style.item.hover.fg = options.style.item.hover.fg || null;

    // failsafe: in case parent is not passed in options
    options.parent = options.parent || screen;



    options.wrap = false;
    options.hidden = false;
    options.style.inverse = false;
    options.fixed = true;


    //inherit from textarea
    contrib.tree.call(this, options);

    //custom funcs go here

    //this.screen.render();
}
SideBar.prototype = Object.create(contrib.tree.prototype);
SideBar.prototype.constructor = SideBar;


SideBar.prototype.register_actions = function(view){

	this.view = view;
	let _this = this;

	this.rows.key(['enter'], function(ch, key) {
		let selectedNode = _this.nodeLines[this.getItemIndex(this.selected)];
		_this.emit('action', selectedNode, this.getItemIndex(this.selected));
		_this.emit('select', selectedNode, this.getItemIndex(this.selected));
		_this.view.widgets.workspace.emit('thing', selectedNode, this.getItemIndex(this.selected));
	});

    this.on('thing', function(node) {
		console.log("sidebar thing received");
	});

    // this.on('action', function(node) {
		// console.log("sidebar action received");
	// });

    // this.on('select', function(node) {
		// console.log("sidebar select received");
	// });

    this.rows.on('keypress', function(ch, key) {
        if (key.name === 'tab') {
            if (!key.shift) {
                _this.view.setWinFocusNext();
            } else {
                _this.view.setWinFocusPrev();
            }
            return;
        }
    });
}


SideBar.prototype.type = 'SideBar';
module.exports = SideBar;

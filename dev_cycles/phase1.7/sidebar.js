"use strict";
var contrib = require('blessed-contrib');
    // Node = blessed.Node,
    // Box = blessed.Box,


function SideBar(options) {

    //options
	// set overridable defaults
    options = options || {};

    //DO NOT SETH HEIGHT -there's a bug according to blessed-contrib/tree.js
    //options.height = options.height || 1;
    options.width = options.width || "shrink";

    options.keys = options.keys || [];
    options.vi = options.vi || true;
    options.mouse = options.mouse || true;
    options.autoCommandKeys = options.autoCommandKeys || true;

    options.tags = options.tags || true;
    options.align = options.align || "left";

    options.data = options.data || {};

    options.scrollable = options.scrollable || true;
    options.scrollbar = options.scrollbar || true;

    options.template = options.template || {};
    options.template.lines = options.template.lines || true;

    options.style = options.style || {};
    options.style.fg = options.style.fg || "blue";
    options.style.bg = options.style.bg || null;

    options.style.selected = options.style.selected || {};
    options.style.selected.bg = options.style.selected.bg || "blue";
    options.style.selected.fg = options.style.selected.fg || "white";

    options.style.item = options.style.item || {};
    options.style.item.hover = options.style.item.hover || {};
    options.style.item.hover.bg = options.style.item.hover.bg || "green";
    options.style.item.hover.fg = options.style.item.hover.fg || null;


    // failsafe: in case parent is not passed in options
    options.parent = options.parent || screen;

    //inherit from textarea
    contrib.tree.call(this, options);

    //custom funcs go here


    this.screen.render();
}
SideBar.prototype = Object.create(contrib.tree.prototype);
SideBar.prototype.constructor = SideBar;


//function prototypes go here


SideBar.prototype.type = 'SideBar';
module.exports = SideBar;

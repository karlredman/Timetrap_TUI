"use strict"

var blessed = require('blessed');


function ActionBar(options) {

	// set overridable defaults
    options = options || {};
	options.height = options.height || 1;
	options.bg = options.bg || null;
	options.fg = options.fg || 'white';
    options.align = options.align || 'left',

    // failsafe: in case parent is not passed in options
    options.parent = options.parent || screen;

    //inherit from textarea
	blessed.textarea.call(this, options);
}
ActionBar.prototype = Object.create(blessed.textarea.prototype);
ActionBar.prototype.constructor = ActionBar;


ActionBar.prototype.type = 'ActionBar';
module.exports = ActionBar;

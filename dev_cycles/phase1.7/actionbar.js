"use strict"

var blessed = require('blessed');


function ActionBar(options) {

    // failsafe: in case parent is not passed in options
    options.parent = options.parent || screen;

	// set overridable defaults
    options = options || {};
	options.height = options.height || 1;
	options.bg = options.bg || '';
	options.fg = options.fg || 'white';

    //inherit from textarea
	blessed.textarea.call(this, options);
}
ActionBar.prototype = Object.create(blessed.textarea.prototype);
ActionBar.prototype.constructor = ActionBar;


ActionBar.prototype.type = 'ActionBar';
module.exports = ActionBar;

"use strict"

var blessed = require('blessed');


function ActionBar(options) {

	//if (!(this instanceof blessed.textarea)) return new actionBar(options);

	// init
	var self = this;
	options = options || {};

	// required
    this.screen = options.screen;

	// defaults
	options.height = 1;
	options.bg = 'none';
	options.fg = 'white';

	// overwrite defaults with passed in value
	this.options=options;

	//um, wtf
	//blessed.textarea.call(this, options);
	//Box.call(this, options);

	this.widget = blessed.textarea(this.options);
}

ActionBar.prototype.setvalue = function(str){
	this.options.value=str;
	this.widget.value=str;
	this.screen.render();
}

ActionBar.prototype.type = 'ActionBar';

module.exports = ActionBar;



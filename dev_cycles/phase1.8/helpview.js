
"use strict";

// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    Node = blessed.Node;

function HelpView(options) {
    this.classname = "HelpView";
    if (!(this instanceof Node)) return new HelpView(options);

    // set overridable defaults
    options = options || {};

	// set overridable defaults
    options = options || {};
	options.height = options.height || 1;
	options.bg = options.bg || null;
	options.fg = options.fg || 'white';
    options.align = options.align || 'left',

    // failsafe: in case parent is not passed in options
    options.parent = options.parent || screen;

    let _this=this;
    this.screen = options.screen;

    //data="this is my data for help";
    //options.value = data;

	blessed.textarea.call(this, options);

    this.on('keypress', function(ch, key) {
        if (key.name === 'q') {
            _this.screen.emit('destroy', this.classname );
            return;
        }
    });

}
HelpView.prototype = Object.create(blessed.textarea.prototype);
HelpView.prototype.constructor = HelpView;

HelpView.prototype.hide = function(){
    this.options.hidden = true;
}

HelpView.prototype.type = 'HelpView';
module.exports = HelpView;

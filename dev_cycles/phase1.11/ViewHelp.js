"use strict";

// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    Node = blessed.Node;

function ViewHelp(options) {
    let _this=this;

    if (!(this instanceof Node)) return new ViewHelp(options);

    // set overridable defaults
    options = options || {};

	// set overridable defaults
    options = options || {};
	options.height = options.height || 1;
	options.bg = options.bg || null;
	options.fg = options.fg || 'white';
    options.align = options.align || 'left',

    // failsafe: in case parent is not passed in options -set to fail
    options.parent = options.parent || undefined;

    //data="this is my data for help";
    //options.value = data;

	blessed.textarea.call(this, options);

    _this.on('keypress', function(ch, key) {
        if (key.name === 'escape') {
            //requires 2 key presses
            _this.options.parent.emit('destroy', "ViewHelp");
            return;
        }
        if (key.name === 'q') {
            _this.options.parent.emit('destroy', "ViewHelp");
            return;
        }
    });

}
ViewHelp.prototype = Object.create(blessed.textarea.prototype);
ViewHelp.prototype.constructor = ViewHelp;

ViewHelp.prototype.hide = function(){
    this.options.hidden = true;
}

ViewHelp.prototype.type = 'ViewHelp';
module.exports = ViewHelp;

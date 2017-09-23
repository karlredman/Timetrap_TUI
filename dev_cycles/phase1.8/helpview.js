
"use strict";

// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    Node = blessed.Node;

function HelpView(options) {
    let _this=this;

    if (!(this instanceof Node)) return new HelpView(options);

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
        if (key.name === 'q') {
            _this.options.parent.emit('destroy', "HelpView");
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

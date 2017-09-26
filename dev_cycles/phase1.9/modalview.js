"use strict";

// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    Node = blessed.Node,
    program = blessed.program();

function ModalView(options) {
    let _this=this;

    if (!(this instanceof Node)) return new ModalView(options);

    // set overridable defaults
    options = options || {};

    options.mouse = options.mouse || false;
    options.sendFocus = options.sendFocus || true;
    options.draggable = options.draggable || false;
    options.keyable = options.keyable || false;
    options.keys = options.keys || null;


    options.lockKeys = options.lockKeys || true;
    options.focused = options.focused || true;
    options.grabKeys = options.grabKeys || true;

    options.top = options.top || 0;
    options.left = options.left || 0;
	options.height = options.height || "100%";
	options.width = options.width || "100%";

	options.bg = options.bg || null;
	options.fg = options.fg || 'white';
    options.align = options.align || 'left';

    options.style = options.style || {};
    options.style.transparent = options.style.transparent || true;

    // failsafe: in case parent is not passed in options -set to fail
    options.parent = options.parent || undefined;

    program.disableMouse();

	blessed.box.call(this, options);

    _this.on('keypress', function(){
        //console.log("keypress: got here");
    });
    _this.on('blur', function(){
        // console.log("blur: got here");
    });
    _this.on('focus', function(){
        // console.log("focus: got here");
    });
    _this.on('mouse', function(){
        // console.log("mouse: got here");
    });

    // TODO: save the current screen events from screen.js _listeners
    //_this.old_onScreenEvent = _this.onScreenEvent;

    //remove screen events (i.e. menubar)
    _this.removeScreenEvent('keypress', null);

    // _this.on('keypress', function(ch, key) {
    //     if (key.name === 'escape') {
    //         //requires 2 key presses
    //         _this.options.parent.emit('destroy', "ModalView");
    //         return;
    //     }
    //     if (key.name === 'q') {
    //         _this.options.parent.emit('destroy', "ModalView");
    //         return;
    //     }
    //     if (key.name === 'enter') {
    //         _this.options.parent.emit('destroy', "ModalView");
    //         return;
    //     }
    // });
}
ModalView.prototype = Object.create(blessed.box.prototype);
ModalView.prototype.constructor = ModalView;

ModalView.prototype.destroy = function(){
    let _this=this;

    // TODO:
    //I'm not getting why this doesn't work
    // looks like I was saving the wrong thing
    // see screen.js _listeners
    //_this.onScreenEvent = _this.old_onScreenEvent;

    return blessed.box.prototype.destroy.call(this);
}

ModalView.prototype.type = 'ModalView';
module.exports = ModalView;

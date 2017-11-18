"use strict";

// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    Node = blessed.Node;

function Dialog(options) {
    let _this=this;

    if (!(this instanceof Node)) return new Dialog(options);

    // set overridable defaults
    options = options || {};

    options.sendFocus = options.sendFocus || true;

    //center the form
    // options.top = options.top || "center";
    // options.left = options.left || "center";
    // options.height = options.height || "50%";
    // options.width = options.width || "50%";

    options.shadow = options.shadow || false;

    options.bg = options.bg || "white";
    options.fg = options.fg || "blue";
    // options.bg = options.bg || null;
    // options.fg = options.fg || 'white';
    //options.align = options.align || 'left';

    options.keys = options.keys || true;
    options.vi = options.vi || true;

    options.scrollable = options.scrollable || true;
    options.scrollbar = options.scrollbar || {};
    options.scrollbar.ch = options.scrollbar.ch || ' ';

    options.style = options.style || {};
    options.style.scrollbar = options.style.scrollbar || {};
    options.style.scrollbar.inverse = options.style.scrollbar.inverse || true;

    options.border = options.border || {};
    options.border.type = options.border.type || 'line';

    options.style = options.style || {};

    options.style.bg = options.style.bg || "lightblue";
    options.style.fg = options.style.fg || "black";

    options.style.border = options.style.border || {};
    options.style.border.type = options.style.border.type || 'line';
    options.style.border.bg = options.style.border.bg || 'black';

    options.style.hover = options.style.hover || {};
    options.style.hover.bg = options.style.hover.bg || 'green';


    // failsafe: in case parent is not passed in options -set to fail
    options.parent = options.parent || undefined;

    //data="this is my data for help";
    //options.value = data;

    blessed.form.call(this, options);

    //_this.options = options;
    options.dialog = options.dialog || {};

    if (options.dialog.submitBtn){
        _this.submit = blessed.button({
            parent: _this,
            mouse: true,
            keys: true,
            shrink: false,
            padding: {
                left: 1,
                right: 1
            },
            //left: 10,
            right: 11,
            //top: 2,
            bottom: 1,
            shrink: true,
            name: 'submit',
            content: options.dialog.input?'Submit':'  OK  ',
            style: {
                bg: 'blue',
                focus: {
                    bg: 'red'
                },
                hover: {
                    bg: 'red'
                }
            }
        });
        _this.submit.on('press', function() {
            _this.options.dialog.caller.emit('modal', {action:"submit", content:"submitted content"});
            _this.options.parent.emit('destroy', "Dialog");
        });
    }

    _this.cancel = blessed.button({
        parent: _this,
        mouse: true,
        keys: true,
        shrink: true,
        padding: {
            left: 1,
            right: 1
        },
        //left: 20,
        right: 1,
        //top: 2,
        bottom: 1,
        shrink: true,
        //name: options.submitBtn?'OK':'Cancel',
        name: 'cancel',
        content: options.submitBtn?'OK':'Cancel',
        style: {
            bg: 'blue',
            focus: {
                bg: 'red'
            },
            hover: {
                bg: 'red'
            }
        }

    });

    // //save the current screen events
    // _this.old_onScreenEvent = _this.onScreenEvent;

    // //remove screen events (i.e. menubar)
    // _this.removeScreenEvent('keypress', null);


    _this.cancel.on('press', function() {
        _this.options.parent.emit('destroy', "Dialog");
    });

    _this.on('keypress', function(ch, key) {
        if (key.name === 'escape') {
            //requires 2 key presses
            // TODO: escape is problematic
            _this.options.parent.emit('destroy', "Dialog");
            return;
        }
        if (key.name === 'q') {
            _this.options.parent.emit('destroy', "Dialog");
            return;
        }
    });

}
Dialog.prototype = Object.create(blessed.form.prototype);
Dialog.prototype.constructor = Dialog;

Dialog.prototype.destroy = function(){
    let _this=this;

    _this.cancel.destroy();
    if( ! (_this.submit === undefined) ){
        _this.submit.destroy();
    }

    return blessed.box.prototype.destroy.call(this);
}

Dialog.prototype.type = 'Dialog';
module.exports = Dialog;

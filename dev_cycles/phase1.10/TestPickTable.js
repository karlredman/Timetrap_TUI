"use strict";
var blessed = require('blessed'),
    contrib = require('contrib'),
    Box = blessed.Box,
    Node = blessed.Node;

var util = require('util');

function DialogBigBox(options) {
    if (!(this instanceof Node)) return new DialogBigBox(options);

    let _this = this;

    // set overridable defaults
    options = options || {};

    options.top = 0;
    options.left = 0;
    options.right = 0;
    options.bottom = 0;
    options.border = true;
    options.content = "";
    //options.autofocus= true; // TODO: what does this actually do?

    //allows only screen level (i.e. menubar) keys
    options.lockKeys = true;

    options.keys = true;
    options.mouse = options.mouse || true;
    options.vi = options.vi || true;
    options.tags = options.tags || true;

    options.scrollable = options.scrollable || true;
    options.scrollbar = options.scrollbar || {};
    options.scrollbar.ch = options.scrollbar.ch || ' ';

    options.style = options.style || {};
    options.style.scrollbar = options.style.scrollbar || {};
    options.style.scrollbar.inverse = options.style.scrollbar.inverse || true;

    // failsafe: in case parent is not passed in options
    options.parent = options.parent || screen;

    options.wrap = true;

    // inherit from box
    this.data = {"text here": "things"};
    this.nodeLines = [];
    this.lineNbr = 0;


    blessed.Box.call(this, options);

    //this.focus();
    this.register_actions();
    this.focus();

    this.screen.render();
}


DialogBigBox.prototype = Object.create(Box.prototype);
DialogBigBox.prototype.constructor = DialogBigBox;

DialogBigBox.prototype.register_actions = function(){

    let _this = this;
    //this.view = view;

    _this.on('keypress', function(ch, key) {
        if ( (key.name === 'escape')
            || (key.name === 'tab')
        )
        {
            _this.destroy();
            _this.screen.render();
        }
        if ( (key.name === 'space')
            || ( key.name === 'pagedown')
        )
        {
            //console.log(util.inspect(key, true))
            _this.emit('keypress', 'C-d',{name:'d',sequence: '\u0004', ctrl: true, full:'C-d'})
        }
        if ( key.name === 'pageup')
        {
            _this.emit('keypress', 'C-u',{name:'u',sequence: '\u0015', ctrl: true, full:'C-u'})
        }

    });

    // _this.on('blur', function() {
    //     //handlels change in focus (i.e. menubar, etc.)
    //     _this.destroy();
    //     _this.screen.render();
    // });
}

DialogBigBox.prototype.type = 'DialogBigBox';
module.exports = DialogBigBox;

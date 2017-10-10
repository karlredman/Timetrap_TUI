"use strict";
var blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    Box = blessed.Box,
    Node = blessed.Node;

var TestMenuBar = require('./TestMenuBar');

var util = require('util');

function TestPickTable(options) {
    if (!(this instanceof Node)) return new TestPickTable(options);

    let _this = this;
    this.view = options.view;

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

    //this.setContent("some content");
    this.focus();

    //menubar at top
    this.menubar = new TestMenuBar({
        parent: _this.screen,
        view: this.view,
        autoCommandKeys: true,
        left: 0,
        top: 0,
    });

    this.screen.render();
}
TestPickTable.prototype = Object.create(Box.prototype);
TestPickTable.prototype.constructor = TestPickTable;

// TestPickTable.prototype.destroy = function(){
//     let _this = this;
//     _this.menubar.destroy();
//     _this.destroy();
//     _this.screen.render();
// }

TestPickTable.prototype.register_actions = function(){

    let _this = this;
    //this.view = view;

    _this.on('keypress', function(ch, key) {
        if ( (key.name === 'escape')
            || (key.name === 'tab')
        )
        {
            _this.view.widgets.menubar.emit('destroy_TestPickTable', )
            // _this.destroy();
            // _this.screen.render();
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

TestPickTable.prototype.type = 'TestPickTable';
module.exports = TestPickTable;

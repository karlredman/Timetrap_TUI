"use strict";
var blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    Box = blessed.Box,
    Node = blessed.Node;
var DialogMessage = require('./DialogMessage'),
    TestMenuBar = require('./TestMenuBar'),
    TestPickTableList = require('./TestPickTableList');
var Logger = require('./PanelLoggerBox.js');

var util = require('util');

function TestPickTable(options) {
    if (!(this instanceof Node)) return new TestPickTable(options);

    let _this = this;
    this.view = options.view;
    _this.config = this.view.config;

    // set overridable defaults
    options = options || {};

    options.top = 1;
    options.left = 0;
    options.border = 'line';
    //options.right = 0;
    options.bottom = 1;
    options.content = "";
    options.autofocus= true; // TODO: what does this actually do?

    //allows only screen level (i.e. menubar) keys //TODO: what does tis actually do?
    //options.lockKeys = true;

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
    // options.style.scrollbar.bg = "red";
    // options.style.scrollbar.fg = "blue";

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
        // lockkeys: true,
        left: 0,
        top: 0,
        //border: 'line'
    });
    //this.menubar.grabKeys = true;
    this.menubar.register_actions();
    this.menubar.focus();


    _this.list = new TestPickTableList({
        parent: _this.screen,
        view: this.view,
        // lockkeys: true,
        left: 0,
        top: 1,
        border: 'line',
        bottom: 1
    });

    // line to show menu is focused
    _this.menuline = new blessed.line({
        parent: _this.screen,
        view: this.view,
        left: 0,
        height: 1,
        top: 1,
        orientation: "horizontal",
        type: 'line',
        fg: "green"
    });

    // _this.logger = new Logger({
    //     parent: _this.screen,
    //     view: _this.view,
    //     left: 0,
    //     bottom: 0,
    //     height: 1,
    // });
    // _this.logger.setItems(_this.view.widgets.logger.logLines);
    // // _this.scrollTo(this.logLines.length)
    _this.view.widgets.logger.msg("Changed view: TestPickTable", _this.view.widgets.logger.loglevel.devel.warning);


    this.screen.render();
    //console.log("\n\n\n\n\n\n\n\n\n\n\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"+lc)
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
            //|| (key.name === 'tab')
        )
        {
            _this.view.emit('destroy_TestPickTable', )
            // _this.destroy();
            // _this.screen.render();
        }
        if (
            ( key.name === 'pagedown' )
            // || ( key.name === 'space' )
        )
        {
            //console.log(util.inspect(key, true))
            //TODO: exact codes are bad -find the right thing for other terminals
            //_this.emit('keypress', 'C-d',{name:'d',sequence: '\u0004', ctrl: true, full:'C-d'})
            _this.emit('keypress', 'C-d',{name:'d', ctrl: true, full:'C-d'})
        }
        if ( key.name === 'pageup')
        {
            //_this.emit('keypress', 'C-u',{name:'u',sequence: '\u0015', ctrl: true, full:'C-u'})
            _this.emit('keypress', 'C-u',{name:'u', ctrl: true, full:'C-u'})
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

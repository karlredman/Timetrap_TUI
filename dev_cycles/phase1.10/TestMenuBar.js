"use strict"
var blessed = require('blessed'),
    Node = blessed.Node;
var DialogPrompt = require('./DialogPrompt'),
    DialogQuestion = require('./DialogQuestion'),
    DialogMessage = require('./DialogMessage'),
    ListDisplay = require('./MenuDisplayList'),
    ListResume = require('./MenuResumeList'),
    BigBox = require('./DialogBigBox');
var util = require('util');

function TestMenuBar(options) {


    if (!(this instanceof Node)) return new TestMenuBar(options);
    let _this=this;

    this.options = options;
    this.screen = options.parent;
    this.view = options.view;
    this.log = this.view.widgets.logger; //?? why is this not calling log correctly
    //this.view.widgets.logger.msg("some message", this.view.widgets.logger.loglevel.devel.message);
    //
    this.loading_dialog;
    this.display_menu;
    this.resume_menu;


    // set overridable defaults
    options = options || {};
    options.keys = null;            //we're overriding keys
    options.xkeys = true;
    options.height = options.height || 1;
    options.mouse = options.mouse || true;
    options.vi = options.vi || true;
    options.scrollable = options.scrollable || true;

    //manage styles
    options.style = options.style || {};

    options.style.item = options.style.item || {};
    options.style.item.bg = options.style.item.bg || null;
    options.style.item.fg = options.style.item.fg || "white";

    options.style.prefix = options.style.prefix || {};
    options.style.prefix.bg = options.style.prefix.bg || null;
    options.style.prefix.fg = options.style.prefix.fg || "yellow";

    //options.invertSelected = true;

    options.style.selected = options.style.selected || {};
    options.style.selected.bg = options.style.selected.bg || "black";
    options.style.selected.fg = options.style.selected.fg || "lightblue";

    ////////////////
    // TODO: Add 'unselected' state for items (on a timer)
    // options.style.selected.bg = options.style.selected.bg || null;
    // options.style.selected.fg = options.style.selected.fg || "white";

    // if (options.commands || options.items) {
    //     this.setItems(options.commands || options.items);
    // }


    // failsafe: in case parent is not passed in options
    options.parent = options.parent || screen;

    this.options = options;

    // TODO: move this logic to a control location (view?)
    options.items = options.commands || {
        Test1: function(){
            let m = new DialogMessage({target: _this, parent: _this.screen});
            m.alert('got here: test1');

            // setTimeout(function(){
            //     _this.select(0);
            //     _this.screen.render();
            // }, 1000);
        },
        Test2: function(){
            let m = new DialogMessage({target: _this, parent: _this.screen});
            m.alert('got here: test2');

            // setTimeout(function(){
                // _this.select(0);
                // _this.screen.render();
            // }, 1000);
        },
    }

    //inherit from textarea
    // options.lockKeys = true;
    blessed.listbar.call(this, options);
    // this.lockKeys = true;

    //this.screen.render();
}
TestMenuBar.prototype = Object.create(blessed.listbar.prototype);
TestMenuBar.prototype.constructor = TestMenuBar;


TestMenuBar.prototype.register_actions = function(view){

    let _this = this;

    _this.on('keypress', function(ch, key) {
        //custom key bindings
        // if (key.name === 'tab') {
        //     if (!key.shift) {
        //         _this.view.setWinFocusNext();
        //     } else {
        //         _this.view.setWinFocusPrev();
        //     }
        //     return;
        // }
        if (key.name === 'left'
            || (_this.options['vi'] && key.name === 'h')
            //|| (key.shift && key.name === 'tab')
        ) {
            // let item = _this.items[_this.selected];
            // item.style.bg = null;
            // item.style.fg = "white";
            _this.moveLeft();
            //item = _this.items[_this.selected];
            // item.style.bg = "black";
            // item.style.fg = "lightblue";
            _this.screen.render();
            // Stop propagation if we're in a form.
            //if (key.name === 'tab') return false;
            return;
        }
        if (key.name === 'right'
            || (_this.options['vi'] && key.name === 'l')
            //|| key.name === 'tab'
        ) {
            // let item = _this.items[_this.selected];
            // item.style.bg = null;
            // item.style.fg = "white";
            _this.moveRight();
            // item = _this.items[_this.selected];
            // item.style.bg = "black";
            // item.style.fg = "lightblue";
            _this.screen.render();
            // Stop propagation if we're in a form.
            //if (key.name === 'tab') return false;
            return;
        }
        if (key.name === 'enter'
            || (_this.options['vi'] && key.name === 'k' && !key.shift)) {
            _this.emit('action', _this.items[_this.selected], _this.selected);
            _this.emit('select', _this.items[_this.selected], _this.selected);
            let item = _this.items[_this.selected];
            if (item._.cmd.callback) {
                item._.cmd.callback();

                // //TODO: timer to set 'unselected'
                // setTimeout(function(){
                //     // item.style.bg = null;
                //     // item.style.fg = "white";
                //     _this.select(0);
                //     _this.screen.render();
                // }, 1000);
            }
            _this.screen.render();
            return;
        }
    });
}

TestMenuBar.prototype.type = 'TestMenuBar';
module.exports = TestMenuBar;

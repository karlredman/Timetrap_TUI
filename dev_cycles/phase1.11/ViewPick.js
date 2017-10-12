"use strict";

// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib');
var EventEmitter = require('events').EventEmitter;

var util = require('util');

// View panels
var Menubar = require('./MenuPickView');
var Workspace = require('./PanelPickList')
//var Line = require('./Line')

// dialogs
var DialogMessage = require('./DialogMessage');

function ViewPick(options) {
    if (!(this instanceof EventEmitter)) return new ViewPick(options);

    let _this=this;

    //required options
    _this.screen = options.objects.screen;
    _this.config = options.objects.config;
    _this.timetrap = options.objects.timetrap;
    _this.logger = options.logger;
    _this.controller = options.controller;
    _this.sheet = options.sheet;

    //widgets owned by this view
    _this.widgets = {};

    _this.config.view.numwnd = 2;                    //number of windows
    _this.config.view.curwind = 1;                   //current window (starts at 1, screen === 0)

    //call parent constructor
    EventEmitter.call(this);

    /////////////////////////////////////////////////////
    // this view's layout

    //this view's window panes
    _this.pwin ={
        menu: 1,
        mainw: 2,
        logger: 3,
    };

    _this.pwin.first = this.pwin.menu;
    // this.pwin.last = this.pwin.mainw;
    _this.pwin.last = this.pwin.logger;

    //the current pane default
    _this.pwin.curWin = 1;

    //make the widgets
    _this.create_widgets();



    /////////////////////////////////////////////////////
    // this view's control

    _this.curWin=_this.pwin.mainw;

    _this.register_actions();

    // //adompt the logger //TODO: so ugly
    // _this.logger = _this.controller.view.widgets.logger;

    for (let key in _this.widgets) {
        // if (this.widgets.hasOwnProperty(key)) continue;
        _this.widgets[key].register_actions()
    }

    _this.setWinFocus(_this.pwin.mainw);
}
ViewPick.prototype = Object.create(EventEmitter.prototype);
ViewPick.prototype.constructor = ViewPick;

ViewPick.prototype.create_widgets = function()
{
    let _this=this;

    //menubar at top
    _this.widgets.menubar = new Menubar({
        parent: _this.screen,
        view: _this,
        autoCommandKeys: true,
        left: 0,
        top: 0,
        //border: 'line'
    });

    // the main area
    _this.widgets.workspace = new Workspace({
        parent: _this.screen,
        view: _this,
        // lockkeys: true,
        top: 3,
        left: 0,
        bottom: 1,
        border: 'line'
    });

    //used to show log is focused
    _this.widgets.logline = new blessed.line({
        parent: _this.screen,
        view: _this,
        left: 0,
        height: 1,
        bottom: 1,
        orientation: "horizontal",
        type: 'line',
        fg: "green"
    });
    _this.widgets.logline.register_actions = function(){};
    _this.widgets.logline.hide();

    // line to show menu is focused
    _this.widgets.menuline_active = new blessed.line({
        parent: _this.screen,
        view: _this,
        left: 0,
        height: 1,
        top: 1,
        orientation: "horizontal",
        type: 'line',
        fg: "green"
    });
    _this.widgets.menuline_active.register_actions = function(){};

    _this.widgets.menuline_inactive = new blessed.line({
        parent: _this.screen,
        view: _this,
        left: 0,
        height: 1,
        top: 1,
        orientation: "horizontal",
        type: 'line',
        fg: "red"
    });
    _this.widgets.menuline_inactive.register_actions = function(){};

    _this.widgets.statusline = new blessed.box({
        parent: _this.screen,
        top: 2,
        left: 0,
        height: 1,
        content: _this.sheet+" [Today]",
        tags: true,
        align: 'center',
        fg: 'white',
        width: "100%"
    });
    _this.widgets.statusline.register_actions = function(){};
    //_this.widgets.statusline.setContent("");
}

ViewPick.prototype.register_actions = function()
{
    let _this = this;

    _this.on('relay', function(msg){
        // msg = {action: 'action name', item: 'item name'
        _this.controller.emit(msg.action, msg.item);
    });
    _this.on('destroy', function(item){
        if(item === 'all'){
            for (let key in _this.widgets) {
                // if (this.widgets.hasOwnProperty(key)) continue;
                _this.widgets[key].destroy()
                delete _this.widgets[key];
            }
            // _this.menuline.destroy();
            // delete _this.menuline;
            // _this.logline.destroy();
            // delete _this.menuline;
        }
    });

    // _this.on('destroy_TestPickTable', function(){
    //     _this.test_pick.list.destroy();
    //     delete _this.test_pick.list;
    //     _this.test_pick.menubar.destroy();
    //     delete _this.test_pick.menubar;
    //     _this.test_pick.destroy();
    //     delete _this.test_pick;

    //     _this.widgets.menubar = new MenuBar({
    //         parent: _this.screen,
    //         view: _this,
    //         autoCommandKeys: true,
    //         left: 0,
    //         top: 0,
    //     });
    //     _this.widgets.menubar.register_actions();
    //     // _this.widgets.sidebar.focus();
    //     _this.setWinFocus(_this.pwin.side);
    //     _this.screen.render();
    // });

};

ViewPick.prototype.setWinFocus = function(win){
    let _this = this;
    // The focus and effects are managed here so mouse actions don't cause
    // false positives.
    switch(win){
        case _this.pwin.mainw:
            _this.widgets.workspace.options.style.border.fg = "green";
            _this.widgets.logline.hide();
            _this.widgets.menuline_active.show();
            _this.widgets.menuline_inactive.hide();
            _this.widgets.workspace.focus();
            break;
        case _this.pwin.menu:
            _this.widgets.workspace.options.style.border.fg = "red";
            _this.widgets.menuline_active.show();
            _this.widgets.menuline_inactive.hide();
            _this.widgets.logline.hide();
            _this.widgets.menubar.focus();
            break;
        case _this.pwin.logger:
            _this.widgets.workspace.options.style.border.fg = "red";
            _this.widgets.menuline_active.hide();
            _this.widgets.menuline_inactive.show();
            _this.widgets.logline.show();
            _this.logger.focus();
            break;
    }

    _this.pwin.curWin = win;

    //toggle menu colors
    if ( win === _this.pwin.menu ) {
        // menu is active highlight only the selected one
        _this.widgets.menubar.options.style.bg = null;
        _this.widgets.menubar.options.style.fg = "white"

        _this.widgets.menubar.options.style.item.bg = null;
        _this.widgets.menubar.options.style.item.fg = "white"

        _this.widgets.menubar.options.style.prefix.bg = null;
        _this.widgets.menubar.options.style.prefix.fg = "blue";

        _this.widgets.menubar.options.style.selected.bg = null;
        _this.widgets.menubar.options.style.selected.fg = "blue";
    }
    else {
        // menu is not active don't show highlights
        _this.widgets.menubar.options.style.bg = "black";
        _this.widgets.menubar.options.style.fg = "white"

        _this.widgets.menubar.options.style.item.bg = "black";
        _this.widgets.menubar.options.style.item.fg = "white"

        _this.widgets.menubar.options.style.prefix.bg = "black";
        _this.widgets.menubar.options.style.prefix.fg = "lightblack"

        _this.widgets.menubar.options.style.selected.bg = "black";
        _this.widgets.menubar.options.style.selected.fg = "white";
    }
    _this.screen.render();
}

ViewPick.prototype.setWinFocusNext = function(){
    let _this = this;

    //specific behavior
    switch(_this.pwin.curWin){
        case _this.pwin.menu:
            _this.setWinFocus(_this.pwin.mainw);
            break;
        case _this.pwin.mainw:
            _this.setWinFocus(_this.pwin.menu);
            break;
        case _this.pwin.logger:
            _this.setWinFocus(_this.pwin.mainw);
            break;
    }

    // if((_this.curWin+1) > _this.pwin.last){
    //     _this.curWin = _this.pwin.first;
    //     _this.setWinFocus(_this.pwin.first);
    // }
    // else {
    //     _this.curWin++;
    //     _this.setWinFocus(_this.curWin);
    // }
    // _this.screen.render();
}

ViewPick.prototype.setWinFocusPrev = function(){
    let _this = this;

    //specific behavior
    switch(_this.pwin.curWin){
        case _this.pwin.menu:
            _this.setWinFocus(_this.pwin.mainw);
            break;
        case _this.pwin.mainw:
            _this.setWinFocus(_this.pwin.logger);
            break;
        case _this.pwin.logger:
            _this.setWinFocus(_this.pwin.mainw);
            break;
    }
    // if((_this.curWin-1) < _this.pwin.first){
    //     _this.curWin = _this.pwin.last;
    //     _this.setWinFocus(_this.pwin.last);
    // }
    // else {
    //     _this.curWin--;
    //     _this.setWinFocus(_this.curWin);
    // }
    // _this.screen.render();
}

ViewPick.prototype.hideAll = function(){
    let _this = this;
    for (let key in _this.widgets) {

        if (_this.widgets.hasOwnProperty(key)) continue;

        _this.widgets[this.key].hide();
    }
    _this.screen.render();
}

ViewPick.prototype.showAll = function(set_focus){
    let _this = this;
    for (let key in _this.widgets) {

        if (_this.widgets.hasOwnProperty(key)) continue;

        _this.widgets[this.key].show();
    }

    if(set_focus){
        _this.setWinFocus(_this.curwin);
    }
    _this.screen.render();
}

ViewPick.prototype.type = 'ViewPick';
module.exports = ViewPick;

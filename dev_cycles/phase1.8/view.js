"use strict";

// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib');

// panels
var ActionBar = require('./actionbar');
var MenuBar = require('./menubar');
var SideBar = require('./sidebar');
var Workspace = require('./workspace');
var HelpView = require('./helpview');
var DirTree = require('./dirtree');

// program init/startup
function View(config, screen) {

    let _this=this;
	this.widgets = {};
    this.screen = screen;
    this.config = config;

    //fetch projects list
    this.widgets.dirtree = new DirTree(config);
    let proj_tree = this.widgets.dirtree.fetch(config.timetrap_config.tui_projects_template_path);

    this.config.view.sidew = this.widgets.dirtree.getMaxSideNameLen();   //side menu width
    this.config.view.numwnd = 3;                    //number of windows
    this.config.view.curwind = 1;                   //current window (starts at 1, screen === 0)



    /////////////////////////////////////////////////////
    // this view's layout

    //this view's window panes
	this.pwin ={
		mainw: 1,
		side: 2,
		menu: 3,
	};
	this.pwin.first = this.pwin.mainw;
	this.pwin.last = this.pwin.menu;

    //the current pane default
    this.curWin = 1;

    // horizontal seperator line
    let seph = blessed.line({
        parent: screen,
        orientation: 'horizontal',
        //left: _this.config.view.sidew,
        top: 1,
        left: 0,
        right: 0,
        fg: "red"
    });

    // verticle seperator line
    let sepv = blessed.line({
        parent: screen,
        orientation: 'vertical',
        left: _this.config.view.sidew,
        top: 2,
        bottom: 0,
        fg: "green",
        //bg: "black"
    });

    this.create_widgets();

    //seperator  bar color change on focus chage
    //// side menue focus
    this.screen.setEffects(sepv, this.widgets.sidebar, 'focus', 'blur', { fg: 'green' });
    this.screen.setEffects(seph, this.widgets.sidebar, 'focus', 'blur', { fg: 'red' });
    //// top bar
    this.screen.setEffects(sepv, this.widgets.menubar, 'focus', 'blur', { fg: 'red' });
    this.screen.setEffects(seph, this.widgets.menubar, 'focus', 'blur', { fg: 'green' });
    //// main textarea focus
    this.screen.setEffects(sepv, this.widgets.workspace, 'focus', 'blur', { fg: 'red' });
    this.screen.setEffects(seph, this.widgets.workspace, 'focus', 'blur', { fg: 'red' });

    /////////////////////////////////////////////////////
    // this view's control

    this.widgets.sidebar.focus();
    this.curWin=this.pwin.side;

    for (let key in this.widgets) {
        //if (this.widgets.hasOwnProperty(key)) continue;
        this.widgets[key].register_actions(_this)
    }

    //self register
    this.register_actions();

    // set the tree data
    this.widgets.sidebar.setData(proj_tree);

    //screen.render();
}


View.prototype.create_widgets = function()
{
    let _this=this;

    // logo -status? (might get rid of this)
    this.widgets.actionbar = new ActionBar(
        {
            parent: _this.screen,
            top:0,
            left:0,
            width: _this.config.view.sidew,
            value: "Timetrap TUI:",
            align: "center",
            fg: "blue"
        }
    );

    //menubar at top
    this.widgets.menubar = new MenuBar({
        parent: _this.screen,
        left: _this.config.view.sidew,
        right: 0,
        top: 0,
    });

    // the main area
    //var mainw = blessed.box({
    this.widgets.workspace = new Workspace({
        parent: _this.screen,
        left: _this.config.view.sidew + 1,
        top: 2,
        bottom: 0,
        right: 0
    });

    //project tree on the left
    this.widgets.sidebar = new SideBar({
        parent: _this.screen,
        left: 0,
        top: 2,
        bottom: 0,
        width: _this.config.view.sidew,
    });
}

View.prototype.register_actions = function()
{
	let _this = this;
}

View.prototype.setWinFocus = function(win){
	let _this = this;
    switch(win){
        case _this.pwin.mainw:
            _this.widgets.workspace.focus();
            break;
        case _this.pwin.side:
            _this.widgets.sidebar.focus();
            break;
        case _this.pwin.menu:
            _this.widgets.menubar.focus();
            break;
    }
}

View.prototype.setWinFocusNext = function(){
	let _this = this;
    if((_this.curWin+1) > _this.pwin.last){
        _this.curWin = _this.pwin.first;
        _this.setWinFocus(_this.pwin.first);
    }
    else {
        _this.curWin++;
        _this.setWinFocus(_this.curWin);
    }
    _this.screen.render();
    return
}

View.prototype.setWinFocusPrev = function(){
	let _this = this;
    if((_this.curWin-1) < _this.pwin.first){
        _this.curWin = _this.pwin.last;
        _this.setWinFocus(_this.pwin.last);
    }
    else {
        _this.curWin--;
        _this.setWinFocus(_this.curWin);
    }
    _this.screen.render();
    return
}

View.prototype.hideAll = function(){
    let _this = this;
    for (let key in _this.widgets) {

        if (_this.widgets.hasOwnProperty(key)) continue;

        _this.widgets[this.key].hide();
    }
    _this.screen.render();
}

View.prototype.showAll = function(set_focus){
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

View.prototype.type = 'View';
module.exports = View;

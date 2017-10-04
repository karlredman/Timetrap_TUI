"use strict";

// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib');

// View panels
var MenuBar = require('./menubar');
var SideBar = require('./sidebar');
var WorkspaceList = require('./workspacelist');
var Logger = require('./logger');
var ClocksRunning = require('./clocksrunning')

function View(objects) {

    let _this=this;
    _this.widgets = {};
    _this.screen = objects.screen;
    _this.config = objects.config;
    _this.timetrap = objects.timetrap;

    //fetch projects list
    //this.widgets.dirtree = new DirTree(config);
    this.widgets.dirtree = objects.dirtree;
    let proj_tree = this.widgets.dirtree.fetch(this.config.timetrap_config.tui_projects_template_path.value);

    this.config.view.sidew = this.widgets.dirtree.getMaxSideNameLen();   //side menu width
    this.config.view.numwnd = 3;                    //number of windows
    this.config.view.curwind = 1;                   //current window (starts at 1, screen === 0)


    /////////////////////////////////////////////////////
    // this view's layout

    //this view's window panes
    this.pwin ={
        menu: 1,
        logger: 2,
        side: 3,
        mainw: 4,
    };
    this.pwin.first = this.pwin.menu;
    this.pwin.last = this.pwin.mainw;

    //the current pane default
    this.curWin = 1;

    //make the widgets
    this.create_widgets();


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
    this.widgets.sidebar.saveData(proj_tree);

    //screen.render();
    this.setWinFocus(this.pwin.side);
}

View.prototype.create_widgets = function()
{
    let _this=this;

    //menubar at top
    this.widgets.menubar = new MenuBar({
        autoCommandKeys: true,
        parent: _this.screen,
        left: 0,
        top: 0,
    });


    //project tree on the left
    this.widgets.sidebar = new SideBar({
        parent: _this.screen,
        left: 0,
        top: 1,
        bottom: 1,
        width: _this.config.view.sidew,
        border: {type: "line"},
    });

    // the main area
    this.widgets.workspace = new WorkspaceList({
        parent: _this.screen,
        left: _this.config.view.sidew,
        right: 0,
        top: 1,
        bottom: 1,
        border: {type: "line"},
    });

    //the logger at bottom of main window
    this.widgets.logger = new Logger({
        parent: _this.screen,
        left: 0,
        bottom: 0,
        height: 1,
    });

    // line to show menu is focused
    _this.menuline = new blessed.line({
        parent: _this.screen,
        left: 0,
        height: 1,
        top: 1,
        orientation: "horizontal",
        type: 'line',
        fg: "green"
    })

    //used to show log is focused
    _this.logline = new blessed.line({
        parent: _this.screen,
        left: 0,
        height: 1,
        bottom: 1,
        orientation: "horizontal",
        type: 'line',
        fg: "green"
    })

    // message of number of clocks active
    // TODO: this is a hack overlaying a box on top
    this.widgets.clocksRunning = new ClocksRunning({
        parent: _this.screen,
        width: _this.config.view.sidew-2,
        left: 1,
        height: 1,
        top: 2,
        tags: true,
        content: "{center}4/24 Active Clocks{/}",
    });


    // initialize contents
    //
    // populate the workspace list view table
    _this.timetrap.fetch_list();
}

View.prototype.register_actions = function()
{
    let _this = this;
    _this.timetrap.on('list', (arr) => {
        _this.widgets.workspace.populate(_this.timetrap.list)
    });
}

View.prototype.setWinFocus = function(win){
    let _this = this;
    // The focus and effects are managed here so mouse actions don't cause
    // false positives.
    switch(win){
        case _this.pwin.mainw:
            _this.widgets.workspace.options.style.border.fg = "green";
            _this.widgets.sidebar.options.style.border.fg = "red";
            _this.logline.hide();
            _this.menuline.hide();
            _this.widgets.workspace.focus();
            break;
        case _this.pwin.side:
            _this.widgets.workspace.options.style.border.fg = "red";
            _this.widgets.sidebar.options.style.border.fg = "green";
            _this.logline.hide();
            _this.menuline.hide();
            _this.widgets.sidebar.focus();
            break;
        case _this.pwin.menu:
            _this.widgets.workspace.options.style.border.fg = "red";
            _this.widgets.sidebar.options.style.border.fg = "red";
            _this.logline.hide();
            _this.menuline.show();
            _this.widgets.menubar.focus();
            break;
        case _this.pwin.logger:
            _this.widgets.workspace.options.style.border.fg = "red";
            _this.widgets.sidebar.options.style.border.fg = "red";
            _this.logline.show();
            _this.menuline.hide();
            _this.widgets.logger.focus();
            break;
    }

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

"use strict";

// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib');

// panels
var MenuBar = require('./menubar');
var SideBar = require('./sidebar');
//var Workspace = require('./workspace');
var WorkspaceList = require('./workspacelist');
//var WorkspaceTree = require('./worktree');
var Logger = require('./logger');
//var HelpView = require('./helpview');

// program init/startup
//function View(config, screen) {
function View(objects) {

    let _this=this;
    _this.widgets = {};
    _this.screen = objects.screen;
    _this.config = objects.config;

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

    // horizontal seperator line 1
    let seph1 = blessed.line({
        parent: this.screen,
        orientation: 'horizontal',
        top: 1,
        left: 0,
        //right: _this.config.view.sidew,
        right: 0,
        fg: "red"
    });

    // // horizontal seperator line 2
    // let seph2 = blessed.line({
    //     parent: this.screen,
    //     orientation: 'horizontal',
    //     top: 1,
    //     left: _this.config.view.sidew,
    //     right: 0,
    //     fg: "red"
    // });

    //logger seperator line
    let sepl = blessed.line({
        parent: this.screen,
        orientation: 'horizontal',
        left: _this.config.view.sidew+1,
        bottom: 1,
        right: 0,
        fg: "red"
    });

    // verticle seperator line
    let sepv1 = blessed.line({
        parent: this.screen,
        orientation: 'vertical',
        left: _this.config.view.sidew,
        top: 2,
        bottom: 0,
        fg: "green",
        //bg: "black"
    });

    // let sepv2 = blessed.line({
    //     parent: this.screen,
    //     orientation: 'vertical',
    //     left: _this.config.view.sidew,
    //     //top: 0,
    //     bottom: 1,
    //     fg: "green",
    //     //bg: "black"
    // });

    this.create_widgets();

    //seperator  bar color change on focus chage
    //// side menue focus
    this.screen.setEffects(sepv1, this.widgets.sidebar, 'focus', 'blur', { fg: 'green' });
    // this.screen.setEffects(sepv2, this.widgets.sidebar, 'focus', 'blur', { fg: 'green' });
    this.screen.setEffects(seph1, this.widgets.sidebar, 'focus', 'blur', { fg: 'red' });
    // this.screen.setEffects(seph2, this.widgets.sidebar, 'focus', 'blur', { fg: 'red' });
    this.screen.setEffects(sepl, this.widgets.sidebar, 'focus', 'blur', { fg: 'red' });
    //// top bar
    this.screen.setEffects(sepv1, this.widgets.menubar, 'focus', 'blur', { fg: 'red' });
    // this.screen.setEffects(sepv2, this.widgets.menubar, 'focus', 'blur', { fg: 'red' });
    this.screen.setEffects(seph1, this.widgets.menubar, 'focus', 'blur', { fg: 'green' });
    // this.screen.setEffects(seph2, this.widgets.menubar, 'focus', 'blur', { fg: 'green' });
    this.screen.setEffects(sepl, this.widgets.menubar, 'focus', 'blur', { fg: 'red' });
    //// main textarea focus
    this.screen.setEffects(sepv1, this.widgets.workspace, 'focus', 'blur', { fg: 'green' });
    // this.screen.setEffects(sepv2, this.widgets.workspace, 'focus', 'blur', { fg: 'red' });
    this.screen.setEffects(seph1, this.widgets.workspace, 'focus', 'blur', { fg: 'green' });
    // this.screen.setEffects(seph2, this.widgets.workspace, 'focus', 'blur', { fg: 'green' });
    this.screen.setEffects(sepl, this.widgets.workspace, 'focus', 'blur', { fg: 'green' });
    //// log logger focus
    this.screen.setEffects(sepv1, this.widgets.logger, 'focus', 'blur', { fg: 'red' });
    // this.screen.setEffects(sepv2, this.widgets.logger, 'focus', 'blur', { fg: 'red' });
    this.screen.setEffects(seph1, this.widgets.logger, 'focus', 'blur', { fg: 'red' });
    // this.screen.setEffects(seph2, this.widgets.logger, 'focus', 'blur', { fg: 'red' });
    this.screen.setEffects(sepl, this.widgets.logger, 'focus', 'blur', { fg: 'green' });


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
    //this.widgets.workspace.setData(proj_tree);

    //screen.render();
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

    //the logger at bottom of main window
    this.widgets.logger = new Logger({
        parent: _this.screen,
        left: _this.config.view.sidew + 1,
        right: 0,
        bottom: 0,
        height: 1,
        //content: "xxxxxxxx\nxxxxxxxxxx\nxxxxxx\nxxxxxxxx"
        //bottom: 0,
        //width: 30
    });

    // the main area
    //var mainw = blessed.box({
    this.widgets.workspace = new WorkspaceList({
        parent: _this.screen,
        left: _this.config.view.sidew + 1,
        right: 0,
        top: 3,         //compensating for weird tree layout
        bottom: 2,
        //bottom: 2,
        //border: {type: "line"},
        //content: "starting content"
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
        case _this.pwin.logger:
            _this.widgets.logger.focus();
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

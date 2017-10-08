"use strict";

// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib');

var util = require('util');

// View panels
var MenuBar = require('./PanelMenubarListbar');
var SideBar = require('./PanelSidebarTree');
var WorkspaceList = require('./PanelWorkspaceList');
var Logger = require('./PanelLoggerBox.js');
var ClocksRunning = require('./PanelClocksRunningBox')

// dialogs
var DialogMessage = require('./DialogMessage');

function ViewMain(objects) {

    let _this=this;
    _this.widgets = {};
    _this.screen = objects.screen;
    _this.config = objects.config;
    _this.timetrap = objects.timetrap;


    // TODO: reaplace with actual `t list` width
    this.config.view.sidew = '50%';   //side menu width
    //this.config.view.sidew = 35;   //side menu width

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
        // if (this.widgets.hasOwnProperty(key)) continue;
        this.widgets[key].register_actions(_this)
    }

    // set the tree data
    _this.timetrap.fetch_list();
    _this.timetrap.monitorDB();
    _this.updateTimer();

    // _this.screen.render();
    _this.setWinFocus(this.pwin.side);
}

ViewMain.prototype.updateTimer = function(){
    let _this = this;
    //TODO: replace with something sane (i.e artificial timers)

    setInterval(function() {
        _this.timetrap.fetch_list();
    }
        // , 1000)
        , 5000)
}

ViewMain.prototype.create_widgets = function()
{
    let _this=this;

    //menubar at top
    this.widgets.menubar = new MenuBar({
        parent: _this.screen,
        view: this,
        autoCommandKeys: true,
        left: 0,
        top: 0,
    });


    //project tree on the left
    this.widgets.sidebar = new SideBar({
        parent: _this.screen,
        view: _this,
        left: 0,
        top: 1,
        bottom: 1,
        width: _this.config.view.sidew,
        border: {type: "line"},
    });

    // the main area
    this.widgets.workspace = new WorkspaceList({
        parent: _this.screen,
        view: _this,
        left: _this.config.view.sidew,
        right: 0,
        top: 1,
        bottom: 1,
        border: {type: "line"},
    });

    //the logger at bottom of main window
    this.widgets.logger = new Logger({
        parent: _this.screen,
        view: _this,
        left: 0,
        bottom: 0,
        height: 1,
    });

    // line to show menu is focused
    _this.menuline = new blessed.line({
        parent: _this.screen,
        view: _this,
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
        view: _this,
        left: 0,
        height: 1,
        bottom: 1,
        orientation: "horizontal",
        type: 'line',
        fg: "green"
    })

    // message of number of clocks active
    // TODO: this is a hack overlaying a box on top of the sidebar object
    this.widgets.clocksRunning = new ClocksRunning({
        parent: _this.screen,
        view: _this,
        //width: _this.config.view.sidew-2,   //TODO: forces sidebar to be absolute size instead of %
        //width: _this.screen.cols/2-4,
        width: "48%",           // TODO this is still a hack
        left: 1,
        height: 1,
        top: 2,
        tags: true,
        // TODO: base min width of sidebar on this content
        content: "{center}4/24 Active Time Sheets{/}",
    });

    //_this.screen.render();

    // initialize contents
    //
    // populate the workspace list view table
    //_this.timetrap.fetch_list();
}

ViewMain.prototype.register_actions = function()
{
    let _this = this;
    _this.timetrap.on('fetch_list', (list) => {
        //  we have a new `t list` -now update the tree
        this.timetrap.fetch_tree(list);
    });

    _this.timetrap.on('fetch_tree', function(tree){
        // set the sidebar contents and update the workspace

        // update sidebar
        _this.widgets.sidebar.setData(tree);
        _this.updateWorkspaceData();

        //synchronize the selection bar
        let idx = _this.widgets.sidebar.rows.selected;
        _this.widgets.workspace.emit('syncSelect', idx, 'keypress');

        // _this.widgets.clocksRunning.hide();


        _this.screen.render();
    });

    _this.timetrap.on('db_change', function(){
        //update the sidebar and workspace when the db changes
        _this.timetrap.fetch_list();
    });
}

ViewMain.prototype.updateWorkspaceData = function(){

    //TODO: move this to workspace
    let _this = this;

    //_this.timetrap.fetch_list();

    let node_lines = _this.widgets.sidebar.nodeLines;      //data in sidebar tree
    //let items = [_this.view.widgets.sidebar.lineNbr];            //number of tree elements
    //let selected = _this.view.widgets.sidebar.rows.selected;    //currently selected node

    //        let output = util.inspect(node_lines[8].info, false, 20);

    let items = {
        headers: [" Running", " Today", " Total Time"],
        data: []
    };
    items.data = new Array(node_lines.length);

    for ( let i in node_lines){
        items.data[i] = ['','',''];
    }

    for ( let i in node_lines){
        items.data[i] = [
            node_lines[i].info.running,
            node_lines[i].info.today,
            node_lines[i].info.total_time,
        ];
    }


    _this.widgets.workspace.setData(items);
}

ViewMain.prototype.setWinFocus = function(win){
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

ViewMain.prototype.setWinFocusNext = function(){
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

ViewMain.prototype.setWinFocusPrev = function(){
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

ViewMain.prototype.hideAll = function(){
    let _this = this;
    for (let key in _this.widgets) {

        if (_this.widgets.hasOwnProperty(key)) continue;

        _this.widgets[this.key].hide();
    }
    _this.screen.render();
}

ViewMain.prototype.showAll = function(set_focus){
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

ViewMain.prototype.type = 'ViewMain';
module.exports = ViewMain;

"use strict";

// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib');

var util = require('util');

// View panels
var MenuBar = require('./Menubar_listbar');
var SideBar = require('./Sidebar_tree');
var WorkspaceList = require('./workspacelist');
var Logger = require('./Logger_box');
var ClocksRunning = require('./ClocksRunning_box')

// dialogs
var DialogMessage = require('./DialogMessage');

function View(objects) {

    let _this=this;
    _this.widgets = {};
    _this.screen = objects.screen;
    _this.config = objects.config;
    _this.timetrap = objects.timetrap;

    //fetch projects list
    //this.widgets.dirtree = new DirTree(config);
    this.widgets.dirtree = objects.dirtree;
    this.proj_tree = this.widgets.dirtree.fetch(this.config.timetrap_config.tui_projects_template_path.value);

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
    //this.widgets.sidebar.setData(proj_tree);
    _this.timetrap.fetch_list();
    _this.timetrap.monitorDB();
    _this.updateTimer();
            // var util = require('util')
            // require('fs').writeFile('node.out', util.inspect(proj_tree, null, 9));
    //this.widgets.sidebar.saveData(proj_tree);

    //screen.render();
    this.setWinFocus(this.pwin.side);
}

View.prototype.updateTimer = function(){
    let _this = this;
    //TODO: replace with something sane (i.e artificial timers)

    setInterval(function() {
        _this.timetrap.fetch_list();
        //_this.log("{center}new {red-fg}log{/red-fg} line xxxxx-xxxxx-xxxxx-xxxxx-xxxxx: {/}"+ i++);
        //_this.screen.render()
    }
        // , 1000)
        , 5000)
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
        // TODO: base min width of sidebar on this content
        content: "{center}4/24 Active Time Sheets{/}",
    });

    // initialize contents
    //
    // populate the workspace list view table
    //_this.timetrap.fetch_list();
}

View.prototype.register_actions = function()
{
    let _this = this;
    _this.timetrap.on('fetch_list', (list) => {
            // let m = new DialogMessage({target: _this, parent: _this.screen});
            // m.alert('got here: ');
        //require('fs').writeFile('list.out', util.inspect(list, null, 20));
        this.timetrap.fetch_tree(list);
    });

    _this.timetrap.on('fetch_tree', function(tree){
        //console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
        _this.proj_tree = tree;
        _this.widgets.sidebar.setData(tree);
        _this.updateWorkspaceData();

        let idx = _this.widgets.sidebar.rows.selected;
        _this.widgets.workspace.emit('syncSelect', idx, 'keypress');
        //_this.widgets.workspacelist.

        _this.screen.render();
    });

    _this.timetrap.on('db_change', function(){
        _this.timetrap.fetch_list();
        //_this.timetrap.fetch_tree(list);
    });
}

View.prototype.updateWorkspaceData = function(){

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

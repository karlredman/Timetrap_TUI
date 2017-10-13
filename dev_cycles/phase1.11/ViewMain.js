"use strict";

// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib');
var EventEmitter = require('events').EventEmitter;

var util = require('util');

// View panels
var MenuBar = require('./PanelMenubarListbar');
var SideBar = require('./PanelSidebarTree');
var WorkspaceList = require('./PanelWorkspaceList');
//var Logger = require('./PanelLoggerBox.js');
var ClocksRunning = require('./PanelClocksRunningBox')

// dialogs
var DialogMessage = require('./DialogMessage');

function ViewMain(objects) {

    let _this=this;
    _this.widgets = {};
    _this.objects = objects;

    //convenience -before refactoring
    _this.controller = objects.controller;
    _this.screen = objects.screen;
    _this.config = objects.config;
    _this.timetrap = objects.timetrap;


    // TODO: reaplace with actual `t list` width
    this.config.view.sidew = '50%';   //side menu width
    this.config.view.sidew = 25;   //side menu width



    /////////////////////////////////////////////////////
    // this view's layout

    //this view's window panes
    this.pwin ={
        side: 1,
        menu: 2,
        logger: 3,
        mainw: 4,
    };
    this.pwin.first = this.pwin.side;
    this.pwin.last = this.pwin.logger;
    this.pwin.curWin;

    //register actions
    _this.register_actions();

    //make the widgets
    this.create_widgets();


    /////////////////////////////////////////////////////
    // this view's control


    for (let key in this.widgets) {
        // if (this.widgets.hasOwnProperty(key)) continue;
        this.widgets[key].register_actions(_this)
    }

    // set the tree data
    _this.timetrap.fetch_list();
    _this.timetrap.monitorDB();
    _this.timetrap.fakeTimer('on');

    _this.setWinFocus(this.pwin.side);
}
ViewMain.prototype = Object.create(EventEmitter.prototype);
ViewMain.prototype.constructor = ViewMain;

ViewMain.prototype.create_widgets = function()
{
    let _this=this;

    // //the logger at bottom of main window
    // this.widgets.logger = new Logger({
    //     parent: _this.screen,
    //     view: _this,
    //     left: 0,
    //     bottom: 0,
    //     height: 1,
    // });


    //populate this view's  widgets
    _this.widgets =  _this.objects.baseview.widgets;
    _this.objects.baseview.set_widget_views(this, 'ViewMain');
    //_this.widgets.logger = _this.objects.baseview.widgets.logger;
    _this.widgets.logger.msg("ViewMain: assymilated logger from ViewBase", _this.widgets.logger.loglevel.devel.message);

    //xfer this view to objects

    // _this.widgets.logger =  _this.objects.baseview.widgets.logger;
    // _this.widgets.logger.view = _this;
    // _this.widgets.logger.msg("assymilated logger from viewmain", _this.widgets.logger.loglevel.devel.message);

    // _this.widgets.logger =  _this.objects.baseview.widgets.logger;
    // _this.widgets.logger.view = _this;
    // _this.widgets.logger.msg("assymilated logger from viewmain", _this.widgets.logger.loglevel.devel.message);

    //menubar at top
    this.toggle_menubar();
    // this.widgets.menubar = new MenuBar({
    //     parent: _this.screen,
    //     view: this,
    //     autoCommandKeys: true,
    //     left: 0,
    //     top: 0,
    //     //border: 'line'
    // });


    //project tree on the left
    this.widgets.sidebar = new SideBar({
        parent: _this.screen,
        view: _this,
        left: 0,
        top: 1,
        bottom: 1,
        width: _this.config.view.sidew,
        border: {type: "line"},
        // template: {
        //     extend: '',
        //     retract: '',
        // }
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


    // // line to show menu is focused
    // _this.menuline = new blessed.line({
    //     parent: _this.screen,
    //     view: _this,
    //     left: 0,
    //     height: 1,
    //     top: 1,
    //     orientation: "horizontal",
    //     type: 'line',
    //     fg: "green"
    // })

    // //used to show log is focused
    // _this.logline = new blessed.line({
    //     parent: _this.screen,
    //     view: _this,
    //     left: 0,
    //     height: 1,
    //     bottom: 1,
    //     orientation: "horizontal",
    //     type: 'line',
    //     fg: "green"
    // })

    // message of number of clocks active
    // TODO: this is a hack overlaying a box on top of the sidebar object
    this.widgets.clocksRunning = new ClocksRunning({
        parent: _this.screen,
        view: _this,
        //TODO: this is a mess
        width: _this.config.view.sidew-2,   //TODO: forces sidebar to be absolute size instead of %
        //width: _this.screen.cols/2-4,
        //width: "48%",           // TODO this is still a hack
        left: 1,
        height: 1,
        top: 2,
        tags: true,
        // TODO: base min width of sidebar on this content
        //content: "{center}4/24 Active Time Sheets{/}",
    });



    //manage focus
            let logline = blessed.line({
                parent: _this.screen,
                orientation: 'horizontal',
                //top: 1,
                bottom: 1,
                left: 0,
                right: 0,
                fg: "green"
            });
            let menuline = blessed.line({
                parent: _this.screen,
                orientation: 'horizontal',
                top: 1,
                left: 0,
                right: 0,
                fg: "green"
            });
            _this.screen.setEffects(menuline, _this.widgets.logger, 'focus', 'blur', { fg: 'red' }, Object);
            _this.screen.setEffects(logline, _this.widgets.menubar, 'focus', 'blur', { fg: 'red' }, Object);

    //_this.showAll(_this.pwin.side);
}

ViewMain.prototype.toggle_menubar = function(){
    let _this = this;

    if(typeof _this.widgets.menubar === 'undefined'){
        _this.widgets.menubar = new MenuBar({
            parent: _this.screen,
            view: this,
            autoCommandKeys: true,
            left: 0,
            top: 0,
            //border: 'line'
        });

        return;
    }
    _this.widgets.menubar.destroy();
    delete _this.widgets.menubar;
}


ViewMain.prototype.register_actions = function()
{
    let _this = this;

    _this.on('relay', function(msg){
        // msg = {action: 'action name', item: 'item name'
        _this.controller.emit(msg.action, msg);
    });
    _this.on('create', function(item){
        if(item === 'menubar'){
            _this.toggle_menubar();
            _this.widgets.menubar.register_actions();
            _this.setWinFocus(_this.pwin.side);
        }
    });
    _this.on('destroy', function(item){
        if(item === 'menubar'){
            _this.toggle_menubar();
        }
    });

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


        //TODO make this configurable
        _this.widgets.clocksRunning.setContent(
            "{center}"
            +_this.timetrap.num_running+"/"+_this.timetrap.num_clocks
            +" Active Time Sheets"
            +"{/center}"
        );

        _this.screen.render();
    });

    _this.timetrap.on('db_change', function(){
        //update the sidebar and workspace when the db changes
        _this.timetrap.fetch_list();
    });

    _this.timetrap.on('fake_list_update', function(list){
        _this.timetrap.fetch_tree(list);
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

    //     _this.running = false;               //cheezy, indicate that we've run register_actions on widgets
    //     _this.widgets.menubar.register_actions();
    //     _this.running = true;               //cheezy, indicate that we've run register_actions on widgets

    //     _this.setWinFocus(_this.pwin.side);
    //     _this.screen.render();
    // });

};

ViewMain.prototype.updateWorkspaceFakeData = function(list){
    let _this = this;

    let items = {
        headers: [" Running", " Today", " Total Time"],
        data: []
    };

    items.data = new Array(list.length);

    for ( let i in list){
        items.data[i] = ['','',''];
    }

    for( let i in list) {
        items.data[i] = [
            list[i].running,
            list[i].today,
            list[i].total_time,
        ];
    }

    _this.widgets.workspace.setData(items);
    _this.screen.render();
};

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
            //we shouldn't be here
            _this.widgets.workspace.options.style.border.fg = "yellow";
            _this.widgets.sidebar.options.style.border.fg = "yellow";
            _this.widgets.workspace.focus();
            break;
        case _this.pwin.side:
            _this.widgets.workspace.options.style.border.fg = "green";
            _this.widgets.sidebar.options.style.border.fg = "green";
            _this.widgets.sidebar.focus();
            break;
        case _this.pwin.menu:
            _this.widgets.workspace.options.style.border.fg = "red";
            _this.widgets.sidebar.options.style.border.fg = "red";
             _this.widgets.menubar.focus();
            break;
        case _this.pwin.logger:
            _this.widgets.workspace.options.style.border.fg = "red";
            _this.widgets.sidebar.options.style.border.fg = "red";
            _this.widgets.logger.focus();
            break;
        default:
            _this.loading_dialog = new DialogMessage({target: _this, parent: _this.screen});
            _this.loading_dialog.alert('Bad window number');
            break;
    }

    _this.pwin.curWin = win;

    //TODO: rework this for color themes

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

    // TODO: make config option for toggling traditional and this behavior

    //specific behavior
    switch(_this.pwin.curWin){
        case _this.pwin.menu:
            _this.setWinFocus(_this.pwin.side);
            break;
        case _this.pwin.side:
            _this.setWinFocus(_this.pwin.menu);
            break;
        case _this.pwin.logger:
            _this.setWinFocus(_this.pwin.side);
            break;
    }

    // if((_this.pwin.curWin+1) > _this.pwin.last){
    //     _this.pwin.curWin = _this.pwin.first;
    //     _this.setWinFocus(_this.pwin.first);
    // }
    // else {
    //     _this.setWinFocus(_this.pwin.curWin+1);
    // }
    // _this.screen.render();
}

ViewMain.prototype.setWinFocusPrev = function(){
    let _this = this;
    //specific behaovior
    switch(_this.pwin.curWin){
        case _this.pwin.menu:
            _this.setWinFocus(_this.pwin.side);
            break;
        case _this.pwin.side:
            _this.setWinFocus(_this.pwin.logger);
            break;
        case _this.pwin.logger:
            _this.setWinFocus(_this.pwin.side);
            break;
    }
    // if((_this.pwin.curWin-1) < _this.pwin.first){
    //     _this.pwin.curWin = _this.pwin.last;
    //     _this.setWinFocus(_this.pwin.last);
    // }
    // else {
    //     _this.setWinFocus(_this.pwin.curWin-1);
    // }
    // _this.screen.render();
}

ViewMain.prototype.hideAll = function(){
    let _this = this;
    for (let key in _this.widgets) {

        if (! _this.widgets.hasOwnProperty(key)) continue;

        _this.widgets[key].hide();
    }
    _this.screen.render();
}

ViewMain.prototype.showAll = function(winfocus){
    let _this = this;
    for (let key in _this.widgets) {

        if (! _this.widgets.hasOwnProperty(key)) continue;

        _this.widgets[key].show();
    }

    _this.setWinFocus(winfocus);
    _this.screen.render();
}


ViewMain.prototype.updateViews = function(){
    // I don't quite get why sidebar is losing it's view
    // after closing the pick view but this is here to update them.
    let _this = this;
    for (let key in this.widgets) {
        // if ( ! this.widgets.hasOwnProperty(key)) continue;
        //_this.widgets[key].register_actions(_this)
        _this.widgets[key].view = _this;
    }
    //_this.objects.baseview.widgets.logger.view = _this;
    _this.widgets.logger.msg("Restored views: ViewMain", _this.widgets.logger.loglevel.devel.message);
}

ViewMain.prototype.type = 'ViewMain';
module.exports = ViewMain;

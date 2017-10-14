"use strict";

// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib');
var EventEmitter = require('events').EventEmitter;
require('./Util.js');

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
    _this.objects = options.objects;

    // TODO: get rid of these
    _this.screen = options.objects.screen;
    _this.config = options.objects.config;
    _this.timetrap = options.objects.timetrap;
    _this.controller = options.objects.controller;
    _this.sheet = options.data.sheet;
    _this.id = options.data.id;
    _this.note = options.note;
    _this.running = options.data.running;

    //widgets owned by this view
    _this.widgets = {};

    // class variables
    _this.total_time = 0;
    _this.config.view.numwnd = 2;                    //number of windows
    _this.config.view.curwind = 1;                   //current window (starts at 1, screen === 0)
    _this.display_type = 'week'

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

    _this.setWinFocus(_this.pwin.mainw);


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

    //request data
    let data = {
        type: 'week',
        content: '',
        sheet: _this.sheet,
        running: _this.running,
        target: _this
    };
    _this.timetrap.callCommand(data);
}
ViewPick.prototype = Object.create(EventEmitter.prototype);
ViewPick.prototype.constructor = ViewPick;

ViewPick.prototype.create_widgets = function()
{
    let _this=this;

    //get the logger
    //_this.widgets =  _this.objects.baseview.widgets;
    _this.objects.baseview.set_widget_views(_this, 'ViewPick');
    // TODO: hmmmm why doesn't this work?
    _this.widgets.logger = _this.objects.baseview.widgets.logger;
    _this.widgets.logger.show();
    _this.widgets.logger.msg("ViewPick: assymilated logger from ViewBase", _this.widgets.logger.loglevel.devel.message);

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


    _this.widgets.statusline = new blessed.box({
        parent: _this.screen,
        top: 2,
        left: 0,
        height: 1,
        content: _this.sheet+" [Week]",
        tags: true,
        align: 'center',
        fg: 'white',
        width: "100%"
    });
    _this.widgets.statusline.register_actions = function(){};
    // _this.widgets.statusline.setContent("");

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
}

ViewPick.prototype.register_actions = function()
{
    let _this = this;

    _this.on('relay', function(msg){
        //relay messages back to the controller
        // msg = {action: 'action name', item: 'item name'
        _this.controller.emit(msg.action, msg.item);
    });
    _this.on('destroy', function(item){
        //destroy all widgets
        if(item === 'all'){
            for (let key in _this.widgets) {
                // if (! this.widgets.hasOwnProperty(key)) continue;
                _this.widgets[key].destroy()
                delete _this.widgets[key];
            }
        }
    });

    _this.timetrap.on('timetrap_command', function(response){

        // if(typeof _this.loading_dialog !== 'undefined') {
        //     _this.loading_dialog.destroy();
        // }


        if(response.target !== _this) {
            return;
        }
        if (
            ( response.type === 'today' )
            || ( response.type === 'yesterday' )
            || ( response.type === 'week' )
            || ( response.type === 'month' )
            //( response.type === 'forever' )
            //
            // ( data.type === 'checkIn' )
            // || ( data.type === 'checkOut' )
            // || ( data.type === 'edit' )
        )
        {
            //set the current display time var
            _this.display_type = response.type;

            if(typeof response.error !== 'undefined'){
                if ( response.error != '' ){
                    _this.widgets.logger.msg('PickVew: '+response.error.toString(), _this.widgets.logger.loglevel.production.warning);
                    return;
                }
            }
            else {
                _this.widgets.logger.msg('PickVew: display stderr == undefined', _this.widgets.logger.loglevel.devel.warning);
            }
            if(typeof response.stdout !== 'undefined'){

                let content = JSON.parse(String(response.stdout));

                // let DialogBigBox = require('./DialogBigBox')
                // let bb = DialogBigBox({ parent: _this.screen, });
                // bb.setContent(JSON.stringify(content , null, 2));

                if(content.length === 0) {
                    _this.widgets.logger.msg('PickVew: Not data for '+response.type, _this.widgets.logger.loglevel.production.warning);
                    return;
                }
                let items = {
                    headers: ["  Id"  , "      Day"       , "  Start", "   End"   ," Duration", " Notes"],
                    data:[
                    ]};

                //class variable
                _this.total_time = 0;
                for( let i in content ){
                    let tmp = [];

                    //id
                    tmp.push(content[i].id);

                    // calculate the day (always take start date)
                    //tmp.push("Thu Oct 12, 2017");
                    // format the string to an ISO8601 date string
                    // data format:  "2017-10-09 11:31:54 -0500"
                    // ISO8601 FORMAT: "2017-10-09T11:31:54.000-0500"

                    let da = content[i].start.split(" ");
                    let ds = String(da[0]+'T'+da[1]+'.000'+da[2]);
                    let start = new Date(ds);

                    //format for table
                    da = start.toString().split(" ");
                    tmp.push(String(da[0]+" "+da[1]+" "+da[2]+", "+da[3]));


                    //start
                    tmp.push(content[i].start.split(" ")[1]);
                    //end
                    tmp.push(content[i].end.split(" ")[1]);

                    // calculate the duration
                    //tmp.push("999:99:99");
                    // let da = content[i].start.split(" ");
                    // let ds = String(da[0]+'T'+da[1]+'.000'+da[2]);
                    // let start = new Date(ds);

                    da = content[i].end.split(" ");
                    ds = String(da[0]+'T'+da[1]+'.000'+da[2]);
                    let end = new Date(ds);

                    let delta = (end - start)/1000;
                    tmp.push(delta.toString().toHMMSS());

                    //keep running total
                    _this.total_time += delta;

                    // let DialogBigBox = require('./DialogBigBox')
                    // let bb = DialogBigBox({ parent: _this.screen, });
                    // bb.setContent(JSON.stringify(_this.total_time, null, 2));

                    //notes
                    tmp.push(content[i].note);

                    //populate
                    items.data.push(tmp);
                }

                //update the class variable
                _this.items = items;

                // TODO: add today info if clock is running
                // TODO: maybe add a timer for running running clocks
                // running clocks don't show up in dispaly reports
                if(_this.running) {
                    _this.timetrap.callCommand({type: 'now', target: _this, content: '', sheet: _this.sheet, running: _this.running});
                }

                // let DialogBigBox = require('./DialogBigBox')
                // let bb = DialogBigBox({ parent: _this.screen, });
                // bb.setContent(JSON.stringify(items , null, 2));

                // populate the table
                // TODO: use emit for updates
                //_this.emit.
                _this.widgets.workspace.setData(items);

                // update the statusline
                // TODO: have this update if clock is running
                _this.widgets.statusline.setContent(_this.sheet+" ["+response.type+"]/"+_this.total_time.toString().toHMMSS());
                _this.widgets.logger.msg('PickVew: Display '+_this.sheet+'|'+response.type, _this.widgets.logger.loglevel.production.message);

                _this.screen.render();
            }
            else {
                _this.widgets.logger.msg('PickVew: display stdout == undefined', _this.widgets.logger.loglevel.devel.warning);
            }
        }

        if ( response.type === 'now' ) {

            //We're probably here because `timetrap -v -fjson [display spec]
            //doesn't output currently running clocks -arrrg
            let content = String(response.stdout);

            let rarr = content.split('\n');

            //let content = JSON.parse(String(response.stdout));

            for ( let i in rarr){
                if(rarr[i].slice(1,rarr[i].length).split(':')[0] == _this.sheet){
                    // figure out time for running clock
                    //the first char is either a space or 'active/last' status -so skipt it
                    let sheet = rarr[i].slice(1,rarr[i].length).split(" ")[0];
                    let time = rarr[i].slice(1,rarr[i].length).split(" ")[1];

                    //notes are in '()' if they exist
                    let note = rarr[i].slice(1,rarr[i].length).split("(")[1];
                    if(typeof note !== 'undefined'){
                        note = note.replace(')','');
                    }
                    else {
                        if(typeof _this.note === 'undefined' ){
                            note = '';
                        }
                        else {
                            note = _this.note;
                        }
                    }

                    let id = "------";
                    if(typeof _this.id !== 'undefined' ){
                        id = _this.id;
                    }

                    //find our start time
                    let start = new Date();
                    let t = time.split(':');
                    let ts = (+t[0]) * 60 * 60 + (+t[1]) * 60 + (+t[2]);
                    let delta = (start.getSeconds() - ts);
                    start.setSeconds(delta);

                    //update our total time
                    _this.total_time += ts;

                    //format our start time
                    let da = start.toString().split(" ");
                    let day = String(da[0]+" "+da[1]+" "+da[2]+", "+da[3]);
                    start = String(da[4])

                    //build our array
                    //TODO: add the ide via text output -prolly should
                    //write a timetrap filter for that at some point...
                    let arr = [
                        id,
                        day,
                        start,
                        "~~~~~~~~",
                        time,
                        note
                    ];
                    //add the running time to the table's array
                    _this.items.data.push(arr);
                    _this.widgets.workspace.setData(_this.items);

                    //update the status line
                    _this.widgets.statusline.setContent(_this.sheet+" ["+
                        _this.display_type+"]/"+_this.total_time.toString().toHMMSS());

                    //message
                    _this.widgets.logger.msg('PickVew: Display added running clock time '
                        +_this.sheet+'|'+response.type, _this.widgets.logger.loglevel.devel.message);
                    _this.screen.render();
                }
            }
        }
    });
};

ViewPick.prototype.setWinFocus = function(win){
    let _this = this;
    // The focus and effects are managed here so mouse actions don't cause
    // false positives.
    switch(win){
        case _this.pwin.mainw:
            _this.widgets.workspace.options.style.border.fg = "green";
            _this.widgets.workspace.focus();
            break;
        case _this.pwin.menu:
            _this.widgets.workspace.options.style.border.fg = "red";
            _this.widgets.menubar.focus();
            break;
        case _this.pwin.logger:
            _this.widgets.workspace.options.style.border.fg = "red";
            _this.widgets.logger.focus();
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

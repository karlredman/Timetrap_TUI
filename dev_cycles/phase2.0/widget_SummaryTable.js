"use strict";

// dependencies
var blessed = require('blessed'),
    Contrib = require('blessed-contrib'),
    ContribTable = Contrib.table,
    BlessedBox = blessed.Box;

// project includes
//var {SummaryTableConfig} = require('./widget_SummaryListTable');
var {TimetrapTUI_Error} = require('./Errors');
var helpers = require('./helpers');

// debugging
var util = require('util');

class SummaryTable extends ContribTable {
    constructor({parent = helpers.requiredParam('parent'), options ={},
        theme = 'opaque', config = helpers.requiredParam('config'),
        logger = helpers.requiredParam('logger'),
        view = helpers.requiredParam('view'),
        focusable = false } ={})
    {

        let defaults = {
    wrap: true,
    hidden: false,
    fixed: true,
            parent: parent,
            screen: options.parent,
            //
            left: config.data.traits.left,
            top: 1,
            bottom: 1,
            //width: config.data.traits.width,
            //
            columnWidth: [11,11,11,64],
            columnSpacing: 2,
            //
            //////////////////////////////
            // ignoreKeys: true,
            // scrollable: true,
            //////////////////////////////
            //
            mouse: true,
            keys: true,
            vi: true,
            input: true,
            keyable: true,
            interactive: true,
            //
            border: {type: "line"},
            tags: true,
            //
            bg: config.data.colors.bg[theme],
            fg: config.data.colors.fg[theme],
            selectedBg: config.data.colors.selectedBg[theme],
            selectedFg: config.data.colors.selectedFg[theme],
            //
            style: {
                bg: config.data.colors.style.bg[theme],
                fg: config.data.colors.style.fg[theme],
                //
                border: {
                    bg: config.data.colors.style.border.bg[theme],
                    fg: config.data.colors.style.border.fg[theme],
                },
                //
                selected: {
                    bg: config.data.colors.style.selected.bg[theme],
                    fg: config.data.colors.style.selected.fg[theme],
                },
                //
                item: {
                    bg: config.data.colors.style.item.bg[theme],
                    fg: config.data.colors.style.item.fg[theme],
                    hover: {
                        bg: config.data.colors.style.item.hover.bg[theme],
                        fg: config.data.colors.style.item.hover.fg[theme],
                    },
                },
            }
        };

        // merge options into defaults
        //shallow copy is fine here
        options = Object.assign({}, defaults, options);

        super(options);

        //fix bg color in embedded list (rows)
        this.rows.options.style.bg = config.data.colors.style.bg[theme];
        this.rows.options.style.fg = config.data.colors.style.fg[theme];

        // saved options
        this.log = logger;
        this.theme = theme;
        this.config = config;
        this.view = view;
        //
        //this.input = true; ??
        //this.keyable = true ??

        // artificially track the elapsed time of running clocks
        this.fake_timer_time = 0
        this.fake_timer = undefined;
        this.list = undefined;

        //keyboard control
        if(focusable){
            this.focus();
        }

        // grab local datascructures, etc.
        this.init();
    }
}

SummaryTable.prototype.init = function() {
    //debug
    // let items = {
    //             headers: [" Running", " Today", " Total Time"],
    //     data: [
    //     ["XX000:00:00","XX000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    // ]};
    // this.setData(items);
    // this.rows.select(0)

    this.fakeTimer('on');
}


SummaryTable.prototype.registerActions = function() {
    let _this = this;

    this.on('syncSelect', function(idx,name) {
        let nidx = this.view.widgets.sheettree.rows.getItemIndex(this.view.widgets.sheettree.rows.selected);
        this.rows.select(nidx);
        this.screen.render();
    });

    this.rows.on('keypress', function(ch, key) {
        if (key.name === 'tab') {
            if (!key.shift) {
                _this.view.setWinFocusNext();
            } else {
                _this.view.setWinFocusPrev();
            }
            return;
        }
    });

    this.on('updateData', () => {
        _this.updateSummaryData();
    });
    this.on('updateTimes', () => {
        _this.updateSummaryTimes();
    });

    // manage selections
    _this.rows.on('element select', function(foo, bar) {
        //console.log("element select")
        let idx = this.getItemIndex(this.selected);
        //self.select(idx);
        _this.view.widgets.sheettree.emit('syncSelect', idx, 'element select');
    });
    _this.rows.on('select', function(foo, bar){
        //console.log("select")
        let idx = this.getItemIndex(this.selected);
        //self.select(idx);
        _this.view.widgets.sheettree.emit('syncSelect', idx, 'select');
    });
}

SummaryTable.prototype.render = function() {
    if(this.screen.focused == this.rows) this.rows.focus()

    this.rows.width = this.width-3
    this.rows.height = this.height-4
    BlessedBox.prototype.render.call(this)
}

SummaryTable.prototype.fakeTimer = function(command){
    //command: on, off, running
    //returns: running state

    // TODO: fix _this usage
    let _this = this;

    //report the state
    if(command === 'running'){
        if ( typeof _this.fake_timer === 'undefined' ){
            return false;
        }
        else {
            return true;
        }
    }

    if(command === 'on'){
        _this.fake_timer_time = Date.now();
        if (typeof _this.fake_timer === 'undefined' ) {
            //_this.fake_timer = setInterval(function(){
            _this.fake_timer = setInterval(function(){
                //only process if semaphore is 0 so as to not waste cycles
                //yes, i know node.js is single threaded. we're serializing
                //the display side in the view -so the fake update timer doesn't
                //overwrite a rereading of the database via fetch_list.
                //if( _this.fake_timer_semaphore)
                //_this.updateSummaryTimes();
                _this.emit('updateTimes');
            }, 1000);
        }
    }

    if(command === 'off'){
        if (_this.fake_timer) {
            clearInterval(_this.fake_timer);
            destroy( _this.fake_timer);
        }
        return false;
    }

    // TODO: throw error if we got here;
}

SummaryTable.prototype.updateSummaryTimes = function(){
    //let _this = this

    // now
    let now = Date.now();

    // difference between now and last tick
    let delta = now - this.fake_timer_time;
    this.fake_timer_time = now;

    let a = [];
    let seconds = 0;
    this.list = this.view.widgets.sheettree.nodeLines;
    for( let i in this.list ){
        // skip non running entries
        if( (this.list[i].info.running !== '0:00:00')
            && (this.list[i].info.running !== '-:--:--') ) {

            // calculations to H:MM:SS
            a = this.list[i].info.running.split(':');
            seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
            seconds += (delta/1000);
            this.list[i].info.running = seconds.toString().toHMMSS();

            //today doesn't get reported correctly for clocks running longer than
            //the beginning the day (i.e. started yesterday)
            if ( this.list[i].info.today === '0:00:00'){
                //calculate elapsed time since midnight
                var dt = new Date();
                var secs = dt.getSeconds() + (60 * dt.getMinutes()) + (60 * 60 * dt.getHours());
                this.list[i].info.today = secs.toString().toHMMSS();
            }
            else {
                a = this.list[i].info.today.split(':');
                seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
                seconds += (delta/1000);
                this.list[i].info.today = seconds.toString().toHMMSS();
            }

            a = this.list[i].info.total_time.split(':');
            seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
            seconds += (delta/1000);
            this.list[i].info.total_time = seconds.toString().toHMMSS();
        }

    }
    this.updateSummaryData();
}

SummaryTable.prototype.updateSummaryData = function(){

    let node_lines = this.view.widgets.sheettree.nodeLines;      //data in sidebar tree

    let items = {
        headers: [" Running", " Today", " Total Time",""],
        data: []
    };
    items.data = new Array(node_lines.length);

    for ( let i in node_lines){
        items.data[i] = ['','','',''];
    }

    let note = "";

    for ( let i in node_lines){
        if( typeof node_lines[i].info.note !== 'undefined' ){
            note = String(node_lines[i].info.note);
        }
        items.data[i] = [
            node_lines[i].info.running,
            node_lines[i].info.today,
            node_lines[i].info.total_time,
            note
            //( node_lines[i].info.note == 'undefined' ) ? "" : node_lines[i].info.note.toString()
        ];
        note = ""
    }

    //this.log.msg("updated summary list", this.log.loglevel.devel.message)
    //this.list = node_lines;
    this.setData(items);
    //this.view.widgets.sheettree.emit('fetch_tree', this.view.widgets.sheettree.tree_data);
    this.view.widgets.sheettree.setData(this.view.widgets.sheettree.tree_data);
    //this.view.widgets.sheettree.render();


    // let idx = this.view.widgets.sheettree.rows.getItemIndex(this.view.widgets.sheettree.rows.selected);
    // this.rows.select(idx);
    this.view.screen.render();

    //console.log(idx+"|"+this.rows.getItemIndex(this.rows.selected));

    // let idx = this.rows.getItemIndex(this.rows.selected);
    // this.view.widgets.sheettree.emit('syncSelect', idx, 'element click');

    // let idx = this.view.widgets.sheettree.rows.getItemIndex(this.view.widgets.sheettree.rows.selected);
    // this.rows.select(idx);
}

module.exports = {SummaryTable};

"use strict";

// dependencies
var Contrib = require('blessed-contrib'),
    ContribTable = Contrib.table;

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
}

SummaryTable.prototype.registerActions = function() {
    let _this = this;

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

    this.on('syncSelect', function(idx){
        _this.rows.select(idx);
        _this.screen.render();
    });

    this.on('updateData', () => {
        _this.updateSummaryData();
    });
}

SummaryTable.prototype.updateSummaryData = function(){

    //TODO: move this to workspace
    let _this = this;

    let node_lines = _this.view.widgets.sheettree.nodeLines;      //data in sidebar tree

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


    this.log.msg("updated summary list", this.log.loglevel.devel.message)
    _this.setData(items);
    _this.view.screen.render();
}

module.exports = {SummaryTable};

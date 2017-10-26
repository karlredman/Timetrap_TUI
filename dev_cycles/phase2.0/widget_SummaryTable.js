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
    let items = {
                headers: [" Running", " Today", " Total Time"],
        data: [
        ["XX000:00:00","XX000:00:00","00000:00:00"],
        ["000:00:00","000:00:00","00000:00:00"],
        ["000:00:00","000:00:00","00000:00:00"],
        ["000:00:00","000:00:00","00000:00:00"],
        ["000:00:00","000:00:00","00000:00:00"],
        ["000:00:00","000:00:00","00000:00:00"],
        ["000:00:00","000:00:00","00000:00:00"],
        ["000:00:00","000:00:00","00000:00:00"],
        ["000:00:00","000:00:00","00000:00:00"],
        ["000:00:00","000:00:00","00000:00:00"],
        ["000:00:00","000:00:00","00000:00:00"],
        ["000:00:00","000:00:00","00000:00:00"],
        ["000:00:00","000:00:00","00000:00:00"],
        ["000:00:00","000:00:00","00000:00:00"],
        ["000:00:00","000:00:00","00000:00:00"],
        ["000:00:00","000:00:00","00000:00:00"],
        ["000:00:00","000:00:00","00000:00:00"],
        ["000:00:00","000:00:00","00000:00:00"],
        ["000:00:00","000:00:00","00000:00:00"],
        ["000:00:00","000:00:00","00000:00:00"],
    ]};
    this.setData(items);
    this.rows.select(0)
}

SummaryTable.prototype.registerActions = function() {
    let _this = this;

    // // manage mouse things
    // _this.rows.on('element wheeldown', function(foo, bar) {
    //     this.down();
    //     //console.log("element wheeldown")
    //     let idx = this.getItemIndex(this.selected);
    //     _this.view.widgets.sidebar.emit('syncSelect', idx, 'element wheeldown');
    // });
    // _this.rows.on('element wheelup', function(foo, bar) {
    //     this.up();
    //     //console.log("element wheelup")
    //     let idx = this.getItemIndex(this.selected);
    //     //self.select(idx);
    //     _this.view.widgets.sidebar.emit('syncSelect', idx, 'element wheelup');
    // });
    // _this.rows.on('element click', function(foo, data) {
    //     let idx = data.y-4
    //     // this.select(idx);
    //     // this.view.widgets.sidebar.emit('syncSelect', idx, 'element click');
    // });
    // _this.rows.on('click', function(data, bar) {
    //     //console.log(JSON.stringify(foo));
    //     let idx = data.y-4
    //     this.select(idx);
    //     this.view.widgets.sidebar.emit('syncSelect', idx, 'element click');
    //     // console.log("click")
    //     // console.log(JSON.stringify(foo));
    //     // let idx = this.getItemIndex(this.selected);
    //     // this.select(idx);
    //     // this.view.widgets.sidebar.emit('syncSelect', idx, 'element click');
    // });


    // // manage selections
    // _this.rows.on('element select', function(foo, bar) {
    //     //console.log("element select")
    //     let idx = this.getItemIndex(this.selected);
    //     //self.select(idx);
    //     _this.view.widgets.sidebar.emit('syncSelect', idx, 'element select');
    // });
    // _this.rows.on('select', function(foo, bar){
    //     //console.log("select")
    //     let idx = this.getItemIndex(this.selected);
    //     //self.select(idx);
    //     _this.view.widgets.sidebar.emit('syncSelect', idx, 'select');
    // });

    // manage keypresses
    // _this.rows.key('tab', function(ch, key) {
    //             console.log("thing")
    // });
    // _this.rows.on('mouse', function(ch, key) {
    //     let idx = this.getItemIndex(this.selected);
    //     this.select(idx);
    //     _this.view.widgets.sidebar.emit('syncSelect', idx, 'keypress');
    // });

    this.rows.on('keypress', function(ch, key) {
        //let idx = this.getItemIndex(this.selected);
        //self.select(idx);
        //_this.view.widgets.sidebar.emit('syncSelect', idx, 'keypress');
        //custom key bindings
        if (key.name === 'tab') {
            if (!key.shift) {
                _this.view.setWinFocusNext();
            } else {
                _this.view.setWinFocusPrev();
            }
            return;
        }
    });
    // _this.view.widgets.summarytable.emit('syncSelect', idx, 'element click');
    this.on('syncSelect', function(idx){
        _this.rows.select(idx);
        _this.screen.render();
    });

    // _this.on('syncSelect', function(idx,name) {
    //     _this.rows.select(idx);
    //     _this.screen.render();
    // });
}

module.exports = {SummaryTable};

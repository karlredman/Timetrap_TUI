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

class DetailsTable extends ContribTable {
    constructor({parent = helpers.requiredParam('parent'), options ={},
        theme = 'opaque', config = helpers.requiredParam('config'),
        logger = helpers.requiredParam('logger'),
        view = helpers.requiredParam('view'),
        focusable = false } ={})
    {

        let defaults = {
            // wrap: true,
            // hidden: false,
            // fixed: true,
            parent: parent,
            screen: options.parent,
            //
            left: 0,
            top: 1,
            bottom: 1,
            //
            columnWidth: [11,11,11,64],
            columnSpacing: 2,
            //
            // ignoreKeys: true,
            // scrollable: true,
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
            },
            columnWidth: [6,16,8,8,12,64],
            columnSpacing: 3,
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

DetailsTable.prototype.init = function() {
    let items = {
        headers: ["  Id"  , "      Day"       , "  Start", "   End"   ," Duration", " Notes"],
        data: [
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"],
        ]};
    this.setData(items);
    this.rows.select(0)
}


DetailsTable.prototype.registerActions = function() {
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
}


module.exports = {DetailsTable};

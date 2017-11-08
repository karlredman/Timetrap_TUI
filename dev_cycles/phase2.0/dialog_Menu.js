"use strict";

// dependencies
var blessed = require('blessed'),
    Contrib = require('blessed-contrib'),
    ContribTable = Contrib.table;

// project includes
var {DialogConfig} = require('./dialog_DialogConfig');
var {TimetrapTUI_Error} = require('./Errors');
var helpers = require('./helpers');

// debugging
//var util = require('util');

/////////////////////// examples

class Menu extends ContribTable {
    constructor({
        widget = helpers.requiredParam('widget'),
        config = new DialogConfig(),
        target = null,
        options = {}
    } ={})
    {
        // because we can't use this until later
        let theme = widget.view.theme;

        let defaults = {
            parent: widget.view.screen,
            //
            //lockKeys: config.data.traits.lockKeys,
            keys: config.data.traits.keys,
            tags: config.data.traits.tags,
            align: config.data.traits.align,
            left: config.data.traits.left,
            top: config.data.traits.top,
            height: config.data.traits.height,
            // width: config.data.traits.width,
            width: 23,
            interactive: true,
            vi: true,
            invert: false,
            padding: 0,
            mouse: true,
            input: true,
            focusable: true,
            autoFocus: false,
            fixed: true,
            //
             bg: config.data.colors.bg[theme],
             fg: config.data.colors.fg[theme],
             selectedBg: config.data.colors.selectedBg[theme],
             selectedFg: config.data.colors.selectedFg[theme],
            //
            // bg: "gray",
            // fg: "white",
            // selectedBg: "gray",
            // selectedFg: "yellow",
            //
            border: {
                type: 'line',
                bg: config.data.colors.border.bg[theme],
                fg: config.data.colors.border.fg[theme],
            },
            style: {
                bg: config.data.colors.style.bg[theme],
                fg: config.data.colors.style.fg[theme],
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
            // column traits TODO: move to config?
            columnWidth: [30],
            columnSpacing: 0,
        };

        // merge options into defaults
        options = Object.assign(defaults, options);

        // call parent constructor
        super(options);

        //fix bg color in embedded list (rows)
        this.rows.options.style.bg = config.data.colors.style.bg[theme];
        this.rows.options.style.fg = config.data.colors.style.fg[theme];

        // saved vars
        this.target = widget;
        if(target !== null){this.target = target};

        this.config = config;
        this.view = widget.view;
        this.theme = widget.view.theme;
        this.log = widget.view.log;

        // grab local datascructures, etc.
        this.init();

        //focusable
        this.focus();

        //register actions
        this.registerActions();

        this.view.screen.saveFocus();
    }
}
Menu.prototype.init = function() {
    //debug
    let items = {
                headers: ["Select display range"],
        data: [
            ["today"],
            ["yesterday"],
            ["week"],
            ["month"],
            ["forever"],
        ]};
    this.setData(items);
    this.rows.select(0);
}
Menu.prototype.registerActions = function() {
    let _this = this;

    this.rows.on('blur', function() {
        if(this.focused){
            //TODO: there's probably a better way to do this. this generates
            //a lot of trafic (as in per tick i think).
            return;
        }
        _this.view.emit('destroy_widget', _this);
    });

    this.rows.on('keypress', function(ch, key) {
        if ( (key.name === 'escape') )
        {
            _this.view.emit('destroy_widget', _this);
            return;
        }
        if (key.name === 'enter')
        {
            let key = this.items[this.selected].content.replace(/ /g, '');
            switch(key) {
                case 'forever':
                    key = 'display';
                    break;
                default:
                    break;
            }
            //TODO: switch to selected emit type call
            _this.view.widgets.details_status.setContent("Loading...");
            _this.view.widgets.details_table.rows.clearItems();
            _this.view.timetrap.callCommand({type: key, owner: 'detailstable', sheet: _this.view.sheet, sync: false});

            //destroy
            _this.view.emit('destroy_widget', _this);
            return;
        }
    });
}
module.exports = {Menu};

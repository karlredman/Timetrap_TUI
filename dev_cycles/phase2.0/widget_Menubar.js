"use strict";

// dependencies
var blessed = require('blessed'),
    Listbar = blessed.listbar;

// project includes
var {MenubarConfig} = require('./widget_MenubarConfig');
var {TimetrapTUI_Error} = require('./Errors');
var helpers = require('./helpers');

// debugging
var util = require('util');

class Menubar extends Listbar {
    constructor({parent = helpers.requiredParam('parent'), options ={},
        theme = 'opaque', config = helpers.requiredParam('config'),
        logger = helpers.requiredParam('logger'),
        view = helpers.requiredParam('view')} ={}) {

        let defaults = {
            parent: parent,
            //
            autoCommandKeys: true,
            //
            height: 1,
            top: 0,
            left: 0,
            width: '100%',
            //
            keys: null,            //we're overriding keys
            xkeys: true,
            mouse: true,
            vi: true,
            //
            scrollable: true,
            invertSelected: false,
            //
            bg: config.data.colors.bg[theme],
            fg: config.data.colors.fg[theme],
            //
            style: {
                    bg: config.data.colors.style.bg[theme],
                    fg: config.data.colors.style.fg[theme],
                item: {
                    bg: config.data.colors.style.item.bg[theme],
                    fg: config.data.colors.style.item.fg[theme],
                },
                prefix: {
                    bg: config.data.colors.style.prefix.bg[theme],
                    fg: config.data.colors.style.prefix.fg[theme],
                },
                selected: {
                    bg: config.data.colors.style.selected.bg[theme],
                    fg: config.data.colors.style.selected.fg[theme],
                },
            },
        };

        // merge options into defaults
        options = Object.assign(defaults, options);

        // call parent constructor
        super(options);

        // saved options
        this.theme = theme;
        this.config = config;
        this.log = logger;
        this.view = view;

        // log is interactive (for parent contrib.log)
        this.interactive = true

        // grab local datascructures, etc.
        this.init();
    }
}

Menubar.prototype.registerActions = function() {
    let _this = this;

    this.on('blur', function() {
        //always reset the menu to first option
        _this.select(0);
    });
    this.on('focus', function() {
        //always reset the menu to first option
        _this.select(0);
    });

    this.on('keypress', function(ch, key) {
        // custom key bindings
        if (key.name === 'tab') {
            if (!key.shift) {
                _this.view.setWinFocusNext();
            } else {
                _this.view.setWinFocusPrev();
            }
            return;
        }
        if (key.name === 'left'
            || (_this.options['vi'] && key.name === 'h')
            //|| (key.shift && key.name === 'tab')
        ) {
            // let item = _this.items[_this.selected];
            // item.style.bg = null;
            // item.style.fg = "white";
            _this.moveLeft();
            //item = _this.items[_this.selected];
            // item.style.bg = "black";
            // item.style.fg = "lightblue";
            _this.screen.render();
            // Stop propagation if we're in a form.
            //if (key.name === 'tab') return false;
            return;
        }
        if (key.name === 'right'
            || (_this.options['vi'] && key.name === 'l')
            //|| key.name === 'tab'
        ) {
            // let item = _this.items[_this.selected];
            // item.style.bg = null;
            // item.style.fg = "white";
            _this.moveRight();
            // item = _this.items[_this.selected];
            // item.style.bg = "black";
            // item.style.fg = "lightblue";
            _this.screen.render();
            // Stop propagation if we're in a form.
            //if (key.name === 'tab') return false;
            return;
        }
        if (key.name === 'enter'
            || (_this.options['vi'] && key.name === 'k' && !key.shift)) {
            _this.emit('action', _this.items[_this.selected], _this.selected);
            _this.emit('select', _this.items[_this.selected], _this.selected);
            let item = _this.items[_this.selected];
            if (item._.cmd.callback) {
                item._.cmd.callback();

                // //TODO: timer to set 'unselected'
                // setTimeout(function(){
                //     // item.style.bg = null;
                //     // item.style.fg = "white";
                //     _this.select(0);
                //     _this.screen.render();
                // }, 1000);
            }
            _this.screen.render();
            return;
        }
    });
}

Menubar.prototype.init = function() {
    let _this = this;

    let items = {
        // 1
        In: () => {
            //console.log("In")
        },
        // 2
        Out: () => {
            //console.log("Out")
        },
        // 3
        Edit: () => {
            //console.log("Edit")
        },
        // 4
        Task: () => {
            //console.log("Task")
        },
        // 5
        Details: () => {
            let selected = _this.view.widgets.sheettree.rows.selected;
            let idx = _this.view.widgets.sheettree.rows.getItemIndex(_this.selected);
            let node_lines = _this.view.widgets.sheettree.nodeLines;

            let sheet = node_lines[selected].sheet;
            let id = node_lines[selected].info.id;
            let note = node_lines[selected].info.note;

            if(_this.view.widgets.sheettree.nodeLines[selected].info.running === '-:--:--') {
                _this.log.msg("not a valid time sheet", _this.log.loglevel.production.warning);
                return;
            }
            let running = false;
            if(_this.view.widgets.sheettree.nodeLines[selected].info.running !== '0:00:00') {
                running = true
            }
            _this.view.controller.emit('create_view', { view_name: 'details', sheet: sheet, running: running });
        },
        // 6
        'Stop all': () => {
        },
        // 7
        New: () => {
        },
        // 8
        Kill: () => {
        },
        // 9
        Theme: () => {
        },
        // 0
        Test2: () => {
        },
    }
    this.setItems(items);
}
module.exports = {Menubar};

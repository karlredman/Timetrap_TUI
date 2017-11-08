"use strict";

// dependencies
var blessed = require('blessed'),
    Listbar = blessed.listbar;

// project includes
//var {DetailsMenubarConfig} = require('./widget_DetailsMenubarConfig');
var {TimetrapTUI_Error} = require('./Errors');
var helpers = require('./helpers');
var {Message} = require('./dialog_Message.js'),
    {Prompt} = require('./dialog_Prompt.js'),
    {Question} = require('./dialog_Question.js'),
    {Menu} = require('./dialog_Menu.js');

// debugging
var util = require('util');

class DetailsMenubar extends Listbar {
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
            keys: false,            //we're overriding keys
            //xkeys: true,
            //lockKeys: true,
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

DetailsMenubar.prototype.registerActions = function() {
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
        ) {
            if(_this.selected === 0 ) {
                _this.select(_this.items.length-1);
                return;
            }
            _this.moveLeft();
            _this.screen.render();
            return;
        }
        if (key.name === 'right'
            || (_this.options['vi'] && key.name === 'l')
        ) {
            if(_this.selected === (_this.items.length-1)) {
                _this.select(0);
                return;
            }
            _this.moveRight();
            _this.screen.render();
            return;
        }
        if (key.name === 'enter'
            || (_this.options['vi'] && key.name === 'k' && !key.shift))
        {
            _this.emit('action', _this.items[_this.selected], _this.selected);
            _this.emit('select', _this.items[_this.selected], _this.selected);

            let item = _this.items[_this.selected];
            if (item._.cmd.callback) {
                item._.cmd.callback();
            }
            _this.screen.render();
            return;
        }
    });
}

DetailsMenubar.prototype.init = function() {
    let _this = this;

    let items = {
        // 1
        Close: () => {
            //cleanup any dialogs
            _this.view.widgets.details_table.focus();
            //destroy the view
            _this.view.controller.emit('destroy_view', {view_name: 'details'})
        },
        // 2
        Resume: () => {
        },
        // 3
        Edit: () => {
        },
        // 4
        Display: () => {
            let submenu = new Menu({widget: _this});
            submenu.rows.focus();
        },
        // 5
        Sheet: () => {
        },
        // 6
        Move: () => {
        },
        // 7
        Archive: () => {
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
module.exports = {DetailsMenubar};

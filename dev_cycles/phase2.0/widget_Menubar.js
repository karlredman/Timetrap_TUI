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
        this.logger = logger;
        this.view = view;

        // log is interactive (for parent contrib.log)
        this.interactive = true

        // grab local datascructures, etc.
        this.init();
    }
}

Menubar.prototype.registerActions = function() {
}

Menubar.prototype.init = function() {
    let items = {
        // 1
        In: () => {
        },
        // 2
        Out: () => {
        },
        // 3
        Edit: () => {
        },
        // 4
        Task: () => {
        },
        // 5
        Details: () => {
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
        Test1: () => {
            this.view.widgets.viewbox.focus();
        },
        // 0
        Test2: () => {
        },
    }
    this.setItems(items);
}
module.exports = {Menubar};

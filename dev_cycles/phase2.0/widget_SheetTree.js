"use strict";

// dependencies
var Contrib = require('blessed-contrib'),
    ContribTree = Contrib.tree;

// project includes
var {SheetTreeConfig} = require('./widget_SheetTreeConfig');
var {TimetrapTUI_Error} = require('./Errors');
var helpers = require('./helpers');

// debugging
var util = require('util');

class SheetTree extends ContribTree {
    constructor({parent = helpers.requiredParam('parent'), options ={},
        theme = 'opaque', config = helpers.requiredParam('config'),
        logger = helpers.requiredParam('logger'),
        view = helpers.requiredParam('view')} ={}) {

        let defaults = {
            parent: parent,
            //
            left: 0,
            top: 1,
            bottom: 1,
            width: config.data.traits.width,
            //
            keys: [],
            vi: true,
            mouse: true,
            //
            tags: true,
            align: "left",
            //
            template: {
                // override parent characters
                extend: ' ',
                retract: ' ',
                lines: true,
            },
            //
            border: {type: "line"},
            //
            style: {
                bg: config.data.colors.style.bg,
                fg: config.data.colors.style.fg,
                //
                selected: {
                    bg: config.data.colors.style.selected.bg,
                    fg: config.data.colors.style.selected.fg,
                },
                //
                item: {
                    bg: config.data.colors.style.item.bg,
                    fg: config.data.colors.style.item.fg,
                    hover: {
                        bg: config.data.colors.style.item.hover.bg,
                        fg: config.data.colors.style.item.hover.fg,
                    },
                },
            },
            data: options.data || {},
        };
        // merge options into defaults
        options = Object.assign(defaults, options);

        // call parent constructor
        super(options);

        // saved options
        this.theme = theme;
        this.config = config;
        this.view = view;

        // log is interactive (for parent contrib.log)
        //this.interactive = true

        // grab local datascructures, etc.
        this.init();
    }
}

SheetTree.prototype.init = function() {
    let fs = require('fs');
    let data = JSON.parse(fs.readFileSync(file, 'utf8'));
    this.setData(data);
    this.view.screen.render();
}

SheetTree.prototype.registerActions = function() {
}
module.exports = {SheetTree};

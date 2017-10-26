"use strict";

// dependencies
var blessed = require('blessed'),
    Contrib = require('blessed-contrib'),
    ContribTree = Contrib.tree,
    Box = blessed.Box;

// project includes
//var {SheetTreeConfig} = require('./widget_SheetTreeConfig');
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
            //width: config.data.traits.width,
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
            data: options.data || {},
        };
        // merge options into defaults
        //shallow copy is fine here
        options = Object.assign({}, defaults, options);

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

SheetTree.prototype.render = function() {
    //replace parent's render to accomidate for tree placement

    //if (this.screen.focused === this.rows) this.rows.focus();

    this.rows.top = this.top+1;
    this.rows.width = this.width - 3;
    this.rows.height = this.height - 4;

    //TODO: this is a cheat !!! and memory leak ?? -investigate
    Box.prototype.render.call(this);
};

SheetTree.prototype.init = function() {

    // debug testing -fake data for tree
    let fs = require('fs');
    let file = './__tests__/input/tree.json';
    let data = fs.readFileSync(file, 'utf8');
    let obj = JSON.parse(data);
    this.setData(obj);
    this.view.screen.render();


    // setTimeout(() => {
        // this.options.width = 150;
        // this.options.style.border.fg = "yellow";
        // this.options.parent.render();
    // }5000)
}

SheetTree.prototype.registerActions = function() {
    let _this = this;

    this.on('keypress', function(ch, key) {
        let self = this;
        if (key.name === 'tab') {
            if (!key.shift) {
                _this.view.setWinFocusNext();
            } else {
                _this.view.setWinFocusPrev();
            }
            return;
        }
    });

    this.rows.on('keypress', function(ch, key) {
        let self = this;
        if (key.name === 'tab') {
            if (!key.shift) {
                _this.view.setWinFocusNext();
            } else {
                _this.view.setWinFocusPrev();
            }
            return;
        }

        // if (key.name === 'space'){
        //     let idx = self.getItemIndex(this.selected);
        //     _this.view.widgets.summarytable.emit('keypress', ch, key);
        //     return;
        // }

        // TODO: this isn't working
        if (
            ( key.name === 'pagedown' )
            // || ( key.name === 'space' )
        )
        {
            //_this.emit('keypress', 'C-d',{name:'d',sequence: '\u0004', ctrl: true, full:'C-d'})
            this.emit('keypress', 'C-d',{name:'d', ctrl: true, full:'C-d'})
        }
        if ( key.name === 'pageup')
        {
            //_this.emit('keypress', 'C-u',{name:'u',sequence: '\u0015', ctrl: true, full:'C-u'})
            this.emit('keypress', 'C-u',{name:'u', ctrl: true, full:'C-u'})
        }

        let idx = self.getItemIndex(this.selected);
        _this.view.widgets.summarytable.emit('syncSelect', idx, 'element click');

    });

    // manage mouse things
    _this.rows.on('element wheeldown', function(foo, bar) {
        let self = this;
        let idx = self.getItemIndex(this.selected);
        _this.view.widgets.summarytable.emit('syncSelect', idx, 'element wheeldown');
    });
    _this.rows.on('element wheelup', function(foo, bar) {
        let self = this;
        let idx = self.getItemIndex(this.selected);
        _this.view.widgets.summarytable.emit('syncSelect', idx, 'element wheelup');
    });
    _this.rows.on('element click', function(foo, bar) {
        let self = this;
        let idx = self.getItemIndex(this.selected);
        _this.view.widgets.summarytable.emit('syncSelect', idx, 'element click');
    });
}
module.exports = {SheetTree};

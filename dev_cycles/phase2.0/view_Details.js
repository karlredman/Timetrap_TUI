"use strict";

// class dependencies
var blessed = require('blessed');

// project dependencies
require('./Errors');
var {ViewBox} = require('./widget_ViewBox'),
    {ViewBoxConfig} = require('./widget_ViewBoxConfig'),
    {Logger} = require('./widget_Logger'),
    {LoggerConfig} = require('./widget_LoggerConfig'),
    {Menubar} = require('./widget_DetailsMenubar'),
    {MenubarConfig} = require('./widget_MenubarConfig');
var {DetailsTable} = require('./widget_DetailsTable'),
    {SummaryTableConfig} = require('./widget_SummaryTableConfig');

var helpers = require('./helpers');

// debugging
var util = require('util');

// parent
const {EventEmitter} = require('events').EventEmitter;

////////////////////////////////////////////
/////////////// ViewDetails Class
////////////////////////////////////////////

class ViewDetails extends EventEmitter {
    constructor({
        screen = helpers.requiredParam('screen'),
        process_config = helpers.requiredParam('process_config'),
        controller = helpers.requiredParam('controller'),
        config = helpers.requiredParam('ViewDetails'),
        } ={})
    {

        super();
        this.screen = screen;
        this.process_config = process_config;
        this.theme = this.process_config.data.color_theme.value
        this.controller = controller;
        this.config = config;

        // widgets
        this.widgets = {};

        //create widgets
        this.createWidgets();

        // this view actions
        this.registerActions();

        //set up focus
        this.pwin ={
            sheettree: 1,
            menubar: 2,
            logger: 3,
            summarytable: 4,
        };
        this.pwin.first = this.pwin.sheettree;
        this.pwin.last = this.pwin.logger;
        this.pwin.curWin;

        //register actions of our widgets
        for (let key in this.widgets) {
            if ( ! this.widgets.hasOwnProperty(key)) continue;
            this.widgets[key].registerActions()
        }


        //initial focus
        this.setWinFocus(this.pwin.sheettree);

        //hide loading // TODO: should be an event
        this.controller.widgets.loading.stop();
    }
}

ViewDetails.prototype.setWinFocus = function(win){
}

ViewDetails.prototype.setWinFocusNext = function(){

    //specific behavior
    switch(this.pwin.curWin){
        case this.pwin.menubar:
            this.setWinFocus(this.pwin.sheettree);
            break;
        case this.pwin.sheettree:
            this.setWinFocus(this.pwin.menubar);
            break;
        case this.pwin.logger:
            this.setWinFocus(this.pwin.sheettree);
            break;
    }
}

ViewDetails.prototype.setWinFocusPrev = function(){

    //specific behaovior
    switch(this.pwin.curWin){
        case this.pwin.menubar:
            this.setWinFocus(this.pwin.sheettree);
            break;
        case this.pwin.sheettree:
            this.setWinFocus(this.pwin.logger);
            break;
        case this.pwin.logger:
            this.setWinFocus(this.pwin.sheettree);
            break;
    }
}


ViewDetails.prototype.registerActions = function(){
    // this.screen.on('resize', () => {
    //     this.log.
    // });
}

ViewDetails.prototype.createWidgets = function(){
    // view base object
    let viewbox_config = new ViewBoxConfig();
    this.widgets.viewbox = new ViewBox({
        parent: this.screen,
        config: viewbox_config,
        theme: this.process_config.data.color_theme.value
    });
    this.widgets.viewbox.setContent("details view viewbox");

    // logger
    let logger_config = new LoggerConfig();
    this.widgets.logger = new Logger({
        parent: this.widgets.viewbox,
        config: logger_config,
        theme: this.theme,
        view: this,
        first_msg: "{center}Details View [1 to close, C-c to exit, ? for help]{/center}"
    });
    this.log = this.widgets.logger;

    // menubar
    let menubar_config = new MenubarConfig();
    this.widgets.menubar = new Menubar({
        parent: this.widgets.viewbox,
        config: menubar_config,
        theme: this.theme,
        logger: this.widgets.logger,
        view: this
    });

    // details table
    let summarytable_config = new SummaryTableConfig();
    this.widgets.details_table = new DetailsTable({
        parent: this.widgets.viewbox,
        config: summarytable_config,
        theme: this.theme,
        logger: this.widgets.logger,
        view: this,
        focusable: true
    });

    //manage focus
    let logline = blessed.line({
        parent: this.widgets.viewbox,
        orientation: 'horizontal',
        bottom: 1,
        left: 0,
        right: 0,
        fg: this.config.data.colors.focuslines.fg[this.theme],
        bg: this.config.data.colors.focuslines.bg[this.theme],
    });
    let menuline = blessed.line({
        parent: this.widgets.viewbox,
        orientation: 'horizontal',
        top: 1,
        left: 0,
        right: 0,
        fg: this.config.data.colors.focuslines.fg[this.theme],
        bg: this.config.data.colors.focuslines.bg[this.theme]
    });

    // effects that highlight focus
    this.screen.setEffects(menuline, this.widgets.logger, 'focus', 'blur',
        {
            fg: this.config.data.colors.focuslines.disabled.fg[this.theme],
            bg: this.config.data.colors.focuslines.disabled.bg[this.theme]
        }, Object);
    this.screen.setEffects(logline, this.widgets.menubar, 'focus', 'blur',
        {
            fg: this.config.data.colors.focuslines.disabled.fg[this.theme],
            bg: this.config.data.colors.focuslines.disabled.bg[this.theme]
        }, Object);
}

module.exports = {ViewDetails};

"use strict";

// class dependencies
var blessed = require('blessed');

// project dependencies
require('./Errors');
//var {MainConfig} = require('./view_MainConfig');
var {ViewBox} = require('./widget_ViewBox'),
    {ViewBoxConfig} = require('./widget_ViewBoxConfig'),
    {Logger} = require('./widget_Logger'),
    {LoggerConfig} = require('./widget_LoggerConfig'),
    {Menubar} = require('./widget_Menubar'),
    {MenubarConfig} = require('./widget_MenubarConfig'),
    {SheetTree} = require('./widget_SheetTree'),
    {SheetTreeConfig} = require('./widget_SheetTreeConfig'),
    {SummaryTable} = require('./widget_SummaryTable'),
    {SummaryTableConfig} = require('./widget_SummaryTableConfig'),
    {RunningBox} = require('./widget_RunningBox'),
    {RunningBoxConfig} = require('./widget_RunningBoxConfig');
var helpers = require('./helpers');
var {Timetrap} = require('./Timetrap');

// debugging
var util = require('util');

// parent
const {EventEmitter} = require('events').EventEmitter;

////////////////////////////////////////////
/////////////// ViewMain Class
////////////////////////////////////////////

class ViewMain extends EventEmitter {
    constructor({
        screen = helpers.requiredParam('screen'),
        process_config = helpers.requiredParam('process_config'),
        controller = helpers.requiredParam('controller'),
        config = helpers.requiredParam('ViewMain'),
        } ={})
    {

        super();
        this.screen = screen;
        this.process_config = process_config;
        this.theme = this.process_config.data.color_theme.value;
        this.controller = controller;
        this.config = config;

        // new timetrap
        // TODO: fix check that this value is coming from the timetrap config file
        this.timetrap = new Timetrap({watched_db_file: '/home/karl/Documents/Heorot/timetrap/timetrap.db'});

        // monitor db for changes
        this.timetrap.monitorDBStart();

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

ViewMain.prototype.setWinFocus = function(win){
    // The focus and effects are managed here so mouse actions don't cause
    // false positives.
    switch(win){
        case this.pwin.summarytable:
            this.setWinFocus(this.pwin.sheettree);
            // //we shouldn't be here
            // this.widgets.summarytable.options.style.border.fg = "yellow";
            // this.widgets.sheettree.options.style.border.fg = "yellow";
            // this.widgets.summarytable.focus();
            break;
        case this.pwin.sheettree:
            // this.widgets.summarytable.options.style.border.fg = "green";
            // this.widgets.sheettree.options.style.border.fg = "green";
            this.widgets.summarytable.options.style.border.fg = this.widgets.summarytable.config.data.colors.style.border.fg[this.theme];
            this.widgets.sheettree.options.style.border.fg = this.widgets.sheettree.config.data.colors.style.border.fg[this.theme];
            this.widgets.sheettree.focus();
            break;
        case this.pwin.menubar:
            // this.widgets.summarytable.options.style.border.fg = "red";
            // this.widgets.sheettree.options.style.border.fg = "red";
            this.widgets.summarytable.options.style.border.fg = this.config.data.colors.focuslines.disabled.fg[this.theme];
            this.widgets.sheettree.options.style.border.fg = this.config.data.colors.focuslines.disabled.fg[this.theme];
             this.widgets.menubar.focus();
            break;
        case this.pwin.logger:
            // this.widgets.summarytable.options.style.border.fg = "red";
            // this.widgets.sheettree.options.style.border.fg = "red";
            this.widgets.summarytable.options.style.border.fg = this.config.data.colors.focuslines.disabled.fg[this.theme];
            this.widgets.sheettree.options.style.border.fg = this.config.data.colors.focuslines.disabled.fg[this.theme];
            this.widgets.logger.focus();
            break;
        default:
            this.loading_dialog = new DialogMessage({target: this, parent: this.screen});
            this.loading_dialog.alert('Bad window number');
            break;
    }

    this.pwin.curWin = win;

    //TODO: rework this for color themes

    //toggle menu colors
    if ( win === this.pwin.menubar ) {
        // menu is active highlight only the selected one
        this.widgets.menubar.options.style.bg = this.widgets.menubar.config.data.colors.style.bg[this.theme];
        this.widgets.menubar.options.style.fg = this.widgets.menubar.config.data.colors.style.fg[this.theme];

        this.widgets.menubar.options.style.item.bg = this.widgets.menubar.config.data.colors.style.item.bg[this.theme];
        this.widgets.menubar.options.style.item.fg = this.widgets.menubar.config.data.colors.style.item.fg[this.theme];

        this.widgets.menubar.options.style.prefix.bg = this.widgets.menubar.config.data.colors.style.prefix.bg[this.theme];
        this.widgets.menubar.options.style.prefix.fg = this.widgets.menubar.config.data.colors.style.prefix.fg[this.theme];

        this.widgets.menubar.options.style.selected.bg = this.widgets.menubar.config.data.colors.style.selected.bg[this.theme];
        this.widgets.menubar.options.style.selected.fg = this.widgets.menubar.config.data.colors.style.selected.fg[this.theme];
    }
    else {
        // menu is not active don't show highlights
        this.widgets.menubar.options.style.bg = this.widgets.menubar.config.data.colors.style.inactive.bg[this.theme];
        this.widgets.menubar.options.style.fg = this.widgets.menubar.config.data.colors.style.inactive.fg[this.theme];

        this.widgets.menubar.options.style.item.bg = this.widgets.menubar.config.data.colors.style.inactive.bg[this.theme];
        this.widgets.menubar.options.style.item.fg = this.widgets.menubar.config.data.colors.style.inactive.fg[this.theme];

        this.widgets.menubar.options.style.prefix.bg = this.widgets.menubar.config.data.colors.style.inactive.bg[this.theme];
        this.widgets.menubar.options.style.prefix.fg = this.widgets.menubar.config.data.colors.style.inactive.fg[this.theme];

        this.widgets.menubar.options.style.selected.bg = this.widgets.menubar.config.data.colors.style.inactive.bg[this.theme];
        this.widgets.menubar.options.style.selected.fg = this.widgets.menubar.config.data.colors.style.inactive.fg[this.theme];
    }
    this.screen.render();
}

ViewMain.prototype.setWinFocusNext = function(){

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

ViewMain.prototype.setWinFocusPrev = function(){

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


ViewMain.prototype.registerActions = function(){
    let _this = this;

    this.on('hide_view', () => {
        _this.log.msg("hiding main view", _this.log.loglevel.devel.message);
        _this.widgets.viewbox.hide();
    });
    this.on('show_view', () => {
        _this.log.msg("showing main view", _this.log.loglevel.devel.message);
        _this.widgets.viewbox.show();
    });
    this.on('destroy_widget', (widget) => {
        if(widget === 'menubar'){
            _this.widgets.menubar.destroy();
            _this.widgets.menubar.free();
            delete _this.widgets.menubar.config;
            delete _this.widgets.menubar;
            _this.log.msg("destroyed menubar while creating view details", _this.log.loglevel.devel.message);
        }
    });
    this.on('create_widget', (widget) => {
        if(widget === 'menubar'){
            // menubar
            let menubar_config = new MenubarConfig();
            _this.widgets.menubar = new Menubar({
                //parent: _this.widgets.viewbox,
                parent: _this.widgets.viewbox,
                config: menubar_config,
                theme: _this.theme,
                logger: _this.widgets.logger,
                view: _this
            });
            _this.widgets.menubar.registerActions();
        }
    });
    this.on('focus_default', () => {
        //_this.widgets.sheettree.rows.select(0);
        _this.setWinFocus(_this.pwin.sheettree);
    });

}

ViewMain.prototype.createWidgets = function(){

    // view base object
    let viewbox_config = new ViewBoxConfig();
    this.widgets.viewbox = new ViewBox({
        parent: this.screen,
        config: viewbox_config,
        theme: this.process_config.data.color_theme.value
    });
    this.widgets.viewbox.setContent("main view viewbox");

    // logger
    let logger_config = new LoggerConfig();
    this.widgets.logger = new Logger({
        parent: this.widgets.viewbox,
        config: logger_config,
        theme: this.theme,
        view: this,
        devel: this.process_config.data.developer_mode.value,
        first_msg: "{center}Welcome to Timetrap TUI! [C-c to exit, ? for help]{/center}"
    });
    //convenience
    this.log = this.widgets.logger;

    // TODO: debug -kill
    // usage: this.log.msg("test message", this.log.loglevel.production.message);
    // usage: this.log.msg("test message", this.log.loglevel.production.warning);
    // usage: this.log.msg("test message", this.log.loglevel.production.error);

    // menubar
    let menubar_config = new MenubarConfig();
    this.widgets.menubar = new Menubar({
        parent: this.widgets.viewbox,
        config: menubar_config,
        theme: this.theme,
        logger: this.widgets.logger,
        view: this
    });

    // sheet tree
    let sheettree_config = new SheetTreeConfig();
    this.widgets.sheettree = new SheetTree({
        parent: this.widgets.viewbox,
        config: sheettree_config,
        theme: this.theme,
        logger: this.widgets.logger,
        view: this
    });

    // summary table
    let summarytable_config = new SummaryTableConfig();
    this.widgets.summarytable = new SummaryTable({
        parent: this.widgets.viewbox,
        config: summarytable_config,
        theme: this.theme,
        logger: this.widgets.logger,
        view: this
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

    // running box
    let runningbox_config = new RunningBoxConfig();
    this.widgets.runningbox = new RunningBox({
        parent: this.widgets.viewbox,
        //parent: this.screen,
        config: runningbox_config,
        theme: this.theme,
        logger: this.widgets.logger,
        view: this
    });


    this.screen.render();
}

module.exports = {ViewMain};

"use strict";

// class dependencies
var blessed = require('blessed');

// project dependencies
require('./Errors');
var {ViewBox} = require('./widget_ViewBox'),
    {ViewBoxConfig} = require('./widget_ViewBoxConfig'),
    {Logger} = require('./widget_Logger'),
    {LoggerConfig} = require('./widget_LoggerConfig'),
    {DetailsMenubar} = require('./widget_DetailsMenubar'),
    {DetailsMenubarConfig} = require('./widget_DetailsMenubarConfig'),
    {DetailsTable} = require('./widget_DetailsTable'),
    {DetailsTableConfig} = require('./widget_DetailsTableConfig'),
    {DetailsStatus} = require('./widget_DetailsStatus'),
    {DetailsStatusConfig} = require('./widget_DetailsStatusConfig');
var {Timetrap} = require('./Timetrap');


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
        sheet = helpers.requiredParam('sheet'),
        running = helpers.requiredParam('running'),
        } ={})
    {

        super();
        this.screen = screen;
        this.process_config = process_config;
        this.theme = this.process_config.data.color_theme.value
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
            table: 1,
            menubar: 2,
            logger: 3
        };
        this.pwin.first = this.pwin.table;
        this.pwin.last = this.pwin.logger;
        this.pwin.curWin;

        //register actions of our widgets
        for (let key in this.widgets) {
            if ( ! this.widgets.hasOwnProperty(key)) continue;
            this.widgets[key].registerActions()
        }


        //initial focus
        this.setWinFocus(this.pwin.table);

        //class variables
        this.sheet = sheet;
        this.running = running;

        // TODO: remove
        this.controller.widgets.loading.stop();

    }
}

ViewDetails.prototype.run = function() {

    //get data from timetrap -defaults to today
    // TODO: -add default option to config?
    this.timetrap.callCommand({type:'today', owner: 'detailstable', sheet: this.sheet, sync: false});
}

ViewDetails.prototype.setWinFocus = function(win){
    // The focus and effects are managed here so mouse actions don't cause
    // false positives.
    switch(win){
        case this.pwin.table:
            this.widgets.details_table.options.style.border.fg = this.widgets.details_table.config.data.colors.style.border.fg[this.theme];
            this.widgets.details_table.focus();
            break;
        case this.pwin.menubar:
            this.widgets.details_table.options.style.border.fg = this.config.data.colors.focuslines.disabled.fg[this.theme];
             this.widgets.menubar.focus();
            break;
        case this.pwin.logger:
            this.widgets.details_table.options.style.border.fg = this.config.data.colors.focuslines.disabled.fg[this.theme];
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

ViewDetails.prototype.setWinFocusNext = function(){

    //specific behavior
    switch(this.pwin.curWin){
        case this.pwin.menubar:
            this.setWinFocus(this.pwin.table);
            break;
        case this.pwin.table:
            this.setWinFocus(this.pwin.menubar);
            break;
        case this.pwin.logger:
            this.setWinFocus(this.pwin.table);
            break;
    }
}

ViewDetails.prototype.setWinFocusPrev = function(){

    //specific behaovior
    switch(this.pwin.curWin){
        case this.pwin.menubar:
            this.setWinFocus(this.pwin.table);
            break;
        case this.pwin.table:
            this.setWinFocus(this.pwin.logger);
            break;
        case this.pwin.logger:
            this.setWinFocus(this.pwin.table);
            break;
    }
}

ViewDetails.prototype.registerActions = function(){
    let _this=this;

    // this.view.controller.timetrap.on('db_change', function(){
    //     //update the sheet tree and summary table when the db changes
    //     _this.view.controller.timetrap.callCommand({type:'list', owner: 'sheettree', sync: false});
    //     this.log.msg("database changed externally", this.log.loglevel.production.message);
    // });

    this.on('details_loaded', () => {
        let _this = this;
        //hide loading
        _this.controller.widgets.loading.stop();
    });

    this.on('hide_view', () => {
        _this.log.msg("hiding details view", _this.log.loglevel.devel.message);
        _this.widgets.viewbox.hide();
    });
    this.on('show_view', () => {
        _this.log.msg("showing details view", _this.log.loglevel.devel.message);
        _this.widgets.viewbox.show();
    });
    this.timetrap.on('db_change', function(){
        //update the sheet tree and summary table when the db changes
        //_this.view.timetrap.callCommand({type:'list', owner: 'sheettree', sync: false});
        _this.log.msg("database changed externally", _this.log.loglevel.production.message);
    });

    this.on('destroy_widget', (widget) => {
        widget.destroy();
        widget.free();
        delete widget.config;
        widget = undefined;
        _this.log.msg("destroyed widget", _this.log.loglevel.devel.message);
        _this.widgets.details_table.focus();
    });
}

ViewDetails.prototype.destroyAllWidgets = function() {
    // TODO: copy logs to main view's logs

    let kill_list = [
    'menubar',
    'details_table',
    'details_status',
    'logger',
    'viewbox',
    ];

    //this.widgets.details_status.removeListener('update_status', this.widgets.details_status.setStatus);
    // for (let i in kill_list) {
    //     //if ( ! this.widgets.hasOwnProperty(key)) continue;
    //     this.widgets[kill_list[i]].destroy()
    //     this.widgets[kill_list[i]].removeAllListeners();
    //     this.widgets[kill_list[i]].free()
    //     delete this.widgets[kill_list[i]].config;
    //     delete this.widgets[kill_list[i]];
    // }

    // destroy all widgets
    //for (let key in this.widgets) {
    for (let key in kill_list) {
        if ( ! this.widgets.hasOwnProperty(key)) continue;
        this.widgets[key].destroy()
        this.widgets[key].removeAllListeners();
        this.widgets.menubar.removeScreenEvent('keypress');
        this.widgets[key].free()
        delete this.widgets[key].config;
        delete this.widgets[key];
        this.widgets[key] = undefined;
    }
    this.timetrap.removeAllListeners();
    delete this.timetrap;
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
        devel: this.process_config.data.developer_mode.value,
        first_msg: "{center}Details View [1 to close, C-c to exit, ? for help]{/center}"
    });
    this.log = this.widgets.logger;

    // status box
    let details_status_config = new DetailsStatusConfig();
    this.widgets.details_status = new DetailsStatus({
        parent: this.widgets.viewbox,
        config: details_status_config,
        theme: this.theme,
        logger: this.widgets.logger,
        view: this
    });

    // menubar
    let menubar_config = new DetailsMenubarConfig();
    this.widgets.menubar = new DetailsMenubar({
        parent: this.widgets.viewbox,
        //parent: this.widgets.viewbox,
        config: menubar_config,
        theme: this.theme,
        logger: this.widgets.logger,
        view: this
    });

    // details table
    let details_table_config = new DetailsTableConfig();
    this.widgets.details_table = new DetailsTable({
        options: { top: 3,
            //border: {type: "line"},
        },
        parent: this.widgets.viewbox,
        config: details_table_config,
        theme: this.theme,
        logger: this.widgets.logger,
        view: this,
        focusable: true
    });

    //manage focus
    let logline = blessed.line({
    // this.widgets.logline = blessed.line({
        parent: this.widgets.viewbox,
        orientation: 'horizontal',
        bottom: 1,
        left: 0,
        right: 0,
        fg: this.config.data.colors.focuslines.fg[this.theme],
        bg: this.config.data.colors.focuslines.bg[this.theme],
    });
    //this.widgets.logline.prototype.registerActions = function(){};

    let menuline = blessed.line({
    // this.widgets.menuline = blessed.line({
        parent: this.widgets.viewbox,
        orientation: 'horizontal',
        top: 1,
        left: 0,
        right: 0,
        fg: this.config.data.colors.focuslines.fg[this.theme],
        bg: this.config.data.colors.focuslines.bg[this.theme]
    });
    //this.widgets.menuline.prototype.registerActions = function(){};

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

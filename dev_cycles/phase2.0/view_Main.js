"use strict";

// project dependencies
require('./Errors');
var {ViewBox} = require('./widget_ViewBox');
var {ViewBoxConfig} = require('./widget_ViewBoxConfig');
var {Logger} = require('./widget_Logger');
var {LoggerConfig} = require('./widget_LoggerConfig');
var {Menubar} = require('./widget_Menubar');
var {MenubarConfig} = require('./widget_MenubarConfig');


// parent
const {EventEmitter} = require('events').EventEmitter;

////////////////////////////////////////////
/////////////// ViewMain Class
////////////////////////////////////////////

class ViewMain extends EventEmitter {
    constructor({
        screen = null,
        process_config = null,
        controller = null } ={})
    {
        super();
        this.screen = screen;
        this.process_config = process_config;
        this.theme = this.process_config.data.color_theme.value
        this.controller = controller;

        // widgets
        this.widgets = {};

        //create widgets
        this.createWidgets();


        // view actions
        this.registerActions();
        // for (let key in this.widgets) {
        //     if ( ! this.widgets.hasOwnProperty(key)) continue;
        //     this.widgets[key].registerActions()
        // }

        //hide loading
        this.controller.widgets.loading.stop();
    }
}

ViewMain.prototype.registerActions = function(){
}

ViewMain.prototype.createWidgets = function(){
    // view base object
    let viewbox_config = new ViewBoxConfig();
    this.widgets.viewbox = new ViewBox({
        parent: this.screen,
        config: viewbox_config,
        theme: this.process_config.data.color_theme.value
    });
    this.widgets.viewbox.setContent("things and stuff");

    // logger
    let logger_config = new LoggerConfig();
    this.widgets.logger = new Logger({
        parent: this.widgets.viewbox,
        config: logger_config,
        theme: this.theme,
        view: this
    });
    this.log = this.widgets.logger;

    usage: this.log.msg("test message", this.log.loglevel.production.message);
    usage: this.log.msg("test message", this.log.loglevel.production.warning);
    usage: this.log.msg("test message", this.log.loglevel.production.error);

    // menubar
    let menubar_config = new MenubarConfig();
    this.widgets.menubar = new Menubar({
        parent: this.widgets.viewbox,
        config: menubar_config,
        theme: this.theme,
        logger: this.widgets.logger,
        view: this
    });
}

module.exports = {ViewMain};

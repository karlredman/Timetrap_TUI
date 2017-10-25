"use strict";

// dependencies
var Contrib = require('blessed-contrib'),
    ContribLog = Contrib.log;

// project includes
var {LoggerConfig} = require('./widget_LoggerConfig');
var {TimetrapTUI_Error} = require('./Errors');
//
var helpers = require('./helpers');

// debugging
var util = require('util');

class Logger extends ContribLog {
    constructor({parent = helpers.requiredParam('parent'), options ={},
        theme = 'opaque', config = helpers.requiredParam('config'),
        view = helpers.requiredParam('view')} ={}) {

        let defaults = {
            parent: parent,
            //
            height: 1,
            width: '100%',
            top: undefined,
            left: 0,
            bottom: 0,
            right: 0,
            //
            keys: true,
            mouse: true,
            vi: true,
            tags: true,
            wrap: true,
            //
            bg: config.data.colors.bg[theme],
            fg: config.data.colors.fg[theme],
            //
            style:{
                //hightlighted?? //TODO: figure out which fg/bg to use
                bg: config.data.colors.style.bg[theme],
                fg: config.data.colors.style.fg[theme],
                selected: {
                    bg: config.data.colors.style.selected.bg[theme],
                    fg: config.data.colors.style.selected.fg[theme],
                },
                item: {
                    bg: config.data.colors.style.item.bg[theme],
                    fg: config.data.colors.style.item.fg[theme],
                },
                scrollbar: {
                    inverse: true,
                },
            },
            scrollable: true,
            scrollbar: {
                ch: ' ',
            },
            label: undefined,
            content: undefined      //setting content causes tags to not work
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
        this.interactive = true

        // grab local datascructures, etc.
        this.init();
        this.log_count = 0;

        // initial message // TODO: this belongs someplace else
        this.log("{center}Welcome to Timetrap TUI! [C-c to exit, ? for help]{/center}");
    }
}

Logger.prototype.init = function()
{
    //log levels
    this.loglevel = {
        //this is structured to enforce intended audience declaration for log messages
        //i.e. this.msg("something interesting", this.loglevel.production.warning)
        //value: this.config.settings.tui_logger_loglevel.value,
        meta: {
            bg: this.config.data.colors.bg[this.theme],
            fg: this.config.data.colors.fg[this.theme],
            //
            message_bg: this.config.data.colors.message.bg[this.theme],
            message_fg: this.config.data.colors.message.fg[this.theme],
            //
            warning_bg: this.config.data.colors.warning.bg[this.theme],
            warning_fg: this.config.data.colors.warning.fg[this.theme],
            //
            error_bg: this.config.data.colors.error.bg[this.theme],
            error_fg: this.config.data.colors.error.fg[this.theme],
            //
            message_prefix: "",
            warning_prefix: "{bold}Warning: {/bold}",
            error_prefix: "{bold}Error: {/bold}",
        },
        production: {
            message: 0,
            warning: 1,
            error: 2,
        },
        debug: {
            message: 10,
            warning: 11,
            error: 12,
        },
        devel: {
            message: 20,
            warning: 21,
            error: 22,
        },
    }
}
Logger.prototype.msg = function(message, loglevel){
    // usage: this.log.msg("test message", this.log.loglevel.production.warning);

    //we default to message
    let bg = this.loglevel.meta.bg;
    let fg = this.loglevel.meta.fg;
    let prefix = this.loglevel.meta.message_prefix;

    if (
        ( loglevel == this.loglevel.production.warning )
        || ( loglevel == this.loglevel.debug.warning )
        || ( loglevel == this.loglevel.devel.warning )
    ){
        bg = this.loglevel.meta.warning_bg;
        fg = this.loglevel.meta.warning_fg;
        prefix = this.loglevel.meta.warning_prefix;
    }
    if (
        ( loglevel == this.loglevel.production.error )
        || ( loglevel == this.loglevel.debug.error )
        || ( loglevel == this.loglevel.devel.error )
    ){
        bg = this.loglevel.meta.error_bg;
        fg = this.loglevel.meta.error_fg;
        prefix = this.loglevel.meta.error_prefix;
    }

    //log the unixtime
    let date = Date.now();

    // TODO: this is a mess

    this.log_count++;
    this.log(
        //"{"+bg+"-bg}"
        '{center}'
        //+ '['+this.log_count+'|'+date+'] '
        + '['+this.log_count+']'
        //+ (typeof fg === 'undefined') ? '{blue-fg}' : "{"+fg+"-fg}"
        + "{"+fg+"-fg}"
        + prefix
        //+ (typeof fg === 'undefinded') ? '{/blue-fg}' : "{/"+fg+"-fg}"
        + "{/"+fg+"-fg}"
        //
        //+ '{'+this.loglevel.meta.fg+'-fg}'
        + message
        //+ '{/'+this.loglevel.meta.fg+'-fg}'
        //
        + '{/center}'
        //+ "{/"+bg+"-bg}"
    );

    //TODO: async write to file if specified
}
module.exports = {Logger};

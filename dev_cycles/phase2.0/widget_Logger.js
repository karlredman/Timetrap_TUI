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
		theme = 'opaque', config = helpers.requiredParam('config')} ={}) {

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
                bg: config.data.colors.bg[theme],
                fg: config.data.colors.fg[theme],
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

        // log is interactive
        this.interactive = true

        // initial message // TODO: this belongs someplace else
        this.log("{center}0 Welcome to Timetrap TUI! [C-c to exit, ? for help]{/center}");
        this.log("{center}1 Welcome to Timetrap TUI! [C-c to exit, ? for help]{/center}");
        this.log("{center}2 Welcome to Timetrap TUI! [C-c to exit, ? for help]{/center}");
    }
}

Logger.prototype.init = function()
{
    //log levels
    this.loglevel = {
        //this is structured to enforce intended audience declaration for log messages
        //i.e. this.msg("something interesting", this.loglevel.production.warning)
        value: this.config.settings.tui_logger_loglevel.value,
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
module.exports = {Logger};

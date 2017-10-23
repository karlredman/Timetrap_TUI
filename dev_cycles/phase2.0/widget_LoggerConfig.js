"use Strict"

var {ConfigurationBase} = require('./ConfigurationBase');

class LoggerConfig extends ConfigurationBase {
    constructor({config_file = null, config_options = null} ={}) {
        super({root_title: 'Timetrap_TUI', title: 'LoggerConfig', config_options: config_options});
    }
}

LoggerConfig.prototype.loadDefaults = function() {
    this.data = {
        traits: {
            widget_loglevel: {
                value: "devel",
                desc: "the widget log verbosity level",
                options: "devel|production"
            },
            file_loglevel: {
                value: "devel",
                desc: "the file log verbosity level",
                options: "devel|production"
            },
            file_log: {
                value: false,
                desc: "whether to write log text to a file",
                options: 'true|false'
            },
            log_file: {
                value: "./timetrap_tui.log",
                desc: "the full path of the log file (when used)",
                options: ''
            },
        },
        colors: {
            bg: {
                opaque: "black",
                dark: "",
                light: "",
                desc: "the bg color of the logger"
            },
            fg: {
                opaque: "white",
                dark: "white",
                light: "black",
                desc: "the fg color of the logger"
            },
            message_bg: {
                opaque: "black",
                dark: "",
                light: "",
                desc: "the bg color of a message"
            },
            message_fg: {
                opaque: "white",
                dark: "white",
                light: "black",
                desc: "the fg color of a message"
            },
            warning_bg: {
                opaque: "black",
                dark: "",
                light: "",
                desc: "the bg color of a warning"
            },
            warning_fg: {
                opaque: "yellow",
                dark: "yellow",
                light: "yellow",
                desc: "the fg color of a warning"
            },
            error_bg: {
                opaque: "black",
                dark: "",
                light: "",
                desc: "the bg color of an error"
            },
            error_fg: {
                opaque: "red",
                dark: "red",
                light: "red",
                desc: "the fg color of an error"
            },
        }
    };
}

module.exports = {LoggerConfig};

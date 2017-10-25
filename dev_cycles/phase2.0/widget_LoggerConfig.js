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
                none: "",
                opaque: "black",
                dark: "black",
                light: "white",
                desc: "the bg color of the logger"
            },
            fg: {
                none: "",
                opaque: "white",
                dark: "white",
                light: "black",
                desc: "the fg color of the logger"
            },
            style: {
                bg: {
                    none: "",
                    opaque: "black",
                    dark: "black",
                    light: "white",
                    desc: "the style bg color of the logger"
                },
                fg: {
                    none: "",
                    opaque: "white",
                    dark: "white",
                    light: "black",
                    desc: "the style fg color of the logger"
                },
                item: {
                    bg: {
                        none: "",
                        opaque: "black",
                        dark: "black",
                        light: "white",
                        desc: "the style item bg color of the logger"
                    },
                    fg: {
                        none: "",
                        opaque: "white",
                        dark: "white",
                        light: "black",
                        desc: "the style item fg color of the logger"
                    },
                },
                selected: {
                    bg: {
                        none: "",
                        opaque: "black",
                        dark: "black",
                        light: "white",
                        desc: "the style selected bg color of the logger"
                    },
                    fg: {
                        none: "",
                        opaque: "white",
                        dark: "white",
                        light: "black",
                        desc: "the style selected fg color of the logger"
                    },
                }
            },
            message: {
                bg: {
                    none: "",
                    opaque: "black",
                    dark: "black",
                    light: "white",
                    desc: "the bg color of a message"
                },
                fg: {
                    none: "",
                    opaque: "white",
                    dark: "white",
                    light: "black",
                    desc: "the fg color of a message"
                },
            },
            warning: {
                bg: {
                    none: "",
                    opaque: "black",
                    dark: "black",
                    light: "white",
                    desc: "the bg color of a warning"
                },
                fg: {
                    none: "yellow",
                    opaque: "yellow",
                    dark: "yellow",
                    light: "yellow",
                    desc: "the fg color of a warning"
                },
            },
            error: {
                bg: {
                    none: "",
                    opaque: "black",
                    dark: "black",
                    light: "white",
                    desc: "the bg color of an error"
                },
                fg: {
                    none: "red",
                    opaque: "red",
                    dark: "red",
                    light: "red",
                    desc: "the fg color of an error"
                },
            }
        }
    };
}

module.exports = {LoggerConfig};

"use strict"
var fs = require('fs'),
    path = require('path'),
    yaml = require('js-yaml'),
    minimatch = require('minimatch');


function Configuration(){
    // if (!(this instanceof Object)) return new Configuration(version);
    let _this = this;

    // app wide view settings // TODO: move this to view(?)
    _this.view = {};

    // app level
    _this.version = "0.0.10";

    // timetrap config defaults
    _this.settings = {
        tui_working_directory: {
            value: "/tmp",
            desc: "the working directory with no timetrap-sheet \\\n"
            +"                                           "
            +"files in it or it's parents"
        },
        tui_create_missing_sheets: {
            value: false,
            desc: "create missing sheet files from directory name"
        },
        tui_recreate_sheets: {
            value: false,
            desc: "(DANGER): Re-Create ALL time sheet files under \n   tui_projects_template_path based on directory name"
        },
        tui_developer_mode: {
            value: false,
            desc: "run in development mode"
        },
        tui_question_prompts: {
            val: true,
            value: true,
            desc: "whether to use \'Are you sure?\' dialog prompts"
        },
        //logger
        tui_logger_loglevel: {
            value: "devel",
        },
        tui_logger_file_log: {
            value: false,
            desc: "whether to write log text to a file"
            },
        tui_logger_log_file: {
            value: "./timetrap_tui.log",
            desc: "the full path of the log file (when used)"
            },
        tui_logger_bg: {
            value: undefined,
            opaque: "black",
            dark: undefined,
            light: undefined,
            desc: "the bg color of the logger"
        },
        tui_logger_fg: {
            value: undefined,
            opaque: "white",
            dark: "white",
            light: "black",
            desc: "the fg color of the logger"
        },
        tui_logger_message_bg: {
            value: undefined,
            opaque: "black",
            dark: undefined,
            light: undefined,
            desc: "the bg color of a message"
        },
        tui_logger_message_fg: {
            value: undefined,
            opaque: "white",
            dark: "white",
            light: "black",
            desc: "the fg color of a message"
        },
        tui_logger_warning_bg: {
            value: undefined,
            opaque: "black",
            dark: undefined,
            light: undefined,
            desc: "the bg color of a warning"
        },
        tui_logger_warning_fg: {
            value: undefined,
            opaque: "yellow",
            dark: "yellow",
            light: "yellow",
            desc: "the fg color of a warning"
        },
        tui_logger_error_bg: {
            value: undefined,
            opaque: "black",
            dark: undefined,
            light: undefined,
            desc: "the bg color of an error"
        },
        tui_logger_error_fg: {
            value: undefined,
            opaque: "red",
            dark: "red",
            light: "red",
            desc: "the fg color of an error"
        },
    };

    _this.applyDefaults();
}

Configuration.prototype.applyDefaults = function() {
    let _this = this;

    //applies default settings based on theme
    // -mostly used for colors.
    let theme = 'opaque';
    for ( let key in _this.settings) {
        if( typeof _this.settings[key].value === 'undefined'){
            _this.settings[key].value = _this.settings[key][theme];
        }
    }
}

Configuration.prototype.fetch = function() {
    let _this=this;

    //default
    var conf_file = process.env.HOME+"/.timetrap.yml";

    // preference over default
    if (process.env.TIMETRAP_CONFIG_FILE) {
        conf_file = process.env.TIMETRAP_CONFIG_FILE;
    }

    // TODO: fail gracefully if file not found

    //save the file name
    _this.settings.config_file = conf_file;

    try {
        // get the config object
        let config = yaml.safeLoad(fs.readFileSync(conf_file, 'utf8'));

        // now map the yaml stuff into the config object
        for ( let key in config ) {
            if( ! _this.settings.hasOwnProperty(key)) {
                continue;
            }
            _this.settings[key].value = config[key];
        }
    } catch(e) {
        console.log(e);
        process.exit(1);
        //throw(e);
    }
};

///////////////////////////////////////////////////////////////////////////////
Configuration.prototype.type = 'Configuration';
module.exports = Configuration;



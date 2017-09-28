"use strict"
var fs = require('fs'),
    path = require('path'),
    yaml = require('js-yaml'),
    minimatch = require('minimatch');


function Configuration(version){
    // if (!(this instanceof Object)) return new Configuration(version);
    let _this = this;

    // app wide view settings // TODO: move this to view(?)
    _this.view = {};

    // app level
    _this.version = version;

    // timetrap config file
    _this.timetrap_config = {
        tui_developer_mode: {
            value: false,
            desc: "Run in development mode."
        },
        tui_question_prompts: {
            value: true,
            desc: "Use \'are you sure?\' Prompts."
        }
    };

}

Configuration.prototype.fetch = function() {
    let _this=this;

    //default
    var conf_file = process.env.HOME+"/.timetrap.yml";

    // preference over default
    if (process.env.TIMETRAP_CONFIG_FILE) {
        conf_file = process.env.TIMETRAP_CONFIG_FILE;
    }

    //save the file name
    _this.timetrap_config.config_file = conf_file;

    try {
        // get the config object
        let config = yaml.safeLoad(fs.readFileSync(conf_file, 'utf8'));

        // now map the yaml stuff into the config object
        for ( let key in config ) {
            if( ! config.hasOwnProperty(key)) {
                continue;
            }
            if( typeof _this.timetrap_config[key] === 'undefined' ){
                _this.timetrap_config[key] = {};
            }
            _this.timetrap_config[key].value = config[key];
        }
    } catch(e) {
        console.log(e);
        process.exit(1);
        //throw(e);
    }

    if (!_this.timetrap_config.tui_projects_template_path){
        //set the default
        _this.timetrap_config.tui_projects_template_path = process.env.HOME+"/.timetrap/tui_projects_template"
    }
};

///////////////////////////////////////////////////////////////////////////////
Configuration.prototype.type = 'Configuration';
module.exports = Configuration;

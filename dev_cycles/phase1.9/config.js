"use strict"
var fs = require('fs'),
    util = require('util'),
    path = require('path'),
    yaml = require('js-yaml'),
    minimatch = require('minimatch');


function Configuration(){
    this.timetrap_config;
    this.view = {};
}

Configuration.prototype.fetch = function() {
    var _this=this;

    //default
    var conf_file = process.env.HOME+"/.timetrap.yml";

    // preference over default
    if (process.env.TIMETRAP_CONFIG_FILE) {
        conf_file = process.env.TIMETRAP_CONFIG_FILE;
    }

    try {
        // get the config object
        _this.timetrap_config = yaml.safeLoad(fs.readFileSync(conf_file, 'utf8'));
    } catch(e) {
        console.log(e);
        process.exit(1);
        //throw(e);
    }

    if (!_this.timetrap_config.tui_projects_template_path){
        //set the default
        _this.timetrap_config.tui_projects_template_path = process.env.HOME+"/.timetrap/tui_projects_template"
    }
}

// exports.timetrap_config = timetrap_config;
// exports.fetch_config = fetch_config;
//
Configuration.prototype.type = 'Configuration';
module.exports = Configuration;

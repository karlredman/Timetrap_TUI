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

    // timetrap config file defaults
    _this.timetrap_config = {
        tui_projects_template_path: {
            value: process.env.HOME+"/.timetrap/tui_projects_template", //TODO: needs check
            desc: "Projects hiarchy directory."
        },
        tui_skip_paths: {
            value: [],
            desc: "Path patterns (globs) to skip when looking for time sheets"
        },
        tui_create_missing_sheets: {
            value: false,
            desc: "Create missing sheet files from directory name."
        },
        tui_recreate_sheets: {
            value: false,
            desc: "(DANGER): Re-Create ALL time sheet files under \n   tui_projects_template_path based on directory name."
        },
        tui_developer_mode: {
            value: false,
            desc: "Run in development mode."
        },
        tui_question_prompts: {
            value: true,
            desc: "Whether to use \'Are you sure?\' dialog prompts."
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

    // TODO: fail gracefully if file not found

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
};

///////////////////////////////////////////////////////////////////////////////
Configuration.prototype.type = 'Configuration';
module.exports = Configuration;


// TODO
/////////////////////////////// colors
// tui_tree_color_bg:
// tui_tree_color_fg: blue
// #
// tui_tree_color_active_running_bg:
// tui_tree_color_active_running_fg: yellow
// #
// tui_tree_color_active_Nrunning_bg:
// tui_tree_color_active_Nrunning_fg: blue
// #
// tui_tree_color_Nactive_running_bg:
// tui_tree_color_Nactive_running_fg: yellow
// #
// tui_tree_color_Nactive_Nrunning_bg:
// tui_tree_color_Nactive_Nrunning_fg: blue
// #
// tui_tree_color_hl_bg: blue
// tui_tree_color_hl_fg: white
// #
// tui_tree_color_hl_active_running_bg: blue
// tui_tree_color_hl_active_running_fg: yellow
// #
// tui_tree_color_hl_active_Nrunning_bg: blue
// tui_tree_color_hl_active_Nrunning_fg: white
// #
// tui_tree_color_hl_Nactive_running_bg: blue
// tui_tree_color_hl_Nactive_running_fg: yellow
// #
// tui_tree_color_hl_Nactive_Nrunning_bg: blue
// tui_tree_color_hl_Nactive_Nrunning_fg: white

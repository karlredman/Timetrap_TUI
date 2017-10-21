"use strict"
//     path = require('path'),
//     minimatch = require('minimatch');

// includes
var fs = require('fs'),
    yaml = require('js-yaml');

class Configuration extends Object {

    constructor(options) {
        super();

        // app level
        this.version = "0.2.00";

		// our config data
		this.data = {};

        // load defaults
        this.loadDefaults();
    }
}

Configuration.prototype.loadDefaults = function() {
        // timetrap config defaults
        this.data.process = {
            config_file: {
                value: "./config_file.yml",
                desc: "the timetrap config file path",
                options: ''
            },
			working_directory: {
				value: "/tmp",
				desc: "the working directory with no timetrap-sheet "
				+"files in it or it's parents",
				options: ''
			},
            create_missing_sheets: {
                value: false,
                desc: "create missing sheets from name hiarchy",
                options: 'true|false'
            },
            developer_mode: {
                value: false,
                desc: "run in development mode",
                options: 'true|false'
            },
            question_prompts: {
                value: true,
                desc: "whether to use \'Are you sure?\' dialog prompts",
                options: 'true|false'
            },
            color_theme: {
                value: 'opaque',
                desc: "The color theme to use for the application",
                options: 'dark|light|opaque'
            }
        };
}

Configuration.prototype.addConfigObj = function(obj){
	//assign ?? checking ??
	//this.data[obj] = obj;
	for( let key in obj){
		this.data[key] = obj[key];
	}
}

Configuration.prototype.dumpConfig = function({ file = this.config_file } ={}){
	// setup the layout root level
	let dump_obj = {
		Timetrap_TUI: {
		}
	};

	for( let key in this.data ){
		dump_obj.Timetrap_TUI[key] = this.data[key];
	}

    let dump = yaml.safeDump(dump_obj);
    console.log(dump);
}

///////////////////////////////////////////////////////////////////////////////
module.exports = {Configuration};

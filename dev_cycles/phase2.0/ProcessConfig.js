"use strict";

var {ConfigurationBase} = require('./ConfigurationBase');

class ProcessConfig extends ConfigurationBase {
    constructor({version = null, config_file = null, config_options = null} ={}) {

        super({title: 'ProcessConfig', file: file, options: options});

        if(typeof version !== 'string'){
            let type = typeof version;
            throw new Error("ProcessConfig: argument requirements not met.");
        }

        // app version
        this.version = version;
    }
}

ProcessConfig.prototype.loadDefaults = function() {
        // timetrap config defaults
        this.data = {
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
module.exports = {ProcessConfig};

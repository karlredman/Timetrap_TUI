"use strict";

var {ConfigurationBase} = require('./ConfigurationBase');

class ProcessConfig extends ConfigurationBase {
	constructor({version = null, config_file = null,
		config_options = null} ={})
	{
		super({title: 'ProcessConfig', root_title: 'Timetrap_TUI',
			config_file: config_file, config_options: config_options});

		if(typeof version !== 'string'){
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
			//value: './config_file.yml',
			value: './config_file.yml',
			desc: 'the timetrap config file path',
			options: ''
		},
		working_directory: {
			value: '/tmp',
			desc: 'the working directory sans .timetrap-sheet files',
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
			options: 'opaque|none|dark|light'
		}
	};
}
module.exports = {ProcessConfig};

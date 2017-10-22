"use strict"

//     ???
//     path = require('path'),
//     minimatch = require('minimatch');

// includes
var fs = require('fs'),
    yaml = require('js-yaml');

class ConfigurationBase extends Object {

    constructor({title = null, config_file = null, config_options = null} ={}) {
        super();

        let _this = this;

        // require the title for the yaml domain
        if( typeof title !== 'string' ){
            throw new Error("ConfigurationBase argument reqirements not met.");
        }

        //our yaml title under the program root
        this.yaml_title = title;

		// our config data
		this.data = {};

        // load defaults
        this.loadDefaults();

        // config file overrides defaults
        if(config_file !== null){
            this.loadFile(config_file);
        }

        // options override file
        if(config_options !== null){
            this.loadOptions(config_options);
        }
    }
}

ConfigurationBase.prototype.loadDefaults = function() {
    // put defaults here
}

ConfigurationBase.prototype.loadFile = function({file = null} ={}) {
    //load file into object

    // //default
    // var conf_file = process.env.HOME+"/.timetrap.yml";

    // // preference over default
    // if (process.env.TIMETRAP_CONFIG_FILE) {
    //     conf_file = process.env.TIMETRAP_CONFIG_FILE;
    // }

    //save the file name if provided
    if(file !== null) {
        this.config_file = file;
    }

    try {
        // get the config object
        let config = yaml.safeLoad(fs.readFileSync(this.config_file, 'utf8'));

        // now map the yaml stuff into the config object
        this.data = Object.assign(this.data, config[this.yaml_title]);
    } catch(e) {
        throw new Error("ConfigurationBase: unable to load configuration file: ", this.config_file);
    }
}

ConfigurationBase.prototype.loadOptions = function(options) {
    // merge data
    this.data = Object.assign(this.data, options);
}

ConfigurationBase.prototype.getConfig = function({file = null} ={}) {

	// setup the fake root level
    let dump_obj = {};
        dump_obj[this.yaml_title] = {};

    // add our data object to the fake root
	for( let key in this.data ){
		dump_obj[this.yaml_title][key] = this.data[key];
	}

    let dump = yaml.safeDump(dump_obj);

    if(file !== null){
        //write to file

        return;
    }

    return dump;
}

///////////////////////////////////////////////////////////////////////////////
module.exports = {ConfigurationBase}

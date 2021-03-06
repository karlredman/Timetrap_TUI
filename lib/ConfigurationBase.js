'use strict';

//     ???
//     path = require('path'),
//     minimatch = require('minimatch');
// var util = require('util')

// includes
var fs = require('fs');
var yaml = require('js-yaml');

class ConfigurationBase extends Object {
  constructor({title = null, root_title = null,
    config_file = null, config_options = null} = {}) {
    super();

    const _this = this;

    // require the title for the yaml domain
    if ((typeof root_title !== 'string')
			|| (typeof title !== 'string')) {
      throw new Error('ConfigurationBase constructor argument '
				+ 'reqirements not met.');
    }

    // our yaml title under the root
    this.title = title;

    // the yaml root section
    this.root_title = root_title;

    // our config data
    this.data = {};

    // load defaults
    this.loadDefaults();

    this.config_file = config_file;

    // config file overrides defaults
    if (this.config_file !== null) {
      this.loadFile({config_file: this.config_file});
    }


    // options override file
    if (config_options !== null) {
      this.loadOptions(config_options);
    }
  }
}

ConfigurationBase.prototype.loadDefaults = function() {
  // put defaults here
};

ConfigurationBase.prototype.loadFile = function({config_file = null} = {}) {
  // load contextual file data into this.edit
  // i.e everything under [root_title][title] from file

  // save the file name if provided
  if (config_file !== null) {
    // seems redundant but loadFile can be called outside of the contructor
    this.config_file = config_file;
  }

  try {
    // get the config object
    const config = yaml.safeLoad(fs.readFileSync(this.config_file, 'utf8'));

    // this.data = Object.assign(    this.data, config[this.root_title][this.title]);

    // copy the structure into the data object
    this.data = Object.assign({}, this.data, config);

    // map the root_title/title yaml data into the config object
    // if(config[this.root_title]){
    //     if(config[this.root_title][this.title]){
    //         this.data = Object.assign(this.data, config[this.root_title][this.title]);
    //     }
    // }
    // else {
    //     this.data = Object.assign({}, this.data);
    // }


    // let util = require('util');
    // console.log(util.inspect(this.data.database_file, null, 2));
    // process.exit(0);
  } catch (e) {
    throw new Error('ConfigurationBase: unable to load '
			+ 'configuration file: ', config_file);
  }
};

ConfigurationBase.prototype.loadOptions = function(options) {
  // merges options with this.data
  this.data = Object.assign(this.data, options);
};

ConfigurationBase.prototype.exportConfigObj = function({obj = null} = {}) {
  // * returns the fully specified object within the root_title.title context
  // * this.data is used unless obj is specified

  let data = this.data;

  if (obj !== null) {
    // use obj instad of this.data
    data = obj;
  }

  // let dump_obj = {};
  // dump_obj[this.root_title] = {};
  // dump_obj[this.root_title][this.title] = data;

  return data;
};

ConfigurationBase.prototype.dumpToYAML = function({file = null, obj = null,
  add_heading = true} = {}) {
  // * returnes this.data as yml
  // * overwrites file if 'file' is provided
  // * unconditinally converts 'obj' instead of this.data if provided
  // * add_headings controls object scope

  // Note: this will overwrite the file if 'file' is specified !!

  if (obj === null) {
    // internal data if object not specified
    obj = this.data;
  }

  // convert
  let dump = {};
  if (add_heading) {
    dump = yaml.safeDump(this.exportConfigObj({obj: obj}));
  } else {
    dump = yaml.safeDump(obj);
  }

  const fs = require('fs');
  if ((file !== null) && (typeof file === 'string')) {
    try {
      fs.writeFileSync(file, dump);
    } catch (e) {
      throw new Error('ConfigurationBase: unable to write to '
				+ 'configuration dump file: ' + file);
    }
  }

  return dump;
};

ConfigurationBase.prototype.updateYAML = function({
  file = null, obj = null} = {}) {
  // * similar to dumpToYAML but reads in the config file first and sets data
  // * writes to alternate file if specified
  // * will use obj instead if specified

  // read the file
  if (file === null) {
    file = this.config_file;
  }
  // // get the config object
  // let config = yaml.safeLoad(fs.readFileSync(file, 'utf8', (err) => {
  // 	if(err){
  // 		throw new Error("ConfigurationBase: unable to read to configuration dump file: ", file);
  // 	}
  // }));
  let config;
  try {
    config = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    throw new Error('ConfigurationBase: unable to read from configuration ' +
			'dump file: ', file);
  }

  // assign only our values relative to context
  if (obj === null) {
    // obj = this.data;
    obj = this.exportConfigObj();
  }

  obj = Object.assign(config, obj);


  // write the file
  // fs.writeFileSync(file, obj, (err) =>{
  // 	if(err){
  // 		throw new Error("ConfigurationBase: unable to write to configuration file: ", file);
  // 	}
  // });
  this.dumpToYAML({file: file, obj: obj, add_heading: false});
};


// /////////////////////////////////////////////////////////////////////////////
module.exports = {ConfigurationBase};

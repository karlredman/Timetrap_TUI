"use strict"

var util = require('util');


var {ProcessConfig} = require('../ProcessConfig');
//var {LoggerConfig} = require('../widget_LoggerConfig');

// let process_conf = new ProcessConfig({version: '0.2.0', config_file: './test.yml', config_options: {
// 	create_missing_sheets: {value: 'thingsandstuff.blah'} } });
let process_conf = new ProcessConfig({version: '0.2.0'});


//console.log(process_conf.dumpConfigObj());
//console.log(process_conf.dumpToYAML({file:'./test.yml'}));
process_conf.dumpToYAML({file:'./test.yml'});

//process_conf.data.working_directory.value = "someplace nice";
//console.log(process_conf.updateYAML({file:'./thing.yml'}));
//process_conf.updateYAML();

"use strict"

var util = require('util');


var {ProcessConfig} = require('../ProcessConfig');
//var {LoggerConfig} = require('../widget_LoggerConfig');

let process_conf = new ProcessConfig({version: '0.2.0'});

process_conf.dumpConfig();

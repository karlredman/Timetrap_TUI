"use strict"

var util = require('util');


var {Configuration} = require('../Configuration');
var {LoggerConfig} = require('../widget_LoggerConfig');

let config = new Configuration({});
let logger_conf = new LoggerConfig({});

//console.log(util.inspect(conf.process, true, 10));
config.addConfigObj(logger_conf.getConfigObj());
config.dumpConfig();

"use strict";

var {TimetrapTUI_Error} = require('./Errors');


//exports.requiredParam = function(param){

function requiredParam(param) {
  throw new TimetrapTUI_Error(`Error: Required parameter ${param} is missing`);
}

//module.exports = requiredParam;
module.exports.requiredParam = requiredParam;

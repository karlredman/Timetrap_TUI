"use strict";

// project dependencies
var {TimetrapTUI_Error} = require('./Errors');
var helpers = require('./helpers');

// parent
var blessed = require('blessed'),
    Box = blessed.Box;

////////////////////////////////////////////
/////////////// ViewMain Class
////////////////////////////////////////////

class ViewBox extends Box {
    //constructor({options ={}, screen = null} ={}) {
	constructor({parent = helpers.requiredParam('parent'), options ={},
		theme = 'opaque', config = helpers.requiredParam('config')} ={}) {
    {
        let defaults = {
            parent: parent,
            //
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            content: "",
        }
        // merge options into defaults
        options = Object.assign(defaults, options);
        super(options);
    }
}
module.exports = {ViewBox};

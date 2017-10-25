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
    constructor({parent = helpers.requiredParam('parent'), options ={},
        theme = 'opaque', config = helpers.requiredParam('config')} ={})
    {
        let defaults = {
            parent: parent,
            //
            top: 1,
            bottom: 1
            left: 0,
            width: '100%',
            //height: '100%',
            content: "",
            bg: config.data.colors.fg[theme],
            fg: config.data.colors.fg[theme],
            style: {
                bg: config.data.colors.style.bg[theme],
                fg: config.data.colors.style.fg[theme]
            }
        }
        // merge options into defaults
        options = Object.assign(defaults, options);
        super(options);
        this.theme = theme;
    }
}

module.exports = {ViewBox};

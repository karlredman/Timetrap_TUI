"use strict";

// project dependencies
require('./Errors');

// parent
const {EventEmitter} = require('events').EventEmitter;

////////////////////////////////////////////
/////////////// ViewMain Class
////////////////////////////////////////////

class ViewMain extends EventEmitter {
    constructor({
        screen = null,
        process_config = null } ={})
    {
        super();
        this.screen = screen;
        this.process_config = process_config;

        // widgets
        this.widgets = {};

        this.registerActions();
    }
}

ViewMain.prototype.registerActions = function(){
}

module.exports = {ViewMain};

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
        process_config = null,
        controller = null } ={})
    {
        super();
        this.screen = screen;
        this.process_config = process_config;
        this.controller = controller;

        // widgets
        this.widgets = {};

        //create widgets
        ////...

        this.registerActions();

        setTimeout(() => {
            this.controller.widgets.loading.stop();
        }, 2000);
    }
}

ViewMain.prototype.registerActions = function(){
}

module.exports = {ViewMain};

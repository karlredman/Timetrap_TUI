"use strict";

//package dependencies
var blessed = require('blessed');

// project dependencies
var {ViewMain} = require('./view_Main'),
    {ViewMainConfig} = require('./view_MainConfig'),
    {Timetrap} = require('./Timetrap');
require('./Errors');

// parent
const {EventEmitter} = require('events').EventEmitter;

////////////////////////////////////////////
/////////////// ViewController Class
////////////////////////////////////////////

class ViewController extends EventEmitter {
    constructor({
        screen = null,
        process_config = null } ={})
    {
        super();
        this.screen = screen
        this.process_config = process_config;

        // our views
        this.views = {};

        // sometimes we have widgets at this level
        this.widgets = {};
        this.timetrap = new Timetrap({});
    }

    run(){
        this.widgets.loading = blessed.loading({
            parent: this.screen,
            top: '50%',
            left: '50%'
        });

        this.widgets.loading.load("loading program...")

        let main_config = new ViewMainConfig();
        this.views.main = new ViewMain({
            screen: this.screen,
            process_config: this.process_config,
            controller: this,
            config: main_config,
        });

        this.registerActions();

    }
}

ViewController.prototype.registerActions = () => {
    let _this = this;
}

module.exports = {ViewController};

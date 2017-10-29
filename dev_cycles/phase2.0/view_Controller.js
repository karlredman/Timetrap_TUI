"use strict";

//package dependencies
var blessed = require('blessed');

// project dependencies
var {ViewMain} = require('./view_Main'),
    {ViewDetails} = require('./view_Details'),
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

        // new timetrap
        // TODO: fix check that this value is coming from the timetrap config file
        this.timetrap = new Timetrap({watched_db_file: '/home/karl/Documents/Heorot/timetrap/timetrap.db'});

        // monitor db for changes
        this.timetrap.monitorDBStart();

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

ViewController.prototype.registerActions = function() {
    let _this = this;

    //view creators
    this.on('create_view', (info) => {
        if (info.view_name === 'details'){
            if(typeof _this.pickview === 'undefined'){
                // hide main view / show loading
                this.widgets.loading.load("loading...")
                this.views.main.emit('hide_view');

                // // kill the view.menubar
                this.views.main.emit('destroy_widget', 'menubar');

                // create the view
                let details_config = new ViewMainConfig();          //recycling main config
                this.views.details = new ViewDetails({
                    screen: this.screen,
                    process_config: this.process_config,
                    controller: this,
                    config: details_config,
                });

                // log it
                _this.views.main.widgets.logger.msg("Created view: Details", _this.views.main.widgets.logger.loglevel.devel.message);
            }
        }
    });

    //view destroyers
    _this.on('destroy_view', (info) => {
        if (info.view_name === 'details'){
            if (typeof _this.pickview !== 'undefined'){
                // hide the view (show loading)

                // get a copy of the loggs from the outgoing view

                // tell the view to destory all of it's widgets

                // destroy the view

                // copy logs over to main view logger

                // recreate the menubar

                //stop loading screen

                // show main view

                // log it
                //_this.logger.msg("Destroyed view: Details View", _this.logger.loglevel.devel.message);
            }
        }
    });

}

module.exports = {ViewController};

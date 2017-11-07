"use strict";

//package dependencies
var blessed = require('blessed');

// project dependencies
var {ViewMain} = require('./view_Main'),
    {ViewDetails} = require('./view_Details'),
    {ViewMainConfig} = require('./view_MainConfig');
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
            //if(typeof _this.views.details === 'undefined'){

                //TODO: validate info

                // hide main view / show loading
                _this.widgets.loading.load("loading...")
                _this.views.main.emit('hide_view');

                // kill the view.menubar:
				// it's easier to do this than manage the event
				// queue in blessed.screen.
            //this.views.main.emit('destroy_widget', 'menubar');
            this.views.main.destroyMenubar();

                // create the view
                let details_config = new ViewMainConfig();          //recycling main config
                _this.views.details = new ViewDetails({
                    screen: _this.screen,
                    process_config: _this.process_config,
                    controller: _this,
                    config: details_config,
                    sheet: info.sheet,
                    running: info.running
                });

                // pass on control
                _this.views.details.run();

                // log it
                _this.views.main.widgets.logger.msg("Created view: Details", _this.views.main.widgets.logger.loglevel.devel.message);
            //}
        }
    });

    //view destroyers
    _this.on('destroy_view', (info) => {
        if (info.view_name === 'details'){
            if (typeof _this.views.details !== 'undefined'){

                // hide the details view
                _this.views.details.emit('hide_view');

                // show main view
                _this.views.main.emit('show_view');

                // TODO: get a copy of the loggs from the outgoing view

                // tell the view to destory all of it's widgets
                _this.views.details.destroyAllWidgets();

                // destroy the view
                _this.views.details.removeAllListeners();
                delete _this.views.details;
                _this.views.details = undefined;

                // recreate the menubar
                this.views.main.emit('create_widget', 'menubar');

                //focus the main view
                _this.views.main.emit('focus_default');

                // copy logs over to main view logger


                // TODO: log it
                //_this.logger.msg("Destroyed view: Details View", _this.logger.loglevel.devel.message);
            }
        }
    });

}

module.exports = {ViewController};

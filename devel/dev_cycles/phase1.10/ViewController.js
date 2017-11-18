"use strict";

var blessed = require('blessed'),
    contrib = require('blessed-contrib');

// app packages
//var Configuration = require('./config');

// views
var View = require('./ViewMain');
var HelpView = require('./ViewHelp');
//var MenuBar = require('./PanelMenubarListbar');

//function ViewController(config, screen){
function ViewController(objects){
    let _this=this;

    //convenience
    this.config = objects.config;
    this.screen = objects.screen;

    //set the main view
    this.view = new View(objects);
    this.view.register_actions();

    _this.register_actions(this);
    _this.screen.render();
}

ViewController.prototype.register_actions = function(obj){
    let _this = this;

    //view destroyers
    _this.screen.on('destroy', function(widgetname){
        if (widgetname === 'HelpView'){
            if (typeof _this.helpview !== 'undefined'){
                _this.helpview.destroy();
                delete _this.helpview;
                _this.view.showAll(true);
                return;
            }
        }
    });

    // help view toggle
    _this.screen.key(['?'], function(ch, key) {
        if (typeof _this.helpview == 'undefined')
        {
            //hide the widgets
            _this.view.hideAll();

            _this.helpview = new HelpView({
                parent: _this.screen,
                top:0,
                left:0,
                width: '100%',
                height: '100%',
                value: "The help\n\n\nThis will be a table for help",
                align: "center",
                fg: "yellow"
            });
            _this.helpview.focus();
            _this.screen.render();
        }
        else {
            // //destroy and delete the helpview
            _this.helpview.destroy();
            delete _this.helpview;

            //show the main view and set focus
            _this.view.showAll(true);
            //
            // console.log(JSON.stringify(key, null, 2));
        }
    });

}


ViewController.prototype.type = 'ViewController';
module.exports = ViewController;

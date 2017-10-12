"use strict";

var blessed = require('blessed'),
    contrib = require('blessed-contrib');
var EventEmitter = require('events').EventEmitter;

// views
var BaseView = require('./ViewBase'),
View = require('./ViewMain'),
PickView = require('./ViewPick'),
HelpView = require('./ViewHelp');

//debug
var DialogMessage = require('./DialogMessage');

//function ViewController(config, screen){
function ViewController(objects){
    let _this=this;

    //convenience
    _this.objects = objects;
    _this.objects.controller = _this;

    //convenience -before refactoring
    _this.config = objects.config;
    _this.screen = objects.screen;

    //call parent constructor
    EventEmitter.call(this);

    //set the base and main view
    _this.objects.baseview = new BaseView(_this.objects);

    //our main view
    _this.objects.view = new View(_this.objects);

    //other (dynamic) views
    _this.helpview;
    _this.pickview;

    _this.register_actions(this);
    _this.screen.render();
}
ViewController.prototype = Object.create(EventEmitter.prototype);
ViewController.prototype.constructor = ViewController;

ViewController.prototype.register_actions = function(){
    let _this = this;
    _this.on('create', function(info){
        // info = {
        //     action:
        //     sheet:
        //     widgetname:
        // }
        if (info.widgetname === 'PickView'){
            if(typeof _this.pickview === 'undefined'){
                //kill the view.menubar
                _this.view.emit('destroy', 'menubar');

                //create
                let options = {
                    objects: _this.objects,
                    //TODO: move these when we move logger into view controller
                    data: {sheet: info.sheet}
                }
                _this.pickview = new PickView(options);
                _this.logger.msg("Created view: PickView", _this.logger.loglevel.devel.message);
            }
        }
    });

    //view destroyers
    _this.on('destroy', function(widgetname){
        if (widgetname === 'HelpView'){
            if (typeof _this.helpview !== 'undefined'){
                _this.helpview.destroy();
                delete _this.helpview;
                _this.view.showAll(true);
                return;
            }
        }
        if (widgetname === 'PickView'){
            if (typeof _this.pickview !== 'undefined'){
                _this.pickview.emit('destroy', 'all');
                delete _this.pickview;
                _this.view.emit('create', 'menubar');
                //set the logger view
                _this.objects.baseview.logger.view = _this.view;
                _this.logger.msg("Destroyed view: PickView", _this.logger.loglevel.devel.message);
                return;
            }
        }
    });

    // // help view toggle
    // _this.key(['?'], function(ch, key) {
    //     if (typeof _this.helpview == 'undefined')
    //     {
    //         //hide the widgets
    //         _this.view.hideAll();

    //         _this.helpview = new HelpView({
    //             parent: _this.screen,
    //             top:0,
    //             left:0,
    //             width: '100%',
    //             height: '100%',
    //             value: "The help\n\n\nThis will be a table for help",
    //             align: "center",
    //             fg: "yellow"
    //         });
    //         _this.helpview.focus();
    //         _this.screen.render();
    //     }
    //     else {
    //         // //destroy and delete the helpview
    //         _this.helpview.destroy();
    //         delete _this.helpview;

    //         //show the main view and set focus
    //         _this.view.showAll(true);
    //         //
    //         // console.log(JSON.stringify(key, null, 2));
    //     }
    // });

}


ViewController.prototype.type = 'ViewController';
module.exports = ViewController;

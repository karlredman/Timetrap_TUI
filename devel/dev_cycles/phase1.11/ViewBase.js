"use strict";
var blessed = require('blessed'),
    contrib = require('blessed-contrib');
var EventEmitter = require('events').EventEmitter;
var Logger = require('./PanelLoggerBox.js'),
    Line = require('./Line.js');

function ViewBase(objects) {
    if (!(this instanceof EventEmitter)) return new ViewBase(options);
    let _this = this;

    //required options -convenience
    _this.screen = objects.screen;
    _this.config = objects.config;

    //widgets owned by this view
    _this.widgets = {};

    //call parent constructor
    EventEmitter.call(this);

    //register acttions for this view
    _this.register_actions();

    //make the widgets
    _this.create_widgets();

    for (let key in _this.widgets) {
        // if (this.widgets.hasOwnProperty(key)) continue;
        _this.widgets[key].register_actions()
    }
    _this.widgets.logger.msg("Registered ViewBase widgets", _this.widgets.logger.loglevel.devel.message);

    //hide all the widgets!
    _this.showAll();

};
ViewBase.prototype = Object.create(EventEmitter.prototype);
ViewBase.prototype.constructor = ViewBase;


ViewBase.prototype.register_actions = function(){
};


ViewBase.prototype.set_widget_views = function(view, name){
    let _this = this;
    for (let key in _this.widgets) {
        _this.widgets[key].view = view;
    }
    _this.widgets.logger.msg("ViewBase: xfered widget views to "+name, _this.widgets.logger.loglevel.devel.message);
}

ViewBase.prototype.create_widgets = function()
{
    let _this=this;

    //the logger at bottom of main window
    _this.widgets.logger = new Logger({
        parent: _this.screen,
        view: _this,
        left: 0,
        bottom: 0,
        height: 1,
        ownedby: this
    });
};

ViewBase.prototype.hideAll = function(){
    let _this = this;
    for (let key in _this.widgets) {

        if (! _this.widgets.hasOwnProperty(key)) continue;

        _this.widgets[key].hide();
    }
    _this.screen.render();
}

ViewBase.prototype.showAll = function(set_focus){
    let _this = this;
    for (let key in _this.widgets) {

        if (! _this.widgets.hasOwnProperty(key)) continue;

        _this.widgets[key].show();
    }

    if(set_focus){
        _this.setWinFocus(_this.pwin.curwin);
    }
    _this.screen.render();
};

ViewBase.prototype.type = 'ViewBase';
module.exports = ViewBase;

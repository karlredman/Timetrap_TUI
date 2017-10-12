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

    //log is focused
    //_this.widgets.logline_focused = new Line({
    _this.widgets.logline_focused = new blessed.line({
        parent: _this.screen,
        view: _this,
        left: 0,
        height: 1,
        bottom: 1,
        width: '100%',
        orientation: "horizontal",
        type: 'line',
        fg: "green",
        bg: "red",
        ownedby: this
    });
    _this.widgets.logline_focused.register_actions = function(){this.registered = true;}

    //log is unfocused
    _this.widgets.logline_unfocused = new Line({
        parent: _this.screen,
        view: _this,
        left: 0,
        height: 1,
        bottom: 1,
        orientation: "horizontal",
        type: 'line',
        fg: "red",
        bg: "blue",
        ownedby: this
    });

    // line to show menu is focused
    _this.widgets.menuline_focused = new Line({
        parent: _this.screen,
        view: _this,
        left: 0,
        height: 1,
        top: 1,
        orientation: "horizontal",
        type: 'line',
        fg: "green",
        bg: "red",
        ownedby: this
    });

    // line to show menu is unfocused
    _this.widgets.menuline_unfocused = new Line({
        parent: _this.screen,
        view: _this,
        left: 0,
        height: 1,
        top: 1,
        orientation: "horizontal",
        type: 'line',
        fg: "red",
        bg: "blue",
        ownedby: this
    });

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

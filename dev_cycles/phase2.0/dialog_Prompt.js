"use strict";

// dependencies
var blessed = require('blessed'),
    BlessedPrompt = blessed.prompt;

// project includes
var {DialogConfig} = require('./dialog_DialogConfig');
var {TimetrapTUI_Error} = require('./Errors');
var helpers = require('./helpers');

// debugging
//var util = require('util');

/////////////////////// examples

class Prompt extends BlessedPrompt {
    constructor({
        widget = helpers.requiredParam('widget'),
        config = new DialogConfig(),
        target = null,
        options = {}
    } ={})
    {
        // because we can't use this until later
        let theme = widget.view.theme;

        let defaults = {
            parent: widget.view.screen,
            //
            lockKeys: config.data.traits.lockKeys,
            keys: config.data.traits.keys,
            tags: config.data.traits.tags,
            align: config.data.traits.align,
            left: config.data.traits.left,
            top: config.data.traits.top,
            width: config.data.traits.width,
            height: config.data.traits.height,
            //
            bg: config.data.colors.bg[theme],
            fg: config.data.colors.fg[theme],
            //
            border: {
                type: 'line',
                bg: config.data.colors.border.bg[theme],
                fg: config.data.colors.border.fg[theme],
            },
            style: {
                bg: config.data.colors.style.bg[theme],
                fg: config.data.colors.style.fg[theme],
            },
        };

        // merge options into defaults
        options = Object.assign(defaults, options);

        // call parent constructor
        super(options);

        // saved vars
        this.target = widget;
        if(target !== null){this.target = target};

        this.config = config;
        this.view = widget.view;
        this.theme = widget.view.theme;
        this.log = widget.view.log;
    }
}
Prompt.prototype.cannedInput = function(type){
    let _this = this;

    let types = {
        checkIn:{
            message: "Enter {bold}clock in{/bold} arguments",
            value: ""
        },
        checkOut:{
            message: "Enter {bold}clock out{/bold} arguments",
            value: ""
        },
        edit:{
            message: "Enter {bold}edit{/bold} arguments",
            value: ""
        },
        resume:{
            message: "Enter {bold}resume{/bold} arguments",
            value: ""
        },
    };

    let message = "\n"+types[type].message;

    _this.input(message, types[type].value, function(err, data){

        let response = {
            type: type,
            err: err,
            data: data,
            //obj: _this
        };

        _this.target.emit('prompt', response);
    });
}
module.exports = {Prompt};

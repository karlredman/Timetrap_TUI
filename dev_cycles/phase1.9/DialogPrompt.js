"use strict"
var blessed = require('blessed'),
    Node = blessed.Node;

function DialogPrompt(options) {

    if (!(this instanceof Node)) return new MenuBar(options);
    let _this=this;

    _this.options = options;
    _this.screen = options.parent; // required

    //the target of the handler - required
    _this.target = options.target;

    //if true: dialog is already in progress
    // not sure i want to implement this yet -needs bigger infrastructure
    //_this.singlton = false;

    // set overridable defaults
    options = options || {};

    options.keys = options.keys || true;
    options.tags = options.tags || true;
    options.align = options.align || 'center';
    options.left = options.left || 'center';
    options.top = options.top || 'center';
    options.width = options.width || '50%';
    options.height = options.height || 10;
    options.bg = options.bg || null;
    options.border = options.border || {};
    options.border.type = options.border.type || 'line';
    options.style = options.style || {};
    options.style.bg = options.style.bg || 'blue';
    options.style.fg = options.style.fg || 'white';

    blessed.prompt.call(this, options);
}
DialogPrompt.prototype = Object.create(blessed.prompt.prototype);
DialogPrompt.prototype.constructor = DialogPrompt;

DialogPrompt.prototype.cannedInput = function(type){
    let _this = this;

    let types = {
        checkIn:{
            message: "Enter {bold}clock in{/bold} command",
            value: "t in "
        },
        checkOut:{
            message: "Enter {bold}clock out{/bold} command",
            value: "t out "
        },
        edit:{
            message: "Enter {bold}edit{/bold} command",
            value: "t edit "
        },
        resume:{
            message: "Enter {bold}resume{/bold} command",
            value: "t resume "
        },
    };

    let message = "\n"+types[type].message;

    _this.input(message, types[type].value, function(err, data){

        let response = {
            type: type,
            err: err,
            data: data,
            obj: _this
        };

        _this.target.emit('prompt', response);
    });
}

DialogPrompt.prototype.type = 'DialogPrompt';
module.exports = DialogPrompt;

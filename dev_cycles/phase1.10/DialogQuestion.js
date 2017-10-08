"use strict"
var blessed = require('blessed'),
    Node = blessed.Node;

function DialogQuestion(options) {

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

    blessed.question.call(this, options);
}
DialogQuestion.prototype = Object.create(blessed.question.prototype);
DialogQuestion.prototype.constructor = DialogQuestion;

DialogQuestion.prototype.cannedInput = function(type){
    let _this = this;

    let types = {
        stopAll:{
			message: "Stop {bold}All{/bold} running timers.\n{bold}Are you sure?{/bold}",
        },
        exit:{
			message: "{bold}EXIT{/bold}\n{bold}Are you sure?{/bold}",
        },
    };

	let message = "\n"+types[type].message;

    _this.ask(message, function(err, data){

        let response = {
            type: type,
            data: data,
            obj: _this
        };

        _this.target.emit('question', response);
    });
}

DialogQuestion.prototype.type = 'DialogQuestion';
module.exports = DialogQuestion;

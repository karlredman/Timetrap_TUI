"use strict"
var blessed = require('blessed'),
    Node = blessed.Node;

function DialogPrompt(options) {

    if (!(this instanceof Node)) return new MenuBar(options);
    let _this=this;

    _this.options = options;
    _this.screen = options.parent; // required

    _this.loading_dialog = options.loading;

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

    // _this.on('blur', function() {
    //         _this.destroy();
    //         _this.screen.render();
    // });
}
DialogPrompt.prototype = Object.create(blessed.prompt.prototype);
DialogPrompt.prototype.constructor = DialogPrompt;

// DialogPrompt.prototype.destroy = function(){
//     let _this = this;
//     _this.destroy();
//     _this.screen.render();
// }

DialogPrompt.prototype.cannedInput = function(type){
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
            obj: _this
        };

        // if(typeof _this.loading_dialog !== 'undefinded') {
        //     _this.loading_dialog.alert('got here: ');
        //     _this.screen.render();
        // }

        _this.target.emit('prompt', response);
    });
}

DialogPrompt.prototype.type = 'DialogPrompt';
module.exports = DialogPrompt;

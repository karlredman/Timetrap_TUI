"use strict"
var blessed = require('blessed'),
    Node = blessed.Node;

function DialogMessage(options) {

    if (!(this instanceof Node)) return new MenuBar(options);
    let _this=this;

    _this.options = options;
    _this.screen = options.parent; // required

    //the target of the handler - required
    _this.target = options.target || undefined;

    //if true: dialog is already in progress (i.e. modal)
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

    blessed.message.call(this, options);
}
DialogMessage.prototype = Object.create(blessed.message.prototype);
DialogMessage.prototype.constructor = DialogMessage;

DialogMessage.prototype.alert = function(message){
    let _this = this;

    let delay = 0; //until keypress
    _this.display("\n"+message, delay, function(err, data){});
}

DialogMessage.prototype.type = 'DialogMessage';
module.exports = DialogMessage;

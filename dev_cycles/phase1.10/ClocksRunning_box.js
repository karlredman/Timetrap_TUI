"use strict";

var blessed = require('blessed'),
    Node = blessed.Node;

function ClocksRunning(options) {
    if (!(this instanceof Node)) return new ClocksRunning(options);
    let _this=this;

    _this.options = options;
    _this.screen = options.parent;
    _this.view; // set in register_actions

    blessed.box.call(this, options);
}
ClocksRunning.prototype = Object.create(blessed.box.prototype);
ClocksRunning.prototype.constructor = ClocksRunning;

ClocksRunning.prototype.register_actions = function(view){
    let _this = this;
    this.view = view;

    // TODO: register for db change listener
}
ClocksRunning.prototype.type = 'ClocksRunning';
module.exports = ClocksRunning;

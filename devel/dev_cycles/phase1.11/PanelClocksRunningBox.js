"use strict";

var blessed = require('blessed'),
    Node = blessed.Node;

function PanelClocksRunningBox(options) {
    if (!(this instanceof Node)) return new PanelClocksRunningBox(options);
    let _this=this;

    _this.options = options;
    _this.screen = options.parent;
    _this.view; // set in register_actions

    blessed.box.call(this, options);
}
PanelClocksRunningBox.prototype = Object.create(blessed.box.prototype);
PanelClocksRunningBox.prototype.constructor = PanelClocksRunningBox;

PanelClocksRunningBox.prototype.register_actions = function(view){
    let _this = this;
    this.view = view;

    // TODO: register for db change listener
}
PanelClocksRunningBox.prototype.type = 'PanelClocksRunningBox';
module.exports = PanelClocksRunningBox;

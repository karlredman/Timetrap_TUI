"use strict"
var blessed = require('blessed'),
    Node = blessed.Node;

function Line(options) {
    if (!(this instanceof Node)) return new Line(options);
    let _this = this;

    _this.screen = options.parent;
    _this.view = options.view;
    _this.registered = false;

    _this.options = options;

    // this.options.bg = "red";
    // this.fg = "red";
    // this.bg = "red";

    blessed.line.call(this, options);

    _this.screen.render();
};
Line.prototype = Object.create(blessed.line.prototype);
Line.prototype.constructor = Line;

Line.prototype.register_actions = function(){
    let _this = this;
    if(!_this.registered){
        _this.registered = true;
    }
};

Line.prototype.type = 'Line';
module.exports = Line;

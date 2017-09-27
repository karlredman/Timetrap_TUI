"use strict";

// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    Node = blessed.Node;


function Logger(options) {

    if (!(this instanceof Node)) return new Logger(options);
    let _this=this;

    //required
    _this.screen = options.parent;

    // options = {
    //     fg: "green",
    //     label: 'Server Log',
    //     height: "20%",
    //     tags: true,
    //     border: {
    //         type: "line",
    //         fg: "cyan"
    //     }
    // }

    //this class
    options.interval = options.interval || 500;

    //all logs
    options.keys = true;
    options.mouse = options.mouse || true;
    options.vi = options.vi || true;
    options.tags = options.tags || true;
    options.wrap = true;

    options.fg = options.fg || "green";

    options.label = options.label || '';

    options.height = options.height || "20%";

    // options.border = options.border || {};
    // options.border.type = options.border.type || "line";
    // options.border.fg = options.border.fg || "cyan";

    options.scrollable = options.scrollable || true;
    options.scrollbar = options.scrollbar || {};
    options.scrollbar.ch = options.scrollbar.ch || ' ';

    options.style = options.style || {};
    options.style.scrollbar = options.style.scrollbar || {};
    options.style.scrollbar.inverse = options.style.scrollbar.inverse || true;

    options.content = "xxxxxxxxxxxxxxxxxxxx"

    contrib.log.call(this, options);

    this.interactive = true

    let i=0
     _this.log("new {red-fg}log{/red-fg} line " + i++);

}
Logger.prototype = Object.create(contrib.log.prototype);
Logger.prototype.constructor = Logger;


Logger.prototype.register_actions = function(view){
	this.view = view;
    let _this = this;

    let i = 0
    setInterval(function() {_this.log("new {red-fg}log{/red-fg} line " + i++); _this.screen.render()}, 5000)

    this.on('keypress', function(ch, key) {
        if (key.name === 'tab') {
            if (!key.shift) {
                this.view.setWinFocusNext();
            } else {
                this.view.setWinFocusPrev();
            }
            return;
        }
    });
}

Logger.prototype.type = 'Logger';
module.exports = Logger;

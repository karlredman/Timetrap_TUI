"use strict"
var blessed = require('blessed'),
    Node = blessed.Node;

function ListResume(options) {
    if (!(this instanceof Node)) return new ListResume(options);
    let _this=this;

    _this.options = options;
    _this.screen = options.parent;

    // set overridable defaults
    options = options || {};

    options.border = options.border || {};
    options.border.type = options.border.type || "line";
    // options.border.bg = options.border.bg || null;
    // options.border.fg = options.border.fg || "blue";

    options.style = options.style || {};
    options.style.border = options.style.border || {};
    options.style.border.bg = options.style.border.bg || null;
    options.style.border.fg = options.style.border.fg || "blue";

    options.items = [
        "Latest",
        "Pick",
        //"other",   //TODO: add user defined displays (from contrib filters)
    ];

    //TODO: find max width of items based on parent element from listbar
    var maxlen = 0;
    for( let i=0; i < options.items.length; i++){
        if ( options.items[i].length > maxlen ){
            maxlen = options.items[i].length
        }
    }
    maxlen = maxlen + 2;                                        //+2 for borders

    options.width = options.width || maxlen;
    options.height = options.height || options.items.length+2;  //+2 for borders
    //options.height = 5;

    // to be overridden
    // default to undefined so parent takes over
    //options.keys = options.keys || ['space', '+', '-'];
    options.keys = options.keys || true;

    options.vi = options.vi || true;
    options.mouse = options.mouse || true;
    //options.autoCommandKeys = options.autoCommandKeys || true;

    options.tags = options.tags || true;
    options.align = options.align || "left";

    options.data = options.data || {};

    // causes crash
    // options.scrollable = options.scrollable || true;
    // options.scrollbar = options.scrollbar || true;

    options.style = options.style || {};
    options.style.bg = options.style.bg || undefined;
    options.style.fg = options.style.fg || "blue";

    options.style.selected = options.style.selected || {};
    options.style.selected.bg = options.style.selected.bg || "blue";
    options.style.selected.fg = options.style.selected.fg || "white";

    options.style.item = options.style.item || {};
    options.style.item.hover = options.style.item.hover || {};
    options.style.item.hover.bg = options.style.item.hover.bg || "green";
    options.style.item.hover.fg = options.style.item.hover.fg || null;

    // failsafe: in case parent is not passed in options
    options.parent = options.parent || screen;

    options.wrap = true;
    options.hidden = false;
    options.style.inverse = false;
    options.fixed = true;
    options.shadow = options.shadow || false;

    //inherit from textarea
    blessed.list.call(this, options);

    _this.on('keypress', function(ch, key) {
        if (key.name === 'escape') {
            _this.destroy();
            _this.screen.render();
        }
    });
    _this.on('blur', function() {
            _this.destroy();
            _this.screen.render();
    });
}
ListResume.prototype = Object.create(blessed.list.prototype);
ListResume.prototype.constructor = ListResume;


ListResume.prototype.type = 'ListResume';
module.exports = ListResume;

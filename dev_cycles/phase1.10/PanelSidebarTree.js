"use strict";
var blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    Node = blessed.Node,
    Box = blessed.Box;


function SideBar(options) {
    if (!(this instanceof Node)) return new SideBar(options);

    //options
    // set overridable defaults
    options = options || {};

    //DO NOT SET HEIGHT -there's a bug according to blessed-contrib/tree.js
    //options.height = options.height || 1;
    options.width = options.width || "shrink";

    // TODO: folding is disabled for now
    //options.keys = options.keys || ['space', '+', '-'];
    options.keys = options.keys || [];

    options.vi = options.vi || true;
    options.mouse = options.mouse || true;
    options.autoCommandKeys = options.autoCommandKeys || true;

    options.tags = options.tags || true;
    options.align = options.align || "left";

    options.data = options.data || {};

    // causes crash
    // options.scrollable = options.scrollable || true;
    // options.scrollbar = options.scrollbar || true;

    //override parent
    options.template = options.template || {};
    options.template.extend = options.template.extend || ' ';
    options.template.retract = options.template.retract || ' ';
    options.template.lines = options.template.lines || true;

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

    //inherit from textarea
    contrib.tree.call(this, options);
}
SideBar.prototype = Object.create(contrib.tree.prototype);
SideBar.prototype.constructor = SideBar;

SideBar.prototype.render = function() {
  if (this.screen.focused === this.rows) this.rows.focus();

  this.rows.top = this.top+1;
  this.rows.width = this.width - 3;
  this.rows.height = this.height - 4;
  Box.prototype.render.call(this);
};

SideBar.prototype.saveData = function(data){
    this.savedData = data;
}

SideBar.prototype.register_actions = function(view){

	this.view = view;
    this.rows.view = view;
	let _this = this;

	// this.rows.key(['enter'], function(ch, key) {
	// 	let selectedNode = _this.nodeLines[this.getItemIndex(this.selected)];
	// 	_this.emit('action', selectedNode, this.getItemIndex(this.selected));
	// 	_this.emit('select', selectedNode, this.getItemIndex(this.selected));
	// 	_this.view.widgets.workspace.emit('thing', selectedNode, this.getItemIndex(this.selected));
	// });

    this.on('syncSelect', function(idx,name) {
        //console.log(idx+":"+name);
        //this.rows.focusOffset(idx);
        //this.rows.down(1);
        this.rows.select(idx);
        this.screen.render();
	});

    // this.on('action', function(node) {
		// console.log("sidebar action received");
	// });

    // this.on('select', function(node) {
		// console.log("sidebar select received");
	// });

    this.rows.on('keypress', function(ch, key) {
        let self = this;
        if (key.name === 'tab') {
            if (!key.shift) {
                _this.view.setWinFocusNext();
            } else {
                _this.view.setWinFocusPrev();
            }
            return;
        }
        // if (key.name === 'space'){
        //     let idx = self.getItemIndex(this.selected);
        //     _this.view.widgets.workspace.emit('keypress', ch, key);
        //     return;
        // }
        let idx = self.getItemIndex(this.selected);
        _this.view.widgets.workspace.emit('syncSelect', idx, 'element click');
    });

    // manage mouse things
    _this.rows.on('element wheeldown', function(foo, bar) {
        let self = this;
        let idx = self.getItemIndex(this.selected);
        _this.view.widgets.workspace.emit('syncSelect', idx, 'element wheeldown');
    });
    _this.rows.on('element wheelup', function(foo, bar) {
        let self = this;
        let idx = self.getItemIndex(this.selected);
        _this.view.widgets.workspace.emit('syncSelect', idx, 'element wheelup');
    });
    _this.rows.on('element click', function(foo, bar) {
        let self = this;
        let idx = self.getItemIndex(this.selected);
        _this.view.widgets.workspace.emit('syncSelect', idx, 'element click');
    });

    // _this.rows.key(this.options.keys, function() {
    //     console.log("sidebar")
    //     let self = this.view.widgets.sidebar;
    //     let idx = this.getItemIndex(this.selected);
    //     this.view.widgets.workspace.emit('syncSelect', idx, 'element click');


    //     //sidebar
    //     let selectedNode = self.nodeLines[this.getItemIndex(this.selected)];
    //     if (selectedNode.children) {
    //         selectedNode.extended = !selectedNode.extended;
    //         self.setData(self.data);
    //         self.screen.render();
    //     }

    //     self.emit('select', selectedNode, this.getItemIndex(this.selected));
    //     //this.view.widgets.workspace.rows.emit('key space', 'space', {name: 'space', full: 'space'})
    // });

}


SideBar.prototype.type = 'SideBar';
module.exports = SideBar;

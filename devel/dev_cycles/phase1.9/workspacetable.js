"use strict"
var blessed = require('blessed'),
    Box = blessed.Box,
    Node = blessed.Node;

var util = require('util');


// Note: This prototype is flawed in that it is difficult to manage the tree
// collapsing. So, either I'll have to disable the tree collapse or reimplement
// this class as a tree and mirror the projects tree.

function WorkspaceList(options) {
  if (!(this instanceof Node)) return new WorkspaceList(options);

    options.style = options.style || {};
    options.style.selected = options.style.selected || {};
    options.style.selected.bg = options.style.selected.bg || "blue";
    options.style.selected.fg = options.style.selected.fg || "white";

    options.style.item = options.style.item || {};
    options.style.item.bg = options.style.item.bg || null;
    options.style.item.fg = options.style.item.fg || "yellow";

    options.mouse = options.mouse || true;
    // options.mouse = options.mouse || false;

    options.keys = options.keys || true;
    options.vi = options.vi || true;
    options.interactive = options.interactive || true;
    options.invertSelected = options.invertSelected || true;

    // options.items = [
    //     ["one", "stuff", "things"],
    //     ["two", "stuff", "things"],
    //     ["three", "stuff", "things"],
    //     ["four", "stuff", "things"],
    //     ["five", "stuff", "things"],
    //     ["six", "stuff", "things"],
    //     ["seven", "stuff", "things"],
    //     ["eight", "stuff", "things"],
    //     ["nine", "stuff", "things"],
    //     ["ten", "stuff", "things"],
    //     ["eleven", "stuff", "things"],
    //     ["twelve", "stuff", "things"],
    //     ["thirteen", "stuff", "things"],
    //     ["fourteen", "stuff", "things"],
    //     ["fifteen", "stuff", "things"],
    //     ["sixteen", "stuff", "things"],
    //     ["seventeen", "stuff", "things"],
    //     ["eighteen", "stuff", "things"],
    //     ["nineteen", "stuff", "things"],
    //     ["twenty", "stuff", "things"],
    // ];
    let items = [
        ["one", "stuff"],
        ["two", "stuff"],
        ["three", "stuff"],
        ["four", "stuff"],
        ["five", "stuff"],
        ["six", "stuff"],
        ["seven", "stuff"],
        ["eight", "stuff"],
        ["nine", "stuff"],
        ["ten", "stuff"],
        ["eleven", "stuff"],
        ["twelve", "stuff"],
        ["thirteen", "stuff"],
        ["fourteen", "stuff"],
        ["fifteen", "stuff"],
        ["sixteen", "stuff"],
        ["seventeen", "stuff"],
        ["eighteen", "stuff"],
        ["nineteen", "stuff"],
        ["twenty", "stuff"]
    ];

	blessed.listtable.call(this, options);
    this.setData(items)
}
WorkspaceList.prototype = Object.create(blessed.listtable.prototype);
WorkspaceList.prototype.constructor = WorkspaceList;

WorkspaceList.prototype.register_actions = function(view){
    let _this = this;
    this.view = view;

    // manage mouse things
    _this.on('element wheeldown', function(foo, bar) {
        let idx = this.getItemIndex(this.selected);
        _this.view.widgets.sidebar.emit('syncSelect', idx, 'element wheeldown');
    });
    _this.on('element wheelup', function(foo, bar) {
        let idx = this.getItemIndex(this.selected);
        _this.view.widgets.sidebar.emit('syncSelect', idx, 'element wheelup');
    });
    _this.on('element click', function(foo, bar) {
        //console.log("click")
        let idx = this.getItemIndex(this.selected);
        _this.view.widgets.sidebar.emit('syncSelect', idx, 'element click');
    });


    // manage selections
    // _this.on('element select', function(foo, bar) {
    //     console.log("element select")
    //     let idx = this.getItemIndex(this.selected);
    //     _this.view.widgets.sidebar.emit('syncSelect', idx, 'element select');
    // });
    // _this.on('select', function(item, idx){
    //     console.log("select")
    //     //let idx = this.getItemIndex(this.selected);
    //     _this.view.widgets.sidebar.emit('syncSelect', idx, 'select');
    // });

    // manage keypresses
    _this.on('keypress', function(ch, key) {
        let idx = this.getItemIndex(this.selected);
        _this.view.widgets.sidebar.emit('syncSelect', idx, 'keypress');
        //custom key bindings
        if (key.name === 'tab') {
            if (!key.shift) {
                _this.view.setWinFocusNext();
            } else {
                _this.view.setWinFocusPrev();
            }
            return;
        }
    });

    _this.on('syncSelect', function(idx,name) {
        _this.select(idx);
        _this.screen.render();
	});
}

WorkspaceList.prototype.type = 'WorkspaceList';
module.exports = WorkspaceList;

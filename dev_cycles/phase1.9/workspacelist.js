"use strict"
var blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    Box = blessed.Box,
    Node = blessed.Node;

var util = require('util');

function WorkspaceList(options) {
    if (!(this instanceof Node)) return new WorkspaceList(options);

    let items = {
        headers: ["column 1", "column 2", "column 3", "column 4", "column 5"],
        data: [
        ["one", "stuff", "things", "four", "column 5"],
        ["two", "stuff", "things", "four", "column 5"],
        ["three", "stuff", "things", "four", "column 5"],
        ["four", "stuff", "things", "four", "column 5"],
        ["five", "stuff", "things", "four", "column 5"],
        ["six", "stuff", "things", "four", "column 5"],
        ["seven", "stuff", "things", "four", "column 5"],
        ["eight", "stuff", "things", "four", "column 5"],
        ["nine", "stuff", "things", "four", "column 5"],
        ["ten", "stuff", "things", "four", "column 5"],
        ["eleven", "stuff", "things", "four", "column 5"],
        ["twelve", "stuff", "things", "four", "column 5"],
        ["thirteen", "stuff", "things", "four", "column 5"],
        ["fourteen", "stuff", "things", "four", "column 5"],
        ["fifteen", "stuff", "things", "four", "column 5"],
        ["sixteen", "stuff", "things", "four", "column 5"],
        ["seventeen", "stuff", "things", "four", "column 5"],
        ["eighteen", "stuff", "things", "four", "column 5"],
        ["nineteen", "stuff", "things", "four", "column 5"],
        ["twenty", "stuff", "things", "four", "column 5"],
    ]};
    // let items = {
    //     headers: ["column 1", "column 2"],
    //     data: [
    //         ["one", "stuff"],
    //         ["two", "stuff"],
    //         ["three", "stuff"] ]};


    // ["four", "stuff"],
    // ["five", "stuff"],
    // ["six", "stuff"],
    // ["seven", "stuff"],
    // ["eight", "stuff"],
    // ["nine", "stuff"],
    // ["ten", "stuff"],
    // ["eleven", "stuff"],
    // ["twelve", "stuff"],
    // ["thirteen", "stuff"],
    // ["fourteen", "stuff"],
    // ["fifteen", "stuff"],
    // ["sixteen", "stuff"],
    // ["seventeen", "stuff"],
    // ["eighteen", "stuff"],
    // ["nineteen", "stuff"],
    // ["twenty", "stuff"]
    // ]};

    options.columnWidth = [10,10,10, 10, 10];
    options.columnSpacing = 2;
    options.mouse = true;
    options.keys = true;
    options.vi = true;
    options.interactive = true;
    options.screen = options.parent;

    this.grapKeys = true;
    options.grapKeys = true;

    this.sendFocus = true;
    options.sendFocus = true;

    this.input = true;
    options.input = true;
    this.keyable = true
    options.keyable = true

    contrib.table.call(this, options);
    this.focus;
    this.focus();
    this.setData(items);
    this.rows.select(0)
    //this.focus;
    //this.select(0)
    // this.setData(
    //     { headers: ['col1', 'col2', 'col3']
    //         , data:
    //         [ [1, 2, 3]
    //             , [4, 5, 6] ]})

}
WorkspaceList.prototype = Object.create(contrib.table.prototype);
WorkspaceList.prototype.constructor = WorkspaceList;

WorkspaceList.prototype.register_actions = function(view){
    let _this = this;
    this.view = view;

    // manage mouse things
    _this.rows.on('element wheeldown', function(foo, bar) {
        this.rows.select();
        //console.log("element wheeldown")
        let idx = this.getItemIndex(this.selected);
        _this.view.widgets.sidebar.emit('syncSelect', idx, 'element wheeldown');
    });
    _this.rows.on('element wheelup', function(foo, bar) {
        //console.log("element wheelup")
        let idx = this.getItemIndex(this.selected);
        //self.select(idx);
        _this.view.widgets.sidebar.emit('syncSelect', idx, 'element wheelup');
    });
    _this.rows.on('element click', function(foo, bar) {
        //console.log("element click")
        let idx = this.getItemIndex(this.selected);
        _this.focus();
        _this.view.widgets.sidebar.emit('syncSelect', idx, 'element click');
    });
    _this.rows.on('click', function(foo, bar) {
        this.focus();
        let self = this;
        //console.log("click")
        //console.log(JSON.stringify(foo));
        let idx = this.getItemIndex(this.selected);
        self.select(idx);
        _this.view.widgets.sidebar.emit('syncSelect', idx, 'element click');
    });


    // manage selections
    _this.rows.on('element select', function(foo, bar) {
        //console.log("element select")
        let idx = this.getItemIndex(this.selected);
        //self.select(idx);
        _this.view.widgets.sidebar.emit('syncSelect', idx, 'element select');
    });
    _this.rows.on('select', function(foo, bar){
        //console.log("select")
        let idx = this.getItemIndex(this.selected);
        //self.select(idx);
        _this.view.widgets.sidebar.emit('syncSelect', idx, 'select');
    });

    // manage keypresses
    // _this.rows.key('tab', function(ch, key) {
    //             console.log("thing")
    // });
    _this.rows.on('mouse', function(ch, key) {
        let idx = this.getItemIndex(this.selected);
        this.select(idx);
        _this.view.widgets.sidebar.emit('syncSelect', idx, 'keypress');
    });

    _this.rows.on('keypress', function(ch, key) {
        let idx = this.getItemIndex(this.selected);
        //self.select(idx);
        _this.view.widgets.sidebar.emit('syncSelect', idx, 'keypress');
        //custom key bindings
        if (key.name === 'tab') {
            if (!key.shift) {
                //console.log("thing")
                _this.view.setWinFocusNext();
            } else {
                _this.view.setWinFocusPrev();
            }
            return;
        }
    });

    _this.on('syncSelect', function(idx,name) {
        _this.rows.select(idx);
        _this.screen.render();
    });
}

WorkspaceList.prototype.type = 'WorkspaceList';
module.exports = WorkspaceList;

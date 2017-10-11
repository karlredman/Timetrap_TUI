"use strict"
var blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    Box = blessed.Box,
    Node = blessed.Node;

var util = require('util');

function WorkspaceList(options) {
    if (!(this instanceof Node)) return new WorkspaceList(options);

    options.style = options.style || {}
    options.style.border = options.style.border || {}
    options.style.border = options.style.border || {}

    // let items = {
    //             headers: [" Running", " Today", " Total Time"],
    //     data: [
    //     ["XX000:00:00","XX000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    //     ["000:00:00","000:00:00","00000:00:00"],
    // ]};
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

    //["000:00:00","000:00:00","00000:00:00"],
    options.columnWidth = [11,11,11];
    options.columnSpacing = 2;
    options.mouse = true;
    options.keys = true;
    options.vi = true;
    options.interactive = true;
    options.screen = options.parent;

    this.grabKeys = true;
    options.grabKeys = true;

    this.sendFocus = true;
    options.sendFocus = true;

    this.input = true;
    options.input = true;
    this.keyable = true
    options.keyable = true

    contrib.table.call(this, options);
    // this.focus;
    // this.focus();
    //this.setData(items);
    //this.rows.select(0)
    this.options = options;
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
    this.rows.view = view;

    // manage mouse things
    _this.rows.on('element wheeldown', function(foo, bar) {
        this.down();
        //console.log("element wheeldown")
        let idx = this.getItemIndex(this.selected);
        _this.view.widgets.sidebar.emit('syncSelect', idx, 'element wheeldown');
    });
    _this.rows.on('element wheelup', function(foo, bar) {
        this.up();
        //console.log("element wheelup")
        let idx = this.getItemIndex(this.selected);
        //self.select(idx);
        _this.view.widgets.sidebar.emit('syncSelect', idx, 'element wheelup');
    });
    _this.rows.on('element click', function(foo, data) {
        let idx = data.y-4
        // this.select(idx);
        // this.view.widgets.sidebar.emit('syncSelect', idx, 'element click');
    });
    _this.rows.on('click', function(data, bar) {
        //console.log(JSON.stringify(foo));
        let idx = data.y-4
        this.select(idx);
        this.view.widgets.sidebar.emit('syncSelect', idx, 'element click');
        // console.log("click")
        // console.log(JSON.stringify(foo));
        // let idx = this.getItemIndex(this.selected);
        // this.select(idx);
        // this.view.widgets.sidebar.emit('syncSelect', idx, 'element click');
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

    // _this.on('update', function(data)) {
    // }
}

WorkspaceList.prototype.populate = function(tlist){
    let _this = this;
    //let sdata = _this.view.widgets.sidebar.data;
    // let sdata = _this.view.widgets.sidebar.savedData;

    // console.log(sdata.children.filter(function(e){return e.sheet == 'Projects'}).length);

    // let out = sdata.children.filter(function(e){return e.sheet == 'Projects'})[0].length;
    // let len = sdata.children.filter(function(e){return e.sheet == 'Projects'})[0];
    // for (; len > 0;len--){
    //     console.log(sdata.children.filter(function(e){return e.sheet == 'Projects'})[0][len-1]);
    // }
    // let sdata = _this.view.widgets.sidebar.savedData;
    // let output = sdata.children.filter(function(e){return e.sheet == 'Projects'})[0];
    // require('fs').writeFile('node.out', util.inspect(output, null, 9), (er, x)=>{});

}

WorkspaceList.prototype.type = 'WorkspaceList';
module.exports = WorkspaceList;

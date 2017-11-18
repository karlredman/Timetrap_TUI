"use strict"
var blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    Box = blessed.Box,
    Node = blessed.Node;

var util = require('util');
var DialogMessage = require('./DialogMessage');

function PanelPickList(options) {
    if (!(this instanceof Node)) return new PanelPickList(options);

    let _this = this;

    _this.view = options.view;

    options.style = options.style || {}
    options.style.border = options.style.border || {}
    options.style.border = options.style.border || {}
    //options.align = 'center';

    //meh
    //options.wrap = true;

    // causes crash
    // options.scrollable = options.scrollable || true;
    // options.scrollbar = options.scrollbar || {};
    // options.scrollbar.ch = options.scrollbar.ch || ' ';
    // options.style.scrollbar = options.style.scrollbar || {};
    // options.style.scrollbar.inverse = options.style.scrollbar.inverse || true;

    let items = {
        headers: ["  Id"  , "      Day"       , "  Start", "   End"   ," Duration", " Notes"],
        data: [
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
                 ["123456", "Wed Oct 11, 2017", "00:00:00", "00:00:00", "00:00:00", "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"],
        ]};

    //TODO: adjust to screen width / or make configurable for note length
    options.columnWidth = [6,16,8,8,12,64];
    options.columnSpacing = 3;
    options.mouse = true;
    options.keys = true;
    options.vi = true;
    options.interactive = true;
    options.screen = options.parent;

    // this.grabKeys = true;
    // options.grabKeys = true;

    // this.sendFocus = true;
    // options.sendFocus = true;

    // this.input = true;
    // options.input = true;
    // this.keyable = true
    // options.keyable = true

    this.options = options

    contrib.table.call(this, options);
    // this.focus;
    this.focus();
    this.setData(items);
    //this.rows.select(0)
    this.options = options;
    //this.focus;
    //this.select(0)
    // this.setData(
    //     { headers: ['col1', 'col2', 'col3']
    //         , data:
    //         [ [1, 2, 3]
    //             , [4, 5, 6] ]})


};
PanelPickList.prototype = Object.create(contrib.table.prototype);
PanelPickList.prototype.constructor = PanelPickList;

PanelPickList.prototype.register_actions = function(){
    let _this = this;

    // manage mouse things
    _this.rows.on('element wheeldown', function(foo, bar) {
        this.down();
        //console.log("element wheeldown")
        let idx = this.getItemIndex(this.selected);
        // _this.view.widgets.sidebar.emit('syncSelect', idx, 'element wheeldown');
    });
    _this.rows.on('element wheelup', function(foo, bar) {
        this.up();
        //console.log("element wheelup")
        let idx = this.getItemIndex(this.selected);
        //self.select(idx);
        //_this.view.widgets.sidebar.emit('syncSelect', idx, 'element wheelup');
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
        //this.view.widgets.sidebar.emit('syncSelect', idx, 'element click');
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
        // _this.view.widgets.sidebar.emit('syncSelect', idx, 'element select');
    });
    _this.rows.on('select', function(foo, bar){
        //console.log("select")
        let idx = this.getItemIndex(this.selected);
        //self.select(idx);
        // _this.view.widgets.sidebar.emit('syncSelect', idx, 'select');
    });

    // manage keypresses
    _this.rows.on('keypress', function(ch, key) {
        // let idx = this.getItemIndex(this.selected);
        if (key.name === 'tab') {
            if (!key.shift) {
                _this.view.setWinFocusNext();
            } else {
                _this.view.setWinFocusPrev();
            }
            return;
        }
    });

    _this.rows.on('mouse', function(ch, key) {
        let idx = this.getItemIndex(this.selected);
        this.select(idx);
        // _this.view.widgets.sidebar.emit('syncSelect', idx, 'keypress');
    });


}

PanelPickList.prototype.type = 'PanelPickList';
module.exports = PanelPickList;

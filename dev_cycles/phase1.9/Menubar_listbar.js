"use strict"
var blessed = require('blessed'),
    Node = blessed.Node;
var DialogPrompt = require('./DialogPrompt'),
    DialogQuestion = require('./DialogQuestion'),
    DialogMessage = require('./DialogMessage'),
    DialogAlert = require('./DialogAlert'),
    ListDisplay = require('./ListDisplay'),
    ListResume = require('./ListResume'),
    BigBox = require('./bigbox');
var util = require('util');

function MenuBar(options) {


    if (!(this instanceof Node)) return new MenuBar(options);
    let _this=this;

    _this.options = options;
    _this.screen = options.parent;
    _this.view; // set in register_actions


    // set overridable defaults
    options = options || {};
    options.keys = null;            //we're overriding keys
    options.xkeys = true;
    options.height = options.height || 1;
    options.mouse = options.mouse || true;
    options.vi = options.vi || true;
    options.scrollable = options.scrollable || true;

    //manage styles
    options.style = options.style || {};

    options.style.item = options.style.item || {};
    options.style.item.bg = options.style.item.bg || null;
    options.style.item.fg = options.style.item.fg || "white";

    options.style.prefix = options.style.prefix || {};
    options.style.prefix.bg = options.style.prefix.bg || null;
    options.style.prefix.fg = options.style.prefix.fg || "yellow";

    //options.invertSelected = true;

    options.style.selected = options.style.selected || {};
    options.style.selected.bg = options.style.selected.bg || "black";
    options.style.selected.fg = options.style.selected.fg || "lightblue";

    ////////////////
    // TODO: Add 'unselected' state for items (on a timer)
    // options.style.selected.bg = options.style.selected.bg || null;
    // options.style.selected.fg = options.style.selected.fg || "white";

    // if (options.commands || options.items) {
    //     this.setItems(options.commands || options.items);
    // }


    // failsafe: in case parent is not passed in options
    options.parent = options.parent || screen;

    this.options = options;

    // TODO: move these calls to view in a standardized format
    options.items = options.commands || {
        In: function(){
            let prompt = new DialogPrompt({target: _this, parent: _this.screen});
            prompt.cannedInput('checkIn');
            setTimeout(function(){
                _this.select(0);
                _this.screen.render();
            }, 1000);
        },
        Out: function(){
            let prompt = new DialogPrompt({target: _this, parent: _this.screen});
            prompt.cannedInput('checkOut');
            setTimeout(function(){
                _this.select(0);
                _this.screen.render();
            }, 1000);
        },
        Edit: function(){
            let prompt = new DialogPrompt({target: _this, parent: _this.screen});
            prompt.cannedInput('edit');
            setTimeout(function(){
                _this.select(0);
                _this.screen.render();
            }, 1000);
        },
        Resume: function(){
            let prompt = new DialogPrompt({target: _this, parent: _this.screen});
            //prompt.cannedInput('resume');
            let display_menu = new ListResume({
                parent: _this.screen,
                //TODO: could be more generic
                top: _this.items[3].position.top+1,         //offset one below
                left: _this.items[3].position.left+3,       //offset to the right
                width: _this.items[3].position.width,       //the width of 'Display'
            });
            display_menu.focus();
            _this.screen.render();
            setTimeout(function(){
                _this.select(0);
                _this.screen.render();
            }, 1000);
        },
        Display: function(){
            let display_menu = new ListDisplay({
                parent: _this.screen,
                top: _this.items[4].position.top+1,         //offset one below
                left: _this.items[4].position.left+3,       //offset to the right
                width: _this.items[4].position.width,       //the width of 'Display'
            });
            display_menu.focus();
            _this.screen.render();
            setTimeout(function(){
                _this.select(0);
                _this.screen.render();
            }, 1000);
        },
        Stop_all: function(){
            let question = new DialogQuestion({target: _this, parent: _this.screen});
            if( _this.view.config.timetrap_config.tui_question_prompts.value === true ){
                question.cannedInput('stopAll');
            }
            else {
                _this.emit('question', {type: 'stopAll', data: true});
            }
            //question.cannedInput('stopAll');
            setTimeout(function(){
                _this.select(0);
                _this.screen.render();
            }, 1000);
        },
        Help: function(){
            let nkey = {
                sequence: "?",
                name: "?",
                ctrl: false,
                meta: false,
                shift: false,
                full: "?"
            }
            _this.parent.emit('key '+nkey.full, nkey.full, nkey);
            setTimeout(function(){
                _this.select(0);
                _this.screen.render();
            }, 1000);
        },
        eXit: function(){
            let question = new DialogQuestion({target: _this, parent: _this.screen});
            if( _this.view.config.timetrap_config.tui_question_prompts.value === true ){
                question.cannedInput('exit');
            }
            else {
                _this.emit('question', {type: 'exit', data: true});
            }
            setTimeout(function(){
                _this.select(0);
                _this.screen.render();
            }, 1000);
        },
        Test: function() {
            // TODO: move alert to screen level for debugging
            // let m = new DialogMessage({target: _this, parent: _this.screen});
            // m.alert('testing: '+ _this.view.config.timetrap_config.tui_question_prompts.value);
            //_this.items[8].style.bg = "yellow";
            let bb = new BigBox({parent: _this.screen});
            //let output = util.inspect(_this.items[8], null, true);
            //let output = util.inspect(_this.view.widgets.sidebar.rows.getItem(0), false, 2);
            let output = "";
            let sdata = _this.view.widgets.sidebar.savedData;


            //let output = sdata.children.filter(function(e){return e.sheet == 'Projects'})[0];
            //require('fs').writeFile('node.out', util.inspect(output, null, 9));
            bb.setContent(output);
            setTimeout(function(){
                _this.select(0);
                _this.screen.render();
            }, 1000);
        },
        Test2: function() {
            // TODO: move alert to screen level for debugging
            let output = util.inspect(_this.items[8], null, true);
            //let alert = new DialogAlert({target: _this, parent: _this.screen});
            //m.alert('testing: '+ _this.view.config.timetrap_config.tui_question_prompts.value);
            _this.view.widgets.workspace.setContent(output);
            setTimeout(function(){
                _this.select(0);
                _this.screen.render();
            }, 1000);
        }
    }

    //inherit from textarea
    blessed.listbar.call(this, options);

    //this.screen.render();
}
MenuBar.prototype = Object.create(blessed.listbar.prototype);
MenuBar.prototype.constructor = MenuBar;


MenuBar.prototype.register_actions = function(view){

    let _this = this;
    this.view = view;

    _this.on('keypress', function(ch, key) {
        //custom key bindings
        if (key.name === 'tab') {
            if (!key.shift) {
                _this.view.setWinFocusNext();
            } else {
                _this.view.setWinFocusPrev();
            }
            return;
        }
        if (key.name === 'left'
            || (_this.options['vi'] && key.name === 'h')
            //|| (key.shift && key.name === 'tab')
        ) {
            // let item = _this.items[_this.selected];
            // item.style.bg = null;
            // item.style.fg = "white";
            _this.moveLeft();
            //item = _this.items[_this.selected];
            // item.style.bg = "black";
            // item.style.fg = "lightblue";
            _this.screen.render();
            // Stop propagation if we're in a form.
            //if (key.name === 'tab') return false;
            return;
        }
        if (key.name === 'right'
            || (_this.options['vi'] && key.name === 'l')
            //|| key.name === 'tab'
        ) {
            // let item = _this.items[_this.selected];
            // item.style.bg = null;
            // item.style.fg = "white";
            _this.moveRight();
            // item = _this.items[_this.selected];
            // item.style.bg = "black";
            // item.style.fg = "lightblue";
            _this.screen.render();
            // Stop propagation if we're in a form.
            //if (key.name === 'tab') return false;
            return;
        }
        if (key.name === 'enter'
            || (_this.options['vi'] && key.name === 'k' && !key.shift)) {
            _this.emit('action', _this.items[_this.selected], _this.selected);
            _this.emit('select', _this.items[_this.selected], _this.selected);
            let item = _this.items[_this.selected];
            if (item._.cmd.callback) {
                item._.cmd.callback();

                // //TODO: timer to set 'unselected'
                // setTimeout(function(){
                //     // item.style.bg = null;
                //     // item.style.fg = "white";
                //     _this.select(0);
                //     _this.screen.render();
                // }, 1000);
            }
            _this.screen.render();
            return;
        }
    });
    _this.on('question', function(data){
        if ( data.type === 'exit' ) {
            if(data.data) {
                //emit the exit key sequence
                let nkey = {
                    sequence: "\u0003",
                    name: "c",
                    ctrl: true,
                    meta: false,
                    shift: false,
                    full: "C-c"
                }
                _this.parent.emit('key '+nkey.full, 'C-c', nkey);
            }
        }
        if (data.type === 'stopAll'){
            if(data.data) {
                //stop all timers
            }
        }
        //_this.select(0)
        _this.screen.render();
    });
    _this.on('testprompt', function(data){
        _this.select(0)
        _this.screen.render();
    });
}

MenuBar.prototype.type = 'MenuBar';
module.exports = MenuBar;

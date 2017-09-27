"use strict"
var blessed = require('blessed'),
    Node = blessed.Node;
var DialogPrompt = require('./DialogPrompt'),
    DialogQuestion = require('./DialogQuestion');

function MenuBar(options) {

    if (!(this instanceof Node)) return new MenuBar(options);
    let _this=this;

    _this.options = options;
    _this.screen = options.parent;

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
    options.style.prefix.fg = options.style.prefix.fg || "lightblack";

    //options.invertSelected = true;

    options.style.selected = options.style.selected || {};
    options.style.selected.bg = options.style.selected.bg || "black";
    options.style.selected.fg = options.style.selected.fg || "white";

    // if (options.commands || options.items) {
    //     this.setItems(options.commands || options.items);
    // }


    // failsafe: in case parent is not passed in options
    options.parent = options.parent || screen;

    this.options = options;

    options.items = options.commands || {
        In: function(){
            let prompt = new DialogPrompt({target: _this, parent: _this.screen});
            prompt.cannedInput('checkIn');
        },
        Out: function(){
            let prompt = new DialogPrompt({target: _this, parent: _this.screen});
            prompt.cannedInput('checkOut');
        },
        Edit: function(){
            let prompt = new DialogPrompt({target: _this, parent: _this.screen});
            prompt.cannedInput('edit');
        },
        Resume: function(){
            let prompt = new DialogPrompt({target: _this, parent: _this.screen});
            prompt.cannedInput('resume');
        },
        Display: function(){},
        StopAll: function(){
            let question = new DialogQuestion({target: _this, parent: _this.screen});
            question.cannedInput('stopAll');
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
        },
        eXit: function(){
            let question = new DialogQuestion({target: _this, parent: _this.screen});
            question.cannedInput('exit');
        },
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
            _this.moveLeft();
            _this.screen.render();
            // Stop propagation if we're in a form.
            //if (key.name === 'tab') return false;
            return;
        }
        if (key.name === 'right'
            || (_this.options['vi'] && key.name === 'l')
            //|| key.name === 'tab'
        ) {
            _this.moveRight();
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
            }
            _this.screen.render();
            return;
        }
    });
    _this.on('prompt', function(data){
        //_this.select(0)
        _this.screen.render();
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

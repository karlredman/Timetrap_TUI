"use strict"
var blessed = require('blessed'),
    Node = blessed.Node;


function MenuBar(options) {

    if (!(this instanceof Node)) return new Workspace(options);

    // set overridable defaults
    options = options || {};
    options.keys = null;            //we're overriding keys
    options.xkeys = true;
    options.height = options.height || 1;
    options.mouse = options.mouse || true;
    options.vi = options.vi || true;
    options.autoCommandKeys = options.autoCommandKeys || true;
    options.items = options.items || [
        'In',
        'Out',
        'Edit',
        'Resume',
        'Display',
        'StopAll',
    ];

    //manage styles
    options.style = options.style || {};

    options.style.item = options.style.item || {};
    options.style.item.bg = options.style.item.bg || null;
    options.style.item.fg = options.style.item.fg || "white";

    options.style.prefix = options.style.prefix || {};
    options.style.prefix.bg = options.style.prefix.bg || null;
    options.style.prefix.fg = options.style.prefix.fg || "lightblack";

    options.style.selected = options.style.selected || {};
    options.style.selected.bg = options.style.selected.bg || "white";
    options.style.selected.fg = options.style.selected.fg || "blue";


    // if (options.commands || options.items) {
    //     this.setItems(options.commands || options.items);
    // }


    // failsafe: in case parent is not passed in options
    options.parent = options.parent || screen;

    //inherit from textarea
    blessed.listbar.call(this, options);


    //this.screen.render();
}

MenuBar.prototype = Object.create(blessed.listbar.prototype);
MenuBar.prototype.constructor = MenuBar;

MenuBar.prototype.register_actions = function(view){

	this.view = view;

    this.on('keypress', function(ch, key) {
		//custom key bindings
        if (key.name === 'tab') {
            if (!key.shift) {
                this.view.setWinFocusNext();
            } else {
                this.view.setWinFocusPrev();
            }
            return;
        }
        if (key.name === 'left'
            || (this.options['vi'] && key.name === 'h')
            //|| (key.shift && key.name === 'tab')
        ) {
            this.moveLeft();
            this.screen.render();
            // Stop propagation if we're in a form.
            //if (key.name === 'tab') return false;
            return;
        }
        if (key.name === 'right'
            || (this.options['vi'] && key.name === 'l')
            //|| key.name === 'tab'
        ) {
            this.moveRight();
            this.screen.render();
            // Stop propagation if we're in a form.
            //if (key.name === 'tab') return false;
            return;
        }
        if (key.name === 'enter'
            || (this.options['vi'] && key.name === 'k' && !key.shift)) {
            this.emit('action', this.items[this.selected], this.selected);
            this.emit('select', this.items[this.selected], this.selected);
            let item = this.items[this.selected];
            if (item._.cmd.callback) {
                item._.cmd.callback();
            }
            this.screen.render();
            return;
        }
        // if (key.name === 'escape' || (this.options['vi'] && key.name === 'q')) {
        //     this.emit('action');
        //     this.emit('cancel');
        //     return;
        // }
    });
}

MenuBar.prototype.type = 'MenuBar';
module.exports = MenuBar;

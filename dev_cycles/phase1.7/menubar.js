"use strict"

var blessed = require('blessed');


function MenuBar(options) {

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

    if ( !(options.style.hasOwnProperty("item") ) ) {
        options.style["item"] = {
            bg: null,
            fg: "white"
        }
    }
    // options.style.item = options.style.item | {};
    // options.style.item.bg = options.style.item.bg | null;
    // options.style.item.fg = options.style.item.fg | "white";

    if ( !(options.style.hasOwnProperty("prefix") ) ) {
        options.style["prefix"] = {
            bg: null,
            fg: 'lightblack'
        }
    }
    // options.style.prefix = options.style.prefix | {};
    // options.style.prefix.bg = options.style.prefix.bg | null;
    // options.style.prefix.fg = options.style.prefix.fg | "lightblack";

    if ( !(options.style.hasOwnProperty("selected") ) )  {
        options.style.selected =
            {
                bg: 'white',
                fg: 'blue'
            }
    }
    // options.style.selected = options.style.selected | {};
    // options.style.selected.bg = options.style.selected.bg | "white";
    // options.style.selected.fg = options.style.selected.fg | "blue";




    // if (options.commands || options.items) {
    //     this.setItems(options.commands || options.items);
    // }


    // failsafe: in case parent is not passed in options
    options.parent = options.parent || screen;

    //inherit from textarea
	blessed.listbar.call(this, options);

    this.on('keypress', function(ch, key) {
        if (key.name === 'left'
            || (this.options['vi'] && key.name === 'h')
            //|| (key.shift && key.name === 'tab')
        ) {
            this.moveLeft();
            this.screen.render();
            // Stop propagation if we're in a form.
            if (key.name === 'tab') return false;
            return;
        }
        if (key.name === 'right'
            || (this.options['vi'] && key.name === 'l')
            //|| key.name === 'tab'
        ) {
            this.moveRight();
            this.screen.render();
            // Stop propagation if we're in a form.
            if (key.name === 'tab') return false;
            return;
        }
        if (key.name === 'enter'
            || (this.options['vi'] && key.name === 'k' && !key.shift)) {
            this.emit('action', this.items[this.selected], this.selected);
            this.emit('select', this.items[this.selected], this.selected);
            var item = this.items[this.selected];
            if (item._.cmd.callback) {
                item._.cmd.callback();
            }
            this.screen.render();
            return;
        }
        if (key.name === 'escape' || (this.options['vi'] && key.name === 'q')) {
            this.emit('action');
            this.emit('cancel');
            return;
        }
        //});
    });



    this.screen.render();
}
MenuBar.prototype = Object.create(blessed.listbar.prototype);
MenuBar.prototype.constructor = MenuBar;

// MenuBar.prototype.on('select', function(el) {
//     console.log(bar.items.indexOf(el));

//     //verify side menu object -and use to grab function
//     //apps.prevSideEl               //?? how
// });

//if (menubar.options['Xkeys']) {



MenuBar.prototype.type = 'MenuBar';
module.exports = MenuBar;

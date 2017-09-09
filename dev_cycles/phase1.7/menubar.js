"use strict"

var blessed = require('blessed');


function MenuBar(options) {

	// set overridable defaults
    options = options || {};
    options.height = options.height || 1;
    options.mouse = options.mouse || true;
    options.vi = options.vi || true;
    options.items = options.items || [
        'In',
        'Out',
        'Edit',
        'Resume',
        'Display',
        'StopAll',
    ];
    options.autoCommandKeys = options.autoCommandKeys || true;
    options.style = options.style || {};
    // options.style.seleced = options.style.item || {};
    // options.style.item = options.style.item || {};

    // failsafe: in case parent is not passed in options
    options.parent = options.parent || screen;

    //inherit from textarea
	blessed.listbar.call(this, options);

}
MenuBar.prototype = Object.create(blessed.listbar.prototype);
MenuBar.prototype.constructor = MenuBar;

// MenuBar.prototype.on('select', function(el) {
//     console.log(bar.items.indexOf(el));

//     //verify side menu object -and use to grab function
//     //apps.prevSideEl               //?? how
// });

// if (menubar.options['Xkeys']) {
//     menubar.on('keypress', function(ch, key) {
//         if (key.name === 'left'
//             || (bar.options['vi'] && key.name === 'h')
//             //|| (key.shift && key.name === 'tab')
//         ) {
//             menubar.moveLeft();
//             screen.render();
//             // Stop propagation if we're in a form.
//             if (key.name === 'tab') return false;
//             return;
//         }
//         if (key.name === 'right'
//             || (bar.options['vi'] && key.name === 'l')
//             //|| key.name === 'tab'
//         ) {
//             menubar.moveRight();
//             screen.render();
//             // Stop propagation if we're in a form.
//             if (key.name === 'tab') return false;
//             return;
//         }
//         if (key.name === 'enter'
//             || (bar.options['vi'] && key.name === 'k' && !key.shift)) {
//             menubar.emit('action', menubar.items[bar.selected], menubar.selected);
//             menubar.emit('select', menubar.items[bar.selected], menubar.selected);
//             var item = menubar.items[bar.selected];
//             if (item._.cmd.callback) {
//                 item._.cmd.callback();
//             }
//             screen.render();
//             return;
//         }
//         if (key.name === 'escape' || (bar.options['vi'] && key.name === 'q')) {
//             menubar.emit('action');
//             menubar.emit('cancel');
//             return;
//         }
//     });
// }



MenuBar.prototype.type = 'MenuBar';
module.exports = MenuBar;

"use strict";

// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib');

var screen = blessed.screen({
    autoPadding: true,
    smartCSR: true
});

// Quit on `q`, or `Control-C` when the focus is on the screen.
screen.key(['q','C-c'], function(ch, key) {
    //console.log(JSON.stringify(ch)+":"+JSON.stringify(key))
    process.exit(0);
});

function main(argv, callback) {

    let box = blessed.box({
        parent: screen,
        keys: true,
        left: 0,
        top: 3,
        width: '50%',
        height: '50%',
        bg: null,
        border: {
            type: 'line',
        },
        content: 'this is a message'
    })

    let grid = new contrib.grid({rows: 6, cols: 6, screen: screen})

    let prompt =  grid.set(1, 2, 3, 3, blessed.prompt, {
        //let prompt = blessed.prompt({
        parent: screen,
        keys: true,
        left: 'center',
        top: 'center',
        width: '50%',
        height: '50%',
        bg: null,
        border: {
            type: 'line',
        },
        content: 'Submit or cancel?'
    })



    prompt.input('would you like to play a game?', 't i ', function(err, data){
        //console.log("input - got here: er=%s, c=%s",err, data);
        screen.emit("dialogCB", err, data)
    })


    screen.on("dialogCB", function(err, data){
        screen.render()
        //process.exit(0)
    })

    screen.render();
}


// Process loop
if (!module.parent) {
    process.title = 'Boxes';
    main(process.argv.slice(), function(err) {
        if (err) throw err;
        return process.exit(0);
    });
} else {
    module.exports = main;
}

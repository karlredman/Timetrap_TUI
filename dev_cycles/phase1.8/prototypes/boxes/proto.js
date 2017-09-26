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

    // var form = blessed.form({
    //   parent: screen,
    //   keys: true,
    //   left: 0,
    //   top: 0,
    //   width: 30,
    //   height: 4,
    //   bg: 'green',
    //   content: 'Submit or cancel?'
    // });

    let prompt = blessed.prompt({
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

    //prompt.readInput('', function(){})
    //prompt.show()
    //prompt._.okay.show()



    screen.render();


    // prompt.setInput('would you like to play a game?', 't i ', function(er,c){
    //     console.log("setInput - got here: er=%s, c=%s",er, c);
    // })
    // prompt.readInput('would you like to play a game?', 't i ', function(er,c){
    //     console.log("readInput - got here: er=%s, c=%s",er, c);
    // })

    // prompt
    prompt.input('would you like to play a game?', 't i ', function(er,c){
        console.log("input - got here: er=%s, c=%s",er, c);
    })

    //message
    // prompt.display("a message display", 0, function(er, c){
    //     console.log("message - got here: er=%s, c=%s",er, c);
    // })

    // //question
    // prompt.ask("are you sure?", function(er, c){
    //     console.log("message - got here: er=%s, c=%s",er, c);
    // })

    // loading
    // prompt.load("loading text")
    // setTimeout(function(){
    //     prompt.stop()
    // }, 1000)
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

"use strict";

// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib');


// program init/startup
function View(data, screen, menubar, side, mainw, callback) {

    //program window
    var pwin ={};
    pwin.mainw = 1;
    pwin.side = 2;
    pwin.menu = 3;
    pwin.first = pwin.mainw;
    pwin.last = pwin.menu;

    var curWin = 1;
    // horizontal seperator line
    var seph = blessed.line({
        parent: screen,
        orientation: 'horizontal',
        left: data.sidew,
        top: 1,
        left: 0,
        right: 0,
        fg: "red"
    });

    // verticle seperator line
    var sepv = blessed.line({
        parent: screen,
        orientation: 'vertical',
        left: data.sidew,
        top: 2,
        bottom: 0,
        fg: "green",
        //bg: "black"
    });


    //seperator  bar color change on focus chage
    //// side menue focus
    screen.setEffects(sepv, side, 'focus', 'blur', { fg: 'green' });
    screen.setEffects(seph, side, 'focus', 'blur', { fg: 'red' });
    //// top bar
    screen.setEffects(sepv, menubar, 'focus', 'blur', { fg: 'red' });
    screen.setEffects(seph, menubar, 'focus', 'blur', { fg: 'green' });
    //// main textarea focus
    screen.setEffects(sepv, mainw, 'focus', 'blur', { fg: 'red' });
    screen.setEffects(seph, mainw, 'focus', 'blur', { fg: 'red' });

    function setWinFocus(win){
        switch(win){
            case pwin.mainw:
                mainw.focus();
                break;
            case pwin.side:
                side.focus();
                break;
            case pwin.menu:
                menubar.focus();
                // if(prevSideEl != null) {
                //     menubar.focus();
                // }
                // else {
                //     setWinFocus(pwin.side);
                // }
                break;
        }
    }

    function setWinFocusNext(){
        if((curWin+1) > pwin.last){
            curWin = pwin.first;
            setWinFocus(pwin.first);
        }
        else {
            curWin++;
            setWinFocus(curWin);
        }
        screen.render();
        return
    }

    function setWinFocusPrev(){
        if((curWin-1) < pwin.first){
            curWin = pwin.last;
            setWinFocus(pwin.last);
        }
        else {
            curWin--;
            setWinFocus(curWin);
        }
        screen.render();
        return
    }

    //key presses
    screen.on('keypress', function(ch, key) {
        if (key.name === 'tab') {
            if (!key.shift) {
                setWinFocusNext();
            } else {
                setWinFocusPrev();
            }
            return;
        }
    });

    side.focus();
    curWin=pwin.side;

    screen.render();
}
exports.View = View;

"use strict";

// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib');


// program init/startup
function View(config, screen, widgets) {

	this.widgets = widgets;

    //program window
	let pwin ={
		mainw: 1,
		side: 2,
		menu: 3,
	};
	pwin.first = pwin.mainw;
	pwin.last = pwin.menu;

    let curWin = 1;

    // horizontal seperator line
    let seph = blessed.line({
        parent: screen,
        orientation: 'horizontal',
        left: config.view.sidew,
        top: 1,
        left: 0,
        right: 0,
        fg: "red"
    });

    // verticle seperator line
    let sepv = blessed.line({
        parent: screen,
        orientation: 'vertical',
        left: config.view.sidew,
        top: 2,
        bottom: 0,
        fg: "green",
        //bg: "black"
    });


    //seperator  bar color change on focus chage
    //// side menue focus
    screen.setEffects(sepv, widgets.sidebar, 'focus', 'blur', { fg: 'green' });
    screen.setEffects(seph, widgets.sidebar, 'focus', 'blur', { fg: 'red' });
    //// top bar
    screen.setEffects(sepv, widgets.menubar, 'focus', 'blur', { fg: 'red' });
    screen.setEffects(seph, widgets.menubar, 'focus', 'blur', { fg: 'green' });
    //// main textarea focus
    screen.setEffects(sepv, widgets.workspace, 'focus', 'blur', { fg: 'red' });
    screen.setEffects(seph, widgets.workspace, 'focus', 'blur', { fg: 'red' });

    function setWinFocus(win){
        switch(win){
            case pwin.mainw:
                widgets.workspace.focus();
                break;
            case pwin.side:
                widgets.sidebar.focus();
                break;
            case pwin.menu:
                widgets.menubar.focus();
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

    widgets.sidebar.focus();
    curWin=pwin.side;

	for (let key in widgets) {
	 	widgets[key].register_actions(this)
	}

    screen.render();
}

View.prototype.type = 'View';
module.exports = View;

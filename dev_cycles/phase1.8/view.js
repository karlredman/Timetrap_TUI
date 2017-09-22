"use strict";

// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib');


// program init/startup
function View(config, screen, widgets) {

    let _this=this;
	this.widgets = widgets;
    this.screen = screen;

    /////////////////////////////////////////////////////
    // this view's layout

    //this view's window panes
	this.pwin ={
		mainw: 1,
		side: 2,
		menu: 3,
	};
	this.pwin.first = this.pwin.mainw;
	this.pwin.last = this.pwin.menu;

    //the current pane default
    this.curWin = 1;

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

    /////////////////////////////////////////////////////
    // this view's control

    widgets.sidebar.focus();
    this.curWin=this.pwin.side;

    for (let key in this.widgets) {
        //if (this.widgets.hasOwnProperty(key)) continue;
        this.widgets[key].register_actions(_this)
    }

    //self register
    this.register_actions();

    widgets.dirtree.register_actions(this);

    //screen.render();
}



View.prototype.register_actions = function()
{
	let _this = this;

}

View.prototype.setWinFocus = function(win){
	let _this = this;
    switch(win){
        case _this.pwin.mainw:
            _this.widgets.workspace.focus();
            break;
        case _this.pwin.side:
            _this.widgets.sidebar.focus();
            break;
        case _this.pwin.menu:
            _this.widgets.menubar.focus();
            break;
    }
}

View.prototype.setWinFocusNext = function(){
	let _this = this;
    if((_this.curWin+1) > _this.pwin.last){
        _this.curWin = _this.pwin.first;
        _this.setWinFocus(_this.pwin.first);
    }
    else {
        _this.curWin++;
        _this.setWinFocus(_this.curWin);
    }
    _this.screen.render();
    return
}

View.prototype.setWinFocusPrev = function(){
	let _this = this;
    if((_this.curWin-1) < _this.pwin.first){
        _this.curWin = _this.pwin.last;
        _this.setWinFocus(_this.pwin.last);
    }
    else {
        _this.curWin--;
        _this.setWinFocus(_this.curWin);
    }
    _this.screen.render();
    return
}

View.prototype.hideAll = function(){
    let _this = this;
    for (let key in _this.widgets) {

        if (_this.widgets.hasOwnProperty(key)) continue;

        _this.widgets[this.key].hide();
    }
    _this.screen.render();
}


View.prototype.test = function(){
    return "view.test"
}

View.prototype.type = 'View';
module.exports = View;

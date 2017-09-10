// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib');

//global screen
var screen = blessed.screen();

// app modules
var config = require('./config'),
    dirtree = require('./dirtree');
// panels
var ActionBar = require('./actionbar');
var MenuBar = require('./menubar');
var SideBar = require('./sidebar');
var Workspace = require('./Workspace');


//program window
var pwin ={};
pwin.mainw = 1;
pwin.side = 2;
pwin.menu = 3;
pwin.first = pwin.mainw;
pwin.last = pwin.menu;

var curWin = 1;

// program init/startup
function start(data, menubar, side, mainwin, callback) {

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

function getMaxSideNameLen()
{
    // var toolong=25;
    // var maxlen=0;
    // Object.keys(apps).forEach(function ( key, index) {
    //     var len = apps[key]['name'].length;
    //     if(len > maxlen) {
    //         maxlen=len;
    //     }
    // });
    // return maxlen > toolong ? toolong : maxlen;
    return 25;
}


// Quit on `q`, or `Control-C` when the focus is on the screen.
screen.key(['q', 'C-c'], function(ch, key) {
    process.exit(0);
});

function main(argv, callback) {
    var data = {};
    data.sidew = getMaxSideNameLen();   //side menu width
    data.numwnd = 3;                    //number of windows
    data.curwind = 1;                   //current window (starts at 1, screen === 0)

    // logo -useless
    let actionbar = new ActionBar(
        {
            parent: screen,
            top:0,
            left:0,
            width: data.sidew,
            value:"Timetrap TUI:",
            fg: "blue"
        }
    );

    //menubar at top
    let menubar = new MenuBar({
        parent: screen,
        left: data.sidew,
        right: 0,
        top: 0,
    });

    // the main area
    //var mainw = blessed.box({
    let workspace = Workspace({
        parent: screen,
        left: data.sidew + 1,
        top: 2,
        bottom: 0,
        right: 0
        // mouse: true,
        // keys: true,
        // vi: true,
        // //shrinkBox: true,
        // scrollbar: {
        //     ch: ' '
        // },
        // style: {
        //     scrollbar: {
        //         inverse: true
        //     }
        // },
        // tags: true,
        // left: data.sidew + 1,
        // top: 2,
        // bottom: 0,
        // right: 0
    });

    //project tree on the left
    let sidebar = new SideBar({
        parent: screen,
        left: 0,
        top: 2,
        bottom: 0,
        width: data.sidew,
    });

    //get config data
    config.fetch_config();

    // get the tree data
    sidebar.setData(dirtree.dirTree(config.timetrap_config.tui_projects_template_path));

    return start(data, menubar, sidebar, workspace, function(err) {
        if (err) return callback(err);
        return callback();
    });
}

// Process loop
if (!module.parent) {
    process.title = 'phainein';
    main(process.argv.slice(), function(err) {
        if (err) throw err;
        return process.exit(0);
    });
} else {
    module.exports = main;
}

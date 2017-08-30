// imports
var blessed = require('blessed');

// Create a screen object.
var screen = blessed.screen();

//program window
var pwin ={};
pwin.mainw = 1;
pwin.side = 2;
pwin.top = 3;
pwin.first = pwin.mainw;
pwin.last = pwin.top-1;

var curWin = 1;

var apps = {
    manifest: {
        name: 'Manifest/Tickets',
        actions: ['Owned', 'All', 'New', 'Edit', 'PreView', 'Browse', 'Search', 'Profile'],
        //        actionsFuncs: [ function(win){ win.setContent("got here"); } ],
        func: function(bar){
            bar.setItems(apps.manifest['actions']);
        }
    },
    phriction: {
        name: 'Phriction/Wiki',
        actions: ['New', 'Edit', 'PreView', 'Browse', 'Search', 'Profile'],
        func: function(bar){
            bar.setItems(apps.phriction['actions']);
        }
    },
    phame :{
        name: 'Phame/Blog',
        actions: ['New', 'Edit', 'PreView', 'Browse', 'Search', 'Profile'],
        func: function(bar){
            bar.setItems(apps.phame['actions']);
        }
    },
    diffusion: {
        name: 'Diffusion/Repos',
        actions: ['Active', 'All', 'CloneAddr', 'Browse', 'Search', 'Profile'],
        func: function(bar){
            bar.setItems(apps.diffusion['actions']);
        }
    },
    differential: {
        name: 'Differential/Review',
        actions: ['Active Revs', 'Create', 'Queries', 'Browse', 'Search', 'Profile'],
        func: function(bar){
            bar.setItems(apps.differential['actions']);
        }
    },
    browse: {
        name: 'Browse/Audit Commits',
        actions: ['All Commits', 'Queries', 'Browse', 'Search', 'Profile'],
        func: function(bar){
            bar.setItems(apps.browse['actions']);
        }
    },
    people: {
        name: 'People/User Profiles',
        actions: ['Active', 'All', 'OpenTasks', 'Revionsion', 'Commits', 'Browse', 'Search', 'Profile'],
        func: function(bar){
            bar.setItems(apps.people['actions']);
        }
    },
    projects: {
        name: 'Projects',
        actions: ['Joined', 'Active', 'All', 'Un/Join', 'Search', 'Profile'],
        func: function(bar){
            bar.setItems(apps.projects['actions']);
        }
    },
    /*
project: {
name: 'Project',
parent: 'projects',
actions: ['Description', 'Workboard', 'Members', 'SubProjects', 'Manage', 'Task Order', 'Task Filter'],
func: function(bar){
bar.setItems(apps.project['actions']);
}
},
subprojects: {
name: 'SubProjects',
parent: 'projects',
actions: ['Create Milestone', 'Create Subproject', 'Flag For Later', 'Manage'],
func: function(bar){
bar.setItems(apps.subprojects['actions']);
}
},
*/
    profiles: {
        name: 'Phainein/Config',
        actions: ['Browse', 'Profiles', 'System'],
        func: function(bar){
            bar.setItems(apps.profiles['actions']);
        }
    }
};

function appsmap(item)
{
    ar = [];

    Object.keys(apps).forEach(function (key, index) {
        ar.push(apps[key][item]);
    });
    return ar;
}

function getMaxSideNameLen()
{
    var toolong=25;
    var maxlen=0;
    Object.keys(apps).forEach(function ( key, index) {
        var len = apps[key]['name'].length;
        if(len > maxlen) {
            maxlen=len;
        }
    });
    return maxlen > toolong ? toolong : maxlen;
}

// program init/startup
function start(data, callback) {

    // area above menubar
    var actionBar = blessed.textarea({
        parent: screen,
        bg: 'none',
        fg: 'white',
        height: 1,
        width: data.sidew,
        top: 0,
        left: 0 ,
        value: "Phainein:"
    });

    //menubar at top
    var bar = blessed.listbar({
        parent: screen,
        mouse: true,
        //keys: true,
        Xkeys: true,
        vi: true,
        //shrinkBox: true,
        left: data.sidew,
        right: 0,
        top: 0,
        /*
           items: [
           'New',
           'Edit',
           'PreView',
           'Browse',
           'Search',
           'Profile'
           ],
           */
        items: [],
        style: {
bg: 'none',
    //fg: 'green',
    item: {
bg: 'none',
    //fg: 'white',
    fg: 'none',
    },
hover: {
bg: 'orange',
    fg: 'orange',
       },
focus: {
bg: 'none',
    fg: 'none',
       },
selected: {
              //bg: 'green',
bg: 'none',
    fg: 'none',
    //fg: 'white',
          },
prefix: {
            //bg: 'white',
bg: 'lightblack',
    //fg: 'black',
    fg: 'lightblack',
        }
        },
height: 1
    });

    // the menu on the side
    var side = blessed.list({
parent: screen,
mouse: true,
keys: true,
vi: true,
left: 0,
top: 2,
bottom: 0,
width: data.sidew,
align: 'left',
tags: true,
items: appsmap('name'),
style: {
fg: 'light-blue',
/*
   fg: function(el) {
   if (el.type === 'box' && el.parent.type === 'list') {
   var app = data._apps[el.parent.ritems.indexOf(el.content) - 1];
   if (!app) return 'light-blue';
   if (app.state === 'stopped') return 'black';
   if (app.state === 'started') return 'green';
   return -1;
   }
   return -1;
   },
   */
        selected: {
bg: 'blue'
        },
item: {
hover: {
bg: 'blue'
       }
      },
      /*
border: {
type: 'ascii',
fg: 'yellow',
bg: 'yellow'
}
*/
    }
});

// horizontal seperator line
var seph = blessed.line({
    parent: screen,
    orientation: 'horizontal',
    left: data.sidew,
    top: 1,
    left: 0,
    right: 0
});

// verticle seperator line
var sepv = blessed.line({
    parent: screen,
    orientation: 'vertical',
    left: data.sidew,
    top: 2,
    bottom: 0
});

// the main area
var mainw = blessed.scrollabletext({
    parent: screen,
    mouse: true,
    keys: true,
    vi: true,
    //shrinkBox: true,
    scrollbar: {
        ch: ' '
    },
    style: {
        scrollbar: {
            inverse: true
        }
    },
    tags: true,
    left: data.sidew + 1,
    top: 2,
    bottom: 0,
    right: 0
});

//seperator  bar color change on focus chage
//// side menue focus
screen.setEffects(sepv, side, 'focus', 'blur', { fg: 'green' });
screen.setEffects(seph, side, 'focus', 'blur', { fg: 'red' });
//// top bar 
screen.setEffects(sepv, bar, 'focus', 'blur', { fg: 'red' });
screen.setEffects(seph, bar, 'focus', 'blur', { fg: 'green' });
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
        case pwin.top:
            //bar.focus();
            if(prevSideEl != null) {
            bar.focus();
        }
        else {
            setWinFocus(pwin.side);
        }
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

/*
   bar.on('keypress', function(ch, key) {
   if (key.name === 'tab') {
   if (!key.shift) {
   bar.select(bar.selected-1);
   } else {
   bar.select(bar.selected+1);
   }
   return;
   }
   });
   */

bar.on('select', function(el) {
    console.log(bar.items.indexOf(el));

    //verify side menu object -and use to grab function
    //apps.prevSideEl               //?? how
});

var prevSideEl;
side.on('select', function(el) {

    bar.style.item['fg'] = 'white';
    bar.style.selected['bg'] = 'blue';
    bar.style.selected['fg'] = 'white';
    //bar.style.prefix['bg'] = 'white';
    bar.style.prefix['fg'] = 'white';

    appsmap('func')[side.items.indexOf(el)](bar);       //set the topbar fields
    el.style.fg = 'green';                              //set the current element  color

    if(prevSideEl != null && prevSideEl != el){
        prevSideEl.style.fg = 'light-blue';
    }

    prevSideEl = el;                                    //set the element index for later
    screen.render();                                    //render the screen

    pwin.last = pwin.top;
    curWin = pwin.top;
    bar.focus();                                        //set focus to the top bar menu
});

//if(bar.Xkeys) {
//alert("thing"); 
//console.log("thing");
//}

//bar.style.item['fg'] = 'white';
//console.log("thing: " +bar.options['Xkeys']);

if (bar.options['Xkeys']) {
    bar.on('keypress', function(ch, key) {
        if (key.name === 'left'
            || (bar.options['vi'] && key.name === 'h')
        //|| (key.shift && key.name === 'tab')
           ) {
               bar.moveLeft();
               screen.render();
               // Stop propagation if we're in a form.
               if (key.name === 'tab') return false;
               return;
           }
           if (key.name === 'right'
               || (bar.options['vi'] && key.name === 'l')
           //|| key.name === 'tab'
              ) {
                  bar.moveRight();
                  screen.render();
                  // Stop propagation if we're in a form.
                  if (key.name === 'tab') return false;
                  return;
              }
              if (key.name === 'enter'
                  || (bar.options['vi'] && key.name === 'k' && !key.shift)) {
                      bar.emit('action', bar.items[bar.selected], bar.selected);
                      bar.emit('select', bar.items[bar.selected], bar.selected);
                      var item = bar.items[bar.selected];
                      if (item._.cmd.callback) {
                          item._.cmd.callback();
                      }
                      screen.render();
                      return;
                  }
                  if (key.name === 'escape' || (bar.options['vi'] && key.name === 'q')) {
                      bar.emit('action');
                      bar.emit('cancel');
                      return;
                  }
    });
}


side.focus();
curWin=pwin.side;
//side.select(0);

screen.render();

}

/********* GLOBAL STUFF ***************/
/**************************************/
/**************************************/
// Quit on `q`, or `Control-C` when the focus is on the screen.
screen.key(['q', 'C-c'], function(ch, key) {  
    process.exit(0);
});
/**************************************/
/**************************************/
/**************************************/

function createScreen() {
    var global = blessed.Screen.global;
    var screen = blessed.Screen.global || blessed.screen({ tput: true });

    if (!global) {
        screen.program.key('C-c', function() {
            return process.exit(0);
        });
    }

    return screen;
}

function main(argv, callback) {
    var data = {};
    data.sidew = getMaxSideNameLen();   //side menu width
    data.numwnd = 3;                    //number of windows
    data.curwind = 1;                   //current window (starts at 1, screen === 0) 

    return start(data, function(err) {
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

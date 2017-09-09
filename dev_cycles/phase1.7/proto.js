// packages
var blessed = require('blessed'),
	contrib = require('blessed-contrib');

// app modules
var config = require('./config'),
	dirtree = require('./dirtree');
// panels
//var actionBar = require('./actionbar.js')

//global screen
var screen = blessed.screen();

//program window
var pwin ={};
pwin.mainw = 1;
pwin.side = 2;
pwin.menu = 3;
pwin.first = pwin.mainw;
pwin.last = pwin.top-1;

var curWin = 1;

function ActionBar(options) {

	//if (!(this instanceof blessed.textarea)) return new actionBar(options);

	// init
	var self = this;
	options = options || {};

	//defaults
	options.parent = screen;
	options.bg = 'none';
	options.fg = 'white';

	//replace
	options.height = 1;

	//overwrite defaults with passed in value
	this.options=options;

	//um, wtf
	//blessed.textarea.call(this, options);
	//Box.call(this, options);

	this.widget = blessed.textarea(this.options);
}

ActionBar.prototype.setvalue = function(str){
	this.options.value=str;
	this.widget.value=str;
	screen.render();
}


// program init/startup
function start(data, callback) {


	//menubar at top
	var menubar = blessed.listbar({
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
	// var side = blessed.list({
	var side = contrib.tree({
		parent: screen,
		mouse: true,
		keys: false,
		vi: true,
		left: 0,
		top: 2,
		bottom: 0,
		width: data.sidew,
		align: 'left',
		tags: true,
		//items: appsmap('name'),
		items: [],
		template: {
			lines: true,
		},
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
			case pwin.top:
				//bar.focus();
				if(prevSideEl != null) {
					menubar.focus();
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
   menubar.on('keypress', function(ch, key) {
   if (key.name === 'tab') {
   if (!key.shift) {
   menubar.select(bar.selected-1);
   } else {
   menubar.select(bar.selected+1);
   }
   return;
   }
   });
   */

	menubar.on('select', function(el) {
		console.log(bar.items.indexOf(el));

		//verify side menu object -and use to grab function
		//apps.prevSideEl               //?? how
	});

	var prevSideEl;
	side.on('select', function(el) {

		menubar.style.item['fg'] = 'white';
		menubar.style.selected['bg'] = 'blue';
		menubar.style.selected['fg'] = 'white';
		//bar.style.prefix['bg'] = 'white';
		menubar.style.prefix['fg'] = 'white';

		appsmap('func')[side.items.indexOf(el)](bar);       //set the topbar fields
		el.style.fg = 'yellow';                              //set the current element  color

		if(prevSideEl != null && prevSideEl != el){
			prevSideEl.style.fg = 'light-blue';
		}

		prevSideEl = el;                                    //set the element index for later
		screen.render();                                    //render the screen

		pwin.last = pwin.top;
		curWin = pwin.top;
		menubar.focus();                                        //set focus to the top menubar menu
	});

	//if(bar.Xkeys) {
	//alert("thing");
	//console.log("thing");
	//}

	//bar.style.item['fg'] = 'white';
	//console.log("thing: " +bar.options['Xkeys']);

	if (menubar.options['Xkeys']) {
		menubar.on('keypress', function(ch, key) {
			if (key.name === 'left'
				|| (bar.options['vi'] && key.name === 'h')
				//|| (key.shift && key.name === 'tab')
			) {
				menubar.moveLeft();
				screen.render();
				// Stop propagation if we're in a form.
				if (key.name === 'tab') return false;
				return;
			}
			if (key.name === 'right'
				|| (bar.options['vi'] && key.name === 'l')
				//|| key.name === 'tab'
			) {
				menubar.moveRight();
				screen.render();
				// Stop propagation if we're in a form.
				if (key.name === 'tab') return false;
				return;
			}
			if (key.name === 'enter'
				|| (bar.options['vi'] && key.name === 'k' && !key.shift)) {
				menubar.emit('action', menubar.items[bar.selected], menubar.selected);
				menubar.emit('select', menubar.items[bar.selected], menubar.selected);
				var item = menubar.items[bar.selected];
				if (item._.cmd.callback) {
					item._.cmd.callback();
				}
				screen.render();
				return;
			}
			if (key.name === 'escape' || (bar.options['vi'] && key.name === 'q')) {
				menubar.emit('action');
				menubar.emit('cancel');
				return;
			}
		});
	}


	//get config data
	config.fetch_config();

	// get the tree data
	side.setData(dirtree.dirTree(config.timetrap_config.tui_projects_template_path));

	side.focus();
	curWin=pwin.side;
	//side.select(0);

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

	var bar = new ActionBar(
		{
			width:25,
			top:0,
			left:0,
			value:"Timetrap TUI:"}
	);

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

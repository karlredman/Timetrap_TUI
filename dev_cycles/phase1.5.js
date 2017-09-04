"use strict";

var blessed = require('blessed'),
    contrib = require('blessed-contrib'),
  	Node = blessed.Node,
  	Box = blessed.Box,
    fs = require('fs'),
	util = require('util'),
    path = require('path'),
	yaml = require('js-yaml'),
	minimatch = require('minimatch');

// default config_file
var conf_file = process.env.HOME+"/.timetrap.yml";

// preference over default
if (process.env.TIMETRAP_CONFIG_FILE) {
	conf_file = process.env.TIMETRAP_CONFIG_FILE;
}

try {
	// get the config object
	var timetrap_config = yaml.safeLoad(fs.readFileSync(conf_file, 'utf8'));
	// console.log(timetrap_config);
} catch(e) {
	console.log(e);
	process.exit(1);
}

if (!timetrap_config.tui_projects_template_path){
	//set the default
	timetrap_config.tui_projects_template_path = process.env.HOME+"/.timetrap/tui_projects_template"
}

//create screen object
var screen = blessed.screen()

//create layout and widgets
var grid = new contrib.grid({rows: 1, cols: 2, screen: screen})

// monkeypatch contrib.tree constructor to change keyhandler

// save the original
var old_tree =  contrib.tree.prototype;

//function Tree(options) {
contrib.tree = function(options) {

  if (!(this instanceof Node)) return new contrib.tree(options);

  var self = this;
  options = options || {};
  options.bold = true;
  this.options = options;
  this.data = {};
  this.nodeLines = [];
  this.lineNbr = 0;
  Box.call(this, options);

  options.extended = options.extended || false;
  options.keys = options.keys || ['+', 'space', 'enter'];

  options.template = options.template || {};
  options.template.extend = options.template.extend || ' [+]';
  options.template.retract = options.template.retract || ' [-]';
  options.template.lines = options.template.lines || false;

  // Do not set height, since this create a bug where the first line is not always displayed
  this.rows = blessed.list({
    top: 1,
    width: 0,
    left: 1,
    style: options.style,
    padding: options.padding,
    keys: true,
    tags: options.tags,
    input: options.input,
    vi: options.vi,
    ignoreKeys: options.ignoreKeys,
    scrollable: options.scrollable,
    mouse: options.mouse,
    selectedBg: 'red',
  });

  this.append(this.rows);

  this.rows.key(options.keys, function() {
    var selectedNode = self.nodeLines[this.getItemIndex(this.selected)];
    // if (selectedNode.children) {
    //   selectedNode.extended = !selectedNode.extended;
    //   self.setData(self.data);
    //   self.screen.render();
    // }

    self.emit('select', selectedNode, this.getItemIndex(this.selected));
  });

  // this.rows.key(options.keys, function() {
  //   var selectedNode = self.nodeLines[this.getItemIndex(this.selected)];
  //   // if (selectedNode.children) {
  //   //   selectedNode.extended = !selectedNode.extended;
  //   //   self.setData(self.data);
  //   //   self.screen.render();
  //   // }

  //   self.emit('select', selectedNode, this.getItemIndex(this.selected));
  // });

};
contrib.tree.prototype = old_tree;

var tree =  grid.set(0, 0, 1, 1, contrib.tree,
    {
        style: {
        text: "red", fg: 'blue',
        selected: {
            bg: 'yellow', fg: 'white'
        }
    },
        // keys: ['+', 'space'],
        vi: true,
        template: { lines: true },
        label: 'Filesystem Tree'
    })


// //tree.rows.key = function(options_keys) {
// tree = function(options) {

//     this.rows.key(options.keys, function() {
//         var selectedNode = self.nodeLines[this.getItemIndex(this.selected)];
//         // if (selectedNode.children) {
//         //   selectedNode.extended = !selectedNode.extended;
//         //   self.setData(self.data);
//         //   self.screen.render();
//         // }

//         self.emit('select', selectedNode, this.getItemIndex(this.selected));
//     });
// };



// //contrib.tree.rows.key = function(options_keys, function() {
// this.tree.rows.key = function(options_keys){
//     var selectedNode = self.nodeLines[this.getItemIndex(this.selected)];
//     // if (selectedNode.children) {
//     //     selectedNode.extended = !selectedNode.extended;
//     //     self.setData(self.data);
//     //     self.screen.render();
//     // }

//     self.emit('select', selectedNode, this.getItemIndex(this.selected));
// };


var table =  grid.set(0, 1, 1, 1, contrib.table,
    {
        keys: true,
        fg: 'green',
        label: 'Informations',
        vi: true,
        columnWidth: [24, 10, 10]
    })


function dirTree(filename) {
	var stats = fs.lstatSync(filename);

	if (stats.isDirectory()) {

		if ( Array.isArray(timetrap_config.tui_skip_paths) ){
			var i, len = timetrap_config.tui_skip_paths.length;		//because of caching
			for ( i=0; i<len; ++i ) {
				var pattern = timetrap_config.tui_skip_paths[i];
				if( minimatch(filename, pattern, { matchBase: true})){
					return;
				}
			}
		}

		var info = {
			path: filename,
			rpath: filename.replace(timetrap_config.tui_projects_template_path+'/',''),
			name: path.basename(filename),
			type: "directory",
			extended: true
		};

		info.children = fs.readdirSync(filename).map(function(child) {
			//verify that a .timetrap-sheet file exists
			var timesheet_file = path.join(filename, ".timetrap-sheet");

			if ( ! fs.existsSync(timesheet_file) || timetrap_config.tui_recreate_sheets ) {

				if ( timetrap_config.tui_create_missing_sheets || timetrap_config.tui_recreate_sheets ){
					//file doesn't exist. attempt to creat it.

					var timesheet_content = info.rpath.replace(/\//g,'.');

					// console.log("creating file: "+timesheet_file);
					// console.log("setting content: "+timesheet_content);

					fs.open(timesheet_file, 'wx', (err, fd) => {
						if (err) {
							if (err.code === 'EEXIST') {
								//somehow it was created between calls... just return
								return;
							}

							//derp, something else
							throw err;
						}

						fs.writeSync(fd, timesheet_content, 0, timesheet_content.length, null,
							function(err) {
								if (err) throw 'error writing file: ' + err;
							});
						fs.close(fd);
					});
					return dirTree(filename + '/' + child);
				}
				else{
					//return undefined and ignore the record
					return;
				}
			}
			else {
				//create a .timetrap-sheet file if configured
				if( timetrap_config.tui_create_missing_sheets ) {
					// create sheet in dir
					return dirTree(filename + '/' + child);
				}
				else {
					//return undefined and ignore the record
					return;
				}

			}
		});

		// we're not returning file finds so we have undefined littered about
		// remove them...
		info.children = info.children.filter(function(item){
			return typeof item !== 'undefined';
		});
	}
	// else {
	// info.type = "file";
	// }

	return info;
}

// tree.setData(test3);
tree.setData(dirTree(timetrap_config.tui_projects_template_path));

// Handling select event. Every custom property that was added to node is
// available like the "node.getPath" defined above
tree.on('select',function(node){
    //var path = node.getPath(node);
    var path = node.path;
    var data = [];

    // The filesystem root return an empty string as a base case
    if ( path == '')
        path = '/';

    // Add data to right array
    data.push([path]);
    data.push(['']);
    try {
        // Add results
        var stat = fs.lstatSync(path);
		if ( stat.isDirectory() ){
			data = data.concat(JSON.stringify(fs.lstatSync(path),null,2).split("\n").map(function(e){return [e]}));
		}
        //console.log(tree.options.vi)
        // tree.options.fg = "yellow";
        // tree.options.vi=false;

        table.setData({headers: ['Info'], data: data});
    }catch(e){
        table.setData({headers: ['Info'], data: [[e.toString()]]});
    }

    screen.render();
});

//set default table
table.setData({headers: ['Info'], data: [[]]})

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

screen.key(['tab'], function(ch, key) {
    if(screen.focused == tree.rows)
        table.focus();
    else
        tree.focus();
});

tree.focus()
screen.render()

//################################################


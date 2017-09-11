"use strict";

// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    Node = blessed.Node,
    Box = blessed.Box,
    fs = require('fs');

//debugging
var util = require('util');


//local includes
var config = require('./config.js')
var dirtree = require('./dirtree.js')

// tree item that is selected
var tree_item_selected_idx;

//get config data
config.fetch_config();

//create screen object
var screen = blessed.screen({mouse: true, sendFocus: true})
screen.enableMouse([]);

//create layout and widgets
var grid = new contrib.grid({rows: 1, cols: 2, screen: screen, mouse: true, sendFocus: true})

var tree =  grid.set(0, 0, 1, 1, contrib.tree,
    {
        style: {
            text: "red",
            fg: config.timetrap_config.tui_fg,
            bg: config.timetrap_config.tui_bg,
            selected: {
                bg: config.timetrap_config.tui_hl_bg,
                //fg: config.timetrap_config.tui_hl_fg,
                bold: config.timetrap_config.tui_hl_bold,
            }
        },
		mouse: true,
        tags: true,
        keys: ['mouse', 'click', 'space'],       //prevent expand / collapse
        vi: config.timetrap_config.tui_vi_keys,
        template: {
            lines: true,
            extend: ' ',
            retract: ' ',
        },
        label: 'Filesystem Tree'
    });

var table =  grid.set(0, 1, 1, 1, contrib.table,
    {
        keys: true,
        fg: 'green',
        label: 'Informations',
        vi: true,
		mouse: true,
        //columnWidth: [24, 10, 10]
        columnWidth: [100, 10, 10]
    })



// tree.setData(test3);
tree.setData(dirtree.dirTree(config.timetrap_config.tui_projects_template_path));

function set_tree_item_selected(){

    var child;

    // restore old item
    if( typeof tree_item_selected_idx != 'undefined' ){
        child = tree.rows.items[tree_item_selected_idx];
        if ( tree_item_selected_idx == tree.rows.getItemIndex(tree.rows.selected) ){
            child.style.fg = config.timetrap_config.tui_hl_fg;
        }
        else{
            child.style.fg = config.timetrap_config.tui_fg;
        }
    }

    // set new selection
    tree_item_selected_idx = tree.rows.getItemIndex(tree.rows.selected);
    child = tree.rows.items[tree_item_selected_idx];
    //child.style.fg = config.timetrap_config.tui_active_fg;

    // testing idea of reworking the colors
    var blech = child.getContent();
    var part = blech.substring(0,3);

    // this is a test to prove that collapse/expand rereads the data object and not the content (resets the tree contents)
    // will have to walk the json to find the data if we want to change it (or not allow collapse / expand)
    child.setContent(part+"{red-fg}"+blech.substring(3,blech.length-1)+"{/red-fg}"+"*");


    // this what the parameter would look like in code
    // child.setContent(part+"{"+config.timetrap_config.tui_active_fg+"-fg}"+blech(3,blech.length-1)+"{/"+config.timetrap_config.tui_active_fg+"-fg}"+"*");

    //set_selected_hl();
    screen.render();
}

function set_selected_hl(){
    if( typeof tree_item_selected_idx != 'undefined' ){
        var child = tree.rows.items[tree_item_selected_idx];
        if ( tree_item_selected_idx == tree.rows.getItemIndex(tree.rows.selected) ){
            child.style.fg = config.timetrap_config.tui_active_hl_fg;
        }
        else{
            child.style.fg = config.timetrap_config.tui_active_fg;
        }
        screen.render();
    }
}

// tree.rows.on('element click', function(mouse) {
// 	console.log("got here: #############################################");
//   Box.setContent('You clicked ' + mouse.x + ', ' + mouse.y + '.');
//   screen.render();
// });

tree.on('element click', function(node) {
    var selectedNode = tree.nodeLines[tree.rows.getItemIndex(tree.rows.selected)];
    //console.log("got here: #############################################");
	tree.focus();
    tree_item_selected_idx = tree.rows.getItemIndex(tree.rows.selected);
    var child = tree.rows.items[tree_item_selected_idx];
	if (child === node) {
		tree.emit('action', selectedNode, tree.rows.getItemIndex(tree.rows.selected));
		tree.emit('select', selectedNode, tree.rows.getItemIndex(tree.rows.selected));
		return;
	}
	// self.select(item);
	set_selected_hl()
	self.screen.render();
});


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
            set_tree_item_selected();
        }
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

tree.rows.key(['enter'], function(ch, key) {
    var selectedNode = tree.nodeLines[tree.rows.getItemIndex(tree.rows.selected)];
    //selectedNode.style.fg = 'green';                              //set the current element  color
    tree.emit('action', selectedNode, tree.rows.getItemIndex(tree.rows.selected));
    tree.emit('select', selectedNode, tree.rows.getItemIndex(tree.rows.selected));
});


var old_blessed_list_up = blessed.List.prototype.up;
blessed.List.prototype.up = function(offset) {
    this.move(-(offset || 1));
    set_selected_hl();
};

var old_blessed_list_up = blessed.List.prototype.up;
blessed.List.prototype.down = function(offset) {
    this.move(+(offset || 1));
    set_selected_hl();
};

tree.focus()
screen.render()

//################################################


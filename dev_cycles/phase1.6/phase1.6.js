"use strict";

// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib'),
  	Node = blessed.Node,
  	Box = blessed.Box,
    fs = require('fs'),
	util = require('util'),
    path = require('path'),
	yaml = require('js-yaml'),
	minimatch = require('minimatch');

//local includes
var config = require('./config.js')
var dirtree = require('./dirtree.js')
//var tree_monkey = require('./tree_monkey.js')

// tree item that is selected
var tree_item_selected_idx;

//create screen object
var screen = blessed.screen()

//create layout and widgets
var grid = new contrib.grid({rows: 1, cols: 2, screen: screen})

var tree =  grid.set(0, 0, 1, 1, contrib.tree,
    {
        style: {
        text: "red", fg: 'white', bg: 'red',
        selected: {
            bg: 'yellow', fg: 'black'
        }
    },
        keys: ['+', 'space'],
        vi: true,
        template: { lines: true },
        label: 'Filesystem Tree'
    })


var table =  grid.set(0, 1, 1, 1, contrib.table,
    {
        keys: true,
        fg: 'green',
        label: 'Informations',
        vi: true,
        //columnWidth: [24, 10, 10]
        columnWidth: [100, 10, 10]
    })



//get config data
config.fetch_config();

// tree.setData(test3);
tree.setData(dirtree.dirTree(config.timetrap_config.tui_projects_template_path));

function set_tree_item_selected(){
    // restore old item
    if( typeof tree_item_selected_idx != 'undefined' ){
        var child = tree.rows.items[tree_item_selected_idx];
        child.style.fg = "white";
    }

    // set new selection
    var i = tree.rows.getItemIndex(tree.rows.selected);
    tree_item_selected_idx = i;
    var child = tree.rows.items[i];
    child.style.fg = "green";
}

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

            //var inspect = tree.nodeLines[tree.rows.getItemIndex(tree.rows.selected)];
            //var inspect = node;
            //data = util.inspect(inspect,false,null).split("\n").map(function(e){return [e]});
		}
        table.setData({headers: ['Info'], data: data});
    }catch(e){
        table.setData({headers: ['Info'], data: [[e.toString()]]});
    }

    //set's the bar to blue if something has been selected
    tree.rows.style.selected.bg = 'blue';                              //set the current element  color
    tree.rows.style.selected.fg = 'white';                              //set the current element  color

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

tree.focus()
screen.render()

//################################################


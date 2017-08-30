var blessed = require('blessed')
  , contrib = require('blessed-contrib')
  // , contrib = require('../index')
  , fs = require('fs')
  , path = require('path')

var screen = blessed.screen()

//create layout and widgets
var grid = new contrib.grid({rows: 1, cols: 2, screen: screen})

var tree =  grid.set(0, 0, 1, 1, contrib.tree,
    { style: {
        text: "red", fg: 'blue',
        selected: {
            bg: 'yellow', fg: 'white'
        }
    }
  , vi: true
  , template: { lines: true }
  , label: 'Filesystem Tree'
    })

//tree.instance.options.selectedBg = 'yellow'

var table =  grid.set(0, 1, 1, 1, contrib.table,
  { keys: true
  , fg: 'green'
  , label: 'Informations'
  , columnWidth: [24, 10, 10]})

var start_path = '/home/karl/timetrap'

//file explorer
// var explorer = { name: '/'
var explorer = { name: start_path
  , extended: true
  // Custom function used to recursively determine the node path
  , getPath: function(self){
      // If we don't have any parent, we are at tree root, so return the base case
      if(! self.parent)
        // return '';
        return start_path;
      // Get the parent node path and add this node name
      return self.parent.getPath(self.parent)+'/'+self.name;
    }
  // Child generation function
  , children: function(self){
      var result = {};
      var selfPath = self.getPath(self);
      try {
        // List files in this directory
        var children = fs.readdirSync(selfPath+'/');

        // childrenContent is a property filled with self.children() result
        // on tree generation (tree.setData() call)
        if (!self.childrenContent) {
          for(var child in children){
            child = children[child];
            var completePath = selfPath+'/'+child;
            if( fs.lstatSync(completePath).isDirectory() ){
              // If it's a directory we generate the child with the children generation function
              result[child] = { name: child, getPath: self.getPath, extended: true, children: self.children };
            }else{
              // Otherwise children is not set (you can also set it to "{}" or "null" if you want)
              // result[child] = { name: child, getPath: self.getPath, extended: false };
                //add path to array?
                //create .timetrap-sheet if not exist?
                // if ( child.match(/.timetrap-sheet/) ) {
                //     // result[child] = { name: 'thing', getPath: self.getPath, extended: false };
                //     result[child] = { name: child, getPath: self.getPath, extended: true };
                //     //console.log("xxxxxx\n");
                //     //set something to perform other operations
                // }
                ;
            }
          }
        }else{
          result = self.childrenContent;
        }
      } catch (e){}
      return result;
    }
}

//set tree
tree.setData(explorer);


// Handling select event. Every custom property that was added to node is
// available like the "node.getPath" defined above
tree.on('select',function(node){
  var path = node.getPath(node);
  var data = [];

  // The filesystem root return an empty string as a base case
  if ( path == '')
    path = '/';

  // Add data to right array
  data.push([path]);
  data.push(['']);
  try {
    // Add results
    data = data.concat(JSON.stringify(fs.lstatSync(path),null,2).split("\n").map(function(e){return [e]}));
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

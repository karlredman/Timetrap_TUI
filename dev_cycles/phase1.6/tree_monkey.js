var blessed = require('blessed'),
    contrib = require('blessed-contrib'),
  	Node = blessed.Node,
  	Box = blessed.Box;

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
    if (selectedNode.children) {
      selectedNode.extended = !selectedNode.extended;
      self.setData(self.data);
      self.screen.render();
    }

    // self.emit('select', selectedNode, this.getItemIndex(this.selected));
  });
};
contrib.tree.prototype = old_tree;

// monkeypatch tree.walk to allow for custom fg of selected item
var old_tree_walk = contrib.tree.walk;
contrib.tree.walk = function(node, treeDepth){

    //call the original function
    var ret = old_tree_walk.apply(node, treeDepth);

    // TODO: needs a handler to manage when trees collaps
    // might be solved temporarily by just not allowing the tree to collapse

    //set the fg color if we didn't just collapse the position
    //not sure how to do that yet.
    if( typeof tree_item_selected_idx != 'undefined' ){
        var child = tree.rows.items[tree_item_selected_idx];
        child.style.fg = "white";
    }
    screen.render();
    return ret;
}


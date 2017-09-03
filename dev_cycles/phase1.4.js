var blessed = require('blessed')
    contrib = require('blessed-contrib'),
    fs = require('fs'),
	util = require('util'),
    path = require('path');

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
        , vi: true
        , columnWidth: [24, 10, 10]})

var start_path = '/home/karl/timetrap_projects'

//file explorer
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
                        // skip directories in our exclude list
						var exclude_dirs = ["/home/karl/timetrap/Projects/SKIP_THIS_DIR",
							"/home/karl/timetrap/Personal/SKIP_THIS_DIR_a"];

						// see if there is a .timetrap-sheet file and create one if not

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

var test1 =
	{
	name: 'test1 projects thing',
	extended: true,
	path: '/home/karl/timetrap_projects/',
		name: 'timetrap_projects',
		type: 'folder',
		children:
		[ { path: '/home/karl/timetrap_projects//Personal',
			name: 'Personal',
			type: 'folder',
			children:
			[ { path: '/home/karl/timetrap_projects//Personal/.timetrap-sheet',
				name: '.timetrap-sheet' },
				{ path: '/home/karl/timetrap_projects//Personal/Computer',
					name: 'Computer',
					type: 'folder',
					children:
					[ { path: '/home/karl/timetrap_projects//Personal/Computer/.timetrap-sheet',
						name: '.timetrap-sheet' },
						{ path: '/home/karl/timetrap_projects//Personal/Computer/Administration',
							name: 'Administration',
							type: 'folder',
							children:
							[ { path: '/home/karl/timetrap_projects//Personal/Computer/Administration/.timetrap-sheet',
								name: '.timetrap-sheet' } ] } ] },
				{ path: '/home/karl/timetrap_projects//Personal/SKIP_THIS_DIR_a',
					name: 'SKIP_THIS_DIR_a',
					type: 'folder',
					children:
					[ { path: '/home/karl/timetrap_projects//Personal/SKIP_THIS_DIR_a/.timetrap.sheet',
						name: '.timetrap.sheet' } ] },
				{ path: '/home/karl/timetrap_projects//Personal/skip_this_file_x',
					name: 'skip_this_file_x' } ] },
			{ path: '/home/karl/timetrap_projects//Projects',
				name: 'Projects',
				type: 'folder',
				children:
				[ { path: '/home/karl/timetrap_projects//Projects/.timetrap-sheet',
					name: '.timetrap-sheet' },
					{ path: '/home/karl/timetrap_projects//Projects/SKIP_THIS_DIR',
						name: 'SKIP_THIS_DIR',
						type: 'folder',
						children:
						[ { path: '/home/karl/timetrap_projects//Projects/SKIP_THIS_DIR/.timetrap.sheet',
							name: '.timetrap.sheet' } ] },
					{ path: '/home/karl/timetrap_projects//Projects/Timetrap_TUI',
						name: 'Timetrap_TUI',
						type: 'folder',
						children:
						[ { path: '/home/karl/timetrap_projects//Projects/Timetrap_TUI/.timetrap-sheet',
							name: '.timetrap-sheet' },
							{ path: '/home/karl/timetrap_projects//Projects/Timetrap_TUI/.timetrap-sheet~',
								name: '.timetrap-sheet~' } ] },
					{ path: '/home/karl/timetrap_projects//Projects/Vimwiki_Gollum',
						name: 'Vimwiki_Gollum',
						type: 'folder',
						children:
						[ { path: '/home/karl/timetrap_projects//Projects/Vimwiki_Gollum/.timetrap-sheet',
							name: '.timetrap-sheet' } ] },
					{ path: '/home/karl/timetrap_projects//Projects/skip_this_file',
						name: 'skip_this_file' } ] } ] }


function dirTree(filename) {
    var stats = fs.lstatSync(filename);


    if (stats.isDirectory()) {

        // TODO: skip dirs in exclusion list


        // TODO: check to see if dir has .timetrap-sheet and create one if it doesn't exist

        var info = {
            path: filename,
            name: path.basename(filename),
            type: "directory"
        };

        //next iteration
        info.children = fs.readdirSync(filename).map(function(child) {
            return dirTree(filename + '/' + child);
        });
    }
    // else {
    //     // Assuming it's a file. In real life it could be a symlink or
    //     // something else!
    //     //info.type = "file";
    // }

    return info;
}

//set tree
tree.setData(util.inspect(dirTree("/home/karl/timetrap_projects"), false, null));
tree.setData(test1);
//tree.setData(explorer);


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

var fs = require('fs'),
    util = require('util')
    path = require('path');

function dirTree(filename) {
    var stats = fs.lstatSync(filename);
	var info = {
		path: filename,
		name: path.basename(filename)
	};

    if (stats.isDirectory()) {
        info.type = "directory";
		info.extended = true;

		info.children = fs.readdirSync(filename).map(function(child) {
				return dirTree(filename + '/' + child);
		});

        // info.children = info.children.filter(function(item){
        //     return typeof item !== 'undefined';
        // });

    }
	// else {
        // // Assuming it's a file. In real life it could be a symlink or
        // // something else!
        // info.type = "file";
    // }


    return info;
}

if (module.parent == undefined) {
    // node dirTree.js ~/foo/bar
    var arr = dirTree(process.argv[2]);
    console.log(arr, false, null);
    //console.log(util.inspect(dirTree(process.argv[2]), false, null));
}

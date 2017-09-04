var fs = require('fs'),
    path = require('path')

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
    }
	else {
        // Assuming it's a file. In real life it could be a symlink or
        // something else!
        info.type = "file";
    }

    return info;
}

if (module.parent == undefined) {
    // node dirTree.js ~/foo/bar
    var util = require('util');
    console.log(util.inspect(dirTree(process.argv[2]), false, null));
}

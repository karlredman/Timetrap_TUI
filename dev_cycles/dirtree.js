var fs = require('fs'),
    util = require('util'),
    path = require('path');

function dirTree(filename) {
    var stats = fs.lstatSync(filename);

	var info = {
		extended: true,
		path: filename,
		name: path.basename(filename),
	};


    if (stats.isDirectory()) {

        // TODO: skip dirs in exclusion list


        // TODO: check to see if dir has .timetrap-sheet and create one if it doesn't exist

		type: "directory"

        //next iteration
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


function mytree(filename) {

	var stats = fs.lstatSync(filename);
	if( stats.isDirectory() ) {

		var info = {};
		var dir_found = false;

		info["extended"] = true;
		info["path"] = filename;
		info["name"] = path.basename(filename);

		// var c1 = fs.readdirSync(filename);
		var c1 = fs.readdirSync(filename).map(function(child) {
			var cstats = fs.lstatSync(filename + '/' + child);
			if( cstats.isDirectory() ) {
				dir_found = true;
				return mytree(filename + '/' + child);
			}
			else {
				return;
			}
		});


		if( dir_found ){
			console.log("#################################\n"+util.inspect(c1, false, null));
			//console.log("#################################\n"+JSON.stringify(c1, null, 2));
			//info["children"] = c1;
		}
		return info;
	}
}


if (module.parent == undefined) {
    // node dirTree.js ~/foo/bar
    //console.log(util.inspect(dirTree(process.argv[2]), false, null));
    //console.log(JSON.stringify(dirTree(process.argv[2]), null, 4));

    //console.log(util.inspect(mytree(process.argv[2]), false, null));
	console.log("----------------------------------");
    mytree(process.argv[2]);
}
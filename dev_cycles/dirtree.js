var fs = require('fs'),
    path = require('path');

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

if (module.parent == undefined) {
    // node dirTree.js ~/foo/bar
    var util = require('util');
    console.log(util.inspect(dirTree(process.argv[2]), false, null));
}

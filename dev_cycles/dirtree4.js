"use strict";
var fs = require('fs'),
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
    console.log(timetrap_config);
} catch(e) {
    console.log(e);
    process.exit(1);
}

if (!timetrap_config.tui_projects_template_path){
    //set the default
    timetrap_config.tui_projects_template_path = process.env.HOME+"/.timetrap/tui_projects_template"
}



function dirTree(filename) {
	var stats = fs.lstatSync(filename);

    if (stats.isDirectory()) {

		// if ( path.basename(filename) == "SKIP_THIS_DIR_a") {
		// 	return;
		// }

		var name = filename;
		var pattern = 'SKIP_THIS_DIR*';

		//timetrap_config.tui_skip_dirs_regex)
		if( minimatch(name, pattern, { matchBase: true})){
			return;
		}


		var info = {
			path: filename,
			name: path.basename(filename),
			// type: "directory",
			// extended: true
		};

        info.type = "directory";
		info.extended = true;

		info.children = fs.readdirSync(filename).map(function(child) {
				return dirTree(filename + '/' + child);
		});

		// we're not returning file finds so we have undefined littered about
		// remove them...
		info.children = info.children.filter(function(item){
			return typeof item !== 'undefined';
		});
    }
	// else {
        // Assuming it's a file. In real life it could be a symlink or
        // something else!
        // info.type = "file";
    // }

    return info;
}

if (module.parent == undefined) {
    // node dirTree.js ~/foo/bar
    var util = require('util');
    console.log(util.inspect(dirTree(timetrap_config.tui_projects_template_path), false, null));

}

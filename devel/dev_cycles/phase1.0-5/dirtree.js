"use strict";
var fs = require('fs'),
	path = require('path'),
	util = require('util'),
	yaml = require('js-yaml'),
	minimatch = require('minimatch');
require(.)

// default config_file
var conf_file = process.env.HOME+"/.timetrap.yml";


// preference over default
if (process.env.TIMETRAP_CONFIG_FILE) {
	conf_file = process.env.TIMETRAP_CONFIG_FILE;
}

try {
	// get the config object
	var timetrap_config = yaml.safeLoad(fs.readFileSync(conf_file, 'utf8'));
	// console.log(timetrap_config);
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

		if ( Array.isArray(timetrap_config.tui_skip_paths) ){
			var i, len = timetrap_config.tui_skip_paths.length;		//because of caching
			for ( i=0; i<len; ++i ) {
				var pattern = timetrap_config.tui_skip_paths[i];
				if( minimatch(filename, pattern, { matchBase: true})){
					return;
				}
			}
		}

		var info = {
			path: filename,
			rpath: filename.replace(timetrap_config.tui_projects_template_path+'/',''),
			name: path.basename(filename),
			type: "directory",
			extended: true
		};

		info.children = fs.readdirSync(filename).map(function(child) {
			//verify that a .timetrap-sheet file exists
			var timesheet_file = path.join(filename, ".timetrap-sheet");

			if ( ! fs.existsSync(timesheet_file) || timetrap_config.tui_recreate_sheets ) {

				if ( timetrap_config.tui_create_missing_sheets || timetrap_config.tui_recreate_sheets ){
					//file doesn't exist. attempt to creat it.

					var timesheet_content = info.rpath.replace(/\//g,'.');

					// console.log("creating file: "+timesheet_file);
					// console.log("setting content: "+timesheet_content);

					fs.open(timesheet_file, 'wx', (err, fd) => {
						if (err) {
							if (err.code === 'EEXIST') {
								//somehow it was created between calls... just return
								return;
							}

							//derp, something else
							throw err;
						}

						fs.writeSync(fd, timesheet_content, 0, timesheet_content.length, null,
							function(err) {
								if (err) throw 'error writing file: ' + err;
							});
						fs.close(fd);
					});
					return dirTree(filename + '/' + child);
				}
				else{
					//return undefined and ignore the record
					return;
				}
			}
			else {
				//create a .timetrap-sheet file if configured
				if( timetrap_config.tui_create_missing_sheets ) {
					// create sheet in dir
					return dirTree(filename + '/' + child);
				}
				else {
					//return undefined and ignore the record
					return;
				}

			}
		});

		// we're not returning file finds so we have undefined littered about
		// remove them...
		info.children = info.children.filter(function(item){
			return typeof item !== 'undefined';
		});
	}
	// else {
	// info.type = "file";
	// }

	return info;
}

if (module.parent == undefined) {
	// node dirTree.js ~/foo/bar
	console.log(util.inspect(dirTree(timetrap_config.tui_projects_template_path), false, null));
	//dirTree(timetrap_config.tui_projects_template_path);

}

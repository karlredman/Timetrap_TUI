"use strict";
var fs = require('fs'),
    util = require('util'),
    path = require('path'),
    yaml = require('js-yaml'),
    minimatch = require('minimatch');
var config = require('./config.js');

function dirTree(filename) {
    var stats = fs.lstatSync(filename);

    if (stats.isDirectory()) {

        if ( Array.isArray(config.timetrap_config.tui_skip_paths) ){
            var i, len = config.timetrap_config.tui_skip_paths.length;		//because of caching
            for ( i=0; i<len; ++i ) {
                var pattern = config.timetrap_config.tui_skip_paths[i];
                if( minimatch(filename, pattern, { matchBase: true})){
                    return;
                }
            }
        }

        var info = {
            path: filename,
            rpath: filename.replace(config.timetrap_config.tui_projects_template_path+'/',''),
            name: path.basename(filename),
            type: "directory",
            extended: true
        };

        info.children = fs.readdirSync(filename).map(function(child) {
            //verify that a .timetrap-sheet file exists
            var timesheet_file = path.join(filename, ".timetrap-sheet");

            if ( ! fs.existsSync(timesheet_file) || config.timetrap_config.tui_recreate_sheets ) {

                if ( config.timetrap_config.tui_create_missing_sheets || config.timetrap_config.tui_recreate_sheets ){
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
                if( config.timetrap_config.tui_create_missing_sheets ) {
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

exports.dirTree = dirTree;

"use strict";
var fs = require('fs'),
    util = require('util'),
    path = require('path'),
    yaml = require('js-yaml'),
    minimatch = require('minimatch');

function DirTree(config){
    this.config = config;
}

DirTree.prototype.fetch = function(filename) {
    let self=this;

    let stats = fs.lstatSync(filename);

    if (stats.isDirectory()) {

        if ( Array.isArray(this.config.timetrap_config.tui_skip_paths) ){
            //the setting is required to be an array
            let i, len = this.config.timetrap_config.tui_skip_paths.length;
            for ( i=0; i<len; ++i ) {
                let pattern = this.config.timetrap_config.tui_skip_paths[i];
                if( minimatch(filename, pattern, { matchBase: true})){
                    //filename is in the skip list
                    return;
                }
            }
        }

        //our base info
        var info = {
            path: filename,
            rpath: filename.replace(this.config.timetrap_config.tui_projects_template_path+'/',''),
            name: path.basename(filename),
            type: "directory",
            extended: true
        };

        info.children = fs.readdirSync(filename).map(function(child) {
            //verify that a .timetrap-sheet file exists
            let timesheet_file = path.join(filename, ".timetrap-sheet");


            if ( (! fs.existsSync(timesheet_file)) || self.config.timetrap_config.tui_recreate_sheets ) {

                if ( self.config.timetrap_config.tui_create_missing_sheets || self.config.timetrap_config.tui_recreate_sheets ){


                    //file doesn't exist. attempt to creat it.

                    let timesheet_content = info.rpath.replace(/\//g,'.');

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
                    info.sheet = timesheet_content;
                    console.log("sheet: "+info.sheet);
                    return self.fetch(filename + '/' + child);
                }
                else{
                    //return undefined and ignore the record
					console.log("############## file not found got here ##################");
                    return undefined;
                }
            }
            else {
                // timesheet_file exists

                // read and save contents
				self.get_line(timesheet_file, 0, function(err, line){
					info.sheet = line;
                    //console.log("############################ "+line+" ###########################################################################################");
				})

                // next iteration
                return self.fetch(filename + '/' + child);
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

	if( typeof info !== 'undefined' ){
		return info;
	}
	else {
		return undefined;
	}
}

//shamelessly stolen from
//[node.js - Read Nth line of file in NodeJS - Stack Overflow](https://stackoverflow.com/questions/6394951/read-nth-line-of-file-in-nodejs)
DirTree.prototype.get_line = function(filename, line_no, callback) {
    var data = fs.readFileSync(filename, 'utf8');
    var lines = data.split("\n");

    if(+line_no > lines.length){
      throw new Error('File end reached without finding line');
    }
    callback(null, lines[+line_no]);
}



DirTree.prototype.getMaxSideNameLen = function()
{
    // var toolong=25;
    // var maxlen=0;
    // Object.keys(apps).forEach(function ( key, index) {
    //     var len = apps[key]['name'].length;
    //     if(len > maxlen) {
    //         maxlen=len;
    //     }
    // });
    // return maxlen > toolong ? toolong : maxlen;
    return 25;
}

DirTree.prototype.type = 'DirTree';
module.exports = DirTree;

"use strict";
var fs = require('fs'),
    util = require('util'),
    path = require('path'),
    yaml = require('js-yaml'),
    minimatch = require('minimatch');

function DirTree(config){
    this.config = config;
    this.max_name_length=0;
    this.data;
    this.depth_adjustment = 0;
    this.max_depth = 0;
}

DirTree.prototype.walk = function(dir) {
    let _this=this;
    let local_depth = 0;

    let stats = fs.lstatSync(dir);
    if (stats.isDirectory()) {
        if ( Array.isArray(this.config.timetrap_config.tui_skip_paths.value) ){
            //the setting is required to be an array
            let i, len = this.config.timetrap_config.tui_skip_paths.value.length;
            for ( i=0; i<len; ++i ) {
                let pattern = this.config.timetrap_config.tui_skip_paths.value[i];
                if( minimatch(dir, pattern, { matchBase: true})){
                    //filename is in the skip list
                    return;
                }
            }
        }

        let timesheet_file = path.join(dir, ".timetrap-sheet");
        let sheet = _this.getSheet(timesheet_file);

        let info = {
            path: dir,
            rpath: dir.replace(this.config.timetrap_config.tui_projects_template_path.value+'/',''),
            name: path.basename(dir),
            type: "directory",
            extended: true
        };

        if ( sheet != null ) {

            // append info.sheet
            info.sheet = sheet;

            info.children = fs.readdirSync(dir).map(function(child){

                if(local_depth > _this.max_depth){
                    _this.max_depth++;
                }
                local_depth++;
                return _this.walk(path.join(dir,child));
            });

            // get rid of undefined entries
            info.children = info.children.filter(function(item){
                return typeof item !== 'undefined';
            });
            this.genMaxNameLen(info.name.length);
            return info;
        }
        else {

            info.children = fs.readdirSync(dir).map(function(child){

                let stats = fs.lstatSync(path.join(dir,child));
                if (stats.isDirectory()) {
                    return _this.walk(path.join(dir,child));
                }
                else {
                    return undefined;
                }
            });

            // get rid of undefined entries
            info.children = info.children.filter(function(item){
                return typeof item !== 'undefined';
            });

            if ( info.children.length != 0 ){
                //we have children with sheets
                this.genMaxNameLen(info.name.length);
                return info;
            }
            else {
                //this directory doesn't have children that recursively
                // contain a sheet somewhere
                return undefined;
            }
        }
    }
    //it's not a directory so punt
    return undefined;
}

DirTree.prototype.getSheet = function(filename) {
    // get a sheet (first line of file):
    // return null if sheet does not exist or is empty

    let returnval = null;
    if(fs.existsSync(filename)){
        this.get_line(filename, 0, function(err, line){
            returnval = line;
        })
    }
    return returnval;
}

//shamelessly stolen from
//[node.js - Read Nth line of file in NodeJS - Stack Overflow] \
//(https://stackoverflow.com/questions/6394951/read-nth-line-of-file-in-nodejs)
DirTree.prototype.get_line = function(filename, line_no, callback) {
    let data = fs.readFileSync(filename, 'utf8');
    let lines = data.split("\n");

    if(+line_no > lines.length){
        throw new Error('File end reached without finding line');
    }
    callback(null, lines[+line_no]);
}

DirTree.prototype.fetch = function(dir) {
    //TODO:
    //I'm weary about keeping the data in this object,
    // might have to restrict hiarchy a bit more in tree
    this.data = this.walk(dir);
    return this.data;
}


//DirTree.prototype.genMaxNameLen = function(len, depth) {
DirTree.prototype.genMaxNameLen = function(len) {

    let _this=this;

    //TODO: move these calculations - add depth adjustment to tree / sidebar width calc.
    let tree_toggle_indicator_width = 3;
    let depth_char_width = 2;
    _this.depth_adjustment = (depth_char_width*_this.max_depth) + tree_toggle_indicator_width;
    if(this.max_name_length < (len + _this.depth_adjustment )){
    // if(this.max_name_length < len) {
        this.max_name_length = 1+len;
    }
}

// xxxxxxxxx
// xxxxx│x└┬somereallylongprojectname [-]xx
// somereallylongprojectname

DirTree.prototype.getMaxSideNameLen = function()
{
    let _this=this;
    //TODO: this needs more work -the tree widget needs a viewport probably
    return 40;

    return this.max_name_length+_this.depth_adjustment

    let active_indicator = 1;
    return this.max_name_length+_this.depth_adjustment+active_indicator;
}

DirTree.prototype.register_actions = function(view){

	this.view = view;

    // this.on('thing', function(node) {
		// console.log("workspace thing received");
    //     this.setContent("thing: "+view.dirtree.max_depth)
    //     this.screen.render();
	// });
}

DirTree.prototype.type = 'DirTree';
module.exports = DirTree;

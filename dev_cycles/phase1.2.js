"use strict";

var blessed = require('blessed'),
    // screen = blessed.screen(),
    yaml = require('js-yaml'),
    fs = require('fs'),
    readdirp = require('readdirp');


// default config_file
var conf_file = process.env.HOME+"/.timetrap.yml";

// preference over default
if (process.env.TIMETRAP_CONFIG_FILE) {
    conf_file = process.env.TIMETRAP_CONFIG_FILE;
}

try {
    // git the config object
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

console.log("-----------------------------------------------------");
console.log("timetrap_config.tui_projects_template_path:"+timetrap_config.tui_projects_template_path)
console.log("timetrap_config.tui_skip_dirs_regex:"+timetrap_config.tui_skip_dirs_regex)
console.log("-----------------------------------------------------");


var entries = [];
var data;
readdirp({ root: timetrap_config.tui_projects_template_path,
    entryType: 'directories', directoryFilter: timetrap_config.tui_skip_dirs
    }).on('data',
    function(entry) {
        var timesheet_file = entry.fullPath+"/.timetrap-sheet";

        if ( ! fs.existsSync(timesheet_file) ) {
            //file doesn't exist. attempt to creat it.

            var timesheet_content = entry.path.replace(/\//g,'.');

            console.log("creating file: "+timesheet_file);
            console.log("setting content: "+timesheet_content);

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
                        fs.close(fd);
                    });
            });
        }

        // save the entry
        entries.push(entry);
        console.log("entry: "+entries[entries.length-1].path);
    });

console.log("-----------------------------------------------------");
console.log("entries: "+entries);

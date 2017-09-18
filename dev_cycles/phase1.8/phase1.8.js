// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib');

//global screen
//var screen = blessed.screen({smartCSR: true});
var screen = blessed.screen({
	autoPadding: true,
	smartCSR: true
});
// app packages
var Configuration = require('./config'),
    DirTree = require('./dirtree2');

// panels
var ActionBar = require('./actionbar');
var MenuBar = require('./menubar');
var SideBar = require('./sidebar');
var Workspace = require('./workspace');
var View = require('./view');

// Quit on `q`, or `Control-C` when the focus is on the screen.
screen.key(['q', 'C-c'], function(ch, key) {
    process.exit(0);
});

function main(argv, callback) {

    // TODO: move widget ownership to view?

	//console.log("loading...");

    //get config data
    let config = new Configuration();
    config.fetch();

    //fetch projects list
    let dirtree = new DirTree(config);
    let proj_tree = dirtree.fetch(config.timetrap_config.tui_projects_template_path);

    config.view.sidew = dirtree.getMaxSideNameLen();   //side menu width
    config.view.numwnd = 3;                    //number of windows
    config.view.curwind = 1;                   //current window (starts at 1, screen === 0)

    // logo -useless
    let actionbar = new ActionBar(
        {
            parent: screen,
            top:0,
            left:0,
            width: config.view.sidew,
            value: "Timetrap TUI:",
            align: "center",
            fg: "blue"
        }
    );

    //menubar at top
    let menubar = new MenuBar({
        parent: screen,
        left: config.view.sidew,
        right: 0,
        top: 0,
    });

    // the main area
    //var mainw = blessed.box({
    let workspace = new Workspace({
        parent: screen,
        left: config.view.sidew + 1,
        top: 2,
        bottom: 0,
        right: 0
    });

    //project tree on the left
    let sidebar = new SideBar({
        parent: screen,
        left: 0,
        top: 1,
        bottom: 0,
        width: config.view.sidew,
    });

    // set the tree data
    sidebar.setData(proj_tree);
    //sidebar.setData(dirtree.dirTree(config.timetrap_config.tui_projects_template_path));

	//set the layout
	let view = new View(config, screen, {menubar: menubar, sidebar: sidebar, workspace: workspace});

    // return start(data, function(err) {
    //     if (err) return callback(err);
    //     return callback();
    // });
}

// Process loop
if (!module.parent) {
    process.title = 'Timetrap TUI';
    main(process.argv.slice(), function(err) {
        if (err) throw err;
        return process.exit(0);
    });
} else {
    module.exports = main;
}

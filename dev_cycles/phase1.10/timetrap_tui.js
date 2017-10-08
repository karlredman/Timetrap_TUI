"use strict";

// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib');
var opt = require('commander');

// app packages
var Configuration = require('./Configuration'),
    //DirTree = require('./dirtree'),
    ViewControl = require('./ViewController'),
    Timetrap = require('./Timetrap');

var screen = blessed.screen({
    autoPadding: true,
    smartCSR: true
});

// Quit on `Control-C`
screen.key(['C-c'], function(ch, key) {
    process.exit(0);
});

function main(argv, callback) {
    let _this = this;

    //get config data
    let config = new Configuration("0.0.0");
    config.fetch();

    //adjust config with commandline
    let conf = config.settings //convenienc
    opt
        .version(config.version)
        .description(
            "Written by: Karl N. Redman"
            +"\n"
            +"  http://github.com/karlredman/Timetrap_TUI"
            +"\n"
            +"  -----------------------------------------"
            +"\n"
            +"  * Default Values are shown in CAPS."
            +"\n"
            +"  * Configuration file entries override defaults."
            +"\n"
            +"  * Commandline options override configuration file:"
            +"\n"
            +"    (Using: "+conf.config_file+")."
        )
        .option('-d, --developer_mode [true|FALSE]',
            conf.tui_developer_mode.desc,
            conf.tui_developer_mode.value)
        .option('-c, --create_missing_sheets [true|FALSE]', // TODO
            conf.tui_create_missing_sheets.desc,
            conf.tui_create_missing_sheets.value)
        .option('-H, --HELP',
            "Print full documentation help and exit")    // TODO
        .option('-p, --print_config [true|FALSE]',
            "Print the configuration in JSON and exit")  // TODO
        .option('-q, --question_prompts [TRUE|false]',
            conf.tui_question_prompts.desc,
            conf.tui_question_prompts.value)
    opt.parse(process.argv);


    if(opt.HELP || opt.print_config) {
        console.log("Information is supposed to be printed here. Derp!")
        process.exit(0);
    }

    // map arguments (commandline overrides config file)
    // TODO: figure out a better way to do this
    config.settings.tui_developer_mode.value = opt.developer_mode;
    config.settings.tui_question_prompts.value = opt.question_prompts

    //console.log(config.settings.tui_question_prompts.value); process.exit(0)

    // instantiate supporting objects
    //let dirtree = new DirTree(config);
    let timetrap = new Timetrap(config);

    // the controller of views
    //ViewControl.viewcontrol = new ViewControl(config, screen);
    ViewControl.viewcontrol = new ViewControl({
        config: config,
        screen: screen,
        timetrap: timetrap
    });

    // return start(data, function(err) {
    //     if (err) return callback(err);
    //     return callback();
    // });
    //
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

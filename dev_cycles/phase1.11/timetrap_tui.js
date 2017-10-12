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
    dockBorders: true,
    ignoreDockContrast: true,
    ignoreLocked: ['C-c'],
    sendFocus: true,
    smartCSR: true,
});

// Quit on `Control-C`
screen.key(['C-c'], function(ch, key) {
    screen.destroy();
    process.exit();
    //process.exit(0);
});


function main(argv, callback) {
    let _this = this;

    //get config data
    let config = new Configuration();

    // TODO: make this an option
    //screen.title = "Timetrap TUI";

    ////////// DEBUG
    // console.log(config.settings.tui_question_prompts.value);
    // console.log(config.version);
    // console.log("------------------------------------------")
    ////////// DEBUG

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
            // +"\n"
            // +"  * Default Values are shown in CAPS."
            +"\n"
            +"  * Configuration file entries override defaults."
            +"\n"
            +"  * Commandline options override configuration file:"
            +"\n"
            +"    (Using: "+conf.config_file+")."
        )
        .option('-d, --developer_mode <bool>',
            conf.tui_developer_mode.desc+' ['+conf.tui_developer_mode.value+']',
            /^(true|false)$/i,
            conf.tui_developer_mode.value)
        // .option('-c, --create_missing_sheets <bool>', // TODO
        //     conf.tui_create_missing_sheets.desc+' ['+conf.tui_create_missing_sheets.value+']',
        //     /^(true|false)$/i,
        //     conf.tui_create_missing_sheets.value)
        .option('-H, --HELP',
            "print full documentation help and exit")    // TODO
        .option('-p, --print_config <bool>',
            "print the configuration in JSON and exit",  // TODO
            /^(true|false)$/i,
            false)
        .option('-q, --question_prompts <bool>',
            conf.tui_question_prompts.desc+' ['+conf.tui_question_prompts.value+']',
            /^(true|false)$/i,
            conf.tui_question_prompts.value)
        .option('-w, --working_directory <$HOME>',
            conf.tui_working_directory.desc+' ['+conf.tui_working_directory.value+']',
            /^.+$/i,
            conf.tui_working_directory.value)
    opt.parse(process.argv);


    if(opt.HELP || opt.print_config) {
        console.log("Information is supposed to be printed here. Derp!")
        process.exit(0);
    }

    // map arguments (commandline overrides config file)
    // TODO: figure out a better way to do this
    // config.settings.tui_developer_mode.value = opt.developer_mode.toLowerCase();
    // config.settings.tui_question_prompts.value = opt.question_prompts.toLowerCase();
    config.settings.tui_developer_mode.value = opt.developer_mode;
    config.settings.tui_question_prompts.value = opt.question_prompts;
    config.settings.tui_working_directory.value = opt.working_directory;

    ////// DEBUG
    // console.log(opt.question_prompts);
    // console.log(config.settings.tui_question_prompts.value);
    // process.exit(0);
    ////// DEBUG

    //console.log(config.settings.tui_question_prompts.value); process.exit(0)

    //set the working directory
    process.chdir(config.settings.tui_working_directory.value)

    // instantiate supporting objects
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

#!/usr/bin/env node
'use strict';

// dependencies
var blessed = require('blessed');
var opt = require('commander');
var fs = require('fs');

// project includes
var {ProcessConfig} = require('./lib/ProcessConfig');
var {ViewController} = require('./lib/view_Controller');

class app extends Object {
  constructor({version = null} = {}) {
    super();

    // get process defaults
    this.process_config = new ProcessConfig({
      version: version,
      root_title: 'Timetrap_TUI',
      title: 'ProcessConfig'});
  }

  run() {
    // manage screen
    this.screen = blessed.screen({
      autoPadding: true,
      dockBorders: true,
      ignoreDockContrast: true,
      ignoreLocked: ['C-c'],
      sendFocus: true,
      smartCSR: true,
    });
    this.registerActions();

    // our view controller
    const viewController = new ViewController({
      screen: this.screen,
      process_config: this.process_config});

    // go
    viewController.run();
  }

  registerActions() {
    const _this = this;

    // Quit on `Control-C`
    this.screen.key(['C-c'], function(ch, key) {
      _this.screen.destroy();
      process.exit(0);
    });
  }
}

function process_opts({app = null, timetrap_env_config_file = null} = {}) {
  // update process_config config_file entry. (chicken, egg issue)
  // // initial value
  let config_file = app.process_config.data.config_file.value;

  if ((typeof timetrap_env_config_file === 'string')
        && (timetrap_env_config_file.length > 0)) {
    // // environment variable overrides defaut
    config_file = timetrap_env_config_file;
  }

  opt
      .version(app.process_config.version)
      .description(
          'http://github.com/karlredman/Timetrap_TUI'
            + '\n'
			+ '  Copyright 2019 Karl N. Redman (MIT licenced)'
            + '\n'
            + '  -----------------------------------------'
            + '\n'
            + '  * Default Values are shown in CAPS.'
            + '\n'
            // +"  * $TIMETRAP_TUI_CONFIG overrides default config file path."
            // +"\n"
            // +"  * Commandline option \'-c\' will override $TIMETRAP_TUI_CONFIG."
            // +"\n"
            // +"  * Configuration file entries override defaults."
            // +"\n"
            // +"  * Commandline options override configuration file:"
            // +"\n"
            + '    (Current config: ' + config_file + ').'
      )
  // .option('-c, --config_file <file path>',
  //     app.process_config.data.config_file.desc+' ['
  //     +config_file+']',
  //     /^.+$/i,
  //     config_file)
      .option('-d, --developer_mode',
          app.process_config.data.developer_mode.desc,
          app.process_config.data.developer_mode.value)
  // .option('-p, --print_config',
  //     "print the configuration in JSON and exit",  // TODO
  //     false)
      .option('-q, --no-question_prompts',
          app.process_config.data.question_prompts.desc,
          app.process_config.data.question_prompts.value)
      .option('-t, --theme <color theme>',
          app.process_config.data.color_theme.desc + ' ['
            + app.process_config.data.color_theme.value + ']',
          /^.+$/i,
          app.process_config.data.color_theme.value);
  // .option('-w, --working_directory <$HOME>',
  //     app.process_config.data.working_directory.desc+' ['
  //     +app.process_config.data.working_directory.value+']',
  //     /^.+$/i,
  //     app.process_config.data.working_directory.value)
  // .option('-H, --HELP',
  //     "print full documentation help and exit")    // TODO
  opt.parse(process.argv);

  // console.log(opt.developer_mode)
  // process.exit(0);

  if (opt.HELP || opt.print_config) {
    console.log('Information is supposed to be printed here. Derp!');
    process.exit(0);
  }

  // get data from config file
  // TODO: inform user if config_file doesn't exist
  // // if config_file doesn't exist fail
  if (fs.existsSync(config_file)) {
    app.process_config.loadFile({config_file: config_file});
  }

  // update process_config options from opt (overrides config file)
  app.process_config.loadOptions({
    config_file: {
      value: opt.config_file,
    },
    developer_mode: {
      value: opt.developer_mode,
    },
    question_prompts: {
      value: opt.question_prompts,
    },
    color_theme: {
      value: opt.theme,
    },
    working_directory: {
      value: opt.working_directory,
    },
  });
}

function main(argv, callback) {
  // app
  app = new app({version: '0.2.0'});

  // process getopt
  process_opts({app: app,
    timetrap_env_config_file: process.env.TIMETRAP_CONFIG_FILE});

  // console.log(app.process_config.data.config_file.value)
  // process.exit(0);
  app.run();
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

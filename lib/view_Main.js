'use strict';

// class dependencies
var blessed = require('blessed');

// project dependencies
require('./Errors');
// var {MainConfig} = require('./view_MainConfig');
var {ViewBox} = require('./widget_ViewBox');
var {ViewBoxConfig} = require('./widget_ViewBoxConfig');
var {Logger} = require('./widget_Logger');
var {LoggerConfig} = require('./widget_LoggerConfig');
var {Menubar} = require('./widget_Menubar');
var {MenubarConfig} = require('./widget_MenubarConfig');
var {SheetTree} = require('./widget_SheetTree');
var {SheetTreeConfig} = require('./widget_SheetTreeConfig');
var {SummaryTable} = require('./widget_SummaryTable');
var {SummaryTableConfig} = require('./widget_SummaryTableConfig');
var {RunningBox} = require('./widget_RunningBox');
var {RunningBoxConfig} = require('./widget_RunningBoxConfig');
var helpers = require('./helpers');
var {Timetrap} = require('timetrap_wraplib');

// debugging
// var util = require('util');

// parent
const {EventEmitter} = require('events').EventEmitter;

// //////////////////////////////////////////
// ///////////// ViewMain Class
// //////////////////////////////////////////

class ViewMain extends EventEmitter {
  constructor({
    screen = helpers.requiredParam('screen'),
    process_config = helpers.requiredParam('process_config'),
    controller = helpers.requiredParam('controller'),
    config = helpers.requiredParam('ViewMain'),
  } = {}) {
    super();
    this.screen = screen;
    this.process_config = process_config;
    this.theme = this.process_config.data.color_theme.value;
    this.controller = controller;
    this.config = config;

    // new timetrap
    // TODO: fix check that this value is coming from the timetrap config file
    // this.timetrap = new Timetrap({watched_db_file: '/home/karl/Documents/Heorot/timetrap/timetrap.db'});

    // console.log(util.inspect(this.data.database_file, null, 2));
    // console.log("xxxx"+process_config.data.database_file)
    // process.exit(0);

    this.timetrap = new Timetrap({watched_db_file: process_config.data.database_file});
    // export TIMETRAP_CONFIG_FILE=$HOME/Documents/Heorot/timetrap/timetrap.yml

    // monitor db for changes
    this.timetrap.monitorDBStart();

    // widgets
    this.widgets = {};

    // create widgets
    this.createWidgets();

    // this view actions
    this.registerActions();

    // set up focus
    this.pwin = {
      sheettree: 1,
      menubar: 2,
      logger: 3,
      summarytable: 4,
    };
    this.pwin.first = this.pwin.sheettree;
    this.pwin.last = this.pwin.logger;
    this.pwin.curWin;

    // register actions of our widgets
    for (const key in this.widgets) {
      if (!this.widgets.hasOwnProperty(key)) continue;
      this.widgets[key].registerActions();
    }


    // initial focus
    this.setWinFocus(this.pwin.sheettree);

    // hide loading // TODO: should be an event
    // this.controller.widgets.loading.stop();
  }
}

ViewMain.prototype.setWinFocus = function(win) {
  // The focus and effects are managed here so mouse actions don't cause
  // false positives.
  switch (win) {
    case this.pwin.summarytable:
      this.setWinFocus(this.pwin.sheettree);
      // //we shouldn't be here
      // this.widgets.summarytable.options.style.border.fg = "yellow";
      // this.widgets.sheettree.options.style.border.fg = "yellow";
      // this.widgets.summarytable.focus();
      break;
    case this.pwin.sheettree:
      // this.widgets.summarytable.options.style.border.fg = "green";
      // this.widgets.sheettree.options.style.border.fg = "green";
      this.widgets.summarytable.options.style.border.fg = this.widgets.summarytable.config.data.colors.style.border.fg[this.theme];
      this.widgets.sheettree.options.style.border.fg = this.widgets.sheettree.config.data.colors.style.border.fg[this.theme];
      this.widgets.sheettree.focus();
      break;
    case this.pwin.menubar:
      // this.widgets.summarytable.options.style.border.fg = "red";
      // this.widgets.sheettree.options.style.border.fg = "red";
      this.widgets.summarytable.options.style.border.fg = this.config.data.colors.focuslines.disabled.fg[this.theme];
      this.widgets.sheettree.options.style.border.fg = this.config.data.colors.focuslines.disabled.fg[this.theme];
      this.widgets.menubar.focus();
      break;
    case this.pwin.logger:
      // this.widgets.summarytable.options.style.border.fg = "red";
      // this.widgets.sheettree.options.style.border.fg = "red";
      this.widgets.summarytable.options.style.border.fg = this.config.data.colors.focuslines.disabled.fg[this.theme];
      this.widgets.sheettree.options.style.border.fg = this.config.data.colors.focuslines.disabled.fg[this.theme];
      this.widgets.logger.focus();
      break;
    default:
      this.loading_dialog = new DialogMessage({target: this, parent: this.screen});
      this.loading_dialog.alert('Bad window number');
      break;
  }

  this.pwin.curWin = win;

  // TODO: rework this for color themes

  // toggle menu colors
  if (win === this.pwin.menubar) {
    // menu is active highlight only the selected one
    this.widgets.menubar.options.style.bg = this.widgets.menubar.config.data.colors.style.bg[this.theme];
    this.widgets.menubar.options.style.fg = this.widgets.menubar.config.data.colors.style.fg[this.theme];

    this.widgets.menubar.options.style.item.bg = this.widgets.menubar.config.data.colors.style.item.bg[this.theme];
    this.widgets.menubar.options.style.item.fg = this.widgets.menubar.config.data.colors.style.item.fg[this.theme];

    this.widgets.menubar.options.style.prefix.bg = this.widgets.menubar.config.data.colors.style.prefix.bg[this.theme];
    this.widgets.menubar.options.style.prefix.fg = this.widgets.menubar.config.data.colors.style.prefix.fg[this.theme];

    this.widgets.menubar.options.style.selected.bg = this.widgets.menubar.config.data.colors.style.selected.bg[this.theme];
    this.widgets.menubar.options.style.selected.fg = this.widgets.menubar.config.data.colors.style.selected.fg[this.theme];
  } else {
    // menu is not active don't show highlights
    this.widgets.menubar.options.style.bg = this.widgets.menubar.config.data.colors.style.inactive.bg[this.theme];
    this.widgets.menubar.options.style.fg = this.widgets.menubar.config.data.colors.style.inactive.fg[this.theme];

    this.widgets.menubar.options.style.item.bg = this.widgets.menubar.config.data.colors.style.inactive.bg[this.theme];
    this.widgets.menubar.options.style.item.fg = this.widgets.menubar.config.data.colors.style.inactive.fg[this.theme];

    this.widgets.menubar.options.style.prefix.bg = this.widgets.menubar.config.data.colors.style.inactive.bg[this.theme];
    this.widgets.menubar.options.style.prefix.fg = this.widgets.menubar.config.data.colors.style.inactive.fg[this.theme];

    this.widgets.menubar.options.style.selected.bg = this.widgets.menubar.config.data.colors.style.inactive.bg[this.theme];
    this.widgets.menubar.options.style.selected.fg = this.widgets.menubar.config.data.colors.style.inactive.fg[this.theme];
  }
  this.screen.render();
};

ViewMain.prototype.setWinFocusNext = function() {
  // specific behavior
  switch (this.pwin.curWin) {
    case this.pwin.menubar:
      this.setWinFocus(this.pwin.sheettree);
      break;
    case this.pwin.sheettree:
      this.setWinFocus(this.pwin.menubar);
      break;
    case this.pwin.logger:
      this.setWinFocus(this.pwin.sheettree);
      break;
  }
};

ViewMain.prototype.setWinFocusPrev = function() {
  // specific behaovior
  switch (this.pwin.curWin) {
    case this.pwin.menubar:
      this.setWinFocus(this.pwin.sheettree);
      break;
    case this.pwin.sheettree:
      this.setWinFocus(this.pwin.logger);
      break;
    case this.pwin.logger:
      this.setWinFocus(this.pwin.sheettree);
      break;
  }
};

ViewMain.prototype.destroyMenubar = function() {
  this.widgets.menubar.unRegisterActions();
  this.widgets.menubar.removeAllListeners();
  this.widgets.menubar.removeScreenEvent('keypress');
  this.widgets.menubar.destroy();
  this.widgets.menubar.free();
  delete this.widgets.menubar.config;
  delete this.widgets.menubar;
  this.log.msg('destroyed menubar while creating view details', this.log.loglevel.devel.message);
};

ViewMain.prototype.registerActions = function() {
  const _this = this;

  // this.widgets.sheettree.rows.on('keypress', (ch, key) => {
  // this.screen.on('keypress', (ch, key) => {
  //     if (key.ch === '1') {
  //         var {Message} = require('./dialog_Message.js')
  //         let dlg = new Message({widget: _this.widgets.sheettree}).alert("val:"+util.inspect(key, null, 2));
  //         this.widgets.menubar.selectTab(0)
  //     }
  // });


  this.on('hide_view', () => {
    _this.log.msg('hiding main view', _this.log.loglevel.devel.message);
    _this.widgets.viewbox.hide();
  });
  this.on('show_view', () => {
    _this.log.msg('showing main view', _this.log.loglevel.devel.message);
    _this.widgets.viewbox.show();
  });
  this.on('destroy_widget', (widget) => {
    // widget.removeScreenEvent('keypress');
    widget.removeAllListeners();
    widget.destroy();
    widget.free();
    delete widget.config;
    widget = undefined;
    _this.log.msg('destroyed widget', _this.log.loglevel.devel.message);
    _this.widgets.sheettree.focus();
  });
  this.on('create_widget', (widget) => {
    if (widget === 'menubar') {
      // menubar
      const menubar_config = new MenubarConfig();
      _this.widgets.menubar = new Menubar({
        // parent: _this.widgets.viewbox,
        parent: _this.widgets.viewbox,
        config: menubar_config,
        theme: _this.theme,
        logger: _this.widgets.logger,
        view: _this,
      });
      _this.widgets.menubar.registerActions();
    }
  });
  this.on('focus_default', () => {
    _this.setWinFocus(_this.pwin.sheettree);


    // TODO: (fix) I think this is a memory leak

    // manage focus
    const logline = blessed.line({
      parent: this.widgets.viewbox,
      orientation: 'horizontal',
      bottom: 1,
      left: 0,
      right: 0,
      fg: this.config.data.colors.focuslines.fg[this.theme],
      bg: this.config.data.colors.focuslines.bg[this.theme],
    });
    const menuline = blessed.line({
      parent: this.widgets.viewbox,
      orientation: 'horizontal',
      top: 1,
      left: 0,
      right: 0,
      fg: this.config.data.colors.focuslines.fg[this.theme],
      bg: this.config.data.colors.focuslines.bg[this.theme],
    });

    // effects that highlight focus
    this.screen.setEffects(menuline, this.widgets.logger, 'focus', 'blur',
        {
          fg: this.config.data.colors.focuslines.disabled.fg[this.theme],
          bg: this.config.data.colors.focuslines.disabled.bg[this.theme],
        }, Object);
    this.screen.setEffects(logline, this.widgets.menubar, 'focus', 'blur',
        {
          fg: this.config.data.colors.focuslines.disabled.fg[this.theme],
          bg: this.config.data.colors.focuslines.disabled.bg[this.theme],
        }, Object);
  });

  this.timetrap.on('checkout_all_sheets', (emit_obj) => {
    _this.log.msg('stopped all time sheets', _this.log.loglevel.production.message);
  });

  this.timetrap.on('command_complete', (emit_obj) => {
    if (emit_obj.owner === 'menubar') {
      // devel
      _this.log.msg(
          'command_complete|type:' + emit_obj.data.type
                + '|sheet:' + emit_obj.data.sheet
                // +"|stdout:"+emit_obj.data.stdoutData
                + '|stderr:' + emit_obj.data.stderrData
          , _this.log.loglevel.devel.message);

      // log info for user
      if (
        (emit_obj.data.type === 'checkIn')
                || (emit_obj.data.type === 'checkOut')
                || (emit_obj.data.type === 'edit')
      ) {
        if (typeof emit_obj.data.stderrData !== 'undefined') {
          if (emit_obj.data.stderrData.toString()
              .match(/.*Timetrap is already running.*/)) {
            _this.log.msg(emit_obj.data.sheet + ' is already running', _this.log.loglevel.production.warning);
          } else if (emit_obj.data.stderrData.toString().match(/.*Editing running entry.*/)) {
            _this.log.msg(
                'Edited runnig entry for \'' + emit_obj.data.sheet + '\'',
                _this.log.loglevel.production.message);
          } else {
            _this.log.msg(emit_obj.data.stderrData.toString(),
                _this.log.loglevel.production.message);
          }
        }
      }
    }
  });
};

ViewMain.prototype.createWidgets = function() {
  // view base object
  const viewbox_config = new ViewBoxConfig();
  this.widgets.viewbox = new ViewBox({
    parent: this.screen,
    config: viewbox_config,
    theme: this.process_config.data.color_theme.value,
  });
  this.widgets.viewbox.setContent('main view viewbox');

  // logger
  const logger_config = new LoggerConfig();
  this.widgets.logger = new Logger({
    parent: this.widgets.viewbox,
    config: logger_config,
    theme: this.theme,
    view: this,
    devel: this.process_config.data.developer_mode.value,
    first_msg: '{center}Welcome to Timetrap TUI! [C-c to exit, ? for help]{/center}',
  });
  // convenience
  this.log = this.widgets.logger;

  // TODO: debug -kill
  // usage: this.log.msg("test message", this.log.loglevel.production.message);
  // usage: this.log.msg("test message", this.log.loglevel.production.warning);
  // usage: this.log.msg("test message", this.log.loglevel.production.error);

  // menubar
  const menubar_config = new MenubarConfig();
  this.widgets.menubar = new Menubar({
    // parent: this.widgets.viewbox,
    parent: this.widgets.viewbox,
    config: menubar_config,
    theme: this.theme,
    logger: this.widgets.logger,
    view: this,
  });

  // sheet tree
  const sheettree_config = new SheetTreeConfig();
  this.widgets.sheettree = new SheetTree({
    parent: this.widgets.viewbox,
    config: sheettree_config,
    theme: this.theme,
    logger: this.widgets.logger,
    view: this,
  });

  // summary table
  const summarytable_config = new SummaryTableConfig();
  this.widgets.summarytable = new SummaryTable({
    parent: this.widgets.viewbox,
    config: summarytable_config,
    theme: this.theme,
    logger: this.widgets.logger,
    view: this,
  });


  // manage focus
  const logline = blessed.line({
    parent: this.widgets.viewbox,
    orientation: 'horizontal',
    bottom: 1,
    left: 0,
    right: 0,
    fg: this.config.data.colors.focuslines.fg[this.theme],
    bg: this.config.data.colors.focuslines.bg[this.theme],
  });
  const menuline = blessed.line({
    parent: this.widgets.viewbox,
    orientation: 'horizontal',
    top: 1,
    left: 0,
    right: 0,
    fg: this.config.data.colors.focuslines.fg[this.theme],
    bg: this.config.data.colors.focuslines.bg[this.theme],
  });

  // effects that highlight focus
  this.screen.setEffects(menuline, this.widgets.logger, 'focus', 'blur',
      {
        fg: this.config.data.colors.focuslines.disabled.fg[this.theme],
        bg: this.config.data.colors.focuslines.disabled.bg[this.theme],
      }, Object);
  this.screen.setEffects(logline, this.widgets.menubar, 'focus', 'blur',
      {
        fg: this.config.data.colors.focuslines.disabled.fg[this.theme],
        bg: this.config.data.colors.focuslines.disabled.bg[this.theme],
      }, Object);

  // running box
  const runningbox_config = new RunningBoxConfig();
  this.widgets.runningbox = new RunningBox({
    parent: this.widgets.viewbox,
    // parent: this.screen,
    config: runningbox_config,
    theme: this.theme,
    logger: this.widgets.logger,
    view: this,
  });


  this.screen.render();
};

module.exports = {ViewMain};

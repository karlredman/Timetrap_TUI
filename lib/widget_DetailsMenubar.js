'use strict';

// dependencies
var blessed = require('blessed');
var Listbar = blessed.listbar;

// project includes
// var {DetailsMenubarConfig} = require('./widget_DetailsMenubarConfig');
var {TimetrapTUI_Error} = require('./Errors');
var helpers = require('./helpers');
var {Message} = require('./dialog_Message.js');
var {Prompt} = require('./dialog_Prompt.js');
var {Question} = require('./dialog_Question.js');
var {Menu} = require('./dialog_Menu.js');

// debugging
// var util = require('util');

class DetailsMenubar extends Listbar {
  constructor({parent = helpers.requiredParam('parent'), options = {},
    theme = 'opaque', config = helpers.requiredParam('config'),
    logger = helpers.requiredParam('logger'),
    view = helpers.requiredParam('view')} = {}) {
    const defaults = {
      parent: parent,
      //
      autoCommandKeys: true,
      //
      height: 1,
      top: 0,
      left: 0,
      width: '100%',
      //
      keys: false, // we're overriding keys
      // xkeys: true,
      // lockKeys: true,
      mouse: true,
      vi: true,
      //
      scrollable: true,
      invertSelected: false,
      //
      bg: config.data.colors.bg[theme],
      fg: config.data.colors.fg[theme],
      //
      style: {
        bg: config.data.colors.style.bg[theme],
        fg: config.data.colors.style.fg[theme],
        item: {
          bg: config.data.colors.style.item.bg[theme],
          fg: config.data.colors.style.item.fg[theme],
        },
        prefix: {
          bg: config.data.colors.style.prefix.bg[theme],
          fg: config.data.colors.style.prefix.fg[theme],
        },
        selected: {
          bg: config.data.colors.style.selected.bg[theme],
          fg: config.data.colors.style.selected.fg[theme],
        },
      },
    };

    // merge options into defaults
    options = Object.assign(defaults, options);

    // call parent constructor
    super(options);

    // saved options
    this.theme = theme;
    this.config = config;
    this.log = logger;
    this.view = view;

    // log is interactive (for parent contrib.log)
    this.interactive = true;

    // grab local datascructures, etc.
    this.init();
  }
}

DetailsMenubar.prototype.unRegisterActions = function() {
  // intended for timetrap object cleanup
};

DetailsMenubar.prototype.destroy = function() {
  this.unRegisterActions();
  return Object.getPrototypeOf(this.prototype).destory(this);
};

DetailsMenubar.prototype.registerActions = function() {
  const _this = this;

  this.on('blur', function blur() {
    // always reset the menu to first option
    _this.select(0);
  });
  this.on('focus', function focus() {
    // always reset the menu to first option
    _this.select(0);
  });

  this.on('keypress', function keypress(ch, key) {
    // custom key bindings
    if (key.name === 'tab') {
      if (!key.shift) {
        _this.view.setWinFocusNext();
      } else {
        _this.view.setWinFocusPrev();
      }
      return;
    }
    if (key.name === 'left'
            || (_this.options['vi'] && key.name === 'h')
    ) {
      if (_this.selected === 0) {
        _this.select(_this.items.length - 1);
        return;
      }
      _this.moveLeft();
      _this.screen.render();
      return;
    }
    if (key.name === 'right'
            || (_this.options['vi'] && key.name === 'l')
    ) {
      if (_this.selected === (_this.items.length - 1)) {
        _this.select(0);
        return;
      }
      _this.moveRight();
      _this.screen.render();
      return;
    }
    if (key.name === 'enter'
            || (_this.options['vi'] && key.name === 'k' && !key.shift)) {
      _this.emit('action', _this.items[_this.selected], _this.selected);
      _this.emit('select', _this.items[_this.selected], _this.selected);

      const item = _this.items[_this.selected];
      if (item._.cmd.callback) {
        item._.cmd.callback();
      }
      _this.screen.render();
      return;
    }
  });

  this.on('prompt', function(data) {
    if (
      (data.type === 'edit')
            || (data.type === 'editId')
    ) {
      if (data.data !== null) {
        // purposful kludge -editId is a parameter of edit
        if (data.type === 'editId') {
          data.type = 'edit';
        }
        _this.log.msg('Prompt|type:' + data.type + '|sheet:' + _this.view.sheet + '|data:' + data.data, _this.log.loglevel.devel.message);
        _this.view.timetrap.callCommand({type: data.type, owner: 'detailstable', content: data.data, sheet: _this.view.sheet, sync: true});
      }
    }
  });
};

DetailsMenubar.prototype.init = function() {
  const _this = this;

  const items = {
    // 1
    Close: () => {
      // cleanup any dialogs
      _this.view.widgets.details_table.focus();
      // destroy the view
      _this.view.controller.emit('destroy_view', {view_name: 'details'});
    },
    // // 2
    // Resume: () => {
    //     let dlg = new Message({widget: _this}).alert("This feature is not yet implemented");
    // },
    // 3
    Edit: () => {
      // TODO: MAGIC NUMBERS!!!!!
      const selected = _this.view.widgets.details_table.rows.selected;
      const id = _this.view.widgets.details_table.items.data[selected][0]; // MAGIC!!!

      const dlg = new Prompt({widget: _this, id: id}).cannedInput('editId');
    },
    // 4
    Display: () => {
      const submenu = new Menu({widget: _this});
      submenu.rows.focus();
    },
    // // 5
    // Sheet: () => {
    //     let dlg = new Message({widget: _this}).alert("This feature is not yet implemented");
    // },
    // // 6
    // Move: () => {
    //     let dlg = new Message({widget: _this}).alert("This feature is not yet implemented");
    // },
    // // 7
    // Archive: () => {
    //     let dlg = new Message({widget: _this}).alert("This feature is not yet implemented");
    // },
    // // 8
    // Kill: () => {
    //     let dlg = new Message({widget: _this}).alert("This feature is not yet implemented");
    // },
    // // 9
    // Theme: () => {
    //     let dlg = new Message({widget: _this}).alert("This feature is not yet implemented");
    // },
    // // 0
    // Test2: () => {
    //     let dlg = new Message({widget: _this}).alert("This feature is not yet implemented");
    // },
  };
  this.setItems(items);
};
module.exports = {DetailsMenubar};

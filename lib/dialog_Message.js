'use strict';

// dependencies
var blessed = require('blessed');
var BlessedMessage = blessed.message;

// project includes
var {DialogConfig} = require('./dialog_DialogConfig');
var {TimetrapTUI_Error} = require('./Errors');
var helpers = require('./helpers');

// debugging
// var util = require('util');

// ///////////////////// examples
// let dlg = new Message({widget: _this}).message("new test message");
// let dlg = new Message({widget: _this}).error("new test message");
// let dlg = new Message({widget: _this}).alert("new test message");

class Message extends BlessedMessage {
  constructor({
    widget = helpers.requiredParam('widget'),
    config = new DialogConfig(),
    options = {},
  } = {}) {
    // because we can't use this until later
    const theme = widget.view.theme;

    const defaults = {
      parent: widget.view.screen,
      //
      lockKeys: true,
      keys: true,
      tags: true,
      align: 'center',
      left: 'center',
      top: 'center',
      width: '50%',
      height: 10,
      //
      bg: config.data.colors.bg[theme],
      fg: config.data.colors.fg[theme],
      //
      border: {
        type: 'line',
        bg: config.data.colors.border.bg[theme],
        fg: config.data.colors.border.fg[theme],
      },
      style: {
        bg: config.data.colors.style.bg[theme],
        fg: config.data.colors.style.fg[theme],
      },
    };

    // merge options into defaults
    options = Object.assign(defaults, options);

    // call parent constructor
    super(options);

    // saved vars
    this.target = widget;
    this.config = config;
    this.view = widget.view;
    this.theme = widget.view.theme;
    this.log = widget.view.log;

    // this.focus();
  }
}
Message.prototype.alert = function(message) {
  const delay = 0; // until keypress
  this.display('\n' + message, delay, function(err, data) {});
};
Message.prototype.message = function(message, target) {
  const _this = this;

  if (typeof target === 'undefined') {
    target = this.target;
  }

  const delay = 0; // until keypress
  this.display('\n' + message, delay, function(err, data) {
    target.emit('message_display_ack', err, data);
  });
};
Message.prototype.error = function(message, target) {
  const _this = this;

  // currently there is no difference between error and message

  if (typeof target === 'undefined') {
    target = this.target;
  }

  const delay = 0; // until keypress
  this.display('\n' + message, delay, function(err, data) {
    target.emit('message_display_ack', err, data);
  });
};
module.exports = {Message};

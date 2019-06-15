'use strict';

// dependencies
var blessed = require('blessed');
var BlessedQuestion = blessed.question;

// project includes
var {DialogConfig} = require('./dialog_DialogConfig');
var {TimetrapTUI_Error} = require('./Errors');
var helpers = require('./helpers');

// debugging
// var util = require('util');

// ///////////////////// examples

class Question extends BlessedQuestion {
  constructor({
    widget = helpers.requiredParam('widget'),
    config = new DialogConfig(),
    target = null,
    options = {},
  } = {}) {
    // because we can't use this until later
    const theme = widget.view.theme;

    const defaults = {
      parent: widget.view.screen,
      //
      lockKeys: config.data.traits.lockKeys,
      keys: config.data.traits.keys,
      tags: config.data.traits.tags,
      align: config.data.traits.align,
      left: config.data.traits.left,
      top: config.data.traits.top,
      width: config.data.traits.width,
      height: config.data.traits.height,
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

    // realign buttons -they're on the left side in the parent
    this._.cancel.top = undefined;
    this._.cancel.left = undefined;
    this._.cancel.bottom = 1;
    this._.cancel.right = 1;
    // fix broken alignment in parent
    this._.cancel.align = 'center';
    this._.cancel.content = ' Cancel';
    //
    this._.okay.top = undefined;
    this._.okay.left = undefined;
    this._.okay.bottom = 1;
    this._.okay.right = 10;
    this.screen.render();

    // saved vars
    this.target = widget;
    if (target !== null) {
      this.target = target;
    };

    this.config = config;
    this.view = widget.view;
    this.theme = widget.view.theme;
    this.log = widget.view.log;

    // this.focus();
  }
}
Question.prototype.cannedInput = function(type) {
  const _this = this;

  const types = {
    stopAll: {
      message: 'Stop {bold}All{/bold} running timers.\n{bold}Are you sure?{/bold}',
    },
    exit: {
      message: '{bold}EXIT{/bold}\n{bold}Are you sure?{/bold}',
    },
  };

  const message = '\n' + types[type].message;

  _this.ask(message, function(err, data) {
    const response = {
      type: type,
      data: data,
      // obj: _this
    };

    _this.target.emit('question', response);
  });
};
module.exports = {Question};

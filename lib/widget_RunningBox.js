'use strict';

// dependencies
var blessed = require('blessed');
var BlessedBox = blessed.Box;

// project includes
// var {RunningBoxConfig} = require('./widget_RunningBoxConfig');
var {TimetrapTUI_Error} = require('./Errors');
var helpers = require('./helpers');


class RunningBox extends BlessedBox {
  constructor({parent = helpers.requiredParam('parent'), options = {},
    theme = 'opaque', config = helpers.requiredParam('config'),
    logger = helpers.requiredParam('logger'),
    view = helpers.requiredParam('view')} = {}) {
    const defaults = {
      parent: parent,
      //
      left: config.data.traits.left,
      top: config.data.traits.top,
      width: config.data.traits.width,
      height: config.data.traits.height,
      tags: true,
      align: 'center',
      bg: config.data.colors.bg[theme],
      fg: config.data.colors.fg[theme],
      content: '',
    };
    options = Object.assign({}, defaults, options);

    super(options);

    this.view = view;
    this.log = logger;
    this.theme = theme;
    this.config = config;
    this.timetrap = this.view.controller.timetrap;

    this.setContent('Loading...');
  }
}

RunningBox.prototype.registerActions = function() {
  this.on('update', (num_running, num_sheets) => {
    this.setQty(num_running, num_sheets);
  });
};

RunningBox.prototype.setQty = function(running, total) {
  const message = running + '/' + total + ' Running Sheets';
  this.setContent(message);
  this.view.screen.render();
};
module.exports = {RunningBox};

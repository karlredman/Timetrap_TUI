'use Strict';

var {ConfigurationBase} = require('./ConfigurationBase');

class ViewControllerConfig extends ConfigurationBase {
  constructor({config_file = null, config_options = null} ={}) {
    super({root_title: 'Timetrap_TUI', title: 'ViewControllerConfig', config_options: config_options});
  }
}

LoggerConfig.prototype.loadDefaults = function() {
  this.data = {
    traits: {
    },
  };

  this.exchange = {
    request: {
      tree: {
        name: 'request_tree',
        requester: null,
        data: null,
      },
    },
    receive: {
      tree: {
        name: 'receive_tree',
        receiver: null,
        data: null,
      },
    },

  };
};

module.exports = {ViewControllerConfig};

'use Strict';

var {ConfigurationBase} = require('./ConfigurationBase');

class ViewBoxConfig extends ConfigurationBase {
  constructor({config_file = null, config_options = null} = {}) {
    super({root_title: 'Timetrap_TUI', title: 'ViewBoxConfig', config_options: config_options});
  }
}

ViewBoxConfig.prototype.loadDefaults = function() {
  this.data = {
    // TODO: figure out color meanings
    colors: {
      bg: {
        none: 'none',
        opaque: 'black',
        dark: 'none',
        light: 'none',
        frosty: 'white',
        console: null,
        desc: 'the bg color of the view',
      },
      fg: {
        none: 'none',
        opaque: 'black',
        dark: 'none',
        light: 'none',
        frosty: 'white',
        console: null,
        desc: 'the fg color of the view',
      },
      style: {
        bg: {
          none: 'none',
          opaque: 'black',
          dark: 'none',
          light: 'none',
          frosty: 'white',
          console: null,
          desc: 'the bg color of the view',
        },
        fg: {
          none: 'none',
          opaque: 'white',
          dark: 'white',
          light: 'black',
          frosty: 'black',
          console: null,
          desc: 'the fg color of the view',
        },
      },
    },
  };
};

module.exports = {ViewBoxConfig};

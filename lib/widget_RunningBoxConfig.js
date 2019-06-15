'use strict';
var {ConfigurationBase} = require('./ConfigurationBase');

class RunningBoxConfig extends ConfigurationBase {
  constructor({config_file = null, config_options = null} = {}) {
    super({root_title: 'Timetrap_TUI', title: 'RunningBoxConfig', config_options: config_options});
  }
}

RunningBoxConfig.prototype.loadDefaults = function() {
  this.data = {
    traits: {
      width: 20, // initial width ?? shrink ??
      left: 2,
      top: 2,
      height: 1,
    },
    colors: {
      bg: {
        none: 'none',
        opaque: 'black',
        dark: 'none',
        light: 'none',
        frosty: 'white',
        console: 'none',
        desc: 'the bg color of the menu item',
      },
      fg: {
        none: 'none',
        opaque: 'white',
        dark: 'gray',
        light: 'black',
        frosty: 'gray',
        console: 'white',
        desc: 'the fg color of the menu item',
      },
    },
  };
};
module.exports = {RunningBoxConfig};

'use strict';
var {ConfigurationBase} = require('./ConfigurationBase');

class MenubarConfig extends ConfigurationBase {
  constructor({config_file = null, config_options = null} = {}) {
    super({root_title: 'Timetrap_TUI', title: 'MenubarConfig', config_options: config_options});
  }
}

MenubarConfig.prototype.loadDefaults = function() {
  this.data = {
    colors: {
      bg: {
        none: null,
        opaque: 'white',
        dark: 'white',
        light: 'black',
        frosty: 'black',
        console: 'white',
        desc: 'the bg color of the menu item',
      },
      fg: {
        none: null,
        opaque: 'white',
        dark: 'white',
        light: 'black',
        frosty: 'black',
        console: 'white',
        desc: 'the fg color of the menu item',
      },
      style: {
        bg: {
          none: null,
          opaque: 'black',
          dark: null,
          light: null,
          frosty: 'white',
          console: null,
          desc: 'the bg color of the menu item',
        },
        fg: {
          none: null,
          opaque: 'white',
          dark: 'gray',
          light: 'black',
          frosty: 'red',
          console: null,
          desc: 'the fg color of the menu item',
        },
        item: {
          bg: {
            none: null,
            opaque: 'black',
            dark: null,
            light: null,
            frosty: 'white',
            console: null,
            desc: 'the bg color of the menu item',
          },
          fg: {
            none: null,
            opaque: 'white',
            dark: 'gray',
            light: 'black',
            frosty: 'gray',
            console: 'blue',
            desc: 'the fg color of the menu item',
          },
        },
        inactive: {
          bg: {
            none: null,
            opaque: 'black',
            dark: null,
            light: null,
            frosty: 'white',
            console: null,
            desc: 'the bg color of the menu item',
          },
          fg: {
            none: null,
            opaque: 'white',
            dark: 'gray',
            light: 'black',
            frosty: 'gray',
            console: 'blue',
            desc: 'the fg color of the menu item',
          },
        },
        prefix: {
          bg: {
            none: null,
            opaque: null,
            dark: null,
            light: null,
            frosty: null,
            console: null,
            desc: 'the bg color of the menu item prefix',
          },
          fg: {
            none: null,
            opaque: 'yellow',
            dark: 'yellow',
            light: 'yellow',
            frosty: 'blue',
            console: 'yellow',
            desc: 'the fg color of the menu item prefix',
          },
        },
        selected: {
          bg: {
            none: null,
            opaque: 'lightblack',
            dark: null,
            light: null,
            frosty: 'lightblue',
            console: 'blue',
            desc: 'the bg color of the selected menu item',
          },
          fg: {
            none: null,
            opaque: 'lightblue',
            dark: 'lightblue',
            light: 'blue',
            frosty: 'black',
            console: 'white',
            desc: 'the fg color of the selected menu item',
          },
        },
      },
    },
  };
};
module.exports = {MenubarConfig};

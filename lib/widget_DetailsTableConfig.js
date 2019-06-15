'use strict';
var {ConfigurationBase} = require('./ConfigurationBase');

class DetailsTableConfig extends ConfigurationBase {
  constructor({config_file = null, config_options = null} = {}) {
    super({root_title: 'Timetrap_TUI', title: 'DetailsTableConfig', config_options: config_options});
  }
}

DetailsTableConfig.prototype.loadDefaults = function() {
  this.data = {
    traits: {
      // width: 25,       //initial width ?? shrink ??
      // left: config.data.traits.left,
      left: 24,
      clock_interval: 1, // interval in whole seconds
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
        console: 'blue',
        desc: 'the fg color of the menu item',
      },
      selectedBg: {
        none: 'none',
        opaque: 'black',
        dark: 'none', // NOTE: TODO: this still hightlights no matter what -bug?! 'none' does a fallback -pfft!
        light: 'none',
        frosty: 'white',
        console: 'none',
        desc: 'the bg color of the selected menu item',
      },
      selectedFg: {
        none: 'none',
        opaque: 'lightblue',
        dark: 'white',
        light: 'blue',
        frosty: 'blue',
        console: 'white',
        desc: 'the fg color of the selected menu item',
      },
      style: {
        border: {
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
            opaque: 'green',
            dark: 'green',
            light: 'green',
            frosty: 'blue',
            console: 'green',
            desc: 'the fg color of the menu item',
          },
        },
        // bg: "none",
        // fg: "blue",
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
          dark: 'none',
          light: 'black',
          frosty: 'black',
          console: 'white',
          desc: 'the fg color of the menu item',
        },
        selected: {
          // bg: "blue",
          // fg: "white",
          bg: {
            none: 'none',
            opaque: 'lightblack',
            dark: 'none',
            light: 'none',
            frosty: 'lightblue',
            console: 'none',
            desc: 'the bg color of the selected menu item',
          },
          fg: {
            none: 'none',
            opaque: 'lightblue',
            dark: 'lightblue',
            light: 'blue',
            frosty: 'black',
            console: 'blue',
            desc: 'the fg color of the selected menu item',
          },
        },
        item: {
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
            dark: 'white',
            light: 'black',
            frosty: 'gray',
            console: 'white',
            desc: 'the fg color of the menu item',
          },
          hover: {
            // bg: "green",
            // fg: "none",
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
              dark: 'white',
              light: 'black',
              frosty: 'gray',
              console: 'white',
              desc: 'the fg color of the menu item',
            },
          },
        },
      },
    },
  };
};
module.exports = {DetailsTableConfig};

'use strict';
var {ConfigurationBase} = require('./ConfigurationBase');

class DetailsStatusConfig extends ConfigurationBase {
  constructor({config_file = null, config_options = null} = {}) {
    super({root_title: 'Timetrap_TUI', title: 'DetailsStatusConfig', config_options: config_options});
  }
}

DetailsStatusConfig.prototype.loadDefaults = function() {
  this.data = {
    traits: {
      width: '100%', // initial width ?? shrink ??
      left: 0,
      top: 2,
      height: 1,
      border: {type: 'none'},
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
      emphasis: {
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
          frosty: 'blue',
          console: 'white',
          desc: 'the fg color of the menu item',
        },
      },
      alert: {
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
          opaque: 'red',
          dark: 'red',
          light: 'red',
          frosty: 'red',
          console: 'red',
          desc: 'the fg color of the menu item',
        },
      },
      // style: {
      //     border: {
      //         bg: {
      //             none: "none",
      //             opaque: "black",
      //             dark: "none",
      //             light: "none",
      //             frosty: "white",
      //             desc: "the bg color of the menu item"
      //         },
      //         fg: {
      //             none: "none",
      //             opaque: "green",
      //             dark: "green",
      //             light: "green",
      //             frosty: "blue",
      //             desc: "the fg color of the menu item"
      //         },
      //     },
      // }
    },
  };
};
module.exports = {DetailsStatusConfig};

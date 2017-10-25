"use strict";
var {ConfigurationBase} = require('./ConfigurationBase');

class MenubarConfig extends ConfigurationBase {
    constructor({config_file = null, config_options = null} ={}) {
        super({root_title: 'Timetrap_TUI', title: 'MenubarConfig', config_options: config_options});
    }
}
MenubarConfig.prototype.loadDefaults = function() {
    this.data = {
        colors: {
            style: {
                item: {
                    bg: {
                        none: null,
                        opaque: null,
                        dark: null,
                        light: null,
                        desc: "the bg color of the menu item"
                    },
                    fg: {
                        none: null,
                        opaque: "white",
                        dark: "white",
                        light: "black",
                        desc: "the fg color of the menu item"
                    },
                },
                prefix: {
                    bg: {
                        none: null,
                        opaque: null,
                        dark: null,
                        light: null,
                        desc: "the bg color of the menu item prefix"
                    },
                    fg: {
                        none: null,
                        opaque: "yellow",
                        dark: "yellow",
                        light: "black",
                        desc: "the fg color of the menu item prefix"
                    },
                },
                selected: {
                    bg: {
                        none: null,
                        opaque: "black",
                        dark: "black",
                        light: "white",
                        desc: "the bg color of the selected menu item"
                    },
                    fg: {
                        none: null,
                        opaque: "lightblue",
                        dark: "lightblue",
                        light: "black",
                        desc: "the fg color of the selected menu item"
                    },
                },
            }
        },
    };
}
module.exports = {MenubarConfig};

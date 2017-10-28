"use strict";
var {ConfigurationBase} = require('./ConfigurationBase');

class ViewMainConfig extends ConfigurationBase {
    constructor({config_file = null, config_options = null} ={}) {
        super({root_title: 'Timetrap_TUI', title: 'ViewMainConfig', config_options: config_options});
    }
}

ViewMainConfig.prototype.loadDefaults = function() {
    this.data = {
        traits: {
        },
        colors: {
            bg: {
                none: "none",
                opaque: "black",
                dark: "none",
                light: "none",
                frosty: "white",
                desc: "the bg color of the menu item"
            },
            fg: {
                none: "none",
                opaque: "white",
                dark: "gray",
                light: "black",
                frosty: "red",
                desc: "the fg color of the menu item"
            },
            focuslines: {
                bg: {
                    none: "none",
                    opaque: "black",
                    dark: "none",
                    light: "none",
                    frosty: "white",
                    desc: "the bg color of the menu item"
                },
                fg: {
                    none: "none",
                    opaque: "green",
                    dark: "green",
                    light: "green",
                    frosty: "blue",
                    desc: "the fg color of the menu item"
                },
                disabled: {
                    bg: {
                        none: "none",
                        opaque: "black",
                        dark: "none",
                        light: "none",
                        frosty: "white",
                        desc: "the bg color of the menu item"
                    },
                    fg: {
                        none: "none",
                        opaque: "red",
                        dark: "red",
                        light: "red",
                        frosty: "red",
                        desc: "the fg color of the menu item"
                    },
                }
            },
        }
    };
}
module.exports = {ViewMainConfig};

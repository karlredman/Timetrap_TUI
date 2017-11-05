"use strict";
var {ConfigurationBase} = require('./ConfigurationBase');

class DialogConfig extends ConfigurationBase {
    constructor({config_file = null, config_options = null} ={}) {
        super({root_title: 'Timetrap_TUI', title: 'MessageConfig', config_options: config_options});
    }
}

DialogConfig.prototype.loadDefaults = function() {
    this.data = {
        colors: {
            bg: {
                none: null,
                opaque: "white",
                dark: "white",
                light: "black",
                frosty: "black",
                desc: "the bg color of the menu item"
            },
            fg: {
                none: null,
                opaque: "white",
                dark: "white",
                light: "black",
                frosty: "black",
                desc: "the fg color of the menu item"
            },
            border: {
                bg: {
                    none: null,
                    opaque: "gray",
                    dark: null,
                    light: null,
                    frosty: "blue",
                    desc: "the bg color of the menu item"
                },
                fg: {
                    none: null,
                    opaque: "white",
                    dark: "white",
                    light: "black",
                    frosty: "white",
                    desc: "the fg color of the menu item"
                },
            },
            style: {
                bg: {
                    none: null,
                    opaque: "gray",
                    dark: null,
                    light: null,
                    frosty: "gray",
                    desc: "the bg color of the menu item"
                },
                fg: {
                    none: null,
                    opaque: "white",
                    dark: "white",
                    light: "black",
                    frosty: "white",
                    desc: "the fg color of the menu item"
                },
            }
        }
    };
}
module.exports = {DialogConfig};

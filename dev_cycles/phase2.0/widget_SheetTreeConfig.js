"use strict";
var {ConfigurationBase} = require('./ConfigurationBase');

class SheetTreeConfig extends ConfigurationBase {
    constructor({config_file = null, config_options = null} ={}) {
        super({root_title: 'Timetrap_TUI', title: 'SheetTreeConfig', config_options: config_options});
    }
}

SheetTreeConfig.prototype.loadDefaults = function() {
    this.data = {
        traits: {
            width: 25,      //initial width ?? shrink ??
        },
        colors: {
            bg: {
                none: null,
                opaque: "black",
                dark: null,
                light: null,
                frosty: "white",
                desc: "the bg color of the menu item"
            },
            fg: {
                none: null,
                opaque: "white",
                dark: "gray",
                light: "black",
                frosty: "red",
                desc: "the fg color of the menu item"
            },
            style: {
                border: {
                    bg: {
                        none: null,
                        opaque: "black",
                        dark: null,
                        light: null,
                        frosty: "white",
                        desc: "the bg color of the menu item"
                    },
                    fg: {
                        none: null,
                        opaque: "green",
                        dark: "green",
                        light: "black",
                        frosty: "black",
                        desc: "the fg color of the menu item"
                    },
                },
                // bg: null,
                // fg: "blue",
                bg: {
                    none: null,
                    opaque: "black",
                    dark: null,
                    light: null,
                    frosty: "white",
                    desc: "the bg color of the menu item"
                },
                fg: {
                    none: null,
                    opaque: "white",
                    dark: "blue",
                    light: "black",
                    frosty: "red",
                    desc: "the fg color of the menu item"
                },
                selected: {
                    // bg: "blue",
                    // fg: "white",
                    bg: {
                        none: null,
                        opaque: "lightblack",
                        dark: "none",
                        light: null,
                        frosty: "lightblue",
                        desc: "the bg color of the selected menu item"
                    },
                    fg: {
                        none: null,
                        opaque: "lightblue",
                        dark: "white",
                        light: "blue",
                        frosty: "black",
                        desc: "the fg color of the selected menu item"
                    },
                },
                item: {
                    bg: {
                        none: null,
                        opaque: "black",
                        dark: null,
                        light: null,
                        frosty: "white",
                        desc: "the bg color of the menu item"
                    },
                    fg: {
                        none: null,
                        opaque: "white",
                        dark: "blue",
                        light: "black",
                        frosty: "gray",
                        desc: "the fg color of the menu item"
                    },
                    hover: {
                        // bg: "green",
                        // fg: null,
                        bg: {
                            none: null,
                            opaque: "black",
                            dark: "green",
                            light: null,
                            frosty: "white",
                            desc: "the bg color of the menu item"
                        },
                        fg: {
                            none: null,
                            opaque: "white",
                            dark: null,
                            light: "black",
                            frosty: "gray",
                            desc: "the fg color of the menu item"
                        },
                    },
                },
            },
        }
    }
}
module.exports = {SheetTreeConfig};

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
            style: {
                border: {
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
                },
                // bg: "none",
                // fg: "blue",
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
                    dark: "blue",
                    light: "black",
                    frosty: "red",
                    desc: "the fg color of the menu item"
                },
                selected: {
                    // bg: "blue",
                    // fg: "white",
                    bg: {
                        none: "none",
                        opaque: "lightblack",
                        dark: "none",
                        light: "none",
                        frosty: "lightblue",
                        desc: "the bg color of the selected menu item"
                    },
                    fg: {
                        none: "none",
                        opaque: "lightblue",
                        dark: "white",
                        light: "blue",
                        frosty: "black",
                        desc: "the fg color of the selected menu item"
                    },
                },
                item: {
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
                        dark: "blue",
                        light: "black",
                        frosty: "gray",
                        desc: "the fg color of the menu item"
                    },
                    hover: {
                        // bg: "green",
                        // fg: "none",
                        bg: {
                            none: "none",
                            opaque: "black",
                            dark: "green",
                            light: "none",
                            frosty: "white",
                            desc: "the bg color of the menu item"
                        },
                        fg: {
                            none: "none",
                            opaque: "white",
                            dark: "none",
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

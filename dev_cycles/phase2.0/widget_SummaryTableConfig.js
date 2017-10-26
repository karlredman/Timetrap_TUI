"use strict";
var {ConfigurationBase} = require('./ConfigurationBase');

class SummaryTableConfig extends ConfigurationBase {
    constructor({config_file = null, config_options = null} ={}) {
        super({root_title: 'Timetrap_TUI', title: 'SummaryTableConfig', config_options: config_options});
    }
}

SummaryTableConfig.prototype.loadDefaults = function() {
    this.data = {
        traits: {
            // width: 25,      //initial width ?? shrink ??
            //left: config.data.traits.left,
            left: 24,
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
            selectedBg: {
                none: null,
                opaque: "black",
                dark: "stupid", //NOTE: TODO: this still hightlights no matter what -bug?! 'stupid' does a fallback -pfft!
                light: "none",
                frosty: "lightblue",
                desc: "the bg color of the selected menu item"
            },
            selectedFg: {
                none: null,
                opaque: "lightblue",
                dark: "white",
                light: "blue",
                frosty: "black",
                desc: "the fg color of the selected menu item"
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
                    dark: null,
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
                        dark: null,
                        light: null,
                        frosty: "lightblue",
                        desc: "the bg color of the selected menu item"
                    },
                    fg: {
                        none: null,
                        opaque: "lightblue",
                        dark: "lightblue",
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
                        dark: "white",
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
                            dark: null,
                            light: null,
                            frosty: "white",
                            desc: "the bg color of the menu item"
                        },
                        fg: {
                            none: null,
                            opaque: "white",
                            dark: "white",
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
module.exports = {SummaryTableConfig};

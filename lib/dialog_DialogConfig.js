"use strict";
var {ConfigurationBase} = require('./ConfigurationBase');

class DialogConfig extends ConfigurationBase {
    constructor({config_file = null, config_options = null} ={}) {
        super({root_title: 'Timetrap_TUI', title: 'MessageConfig', config_options: config_options});
    }
}

DialogConfig.prototype.loadDefaults = function() {
    this.data = {
        traits: {
            lockKeys: true,
            keys: true,
            tags: true,
            align: 'center',
            left: 'center',
            top: 'center',
            width: '50%',
            height: 10,
            //
            mouse: true,
            vi: true,
            input: true,
            keyable: true,
            interactive: true,

        },
        colors: {
            bg: {
                none: "none",
                opaque: "gray",
                dark: "none",
                light: "none",
                frosty: "gray",
                console: "none",
                desc: "the bg color of the menu item"
            },
            fg: {
                none: "none",
                opaque: "white",
                dark: "blue",
                light: "black",
                frosty: "white",
                console: "blue",
                desc: "the fg color of the menu item"
            },
            selectedBg: {
                none: "none",
                opaque: "white",
                dark: "none",
                light: "none",
                frosty: "white",
                console: "none",
                desc: "the bg color of the selected menu item"
            },
            selectedFg: {
                none: "none",
                opaque: "blue",
                dark: "white",
                light: "blue",
                frosty: "blue",
                console: "white",
                desc: "the fg color of the selected menu item"
            },
            border: {
                bg: {
                    none: "none",
                    opaque: "gray",
                    dark: "none",
                    light: "none",
                    frosty: "blue",
                    console: "none",
                    desc: "the bg color of the menu item"
                },
                fg: {
                    none: "none",
                    opaque: "white",
                    dark: "white",
                    light: "black",
                    frosty: "white",
                    console: "white",
                    desc: "the fg color of the menu item"
                },
            },
            style: {
                bg: {
                    none: "none",
                    opaque: "gray",
                    dark: "none",
                    light: "none",
                    frosty: "gray",
                    console: "none",
                    desc: "the bg color of the menu item"
                },
                fg: {
                    none: "none",
                    opaque: "white",
                    dark: "white",
                    light: "black",
                    frosty: "white",
                    console: "white",
                    desc: "the fg color of the menu item"
                },
                border: {
                    bg: {
                        none: "none",
                        opaque: "gray",
                        dark: "none",
                        light: "none",
                        frosty: "blue",
                        console: "none",
                        desc: "the bg color of the menu item"
                    },
                    fg: {
                        none: "none",
                        opaque: "white",
                        dark: "white",
                        light: "black",
                        frosty: "white",
                        console: "white",
                        desc: "the fg color of the menu item"
                    },
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
                        console: "none",
                        desc: "the bg color of the selected menu item"
                    },
                    fg: {
                        none: "none",
                        opaque: "lightblue",
                        dark: "lightblue",
                        light: "blue",
                        frosty: "black",
                        console: "blue",
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
                        console: "none",
                        desc: "the bg color of the menu item"
                    },
                    fg: {
                        none: "none",
                        opaque: "white",
                        dark: "white",
                        light: "black",
                        frosty: "gray",
                        console: "white",
                        desc: "the fg color of the menu item"
                    },
                    hover: {
                        // bg: "green",
                        // fg: "none",
                        bg: {
                            none: "none",
                            opaque: "black",
                            dark: "none",
                            light: "none",
                            frosty: "white",
                            console: "none",
                            desc: "the bg color of the menu item"
                        },
                        fg: {
                            none: "none",
                            opaque: "white",
                            dark: "white",
                            light: "black",
                            frosty: "gray",
                            console: "white",
                            desc: "the fg color of the menu item"
                        },
                    },
                },
            }
        }
    };
}
module.exports = {DialogConfig};

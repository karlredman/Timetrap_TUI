"use strict";

// packages
var blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    Node = blessed.Node;


function PanelLoggerBox(options) {

    if (!(this instanceof Node)) return new PanelLoggerBox(options);
    let _this=this;

    //required
    _this.screen = options.parent;
    _this.view = options.view;
    _this.config = _this.view.config;
    _this.log_count = 0;

    // options = {
    //     fg: "green",
    //     label: 'Server Log',
    //     height: "20%",
    //     tags: true,
    //     border: {
    //         type: "line",
    //         fg: "cyan"
    //     }
    // }

    //this class
    options.interval = options.interval || 500;

    //all logs
    options.keys = true;
    options.mouse = options.mouse || true;
    options.vi = options.vi || true;
    options.tags = options.tags || true;
    options.wrap = true;

    options.style = options.style || {};

    options.style.bg = options.style.bg || _this.config.settings.tui_logger_bg.value;
    options.style.fg = _this.config.settings.tui_logger_fg.value;

    //options.style.bg = options.style.bg || _this.config.settings.tui_logger_bg.value;
    //options.style.fg = options.style.fg || _this.config.settings.tui_logger_fg.value;

    options.label = options.label || undefined;

    options.height = options.height || undefined;

    // options.border = options.border || {};
    // options.border.type = options.border.type || "line";
    // options.border.fg = options.border.fg || "cyan";

    options.scrollable = options.scrollable || true;
    options.scrollbar = options.scrollbar || {};
    options.scrollbar.ch = options.scrollbar.ch || ' ';

    options.style = options.style || {};
    options.style.scrollbar = options.style.scrollbar || {};
    options.style.scrollbar.inverse = options.style.scrollbar.inverse || true;

    //options.content = "xxxxxxxxxxxxxxxxxxxx"

    contrib.log.call(this, options);

    _this.interactive = true

    //log levels
    _this.loglevel = {
        //this is structured to enforce intended audience declaration for log messages
        //i.e. _this.msg("something interesting", _this.loglevel.production.warning)
        value: _this.config.settings.tui_logger_loglevel.value,
        meta: {
            message_bg: options.tui_logger_message_bg || _this.config.settings.tui_logger_message_bg.value,
            message_fg: options.tui_logger_message_fg || _this.config.settings.tui_logger_message_fg.value,
            //
            warning_bg: options.tui_logger_warning_bg || _this.config.settings.tui_logger_warning_bg.value,
            warning_fg: options.tui_logger_warning_fg || _this.config.settings.tui_logger_warning_fg.value,
            //
            error_bg: options.tui_logger_error_bg || _this.config.settings.tui_logger_error_bg.value,
            error_fg: options.tui_logger_error_fg || _this.config.settings.tui_logger_error_fg.value,
            //
            message_prefix: "",
            warning_prefix: "{bold}Warning: {/bold}",
            error_prefix: "{bold}Error: {/bold}",

        },
        production: {
            message: 0,
            warning: 1,
            error: 2,
        },
        debug: {
            message: 10,
            warning: 11,
            error: 12,
        },
        devel: {
            message: 20,
            warning: 21,
            error: 22,
        },
    }

    options.style.align = 'center'; //??

}
PanelLoggerBox.prototype = Object.create(contrib.log.prototype);
PanelLoggerBox.prototype.constructor = PanelLoggerBox;


PanelLoggerBox.prototype.register_actions = function(view){
    let _this = this;

    // TODO: move to proper place in init chain
    _this.log("{center}Welcome to Timetrap TUI!{/}");

    //TODO: this is just here for testing
    // let i = 0
    // setInterval(function() {_this.log("{center}new {red-fg}log{/red-fg} line xxxxx-xxxxx-xxxxx-xxxxx-xxxxx: {/}"+ i++); _this.screen.render()}, 5000)
    // setInterval(function() {
    //     //_this.log("{center}new {red-fg}log{/red-fg} line xxxxx-xxxxx-xxxxx-xxxxx-xxxxx: {/}"+ i++);
    //     _this.msg("thing", _this.loglevel.production.error);
    //     _this.screen.render()
    // }, 5000)

    this.on('keypress', function(ch, key) {
        if (key.name === 'tab') {
            if (!key.shift) {
                this.view.setWinFocusNext();
            } else {
                this.view.setWinFocusPrev();
            }
            return;
        }
    });
}

PanelLoggerBox.prototype.msg = function(message, loglevel){
    let _this = this;

        //we default to message
        let bg = _this.loglevel.meta.message_bg;
        let fg = _this.loglevel.meta.message_fg;
        let prefix = _this.loglevel.meta.message_prefix;

    if (
        ( loglevel == _this.loglevel.production.warning )
        || ( loglevel == _this.loglevel.debug.warning )
        || ( loglevel == _this.loglevel.devel.warning )
    ){
        bg = _this.loglevel.meta.warning_bg;
        fg = _this.loglevel.meta.warning_fg;
        prefix = _this.loglevel.meta.warning_prefix;
    }
    if (
        ( loglevel == _this.loglevel.production.error )
        || ( loglevel == _this.loglevel.debug.error )
        || ( loglevel == _this.loglevel.devel.error )
    ){
        bg = _this.loglevel.meta.error_bg;
        fg = _this.loglevel.meta.error_fg;
        prefix = _this.loglevel.meta.error_prefix;
    }

    _this.log_count++;
    _this.log(
        '{center}'
        + "{"+bg+"-bg}"
        + '['+_this.log_count+'] '
        + "{"+fg+"-fg}"
        + prefix
        + "{/"+fg+"-fg}"
        + message
        + "{/"+bg+"-bg}"
        + '{/center}'
    );
}


PanelLoggerBox.prototype.type = 'PanelLoggerBox';
module.exports = PanelLoggerBox;

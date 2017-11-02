"use strict";

// dependencies
var blessed = require('blessed'),
    BlessedBox = blessed.Box;

// project includes
//var {DetailsStatusConfig} = require('./widget_DetailsStatusConfig');
var {TimetrapTUI_Error} = require('./Errors');
var helpers = require('./helpers');


class DetailsStatus extends BlessedBox {
    constructor({parent = helpers.requiredParam('parent'), options ={},
        theme = 'opaque', config = helpers.requiredParam('config'),
        logger = helpers.requiredParam('logger'),
        view = helpers.requiredParam('view')} ={})
    {
        let defaults = {
            parent: parent,
            //
            left: config.data.traits.left,
            top: config.data.traits.top,
            width: config.data.traits.width,
            height: config.data.traits.height,
            tags: true,
            align: 'center',
            bg: config.data.colors.bg[theme],
            fg: config.data.colors.fg[theme],
            //content: "some content",
        };
        options = Object.assign({}, defaults, options);

        super(options);

        this.view = view;
        //this.log = logger;
        this.theme = theme;
        this.config = config;
        this.timetrap = this.view.controller.timetrap;

        this.setContent("Loading...");
    }
}

DetailsStatus.prototype.registerActions = function(){
    // this.on('update_status', (sheet, type, running, total_time) => {
    //     this.setStatus(sheet, type, running, total_time);
    // });
    this.on('update_status', this.setStatus);
}

DetailsStatus.prototype.setStatus = function(sheet, type, running, total_time_str){
    // TODO: replace with real solution
    // //grab the ticking total time from the main view (TODO: fix. this is hack-ish)
    if(running){
        let selected = this.view.controller.views.main.widgets.sheettree.rows.selected
        let idx = this.view.controller.views.main.widgets.sheettree.rows.getItemIndex(selected);

        // grab only today
        total_time_str = this.view.controller.views.main.widgets.summarytable.list[idx].info.today;
    }

    //let message = sheet + ' ['+type+']/'+total_time.toString().toHMMSS();
    let message = sheet + ' ['+type+']/'+total_time_str;
    if(running){
        message += '{'+this.config.data.colors.emphasis.fg[this.theme]+'-fg}*{/'+this.config.data.colors.emphasis.fg[this.theme]+'-fg}';
    }
    this.setContent(message);
    this.view.screen.render();
}
module.exports = {DetailsStatus};

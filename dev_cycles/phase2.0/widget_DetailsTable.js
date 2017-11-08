"use strict";

// dependencies
var blessed = require('blessed'),
    Contrib = require('blessed-contrib'),
    ContribTable = Contrib.table,
    BlessedBox = blessed.Box;

// project includes
//var {SummaryTableConfig} = require('./widget_SummaryListTable');
var {TimetrapTUI_Error} = require('./Errors');
var helpers = require('./helpers');

// debugging
var util = require('util');

class DetailsTable extends ContribTable {
    constructor({parent = helpers.requiredParam('parent'), options ={},
        theme = 'opaque', config = helpers.requiredParam('config'),
        logger = helpers.requiredParam('logger'),
        view = helpers.requiredParam('view'),
        focusable = false } ={})
    {

        let defaults = {
            // wrap: true,
            // hidden: false,
            // fixed: true,
            parent: parent,
            screen: options.parent,
            //
            left: 0,
            top: 1,
            bottom: 1,
            //
            columnWidth: [11,11,11,64],
            columnSpacing: 2,
            //
            // ignoreKeys: true,
            // scrollable: true,
            //
            mouse: true,
            keys: true,
            vi: true,
            input: true,
            keyable: true,
            interactive: true,
            //
            border: {type: "line"},
            tags: true,
            //
            bg: config.data.colors.bg[theme],
            fg: config.data.colors.fg[theme],
            selectedBg: config.data.colors.selectedBg[theme],
            selectedFg: config.data.colors.selectedFg[theme],
            //
            style: {
                bg: config.data.colors.style.bg[theme],
                fg: config.data.colors.style.fg[theme],
                //
                border: {
                    bg: config.data.colors.style.border.bg[theme],
                    fg: config.data.colors.style.border.fg[theme],
                },
                //
                selected: {
                    bg: config.data.colors.style.selected.bg[theme],
                    fg: config.data.colors.style.selected.fg[theme],
                },
                //
                item: {
                    bg: config.data.colors.style.item.bg[theme],
                    fg: config.data.colors.style.item.fg[theme],
                    hover: {
                        bg: config.data.colors.style.item.hover.bg[theme],
                        fg: config.data.colors.style.item.hover.fg[theme],
                    },
                },
            },
            columnWidth: [6,16,8,8,12,64],
            columnSpacing: 3,
        };

        // merge options into defaults
        //shallow copy is fine here
        options = Object.assign({}, defaults, options);

        super(options);

        //fix bg color in embedded list (rows)
        this.rows.options.style.bg = config.data.colors.style.bg[theme];
        this.rows.options.style.fg = config.data.colors.style.fg[theme];

        // saved options
        this.log = logger;
        this.theme = theme;
        this.config = config;
        this.view = view;
        //
        //this.input = true; ??
        //this.keyable = true ??

        // artificially track the elapsed time of running clocks
        this.fake_timer_time = 0;
        this.fake_timer = undefined;
        this.list = undefined;
        this.total_time = 0;

        //seed items for table
        this.items = {
            headers: ["  Id"  , "      Day"       , "  Start", "   End"   ," Duration", " Notes"],
            data:[
            ]};

        //keyboard control
        if(focusable){
            this.focus();
        }

        // grab local datascructures, etc.
        this.init();
    }
}

DetailsTable.prototype.init = function() {
}

DetailsTable.prototype.process_commands = function(emit_obj) {
}

DetailsTable.prototype.registerActions = function() {
    let _this = this;

    // for fetch and display of running items
    let id = '------';
    let note = '';

    this.view.timetrap.on('command_complete', (emit_obj) => {

        if(emit_obj.owner === 'details_table_now'){
            // we're here to figure out running clock info

            // find sheet
            let arr = emit_obj.data.stdoutData.split("\n");
            let duration = '0:00:00';

            //record looks like this:
            //*Projects.Timetrap_TUI: 2:28:14 (cleanup dispaly starting dialogs)

            // obtain note / find duration
            //let note = '';
            if(arr.length > 0) {
                for ( let i=0; i < arr.length; i++ ) {
                    //sheet portion
                    let chunk = arr[i].slice(1,arr[i].length);
                    let sheet = chunk.split(':')[0];

                    if(sheet === _this.view.sheet){
                        //figure out the current durration
                        //let d1 = arr[i].split(' ')
                        let d1 = chunk.split(' ')
                        duration = d1[1];

                        //grab the note if it exists
                        let idx = chunk.indexOf('(');
                        if(idx > -1){
                            note = chunk.slice(idx+1, chunk.length-1);
                        }
                        // calculate the start time
                        let n = new Date();
                        let a = duration.split(':');
                        let seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
                        n.setSeconds(n.getSeconds()-seconds);
                        let start_time = helpers.zeropad(n.getHours())
                            +":" +helpers.zeropad(n.getMinutes())
                            +":" +helpers.zeropad(n.getSeconds());

                        // our abreviations
                        let days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
                        let months = ['Jan','Feb','Mar','Apr','May','Jun',
                            'Jul','Aug','Sep','Oct','Nov','Dec'];

                        let start_date = days[n.getDay()]+" "
                            +helpers.zeropad(months[n.getMonth()])+" "
                            +helpers.zeropad(n.getDate())
                            +", "+n.getFullYear();

                        // append to table
                        let rec = [id, start_date, start_time, '--------', duration, note];
                        _this.items.data.push(rec);
                        _this.setData(_this.items);

                        // update the status widget
                        _this.view.widgets.details_status.emit('update_status',
                            //emit_obj.data.sheet, emit_obj.data.type, _this.view.running,
                            this.view.sheet, emit_obj.data.type, _this.view.running,
                            _this.total_time.toString().toHMMSS());
                    }
                }
            }
            return;
        }

        if(emit_obj.owner === 'details_table_ids'){
            if(emit_obj.data.type === 'ids'){
                //// running_id = <t d -fids>[length-1]
                 let id_ar = emit_obj.data.stdoutData.split(' ');
                 id = id_ar[id_ar.length-1].split('\n')[0];
                // get list of sheets via 'now'
                 _this.view.timetrap.callCommand({type: 'now',
                     sheet: this.view.sheet, owner: 'details_table_now',
                     sync: true});
            }
        }

        if(emit_obj.owner === 'detailstable'){
            if(
                (emit_obj.type = 'today')
                || (emit_obj.type = 'yesterday')
                || (emit_obj.type = 'week')
                || (emit_obj.type = 'month')
                || (emit_obj.type = 'display')
            )
            {
                //verify no errors
                //if(typeof emit_obj.data.code !== 0){
                if(typeof emit_obj.data.stderrData !== 'undefined'){
                    if ( emit_obj.data.stderrData != '' ){
                        _this.log.msg('DetailsView: '+emit_obj.data.stderrData, _this.log.loglevel.production.warning);
                        return;
                    }
                }
                else {
                    _this.log.msg('DetailsView: display stderr === \'undefined\'', _this.log.loglevel.devel.warning);
                }

                if(typeof emit_obj.data.stdoutData !== 'undefined') {

                    // we expect json
                    // Note: this json method is kind of dumb since we have to do a full text output for running clocks anyway.
                    // The use cases are that most editing will be performed on clocks that are *not* running
                    // and that most of the editing on *running sheets* that will occur on previous entries
                    //
                    let content = JSON.parse(String(emit_obj.data.stdoutData));

                    if(content.length === 0) {
                        if(_this.view.running){
                            _this.view.timetrap.callCommand({type:'ids', sheet: _this.view.sheet, owner: 'details_table_ids', sync: true});
                        }
                        _this.log.msg('DetailsView: No data for '+emit_obj.data.type, _this.log.loglevel.production.warning);
                        this.view.widgets.details_status.emit('update_status', emit_obj.data.sheet, emit_obj.data.type, this.view.running, '0:00:00')
                        //this.view.widgets.details_status.emit('update_status', _this.view.sheet, emit_obj.data.type, this.view.running, '0:00:00')
                        //statusbox.emit('update_status', emit_obj.data.sheet, emit_obj.data.type, _this.view.running, '0:00:00')
                        return;
                    }

                    // _this.processList(emit_obj.data.stdoutData);

                    let items = {
                        headers: ["  Id"  , "      Day"       , "  Start", "   End"   ," Duration", " Notes"],
                        data:[
                        ]};

                    /////////////////////////// build table content

                    // reset total time
                    _this.total_time = 0;

                    for( let i in content ){
                        let tmp = [];

                        //id
                        tmp.push(content[i].id);

                        // calculate the day (always take start date)
                        //tmp.push("Thu Oct 12, 2017");
                        // format the string to an ISO8601 date string
                        // data format:  "2017-10-09 11:31:54 -0500"
                        // ISO8601 FORMAT: "2017-10-09T11:31:54.000-0500"

                        let da = content[i].start.split(" ");
                        let ds = String(da[0]+'T'+da[1]+'.000'+da[2]);
                        let start = new Date(ds);

                        //format day for table
                        da = start.toString().split(" ");
                        tmp.push(String(da[0]+" "+da[1]+" "+da[2]+", "+da[3]));


                        //start
                        tmp.push(content[i].start.split(" ")[1]);
                        //end
                        tmp.push(content[i].end.split(" ")[1]);

                        //calculating
                        da = content[i].end.split(" ");
                        ds = String(da[0]+'T'+da[1]+'.000'+da[2]);
                        let end = new Date(ds);

                        // add elapsed time to tmp array
                        let delta = (end - start)/1000;
                        tmp.push(delta.toString().toHMMSS());

                        //keep running total
                        _this.total_time += delta;

                        //notes
                        tmp.push(content[i].note);

                        //populate
                        items.data.push(tmp);
                    }
                    //update the class variable
                    _this.items = items;

                    // update the list so far
                    _this.setData(_this.items);

                    // accomidate for running clocks -to get the id and the faketimer going
                    // Note: this is where we breakdown in efficiency -grabbing full text output
                    // it is probably better to just switch to a single call someday??


                    // if running
                    if(_this.view.running){
                        //// obtain running id
                        _this.view.timetrap.callCommand({type:'ids', sheet: _this.view.sheet, owner: 'details_table_ids', sync: true});

                        // this is part of this sequence
                        ////// running_id = <t d -fids>[length-1]
                        //// obtain note
                        ////// note = <t now> ... (see, timetrap.stopAllTimers
                        //// append to table
                    }

                    // update the satusbar -- TODO: (bug) emit_obj.data.sheet is getting lost somewhere
                    _this.view.widgets.details_status.emit('update_status',
                        // emit_obj.data.sheet, emit_obj.data.type, _this.view.running,
                        _this.view.sheet, emit_obj.data.type, _this.view.running,
                        _this.total_time.toString().toHMMSS());
                    //
                    // statusbox.emit('update_status', emit_obj.data.sheet, emit_obj.data.type,
                    //     _this.view.running, _this.total_time.toString().toHMMSS());


                    _this.log.msg('DetailsTable: Display '+emit_obj.data.sheet+'|'+emit_obj.data.type, _this.log.loglevel.devel.message);
                }
                else {
                    _this.log.msg('DetailsTable: display stdout == undefined', _this.log.loglevel.devel.warning);
                }
            }
        }
    });

    this.rows.on('keypress', function(ch, key) {
        if (key.name === 'tab') {
            if (!key.shift) {
                _this.view.setWinFocusNext();
            } else {
                _this.view.setWinFocusPrev();
            }
            return;
        }
        if (
            ( key.name === 'pagedown' )
        )
        {
            //_this.emit('keypress', 'C-d',{name:'d',sequence: '\u0004', ctrl: true, full:'C-d'})
            this.emit('keypress', 'C-d',{name:'d', ctrl: true, full:'C-d'})
        }
        if ( key.name === 'pageup')
        {
            //_this.emit('keypress', 'C-u',{name:'u',sequence: '\u0015', ctrl: true, full:'C-u'})
            this.emit('keypress', 'C-u',{name:'u', ctrl: true, full:'C-u'})
        }
    });

    // manage mouse things
    _this.rows.on('mouse', function(ch, key) {
        let idx = this.getItemIndex(this.selected);
        this.select(idx);
    });
    _this.rows.on('element wheeldown', function(foo, bar) {
        this.down();
        let idx = this.getItemIndex(this.selected);
    });
    _this.rows.on('element wheelup', function(foo, bar) {
        this.up();
        let idx = this.getItemIndex(this.selected);
    });
    _this.rows.on('element click', function(foo, data) {
        let idx = data.y-4
    });
    _this.rows.on('click', function(data, bar) {
        let idx = data.y-4
        this.select(idx);
    });

    // manage selections
    _this.rows.on('element select', function(foo, bar) {
        let idx = this.getItemIndex(this.selected);
    });
    _this.rows.on('select', function(foo, bar){
        let idx = this.getItemIndex(this.selected);
    });

}


module.exports = {DetailsTable};

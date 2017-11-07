"use strict";

// dependencies
var blessed = require('blessed'),
    Listbar = blessed.listbar;

// project includes
var {MenubarConfig} = require('./widget_MenubarConfig');
var {TimetrapTUI_Error} = require('./Errors');
var helpers = require('./helpers');

// dialogs
var {Message} = require('./dialog_Message.js')
var {Prompt} = require('./dialog_Prompt.js')
var {Question} = require('./dialog_Question.js')

// debugging
var util = require('util');

class Menubar extends Listbar {
    constructor({parent = helpers.requiredParam('parent'), options ={},
        theme = 'opaque', config = helpers.requiredParam('config'),
        logger = helpers.requiredParam('logger'),
        view = helpers.requiredParam('view')} ={}) {

        let defaults = {
            parent: parent,
            //
            autoCommandKeys: true,
            //
            height: 1,
            top: 0,
            left: 0,
            width: '100%',
            //
            keys: false,            //we're overriding keys
            //xkeys: true,
            mouse: true,
            vi: true,
            //
            scrollable: true,
            invertSelected: false,
            //
            bg: config.data.colors.bg[theme],
            fg: config.data.colors.fg[theme],
            //
            style: {
                    bg: config.data.colors.style.bg[theme],
                    fg: config.data.colors.style.fg[theme],
                item: {
                    bg: config.data.colors.style.item.bg[theme],
                    fg: config.data.colors.style.item.fg[theme],
                },
                prefix: {
                    bg: config.data.colors.style.prefix.bg[theme],
                    fg: config.data.colors.style.prefix.fg[theme],
                },
                selected: {
                    bg: config.data.colors.style.selected.bg[theme],
                    fg: config.data.colors.style.selected.fg[theme],
                },
            },
        };

        // merge options into defaults
        options = Object.assign(defaults, options);

        // call parent constructor
        super(options);

        // saved options
        this.theme = theme;
        this.config = config;
        this.log = logger;
        this.view = view;

        // log is interactive (for parent contrib.log)
        this.interactive = true

        // grab local datascructures, etc.
        this.init();
    }
}

Menubar.prototype.registerActions = function() {
    let _this = this;

    this.on('blur', function() {
        //always reset the menu to first option
        _this.select(0);
    });
    this.on('focus', function() {
        //always reset the menu to first option
        _this.select(0);
    });

    this.on('keypress', function(ch, key) {
        // custom key bindings
        if (key.name === 'tab') {
            if (!key.shift) {
                _this.view.setWinFocusNext();
            } else {
                _this.view.setWinFocusPrev();
            }
            return;
        }
        if (key.name === 'left'
            || (_this.options['vi'] && key.name === 'h')
            //|| (key.shift && key.name === 'tab')
        ) {
            // let item = _this.items[_this.selected];
            // item.style.bg = null;
            // item.style.fg = "white";
            _this.moveLeft();
            //item = _this.items[_this.selected];
            // item.style.bg = "black";
            // item.style.fg = "lightblue";
            _this.screen.render();
            // Stop propagation if we're in a form.
            //if (key.name === 'tab') return false;
            return;
        }
        if (key.name === 'right'
            || (_this.options['vi'] && key.name === 'l')
            //|| key.name === 'tab'
        ) {
            // let item = _this.items[_this.selected];
            // item.style.bg = null;
            // item.style.fg = "white";
            _this.moveRight();
            // item = _this.items[_this.selected];
            // item.style.bg = "black";
            // item.style.fg = "lightblue";
            _this.screen.render();
            // Stop propagation if we're in a form.
            //if (key.name === 'tab') return false;
            return;
        }
        if (key.name === 'enter'
            || (_this.options['vi'] && key.name === 'k' && !key.shift)) {
            _this.emit('action', _this.items[_this.selected], _this.selected);
            _this.emit('select', _this.items[_this.selected], _this.selected);
            let item = _this.items[_this.selected];
            if (item._.cmd.callback) {
                item._.cmd.callback();

                // //TODO: timer to set 'unselected'
                // setTimeout(function(){
                //     // item.style.bg = null;
                //     // item.style.fg = "white";
                //     _this.select(0);
                //     _this.screen.render();
                // }, 1000);
            }
            _this.screen.render();
            return;
        }
    });

    this.on('message_ack', (data, error)=> {
        console.log("got here");
    });

    this.on('prompt', function(data){
        if (
            ( data.type === 'checkIn' )
            || ( data.type === 'checkOut' )
            || ( data.type === 'edit' )
        )
        {
            if( data.data !== null) {
                let selected = _this.view.widgets.sheettree.rows.selected;
                let node_lines = _this.view.widgets.sheettree.nodeLines;
                let sheet = node_lines[selected].sheet;

                _this.log.msg("Prompt|type:"+data.type+"|sheet:"+sheet+"|data:"+data.data, _this.log.loglevel.devel.message);

                _this.view.timetrap.callCommand({type: data.type, owner: 'menubar', content: data.data, sheet: sheet});
            }
        }
    });

    this.view.timetrap.on('command_complete', (emit_obj) => {
        if(emit_obj.owner === 'menubar'){

            // devel
            _this.log.msg(
                "command_complete|type:"+emit_obj.data.type
                +"|sheet:"+emit_obj.data.sheet
                //+"|stdout:"+emit_obj.data.stdoutData
                +"|stderr:"+emit_obj.data.stderrData
                , _this.log.loglevel.devel.message);

            // log info for user
            if (
                ( emit_obj.data.type === 'checkIn' )
                || ( emit_obj.data.type === 'checkOut' )
                || ( emit_obj.data.type === 'edit' )
            )
            {
                if(typeof emit_obj.data.stderrData !== 'undefined'){
                    if(emit_obj.data.stderrData.toString().
                        match(/.*Timetrap is already running.*/) )
                    {
                        _this.log.msg(emit_obj.data.sheet+" is already running", _this.log.loglevel.production.warning);
                    }
                    else if ( emit_obj.data.stderrData.toString().match(/.*Editing running entry.*/) ){
                        _this.log.msg(
                            "Edited runnig entry for \'"+emit_obj.data.sheet+'\'',
                            _this.log.loglevel.production.message);
                    }
                    else {
                        _this.log.msg(emit_obj.data.stderrData.toString(),
                            _this.log.loglevel.production.message);
                    }
                }

            }
        }
    });

    this.view.timetrap.on('checkout_all_sheets', (emit_obj) => {
        _this.log.msg("stopped all time sheets", _this.log.loglevel.production.message);
    });

    this.on('question', function(data){
        if ( data.type === 'exit' ) {
            if(data.data) {
                //emit the exit key sequence
                let nkey = {
                    sequence: "\u0003",
                    name: "c",
                    ctrl: true,
                    meta: false,
                    shift: false,
                    full: "C-c"
                }
                _this.view.screen.emit('key '+nkey.full, 'C-c', nkey);
            }
        }
        if (data.type === 'stopAll'){
            if(data.data){
                _this.log.msg("Question|type:"+data.type+"|data:"+data.data, _this.log.loglevel.devel.message);
                _this.view.timetrap.checkoutAllSheets();
            }
        }
    });
}

Menubar.prototype.init = function() {
    let _this = this;

    let items = {
		// 1
		In: () => {
			let selected = _this.view.widgets.sheettree.rows.selected;
			if(_this.view.widgets.sheettree.nodeLines[selected].info.running === '-:--:--') {
				_this.log.msg("not a valid time sheet", _this.log.loglevel.production.warning);
				return;
			}
            // if( _this.view.process_config.data.question_prompts.value === true ){
				let dlg = new Prompt({widget: _this}).cannedInput('checkIn');
			// }
			// else {
			// 	_this.emit('promt', {type: 'checkIn', data: true});
			// }
		},
		// 2
		Out: () => {
			let selected = _this.view.widgets.sheettree.rows.selected;

			if(_this.view.widgets.sheettree.nodeLines[selected].info.running === '-:--:--') {
				_this.log.msg("not a valid time sheet", _this.log.loglevel.production.warning);
				return;
			}
			// if( _this.view.process_config.data.question_prompts.value === true ){
				let dlg = new Prompt({widget: _this}).cannedInput('checkOut');
			// }
			// else {
			// 	_this.emit('promt', {type: 'checkOut', data: true});
			// }
		},
        // 3
        Edit: () => {
			let selected = _this.view.widgets.sheettree.rows.selected;

			if(_this.view.widgets.sheettree.nodeLines[selected].info.running === '-:--:--') {
				_this.log.msg("not a valid time sheet", _this.log.loglevel.production.warning);
				return;
			}
			// if( _this.view.process_config.data.question_prompts.value === true ){
				let dlg = new Prompt({widget: _this}).cannedInput('edit');
			// }
			// else {
			// 	_this.emit('promt', {type: 'checkOut', data: true});
			// }
        },
        // 4
        Task: () => {
            //console.log("Task")
        },
        // 5
        Details: () => {
            let selected = _this.view.widgets.sheettree.rows.selected;
            let idx = _this.view.widgets.sheettree.rows.getItemIndex(_this.selected);
            let node_lines = _this.view.widgets.sheettree.nodeLines;

            let sheet = node_lines[selected].sheet;
            let id = node_lines[selected].info.id;
            let note = node_lines[selected].info.note;

            if(_this.view.widgets.sheettree.nodeLines[selected].info.running === '-:--:--') {
                _this.log.msg("not a valid time sheet", _this.log.loglevel.production.warning);
                return;
            }
            let running = false;
            if(_this.view.widgets.sheettree.nodeLines[selected].info.running !== '0:00:00') {
                running = true
            }
            _this.view.controller.emit('create_view', { view_name: 'details', sheet: sheet, running: running });
        },
        // 6
        'Stop all': () => {
            if(_this.view.widgets.sheettree.num_running > 0){
                if( _this.view.process_config.data.question_prompts.value === true ){
                    let dlg = new Question({widget: _this}).cannedInput('stopAll');
                }
                else {
                    _this.emit('question', {type: 'stopAll', data: true});
                }
            }
            else {
                _this.log.msg("no time sheets running", _this.log.loglevel.production.warning);
            }
        },
        // 7
        New: () => {
        },
        // 8
        Kill: () => {
        },
        // 9
        Theme: () => {
        },
        // 0
        Test: () => {
            /////////////////////// Message examples
            //let dlg = new Message({widget: _this}).message("new test message");
            //let dlg = new Message({widget: _this}).error("new test message");
            //let dlg = new Message({widget: _this}).alert("new test message");
            //
            /////////////////////// Prompt examples
            //let dlg = new Prompt({widget: _this}).cannedInput('checkIn');
            //
            /////////////////////// Question examples
            let dlg = new Question({widget: _this}).cannedInput('exit');
        },
    }
    this.setItems(items);
}
module.exports = {Menubar};

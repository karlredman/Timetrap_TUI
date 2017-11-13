"use strict";

// dependencies
var blessed = require('blessed'),
    Listbar = blessed.listbar;

// project includes
var {MenubarConfig} = require('./widget_MenubarConfig');
var {TimetrapTUI_Error} = require('./Errors');
var helpers = require('./helpers');

// dialogs
var {Message} = require('./dialog_Message.js'),
    {Prompt} = require('./dialog_Prompt.js'),
    {Question} = require('./dialog_Question.js');

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

Menubar.prototype.unRegisterActions = function() {
    //this.removeListener('update_status', this.setStatus);
    //this.view.timetrap.removeListener('command_complete', this.menu_command_complete);
    // this.removeListener('blur', blur);
    // this.removeListener('focus', focus);
    // this.removeListener('keypress', keypress);
}

Menubar.prototype.registerActions = function() {
    let _this = this;

    this.on('blur', function blur() {
        //always reset the menu to first option
        _this.select(0);
    });
    this.on('focus', function focus() {
        //always reset the menu to first option
        _this.select(0);
    });

    this.on('keypress', function keypress(ch, key) {
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
        ) {
            if(_this.selected === 0 ) {
                _this.select(_this.items.length-1);
                return;
            }
            _this.moveLeft();
            _this.screen.render();
            return;
        }
        if (key.name === 'right'
            || (_this.options['vi'] && key.name === 'l')
        ) {
            if(_this.selected === (_this.items.length-1)) {
                _this.select(0);
                return;
            }
            _this.moveRight();
            _this.screen.render();
            return;
        }
        if (key.name === 'enter'
            || (_this.options['vi'] && key.name === 'k' && !key.shift))
        {
            _this.emit('action', _this.items[_this.selected], _this.selected);
            _this.emit('select', _this.items[_this.selected], _this.selected);

            let item = _this.items[_this.selected];
            if (item._.cmd.callback) {
                item._.cmd.callback();
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
            || ( data.type === 'task' )
        )
        {
            // example
            // this.emit('prompt', {type: 'checkOut', data: ''});

            let selected = _this.view.widgets.sheettree.rows.selected;
            let node_lines = _this.view.widgets.sheettree.nodeLines;
            let sheet = node_lines[selected].sheet;

            if( data.data !== null) {
                if(data.type === 'task'){
                    //checkIn (sync)
                    _this.view.timetrap.callCommand({type: 'checkIn', owner: 'menubar', content: data.data, sheet: sheet, sync: true});
                    //checkOut
                    _this.view.timetrap.callCommand({type: 'checkOut', owner: 'menubar', content: '', sheet: sheet, sync: true});
                    return;
                }
                _this.log.msg("Prompt|type:"+data.type+"|sheet:"+sheet+"|data:"+data.data, _this.log.loglevel.devel.message);
                _this.view.timetrap.callCommand({type: data.type, owner: 'menubar', content: data.data, sheet: sheet});
            }
        }
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

    //TODO: I'm not exactly sure how this object garantees order...
    let items = {
        // 1
        In: () => {
            let selected = _this.view.widgets.sheettree.rows.selected;
            if(_this.view.widgets.sheettree.nodeLines[selected].info.running === '-:--:--') {
                _this.log.msg("not a valid time sheet", _this.log.loglevel.production.warning);
                return;
            }
            let dlg = new Prompt({widget: _this}).cannedInput('checkIn');
        },
        // 2
        Out: () => {
            let selected = _this.view.widgets.sheettree.rows.selected;

            if(_this.view.widgets.sheettree.nodeLines[selected].info.running === '-:--:--') {
                _this.log.msg("not a valid time sheet", _this.log.loglevel.production.warning);
                return;
            }
            let dlg = new Prompt({widget: _this}).cannedInput('checkOut');
        },
        // 3
        Edit: () => {
            let selected = _this.view.widgets.sheettree.rows.selected;

            if(_this.view.widgets.sheettree.nodeLines[selected].info.running === '-:--:--') {
                _this.log.msg("not a valid time sheet", _this.log.loglevel.production.warning);
                return;
            }
            let dlg = new Prompt({widget: _this}).cannedInput('edit');
        },
        // 4
        Task: () => {
            let selected = _this.view.widgets.sheettree.rows.selected;
            let idx = _this.view.widgets.sheettree.rows.getItemIndex(_this.selected);
            let node_lines = _this.view.widgets.sheettree.nodeLines;
            let sheet = node_lines[selected].sheet;

            if(_this.view.widgets.sheettree.nodeLines[selected].info.running === '-:--:--') {
                _this.log.msg("not a valid time sheet", _this.log.loglevel.production.warning);
                return;
            }

            // if it's running
            if(_this.view.widgets.sheettree.nodeLines[selected].info.running !== '0:00:00') {
                //// checkout
                _this.view.timetrap.callCommand({type: 'checkOut', owner: 'menubar_task', content: '', sheet: sheet, sync: true});
                //// checkin
                let dlg = new Prompt({widget: _this}).cannedInput('checkIn');
            }
            else {
                // it's not running
                //// checkin
                let dlg = new Prompt({widget: _this}).cannedInput('task');
                //// checkout occurs with the prompt event...
            }
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
            //let dlg = new Question({widget: _this}).cannedInput('exit');

            // submenu
            // {Menu} = require('./dialog_Menu.js');
            // let submenu = new Menu({widget: _this});
            // submenu.rows.focus();
            let dlg = new Message({
                widget: _this,
                options: {
                    top: 0,
                    height: null,
                    bottome: 0,
                }
            }).alert(
                //_this.eventNames()
                //+ _this.view.eventNames()
                "controller:"+_this.view.controller.eventNames()
                +"\n"+"create_view:"+_this.view.controller.listenerCount('create_view')
                +"\n"+"destroy_view:"+_this.view.controller.listenerCount('destroy_view')
                +"\n"
                +"main view:"+_this.view.controller.views.main.eventNames()
                +"\n"+"hide_view:"+_this.view.controller.views.main.listenerCount('hide_view')
                +"\n"+"show_view:"+_this.view.controller.views.main.listenerCount('show_view')
                +"\n"+"destroy_widget:"+_this.view.controller.views.main.listenerCount('destroy_widget')
                +"\n"+"create_widget:"+_this.view.controller.views.main.listenerCount('create_widget')
                +"\n"+"focus_default:"+_this.view.controller.views.main.listenerCount('focus_default')
                +"\n"
                +"timetrap:"+_this.view.timetrap.eventNames()
                +"\n"+"command_complete:"+_this.view.timetrap.listenerCount('command_complete')
                +"\n"+"checkout_all_sheets:"+_this.view.timetrap.listenerCount('checkout_all_sheets')
                +"\n"+"db_change:"+_this.view.timetrap.listenerCount('db_change')
            );
        },
    }
    this.setItems(items);
}
module.exports = {Menubar};

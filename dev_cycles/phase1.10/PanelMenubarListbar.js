"use strict"
var blessed = require('blessed'),
    Node = blessed.Node;
var DialogPrompt = require('./DialogPrompt'),
    DialogQuestion = require('./DialogQuestion'),
    DialogMessage = require('./DialogMessage'),
    ListDisplay = require('./MenuDisplayList'),
    ListResume = require('./MenuResumeList'),
    BigBox = require('./DialogBigBox');
var util = require('util');

function PanelMenubarListbar(options) {


    if (!(this instanceof Node)) return new PanelMenubarListbar(options);
    let _this=this;

    this.options = options;
    this.screen = options.parent;
    this.view = options.view;
    this.log = this.view.widgets.logger; //?? why is this not calling log correctly
    //this.view.widgets.logger.msg("some message", this.view.widgets.logger.loglevel.devel.message);
    //
    this.loading_dialog;
    this.display_menu;
    this.resume_menu;


    // set overridable defaults
    options = options || {};
    options.keys = null;            //we're overriding keys
    options.xkeys = true;
    options.height = options.height || 1;
    options.mouse = options.mouse || true;
    options.vi = options.vi || true;
    options.scrollable = options.scrollable || true;

    //manage styles
    options.style = options.style || {};

    options.style.item = options.style.item || {};
    options.style.item.bg = options.style.item.bg || null;
    options.style.item.fg = options.style.item.fg || "white";

    options.style.prefix = options.style.prefix || {};
    options.style.prefix.bg = options.style.prefix.bg || null;
    options.style.prefix.fg = options.style.prefix.fg || "yellow";

    //options.invertSelected = true;

    options.style.selected = options.style.selected || {};
    options.style.selected.bg = options.style.selected.bg || "black";
    options.style.selected.fg = options.style.selected.fg || "lightblue";

    ////////////////
    // TODO: Add 'unselected' state for items (on a timer)
    // options.style.selected.bg = options.style.selected.bg || null;
    // options.style.selected.fg = options.style.selected.fg || "white";

    // if (options.commands || options.items) {
    //     this.setItems(options.commands || options.items);
    // }


    // failsafe: in case parent is not passed in options
    options.parent = options.parent || screen;

    this.options = options;

    // TODO: move this logic to a control location (view?)
    options.items = options.commands || {
        In: function(){
            _this.cleanupMenus();
            // TODO: create item states from the sidebar data
            // using the workspace list is lame
            if(_this.view.widgets.sidebar.nodeLines[_this.view.widgets.sidebar.rows.selected].info.running === '-:--:--') {
                _this.log.msg("Not a valid time sheet", _this.log.loglevel.devel.warning);
                return;
            }
            else {
                    //move to edit menu
                    let prompt = new DialogPrompt({loading: _this.loading_dialog, target: _this, parent: _this.screen});
                    prompt.cannedInput('checkIn');
                }

            setTimeout(function(){
                _this.select(0);
                _this.screen.render();
            }, 1000);
        },
        Out: function(){
            _this.cleanupMenus();
            if(_this.view.widgets.sidebar.nodeLines[_this.view.widgets.sidebar.rows.selected].info.running === '-:--:--') {
                _this.log.msg("Not a valid time sheet", _this.log.loglevel.devel.warning);
                return;
            }
            else {
            let prompt = new DialogPrompt({target: _this, parent: _this.screen});
            prompt.cannedInput('checkOut');
            }
            setTimeout(function(){
                _this.select(0);
                _this.screen.render();
            }, 1000);
        },
        Edit: function(){
            _this.cleanupMenus();
            if(_this.view.widgets.sidebar.nodeLines[_this.view.widgets.sidebar.rows.selected].info.running === '-:--:--') {
                _this.log.msg("Not a valid time sheet", _this.log.loglevel.devel.warning);
                return;
            }
            else {
                if(_this.view.widgets.sidebar.nodeLines[_this.view.widgets.sidebar.rows.selected].info.running === '0:00:00') {
                    //show picklist
                }
                else {
                    //show menu to select running or picklist
            let prompt = new DialogPrompt({target: _this, parent: _this.screen});
            prompt.cannedInput('edit');
            }
            }
            setTimeout(function(){
                _this.select(0);
                _this.screen.render();
            }, 1000);
        },
        Resume: function(){
            let prompt = new DialogPrompt({target: _this, parent: _this.screen});
            //prompt.cannedInput('resume');

            if( typeof _this.resume_menu === 'undefined' ) {
                _this.resume_menu = new ListResume({
                    parent: _this.screen,
                    //TODO: could be more generic
                    top: _this.items[3].position.top+1,         //offset one below
                    left: _this.items[3].position.left+3,       //offset to the right
                    width: _this.items[3].position.width,       //the width of 'Display'
                });
                _this.resume_menu.focus();
                _this.screen.render();
            }
            else {
                if(typeof _this.resume_menu !== 'undefined'){
                    // TODO: HACK!!!
                    // _this.resume_menu.destroy();
                    // delete _this.resume_menu;
                    _this.cleanupMenus();
                }
            }

            setTimeout(function(){
                _this.select(0);
                _this.screen.render();
            }, 1000);
        },
        Display: function(){
            if( typeof _this.display_menu === 'undefined' ) {
             _this.display_menu = new ListDisplay({
                parent: _this.screen,
                top: _this.items[4].position.top+1,         //offset one below
                left: _this.items[4].position.left+3,       //offset to the right
                width: _this.items[4].position.width,       //the width of 'Display'
            });
            _this.display_menu.focus();
            _this.screen.render();
            }
            else {
                if(typeof _this.display_menu !== 'undefined'){
                    // _this.display_menu.destroy();
                    // delete _this.display_menu;
                    _this.cleanupMenus();
                }
            }
            setTimeout(function(){
                _this.select(0);
                _this.screen.render();
            }, 1000);
        },
        Stop_all: function(){
            _this.cleanupMenus();
            let question = new DialogQuestion({target: _this, parent: _this.screen});
            if( _this.view.config.settings.tui_question_prompts.value === true ){
                question.cannedInput('stopAll');
            }
            else {
                _this.emit('question', {type: 'stopAll', data: true});
            }


            //question.cannedInput('stopAll');
            setTimeout(function(){
                _this.select(0);
                _this.screen.render();
            }, 1000);
        },
        Help: function(){
            _this.cleanupMenus();
            let nkey = {
                sequence: "?",
                name: "?",
                ctrl: false,
                meta: false,
                shift: false,
                full: "?"
            }
            _this.parent.emit('key '+nkey.full, nkey.full, nkey);
            setTimeout(function(){
                _this.select(0);
                _this.screen.render();
            }, 1000);
        },
        eXit: function(){
            _this.cleanupMenus();
            let question = new DialogQuestion({target: _this, parent: _this.screen});
            if( _this.view.config.settings.tui_question_prompts.value === true ){
                question.cannedInput('exit');
            }
            else {
                _this.emit('question', {type: 'exit', data: true});
            }
            setTimeout(function(){
                _this.select(0);
                _this.screen.render();
            }, 1000);
        },
        Test: function() {
            _this.cleanupMenus();
            // TODO: move alert to screen level for debugging
            // let m = new DialogMessage({target: _this, parent: _this.screen});
            // m.alert('testing: '+ _this.view.config.timetrap_config.tui_question_prompts.value);
            //_this.items[8].style.bg = "yellow";
            //let output = util.inspect(_this.items[8], null, true);
            //let output = util.inspect(_this.view.widgets.sidebar.rows.getItem(0), false, 2);
            //let output = util.inspect(_this.view.widgets.logger, false, 2);
            //let output = _this.view.widgets.sidebar;
            //let sdata = _this.view.widgets.sidebar.data;
            //let output = util.inspect(_this.view.widgets.sidebar.rows.getItem(0), false, 2);
            //
            //let output = util.inspect(_this.view.widgets.sidebar.rows.getItem(8), false, 2);
            //require('fs').writeFile('node.out', util.inspect(output, null, 20));
            //require('fs').writeFile('node.json', JSON.stringify(output, null, 2));

            //let output = util.inspect(_this.view.widgets.sidebar.rows.selected, null, 2);
            //let output = util.inspect(_this.view.widgets.sidebar.data[_this.view.widgets.sidebar.rows.selected], null, 2);
            // let output = util.inspect(_this.view.widgets.sidebar.data, null, 6);



            //let output = util.inspect(_this.view.widgets.sidebar.nodeLines, false, 20);
            //let output = util.inspect(_this.view.widgets.sidebar.lineNbr, false, 20);
            //let node_lines = _this.view.widgets.sidebar.nodeLines;      //data in sidebar tree
            //let output = util.inspect(_this.view.widgets.sidebar.nodeLines[_this.view.widgets.sidebar.selected], false, 20);
            //require('fs').writeFile('node.out', util.inspect(output, null, 20));

            //let output = util.inspect(_this.view.widgets.sidebar.rows.selected, null, 2);
            //let output = util.inspect(_this.view.widgets.sidebar.nodeLines[_this.view.widgets.sidebar.rows.selected].sheet, false, 20);

            //let output = sdata.children.filter(function(e){return e.sheet == 'Projects'})[0];
            //require('fs').writeFile('node.out', util.inspect(output, null, 9));

            let bb = new BigBox({parent: _this.screen});
            let output = util.inspect(_this.view.timetrap.list, null, 4);

             bb.setContent(output);
            _this.log.msg("some message", _this.log.loglevel.devel.message);

            setTimeout(function(){
                _this.select(0);
                _this.screen.render();
            }, 1000);
        },
        Test2: function() {
            _this.cleanupMenus();

            _this.view.widgets.logger.msg("stuff", _this.view.widgets.logger.loglevel.production.error);

            setTimeout(function(){
                _this.select(0);
                _this.screen.render();
            }, 1000);
        }
    }

    //inherit from textarea
    blessed.listbar.call(this, options);

    //this.screen.render();
}
PanelMenubarListbar.prototype = Object.create(blessed.listbar.prototype);
PanelMenubarListbar.prototype.constructor = PanelMenubarListbar;

PanelMenubarListbar.prototype.cleanupMenus = function(view){
    let _this = this;

    if( typeof _this.display_menu !== 'undefined' ){
        _this.display_menu.destroy();
        delete _this.display_menu;
        _this.screen.render();
    }
    if( typeof _this.resume_menu !== 'undefined' ){
        _this.resume_menu.destroy();
        delete _this.resume_menu;
        _this.screen.render();
    }
}

PanelMenubarListbar.prototype.register_actions = function(view){

    let _this = this;

    _this.on('keypress', function(ch, key) {
        //custom key bindings
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
    _this.on('question', function(data){
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
                _this.parent.emit('key '+nkey.full, 'C-c', nkey);
            }
        }
        if (data.type === 'stopAll'){
            _this.view.timetrap.stopAllTimers({content:''});
        }
        //_this.select(0)
        _this.screen.render();
    });

    _this.on('destroy_me', function(obj){
        if( typeof obj !== 'undefined') {
            obj.destroy();
            delete this.obj;
            _this.screen.render();
        }
    });

    _this.on('prompt', function(data){
        let _this = this;
        if (
            ( data.type === 'checkIn' )
            || ( data.type === 'checkOut' )
            || ( data.type === 'edit' )
        )
        {

            // _this.loading_dialog = new DialogMessage({target: _this, parent: _this.screen});
            // _this.loading_dialog.alert('got here: ');
            // _this.screen.render();

            if( data.data !== null) {
                let sheet = _this.view.widgets.sidebar.nodeLines[_this.view.widgets.sidebar.rows.selected].sheet;
                _this.view.timetrap.callCommand({type: data.type, target: _this, content: data.data, sheet: sheet});
            }

            //TODO: make an actual loading dialog

            //_this.view.widgets.sidebar.rows.select(0);
            //let m = new DialogMessage({target: _this, parent: _this.screen}).alert('got here: '+ data.data);
            // let m = new DialogMessage({target: _this, parent: _this.screen});
            // m.alert('|'+'x'+'|');
        }
    });

    _this.view.timetrap.on('timetrap_stopall', function(response){
        // let m = new DialogMessage({target: _this, parent: _this.screen});
        // m.alert('|'+response+'|');
        //m.alert('got here: '+ _this.view.config.timetrap_config.tui_question_prompts.value);

        // TODO: response should be a structure not an array
        // for( let i in response) {
        //     _this.log.msg("CheckOut: "+response[i].toString(), _this.log.loglevel.devel.message);
        // }
    });

    _this.view.timetrap.on('timetrap_command', function(response){

        // if(typeof _this.loading_dialog !== 'undefined') {
        //     _this.loading_dialog.destroy();
        // }

        if(typeof response.error !== 'undefined'){
            if(response.error.toString().match(/.*Timetrap is already running.*/) ){
                _this.log.msg(response.sheet+" is already running", _this.log.loglevel.devel.warning);
            }
            else if ( response.error.toString().match(/.*Editing running entry.*/) ){
                let msg = "Edited runnig entry for \'"+response.sheet+'\'';
                _this.log.msg(msg, _this.log.loglevel.devel.message);
                }
            else {
                _this.log.msg(response.error.toString(), _this.log.loglevel.devel.message);
            }
        }

        // if(typeof response.data !== 'undefined'){
        //     _this.log.msg(response.type+": "+response.data.toString(), _this.log.loglevel.devel.message);
        // }


        //TODO: this is a hack -need to run an audit on fetch_lists.
        //_this.view.timetrap.fetch_list();

        if(response.type == 'checkIn'){
            // let m = new DialogMessage({target: _this, parent: _this.screen});
            // m.alert('got here: '+ _this.view.config.timetrap_config.tui_question_prompts.value);
        }
    });
}

PanelMenubarListbar.prototype.type = 'PanelMenubarListbar';
module.exports = PanelMenubarListbar;

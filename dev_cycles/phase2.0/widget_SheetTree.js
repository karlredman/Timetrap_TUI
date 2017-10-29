"use strict";

// dependencies
var blessed = require('blessed'),
    Contrib = require('blessed-contrib'),
    ContribTree = Contrib.tree,
    BlessedBox = blessed.Box;

// project includes
//var {SheetTreeConfig} = require('./widget_SheetTreeConfig');
var {TimetrapTUI_Error} = require('./Errors');
var helpers = require('./helpers');

// debugging
var util = require('util');

class SheetTree extends ContribTree {
    constructor({parent = helpers.requiredParam('parent'), options ={},
        theme = 'opaque', config = helpers.requiredParam('config'),
        logger = helpers.requiredParam('logger'),
        view = helpers.requiredParam('view')} ={}) {

        let defaults = {
    wrap: true,
    hidden: false,
    fixed: false,
            //
            parent: parent,
            //
            left: 0,
            top: 1,
            bottom: 1,
            //width: config.data.traits.width,
            width: config.data.traits.width,
            //
            keys: [],
            vi: true,
            mouse: true,
            //
            tags: true,
            align: "left",
            //
            template: {
                // override parent characters
                extend: ' ',
                retract: ' ',
                lines: true,
            },
            //
            border: {type: "line"},
            //
            style: {
                inverse: false,
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
            data: {},
        };
        // merge options into defaults
        //shallow copy is fine here
        options = Object.assign({}, defaults, options);

        super(options);

        // saved options
        this.view = view;
        this.log = logger;
        this.theme = theme;
        this.config = config;
        this.timetrap = this.view.controller.timetrap;

        //internal stats
        this.num_running = 0;
        this.num_sheets = 0;
        this.curret_idx = 0;
        this.tree_data = {};

        // log is interactive (for parent contrib.log)
        //this.interactive = true

        // grab local datascructures, etc.
        this.init();
    }
}

SheetTree.prototype.render = function() {
    //replace parent's render to accomidate for tree placement

    if (this.screen.focused === this.rows) this.rows.focus();

    this.rows.top = this.top+1;
    this.rows.width = this.width - 3;
    this.rows.height = this.height - 4;

    //TODO: this is a cheat !!! and memory leak ?? -investigate
    BlessedBox.prototype.render.call(this);
};

SheetTree.prototype.init = function() {

    // debug testing -fake data for tree
	// let fs = require('fs');
	// let file = './__tests__/input/tree.json';
	// let data = fs.readFileSync(file, 'utf8');
	// let obj = JSON.parse(data);
	// this.setData(obj);
	// this.view.screen.render();


    // setTimeout(() => {
        // this.options.width = 150;
        // this.options.style.border.fg = "yellow";
        // this.options.parent.render();
    // }5000)

    /////////////////////////////////////
    // request data

    this.view.controller.timetrap.callCommand({type:'list', owner: 'sheettree', sync: false});
}
SheetTree.prototype.processList = function(result) {
    let _this = this;
        //parse the sheets

        //console.log(result);
        let arr = result.toString().split("\n");

        let running = 0;

        let running_list = [];
        let jarr = [];
        let i = 1; //skip the header line
        for ( ; i < arr.length; i++){
            let j = {};

            //determine active state
            if( arr[i][0] == ' ' ) {
                j.active = '';
            }
            else {
                if( arr[i][0] == '-' ) {
                    j.active = 'previous';
                }
                else {
                    if( arr[i][0] == '*' ) {
                        j.active = 'current';
                    }
                    else {
                        j.active = undefined;
                    }
                }
            }

            //get the rest of the fields
            let darr = arr[i].substr(1, arr[i].length).match(/\S+/g);
            if(darr != null){
                j.name = darr[0];
                j.running = darr[1];
                j.today = darr[2];
                j.total_time = darr[3];

                jarr.push(j);

                if( j.running != '0:00:00')
                {
                    //update our total running
                    running++;

                    //add j.name for grabbing the running ID and Note
                    //TODO: this will have to be asynch at some point
                    running_list.push({name: j.name});
                }
            }
        }
        //save the list
	//_this.list = jarr;
        //_this.running_list = running_list;
        //console.log(util.inspect(_this.running_list, null, 10));

        //get running ids in the background
        this.num_running = running;
        this.num_sheets = jarr.length;
	//_this.fetchRunningInfo(running_list);
        //_this.emit('getRunningIDs', running_list);
	//_this.emit('fetch_list', jarr);
        //console.log(JSON.stringify(jarr, null, 2));

	this.buildTree(jarr);
    this.view.widgets.runningbox.emit('update', this.num_running, this.num_sheets);
};


SheetTree.prototype.buildTree = function(list){
    let _this = this;

    //altered from:
    //https://stackoverflow.com/questions/6232753/convert-delimited-string-into-hierarchical-json-with-jquery

    var input = list;
    var output = [];
    for (var i = 0; i < input.length; i++) {
        var chain = input[i].name.split(".");
        var currentNode = output;
        for (var j = 0; j < chain.length; j++) {
            var wantedNode = chain[j];
            var lastNode = currentNode;
            for (var k = 0; k < currentNode.length; k++) {
                if (currentNode[k].name == wantedNode) {
                    currentNode = currentNode[k].children;
                    break;
                }
            }
            // If we couldn't find an item in this list of children
            // that has the right name, create one:
            if (lastNode == currentNode) {

                // set the sheet as part of the data
                //let sheet_arr = sheet.split('.');
                let sheet_arr = chain;
                let sheet_val = input[i].name;
                let list_info_val = {
                    running: input[i].running,
                    today: input[i].today,
                    total_time: input[i].total_time,
                    active: input[i].active
                }
                //add info from running_data if available
                if(typeof _this.running_data !== 'undefined'){
                    for ( let r in _this.running_data){
                        if( sheet_val === _this.running_data[r].name ){
                            list_info_val.id = _this.running_data[r].id
                            list_info_val.note = _this.running_data[r].note
                        }
                        else{
                            list_info_val.id = undefined;
                            list_info_val.note = undefined;
                        }
                    }
                }
                if ( wantedNode != sheet_arr[sheet_arr.length-1] ) {
                    //this isn't the endpoint so it's just a hiarchy element
                    sheet_val = '';
                    list_info_val = {
                        running: '-:--:--',
                        today: '-:--:--',
                        total_time: '-:--:--',
                        active: '',
                        id: undefined,
                        note: undefined,
                    };
                }
                var newNode = currentNode[k] = {name: wantedNode, extended: true, sheet: sheet_val, info: list_info_val, children: []};
                currentNode = newNode.children;
            }
        }
    }

    // TODO: default should be set by the user
    let tree = {name: "Timetrap", extended: true, sheet: "default",
        info: {
            running: '-:--:--',
            today: '-:--:--',
            total_time: '-:--:--',
            active: ''
        },
        children: output}

    _this.emit('fetch_tree', tree);

}

SheetTree.prototype.registerActions = function() {
    let _this = this;

    this.view.controller.timetrap.on('db_change', function(){
        //update the sidebar and workspace when the db changes
        _this.view.controller.timetrap.callCommand({type:'list', owner: 'sheettree', sync: false});
    });

	//update the list for the tree
	this.view.controller.timetrap.on(
		_this.view.controller.timetrap.emit_types.command_complete.name,
		(emit_obj) => {
			if(emit_obj.owner === 'sheettree'){
				if(emit_obj.type = 'list'){
					_this.processList(emit_obj.data.stdoutData);
				}
			}
		});

	//update the tree
	this.on('fetch_tree', (tree) => {
        _this.tree_data = tree;
		_this.setData(tree);
		_this.view.screen.render();
		_this.log.msg("updated sheet tree", _this.log.loglevel.devel.message)

		//call summaryList to update
		_this.view.widgets.summarytable.emit('updateData');
	})

    // this.on('keypress', function(ch, key) {
    //     if (key.name === 'tab') {
    //         if (!key.shift) {
    //             _this.view.setWinFocusNext();
    //         } else {
    //             _this.view.setWinFocusPrev();
    //         }
    //         return;
    //     }
    // });

    this.on('syncSelect', function(idx) {
        //console.log(idx+":"+name);
        //this.rows.focusOffset(idx);
        //this.rows.down(1);
        this.rows.select(idx);
        this.screen.render();
	});

    // // manage selections
    // _this.rows.on('element select', function(foo, bar) {
    //     //console.log("element select")
    //     let idx = this.getItemIndex(this.selected);
    //     //self.select(idx);
    //     _this.view.widgets.summarytable.emit('syncSelect', idx, 'element select');
    // });
    // _this.rows.on('select', function(foo, bar){
    //     //console.log("select")
    //     let idx = this.getItemIndex(this.selected);
    //     //self.select(idx);
    //     _this.view.widgets.summarytable.emit('syncSelect', idx, 'select');
    // });

    this.rows.on('keypress', function(ch, key) {
        //Note: be mindful of this vs _this

        //_this.view.widgets.summarytable.rows.emit('keypress', ch, key);

        let idx = this.getItemIndex(this.selected);
        _this.view.widgets.summarytable.emit('syncSelect', idx, 'element click');

        if (key.name === 'tab') {
            if (!key.shift) {
                _this.view.setWinFocusNext();
            } else {
                _this.view.setWinFocusPrev();
            }
            return;
        }

        // if (key.name === 'space'){
        //     let idx = self.getItemIndex(this.selected);
        //     _this.view.widgets.summarytable.emit('keypress', ch, key);
        //     return;
        // }

        // TODO: this isn't working
        if (
            ( key.name === 'pagedown' )
            // || ( key.name === 'space' )
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


        // let idx = this.getItemIndex(this.selected);
        // _this.curret_idx = idx;
        // _this.view.widgets.summarytable.emit('syncSelect', idx, 'element click');

        // let idx = this.getItemIndex(this.selected);
        // _this.view.widgets.summarytable.rows.select(idx);
        // _this.view.screen.render();
    });

    // this.on('syncSelect', function(idx){
    //     _this.rows.select(idx);
    //     _this.screen.render();
    // });

    // // manage mouse things
    // _this.rows.on('element wheeldown', function(foo, bar) {
    //     let idx = this.getItemIndex(this.selected);
    //     _this.view.widgets.summarytable.emit('syncSelect', idx, 'element wheeldown');
    // });
    // _this.rows.on('element wheelup', function(foo, bar) {
    //     let idx = this.getItemIndex(this.selected);
    //     _this.view.widgets.summarytable.emit('syncSelect', idx, 'element wheelup');
    // });
    // _this.rows.on('element click', function(foo, bar) {
    //     let idx = this.getItemIndex(this.selected);
    //     _this.view.widgets.summarytable.emit('syncSelect', idx, 'element click');
    // });
}
module.exports = {SheetTree};

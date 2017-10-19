"use strict"
const {spawnSync} = require('child_process');
const {spawn} = require('child_process');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
const fs = require('fs');
const path = require('path');
require('./Util.js');


function Timetrap(config) {

    if (!(this instanceof EventEmitter)) { return new Timetrap(); }

    let _this = this;
    _this.config = config
    _this.list = [];
    _this.num_running = 0;
    _this.num_clocks = 0;
    _this.fake_timer_time = 0
    _this.fake_timer = undefined;
    _this.running_list = undefined;
    _this.running_data = undefined;

    EventEmitter.call(this);
    _this.register_actions();
};
Timetrap.prototype = Object.create(EventEmitter.prototype);
Timetrap.prototype.constructor = Timetrap;

Timetrap.prototype.fetchRunningInfo = function(running_list){
    let _this = this;

        // TODO: Note: much of this function is temproary until I get around
        // to writing a a timetrap filter that will more easily give us the ID
        _this.running_data = [];
        for ( let i in running_list ){

            let rlist = {};

            let command = "timetrap";
            //using today is querky so we use week
            //Note: I'm not sure that running processes will be reported if they
            //run past a week. today has this issue relative to the day rollover
            //
            // TODO: need to handle this differnetly
            // various time arguments return '' on rollover -could be unexpected behavior
            // the answer is to create a filter in timetrap or (temporarily) use full dumps

            let options = ["display"];
            options.push("-v");
            options.push(running_list[i].name);


            const cmd = spawnSync(command, options);
            let result = cmd.stdout;


            //cmd.once('close', function (){
            //parse the sheets
            let arr = result.toString().split("\n");

            //console.log("Test: "+util.inspect(cmd.stdout.toString(), null, 10)); process.exit(0);

            // we want the 4th line from the end
            let line = arr[arr.length-5].split(/ /).filter(function(el){return el.length != 0});
            //console.log("line:"+util.inspect(line, null, 10));
            //let line2 = line.split(/ /).filter(function(el){return el.length != 0});


            //collect data
            rlist.name = running_list[i].name;
            rlist.id = line[0];

            // lines have variable blanks based on timetrap formatting
            if(line[2] == '-'){
                rlist.duration = line[3];
                rlist.note = line.slice(4,line.length).join(" ");
            }
            else {
                rlist.duration = line[7];
                rlist.note = line.slice(8,line.length).join(" ");
            }
            //console.log("XX"+util.inspect(rlist, null, 10));
            //console.log("line: "+util.inspect(_this.running_list, null, 10));

            // TODO: need to remove running sheets from list when doing a checkout
            _this.running_data.push(rlist);
            //});
        }
        _this.emit('running_list_updated');
};

Timetrap.prototype.register_actions = function(){
    let _this = this;

    // _this.on('getRunningIDs', function(running_list) {
    //     _this.fetchRunningInfo(runninglist);
    // });
};

Timetrap.prototype.fakeTimer = function(command){
    //command: on, off, running
    //returns: running state

    let _this = this;

    //report the state
    if(command === 'running'){
        if ( typeof _this.fake_timer === 'undefined' ){
            return false;
        }
        else {
            return true;
        }
    }

    if(command === 'on'){
        _this.fake_timer_time = Date.now();
        if (typeof _this.fake_timer === 'undefined' ) {
            //_this.fake_timer = setInterval(function(){
            _this.fake_timer = setInterval(function(){
                //only process if semaphore is 0 so as to not waste cycles
                //yes, i know node.js is single threaded. we're serializing
                //the display side in the view -so the fake update timer doesn't
                //overwrite a rereading of the database via fetch_list.
                //if( _this.fake_timer_semaphore)
                _this.updateListTimes();
            }, 1000);
        }
    }

    if(command === 'off'){
        if (_this.fake_timer) {
            clearInterval(_this.fake_timer);
            destroy( _this.fake_timer);
        }
        return false;
    }

    // TODO: throw error if we got here;
}
Timetrap.prototype.updateListTimes = function(){
    let _this = this

    // now
    let now = Date.now();

    // difference between now and last tick
    let delta = now - _this.fake_timer_time;
    _this.fake_timer_time = now;

    let a = [];
    let seconds = 0;
    for( let i in _this.list ){
        // skip non running entries
        if( (_this.list[i].running !== '0:00:00')
            && (_this.list[i].running !== '-:--:--') ) {

            // calculations to H:MM:SS
            a = _this.list[i].running.split(':');
            seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
            seconds += (delta/1000);
            _this.list[i].running = seconds.toString().toHMMSS();

            a = _this.list[i].today.split(':');
            seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
            seconds += (delta/1000);
            _this.list[i].today = seconds.toString().toHMMSS();

            a = _this.list[i].total_time.split(':');
            seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
            seconds += (delta/1000);
            _this.list[i].total_time = seconds.toString().toHMMSS();

        }

    }
    _this.emit('fake_list_update', _this.list);
}

Timetrap.prototype.monitorDB = function(){
    let _this = this;

    _this.watched_file = "/home/karl/Documents/Heorot/timetrap/timetrap.db"
    _this.count = 0;
    _this.watcher = fs.watch(_this.watched_file);

    _this.watcher.on('change', (event, filename) => {

        if(filename == path.basename(_this.watched_file) ){
            //verify command

            //incriment counter
            _this.count++;

            //start timer
            if ( _this.count > 0) {
                //the kernel emits multiple IN_MODIFY events via libuv + sometimes
                // multiple writes occur for an action via timetrap -so we'll only
                // report the composite within a (arbitrary) time window of 1 second.
                // see [fs.watch has double change events for file writes · Issue #3042 · nodejs/node](https://github.com/nodejs/node/issues/3042)
                setTimeout(function () {
                    _this.catch_timer(_this.count);
                }, 1000);
                //}, 500);
            }
        }
        //else {console.log("got here: "+filename)}
    });
}
Timetrap.prototype.catch_timer = function() {
    if (this.count > 0){
        this.emit('db_change');
        //console.log("File "+_this.watched_file+" just changed "+count+" times!");
        this.count=0;
    }
}

Timetrap.prototype.callCommand = function(data){
    let _this = this;

    // data = {
    //     type: 'type of command'
    //     content: command from input
    //     sheet: sheet to do the thing on
    //     target: 'target of emit' ????
    // }

    let types = {
        changeSheet:{
            command: ["s", "sheet"],
            options: [],
            required: [],
            sheet_option: true,
        },
        checkIn:{
            command: ["in", "i"],
            options: ["-a", "--at"],
            required: [],
            sheet_option: false,
        },
        checkOut:{
            command: ["out", "o"],
            options: ["-a", "--at"],
            required: [],
            sheet_option: true,
        },
        resume:{
            command: ["resume", "r"],
            options: [
                "-a", "--at",
                "-i", "--id"
            ],
            sheet_option: false,
            required: []
        },
        edit:{
            command: ["edit", "e"],
            options: [
                // TODO: test compound statements
                "--id", "-i",
                "--start", "-s",        //can not be used with --end
                "--end", "-e",          //can not be used with --start
                "--append", "-z",
                "--move", "-m"          //implement with EXTREME caution
            ],
            sheet_option: false,
            required: []
        },
        today:{
            command: ["today"],
            options: ["-v", "--ids", "-fjson", "--format json"],
            required: ["--ids", "--format json"],
            sheet_option: true,
        },
        yesterday:{
            command: ["yesterday"],
            options: ["-v", "--ids", "-fjson", "--format json"],
            required: ['--ids', '-fjson'],
            sheet_option: true,
        },
        week:{
            command: ["week"],
            options: ["-v", "--ids", "-fjson", "--format json"],
            required: ['--ids', '-fjson'],
            //required: ['--ids'],
            sheet_option: true,
        },
        month:{
            command: ["month"],
            options: ["--ids"],
            required: ['--ids', '-fjson'],
            sheet_option: true,
        },
        display: {
            command: ["d", "display"],
            options: [
                "--ids", "-v",
                "--start", "-s",
                "--end", "-e",
                "--grep", "-g"
            ],
            required: ['--ids'],
            sheet_option: true,
        },
        now:{
            command: ["now"],
            options: [],
            required: [],
            sheet_option: false,
        },
        kill:{
            command: ["kill", "k"],
            //TODO: handle delicately -deletes either id or timesheet
            options: ["--id", "-i"],
            sheet_option: false,
        },
    };

    //TODO: sanitize content against options

    // do command magic
    let base_command = "timetrap";
    let options;
    if(types[data.type].required.length > 0){
        //options = [types[data.type].command[0], types[data.type].required, data.content];
        // TODO: FIX THIS
        options = [types[data.type].command[0], "--ids --format json", data.content];

        // if( types[data.type].command[0] === "week" ){
        //     process.exit(0);
        // }
        // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|"
        //     +types[data.type].command[0]
        // );
    }
    else {
        options = [types[data.type].command[0], data.content];
    }

    // TODO: use the sheet_option property
    // handeling whether we need to select a sheet first
    if( (data.type != 'changeSheet')
        // || (data.type == 'now')
    )
    {
        if(data.type == 'checkOut'){
            //just push the sheet on to the options stack
            options.push(data.sheet);
        }
        else {
            //we have to select the sheet first
            //if(data.type == 'checkIn') process.exit(0);
            _this.callCommand({type: 'changeSheet', content: data.sheet});
        }
    }

    let result = '';
    let error = '';

    // TODO: sync!! we want to migrate to non sync for some messages (i.e. display)

    const cmd = spawnSync(base_command, options);
    // var childProcess = cp.spawnSync(command, args, {
    //     cwd: process.cwd(),
    //     env: process.env,
    //     stdio: 'pipe',
    //     encoding: 'utf-8'
    // });

    //cmd.once('close', function (){
    let response = {
        type: data.type,
        sheet: data.sheet,
        error: cmd.stderr,
        stdout: cmd.stdout,
        data: base_command.toString()+" "+options.toString(), //TODO: to be retired
        command: base_command.toString()+" "+options.toString(),
        target: data.target,
        running: data.running
    };
    _this.emit('timetrap_command', response);

    // TODO: we want to migrate to this
    //data.target.emit('timetrap_command', response);
    //});
};

Timetrap.prototype.stopAllTimers = function(data){
    // TODO
    //data.content == dialog message

    //TODO: replace with callCommand()
    let _this = this;
    let command = "timetrap";
    let options = ["now"];
    const cmd = spawn(command, options);

    let result = '';
    cmd.stdout.on('data', (data) => {
        //console.log(`${data}`);
        if( typeof '${data}' === 'undefined' ){
            return;
        }
        result += `${data}`.toString();
    });
    cmd.once('close', function (){
        // let response = {
        //     type: data.type,
        //     //err: err,
        //     data: data,
        //     //obj: _this
        // };

        //arr.tostring will yeield arr.length-1 valid lines.
        //it ends up with the last element being ' '
        //the sheet name will be preceded by 1 char.
        let arr = result.toString().split("\n");

        //build an array of running sheets
        let sheets = [];
        if(arr.length > 1) {
            for ( let i=0; i < arr.length-1; i++ ) {
                let chunk = arr[i].slice(1,arr[i].length);
                sheets.push(chunk.split(':')[0])
            }
        }

        //we don't have to switch sheets to checkout
        for ( let s in sheets ) {
            _this.callCommand({type: 'checkOut', sheet:sheets[s], content: data.content})
            //_this.callCommand({type: data.type, target: _this, content: data.data, sheet: sheet});
            // console.log("|"+sheets[s]+"|")
        }


        //console.log("arr|"+arr.length)
        _this.emit('timetrap_stopall', sheets);
    });


}


Timetrap.prototype.fetch_list = function(){
    let _this = this;
    let command = "timetrap";
    let options = ["list"];
    const cmd = spawn(command, options);

    let result = '';
    cmd.stdout.on('data', (data) => {
        //console.log(`${data}`);
        if( typeof '${data}' === 'undefined' ){
            return;
        }
        result += `${data}`.toString();
    });

    cmd.once('close', function (){
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
        _this.list = jarr;
        //_this.running_list = running_list;
        //console.log(util.inspect(_this.running_list, null, 10));

        //get running ids in the background
        _this.num_running = running;
        _this.num_clocks = jarr.length;
        _this.fetchRunningInfo(running_list);
        //_this.emit('getRunningIDs', running_list);
        _this.emit('fetch_list', jarr);

        //console.log(JSON.stringify(jarr, null, 2));

    });
};

Timetrap.prototype.fetch_tree = function(list){
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

// Timetrap.prototype.buildTree = function(list, family, sheet, info) {

//     let _this = this;

//     let found = false;
//     let f = 0,
//         i = 0;

//     for ( i in list) {
//         for(f in family){
//             if( list[i] == family[f].name) {
//                 found = true;
//                 this.buildTree(list.slice(i+1,list.length), family[f].children, sheet, info);
//                 break;
//             }
//         }
//         if(!found){
//             //find out if this is the endpoint. If not then there's no sheet.
//             let sheet_arr = sheet.split('.');
//             let sheet_val = sheet;
//             if ( list[i] != sheet_arr[sheet_arr.length-1] ) {
//                 //this isn't the endpoint so it's just a hiarchy element
//                 sheet_val = '';
//             }

//             //push the array
//             family.push({name: list[i], extended: true, sheet: sheet_val, children: []});
//         }
//     }
// }

Timetrap.prototype.type = 'Timetrap';
module.exports = Timetrap;

// // ////////////-------------
// var t = new Timetrap(null);

// t.on('fetch_list', function(list){
//     let _this = this;

//     //altered from: https://stackoverflow.com/questions/6232753/convert-delimited-string-into-hierarchical-json-with-jquery
//     var input = list;
//     var output = [];
//     for (var i = 0; i < input.length; i++) {
//         var chain = input[i].name.split(".");
//         var currentNode = output;
//         for (var j = 0; j < chain.length; j++) {
//             var wantedNode = chain[j];
//             var lastNode = currentNode;
//             for (var k = 0; k < currentNode.length; k++) {
//                 if (currentNode[k].name == wantedNode) {
//                     currentNode = currentNode[k].children;
//                     break;
//                 }
//             }
//             // If we couldn't find an item in this list of children
//             // that has the right name, create one:
//             if (lastNode == currentNode) {

//                 //let sheet_arr = sheet.split('.');
//                 let sheet_arr = chain;
//                 let sheet_val = input[i].name;
//                 if ( wantedNode != sheet_arr[sheet_arr.length-1] ) {
//                     //this isn't the endpoint so it's just a hiarchy element
//                     sheet_val = '';
//                 }
//                 var newNode = currentNode[k] = {name: wantedNode, extended: true, sheet: sheet_val, children: []};
//                 currentNode = newNode.children;
//             }
//         }
//     }

//     console.log(util.inspect(output, null, 10));
//     //console.log(JSON.stringify(family, null, 2));
// });

// t.on('tree', function(tree){
//     console.log(util.inspect(tree[0], null, 10));
// })

// var t = new Timetrap(null);
// t.on('running_list_updated', function(){
//     console.log("end list: "+util.inspect(t.running_data, null, 10));
// });

// t.fetch_list();


"use strict"
const {spawn } = require('child_process');
var EventEmitter = require('events').EventEmitter;
var util = require('util');


function Timetrap(config) {

    if (!(this instanceof EventEmitter)) { return new Timetrap(); }

    let _this = this;
    _this.config = config
    _this.list = [];

    EventEmitter.call(this);
};
Timetrap.prototype = Object.create(EventEmitter.prototype);
Timetrap.prototype.constructor = Timetrap;

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

        let jarr = [];
        let i = 1; //skip the header line
        for ( ; i < arr.length; i++){
            let j = {};

            //determine active state
            if( arr[i][0] == ' ' ) {
                j.active = 'na';
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
            }
        }
        //save the list
        _this.list = jarr;

    //TODO: possible race codition someday?
    //_this.emit('list', _this.list);
        _this.emit('fetch_list', jarr);
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
                if ( wantedNode != sheet_arr[sheet_arr.length-1] ) {
                    //this isn't the endpoint so it's just a hiarchy element
                    sheet_val = '';
                    list_info_val = {
                        running: '',
                        today: '',
                        total_time: '',
                        active: ''
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
                        running: '',
                        today: '',
                        total_time: '',
                        active: ''
                    },
        children: output}

        _this.emit('fetch_tree', tree);

}

Timetrap.prototype.buildTree = function(list, family, sheet, info) {

    let _this = this;

    let found = false;
    let f = 0,
        i = 0;

    for ( i in list) {
        for(f in family){
            if( list[i] == family[f].name) {
                found = true;
                this.buildTree(list.slice(i+1,list.length), family[f].children, sheet, info);
                break;
            }
        }
        if(!found){
            //find out if this is the endpoint. If not then there's no sheet.
            let sheet_arr = sheet.split('.');
            let sheet_val = sheet;
            if ( list[i] != sheet_arr[sheet_arr.length-1] ) {
                //this isn't the endpoint so it's just a hiarchy element
                sheet_val = '';
            }

            //push the array
            family.push({name: list[i], extended: true, sheet: sheet_val, children: []});
        }
    }
}

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

// t.fetch_list();

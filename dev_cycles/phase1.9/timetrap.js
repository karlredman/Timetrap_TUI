"use strict"
const {spawn } = require('child_process');
var util = require('util');
var {EventEmitter} = require('events').EventEmitter;


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
        _this.emit('list', jarr);
    });
};

Timetrap.prototype.buildTree = function(list, family) {

    let _this = this;

    let found = false;
    let f = 0,
        i = 0;

    for ( i in list) {
        for(f in family){
            if( list[i] == family[f].name) {
                found = true;
                this.buildTree(list.slice(i+1,list.length), family[f].children);
                break;
            }
        }
        if(!found){
            family.push({name: list[i], children: []});
        }
    }
}

Timetrap.prototype.type = 'Timetrap';
module.exports = Timetrap;

// ////////////-------------
var t = new Timetrap(null);

t.on('list', function(list){

    let branches = [];
    for (let i in list) {
        //turn list into array of arrays
        branches.push(list[i].name.split('.'));
    }
    //console.log(util.inspect(branches, null, 10));

    //build the tree
    let family = {name: 'default', children:[]};

    for ( let b in branches ){
        this.buildTree(branches[b], family[0].children);
        //if(b==2) break;
    }
    console.log(util.inspect(family, null, 10));
    //console.log(JSON.stringify(family, null, 2));
});

t.on('tree', function(tree){
    console.log(util.inspect(tree, null, 10));
})

t.fetch_list();

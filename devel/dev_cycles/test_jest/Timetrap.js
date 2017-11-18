"use strict"

//parent
const {EventEmitter} = require('events').EventEmitter;

// Constructor
function Timetrap(config) {
    if (!(this instanceof EventEmitter)) { return new Timetrap({}); }

    let _this = this;

    //_this.config = {
    _this.working_directory = config.working_directory || "/";
    //}
    //
    _this.thing = true;

    EventEmitter.call(this);
};
Timetrap.prototype = Object.create(EventEmitter.prototype);
Timetrap.prototype.constructor = Timetrap;

Timetrap.prototype.sum = function(a, b) {
    return a + b;
};

// function sum(a, b) {
//     return a + b;
// };



Timetrap.prototype.type = 'Timetrap';
module.exports = Timetrap;

// let t = new Timetrap({});
// console.log(t.add(2,3));

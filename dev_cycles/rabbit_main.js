"use strict";
var rabbit = require('./rabbit.js');

var oldProto = rabbit.Rabbit;
rabbit.Rabbit = function() {
   this.jumps = "no";
};
//rabbit.Rabbit = oldProto;

var r = new rabbit.Rabbit();
console.log(r.jumps);                    // no
console.log(rabbit.Rabbit.prototype.constructor);
// outputs exactly the code of the function Rabbit();

console.log("#############################");

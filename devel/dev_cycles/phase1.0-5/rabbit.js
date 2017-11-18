"use strict";

function Rabbit() {
    this.jumps = "yes";
};

// var r = new Rabbit();
// console.log(r.jumps);                    // yes
// console.log(Rabbit.prototype.constructor);
// // outputs exactly the code of the function Rabbit();
// console.log("-----------------------------");

Rabbit.prototype.type = 'rabbit';
module.exports = Rabbit;

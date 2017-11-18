"use strict"

var {Check,Stab, MyError, SomeSpecificError } = require('./check.js');
var Timetrap = require('./Timetrap.js');

let check = new Check();
check.myMethod();
console.log(check.sum(1,2));
console.log(check.thing);

console.log("-----------------------")
let stab = new Stab({thing: "thing from main"});
stab.myMethod();
console.log(stab.thing);
console.log(stab.childvar);


console.log("-----------------------")
let timetrap = new Timetrap({});
console.log(timetrap.sum(1,2));

try {
    // Throwing EmailTakenError exception.
    throw new MyError("message from main.js");
} catch (error) {
    // Catching exception by class.
    if (error instanceof MyError) {
        console.log('MyError was thrown: ', error);
    } else {
        // punt
        console.log('Unknown error: ', error);
        //throw error;
    }
}

try {
    // Throwing EmailTakenError exception.
    throw new SomeSpecificError({message: "error message overide"});
} catch (error) {
    // Catching exception by class.
    if (error instanceof SomeSpecificError) {
        console.log('SomeSpecificError was thrown', error);
    } else {
        // punt
        console.log('Unknown error', error);
        //throw error;
    }
}

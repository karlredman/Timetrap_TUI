'use strict';

//import React from 'react';

//export default class Check extends Object {
//class Check extends Object {
class Check {

    constructor({thing = "default thing"} = {}) {
        //console.log("constructor");
        this._thing = `${thing}`;
    }

    get thing(){return this._thing;}
    set thing(thing_str){this._thing = thing_str;}

    myMethod() {
        //console.log("myMethod");
        return "myMethod";
    }

    sum(a,b) {
        return ( +a+b );
    }
}

class Stab extends Check {
    constructor({
        thing = "childThing",
        childvar = "childvar value"
    } = {})
    {
        //parent constructor
        super({thing: `${thing}`});
        this._childvar = `${childvar}`;
    }

    get childvar(){return this._childvar;}
    set childvar(new_childvar){ this._childvar = new_childvar;}
}

class MyError extends Error {
    constructor(message){
        super(message);
        this.name = 'MyError';
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class SomeSpecificError extends MyError {
    constructor ({
        message = "overrideable message"
    } = {})
    {
    super(`${message}`);
  }
};
class SomeSpecificError_2 extends MyError {
    constructor (message){
        if(!message){
            message = "overrideable message"
        }
        super(`${message}`);
    }
};

module.exports = { Check, Stab, MyError, SomeSpecificError };

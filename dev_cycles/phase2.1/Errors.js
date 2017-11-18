// Errors.js
// The various errors used by the project
"use strict"


class TimetrapTUI_Error extends Error {
    constructor(message){
        message = "TimetrapTUI Error: "+message;
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}


module.exports = {TimetrapTUI_Error};

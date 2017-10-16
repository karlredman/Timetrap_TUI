"use strict";

var {Check, Stab} = require('./check.js');


describe('testing my check class', function() {
    var check= new Check();
    test('something to test', function() {
        expect(check).toBeDefined();
    });
    test('myMethod test', function() {
        //expect(check.myMethod()).toEqual(expect.stringContaining("constructor"));
        expect(check.myMethod()).toEqual("myMethod");
    })

    test('verify default consructor values', function() {
        expect(check._thing).toBeDefined();
    });

    test('check add method', function() {
        expect(check.sum(2,3)).toEqual(5);
    });
});

describe('testing stab class (derived from Check)', function() {
    var stab = new Stab();
    test('something to test', function() {
        expect(stab).toBeDefined();
    });
    test('myMethod test', function() {
        //expect(check.myMethod()).toEqual(expect.stringContaining("constructor"));
        expect(stab.myMethod()).toEqual("myMethod");
    })

    test('verify default consructor values', function() {
        var check = new Check();
        expect(stab._childvar).toBeDefined();
        expect(stab._thing).toBeDefined();
    });

    test('check add method', function() {
        expect(stab.sum(2,3)).toEqual(5);
    });
});


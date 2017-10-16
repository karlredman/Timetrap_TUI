"use strict";

var Timetrap = require('./Timetrap.js');


describe('testing my Timetrap class', function() {
    describe('Validate Timetrap class instantiated as function', function() {
        var timetrap = Timetrap({});
        test('Validate instatniation as function', function() {
            expect(timetrap).toBeDefined();
        });
        test('InstanceOf Timetrap', function() {
            expect(timetrap).toBeInstanceOf(Timetrap);
        });
        test('InstanceOf EventEmitter', function() {
            const {EventEmitter} = require('events').EventEmitter;
            expect(timetrap).toBeInstanceOf(EventEmitter);
        });
    });
    describe('Validate Timetrap class instantiated as object', function() {
        var timetrap = new Timetrap({});
        test('Validate instatniation as object (with new)', function() {
            expect(timetrap).toBeDefined();
        });
        test('InstanceOf Timetrap', function() {
            expect(timetrap).toBeInstanceOf(Timetrap);
        });
        test('InstanceOf EventEmitter', function() {
            const {EventEmitter} = require('events').EventEmitter;
            expect(timetrap).toBeInstanceOf(EventEmitter);
        });
    });
});

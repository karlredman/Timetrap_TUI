// Timetrap.test.js
// jest tests for Timetrap.js
"use strict"

var {Timetrap, Timetrap_Error} = require('../Timetrap');


describe('Timetrap class', function() {
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
describe('Timetrap class properties', function() {
    var timetrap = new Timetrap({});
    test('Verify default class variable properties', function() {
        expect(timetrap.config.working_directory).toBeDefined();
    });
    test('Verify default class variable getters work', function() {
        expect(timetrap.command_types.changeSheet.allow_sheet).toBeDefined();
    });
    test('Verify command_types subgetters work', function() {
        expect(timetrap.command_types.changeSheet.command).toEqual('sheet');
        Object.keys(timetrap.command_types).forEach(function(key){
                expect(timetrap.command_types[key].command).toBeDefined(); });
    });
});
describe('Timetrap callCommand and supporters (live)', function() {
    var timetrap = new Timetrap({});
    test('doCallcommand() promise returnes value', () => {
        expect.assertions(1);
        return timetrap.doCallCommand({
			args: ['sheet', 'default'],
            sheet: 'default',
            type: 'changeSheet'
        }).then(data => {
            expect(data.stderrData).toBe("Switching to sheet \"default\"\n");
        });
    });
});

describe('Timetrap_Error class', function() {
    describe('Validate Timetrap_Error class instantiated as object', function() {
        var error = new Timetrap_Error('test message');
        test('Validate instatniation as object', function() {
            expect(error).toBeDefined();
        });
        test('InstanceOf Error', function() {
            expect(error).toBeInstanceOf(Error);
        });
        test('InstanceOf TimetrapTUI_Error', function() {
            expect(error).toBeInstanceOf(Timetrap_Error);
        });
        test('Verify default consructor values', function() {
            expect(error.name).toEqual(error.constructor.name);
        });
        test('Verify throw behavior', function() {
            expect(() => {
                throw new Timetrap_Error("a test message");
            }).toThrow("a test message");
        });

    });
});

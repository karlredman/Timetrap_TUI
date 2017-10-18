// Timetrap.test.js
// jest tests for Timetrap.js
"use strict"

var {Timetrap, Timetrap_Error} = require('../Timetrap');

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

describe('Timetrap class definition', function() {
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

    describe('Timetrap callCommand() and supporters (live)', function() {
        var timetrap = new Timetrap({});
        test('doCallcommand() promise returnes value stderrData', () => {
            expect.assertions(1);
            return timetrap.doCallCommand({
                args: ['sheet', 'default'],
                sheet: 'default',
                type: 'changeSheet'
            }).then(data => {
                expect(data.stderrData).toBe("Switching to sheet \"default\"\n");
            });
        });
        test('doCallcommand() returnes correct data structure', () => {
            //expect.assertions(1);
            return timetrap.doCallCommand({
                args: ['sheet', 'default'],
                sheet: 'default',
                type: 'changeSheet'
            }).then(data =>
                //timetrap.command_types.output
                expect(data).toMatchObject({
                    description: expect.any(String),
                    _command: expect.any(Array),
                    stdoutData: expect.any(String),
                    stderrData: expect.any(String),
                    code: expect.any(Number),
                    signal: expect.any(Object),     //spawn may set to null
                    sheet: expect.any(String),
                    type: expect.any(String)
                }))
        });
        // TODO: test state changes afected by callCommand()
    });

    describe('Timetrap basic class properties', function() {
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
                expect(timetrap.command_types[key].command).toBeDefined();
            });
        });
    });

    describe('Timetrap class data structure attributes', function() {
        var timetrap = new Timetrap({});
        test('Verify command_types data strucures', function() {
            Object.keys(timetrap.command_types).forEach(function(key){
                expect(timetrap.command_types[key]).toMatchObject({
                    description: expect.any(String),
                    _command: expect.any(Array),
                    description: expect.any(String),
                    args: expect.any(Array),
                    required: expect.any(Array),
                    allow_sheet: expect.any(Boolean),
                    special: expect.any(Boolean),
                });
            });
        });
        test('Verify emmit_types data strucures', function() {
            Object.keys(timetrap.emmit_types).forEach(function(key){
                expect(timetrap.emmit_types[key]).toMatchObject({
                    description: expect.any(String),
                    name: expect.any(String),
                    data: expect.any(Object)
                });
            });
            //typed objects
            expect(timetrap.emmit_types.command_complete.data).toEqual(timetrap.command_types.output);
        });
    });






});


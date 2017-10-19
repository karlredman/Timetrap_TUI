// Timetrap.test.js
// jest tests for Timetrap.js
"use strict"

var {Timetrap, Timetrap_Error} = require('../Timetrap');

describe('Timetrap_Error class', function() {
    describe('Validate Timetrap_Error class instantiated as object', function() {
        let error = new Timetrap_Error('test message');
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

describe('Timetrap basic class definition', function() {
    describe('Validate Timetrap class instantiated as object', function() {
        let timetrap = new Timetrap({});
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

    describe('Timetrap basic class properties', function() {
        let timetrap = new Timetrap({});
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
        let timetrap = new Timetrap({});
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
                    override: expect.any(Boolean)
                });
            });
        });
        test('Verify emit_types data strucures', function() {
            Object.keys(timetrap.emit_types).forEach(function(key){
                expect(timetrap.emit_types[key]).toMatchObject({
                    description: expect.any(String),
                    name: expect.any(String),
                    data: expect.anything(),
                    target: expect.any(Object)
                });
            });
            //typed objects
            expect(timetrap.emit_types.command_complete.data).toEqual(timetrap.command_types.output);
        });
    });

    describe('Timetrap callCommand() and supporters (live)', function() {
        let timetrap = new Timetrap({});
        test('doCallcommandAsync() promise returnes value stderrData', () => {
            expect.assertions(1);
            return timetrap.doCallCommandAsync({
                args: ['sheet', 'default'],
                sheet: 'default',
                type: 'changeSheet'
            }).then(data => {
                expect(data.stderrData).toBe("Switching to sheet \"default\"\n");
            });
        });
        test('doCallcommandAsync() returnes correct data structure', () => {
            //expect.assertions(1);
            return timetrap.doCallCommandAsync({
                args: ['sheet', 'default'],
                sheet: 'default',
                type: 'changeSheet'
            }).then(data =>
                //timetrap.command_types.output
                expect(data).toMatchObject({
                    description:    expect.any(String),
                    _command:       expect.any(Array),
                    args:           expect.any(Array),
                    required:       expect.any(Array),
                    allow_sheet:    expect.any(Boolean),
                    special:        expect.any(Boolean),
                    stdoutData:     expect.any(String),
                    stderrData:     expect.any(String),
                    code:           expect.any(Number),
                    signal:         expect.any(Object),     //spawn may set to null
                    sheet:          expect.any(String),
                    type:           expect.any(String),
                    override:       expect.any(Boolean),
                    sync:           expect.any(Boolean),
	                cmdln:          expect.any(Array)
                }))
        });
        // TODO: test state changes afected by callCommand()
    });


    // TODO: I don't know how to thest this
    describe('MonitorDB... functionality', () => {
        describe('MonitorDB... support functionality', () => {
            let timetrap = new Timetrap({});
            test('monitorDBCatchTimer() should emit \'db_change\'', function(done) {
                timetrap.on('db_change', (emit_obj) => {
                    expect(emit_obj).toEqual(expect.any(Object));
                    expect(emit_obj).toMatchObject({
                        description: expect.any(String),
                        name: expect.any(String),
                        data: expect.any(Number)
                    });
                    done();
                });
                //set up condition trigger emit
                timetrap.config.db_monitor.IN_MODIFY_count = 1;
                timetrap.monitorDBCatchTimer();
            });

            describe('monitorDBStart... full functionality', () => {

                //use real timers for checking on interval
                //jest.useFakeTimers();
                //jest.useRealTimers();

                let filepath = '/tmp/testdb';
                let fs = require('fs');

                //create test file
                try {
                    fs.closeSync(fs.openSync(filepath, 'w'));
                }catch(err){
                    // TODO: custom error object
                    throw(err);
                }
                let timetrap = new Timetrap({watched_db_file: filepath});
                test.skip('monitorDBStart should start a timer, call monitorDBCatchTimer, and monitorDBStop should stop the monitor', (done) => {

                    //start the monitor
                    timetrap.monitorDBStart();

                    //db file get's touched
                    try {
                        //touch db_file
                        fs.closeSync(fs.openSync(filepath, 'w'));
                    }catch(err){
                        // TODO: custom error object
                        throw(err);
                    }

                    //wait for at least long enough for the counter to increase
                    setTimeout(function(){
                        //timer should start once the file has been touched
                        expect(timetrap.config.db_monitor.timer).not.toEqual(0);

                        console.log("Got Here")

                        //test to see if monitorDBCatchTimer mock was called
                        ////// ??????
                        //const monitorDBCatchTimerSpy = jest.fn(timetrap.config.db_monitor.IN_MODIFY_count=0);
                        //expect(fn).toBeCalled();
                        //

                        //stop the timer
                        timetrap.monitorDBStop();
                        expect(timetrap.config.db_monitor.timer).toBe(0);
                        expect(timetrap.config.db_monitor.watcher).toBe(undefined);

                        done();
                    }, 1000);
                });
            });
        });

    });
}); //end


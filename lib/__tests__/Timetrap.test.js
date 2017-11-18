// Timetrap.test.js
// jest tests for Timetrap.js
"use strict"

var {Timetrap, Timetrap_Error} = require('timetrap_wraplib');

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
                    args: expect.any(Array),
                    required: expect.any(Array),
                    allow_sheet: expect.any(Boolean),
                    special: expect.any(Boolean),
                    override: expect.any(Boolean),
                    command: expect.anything() // ??
                });
            });
        });
        test('Verify emit_types data strucures', function() {
            Object.keys(timetrap.emit_types).forEach(function(key){
                expect(timetrap.emit_types[key]).toMatchObject({
                    description: expect.any(String),
                    name: expect.any(String),
                    data: expect.anything(),
                    target: expect.any(String),
                    owner: expect.any(String)
                });
            });
            //typed objects
            expect(timetrap.emit_types.command_complete.data).toEqual(timetrap.command_types.output);
        });
    });

    describe('Timetrap callCommand() and supporters (live async)', function() {
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
                    sync:           false,
                    cmdln:          expect.any(Array)
                }))
        });
        test('callcommand() emits command_complete emit_type (async)', (done) => {
            timetrap.on(timetrap.emit_types.command_complete.name, (emit_obj) => {
                expect(emit_obj).toEqual(expect.any(Object));
                expect(emit_obj).toMatchObject({
                    description: expect.any(String),
                    name: expect.any(String),
                    data: expect.anything(),
                    owner: expect.any(String)
                });
            });
            done();
            timetrap.callCommand({type:'now', target: null, sheet:'default', sync: false});
        });
        test('callcommand() options coverage [branch] (async) (live)', (done) => {
            timetrap.on(timetrap.emit_types.command_complete.name, (emit_obj) => {
                expect(emit_obj).toEqual(expect.any(Object));
                expect(emit_obj).toMatchObject({
                    description: expect.any(String),
                    name: expect.any(String),
                    data: expect.anything(),
                    owner: expect.any(String)
                });
            });
            done();
            // TODO: possibly a problem with this
            //timetrap.callCommand({type:'CheckIn', timetrap_internal: true, sheet:'default', sync: false});
            timetrap.callCommand({type:'checkIn', sheet:'default', content:"testing checkin", sync: false});
        });
        // test.only('callcommand() options coverage [branch] (async) (live)', (done) => {
        //     timetrap.on(timetrap.emit_types.command_complete.name+"-timetrap_internal", (emit_obj) => {
        //         expect(emit_obj).toEqual(expect.any(Object));
        //         expect(emit_obj).toMatchObject({
        //             description: expect.any(String),
        //             name: expect.any(String),
        //             data: expect.anything(),
        //             owner: expect.any(String)
        //         });
        //     });
        //     done();
        //     // TODO: possibly a problem with this
        //     timetrap.callCommand({type:'CheckIn', timetrap_internal: true, sheet:'default', sync: false});
        //     //timetrap.callCommand({type:'checkIn', sheet:'default', content:"testing checkin"});
        // });
        describe('dumpOutput debugging convenience utility', () => {
            // ??? I'm not sure why this doesn't help code coverage....
            test('execution path', (done) => {
                timetrap.on(timetrap.emit_types.command_complete.name, (emit_obj) => {
                    console.log = function(){};
                    timetrap.dumpOutput(emit_obj.data, 'console');
                    expect(emit_obj).toEqual(expect.any(Object));
                });
                done();
                timetrap.callCommand({type:'changeSheet', target: null, sheet:'default', sync: false});
            });
            test('dumpOutput', () => {
                console.log = function(){};
                timetrap.dumpOutput(timetrap.emit_types.command_complete.data, 'console');
            });
            test('dumpOutput', () => {
                expect(() => {
                    timetrap.dumpOutput(timetrap.emit_types.command_complete.data, 'NOT_VALID');
                }).toThrow();
            });
            test('execution path console', () => {
                timetrap.on(timetrap.emit_types.command_complete.name, (emit_obj) => {
                    let output = {
                        description: "callCommand output data structure",
                        _command: [''],
                        content: '',
                        args: [],
                        required: [],
                        allow_sheet: false,
                        special: true,
                        stdoutData: '',
                        stderrData: '',
                        code: 0,
                        signal: '',
                        sheet: '',
                        type: '',
                        override: false,
                        sync: false,
                        cmdln: [],
                        get command(){return this._command[0]}
                    }
                    console.log = function(data){
                        expect(data).toEqual(expect.any(String));
                    };
                    timetrap.dumpOutput(output, 'console');
                    //expect(emit_obj).toEqual(expect.any(Object));
                });
            });
            test('throws error with incorrect method', () => {
                let output = {};
                expect(() => {
                    timetrap.dumpOutput(output, 'somethingNotValid')
                        .toThrow(Timetrap_Error);
                });
            });
        });
        // TODO: test state changes afected by callCommand()
    });
    ////////

    describe('Timetrap callCommand() and supporters (live sync)', function() {
        let timetrap = new Timetrap({});
        test('doCallcommandSync() promise returnes value stderrData', () => {
            let data = timetrap.doCallCommandSync({
                args: ['sheet', 'default'],
                sheet: 'default',
                type: 'changeSheet'
            })
            expect(data.stderrData).toBe("Switching to sheet \"default\"\n");
        });
        test('doCallcommandSync() returnes correct data structure', () => {
            //expect.assertions(1);
            let data = timetrap.doCallCommandSync({
                args: ['sheet', 'default'],
                sheet: 'default',
                type: 'changeSheet'
            });
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
                sync:           true,
                cmdln:          expect.any(Array)
            });
        });
        test('callcommand() emits command_complete emit_type (sync) (live)', (done) => {
            timetrap.on(timetrap.emit_types.command_complete.name, (emit_obj) => {
                expect(emit_obj).toEqual(expect.any(Object));
                expect(emit_obj).toMatchObject({
                    description: expect.any(String),
                    name: expect.any(String),
                    data: expect.anything(),
                    target: expect.any(String),
                    owner: expect.any(String)
                });
            });
            done();
            timetrap.callCommand({type:'changeSheet', target: null, sheet:'default', sync: false});
        });
        test('callcommand() options coverage [branch] (sync) (live)', (done) => {
            timetrap.on(timetrap.emit_types.command_complete.name+"-timetrap_internal", (emit_obj) => {
                expect(emit_obj).toEqual(expect.any(Object));
                expect(emit_obj).toMatchObject({
                    description: expect.any(String),
                    name: expect.any(String),
                    data: expect.anything(),
                    target: expect.any(String),
                    owner: expect.any(String)
                });
            });
            done();
            timetrap.callCommand({type:'display', timetrap_internal: true, sheet:'default', sync: true});
            timetrap.checkoutAllSheets();
            //timetrap.callCommand({type:'CheckIn', timetrap_internal: true, sheet:'default', sync: true});
        });

        describe('CallCommand() Error Checking', () => {
            test('throws error if type argument is not specified', () => {
                expect( () => {
                    timetrap.callCommand();
                }).toThrow(Timetrap_Error);
            });
        });
        // TODO: further test state changes afected by callCommand()
    });
    describe('MonitorDB... functionality', () => {
        describe('MonitorDB... support functionality', () => {
            let timetrap = new Timetrap({});
            test('monitorDBCatchTimer() should emit \'db_change\'', function(done) {
                timetrap.on('db_change', (emit_obj) => {
                    expect(emit_obj).toEqual(expect.any(Object));
                    expect(emit_obj).toMatchObject({
                        description: expect.any(String),
                        name: expect.any(String),
                        data: expect.any(Number),
                        target: expect.any(String),
                        owner: expect.any(String)
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
                //
                // TODO: I don't know how to test this
                test('monitorDBStart should start a timer, call monitorDBCatchTimer, and monitorDBStop should stop the monitor', (done) => {

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
                    setTimeout(function(done){
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
                    done();

                    // TODO: this test needs to be reworked entirely
                    timetrap.config.db_monitor.agg_timer=1;
                    timetrap.monitorDBStop();
                });
            });
        });

    });
}); //end


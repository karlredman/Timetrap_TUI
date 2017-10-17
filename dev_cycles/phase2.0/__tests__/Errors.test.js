// Errors.test.js
// jest tests for Errors.js
"use strict";

var {TimetrapTUI_Error} = require('../Errors');


describe('TimetrapTUI_Error class', function() {
    describe('Validate TimetrapTUI_Error class instantiated as object', function() {
        var error = new TimetrapTUI_Error({});
        test('Validate instatniation as object (with new)', function() {
            expect(error).toBeDefined();
        });
        test('InstanceOf EventEmitter', function() {
            expect(error).toBeInstanceOf(Error);
        });
        test('InstanceOf Timetrap', function() {
            expect(error).toBeInstanceOf(TimetrapTUI_Error);
        });
        test('Verify default consructor values', function() {
			//expect(error.name).toBeDefined(error.constructor.name);
            expect(error.name).toEqual(error.constructor.name);
        });
    });
});

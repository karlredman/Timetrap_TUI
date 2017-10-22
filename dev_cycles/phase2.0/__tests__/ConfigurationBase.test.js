"use strict"

var {Configuration} = require('../Configuration');

describe('Configuration basic class definition', function() {
    let config = new Configuration({});
    describe('instantiated as object:', function() {
        test('Validate instatniation as object (with new)', function() {
            expect(config).toBeDefined();
        });
        test('InstanceOf Configuration', function() {
            expect(config).toBeInstanceOf(Configuration);
        });
    });
    describe('data structure attributes:', function() {
        test('Verify process data strucures', function() {
            Object.keys(config.data.process).forEach(function(key){
                expect(config.data.process[key]).toEqual(expect.any(Object));
            });
        });
        test('Verify process data strucures', function() {
            Object.keys(config.data.process).forEach(function(key){
                expect(config.data.process[key]).toMatchObject({
                    value: expect.anything(),
                    desc: expect.any(String),
                    options: expect.any(String)
                });
            });
        });
    });
});

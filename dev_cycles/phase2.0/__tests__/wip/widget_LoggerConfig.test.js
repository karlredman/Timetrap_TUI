"use strict"

var {LoggerConfig} = require('../widget_LoggerConfig');

describe('LoggerConfig basic class definition', function() {
    let config = new LoggerConfig({});
    describe('is instantiated as object:', function() {
        test('Validate instatniation as object (with new)', function() {
            expect(config).toBeDefined();
        });
        test('InstanceOf LoggerConfig', function() {
            expect(config).toBeInstanceOf(LoggerConfig);
        });
    });
    describe('data structure attributes:', () => {
        test('Verify widget data strucures', () => {
            expect(config.widget).toMatchObject({
                traits: expect.any(Object),
                colors: expect.any(Object)
            });
        });
        test('Verify widget.traits data strucures', () => {
            Object.keys(config.widget.traits).forEach((key) => {
                expect(config.widget.traits[key]).toMatchObject({
                    value: expect.anything(),
                    desc: expect.any(String),
                    options: expect.any(String)
                });
            });
        });
        test('Verify widget.colors data strucures', () => {
            Object.keys(config.widget.colors).forEach((key) => {
                expect(config.widget.colors[key]).toMatchObject({
                    opaque: expect.any(String),
                    dark: expect.any(String),
                    light: expect.any(String),
                    desc: expect.any(String)
                });
            });
        });
    });
});

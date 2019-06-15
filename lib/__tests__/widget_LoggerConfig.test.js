'use strict';

var {LoggerConfig} = require('../widget_LoggerConfig');

describe('LoggerConfig basic class definition', function() {
  const config = new LoggerConfig({});
  describe('is instantiated as object:', function() {
    test('Validate instatniation as object (with new)', function() {
      expect(config).toBeDefined();
    });
    test('InstanceOf LoggerConfig', function() {
      expect(config).toBeInstanceOf(LoggerConfig);
    });
  });
});

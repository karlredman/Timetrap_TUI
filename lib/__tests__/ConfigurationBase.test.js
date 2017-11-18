"use strict"

var {ConfigurationBase} = require('../ConfigurationBase');

describe('ConfigurationBase basic class definition', () => {
    let config = new ConfigurationBase({root_title:'DomainTitle', title:'SectionTitle'});
    describe('instantiated as object:', () =>{
        test('Validate instatniation as object (with new)', () => {
            expect(config).toBeDefined();
        });
        test('InstanceOf ConfigurationBase', () => {
            expect(config).toBeInstanceOf(ConfigurationBase);
        });
    });
});
describe('ConfigurationBase file i/o:', () => {
    // Note: order is important here -could overwrite the test yml input file
    // This section is *sequential*
    let config = new ConfigurationBase({version: '0.2.0',
        config_file: './lib/__tests__/input/ConfigurationBase.yml',
        root_title:'DomainTitle',
        title:'SectionTitle',
        config_options: {
            ExtraSection: {
                value: "some value",
                desc: "description of extra section",
                options: 'none'
            }
        }
    });
    test('config options override file options', () => {
        expect(config.data.ExtraSection).toBeDefined();
    });

    // file used for testing
    let output_config_file = './lib/__tests__/output/ConfigurationBase.yml';

    test('load data structure from configuration.yml file', () => {
        expect(config.data.config_file.desc).toBe("the timetrap config file path");
        expect(config.data.SectionTitle).not.toBeDefined();
    });
    test('verify root_title and title are NOT in the data structure', () => {
        expect(config.data.DomainTitle).not.toBeDefined();
        expect(config.data.SectionTitle).not.toBeDefined();
    });
    test('write data as yaml to file in output folder', () => {
        // Note: need to change the config file value first for later tests
        config.data.config_file.value = output_config_file;

        // write the file
        config.dumpToYAML();
        config.dumpToYAML({file: output_config_file});

        // change a value so we can have the file contents override it
        config.data.config_file.value = output_config_file+"TEST";

        // now load the file from output dir
        config.loadFile({config_file: output_config_file});

        // test the data element
        expect(config.data.config_file.value).toBe(output_config_file);
    });
    test('reload file coverage', () =>{
        config.loadFile();
        expect(config.data.config_file.value).toBe(output_config_file);
    });
    test('option override coverage', () =>{
        let orig_working_directory = config.data.working_directory;
        let new_working_directory = {
            working_directory: {
                value: "/someplace",
                desc: "some description",
                options: "nothing specific"
            }
        };
        config.loadOptions(new_working_directory);
        expect(config.data.working_directory.value).toBe("/someplace");
    });
    test('update yaml file', () =>{
        config.updateYAML();
		expect(config.data.config_file.value).toBe(output_config_file);
	});
});

describe('error conditions', () => {
	test('failed to fullfill constructor argument requirements', () => {
		expect(() => {
			let config = new ConfigurationBase({
				root_title:'DomainTitle'})
		}).toThrow();
		expect(() => {
			let config = new ConfigurationBase({
				title:'SectionTitle'})
		}).toThrow();
	});
	test('loadFile() failure (bad file name)', () => {
		let config = new ConfigurationBase({root_title:'DomainTitle',
			title:'SectionTitle'});
		expect(() => { config.loadFile({config_file: 'NOFILE'})
		}).toThrow(Error);
	});
	test('updateYAML() failure (bad file name)', () => {
		let config = new ConfigurationBase({root_title:'DomainTitle',
			title:'SectionTitle'});
		expect(() => { config.updateYAML({file: 'NOFILE'})
		}).toThrow();
	});
	test('dumpToYAML() failure (unable to write file)', () => {
		let config = new ConfigurationBase({root_title:'DomainTitle',
			title:'SectionTitle'});
        expect(() => { config.dumpToYAML({file: './lib/__tests/input/READONLY'})
		}).toThrow();
	});
});

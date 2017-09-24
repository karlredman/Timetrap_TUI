"use strict";

var program = require('commander');
var command = require('commander');
var util = require('util')

function main(argv, callback) {

	console.log("------------ done.")
}
// Process loop
if (!module.parent) {
	process.title = 'Timetrap TUI';
	main(process.argv.slice(), function(err) {
		if (err) throw err;
		return process.exit(0);
	});
} else {
	module.exports = main;
}

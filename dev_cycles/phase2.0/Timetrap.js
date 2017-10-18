// Timetrap.js
// class wrapper of Timetrap command line program
"use strict"

// debugging
var util = require('util');

// includes
const {spawn} = require('child_process');


// custom Error
class Timetrap_Error extends Error {
	constructor(message){
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

// parent
const {EventEmitter} = require('events').EventEmitter;

// class
class Timetrap extends EventEmitter {
	constructor({working_directory = '/tmp'
	} ={}){
		super();
		// Directory where we can call timetrap command without worrrying
		// if recursive `nested_dotfiles`
		this.config = {
			working_directory: `${working_directory}`,
		};
		this.data = {
		};
		this.registerCommandTypes();
	};
}

Timetrap.prototype.registerCommandTypes = function(data){
	this.command_types = {
		timetrap: {
			_command: ["timetrap", "t"],
			args: [],
			required: [],
			allow_sheet: false,
			special: true,
			get command(){return this._command[0]}
		},
		changeSheet:{
			_command: ["sheet", "s"],
			args: [],
			required: [],
			allow_sheet: true,
			special: false,
			get command(){return this._command[0]}
		},
		checkIn:{
			_command: ["in", "i"],
			args: [["-a", "--at"]],
			required: [],
			allow_sheet: false,
			special: false,
			get command(){return this._command[0]}
		},
		checkOut:{
			_command: ["out", "o"],
			args: [["-a", "--at"]],
			required: [],
			allow_sheet: true,
			special: false,
			get command(){return this._command[0]}
		},
		resume:{
			_command: ["resume", "r"],
			args: [
				["-a", "--at"],
				["-i", "--id"]
			],
			required: [],
			allow_sheet: false,
			special: false,
			get command(){return this._command[0]}
		},
		edit:{
			_command: ["edit", "e"],
			args: [
				// TODO: test compound statements
				["--id", "-i"],
				["--start", "-s"],        //can not be used with --end
				["--end", "-e"],          //can not be used with --start
				["--append", "-z"],
				["--move", "-m"]          //implement with EXTREME caution
			],
			required: [],
			allow_sheet: false,
			special: false,
			get command(){return this._command[0]}
		},
		today:{
			_command: ["today", "t"],
			args: [["-v", "--ids"], ["-fjson", "--format json"]],
			required: ["--ids", "--format json"],
			allow_sheet: true,
			special: false,
			get command(){return this._command[0]}
		},
		yesterday:{
			_command: ["yesterday", "y"],
			args: [["-v", "--ids"], ["-fjson", "--format json"]],
			required: ['--ids', '-fjson'],
			allow_sheet: true,
			special: false,
			get command(){return this._command[0]}
		},
		week:{
			_command: ["week", "w"],
			args: [["-v", "--ids"], ["-fjson", "--format json"]],
			required: ['--ids', '-fjson'],
			//required: ['--ids'],
			allow_sheet: true,
			special: false,
			get command(){return this._command[0]}
		},
		month:{
			_command: ["month", "m"],
			args: [["-v", "--ids", "-fjson", "--format json"]],
			required: ['--ids', '-fjson'],
			allow_sheet: true,
			special: false,
			get command(){return this._command[0]}
		},
		display: {
			_command: ["display", "d"],
			args: [
				["--ids", "-v"],
				["--start", "-s"],
				["--end", "-e"],
				["--grep", "-g"]
			],
			required: ['--ids'],
			allow_sheet: true,
			special: false,
			get command(){return this._command[0]}
		},
		now:{
			_command: ["now", "n"],
			args: [],
			required: [],
			allow_sheet: false,
			special: true,
			get command(){return this._command[0]}
		},
		kill:{
			_command: ["kill", "k"],
			//TODO: handle delicately -deletes either id or timesheet
			args: [["--id", "-i"]],
			required: [],
			allow_sheet: false,     //could be true but we'll make a special exception in code
			special: true,
			get command(){return this._command[0]}
		},
	};

	// // TODO: add getters automagically -something like ...
	// for(let key in this._command_types){
	//     Object.defineProperty(this.command_types.changeSheet.command,
	//         'command_types.changeSheet.command',
	//         {get: function() {return this.command_types.changeSheet._command[0]}});
	// }
	// Object.defineProperty(this._command_types.changeSheet,
	//     'changeSheet.command',
	//     {get: function() {return this.command_types.changeSheet._command[0]}});
}

Timetrap.prototype.callCommand = function({type = 'display', sheet = 'default', content = ''} ={}) {

	let _this = this;

	let data = {
		type: `${type}`,
		sheet: `${sheet}`,
		content: `${content}`,
	};

	let args = [];

	if(this.command_types[data.type].required.length > 0){
		//args = [this.command_types[data.type].command, this.command_types[data.type].required[0], data.content];
		//args = [this.command_types[data.type].command, this.command_types[data.type].required[0], data.content];
		args.push(this.command_types[data.type].command);
		args.push(this.command_types[data.type].required);
		args.push(data.content);
	}
	else {
		args = [this.command_types[data.type].command, data.content];
	}

	if( (data.type === 'checkOut')
		|| (data.type === 'changeSheet') )
	{
		//just push the sheet on to the args stack
		args.push(data.sheet);
	}

	console.log("-------------------------------");
	console.log("-------------------------------");
	console.log("args: " +util.inspect(args, null, 10));
	console.log("1-------------------------------");

	if( ! this.command_types[data.type].allow_sheet){
		// we have to change the sheet
		//cmd = spawn(_this.command_types.timetrap.command, ['sheet', data.sheet], {cwd: _this.config.working_directory});

		// let thing = {command: this.command_types.timetrap.command,
		// 	args: [],
		// 	sheet: data.sheet,
		// 	type: 'changeSheet'
		// }
		// 		console.log("thing"+util.inspect(thing, null, 10));

		this.doCallCommand({command: this.command_types.timetrap.command,
			args: ['sheet', data.sheet],
			sheet: data.sheet, type: 'changeSheet'} ).then(function(result){
				// handle output
				console.log("got here: changed sheet");
				console.log(util.inspect(result, null, 10));
				console.log(util.inspect(args, null, 10));
				console.log("2-------------------------------");

				// now call the actual command
				//console.log(util.inspect(args, null, 10));
				_this.doCallCommand({command: _this.command_types.timetrap.command,
					args: args, sheet: data.sheet, type: data.type} ).then(function(result){
						// handle output
						console.log("got here: command after sheet returned: change");
						console.log(util.inspect(result, null, 10));
						console.log(util.inspect(args, null, 10));
						console.log("3-------------------------------");

						// console.log(util.inspect(result, null, 10));
					}, function(err){
						// handle error
						console.log("XXXXXXXXXXXXXXXXXXXXx got here: command after sheet: error returned: ", err);
					});
			}, function(err){
				// handle error
				console.log("yyyyyyyyyyyyyyy got here: handle error: ", err);
			});
	}
	else {
		console.log("got here: direct call");
		// we call the command with the sheet
		this.doCallCommand({command: this.command_types.timetrap.command,
			args: args, sheet: data.sheet, type: data.type} ).then(function(result){
				// handle output
				//console.log(util.inspect(result, null, 10));
				console.log("got here: direct command call returned");
				console.log(util.inspect(result, null, 10));
				console.log(util.inspect(args, null, 10));
			}, function(err){
				// handle error
				console.log("got here: direct command call error returned: ", err);
			});
	}
}

Timetrap.prototype.doCallCommand = function({
	command = this.command_types.timetrap.command,
	args = [['display'],['-v']], sheet = 'default',
	type = 'display'} ={})
{
	let _this = this;

	let data = {
		command: `${command}`,
		args: `${args}`.split(','),		//TODO: understand why args is being turned into a string
		sheet: `${sheet}`,
		type: `${type}`,
	}
	let output = {
		stdoutData: '',
		stderrData: '',
		code: 0,
		signal: '',
		sheet: data.sheet,
		type: data.type
	};


	return new Promise(function(resolve, reject){

		// we're using the promise to conditionally serialize a second call to
		// the timetrap program for commands that require a sheet change before
		// execution

		// console.log("data.args: "+util.inspect(data.args, null, 10));
		// console.log("command: "+_this.command_types.timetrap.command+" "+data.args.join(" "));

		// let cmd = undefined;
		// if(data.type === 'changeSheet'){
		// 	cmd = spawn(_this.command_types.timetrap.command, data.args);
		// } else {
		// 	cmd = spawn("timetrap", ['in', 'testing1']);
		// }

		// const cmd = spawn(_this.command_types.timetrap.command, data.args);
		const cmd = spawn(_this.command_types.timetrap.command, data.args, {cwd: _this.config.working_directory});

		cmd.stdout.on('data', (data) => {
			output.stdoutData += data;
		});

		cmd.stderr.on('data', (data) => {
			output.stderrData += data;
		});

		cmd.once('close', function (){
			resolve(output);
		});
		cmd.on('close', (code, signal) => {
			output.code = code;
			output.signal = signal;
			reject(output);
		})
	});
}

// Timetrap.prototype.doCallCommand2 = function({
// 	command = this.command_types.timetrap.command,
// 	args = [['display'],['-v']], sheet = 'default',
// 	type = 'display'} ={})
// {
// 	let _this = this;

// 	let data = {
// 		command: `${command}`,
// 		args: `${args}`.split(','),		//TODO: understand why args is being turned into a string
// 		sheet: `${sheet}`,
// 		type: `${type}`,
// 	}
// 	let output = [{
// 		stdoutData: '',
// 		stderrData: '',
// 		code: 0,
// 		sheet: data.sheet,
// 		type: data.type
// 	}]
// 	return new Promise(function(resolve, reject){

// 		// we're using the promise to conditionally serialize a second call to
// 		// the timetrap program for commands that require a sheet change before
// 		// execution

// 		let cmd = undefined;

// 		if( ! _this.command_types[data.type].allow_sheet){
// 			// we have to change the sheet
// 			cmd = spawn(_this.command_types.timetrap.command, ['sheet', data.sheet], {cwd: _this.config.working_directory});
// 		}
// 		else {
// 			cmd = spawn(_this.command_types.timetrap.command, data.args, {cwd: _this.config.working_directory});
// 		}

// 		cmd.stdout.on('data', (data) => {
// 			output[0].stdoutData += data;
// 			//resolve(output);
// 		});

// 		cmd.stderr.on('data', (data) => {
// 			output[0].stderrData += data;
// 			//resolve(output);
// 		});

// 		cmd.on('close', (code) => {
// 			output[0].code = code;
// 			//resolve(output);
// 		})
// 		return output;
// 	}).then( function(output) {
// 		if( ! _this.command_types[data.type].allow_sheet) {

// 			output.push([]);
// 			let cmd = spawn(_this.command_types.timetrap.command, data.args, {cwd: _this.config.working_directory})

// 			cmd.stdout.on('data', (data) => {
// 				output[1].stdoutData += data;
// 				//resolve(output);
// 			});

// 			cmd.stderr.on('data', (data) => {
// 				output[1].stderrData += data;
// 				//resolve(output);
// 			});

// 			cmd.on('close', (code) => {
// 				output[1].code = code;
// 				//resolve(output);
// 			})
// 		}
// 	});
// 	//	console.log(util.inspect(output, null, 10));
// }

module.exports = {Timetrap, Timetrap_Error};

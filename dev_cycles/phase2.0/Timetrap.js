// Timetrap.js
// class wrapper of Timetrap command line program
"use strict"

// DEBUGGING
var util = require('util');

// includes
const {spawn, spawnSync} = require('child_process');
const fs = require('fs');
const path = require('path');


// custom Error
class Timetrap_Error extends Error {
	constructor(message){
		message = "Timetrap Error: "+message;
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

// parent
const {EventEmitter} = require('events').EventEmitter;

// class
class Timetrap extends EventEmitter {
	constructor({
		working_directory = '/tmp',
		watched_db_file = process.env.HOME+"/.timetrap.db"
	} ={}){

		super();
		this.config = {
			working_directory: `${working_directory}`,
			db_monitor: {
				IN_MODIFY_count: 0,			//aggregate file mod counter
				watched_db_file: `${watched_db_file}`,
				agg_time: 500,
				agg_timer: 0
			},
		};
		this.data = {
		};

		//order is important
		this.registerCommandTypes();
		this.registerEmitTypes();
	};
}

////////////////////////////////////////////
/////////////// Data Structures
////////////////////////////////////////////

Timetrap.prototype.registerEmitTypes = function(){
	this.emit_types = {
		command_complete: {
			description: "The object emitted after callCommand() completes",
			name: "command_complete",
			data: Object.assign({}, this.command_types.output),
			target: {}				// owner
		},
		db_change: {
			description: "The object emitted from monitorDB when the database changes",
			name: "db_change",
			data: Number(0),		// unixtime
			target: {}				// owner
		}
	};
}

Timetrap.prototype.registerCommandTypes = function(){
	this.command_types = {
		timetrap: {
			description: "the main timetrap command",
			_command: ["timetrap", "t"],
			args: [],
			required: [],
			allow_sheet: false,
			special: true,
			override: false,
			get command(){return this._command[0]}
		},
		changeSheet:{
			description: "a sheet name",
			_command: ["sheet", "s"],
			args: [],
			required: [],
			allow_sheet: true,
			special: false,
			override: false,
			get command(){return this._command[0]}
		},
		checkIn:{
			description: "checkin command",
			_command: ["in", "i"],
			args: [["-a", "--at"]],
			required: [],
			allow_sheet: false,
			special: false,
			override: false,
			get command(){return this._command[0]}
		},
		checkOut:{
			description: "checkout command",
			_command: ["out", "o"],
			args: [["-a", "--at"]],
			required: [],
			allow_sheet: true,
			special: false,
			override: false,
			get command(){return this._command[0]}
		},
		resume:{
			description: "resume command",
			_command: ["resume", "r"],
			args: [
				["-a", "--at"],
				["-i", "--id"]
			],
			required: [],
			allow_sheet: false,
			special: true,
			override: false,
			get command(){return this._command[0]}
		},
		edit:{
			description: "edit command",
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
			override: false,
			get command(){return this._command[0]}
		},
		today:{
			description: "today display alias command",
			_command: ["today", "t"],
			args: [["-v", "--ids"], ["-fjson", "--format json"]],
			required: ["--ids", "--format json"],
			allow_sheet: true,
			special: false,
			override: false,
			get command(){return this._command[0]}
		},
		yesterday:{
			description: "yesterday display alias command",
			_command: ["yesterday", "y"],
			args: [["-v", "--ids"], ["-fjson", "--format json"]],
			required: ['--ids', '-fjson'],
			allow_sheet: true,
			special: false,
			override: false,
			get command(){return this._command[0]}
		},
		week:{
			description: "week display alias command",
			_command: ["week", "w"],
			args: [["-v", "--ids"], ["-fjson", "--format json"]],
			required: ['--ids', '-fjson'],
			//required: ['--ids'],
			allow_sheet: true,
			special: false,
			override: false,
			get command(){return this._command[0]}
		},
		month:{
			description: "month display alias command",
			_command: ["month", "m"],
			args: [["-v", "--ids", "-fjson", "--format json"]],
			required: ['--ids', '-fjson'],
			allow_sheet: true,
			special: false,
			override: false,
			get command(){return this._command[0]}
		},
		display: {
			description: "display command",
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
			override: false,
			get command(){return this._command[0]}
		},
		now:{
			description: "now command",
			_command: ["now", "n"],
			args: [],
			required: [],
			allow_sheet: false,
			special: true,
			override: false,
			get command(){return this._command[0]}
		},
		list:{
			description: "list command",
			_command: ["list", "l"],
			args: [],
			required: [],
			allow_sheet: false,
			special: true,
			override: false,
			get command(){return this._command[0]}
		},
		kill:{
			description: "kill command",
			_command: ["kill", "k"],
			//TODO: handle delicately -deletes either id or timesheet
			args: [["--id", "-i"]],
			required: [],
			allow_sheet: false,     //could be true but we'll make a special exception in code
			special: true,
			override: false,
			get command(){return this._command[0]}
		},
		output: {
			description: "callCommand output data structure",
			_command: [''],
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
	};
}

Timetrap.prototype.dumpOutput = function(output, method) {
	switch(method){
		case 'console':
			console.log("["+(output.sync?'sync':'async')+"]");
			for( let key in output){
				//let sync =
				console.log(key+": "+String(output[key]));
			}
			break;
		default:
			throw new Timetrap_Error("[dumpOutput] specified method not supported");
			break;
	}
}

////////////////////////////////////////////
/////////////// Commands Interface
////////////////////////////////////////////

Timetrap.prototype.callCommand = function({type = '', target = undefined, sheet = '', content = '', sync = false} ={}) {
	// calls the timetrap program with the appropriat command 'type'
	// performs actions like `timetrap --ids dispaly sheetName`

	// required parameters
	if(type === '')	{
		throw new Timetrap_Error("[CallCommand] no type argument");
	}
	// if( ! target )	{
	// 	throw new Timetrap_Error("[CallCommand] no target argument");
	// }


	let _this = this;

	let data = {
		type: type,
		sheet: sheet,
		content: content,
		sync: sync
	};

	// init the return object
	let emit_obj = Object.assign({}, this.emit_types.command_complete);
	//emit_obj.target = data.target;
	emit_obj.target = undefined;


	let args = [];

	// add required arguments
	if(this.command_types[data.type].required.length > 0){
		console.log("got here");
		args = [this.command_types[data.type].command, this.command_types[data.type].required, data.content];

		// TODO: derp flatten args -inconsistent data....
		args = [].concat.apply([], args);
		console.log(args)
	}
	else {
		args = [this.command_types[data.type].command, data.content];
	}

	//some commands can be run with a sheet specification
	if( (data.type === 'checkOut')
		|| (data.type === 'changeSheet') )
	{
		//just push the sheet on to the args stack
		args.push(data.sheet);
	}


	if( ! data.sync ){
		//run asynchronous
		// for commands that don't allow a sheet to be specified, we have to switch
		// to the sheet manually. this is done via a promise chain. There's probably
		// a better way to do this....

		if( ( ! this.command_types[data.type].allow_sheet)
		&& ( ! this.command_types[data.type].special) ){
			// we have to change the sheet

			this.doCallCommandAsync({command: this.command_types.timetrap.command,
				args: ['sheet', data.sheet],
				sheet: data.sheet, type: 'changeSheet'} ).then(function(output){
					// handle output
					emit_obj.data = Object.assign({}, output);
					_this.emit(_this.emit_types.command_complete.name, emit_obj);


					// now call the actual command
					_this.doCallCommandAsync({command: _this.command_types.timetrap.command,
						args: args, sheet: data.sheet, type: data.type} ).then(function(output){
							// handle output
					emit_obj.data = Object.assign({}, output);
							_this.emit(_this.emit_types.command_complete.name, emit_obj);

						}, function(err){
							// handle error
							throw new Timetrap_Error("attempt to "+data.type+" sheet failed ["+err+"]");
						});
				}, function(err){
					// handle error
					throw new Timetrap_Error("attempt to change sheet failed ["+err+"]");
				});
		}
		else {
			// call the command with the sheet (i.e. change sheet, checkout)
			this.doCallCommandAsync({command: this.command_types.timetrap.command,
				args: args, sheet: data.sheet, type: data.type} ).then(function(output){
					// handle output
					emit_obj.data = Object.assign({}, output);
					_this.emit(_this.emit_types.command_complete.name, emit_obj);
					//_this.dumpOutput(output, 'console');

				}, function(err){
					// handle error
					throw new Timetrap_Error("attempt to "+data.type+" sheet failed ["+err+"]");
				});
		}
	}
	else {
		// TODO: handle errors
		//run synchronous
		//doCallCommandSync
		if( ( ! this.command_types[data.type].allow_sheet )
		&& ( ! this.command_types[data.type].special) ){
			// we have to change the sheet first
			let output = this.doCallCommandSync({command: this.command_types.timetrap.command,
				args: ['sheet', data.sheet],
				sheet: data.sheet, type: 'changeSheet'} );
			// handle output
					emit_obj.data = Object.assign({}, output);
			this.emit(this.emit_types.command_complete.name, emit_obj);
		}
		let output = this.doCallCommandSync({command: this.command_types.timetrap.command,
			args: args, sheet: data.sheet, type: data.type} );
		// handle output
					emit_obj.data = Object.assign({}, output);
		this.emit(this.emit_types.command_complete.name, emit_obj);
	}
}

Timetrap.prototype.doCallCommandSync = function({
	command = this.command_types.timetrap.command,
	args = [['display'],['-v']], sheet = 'default',
	type = 'display'} ={})
{
	let data = {
		command: command,
		args: args.filter(function(e) { return e === 0 || e;}),
		sheet: sheet,
		type: type,
	}

	// seed the output structure
	let output = Object.assign({}, this.command_types.output);

	// TODO: needs error block
	const cmd = spawnSync(this.command_types.timetrap.command, data.args,
		{cwd: this.config.working_directory});

	output.sheet = data.sheet;
	output.type = data.type;
	output.stdoutData = String(cmd.stdout);
	output.stderrData = String(cmd.stderr);
	output.code = cmd.status;
	output.signal = cmd.signal;
	output.sync = true;
	output.cmdln = [this.command_types.timetrap.command, data.args];

	return output;
}

Timetrap.prototype.doCallCommandAsync = function({
	command = this.command_types.timetrap.command,
	args = [['display'],['-v']], sheet = 'default',
	type = 'display'} ={})
{
	// return a promise of an asynch execution of the command
	let _this = this;

	let data = {
		command: command,
		args: args.filter(function(e) { return e === 0 || e;}),
		sheet: sheet,
		type: type,
	}

	// seed the output structure
	let output = Object.assign({}, this.command_types.output);
	output.sheet = data.sheet;
	output.type = data.type;
	output.sync = false;
	output.cmdln = [this.command_types.timetrap.command, data.args];


	return new Promise(function(resolve, reject){

		// we're using the promise to conditionally serialize a second call to
		// the timetrap program for commands that require a sheet change before
		// execution

		//spawn the process
		const cmd = spawn(_this.command_types.timetrap.command, data.args,
			{cwd: _this.config.working_directory});

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


////////////////////////////////////////////
/////////////// Database Monitoring
////////////////////////////////////////////

Timetrap.prototype.monitorDBStart = function(){
	// monitors the database

	// TODO: assert if timer is already running

	let _this = this;

	this.config.db_monitor.IN_MODIFY_count = 0;

	//start the watcher
	this.config.db_monitor.watcher = fs.watch(this.config.db_monitor.watched_db_file);

	this.config.db_monitor.watcher.on('change', (event, filename) => {

		if(filename == path.basename(this.config.db_monitor.watched_db_file) ){

			//incriment counter
			this.config.db_monitor.IN_MODIFY_count++;

			//start timer
			if ( this.config.db_monitor.IN_MODIFY_count > 0) {
				// The kernel emits multiple IN_MODIFY events via libuv +
				// sometimes multiple writes occur for an action via timetrap
				// -so we'll only report the composite within a (arbitrary)
				// time window of 1 second.
				// see: [fs.watch has double change events for file writes · Issue #3042 · nodejs/node]
				// (https://github.com/nodejs/node/issues/3042)
				this.config.db_monitor.agg_timer = setTimeout(function () {
					_this.monitorDBCatchTimer(_this.config.db_monitor.IN_MODIFY_count);
				}, this.config.db_monitor.agg_time);
			}
		}
		//else {console.log("got here: "+filename)}
	});
}

Timetrap.prototype.monitorDBCatchTimer = function() {
	//triggers an emit after a db change aggregate occurs (via timer)
	if (this.config.db_monitor.IN_MODIFY_count > 0){
		//data structure
		this.config.db_monitor.IN_MODIFY_count=0;
		let obj = Object.assign({}, this.emit_types.db_change);
		obj.data = Date.now();
		this.emit('db_change', obj);
	}
}

Timetrap.prototype.monitorDBStop = function(){
	if(this.config.db_monitor.agg_timer){
		//TODO: bette way to do this?
		delete this.config.db_monitor.watcher;
		clearTimer(this.config.db_monitor.agg_timer);
		this.config.db_monitor.agg_timer = 0;
	}
}

////////////////////////////////////////////
/////////////// Under Development
////////////////////////////////////////////

//Timetrap.prototype.stopAllTimers = function(data){
Timetrap.prototype.checkoutAllSheets = function(data){
}

////////////////////////////////// TODO
// Timetrap.prototype.fetchRunningInfo = function(running_list){
// Timetrap.prototype.fakeTimer = function(command){
// Timetrap.prototype.updateListTimes = function(){
// Timetrap.prototype.fetch_list = function(){
// Timetrap.prototype.fetch_tree = function(list){

module.exports = {Timetrap, Timetrap_Error};

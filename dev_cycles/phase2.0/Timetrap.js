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

		//_this.watched_file = "/home/karl/Documents/Heorot/timetrap/timetrap.db"
		super();
		// Directory where we can call timetrap command without worrrying
		// if recursive `nested_dotfiles`
		this.config = {
			working_directory: `${working_directory}`,
			watched_db_file: `${watched_db_file}`,
		};
		this.data = {
		};

		//order is important
		this.registerCommandTypes();
		this.registerEmmitTypes();
	};
}

////////////////////////////////////////////
/////////////// Data Structures
////////////////////////////////////////////

Timetrap.prototype.registerEmmitTypes = function(){
	this.emmit_types = {
		command_complete: {
			description: "The type of object emitted after callCommand() completes",
			name: "command_complete",
			data: Object.assign({}, this.command_types.output)
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
			get command(){return this._command[0]}
		},
		changeSheet:{
			description: "a sheet name",
			_command: ["sheet", "s"],
			args: [],
			required: [],
			allow_sheet: true,
			special: false,
			get command(){return this._command[0]}
		},
		checkIn:{
			description: "checkin command",
			_command: ["in", "i"],
			args: [["-a", "--at"]],
			required: [],
			allow_sheet: false,
			special: false,
			get command(){return this._command[0]}
		},
		checkOut:{
			description: "checkout command",
			_command: ["out", "o"],
			args: [["-a", "--at"]],
			required: [],
			allow_sheet: true,
			special: false,
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
			special: false,
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
			get command(){return this._command[0]}
		},
		today:{
			description: "today display alias command",
			_command: ["today", "t"],
			args: [["-v", "--ids"], ["-fjson", "--format json"]],
			required: ["--ids", "--format json"],
			allow_sheet: true,
			special: false,
			get command(){return this._command[0]}
		},
		yesterday:{
			description: "yesterday display alias command",
			_command: ["yesterday", "y"],
			args: [["-v", "--ids"], ["-fjson", "--format json"]],
			required: ['--ids', '-fjson'],
			allow_sheet: true,
			special: false,
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
			get command(){return this._command[0]}
		},
		month:{
			description: "month display alias command",
			_command: ["month", "m"],
			args: [["-v", "--ids", "-fjson", "--format json"]],
			required: ['--ids', '-fjson'],
			allow_sheet: true,
			special: false,
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
			get command(){return this._command[0]}
		},
		now:{
			description: "now command",
			_command: ["now", "n"],
			args: [],
			required: [],
			allow_sheet: false,
			special: true,
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
			get command(){return this._command[0]}
		}
	};
}

////////////////////////////////////////////
/////////////// API
////////////////////////////////////////////

Timetrap.prototype.callCommand = function({type = 'display', sheet = 'default', content = ''} ={}) {
	// calls the timetrap program with the appropriat command 'type'
	// performs actions like `timetrap --ids dispaly sheetName`

	let _this = this;

	let data = {
		type: `${type}`,
		sheet: `${sheet}`,
		content: `${content}`,
	};

	let args = [];

	// add required arguments
	if(this.command_types[data.type].required.length > 0){
		args = [this.command_types[data.type].command, this.command_types[data.type].required, data.content];
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

	// for commands that don't allow a sheet to be specified, we have to switch
	// to the sheet manually. this is done via a promis chain. There's probably
	// a better way to do this....
	if( ! this.command_types[data.type].allow_sheet){
		// we have to change the sheet

		this.doCallCommand({command: this.command_types.timetrap.command,
			args: ['sheet', data.sheet],
			sheet: data.sheet, type: 'changeSheet'} ).then(function(result){
				// handle output

				// now call the actual command
				_this.doCallCommand({command: _this.command_types.timetrap.command,
					args: args, sheet: data.sheet, type: data.type} ).then(function(result){
						// handle output

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
		this.doCallCommand({command: this.command_types.timetrap.command,
			args: args, sheet: data.sheet, type: data.type} ).then(function(result){
				// handle output
				//console.log(util.inspect(result, null, 2));
			}, function(err){
				// handle error
				throw new Timetrap_Error("attempt to "+data.type+" sheet failed ["+err+"]");
			});
	}
}

Timetrap.prototype.doCallCommand = function({
	command = this.command_types.timetrap.command,
	args = [['display'],['-v']], sheet = 'default',
	type = 'display'} ={})
{
	// return a promise of an asynch execution of the command
	let _this = this;

	let data = {
		command: `${command}`,
		args: `${args}`.split(','),		//TODO: understand why args is being turned into a string
		sheet: `${sheet}`,
		type: `${type}`,
	}

	// seed the output structure
	let output = Object.assign({}, this.command_types.output);
	output.sheet = data.sheet;
	output.type = data.type;


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

Timetrap.prototype.monitorDB = function(){
	// monitors the database

    this.count = 0;
    this.watcher = fs.watch(this.config.watched_db_file);

    this.watcher.on('change', (event, filename) => {

        if(filename == path.basename(this.config.watched_db_file) ){
            //verify command

            //incriment counter
            _this.count++;

            //start timer
            if ( _this.count > 0) {
                //the kernel emits multiple IN_MODIFY events via libuv + sometimes
                // multiple writes occur for an action via timetrap -so we'll only
                // report the composite within a (arbitrary) time window of 1 second.
                // see [fs.watch has double change events for file writes · Issue #3042 · nodejs/node](https://github.com/nodejs/node/issues/3042)
                setTimeout(function () {
                    _this.catch_timer(_this.count);
                }, 1000);
                //}, 500);
            }
        }
        //else {console.log("got here: "+filename)}
    });
}
Timetrap.prototype.catch_timer = function() {
    if (this.count > 0){
        this.emit('db_change');
        //console.log("File "+_this.watched_file+" just changed "+count+" times!");
        this.count=0;
    }
}
module.exports = {Timetrap, Timetrap_Error};

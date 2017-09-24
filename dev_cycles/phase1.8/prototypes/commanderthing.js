"use strict";

var program = require('commander');

function main(argv, callback) {
	console.log("------------ start")

program
  .version('0.0.1')
  .option('-C, --chdir <path>', 'change the working directory')
  .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
  .option('-T, --no-tests', 'ignore test hook')

program
  .command('setup [env]')
  .description('run setup commands for all envs')
  .option("-s, --setup_mode [mode]", "Which setup mode to use")
  .action(function(env, options){
    var mode = options.setup_mode || "normal";
    env = env || 'all';
    console.log('setup for %s env(s) with %s mode', env, mode);
  });

program
  .command('exec <cmd>')
  .alias('ex')
  .description('execute the given remote cmd')
  .option("-e, --exec_mode <mode>", "Which exec mode to use")
  .action(function(cmd, options){
    console.log('exec "%s" using %s mode', cmd, options.exec_mode);
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ deploy exec sequential');
    console.log('    $ deploy exec async');
    console.log();
  });

program
  .command('*')
  .action(function(env){
    console.log('deploying "%s"', env);
  });

program.parse(process.argv);

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




// ////////////////////// options (timetrap: version 1.15.1  (2017-08-24 23:55:22 -0500)

// Timetrap - Simple Time Tracking

// Usage: timetrap COMMAND [OPTIONS] [ARGS...]

// COMMAND can be abbreviated. For example `t in` and `t i` are equivalent.

// COMMAND is one of:

//   * archive - Move entries to a hidden sheet (by default named '_[SHEET]') so //       they're out of the way.
//     usage: t archive [--start DATE] [--end DATE] [SHEET]
//     options('-s, --start <date:qs>','Include entries that start on this date or later')
//     options('-e, --end <date:qs>','Include entries that start on this date or earlier')
//     options('-g, --grep <regexp>','Include entries where the note matches this regexp.')

//   * backend - Open an sqlite shell to the database.
//     usage: t backend

//   * configure - Write out a YAML config file. Print path to config file.  The
//       file may contain ERB.
//     usage: t configure
//     Currently supported options are:
//       round_in_seconds:       The duration of time to use for rounding with
//                               the -r flag
//       database_file:          The file path of the sqlite database
//       append_notes_delimiter: delimiter used when appending notes via
//                               t edit --append
//       formatter_search_paths: an array of directories to search for user
//                               defined fomatter classes
//       default_formatter:      The format to use when display is invoked without a
//                               `--format` option
//       default_command:        The default command to run when calling t.
//       auto_checkout:          Automatically check out of running entries when
//                               you check in or out
//       require_note:           Prompt for a note if one isn't provided when
//                               checking in
//       note_editor:            Command to launch notes editor or false if no editor use.
//                               If you use a non terminal based editor (e.g. sublime, atom)
//                               please read the notes in the README.
//       week_start:             The day of the week to use as the start of the
//                               week for t week.

//   * display - Display the current timesheet or a specific. Pass `all' as SHEET to display all unarchived sheets or `full' to display archived and unarchived sheets.
//     usage: t display [--ids] [--start DATE] [--end DATE] [--format FMT] [SHEET | all | full]
//     -v, --ids                 Print database ids (for use with edit)
//     -s, --start <date:qs>     Include entries that start on this date or later
//     -e, --end <date:qs>       Include entries that start on this date or earlier
//     -f, --format <format>     The output format.  Valid built-in formats are
//                               ical, csv, json, ids, factor, and text (default).
//                               Documentation on defining custom formats can be
//                               found in the README included in this
//                               distribution.
//     -g, --grep <regexp>       Include entries where the note matches this regexp.

//   * edit - Alter an entry's note, start, or end time. Defaults to the active
//     entry. Defaults to the last entry to be checked out of if no entry is active.
//     usage: t edit [--id ID] [--start TIME] [--end TIME] [--append] [NOTES]
//     -i, --id <id:i>           Alter entry with id <id> instead of the running entry
//     -s, --start <time:qs>     Change the start time to <time>
//     -e, --end <time:qs>       Change the end time to <time>
//     -z, --append              Append to the current note instead of replacing it
//                                 the delimiter between appended notes is
//                                 configurable (see configure)
//     -m, --move <sheet>        Move to another sheet

//   * in - Start the timer for the current timesheet.
//     usage: t in [--at TIME] [NOTES]
//     -a, --at <time:qs>        Use this time instead of now

//   * kill - Delete a timesheet or an entry.
//     usage: t kill [--id ID] [TIMESHEET]
//     -i, --id <id:i>           Delete entry with id <id> instead of timesheet

//   * list - Show the available timesheets.
//     usage: t list

//   * now - Show all running entries.
//     usage: t now

//   * out - Stop the timer for a timesheet.
//     usage: t out [--at TIME] [TIMESHEET]
//     -a, --at <time:qs>        Use this time instead of now

//   * resume - Start the timer for the current time sheet for an entry. Defaults
//       to the active entry.
//     usage: t resume [--id ID] [--at TIME]
//     -i, --id <id:i>           Resume entry with id <id> instead of the last entry
//     -a, --at <time:qs>        Use this time instead of now

//   * sheet - Switch to a timesheet creating it if necessary. When no sheet is
//       specified list all sheets. The special sheetname '-' will switch to the
//       last active sheet.
//     usage: t sheet [TIMESHEET]

//   * today - Shortcut for display with start date as the current day
//     usage: t today [--ids] [--format FMT] [SHEET | all]

//   * yesterday - Shortcut for display with start and end dates as the day before the current day
//     usage: t yesterday [--ids] [--format FMT] [SHEET | all]

//   * week - Shortcut for display with start date set to a day of this week.
//     The default start of the week is Monday.
// .
//     usage: t week [--ids] [--end DATE] [--format FMT] [SHEET | all]

//   * month - Shortcut for display with start date set to the beginning of either
//       this month or a specified month.
//     usage: t month [--ids] [--start MONTH] [--format FMT] [SHEET | all]

//   OTHER OPTIONS

//   -h, --help              Display this help.
//   -r, --round             Round output to 15 minute start and end times.
//   -y, --yes               Noninteractive, assume yes as answer to all prompts.
//   --debug                 Display stack traces for errors.

//   EXAMPLES

//   # create the "MyTimesheet" timesheet
//   $ t sheet MyTimesheet

//   # check in 5 minutes ago with a note
//   $ t in --at '5 minutes ago' doing some stuff

//   # check out
//   $ t out

//   # view current timesheet
//   $ t display

//   Submit bugs and feature requests to http://github.com/samg/timetrap/issues

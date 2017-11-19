# Project: Timetrap wrapper lib for node.js

Author: [Karl N. Redman](https://karlredman.github.io/)

## Note:

This library is a work in progress. More info soon.

## Description:

This is a wrapper library for the [Timetrap](https://github.com/samg/timetrap) command line ruby application. The library offers and api for synchronous and asynchronous timetrap system calls. timetrap_wraplib is used in [Timetrap_TUI](https://github.com/karlredman/Timetrap_TUI).

* See the project [pindex.md](https://github.com/karlredman/node-timetrap_wraplib/blob/master/pindex.md) file for directory layout.
* See the project [Timetrap.example.js](https://github.com/karlredman/node-timetrap_wraplib/blob/master/examples/Timetrap.example.js) file for directory layout.

## Requirements:
* Linux (currently)
* a running [Timetrap](https://github.com/samg/timetrap) installation
* node.js v8.4+

## Features
* database change monitoring emits event
* synchronous and asynchrounous calls to timetrap
* commands:
    * check in, check out, edit, today, yesterday, week, month, display, stop all clocks, list, now, get current running id's

## Upcoming Features:
* better documentation
* commands:
	* kill
	* move
	* archive

## Installation:
```
npm install --save-dev timetrap_wraplib
```

## Example Configuration / Usage:
### Configuration:
* `examples/Timetrap.example.js`
	1. in `function main` specify the database file to watch
		* ...if you want to run the database file monitoring functionality
	2. uncomment the code you want to run
	3. run the example
	```
	node ./Timetrap.example.js
	```

## API Documentation:

Please take a look at [Timetrap TUI](https://github.com/karlredman/Timetrap_TUI) for more examples.

## F.A.Q:

* Ugh, Why wrap a command line application?:
    * I didn't have time to reinvent to wheel and Timetrap is stable and works well enough.

## Thank You and Credit To:
* The author and contributors of the [Timetrap](https://github.com/samg/timetrap) project for an elegant and useful time keeping solution.
* The community at [StackOverFlow](https://stackoverflow.com).
* Node.js contributors.
* jest contributors.


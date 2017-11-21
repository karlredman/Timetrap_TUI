# Project: Timetrap TUI

Author: [Karl N. Redman](https://karlredman.github.io/)

## Description:

Timetrap TUI is a node.js based event driven terminal user interface application for the ruby based 'Simple command line timetracker' [Timetrap](https://github.com/samg/timetrap).  Timetrap TUI intends to extend the elegance of Timetrap while honoring the original CLI interface as closely as possible. Timetrap packs a lot of functionality into a fairly simple interface with a short learning curve. I believe that if you have mastered Timetrap then the Timetrap TUI interface will feel natural.

## Video / Gif Demo

![Latest Screenshot](https://github.com/karlredman/Timetrap_TUI/blob/master/devel/demo/screenshot.gif?raw=true "Timetrap TUI Screenshot")

## Features (i.e. working so far):
### original timetrap:
* check-in / check-out of time sheets
* edit running time sheets
* display contexts per sheet:
	* today
	* yesterday
	* week
	* month
	* display all (non archived)
* view/edit entries by ID (relative to display context)

### additional features (Timetrap TUI):
* time sheets are displayed in a tree view
	* when words are seperated by `.`
* 5 different color themes:
    * console
        * application default
        * for consoles and xterminals
        * transparent background in xterminals
	* opaque
		* dark background *no* Xterminal transparency
        * intended for use in an xterminal
	* frosty
		* light background *no* Xterminal transparency
        * intended for use in an xterminal
	* dark
		* theme for darker *with* Xterminal background transparency
        * intended for use in an xterminal
	* light
		* theme for lighter *with* Xterminal background transparency
        * intended for use in an xterminal
* active sheets continue counting (in the main view)
* vim friendly keyboard navigation
* task functionality/operations via menu
* displays number of running time sheets in main view
* display updates upon database changes
	* even when sheets are checked in/out externally
* basic runtime logging (non saving currently)
* 'are you sure?' dialog boxes can be disabled via command line
* 'stop all sheets' menu item
* ES6 compliant (within Node.js v8.4 limitations)

## Requirements
* Linux (maybe windows someday if there is interest)
* A running/working [Timetrap](https://github.com/samg/timetrap) installation. (ruby 2.4 is tested)
* Node.js v8.4+
* Top Level Node.js Dependencies:
    * [blessed](https://www.npmjs.com/package/blessed)
    * [timetrap_wraplib](https://www.npmjs.com/package/timetrap_wraplib)
    * [commander](https://www.npmjs.com/package/commander)
    * [js-yaml](https://www.npmjs.com/package/js-yaml)
	* [strip-ansi](strip-ansi)


## Installation:
### production:
* it's a command line utility so install it globally
```
npm install timetrap_tui -g
```

### development:
```
# clone the project
git clone https://github.com/karlredman/Timetrap_TUI.git

# build it
cd ./Timetrap_TUI
npm install
```

## Configuration:

* Please verify that Timetrap is working properly before testing Timetrap TUI.
* Timetrap TUI currently uses the the Timetrap configuration file settings/configuration.
    * this file is used to figure out where `timetrap.yml` is located to determine where the `timetrap.db` file is located.
    * as per, Timetrap configuration settings, set environment variable TIMETRAP_CONFIG_FILE to override timetrap default.
    * the default location for `timetrap.yml` is `$HOME/.timetrap.yml`

## Execution:

The use of a configuration file is currently disabled. See `timetrap_tui --help` for current options.

* See `timetrap_tui --help` for command line options

* Example:
	* disable question prompts, show developer log messages, use 'dark' theme.
    ```
    [node] [/path/to/]timetrap_tui  -q -d -t dark
    ```

## Navigation:
* Use arrow keys or vim-like keys for directional selections.
	* i.e. for vim: h,j,k,l
* Use tab to toggle between the main window and the menu in each view.
* use shift-tab to toggle between the main window and the log widget in each view.


## Quirks / Caveats:
* Timetrap Commands are minimally sanitized:

Timetrap TUI commands and dialog data are passed on to Timetrap as though you were entering them on the command line. Commands are sanitized relative to content after a system call to `timetrap`.

* Always use quotes when using `--at`/`-a`/`--start`/`--end`:

This is the same as using `timetrap` command directly.

## In-depth Feature Information:

### Time Sheet Tree View:

* The tree view is simply a way to show hierarchy for time sheets. Currently there is no way to disable this or set the delimiter (next version?).
* It is **not** required that each level in the hierarchy be a valid `timetrap` sheet name.
	* i.e. In the example below it's possible that only `mow`, `timetrap_tui`, and `Vimwiki-Gollum-Integration` will be valid sheet names.
* For now a period (`.`) is the hard coded delimiter to separate parent from child sheet names.
	* so the following:
	  ```
	  Personal.Programming.Projects.timetrap_tui
	  Personal.Programming.Projects.Vimwiki-Gollum-Integration
	  Personal.Household.chores.mow
	  ```
    * would look like this in the user interface:
	  ```
		├── Personal
		│   ├── Household
		│   │   └── chores
		│   │       └── mow
		│   └── Programming
		│       └── Projects
		│           ├── timetrap_tui
		│           └── Vimwiki-Gollum-Integration

	  ```

### Main View Menu:
1. In:
	* Check in to the selected time sheet.
2. Out:
	* Check out of the selected time sheet.
3. Edit:
	* Edit the selected time sheet.
4. Task:
	1. If sheet is running, check-out then check-in with new note.
	2. If sheet is not running, check-in with note and then immediately check-out.
5. Details:
	* Show the contextual display entries for the selected time sheet.
6. Stop all:
	* Stop all running time sheets.
7. New (N/A):
	* Not yet implemented.
	* Create a new time sheet.
8. Kill (N/A):
	* Not yet implemented.
	* Kill/Delete a non-running time sheet.
9. Theme (N/A):
	* Not yet implemented.
	* Dynamically change the user interface theme.
10. Test (N/A):
	* Not yet implemented.
	* Reserved for later use.

### Details View Menu:
1. Close:
2. Resume (N/A):
	* Not yet implemented.
	* Reserved for later use.
3. Edit:
4. Display (relative to `Sheet` toggle):
	* Select the display context:
		* today
		* yesterday
		* month
		* display all (non archived)
5. Sheet (N/A):
	* Not yet implemented.
	* Toggle archived entries.
		* Unarchived Only
		* Archived Only
		* All Entries
6. Move (N/A):
	* Not yet implemented.
	* Move the currently selected ID entry to another time sheet.
7. Archive (N/A):
	* Not yet implemented.
	* Archive the currently selected ID entry (or range thereof)
8. Kill (N/A):
	* Not yet implemented.
	* Kill/Delete a non-running entry by ID.
9. Theme (N/A):
	* Not yet implemented.
	* Dynamically change the user interface theme.
10. Test (N/A):
	* Not yet implemented.
	* Reserved for later use.

## Troubleshooting:
* Question marks, random and missing characters (usually around widget borders):
    * This is usually a termcap issue. Try setting the following environment variables:
    ```
    export LANG=en_US.utf8
    export TERP=xterm-256color
    ```
    * Here's same thing in a single line (assuming timetrap_tui is installed):
    ```
    LANG=en_US.utf8 TERM=xterm-256color timetrap_tui
    ```

## F.A.Q:
* Why a tree view for time sheets?

I wanted to keep my time sheets in a hierarchy. This is the solution that I came up with that seems to work well with `timetrap`.

* Why so many themes?

Basically I started out with a color scheme but it grew into "themes" as I experimented. The configuration classes were written to accommodate individual settings per widget so... we ended up with a theme setup with a lot of flexibility.

* Why write javascript workarounds for a project (Timetrap) that allows customization and plugins?

I wanted to write a pure javascript/node.js solution without the additional overhead or dependencies of an additional language. The project started with a plan to rewrite the functionality of timetrap entirely in javascript/node.js. This plan was scrapped for now due to time constraints and a natural resistance to reinvent the wheel.

* Why are tab and shift-tab used as toggles and not round-robin focus keys?

99% of the time you will be going between the menu and the main window in each view. Having to press tab an extra time is annoying (to me). I can easily add a configuration option for round-robin tabbing if someone actually requests it.

* Why a terminal user interface?

Every user interface has it's place. There are a lot of us vim using, mouse avoiding, rebels still out here. Also a TUI just fits my workflow. In addition, in xterminals, the mouse is usable for this application. I haven't even tried to get gpm mouse functionality (for consoles) to work with this application to date.

## Thank You and Credit To:
* The author and contributors of the [Timetrap](https://github.com/samg/timetrap) project for an elegant and useful time keeping solution.
* The author and contributors of the [Blessed](https://github.com/chjj/blessed/) project for the nice ncurses-like node.js library.
* The authors and contributors of the [Blessed-Contrib](https://github.com/yaronn/blessed-contrib/) project for their neat widgets and efforts in building widgets that work right out of the box.
* Authors and contributors of the [timetrap_formatters](https://github.com/samg/timetrap_formatters) project for ideas and extra insight.
* The community at [StackOverFlow](https://stackoverflow.com).
* Node.js contributors.
* jest contributors.

## Further Notes:

Timetrap is an excellent command line application for basic time tracking. My goal with Timetrap TUI is to enhance the usefulness of the timetrap application by providing visually interactive components while maintaining the original program features. Hence, this project is a wrapper of the timetrap command. As such it suffers from the same limitations as most any command line wrapper interface: to be considered single user, limited interactivity, subject to breakage if the original command changes in any significant way. However, by wrapping timetrap we gain the advantages of a well tested back-end, established application workflow, and the ability to concentrate on user end functionality -thereby saving initial development time and effort. To be completely honest this project is meant as a prototype for a much larger, as yet unpublished, application/framework that I am working on in my spare time.

## Upcoming Features:
### original timetrap:
* Sheets
	* create new sheets
	* kill/delete sheets
	* ranged display context
* Entries by ID
	* archive entries
	* move entries to different sheet
	* kill/delete entries
	* archive entries

### additional features (Timetrap TUI):
* add configuration file capability
* customizable sheet tree view delimiter
* customizable and dynamic themes
* move all entries from one sheet to another
* customizable command shortcuts
* display view:
	* active entries continue counting
	* display archived entries
* capability to save logs
* show running sheet notes on main view
* separate Timetrap wrapper library (extracted from this project)
* additional unit testing

## License:
This Project is MIT licensed. Furthermore, Timetrap TUI reallocates [log.js](https://github.com/yaronn/blessed-contrib/blob/master/lib/widget/log.js), [tree.js](https://github.com/yaronn/blessed-contrib/blob/master/lib/widget/tree.js) and [table.js](https://github.com/yaronn/blessed-contrib/blob/master/lib/widget/table.js) from the [blessed-contrib](https://github.com/yaronn/blessed-contrib/) project in order to reduce dependencies. Relicensing information can be found [here](https://github.com/karlredman/Timetrap_TUI/blob/master/lib/blessed-contrib/README.md).


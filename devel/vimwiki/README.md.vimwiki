# Project: Timetrap TUI

Author: [Karl N. Redman](https://karlredman.github.io/)

## Note:

This project is considered Alpha and under active development as of Nov. 11, 2017. The functioning parts seem to be working well but there's a lot left to be done. I may prioritize personal time if people show interest. Currently this is a linux only application and tested solely with Node.js v8.4.

## Description:

Timetrap TUI is an event driven terminal user interface front-end wrapper application for the 'Simple command line timetracker' [timetrap](https://github.com/samg/timetrap). While Timetrap is written in ruby, this user interface is written in Node.js. The curses-like terminal widgets are provided via 'A high-level terminal interface library for node.js' called [blessed](https://github.com/chjj/blessed/). Additional widgets are currently from [blessed-contrib](https://github.com/yaronn/blessed-contrib/) which extends the blessed lib to 'Build terminal dashboards using ascii/ansi art and javascript'. Note that unit tests are currently broken.

Please see the [timetrap project page](https://github.com/samg/timetrap) for more information on how to use this elegant application. Timetrap TUI intends to extend that elegance while honoring the original interface as closely as possible. Timetrap packs a lot of functionality into a fairly simple interface with a short learning curve. I believe that if you have mastered Timetrap then the Timetrap TUI interface 'should' feel natural overall.

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
* 4 different xterm color themes
	* opaque (default)
		* dark background no Xterminal transparency
	* dark
		* theme for darker Xterminal background transparency
	* light
		* theme for lighter Xterminal background transparency
	* frosty (default)
		* light background no Xterminal transparency
* 1 linux console theme
	* theme for non xterminal consoles
* active sheets continue counting
* vim friendly keyboard navigation
* task functionality/operations via menu
* displays number of running time sheets in main view
* display updates upon database changes
	* even when sheets are checked in/out externally
* basic runtime logging (non saving currently)
* 'are you sure?' dialog boxes can be disabled via command line
* 'stop all sheets' menu item
* ES6 compliant (as far as I know / within Node.js v8.4 limitations)

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

## Installation:
### Requirements
* A running/working [Timetrap](https://github.com/samg/timetrap) installation

* Top Level Node.js Dependencies:
    * [blessed](https://www.npmjs.com/package/blessed)
    * [blessed-contrib](https://www.npmjs.com/package/blessed-contrib)
    * [timetrap_wraplib]()
    * [commander](https://www.npmjs.com/package/commander)
    * [js-yaml](https://www.npmjs.com/package/js-yaml)

## Execution:

The use of a configuration file is currently disabled. See `timetrap_tui --help` for current options.

* Example:
	* disable question prompts, show developer log messages, use theme 'dark'.
```
[node] /path/to/timetrap_tui.js  -q -d -t dark
```

## Navigation:
* Use arrow keys or vim-like keys for directional selections.
	* i.e. for vim: h,j,k,l
* Use tab to toggle between the main window and the menu in each view.
* use shift-tab to toggle between the main window and the log widget in each view.


## Quirks / Caveats:
* Timetrap Commands are minimally sanitized:

Timetrap TUI commands and dialog data are passed on to Timetrap as though you were entering them on the command line. Commands are sanitized relative to content after a system call to `timetrap`.

* Initial startup is slow:

I will try to work out some startup optimization in the future. For now just know that the Timetrap TUI starts up with an immediate call to `timetrap` via system call. So, Timetrap TUI is running initializations for both itself and for `timetrap` proper.

* Always use quotes when using `--at`/`-a`:

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

## F.A.Q:
* Why a tree view for time sheets?

I wanted to keep my time sheets in a hierarchy. This is the solution that I came up with that seems to work well with `timetrap`.

* Why so many themes?

Basically I started out with a color scheme but it grew into "themes" as I experimented. The configuration classes were written to accommodate individual settings per widget so... we ended up with a theme setup with a lot of flexibility.

* Why is the dependency list so huge?!

[blessed-contrib](https://github.com/yaronn/blessed-contrib/) pulls in a lot of dependencies. I have a plan to replace the code that uses blessed contrib widgets in the future. I'm working on a custom grid system that may get released someday -so I'll probably drop table and tree widgets into that library if/when I get around to it. As things are now, I'm ok with the bit of bloat due to the payoff of not having to implement that functionality myself. Otherwise, blessed-contrib is a good library to work with for sure!

* Why write javascript workarounds for a project (Timetrap) that allows customization and plugins?

I wanted to write a pure javascript/node.js solution without the additional overhead or dependencies of an additional language. The project started with a plan to rewrite the functionality of timetrap entirely in javascript/node.js. This plan was scrapped for now due to time constraints and a natural resistance to reinvent the wheel.

* Why are tab and shift-tab used as toggles and not round-robin focus keys?

99% of the time you will be going between the menu and the main window in each view. Having to press tab an extra time is annoying (to me). I can easily add a configuration option for round-robin tabbing if someone actually requests it.

## Thank You and Credit To:
* The author and contributors of the [Timetrap](https://github.com/samg/timetrap) project for an elegant and useful time keeping solution.
* The author and contributors of the [Blessed](https://github.com/chjj/blessed/) project for the nice ncurses-like node.js library.
* The authors and contributors of the [Blessed-Contrib](https://github.com/yaronn/blessed-contrib/) project for their neat widgets and efforts in building widgets that work right out of the box.
* Authors and contributors of the [timetrap_formatters](https://github.com/samg/timetrap_formatters) project for ideas and extra insight.
* The community at [StackOverFlow](https://stackoverflow.com).
* Node.js contributors.
* jest contributors.

## Further Notes:

Timetrap is an excellent command line application for basic time tracking. My goal with Timetrap TUI is to enhance the usefulness of the timetrap application by providing visually interactive components while maintaining the original program features. Hence, this project is a wrapper of the timetrap command. As such it suffers from the same limitations as most any command line wrapper interface: to be considered single user, limited interactivity, subject to breakage if the original command changes in any significant way. However, by wrapping timetrap we gain the advantages of a well tested back-end, established application workflow, and the ability to concentrate on use end functionality -thereby saving initial development time and effort. To be completely honest this project is meant as a prototype for a much larger, as yet unpublished, application/framework that I am working on in my spare time.


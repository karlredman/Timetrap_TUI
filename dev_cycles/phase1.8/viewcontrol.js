"use strict";

var blessed = require('blessed'),
    contrib = require('blessed-contrib');

// app packages
var Configuration = require('./config');

// views
var View = require('./view');
var HelpView = require('./helpview');
var ModalView = require('./modalview');
var Dialog = require('./dialog');
var MenuBar = require('./menubar');

function ViewControl(config, screen){
    let _this=this;

    this.config = config;
    this.screen = screen;

    //set the main view
    this.view = new View(config, screen);

    _this.register_actions(this);
    _this.screen.render();

}

ViewControl.prototype.register_actions = function(obj){
    let _this = this;

    //view destroyers
    _this.screen.on('destroy', function(widgetname){
        if (widgetname === 'HelpView'){
            if (typeof _this.helpview !== 'undefined'){
                _this.helpview.destroy();
                delete _this.helpview;
                _this.view.showAll(true);
                return;
            }
        }
        if (widgetname === 'ModalView'){
            if (typeof _this.modalview !== 'undefined'){
                _this.modalview.destroy();
                delete _this.modalview;

                // TODO: should be restored from modalView .destroy()
                _this.view.widgets.menubar.restoreFromModal();

                _this.view.showAll(true);
                return;
            }
        }
        if (widgetname === 'Dialog'){
            if (typeof _this.dialog !== 'undefined'){
                _this.dialog.destroy();
                delete _this.dialog;
                _this.view.showAll(true);
                _this.screen.emit("destroy", "ModalView")
                return;
            }
        }
    });

    // help view toggle
    _this.screen.key(['?'], function(ch, key) {
        if (typeof _this.helpview == 'undefined')
        {
            //hide the widgets
            _this.view.hideAll();

            _this.helpview = new HelpView({
                parent: _this.screen,
                top:0,
                left:0,
                width: '100%',
                height: '100%',
                value: "The help\n\n\nThis will be a table for help",
                align: "center",
                fg: "yellow"
            });
            _this.helpview.focus();
            _this.screen.render();
        }
        else {
            // //destroy and delete the helpview
            _this.helpview.destroy();
            delete _this.helpview;

            //show the main view and set focus
            _this.view.showAll(true);
            //
            // console.log(JSON.stringify(key, null, 2));
        }
    });

    // _this.screen.key(['m'], function(ch, key) {
    //     if (typeof _this.modalview == 'undefined')
    //     {
    //         _this.modalview = new ModalView({
    //             parent: _this.screen,
    //         });

    //         _this.modalview.focus();
    //         _this.screen.render();
    //     }
    // });
    _this.screen.on('ModalDialog', function(options) {
        if (_this.modalview === undefined)
        {
            _this.modalview = new ModalView({ parent: _this.screen, });

            _this.modalview.focus();
            //_this.screen.render();
        }
        if (_this.dialog === undefined)
        {
            //hide the widgets
            //_this.view.hideAll();
            options.parent = _this.screen;
            _this.dialog = new Dialog(options);
            _this.dialog.focus();

            if (options.dialog.submitBtn){
                _this.dialog.submit.focus()
            }
            else{
                _this.dialog.cancel.focus()
            }

            if(options.input){
                _this.dialog.input.focus()
            }
        }
            _this.screen.render();
    });
    // _this.screen.key(['d'], function(ch, key) {
    //     if (typeof _this.dialog == 'undefined')
    //     {
    //         //hide the widgets
    //         //_this.view.hideAll();

    //         _this.dialog = new Dialog({
    //             parent: _this.screen,
    //         });
    //         _this.dialog.focus();
    //         _this.screen.render();
    //     }
    // });
}


ViewControl.prototype.type = 'ViewControl';
module.exports = ViewControl;

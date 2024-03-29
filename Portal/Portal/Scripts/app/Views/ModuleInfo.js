﻿/**
 *  Init Info UI - shows module info
*/
Gnx.ModuleInfo = function () {

    var _initialized = false;
    this.initialized = false;

    var _initInfo = function () {

    }

    var _onShowModuleInfo = function (evt, data) {
        _getModuleData(data.uuid);
    }

    var _getModuleData = function (uuid) {

        // fireEvent (evtName, data, callbackFn)
        Gnx.Event.fireEvent('module-info-request', { uuid: uuid }, _gotModuleDataCallback);
    }

    var _dialogTemplate = '<div><p><b>{Name}</b></p>{Description}</div><br/>' +
        '<div class="rating small fg-amber"></div>';

    var _showModuleInfo = function (rec) {


        var html = _dialogTemplate
        .replace("{Name}", rec.Name) // replace first found
        .replace("{Description}", rec.Description) // replace first found
        .replace("null", '');

        $.Dialog({
            shadow: true,
            overlay: false,
            flat: true,
            //title: rec.Name,
            width: '80%',
            height: '60%',
            padding: 10,
            content: html
        });

        $(".rating").rating({
            static: false,
            score: 2,
            stars: 5,
            showHint: true,
            showScore: true,
            click: function (value, rating) {
                rating.rate(value);
            }
        });


    }

    var _gotModuleDataCallback = function (rec) {

        if (rec) {
            _showModuleInfo(rec)
        }

    }

    this.init = function () {

        if (_initialized) return;

        _initInfo();

        this.initialized = true;

        _initialized = true;

        Gnx.Event.on('show-module-info', _onShowModuleInfo);

        return this.initialized;
    }
};

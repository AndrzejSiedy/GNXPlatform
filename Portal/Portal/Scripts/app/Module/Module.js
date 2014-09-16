/**
 *  Manage Modules
*/
Gnx.Module = function () {

    var self = this;

    /**
     * private
     */
    var _initialized = false;
    this.initialized = false;

    /*
     * call modules wall to show load mask
     */
    var _beforeSend = function () {
        Gnx.Event.fireEvent('before-modules-get');
    };

    var _done = function (data) {

        self.modules = data || [];

        Gnx.Event.fireEvent('modules-get-done', { records: self.modules });
    };

    var _addShindigModule = function () {

    };

    // list of currently loaded modules
    this.modules = [];

    this.getModules = function () {

        var me = this;

        var __RequestVerificationToken = $.getAntiForgeryToken(window.parent).value;
        var iFrameSrc = '';

        var iFrameSrc = '../api/ModuleModelsApi';
        var token = __RequestVerificationToken;

        function addRequestVerificationToken(data) {
            data.__RequestVerificationToken = token;
            return data;
        };
        $.ajax({
            type: "GET",
            url: iFrameSrc,
            dataType: "json",
            traditional: true,
            beforeSend: _beforeSend,
            data: addRequestVerificationToken({
                // add some extra data to do proper logoff
                token: token
            })
        }).done(function (result) {

            if (result) {
                // assign fake icons for modules
                for (var i = 0; i < result.length; i++) {
                    result[i].Thumbnail = result[i].Thumbnail == null ? me.noThumbnail : result[i].Thumbnail;
                }
                _done(result);

            } else {
                // Log or show an error message
                _done();
            }
            
            return false;
        });

    }

    this.getModulesServer = function () {

        //var __RequestVerificationToken = $.getAntiForgeryToken(window.parent).value;
        //var iFrameSrc = '';

        //var iFrameSrc = 'api/ModuleModelsApiServer';
        //var token = __RequestVerificationToken;

        //function addRequestVerificationToken(data) {
        //    data.__RequestVerificationToken = token;
        //    return data;
        //};
        //$.ajax({
        //    type: "GET",
        //    url: iFrameSrc,
        //    dataType: "json",
        //    traditional: true,
        //    data: addRequestVerificationToken({
        //        // add some extra data to do proper logoff
        //        token: token
        //    })
        //}).done(function (result) {
        //    if (result) {
        //        // Do something
        //        console.warn('MS SQL Server', result);
        //    } else {
        //        // Log or show an error message
        //    }
        //    return false;
        //});

        //ModuleModelsApiServer

    }

    this.loadDataMSServer = function () {
        //var __RequestVerificationToken = $.getAntiForgeryToken(window.parent).value;
        //var iFrameSrc = '';

        //var iFrameSrc = '/DataLoad';
        //var token = __RequestVerificationToken;

        //function addRequestVerificationToken(data) {
        //    data.__RequestVerificationToken = token;
        //    return data;
        //};
        //$.ajax({
        //    type: "GET",
        //    url: iFrameSrc,
        //    dataType: "json",
        //    traditional: true,
        //    data: addRequestVerificationToken({
        //        // add some extra data to do proper logoff
        //        token: token
        //    })
        //}).done(function (result) {
        //    if (result) {
        //        // Do something
        //        console.warn('MS SQL Server', result);
        //    } else {
        //        // Log or show an error message
        //    }
        //    return false;
        //});
    }


    var _getModuleByAttr = function (key, value) {
        for (var i = 0; i < self.modules.length; i++) {
            if (self.modules[i][key] == value) return self.modules[i];
        }

        return null;
    }

    var _onModuleInfoRequest = function (evt, data) {
        var rec = _getModuleByAttr('Id', data.uuid)
        if (evt.callbackFn) evt.callbackFn(_getModuleByAttr('Id', data.uuid))
    }

    var _onAddModuleRequest = function (evt, data) {
        var rec = _getModuleByAttr('Id', data.uuid);

        if (rec) {
            Gnx.Event.fireEvent('add-gadget', { record: rec });
        }

        var t = '<div class="image-container" style="width:100%; height:100%;">' +
                    '<img src="{Thumbnail}" class="span2"">' +
                    '<div class="overlay">' +
                        '{Name}' +
                    '</div>' +
                '</div>'

        var html = t
            .replace("{Name}", rec.Name) // replace first found
            .replace("{Thumbnail}", rec.Thumbnail) // replace first found
            .replace("null", '');

        var not = $.Notify({
            caption: "Added Gadget",
            content: html,
            width: 100,
            height: 100,
            timeout: 2000 // 10 seconds
        });
    }

    this.init = function () {
        // prevent calling init method after it started already
        if (_initialized) return;

        this.initialized = true;

        Gnx.Event.on('module-info-request', _onModuleInfoRequest);
        Gnx.Event.on('add-module', _onAddModuleRequest);

        return this.initialized;
    }
};

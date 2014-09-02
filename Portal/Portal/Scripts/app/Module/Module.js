/**
 *  Manage Modules
*/
Gnx.Module = function () {

    this.initialized = false;

    this.getModules = function () {

        var me = this;

        var __RequestVerificationToken = $.getAntiForgeryToken(window.parent).value;
        var iFrameSrc = '';

        var iFrameSrc = 'api/ModuleModelsApi';
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
            beforeSend: function () {
                console.warn('before ajax');
            },
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
                console.warn('got modules?', result);

            } else {
                // Log or show an error message
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

    this.init = function () {

        this.initialized = true;

        return this.initialized;
    }
};

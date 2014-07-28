/**
 * @class
 */
Ext.define('Workspace.AppLogic', {

    requires: [
        'Workspace.Views.Modules',
        'Workspace.Views.Center',
        'Workspace.Controllers.SignalRClient'
    ],

    
    mainContainer: null,

    constructor: function () {

        //Ext.getBody().on("contextmenu", Ext.emptyFn, null, { preventDefault: true });


        this.registerUtils();


        toastr.options = {
            "closeButton": true,
            "debug": false,
            "positionClass": "toast-bottom-right",
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "3000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
        
        this.modulesView = Ext.create('Workspace.Views.Modules', {
            width: 300,
            region: 'west',
            split: true,
            preventHeader: true,
            collapsible: true,  // make collapsible
            collapseMode: 'mini',
            hideCollapseTool: true,
            floatable: true, //so panel does not do floating preview on header / title click
            titleCollapse: true //so panel expands / collapses on title bar click
        });

        
        this.modulesView.on('resize', function (container, width, height, oldWidth, oldHeight, eOpts) {
            $('#_ul-modules').width(width - 10);
        }, this);

        this.centerView = Ext.create('Workspace.Views.Center', {
            id: 'wmorde',
            roomId: roomId,
            region: 'center',
            layout: 'fit'
        });

        this.centerView.on('moduledropped', this.onModuleDropped, this);

        this.modulesView.on('dragstart', this.centerView.dragStarted, this.centerView);
        this.modulesView.on('dragend', this.centerView.dragEnd, this.centerView);


        this.signalRController = Ext.create('Workspace.Controllers.SignalRClient', {
            signalRHubUrl: signalRHubsUrl, // global set in Index.cshtml
            hubName: hubName, // global set in Index.cshtml
            roomId: roomId // global set in Index.cshtml
        });

        
        var me = this;
        // reser container size to fit given div space
        $(window).resize(function () {
            me.mainContainer.setHeight($('#_footer').position().top - ($('#_header').height()));
            me.mainContainer.doLayout();
        });


    },

    onModuleDropped: function (data) {
        var recordData = data.recordData;
        var xy = data.repairXY;

        this.signalRController.gadgetDropped(recordData);
    },


    initMe: function (divId) {

        this.mainContainer = Ext.create('Ext.panel.Panel', {
            renderTo: divId,
            width: '100%',
            height: $('#_footer').position().top - ($('#_header').height()),
            minHeight: 200,
            layout: 'border',
            style: {
                backgroundColor: 'grey'
            },
            items: [
                this.modulesView,
                this.centerView
            ]
        });

        toastr["info"]("AppLogic", "Initiated");

    },

    registerUtils: function(){
        $.getAntiForgeryToken = function (tokenWindow, appPath) {
            // HtmlHelper.AntiForgeryToken() must be invoked to print the token.
            tokenWindow = tokenWindow && typeof tokenWindow === typeof window ? tokenWindow : window;

            appPath = appPath && typeof appPath === "string" ? "_" + appPath.toString() : "";
            // The name attribute is either __RequestVerificationToken,
            // or __RequestVerificationToken_{appPath}.
            var tokenName = "__RequestVerificationToken" + appPath;

            // Finds the <input type="hidden" name={tokenName} value="..." /> from the specified window.
            // var inputElements = tokenWindow.$("input[type='hidden'][name=' + tokenName + "']");
            var inputElements = tokenWindow.document.getElementsByTagName("input");
            for (var i = 0; i < inputElements.length; i++) {
                var inputElement = inputElements[i];
                if (inputElement.type === "hidden" && inputElement.name === tokenName) {
                    return {
                        name: tokenName,
                        value: inputElement.value
                    };
                }
            }
        };

        $.appendAntiForgeryToken = function (data, token) {
            // Converts data if not already a string.
            if (data && typeof data !== "string") {
                data = $.param(data);
            }

            // Gets token from current window by default.
            token = token ? token : $.getAntiForgeryToken(); // $.getAntiForgeryToken(window).

            data = data ? data + "&" : "";
            // If token exists, appends {token.name}={token.value} to data.
            return token ? data + encodeURIComponent(token.name) + "=" + encodeURIComponent(token.value) : data;
        };

        // Wraps $.post(url, data, callback, type) for most common scenarios.
        $.postAntiForgery = function (url, data, callback, type) {
            return $.post(url, $.appendAntiForgeryToken(data), callback, type);
        };

        // Wraps $.ajax(settings).
        $.ajaxAntiForgery = function (settings) {
            // Supports more options than $.ajax(): 
            // settings.token, settings.tokenWindow, settings.appPath.
            var token = settings.token ? settings.token : $.getAntiForgeryToken(settings.tokenWindow, settings.appPath);
            settings.data = $.appendAntiForgeryToken(settings.data, token);
            return $.ajax(settings);
        };
    },

    // dev method - show some text
    getLoremIpsum: function () {
        return 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
    },

    getProjectDescr: function () {
        var t = 'This is a proof of concept applcation, testing ability to exchange data via SignalR </br>' +
	        'It consists of: <ul><li><b>MainApplication</b> - showing external applications in iFrames</li>' +
            '<li><b>SignalR</b> hub service running as part of main application</li>' +
            '<li><b>Map</b> indepened web app - ol3</li>' +
            '<li><b>Grid</b> indepened web app - ExtJs</li>' +
	        '<li><b>WebApi</b> indepened service getting data from database</li></ul>';
        return t;
    }

});
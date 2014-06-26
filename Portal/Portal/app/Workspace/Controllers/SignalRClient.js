/**
 * @class
 */
Ext.define('Workspace.Controllers.SignalRClient', {

    mixins: {
        observable: 'Ext.util.Observable'
    },

    clientName: null,

    clientId: null,

    signalRHubUrl: null,

    hubName: null,

    roomId: null,

    constructor: function (config) {

        this.mixins.observable.constructor.call(this, config);

        Ext.apply(this, config);
        this.callParent([config]);

        this.addEvents([
			'joinedSignalR'
        ]);


        if (this.signalRHubUrl) {
            this.initSignalR();
        }

    },

    initSignalR: function (signalRHubUrl, hubName) {

        if (signalRHubUrl) {
            this.signalRHubUrl = signalRHubUrl;
        }
        if (hubName) {
            this.hubName = hubName;
        }

        var self = this;

        // set url to SignalR hub
        $.connection.hub.url = this.signalRHubUrl;

        console.warn('this.signalRHubUrl', this.signalRHubUrl);
        console.warn('this.hubName', this.hubName);

        // Declare a proxy to reference the hub. 

        // Hub name read from global variable
        this.chat = $.connection[this.hubName];

        //// method called from "JoinRoom" Hub class
        this.chat.client.joinedRoom = Ext.bind(this.joinedRoom, this);

        this.chat.client.userLoggedInSuccess = Ext.bind(this.userLoggedInSuccess, this);

        this.chat.client.userLoggedOffSuccess = Ext.bind(this.userLoggedOffSuccess, this);

        $.connection.logging = true;

        $.connection.hub.start().done(function () {

            // SignalR room id should be available from global and should be set in default.aspx.cs
            // all sub apps/modules, will recive groupId
            // call method on SignalR service to create new group for this app instance
            //console.warn('has client id?', self.clientId);
            //if (!self.clientId) {
            //    return;
            //}

            console.warn('WTF?', self.roomId, self.clientName);

            self.chat.server.joinRoom(self.roomId, self.clientName);

        });
    },

    joinedRoom: function () {
        toastr["info"]("Joinded", "Main Module joinded SignalR room");
        this.fireEvent('joinedSignalR', { roomId: this.roomId, clientName: this.clientName });
    },

    userLoggedInSuccess: function () {
        toastr["info"]("userLoggedInSuccess", "Main Module heard SignalR room");
    },

    userLoggedOffSuccess: function () {
        toastr["info"]("userLoggedOffSuccess", "Main Module heard SignalR room");
    }
});
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

        if (this.signalRHubUrl) {
            this.initSignalR();
        }

    },

    initSignalR: function (signalRHubUrl, hubName, roomId) {

        if (signalRHubUrl) {
            this.signalRHubUrl = signalRHubUrl;
        }
        if (hubName) {
            this.hubName = hubName;
        }

        if (roomId) {
            this.roomId = roomId;
        }

        var self = this;

        // set url to SignalR hub
        $.connection.hub.url = this.signalRHubUrl;

        // Declare a proxy to reference the hub. 
        // Hub name read from global variable
        this.chat = $.connection[this.hubName];

        //// method called from "JoinRoom" Hub class
        this.chat.client.joinedRoom = Ext.bind(this.joinedRoom, this);

        this.chat.client.userLoggedInSuccess = Ext.bind(this.userLoggedInSuccess, this);

        this.chat.client.userLoggedOffSuccess = Ext.bind(this.userLoggedOffSuccess, this);

        $.connection.logging = true;

        $.connection.hub.start().done(function () {
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
    },

    // Call SignalR service to pass information to gnx-container that module should be loaded
    gadgetDropped: function(data){

        var signalRMessage = {
            roomId: roomId,
            data: data.getData()
        }
        this.chat.server.gadgetDropped(signalRMessage);
    }
    
});
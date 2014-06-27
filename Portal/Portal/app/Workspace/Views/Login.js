/**
 * @class
 */
Ext.define('Workspace.Views.Login', {


    extend: 'Ext.panel.Panel',

    isLoggedIn: false,

    accessToken: null,

    accessData: null,

    constructor: function (config) {


        this.RedisController = {
            IsAuthenticated: 'http://localhost/Gnx/UserMgr/UserMgr/Redis/IsAuthenticated'
        }


        //this.url = 'http://localhost:54679';
        //this.url = 'http://localhost:11801';
        this.url = "http://localhost/Gnx/UserMgr/UserMgr/Account"

        var isHttps = false;
        if (isHttps) {
            this.url = "https://localhost:44300";
        }


        // bind to signalR serverside events
        this.bindSignalREvents();
        

        // call register for new user
        this.btnRegister = Ext.create('Ext.button.Button', {
            text: 'Register'
        });
        this.btnRegister.on('click', this.onBtnRegisterClick, this);

        // do login/logoff
        this.btnLogin = Ext.create('Ext.button.Button', {
            text: 'Login'
        });
        this.btnLogin.on('click', this.onBtnLoginClick, this);

        this.btnLogOff = Ext.create('Ext.button.Button', {
            text: 'LogOff',
            hidden: true
        });
        this.btnLogOff.on('click', this.onBtnLogOffClick, this);

        this.btnChangePass = Ext.create('Ext.button.Button', {
            text: 'ChangePass',
            hidden: true
        });
        this.btnChangePass.on('click', this.onBtnChangePassClick, this);
        

        // do login/logoff
        this.btnIsAuth = Ext.create('Ext.button.Button', {
            text: 'IsAuth?'
        });
        this.btnIsAuth.on('click', this.onBtnIsAuthClick, this);


        if (!config.tbar) {
            config.tbar = [this.btnRegister, this.btnLogin, this.btnLogOff, this.btnChangePass, this.btnIsAuth]
        }
        else {
            config.tbar.push(this.btnRegister);
            config.tbar.push(this.btnLogin);
            config.tbar.push(this.btnLogOff);
            config.tbar.push(this.btnChangePass);
            config.tbar.push(this.btnIsAuth);
        }

        Ext.apply(this, config);
        this.callParent([config]);

    },

    bindSignalREvents: function(){
        // bind to an event after hub start
        // NOTE: There MUST be at least one callback registered before start
        chat.on('UserLoggedInSuccess', Ext.bind(this.onUserLoggedIn, this));

        chat.on('UserLoggedOffSuccess', Ext.bind(this.onUserLoggedOff, this));
    },

    showIframeCenter: function(pageURL, title,w,h) {
        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        this.window = window.open(pageURL, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    },

    onUserLoggedIn: function (evtName, response) {
        this.accessData = response.data;

        this.accessToken = response.data.Token;

        var uName = response.data.UserName;
        toastr["success"]("LogIn", "User " + uName + " logged in" + "  roomId: " + _roomId_);

        this.window.close();
        this.btnLogin.hide();
        this.btnLogOff.show();
        this.btnChangePass.show();
        this.isLoggedIn = true;
    },

    onUserLoggedOff: function () {

        toastr["info"]("LogIn", "User logged off");

        this.window.close();

        this.btnLogin.show();
        this.btnLogOff.hide();
        this.btnChangePass.hide();
        this.isLoggedIn = false;
    },

    onBtnRegisterClick: function () {

        var iFrameSrc = this.url + '/Register?action=register&roomId=' + _roomId_;

        // use popup window, as we use SSL URL, which might require adding SSL certificates
        this.showIframeCenter(iFrameSrc, "Register GNX Profile", 300, 400);
        
    },

    onBtnLoginClick: function () {

        var iFrameSrc = this.url + '/login?action=login&roomId=' + _roomId_;

        // use popup window, as we use SSL URL, which might require adding SSL certificates
        this.showIframeCenter(iFrameSrc, "Login GNX Profile", 300, 400);
    },

    onBtnLogOffClick: function () {

        //var iFrameSrc = this.url + '/LogOff?roomId=' + _roomId_;
        var iFrameSrc = this.url + '/LogOff';
        var token = this.accessData.Token;

        function addRequestVerificationToken(data) {
            data.__RequestVerificationToken = token;
            return data;
        };
        $.ajax({
            type: "POST",
            url: iFrameSrc,
            //dataType: "json",
            traditional: true,
            data: addRequestVerificationToken({
                // add some extra data to do proper logoff
                token: token,
                userName: this.accessData.UserName,
                roomId: _roomId_
            })
        }).done(function (result) {
            if (result) {
                // Do something
            } else {
                // Log or show an error message
            }
            return false;
        });

    },

    onBtnChangePassClick: function(){

    },

    onBtnIsAuthClick: function(){

        if (!this.accessData) {
            toastr["warning"]("Authentication", "User not authenticated");
            return;
        }

        var data = {
            token: this.accessData.Token,
            userName: this.accessData.UserName,
            roomId: _roomId_
        }

        // redis controller keeps URLs to serverside WebApi/MVC methods
        $.ajax(this.RedisController.IsAuthenticated, {
            type: "POST",
            data: JSON.stringify(data),
            headers: this.getHeaders(true)
        }).always(function (response) {
            if (response.success) {
                toastr["info"]("Authentication", "User is authenticated");
            }
            else {
                toastr["warning"]("Authentication", "User not authenticated");
            }
            
        });

    },

    logoffCallbackSuccess: function (response) {
    },

    logoffCallbackFailure: function (response) {
    },

    getHeaders: function (includeAuth) {

        if (this.accessData.Token && !includeAuth) {
            return {
                "Authorization": "Bearer " + this.accessData.Token,
                "Content-Type": "application/json;charset=utf-8",
                "Access-Control-Allow-Origin": "*",
                "Accept": "application/json",// REQUIRED for FF in order to do proper JSON reuqest
                "Origin": window.location.host
            }
        }

        if (includeAuth) {
            return {
                "Content-Type": "application/json;charset=utf-8",
                "Accept": "application/json" // REQUIRED for FF in order to do proper JSON reuqest
            }
        }

    }


});
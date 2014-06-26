/**
 * @class
 */
Ext.define('Workspace.Views.Center', {

    extend: 'Ext.panel.Panel',

    constructor: function (config) {

        Ext.apply(this, config);

        this.btnLoadMapModule = Ext.create('Ext.button.Button', {
            text: 'load Map Module',
            handler: Ext.bind(this.onBtnLoadMapModule, this)
        });

        this.btnLoadGridModule = Ext.create('Ext.button.Button', {
            text: 'load Grid Module',
            handler: Ext.bind(this.onBtnLoadGridModule, this)
        });

        this.tbar = [
            this.btnLoadMapModule,
            this.btnLoadGridModule
        ];


        this.callParent([config]);


        this.on('render', function () {
            var me = this;
            var formPanelDropTarget = Ext.create('Ext.dd.DropTarget', this.body.dom, {
                //ddGroup: 'GridExample',
                notifyEnter: function (ddSource, e, data) {

                    //Add some flare to invite drop.
                    me.body.stopAnimation();
                    me.body.highlight();
                },
                notifyDrop: function (ddSource, e, data) {
                    console.warn('dropped', ddSource, e, data);
                    

                    me.generateModuleWindow(data.recordData, e.browserEvent.clientX, e.browserEvent.clientY);
                    return true;
                }
            });

        }, this);

    },

    generateModuleWindow: function (record, x, y) {

        var w = Ext.create('Ext.window.Window', {
            constrain: true,
            constrainTo: this.getEl(),
            width: 300,
            height: 300,
            x: x,
            y: y,
            html: '<div style="margin-bottom: 10px;" class="thumb-wrap">' +
                    '<img src="' + record.get('ImgUrl') + '" />' +
                    '<br/><span>' + record .get('Name') + '</span>' +
                '</div>'
        });
        w.show();
    },

    getModules: function () {

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
            data: addRequestVerificationToken({
                // add some extra data to do proper logoff
                token: token
            })
        }).done(function (result) {
            if (result) {
                // Do something
                console.warn('Neo4j', result);
            } else {
                // Log or show an error message
            }
            return false;
        });

    },

    getModulesServer: function () {

        var __RequestVerificationToken = $.getAntiForgeryToken(window.parent).value;
        var iFrameSrc = '';

        var iFrameSrc = 'api/ModuleModelsApiServer';
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
            data: addRequestVerificationToken({
                // add some extra data to do proper logoff
                token: token
            })
        }).done(function (result) {
            if (result) {
                // Do something
                console.warn('MS SQL Server', result);
            } else {
                // Log or show an error message
            }
            return false;
        });

        //ModuleModelsApiServer

    },


    loadDataMSServer: function () {
        var __RequestVerificationToken = $.getAntiForgeryToken(window.parent).value;
        var iFrameSrc = '';

        var iFrameSrc = '/DataLoad';
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
            data: addRequestVerificationToken({
                // add some extra data to do proper logoff
                token: token
            })
        }).done(function (result) {
            if (result) {
                // Do something
                console.warn('MS SQL Server', result);
            } else {
                // Log or show an error message
            }
            return false;
        });
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
    },

    onBtnLoadMapModule: function () {
        console.warn('x');
    },

    onBtnLoadGridModule: function () {
        console.warn('y');
    }

});
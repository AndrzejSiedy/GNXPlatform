/**
 * @class
 */
Ext.define('Workspace.Views.Center', {

    extend: 'Ext.panel.Panel',

    constructor: function (config) {

        Ext.apply(this, config);
        
        var gridsterHtml =
            '<div id="_center" class="gridster" style="width: 100%; height:100%;">' +
                '<ul id="_ul-modules">' +
                '<li class="gridster-border" data-row="1" data-col="3" data-sizex="2" data-sizey="1"><div class="draggableElement" style="width:55px; height:55px; background-color:#444;" >C1</div></li>' +
                '<li class="gridster-border" data-row="1" data-col="3" data-sizex="2" data-sizey="1"><div class="draggableElement" style="width:55px; height:55px; background-color:#444;" >C2</div></li>' +
                '<li class="gridster-border" data-row="1" data-col="1" data-sizex="1" data-sizey="2"><div class="draggableElement" style="width:55px; height:55px; background-color:#444;" >C3</div></li>' +
                '<li class="gridster-border" data-row="2" data-col="1" data-sizex="1" data-sizey="3"><div class="draggableElement" style="width:55px; height:55px; background-color:#444;" >C4</div></li>' +
                '<li class="gridster-border" data-row="2" data-col="1" data-sizex="1" data-sizey="4"><div class="draggableElement" style="width:55px; height:55px; background-color:#444;" >C5</div></li>' +
                '<li class="gridster-border" data-row="2" data-col="2" data-sizex="1" data-sizey="1"><div class="draggableElement" style="width:55px; height:55px; background-color:#444;" z>C6</div></li>' +
                '</ul>' +
            '</div>';


        var btnAddTile = Ext.create('Ext.button.Button', {
            text: 'Add',
            handler: Ext.bind(this.onBtnAddTile, this)
        });
        var btnRemoveTile = Ext.create('Ext.button.Button', {
            text: 'Remove',
            handler: Ext.bind(this.onBtnRemoveTile, this)
        });

        var btnTest = Ext.create('Ext.button.Button', {
            text: 'Get Neo4j',
            handler: Ext.bind(function () {
                this.getModules();
            }, this)
        });
        var btnTest2 = Ext.create('Ext.button.Button', {
            text: 'Get MS Server',
            handler: Ext.bind(function () {
                this.getModulesServer();
            }, this)
        });

        var btnTest3 = Ext.create('Ext.button.Button', {
            text: 'Load Data',
            handler: Ext.bind(function () {
                this.loadDataMSServer();
            }, this)
        });

        this.html = gridsterHtml;
        this.tbar = [
            btnAddTile,
            btnRemoveTile,
            btnTest,
            btnTest2
            //btnTest3
        ];

        this.callParent([config]);


        this.on('render', function () {

            var self = this;

            this.gridster = $("#_center > ul").gridster({
                max_size_x: 400,
                avoid_overlapped_widgets: true,
                widget_base_dimensions: [300, 55],
                widget_margins: [5, 5],
                helper: 'clone',
                resize: {
                    enabled: true
                },
                namespace: '#_center'
            }).data('gridster');

            console.warn('center gridster', this.gridster);

            /* Make the gridster grid the droppable area and fire out an event once dropped. */
            $('#_center').droppable({
                drop: function (event, ui) {
                    self.gridster.add_widget('<li style="border: 2px solid red;" class="gridster-border">dragged</li>', 1, 1);
                }
            });

        }, this);

    },


    onBtnAddTile: function () {
        this.gridster.add_widget('<li class="gridster-border">The HTML of the widget...</li>', 0, 0);
    },

    onBtnRemoveTile: function () {
        if ($('#_center li').length == 0) return;

        this.gridster.remove_widget($('#_center li').eq($('#_center > li').length - 1));

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

    }


});
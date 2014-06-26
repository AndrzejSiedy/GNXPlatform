/**
 * @class
 */
Ext.define('Workspace.Views.Modules', {

    extend: 'Ext.panel.Panel',

    constructor: function (config) {

        Ext.apply(this, config);
        
        var gridsterHtml = '<div id="_modules" class="gridster" style="width: 100%; height:100%;">' +
            '<ul id="_ul-modules">' +
                '<li draggable="true" class="gridster-border" data-row="1" data-col="3" data-sizex="2" data-sizey="1"><div class="draggableElement" style="width:55px; height:55px; background-color:#444;" >Mod1</div></li>' +
                '<li draggable="true" class="gridster-border" data-row="1" data-col="3" data-sizex="2" data-sizey="1"><div class="draggableElement" style="width:55px; height:55px; background-color:#444;" >Mod2</div></li>' +
                '<li draggable="true" class="gridster-border" data-row="1" data-col="1" data-sizex="1" data-sizey="2"><div class="draggableElement" style="width:55px; height:55px; background-color:#444;" >Mod3</div></li>' +
                '<li draggable="true" class="gridster-border" data-row="2" data-col="1" data-sizex="1" data-sizey="3"><div class="draggableElement" style="width:55px; height:55px; background-color:#444;" >Mod4</div></li>' +
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


        this.layout = "border";

        //this.html = gridsterHtml;
        this.tbar = [
            btnAddTile,
            btnRemoveTile,
            btnTest,
            btnTest2
            //btnTest3
        ];

        var me = this;
        this.internalNorthView = Ext.create('Ext.panel.Panel', {
            title: 'North',
            region: 'north',
            height: 200,
            width: '100%',
            split: true,
            //html: '<div id="div1" class="divDnD" ondrop="drop(event)" ondragover="allowDrop(event)" draggable="true">' +
            //        '<img id="drag1" style="width:70px; height:70px;" src="http://www.html5andcss3.org/images/html5_logo.png" alt="html5 tutorial"  ondragstart="drag(event)" id="drag1"/>' +
            //        '</div>'
            html: gridsterHtml
        });

        this.internalCenterView = Ext.create('Ext.panel.Panel', {
            title: 'Center',
            region: 'center',
            width: '100%'
            //html: '<div id="div2" class="divDnD" ondrop="drop(event)" ondragover="allowDrop(event)">' +
            //        '</div>'
        });

        this.items = [this.internalNorthView, this.internalCenterView];


        this.callParent([config]);


        this.on('render', function () {

            var self = this;

            this.gridster = $("#_modules > ul").gridster({
                max_size_x: 200,
                max_size_y: 200,
                widget_base_dimensions: [55, 55],
                widget_margins: [5, 5],
                helper: 'clone',
                resize: {
                    enabled: true
                },
                namespace: '#_modules'
            }).data('gridster');

            console.warn('gridster', this.gridster);


            /* Make sure all our elements in the list are draggable. */
            $('.draggableElement').draggable({ revert: true });
            
            /* Make the gridster grid the droppable area and fire out an event once dropped. */
            $('#_modules').droppable({
                drop: function (event, ui) {
                    console.warn('drop', arguments);
                    self.gridster.add_widget('<li style="border: 2px solid yellow;" class="gridster-border">dragged</li>', 1, 1);
                }
            });

        }, this);

    },


    onBtnAddTile: function () {
        this.gridster.add_widget('<li class="gridster-border">The HTML of the widget...</li>', 0, 0);
    },

    onBtnRemoveTile: function () {
        if ($('#_modules li').length == 0) return;

        this.gridster.remove_widget($('#_modules li').eq($('#_modules li').length - 1));

    },


    allowDrop: function(ev){
        ev.preventDefault();
    },
    drag: function (ev) {
        alerd('dupa');
        ev.dataTransfer.setData("Text",ev.target.id);
    },
    drop: function(ev){
        ev.preventDefault();
        var data=ev.dataTransfer.getData("Text");
        ev.target.appendChild(document.getElementById(data));
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
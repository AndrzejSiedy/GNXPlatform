/**
 * @class
 */
Ext.define('Workspace.Views.Modules', {

    extend: 'Ext.panel.Panel',

    requires: [
        'Workspace.Data.ModuleModel'
    ],

    constructor: function (config) {

        Ext.apply(this, config);
        
        this.layout = "border";

        this.moduleStore = Ext.create('Ext.data.Store', {
            model: 'Workspace.Data.ModuleModel'
        });

        var me = this;
        function initializeModuleDragZone(v) {

            v.dragZone = Ext.create('Ext.dd.DragZone', v.getEl(), {

                //      On receipt of a mousedown event, see if it is within a draggable element.
                //      Return a drag data object if so. The data object can contain arbitrary application
                //      data, but it should also contain a DOM element in the ddel property to provide
                //      a proxy to drag.
                getDragData: function (e) {

                    var sourceEl = e.getTarget(v.itemSelector, 10), d;

                    if (sourceEl) {

                        // should be same as drag start
                        me.dragStarted();


                        d = sourceEl.cloneNode(true);
                        d.id = Ext.id();
                        return (v.dragData = {
                            sourceEl: sourceEl,
                            repairXY: Ext.fly(sourceEl).getXY(),
                            ddel: d,

                            // get record data - used in dropped
                            recordData: v.getRecord(sourceEl)
                        });
                    }
                },

                //      Provide coordinates for the proxy to slide back to on failed drag.
                //      This is the original XY coordinates of the draggable element.
                getRepairXY: function () {
                    return this.dragData.repairXY;
                },

                onMouseUp: function () {
                    me.dragEnd();
                }
            });
        }

        var imageTpl = new Ext.XTemplate(
            '<tpl for=".">',
                '<a href="#" id="toDrag" draggable="true">',
                    '<div style="margin-bottom: 10px;" class="thumb-wrap">',
                      '<img src="{Thumbnail}" width=50%; height=50%; />',
                      '<br/><span>{Name}</span>',
                    '</div>',
                '</a>',
            '</tpl>'
        );

        this.modulesView = Ext.create('Ext.view.View', {
            border: false,
            autoScroll: true,
            store: this.moduleStore,
            tpl: imageTpl,
            itemSelector: 'div.thumb-wrap',
            emptyText: 'No images available',
            listeners: {
                render: initializeModuleDragZone
            }
        });

        this.internalNorthView = Ext.create('Ext.panel.Panel', {
            border: false,
            region: 'north',
            minHeight: 500,
            height: 400,
            width: '100%',
            layout: 'fit',
            split: true,
            items: [this.modulesView]
        });

        this.internalNorthView.on('render', this.getModules, this);

        this.internalCenterView = Ext.create('Ext.panel.Panel', {
            region: 'center',
            width: '100%'
        });

        this.items = [this.internalNorthView, this.internalCenterView];


        this.callParent([config]);

    },

    dragStarted: function () {
        this.fireEvent('dragstart');
    },

    dragEnd: function(){
        this.fireEvent('dragend');
    },

    getModules: function () {

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
                me.moduleStore.loadData(result);

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

    noThumbnail: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcS6Hq-QaY5OLlQpEAXbT3cyu7SVSyH9dxrL9Xm5qM-tHoaHsLsf5g'

});
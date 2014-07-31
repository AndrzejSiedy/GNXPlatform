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
                '<a href="#" id="toDrag" draggable="true">This is a draggable item',
                    '<div style="margin-bottom: 10px;" class="thumb-wrap">',
                      '<img src="{ImgUrl}" width=25%; height=25%; />',
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
                    result[i].ImgUrl = me.getModuleIcon(i);
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

    icons: [
        'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSQdLTeJPGZyNDwUAI2aQx1DtSlLMRSdZ1S2cVlsk7vZTaw87bY7A',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQACOYEQBgjA8X0j05bH7A3MwEyw24_s13hgchCgchTnI8ZCDbYFg',
        'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQLBc-4mKwK1VU0wwVD9oebbc8esJ1Yziqc3J-owgDFvhtirvQc',
        'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRClX6P-zML6-AGwTVsJyaCJFcQPjuNzvQ95lyLy8Y1gak1lMeE',
        'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTZgsLxxV1Pn7c9Yohpu0t8ge9evzgkg4UUQ_MRy8C4SwyKLgXZ',
        'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQqID5iNkHWRPYedZ-K37RrvCYJ2r7WVGxvbctYeWXD0j6Lm002Ig',
        'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS0cnjFPvDCvCFJwnqz1-C6itwxWH2Enwnu1vt1g8evh6i1lEly'

    ],

    getModuleIcon: function (idx) {
        if (idx > this.icons.length) {
            idx = 0;
        }

        return this.icons[idx];
    }


});
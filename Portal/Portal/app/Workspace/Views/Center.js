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

        //this.btnLoadGridModule = Ext.create('Ext.button.Button', {
        //    text: 'load Grid Module',
        //    handler: Ext.bind(this.onBtnLoadGridModule, this)
        //});

        //this.tbar = [
        //    this.btnLoadMapModule,
        //    this.btnLoadGridModule
        //];

        this.layout = 'fit';

        //this.leftContainer = Ext.create('Ext.panel.Panel', {
        //    title: 'map?',
        //    flex: 1
        //});
        //this.rightContainer = Ext.create('Ext.panel.Panel', {
        //    title: 'grid?',
        //    flex: 1
        //});

        //this.items = [
        //    this.leftContainer,
        //    this.rightContainer
        //];


        var gridsterHtml =
       '<div id="_center" class="gridster" style="width: 100%; height:100%;">' +
           '<ul id="_ul-modules">' +
           '<li class="gridster-border" data-row="1" data-col="1" data-sizex="2" data-sizey="1"><div id="_map" style="width:100%; height:100%;"></div></li>' +
           '<li class="gridster-border" data-row="1" data-col="3" data-sizex="1" data-sizey="1"><div id="_grid" style="width:100%; height:100%;"></div></li>' +
           '</ul>' +
       '</div>';

        this.html = gridsterHtml;
        this.tbar = [
            Ext.create('Ext.button.Button', {
                text: 'Load Gadget',
                handler: this.renderShinding
            }),
            Ext.create('Ext.button.Button', {
                text: 'Load Google Gadget',
                handler: this.renderGoogleGadget
            })
        ];
            

        this.callParent([config]);


        this.on('render', function () {
            var me = this;

            var jQIdPartial = '#' + this.getId();
            var jQIdFull = '#' + this.getId() + ' > ul';

            //this.gridster = $(jQIdFull).gridster({
            //    max_size_x: 400,
            //    avoid_overlapped_widgets: true,
            //    widget_base_dimensions: [400, 400],
            //    widget_margins: [5, 5],
            //    helper: 'clone',
            //    resize: {
            //        enabled: true
            //    },
            //    namespace: jQIdPartial
            //}).data('gridster');

            this.gridster = $("#_center > ul").gridster({
                max_size_x: 500,
                max_size_y: 500,
                avoid_overlapped_widgets: true,
                widget_base_dimensions: [200, 150],
                widget_margins: [2, 2],
                helper: 'clone',
                resize: {
                    enabled: true,
                    start: function (e, ui, $widget) {
                        
                    },
                    stop: function (e, ui, $widget) {
                        var newHeight = this.resize_coords.data.height;
                        var newWidth = this.resize_coords.data.width;
                        if (me.modulesContainers.length > 0) {
                            for (var i = 0; i < me.modulesContainers.length; i++) {
                                me.modulesContainers[i].doLayout();
                            }
                        }
                    }
                },
                namespace: '#_center'
            }).data('gridster');


            //var formPanelDropTarget = Ext.create('Ext.dd.DropTarget', this.body.dom, {
            //    //ddGroup: 'GridExample',
            //    notifyEnter: function (ddSource, e, data) {

            //        //Add some flare to invite drop.
            //        me.body.stopAnimation();
            //        me.body.highlight();
            //    },
            //    notifyDrop: function (ddSource, e, data) {
            //        me.generateModuleWindow(data.recordData, e.browserEvent.clientX, e.browserEvent.clientY);
            //        return true;
            //    }
            //});


            var mapDom = Ext.get('_map')
            Ext.create('Ext.dd.DropTarget', mapDom.dom, {
                //ddGroup: 'GridExample',
                notifyEnter: function (ddSource, e, data) {

                    //Add some flare to invite drop.
                    mapDom.stopAnimation();
                    mapDom.highlight();
                },
                notifyDrop: function (ddSource, e, data) {
                    //me.generateModuleWindow(data.recordData, e.browserEvent.clientX, e.browserEvent.clientY);
                    me.renderModule(data.recordData, '_map')
                    return true;
                }
            });

            var gridDom = Ext.get('_grid')
            Ext.create('Ext.dd.DropTarget', gridDom.dom, {
                //ddGroup: 'GridExample',
                notifyEnter: function (ddSource, e, data) {

                    //Add some flare to invite drop.
                    gridDom.stopAnimation();
                    gridDom.highlight();
                },
                notifyDrop: function (ddSource, e, data) {
                    //me.generateModuleWindow(data.recordData, e.browserEvent.clientX, e.browserEvent.clientY);
                    me.renderModule(data.recordData, '_grid')
                    return true;
                }
            });

        }, this);

    },

    modulesContainers: [],

    renderShinding: function(){
        var w = Ext.create('Ext.window.Window', {
            width: 500,
            height: 500,
            html: '<iframe src="http://localhost:8088/gadgets/ifr?url=http://www.labpixies.com/campaigns/calc/calc.xml" width="100%" height="100%" frameBorder="0"></iframe>'
        });

        w.show();
    },

    renderGoogleGadget: function () {
        var w = Ext.create('Ext.window.Window', {
            width: 500,
            height: 500,
            html: '<script src="//www.gmodules.com/ig/ifr?url=http://www.infosniper.net/plugin/gadget-worldmap.xml&amp;synd=open&amp;w=320&amp;h=100&amp;title=Visitor+Worldmap&amp;border=%23ffffff%7C3px%2C1px+solid+%23999999&amp;output=js"></script>'
        });

        w.show();
    },

    //<script src="//www.gmodules.com/ig/ifr?url=http://igwidgets.com/gw/f/z/1002/nasa/4/5/6/7/8/9.xml&amp;synd=open&amp;w=320&amp;h=200&amp;title=&amp;border=%23ffffff%7C3px%2C1px+solid+%23999999&amp;output=js"></script>

    renderModule: function(record, containerId){

        // fake logic here - need to be read from modules config
        var html;
        var modName = record.get('Name');

        console.warn('has roomId?', this.roomId);

        if (modName == 'Map') {
            html = '<iframe src="http://localhost/ol3Map/?_roomId_=' + this.roomId + '"  width="100%" height="100%" frameBorder="0"></iframe>';
        }
        else if (modName == 'Cities Grid') {
            html = '<iframe src="http://localhost/Grid/?_roomId_=' + this.roomId + '" width="100%" height="100%" frameBorder="0"></iframe>';
        }

        var container = Ext.create('Ext.panel.Panel', {
            border: true,
            title: modName,
            layout: 'fit',
            width: '100%',
            height: '100%',
            renderTo: containerId,
            html: html
        });

        this.modulesContainers.push(container);

    },

    generateModuleWindow: function (record, x, y) {

        // fake logic here - need to be read from modules config
        var html;
        var modName = record.get('Name');
        if (modName == 'Map') {
            html = '<iframe src="http://localhost/ol3Map/?_roomId_=' + this.roomId + '"  width="100%" height="100%" frameBorder="0"></iframe>';
        }
        else if (modName == 'Cities Grid') {
            html = '<iframe src="http://localhost/Grid/?_roomId_=' + this.roomId + '" width="100%" height="100%" frameBorder="0"></iframe>';
        }


        var w = Ext.create('Ext.window.Window', {
            constrain: true,
            constrainTo: this.getEl(),
            width: 400,
            height: 500,
            x: x,
            y: y,
            html: html
        });
        w.show();
    },

    onBtnLoadMapModule: function () {
        this.leftContainer.update('<iframe src="http://localhost/ol3Map/?_roomId_=' + this.roomId + '"  width="100%" height="100%" frameBorder="0"></iframe>');
    },

    onBtnLoadGridModule: function () {
        this.rightContainer.update('<iframe src="http://localhost/Grid/?_roomId_=' + this.roomId + '" width="100%" height="100%" frameBorder="0"></iframe>');
    }

});
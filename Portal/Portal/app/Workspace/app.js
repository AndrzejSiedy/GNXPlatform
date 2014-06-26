Ext.Loader.setConfig({
    enabled: true
});

//The actual app
Ext.Loader.setPath('Workspace', 'app/Workspace');

//ExtJs extensions
//Ext.Loader.setPath('Ext.ux', __localhost__ + 'jslibs/ExtJs/' + __extjs__ + '/examples/ux');


Ext.require([
	'Workspace.AppLogic'
]);

Ext.application({
    name: 'GnxUserWorkspace',
    launch: function () {
        Ext.QuickTips.init();
        this._workspace666 = Ext.create('Workspace.AppLogic');
        this._workspace666.initMe('_HomeContent');
    }
});
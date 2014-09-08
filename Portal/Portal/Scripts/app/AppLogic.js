/**
 *  Business logic starts here
*/
(function ($, namespace, undefined) {

    var me = namespace;

    var _appStarted = false;

    /**
     * Method initializes freewall and other setup stuff 
     */
    me.appStart = function () {

        // prevent from calling method multiple times
        if (_appStarted) {
            console.warn('app stater already');
            return;
        }

        // jQuery Layout UI
        var l = me.Layout = new me.Layout();
        l.init();

        // Freewall jQuery plugin for west (modules) pane
        // all css and modules view
        var w = me.Wall = new me.Wall();
        w.init();

        // modules manager - for now get opnly, but should implement
        // filter, paging, CRUD
        var m = me.Module = new me.Module();
        m.init();

        // ModuleInfo Ui
        var mi = me.ModuleInfo = new me.ModuleInfo();
        mi.init();

        // bind to layout west panel resize
        // event triggered from Layout class
        me.Event.on('layout-west-resize', function () {
            me.Wall.refresh();
        });

        _appStarted = true;

        // get modules on all init
        m.getModules();

    }


    return me;

})(jQuery, window.Gnx);

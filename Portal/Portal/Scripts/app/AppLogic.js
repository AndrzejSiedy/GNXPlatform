/**
 *  Business logic starts here
*/
(function ($, namespace, undefined) {

    var me = namespace;

    /**
     * Method initializes freewall and other setup stuff 
     */
    me.appStart = function () {

        // jQuery Layout UI
        var l = me.Layout = new me.Layout();
        l.init();

        // Freewall jQuery plugin for west (modules) pane
        var w = me.Wall = new me.Wall();
        w.init();

        // modules manager - for now get opnly, but should implement
        // filter, paging, CRUD
        var m = me.Module = new me.Module();
        m.init();

        // bind to layout west panel resize
        // event triggered from Layout class
        me.Event.on('layout-west-resize', function () {
            me.Wall.wall.refresh();
        });

    }


    return me;

})(jQuery, window.Gnx);

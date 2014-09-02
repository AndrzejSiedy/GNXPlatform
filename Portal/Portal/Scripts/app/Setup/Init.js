/**
 *  Init Gnx namespace
 *  Other modules, classes will extend it
*/
(function ($, namespace, undefined) {

    var me = namespace;

    me.Layout = null;
    me.Wall = null;
    me.Module = null;

    /**
     * Method initializes freewall and other setup stuff 
     */
    me.init = function () {

        me.initialized = true;
        return me.initialized;
    }

    return me;

})(jQuery, window.Gnx = window.Gnx || {});

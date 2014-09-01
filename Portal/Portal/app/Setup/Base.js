/**
 *  Init Gnx namespace
 *  Other modules, classes will extend it
*/
(function ($, namespace, undefined) {

    var me = namespace;

    _initLayout = function () {
        var westResizeCallback = function () {
            if (wall) {
                wall.refresh();
            }
        }

        var viewport = $('#sub-content-center').layout({
            resizeWhileDragging: true
            //, initClosed: true
            , animatePaneSizing: true
            , spacing_open: 0
            , spacing_closed: 0

            , west: {
                spacing_closed: 50
                , spacing_open: 50
                , size: '100%'
                , minSize: 300
                , initClosed: false
                , togglerLength_closed: '100%'
                , togglerLength_open: '100%'

                , togglerContent_open: '<div class="west-toggler-collapse"><span class="icon-arrow-up-3" style="font-size:22px;"/> Hide modules</div>'
                , togglerContent_closed: '<div class="west-toggler-expand"><span class="icon-arrow-up-3" style="font-size:22px;"/> Show modules</div>'

                , onresize: westResizeCallback

            }
        });

        // inject div dynamically example
        $("<p>" + Date.now() + "</p>").appendTo(viewport.west.pane[0]);


        // open west pane
        //viewport.open('west');

        // copy background color from nav-container class
        // so JQuery Layout UI pane togglers update dynamically
        $('.ui-layout-toggler').css('background-color', $('#nav-container').css('background-color'));
        $('.west-toggler-collapse').css('color', $('#nav-container').css('color'));
        $('.west-toggler-expand').css('color', $('#nav-container').css('color'));
    }

    _initWall = function () {
        var temp = "<div class='cell' style='width:{width}px; height: {height}px; background-color: " + $('#nav-container').css('background-color') + "; color: " + $('#nav-container').css('color') + "'>Module {index}</div>";
        var w = 200, h = 100, html = '', limitItem = 49;
        for (var i = 0; i < limitItem; ++i) {
            html += temp.replace(/\{height\}/g, h).replace(/\{width\}/g, w).replace("{index}", i + 1);
        }
        $("#freewall").html(html);

        var wall = new freewall("#freewall");
        wall.reset({
            draggable: true,
            selector: '.cell',
            animate: true,
            cellW: 200,
            cellH: 100,
            onResize: function () {
                wall.refresh();
            }
        });
        wall.fitWidth();
        // for scroll bar appear;
        $(window).trigger("resize");
    }

    /**
     * Method initializes freewall and other setup stuff 
     */
    me.init = function () {

        _initLayout();

        _initWall();

        
        me.initialized = true;

        return me.initialized;
    }

    return me;

})(jQuery, window.Gnx = window.Gnx || {});

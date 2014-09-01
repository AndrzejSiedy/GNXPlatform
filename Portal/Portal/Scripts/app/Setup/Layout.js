/**
 *  Init Layout UI
*/
Gnx.Layout = function () {

    this.initialized = false;

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


    this.init = function () {

        _initLayout();

        this.initialized = true;

        return this.initialized;
    }
};

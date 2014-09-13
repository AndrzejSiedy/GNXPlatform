/**
 *  Init Freewall modules grid
*/
Gnx.Wall = function () {

    /**
     * private
     */
    var _initialized = false;
    this.initialized = false;

    //var t = '<div class="cell element tile double" data-module-uuid="{ModuleUuid}">' +
    //        '<div class="tile-content image">' + 
    //            '<img class="tile-image" src="{Thumbnail}">' +
    //        '</div>' +
    //        '<div class="brand bg-dark opacity">' +
    //            '<span class="text">' + 
    //                '{Name}' +
    //            '</span>' +
    //            //'<span class="text">' +
    //            //    '{Description}' +
    //            //'</span>' +
    //            '<div class="rating small fg-amber"></div>' + 
    //        '</div>' +
    //        '<div class="tile-menu">' +
    //            '<div style="text-align: right; position:relative; width: 100%; border-width: 1px 0 0 0; ">' +
    //                // we duplicate data-module-uuid="{ModuleUuid}" property to prevent DOM quering
    //                '<button class="image-button primary tile-menu-add" data-module-uuid="{ModuleUuid}">' +
    //                    'Add' + 
    //                    '<i class="icon-arrow-right bg-cobalt"></i>' +
    //                '</button>' +
    //            '</div>' +
    //            '<div style="text-align: right; position:relative; width: 100%; border-width: 1px 0 0 0; ">' +
    //                // we duplicate data-module-uuid="{ModuleUuid}" property to prevent DOM quering
    //                '<button class="image-button primary tile-menu-info" data-module-uuid="{ModuleUuid}">' +
    //                    'Info' +
    //                    '<i class="icon-help bg-cobalt"></i>' +
    //                '</button>' +
    //            '</div>' +
    //        '</div>' +
    //    '</div>';


    var imageTemplate = '<div class="image-container" style="width:100%; height:100%;">' +
                    '<img src="{Thumbnail}">' +
                    //'<div class="overlay">' +
                    //    '{Name}' +
                    //'</div>' +
                '</div>';

    var infoTemplate = '<div class="tile-info-section" style="width:100%; height:100%;">' +
            '{Name}<br/>' +
            '<div class="rating small fg-amber"></div>' +
        '</div>';


    var tileMenuTemplate = '<div class="tile-menu">' +
                '<div style="text-align: right; position:relative; width: 100%; border-width: 1px 0 0 0; ">' +
                    // we duplicate data-module-uuid="{ModuleUuid}" property to prevent DOM quering
                    '<button class="image-button primary tile-menu-add" data-module-uuid="{ModuleUuid}">' +
                        'Add' +
                        '<i class="icon-arrow-right bg-cobalt"></i>' +
                    '</button>' +
                '</div>' +
                '<div style="text-align: right; position:relative; width: 100%; border-width: 1px 0 0 0; ">' +
                    // we duplicate data-module-uuid="{ModuleUuid}" property to prevent DOM quering
                    '<button class="image-button primary tile-menu-info" data-module-uuid="{ModuleUuid}">' +
                        'Info' +
                        '<i class="icon-help bg-cobalt"></i>' +
                    '</button>' +
                '</div>' +
            '</div>';

    var t = "<div class='cell shadow' style='width:{width}px; height: {height}px; padding:5px;'  data-module-uuid='{ModuleUuid}'>" +
                tileMenuTemplate +
            "<div class='tile-wrapper'>" +
                "<div class='tile-middle'>" +
                    imageTemplate +
                "</div>" +
                "<div class='tile-bottom'>" +
                    infoTemplate +
                "</div>" +
            "</div>" +
        "</div>";
    
    // Module settings
    this.settings = {
        width: 240,
        height: 200,
        template: t
    };

    var me = this;

    var _onResize = function () {
        _refreshView();
    };

    var _refreshView = function () {
        me.wall.refresh();
    }

    /**
     * private
     */
    var _initWall = function () {

        me.wall = new freewall("#freewall");
        me.wall.reset({
            draggable: true, 
            selector: '.cell',
            animate: true,
            cellW: me.settings.width,
            cellH: me.settings.height,
            onResize: _onResize
        });
        me.wall.fitWidth();
        // for scroll bar appear;
        $(window).trigger("resize");

    }

    /**
     * private
     */
    var _showLoadMask = function () {
        $('#west-pane-div').showLoadMask();
        $("#freewall").fadeTo("fast", 0.2, function () { });
    }

    /**
     * private
     */
    var _hideLoadMask = function () {
        $('#west-pane-div').hideLoadMask();
        $("#freewall").fadeTo("fast", 1.0, function () { });
    }

    /**
     * private
     */
    var _onBeforeModulesGet = function () {
        _showLoadMask();
    }

    /**
     * private
     */
    var _onModulesGetSuccess = function (evt, data) {
        _loadModules(data.records);
        _hideLoadMask();
    }

    /**
     * private
     */
    var _loadModules = function (recs, append) {

        if (!append) {
            _removeAll();
        }
        var l = recs.length;
        for (var i = 0; i < l; i++) {
            _appendBlock(recs[i]);
        }


        // hide all menus
        $('.tile-menu').hide();

        _bindTileCompEvents();

        $(".rating").rating({
            static: false,
            score: 2,
            stars: 5,
            showHint: true,
            showScore: false,
            click: function (value, rating) {
                //alert("Rating clicked with value " + value);
                rating.rate(value);
            }
        });
        
    }

    var _bindTileCompEvents = function () {
        // bind hover on/off events
        $('.cell').hover(
            function () {
                $(this).find('.tile-menu').fadeIn();
            },
            function () {
                $(this).find('.tile-menu').fadeOut(10);
            }
        );

        $('.tile-menu-add').click(_onAddMenuClicked);

        $('.tile-menu-info').click(_onInfoMenuClicked);
    }

    var _onAddMenuClicked = function () {
        // this is heard by Gnx.Module which gets module data and informs Gnx.SignalRClient
        Gnx.Event.fireEvent('add-module', { uuid: $(this).attr('data-module-uuid') });
    }

    var _onInfoMenuClicked = function () {
        Gnx.Event.fireEvent('show-module-info', { uuid: $(this).attr('data-module-uuid') });
    }

    /**
     * private
     */
    var _appendBlock = function (rec) {
        var h = me.settings.height;
        var w = me.settings.width;
        var templ = me.settings.template;

        var html = templ
            .replace(/\{height\}/g, h) // regex replace all occurences
            .replace(/\{width\}/g, w)
            .replace(/\{Name\}/g, rec.Name) 
            .replace("{Thumbnail}", rec.Thumbnail) // replace first found
            .replace("{Description}", rec.Description)
            .replace(/\{ModuleUuid\}/g, rec.Id)
            .replace("null", '');
        
        me.wall.appendBlock(html);
    }

    /**
     * private
     */
    var _removeAll = function () {
        $("#freewall").empty();
        me.wall.refresh();
    }

    this.init = function () {
        // prevent calling init method after it started already
        if (_initialized) return;

        _initWall();

        this.initialized = _initialized = true;
        
        Gnx.Event.on('before-modules-get', _onBeforeModulesGet);
        Gnx.Event.on('modules-get-done', _onModulesGetSuccess);

        return this.initialized;
    }

    this.refresh = function () {
        me.wall.refresh();

        _onResize();
    }

    this.removeAll = function () {
        _removeAll();
    }
};

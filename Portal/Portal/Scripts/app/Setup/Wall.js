/**
 *  Init Freewall modules grid
*/
Gnx.Wall = function () {

    /**
     * private
     */
    var _initialized = false;
    this.initialized = false;

    var t = '<div class="cell element tile double" data-module-uuid="{ModuleUuid}">' +

            '<div class="tile-content image">' + 
                '<img class="tile-image" src="{Thumbnail}">' +
            '</div>' +
            '<div class="brand bg-dark opacity">' +
                '<span class="text">' + 
                    '{Name}' +
                '</span>' +
                '<span class="text">' +
                    '{Desciption}' +
                '</span>' +
            '</div>' +
            '<div class="tile-menu">' +
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
            '</div>' +


            //'<ul class="navigationMenu">' +
            //    '<li>' +
	        //        '<a class="bg-dark opacity" href="#"><i class="icon-arrow-right on-right"/>' +
            //        '</a>' +
            //    '</li>' +
            //    //'<li>' +
    	    //    //    '<a class="about" href="#">' +
            //    //        '<span>About</span>' +
            //    //    '</a>' +
            //    //'</li>' + 
            //'</ul>' +
        '</div>';
    

    // Module settings
    this.settings = {
        width: 250,
        height: 120,
        template: t
    };

    var me = this;

    var _onResize = function () {
        me.wall.refresh();

        // use timeouted flow to set tiles size
        setTimeout(function () {
            $('.cell').each(function () {
                // set tile size
                $(this).find('.tile-menu').width($(this).width())
                // set tile image size
                $(this).find('.tile-image').width($(this).width())
            });
        }, 300);
    };

    /**
     * private
     */
    var _initWall = function () {

        me.wall = new freewall("#freewall");
        me.wall.reset({
            draggable: true, 
            selector: '.cell',
            animate: true,
            cellW: 250,
            cellH: 120,
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

        $('.tile-menu-add').click(
            function () {
                console.warn('add clicked', $(this).attr('data-module-uuid'));
            }
        );

        $('.tile-menu-info').click(
           function () {
               alert('info clicked');
           }
       );
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
            .replace("{Name}", rec.Name) // replace first found
            .replace("{Thumbnail}", rec.Thumbnail)
            .replace("{Desciption}", rec.Desciption)
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

        this.initialized = true;
        _initialized = true;
        
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

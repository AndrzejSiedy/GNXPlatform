/**
 *  Init Freewall modules grid
*/
Gnx.Wall = function () {

    /**
     * private
     */
    var _initialized = false;
    this.initialized = false;

    var t = '<div class="cell element tile double">' + 
            '<div class="tile-content image">' + 
                '<img src="{Thumbnail}">' +
            '</div>' +
            '<div class="brand bg-dark opacity">' +
                '<span class="text">' + 
                    '{Name}' +
                '</span>' +
                '<span class="text">' +
                    '{Desciption}' +
                '</span>' +
            '</div>' +
            '<ul class="navigationMenu">' +
                '<li>' +
	                '<a class="bg-dark opacity" href="#"><i class="icon-arrow-right on-right"/>' +
                    '</a>' +
                '</li>' +
                //'<li>' +
    	        //    '<a class="about" href="#">' +
                //        '<span>About</span>' +
                //    '</a>' +
                //'</li>' + 
            '</ul>' +
        '</div>';


    // Module settings
    this.settings = {
        width: 140,
        height: 120,
        template: t
    };

    var me = this;

    /**
     * private
     */
    var _initWall = function () {

        me.wall = new freewall("#freewall");
        me.wall.reset({
            draggable: true, 
            selector: '.cell',
            animate: true,
            //cellW: 200,
            //cellH: 100,
            onResize: function () {
                me.wall.refresh();
            }
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
        $('.navigationMenu').hide();

        // bind hover on/off events
        $('.cell').hover(
            function () {
                $(this).find('.navigationMenu').fadeIn();
            },
            function () {
                $(this).find('.navigationMenu').fadeOut(10);
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
            .replace(/\{height\}/g, h)
            .replace(/\{width\}/g, w)
            .replace("{Name}", rec.Name)
            .replace("{Thumbnail}", rec.Thumbnail)
            .replace("{Desciption}", rec.Desciption)
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
    }

    this.removeAll = function () {
        _removeAll();
    }
};

/**
 *  Init Freewall modules grid
*/
Gnx.Wall = function () {

    /**
     * private
     */
    var _initialized = false;
    this.initialized = false;

    // Module settings
    this.settings = {
        width: 200,
        height: 100,
        template: "<div class='cell' style='width:{width}px; height: {height}px; background-color: " + $('#nav-container').css('background-color') + "; color: " + $('#nav-container').css('color') + "'>Module {Name}</div>"
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
    }

    /**
     * private
     */
    var _appendBlock = function (rec) {
        var h = me.settings.height;
        var w = me.settings.width;
        var templ = me.settings.template;

        var html = templ.replace(/\{height\}/g, h).replace(/\{width\}/g, w).replace("{Name}", rec.Name);
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

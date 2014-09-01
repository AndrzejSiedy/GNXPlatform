/**
 *  Init Freewall modules grid
*/
Gnx.Wall = function () {

    this.initialized = false;

    var me = this;

    _initWall = function () {
        var temp = "<div class='cell' style='width:{width}px; height: {height}px; background-color: " + $('#nav-container').css('background-color') + "; color: " + $('#nav-container').css('color') + "'>Module {index}</div>";
        var w = 200, h = 100, html = '', limitItem = 49;
        for (var i = 0; i < limitItem; ++i) {
            html += temp.replace(/\{height\}/g, h).replace(/\{width\}/g, w).replace("{index}", i + 1);
        }
        $("#freewall").html(html);

        me.wall = new freewall("#freewall");
        me.wall.reset({
            draggable: true,
            selector: '.cell',
            animate: true,
            cellW: 200,
            cellH: 100,
            onResize: function () {
                me.wall.refresh();
            }
        });
        me.wall.fitWidth();
        // for scroll bar appear;
        $(window).trigger("resize");


    }

    this.refresh = function () {
        me.wall.refresh();
    }


    this.init = function () {

        _initWall();

        this.initialized = true;

        return this.initialized;
    }
};

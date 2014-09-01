/**
 *  Init Freewall modules grid
*/
Gnx.Wall = function () {

    this.initialized = false;

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


    this.init = function () {

        _initWall();

        this.initialized = true;

        return this.initialized;
    }
};

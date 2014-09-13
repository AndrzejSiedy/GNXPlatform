/**
 *  Init Center container UI
 * Will hold Shinding iframed container   
*/
Gnx.Center = function () {

    var _initialized = false;
    this.initialized = false;

    var _init = function () {
        var html = '<iframe src="' + getShindigIframeUrl() + '" width="100%" height="100%" frameBorder="0"></iframe>'
        $('#center-inner').html(html);
    }

    var getShindigIframeUrl = function () {
        return shindigContainerUrl + getSignalRParams();
    }

    var getSignalRParams = function(){
        // pass signalR setup information
        //var signalRHubsUrl = '@TempData["signalRHubsUrl"]';
        //var hubName = '@TempData["hubName"]';
        //var roomId = '@TempData["roomId"]';

        return '?signalRHubsUrl=' + signalRHubsUrl + '&hubName=' + hubName + '&roomId=' + roomId;
    }

    var onWestResizeStart = function () {
        // show load mask on center - shindig container
        // this is to prevent loosing cursor scope to iframe container
        $('#center-inner').showLoadMask();
    }

    var onWestResizeEnd = function () {
        // a bit delayed mask remove
        setTimeout(function () {
            $('#center-inner').hideLoadMask();
        }, 500)
        
    }

    this.init = function () {

        if (_initialized) return;

        _init();

        this.initialized = _initialized = true;

        Gnx.Event.on('layout-west-resize-start', onWestResizeStart);
        Gnx.Event.on('layout-west-resize-end', onWestResizeEnd);

        return this.initialized;
    }
};

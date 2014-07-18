
var dragObject = new function () {
    var me = this;

    var targetNode;
    var eventNoticeNode, dragEventNoticeNode;

    var dataTransferCommentString;

    me.init = function () {
        
        if (EventHelpers.hasPageLoadHappened(arguments)) {
            return;
        }

        targetNode = document.getElementById('dropTarget');
        eventNoticeNode = document.getElementById('eventNotice');
        dragEventNoticeNode = document.getElementById('dragEventNotice');

        /* These are events for the draggable objects */
        var dragNodes = cssQuery('[draggable=true]');
        console.warn('ehhh', dragNodes);
        
        for (var i = 0; i < dragNodes.length; i++) {
            var dragNode = dragNodes[i]
            EventHelpers.addEvent(dragNode, 'dragstart', dragStartEvent);
        }

        /* These are events for the object to be dropped */
        if (targetNode) {
            console.warn('got target node', targetNode);
            EventHelpers.addEvent(targetNode, 'dragover', dragOverEvent);
            EventHelpers.addEvent(targetNode, 'drop', dropEvent);
        }
    }

    function dragStartEvent(e) {

        var src;

        if (e.explicitOriginalTarget) {
            src = e.explicitOriginalTarget.src;
        }
        else if (e.srcElement) {
            src = e.srcElement.src;
        }

        e.dataTransfer.setData('Text',
            sprintf('<img src="%s" alt="%s" /><br /><p class="caption">%s</p>',
            	src, this.alt, this.alt
            )
        );

    }


    function dragOverEvent(e) {
        console.warn('ever here?');
        EventHelpers.preventDefault(e);
    }


    function dropEvent(e) {
        this.innerHTML = e.dataTransfer.getData('Text');
        EventHelpers.preventDefault(e);
    }

}

// NOTE: moved to E:\_GitHub\GNXPlatform\Portal\Portal\app\Workspace\Views\Modules.js, getModules()
EventHelpers.addPageLoadEvent('dragObject.init');
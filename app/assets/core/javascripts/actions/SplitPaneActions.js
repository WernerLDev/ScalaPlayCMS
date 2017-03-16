
export function resizingPanel() {
    [].forEach.call(document.getElementsByClassName("iframe-wrapper"),function(iframe){
        var div = document.createElement("div");
        div.id = "iframeblocker";
        div.className = "blockiframe";
        iframe.appendChild(div);
    });
}

export function resizingPanelFinished() {
    [].forEach.call(document.getElementsByClassName("iframe-wrapper"),function(iframe){
        [].forEach.call(iframe.childNodes, function(node){
            if(node.id == "iframeblocker"){
                iframe.removeChild(node);
            }
        })
    });
}

export function hideLeftPanel(leftpane) {
    leftpane.parentNode.style.display = "none";
}

export function showLeftPanel(leftpane) {
    leftpane.parentNode.style.display = "block";
}
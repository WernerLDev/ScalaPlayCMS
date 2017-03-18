
export function getInitialTabs() {
    /*return [
        { id: "file1", type: 'file', label: "testtab", content: (<div>First tab content</div>) },
        { id: "picture1", type: 'picture', label: "blaat", content: (<div>Second tab content</div>) },
        { id: "file2", type: 'file', label: "nogwat", content: (<div>Third tab content</div>) },
    ]*/
    return [];
}

export function getTabById(tabid, alltabs) {
    var tab = alltabs.filter(x => x.id == tabid)
    if(tab.length > 0) {
        return tab[0];
    } else {
        return {};
    }
}

export function findNewActive(tabid, alltabs) {
    var current = getTabById(tabid, alltabs);
    var i = alltabs.indexOf(current);
    if(alltabs[i+1] != null) return alltabs[i + 1].id
    else if(alltabs[i-1] != null) return alltabs[i - 1].id
    else tabid;
}

import TestEditor from '../ui/TestEditor.jsx';

export function getTabById(tabid, alltabs) {
    var tab = alltabs.filter(x => x.id == tabid)
    if(tab.length > 0) {
        return tab[0];
    } else {
        return {};
    }
}

export function renameTab(tabid, newname, alltabs) {
    return alltabs.map(function(x){
        if(x.id == tabid) {
            x.name = newname;
            return x;
        } else {
            return x;
        }
    })
}

export function closeTab(tab, alltabs) {
    var newtabs = alltabs.filter(x => x.id != tab.id)
    if(tab.active == false) {
        return newtabs;
    }
    var prev = newtabs.filter(x => x.id < tab.id);
    var next = newtabs.filter(x => x.id > tab.id);
    if(prev.length > 0) {
        newtabs[prev.length - 1].active = true;
    } else if(next.length > 0) {
        newtabs[0].active = true;
    }
    return newtabs;
}

export function openTab(tab, alltabs) {
     return alltabs.map(function(x){
        if(x.id == tab.id) {
            x.active = true;
            return x;
        } else {
            x.active = false;
            return x;
        }
     })

}

export function addTab(obj, alltabs) {
    [].forEach.call(alltabs, function(elem){
        elem.active = elem.id == obj.id;
    });
    if(alltabs.filter(x => x.id == obj.id).length > 0) {
        return alltabs;
    }
    var newtab = {
        id: obj.id,
        active: true,
        name: obj.label,
        content: () => (<TestEditor name={obj.label}><h1>blaat {obj.id}</h1></TestEditor> )
    }
    alltabs.push(newtab);
    return alltabs;
}
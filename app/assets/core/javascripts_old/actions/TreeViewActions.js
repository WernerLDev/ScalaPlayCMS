
export function updateTree(id, tree, f, f2) {
    return tree.map(function(x) {
        if(x.id == id) {
            var newx = f(x);
            newx.children = updateTree(id, x.children, f, f2);
            return newx;
        } else if(x.children.length > 0) {
            var newx = f2(x);
            newx.children = updateTree(id, x.children, f, f2);
            return newx;
        } else { return f2(x); }
    })
}

export function collapseTree(prop, items) {
    var collapseTree = function(x) {
        x.collapsed = !x.collapsed;
        return x;
    }
    return updateTree(prop.id, items, collapseTree, (x => x));  
}

export function selectItem(prop, items) {
    var deselect = function(x) {
        x.selected = false;
        return x;
    };
    var select = function(x) {
        x.selected = true;
        return x;
    }
    return updateTree(prop.id, items, select, deselect);
}

export function isItemChild(id, children) {
    var subset = children.filter(x => x.id == id);
    if(subset.length > 0) {
        return true;
    } else {
        return children.map(x => isItemChild(id, x.children)).filter(x => x == true).length > 0;
    }
}
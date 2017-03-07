

export function getPageTypes() {
    return fetch("/api/v1/pagetypes", { credentials: 'include' }).then(r => r.json())
}

export function getDocuments() {
    return fetch("/documents", {credentials: 'include' }).then(r => r.json())
}

export function getDocument(id) {
    return fetch("/documents/" + id, {credentials: 'include' }).then(r => r.json())
}

export function deleteDocument(id) {
    return fetch("/documents/" + id, {
        method: "delete",
        credentials: 'include' 
    }).then(r => r.json())
}

export function addDocument(parent_id, name, pagetype) {
    var body = JSON.stringify({
        "parent_id" : parent_id,
        "name" : name,
        "pagetype": pagetype
    })
    return fetch("/documents", {
        method: "POST",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body
    }).then(r => r.json())
}

export function collapseDocument(id, collapsed) {
    return fetch("/documents/" + id + "/collapse", {
        method: "PUT",
        credentials: 'include' ,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "collapsed": collapsed
        })
    }).then(r => r.json())
}

export function renameDocument(id, name) {
    return fetch("/documents/" + id + "/rename", {
        method: "PUT",
        credentials: 'include' ,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "name": name
        })
    }).then(r => r.json())
}

export function updateParentDocument(id, parent_id) {
    return fetch("/documents/" + id + "/updateparent", {
        method: "PUT",
        credentials: 'include' ,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "parent_id": parent_id
        })
    }).then(r => r.json());
}


export function getDocuments() {
    return fetch("/documents").then(r => r.json())
}

export function deleteDocument(id) {
    return fetch("/documents/" + id, {
        method: "delete"
    }).then(r => r.json())
}

export function addDocument(parent_id, name) {
    var body = JSON.stringify({
        "parent_id" : parent_id,
        "name" : name
    })
    return fetch("/documents", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body
    }).then(r => r.json())
}

export function collapseDocument(id, collapsed) {
    return fetch("/documents/" + id + "/collapse", {
        method: "PUT",
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
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "parent_id": parent_id
        })
    }).then(r => r.json());
}
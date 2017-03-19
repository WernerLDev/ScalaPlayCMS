
var csrf = document.getElementById("csrftoken").innerText;

export function getPageTypes() {
    console.log(csrf);
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
        credentials: 'include',
        headers: {
            "Csrf-Token": csrf
        }
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
            'Content-Type': 'application/json',
            "Csrf-Token": csrf
        },
        body
    }).then(r => r.json())
}

export function collapseDocument(id, collapsed) {
    return fetch("/documents/" + id + "/collapse", {
        method: "PUT",
        credentials: 'include' ,
        headers: {
            'Content-Type': 'application/json',
            "Csrf-Token": csrf
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
            'Content-Type': 'application/json',
            "Csrf-Token": csrf
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
            'Content-Type': 'application/json',
            "Csrf-Token": csrf
        },
        body: JSON.stringify({
            "parent_id": parent_id
        })
    }).then(r => r.json());
}


export function SaveEditables(id, editables) {
    return fetch("/documents/" + id + "/editables", {
        method: "PUT",
        credentials: 'include' ,
        headers: {
            'Content-Type': 'application/json',
            "Csrf-Token": csrf
        },
        body: JSON.stringify({
            "editables": editables
        }) 
    }).then(r => r.json());
}



export function getAssets() {
    return fetch("/api/v1/assets", {credentials: 'include' }).then(r => r.json())
}

export function addAsset(parent_id, name, path, mimetype) {
    return fetch("/api/v1/assets", {
        method: "POST",
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
            "Csrf-Token": csrf
        },
        body: JSON.stringify({
            'parent_id': parent_id,
            'name': name,
            'path': path,
            'mimetype': mimetype
        })
    }).then(r => r.json());
}

export function uploadAsset(file) {
    var data  = new FormData();
    data.append("asset", file);
    return fetch("/api/v1/assets/upload", {
        method: "POST",
        credentials: 'include',
        headers: {
            "Csrf-Token": csrf
        },
        body: data
    }).then(r => r.json())
}

export function deleteAsset(id) {
    return fetch("/api/v1/assets/" + id, {
        method: "delete",
        credentials: 'include',
        headers: {
            "Csrf-Token": csrf
        },
        body: JSON.stringify({
             "csrfToken": csrf
        })
    }).then(r => r.json())

}

export function renameAsset(id, name) {
    return fetch("/api/v1/assets/" + id + "/rename", {
        method: "PUT",
        credentials: 'include' ,
        headers: {
            'Content-Type': 'application/json',
            "Csrf-Token": csrf
        },
        body: JSON.stringify({
            "name": name,
             "csrfToken": csrf
        })
    }).then(r => r.json())
}


export function getAsset(id) {
    return fetch("/api/v1/assets/" + id, {
        method: "GET",
        credentials: "include"
    }).then(r => r.json())
}

export function updateParentAsset(id, parent_id) {
    return fetch("/api/v1/assets/" + id + "/updateparent", {
        method: "PUT",
        credentials: 'include' ,
        headers: {
            'Content-Type': 'application/json',
            "Csrf-Token": csrf
        },
        body: JSON.stringify({
            "parent_id": parent_id,
             "csrfToken": csrf
        })
    }).then(r => r.json());
}
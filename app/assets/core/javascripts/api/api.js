
var csrf = document.getElementById("csrftoken").innerText;

function ApiCall(call, method, body) {
    var params = {
        method: method,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            "Csrf-Token": csrf
        }
    }
    if(method != "GET" && method != "HEAD") {
        params["body"] = body;
    }

    return fetch(call, params).then(r => r.json()).catch(e => alert("something went wrong") );
}

export function getPageTypes() {
    return ApiCall("/api/v1/pagetypes", "GET");
}

export function getDocuments() {
    return ApiCall("/documents", "GET");
}

export function getDocument(id) {
    return ApiCall("/documents/" + id, "GET");
}

export function deleteDocument(id) {
    return ApiCall("/documents/" + id, "DELETE");
}

export function addDocument(parent_id, name, pagetype) {
    var body = JSON.stringify({
        "parent_id" : parent_id,
        "name" : name,
        "pagetype": pagetype
    })
    return ApiCall("/documents", "POST", body);
}

export function collapseDocument(id, collapsed) {
    var body = JSON.stringify({
        "collapsed": collapsed
    });
    return ApiCall("/documents/" + id + "/collapse", "PUT", body);
}

export function renameDocument(id, name) {
    var body = JSON.stringify({
        "name": name
    });
    return ApiCall("/documents/" + id + "/rename", "PUT", body);
}

export function updateParentDocument(id, parent_id) {
    var body = JSON.stringify({
        "parent_id": parent_id
    });
    return ApiCall("/documents/" + id + "/updateparent", "PUT", body);
}


export function SaveEditables(id, editables) {
    var body = JSON.stringify({
        "editables": editables
    });
    return ApiCall("/documents/" + id + "/editables", "PUT", body);
}

export function getAssets() {
    return ApiCall("/api/v1/assets", "GET");
}

export function addAsset(parent_id, name, path, mimetype) {
    var body = JSON.stringify({
        'parent_id': parent_id,
        'name': name,
        'path': path,
        'mimetype': mimetype
    });
    return ApiCall("/api/v1/assets", "POST", body);
}

export function uploadAsset(file) {
    var data  = new FormData();
    data.append("asset", file);
    return ApiCall("/api/v1/assets/upload", "POST", data);
}

export function deleteAsset(id) {
    return ApiCall("/api/v1/assets/" + id, "DELETE");
}

export function renameAsset(id, name) {
    var body = JSON.stringify({
        "name": name
    });
    return ApiCall("/api/v1/assets/" + id + "/rename", "PUT", body);
}


export function getAsset(id) {
    return ApiCall("/api/v1/assets/" + id, "GET");
}

export function updateParentAsset(id, parent_id) {
    var body = JSON.stringify({
        "parent_id": parent_id
    });
    return ApiCall("/api/v1/assets/" + id + "/updateparent", "PUT", body);
}

export function collapseAsset(id, collapsed) {
    var body = JSON.stringify({
        "collapsed": collapsed
    });
    return ApiCall("/assets/" + id + "/collapse", "PUT", body);
}
import ApiCall from './ApiBase.js';

export function getPageTypes() {
    return ApiCall("/api/v1/pagetypes", "GET");
}

export function getDocuments() {
    return ApiCall("/api/v1/documents", "GET");
}

export function getDocument(id) {
    return ApiCall("/api/v1/documents/" + id, "GET");
}

export function deleteDocument(id) {
    return ApiCall("/api/v1/documents/" + id, "DELETE");
}

export function addDocument(parent_id, name, pagetype) {
    var body = JSON.stringify({
        "document" : {
            "parent_id" : parent_id,
            "name" : name,
            "pagetype": pagetype
        }
    })
    return ApiCall("/api/v1/documents", "POST", body);
}

export function updateDocument(document) {
    var body = JSON.stringify({
        "document" : document
    });
    return ApiCall("/api/v1/documents", "PUT", body);
}

export function collapseDocument(id, collapsed) {
    var body = JSON.stringify({
        "collapsed": collapsed
    });
    return ApiCall("/api/v1/documents/" + id + "/collapse", "PUT", body);
}

export function renameDocument(id, name) {
    var body = JSON.stringify({
        "name": name
    });
    return ApiCall("/api/v1/documents/" + id + "/rename", "PUT", body);
}

export function updateParentDocument(id, parent_id) {
    var body = JSON.stringify({
        "parent_id": parent_id
    });
    return ApiCall("/api/v1/documents/" + id + "/updateparent", "PUT", body);
}

export function updateDocumentPublishDate(id, publishdate) {
    var body = JSON.stringify({
        "publishdate" : publishdate
    });
    return ApiCall("/api/v1/documents/"+id+"/publishdate", "PUT", body);
}

export function SaveEditables(id, editables) {
    var body = JSON.stringify({
        "editables": editables
    });
    return ApiCall("/api/v1/documents/" + id + "/editables", "PUT", body);
}

export function getAssets() {
    return ApiCall("/api/v1/assets", "GET");
}

export function addAsset(parent_id, name, path, mimetype) {
    var body = JSON.stringify({
        'parent_id': parent_id,
        'name': name,
        'server_path': path,
        'mimetype': mimetype
    });
    return ApiCall("/api/v1/assets", "POST", body);
}

export function uploadAsset(file) {
    var data  = new FormData();
    data.append("asset", file);
    return ApiCall("/api/v1/assets/upload", "POST", data, false);
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
    return ApiCall("/api/v1/assets/" + id + "/collapse", "PUT", body);
}
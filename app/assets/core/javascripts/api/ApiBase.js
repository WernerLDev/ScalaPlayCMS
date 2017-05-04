import ApiError from './ApiErrorView.jsx';

var csrf = document.getElementById("csrftoken").innerText;

function handleErrors(response) {
    if(!response.ok) {
        response.text().then(r => {
            ApiError(response.status, response.statusText, r);
            //alert(response.status + " - " + response.statusText + "\n" + r);
        });
        //throw Error(response.statusText);
    } else {
        return response
    }
}

export default function ApiCall(call, method, body, contenttype) {
    var headers = {
            "Csrf-Token": csrf
    }
    if(contenttype != false && contenttype != null){
        headers["Content-Type"] = contenttype;
    } else if(contenttype == null) {
        headers["Content-Type"] = "application/json";
    }
    var params = {
        method: method,
        credentials: 'include',
        headers: headers 
    }
    if(method != "GET" && method != "HEAD") {
        params["body"] = body;
    } 

    return fetch(call, params).then(handleErrors).then(r => r.json());
}




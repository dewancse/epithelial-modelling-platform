// Returns an HTTP request object
function getRequestObject() {
    if (window.XMLHttpRequest) {
        return (new XMLHttpRequest());
    }
    else if (window.ActiveXObject) {
        // For very old IE browsers (optional)
        return (new ActiveXObject("Microsoft.XMLHTTP"));
    }
    else {
        alert("Ajax is not supported!");
        return (null);
    }
}

// Makes an Ajax GET request to 'requestUrl'
var sendGetRequest = function (requestUrl, responseHandler, isJsonResponse) {
    var request = getRequestObject();

    request.onreadystatechange = function () {
        handleResponse(request, responseHandler, isJsonResponse);
    };
    request.open("GET", requestUrl, true);
    request.send(null); // for POST only
};

// Makes an Ajax POST request to 'requestUrl'
var sendPostRequest = function (requestUrl, query, responseHandler, isJsonResponse) {
    var request = getRequestObject();

    request.onreadystatechange = function () {
        handleResponse(request, responseHandler, isJsonResponse);
    };

    request.open("POST", requestUrl, true);

    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.setRequestHeader("Accept", "application/sparql-results+json");

    request.send(query); // for POST only
};

// post function to get similarity matrix
var sendEBIPostRequest = function (requestUrl, query, responseHandler, isJsonResponse) {
    var request = getRequestObject();

    request.onreadystatechange = function () {
        handleResponse(request, responseHandler, isJsonResponse);
    };

    request.open("POST", requestUrl, true);

    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.setRequestHeader("Accept", "text/plain");

    var data = "";
    for (var key in query) {
        data += encodeURIComponent(key);
        data += "=";
        data += encodeURIComponent(query[key]);
        data += "&";
    }
    // console.log("data: ", data);
    request.send(data); // for POST only
}

// Only calls user provided 'responseHandler'
// function if response is ready
// and not an error
function handleResponse(request, responseHandler, isJsonResponse) {

    if ((request.readyState == 4) && (request.status == 200)) {

        // Default to isJsonResponse = true
        if (isJsonResponse == undefined) {
            isJsonResponse = true;
        }

        if (isJsonResponse) {
            responseHandler(JSON.parse(request.responseText));
        }
        else {
            responseHandler(request.responseText);
        }
    }

    else if (request.readyState == 4) {
        console.log("ERROR!");
        console.error(request.responseText);
    }
}

exports.sendGetRequest = sendGetRequest;
exports.sendPostRequest = sendPostRequest;
exports.sendEBIPostRequest = sendEBIPostRequest;
exports.getRequestObject = getRequestObject;
exports.handleResponse = handleResponse;
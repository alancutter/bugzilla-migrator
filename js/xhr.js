if (!Xhr) {
var Xhr = {};
(function(){

Xhr.loadText = function (url, callback) { // callback = function (text)
    load(url, "text", function (xhr) {
        callback(xhr.responseText);
    });
};

Xhr.loadDocument = function (url, callback) { // callback = function (document)
    load(url, "document", function (xhr) {
        callback(xhr.response);
    });
}

Xhr.loadJson = function (url, callback) { // callback = function (json)
    Xhr.loadText(url, function (text) {
        callback(JSON.parse(text));
    });
}

function load (url, type, callback) { // callback = function (xhr)
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = type;
    xhr.addEventListener("load", function () {
        callback(xhr);
    });
    xhr.send();
}

})();
}

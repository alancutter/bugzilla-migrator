if (!Xhr) {
var Xhr = {};
(function(){

Xhr.load = function (type, url, callback) { // callback = function (data)
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = type;
    xhr.addEventListener("load", function () {
        callback(xhr.response);
    });
    xhr.send();
}

})();
}

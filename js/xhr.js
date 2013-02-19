if (!Xhr) {
var Xhr = {};
(function(){

Xhr.load = function (url, callback) { // callback = function (data)
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.addEventListener("load", function () {
        callback(this.responseText);
    });
    xhr.send();
}

})();
}

// from xhr import Xhr

if (!OptionsStorage) {
var OptionsStorage = {};
(function(){

var storageKey = "options.";

OptionsStorage.load = function (callback) { // callback = function (options)
    chrome.storage.local.get(storageKey, function (data) {
        if (data[storageKey]) {
            callback(data[storageKey]);
        } else {
            loadDefaults(function (defaultOptions) {
                callback(defaultOptions);
            });
        }
    });
};

function loadDefaults (callback) { // callback = function (options)
    Xhr.loadJson("defaults/options.json", function (json) {
        var options = json;
        options = joinStringLists(options);
        callback(options);
    });
}

function joinStringLists (json) {
    if (json === null) {
        return null;
    }
    if (json.constructor === Object) {
        var newJson = {};
        for (var key in json) {
            newJson[key] = joinStringLists(json[key]);
        }
        return newJson;
    }
    if (json.constructor === Array) {
        if (json.every(function (item) {return item !== null && item.constructor === String;})) {
            return json.join("\n")
        }
        return json;
    }
    return json;
}

})();
}

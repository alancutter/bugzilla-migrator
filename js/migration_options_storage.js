// from xhr import Xhr

if (!MigrationOptionsStorage) {
var MigrationOptionsStorage = {};
(function(){

var storageKey = "Options.Migration";

MigrationOptionsStorage.load = function (callback) { // callback = function (migrationOptions)
    chrome.storage.local.get(storageKey, function (data) {
        if (data[storageKey]) {
            callback(data[storageKey]);
        } else {
            console.log("Loading default options.");
            loadDefaults(function (defaultMigrationOptions) {
                callback(defaultMigrationOptions);
            });
        }
    });
};

function loadDefaults (callback) { // callback = function (migrationOptions)
    Xhr.load("json", "defaults/migration_options.json", function (data) {
        var migrationOptions = JSON.parse(data);
        migrationOptions = joinStringLists(migrationOptions);
        callback(migrationOptions);
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

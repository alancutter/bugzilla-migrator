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
    Xhr.load("defaults/migration_options.json", function (data) {
        var migrationOptions = JSON.parse(data);
        for (var template in migrationOptions.crBugTemplates) {
            if (migrationOptions.crBugTemplates[template] instanceof Array) {
                migrationOptions.crBugTemplates[template] = migrationOptions.crBugTemplates[template].join("\n")
            }
        }
        callback(migrationOptions);
    });
}

})();
}

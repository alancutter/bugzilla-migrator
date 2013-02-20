if (!IdStorage) {
var IdStorage = {};
(function(){

IdStorage.getCrBugId = function (wkBugId, callback) { // callback = function (crBugId)
    var key = getStorageKey(wkBugId);
    chrome.storage.local.get(key, function (data) {
        callback(data[key]);
    });
};

IdStorage.setMapping = function (wkBugId, crBugId) {
    var key = getStorageKey(wkBugId);
    var data = {};
    data[key] = crBugId;
    chrome.storage.local.set(data);
}

function getStorageKey (wkBugId) {
    return "IdStorage." + wkBugId;
}


})();
}

if (!IdStorage) {
var IdStorage = {};
(function(){

IdStorage.getCrBugId = function (wkBugId, callback) { // callback = function (crIssueId)
    var key = getStorageKey(wkBugId);
    chrome.storage.local.get(key, function (data) {
        callback(data[key]);
    });
};

function getStorageKey (wkBugId) {
    return "IdStorage." + wkBugId;
}

})();
}

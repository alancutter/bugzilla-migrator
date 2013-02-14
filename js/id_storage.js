if (!IdStorage) {
var IdStorage = {};
(function(){

IdStorage.bg = {};

IdStorage.bg.getCrBugId = function (wkBugId, callback) { // callback = function (crIssueId)
    chrome.storage.local.get(wkBugId, function (result) {
        callback(result[wkBugId]);
    });
}

})();
}

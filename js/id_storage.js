if (!IdStorage) {
var IdStorage = {};
(function(){

IdStorage.bg = {};

IdStorage.bg.getCrIssueId = function (bugId, callback) { // callback = function (crIssueId)
    chrome.storage.local.get(bugId, function (result) {
        callback(result[bugId]);
    });
}

})();
}

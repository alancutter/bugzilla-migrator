// from urls import Urls
// from xhr import Xhr

if (!CrQuery) {
var CrQuery = {};
(function(){

CrQuery.getAll = function (query, callback) { // callback = function (crBugInfos)
    var url = Urls.getCrQueryUrl(query);
    Xhr.loadText(url, function (text) {
        callback(extractCrBugInfos(text));
    });
};

CrQuery.getFirst = function (query, callback) { // callback = function (crBugId, csvLine)
    CrQuery.getAll(query, function (crBugInfos) {
        if (crBugInfos.length > 0) {
            callback(crBugInfos[0].crBugId, crBugInfos[0].csvLine);
        } else {
            callback();
        }
    });
}

function extractCrBugInfos (text) {
    var crBugInfos = [];
    // text is in CSV format.
    var lines = text.split("\n");
    for (var i = 1; i < lines.length; i++) {
        var line = lines[i];
        // ID is the first column.
        var matches = /\d+/.exec(line);
        if (matches) {
            crBugInfos.push({
                crBugId: matches[0],
                csvLine: line,
            });
        }
    }
    return crBugInfos;
}

})();
}

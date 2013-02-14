// from html import Html
// from urls import Urls

if (!WkBugReader) {
var WkBugReader;
(function(){

WkBugReader = function WkBugReader (wkBugId, wkBugDocument) {
    this.wkBugId = wkBugId;
    this.wkBugDocument = wkBugDocument;
    if (wkBugDocument) {
        this.wkBugData = WkBugReader.extractWkBugData(wkBugDocument);
    }
}

WkBugReader.prototype.getWkBugData = function (callback) { // callback = function (wkBugData)
    if (!this.loaded()) {
        // FIXME: Implement this.
        Html.fromUrl(Urls.getWkBugUrl(this.wkBugId), function (wkBugDocument) {
            this.wkBugDocument = wkBugDocument;
            this.wkBugData = WkBugReader.extractWkBugData(wkBugDocument);
        });
    } else {
        callback(this.wkBugData);
    }
}

WkBugReader.prototype.getLoadedWkBugData = function () {
    return this.wkBugData;
}

WkBugReader.prototype.loaded = function () {
    return !(!this.wkBugDocument);
}

WkBugReader.extractWkBugData = function (wkBugDocument) {
    function grab(query, field) {
        var node = wkBugDocument.querySelector(query);
        if (node) {
            return node[field];
        }
        return null;
    }
    var extractMethods = {
        active: function () {
            var status = grab("#static_bug_status", "innerHTML");
            if (status) {
                return !(/resolved|closed/i.test(status));
            }
            return null;
        },
        id: function () {
            return grab("input[name=id]", "value");
        },
    };
    var wkBugData = {};
    for (var attribute in extractMethods) {
        var data = extractMethods[attribute]();
        if (data === null) {return null;}
        wkBugData[attribute] = data;
    }
    return wkBugData;
}

// FIXME: Remove debug print.
console.log(WkBugReader.extractWkBugData(document));

})();
}

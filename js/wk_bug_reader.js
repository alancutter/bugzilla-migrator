// from html import Html
// from urls import Urls

function WkBugReader (wkBugId, wkBugDocument) {
    this.wkBugId = wkBugId;
    if (wkBugDocument) {
        this.wkBugData = WkBugReader.readWkBugData(wkBugDocument);
    }
}

(function(){

WkBugReader.readWkBugData = function (wkBugDocument) {
    // FIXME: Implement this.
    return {
        valid: true,
        active: true,
    };
}

WkBugReader.prototype.getWkBugData = function (callback) { // callback = function (wkBugData)
    if (!this.loaded()) {
        // FIXME: Implement this.
        Html.fromUrl(Urls.getWkBugUrl(this.wkBugId), function (wkBugDocument) {
            this.wkBugData = WkBugReader.readWkBugData(wkBugDocument);
        });
    } else {
        callback(this.wkBugData);
    }
}

WkBugReader.prototype.getLoadedWkBugData = function () {
    return this.wkBugData;
}

WkBugReader.prototype.loaded = function () {
    return !(!this.wkBugData);
}

})();

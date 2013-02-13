// from html import HTML
// from urls import Urls

function BugReader (bugId, bugDocument) {
    this.bugId = bugId;
    if (bugDocument) {
        this.bugData = BugReader.readBugData(bugDocument);
    }
}

(function(){

BugReader.readBugData = function (bugDocument) {
    // FIXME: Implement this.
    return {
        valid: true,
        active: true,
    };
}

BugReader.prototype.getBugData = function (callback) { // callback = function (bugData)
    if (!this.loaded()) {
        // FIXME: Implement this.
        HTML.fromUrl(Urls.getBugUrl(this.bugId), function (bugDocument) {
            this.bugData = BugReader.readBugData(bugDocument);
        });
    } else {
        callback(this.bugData);
    }
}

BugReader.prototype.getLoadedBugData = function () {
    return this.bugData;
}

BugReader.prototype.loaded = function () {
    return !(!this.bugData);
}

})();

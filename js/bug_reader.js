function BugReader (bugId, bugDocument) {
    this.bugId = bugId;
    this.bugDocument = bugDocument;
    if (bugDocument) {
        this.bugData = BugReader.readBugData(this.bugDocument);
    }
}

(function(){

BugReader.prototype.getBugData = function (callback) { // callback = function (bugData)
    // FIXME: Implement this.
    this.bugDocument = {};
    this.bugData = BugReader.readBugData(this.bugDocument);
    callback(this.bugData);
}

BugReader.prototype.getLoadedBugData = function () {
    return this.bugData;
}

BugReader.prototype.loaded = function () {
    return !(!this.bugDocument);
}

BugReader.readBugData = function (bugDocument) {
    // FIXME: Implement this.
    return {
        active: true,
    };
}

})();

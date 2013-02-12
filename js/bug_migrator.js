// from bug_reader import BugReader

var BugMigrator = BugMigrator || {};

(function(){

BugMigrator.bg = {};

BugMigrator.bg.migrateBug = function (bugId, bugData) {
    bugData = bugData || BugReader.getBugDataFromId(bugId);
    // FIXME: Implement this.
    console.log("Migrate "+bugId, bugData)
}

})();
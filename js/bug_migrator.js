// from bug_reader import BugReader

if (!BugMigrator) {
var BugMigrator = {};

(function(){

BugMigrator.bg = {};

BugMigrator.bg.migrateBug = function (bugId, bugData) {
    bugData = bugData || BugReader.getBugDataFromId(bugId);
    // FIXME: Implement this.
    console.log("Migrate "+bugId, bugData)
}

})();
}

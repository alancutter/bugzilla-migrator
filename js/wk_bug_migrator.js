// from wk_bug_reader import WkBugReader

if (!WkBugMigrator) {
var WkBugMigrator = {};
(function(){

WkBugMigrator.bg = {};

WkBugMigrator.bg.migrateWkBug = function (wkBugId, wkBugData) {
    wkBugData = wkBugData || BugReader.getWkBugDataFromId(wkBugId);
    // FIXME: Implement this.
    console.log("Migrate "+wkBugId, wkBugData)
}

})();
}

// from bug_reader import BugReader
// from html import HTML
// from urls import Urls

if (!ButtonMaker) {
var ButtonMaker = {};
(function(){

ButtonMaker.cs = {};

ButtonMaker.cs.createButton = function (bugId, bugDocument, callback) { // callback = function (button)
    var bugReader = new BugReader(bugId, bugDocument);
    // Check for existing CrIssue.
    cs.getCrIssueId(bugReader, function (crIssueId) {
        if (crIssueId) {
            // Cr Issue already created, no need to migrate.
            callback(cs.createCrIssueButton(crIssueId));
        } else {
            // No Cr Issue found, offer to migrate if bug is valid and active.
            var migrate = true;
            if (bugReader.loaded()) {
                var bugData = bugReader.getLoadedBugData();
                if (!bugData.valid || !bugData.active) {
                    migrate = false;
                }
            }
            if (migrate) {
                callback(cs.createMigrateButton(bugId, bugReader));
            }
        }
    });
}

var crIssueButtonTemplate = '<a href="{{ url }}">' +
                            '    <button type="button">Cr Issue {{ id }}</button>' +
                            '</a>';
var migrateButtonTemplate = '<button type="button">migrate</button>';

var cs = {};

cs.getCrIssueId = function (bugReader, callback) { // callback = function (crIssueId)
    chrome.extension.sendMessage({
        message: "bg.getCrIssueId",
        bugId: bugReader.bugId,
        },
        callback
    );
    // FIXME: Check the page for auto generated comments stating a cr issue migration.
    // if (bugReader.loaded()) {...}
}

cs.createCrIssueButton = function (crIssueId) {
    return HTML.fromTemplate(
        crIssueButtonTemplate, {
            url: Urls.crIssueBase + crIssueId,
            id: crIssueId,
        });
}

cs.createMigrateButton = function (bugId, bugReader) {
    var button = HTML.fromTemplate(migrateButtonTemplate);
    button.addEventListener("click", function () {
        if (!bugDocument) {
            bugDocument = BugReader.getBugDocument(bugId);
        }
        cs.migrateBug(bugId, BugReader);
    });
    return button;
}

cs.migrateBug = function (bugId, bugData) {
    chrome.extension.sendMessage({
        message: "bg.migrateBug",
        bugId: bugId,
        bugData: bugData,
    });
}

})();
}

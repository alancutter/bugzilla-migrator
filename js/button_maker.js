// from bug_reader import BugReader
// from template_builder import TemplateBuilder

if (!ButtonMaker) {
var ButtonMaker = {};
(function(){

ButtonMaker.cs = {};

ButtonMaker.cs.createButton = function (bugId, callback) { // callback = function (button)
    // Check for existing CrIssue.
    cs.getCrIssueId(bugId, function (crIssueId) {
        if (crIssueId) {
            // Cr Issue already created, no need to migrate.
            callback(cs.createCrIssueButton(crIssueId));
        } else {
            // FIXME: Check if the bug is open or not.
            // No Cr Issue found, offer to migrate.
            callback(cs.createMigrateButton(bugId));
        }
    });
}

var crIssueUrlBase = "https://code.google.com/p/chromium/issues/detail?id=";
var crIssueButtonTemplate = '<a href="{{ url }}">' +
                            '    <button type="button">Cr Issue {{ id }}</button>' +
                            '</a>';
var migrateButtonTemplate = '<button type="button">migrate</button>';

var cs = {};

cs.getCrIssueId = function (bugId, callback) { // callback = function (crIssueId)
    chrome.extension.sendMessage({
        message: "bg.getCrIssueId",
        bugId: bugId,
        },
        callback
    );
    // FIXME: Check the page for auto generated comments stating a cr issue migration.
}

cs.createCrIssueButton = function (crIssueId) {
    return TemplateBuilder.build(
        crIssueButtonTemplate, {
            url: crIssueUrlBase + crIssueId,
            id: crIssueId,
        });
}

cs.createMigrateButton = function (bugId) {
    var button = TemplateBuilder.build(migrateButtonTemplate);
    button.addEventListener("click", function () {
        cs.migrateBug(bugId);
    });
    return button;
}

cs.migrateBug = function (bugId) {
    chrome.extension.sendMessage({
        message: "bg.migrateBug",
        bugId: bugId,
        bugData: BugReader.getBugDataFromDom(document),
    });
}

})();
}

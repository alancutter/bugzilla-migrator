// from bug_reader import BugReader

if (!ButtonMaker) {
var ButtonMaker = {};
(function(){

ButtonMaker.cs = {};

ButtonMaker.cs.createButton = function (bugId, callback) { // callback = function (button)
    cs.getCrIssueId(bugId, function (crIssueId) {
        if (crIssueId) {
            callback(cs.createCrIssueButton(crIssueId));
        } else {
            callback(cs.createMigrateButton(bugId));
        }
    });
}

var cs = {};

cs.getCrIssueId = function (bugId, callback) { // callback = function (crIssueId)
    chrome.extension.sendMessage({
        message: "bg.getCrIssueId",
        bugId: bugId,
        },
        callback
    );
}

cs.createCrIssueButton = function (crIssueId) {
    var a = document.createElement("a");
    a.href = "https://code.google.com/p/chromium/issues/detail?id=" + crIssueId;
    var button = document.createElement("button");
    button.type = "button";
    button.innerHTML = "Cr Issue " + crIssueId;
    a.appendChild(button);
    return a;
}

cs.createMigrateButton = function (bugId) {
    // FIXME: Check if the bug is open or not.
    var button = document.createElement("button");
    button.type = "button";
    button.innerHTML = 'migrate';
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

// from bug_reader import BugReader

var ButtonMaker = ButtonMaker || {};

(function(){

ButtonMaker.createButton = function (bugId) {
    // FIXME: Check if the bug has already been migrated.
    return createMigrateButton(bugId);
}

function createMigrateButton (bugId) {
    // FIXME: Check if the bug is open or not.
    var button = document.createElement("button");
    button.type = "button";
    button.innerHTML = 'migrate';
    button.addEventListener("click", function () {sendMigrate(bugId);})
    return button;
}

function sendMigrate (bugId) {
    chrome.extension.sendMessage({
        message: "migrateBug",
        bugId: bugId,
        bugData: BugReader.getBugDataFromDom(document),
    });
}


})();
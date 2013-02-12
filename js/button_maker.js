// from bug_reader import BugReader

var ButtonMaker = ButtonMaker || {};

(function(){

ButtonMaker.cs = {};

ButtonMaker.cs.createButton = function (bugId) {
    // FIXME: Check if the bug has already been migrated.
    return cs.createMigrateButton(bugId);
}

var cs = {};

function cs.createMigrateButton (bugId) {
    // FIXME: Check if the bug is open or not.
    var button = document.createElement("button");
    button.type = "button";
    button.innerHTML = 'migrate';
    button.addEventListener("click", function () {cs.sendMigrate(bugId);})
    return button;
}

function cs.sendMigrate (bugId) {
    chrome.extension.sendMessage({
        message: "bg_migrateBug",
        bugId: bugId,
        bugData: BugReader.getBugDataFromDom(document),
    });
}


})();
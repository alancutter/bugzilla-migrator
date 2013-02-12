// from bug_reader import BugReader

var ButtonMaker = ButtonMaker || {};

(function(){

ButtonMaker.createButton = function (bugId) {
    // FIXME: Check if the bug has already been migrated.
    return createMigrateButton();
}

function createMigrateButton () {
    // FIXME: Check if the bug is open or not.
    var button = document.createElement("button");
    button.type = "button";
    button.innerHTML = 'migrate';
    button.addEventListener("click", migrate)
    return button;
}

function migrate () {
    chrome.extension.sendMessage({
        message: "migrateBug",
        bugId: bugId,
        bugData: BugReader.getBugDataFromDom(document),
    });
}


})();
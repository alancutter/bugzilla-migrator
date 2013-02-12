(function () {

var container = document.querySelector(".bz_alias_short_desc_container");
var form = document.querySelector("form[name=changeform]");
var bugId = form.id.value;

function inject () {
    var button = createButton(bugId);
    button.style.float = "right";
    container.appendChild(button);
}

function createButton (bugId) {
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
        //bugData: BugReader.getBugData(document)
    });
}


inject();

})();
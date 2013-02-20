if (!CrBugInject) {
var CrBugInject = {};
(function () {

var cs = {};

cs.inject = function () {
    // Scrape the page for a WebKit-ID-###### label and a crBugId.
    var label = document.querySelector(".label[href^=list\\?q\\=label\\:WebKit-ID-]");
    if (!label) {
        return;
    }
    var matches = /\d+/.exec(label.title || label.innerHTML);
    if (!matches) {
        return;
    }
    var wkBugId = matches[0];
    var idField = document.querySelector("[name=id]");
    if (!idField) {
        return;
    }
    var crBugId = idField.value;

    // Save data to local storage and post info to all tabs.
    IdStorage.setMapping(wkBugId, crBugId);
    chrome.extension.sendMessage({
        message: "bg.broadcastMigration",
        wkBugId: wkBugId,
        crBugId: crBugId,
    });
};

cs.inject();

})();
}

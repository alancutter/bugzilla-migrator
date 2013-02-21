// from html import Html
// from id_storage import IdStorage
// from urls import Urls

if (!CrBugInject) {
var CrBugInject = {};
(function () {

var cs = {};

var wkBugRedirectTemplate = '<a href="{{ url }}">' +
                            '    <button type="button" style="white-space: nowrap;">' +
                            '        {{ id }}' +
                            '        <img src="' + chrome.extension.getURL("img/button_wk_redirect.png") + '"/>' +
                            '    </button>' +
                            '</a>';


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

    // Inject WK Bug redirect button.
    var wkButton = Html.fromTemplate(wkBugRedirectTemplate, {
        url: Urls.getWkBugUrl(wkBugId),
        id: wkBugId,
    });
    var td = document.querySelector("#issueheader tr td ~ td ~ td");
    if (td) {
        td.appendChild(wkButton);
    }
};

cs.inject();

})();
}

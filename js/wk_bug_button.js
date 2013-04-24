// from cr_query import CrQuery
// from html import Html
// from id_storage import IdStorage
// from urls import Urls
// from wk_bug_reader import WkBugReader

if (!WkBugButton) {
var WkBugButton;
(function(){

WkBugButton = function (wkBugId, wkBugDocument) {
    this.wkBugReader = new WkBugReader(wkBugId, wkBugDocument);
    this.html = document.createElement("span");
    this.setModeMigrate();
    this.addBroadcastListener();
    this.checkForExistingCrBug();
};

var htmlTemplates = {
    crBugRedirect: '<a href="{{ url }}">' +
                   '    <button type="button" style="white-space: nowrap;">' +
                   '        {{ id }}' +
                   '        <img src="' + chrome.runtime.getURL("img/button_cr_redirect.svg") + '"/>' +
                   '    </button>' +
                   '</a>',
    loading: '<button type="button" style="white-space: nowrap;">' +
             '    Loading' +
             '    <img src="' + chrome.runtime.getURL("img/button_loading.svg") + '"/>' +
             '</button>',
    migrate: '<button type="button" style="white-space: nowrap;">' +
             '    Migrate' +
             '    <img src="' + chrome.runtime.getURL("img/button_migrate.png") + '"/>' +
             '</button>',
};

WkBugButton.prototype.addBroadcastListener = function () {
    this.broadcastPort = chrome.runtime.connect();
    this.broadcastPort.onMessage.addListener(function (request) {
        if (request.message === "migration" && request.wkBugId == this.getWkBugId()) {
            this.setModeCrBugRedirect(request.crBugId);
        }
    }.bind(this));
};

WkBugButton.prototype.checkForExistingCrBug = function () {
    // Check storage.
    IdStorage.getCrBugId(this.getWkBugId(), function (crBugId) {
        if (crBugId) {
            this.setModeCrBugRedirect(crBugId);
        } else {
            // Search Cr Bugs.
            this.searchForExistingCrBug();
        }
    }.bind(this));
}

WkBugButton.prototype.getWkBugId = function () {
    return this.wkBugReader.wkBugId;
}

WkBugButton.prototype.searchForExistingCrBug = function () {
    // Search Cr Bugs.
    CrQuery.getAll("label:WebKit-ID-" + this.getWkBugId(), function (crBugInfos) {
        for (var i = 0; i < crBugInfos.length; i++) {
            var crBugInfo = crBugInfos[i];
            // Check that the label is actually WebKit-ID-###### and not WebKit-Rev-######.
            if (new RegExp("WebKit-ID-" + this.getWkBugId()).test(crBugInfo.csvLine)) {
                this.setModeCrBugRedirect(crBugInfo.crBugId);
                IdStorage.setMapping(this.getWkBugId(), crBugInfo.crBugId);
                chrome.runtime.sendMessage({
                    message: "bg.broadcastMigration",
                    wkBugId: this.getWkBugId(),
                    crBugId: crBugInfo.crBugId,
                });
                break;
            }
        }
    }.bind(this));
}

WkBugButton.prototype.setInnerHtml = function (html) {
    if (html) {
        if (this.html.firstChild) {
            this.html.replaceChild(html, this.html.firstChild);
        } else {
            this.html.appendChild(html);
        }
    } else {
        while (this.html.hasChildNodes()) {
            this.html.removeChild(this.html.firstChild);
        }
    }
};

WkBugButton.prototype.setModeCrBugRedirect = function (crBugId) {
    this.setInnerHtml(Html.fromTemplate(
        htmlTemplates.crBugRedirect,
        {
            url: Urls.getCrBugUrl(crBugId),
            id: crBugId,
        }
    ));
};

WkBugButton.prototype.setModeLoading = function () {
    var html = Html.fromTemplate(htmlTemplates.loading);
    this.setInnerHtml(html);
};

WkBugButton.prototype.setModeMigrate = function () {
    var html = Html.fromTemplate(htmlTemplates.migrate);
    html.addEventListener("click", this.migrateWkBug.bind(this));
    this.setInnerHtml(html);
};

WkBugButton.prototype.migrateWkBug = function () {
    this.setModeLoading();
    this.wkBugReader.getWkBugData(function (wkBugData) {
        this.setModeMigrate();
        chrome.runtime.sendMessage({
            message: "bg.migrateWkBug",
            wkBugId: this.getWkBugId(),
            wkBugData: wkBugData,
        });
    }.bind(this));
};

})();
}

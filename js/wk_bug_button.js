// from wk_bug_reader import WkBugReader
// from html import Html
// from id_storage import IdStorage
// from urls import Urls

if (!WkBugButton) {
var WkBugButton;
(function(){

WkBugButton = function (wkBugId, wkBugDocument) {
    this.wkBugReader = new WkBugReader(wkBugId, wkBugDocument);
    this.html = document.createElement("span");
    this.loadInitialHtml();
    this.addBroadcastListener();
};


var htmlTemplates = {
    crBugRedirect: '<a href="{{ url }}">' +
                   '    <button type="button">' +
                   '        {{ id }}' +
                   '        <img src="' + chrome.extension.getURL("img/button_redirect.svg") + '"/>' +
                   '    </button>' +
                   '</a>',
    loading: '<button type="button">' +
             '    Loading' +
             '    <img src="' + chrome.extension.getURL("img/button_loading.svg") + '"/>' +
             '</button>',
    migrate: '<button type="button">' +
             '    Migrate' +
             '    <img src="' + chrome.extension.getURL("img/button_migrate.png") + '"/>' +
             '</button>',
};

WkBugButton.prototype.addBroadcastListener = function () {
    this.broadcastPort = chrome.extension.connect();
    this.broadcastPort.onMessage.addListener(function (request) {
        if (request.message === "migration" && request.wkBugId == this.wkBugReader.wkBugId) {
            this.setModeCrBugRedirect(request.crBugId);
        }
    }.bind(this));
};

WkBugButton.prototype.loadInitialHtml = function () {
    this.setModeMigrate();
    this.checkForExistingCrBug();
};

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
            url: Urls.crBugBase + crBugId,
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
        chrome.extension.sendMessage({
            message: "bg.migrateWkBug",
            wkBugId: this.wkBugReader.wkBugId,
            wkBugData: wkBugData,
        });
    }.bind(this));
};

WkBugButton.prototype.checkForExistingCrBug = function () {
    // FIXME: Implement this.
}

})();
}

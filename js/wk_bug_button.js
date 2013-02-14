// from wk_bug_reader import WkBugReader
// from html import Html
// from urls import Urls

if (!WkBugButton) {
var WkBugButton;
(function(){

WkBugButton = function (wkBugId, wkBugDocument) {
    this.wkBugReader = new WkBugReader(wkBugId, wkBugDocument);
    this.html = document.createElement("span");
    this.loadInitialHtml();
}


var htmlTemplates = {
    crBugRedirect: '<a href="{{ url }}">' +
                     '    <button type="button">Cr Bug {{ id }}</button>' +
                     '</a>',
    migrate: '<button type="button">' +
             '    Migrate' +
             '    <img src="' + chrome.extension.getURL("img/button_migrate.png") + '"/>' +
             '</button>',
};

WkBugButton.prototype.loadInitialHtml = function () {
    // Check for existing CrBug.
    this.getCrBugId(function (crBugId) {
        if (crBugId) {
            // Cr Bug already created, no need to migrate.
            this.setModeCrBugRedirect(crBugId);
        } else {
            // No Cr Bug found, offer to migrate if bug is valid and active.
            var migrate = true;
            if (this.wkBugReader.loaded()) {
                var wkBugData = this.wkBugReader.getLoadedWkBugData();
                if (!wkBugData || !wkBugData.active) {
                    migrate = false;
                }
            }
            if (migrate) {
                this.setModeMigrate();
            }
        }
    }.bind(this));
}

WkBugButton.prototype.setInnerHtml = function (html) {
    if (this.html.firstChild) {
        this.html.replaceChild(html, this.html.firstChild);
    } else {
        this.html.appendChild(html);
    }
}

WkBugButton.prototype.getCrBugId = function (callback) { // callback = function (crBugId)
    chrome.extension.sendMessage({
        message: "bg.getCrBugId",
        wkBugId: this.wkBugReader.wkBugId,
        },
        callback
    );
    // FIXME: Check the page for auto generated comments stating a cr issue migration.
    // if (wkBugReader.loaded()) {...}
}

WkBugButton.prototype.setModeCrBugRedirect = function (crBugId) {
    this.setInnerHtml(Html.fromTemplate(
        htmlTemplates.crBugRedirect,
        {
            url: Urls.crBugBase + crBugId,
            id: crBugId,
        }
    ));
}

WkBugButton.prototype.setModeMigrate = function () {
    var html = Html.fromTemplate(htmlTemplates.migrate);
    html.addEventListener("click", this.migrateWkBug.bind(this));
    this.setInnerHtml(html);
}

WkBugButton.prototype.migrateWkBug = function () {
    this.wkBugReader.getWkBugData(function (wkBugData) {
        chrome.extension.sendMessage({
            message: "bg.migrateWkBug",
            wkBugId: this.wkBugReader.wkBugId,
            wkBugData: wkBugData,
        });
    }.bind(this));
}


})();
}

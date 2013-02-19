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
};


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
    IdStorage.getCrBugId(this.wkBugReader.wkBugId, function (crBugId) {
        if (crBugId) {
            // Cr Bug already created, no need to migrate.
            this.setModeCrBugRedirect(crBugId);
        } else {
            this.setModeMigrate();
        }
    }.bind(this));
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

WkBugButton.prototype.setModeMigrate = function () {
    var html = Html.fromTemplate(htmlTemplates.migrate);
    html.addEventListener("click", this.migrateWkBug.bind(this));
    this.setInnerHtml(html);
};

WkBugButton.prototype.migrateWkBug = function () {
    this.wkBugReader.getWkBugData(function (wkBugData) {
        chrome.extension.sendMessage({
            message: "bg.migrateWkBug",
            wkBugId: this.wkBugReader.wkBugId,
            wkBugData: wkBugData,
        });
    }.bind(this));
};


})();
}

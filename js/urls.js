if (!Urls) {
var Urls = {};
(function(){

Urls.bugzillaBase = "https://bugs.webkit.org/";
Urls.bugzillaShortBase = "http://wkb.ug/";
Urls.crBase = "https://code.google.com/p/chromium/issues/";
Urls.crShortBase = "http://crbug.com/";
Urls.crNewBugForm = Urls.crBase + "entry";

Urls.getCrQueryUrl = function (query) {
    return Urls.crBase + "csv?q=" + encodeURIComponent(query);
};

Urls.getCrBugUrl = function (wkBugId) {
    return Urls.crBase + "detail?id=" + wkBugId;
};

Urls.getShortCrBugUrl = function (crBugId) {
    return Urls.crShortBase + crBugId;
};

Urls.getShortWkBugUrl = function (wkBugId) {
    return Urls.bugzillaShortBase + wkBugId;
};

Urls.getWkBugUrl = function (wkBugId) {
    return Urls.bugzillaBase + "show_bug.cgi?id=" + wkBugId;
};

Urls.isCrBug = function (url) {
    return url.indexOf(Urls.crBase + "detail") === 0;
};

Urls.isWkBug = function (url) {
    return !Urls.isWkLoginPage(url) && url.indexOf(Urls.bugzillaBase + "show_bug") === 0;
};

Urls.isWkBugList = function (url) {
    return !Urls.isWkLoginPage(url) && url.indexOf(Urls.bugzillaBase + "buglist") === 0;
};

Urls.isWkLoginPage = function (url) {
    return url.indexOf(Urls.bugzillaBase) === 0 && url.indexOf("GoAheadAndLogIn=1") !== -1;
};

})();
}

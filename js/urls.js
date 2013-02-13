if (!Urls) {
var Urls = {};
(function(){

Urls.bugzillaUrlBase = "https://bugs.webkit.org/";
Urls.crIssueBase = "https://code.google.com/p/chromium/issues/detail?id=";

Urls.isBugzilla = function (url) {
    return url.indexOf(Urls.bugzillaUrlBase) === 0;
}

Urls.isBug = function (url) {
    return url.indexOf(Urls.bugzillaUrlBase + "show_bug") === 0;
}

Urls.isBugList = function (url) {
    return url.indexOf(Urls.bugzillaUrlBase + "buglist") === 0;
}

Urls.getBugUrl = function (bugId) {
    return Urls.bugzillaUrlBase + "show_bug.cgi?id=" + bugId;
}

})();
}

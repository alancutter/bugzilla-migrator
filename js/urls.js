if (!Urls) {
var Urls = {};
(function(){

Urls.bugzillaUrlBase = "https://bugs.webkit.org/";
Urls.crBugBase = "http://crbug.com/";

Urls.isBugzilla = function (url) {
    return url.indexOf(Urls.bugzillaUrlBase) === 0;
}

Urls.isWkBug = function (url) {
    return url.indexOf(Urls.bugzillaUrlBase + "show_bug") === 0;
}

Urls.isWkBugList = function (url) {
    return url.indexOf(Urls.bugzillaUrlBase + "buglist") === 0;
}

Urls.getWkBugUrl = function (wkBugId) {
    return Urls.bugzillaUrlBase + "show_bug.cgi?id=" + wkBugId;
}

})();
}

if (!Urls) {
var Urls = {};
(function(){

Urls.bugzillaBase = "https://bugs.webkit.org/";
Urls.crBugBase = "http://crbug.com/";

Urls.isBugzilla = function (url) {
    return url.indexOf(Urls.bugzillaBase) === 0;
}

Urls.isWkBug = function (url) {
    return url.indexOf(Urls.bugzillaBase + "show_bug") === 0;
}

Urls.isWkBugList = function (url) {
    return url.indexOf(Urls.bugzillaBase + "buglist") === 0;
}

Urls.getWkBugUrl = function (wkBugId) {
    return Urls.bugzillaBase + "show_bug.cgi?id=" + wkBugId;
}

})();
}

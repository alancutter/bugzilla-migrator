if (!UrlChecker) {
var UrlChecker = {};
(function(){

var bugzillaUrlBase = "https://bugs.webkit.org/";

UrlChecker.isBugzilla = function (url) {
    return url.indexOf(bugzillaUrlBase) === 0;
}

UrlChecker.isBug = function (url) {
    return url.indexOf(bugzillaUrlBase + "show_bug") === 0;
}

UrlChecker.isBugList = function (url) {
    return url.indexOf(bugzillaUrlBase + "buglist") === 0;
}

})();
}

var UrlChecker = UrlChecker || {};

(function(){

UrlChecker.isBugzilla = function (url) {
    return url.indexOf("https://bugs.webkit.org/") === 0;
}

UrlChecker.isBug = function (url) {
    return url.indexOf("https://bugs.webkit.org/show_bug") === 0;
}

UrlChecker.isBugList = function (url) {
    return url.indexOf("https://bugs.webkit.org/buglist") === 0;
}

})();
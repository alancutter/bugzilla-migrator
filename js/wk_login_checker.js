if (!WkLoginChecker) {
var WkLoginChecker = {};
(function(){

WkLoginChecker.isLoggedIn = function () {
    return !(!document.querySelector("a[href^=relogin\\.cgi]"));
}

})();
}

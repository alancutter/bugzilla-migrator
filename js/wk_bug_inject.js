// from wk_bug_button import WkBugButton

if (!WkBugInject) {
var WkBugInject = {};
(function () {

var container = document.querySelector(".bz_alias_short_desc_container");
var form = document.querySelector("form[name=changeform]");
var wkBugId = form.id.value;

var cs = {};

cs.inject = function () {
    var wkBugButton = new WkBugButton(wkBugId, document);
    wkBugButton.html.style.float = "right";
    container.appendChild(wkBugButton.html);
    container.style.paddingBottom = "13px";
}

cs.inject();

})();
}

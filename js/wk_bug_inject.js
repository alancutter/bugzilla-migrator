// from html import Html
// from wk_bug_button import WkBugButton
// from wk_login_checker import WkLoginChecker

if (!WkBugInject) {
var WkBugInject = {};
(function () {

var cs = {};

cs.inject = function () {
    if (!WkLoginChecker.isLoggedIn()) {
        return;
    }

    var wkBugId = document.querySelector("input[name=id]").value;
    var wkBugButton = new WkBugButton(wkBugId, document);

    var container = document.querySelector(".bz_alias_short_desc_container");
    var table = Html.fromString(
        '<table style="width:100%;"><tbody><tr>' +
        '    <td style="font-size: 100%;"></td>' +
        '    <td></td>' +
        '</tr></tbody></table>'
    );
    var tdLeft = table.querySelector("td");
    var tdRight = table.querySelector("td ~ td");

    while (container.hasChildNodes()) {
        tdLeft.appendChild(container.removeChild(container.firstChild));
    }

    container.appendChild(table);
    wkBugButton.html.style.float = "right";
    tdRight.appendChild(wkBugButton.html);
};

cs.inject();

})();
}

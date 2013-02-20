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

    // Insert column.
    var colgroup = document.querySelector("colgroup");
    colgroup.appendChild(Html.fromString("<col/>"));

    // Insert header
    var headingRows = document.querySelectorAll(".bz_buglist_header");
    for (var i = 0; i < headingRows.length; i++) {
        var header = Html.fromString('<th colspan="1">Migration</th>');
        headingRows[i].appendChild(header);
    }

    // Insert buttons.
    var itemRows = document.querySelectorAll(".bz_bugitem");
    for (var i = 0; i < itemRows.length; i++) {
        var row = itemRows[i];
        var wkBugId = row.querySelector("a").innerHTML;
        var wkBugButton = new WkBugButton(wkBugId);
        var td = Html.fromString('<td style="white-space: nowrap"></td>');
        td.appendChild(wkBugButton.html);
        row.appendChild(td);
    }
}

cs.inject();

})();
}

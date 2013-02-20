// from html import Html
// from wk_bug_button import WkBugButton

if (!WkBugInject) {
var WkBugInject = {};
(function () {

var cs = {};

cs.inject = function () {
    // Insert column.
    var colgroup = document.querySelector("colgroup");
    colgroup.appendChild(Html.fromString("<col/>"));

    // Insert header
    var headingRow = document.querySelector(".bz_buglist_header");
    var header = Html.fromString('<th colspan="1">Migration</th>');
    headingRow.appendChild(header);

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

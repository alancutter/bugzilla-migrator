// from button_maker import ButtonMaker

if (!BugInject) {
var BugInject = {};
(function () {

var container = document.querySelector(".bz_alias_short_desc_container");
var form = document.querySelector("form[name=changeform]");
var bugId = form.id.value;

var cs = {};

cs.inject = function () {
    var button = ButtonMaker.cs.createButton(bugId, function (button) {
        button.style.float = "right";
        container.appendChild(button);
    });
}

cs.inject();

})();
}

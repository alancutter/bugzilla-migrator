// from button_maker import ButtonMaker

(function () {

var cs = {};

var container = document.querySelector(".bz_alias_short_desc_container");
var form = document.querySelector("form[name=changeform]");
var bugId = form.id.value;

cs.inject = function () {
    var button = ButtonMaker.cs.createButton(bugId);
    button.style.float = "right";
    container.appendChild(button);
}

cs.inject();

})();
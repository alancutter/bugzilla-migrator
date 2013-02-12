// from button_maker import ButtonMaker

(function () {

var container = document.querySelector(".bz_alias_short_desc_container");
var form = document.querySelector("form[name=changeform]");
var bugId = form.id.value;

function inject () {
    var button = ButtonMaker.createButton(bugId);
    button.style.float = "right";
    container.appendChild(button);
}

inject();

})();
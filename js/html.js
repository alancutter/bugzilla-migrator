// from template import Template

if (!Html) {
var Html = {};
(function(){

Html.fromString = function (html) {
    var dom = new DOMParser().parseFromString(html, "application/xml").firstChild;
    return domToHtml(dom);
}

Html.fromTemplate = function (htmlTemplate, parameters) {
    var html = Template.stamp(htmlTemplate, parameters);
    return Html.fromString(html);
}

Html.fromUrl = function (url, callback) { // callback = function (html)
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.addEventListener("load", function () {
        callback(Html.fromString(this.responseText));
    });
    xhr.send();
}

function domToHtml (dom) {
    if (dom instanceof Text) {
        return document.createTextNode(dom.textContent);
    } else {
        var node = document.createElement(dom.tagName);
        for (var i = 0; i < dom.attributes.length; i++) {
            var attribute = dom.attributes[i];
            node.setAttribute(attribute.name, attribute.value);
        }
        for (var i = 0; i < dom.childNodes.length; i++) {
            var child = dom.childNodes[i];
            node.appendChild(domToHtml(child));
        }
        return node;
    }
}

})();
}

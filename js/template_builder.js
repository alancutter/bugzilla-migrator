if (!TemplateBuilder) {
var TemplateBuilder = {};
(function(){

TemplateBuilder.build = function (htmlTemplate, parameters) {
    var html = insertParameters(htmlTemplate, parameters);
    return buildHtml(html);
}

var parameterPattern = /\{\{\s*(\w+)\s*\}\}/g;

function insertParameters (htmlTemplate, parameters) {
    var html = htmlTemplate;
    if (parameters) {
        var insertData;
        while (insertData = parameterPattern.exec(htmlTemplate)) {
            html = html.replace(
                insertData[0],
                parameters[insertData[1]]
            )
        }
    }
    return html;
}

function buildHtml (html) {
    var dom = new DOMParser().parseFromString(html, "application/xml").firstChild;
    return domToHtml(dom);
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

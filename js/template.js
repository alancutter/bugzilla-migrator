if (!Template) {
var Template = {};
(function(){

var parameterPattern = /\{\{\s*([\w\.]+)\s*\}\}/g;

Template.stamp = function (template, parameters) {
    var result = template;
    if (parameters) {
        var matches;
        while (matches = parameterPattern.exec(template)) {
            var parameterPath = matches[1].split(".");
            var value;
            if (parameterPath.length > 0) {
                value = parameters;
                for (var i = 0; i < parameterPath.length; i++) {
                    value = value[parameterPath[i]];
                    if (value === undefined) {
                        break;
                    }
                }
            }
            if (value === undefined) {
                console.warn("Unable to stamp parameter in template:", matches, template);
                value = "";
            }
            result = result.replace(
                matches[0],
                value
            )
        }
    }
    return result;
}

})();
}

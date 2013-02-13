if (!Template) {
var Template = {};
(function(){

var parameterPattern = /\{\{\s*(\w+)\s*\}\}/g;

Template.stamp = function (template, parameters) {
    var result = template;
    if (parameters) {
        var insertData;
        while (insertData = parameterPattern.exec(template)) {
            result = result.replace(
                insertData[0],
                parameters[insertData[1]]
            )
        }
    }
    return result;
}

})();
}

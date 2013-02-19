if (!CrBugWriter) {
var CrBugWriter = {};
(function(){

CrBugWriter.cs = {};

var queryToField = {
    "#summary": "summary",
    "form textarea": "description",
    "#statusenter": "status",
    "#ownerenter": "owner",
    "#memberenter": "cc",
    "#labelenter0": "labelType",
    "#labelenter1": "labelPriority",
    "#labelenter2": "labelArea",
};

CrBugWriter.cs.writeCrBug = function (crBugData) {
    for (var query in queryToField) {
        var formField = document.querySelector(query);
        var fieldValue = crBugData[queryToField[query]];
        if (formField !== undefined && fieldValue !== undefined) {
            if (fieldValue !== null) {
                formField.value = fieldValue;
            }
        } else {
            console.warn(formField, "or", fieldValue, "undefined using query:", query);
        }
    }
};


chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.message) {
        case "cs.writeCrBug":
            console.log("Message received");
            CrBugWriter.cs.writeCrBug(request.crBugData);
            break;
    }
});

})();
}

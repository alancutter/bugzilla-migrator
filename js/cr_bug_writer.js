// from template import Template
// from xhr import Xhr

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
    "#labelenter2": "labelBlink",
    "#labelenter3": "labelOs",
    "#labelenter4": "labelWkBugId",
    "#labelenter5": "labelArea",
};

var membersUrl = "https://code.google.com/p/chromium/feeds/issueOptions?nonce=1365465824277";

var emailsRemovedDivTemplate = '<div class="fielderror">Non-Chromium emails removed from CC list: {{ removedEmails }}</div>';

CrBugWriter.cs.writeCrBug = function (crBugData, wkBugId, active) {
    // Simulate click on summary field to avoid auto-clear.
    document.querySelector("#summary").click();

    // Fill in fields.
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

    // Warn if bug is inactive.
    if (!active) {
        var td = document.querySelector(".rowmajor tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr > td ~ td");
        td.className = "fielderror";
        td.innerHTML = "The Bugzilla bug you are migrating has been marked as resolved.";
    }

    sanitiseCcAddresses()
};


chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.message) {
        case "cs.writeCrBug":
            CrBugWriter.cs.writeCrBug(request.crBugData, request.wkBugId, request.active);
            break;
    }
});

function sanitiseCcAddresses () {
    var field = document.querySelector("#memberenter");
    var currentCcs = field.value.split(", ");
    Xhr.loadText(membersUrl, function (text) {
        // This file begins with ")]}'\n" for some reason.
        text = text.substring(5);
        var emailList = [];
        try {
            json = JSON.parse(text);
            for (var i in json.members) {
                emailList.push(json.members[i].name);
            }
        } catch (e) {
            console.warn("Failed to parse JSON list of Chromium members:", e);
            return;
        }

        // Remove emails not in the list.
        var remainingCcs = [];
        var removedCcs = [];
        for (var i in currentCcs) {
            if (currentCcs[i]) {
                if (emailList.indexOf(currentCcs[i]) !== -1) {
                    remainingCcs.push(currentCcs[i]);
                } else {
                    removedCcs.push(currentCcs[i]);
                }
            }
        }

        // Update field and notify user if any emails were removed.
        if (removedCcs.length > 0) {
            field.value = remainingCcs.join(", ");
            field.parentElement.appendChild(Html.fromTemplate(emailsRemovedDivTemplate, {removedEmails: removedCcs.join(", ")}));
        }
    });
}

})();
}

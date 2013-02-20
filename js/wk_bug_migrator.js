// from options_storage import OptionsStorage
// from wk_bug_reader import WkBugReader
// from urls import Urls

if (!WkBugMigrator) {
var WkBugMigrator = {};
(function(){

var forkHasBeenAnnounced = false;

WkBugMigrator.bg = {};

WkBugMigrator.bg.migrateWkBug = function (wkBugId, wkBugData) {
    wkBugData = wkBugData || BugReader.getWkBugDataFromId(wkBugId);

    // FIXME: Remove debug print.
    console.log("Migrate "+wkBugId, wkBugData);

    OptionsStorage.load(function (options) {
        var crBugData = convertWkBugData(wkBugData, options);
        chrome.tabs.create(
            {url: Urls.crNewBugForm},
            function (tab) {
                chrome.tabs.executeScript(tab.id, {file: "js/cr_bug_writer.js"}, function () {
                    console.log("Script executed")
                    chrome.tabs.sendMessage(tab.id, {
                        message: "cs.writeCrBug",
                        crBugData: crBugData,
                        wkBugId: wkBugId.id,
                        active: wkBugData.active,
                    });
                    console.log("Message sent")
                });
            }
        );
    });
};

function convertWkBugData (wkBugData, options) {
    console.log(options);
    return {
        summary: function () {
            return Template.stamp(options.crBugTemplates.summary, wkBugData);
        }(),
        description: function () {
            var singleFields = ["url", "keywords"];
            for (var i = 0; i < singleFields.length; i++) {
                var field = singleFields[i];
                if (wkBugData[field]) {
                    wkBugData[field] = Template.stamp(options.crBugTemplates[field], wkBugData);
                }
            }

            var multiFields = {
                "blocks": "blockingList",
                "dependsOn": "dependentList",
                "attachments": "patchList",
                "comments": "commentList",
            };
            for (var field in multiFields) {
                var list = multiFields[field];
                if (wkBugData[list].length > 0) {
                    wkBugData[field] = Template.stamp(options.crBugTemplates[field].heading, wkBugData);
                    var fieldTemplate = options.crBugTemplates[field].item;
                    for (var i = 0; i < wkBugData[list].length; i++) {
                        var value = wkBugData[list][i];
                        wkBugData[field] += Template.stamp(fieldTemplate, value);
                    }
                } else {
                    wkBugData[field] = "";
                }
            }

            return Template.stamp(options.crBugTemplates.description, wkBugData).trimRight();
        }(),
        status: function () {
            if (wkBugData.resolution) {
                return {
                    "FIXED": "Fixed",
                    "INVALID": "Invalid",
                    "WONTFIX": "WontFix",
                    "DUPLICATE": "Duplicate",
                    "WORKSFORME": "WontFix",
                    "MOVED": "Duplicate",
                }[wkBugData.resolution];
            } else {
                return {
                    "UNCONFIRMED": "Uncomfirmed",
                    "NEW": "Untriaged",
                    "ASSIGNED": "Assigned",
                    "REOPENED": "Started",
                }[wkBugData.status];
            }
        }(),
        owner: function () {
            if (wkBugData.assigneeEmail === "webkit-unassigned@lists.webkit.org") {
                return "";
            }
            return wkBugData.assigneeEmail;
        }(),
        cc: function () {
            return wkBugData.ccList.filter(function (email) {return email !== wkBugData.assigneeEmail;}).join(", ");
        }(),
        labelType: function () {
            if (wkBugData.product === "Security") {
                return "Type-Security";
            }
            if (wkBugData.summary.toLowerCase().indexOf("regression") >= 0) {
                return "Type-Regression";
            }
            return "Type-Bug";
        }(),
        labelPriority: function () {
            var priorityValue = {
                "P1": 0,
                "P2": 2,
                "P3": 2,
                "P4": 3,
                "P5": 3,
            }[wkBugData.priority];
            var severityValue = {
                "Blocker": 0,
                "Critical": 0,
                "Major": 1,
                "Normal": 2,
                "Minor": 2,
                "Trivial": 3,
                "Enhancement": 3,
            }[wkBugData.severity];
            var value = 2;
            if (priorityValue === undefined && severityValue !== undefined) {
                value = severityValue;
            } else if (priorityValue !== undefined && severityValue === undefined) {
                value = priorityValue;
            } else if (priorityValue !== undefined && severityValue !== undefined) {
                value = Math.min(priorityValue, severityValue);
            }
            return "Pri-" + value;
        }(),
        labelArea: function () {
            var area = {
                "Accessibility": "Feature-Accessibility",
                "ANGLE": "",
                "Canvas": "Feature-GPU-Canvas2D",
                "CSS": "WebKit-CSS",
                "Evangelism": "Action-Evangelism",
                "Event Handling": "Webkit-Core",
                "Forms": "WebKit-Forms",
                "Frames": "Webkit-Core",
                "History": "Feature-History",
                "HTML DOM": "WebKit-DOM",
                "HTML Editing": "WebKit-Editing",
                "HTML Events": "Webkit-Core",
                "Images": "WebKit-Core",
                "Java": "",
                "JavaScriptCore": "WebKit-JavaScript",
                "JavaScriptGlue": "WebKit-JavaScript",
                "Layout and Rendering": "WebKit-Rendering",
                "MathML": "",
                "Media Elements": "Feature-Media",
                "New Bugs": "",
                "Page Loading": "WebKit-Loader",
                "PDF": "Feature-PDF",
                "Platform": "",
                "Plug-ins": "Feature-Plugins",
                "Printing": "Feature-Printing",
                "Safari Web Inspector": "",
                "SVG": "WebKit-SVG",
                "Tables": "WebKit-DOM",
                "Text": "WebKit-Core",
                "Tools / Tests": "WebKit-Tools-Test",
                "Web Audio": "WebKit-Audio",
                "WebCore JavaScript": "WebKit-JavaScript",
                "WebCore Misc.": "WebKit-Core",
                "WebGL": "WebKit-WebGL",
                "Web Inspector": "WebKit-Core",
                "WebKit2": "",
                "WebKit API": "WebKit-WebKitAPI",
                "WebKit BlackBerry": "",
                "WebKit BREWMP": "",
                "WebKit EFL": "",
                "WebKit Gtk": "",
                "WebKit Misc.": "WebKit-WebKitAPI",
                "WebKit Qt": "",
                "WebKit Website": "Documentation",
                "WebKit wx": "",
                "Web Template Framework": "",
                "XML": "WebKit-Core",
                "XML DOM": "WebKit-DOM",
            }[wkBugData.component];
            if (area !== undefined && area !== "") {
                return area;
            }
            return "WebKit-" + wkBugData.component.replace(/ /g, "-");
        }(),
        labelWkBugId: function () {
            return "WebKit-ID-" + wkBugData.id;
        }(),
        labelOs: function () {
            var os = {
                "All": "All",
                "Macintosh": "Mac",
                "Macintosh PowerPC": "Mac",
                "Macintosh Intel": "Mac",
                "Android": "Android",
            }[wkBugData.platform];
            if (!os) {
                os = {
                    "All": "All",
                    "Windows 2000": "Windows",
                    "Windows XP": "Windows",
                    "Windows Server 2003": "Windows",
                    "Windows Vista": "Windows",
                    "Windows 7": "Windows",
                    "Mac OS X 10.3": "Mac",
                    "Mac OS X 10.4": "Mac",
                    "Mac OS X 10.5": "Mac",
                    "Mac OS X 10.6": "Mac",
                    "Mac OS X 10.7": "Mac",
                    "Mac OS X 10.8": "Mac",
                    "Linux": "Linux",
                    "Android": "Android",
                }[wkBugData.operatingSystem];
            }
            if (os) {
                return "OS-" + os;
            }
            return "";
        }(),
        labelRestricted: function () {
            return forkHasBeenAnnounced ? "" : "Restrict-View-Google";
        }(),
    };
}

})();
}

// from options_storage import OptionsStorage
// from urls import Urls

if (!WkBugMigrator) {
var WkBugMigrator = {};
(function(){

WkBugMigrator.bg = {};

WkBugMigrator.bg.migrateWkBug = function (wkBugId, wkBugData) {
    OptionsStorage.load(function (options) {
        var crBugData = convertWkBugData(wkBugData, options);
        chrome.tabs.create(
            {url: Urls.crNewBugForm},
            function (tab) {
                chrome.tabs.executeScript(tab.id, {file: "js/template.js"}, function () {
                    chrome.tabs.executeScript(tab.id, {file: "js/html.js"}, function () {
                        chrome.tabs.executeScript(tab.id, {file: "js/xhr.js"}, function () {
                            chrome.tabs.executeScript(tab.id, {file: "js/cr_bug_writer.js"}, function () {
                                chrome.tabs.sendMessage(tab.id, {
                                    message: "cs.writeCrBug",
                                    crBugData: crBugData,
                                    wkBugId: wkBugId.id,
                                    active: wkBugData.active,
                                });
                            });
                        });
                    });
                });
            }
        );
    });
};

function convertWkBugData (wkBugData, options) {
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
        labelBlink: function () {
            return "Cr-Blink";
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
            return "OS-All";
        }(),
        labelWkBugId: function () {
            return "WebKit-ID-" + wkBugData.id;
        }(),
        labelArea: function () {
            var area = {
                "Accessibility": "Feature-Accessibility",
                "ANGLE": "",
                "Canvas": "Cr-Blink-Canvas",
                "CSS": "Cr-Blink-CSS",
                "Evangelism": "Action-Evangelism",
                "Event Handling": "",
                "Forms": "Cr-Blink-Forms",
                "Frames": "",
                "History": "Cr-UI-Browser-History",
                "HTML DOM": "Cr-Blink-DOM",
                "HTML Editing": "Cr-Blink-Editing",
                "HTML Events": "",
                "Images": "",
                "Java": "",
                "JavaScriptCore": "Cr-Blink-JavaScript",
                "JavaScriptGlue": "Cr-Blink-JavaScript",
                "Layout and Rendering": "Cr-Blink-Rendering",
                "MathML": "",
                "Media Elements": "Cr-Internals-Media",
                "New Bugs": "",
                "Page Loading": "Cr-Blink-Loader",
                "PDF": "Cr-Internals-Plugins-PDF",
                "Platform": "",
                "Plug-ins": "Cr-Internals-Plugins",
                "Printing": "Cr-Internals-Printing",
                "Safari Web Inspector": "",
                "SVG": "Cr-Blink-SVG",
                "Tables": "Cr-Blink-DOM",
                "Text": "Cr-Blink-Fonts",
                "Tools / Tests": "Cr-Blink-Tools-Test",
                "Web Audio": "Cr-Blink-Audio",
                "WebCore JavaScript": "Cr-Blink-JavaScript",
                "WebCore Misc.": "",
                "WebGL": "Cr-Blink-WebGL",
                "Web Inspector": "",
                "WebKit2": "",
                "WebKit API": "Cr-Blink-API",
                "WebKit BlackBerry": "",
                "WebKit BREWMP": "",
                "WebKit EFL": "",
                "WebKit Gtk": "",
                "WebKit Misc.": "",
                "WebKit Qt": "",
                "WebKit Website": "Documentation",
                "WebKit wx": "",
                "Web Template Framework": "",
                "XML": "",
                "XML DOM": "Cr-Blink-DOM",
            }[wkBugData.component];
            if (area !== undefined) {
                return area;
            }
            return "";
        }(),
    };
}

})();
}

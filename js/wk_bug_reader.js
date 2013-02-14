// from html import Html
// from urls import Urls

if (!WkBugReader) {
var WkBugReader;
(function(){

WkBugReader = function WkBugReader (wkBugId, wkBugDocument) {
    this.wkBugId = wkBugId;
    this.wkBugDocument = wkBugDocument;
    if (wkBugDocument) {
        this.wkBugData = WkBugReader.extractWkBugData(wkBugDocument);
    }
}

WkBugReader.prototype.getWkBugData = function (callback) { // callback = function (wkBugData)
    if (!this.loaded()) {
        Html.fromUrl(Urls.getWkBugUrl(this.wkBugId), function (wkBugDocument) {
            this.wkBugDocument = wkBugDocument;
            this.wkBugData = WkBugReader.extractWkBugData(wkBugDocument);
        });
    } else {
        callback(this.wkBugData);
    }
}

WkBugReader.prototype.getLoadedWkBugData = function () {
    return this.wkBugData;
}

WkBugReader.prototype.loaded = function () {
    return !(!this.wkBugDocument);
}

WkBugReader.extractWkBugData = function (wkBugDocument) {
    function grab(query, fields) {
        var value = wkBugDocument.querySelector(query);
        if (!value) {
            return null;
        }
        for (var i = 1; i < arguments.length; i++) {
            var functionRegex = /(\w+)\((.*)\)/;
            var matches = functionRegex.exec(arguments[i]);
            if (matches) {
                var functionName = matches[1];
                var parameters = matches[2].split(",").map(function (s) {return s.trimLeft().trimRight();});
                value = value[functionName].apply(value, parameters);
            } else {
                value = value[arguments[i]];
            }
            if (value === null || value === undefined) {
                return null;
            }
        }
        return value;
    }
    var extractMethods = {
        active: function () {
            var status = grab("#bug_status > option[selected]", "innerHTML");
            if (status) {
                return !(/closed|verified|resolved/i.test(status));
            }
            return null;
        },
        id: function () {
            return grab("input[name=id]", "value");
        },
        summary: function () {
            return grab("#short_desc_nonedit_display", "innerHTML");
        },
        status: function () {
            return grab("#bug_status > option[selected]", "innerHTML", "trimRight()");
        },
        resolution: function () {
            var resolutionSettings = grab("#resolution_settings");
            if (resolutionSettings) {
                if (resolutionSettings.style.display == "inline") {
                    return grab("#resolution > option[selected]", "innerHTML");
                } else {
                    return "";
                }
            }
            return null;
        },
        reportedDate: function () {
            return grab("#bz_show_bug_column_2 > table > tbody > tr > td ~ td", "firstChild", "textContent", "slice(0,-4)");
        },
        reporterName: function () {
            return grab("#bz_show_bug_column_2 a.email > span", "innerHTML");
        },
        reporterEmail: function () {
            return grab("#bz_show_bug_column_2 a.email", "title");
        },
        modifiedDate: function () {
            return grab("#bz_show_bug_column_2 > table > tbody > tr ~ tr > td ~ td", "firstChild", "textContent", "slice(0,-1)", "trimRight()");
        },
        ccList: function () {
            var ccNodes = grab("#cc", "children");
            if (ccNodes) {
                return Array.prototype.map.call(ccNodes, function (option) {return option.value;});
            }
            return null;
        },
        product: function () {
            return grab("#product > option[selected]", "value");
        },
        component: function () {
            return grab("#component > option[selected]", "value");
        },
        version: function () {
            return grab("#version > option[selected]", "value");
        },
        platform: function () {
            return grab("#rep_platform > option[selected]", "value");
        },
        operatingSystem: function () {
            return grab("#op_sys > option[selected]", "value");
        },
        priority: function () {
            return grab("#priority > option[selected]", "value");
        },
        severity: function () {
            return grab("#bug_severity > option[selected]", "value");
        },
        assigneeName: function () {
            return grab("#bz_assignee_edit_container a.email > span", "innerHTML");
        },
        assigneeEmail: function () {
            return grab("#bz_assignee_edit_container a.email", "title");
        },
        url: function () {
            return grab("#bug_file_loc", "value");
        },
        keywords: function () {
            return grab("#keywords", "value");
        },
        dependentList: function () {
            var td = grab("#bz_show_bug_column_1 > table > tbody > tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr > td");
            if (td) {
                var dependentList = [];
                var wkBugLinks = td.querySelectorAll("a[href^=show_bug]");
                for (var i = 0; i < wkBugLinks.length; i++) {
                    var wkBugLink = wkBugLinks[i];
                    dependentList.push({
                        id: wkBugLink.innerHTML,
                        summary: wkBugLink.title,
                        active: !(wkBugLink.parentElement.className == "bz_closed"),
                    });
                }
                return dependentList;
            }
            return null;
        },
        blockingList: function () {
            var td = grab("#bz_show_bug_column_1 > table > tbody > tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr > td");
            if (td) {
                var blockingList = [];
                var wkBugLinks = td.querySelectorAll("a[href^=show_bug]");
                for (var i = 0; i < wkBugLinks.length; i++) {
                    var wkBugLink = wkBugLinks[i];
                    blockingList.push({
                        id: wkBugLink.innerHTML,
                        summary: wkBugLink.title,
                        active: !(wkBugLink.parentElement.className == "bz_closed"),
                    });
                }
                return blockingList;
            }
            return null;
        },
        // FIXME: Keep implementing this.
    };
    var wkBugData = {};
    for (var attribute in extractMethods) {
        var data = extractMethods[attribute]();
        if (data === null) {return null;}
        wkBugData[attribute] = data;
    }
    return wkBugData;
}

// FIXME: Remove debug print.
console.log(WkBugReader.extractWkBugData(document));

})();
}

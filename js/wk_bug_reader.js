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
};

WkBugReader.prototype.getWkBugData = function (callback) { // callback = function (wkBugData)
    if (!this.loaded()) {
        Xhr.loadDocument(Urls.getWkBugUrl(this.wkBugId), function (wkBugDocument) {
            this.wkBugDocument = wkBugDocument;
            this.wkBugData = WkBugReader.extractWkBugData(wkBugDocument);
            callback(this.wkBugData);
        }.bind(this));
    } else {
        callback(this.wkBugData);
    }
};

WkBugReader.prototype.getLoadedWkBugData = function () {
    return this.wkBugData;
};

WkBugReader.prototype.loaded = function () {
    return !(!this.wkBugDocument);
};

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
            var status = grab("#bug_status", "value");
            if (status) {
                return status !== "RESOLVED";
            }
            return null;
        },
        originalUrl: function () {
            return Urls.getWkBugUrl(grab("input[name=id]", "value"));
        },
        id: function () {
            return grab("input[name=id]", "value");
        },
        summary: function () {
            return grab("#short_desc_nonedit_display", "innerHTML");
        },
        status: function () {
            return grab("#bug_status", "value");
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
            var usernameNode = grab("#bz_show_bug_column_2 a.email");
            if (usernameNode) {
                return getNameFromUsernameNode(usernameNode);
            }
            return null;
        },
        reporterEmail: function () {
            usernameNode = grab("#bz_show_bug_column_2 a.email");
            if (usernameNode) {
                return getEmailFromUsernameNode(usernameNode);
            }
            return null;
        },
        modifiedDate: function () {
            return grab("#bz_show_bug_column_2 > table > tbody > tr ~ tr > td ~ td", "firstChild", "textContent", "slice(0,-1)", "trimRight()");
        },
        ccList: function () {
            var ccNodes = grab("#cc", "children");
            if (ccNodes) {
                return Array.prototype.map.call(ccNodes, function (option) {return option.value;});
            }
            // Node does not exist when there are no ccs.
            return [];
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
            var usernameNode = grab("#bz_assignee_edit_container a.email");
            if (usernameNode) {
                return getNameFromUsernameNode(usernameNode);
            }
            return null;
        },
        assigneeEmail: function () {
            usernameNode = grab("#bz_assignee_edit_container a.email");
            if (usernameNode) {
                return getEmailFromUsernameNode(usernameNode);
            }
            return null;
        },
        url: function () {
            return grab("#bug_file_loc", "value");
        },
        keywords: function () {
            return grab("#keywords", "value");
        },
        dependentList: function () {
            var td = grab("#bz_show_bug_column_1 > table > tbody > tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr > td");
            if (!td) {
                return null;
            }
            var dependentList = [];
            var wkBugLinks = td.querySelectorAll("a[href^=show_bug]");
            for (var i = 0; i < wkBugLinks.length; i++) {
                var wkBugLink = wkBugLinks[i];
                var id = wkBugLink.innerHTML;
                dependentList.push({
                    id: id,
                    url: Urls.getShortWkBugUrl(id),
                    summary: wkBugLink.title,
                    active: !(wkBugLink.parentElement.className == "bz_closed"),
                });
            }
            return dependentList;
        },
        blockingList: function () {
            var td = grab("#bz_show_bug_column_1 > table > tbody > tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr ~ tr > td");
            if (!td) {
                return null;
            }
            var blockingList = [];
            var wkBugLinks = td.querySelectorAll("a[href^=show_bug]");
            for (var i = 0; i < wkBugLinks.length; i++) {
                var wkBugLink = wkBugLinks[i];
                var id = wkBugLink.innerHTML;
                blockingList.push({
                    id: id,
                    url: Urls.getShortWkBugUrl(id),
                    summary: wkBugLink.title,
                    active: !(wkBugLink.parentElement.className == "bz_closed"),
                });
            }
            return blockingList;
        },
        patchList: function () {
            var table = grab("#attachment_table");
            if (!table) {
                return null;
            }
            var patchList = [];
            var rows = table.querySelectorAll("tr");
            for (var i = 1; i < rows.length - 1; i++) {
                var row = rows[i];
                var a = row.querySelector(".bz_attach_extra_info > a");
                var link = row.querySelector("a[href^=attachment]");
                if (!link) {
                    return null;
                }
                var b = link.querySelector("b");
                if (!a || !b) {
                    return null;
                }
                patchList.push({
                    date: a.innerHTML,
                    name: stringifyNode(b),
                    url: link.href + "&action=prettypatch",
                });
            }
            return patchList;
        },
        description: function () {
            var textNode = grab("#comment_text_0");
            if (textNode) {
                return stringifyNode(textNode);
            }
            return null;
        },
        commentList: function () {
            var commentList = [];
            var commentContainer = grab("#comments");
            var commentNodes = commentContainer.querySelectorAll(".bz_comment:not(.bz_first_comment)");
            for (var i = 0; i < commentNodes.length; i++) {
                var commentNode = commentNodes[i];
                var headINode = commentNode.querySelector(".bz_comment_head > i");
                if (!headINode || headINode.childNodes.length < 5) {
                    return null;
                }
                var date = headINode.childNodes[4].textContent.trimLeft();
                var emailNode = commentNode.querySelector(".email");
                if (!emailNode) {
                    return null;
                }
                var author = emailNode.innerHTML;
                var email = emailNode.href.slice(7);
                var textNode = commentNode.querySelector(".bz_comment_text");
                if (!textNode) {
                    return null;
                }
                commentList.push({
                    number: i+1,
                    date: date,
                    author: author,
                    email: email,
                    text: stringifyNode(textNode),
                });
            }
            return commentList;
        },
    };
    var wkBugData = {};
    for (var attribute in extractMethods) {
        var data = extractMethods[attribute]();
        if (data !== null) {
            wkBugData[attribute] = data;
        } else {
            console.warn("Unable to extract " + attribute + " from document:", wkBugDocument);
            wkBugData[attribute] = "";
        }
    }
    console.log(wkBugData);
    return wkBugData;
};

function stringifyNode (node, ignoreLinks) {
    if (node instanceof Text) {
        return node.textContent;
    }
    var s = "";
    for (var i = 0; i < node.childNodes.length; i++) {
        s += stringifyNode(node.childNodes[i]);
    }
    if (!ignoreLinks && node instanceof HTMLAnchorElement && s != node.href) {
        s += " [" + node.href + "]";
    }
    return s;
}

function getNameFromUsernameNode (node) {
    var name = stringifyNode(node, true);
    // Check if the username is actually an email address and just take the username part
    var i = name.indexOf("@");
    if (i !== -1) {
        name = name.substring(0, i);
    }
    return name;
}

function getEmailFromUsernameNode (node) {
    var email = node.title;
    if (!email) {
        email = stringifyNode(node, true);
    }
    return email;
}

})();
}

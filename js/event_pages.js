// from bug_migrator import BugMigrator
// from id_storage import IdStorage
// from urls import Urls

(function(){

// Content script injects.
// FIXME: http://code.google.com/p/chromium/issues/detail?id=162543
//        Double event firing appears not to be resolved in stable.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // Tab navigation events
    if (changeInfo.status === "loading") {
        if (Urls.isBugzilla(tab.url)) {
            // Show icon in search bar.
            chrome.pageAction.show(tabId);
            chrome.tabs.executeScript(tabId, {file: "js/email_finder.js"});

            if (Urls.isBug(tab.url)) {
                // Inject button onto Webkit bug.
                chrome.tabs.executeScript(tabId, {file: "js/template.js"});
                chrome.tabs.executeScript(tabId, {file: "js/bug_reader.js"});
                chrome.tabs.executeScript(tabId, {file: "js/html.js"});
                chrome.tabs.executeScript(tabId, {file: "js/urls.js"});
                chrome.tabs.executeScript(tabId, {file: "js/button_maker.js"});
                chrome.tabs.executeScript(tabId, {file: "js/bug_inject.js"});
            } else if (Urls.isBugList(tab.url)) {
                // Inject button onto search results.
                chrome.tabs.executeScript(tabId, {file: "js/buglist_inject.js"});
            }
        }
    }
});

// Popup icon clicked.
chrome.pageAction.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, {message: "cs_findEmail"}, function (email) {
        chrome.tabs.create({
            url: "html/migrate_bugs.html?email=" + email
        });
    });
});

// Message handling.
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("Message received by background:");
    console.log(request);
    var response = false;
    switch (request.message) {
        case "bg.getCrIssueId":
            IdStorage.bg.getCrIssueId(request.bugId, sendResponse);
            response = true;
            break;
        case "bg.migrateBug":
            BugMigrator.bg.migrateBug(request.bugId, request.bugData);
            break;
    }
    return response;
});

})();

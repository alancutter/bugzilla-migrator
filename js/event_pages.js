// from bug_migrator import BugMigrator
// from url_checker import UrlChecker

(function(){

// FIXME: Remove debug log.
console.log("chrome:");
console.log(chrome);

// Content script injects.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // Tab navigation events
    if (changeInfo.status === "loading") {
        if (UrlChecker.isBugzilla(tab.url)) {
            // Show icon in search bar.
            chrome.pageAction.show(tabId);
            chrome.tabs.executeScript(tabId, {file: "js/email_finder.js"});

            if (UrlChecker.isBug(tab.url)) {
                // Inject button onto Webkit bug.
                chrome.tabs.executeScript(tabId, {file: "js/bug_reader.js"});
                chrome.tabs.executeScript(tabId, {file: "js/button_maker.js"});
                chrome.tabs.executeScript(tabId, {file: "js/bug_inject.js"});
            } else if (UrlChecker.isBugList(tab.url)) {
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
    switch (request.message) {
        case "bg.migrateBug":
            BugMigrator.bg_migrateBug(request.bugId, request.bugData);
            break;
    }
});

})();
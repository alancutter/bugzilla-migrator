// import url_checker.UrlChecker
// import bug_migrator.BugMigrator

(function(){

// Content script injects.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // Tab navigation events
    if (changeInfo.status === "loading") {
        if (isBugzilla(tab.url)) {
            // Show icon in search bar.
            chrome.pageAction.show(tabId);
            chrome.tabs.executeScript(tabId, {file: "js/email_finder.js"});

            if (isBug(tab.url)) {
                // Inject button onto Webkit bug.
                chrome.tabs.executeScript(tabId, {file: "js/bug_inject.js"});
            } else if (isBugList(tab.url)) {
                // Inject button onto search results.
                chrome.tabs.executeScript(tabId, {file: "js/buglist_inject.js"});
            }
        }
    }
});

// Popup icon clicked.
chrome.pageAction.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, "findEmail", function (email) {
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
        case "migrateBug":
            BugMigration.migrateBug(request.bugId, request.bugData);
            break;
    }
});

})();
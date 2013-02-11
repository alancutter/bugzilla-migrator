chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // Tab navigation events
    if (changeInfo.status === "loading") {
        if (isBugzilla(tab.url)) {
            // Show icon in search bar.
            chrome.pageAction.show(tabId);
        }
        if (isBug(tab.url)) {
            // Inject button onto Webkit bug.
            chrome.tabs.executeScript(tabId, {file: "js/bug_inject.js"});
        } else if (isBugList(tab.url)) === 0) {
            // Inject button onto search results.
            chrome.tabs.executeScript(tabId, {file: "js/buglist_inject.js"});
        }
    }
});

chrome.pageAction.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, "findEmail", function (email) {
        chrome.tabs.create({
            url: "html/migrate_bugs.html?email=" + email
        });
    });
});

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
});
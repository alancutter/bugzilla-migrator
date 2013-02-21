// from wk_bug_migrator import WkBugMigrator
// from id_storage import IdStorage
// from urls import Urls

(function(){

var broadcastPorts = [];

function broadcastMessage (payload) {
    for (var i = 0; i < broadcastPorts.length; i++) {
        broadcastPorts[i].postMessage(payload);
    }
}

function executeBugzillaScripts (tabId) {
    chrome.tabs.executeScript(tabId, {file: "js/template.js"});
    chrome.tabs.executeScript(tabId, {file: "js/xhr.js"});
    chrome.tabs.executeScript(tabId, {file: "js/html.js"});
    chrome.tabs.executeScript(tabId, {file: "js/id_storage.js"});
    chrome.tabs.executeScript(tabId, {file: "js/urls.js"});
    chrome.tabs.executeScript(tabId, {file: "js/cr_query.js"});
    chrome.tabs.executeScript(tabId, {file: "js/wk_login_checker.js"});
    chrome.tabs.executeScript(tabId, {file: "js/wk_bug_reader.js"});
    chrome.tabs.executeScript(tabId, {file: "js/wk_bug_button.js"});
}

function executeCrScripts (tabId) {
    chrome.tabs.executeScript(tabId, {file: "js/template.js"});
    chrome.tabs.executeScript(tabId, {file: "js/xhr.js"});
    chrome.tabs.executeScript(tabId, {file: "js/html.js"});
    chrome.tabs.executeScript(tabId, {file: "js/urls.js"});
    chrome.tabs.executeScript(tabId, {file: "js/id_storage.js"});
}

function showOptionsEditor () {
    // FIXME: Check that this feature is actually wanted then implement.
}

// Page loaded.
// FIXME: http://code.google.com/p/chromium/issues/detail?id=162543
//        Double event firing appears not to be resolved in stable yet.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // Tab navigation events
    if (changeInfo.status === "loading") {
        if (Urls.isWkBug(tab.url)) {
            // Inject button onto Webkit bug.
            executeBugzillaScripts(tabId);
            chrome.tabs.executeScript(tabId, {file: "js/wk_bug_inject.js"});
            // Show icon in search bar.
            chrome.pageAction.show(tabId);
        } else if (Urls.isWkBugList(tab.url)) {
            // Inject button onto search results.
            executeBugzillaScripts(tabId);
            chrome.tabs.executeScript(tabId, {file: "js/wk_buglist_inject.js"});
            // Show icon in search bar.
            chrome.pageAction.show(tabId);
        } else if (Urls.isCrBug(tab.url)) {
            // Inject migration detection script.
            executeCrScripts(tabId);
            chrome.tabs.executeScript(tabId, {file: "js/cr_bug_inject.js"});
        }
    }
});

// Popup icon clicked.
chrome.pageAction.onClicked.addListener(function (tab) {
    showOptionsEditor();
});

// Background message handling.
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("Message received by background:");
    console.log(request);
    switch (request.message) {
        case "bg.migrateWkBug":
            WkBugMigrator.bg.migrateWkBug(request.wkBugId, request.wkBugData);
            break;
        case "bg.broadcastMessage":
            broadcastMessage(request.payload);
            break;
        case "bg.broadcastMigration":
            broadcastMessage({
                message: "migration",
                wkBugId: request.wkBugId,
                crBugId: request.crBugId,
            });
            break;
    }
});

// Background connection requests.
chrome.extension.onConnect.addListener(function (port) {
    broadcastPorts.push(port);
    port.onDisconnect.addListener(function () {
        var i = broadcastPorts.indexOf(port);
        if (i >= 0) {
            broadcastPorts.splice(i);
        }
    });
});

})();

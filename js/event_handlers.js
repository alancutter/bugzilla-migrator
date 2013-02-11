chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (changeInfo.status == "loading") {
		if (tab.url.indexOf("https://bugs.webkit.org/") == 0) {
			chrome.pageAction.show(tabId);
		}
		if (tab.url.indexOf("https://bugs.webkit.org/show_bug") == 0) {
			chrome.tabs.executeScript(tabId, {file: "js/show_bug_inject.js"});
		} else if (tab.url.indexOf("https://bugs.webkit.org/buglist") == 0) {
			chrome.tabs.executeScript(tabId, {file: "js/buglist_inject.js"});
		}
	}
});

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
	new Notification(request).show();
});
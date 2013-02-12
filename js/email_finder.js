(function(){

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    // FIXME: Take this out of stub land.
    sendResponse("test@example.com")
});

})();
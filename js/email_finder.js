(function(){

// FIXME: Remove debug log.
console.log("chrome:");
console.log(chrome);

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    // FIXME: Implement this.
    sendResponse("test@example.com")
});

})();
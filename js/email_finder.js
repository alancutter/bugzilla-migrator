if (!EmailFinder) {
var EmailFinder = {};
(function(){

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.message) {
        case "cs.findEmail":
            // FIXME: Implement this.
            sendResponse("test@example.com");
            break;
    }
});

})();
}

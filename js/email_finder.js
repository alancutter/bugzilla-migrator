if (!EmailFinder) {
var EmailFinder = {};
(function(){

// FIXME: Remove debug log.
console.log("chrome:");
console.log(chrome);

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.message) {
        case "cs_findEmail":
            // FIXME: Implement this.
            sendResponse("test@example.com");
            break;
    }
});

})();
}

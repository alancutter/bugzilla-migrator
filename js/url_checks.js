function isBugzilla (url) {
    return url.indexOf("https://bugs.webkit.org/") === 0;
}

function isBug (url) {
    return url.indexOf("https://bugs.webkit.org/show_bug") === 0;
}

function isBugList (url) {
    return url.indexOf("https://bugs.webkit.org/buglist") === 0;
}

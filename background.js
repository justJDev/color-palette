chrome.browserAction.onClicked.addListener(tab => {
    chrome.tabs.executeScript(tab.ib, {
        file: "main.js"
    });
    chrome.tabs.insertCSS(tab.id, {
        file: "style.css"
    })
});

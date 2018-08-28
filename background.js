chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.tabs.executeScript(tab.ib, {
		file: 'jquery.js'
	});
	chrome.tabs.executeScript(tab.ib, {
		file: 'jquery-ui.js'
	});
	chrome.tabs.executeScript(tab.ib, {
		file: 'color-palette.js'
	});
});

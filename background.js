console.log("background.js is loaded");

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({"lastSource": ""});
    chrome.storage.sync.set({"lastResult": ""});
    chrome.storage.sync.set({"saveLastWord": true});
    chrome.storage.sync.set({"enterButton": false});
    chrome.storage.sync.set({"countSentences": true});
	
	chrome.contextMenus.create({
		"id": "translate",
		"title": "translate",
		"contexts": ["selection"]
	});
});

function translateAtContent(selection) {
	console.log("selection: " + selection);
    translate(selection).then(function(result) {
    	console.log("RESULT IS....", result);
    	let params = {
    		active: true,
    		currentWindow: true
    	}
    	chrome.tabs.query(params, function(tabs) {
    		let msg = {
    			source: selection,
    			result: result
    		};
    		chrome.tabs.sendMessage(tabs[0].id, msg);
    		console.log("sended message", msg);
    	});
	});
}

dbPromise.then(function() {
	chrome.contextMenus.onClicked.addListener(function(clickData) {
		if (clickData.menuItemId == "translate" && clickData.selectionText) {
			translateAtContent(clickData.selectionText);
		}
	});

	chrome.commands.onCommand.addListener(function (command) {
	    if (command === "translate") {
	    	chrome.tabs.executeScript({
	            code: 'window.getSelection().toString()',
	        }, function(selection) {
	        	translateAtContent(selection);
	        });
		}
	});
});
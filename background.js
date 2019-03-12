console.log("background.js is loaded");
dbPromise.then(function() {
	chrome.commands.onCommand.addListener(function (command) {
	    if (command === "translate") {
	    	chrome.tabs.executeScript({
	            code: 'window.getSelection().toString()',
	            allFrames: true,
	            matchAboutBlank: true
	        }, function (selection) {
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
		        }, function(error) {
		        	console.log(error);
		        });
	        });
		}
	});
});
chrome.commands.onCommand.addListener(function (command) {
    if (command === "translate") {
    	chrome.tabs.executeScript({
            code: 'window.getSelection().toString()',
            allFrames: true,
            matchAboutBlank: true
        }, function (selection) {
            console.log("selection: " + selection);
        	let params = {
        		active: true,
        		currentWindow: true
        	}
        	chrome.tabs.query(params, function(tabs) {
        		let msg = {txt: selection};
        		chrome.tabs.sendMessage(tabs[0].id, msg);
        		console.log("sended message", msg);
        	});
        });
	}
});

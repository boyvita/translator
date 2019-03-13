console.log("content.js is loaded");
chrome.extension.onMessage.addListener(function (message, sender, sendRequest) {
	alert(message.source + " - is translated and added to db");
	//let div = document.createElement('div');
	//...
});

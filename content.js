console.log("content.js is loaded");
chrome.extension.onMessage.addListener(function (message, sender, sendRequest) {
	alert(message.source + " " + message.result);
	//let div = document.createElement('div');
	//...
});

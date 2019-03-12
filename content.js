console.log("content.js is loaded");
chrome.extension.onMessage.addListener(function (message, sender, sendRequest) {
	alert(message.txt);
	//let div = document.createElement('div');
	//...
});

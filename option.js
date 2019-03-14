document.addEventListener("DOMContentLoaded", function() {
	console.log("dom is loaded");
	document.getElementById("clearHistory").addEventListener("click", function() {
		clearHistory();
	});
	
	let saveLastWord = document.getElementById("saveLastWord");
	let enterButton = document.getElementById("enterButton");

	chrome.storage.sync.get("saveLastWord", function(elem) {
		saveLastWord.checked = elem.saveLastWord;
	});
	saveLastWord.addEventListener("click", function() {
		chrome.storage.sync.set({"saveLastWord": saveLastWord.checked});
	});

	chrome.storage.sync.get("enterButton", function(elem) {
		enterButton.checked = elem.enterButton;
	});
	enterButton.addEventListener("click", function() {
		chrome.storage.sync.set({"enterButton": enterButton.checked});
	});

});

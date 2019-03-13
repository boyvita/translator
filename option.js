document.addEventListener("DOMContentLoaded", function() {
	console.log("dom is loaded");
	document.getElementById("clearHistory").addEventListener("click", function() {
		dbPromise().then(function() {
			
		});
	});
	
	let saveLastWord = document.getElementById("saveLastWord");
	let enterButton = document.getElementById("enterButton");
	let countSentences = document.getElementById("countSentences");


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

	chrome.storage.sync.get("countSentences", function(elem) {
		document.getElementById("countSentences").checked = elem.countSentences;
	});
	countSentences.addEventListener("click", function() {
		chrome.storage.sync.set({"countSentences": countSentences.checked});
	});
});

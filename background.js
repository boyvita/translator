function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
        console.log("window.getSelection");
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
        console.log("document.selection");
    }
    return text;
}

chrome.commands.onCommand.addListener(function (command) {
    if (command === "translate") {
    	chrome.tabs.executeScript({
            code: '(' + getSelectionText.toString() + ')()',
            allFrames: true,
            matchAboutBlank: true
        }, function (selection) {
            console.log("selection: " + selection);
        })


	} else if (command === "translate_save") {
        alert("translate_save: ");
    }
});
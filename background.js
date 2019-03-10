chrome.commands.onCommand.addListener(function (command) {
    if (command === "translate") {
        alert(window.getSelection().toString());
    } else if (command === "translate_save") {
        alert("translate_save: " + window.getSelection().toString());
    }
});
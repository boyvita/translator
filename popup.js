window.onload = function() {
    console.log("document is loaded");
    chrome.storage.sync.get("saveLastWord", function(elem) {
        if (elem.saveLastWord == true) {
            chrome.storage.sync.get(["lastSource", "lastResult"], function(elem) {
                document.getElementById("source").value = elem.lastSource;
                document.getElementById("result").value = elem.lastResult;
            });
        }
    });

    document.getElementById("getlist").addEventListener("click", function() {
        chrome.tabs.create({url: "list.html"});
    });

    document.getElementById("select").addEventListener("click", function() {
        chrome.tabs.executeScript( {
            code: "window.getSelection().toString();"
        }, function(selection) {
            document.getElementById('source').value = selection;
        });
    });
    function translateSource() {
        let source = document.getElementById("source").value;
        translate(source).then(function(result) {
            document.getElementById("result").value = result;
        });
    }
    chrome.storage.sync.get("enterButton", function(elem) {
        if (elem.enterButton == true) {
            document.getElementById('source').addEventListener("keydown", function(e) {
                if(e.keyCode == 13) {
                    translateSource();
                }
            });
        }
    });
    document.getElementById("translate").addEventListener("click", function() {
        translateSource();        
    });
    document.getElementById("ya").addEventListener("click", function() {
        chrome.tabs.create({url: "http://translate.yandex.com/"});
    });
     
};

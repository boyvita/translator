dbPromise.then(function() {    
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
    document.getElementById("translate").addEventListener("click", function() {
        let source = document.getElementById("source").value;
        translate(source).then(function(result) {
            document.getElementById("result").value = result;
        });
    });
});
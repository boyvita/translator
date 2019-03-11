let errorfunc = function(e) {
    console.log('Error', e.target.error.name, e.target.errorCode)
}



window.addEventListener("DOMContentLoaded", function() {
    
    document.getElementById("getlist").addEventListener("click", function() {
        chrome.tabs.create({url: "list.html"});
        e.preventDefault();
    });

    document.getElementById("select").addEventListener("click", function() {
        chrome.tabs.executeScript( {
            code: "window.getSelection().toString();"
        }, function(selection) {
            document.getElementById('source').value = selection;
        });
    });




    //check for support
    if (!('indexedDB' in window)) {
        console.log('This browser doesn\'t support IndexedDB');
        alert();
    }

    //indexedDB.deleteDatabase("store");
    var db, 
        openRequest = window.indexedDB.open("store", 1),
        index;

    openRequest.onupgradeneeded = function(e) {
        db = e.target.result;
        if (!db.objectStoreNames.contains("wordOS")) {
            wordsOS = db.createObjectStore('wordsOS', {keyPath: "source"});
        }
        console.log('Created wordsOS');
        wordsOS.createIndex("sourceIndex", "source", {unique: false});
        wordsOS.createIndex("countIndex", "count", {unique: false});
    } 


    function addWord() {   
        let tx = db.transaction(["wordsOS"], "readwrite");
        let store = tx.objectStore("wordsOS");
        let source = document.getElementById("source").value;
        let result = document.getElementById("result").value;
        
        let item = {
            source: source,
            result: result,
            count: 1,
            date: new Date().getTime()
        };

        let index = store.index("sourceIndex");
        var querry = index.get(source);
        querry.onsuccess = function() {
            let newItem = querry.result;
            if (newItem == null) {
                newItem = item;
                console.log("there isn't this source, adding new item");
            } else {
                newItem.count++;
                console.log("finded this source, changing new item", newItem);
            }
            let request = store.put(newItem);
            request.onsuccess = function(e) {
                console.log("added or changed item: ", newItem);
            }
            request.onerror = errorfunc;
            tx.oncomplete = function() {
                console.log('Woot! Adding or changing item is finished');
            }
        }        
        querry.onerror = errorfunc;
    };
       

    function getList() {   
        var tx = db.transaction(["wordsOS"], "readwrite");
        var store = tx.objectStore("wordsOS");
        
        var index = store.index("countIndex");

        index.openCursor(null, "prev").onsuccess = function(e) {    
            let cursor = event.target.result;
            if (cursor) {
                console.log(cursor.value);
                cursor.continue();
            }
        } 
        
        tx.oncomplete = function() {
            console.log('Woot! getting list is finished');
        }
    };
    
    openRequest.onerror = errorfunc;

    openRequest.onsuccess = function(e) {
        console.log('Woot! Did it');
        db = e.target.result;
        document.getElementById("translate").addEventListener("click", function() {
            let url = "https://translate.yandex.net/api/v1.5/tr.json/translate";
            let keyAPI = "trnsl.1.1.20190305T001633Z.4a974d95385f5059.a4f67ebbbd3971a1ae2c8c7d5a487b3d9f9de7c7";
            let request = new XMLHttpRequest();   
            let source = encodeURIComponent(document.getElementById("source").value);
            let data = url+"?key="+keyAPI+"&text="+source+"&lang=ru&format=plain";
            console.log(data);
            request.open('GET', data, true);
            request.send();
            request.onload = function() {
                let data = JSON.parse(request.responseText);
                document.getElementById("result").value = data.text;
                addWord();
            }
            e.preventDefault();
        });
       
    }
});

console.log("translator.js is loaded");

var db;
var errorfunc = function(e) {
    console.log('Error', e.target.error.name, e.target.errorCode)
};

var dbPromise = new Promise(function(resolve, reject) {
    document.addEventListener("DOMContentLoaded", function() {
        //indexedDB.deleteDatabase("store");
        var openRequest = window.indexedDB.open("store", 1);

        openRequest.onupgradeneeded = function(e) {
            db = e.target.result;
            if (!db.objectStoreNames.contains("wordOS")) {
                wordsOS = db.createObjectStore('wordsOS', {keyPath: "source"});
            }
            console.log('Created wordsOS');
            wordsOS.createIndex("sourceIndex", "source", {unique: false});
            wordsOS.createIndex("countIndex", "count", {unique: false});
        }

        openRequest.onsuccess = function(e) {
            console.log('Woot! Did it');
            db = e.target.result;
            resolve();
        }
    }, false);
});

function addWord(source, result) {   
    let tx = db.transaction(["wordsOS"], "readwrite");
    let store = tx.objectStore("wordsOS");
    
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


function translate(source) {
    return new Promise(function(resolve, reject) {
        let url = "https://translate.yandex.net/api/v1.5/tr.json/translate";
        let keyAPI = "trnsl.1.1.20190305T001633Z.4a974d95385f5059.a4f67ebbbd3971a1ae2c8c7d5a487b3d9f9de7c7";
        let xhr = new XMLHttpRequest();   
        let encodeSource = encodeURIComponent(source);
        let data = url+"?key="+keyAPI+"&text="+encodeSource+"&lang=ru&format=plain";
        console.log(data);
        xhr.open('GET', data, true);
        xhr.onload = function() {
            console.log("xhr is loaded");
            if (xhr.status == 200) {
                let data = JSON.parse(xhr.responseText);
                console.log(data);
                addWord(source, data.text);
                resolve(data.text);
            } 
        }
        xhr.onerror = function() {
            reject(new Error("network error"));
        }
        xhr.send();
    });   
}
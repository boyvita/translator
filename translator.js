console.log("translator.js is loaded");

let db;
let errorfunc = function(e) {
    console.log('Error', e.target.error.name, e.target.errorCode)
};

let dbPromise = new Promise(function(resolve, reject) {
    let openRequest = window.indexedDB.open("store", 1);
    openRequest.onupgradeneeded = function(e) {
        debugger;
        db = e.target.result;
        if (!db.objectStoreNames.contains("wordsOS")) {
            let wordsOS = db.createObjectStore('wordsOS', {autoIncrement: true});
            wordsOS.createIndex("sourceIndex", "source", {unique: false});
            wordsOS.createIndex("dateIndex", "date", {unique: false});
            console.log("Created wordsOS and indexes");
        }
    };

    openRequest.onsuccess = function(e) {
        db = e.target.result;
        console.log('db is gotten');
        resolve();
    }
});

function addWord(source, result) {   
    console.log(source, "translated to", result);
    chrome.storage.sync.set({"lastSource": source});
    chrome.storage.sync.set({"lastResult": result});
    dbPromise.then(function() {
        let tx = db.transaction("wordsOS", "readwrite");
        let wordsOS = tx.objectStore("wordsOS");
        
        let item = {
            source: source,
            result: result,
            date: new Date().getTime()
        };

        let request = wordsOS.add(item);
        request.onsuccess = function(e) {
            console.log("added or changed item: ", item);
        }
        request.onerror = errorfunc;
        tx.oncomplete = function() {
            console.log('tx complete');
        }
        return tx.complete;
    });
}

function translate(source) {
   return new Promise(function(resolve, reject) {
        dbPromise.then(function() {
            console.log("after promise");
            let url = "https://translate.yandex.net/api/v1.5/tr.json/translate";
            let keyAPI = "trnsl.1.1.20190305T001633Z.4a974d95385f5059.a4f67ebbbd3971a1ae2c8c7d5a487b3d9f9de7c7";
            let xhr = new XMLHttpRequest();   
            let encodeSource = encodeURIComponent(source);
            let data = url+"?key="+keyAPI+"&text="+encodeSource+"&lang=ru&format=plain";
            xhr.open('GET', data, true);
            xhr.onload = function() {
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
    });
}

function getList(callback) {
    dbPromise.then(function() {
        let tx = db.transaction(["wordsOS"], "readonly");
        let wordsOS = tx.objectStore("wordsOS");
        let index = wordsOS.index("dateIndex");
        index.openCursor(null, "prev").onsuccess = function(e) {    
            let cursor = event.target.result;
            if (cursor) {
                callback(cursor.value);
                cursor.continue();
            }
        } 
        tx.oncomplete = function() {
            console.log('Woot! getting list is finished');
        }
    });
}
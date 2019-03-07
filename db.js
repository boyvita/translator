let errorfunc = function(e) {
    console.log('Error', e.target.error.name, e.target.errorCode)
}

//check for support
if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
    alert();
}

indexedDB.deleteDatabase("store");
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
} 


openRequest.onerror = errorfunc;

openRequest.onsuccess = function(e) {
    console.log('Woot! Did it');
    db = e.target.result;
    document.getElementById("translate").addEventListener("click", function() {
        addWord();
        e.preventDefault();
    });
    document.getElementById("getlist").addEventListener("click", function() {
        getList();
        e.preventDefault();
    });
}

function addWord() {   
    var tx = db.transaction(["wordsOS"], "readwrite");
    var store = tx.objectStore("wordsOS");
    var source = document.getElementById("source").value;
    var result = document.getElementById("result").value;
    
    var item = {
        source: source,
        result: result,
        count: 1,
        date: new Date().getTime()
    };
    var request = store.add(item);
    request.onerror = errorfunc;
    request.onsuccess = function(e) {
        console.log("added", item);
    }
    var index = store.index("sourceIndex");
    var querry = index.get("lol");
    querry.onerror = errorfunc;
    querry.onsuccess = function() {
        console.log(querry.result);
    }
    
    tx.oncomplete = function() {
        console.log('Woot! added 2 items');
    }
};

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
    let request = store.add(item);
    request.onerror = errorfunc;
    request.onsuccess = function(e) {
        console.log("added", item);
    }
    tx.oncomplete = function() {
        console.log('Woot! Adding of item is finished');
    }
};


function getList() {   
    var tx = db.transaction(["wordsOS"], "readwrite");
    var store = tx.objectStore("wordsOS");
    
    var index = store.index("sourceIndex");
    var querry = index.getAll();
    querry.onerror = errorfunc;
    querry.onsuccess = function() {
        console.log(querry.result);
    }
    
    tx.oncomplete = function() {
        console.log('Woot! getting list is finished');
    }
};
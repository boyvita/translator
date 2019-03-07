//check for support
if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
    alert();
}


let errorfunc = function(e) {
    console.log('Error', e.target.error.name, e.target.errorCode)
}
let request = indexedDB.deleteDatabase("store");
request = window.indexedDB.open("store", 1);
let db,
    tx,
    store,
    indexed;

request.onupgradeneeded = function(e) {
    let db = request.result,
        wordsOS = db.createObjectStore('wordsOS', {keyPath: "source"});
    console.log('Created wordsOS');
    index = wordsOS.createIndex("sourceIndex", "source", {unique: false});
} 

request.onerror = errorfunc;

request.onsuccess = function(e) {
    console.log('Woot! Did it');
    db = request.result;
    tx = db.transaction("wordsOS", "readwrite");
    store = tx.objectStore("wordsOS");
    index = store.index("sourceIndex");
    
    db.onerror = errorfunc;

    var item1 = {
        source: 'sandwich',
        result: 'fgd',
        count: 1,
        date: new Date().getTime()
    };
    var item2 = {
        source: 'glass',
        result: 'sdfg',
        count: 1,
        date: new Date().getTime()
    };
    store.add(item1);
    store.add(item2);
    let q1 = index.get("sandwich");
    q1.onsuccess = function() {
        console.log(q1.result);
    }
    
    tx.oncomplete = function() {
        console.log('Woot! added 2 items');
        db.close();
    }
};
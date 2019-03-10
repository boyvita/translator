let errorfunc = function(e) {
    console.log('Error', e.target.error.name, e.target.errorCode)
}

window.addEventListener("DOMContentLoaded", function() {
	var db, 
        openRequest = window.indexedDB.open("store", 1),
        index;
    openRequest.onsuccess = function(e) {
        db = e.target.result;
        getList();
    }
    openRequest.onerror = errorfunc;
    function getList() {   
        var tx = db.transaction(["wordsOS"], "readwrite");
        var store = tx.objectStore("wordsOS");
        
        var index = store.index("countIndex");

        index.openCursor(null, "prev").onsuccess = function(e) {    
            let cursor = event.target.result;
            if (cursor) {
            	let div = document.createElement("div");
            	let item = cursor.value
                div.textContent = item.source+" "+item.result+" "+item.count;
                document.body.appendChild(div);
                cursor.continue();
            }
        } 
        
        tx.oncomplete = function() {
            console.log('Woot! getting list is finished');
        }
    }
    
});

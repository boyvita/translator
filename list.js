dbPromise.then(function() {
    getList(function(value) {
        let div = document.createElement("div");
        let item = value
        div.textContent = item.source+" "+item.result+" "+item.count;
        document.body.appendChild(div);
    })
});
    
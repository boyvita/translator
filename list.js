getList(function(value) {
    let div = document.createElement("div");
    let item = value
    div.textContent = item.source+" "+item.result;//+" "+item.date;
    document.body.appendChild(div);
});
    
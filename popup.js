window.addEventListener("DOMContentLoaded", function() {
    var btn = document.getElementById("button");
    var ru = document.getElementById("result");
    btn.addEventListener("click", function() {
        var request = new XMLHttpRequest();
        var txt = document.getElementById("source").value;
        var key = "trnsl.1.1.20190305T001633Z.4a974d95385f5059.a4f67ebbbd3971a1ae2c8c7d5a487b3d9f9de7c7";
        var url = "https://translate.yandex.net/api/v1.5/tr.json/translate?key="+key+"&text="+txt+"&lang=en-ru&format=plain&options=1"

        request.open('GET', url, true);
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                var data = JSON.parse(request.responseText);
                ru.value = data.text;
            }
        };
        request.send();
    });
});

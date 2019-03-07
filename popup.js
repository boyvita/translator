window.addEventListener("DOMContentLoaded", function() {
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

        }
    });
});

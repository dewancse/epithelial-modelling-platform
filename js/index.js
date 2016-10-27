/**
 * Created by dsar941 on 9/8/2016.
 */

var SMTPMR = function () {

    var endpoint = "https://models.physiomeproject.org/pmr2_virtuoso_search";
    var query = 'SELECT ?id WHERE { ?id  <http://biomodels.net/biology-qualifiers/isVersionOf> ' +
        '<http://identifiers.org/go/GO:0005272> }';

    var item = [];
    var chkBox, button;

    var sparqlQueryJson = function (queryStr, endpoint) {

        var xmlhttp = new XMLHttpRequest();

        xmlhttp.open('POST', endpoint, true);
        xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xmlhttp.setRequestHeader("Accept", "application/sparql-results+json");

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                myCallback(xmlhttp.responseText);
            }
        }

        // Send the query to the endpoint.
        xmlhttp.send(queryStr);
    };

    var myCallback = function (str) {
        // Convert result to JSON
        var jsonObj = JSON.parse(str);

        var workspaceList = document.getElementById("workspacelist");

        for (var i = 0; i < jsonObj.results.bindings.length; i++) {

            // id
            var idstr = jsonObj.results.bindings[i].id.value;
            var index = idstr.search(".cellml");
            var wname = idstr.slice(0, index);

            var workspaceurl = "https://models.physiomeproject.org/workspace" + "/" + wname + "/" + "@@file" + "/" + "HEAD"
                + "/" + jsonObj.results.bindings[i].id.value;

            item[i] = document.createElement("label");
            item[i].id = idstr;
            item[i].innerHTML = '<input id="' + item[i].id + '" type="checkbox" value="" class="checkbox-inline"> ';
            item[i].innerHTML += '<a href=' + workspaceurl + ' + target=_blank>' + wname + " / " + idstr + '</a></label>';

            workspaceList.appendChild(item[i]);
            workspaceList.appendChild(document.createElement("br"));
        }
    };

    var rawQueryJson = function (itemHtml, vEndPoint, id) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', vEndPoint, true);

        xmlhttp.onreadystatechange = function () {

            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var text = xmlhttp.responseText;
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(text, "text/xml");

                console.log(itemHtml.firstChild);
                console.log(itemHtml);

                // Look up by variable tag
                for (var i = 0; i < xmlDoc.getElementsByTagName("variable").length; i++) {
                    if (xmlDoc.getElementsByTagName("variable")[i].getAttribute("cmeta:id") == id) {
                        itemHtml.innerHTML += '<hr>';
                        itemHtml.innerHTML += id + '<br>';
                        itemHtml.innerHTML += xmlDoc.getElementsByTagName("variable")[i].getAttribute("name") + '<br>';
                        itemHtml.innerHTML += '<hr>';
                    }
                }
            }
        }
        xmlhttp.send();
    };

    document.addEventListener('click', function (event) {
        if (event.srcElement.className == "checkbox-inline") {
            var idstr = event.srcElement.id;
            var n = idstr.search("#");
            var idn = idstr.slice(n + 1, idstr.length);

            // id
            var index = idstr.search(".cellml");
            var wname = idstr.slice(0, index);

            var raw = "https://models.physiomeproject.org/workspace" + "/" + wname + "/" + "rawfile" + "/" + "HEAD"
                + "/" + idstr;

            rawQueryJson(event.srcElement.parentElement, raw, idn);
        }
    });

    $(document).ready(function () {

        sparqlQueryJson(query, endpoint);

    });
}();
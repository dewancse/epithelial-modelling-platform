/**
 * Created by dsar941 on 9/8/2016.
 */
var endpoint = "https://models.physiomeproject.org/pmr2_virtuoso_search";

var query = 'SELECT ?id WHERE { ?id  <http://biomodels.net/biology-qualifiers/isVersionOf> ' +
    '<http://identifiers.org/go/GO:0005272> }';

// Make the query.
sparqlQueryJson(query, endpoint);

function sparqlQueryJson(queryStr, endpoint) {

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.open('POST', endpoint, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.setRequestHeader("Accept", "application/sparql-results+json");

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            myCallback(xmlhttp.responseText);
        } else {
            alert("SPARQL error: " + xmlhttp.status + " " + xmlhttp.responseText);
        }
    }

    // Send the query to the endpoint.
    xmlhttp.send(queryStr);
};

function myCallback(str) {

    // Convert result to JSON
    var jsonObj = eval('(' + str + ')');

    var workspaceList = document.getElementById("workspaceList");
    var metadataList = document.getElementById("metadataList");
    var label = [];
    for (var i = 0; i < jsonObj.results.bindings.length; i++) {

        // id
        var idstr = jsonObj.results.bindings[i].id.value;
        var index = idstr.search(".cellml");
        var wname = idstr.slice(0, index);

        var workspaceurl = "https://models.physiomeproject.org/workspace" + "/" + wname + "/" + "@@file" + "/" + "HEAD"
            + "/" + jsonObj.results.bindings[i].id.value;

        label[i] = document.createElement("label");
        label[i].innerHTML += '<a href=workspaceurl">' + wname + "/" + idstr + '</a>';
        //label[i].innerHTML += workspaceurl;
        workspaceList.appendChild(label[i]);
        workspaceList.appendChild(document.createElement("br"));

        // id without # symbol
        if (wname ==  "riemer_sobie_tung_1998") {
            var n = idstr.search("#");
            var idn = idstr.slice(n + 1, idstr.length);

            var label = [];
            label[i] = document.createElement("label");
            var raw = "https://models.physiomeproject.org/workspace" + "/" + wname + "/" + "rawfile" + "/" + "HEAD"
                + "/" + jsonObj.results.bindings[i].id.value;
            rawQueryJson(metadataList, label[i], raw, idn);
        }
    }
}

function rawQueryJson(metadataList, label, vEndPoint, id) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', vEndPoint, true);

    xmlhttp.onreadystatechange = function () {

        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var text = xmlhttp.responseText;
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(text, "text/xml");

            for (var i = 0; i < xmlDoc.getElementsByTagName("variable").length; i++) {
                if (xmlDoc.getElementsByTagName("variable")[i].getAttribute("cmeta:id") == id) {
                    label.innerHTML += xmlDoc.getElementsByTagName("variable")[i].getAttribute("name");
                    metadataList.appendChild(label);
                    metadataList.appendChild(document.createElement("br"));
                }
            }
        }
    }
    xmlhttp.send();
};
/**
 * Created by dsar941 on 9/8/2016.
 */
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
    var jsonObj = eval('(' + str + ')');

    var workspaceList = document.getElementById("workspaceList");
    var list = document.createElement("ul");

    for (var i = 0; i < jsonObj.results.bindings.length; i++) {

        // id
        var idstr = jsonObj.results.bindings[i].id.value;
        var index = idstr.search(".cellml");
        var wname = idstr.slice(0, index);

        var workspaceurl = "https://models.physiomeproject.org/workspace" + "/" + wname + "/" + "@@file" + "/" + "HEAD"
            + "/" + jsonObj.results.bindings[i].id.value;

        item[i] = document.createElement("li");
        item[i].id = idstr;
        item[i].innerHTML = '<a href=' + workspaceurl + ' + target=_blank>' + wname + " / " + idstr + '</a><br>';
        item[i].innerHTML += '<input id="item[i]" type="checkbox" value="item[i]"><label>&nbsp;&nbsp;Annotations</label>';

        workspaceList.appendChild(list.appendChild(item[i]));
        workspaceList.appendChild(document.createElement("br"));
    }
};

$("#calculate").click(function () {
    chkBox = $('input');
    for (var i = 0; i < item.length; i++) {
        if (chkBox[i].checked) {
            var idstr = item[i].id;
            var n = idstr.search("#");
            var idn = idstr.slice(n + 1, idstr.length);

            // id
            var index = idstr.search(".cellml");
            var wname = idstr.slice(0, index);

            var raw = "https://models.physiomeproject.org/workspace" + "/" + wname + "/" + "rawfile" + "/" + "HEAD"
                + "/" + idstr;
            rawQueryJson(raw, idn);
        }
    }
});

var rawQueryJson = function (vEndPoint, id) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', vEndPoint, true);

    xmlhttp.onreadystatechange = function () {

        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var text = xmlhttp.responseText;
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(text, "text/xml");

            for (var i = 0; i < xmlDoc.getElementsByTagName("variable").length; i++) {
                if (xmlDoc.getElementsByTagName("variable")[i].getAttribute("cmeta:id") == id) {
                    console.log(xmlDoc.getElementsByTagName("variable")[i].getAttribute("name"));
                }
            }
        }
    }
    xmlhttp.send();
};

$(document).ready(function () {

    // Make the query.
    sparqlQueryJson(query, endpoint);
});
/**
 * Created by dsar941 on 10/5/2016.
 */
var endpoint = "https://models.physiomeproject.org/pmr2_virtuoso_search";
var query = 'PREFIX dcterms: <http://purl.org/dc/terms/> ' +
    'SELECT ?sub ?obj WHERE { ?sub dcterms:Species ?obj}';

var test = function () {
    var t = document.getElementById("workspacelist");
    var item = ["one", "two", "three", "four", "five"];
    var label = [];
    for (var i = 0; i < item.length; i++) {
        label[i] = document.createElement('label');
        label[i].className = "checkbox-inline";
        label[i].innerHTML = '<input id="item[i]" type="checkbox" value="item[i]">' + item[i] + '</label>';

        t.appendChild(label[i]);
        t.appendChild(document.createElement("br"));
    }
};

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

    console.log(jsonObj);
    console.log(jsonObj.head.vars);
    console.log(jsonObj.results.bindings[0].sub.value);
    console.log(jsonObj.results.bindings[0].obj.value);


    /****************** Fix this table *********************/
    var workspaceList = document.getElementById("workspacelist");
    var table = document.createElement("table");
    table.className = "table";

    var thead = document.createElement("thead");
    var tr = document.createElement("tr");
    for (var i = 0; i < jsonObj.head.vars.length; i++) {
        var th = document.createElement("th");
        th.appendChild(document.createTextNode(jsonObj.head.vars[i]));
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    var tr = document.createElement("tr");
    for (var i = 0; i < jsonObj.results.bindings.length; i++) {
        var td = document.createElement("td");
        td.appendChild(document.createTextNode(jsonObj.results.bindings[i].sub.value));
        //td.appendChild(document.createTextNode(jsonObj.results.bindings[i].obj.value));
        tr.appendChild(td);
    }
    tbody.appendChild(tr);
    table.appendChild(tbody);

    workspaceList.appendChild(table);
}

$(document).ready(function () {
    //test();
    sparqlQueryJson(query, endpoint);
});
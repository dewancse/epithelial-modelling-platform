/**
 * Created by dsar941 on 10/5/2016.
 */
var endpoint = "https://models.physiomeproject.org/pmr2_virtuoso_search";
var query = 'PREFIX dcterms: <http://purl.org/dc/terms/> ' +
    'SELECT ?subject ?Species ?subject2 ?Gene ' +
    'WHERE { ' +
    '?subject dcterms:Species ?Species .' +
    '?subject2 dcterms:Gene ?Gene .' +
    '}';

var chkBox;
var label = [];

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

    var workspaceList = document.getElementById("workspacelist");
    var table = document.createElement("table");
    table.className = "table";

    var thead = document.createElement("thead");
    var tr = document.createElement("tr");
    for (var i = 0; i < jsonObj.head.vars.length; i++) {
        if (i == 0) {
            var th = document.createElement("th");
            th.appendChild(document.createTextNode(""));
            tr.appendChild(th);
        }

        var th = document.createElement("th");
        th.appendChild(document.createTextNode(jsonObj.head.vars[i]));
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    for (var i = 0; i < jsonObj.results.bindings.length; i++) {

        var idstr = jsonObj.results.bindings[i].subject.value;
        console.log(idstr);


        var tr = document.createElement("tr");

        var td = document.createElement("td");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");
        var td4 = document.createElement("td");

        var id = jsonObj.results.bindings[i].subject.value;
        label[i] = document.createElement('label');
        label[i].className = "checkbox-inline";
        label[i].innerHTML = '<input id="' + id + '" type="checkbox" value="' + id + '"></label>';

        td.appendChild(label[i]);
        td1.appendChild(document.createTextNode(jsonObj.results.bindings[i].subject.value));
        td2.appendChild(document.createTextNode(jsonObj.results.bindings[i].Species.value));
        td3.appendChild(document.createTextNode(jsonObj.results.bindings[i].subject2.value));
        td4.appendChild(document.createTextNode(jsonObj.results.bindings[i].Gene.value));

        tr.appendChild(td);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);

        tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    workspaceList.appendChild(table);
}

$("#ClickMe").click(function () {
    chkBox = $('input');
    for (var i = 0; i < label.length; i++) {
        if (chkBox[i].checked) {
            var id = chkBox[i].id;
            console.log(id);
        }
    }
});

var searchTxt = document.getElementById("searchTxt");
$("#searchBtn").click(function () {
    console.log(searchTxt.value);
});

$(document).ready(function () {
    //test();
    sparqlQueryJson(query, endpoint);
});
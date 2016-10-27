/**
 * Created by dsar941 on 10/5/2016.
 */

var search = function () {

    var endpoint = "https://models.physiomeproject.org/pmr2_virtuoso_search";

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

        var workspaceList = document.getElementById("workspacelist");

        if (jsonObj.results.bindings.length == 0) {
            workspaceList.innerHTML = "No items matching your search terms.";
            return;
        }

        // Empty space for the new search result
        workspaceList.innerHTML = "";

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

            var tr = document.createElement("tr");

            var td = document.createElement("td");
            var td1 = document.createElement("td");

            var id = jsonObj.results.bindings[i].name.value;
            label[i] = document.createElement('label');
            label[i].innerHTML = '<input id="' + id + '" type="checkbox" value="' + id + '" class="checkbox-inline"></label>';

            td.appendChild(label[i]);
            td1.appendChild(document.createTextNode(jsonObj.results.bindings[i].name.value));

            tr.appendChild(td);
            tr.appendChild(td1);

            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        workspaceList.appendChild(table);
    }
    
    document.addEventListener('click', function (event) {
        if (event.srcElement.className == "checkbox-inline") {
            var id = event.srcElement.id;
            console.log(event.srcElement);
            console.log(event.srcElement.parentElement);
        }
    });

    $(document).ready(function () {
        document.addEventListener('keydown', function (event) {
            if (event.key == 'Enter') {
                var searchTxt = document.getElementById("searchTxt").value;
                var query = 'SELECT ?name WHERE { ?name <http://www.w3.org/2001/vcard-rdf/3.0#Family> "' + searchTxt + '" }';
                sparqlQueryJson(query, endpoint);
            }
        });
    });
}();
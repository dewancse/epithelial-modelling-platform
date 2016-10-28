/**
 * Created by dsar941 on 10/5/2016.
 */

(function () {
    'use strict';

    var endpoint = "https://models.physiomeproject.org/pmr2_virtuoso_search";
    var query = 'PREFIX dcterms: <http://purl.org/dc/terms/> ' +
        'SELECT ?subject ?Species ?subject2 ?Gene ' +
        'WHERE { ' +
        '?subject dcterms:Species ?Species .' +
        '?subject2 dcterms:Gene ?Gene .' +
        '}';

    var label = [];

    var sampleTable = function (jsonObj) {

        var workspaceList = document.getElementById("workspacelist");
        var table = document.createElement("table");
        table.className = "table";

        // Table header
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

        // Table body
        var tbody = document.createElement("tbody");
        for (var i = 0; i < jsonObj.results.bindings.length; i++) {

            var tr = document.createElement("tr");

            var td = document.createElement("td");
            var td1 = document.createElement("td");
            var td2 = document.createElement("td");
            var td3 = document.createElement("td");
            var td4 = document.createElement("td");

            var id = jsonObj.results.bindings[i].subject.value;
            label[i] = document.createElement('label');
            label[i].innerHTML = '<input id="' + id + '" type="checkbox" value="' + id + '" class="checkbox-inline"></label>';

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

    $(document).ready(function () {

        $ajaxUtils.sendPostRequest(endpoint, query, sampleTable, true);

    });

})();
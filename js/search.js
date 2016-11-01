/**
 * Created by dsar941 on 10/5/2016.
 */

(function (global) {
    'use strict';

    var endpoint = "https://models.physiomeproject.org/pmr2_virtuoso_search";
    var label = [];

    var modelHtml = "../snippets/model.html";

    // Set up a namespace for our utility
    var searchUtils = {};

    // Convenience function for inserting innerHTML for 'select'
    var insertHtml = function (selector, html) {
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    // Show loading icon inside element identified by 'selector'.
    var showLoading = function (selector) {
        var html = "<div class='text-center'>";
        html += "<img src='../images/ajax-loader.gif'></div>";
        insertHtml(selector, html);
    };

    searchUtils.searchList = function (jsonObj) {

        var workspaceList = document.getElementById("workspacelist");

        // Search result does not match
        if (jsonObj.results.bindings.length == 0) {
            workspaceList.innerHTML = "No items matching your search terms.";
            return;
        }

        // Make empty space for new search result
        workspaceList.innerHTML = "";

        // Dynamic table
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

            var td1 = document.createElement("td");
            var td2 = document.createElement("td");

            var id = jsonObj.results.bindings[i].name.value;
            label[i] = document.createElement('label');
            label[i].innerHTML = '<input id="' + id + '" type="checkbox" value="' + id + '" class="checkbox-inline"></label>';

            td1.appendChild(label[i]);
            td2.appendChild(document.createTextNode(jsonObj.results.bindings[i].name.value));

            tr.appendChild(td1);
            tr.appendChild(td2);

            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        workspaceList.appendChild(table);
    }

    function buildModelHtml(str) {

        console.log(str);

        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(str, "text/xml");

        var vHtml = event.srcElement;

        console.log(xmlDoc);


        // Look up inside div tag
        for (var i = 0; i < xmlDoc.getElementsByTagName("div").length; i++) {
            if (xmlDoc.getElementsByTagName("div")[i].getAttribute("id") == "workspacelist") {
                console.log("Inside Div");
                vHtml.innerHTML += '<hr>';
                vHtml.innerHTML += id + '<br>';
                vHtml.innerHTML += '<hr>';

            }
        }
    }

    $("#modelBtn").click(function () {
        var chkBox = $('input');
        for (var i = 0; i < label.length; i++) {
            if (chkBox[i].checked) {
                $ajaxUtils.sendGetRequest(modelHtml, buildModelHtml, false);
            }
        }
    });

    $(document).ready(function () {
        document.addEventListener('keydown', function (event) {
            if (event.key == 'Enter') {
                var searchTxt = document.getElementById("searchTxt").value;
                var query = 'SELECT ?name WHERE { ?name <http://www.w3.org/2001/vcard-rdf/3.0#Family> "' + searchTxt + '" }';

                $ajaxUtils.sendPostRequest(endpoint, query, searchUtils.searchList, true);
            }
        });
    });

    // Expose utility to the global object
    global.$searchUtils = searchUtils;

})(window);

///////////////////////////////////////////////////////////////
// Idea is to find the model name of the searched item and then
// in the 2nd POST call list the rdf indexed information
///////////////////////////////////////////////////////////////

//var query = 'SELECT ?Model WHERE { ?Model <http://purl.org/dc/terms/Protein> "Sodium/hydrogen exchanger 3" }';
//
//// 1ST
//$ajaxUtils.sendPostRequest(
//    endpoint,
//    query,
//    function (jsonObj) {
//        console.log(jsonObj);
//
//        var model = jsonObj.results.bindings[0].Model.value;
//        var query = 'SELECT ?Species WHERE { <' + model + '> <http://purl.org/dc/terms/Species> ?Species }';
//
//        // 2ND
//        $ajaxUtils.sendPostRequest(
//            endpoint,
//            query,
//            function (jsonObj) {
//                console.log(jsonObj);
//
//                var Species = jsonObj.results.bindings[0].Species.value;
//                var query = 'SELECT ?Model WHERE { ?Model <http://purl.org/dc/terms/Species> "' + Species + '" }';
//
//                // 3RD
//                $ajaxUtils.sendPostRequest(
//                    endpoint,
//                    query,
//                    function (jsonObj) {
//                        console.log(jsonObj);
//                    },
//                    true);
//            },
//            true);
//    },
//    true);

/*
 PREFIX dcterms: <http://purl.org/dc/terms/>
 PREFIX bqmodel: <http://biomodels.net/model-qualifiers/>
 PREFIX ro: <http://purl.obolibrary.org/obo/ro.owl#>
 PREFIX vCard: <http://www.w3.org/2001/vcard-rdf/3.0#>

 SELECT ?Title ?Author ?Protein ?Species ?Gene ?Located_in ?DOI
 WHERE {
 <weinstein_1995.cellml#title> dcterms:title ?Title .
 <weinstein_1995.cellml#author1VcardN> vCard:FN ?Author .
 <weinstein_1995.cellml#UniProtKB> dcterms:Protein ?Protein .
 <weinstein_1995.cellml#UniProtKB> dcterms:Species ?Species .
 <weinstein_1995.cellml#UniProtKB> dcterms:Gene ?Gene .
 <weinstein_1995.cellml#located_in> ro:located_in ?Located_in .
 <weinstein_1995.cellml#DOI> bqmodel:isDescribedBy ?DOI .
 }
 */

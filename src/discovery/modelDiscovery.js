/**
 * Created by dsar941 on 5/8/2017.
 */
var endpoint = require("../index.js").endpoint;
var searchHtml = require("../index.js").searchHtml;
var table = require("../index.js").table;
var findActiveItem = require("../utils/misc.js").findActiveItem;
var switchListItemToActive = require("../utils/misc.js").switchListItemToActive;
var insertHtml = require("../utils/misc.js").insertHtml;
var showLoading = require("../utils/misc.js").showLoading;
var parseModelName = require("./utilities.js").parseModelName;
var headTitle = require("./utilities.js").headTitle;
var uniqueify = require("./utilities.js").uniqueify;

// process AJAX call
var modelEntity = [],
    biologicalMeaning = [],
    speciesList = [],
    geneList = [],
    proteinList = [],
    head = [],
    id = 0;

// Load search html
var loadSearchHtml = function () {

    if (!sessionStorage.getItem("searchListContent")) {
        $ajaxUtils.sendGetRequest(
            searchHtml,
            function (searchHtmlContent) {
                insertHtml("#home-content", searchHtmlContent);
            },
            false);

    }
    else {
        insertHtml("#home-content", sessionStorage.getItem('searchListContent'));
    }

    // Switch from current active button to discovery button
    var activeItem = "#" + findActiveItem();
    switchListItemToActive(activeItem, "#listDiscovery");
};

// semantic annotation based on search items
document.addEventListener('keydown', function (event) {
    if (event.key == 'Enter') {

        var uriOPB, uriCHEBI, keyValue;
        var searchTxt = document.getElementById("searchTxt").value;

        // set local storage
        sessionStorage.setItem('searchTxtContent', searchTxt);

        // dictionary object
        var dictionary = [
            {
                "key1": "flux", "key2": "",
                "opb": "<http://identifiers.org/opb/OPB_00593>", "chebi": ""
            },
            {
                "key1": "flux", "key2": "sodium",
                "opb": "<http://identifiers.org/opb/OPB_00593>",
                "chebi": "<http://identifiers.org/chebi/CHEBI:26708>"
            },
            {
                "key1": "flux", "key2": "hydrogen",
                "opb": "<http://identifiers.org/opb/OPB_00593>",
                "chebi": "<http://identifiers.org/chebi/CHEBI:49637>"
            },
            {
                "key1": "flux", "key2": "ammonium",
                "opb": "<http://identifiers.org/opb/OPB_00593>",
                "chebi": "<http://identifiers.org/chebi/CHEBI:28938>"
            },
            {
                "key1": "flux", "key2": "chloride",
                "opb": "<http://identifiers.org/opb/OPB_00593>",
                "chebi": "<http://identifiers.org/chebi/CHEBI:17996>"
            },
            {
                "key1": "flux", "key2": "potassium",
                "opb": "<http://identifiers.org/opb/OPB_00593>",
                "chebi": "<http://identifiers.org/chebi/CHEBI:26216>"
            },
            {
                "key1": "flux", "key2": "calcium",
                "opb": "<http://identifiers.org/opb/OPB_00593>",
                "chebi": "<http://identifiers.org/chebi/CHEBI:22984>"
            },
            {
                "key1": "flux", "key2": "IP3",
                "opb": "<http://identifiers.org/opb/OPB_00593>",
                "chebi": "<http://identifiers.org/chebi/CHEBI:131186>"
            },
            {
                "key1": "flux", "key2": "ATP",
                "opb": "<http://identifiers.org/opb/OPB_00593>",
                "chebi": "<http://identifiers.org/chebi/CHEBI:15422>"
            },
            {
                "key1": "concentration", "key2": "",
                "opb": "<http://identifiers.org/opb/OPB_00340>", "chebi": ""
            },
            {
                "key1": "concentration", "key2": "sodium",
                "opb": "<http://identifiers.org/opb/OPB_00340>",
                "chebi": "<http://identifiers.org/chebi/CHEBI:26708>"
            },
            {
                "key1": "concentration", "key2": "hydrogen",
                "opb": "<http://identifiers.org/opb/OPB_00340>",
                "chebi": "<http://identifiers.org/chebi/CHEBI:49637>"
            },
            {
                "key1": "concentration", "key2": "ammonium",
                "opb": "<http://identifiers.org/opb/OPB_00340>",
                "chebi": "<http://identifiers.org/chebi/CHEBI:28938>"
            },
            {
                "key1": "concentration", "key2": "chloride",
                "opb": "<http://identifiers.org/opb/OPB_00340>",
                "chebi": "<http://identifiers.org/chebi/CHEBI:17996>"
            },
            {
                "key1": "concentration", "key2": "potassium",
                "opb": "<http://identifiers.org/opb/OPB_00340>",
                "chebi": "<http://identifiers.org/chebi/CHEBI:26216>"
            },
            {
                "key1": "concentration", "key2": "calcium",
                "opb": "<http://identifiers.org/opb/OPB_00340>",
                "chebi": "<http://identifiers.org/chebi/CHEBI:22984>"
            },
            {
                "key1": "concentration", "key2": "IP3",
                "opb": "<http://identifiers.org/opb/OPB_00340>",
                "chebi": "<http://identifiers.org/chebi/CHEBI:131186>"
            },
            {
                "key1": "concentration", "key2": "ATP",
                "opb": "<http://identifiers.org/opb/OPB_00340>",
                "chebi": "<http://identifiers.org/chebi/CHEBI:15422>"
            },
        ];

        for (var i = 0; i < dictionary.length; i++) {
            var key1 = searchTxt.indexOf("" + dictionary[i].key1 + ""),
                key2 = searchTxt.indexOf("" + dictionary[i].key2 + "");

            if (key1 != -1 && key2 != -1) {
                uriOPB = dictionary[i].opb;
                uriCHEBI = dictionary[i].chebi;
                keyValue = dictionary[i].key1;
            }
        }

        showLoading("#searchList");

        modelEntity = [];
        biologicalMeaning = [];
        speciesList = [];
        geneList = [];
        proteinList = [];
        head = [];

        id = 0; // id to index each Model_entity

        addEventListener(uriOPB, uriCHEBI, keyValue);
    }
});

addEventListener = function (uriOPB, uriCHEBI, keyValue) {

    if (uriCHEBI == "") {
        var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
            'PREFIX dcterms: <http://purl.org/dc/terms/>' +
            'SELECT ?Model_entity ?Biological_meaning ' +
            'WHERE { ' +
            '?property semsim:hasPhysicalDefinition ' + uriOPB + '. ' +
            '?Model_entity semsim:isComputationalComponentFor ?property. ' +
            '?Model_entity dcterms:description ?Biological_meaning.' +
            '}';
    }
    else {
        if (keyValue == "flux") {
            var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                'PREFIX dcterms: <http://purl.org/dc/terms/>' +
                'SELECT ?Model_entity ?Biological_meaning ' +
                'WHERE { ' +
                '?entity semsim:hasPhysicalDefinition ' + uriCHEBI + '. ' +
                '?source semsim:hasPhysicalEntityReference ?entity. ' +
                '?process semsim:hasSourceParticipant ?source. ' +
                '?property semsim:physicalPropertyOf ?process. ' +
                '?Model_entity semsim:isComputationalComponentFor ?property. ' +
                '?Model_entity dcterms:description ?Biological_meaning.' +
                '}'
        }
        else {
            var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                'PREFIX dcterms: <http://purl.org/dc/terms/>' +
                'SELECT ?Model_entity ?Biological_meaning ' +
                'WHERE { ' +
                '?entity semsim:hasPhysicalDefinition ' + uriCHEBI + '. ' +
                '?property semsim:physicalPropertyOf ?entity. ' +
                '?Model_entity semsim:isComputationalComponentFor ?property. ' +
                '?Model_entity dcterms:description ?Biological_meaning.' +
                '}'
        }
    }

    // Model
    $ajaxUtils.sendPostRequest(
        endpoint,
        query,
        function (jsonModel) {
            if (id == jsonModel.results.bindings.length) {
                return;
            }

            var model = parseModelName(jsonModel.results.bindings[id].Model_entity.value);
            var query = 'SELECT ?Species ' + 'WHERE ' +
                '{ ' + '<' + model + '#Species> <http://purl.org/dc/terms/description> ?Species.' + '}';

            // Species
            $ajaxUtils.sendPostRequest(
                endpoint,
                query,
                function (jsonSpecies) {

                    var model = parseModelName(jsonModel.results.bindings[id].Model_entity.value);
                    var query = 'SELECT ?Gene ' + 'WHERE ' +
                        '{ ' + '<' + model + '#Gene> <http://purl.org/dc/terms/description> ?Gene.' + '}';

                    // Gene
                    $ajaxUtils.sendPostRequest(
                        endpoint,
                        query,
                        function (jsonGene) {

                            var model = parseModelName(jsonModel.results.bindings[id].Model_entity.value);
                            var query = 'SELECT ?Protein ' + 'WHERE ' +
                                '{ ' + '<' + model + '#Protein> <http://purl.org/dc/terms/description> ?Protein.' + '}';

                            // Protein
                            $ajaxUtils.sendPostRequest(
                                endpoint,
                                query,
                                function (jsonProtein) {

                                    // model and biological meaning
                                    modelEntity.push(jsonModel.results.bindings[id].Model_entity.value);
                                    biologicalMeaning.push(jsonModel.results.bindings[id].Biological_meaning.value);

                                    // species
                                    if (jsonSpecies.results.bindings.length == 0)
                                        speciesList.push("Undefined");
                                    else
                                        speciesList.push(jsonSpecies.results.bindings[0].Species.value);

                                    // gene
                                    if (jsonGene.results.bindings.length == 0)
                                        geneList.push("Undefined");
                                    else
                                        geneList.push(jsonGene.results.bindings[0].Gene.value);

                                    // protein
                                    if (jsonProtein.results.bindings.length == 0)
                                        proteinList.push("Undefined");
                                    else
                                        proteinList.push(jsonProtein.results.bindings[0].Protein.value);

                                    head = headTitle(jsonModel, jsonSpecies, jsonGene, jsonProtein);

                                    // Get more useful information
                                    var len = modelEntity.length;
                                    searchListAJAX(
                                        modelEntity[len - 1],
                                        speciesList[len - 1],
                                        geneList[len - 1],
                                        proteinList[len - 1]);

                                    // show search results
                                    searchList(
                                        head,
                                        modelEntity,
                                        biologicalMeaning,
                                        speciesList,
                                        geneList,
                                        proteinList);

                                    id++; // increment index of modelEntity
                                    addEventListener(uriOPB, uriCHEBI, keyValue); // callback
                                },
                                true);
                        },
                        true);
                },
                true);
        },
        true);
}

var searchListAJAX = function (modelEntityid, speciesListid, geneListid, proteinListid) {

    var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
        'PREFIX dcterms: <http://purl.org/dc/terms/>' +
        'SELECT ?Model_srcentity ?Biological_srcmeaning ?Model_snkentity ?Biological_snkmeaning ' +
        'WHERE { ' +
        '<' + modelEntityid + '> semsim:isComputationalComponentFor ?model_prop. ' +
        '?model_prop semsim:physicalPropertyOf ?model_proc. ' +
        '?model_proc semsim:hasSourceParticipant ?model_srcparticipant. ' +
        '?model_srcparticipant semsim:hasPhysicalEntityReference ?source_entity. ' +
        '?source_prop semsim:physicalPropertyOf ?source_entity. ' +
        '?Model_srcentity semsim:isComputationalComponentFor ?source_prop. ' +
        '?Model_srcentity dcterms:description ?Biological_srcmeaning. ' +
        '?model_proc semsim:hasSinkParticipant ?model_sinkparticipant. ' +
        '?model_sinkparticipant semsim:hasPhysicalEntityReference ?sink_entity. ' +
        '?sink_prop semsim:physicalPropertyOf ?sink_entity. ' +
        '?Model_snkentity semsim:isComputationalComponentFor ?sink_prop. ' +
        '?Model_snkentity dcterms:description ?Biological_snkmeaning.' +
        '}'

    var searchListAJAXObj = function () {
        // Model
        $ajaxUtils.sendPostRequest(
            endpoint,
            query,
            function (jsonModel) {
                var jsonModelObj = [];

                // Parsing into Model_entity and Biological_meaning object
                for (var i = 0; i < jsonModel.results.bindings.length; i++) {
                    jsonModelObj.push({
                        Model_entity: jsonModel.results.bindings[i].Model_srcentity.value,
                        Biological_meaning: jsonModel.results.bindings[i].Biological_srcmeaning.value
                    });
                }

                for (var i = 0; i < jsonModel.results.bindings.length; i++) {
                    jsonModelObj.push({
                        Model_entity: jsonModel.results.bindings[i].Model_snkentity.value,
                        Biological_meaning: jsonModel.results.bindings[i].Biological_snkmeaning.value
                    });
                }

                // remove redundant objects
                jsonModelObj = uniqueify(jsonModelObj);

                for (var m = 0; m < jsonModelObj.length; m++) {
                    modelEntity.push(jsonModelObj[m].Model_entity);
                    biologicalMeaning.push(jsonModelObj[m].Biological_meaning);
                    speciesList.push(speciesListid);
                    geneList.push(geneListid);
                    proteinList.push(proteinListid);
                }

                searchList(
                    head,
                    modelEntity,
                    biologicalMeaning,
                    speciesList,
                    geneList,
                    proteinList);

                // No search results found, so sent empty arrays
                if (!jsonModelObj.length) {
                    console.log("No search results found in searchListAJAX", jsonModelObj.length);
                    searchList(
                        head,
                        modelEntity,
                        biologicalMeaning,
                        speciesList,
                        geneList,
                        proteinList);
                }
            },
            true
        );
    }

    searchListAJAXObj(); // callback
}

// Show semantic annotation extracted from PMR
var searchList = function (head, modelEntity, biologicalMeaning, speciesList, geneList, proteinList) {

    var searchList = document.getElementById("searchList");

    // Search result does not match
    if (head.length == 0) {
        searchList.innerHTML = "<section class='container-fluid'><label><br>No Search Results!</label></section>";
        return;
    }

    // Make empty space for a new search
    searchList.innerHTML = "";

    var table = document.createElement("table");
    table.className = "table table-hover table-condensed"; //table-bordered table-striped

    // Table header
    var thead = document.createElement("thead");
    var tr = document.createElement("tr");
    for (var i = 0; i < head.length; i++) {
        // Empty header for checkbox column
        if (i == 0) {
            var th = document.createElement("th");
            th.appendChild(document.createTextNode(""));
            tr.appendChild(th);
        }

        var th = document.createElement("th");
        th.appendChild(document.createTextNode(head[i]));
        tr.appendChild(th);
    }

    thead.appendChild(tr);
    table.appendChild(thead);

    // Table body
    var tbody = document.createElement("tbody");
    for (var i = 0; i < modelEntity.length; i++) {
        var tr = document.createElement("tr");

        var temp = [];
        var td = [];

        // Temporary for display
        var tempmodelEntity = modelEntity[i].slice(36 + 1);
        if (tempmodelEntity.indexOf("16032017100850239p1300") != -1) {

            var indexOfHash = tempmodelEntity.search("#");
            tempmodelEntity = "weinstein_1995" + tempmodelEntity.slice(indexOfHash);
        }

        if (tempmodelEntity.indexOf("17032017142614972p1300") != -1) {

            var indexOfHash = tempmodelEntity.search("#");
            tempmodelEntity = "chang_fujita_b_1999" + tempmodelEntity.slice(indexOfHash);
        }

        if (tempmodelEntity.indexOf("21042017112802526p1200") != -1) {

            var indexOfHash = tempmodelEntity.search("#");
            tempmodelEntity = "wilkins_sneyd_1998" + tempmodelEntity.slice(indexOfHash);
        }

        if (tempmodelEntity.indexOf("23042017142938531p1200") != -1) {

            var indexOfHash = tempmodelEntity.search("#");
            tempmodelEntity = "warren_2010" + tempmodelEntity.slice(indexOfHash);
        }

        if (tempmodelEntity.indexOf("20042017200857265p1200") != -1) {

            var indexOfHash = tempmodelEntity.search("#");
            tempmodelEntity = "sneyd_1995" + tempmodelEntity.slice(indexOfHash);
        }

        if (tempmodelEntity.indexOf("22042017214418158p1200") != -1) {

            var indexOfHash = tempmodelEntity.search("#");
            tempmodelEntity = "bindschadler_sneyd_2001" + tempmodelEntity.slice(indexOfHash);
        }

        // Ignore the semsim URI ==> weinstein_1995#NHE3_C_ext_Na
        temp.push(tempmodelEntity, biologicalMeaning[i], speciesList[i], geneList[i], proteinList[i]);

        for (var j = 0; j < temp.length; j++) {
            if (j == 0) {
                td[j] = document.createElement("td");
                var label = document.createElement('label');
                label.innerHTML = '<input id="' + modelEntity[i] + '" type="checkbox" ' +
                    'data-action="search" value="' + modelEntity[i] + '" class="checkbox"></label>';

                td[j].appendChild(label);
                tr.appendChild(td[j]);
            }

            td[j] = document.createElement("td");
            td[j].appendChild(document.createTextNode(temp[j]));
            tr.appendChild(td[j]);
        }

        tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    searchList.appendChild(table);

    // Fill in the search attribute value
    var searchTxt = document.getElementById("searchTxt");
    searchTxt.setAttribute('value', sessionStorage.getItem('searchTxtContent'));

    // SET home content in the local storage
    var maincontent = document.getElementById('home-content');
    sessionStorage.setItem('searchListContent', $(maincontent).html());
}

exports.loadSearchHtml = loadSearchHtml;
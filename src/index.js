/**
 * Created by dsar941 on 9/8/2016.
 */
var parseModelName = require("./utils/miscellaneous.js").parseModelName;
var parserFmaNameText = require("./utils/miscellaneous.js").parserFmaNameText;
var headTitle = require("./utils/miscellaneous.js").headTitle;
var compare = require("./utils/miscellaneous.js").compare;
var uniqueifyEpithelial = require("./utils/miscellaneous.js").uniqueifyEpithelial;
var uniqueifySrcSnkMed = require("./utils/miscellaneous.js").uniqueifySrcSnkMed;
var uniqueifymodel2DArray = require("./utils/miscellaneous.js").uniqueifymodel2DArray;
var uniqueifyjsonModel = require("./utils/miscellaneous.js").uniqueifyjsonModel;
var isExist = require("./utils/miscellaneous.js").isExist;
var isExistModel2DArray = require("./utils/miscellaneous.js").isExistModel2DArray;
var iteration = require("./utils/miscellaneous.js").iteration;
var viewModel = require("./utils/viewModel.js").viewModel;
var overlappingModels = require("./utils/overlappingModels.js").overlappingModels;
var epithelialPlatform = require("./utils/epithelialPlatform.js").epithelialPlatform;
var showLoading = require("./utils/miscellaneous.js").showLoading;
var activeMenu = require("./utils/miscellaneous.js").activeMenu;
var switchMenuToActive = require("./utils/miscellaneous.js").switchMenuToActive;

var sendGetRequest = require("./libs/ajax-utils.js").sendGetRequest;
var sendPostRequest = require("./libs/ajax-utils.js").sendPostRequest;

(function (global) {
    'use strict';

    // TODO: Use identifiers in Auckland OLS
    var apicalID = "http://purl.org/sig/ont/fma/fma84666";
    var basolateralID = "http://purl.org/sig/ont/fma/fma84669";
    var paracellularID = "http://purl.org/sig/ont/fma/fma67394";
    var luminalID = "http://purl.org/sig/ont/fma/fma74550";
    var cytosolID = "http://purl.org/sig/ont/fma/fma66836";
    var interstitialID = "http://purl.org/sig/ont/fma/fma9673";

    var endpoint = "https://models.physiomeproject.org/pmr2_virtuoso_search";

    var homeHtml = "./snippets/home-snippet.html";
    var viewHtml = "./snippets/view-snippet.html";
    var modelHtml = "./snippets/model-snippet.html";
    var searchHtml = "./snippets/search-snippet.html";
    var overlappingHtml = "./snippets/overlapping-snippet.html";
    var epithelialHtml = "./snippets/epithelial-snippet.html";

    var combinedMembrane = [];

    // namespace for utility
    var mainUtils = {};

    // delete operation
    var templistOfModel = [];

    // selected models in load models
    var model = [], model2DArray = [];

    var modelEntityName, // search action
        modelEntityNameArray = [], // model action
        modelEntityFullNameArray = [];

    // svg visualization
    var links = [];

    var visualizedOverlapModels = [];

    // process AJAX call
    var modelEntity = [],
        biologicalMeaning = [],
        speciesList = [],
        geneList = [],
        proteinList = [],
        head = [],
        id = 0;

    var str = [];

    // search everything dropdown menu
    var listOfMembrane = [apicalID, basolateralID, luminalID, cytosolID, interstitialID, paracellularID],
        listOfMembraneName = [],
        indexOfmemURI = 0;

    var lengthOfLoadModelTable;

    mainUtils.loadHomeHtml = function () {

        showLoading("#main-content");
        sendGetRequest(
            homeHtml,
            function (homeHtmlContent) {
                $("#main-content").html(homeHtmlContent);
            },
            false);
    };

    mainUtils.loadDocumentation = function () {

        $("#main-content").html("Documentation can be found at " +
            '<a href="http://epithelial-modelling-platform.readthedocs.io/en/latest/" ' +
            'target="_blank">Read the Docs</a>');

        // // Switch current active button to the clicked button
        // var activeItem = "#" + activeMenu();
        // switchMenuToActive(activeItem, "#documentation");
    };

    // On page load (before img or CSS)
    $(document).ready(function (event) {

        // On first load, show home view
        showLoading("#main-content");

        // homepage
        sendGetRequest(
            homeHtml,
            function (homeHtmlContent) {
                $("#main-content").html(homeHtmlContent);

                $('.carousel').carousel({
                    interval: 2000
                });
            },
            false);

        $('.dropdown-toggle').dropdown();
    });

    $(document).on({
        click: function () {
            // If there's an action with the given name, call it
            if (typeof actions[event.target.dataset.action] === "function") {
                actions[event.target.dataset.action].call(this, event);
            }

        },

        keydown: function () {
            // semantic annotation based on search items
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
                        "chebi": "<http://identifiers.org/chebi/CHEBI:29101>"
                    },
                    {
                        "key1": "flux", "key2": "hydrogen",
                        "opb": "<http://identifiers.org/opb/OPB_00593>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:15378>"
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
                        "chebi": "<http://identifiers.org/chebi/CHEBI:29103>"
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
                        "key1": "flux", "key2": "glucose",
                        "opb": "<http://identifiers.org/opb/OPB_00593>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:17234>"
                    },
                    {
                        "key1": "flux", "key2": "lactate",
                        "opb": "<http://identifiers.org/opb/OPB_00593>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:24996>"
                    },
                    {
                        "key1": "flux", "key2": "aldosterone",
                        "opb": "<http://identifiers.org/opb/OPB_00593>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:27584>"
                    },
                    {
                        "key1": "flux", "key2": "thiazide",
                        "opb": "<http://identifiers.org/opb/OPB_00593>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:50264>"
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
                        "chebi": "<http://identifiers.org/chebi/CHEBI:29101>"
                    },
                    {
                        "key1": "concentration", "key2": "hydrogen",
                        "opb": "<http://identifiers.org/opb/OPB_00340>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:15378>"
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
                        "chebi": "<http://identifiers.org/chebi/CHEBI:29103>"
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
                    {
                        "key1": "concentration", "key2": "glucose",
                        "opb": "<http://identifiers.org/opb/OPB_00340>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:17234>"
                    },
                    {
                        "key1": "concentration", "key2": "lactate",
                        "opb": "<http://identifiers.org/opb/OPB_00340>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:24996>"
                    },
                    {
                        "key1": "concentration", "key2": "aldosterone",
                        "opb": "<http://identifiers.org/opb/OPB_00340>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:27584>"
                    },
                    {
                        "key1": "concentration", "key2": "thiazide",
                        "opb": "<http://identifiers.org/opb/OPB_00340>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:50264>"
                    }
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

                mainUtils.discoverModels(uriOPB, uriCHEBI, keyValue);
            }
        }
    });

    // Event handling for SEARCH, MODEL
    var actions = {

        search: function (event) {

            console.log("search event: ", event);

            if (event.target.className == "checkbox") {

                if (event.target.checked) {
                    var idWithStr = event.target.id;
                    var index = idWithStr.search("#");
                    var workspaceName = idWithStr.slice(0, index);

                    var tempidWithStr = event.target.id;

                    mainUtils.workspaceName = workspaceName;
                    mainUtils.tempidWithStr = tempidWithStr;

                    modelEntityName = idWithStr;
                }
                else {
                    mainUtils.workspaceName = "";
                    mainUtils.tempidWithStr = "";
                }
            }
        },

        model: function (event) {

            console.log("model event: ", event);

            // select one by one
            if (event.target.className == "attribute") {

                if (event.target.checked) {

                    if (!isExist(event.target.value, templistOfModel)) {
                        templistOfModel.push(event.target.value);

                        // for making visualization graph
                        modelEntityNameArray.push(event.target.value);
                        modelEntityFullNameArray.push(event.target.value);
                    }
                }
                else {
                    var pos = templistOfModel.indexOf(event.target.value);
                    templistOfModel.splice(pos, 1);

                    // for making visualization graph
                    var pos2 = modelEntityNameArray.indexOf(event.target.value);
                    modelEntityNameArray.splice(pos2, 1);
                    modelEntityFullNameArray.splice(pos2, 1);
                }

                var idWithStr = event.target.id;
                var index = idWithStr.search("#");
                var workspaceName = idWithStr.slice(0, index);

                var tempidWithStr = event.target.id;

                // mainUtils.workspaceName.push(workspaceName);
                mainUtils.workspaceName = workspaceName;
                mainUtils.tempidWithStr = tempidWithStr;
            }

            // select all
            if (event.target.className == "attributeAll") {

                if (event.target.checked == true) {
                    for (var i = 0; i < $('.attribute').length; i++) {
                        $('.attribute')[i].checked = true;

                        if (!isExist($('.attribute')[i].value, templistOfModel)) {
                            templistOfModel.push($('.attribute')[i].value);

                            // for making visualization graph
                            modelEntityNameArray.push($('.attribute')[i].value);
                            modelEntityFullNameArray.push($('.attribute')[i].value);
                        }
                    }
                }
                else {
                    for (var i = 0; i < $('.attribute').length; i++) {
                        $('.attribute')[i].checked = false;

                        var pos = templistOfModel.indexOf($('.attribute')[i].value);
                        templistOfModel.splice(pos, 1);

                        // for making visualization graph
                        var pos2 = modelEntityNameArray.indexOf($('.attribute')[i].value);
                        modelEntityNameArray.splice(pos2, 1);
                        modelEntityFullNameArray.splice(pos2, 1);
                    }
                }
            }

            // remove duplicate in templistOfModel
            templistOfModel = templistOfModel.filter(function (item, pos) {
                return templistOfModel.indexOf(item) == pos;
            })

            // remove duplicate in modelEntityNameArray
            modelEntityNameArray = modelEntityNameArray.filter(function (item, pos) {
                return modelEntityNameArray.indexOf(item) == pos;
            })

            // remove duplicate in modelEntityFullNameArray
            modelEntityFullNameArray = modelEntityFullNameArray.filter(function (item, pos) {
                return modelEntityFullNameArray.indexOf(item) == pos;
            })
        }
    };

    // Load search html
    mainUtils.loadSearchHtml = function () {

        if (!sessionStorage.getItem("searchListContent")) {
            sendGetRequest(
                searchHtml,
                function (searchHtmlContent) {
                    $("#main-content").html(searchHtmlContent);
                },
                false);

        }
        else {
            // console.log("templistOfModel: ", templistOfModel);
            $("#main-content").html(sessionStorage.getItem('searchListContent'));

            for (var j = 0; j < modelEntity.length; j++) {
                if (isExist(modelEntity[j], templistOfModel)) {
                    modelEntity.splice(j, 1);

                    // console.log("modelEntity: ", modelEntity);
                }
            }

            mainUtils.showDiscoverModels(
                head,
                modelEntity,
                biologicalMeaning,
                speciesList,
                geneList,
                proteinList);

            // $("#main-content").html(sessionStorage.getItem('searchListContent'));
            head = headTitle();
            listOfColumns(head, 1);

            listOfMembraneName = [];
            indexOfmemURI = 0;
            // membraneURIOLS(listOfMembrane[0]);
        }

        // // Switch current active button to the clicked button
        // var activeItem = "#" + activeMenu();
        // switchMenuToActive(activeItem, "#listDiscovery");
    };

    mainUtils.discoverModels = function (uriOPB, uriCHEBI, keyValue) {

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
                    'SELECT DISTINCT ?g ?Model_entity ?Biological_meaning ' +
                    'WHERE { GRAPH ?g { ' +
                    '?entity semsim:hasPhysicalDefinition ' + uriCHEBI + '. ' +
                    '?source semsim:hasPhysicalEntityReference ?entity. ' +
                    '?process semsim:hasSourceParticipant ?source. ' +
                    '?property semsim:physicalPropertyOf ?process. ' +
                    '?Model_entity semsim:isComputationalComponentFor ?property. ' +
                    '?Model_entity dcterms:description ?Biological_meaning.' +
                    '}}'
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
        sendPostRequest(
            endpoint,
            query,
            function (jsonModel) {

                // REMOVE duplicate cellml model and variable name (NOT component name)
                jsonModel.results.bindings = uniqueifyjsonModel(jsonModel.results.bindings);

                // console.log("jsonModel in index.js: ", jsonModel);

                var discoverInnerModels = function () {
                    if (jsonModel.results.bindings.length == 0) {
                        mainUtils.showDiscoverModels(head, modelEntity, biologicalMeaning, speciesList, geneList, proteinList);
                        return;
                    }

                    var model = parseModelName(jsonModel.results.bindings[id].Model_entity.value);

                    // console.log("model: ", model);

                    model = model + "#" + model.slice(0, model.indexOf('.'));

                    // console.log("model#: ", model);

                    var query = 'SELECT ?Protein ' +
                        'WHERE { ' + '<' + model + '> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein. }';

                    // console.log("query: ", query);

                    sendPostRequest(
                        endpoint,
                        query,
                        function (jsonProteinUri) {

                            // console.log("jsonProteinUri: ", jsonProteinUri);

                            // pig SGLT2 (PR_P31636) is missing in protein ontology
                            // Write a test case for unsuccessful OLS query and handle this issue as undefined
                            // Just assign mouse species for the time being
                            var pr_uri = jsonProteinUri.results.bindings[0].Protein.value;

                            var endpointproteinOLS;
                            if (pr_uri != undefined)
                                endpointproteinOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/pr/terms?iri=" + pr_uri;
                            else
                                endpointproteinOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/pr";

                            sendGetRequest(
                                endpointproteinOLS,
                                function (jsonProtein) {

                                    // console.log("jsonProtein: ", jsonProtein);

                                    var endpointgeneOLS;
                                    // if (jsonProtein._embedded.terms[0]._links.has_gene_template != undefined)
                                    if (jsonProtein._embedded.terms[0]._links.has_gene_template != undefined)
                                        endpointgeneOLS = jsonProtein._embedded.terms[0]._links.has_gene_template.href;
                                    else
                                        endpointgeneOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/pr";

                                    sendGetRequest(
                                        endpointgeneOLS,
                                        function (jsonGene) {

                                            // console.log("jsonGene: ", jsonGene);

                                            var endpointspeciesOLS;
                                            if (jsonProtein._embedded.terms[0]._links.only_in_taxon != undefined)
                                                endpointspeciesOLS = jsonProtein._embedded.terms[0]._links.only_in_taxon.href;
                                            else
                                                endpointspeciesOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/pr";

                                            sendGetRequest(
                                                endpointspeciesOLS,
                                                function (jsonSpecies) {

                                                    // console.log("jsonSpecies: ", jsonSpecies);

                                                    // console.log("jsonModel: ", jsonModel);

                                                    // model and biological meaning
                                                    modelEntity.push(jsonModel.results.bindings[id].Model_entity.value);
                                                    biologicalMeaning.push(jsonModel.results.bindings[id].Biological_meaning.value);

                                                    // species
                                                    if (jsonSpecies._embedded == undefined)
                                                        speciesList.push("Undefined");
                                                    else
                                                        speciesList.push(jsonSpecies._embedded.terms[0].label);

                                                    // gene
                                                    if (jsonGene._embedded == undefined)
                                                        geneList.push("Undefined");
                                                    else {
                                                        var geneName = jsonGene._embedded.terms[0].label;
                                                        var indexOfParen = geneName.indexOf('(');
                                                        geneName = geneName.slice(0, indexOfParen - 1);
                                                        geneList.push(geneName);
                                                    }

                                                    // protein
                                                    if (jsonProtein._embedded == undefined) // jsonProtein._embedded.terms.length == 0
                                                        proteinList.push("Undefined");
                                                    else {
                                                        var proteinName = jsonProtein._embedded.terms[0].label;
                                                        var indexOfParen = proteinName.indexOf('(');
                                                        proteinName = proteinName.slice(0, indexOfParen - 1);
                                                        proteinList.push(proteinName);
                                                    }

                                                    head = headTitle();

                                                    mainUtils.showDiscoverModels(
                                                        head,
                                                        modelEntity,
                                                        biologicalMeaning,
                                                        speciesList,
                                                        geneList,
                                                        proteinList);

                                                    id++; // increment index of modelEntity

                                                    if (id == jsonModel.results.bindings.length) {
                                                        listOfColumns(head, 1);
                                                        membraneURIOLS(listOfMembrane[0]);
                                                        return;
                                                    }

                                                    discoverInnerModels(); // callback
                                                    // mainUtils.discoverModels(uriOPB, uriCHEBI, keyValue); // callback
                                                },
                                                true);
                                        },
                                        true);
                                },
                                true);
                        },
                        true);
                } // end of discoverInnerModels function

                discoverInnerModels();
            },
            true);
    }

    // Show discovered models from PMR
    mainUtils.showDiscoverModels = function (head, modelEntity, biologicalMeaning, speciesList, geneList, proteinList) {

        // Empty search result
        if (head.length == 0) {
            $("#searchList").html(
                "<section class='container-fluid'><label><br>No Search Results!</label></section>"
            );

            return;
        }

        // Reinitialize for a new search result
        $("#searchList").html("");

        var table = $("<table/>").addClass("table table-hover table-condensed"); //table-bordered table-striped

        // Table header
        var thead = $("<thead/>"), tr = $("<tr/>");
        for (var i = 0; i < head.length; i++) {
            // Empty header for checkbox column
            if (i == 0)
                tr.append($("<th/>").append(""));

            tr.append($("<th/>").append(head[i]));
        }

        thead.append(tr);
        table.append(thead);

        // Table body
        var tbody = $("<tbody/>");
        for (var i = 0; i < modelEntity.length; i++) {
            var tr = $("<tr/>"), temp = [];
            temp.push(modelEntity[i], biologicalMeaning[i], speciesList[i], geneList[i], proteinList[i]);

            for (var j = 0; j < temp.length; j++) {
                if (j == 0) {
                    tr.append($("<td/>")
                        .append($('<label/>')
                            .html('<input id="' + modelEntity[i] + '" type="checkbox" ' +
                                'data-action="search" value="' + modelEntity[i] + '" class="checkbox">')));
                }

                if (j == 1)
                    tr.append($("<td/>").append(temp[j]));
                else
                    tr.append($("<td/>").append(temp[j]));
            }

            tbody.append(tr);
        }

        table.append(tbody);
        $("#searchList").append(table);

        // Fill in search attribute value
        $("#searchTxt").attr("value", sessionStorage.getItem('searchTxtContent'));

        // SET main content in local storage
        sessionStorage.setItem('searchListContent', $("#main-content").html());
    }

    // Load the view
    mainUtils.loadViewHtml = function () {

        var cellmlModel = mainUtils.workspaceName;

        if (cellmlModel == undefined) {
            $("#main-content").html("Please select a model from Model Discovery");

            return;
        }

        cellmlModel = cellmlModel + "#" + cellmlModel.slice(0, cellmlModel.indexOf('.'));

        console.log("cellmlModel: ", cellmlModel);

        var query = 'SELECT ?Workspace ?Model_entity ?Title ?Author ?Abstract ?Keyword ?Protein ?Compartment ' +
            '?Located_in ?DOI WHERE { GRAPH ?Workspace { ' +
            '<' + cellmlModel + '> <http://purl.org/dc/terms/title> ?Title . ' +
            '?Model_entity <http://purl.org/dc/terms/title> ?Title . ' +
            'OPTIONAL { <' + cellmlModel + '> <http://www.w3.org/2001/vcard-rdf/3.0#FN> ?Author } . ' +
            'OPTIONAL { <' + cellmlModel + '> <http://purl.org/dc/terms/abstract> ?Abstract } . ' +
            'OPTIONAL { <' + cellmlModel + '> <http://purl.org/dc/terms/keyword> ?Keyword } . ' +
            'OPTIONAL { <' + cellmlModel + '> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein } . ' +
            'OPTIONAL { <' + cellmlModel + '> <http://www.obofoundry.org/ro/ro.owl#compartmentOf> ?Compartment } . ' +
            'OPTIONAL { <' + cellmlModel + '> <http://www.obofoundry.org/ro/ro.owl#located_in> ?Located_in } . ' +
            'OPTIONAL { <' + cellmlModel + '> <http://biomodels.net/model-qualifiers/isDescribedBy> ?DOI } . ' +
            '}}';

        showLoading("#main-content");
        sendPostRequest(
            endpoint,
            query,
            function (jsonObj) {
                sendGetRequest(
                    viewHtml,
                    function (viewHtmlContent) {
                        $("#main-content").html(viewHtmlContent);
                        sendPostRequest(endpoint, query, viewModel, true);
                    },
                    false);
            },
            true);
    };

    // Load the model
    mainUtils.loadModelHtml = function () {

        var model = mainUtils.workspaceName;

        console.log("model in loadModelHtml: ", model);

        var tempidWithStr;
        if (model == undefined)
            model = undefined;
        else {
            tempidWithStr = mainUtils.tempidWithStr;
            model = model + "#" + model.slice(0, model.indexOf('.'));
        }

        var query = 'SELECT ?Protein ' +
            'WHERE { ' + '<' + model + '> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein. }';

        sendPostRequest(
            endpoint,
            query,
            function (jsonProteinUri) {

                // console.log("jsonProteinUri: ", jsonProteinUri);
                var pr_uri;
                if (jsonProteinUri.results.bindings.length == 0) {
                    pr_uri = undefined;
                }
                else
                    pr_uri = jsonProteinUri.results.bindings[0].Protein.value;

                var endpointproteinOLS;
                if (pr_uri != undefined)
                    endpointproteinOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/pr/terms?iri=" + pr_uri;
                else
                    endpointproteinOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/pr";

                sendGetRequest(
                    endpointproteinOLS,
                    function (jsonProtein) {

                        // console.log("jsonProtein: ", jsonProtein);

                        var endpointgeneOLS;
                        if (jsonProtein._embedded == undefined)
                            endpointgeneOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/pr";
                        else {
                            if (jsonProtein._embedded.terms[0]._links.has_gene_template != undefined)
                                endpointgeneOLS = jsonProtein._embedded.terms[0]._links.has_gene_template.href;
                            else
                                endpointgeneOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/pr";
                        }

                        sendGetRequest(
                            endpointgeneOLS,
                            function (jsonGene) {

                                var endpointspeciesOLS;
                                if (jsonProtein._embedded == undefined) {
                                    endpointspeciesOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/pr";
                                }
                                else {
                                    if (jsonProtein._embedded.terms[0]._links.only_in_taxon != undefined)
                                        endpointspeciesOLS = jsonProtein._embedded.terms[0]._links.only_in_taxon.href;
                                    else
                                        endpointspeciesOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/pr";
                                }

                                sendGetRequest(
                                    endpointspeciesOLS,
                                    function (jsonSpecies) {

                                        // console.log("jsonSpecies: ", jsonSpecies);

                                        var query = 'SELECT ?Compartment ' +
                                            'WHERE { ' + '<' + model + '> <http://www.obofoundry.org/ro/ro.owl#compartmentOf> ?Compartment. }';

                                        sendPostRequest(
                                            endpoint,
                                            query,
                                            function (jsonObjComp) {

                                                // console.log("jsonObjComp: ", jsonObjComp);

                                                var query = 'SELECT ?Located_in ' +
                                                    'WHERE { ' + '<' + model + '> <http://www.obofoundry.org/ro/ro.owl#located_in> ?Located_in. }';

                                                sendPostRequest(
                                                    endpoint,
                                                    query,
                                                    function (jsonObjLoc) {
                                                        // showLoading("#main-content");

                                                        // console.log("jsonObjLoc: ", jsonObjLoc);

                                                        sendGetRequest(
                                                            modelHtml,
                                                            function (modelHtmlContent) {
                                                                $("#main-content").html(modelHtmlContent);

                                                                if (jsonObjComp.results.bindings.length == 0 &&
                                                                    jsonObjLoc.results.bindings.length == 0) {
                                                                    var jsonObj = {};

                                                                    // console.log("jsonObj in loadModelHtml: ", jsonObj);
                                                                    mainUtils.showModel(jsonObj);
                                                                }

                                                                var species, gene, protein;
                                                                // species
                                                                if (jsonSpecies._embedded == undefined)
                                                                    species = "Undefined";
                                                                else
                                                                    species = jsonSpecies._embedded.terms[0].label;

                                                                // gene
                                                                if (jsonGene._embedded == undefined)
                                                                    gene = "Undefined";
                                                                else {
                                                                    var geneName = jsonGene._embedded.terms[0].label;
                                                                    var indexOfParen = geneName.indexOf('(');
                                                                    geneName = geneName.slice(0, indexOfParen - 1);
                                                                    gene = geneName;
                                                                }

                                                                // protein
                                                                if (jsonProtein._embedded == undefined) // jsonProtein._embedded.terms.length
                                                                    protein = "Undefined";
                                                                else {
                                                                    var proteinName = jsonProtein._embedded.terms[0].label;
                                                                    var indexOfParen = proteinName.indexOf('(');
                                                                    proteinName = proteinName.slice(0, indexOfParen - 1);
                                                                    protein = proteinName;
                                                                }

                                                                var tempComp = "", counterOLS = 0;
                                                                for (var i = 0; i < jsonObjComp.results.bindings.length; i++) {
                                                                    var fma_uri = jsonObjComp.results.bindings[i].Compartment.value;
                                                                    var indexofColon = fma_uri.indexOf('FMA:');
                                                                    // fma_uri = "http://purl.obolibrary.org/obo/FMA_" + fma_uri.slice(indexofColon + 4);
                                                                    fma_uri = "http://purl.org/sig/ont/fma/fma" + fma_uri.slice(indexofColon + 4);

                                                                    var endpointOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/fma/terms?iri=" + fma_uri;
                                                                    sendGetRequest(
                                                                        endpointOLS,
                                                                        function (jsonObjOLS) {

                                                                            // console.log("jsonObjOLS: ", jsonObjOLS);

                                                                            counterOLS++;
                                                                            tempComp += jsonObjOLS._embedded.terms[0].label;
                                                                            if (counterOLS < jsonObjComp.results.bindings.length)
                                                                                tempComp += ", ";
                                                                            else
                                                                                tempComp += "";

                                                                            if (counterOLS == jsonObjComp.results.bindings.length) {
                                                                                var tempLoc = "", counterOLSLoc = 0;
                                                                                for (var i = 0; i < jsonObjLoc.results.bindings.length; i++) {
                                                                                    var fma_uri = jsonObjLoc.results.bindings[i].Located_in.value;
                                                                                    var indexofColon = fma_uri.indexOf('FMA:');
                                                                                    // fma_uri = "http://purl.obolibrary.org/obo/FMA_" + fma_uri.slice(indexofColon + 4);
                                                                                    fma_uri = "http://purl.org/sig/ont/fma/fma" + fma_uri.slice(indexofColon + 4);

                                                                                    var endpointOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/fma/terms?iri=" + fma_uri;
                                                                                    sendGetRequest(
                                                                                        endpointOLS,
                                                                                        function (jsonObjOLSLoc) {

                                                                                            // console.log("jsonObjOLSLoc: ", jsonObjOLSLoc);

                                                                                            counterOLSLoc++;
                                                                                            tempLoc += jsonObjOLSLoc._embedded.terms[0].label;
                                                                                            if (counterOLSLoc < jsonObjLoc.results.bindings.length)
                                                                                                tempLoc += ", ";
                                                                                            else
                                                                                                tempLoc += "";

                                                                                            if (counterOLSLoc == jsonObjLoc.results.bindings.length) {
                                                                                                var jsonObj = {
                                                                                                    "Model_entity": tempidWithStr,
                                                                                                    "Protein": protein,
                                                                                                    "Species": species,
                                                                                                    "Gene": gene,
                                                                                                    "Compartment": tempComp,
                                                                                                    "Located_in": tempLoc
                                                                                                }

                                                                                                // console.log("jsonObj in loadModelHtml: ", jsonObj);
                                                                                                mainUtils.showModel(jsonObj);
                                                                                            }
                                                                                        },
                                                                                        true);
                                                                                }
                                                                            }
                                                                        },
                                                                        true);
                                                                }
                                                            },
                                                            false);
                                                    },
                                                    true);
                                            },
                                            true);
                                    },
                                    true);
                            },
                            true);
                    },
                    true);
            },
            true);

        // // Switch from current active button to models button
        // var activeItem = "#" + activeMenu();
        // switchMenuToActive(activeItem, "#listModels");
    };

    // Show selected models
    mainUtils.showModel = function (jsonObj) {

        console.log("showModel: ", jsonObj);

        // Empty result
        if ($.isEmptyObject(jsonObj)) {
            $("#modelList").html("Please load models from Model Discovery");

            return;
        }

        var head = [];
        for (var name in jsonObj) {
            head.push(name);
        }
        listOfColumns(head, 2);

        var table = $("<table/>").addClass("table table-hover table-condensed"); //table-bordered table-striped

        // Table header
        var thead = $("<thead/>"), tr = $("<tr/>");
        for (var i = 0; i < head.length; i++) {
            if (i == 0) {
                tr.append($("<th/>")
                    .append($("<label/>")
                        .html('<input id="' + head[0] + '" type="checkbox" name="attributeAll" ' +
                            'class="attributeAll" data-action="model" value="' + head[0] + '" >')));
            }

            tr.append($("<th/>").append(head[i]));
        }

        thead.append(tr);
        table.append(thead);

        for (var i = 0; i < head.length; i++) {
            if (i == 0) {
                // search list to model list with empty model
                if (jsonObj.length == 0) break;

                if (isExistModel2DArray(modelEntityName, model2DArray))
                    break;

                model.push($("<label/>").html('<input id="' + modelEntityName + '" type="checkbox" ' +
                    'name="attribute" class="attribute" data-action="model" value="' + modelEntityName + '" >'));
            }

            if (head[i] == "Model_entity") {
                model.push(modelEntityName);
            }
            else {
                model.push(jsonObj[head[i]]);
            }
        }

        // 1D to 2D array
        while (model.length) {
            model2DArray.push(model.splice(0, 7)); // 6 + 1 (checkbox) header element
        }

        model2DArray = uniqueifymodel2DArray(model2DArray);

        if (visualizedOverlapModels.length != 0) {
            // remove visualizedOverlapModels's elem from templistOfModel
            for (var i = 0; i < visualizedOverlapModels.length; i++) {
                for (var j = 0; j < templistOfModel.length; j++) {
                    if (visualizedOverlapModels[i][1] == templistOfModel[j]) {
                        templistOfModel.splice(j, 1);
                        j--;

                        // Remove from modelEntity
                        modelEntityNameArray.forEach(function (elem, index) {
                            if (visualizedOverlapModels[i][1] == elem) {
                                modelEntityNameArray.splice(index, 1);
                            }
                        })

                        // Remove from modelEntityFullNameArray
                        modelEntityFullNameArray.forEach(function (elem, index) {
                            if (visualizedOverlapModels[i][1] == elem) {
                                modelEntityFullNameArray.splice(index, 1);
                            }
                        })
                    }
                }
            }
        }
        else {
            // remove templistOfModel's elem from model2DArray
            // templistOfModel's elem is in Epithelial Platform
            // model2DArray's elem is in Load Model
            for (var i = 0; i < model2DArray.length; i++) {
                for (var j = 0; j < templistOfModel.length; j++) {
                    if (model2DArray[i][1] == templistOfModel[j]) {
                        model2DArray.splice(i, 1);
                    }
                }
            }
        }

        console.log("model and model2DArray in showModel: ", model, model2DArray);
        console.log("templistOfModel in showModel: ", templistOfModel);
        console.log("visualizedOverlapModels in showModel: ", visualizedOverlapModels);

        visualizedOverlapModels = []; // reinitialize for next iteration in Overlapping models

        // Table body
        var tbody = $("<tbody/>"), td = [];
        for (var i = 0; i < model2DArray.length; i++) {
            var tr = $("<tr/>");
            // +1 for adding checkbox column
            for (var j = 0; j < head.length + 1; j++) {
                td[j] = $("<td/>");
                if (j == 0)
                    td[j].append(model2DArray[i][j]);
                else
                    td[j].append(model2DArray[i][j]);

                // Id for each row
                if (j == 1)
                    tr.attr("id", model2DArray[i][j]);

                tr.append(td[j]);
            }

            tbody.append(tr);
        }

        table.append(tbody);
        $("#modelList").append(table);

        // Uncheck checkboxes when back from overlapping models
        for (var i = 0; i < $('table tr td label').length; i++) {
            if ($('table tr td label')[i].firstChild.checked == true) {
                $('table tr td label')[i].firstChild.checked = false;
            }
        }

        console.log("lengthOfLoadModelTable in showModel: ", $('table tr').length);
        lengthOfLoadModelTable = $('table tr').length;
        if (lengthOfLoadModelTable == 1) {

            mainUtils.workspaceName = "";

            $("#modelList").html("Please load models from Model Discovery");

            return;
        }
    };

    // Toggle table column in Model discovery
    mainUtils.toggleColHtml = function () {

        if (event.target.checked == false) {
            var id = event.target.id;

            console.log("id: ", id);

            $('td:nth-child(' + id + '),th:nth-child(' + id + ')').hide();
        }

        if (event.target.checked == true) {
            var id = event.target.id;

            console.log("id: ", id);

            $('td:nth-child(' + id + '),th:nth-child(' + id + ')').show();
        }
    };

    // Toggle table column in Load model
    mainUtils.toggleColModelHtml = function () {

        if (event.target.checked == false) {
            var id = event.target.id;

            console.log("id: ", id);

            $('td:nth-child(' + id + '),th:nth-child(' + id + ')').hide();
        }

        if (event.target.checked == true) {
            var id = event.target.id;

            console.log("id: ", id);

            $('td:nth-child(' + id + '),th:nth-child(' + id + ')').show();
        }
    };

    // Columns in search and model page
    var listOfColumns = function (head, flag, membraneUri) {
        if (flag == 1) { // columns in search html
            for (var i = 2; i <= head.length + 1; i++) {
                $('#ulIdSearch')
                    .append('<li><a href="#"><input id=' + i + ' type="checkbox" checked="true" ' +
                        'onclick=$mainUtils.toggleColHtml() value=' + head[i - 2] + '>' + head[i - 2] + '</a></li>');
            }
        }
        else if (flag == 2) { // columns in model html
            for (var i = 2; i <= head.length + 1; i++) {
                $('#ulIdModel')
                    .append('<li><a href="#"><input id=' + i + ' type="checkbox" checked="true" ' +
                        'onclick=$mainUtils.toggleColModelHtml() value=' + head[i - 2] + '>' + head[i - 2] + '</a></li>');
            }
        }
        else if (flag == 3) { // list of membranes in search html
            for (var i = 0; i < head.length; i++) {
                $('#ulIdMembrane')
                    .append('<li><a href="#"><input id=' + membraneUri[i] + ' type="checkbox" checked="true" ' +
                        'onclick=$mainUtils.filterSearchHtml() value=' + membraneUri[i] + '>' + head[i] + '</a></li>');
            }
        }
    }

    // Filter search results
    mainUtils.filterSearchHtml = function () {

        var tempstr = [];

        if (event.target.checked == true) {

            var id = event.target.id;
            for (var i = 1; i < $('table tr').length; i++) {

                tempstr = $('table tr')[i].childNodes[2].id.split(',');

                // id repository
                str.push(id);
                str = uniqueifySrcSnkMed(str);

                // check whether str is in tempstr!!!
                if (compare(str, tempstr) == true) {
                    $('table tr')[i].hidden = false;
                }
                else {
                    $('table tr')[i].hidden = true;
                }
            }
        }

        if (event.target.checked == false) {

            var tempstr = [];
            var id = event.target.id;

            str = uniqueifySrcSnkMed(str); // remove duplicate
            str.splice(str.indexOf(id), 1); // delete id

            if (str.length != 0) {
                for (var i = 1; i < $('table tr').length; i++) {

                    tempstr = $('table tr')[i].childNodes[2].id.split(',');

                    // check whether str is in tempstr
                    if (tempstr.indexOf(id) != -1 && tempstr.length == 1) {
                        $('table tr')[i].hidden = true;
                    }
                    else {
                        $('table tr')[i].hidden = false;
                    }
                }
            }
            else { // if empty then show all
                for (var i = 1; i < $('table tr').length; i++) {
                    $('table tr')[i].hidden = false;
                }
            }
        }

    };

    // Filter dropdown list in the search html
    var membraneURIOLS = function (fma_uri) {

        var endpointOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/fma/terms?iri=" + fma_uri;

        sendGetRequest(
            endpointOLS,
            function (jsonObj) {
                // console.log("listOfMembraneName: ", jsonObj._embedded.terms[0].label);
                listOfMembraneName.push(jsonObj._embedded.terms[0].label);

                indexOfmemURI++;

                if (indexOfmemURI == listOfMembrane.length) {
                    listOfColumns(listOfMembraneName, 3, listOfMembrane);
                    return;
                }

                membraneURIOLS(listOfMembrane[indexOfmemURI]);

            }, true);
    };

    // Delete model
    mainUtils.deleteRowModelHtml = function () {

        templistOfModel.forEach(function (element, tempIndex) {
            for (var i = 0; i < $('table tr').length; i++) {

                if ($('table tr')[i].id == element) {
                    // Remove selected row
                    $('table tr')[i].remove();

                    // Remove from model2DArray
                    model2DArray.forEach(function (elem, index) {
                        if (element == elem[1]) {
                            model2DArray.splice(index, 1);
                        }
                    })

                    // Remove from templistOfModel
                    templistOfModel.splice(tempIndex, 1);

                    // Remove from modelEntity
                    modelEntity.forEach(function (elem, index) {
                        if (element == elem) {
                            modelEntity.splice(index, 1);
                        }
                    })

                    // Remove from modelEntityNameArray
                    modelEntityNameArray.splice(tempIndex, 1);

                    // Remove from modelEntityFullNameArray
                    modelEntityFullNameArray.splice(tempIndex, 1);
                }
            }
        });

        console.log("lengthOfLoadModelTable in deleteRowModelHtml: ", $('table tr').length);

        lengthOfLoadModelTable = $('table tr').length;

        if (lengthOfLoadModelTable == 1) {

            mainUtils.workspaceName = "";

            $("#modelList").html("Please load models from Model Discovery");

            return;
        }
    };

    // Load the SVG model
    mainUtils.loadOverlappingHtml = function () {

        sendGetRequest(
            overlappingHtml,
            function (overlappingHtmlContent) {
                $("#main-content").html(overlappingHtmlContent);

                // TODO: Fix it!!
                sendGetRequest(overlappingHtml, overlappingModels(links, model2DArray, modelEntityNameArray, visualizedOverlapModels), false);
            },
            false);
    };

    // Load the epithelial
    mainUtils.loadEpithelialHtml = function () {

        if (modelEntityFullNameArray.length == 0) {
            $("#main-content").html("Please select models from Load Model");

            return;
        }

        sendGetRequest(
            epithelialHtml,
            function (epithelialHtmlContent) {
                $("#main-content").html(epithelialHtmlContent);
                sendGetRequest(epithelialHtml, mainUtils.loadEpithelial, false);
            },
            false);
    };

    var concentration_fma = [];
    mainUtils.loadEpithelial = function (epithelialHtmlContent) {

        console.log("lengthOfLoadModelTable in loadEpithelial: ", lengthOfLoadModelTable);
        if (lengthOfLoadModelTable == 2) {
            mainUtils.workspaceName = "";
        }

        // remove model name, keep only solutes
        for (var i = 0; i < modelEntityNameArray.length; i++) {
            var indexOfHash = modelEntityNameArray[i].search("#");
            modelEntityNameArray[i] = modelEntityNameArray[i].slice(indexOfHash + 1);
        }

        console.log("loadEpithelial in model2DArr: ", model2DArray);
        console.log("loadEpithelial in modelEntityNameArray: ", modelEntityNameArray);
        console.log("loadEpithelial in modelEntityFullNameArray: ", modelEntityFullNameArray);

        var source_fma = [], sink_fma = [], med_fma = [], med_pr = [];
        var source_fma2 = [], sink_fma2 = [], solute_chebi = [];

        var apicalID = "http://identifiers.org/fma/FMA:84666";
        var basolateralID = "http://identifiers.org/fma/FMA:84669";
        var partOfProteinUri = "http://purl.obolibrary.org/obo/PR";
        var partOfCHEBIUri = "http://identifiers.org/chebi/CHEBI";
        var fluxOPB = "http://identifiers.org/opb/OPB_00593";
        var concentrationOPB = "http://identifiers.org/opb/OPB_00340";

        var index = 0, counter = 0;
        var membrane = [], apicalMembrane = [], basolateralMembrane = [];

        // remove visualized solutes in the next iteration in Load Model page
        var rmFromModelEntityFullNameArray = function (membrane, concentration_fma) {
            for (var i = 0; i < membrane.length; i++) {
                for (var j = 0; j < modelEntityFullNameArray.length; j++) {
                    if (membrane[i].model_entity == modelEntityFullNameArray[j]) {

                        // Remove from modelEntityFullNameArray
                        //// modelEntityFullNameArray.splice(j, 1);

                        // Remove from modelEntityNameArray
                        modelEntityNameArray.splice(j, 1);

                        // Remove from model2DArray
                        model2DArray.forEach(function (elem, index) {
                            if (membrane[i].model_entity == elem[1]) {
                                model2DArray.splice(index, 1);
                            }
                        })
                    }
                }
            }
            for (var i = 0; i < concentration_fma.length; i++) {
                for (var j = 0; j < modelEntityFullNameArray.length; j++) {
                    if (concentration_fma[i].name == modelEntityFullNameArray[j]) {

                        // Remove from modelEntityFullNameArray
                        //// modelEntityFullNameArray.splice(j, 1);

                        // Remove from modelEntityNameArray
                        modelEntityNameArray.splice(j, 1);

                        // Remove from model2DArray
                        model2DArray.forEach(function (elem, index) {
                            if (concentration_fma[i].name == elem[1]) {
                                model2DArray.splice(index, 1);
                            }
                        })
                    }
                }
            }
        }

        // making cotransporter from RDF graph using SPARQL
        mainUtils.makecotransporter = function (membrane1, membrane2) {
            // query to find fluxes in order to make a cotransporter
            var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
                'SELECT ?med_entity_uri ?med_entity_uriCl ' +
                'WHERE { GRAPH ?Workspace { ' +
                '<' + membrane1.model_entity + '> semsim:isComputationalComponentFor ?model_prop. ' +
                '?model_prop semsim:physicalPropertyOf ?model_proc. ' +
                '?model_proc semsim:hasMediatorParticipant ?model_medparticipant. ' +
                '?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity. ' +
                '?med_entity semsim:hasPhysicalDefinition ?med_entity_uri.' +
                '<' + membrane2.model_entity + '> semsim:isComputationalComponentFor ?model_propCl. ' +
                '?model_propCl semsim:physicalPropertyOf ?model_procCl. ' +
                '?model_procCl semsim:hasMediatorParticipant ?model_medparticipantCl. ' +
                '?model_medparticipantCl semsim:hasPhysicalEntityReference ?med_entityCl. ' +
                '?med_entityCl semsim:hasPhysicalDefinition ?med_entity_uriCl.' +
                'FILTER (?med_entity_uri = ?med_entity_uriCl) . ' +
                '}}'

            sendPostRequest(
                endpoint,
                query,
                function (jsonObj) {

                    // console.log("jsonObj in makecotransporter: ", jsonObj);

                    var tempProtein = [], tempApical = [], tempBasolateral = [];

                    // loop to iterate over med_fma and med_pr in jsonObj
                    for (var m = 0; m < jsonObj.results.bindings.length; m++) {
                        var tmpPro = jsonObj.results.bindings[m].med_entity_uri.value;
                        var tmpApi = jsonObj.results.bindings[m].med_entity_uri.value;
                        var tmpBas = jsonObj.results.bindings[m].med_entity_uri.value;

                        if (tmpPro.indexOf(partOfProteinUri) != -1) {
                            tempProtein.push(jsonObj.results.bindings[m].med_entity_uri.value);
                        }

                        if (tmpApi.indexOf(apicalID) != -1) {
                            tempApical.push(jsonObj.results.bindings[m].med_entity_uri.value);
                        }

                        if (tmpBas.indexOf(basolateralID) != -1) {
                            tempBasolateral.push(jsonObj.results.bindings[m].med_entity_uri.value);
                        }
                    }

                    // remove duplicate protein ID
                    // TODO: probably no need to do this!
                    tempProtein = tempProtein.filter(function (item, pos) {
                        return tempProtein.indexOf(item) == pos;
                    })

                    tempApical = tempApical.filter(function (item, pos) {
                        return tempApical.indexOf(item) == pos;
                    })

                    tempBasolateral = tempBasolateral.filter(function (item, pos) {
                        return tempBasolateral.indexOf(item) == pos;
                    })

                    // console.log("temp protein, apical, and basolateral: ", tempProtein, tempApical, tempBasolateral);

                    var membraneOBJ = {
                        solute_chebi: membrane1.solute_chebi,
                        solute_text: membrane1.solute_text,
                        model_entity: membrane1.model_entity,
                        med_fma: membrane1.med_fma,
                        med_pr: membrane1.med_pr,
                        med_pr_text: membrane1.med_pr_text,
                        med_pr_text_syn: membrane1.med_pr_text_syn,
                        variable_text: membrane1.variable_text,
                        source_fma: membrane1.source_fma,
                        sink_fma: membrane1.sink_fma,
                        protein_name: membrane1.protein_name,
                        solute_chebi2: membrane2.solute_chebi,
                        solute_text2: membrane2.solute_text,
                        model_entity2: membrane2.model_entity,
                        variable_text2: membrane2.variable_text,
                        source_fma2: membrane2.source_fma,
                        sink_fma2: membrane2.sink_fma,
                    }

                    // console.log("tempprotein: ", tempProtein);

                    for (var i = 0; i < tempProtein.length; i++) {

                        // console.log("tempprotein inside: ", tempProtein);

                        // cotransporter in apical membrane
                        if (tempProtein.length != 0 && tempApical.length != 0) {
                            apicalMembrane.push(membraneOBJ);
                        }

                        // cotransporter in basolateral membrane
                        if (tempProtein.length != 0 && tempBasolateral.length != 0) {
                            basolateralMembrane.push(membraneOBJ);
                        }
                    }

                    // same solute cotransporter in apical membrane
                    if (membrane1.med_fma == apicalID && membrane2.med_fma == apicalID &&
                        membrane1.med_pr == membrane2.med_pr &&
                        membrane1.model_entity == membrane2.model_entity) {

                        // console.log("tempprotein inside same solute: ", tempProtein);

                        apicalMembrane.push(membraneOBJ);
                    }

                    // same solute cotransporter in basolateral membrane
                    if (membrane1.med_fma == basolateralID && membrane2.med_fma == basolateralID &&
                        membrane1.med_pr == membrane2.med_pr &&
                        membrane1.model_entity == membrane2.model_entity) {
                        basolateralMembrane.push(membraneOBJ);
                    }

                    counter++;

                    if (counter == iteration(membrane.length)) {

                        console.log("membrane in index.js: ", membrane);
                        console.log("apicalMembrane in index.js: ", apicalMembrane);
                        console.log("basolateralMembrane in index.js: ", basolateralMembrane);

                        for (var i = 0; i < membrane.length; i++) {
                            for (var j = 0; j < modelEntityFullNameArray.length; j++) {
                                if (membrane[i].model_entity == modelEntityFullNameArray[j]) {

                                    // Remove from modelEntityFullNameArray
                                    //// modelEntityFullNameArray.splice(j, 1);

                                    // Remove from modelEntityNameArray
                                    modelEntityNameArray.splice(j, 1);

                                    // Remove from model2DArray
                                    model2DArray.forEach(function (elem, index) {
                                        if (membrane[i].model_entity == elem[1]) {
                                            model2DArray.splice(index, 1);
                                        }
                                    })
                                }
                            }
                        }

                        console.log("model2DArr: ", model2DArray);
                        console.log("modelEntityNameArray: ", modelEntityNameArray);
                        console.log("modelEntityFullNameArray: ", modelEntityFullNameArray);

                        epithelialPlatform(
                            combinedMembrane,
                            concentration_fma,
                            source_fma2,
                            sink_fma2,
                            apicalMembrane,
                            basolateralMembrane,
                            membrane
                        );
                    }
                },
                true);
        };

        mainUtils.srcDescMediatorOfFluxes = function () {

            var model;
            if (modelEntityFullNameArray[index] == undefined)
                model = undefined;
            else {
                model = parseModelName(modelEntityFullNameArray[index]);
                model = model + "#" + model.slice(0, model.indexOf('.'));
            }

            // console.log("model: ", model, modelEntityFullNameArray[index]);

            var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                'SELECT ?opb ' +
                'WHERE { ' +
                '<' + modelEntityFullNameArray[index] + '> semsim:isComputationalComponentFor ?model_prop. ' +
                '?model_prop semsim:hasPhysicalDefinition ?opb. ' +
                '}'

            sendPostRequest(
                endpoint,
                query,
                function (jsonObjOPB) {
                    // flux OPB
                    if (jsonObjOPB.results.bindings[0].opb.value == fluxOPB) {

                        var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                            'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
                            'SELECT ?source_fma ?sink_fma ?med_entity_uri ?solute_chebi ?protein ' +
                            'WHERE { ' +
                            '<' + modelEntityFullNameArray[index] + '> semsim:isComputationalComponentFor ?model_prop. ' +
                            '?model_prop semsim:physicalPropertyOf ?model_proc. ' +
                            '?model_proc semsim:hasSourceParticipant ?model_srcparticipant. ' +
                            '?model_srcparticipant semsim:hasPhysicalEntityReference ?source_entity. ' +
                            '?source_entity ro:part_of ?source_part_of_entity. ' +
                            '?source_part_of_entity semsim:hasPhysicalDefinition ?source_fma. ' +
                            '?source_entity semsim:hasPhysicalDefinition ?solute_chebi. ' +
                            '?model_proc semsim:hasSinkParticipant ?model_sinkparticipant. ' +
                            '?model_sinkparticipant semsim:hasPhysicalEntityReference ?sink_entity. ' +
                            '?sink_entity ro:part_of ?sink_part_of_entity. ' +
                            '?sink_part_of_entity semsim:hasPhysicalDefinition ?sink_fma.' +
                            '?model_proc semsim:hasMediatorParticipant ?model_medparticipant.' +
                            '?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity.' +
                            '?med_entity semsim:hasPhysicalDefinition ?med_entity_uri.' +
                            '<' + model + '>  <http://www.obofoundry.org/ro/ro.owl#modelOf> ?protein. ' +
                            '}'

                        sendPostRequest(
                            endpoint,
                            query,
                            function (jsonObjFlux) {

                                console.log("jsonObjFlux in index.js: ", jsonObjFlux);

                                var chebi_uri = jsonObjFlux.results.bindings[0].solute_chebi.value;
                                var indexofColon = chebi_uri.indexOf('CHEBI:');
                                chebi_uri = "http://purl.obolibrary.org/obo/CHEBI_" + chebi_uri.slice(indexofColon + 6);

                                var endpointOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/chebi/terms?iri=" + chebi_uri;
                                sendGetRequest(
                                    endpointOLS,
                                    function (jsonObjOLSChebi) {

                                        // Name of a solute CHEBI from OLS
                                        for (var i = 0; i < jsonObjFlux.results.bindings.length; i++) {
                                            var temparr = jsonObjOLSChebi._embedded.terms[0].annotation["has_related_synonym"],
                                                solute_chebi_name;
                                            for (var m = 0; m < temparr.length; m++) {
                                                if (temparr[m].slice(-1) == '+' || temparr[m].slice(-1) == '-') {
                                                    solute_chebi_name = temparr[m];
                                                    break;
                                                }
                                            }

                                            if (jsonObjFlux.results.bindings[i].solute_chebi == undefined)
                                                solute_chebi.push("");
                                            else
                                                solute_chebi.push(
                                                    {
                                                        name: solute_chebi_name,
                                                        fma: jsonObjFlux.results.bindings[i].solute_chebi.value
                                                    }
                                                );

                                            if (jsonObjFlux.results.bindings[i].source_fma == undefined)
                                                source_fma.push("");
                                            else
                                                source_fma.push(
                                                    {
                                                        name: modelEntityFullNameArray[index],
                                                        fma: jsonObjFlux.results.bindings[i].source_fma.value
                                                    }
                                                );

                                            if (jsonObjFlux.results.bindings[i].sink_fma == undefined)
                                                sink_fma.push("");
                                            else
                                                sink_fma.push(
                                                    {
                                                        name: modelEntityFullNameArray[index],
                                                        fma: jsonObjFlux.results.bindings[i].sink_fma.value
                                                    }
                                                );

                                            if (jsonObjFlux.results.bindings[i].med_entity_uri == undefined) {
                                                med_pr.push("");
                                                med_fma.push("");
                                            }
                                            else {
                                                var temp = jsonObjFlux.results.bindings[i].med_entity_uri.value;
                                                if (temp.indexOf(partOfProteinUri) != -1 || temp.indexOf(partOfCHEBIUri) != -1) {
                                                    med_pr.push({
                                                        // name of med_pr from OLS
                                                        name: modelEntityFullNameArray[index],
                                                        fma: jsonObjFlux.results.bindings[i].med_entity_uri.value
                                                    });
                                                }
                                                else {
                                                    med_fma.push(
                                                        {
                                                            name: modelEntityFullNameArray[index],
                                                            fma: jsonObjFlux.results.bindings[i].med_entity_uri.value
                                                        }
                                                    );
                                                }
                                            }
                                        }

                                        // remove duplicate fma
                                        solute_chebi = uniqueifyEpithelial(solute_chebi);
                                        source_fma = uniqueifyEpithelial(source_fma);
                                        sink_fma = uniqueifyEpithelial(sink_fma);
                                        med_pr = uniqueifyEpithelial(med_pr);
                                        med_fma = uniqueifyEpithelial(med_fma);

                                        // console.log("med_pr[0] in index.js: ", med_pr[0]);

                                        var medURI, endpointOLS;
                                        if (med_pr[0] == undefined)
                                            medURI = jsonObjFlux.results.bindings[0].protein.value;
                                        else
                                            medURI = med_pr[0].fma;

                                        if (medURI.indexOf(partOfCHEBIUri) != -1) {
                                            var indexofColon = medURI.indexOf('CHEBI:');
                                            chebi_uri = "http://purl.obolibrary.org/obo/CHEBI_" + medURI.slice(indexofColon + 6);
                                            endpointOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/chebi/terms?iri=" + chebi_uri;
                                        }
                                        else
                                            endpointOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/pr/terms?iri=" + medURI;

                                        sendGetRequest(
                                            endpointOLS,
                                            function (jsonObjOLSMedPr) {

                                                console.log("jsonObjOLSMedPr in index.js: ", jsonObjOLSMedPr, medURI);

                                                index++;

                                                if (source_fma.length != 0) { // flux

                                                    if (source_fma.length == 1) { // transporter (single flux)

                                                        var srctext = parserFmaNameText(source_fma[0]), // get this from OLS
                                                            temp_med_pr, med_pr_text_syn;

                                                        // No mediator protein in NHE3, SGLT models
                                                        if (med_pr[0] == undefined)
                                                            temp_med_pr = undefined;
                                                        else
                                                            temp_med_pr = med_pr[0].fma;

                                                        var tempvar;
                                                        if (jsonObjOLSMedPr._embedded.terms[0].annotation["has_related_synonym"] == undefined) {
                                                            // med_pr_text_syn = undefined;
                                                            med_pr_text_syn = jsonObjOLSMedPr._embedded.terms[0].annotation["id"][0].slice(3);
                                                        }

                                                        else {
                                                            tempvar = jsonObjOLSMedPr._embedded.terms[0].annotation["has_related_synonym"];
                                                            med_pr_text_syn = tempvar[0].toUpperCase();
                                                        }

                                                        membrane.push({
                                                            solute_chebi: solute_chebi[0].fma,
                                                            solute_text: solute_chebi[0].name,
                                                            variable_text: srctext,
                                                            source_fma: source_fma[0].fma,
                                                            model_entity: source_fma[0].name,
                                                            sink_fma: sink_fma[0].fma,
                                                            med_fma: med_fma[0].fma,
                                                            med_pr: temp_med_pr,
                                                            med_pr_text: jsonObjOLSMedPr._embedded.terms[0].label,
                                                            med_pr_text_syn: med_pr_text_syn,
                                                            protein_name: jsonObjFlux.results.bindings[0].protein.value
                                                        });

                                                        source_fma2.push(source_fma[0]);
                                                        sink_fma2.push(sink_fma[0]);

                                                    }
                                                    else { // same solute co-transporter

                                                        // console.log("ELSE source_fma.length == 1");
                                                        // console.log("modelEntity: ", modelEntity);
                                                        // console.log("biologicalMeaning: ", biologicalMeaning);
                                                        // console.log("speciesList: ", speciesList);
                                                        // console.log("geneList: ", geneList);
                                                        // console.log("proteinList: ", proteinList);

                                                        // Swap if source and sink have same direction
                                                        if (source_fma[0].fma == sink_fma[0].fma) {

                                                            // console.log("inside same faces", source_fma[0], sink_fma[0]);

                                                            var tempFMA = sink_fma[0].fma,
                                                                tempName = sink_fma[0].name;

                                                            sink_fma[0].fma = sink_fma[1].fma;
                                                            sink_fma[0].name = sink_fma[1].name;
                                                            sink_fma[1].fma = tempFMA;
                                                            sink_fma[1].name = tempName;
                                                        }

                                                        for (var i = 0; i < source_fma.length; i++) {
                                                            var srctext = parserFmaNameText(source_fma[i]),
                                                                temp_med_pr, med_pr_text_syn;

                                                            if (med_pr[i] == undefined)
                                                                temp_med_pr = undefined;
                                                            else
                                                                temp_med_pr = med_pr[0].fma;

                                                            var tempvar;
                                                            if (jsonObjOLSMedPr._embedded.terms[0].annotation["has_related_synonym"] == undefined) {
                                                                // med_pr_text_syn = undefined;
                                                                med_pr_text_syn = jsonObjOLSMedPr._embedded.terms[0].annotation["id"][0].slice(3);
                                                            }
                                                            else {
                                                                tempvar = jsonObjOLSMedPr._embedded.terms[0].annotation["has_related_synonym"];
                                                                med_pr_text_syn = tempvar[0].toUpperCase();
                                                            }

                                                            membrane.push({
                                                                solute_chebi: solute_chebi[0].fma,
                                                                solute_text: solute_chebi[0].name,
                                                                variable_text: srctext,
                                                                source_fma: source_fma[i].fma,
                                                                model_entity: source_fma[i].name,
                                                                sink_fma: sink_fma[i].fma,
                                                                med_fma: med_fma[0].fma,
                                                                med_pr: temp_med_pr,
                                                                med_pr_text: jsonObjOLSMedPr._embedded.terms[0].label,
                                                                med_pr_text_syn: med_pr_text_syn,
                                                                protein_name: jsonObjFlux.results.bindings[0].protein.value
                                                            });

                                                            source_fma2.push(source_fma[i]);
                                                            sink_fma2.push(sink_fma[i]);
                                                        }
                                                    }
                                                }

                                                source_fma = [];
                                                sink_fma = [];
                                                med_fma = [];
                                                med_pr = [];
                                                solute_chebi = [];

                                                if (index == modelEntityFullNameArray.length) {

                                                    // special case: one flux is chosen
                                                    if (membrane.length <= 1) {

                                                        rmFromModelEntityFullNameArray(membrane, concentration_fma);

                                                        console.log("model2DArr: ", model2DArray);
                                                        console.log("modelEntityNameArray: ", modelEntityNameArray);
                                                        console.log("modelEntityFullNameArray: ", modelEntityFullNameArray);

                                                        epithelialPlatform(
                                                            combinedMembrane,
                                                            concentration_fma,
                                                            source_fma2,
                                                            sink_fma2,
                                                            apicalMembrane,
                                                            basolateralMembrane,
                                                            membrane);
                                                    }
                                                    else {

                                                        console.log("membrane.length >= 1 membrane: ", membrane);

                                                        rmFromModelEntityFullNameArray(membrane, concentration_fma);

                                                        for (var i = 0; i < membrane.length; i++) {
                                                            for (var j = i + 1; j < membrane.length; j++) {
                                                                mainUtils.makecotransporter(membrane[i], membrane[j]);
                                                            }
                                                        }
                                                    }

                                                    return;
                                                }
                                                else
                                                    mainUtils.srcDescMediatorOfFluxes(); // callback

                                            },
                                            true);
                                    },
                                    true);
                            },
                            true);
                    }

                    // concentration OPB
                    else if (jsonObjOPB.results.bindings[0].opb.value == concentrationOPB) {

                        var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                            'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
                            'SELECT ?concentration_fma ?solute_chebi ?protein ' +
                            'WHERE { ' +
                            '<' + modelEntityFullNameArray[index] + '> semsim:isComputationalComponentFor ?model_prop. ' +
                            '?model_prop semsim:physicalPropertyOf ?source_entity. ' +
                            '?source_entity ro:part_of ?source_part_of_entity. ' +
                            '?source_part_of_entity semsim:hasPhysicalDefinition ?concentration_fma.' +
                            '?source_entity semsim:hasPhysicalDefinition ?solute_chebi. ' +
                            '<' + model + '>  <http://www.obofoundry.org/ro/ro.owl#modelOf> ?protein. ' +
                            '}'

                        sendPostRequest(
                            endpoint,
                            query,
                            function (jsonObjCon) {
                                console.log("jsonObjCon in index.js: ", jsonObjCon);

                                for (var i = 0; i < jsonObjCon.results.bindings.length; i++) {
                                    if (jsonObjCon.results.bindings[i].concentration_fma == undefined)
                                        concentration_fma.push("");
                                    else
                                        concentration_fma.push(
                                            {
                                                name: modelEntityFullNameArray[index],
                                                fma: jsonObjCon.results.bindings[i].concentration_fma.value
                                            }
                                        );
                                }

                                index++;

                                if (index == modelEntityFullNameArray.length) {

                                    // special case: one concentration is chosen
                                    if (membrane.length <= 1) {

                                        console.log("membrane.length <= 1: ", membrane);

                                        rmFromModelEntityFullNameArray(membrane, concentration_fma);

                                        console.log("model2DArr: ", model2DArray);
                                        console.log("modelEntityNameArray: ", modelEntityNameArray);
                                        console.log("modelEntityFullNameArray: ", modelEntityFullNameArray);
                                        console.log("concentration_fma: ", concentration_fma);

                                        epithelialPlatform(
                                            combinedMembrane,
                                            concentration_fma,
                                            source_fma2,
                                            sink_fma2,
                                            apicalMembrane,
                                            basolateralMembrane,
                                            membrane);
                                    }
                                    else {

                                        console.log("membrane.length >= 1 membrane: ", membrane);

                                        rmFromModelEntityFullNameArray(membrane, concentration_fma);

                                        for (var i = 0; i < membrane.length; i++) {
                                            for (var j = i + 1; j < membrane.length; j++) {
                                                mainUtils.makecotransporter(membrane[i], membrane[j]);
                                            }
                                        }
                                    }

                                    return;
                                }
                                else
                                    mainUtils.srcDescMediatorOfFluxes(); // callback
                            },
                            true);
                    }
                },
                true);
        }

        mainUtils.srcDescMediatorOfFluxes();
    };

    // Expose utility to the global object
    global.$mainUtils = mainUtils;

})
(window);
/**
 * Created by dsar941 on 9/8/2016.
 */
var parseModelName = require("./miscellaneous.js").parseModelName;
var parserFmaNameText = require("./miscellaneous.js").parserFmaNameText;
var uniqueifyEpithelial = require("./miscellaneous.js").uniqueifyEpithelial;
var uniqueifymodel2DArray = require("./miscellaneous.js").uniqueifymodel2DArray;
var uniqueifyjsonModel = require("./miscellaneous.js").uniqueifyjsonModel;
var isExist = require("./miscellaneous.js").isExist;
var isExistModel2DArray = require("./miscellaneous.js").isExistModel2DArray;
var iteration = require("./miscellaneous.js").iteration;
var viewModel = require("./viewModel.js").viewModel;
var similarityModels = require("./similarityModels.js").similarityModels;
var epithelialPlatform = require("./epithelialPlatform.js").epithelialPlatform;
var showLoading = require("./miscellaneous.js").showLoading;
var makecotransporterSPARQL = require("./sparqlUtils.js").makecotransporterSPARQL;
var srcDescMediatorOfFluxesSPARQL = require("./sparqlUtils.js").srcDescMediatorOfFluxesSPARQL;
var opbSPARQL = require("./sparqlUtils.js").opbSPARQL;
var concentrationOPBSPARQL = require("./sparqlUtils.js").concentrationOPBSPARQL;
var discoveryWithFlux = require("./sparqlUtils.js").discoveryWithFlux;
var discoveryWithFluxOfSolute = require("./sparqlUtils.js").discoveryWithFluxOfSolute;
var discoveryWithConcentrationOfSolute = require("./sparqlUtils.js").discoveryWithConcentrationOfSolute;
var loadViewHtmlSPARQL = require("./sparqlUtils.js").loadViewHtmlSPARQL;
var dictionary = require("./sparqlUtils.js").dictionary;
var homeHtml = require("./sparqlUtils.js").homeHtml;
var viewHtml = require("./sparqlUtils.js").viewHtml;
var modelHtml = require("./sparqlUtils.js").modelHtml;
var searchHtml = require("./sparqlUtils.js").searchHtml;
var similarityHtml = require("./sparqlUtils.js").similarityHtml;
var epithelialHtml = require("./sparqlUtils.js").epithelialHtml;
var apicalID = require("./sparqlUtils.js").apicalID;
var basolateralID = require("./sparqlUtils.js").basolateralID;
var partOfProteinUri = require("./sparqlUtils.js").partOfProteinUri;
var partOfGOUri = require("./sparqlUtils.js").partOfGOUri;
var partOfCHEBIUri = require("./sparqlUtils.js").partOfCHEBIUri;
var fluxOPB = require("./sparqlUtils.js").fluxOPB;
var concentrationOPB = require("./sparqlUtils.js").concentrationOPB;
var endpoint = require("./sparqlUtils.js").endpoint;

var sendGetRequest = require("./../libs/ajax-utils.js").sendGetRequest;
var sendPostRequest = require("./../libs/ajax-utils.js").sendPostRequest;

(function (global) {
    "use strict";

    var mainUtils = {}, // namespace for utility
        templistOfModel = [], // delete operation
        model = [], // selected models in Load Models
        model2DArray = [],
        combinedMembrane = []; // combine all membranes in epithelialPlatform.js

    var modelEntityName, // search action
        modelEntityNameArray = [], // model action
        modelEntityFullNameArray = [],
        modelEntityInLoadModels = [], // Load Models Entity
        lengthOfLoadModelTable, // switching between pages
        visualizedModelsOnPlatform = [];

    // variables for Model Discovery
    var modelEntity = [],
        biologicalMeaning = [],
        speciesList = [],
        geneList = [],
        proteinList = [],
        listOfURIs = [],
        head = [],
        discIndex = 0;

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
        var uri = "https://github.com/dewancse/epithelial-modelling-platform";
        $("#main-content").html("Documentation can be found at " +
            "<a href=" + uri + " + target=_blank>README.md in github</a>");
    };

    // On page load (before img or CSS)
    $(document).ready(function () {

        // On first load, show home view
        showLoading("#main-content");

        if (sessionStorage.getItem("searchListContent")) {
            $("#main-content").html(sessionStorage.getItem("searchListContent"));
        }
        else {
            // homepage
            sendGetRequest(
                homeHtml,
                function (homeHtmlContent) {
                    $("#main-content").html(homeHtmlContent);

                    $(".carousel").carousel({
                        interval: 2000
                    });
                },
                false);
        }

        $(".dropdown-toggle").dropdown();
    });

    $(document).on({
        click: function () {
            // If there"s an action with the given name, call it
            if (typeof actions[event.target.dataset.action] === "function") {
                actions[event.target.dataset.action].call(this, event);
            }
        },

        keydown: function () {
            // semantic annotation based on search items
            if (event.key == "Enter") {

                var uriOPB, uriCHEBI, keyValue;
                var searchTxt = document.getElementById("searchTxt").value;

                // set local storage
                sessionStorage.setItem("searchTxtContent", searchTxt);

                // dictionary object

                for (var i in dictionary) {
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
                listOfURIs = [];
                head = [];

                discIndex = 0; // discIndex to index each Model_entity

                mainUtils.discoverModels(uriOPB, uriCHEBI, keyValue);
            }
        }
    });

    // Event handling for MODEL DISCOVERY and LOAD MODELS
    var actions = {

        search: function (event) {

            if (event.target.className == "checkbox") {

                if (event.target.checked) {
                    var tempidWithStr = event.target.id,
                        workspaceName = tempidWithStr.slice(0, tempidWithStr.search("#"));

                    mainUtils.workspaceName = workspaceName;
                    mainUtils.tempidWithStr = tempidWithStr;

                    modelEntityName = tempidWithStr;
                }
                else {
                    mainUtils.workspaceName = "";
                    mainUtils.tempidWithStr = "";
                }
            }
        },

        model: function (event) {

            var pos, pos2, i;
            // select one by one
            if (event.target.className == "attribute") {

                if (event.target.checked) {

                    // filter duplicate cellml component for a variable and a model name
                    if (!isExist(event.target.value, templistOfModel)) {
                        templistOfModel.push(event.target.value);

                        // @modelEntityNameArray for similarity graph
                        modelEntityNameArray.push(event.target.value);
                        modelEntityFullNameArray.push(event.target.value);
                    }
                }
                else {
                    pos = templistOfModel.indexOf(event.target.value);
                    templistOfModel.splice(pos, 1);

                    // @modelEntityNameArray for similarity graph
                    pos2 = modelEntityNameArray.indexOf(event.target.value);
                    modelEntityNameArray.splice(pos2, 1);
                    modelEntityFullNameArray.splice(pos2, 1);
                }

                var tempidWithStr = event.target.id,
                    workspaceName = tempidWithStr.slice(0, tempidWithStr.search("#"));

                // @modelEntityNameArray for similarity graph
                mainUtils.workspaceName = workspaceName;
                mainUtils.tempidWithStr = tempidWithStr;
            }

            // select all
            if (event.target.className == "attributeAll") {

                if (event.target.checked == true) {
                    for (var i = 0; i < $(".attribute").length; i++) {
                        $(".attribute")[i].checked = true;

                        // filter duplicate cellml component for a variable and a model name
                        if (!isExist($(".attribute")[i].value, templistOfModel)) {
                            templistOfModel.push($(".attribute")[i].value);

                            // @modelEntityNameArray for similarity graph
                            modelEntityNameArray.push($(".attribute")[i].value);
                            modelEntityFullNameArray.push($(".attribute")[i].value);
                        }
                    }
                }
                else {
                    for (var i = 0; i < $(".attribute").length; i++) {
                        $(".attribute")[i].checked = false;

                        pos = templistOfModel.indexOf($(".attribute")[i].value);
                        templistOfModel.splice(pos, 1);

                        // @modelEntityNameArray for similarity graph
                        pos2 = modelEntityNameArray.indexOf($(".attribute")[i].value);
                        modelEntityNameArray.splice(pos2, 1);
                        modelEntityFullNameArray.splice(pos2, 1);
                    }
                }
            }

            // remove duplicate in templistOfModel
            templistOfModel = templistOfModel.filter(function (item, pos) {
                return templistOfModel.indexOf(item) == pos;
            });

            // remove duplicate in modelEntityNameArray
            modelEntityNameArray = modelEntityNameArray.filter(function (item, pos) {
                return modelEntityNameArray.indexOf(item) == pos;
            });

            // remove duplicate in modelEntityFullNameArray
            modelEntityFullNameArray = modelEntityFullNameArray.filter(function (item, pos) {
                return modelEntityFullNameArray.indexOf(item) == pos;
            });
        }
    };

    // Load search html
    mainUtils.loadSearchHtml = function () {

        if (!sessionStorage.getItem("searchListContent")) {

            // console.log("loadSearchHtml IF");

            sendGetRequest(
                searchHtml,
                function (searchHtmlContent) {
                    $("#main-content").html(searchHtmlContent);
                },
                false);
        }
        else {
            // console.log("loadSearchHtml ELSE");

            $("#main-content").html(sessionStorage.getItem("searchListContent"));

            mainUtils.showDiscoverModels(
                head,
                modelEntity,
                biologicalMeaning,
                speciesList,
                geneList,
                proteinList,
                listOfURIs);
        }
    };

    mainUtils.discoverModels = function (uriOPB, uriCHEBI, keyValue) {

        var query;
        if (uriCHEBI == "") { // model discovery with 'flux'
            query = discoveryWithFlux(uriOPB);
        }
        else {
            if (keyValue == "flux") { // model discovery with 'flux of sodium', etc.
                query = discoveryWithFluxOfSolute(uriCHEBI)
            }
            else { // model disocvery with 'concentration of sodium', etc.
                query = discoveryWithConcentrationOfSolute(uriCHEBI);
            }
        }

        // Model
        sendPostRequest(
            endpoint,
            query,
            function (jsonModel) {

                // REMOVE duplicate cellml model and variable name (NOT component name)
                jsonModel.results.bindings = uniqueifyjsonModel(jsonModel.results.bindings);

                // console.log("discoverModels: jsonModel -> ", jsonModel);

                var discoverInnerModels = function () {
                    if (jsonModel.results.bindings.length == 0) {
                        mainUtils.showDiscoverModels(head, modelEntity, biologicalMeaning, speciesList, geneList, proteinList, listOfURIs);
                        return;
                    }

                    var model = parseModelName(jsonModel.results.bindings[discIndex].Model_entity.value);
                    model = model + "#" + model.slice(0, model.indexOf("."));

                    query = "SELECT ?Protein WHERE { " + "<" + model + "> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein. }";

                    sendPostRequest(
                        endpoint,
                        query,
                        function (jsonProteinUri) {

                            if (jsonProteinUri.results.bindings.length == 0) {
                                discIndex++;

                                if (discIndex != jsonModel.results.bindings.length) {
                                    discoverInnerModels();
                                }
                            }

                            // pig SGLT2 (PR_P31636) does not exist in PR ontology, assign mouse species instead
                            var pr_uri, endpointproteinOLS;
                            if (jsonProteinUri.results.bindings.length == 0)
                                pr_uri = undefined;
                            else
                                pr_uri = jsonProteinUri.results.bindings[0].Protein.value;

                            if (pr_uri != undefined)
                                endpointproteinOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/pr/terms?iri=" + pr_uri;
                            else
                                endpointproteinOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/pr";

                            sendGetRequest(
                                endpointproteinOLS,
                                function (jsonProtein) {

                                    var endpointgeneOLS;
                                    if (jsonProtein._embedded.terms[0]._links.has_gene_template != undefined)
                                        endpointgeneOLS = jsonProtein._embedded.terms[0]._links.has_gene_template.href;
                                    else
                                        endpointgeneOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/pr";

                                    sendGetRequest(
                                        endpointgeneOLS,
                                        function (jsonGene) {

                                            var endpointspeciesOLS;
                                            if (jsonProtein._embedded.terms[0]._links.only_in_taxon != undefined)
                                                endpointspeciesOLS = jsonProtein._embedded.terms[0]._links.only_in_taxon.href;
                                            else
                                                endpointspeciesOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/pr";

                                            sendGetRequest(
                                                endpointspeciesOLS,
                                                function (jsonSpecies) {

                                                    // protein uri
                                                    if (pr_uri != undefined)
                                                        listOfURIs.push(pr_uri);

                                                    // model and biological meaning
                                                    modelEntity.push(jsonModel.results.bindings[discIndex].Model_entity.value);
                                                    biologicalMeaning.push(jsonModel.results.bindings[discIndex].Biological_meaning.value);

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
                                                        geneName = geneName.slice(0, geneName.indexOf("(") - 1);
                                                        geneList.push(geneName);
                                                    }

                                                    // protein
                                                    if (jsonProtein._embedded == undefined)
                                                        proteinList.push("Undefined");
                                                    else {
                                                        var proteinName = jsonProtein._embedded.terms[0].label;
                                                        proteinName = proteinName.slice(0, proteinName.indexOf("(") - 1);
                                                        proteinList.push(proteinName);
                                                    }

                                                    head = ["Model_entity", "Biological_meaning", "Species", "Gene", "Protein"];

                                                    mainUtils.showDiscoverModels(
                                                        head,
                                                        modelEntity,
                                                        biologicalMeaning,
                                                        speciesList,
                                                        geneList,
                                                        proteinList,
                                                        listOfURIs);

                                                    discIndex++; // increment index of modelEntity

                                                    if (discIndex == jsonModel.results.bindings.length) {

                                                        listOfURIs = listOfURIs.filter(function (item, pos) {
                                                            return listOfURIs.indexOf(item) == pos;
                                                        });

                                                        filterByProtein();
                                                        return;
                                                    }

                                                    discoverInnerModels(); // callback
                                                },
                                                true);
                                        },
                                        true);
                                },
                                true);
                        },
                        true);

                }; // end of discoverInnerModels function

                discoverInnerModels(); // first call
            },
            true);
    };

    // Show discovered models from PMR
    mainUtils.showDiscoverModels = function (head, modelEntity, biologicalMeaning, speciesList, geneList, proteinList, listOfURIs) {

        // Empty search result
        if (head.length == 0) {
            $("#searchList").html(
                "<section class=container-fluid><label><br>No Search Results!</label></section>"
            );

            return;
        }

        // Reinitialize for a new search result
        $("#searchList").html("");

        var table = $("<table/>").addClass("table table-hover table-condensed"); //table-bordered table-striped

        // Table header
        var thead = $("<thead/>"), tr = $("<tr/>"), i;
        for (var i in head) {
            // Empty header for checkbox column
            if (i == 0)
                tr.append($("<th/>").append(""));

            tr.append($("<th/>").append(head[i]));
        }

        thead.append(tr);
        table.append(thead);

        // Table body
        var tbody = $("<tbody/>");
        for (var i in modelEntity) {
            var temp = [];
            tr = $("<tr/>");
            temp.push(modelEntity[i], biologicalMeaning[i], speciesList[i], geneList[i], proteinList[i]);

            for (var j in temp) {
                if (j == 0) {
                    tr.append($("<td/>")
                        .append($("<label/>")
                            .html("<input id=" + modelEntity[i] + " uri=" + listOfURIs[i] + " type=checkbox " +
                                "data-action=search value=" + modelEntity[i] + " + class=checkbox>")));
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
        $("#searchTxt").attr("value", sessionStorage.getItem("searchTxtContent"));

        // SET main content in local storage
        sessionStorage.setItem("searchListContent", $("#main-content").html());
    };

    // Load the view
    mainUtils.loadViewHtml = function () {

        var cellmlModel = mainUtils.workspaceName;

        if (cellmlModel == undefined) {
            $("#main-content").html("Please select a model from Model Discovery");

            return;
        }

        cellmlModel = cellmlModel + "#" + cellmlModel.slice(0, cellmlModel.indexOf("."));

        var query = loadViewHtmlSPARQL(cellmlModel);

        showLoading("#main-content");
        sendPostRequest(
            endpoint,
            query,
            function () {
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

    // extension of loadModelHtml function
    var findCompartmentLoc = function (jsonObjComp, jsonObjLoc, tempidWithStr, protein, species, gene) {
        var tempComp = "", counterOLS = 0;
        for (var i in jsonObjComp.results.bindings) {
            var fma_uri = jsonObjComp.results.bindings[i].Compartment.value;
            fma_uri = "http://purl.org/sig/ont/fma/fma" + fma_uri.slice(fma_uri.indexOf("FMA:") + 4);

            var endpointOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/fma/terms?iri=" + fma_uri;
            sendGetRequest(
                endpointOLS,
                function (jsonObjOLS) {

                    counterOLS++;
                    tempComp += jsonObjOLS._embedded.terms[0].label;
                    if (counterOLS < jsonObjComp.results.bindings.length) tempComp += ", ";
                    else tempComp += "";

                    if (counterOLS == jsonObjComp.results.bindings.length) {
                        var tempLoc = "", counterOLSLoc = 0;
                        for (var i in jsonObjLoc.results.bindings) {
                            var fma_uri = jsonObjLoc.results.bindings[i].Located_in.value;
                            fma_uri = "http://purl.org/sig/ont/fma/fma" + fma_uri.slice(fma_uri.indexOf("FMA:") + 4);

                            var endpointOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/fma/terms?iri=" + fma_uri;
                            sendGetRequest(
                                endpointOLS,
                                function (jsonObjOLSLoc) {

                                    counterOLSLoc++;
                                    tempLoc += jsonObjOLSLoc._embedded.terms[0].label;
                                    if (counterOLSLoc < jsonObjLoc.results.bindings.length) tempLoc += ", ";
                                    else tempLoc += "";

                                    if (counterOLSLoc == jsonObjLoc.results.bindings.length) {
                                        var jsonObj = {
                                            "Model_entity": tempidWithStr,
                                            "Protein": protein,
                                            "Species": species,
                                            "Gene": gene,
                                            "Compartment": tempComp,
                                            "Located_in": tempLoc
                                        };

                                        mainUtils.showModel(jsonObj);
                                    }
                                },
                                true);
                        }
                    }
                },
                true);
        }
    };

    // Load the model
    mainUtils.loadModelHtml = function () {

        var model = mainUtils.workspaceName;

        if (model == undefined)
            model = undefined;
        else
            model = model + "#" + model.slice(0, model.indexOf("."));

        var query = "SELECT ?Protein WHERE { " + "<" + model + "> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein. }";

        sendPostRequest(
            endpoint,
            query,
            function (jsonProteinUri) {

                // console.log("loadModelHtml: jsonProteinUri -> ", jsonProteinUri);

                var pr_uri, endpointproteinOLS;
                if (jsonProteinUri.results.bindings.length == 0)
                    pr_uri = undefined;
                else
                    pr_uri = jsonProteinUri.results.bindings[0].Protein.value;

                if (pr_uri != undefined)
                    endpointproteinOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/pr/terms?iri=" + pr_uri;
                else
                    endpointproteinOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/pr";

                sendGetRequest(
                    endpointproteinOLS,
                    function (jsonProtein) {

                        // console.log("loadModelHtml: jsonProtein -> ", jsonProtein);

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

                                        var query = "SELECT ?Compartment " +
                                            "WHERE { " + "<" + model + "> <http://www.obofoundry.org/ro/ro.owl#compartmentOf> ?Compartment. }";

                                        sendPostRequest(
                                            endpoint,
                                            query,
                                            function (jsonObjComp) {

                                                var query = "SELECT ?Located_in " +
                                                    "WHERE { " + "<" + model + "> <http://www.obofoundry.org/ro/ro.owl#located_in> ?Located_in. }";

                                                sendPostRequest(
                                                    endpoint,
                                                    query,
                                                    function (jsonObjLoc) {
                                                        sendGetRequest(
                                                            modelHtml,
                                                            function (modelHtmlContent) {
                                                                $("#main-content").html(modelHtmlContent);

                                                                if (jsonObjComp.results.bindings.length == 0 &&
                                                                    jsonObjLoc.results.bindings.length == 0) {
                                                                    var jsonObj = {};
                                                                    mainUtils.showModel(jsonObj);
                                                                }

                                                                var species, gene, protein;
                                                                if (jsonSpecies._embedded == undefined)
                                                                    species = "Undefined";
                                                                else
                                                                    species = jsonSpecies._embedded.terms[0].label;

                                                                if (jsonGene._embedded == undefined)
                                                                    gene = "Undefined";
                                                                else {
                                                                    var geneName = jsonGene._embedded.terms[0].label;
                                                                    var indexOfParen = geneName.indexOf("(");
                                                                    geneName = geneName.slice(0, indexOfParen - 1);
                                                                    gene = geneName;
                                                                }

                                                                if (jsonProtein._embedded == undefined) // jsonProtein._embedded.terms.length
                                                                    protein = "Undefined";
                                                                else {
                                                                    var proteinName = jsonProtein._embedded.terms[0].label;
                                                                    proteinName = proteinName.slice(0, proteinName.indexOf("(") - 1);
                                                                    protein = proteinName;
                                                                }

                                                                // compartment and location in load model
                                                                findCompartmentLoc(jsonObjComp, jsonObjLoc, mainUtils.tempidWithStr, protein, species, gene);
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
    };

    // Show selected models
    mainUtils.showModel = function (jsonObj) {

        if (modelEntityInLoadModels.indexOf(jsonObj.Model_entity) == -1) {
            var index = modelEntity.indexOf(jsonObj.Model_entity);
            modelEntityInLoadModels.push([
                jsonObj.Model_entity,
                biologicalMeaning[index],
                speciesList[index],
                geneList[index],
                proteinList[index]]);
        }

        if (modelEntity.indexOf(jsonObj.Model_entity) != -1) {
            var index = modelEntity.indexOf(jsonObj.Model_entity);
            modelEntity.splice(index, 1);
            biologicalMeaning.splice(index, 1);
            speciesList.splice(index, 1);
            geneList.splice(index, 1);
            proteinList.splice(index, 1);
        }

        // Empty result
        if ($.isEmptyObject(jsonObj)) {
            $("#modelList").html("Please load models from Model Discovery");

            return;
        }

        var head = [];
        for (var name in jsonObj) {
            head.push(name);
        }

        var table = $("<table/>").addClass("table table-hover table-condensed"); //table-bordered table-striped

        // Table header
        var thead = $("<thead/>"), tr = $("<tr/>"), i;
        for (var i in head) {
            if (i == 0) {
                tr.append($("<th/>")
                    .append($("<label/>")
                        .html("<input id=" + head[0] + " + type=checkbox name=attributeAll " +
                            "class=attributeAll data-action=model value=" + head[0] + " >")));
            }

            tr.append($("<th/>").append(head[i]));
        }

        thead.append(tr);
        table.append(thead);

        for (var i in head) {
            if (i == 0) {
                // search list to model list with empty model
                if (jsonObj.length == 0) break;

                if (isExistModel2DArray(modelEntityName, model2DArray))
                    break;

                model.push($("<label/>").html("<input id=" + modelEntityName + " + type=checkbox " +
                    "name=attribute class=attribute data-action=model value=" + modelEntityName + " >"));
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

        // Table body
        var tbody = $("<tbody/>"), td = [];
        for (var i in model2DArray) {
            tr = $("<tr/>");
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

        // delete already visualized models on the platform
        visualizedModelsOnPlatform.forEach(function (element) {
            for (var i = 0; i < $("table tr").length; i++) {

                if ($("table tr")[i].id == element) {
                    // Remove selected row
                    $("table tr")[i].remove();

                    // Remove from model2DArray
                    model2DArray.forEach(function (elem, index) {
                        if (element == elem[1]) {
                            model2DArray.splice(index, 1);
                        }
                    });
                }
            }
        });

        // Uncheck checkboxes when back from Similarity models
        for (i = 0; i < $("table tr td label").length; i++) {
            if ($("table tr td label")[i].firstChild.checked == true) {
                $("table tr td label")[i].firstChild.checked = false;
            }
        }

        lengthOfLoadModelTable = $("table tr").length;
        if (lengthOfLoadModelTable == 1) {
            mainUtils.workspaceName = "";
            $("#modelList").html("Please load models from Model Discovery");
            return;
        }
    };

    // Filter search results
    mainUtils.filterSearchHtml = function () {

        if ($("#membraneId").val() == "all") {
            $("table tr").show();
        }
        else {
            var selectedprotein = $("#membraneId option:selected").val();

            for (var i = 1; i < $("table tr").length; i++) {

                var tempstr = $("table tr")[i];
                tempstr = $($(tempstr).find("input")).attr("uri");

                if (selectedprotein == tempstr) {
                    $("table tr")[i].hidden = false;
                }
                else {
                    $("table tr")[i].hidden = true;
                }
            }
        }
    };

    // Filter dropdown list in the search html
    var filterByProtein = function () {
        // Initializing the dropdown list
        $("#membraneId").empty();
        $("#membraneId").append("<option value=all>select all</option>");

        var tmpProteinList = [];
        for (var i in proteinList) {
            tmpProteinList[i] = proteinList[i];
        }

        tmpProteinList = tmpProteinList.filter(function (item, pos) {
            return tmpProteinList.indexOf(item) == pos;
        });

        for (var i in tmpProteinList) {
            $("#membraneId").append("<option value=" + listOfURIs[i] + ">" + tmpProteinList[i] + "</option>");
        }
    };

    // Delete model
    mainUtils.deleteRowModelHtml = function () {

        templistOfModel.forEach(function (element, tempIndex) {
            for (var i = 0; i < $("table tr").length; i++) {

                if ($("table tr")[i].id == element) {
                    // Remove selected row
                    $("table tr")[i].remove();

                    // Remove from model2DArray
                    model2DArray.forEach(function (elem, index) {
                        if (element == elem[1]) {
                            model2DArray.splice(index, 1);
                        }
                    });

                    // Remove from templistOfModel
                    templistOfModel.splice(tempIndex, 1);

                    // Remove from modelEntityInLoadModels
                    modelEntityInLoadModels.forEach(function (elem, index) {
                        if (element == elem[0]) {

                            // push it back to MODEL DISCOVERY
                            modelEntity.push(elem[0]);
                            biologicalMeaning.push(elem[1]);
                            speciesList.push(elem[2]);
                            geneList.push(elem[3]);
                            proteinList.push(elem[4]);

                            // delete from LOAD MODELS
                            modelEntityInLoadModels.splice(index, 1);
                        }
                    });

                    // Remove from modelEntityNameArray
                    modelEntityNameArray.splice(tempIndex, 1);

                    // Remove from modelEntityFullNameArray
                    modelEntityFullNameArray.splice(tempIndex, 1);
                }
            }
        });

        lengthOfLoadModelTable = $("table tr").length;
        if (lengthOfLoadModelTable == 1) {
            mainUtils.workspaceName = "";
            $("#modelList").html("Please load models from Model Discovery");
            return;
        }
    };

    // Load the SVG model
    mainUtils.loadSimilarityHtml = function () {

        sendGetRequest(
            similarityHtml,
            function (similarityHtmlContent) {
                $("#main-content").html(similarityHtmlContent);

                sendGetRequest(
                    similarityHtml,
                    function () {
                        similarityModels(model2DArray, modelEntityNameArray);

                        // Reinitialize to display only selected models on the Platform
                        templistOfModel = [];
                        modelEntityNameArray = [];
                        modelEntityFullNameArray = [];
                    },
                    false);
            },
            false);
    };

    // Load the epithelial
    mainUtils.loadEpithelialHtml = function () {

        // make empty list in LOAD MODELS
        if (lengthOfLoadModelTable == 2) {
            mainUtils.workspaceName = "";
            $("#modelList").html("Please load models from Model Discovery");
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
    mainUtils.loadEpithelial = function () {

        // remove model name, keep only solutes
        for (var i in modelEntityNameArray) {
            var indexOfHash = modelEntityNameArray[i].search("#");
            modelEntityNameArray[i] = modelEntityNameArray[i].slice(indexOfHash + 1);
        }

        console.log("loadEpithelial: model2DArr -> ", model2DArray);
        console.log("loadEpithelial: modelEntityNameArray -> ", modelEntityNameArray);
        console.log("loadEpithelial: modelEntityFullNameArray -> ", modelEntityFullNameArray);
        console.log("loadEpithelial: templistOfModel -> ", templistOfModel);

        var source_fma = [], sink_fma = [], med_fma = [], med_pr = [], source_fma2 = [],
            sink_fma2 = [], solute_chebi = [], index = 0, counter = 0,
            membrane = [], apicalMembrane = [], basolateralMembrane = [];

        // empty platform as no model is selected
        if (modelEntityFullNameArray.length == 0) {
            epithelialPlatform(
                combinedMembrane,
                concentration_fma,
                source_fma2,
                sink_fma2,
                apicalMembrane,
                basolateralMembrane,
                membrane);

            return;
        }

        // remove visualized solutes in the next iteration in Load Model page
        var rmFromModelEntityFullNameArray = function (membrane, concentration_fma) {

            for (var i in membrane) {
                for (var j in modelEntityFullNameArray) {
                    if (membrane[i].model_entity == modelEntityFullNameArray[j]) {

                        // add models to delete from Load Models table row
                        visualizedModelsOnPlatform.push(modelEntityFullNameArray[j]);

                        // Remove from modelEntityFullNameArray
                        modelEntityFullNameArray.splice(j, 1);

                        // Remove from modelEntityNameArray
                        modelEntityNameArray.splice(j, 1);

                        // Remove from model2DArray
                        model2DArray.forEach(function (elem, index) {
                            if (membrane[i].model_entity == elem[1]) {
                                model2DArray.splice(index, 1);
                            }
                        });

                        // Remove from templistOfModel
                        templistOfModel.forEach(function (elem, index) {
                            if (membrane[i].model_entity == elem) {
                                templistOfModel.splice(index, 1);
                            }
                        });

                        // Remove from modelEntity
                        modelEntity.forEach(function (elem, index) {
                            if (membrane[i].model_entity == elem) {
                                modelEntity.splice(index, 1);
                            }
                        });
                    }
                }
            }

            for (var i in concentration_fma) {
                for (var j in modelEntityFullNameArray) {
                    if (concentration_fma[i].name == modelEntityFullNameArray[j]) {

                        // add models to delete from Load Models table row
                        visualizedModelsOnPlatform.push(modelEntityFullNameArray[j]);

                        // Remove from modelEntityFullNameArray
                        modelEntityFullNameArray.splice(j, 1);

                        // Remove from modelEntityNameArray
                        modelEntityNameArray.splice(j, 1);

                        // Remove from model2DArray
                        model2DArray.forEach(function (elem, index) {
                            if (concentration_fma[i].name == elem[1]) {
                                model2DArray.splice(index, 1);
                            }
                        });

                        // Remove from modelEntity
                        modelEntity.forEach(function (elem, index) {
                            if (concentration_fma[i].name == elem) {
                                modelEntity.splice(index, 1);
                            }
                        });
                    }
                }
            }
        };

        mainUtils.makecotransporter = function (membrane1, membrane2) {

            var query = makecotransporterSPARQL(membrane1.model_entity, membrane2.model_entity);
            sendPostRequest(
                endpoint,
                query,
                function (jsonObj) {

                    var tempProtein = [], tempApical = [], tempBasolateral = [];

                    // iterate over med_fma and med_pr in jsonObj
                    for (var m in jsonObj.results.bindings) {
                        var tmpuri = jsonObj.results.bindings[m].med_entity_uri.value;

                        if (tmpuri.indexOf(partOfProteinUri) != -1) {
                            tempProtein.push(jsonObj.results.bindings[m].med_entity_uri.value);
                        }

                        if (tmpuri.indexOf(apicalID) != -1) {
                            tempApical.push(jsonObj.results.bindings[m].med_entity_uri.value);
                        }

                        if (tmpuri.indexOf(basolateralID) != -1) {
                            tempBasolateral.push(jsonObj.results.bindings[m].med_entity_uri.value);
                        }
                    }

                    // console.log("temp protein, apical, and basolateral: ", tempProtein, tempApical, tempBasolateral);

                    // check med_pr, med_pr_text and med_pr_text_syn
                    var tmp_med_pr, tmp_med_pr_text, tmp_med_pr_text_syn;
                    if (tempProtein[0] == membrane1.med_pr) {
                        tmp_med_pr = membrane1.med_pr;
                        tmp_med_pr_text = membrane1.med_pr_text;
                        tmp_med_pr_text_syn = membrane1.med_pr_text_syn;
                    }
                    else {
                        tmp_med_pr = membrane2.med_pr;
                        tmp_med_pr_text = membrane2.med_pr_text;
                        tmp_med_pr_text_syn = membrane2.med_pr_text_syn;
                    }

                    var membraneOBJ = {
                        solute_chebi: membrane1.solute_chebi,
                        solute_text: membrane1.solute_text,
                        model_entity: membrane1.model_entity,
                        med_fma: membrane1.med_fma,
                        med_pr: tmp_med_pr, // membrane1.med_pr,
                        med_pr_text: tmp_med_pr_text, // membrane1.med_pr_text,
                        med_pr_text_syn: tmp_med_pr_text_syn, // membrane1.med_pr_text_syn,
                        variable_text: membrane1.variable_text,
                        source_fma: membrane1.source_fma,
                        sink_fma: membrane1.sink_fma,
                        protein_name: membrane1.protein_name,
                        solute_chebi2: membrane2.solute_chebi,
                        solute_text2: membrane2.solute_text,
                        model_entity2: membrane2.model_entity,
                        variable_text2: membrane2.variable_text,
                        source_fma2: membrane2.source_fma,
                        sink_fma2: membrane2.sink_fma
                    };

                    for (var i in tempProtein) {

                        // cotransporter in apical membrane
                        if (tempProtein.length != 0 && tempApical.length != 0) {
                            apicalMembrane.push(membraneOBJ);
                        }

                        // cotransporter in basolateral membrane
                        if (tempProtein.length != 0 && tempBasolateral.length != 0) {
                            basolateralMembrane.push(membraneOBJ);
                        }
                    }

                    if (membrane1.med_pr == membrane2.med_pr && membrane1.model_entity == membrane2.model_entity) {

                        // same solute cotransporter in apical membrane
                        if (membrane1.med_fma == apicalID && membrane2.med_fma == apicalID)
                            apicalMembrane.push(membraneOBJ);

                        // same solute cotransporter in basolateral membrane
                        if (membrane1.med_fma == basolateralID && membrane2.med_fma == basolateralID)
                            basolateralMembrane.push(membraneOBJ);
                    }

                    counter++;

                    if (counter == iteration(membrane.length)) {

                        rmFromModelEntityFullNameArray(membrane, concentration_fma);

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

            var model, query, i;
            if (modelEntityFullNameArray[index] == undefined)
                model = undefined;
            else {
                model = parseModelName(modelEntityFullNameArray[index]);
                model = model + "#" + model.slice(0, model.indexOf("."));
            }

            query = opbSPARQL(modelEntityFullNameArray[index]);

            sendPostRequest(
                endpoint,
                query,
                function (jsonObjOPB) {
                    if (jsonObjOPB.results.bindings[0].opb.value == fluxOPB) {

                        query = srcDescMediatorOfFluxesSPARQL(modelEntityFullNameArray[index], model);

                        sendPostRequest(
                            endpoint,
                            query,
                            function (jsonObjFlux) {

                                console.log("srcDescMediatorOfFluxes: jsonObjFlux -> ", jsonObjFlux);

                                var chebi_uri = jsonObjFlux.results.bindings[0].solute_chebi.value;
                                var indexofColon = chebi_uri.indexOf("CHEBI:");
                                chebi_uri = "http://purl.obolibrary.org/obo/CHEBI_" + chebi_uri.slice(indexofColon + 6);

                                var endpointOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/chebi/terms?iri=" + chebi_uri;
                                sendGetRequest(
                                    endpointOLS,
                                    function (jsonObjOLSChebi) {

                                        // Name of a solute CHEBI from OLS
                                        for (var i in jsonObjFlux.results.bindings) {
                                            var temparr = jsonObjOLSChebi._embedded.terms[0].annotation["has_related_synonym"],
                                                solute_chebi_name;
                                            for (var m = 0; m < temparr.length; m++) {
                                                if (temparr[m].slice(-1) == "+" || temparr[m].slice(-1) == "-") {
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
                                                if (temp.indexOf(partOfProteinUri) != -1 || temp.indexOf(partOfGOUri) != -1 || temp.indexOf(partOfCHEBIUri) != -1) {
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

                                        console.log("srcDescMediatorOfFluxes: med_pr -> ", med_pr[0], med_pr);

                                        var medURI, endpointOLS, srctext, temp_med_pr, med_pr_text_syn, tempvar;

                                        if (med_pr[0] == undefined)
                                            medURI = jsonObjFlux.results.bindings[0].protein.value;
                                        else
                                            medURI = med_pr[0].fma;

                                        if (medURI.indexOf(partOfCHEBIUri) != -1) {
                                            chebi_uri = "http://purl.obolibrary.org/obo/CHEBI_" + medURI.slice(medURI.indexOf("CHEBI:") + 6);
                                            endpointOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/chebi/terms?iri=" + chebi_uri;
                                        }
                                        else if (medURI.indexOf(partOfGOUri) != -1) {
                                            var go_uri = "http://purl.obolibrary.org/obo/GO_" + medURI.slice(medURI.indexOf("GO:") + 3);
                                            endpointOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/go/terms?iri=" + go_uri;
                                        }
                                        else
                                            endpointOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/pr/terms?iri=" + medURI;

                                        sendGetRequest(
                                            endpointOLS,
                                            function (jsonObjOLSMedPr) {

                                                console.log("srcDescMediatorOfFluxes: jsonObjOLSMedPr -> ", jsonObjOLSMedPr);

                                                index++;

                                                if (source_fma.length != 0) { // flux

                                                    if (source_fma.length == 1) { // transporter (single flux)

                                                        srctext = parserFmaNameText(source_fma[0]); // get this from OLS;

                                                        // No mediator protein in NHE3, SGLT models
                                                        if (med_pr[0] == undefined)
                                                            temp_med_pr = undefined;
                                                        else {
                                                            temp_med_pr = med_pr[0].fma;
                                                        }

                                                        console.log("med_pr, temp_med_pr in index.js: ", med_pr, temp_med_pr);

                                                        if (jsonObjOLSMedPr._embedded.terms[0].annotation["has_related_synonym"] == undefined) {
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

                                                        // Swap if source and sink have same direction
                                                        if (source_fma[0].fma == sink_fma[0].fma) {

                                                            var tempFMA = sink_fma[0].fma,
                                                                tempName = sink_fma[0].name;

                                                            sink_fma[0].fma = sink_fma[1].fma;
                                                            sink_fma[0].name = sink_fma[1].name;
                                                            sink_fma[1].fma = tempFMA;
                                                            sink_fma[1].name = tempName;
                                                        }

                                                        for (i = 0; i < source_fma.length; i++) {
                                                            srctext = parserFmaNameText(source_fma[i]);

                                                            if (med_pr[0] == undefined)
                                                                temp_med_pr = undefined;
                                                            else {
                                                                temp_med_pr = med_pr[0].fma;
                                                            }

                                                            if (jsonObjOLSMedPr._embedded.terms[0].annotation["has_related_synonym"] == undefined) {
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

                                                        console.log("membrane.length <= 1 membrane: ", membrane);

                                                        rmFromModelEntityFullNameArray(membrane, concentration_fma);

                                                        console.log("membrane: ", membrane);
                                                        console.log("model2DArr: ", model2DArray);
                                                        console.log("modelEntityNameArray: ", modelEntityNameArray);
                                                        console.log("modelEntityFullNameArray: ", modelEntityFullNameArray);
                                                        console.log("templistOfModel: ", templistOfModel);

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

                                                        console.log("membrane: ", membrane);
                                                        console.log("model2DArr: ", model2DArray);
                                                        console.log("modelEntityNameArray: ", modelEntityNameArray);
                                                        console.log("modelEntityFullNameArray: ", modelEntityFullNameArray);
                                                        console.log("templistOfModel: ", templistOfModel);

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

                        query = concentrationOPBSPARQL(modelEntityFullNameArray[index], model);

                        sendPostRequest(
                            endpoint,
                            query,
                            function (jsonObjCon) {
                                console.log("srcDescMediatorOfFluxes: jsonObjCon -> ", jsonObjCon);

                                for (var i in jsonObjCon.results.bindings) {
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

                                    console.log("concentration OPB: ", membrane);
                                    rmFromModelEntityFullNameArray(membrane, concentration_fma);

                                    console.log("model2DArr: ", model2DArray);
                                    console.log("modelEntityNameArray: ", modelEntityNameArray);
                                    console.log("modelEntityFullNameArray: ", modelEntityFullNameArray);
                                    console.log("templistOfModel: ", templistOfModel);
                                    console.log("concentration_fma: ", concentration_fma);

                                    epithelialPlatform(
                                        combinedMembrane,
                                        concentration_fma,
                                        source_fma2,
                                        sink_fma2,
                                        apicalMembrane,
                                        basolateralMembrane,
                                        membrane);

                                    return;
                                }
                                else
                                    mainUtils.srcDescMediatorOfFluxes(); // callback
                            },
                            true);
                    }
                },
                true);
        };

        mainUtils.srcDescMediatorOfFluxes(); // first call
    };

    // Expose utility to the global object
    global.$mainUtils = mainUtils;

})(window);
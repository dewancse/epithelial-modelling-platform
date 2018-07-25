/**
 * Created by dsar941 on 9/8/2016.
 */
var miscellaneous = require("./miscellaneous.js");
var viewModel = require("./viewModel.js");
var similarityModels = require("./similarityModels.js");
var epithelialPlatform = require("./epithelialPlatform.js");
var ajaxUtils = require("./../libs/ajax-utils.js");
var sparqlUtils = require("./sparqlUtils.js");

"use strict";

var EMP = (function (global) {

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

    // MODEL DISCOVERY
    var modelEntity = [],
        biologicalMeaning = [],
        speciesList = [],
        geneList = [],
        proteinList = [],
        listOfProteinURIs = [],
        head = [],
        discoverIndex = 0;

    // HOME: load the home page
    mainUtils.loadHomeHtml = function () {
        miscellaneous.showLoading("#main-content");
        ajaxUtils.sendGetRequest(
            sparqlUtils.homeHtml,
            function (homeHtmlContent) {
                $("#main-content").html(homeHtmlContent);
            },
            false);
    };

    // DOCUMENTATION: load documentation from github
    mainUtils.loadDocumentation = function () {
        var uri = "https://github.com/dewancse/epithelial-modelling-platform";
        $("#main-content").html("Documentation can be found at " +
            "<a href=" + uri + " + target=_blank>README.md in github</a>");
    };

    // On page load (before img or CSS)
    $(document).ready(function () {

        // On first load, show home view
        miscellaneous.showLoading("#main-content");

        if (sessionStorage.getItem("searchListContent")) {
            $("#main-content").html(sessionStorage.getItem("searchListContent"));
        }
        else {
            // homepage
            ajaxUtils.sendGetRequest(
                sparqlUtils.homeHtml,
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

    // ACTIONS: event handling for MODEL DISCOVERY and LOAD MODELS
    // Retrieve and save model name for clicking a checkbox in MODEL DISCOVERY and LOAD MODELS
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
                    if (!miscellaneous.isExist(event.target.value, templistOfModel)) {
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
                        if (!miscellaneous.isExist($(".attribute")[i].value, templistOfModel)) {
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

    // ACTIONS: if there is an action with the given name, call it
    $(document).on("click", function () {
        if (typeof actions[event.target.dataset.action] === "function")
            actions[event.target.dataset.action].call(this, event);
    });

    // MODEL DISCOVERY: enter search texts
    $(document).on("keydown", function () {
        if (event.key == "Enter") {

            var uriOPB, uriCHEBI, keyValue;
            var searchTxt = document.getElementById("searchTxt").value;

            // set local storage
            sessionStorage.setItem("searchTxtContent", searchTxt);

            // dictionary object
            for (var i in sparqlUtils.dictionary) {
                var key1 = searchTxt.indexOf("" + sparqlUtils.dictionary[i].key1 + ""),
                    key2 = searchTxt.indexOf("" + sparqlUtils.dictionary[i].key2 + "");

                if (key1 != -1 && key2 != -1) {
                    uriOPB = sparqlUtils.dictionary[i].opb;
                    uriCHEBI = sparqlUtils.dictionary[i].chebi;
                    keyValue = sparqlUtils.dictionary[i].key1;
                }
            }

            miscellaneous.showLoading("#searchList");

            modelEntity = [];
            biologicalMeaning = [];
            speciesList = [];
            geneList = [];
            proteinList = [];
            listOfProteinURIs = [];
            head = [];

            discoverIndex = 0; // discoverIndex to index each Model_entity

            var query;
            if (uriCHEBI == "") { // model discovery with 'flux'
                query = sparqlUtils.discoveryWithFlux(uriOPB);
            }
            else {
                if (keyValue == "flux") { // model discovery with 'flux of sodium', etc.
                    query = sparqlUtils.discoveryWithFluxOfSolute(uriCHEBI)
                }
                else { // model disocvery with 'concentration of sodium', etc.
                    query = sparqlUtils.discoveryWithConcentrationOfSolute(uriCHEBI);
                }
            }

            // Model
            ajaxUtils.sendPostRequest(
                sparqlUtils.endpoint,
                query,
                function (jsonModel) {
                    console.log("jsonModel: ", jsonModel);
                    // REMOVE duplicate cellml model and variable name (NOT component name)
                    jsonModel.results.bindings = miscellaneous.uniqueifyjsonModel(jsonModel.results.bindings);
                    console.log("After jsonModel: ", jsonModel);
                    mainUtils.discoverModels(jsonModel);
                },
                true);
        }
    });

    // MODEL DISCOVERY: SPARQL queries to retrieve search results from PMR
    mainUtils.discoverModels = function (jsonModel) {

        if (jsonModel.results.bindings.length == 0) {
            mainUtils.showDiscoverModels();
            return;
        }

        var model = miscellaneous.parseModelName(jsonModel.results.bindings[discoverIndex].Model_entity.value);
        model = model + "#" + model.slice(0, model.indexOf("."));

        var query = "SELECT ?Protein WHERE { " + "<" + model + "> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein. }";

        ajaxUtils.sendPostRequest(
            sparqlUtils.endpoint,
            query,
            function (jsonProteinUri) {

                console.log("jsonProteinUri: ", jsonProteinUri);

                if (jsonProteinUri.results.bindings.length == 0) {
                    discoverIndex++;

                    if (discoverIndex != jsonModel.results.bindings.length) {
                        mainUtils.discoverModels(jsonModel);
                    }
                }

                // pig SGLT2 (PR_P31636) does not exist in PR ontology, assign mouse species instead
                // PR_P31636 is added in PR ontology
                var pr_uri, endpointproteinOLS;
                if (jsonProteinUri.results.bindings.length == 0) {
                    // pr_uri = undefined;
                    endpointproteinOLS = sparqlUtils.abiOntoEndpoint + "/pr";
                }
                else {
                    pr_uri = jsonProteinUri.results.bindings[0].Protein.value;

                    if (pr_uri == sparqlUtils.epithelialcellID)
                        endpointproteinOLS = sparqlUtils.abiOntoEndpoint + "/cl/terms?iri=" + pr_uri;
                    else if (pr_uri.indexOf(sparqlUtils.partOfGOUri) != -1) {
                        var go_uri = "http://purl.obolibrary.org/obo/GO_" + pr_uri.slice(pr_uri.indexOf("GO:") + 3);
                        endpointproteinOLS = sparqlUtils.abiOntoEndpoint + "/go/terms?iri=" + go_uri;
                    }
                    else
                        endpointproteinOLS = sparqlUtils.abiOntoEndpoint + "/pr/terms?iri=" + pr_uri;

                    // dropdown list
                    listOfProteinURIs.push(pr_uri);
                }

                console.log("pr_uri: ", pr_uri);
                console.log("endpointproteinOLS: ", endpointproteinOLS);

                var query = sparqlUtils.mediatorSPARQL(jsonModel.results.bindings[discoverIndex].Model_entity.value);

                ajaxUtils.sendPostRequest(
                    sparqlUtils.endpoint,
                    query,
                    function (jsonepithelialobj) {

                        console.log("jsonepithelialobj: ", jsonepithelialobj);

                        // epithelial cell
                        if (pr_uri == sparqlUtils.epithelialcellID) {
                            for (var i = 0; i < jsonepithelialobj.results.bindings.length; i++) {
                                var temp = jsonepithelialobj.results.bindings[i].mediator.value;

                                if (temp.indexOf(sparqlUtils.partOfProteinUri) != -1) {
                                    var mediatorURI = jsonepithelialobj.results.bindings[i].mediator.value;
                                    endpointproteinOLS = sparqlUtils.abiOntoEndpoint + "/pr/terms?iri=" + mediatorURI;
                                    break;
                                }
                            }
                        }

                        console.log("After endpointproteinOLS: ", endpointproteinOLS);

                        ajaxUtils.sendGetRequest(
                            endpointproteinOLS,
                            function (jsonProtein) {

                                console.log("jsonProtein: ", jsonProtein);

                                var endpointgeneOLS;
                                if (jsonProtein._embedded.terms[0]._links.has_gene_template != undefined)
                                    endpointgeneOLS = jsonProtein._embedded.terms[0]._links.has_gene_template.href;
                                else
                                    endpointgeneOLS = sparqlUtils.abiOntoEndpoint + "/pr";

                                ajaxUtils.sendGetRequest(
                                    endpointgeneOLS,
                                    function (jsonGene) {

                                        console.log("jsonGene: ", jsonGene);

                                        var endpointspeciesOLS;
                                        if (jsonProtein._embedded.terms[0]._links.only_in_taxon != undefined)
                                            endpointspeciesOLS = jsonProtein._embedded.terms[0]._links.only_in_taxon.href;
                                        else
                                            endpointspeciesOLS = sparqlUtils.abiOntoEndpoint + "/pr";

                                        ajaxUtils.sendGetRequest(
                                            endpointspeciesOLS,
                                            function (jsonSpecies) {

                                                console.log("jsonSpecies: ", jsonSpecies);

                                                // model and biological meaning
                                                modelEntity.push(jsonModel.results.bindings[discoverIndex].Model_entity.value);
                                                biologicalMeaning.push(jsonModel.results.bindings[discoverIndex].Biological_meaning.value);

                                                // species
                                                if (jsonSpecies._embedded == undefined)
                                                    speciesList.push("Numerical model"); // Or undefined
                                                else
                                                    speciesList.push(jsonSpecies._embedded.terms[0].label);

                                                // gene
                                                if (jsonGene._embedded == undefined)
                                                    geneList.push("Numerical model"); // Or undefined
                                                else {
                                                    var geneName = jsonGene._embedded.terms[0].label;
                                                    geneName = geneName.slice(0, geneName.indexOf("(") - 1);
                                                    geneList.push(geneName); // Or undefined
                                                }

                                                // protein
                                                if (jsonProtein._embedded == undefined)
                                                    proteinList.push("Numerical model"); // Or undefined
                                                else {
                                                    var proteinName = jsonProtein._embedded.terms[0].label;
                                                    proteinName = proteinName.slice(0, proteinName.indexOf("(") - 1);
                                                    proteinList.push(proteinName);
                                                }

                                                head = ["Model_entity", "Biological_meaning", "Species", "Gene", "Protein"];

                                                mainUtils.showDiscoverModels();

                                                discoverIndex++; // increment index of modelEntity

                                                if (discoverIndex == jsonModel.results.bindings.length) {

                                                    listOfProteinURIs = listOfProteinURIs.filter(function (item, pos) {
                                                        return listOfProteinURIs.indexOf(item) == pos;
                                                    });

                                                    // dropdown list
                                                    filterByProtein();
                                                    return;
                                                }

                                                mainUtils.discoverModels(jsonModel); // callback
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

    // MODEL DISCOVERY: load the search html
    mainUtils.loadSearchHtml = function () {

        if (!sessionStorage.getItem("searchListContent")) {

            console.log("loadSearchHtml IF");

            ajaxUtils.sendGetRequest(
                sparqlUtils.searchHtml,
                function (searchHtmlContent) {
                    $("#main-content").html(searchHtmlContent);
                },
                false);
        }
        else {
            console.log("loadSearchHtml ELSE");

            $("#main-content").html(sessionStorage.getItem("searchListContent"));

            filterByProtein(); // reload protein in the dropdown list

            mainUtils.showDiscoverModels(
                head,
                modelEntity,
                biologicalMeaning,
                speciesList,
                geneList,
                proteinList,
                listOfProteinURIs);
        }
    };

    // MODEL DISCOVERY: display discovered models from PMR
    mainUtils.showDiscoverModels = function () {

        // Empty search result
        if (head.length == 0) {
            $("#searchList").html("<section class=container-fluid><label><br>No Search Results!</label></section>");
            $("#searchTxt").attr("value", "");
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
                            .html("<input id=" + modelEntity[i] + " uri=" + listOfProteinURIs[i] + " type=checkbox " +
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

    // VIEW MODEL: load the view page to display details of a selected model
    mainUtils.loadViewHtml = function () {

        var cellmlModel = mainUtils.workspaceName;

        if (cellmlModel == undefined) {
            $("#main-content").html("Please select a model from MODEL DISCOVERY");

            return;
        }

        cellmlModel = cellmlModel + "#" + cellmlModel.slice(0, cellmlModel.indexOf("."));

        var query = sparqlUtils.loadViewHtmlSPARQL(cellmlModel);

        miscellaneous.showLoading("#main-content");
        ajaxUtils.sendPostRequest(
            sparqlUtils.endpoint,
            query,
            function () {
                ajaxUtils.sendGetRequest(
                    sparqlUtils.viewHtml,
                    function (viewHtmlContent) {
                        $("#main-content").html(viewHtmlContent);
                        ajaxUtils.sendPostRequest(sparqlUtils.endpoint, query, viewModel.viewModel, true);
                    },
                    false);
            },
            true);
    };

    // LOAD MODELS: extract compartments and locations
    // extension of mainUtils.loadModelHtml function
    var compartmentandlocation = function (compartment, location, protein, species, gene) {

        var tempCompartment = "", counterOLS = 0;

        for (var i in compartment) {

            var fma_uri = compartment[i].Compartment.value;
            fma_uri = "http://purl.org/sig/ont/fma/fma" + fma_uri.slice(fma_uri.indexOf("FMA:") + 4);

            var endpointOLS = sparqlUtils.abiOntoEndpoint + "/fma/terms?iri=" + fma_uri;

            ajaxUtils.sendGetRequest(
                endpointOLS,
                function (jsonObjOLS) {

                    counterOLS++;
                    tempCompartment += jsonObjOLS._embedded.terms[0].label;

                    if (counterOLS < compartment.length) tempCompartment += ", ";
                    else tempCompartment += "";

                    if (counterOLS == compartment.length) {

                        var tempLocation = "", counterOLSLoc = 0;
                        for (var i in location) {

                            var fma_uri = location[i].Located_in.value;
                            fma_uri = "http://purl.org/sig/ont/fma/fma" + fma_uri.slice(fma_uri.indexOf("FMA:") + 4);

                            var endpointOLS = sparqlUtils.abiOntoEndpoint + "/fma/terms?iri=" + fma_uri;

                            ajaxUtils.sendGetRequest(
                                endpointOLS,
                                function (jsonObjOLSLocation) {

                                    counterOLSLoc++;
                                    tempLocation += jsonObjOLSLocation._embedded.terms[0].label;

                                    if (counterOLSLoc < location.length) tempLocation += ", ";
                                    else tempLocation += "";

                                    if (counterOLSLoc == location.length) {
                                        var jsonObj = {
                                            "Model_entity": mainUtils.tempidWithStr,
                                            "Protein": protein,
                                            "Species": species,
                                            "Gene": gene,
                                            "Compartment": tempCompartment,
                                            "Located_in": tempLocation
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

    // LOAD MODELS: load a selected model
    mainUtils.loadModelHtml = function () {

        var model = mainUtils.workspaceName;

        if (model != undefined)
            model = model + "#" + model.slice(0, model.indexOf("."));

        var query = "SELECT ?Protein WHERE { " + "<" + model + "> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein. }";

        ajaxUtils.sendPostRequest(
            sparqlUtils.endpoint,
            query,
            function (jsonProteinUri) {

                console.log("loadMOdel jsonProteinUri: ", jsonProteinUri);

                var pr_uri, endpointproteinOLS;
                if (jsonProteinUri.results.bindings.length == 0) {
                    // pr_uri = undefined;
                    endpointproteinOLS = sparqlUtils.abiOntoEndpoint + "/pr";
                }
                else {
                    pr_uri = jsonProteinUri.results.bindings[0].Protein.value;

                    if (pr_uri == sparqlUtils.epithelialcellID)
                        endpointproteinOLS = sparqlUtils.abiOntoEndpoint + "/cl/terms?iri=" + pr_uri;
                    else if (pr_uri.indexOf(sparqlUtils.partOfGOUri) != -1) {
                        var go_uri = "http://purl.obolibrary.org/obo/GO_" + pr_uri.slice(pr_uri.indexOf("GO:") + 3);
                        endpointproteinOLS = sparqlUtils.abiOntoEndpoint + "/go/terms?iri=" + go_uri;
                    }
                    else
                        endpointproteinOLS = sparqlUtils.abiOntoEndpoint + "/pr/terms?iri=" + pr_uri;
                }

                console.log("loadMOdel pr_uri: ", pr_uri);
                console.log("loadMOdel endpointproteinOLS: ", endpointproteinOLS);

                ajaxUtils.sendGetRequest(
                    endpointproteinOLS,
                    function (jsonProtein) {

                        console.log("loadMOdel jsonProtein: ", jsonProtein);

                        var endpointgeneOLS;
                        if (jsonProtein._embedded == undefined || jsonProtein._embedded.terms[0]._links.has_gene_template == undefined)
                            endpointgeneOLS = sparqlUtils.abiOntoEndpoint + "/pr";
                        else
                            endpointgeneOLS = jsonProtein._embedded.terms[0]._links.has_gene_template.href;

                        ajaxUtils.sendGetRequest(
                            endpointgeneOLS,
                            function (jsonGene) {

                                var endpointspeciesOLS;
                                if (jsonProtein._embedded == undefined || jsonProtein._embedded.terms[0]._links.only_in_taxon == undefined)
                                    endpointspeciesOLS = sparqlUtils.abiOntoEndpoint + "/pr";
                                else
                                    endpointspeciesOLS = jsonProtein._embedded.terms[0]._links.only_in_taxon.href;

                                ajaxUtils.sendGetRequest(
                                    endpointspeciesOLS,
                                    function (jsonSpecies) {

                                        // console.log("loadModelHtml: jsonSpecies -> ", jsonSpecies);

                                        var query = "SELECT ?Compartment " +
                                            "WHERE { " + "<" + model + "> <http://www.obofoundry.org/ro/ro.owl#compartmentOf> ?Compartment. }";

                                        ajaxUtils.sendPostRequest(
                                            sparqlUtils.endpoint,
                                            query,
                                            function (jsonObjCompartment) {

                                                var query = "SELECT ?Located_in " +
                                                    "WHERE { " + "<" + model + "> <http://www.obofoundry.org/ro/ro.owl#located_in> ?Located_in. }";

                                                ajaxUtils.sendPostRequest(
                                                    sparqlUtils.endpoint,
                                                    query,
                                                    function (jsonObjLocation) {

                                                        ajaxUtils.sendGetRequest(
                                                            sparqlUtils.modelHtml,
                                                            function (modelHtmlContent) {

                                                                $("#main-content").html(modelHtmlContent);

                                                                if (jsonObjCompartment.results.bindings.length == 0 &&
                                                                    jsonObjLocation.results.bindings.length == 0) {
                                                                    var jsonObj = {};
                                                                    mainUtils.showModel(jsonObj);
                                                                }

                                                                var species, gene, protein;
                                                                if (jsonSpecies._embedded == undefined)
                                                                    species = "Numerical model"; // Or undefined
                                                                else
                                                                    species = jsonSpecies._embedded.terms[0].label;

                                                                if (jsonGene._embedded == undefined)
                                                                    gene = "Numerical model"; // Or undefined
                                                                else {
                                                                    var geneName = jsonGene._embedded.terms[0].label;
                                                                    geneName = geneName.slice(0, geneName.indexOf("(") - 1);
                                                                    gene = geneName;
                                                                }

                                                                if (jsonProtein._embedded == undefined)
                                                                    protein = "Numerical model"; // Or undefined
                                                                else {
                                                                    var proteinName = jsonProtein._embedded.terms[0].label;
                                                                    proteinName = proteinName.slice(0, proteinName.indexOf("(") - 1);
                                                                    protein = proteinName;
                                                                }

                                                                // compartment and location in LOAD MODELS
                                                                compartmentandlocation(
                                                                    jsonObjCompartment.results.bindings,
                                                                    jsonObjLocation.results.bindings,
                                                                    protein,
                                                                    species,
                                                                    gene);
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

    // LOAD MODELS: display a selected model
    mainUtils.showModel = function (jsonObj) {

        // add this model temporarily to display in MODEL DISCOVERY when deleted
        if (modelEntityInLoadModels.indexOf(jsonObj.Model_entity) == -1) {
            var index = modelEntity.indexOf(jsonObj.Model_entity);
            modelEntityInLoadModels.push([
                jsonObj.Model_entity,
                biologicalMeaning[index],
                speciesList[index],
                geneList[index],
                proteinList[index]]);
        }

        // delete this model to hide in MODEL DISCOVERY when revisited
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
            $("#modelList").html("Please load models from MODEL DISCOVERY");
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

                if (miscellaneous.isExistModel2DArray(modelEntityName, model2DArray))
                    break;

                model.push($("<label/>").html("<input id=" + modelEntityName + " + type=checkbox " +
                    "name=attribute class=attribute data-action=model value=" + modelEntityName + " >"));
            }

            if (head[i] == "Model_entity")
                model.push(modelEntityName);
            else
                model.push(jsonObj[head[i]]);
        }

        // 1D to 2D array
        while (model.length) {
            model2DArray.push(model.splice(0, 7)); // 6 + 1 (checkbox) header element
        }

        model2DArray = miscellaneous.uniqueifymodel2DArray(model2DArray);

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
            if ($("table tr td label")[i].firstChild.checked == true)
                $("table tr td label")[i].firstChild.checked = false;
        }

        lengthOfLoadModelTable = $("table tr").length;
        if (lengthOfLoadModelTable == 1) {
            mainUtils.workspaceName = "";
            $("#modelList").html("Please load models from MODEL DISCOVERY");
            return;
        }
    };

    // FILTER BY PROTEIN: filter search results in MODEL DISCOVERY
    mainUtils.filterSearchHtml = function () {

        if ($("#membraneId").val() == "all") {
            $("table tr").show();
            console.log("IF: ", $("#membraneId").val());
        }
        else {
            var selectedprotein = $("#membraneId option:selected").val();

            console.log("ELSE selectedprotein: ", selectedprotein);
            console.log("ELSE (table tr): ", $("table tr"));

            for (var i = 1; i < $("table tr").length; i++) {

                var tempstr = $("table tr")[i];
                tempstr = $($(tempstr).find("input")).attr("uri");

                console.log("ELSE tempstr: ", tempstr);

                if (selectedprotein == tempstr)
                    $("table tr")[i].hidden = false;
                else
                    $("table tr")[i].hidden = true;
            }
        }
    };

    // FILTER BY PROTEIN: filter dropdown list in MODEL DISCOVERY
    var filterByProtein = function () {

        // Initialize dropdown list
        $("#membraneId").empty();
        $("#membraneId").append("<option value=all>select all</option>");

        var tmpProteinList = [];
        for (var i in proteinList) {
            tmpProteinList[i] = proteinList[i];
        }

        tmpProteinList = tmpProteinList.filter(function (item, pos) {
            return tmpProteinList.indexOf(item) == pos;
        });

        console.log("tmpProteinList: ", tmpProteinList);
        console.log("listOfProteinURIs: ", listOfProteinURIs);

        for (var i in tmpProteinList) {
            $("#membraneId").append("<option value=" + listOfProteinURIs[i] + ">" + tmpProteinList[i] + "</option>");
        }
    };

    // DELETE MODEL: delete a selected model in LOAD MODELS
    mainUtils.deleteRowModelHtml = function () {

        templistOfModel.forEach(function (element, tempIndex) {

            for (var i = 0; i < $("table tr").length; i++) {

                if ($("table tr")[i].id == element) {
                    // Remove selected row
                    $("table tr")[i].remove();

                    // Remove from model2DArray
                    model2DArray.forEach(function (elem, index) {
                        if (element == elem[1])
                            model2DArray.splice(index, 1);
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
            $("#modelList").html("Please load models from MODEL DISCOVERY");
            return;
        }
    };

    // MODEL OF SIMILARITY: load the SVG diagram through similarityModels function
    mainUtils.loadSimilarityHtml = function () {

        ajaxUtils.sendGetRequest(
            sparqlUtils.similarityHtml,
            function (similarityHtmlContent) {

                $("#main-content").html(similarityHtmlContent);

                ajaxUtils.sendGetRequest(
                    sparqlUtils.similarityHtml,
                    function () {
                        similarityModels.similarityModels(model2DArray, modelEntityNameArray);

                        // Reinitialize to display only selected models on the Platform
                        templistOfModel = [];
                        modelEntityNameArray = [];
                        modelEntityFullNameArray = [];
                    },
                    false);
            },
            false);
    };

    // EPITHELIAL PLATFORM: load the epithelial html
    mainUtils.loadEpithelialHtml = function () {

        // make empty list in LOAD MODELS
        if (lengthOfLoadModelTable == 2) {
            mainUtils.workspaceName = "";
            $("#modelList").html("Please load models from MODEL DISCOVERY");
        }

        ajaxUtils.sendGetRequest(
            sparqlUtils.epithelialHtml,
            function (epithelialHtmlContent) {
                $("#main-content").html(epithelialHtmlContent);
                ajaxUtils.sendGetRequest(sparqlUtils.epithelialHtml, mainUtils.loadEpithelial, false);
            },
            false);
    };

    var concentration_fma = [];
    // EPITHELIAL PLATFORM: determine source, mediator and destination of fluxes
    // create objects for fluxes and cotransporters and call epithelial platform interface
    mainUtils.loadEpithelial = function () {

        // remove model name, keep only solutes
        for (var i in modelEntityNameArray) {
            var indexOfHash = modelEntityNameArray[i].search("#");
            modelEntityNameArray[i] = modelEntityNameArray[i].slice(indexOfHash + 1);
        }

        var source_fma = [], sink_fma = [], med_fma = [], med_pr = [], source_fma2 = [],
            sink_fma2 = [], solute_chebi = [], index = 0, counter = 0,
            membrane = [], apicalMembrane = [], basolateralMembrane = [], capillaryMembrane = [];

        // empty platform as no model is selected
        if (modelEntityFullNameArray.length == 0) {

            epithelialPlatform.epithelialPlatform(
                combinedMembrane,
                concentration_fma,
                source_fma2,
                sink_fma2,
                apicalMembrane,
                basolateralMembrane,
                capillaryMembrane,
                membrane);

            return;
        }

        // remove visualized solutes in the next miscellaneous.iteration in Load Model
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
                            if (membrane[i].model_entity == elem[1])
                                model2DArray.splice(index, 1);
                        });

                        // Remove from templistOfModel
                        templistOfModel.forEach(function (elem, index) {
                            if (membrane[i].model_entity == elem)
                                templistOfModel.splice(index, 1);
                        });

                        // Remove from modelEntity
                        modelEntity.forEach(function (elem, index) {
                            if (membrane[i].model_entity == elem)
                                modelEntity.splice(index, 1);
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
                            if (concentration_fma[i].name == elem[1])
                                model2DArray.splice(index, 1);
                        });

                        // Remove from modelEntity
                        modelEntity.forEach(function (elem, index) {
                            if (concentration_fma[i].name == elem)
                                modelEntity.splice(index, 1);
                        });
                    }
                }
            }
        };

        // make cotransporters between fluxes
        mainUtils.makecotransporter = function (membrane1, membrane2) {

            var query = sparqlUtils.makecotransporterSPARQL(membrane1.model_entity, membrane2.model_entity);

            ajaxUtils.sendPostRequest(
                sparqlUtils.endpoint,
                query,
                function (jsonObj) {

                    // console.log("jsonObj in makecotransporter: ", jsonObj);

                    var tempProtein = [], tempApical = [], tempBasolateral = [], tempCapillary = [];

                    // loop to iterate over med_fma and med_pr in jsonObj
                    for (var m = 0; m < jsonObj.results.bindings.length; m++) {
                        var tmpPro = jsonObj.results.bindings[m].med_entity_uri.value;
                        var tmpApi = jsonObj.results.bindings[m].med_entity_uri.value;
                        var tmpBas = jsonObj.results.bindings[m].med_entity_uri.value;
                        var tmpCap = jsonObj.results.bindings[m].med_entity_uri.value;

                        if (tmpPro.indexOf(sparqlUtils.partOfProteinUri) != -1) {
                            tempProtein.push(jsonObj.results.bindings[m].med_entity_uri.value);
                        }

                        if (tmpApi.indexOf(sparqlUtils.apicalID) != -1) {
                            tempApical.push(jsonObj.results.bindings[m].med_entity_uri.value);
                        }

                        if (tmpBas.indexOf(sparqlUtils.basolateralID) != -1) {
                            tempBasolateral.push(jsonObj.results.bindings[m].med_entity_uri.value);
                        }

                        if (tmpCap.indexOf(sparqlUtils.capillaryID) != -1) {
                            tempCapillary.push(jsonObj.results.bindings[m].med_entity_uri.value);
                        }
                    }

                    // remove duplicate protein ID
                    // TODO: probably no need to do this!
                    tempProtein = tempProtein.filter(function (item, pos) {
                        return tempProtein.indexOf(item) == pos;
                    });

                    tempApical = tempApical.filter(function (item, pos) {
                        return tempApical.indexOf(item) == pos;
                    });

                    tempBasolateral = tempBasolateral.filter(function (item, pos) {
                        return tempBasolateral.indexOf(item) == pos;
                    });

                    tempCapillary = tempCapillary.filter(function (item, pos) {
                        return tempCapillary.indexOf(item) == pos;
                    });

                    // console.log("temp protein, apical, and basolateral: ", tempProtein, tempApical, tempBasolateral);
                    // console.log("med_pr in makecotransporter : ", membrane1, membrane1.med_pr, membrane2, membrane2.med_pr);

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

                        // cotransporter in basolateral membrane
                        if (tempProtein.length != 0 && tempCapillary.length != 0) {
                            capillaryMembrane.push(membraneOBJ);
                        }
                    }

                    // same solute cotransporter in apical membrane
                    if (membrane1.med_fma == sparqlUtils.apicalID && membrane2.med_fma == sparqlUtils.apicalID &&
                        membrane1.med_pr == membrane2.med_pr &&
                        membrane1.model_entity == membrane2.model_entity) {

                        // console.log("tempprotein inside same solute: ", tempProtein);

                        apicalMembrane.push(membraneOBJ);
                    }

                    // same solute cotransporter in basolateral membrane
                    if (membrane1.med_fma == sparqlUtils.basolateralID && membrane2.med_fma == sparqlUtils.basolateralID &&
                        membrane1.med_pr == membrane2.med_pr &&
                        membrane1.model_entity == membrane2.model_entity) {
                        basolateralMembrane.push(membraneOBJ);
                    }

                    // same solute cotransporter in capillary membrane
                    if (membrane1.med_fma == sparqlUtils.capillaryID && membrane2.med_fma == sparqlUtils.capillaryID &&
                        membrane1.med_pr == membrane2.med_pr &&
                        membrane1.model_entity == membrane2.model_entity) {
                        capillaryMembrane.push(membraneOBJ);
                    }

                    counter++;

                    if (counter == miscellaneous.iteration(membrane.length)) {

                        console.log("membrane in index.js: ", membrane);
                        console.log("apicalMembrane in index.js: ", apicalMembrane);
                        console.log("basolateralMembrane in index.js: ", basolateralMembrane);
                        console.log("capillaryMembrane in index.js: ", capillaryMembrane);

                        rmFromModelEntityFullNameArray(membrane, concentration_fma);

                        console.log("model2DArr: ", model2DArray);
                        console.log("modelEntityNameArray: ", modelEntityNameArray);
                        console.log("modelEntityFullNameArray: ", modelEntityFullNameArray);
                        console.log("templistOfModel: ", templistOfModel);

                        epithelialPlatform.epithelialPlatform(
                            combinedMembrane,
                            concentration_fma,
                            source_fma2,
                            sink_fma2,
                            apicalMembrane,
                            basolateralMembrane,
                            capillaryMembrane,
                            membrane);
                    }
                },
                true);
        };

        // determine source, mediator and destination of fluxes
        mainUtils.srcDescMediatorOfFluxes = function () {

            var model, query, i;
            if (modelEntityFullNameArray[index] == undefined)
                model = undefined;
            else {
                model = miscellaneous.parseModelName(modelEntityFullNameArray[index]);
                model = model + "#" + model.slice(0, model.indexOf("."));
            }

            query = sparqlUtils.opbSPARQL(modelEntityFullNameArray[index]);

            ajaxUtils.sendPostRequest(
                sparqlUtils.endpoint,
                query,
                function (jsonObjOPB) {
                    // flux OPB
                    if (jsonObjOPB.results.bindings[0].opb.value == sparqlUtils.fluxOPB) {

                        query = sparqlUtils.srcDescMediatorOfFluxesSPARQL(modelEntityFullNameArray[index], model);

                        ajaxUtils.sendPostRequest(
                            sparqlUtils.endpoint,
                            query,
                            function (jsonObjFlux) {

                                console.log("jsonObjFlux in index.js: ", jsonObjFlux);

                                var chebi_uri = jsonObjFlux.results.bindings[0].solute_chebi.value;
                                var indexofColon = chebi_uri.indexOf("CHEBI:");
                                chebi_uri = "http://purl.obolibrary.org/obo/CHEBI_" + chebi_uri.slice(indexofColon + 6);

                                var endpointOLS = sparqlUtils.abiOntoEndpoint + "/chebi/terms?iri=" + chebi_uri;

                                console.log("endpointOLS in index.js: ", endpointOLS);

                                ajaxUtils.sendGetRequest(
                                    endpointOLS,
                                    function (jsonObjOLSChebi) {

                                        console.log("jsonObjOLSChebi in index.js: ", jsonObjOLSChebi);

                                        // Name of a solute CHEBI from OLS
                                        for (i = 0; i < jsonObjFlux.results.bindings.length; i++) {
                                            var temparr = jsonObjOLSChebi._embedded.terms[0].annotation["has_related_synonym"],
                                                solute_chebi_name;
                                            for (var m = 0; m < temparr.length; m++) {
                                                if (temparr[m].slice(-1) == "+" || temparr[m].slice(-1) == "-" || temparr[m] == "Glc") {
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
                                                if (temp.indexOf(sparqlUtils.partOfProteinUri) != -1 || temp.indexOf(sparqlUtils.partOfGOUri) != -1 || temp.indexOf(sparqlUtils.partOfCHEBIUri) != -1) {
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
                                        solute_chebi = miscellaneous.uniqueifyEpithelial(solute_chebi);
                                        source_fma = miscellaneous.uniqueifyEpithelial(source_fma);
                                        sink_fma = miscellaneous.uniqueifyEpithelial(sink_fma);
                                        med_pr = miscellaneous.uniqueifyEpithelial(med_pr);
                                        med_fma = miscellaneous.uniqueifyEpithelial(med_fma);

                                        // console.log("med_pr[0], med_pr in index.js: ", med_pr[0], med_pr);
                                        // console.log("med_fma in index.js: ", med_fma);

                                        var medURI, endpointOLS, srctext, temp_med_pr, med_pr_text_syn, tempvar;

                                        if (med_pr[0] == undefined)
                                            medURI = jsonObjFlux.results.bindings[0].protein.value;
                                        else
                                            medURI = med_pr[0].fma;

                                        if (medURI.indexOf(sparqlUtils.partOfCHEBIUri) != -1) {
                                            chebi_uri = "http://purl.obolibrary.org/obo/CHEBI_" + medURI.slice(medURI.indexOf("CHEBI:") + 6);
                                            endpointOLS = sparqlUtils.abiOntoEndpoint + "/chebi/terms?iri=" + chebi_uri;
                                        }
                                        else if (medURI.indexOf(sparqlUtils.partOfGOUri) != -1) {
                                            var go_uri = "http://purl.obolibrary.org/obo/GO_" + medURI.slice(medURI.indexOf("GO:") + 3);
                                            endpointOLS = sparqlUtils.abiOntoEndpoint + "/go/terms?iri=" + go_uri;
                                        }
                                        else
                                            endpointOLS = sparqlUtils.abiOntoEndpoint + "/pr/terms?iri=" + medURI;

                                        ajaxUtils.sendGetRequest(
                                            endpointOLS,
                                            function (jsonObjOLSMedPr) {

                                                // console.log("jsonObjOLSMedPr in index.js: ", jsonObjOLSMedPr);

                                                index++;

                                                if (source_fma.length != 0) { // flux

                                                    if (source_fma.length == 1) { // transporter (single flux)

                                                        srctext = miscellaneous.parserFmaNameText(source_fma[0]); // get this from OLS;

                                                        // No mediator protein in NHE3, SGLT models
                                                        if (med_pr[0] == undefined)
                                                            temp_med_pr = undefined;
                                                        else {
                                                            temp_med_pr = med_pr[0].fma;
                                                        }

                                                        // console.log("med_pr, temp_med_pr in index.js: ", med_pr, temp_med_pr);

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

                                                        for (i = 0; i < source_fma.length; i++) {
                                                            srctext = miscellaneous.parserFmaNameText(source_fma[i]);

                                                            if (med_pr[0] == undefined)
                                                                temp_med_pr = undefined;
                                                            else {
                                                                temp_med_pr = med_pr[0].fma;
                                                            }

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

                                                        console.log("membrane.length <= 1 membrane: ", membrane);

                                                        rmFromModelEntityFullNameArray(membrane, concentration_fma);

                                                        console.log("membrane: ", membrane);
                                                        console.log("model2DArr: ", model2DArray);
                                                        console.log("modelEntityNameArray: ", modelEntityNameArray);
                                                        console.log("modelEntityFullNameArray: ", modelEntityFullNameArray);
                                                        console.log("templistOfModel: ", templistOfModel);

                                                        epithelialPlatform.epithelialPlatform(
                                                            combinedMembrane,
                                                            concentration_fma,
                                                            source_fma2,
                                                            sink_fma2,
                                                            apicalMembrane,
                                                            basolateralMembrane,
                                                            capillaryMembrane,
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

                                                        for (i = 0; i < membrane.length; i++) {
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

                    // make a concentration object to semantically place solutes in the respective compartment
                    else if (jsonObjOPB.results.bindings[0].opb.value == sparqlUtils.concentrationOPB) {

                        query = sparqlUtils.concentrationOPBSPARQL(modelEntityFullNameArray[index], model);

                        ajaxUtils.sendPostRequest(
                            sparqlUtils.endpoint,
                            query,
                            function (jsonObjCon) {
                                console.log("jsonObjCon in index.js: ", jsonObjCon);

                                for (i = 0; i < jsonObjCon.results.bindings.length; i++) {
                                    if (jsonObjCon.results.bindings[i].concentration_fma == undefined)
                                        concentration_fma.push("");
                                    else
                                        concentration_fma.push({
                                            name: modelEntityFullNameArray[index],
                                            fma: jsonObjCon.results.bindings[i].concentration_fma.value
                                        });
                                }

                                index++;

                                if (index == modelEntityFullNameArray.length) {

                                    // special case: one concentration is chosen
                                    if (membrane.length <= 1) {

                                        console.log("concentration OPB, membrane.length <= 1: ", membrane);

                                        rmFromModelEntityFullNameArray(membrane, concentration_fma);

                                        console.log("model2DArr: ", model2DArray);
                                        console.log("modelEntityNameArray: ", modelEntityNameArray);
                                        console.log("modelEntityFullNameArray: ", modelEntityFullNameArray);
                                        console.log("templistOfModel: ", templistOfModel);
                                        console.log("concentration_fma: ", concentration_fma);

                                        epithelialPlatform.epithelialPlatform(
                                            combinedMembrane,
                                            concentration_fma,
                                            source_fma2,
                                            sink_fma2,
                                            apicalMembrane,
                                            basolateralMembrane,
                                            capillaryMembrane,
                                            membrane);
                                    }
                                    else {

                                        console.log("concentration OPB, membrane.length >= 1 membrane: ", membrane);

                                        rmFromModelEntityFullNameArray(membrane, concentration_fma);

                                        console.log("model2DArr: ", model2DArray);
                                        console.log("modelEntityNameArray: ", modelEntityNameArray);
                                        console.log("modelEntityFullNameArray: ", modelEntityFullNameArray);
                                        console.log("templistOfModel: ", templistOfModel);
                                        console.log("concentration_fma: ", concentration_fma);

                                        for (i = 0; i < membrane.length; i++) {
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
        };

        mainUtils.srcDescMediatorOfFluxes(); // initial call
    };

    // Expose utility to the global object
    global.$mainUtils = mainUtils;

})(window);
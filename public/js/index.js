/**
 * Created by dsar941 on 9/8/2016.
 */
"use strict";

var EMP = (function (global) {

    var mainUtils = {}, // namespace for utility
        templistOfModel = [], // delete operation
        model = [], // selected models in Load Models
        model2DArray = [],
        combinedMembrane = []; // combine all membranes in js

    var workspaceNameList = [],
        workspaceCnt = 0,
        workspacejsonObj = [];

    var modelEntityName = [], // search action
        modelEntityNameArray = [], // model action
        modelEntityFullNameArray = [],
        modelEntityInLoadModels = [], // Load Models Entity
        lengthOfLoadModelTable, // switching between pages
        visualizedModelsOnPlatform = [],
        alreadyDiscoveredModels = []; // will not appear in case of re-discover phase

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
        showLoading("#main-content");
        sendGetRequest(
            homeHtml,
            function (homeHtmlContent) {
                $("#main-content").html(homeHtmlContent);
            },
            false);

        // var data = [
        //     {
        //         "med_fma": "http://purl.obolibrary.org/obo/FMA_84666",
        //         "med_pr": "http://purl.obolibrary.org/obo/PR_P55018",
        //         "med_pr_text": "solute carrier family 12 member 3 (rat)",
        //         "med_pr_text_syn": "TSC",
        //         "model_entity": "chang_fujita_b_1999.cellml#total_transepithelial_sodium_flux.J_mc_Na",
        //         "model_entity2": "chang_fujita_b_1999.cellml#solute_concentrations.J_mc_Cl",
        //         "model_entity3": "",
        //         "protein_name": "http://purl.obolibrary.org/obo/CL_0000066",
        //         "sink_fma": "http://purl.obolibrary.org/obo/FMA_66836",
        //         "sink_fma2": "http://purl.obolibrary.org/obo/FMA_66836",
        //         "sink_fma3": "",
        //         "solute_chebi": "http://purl.obolibrary.org/obo/CHEBI_29101",
        //         "solute_chebi2": "http://purl.obolibrary.org/obo/CHEBI_17996",
        //         "solute_chebi3": "",
        //         "solute_text": "Na+",
        //         "solute_text2": "Cl-",
        //         "solute_text3": "",
        //         "source_fma": "http://purl.obolibrary.org/obo/FMA_74550",
        //         "source_fma2": "http://purl.obolibrary.org/obo/FMA_74550",
        //         "source_fma3": "",
        //         "variable_text": "J_mc_Na",
        //         "variable_text2": "J_mc_Cl",
        //         "variable_text3": ""
        //     },
        //     {
        //         "med_fma": "http://purl.obolibrary.org/obo/FMA_84666",
        //         "med_pr": "http://purl.obolibrary.org/obo/PR_Q63633",
        //         "med_pr_text": "solute carrier family 12 member 5 (rat)",
        //         "med_pr_text_syn": "Q63633",
        //         "model_entity": "chang_fujita_b_1999.cellml#solute_concentrations.J_mc_Cl",
        //         "model_entity2": "chang_fujita_b_1999.cellml#total_transepithelial_potassium_flux.J_mc_K",
        //         "model_entity3": "",
        //         "protein_name": "http://purl.obolibrary.org/obo/CL_0000066",
        //         "sink_fma": "http://purl.obolibrary.org/obo/FMA_66836",
        //         "sink_fma2": "http://purl.obolibrary.org/obo/FMA_66836",
        //         "sink_fma3": "",
        //         "solute_chebi": "http://purl.obolibrary.org/obo/CHEBI_17996",
        //         "solute_chebi2": "http://purl.obolibrary.org/obo/CHEBI_29103",
        //         "solute_chebi3": "",
        //         "solute_text": "Cl-",
        //         "solute_text2": "K+",
        //         "solute_text3": "",
        //         "source_fma": "http://purl.obolibrary.org/obo/FMA_74550",
        //         "source_fma2": "http://purl.obolibrary.org/obo/FMA_74550",
        //         "source_fma3": "",
        //         "variable_text": "J_mc_Cl",
        //         "variable_text2": "J_mc_K",
        //         "variable_text3": ""
        //     }
        // ];

        // var url = "http://127.0.0.1:8000/model";
        // var url = "./snippets/newmodel-snippet.html";
        // $("#main-content").html("Model Assembly Service: <a href=" + url + " + target=_blank>Click here</a>");

        // var url = "http://127.0.0.1:8000/post";
        // sendPostRequest(
        //     url,
        //     JSON.stringify(data),
        //     function (content) {
        //         console.log(content);
        //         $("#main-content").html(content);
        //     },
        //     false);
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

    // ACTIONS: event handling for MODEL DISCOVERY and LOAD MODELS
    // Retrieve and save model name for clicking a checkbox in MODEL DISCOVERY and LOAD MODELS
    var actions = {

        search: function (event) {

            if (event.target.className == "checkbox") {

                if (event.target.checked) {
                    var tempidWithStr = event.target.id,
                        workspaceName = tempidWithStr.slice(0, tempidWithStr.search("#"));

                    workspaceNameList.push(workspaceName);
                    modelEntityName.push(tempidWithStr);

                    mainUtils.selectedWorkspaceName = workspaceName; // view a model's detailed information
                    mainUtils.selectedTempidWithStr = tempidWithStr; // view a model's detailed information
                }
                else {
                    var tempidWithStr = event.target.id,
                        workspaceName = tempidWithStr.slice(0, tempidWithStr.search("#"));

                    modelEntityName.splice(modelEntityName.indexOf(tempidWithStr), 1);
                    workspaceNameList.splice(workspaceNameList.indexOf(workspaceName), 1);
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
                workspaceNameList.push(workspaceName);
                modelEntityName.push(tempidWithStr);
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

    // ACTIONS: if there is an action with the given name, call it
    $(document).on("click", function (event) {
        if (typeof actions[event.target.dataset.action] === "function")
            actions[event.target.dataset.action].call(this, event);
    });

    // MODEL DISCOVERY: enter search texts
    $(document).on("keydown", function (event) {
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
            listOfProteinURIs = [];
            head = [];

            discoverIndex = 0; // discoverIndex to index each Model_entity

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
                    console.log("jsonModel: ", jsonModel);
                    // REMOVE duplicate cellml model and variable name (NOT component name)
                    jsonModel.results.bindings = uniqueifyjsonModel(jsonModel.results.bindings);
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

        var model = parseModelName(jsonModel.results.bindings[discoverIndex].Model_entity.value);
        model = model + "#" + model.slice(0, model.indexOf("."));

        var query = "SELECT ?Protein WHERE { " + "<" + model + "> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein. }";

        sendPostRequest(
            endpoint,
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
                    endpointproteinOLS = abiOntoEndpoint + "/pr";
                }
                else {
                    pr_uri = jsonProteinUri.results.bindings[0].Protein.value;

                    if (pr_uri == epithelialcellID)
                        endpointproteinOLS = abiOntoEndpoint + "/cl/terms?iri=" + pr_uri;
                    else if (pr_uri.indexOf(partOfGOUri) != -1) {
                        endpointproteinOLS = abiOntoEndpoint + "/go/terms?iri=" + pr_uri;
                    }
                    else
                        endpointproteinOLS = abiOntoEndpoint + "/pr/terms?iri=" + pr_uri;

                    // dropdown list
                    listOfProteinURIs.push(pr_uri);
                }

                console.log("pr_uri: ", pr_uri);
                console.log("endpointproteinOLS: ", endpointproteinOLS);

                var query = mediatorSPARQL(jsonModel.results.bindings[discoverIndex].Model_entity.value);

                sendPostRequest(
                    endpoint,
                    query,
                    function (jsonepithelialobj) {

                        console.log("jsonepithelialobj: ", jsonepithelialobj);

                        // epithelial cell
                        if (pr_uri == epithelialcellID) {
                            for (var i = 0; i < jsonepithelialobj.results.bindings.length; i++) {
                                var temp = jsonepithelialobj.results.bindings[i].mediator.value;

                                if (temp.indexOf(partOfProteinUri) != -1) {
                                    var mediatorURI = jsonepithelialobj.results.bindings[i].mediator.value;
                                    endpointproteinOLS = abiOntoEndpoint + "/pr/terms?iri=" + mediatorURI;
                                    break;
                                }
                            }
                        }

                        console.log("After endpointproteinOLS: ", endpointproteinOLS);

                        sendGetRequest(
                            endpointproteinOLS,
                            function (jsonProtein) {

                                console.log("jsonProtein: ", jsonProtein);

                                var endpointgeneOLS;
                                if (jsonProtein._embedded.terms[0]._links.has_gene_template != undefined)
                                    endpointgeneOLS = jsonProtein._embedded.terms[0]._links.has_gene_template.href;
                                else
                                    endpointgeneOLS = abiOntoEndpoint + "/pr";

                                sendGetRequest(
                                    endpointgeneOLS,
                                    function (jsonGene) {

                                        console.log("jsonGene: ", jsonGene);

                                        var endpointspeciesOLS;
                                        if (jsonProtein._embedded.terms[0]._links.only_in_taxon != undefined)
                                            endpointspeciesOLS = jsonProtein._embedded.terms[0]._links.only_in_taxon.href;
                                        else
                                            endpointspeciesOLS = abiOntoEndpoint + "/pr";

                                        sendGetRequest(
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

            sendGetRequest(
                searchHtml,
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

        // already discovered models will not appear in re-discover phase
        for (var i = 0; i < alreadyDiscoveredModels.length; i++) {
            // delete this model to hide in re-DISCOVERY
            if (modelEntity.indexOf(alreadyDiscoveredModels[i]) != -1) {
                var index = modelEntity.indexOf(alreadyDiscoveredModels);
                modelEntity.splice(index, 1);
                biologicalMeaning.splice(index, 1);
                speciesList.splice(index, 1);
                geneList.splice(index, 1);
                proteinList.splice(index, 1);
            }
        }

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

        // remove if visited the view html page
        modelEntityName.splice(modelEntityName.indexOf(mainUtils.selectedTempidWithStr), 1);
        workspaceNameList.splice(workspaceNameList.indexOf(mainUtils.selectedWorkspaceName), 1);

        var cellmlModel = mainUtils.selectedWorkspaceName;

        if (cellmlModel == undefined) {
            $("#main-content").html("Please select a model from MODEL DISCOVERY");

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

    // LOAD MODELS: extract compartments and locations
    // extension of mainUtils.loadModelHtml function
    var compartmentandlocation = function (compartment, location, protein, species, gene) {

        var tempCompartment = "", counterOLS = 0;

        for (var i in compartment) {

            var fma_uri = compartment[i].Compartment.value;
            console.log("fma_uri: ", fma_uri);
            fma_uri = "http://purl.org/sig/ont/fma/fma" + fma_uri.slice(fma_uri.indexOf("FMA_") + 4);

            var endpointOLS = abiOntoEndpoint + "/fma/terms?iri=" + fma_uri;

            console.log("endpointOLS: ", endpointOLS);

            sendGetRequest(
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
                            fma_uri = "http://purl.org/sig/ont/fma/fma" + fma_uri.slice(fma_uri.indexOf("FMA_") + 4);

                            var endpointOLS = abiOntoEndpoint + "/fma/terms?iri=" + fma_uri;

                            sendGetRequest(
                                endpointOLS,
                                function (jsonObjOLSLocation) {

                                    counterOLSLoc++;
                                    tempLocation += jsonObjOLSLocation._embedded.terms[0].label;

                                    if (counterOLSLoc < location.length) tempLocation += ", ";
                                    else tempLocation += "";

                                    if (counterOLSLoc == location.length) {
                                        workspacejsonObj.push(
                                            {
                                                "Model_entity": modelEntityName[workspaceCnt],
                                                "Protein": protein,
                                                "Species": species,
                                                "Gene": gene,
                                                "Compartment": tempCompartment,
                                                "Located_in": tempLocation
                                            }
                                        )

                                        workspaceCnt++;

                                        if (workspaceCnt == modelEntityName.length) {
                                            mainUtils.showModel(workspacejsonObj);
                                        }
                                        else {
                                            loadModelHtmlInner(workspaceNameList[workspaceCnt]);
                                        }
                                    }
                                },
                                true);
                        }
                    }
                },
                true);
        }
    };

    var loadModelHtmlInner = function (model) {
        console.log("loadModelHtmlInner: ", model);

        if (model != undefined)
            model = model + "#" + model.slice(0, model.indexOf("."));

        var query = "SELECT ?Protein WHERE { " + "<" + model + "> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein. }";

        sendPostRequest(
            endpoint,
            query,
            function (jsonProteinUri) {

                console.log("loadMOdel jsonProteinUri: ", jsonProteinUri);

                var pr_uri, endpointproteinOLS;
                if (jsonProteinUri.results.bindings.length == 0) {
                    // pr_uri = undefined;
                    endpointproteinOLS = abiOntoEndpoint + "/pr";
                }
                else {
                    pr_uri = jsonProteinUri.results.bindings[0].Protein.value;

                    if (pr_uri == epithelialcellID)
                        endpointproteinOLS = abiOntoEndpoint + "/cl/terms?iri=" + pr_uri;
                    else if (pr_uri.indexOf(partOfGOUri) != -1) {
                        endpointproteinOLS = abiOntoEndpoint + "/go/terms?iri=" + pr_uri;
                    }
                    else
                        endpointproteinOLS = abiOntoEndpoint + "/pr/terms?iri=" + pr_uri;
                }

                console.log("loadMOdel pr_uri: ", pr_uri);
                console.log("loadMOdel endpointproteinOLS: ", endpointproteinOLS);

                sendGetRequest(
                    endpointproteinOLS,
                    function (jsonProtein) {

                        console.log("loadModel jsonProtein: ", jsonProtein);

                        var endpointgeneOLS;
                        if (jsonProtein._embedded == undefined || jsonProtein._embedded.terms[0]._links.has_gene_template == undefined)
                            endpointgeneOLS = abiOntoEndpoint + "/pr";
                        else
                            endpointgeneOLS = jsonProtein._embedded.terms[0]._links.has_gene_template.href;

                        sendGetRequest(
                            endpointgeneOLS,
                            function (jsonGene) {

                                var endpointspeciesOLS;
                                if (jsonProtein._embedded == undefined || jsonProtein._embedded.terms[0]._links.only_in_taxon == undefined)
                                    endpointspeciesOLS = abiOntoEndpoint + "/pr";
                                else
                                    endpointspeciesOLS = jsonProtein._embedded.terms[0]._links.only_in_taxon.href;

                                sendGetRequest(
                                    endpointspeciesOLS,
                                    function (jsonSpecies) {

                                        var query = "SELECT ?Compartment " +
                                            "WHERE { " + "<" + model + "> <http://www.obofoundry.org/ro/ro.owl#compartmentOf> ?Compartment. }";

                                        sendPostRequest(
                                            endpoint,
                                            query,
                                            function (jsonObjCompartment) {

                                                var query = "SELECT ?Located_in " +
                                                    "WHERE { " + "<" + model + "> <http://www.obofoundry.org/ro/ro.owl#located_in> ?Located_in. }";

                                                sendPostRequest(
                                                    endpoint,
                                                    query,
                                                    function (jsonObjLocation) {

                                                        sendGetRequest(
                                                            modelHtml,
                                                            function (modelHtmlContent) {

                                                                $("#main-content").html(modelHtmlContent);

                                                                if (jsonObjCompartment.results.bindings.length == 0 &&
                                                                    jsonObjLocation.results.bindings.length == 0) {
                                                                    mainUtils.showModel(workspacejsonObj);
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
    }

    // LOAD MODELS: load a selected model
    mainUtils.loadModelHtml = function () {
        loadModelHtmlInner(workspaceNameList[workspaceCnt]);
    };

    // LOAD MODELS: display a selected model
    mainUtils.showModel = function (jsonObj) {

        for (var i = 0; i < jsonObj.length; i++) {
            // add this model temporarily to display in MODEL DISCOVERY when deleted
            if (modelEntityInLoadModels.indexOf(jsonObj[i].Model_entity) == -1) {
                var index = modelEntity.indexOf(jsonObj[i].Model_entity);
                modelEntityInLoadModels.push([
                    jsonObj[i].Model_entity,
                    biologicalMeaning[index],
                    speciesList[index],
                    geneList[index],
                    proteinList[index]]);
            }
        }

        for (var i = 0; i < jsonObj.length; i++) {
            // delete this model to hide in MODEL DISCOVERY when revisited
            if (modelEntity.indexOf(jsonObj[i].Model_entity) != -1) {
                var index = modelEntity.indexOf(jsonObj[i].Model_entity);
                modelEntity.splice(index, 1);
                biologicalMeaning.splice(index, 1);
                speciesList.splice(index, 1);
                geneList.splice(index, 1);
                proteinList.splice(index, 1);
            }
        }

        // Empty result
        if ($.isEmptyObject(jsonObj)) {
            $("#modelList").html("Please load models from MODEL DISCOVERY");
            return;
        }

        var head = [];
        for (var name in jsonObj[0]) {
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

        for (var m = 0; m < jsonObj.length; m++) {
            for (var i in head) {
                if (i == 0) {
                    // search list to model list with empty model
                    if (jsonObj[m].length == 0) break;

                    if (isExistModel2DArray(jsonObj[m]["Model_entity"], model2DArray))
                        break;

                    model.push($("<label/>").html("<input id=" + jsonObj[m]["Model_entity"] + " + type=checkbox " +
                        "name=attribute class=attribute data-action=model value=" + jsonObj[m]["Model_entity"] + " >"));
                }

                if (head[i] == "Model_entity")
                    model.push(jsonObj[m]["Model_entity"]);
                else
                    model.push(jsonObj[m][head[i]]);
            }
        }

        console.log("model: ", model);

        // 1D to 2D array
        for (var i = 0; i < model.length; i++) {
            model2DArray.push(model.splice(0, 7)); // 6 + 1 (checkbox) header element
        }

        model2DArray = uniqueifymodel2DArray(model2DArray);

        console.log("model2DArray: ", model2DArray);

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

        // already disocvered models will not appear in case of rediscover phase
        for (var i = 0; i < model2DArray.length; i++) {
            alreadyDiscoveredModels.push(model2DArray[i][1]);
        }

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
            workspaceNameList = [];
            workspaceCnt = 0;
            modelEntityName = [];
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
            workspaceNameList = [];
            workspaceCnt = 0;
            modelEntityName = [];
            $("#modelList").html("Please load models from MODEL DISCOVERY");
            return;
        }
    };

    // MODEL OF SIMILARITY: load the SVG diagram through similarityModels function
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

    // EPITHELIAL PLATFORM: load the epithelial html
    mainUtils.loadEpithelialHtml = function () {

        // make empty list in LOAD MODELS
        if (lengthOfLoadModelTable == 2) {
            workspaceNameList = [];
            workspaceCnt = 0;
            modelEntityName = [];
            $("#modelList").html("Please load models from MODEL DISCOVERY");
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

            epithelialPlatform(
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

        // remove visualized solutes in the next iteration in Load Model
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

            var query = makecotransporterSPARQL(membrane1.model_entity, membrane2.model_entity);

            sendPostRequest(
                endpoint,
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

                        if (tmpPro.indexOf(partOfProteinUri) != -1) {
                            tempProtein.push(jsonObj.results.bindings[m].med_entity_uri.value);
                        }

                        if (tmpApi.indexOf(apicalID) != -1) {
                            tempApical.push(jsonObj.results.bindings[m].med_entity_uri.value);
                        }

                        if (tmpBas.indexOf(basolateralID) != -1) {
                            tempBasolateral.push(jsonObj.results.bindings[m].med_entity_uri.value);
                        }

                        if (tmpCap.indexOf(capillaryID) != -1) {
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
                        sink_fma2: membrane2.sink_fma,
                        solute_chebi3: "",
                        solute_text3: "",
                        model_entity3: "",
                        variable_text3: "",
                        source_fma3: "",
                        sink_fma3: ""
                    };

                    // console.log("tempprotein: ", tempProtein);

                    for (var i = 0; i < tempProtein.length; i++) {

                        // cotransporter in apical membrane
                        if (tempProtein.length != 0 && tempApical.length != 0) {
                            apicalMembrane.push(membraneOBJ);
                        }

                        // cotransporter in basolateral membrane
                        if (tempProtein.length != 0 && tempBasolateral.length != 0) {
                            basolateralMembrane.push(membraneOBJ);
                        }

                        // cotransporter in capillary membrane
                        if (tempProtein.length != 0 && tempCapillary.length != 0) {
                            capillaryMembrane.push(membraneOBJ);
                        }
                    }

                    // cotransporter in apical membrane
                    if (membrane1.med_fma == apicalID && membrane2.med_fma == apicalID &&
                        membrane1.med_pr == membrane2.med_pr) {
                        apicalMembrane.push(membraneOBJ);
                    }

                    // cotransporter in basolateral membrane
                    if (membrane1.med_fma == basolateralID && membrane2.med_fma == basolateralID &&
                        membrane1.med_pr == membrane2.med_pr) {
                        basolateralMembrane.push(membraneOBJ);
                    }

                    // cotransporter in capillary membrane
                    if (membrane1.med_fma == capillaryID && membrane2.med_fma == capillaryID &&
                        membrane1.med_pr == membrane2.med_pr) {
                        capillaryMembrane.push(membraneOBJ);
                    }

                    counter++;

                    if (counter == iteration(membrane.length)) {

                        console.log("membrane in makecotransporter: ", membrane);
                        console.log("apicalMembrane in makecotransporter: ", apicalMembrane);
                        console.log("basolateralMembrane in makecotransporter: ", basolateralMembrane);
                        console.log("capillaryMembrane in makecotransporter: ", capillaryMembrane);

                        rmFromModelEntityFullNameArray(membrane, concentration_fma);

                        console.log("model2DArr in makecotransporter: ", model2DArray);
                        console.log("modelEntityNameArray in makecotransporter: ", modelEntityNameArray);
                        console.log("modelEntityFullNameArray in makecotransporter: ", modelEntityFullNameArray);
                        console.log("templistOfModel in makecotransporter: ", templistOfModel);

                        epithelialPlatform(
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

        // make tritransporters between fluxes
        mainUtils.maketritransporter = function (membrane1, membrane2, membrane3) {

            var query = maketritransporterSPARQL(membrane1.model_entity, membrane2.model_entity, membrane3.model_entity);

            sendPostRequest(
                endpoint,
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

                        if (tmpPro.indexOf(partOfProteinUri) != -1) {
                            tempProtein.push(jsonObj.results.bindings[m].med_entity_uri.value);
                        }

                        if (tmpApi.indexOf(apicalID) != -1) {
                            tempApical.push(jsonObj.results.bindings[m].med_entity_uri.value);
                        }

                        if (tmpBas.indexOf(basolateralID) != -1) {
                            tempBasolateral.push(jsonObj.results.bindings[m].med_entity_uri.value);
                        }

                        if (tmpCap.indexOf(capillaryID) != -1) {
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
                        sink_fma2: membrane2.sink_fma,
                        solute_chebi3: membrane3.solute_chebi,
                        solute_text3: membrane3.solute_text,
                        model_entity3: membrane3.model_entity,
                        variable_text3: membrane3.variable_text,
                        source_fma3: membrane3.source_fma,
                        sink_fma3: membrane3.sink_fma
                    };

                    // console.log("tempprotein: ", tempProtein);

                    for (var i = 0; i < tempProtein.length; i++) {

                        // tritransporter in apical membrane
                        if (tempProtein.length != 0 && tempApical.length != 0) {
                            apicalMembrane.push(membraneOBJ);
                        }

                        // tritransporter in basolateral membrane
                        if (tempProtein.length != 0 && tempBasolateral.length != 0) {
                            basolateralMembrane.push(membraneOBJ);
                        }

                        // tritransporter in capillary membrane
                        if (tempProtein.length != 0 && tempCapillary.length != 0) {
                            capillaryMembrane.push(membraneOBJ);
                        }
                    }

                    // transporter in apical membrane
                    if (membrane1.med_fma == apicalID && membrane2.med_fma == apicalID && membrane3.med_fma == apicalID &&
                        membrane1.med_pr == membrane2.med_pr && membrane2.med_pr == membrane3.med_pr) {
                        apicalMembrane.push(membraneOBJ);
                    }

                    // transporter in basolateral membrane
                    if (membrane1.med_fma == basolateralID && membrane2.med_fma == basolateralID && membrane3.med_fma == basolateralID &&
                        membrane1.med_pr == membrane2.med_pr && membrane2.med_pr == membrane3.med_pr) {
                        basolateralMembrane.push(membraneOBJ);
                    }

                    // transporter in capillary membrane
                    if (membrane1.med_fma == capillaryID && membrane2.med_fma == capillaryID && membrane3.med_fma == capillaryID &&
                        membrane1.med_pr == membrane2.med_pr && membrane2.med_pr == membrane3.med_pr) {
                        capillaryMembrane.push(membraneOBJ);
                    }

                    if (membrane.length == 0) {

                        console.log("membrane in maketritransporter: ", membrane);
                        console.log("apicalMembrane maketritransporter: ", apicalMembrane);
                        console.log("basolateralMembrane in maketritransporter: ", basolateralMembrane);
                        console.log("capillaryMembrane in maketritransporter: ", capillaryMembrane);

                        rmFromModelEntityFullNameArray(membrane, concentration_fma);

                        console.log("model2DArr in maketritransporter: ", model2DArray);
                        console.log("modelEntityNameArray in maketritransporter: ", modelEntityNameArray);
                        console.log("modelEntityFullNameArray in maketritransporter: ", modelEntityFullNameArray);
                        console.log("templistOfModel in maketritransporter: ", templistOfModel);

                        epithelialPlatform(
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
                model = parseModelName(modelEntityFullNameArray[index]);
                model = model + "#" + model.slice(0, model.indexOf("."));
            }

            query = opbSPARQL(modelEntityFullNameArray[index]);

            sendPostRequest(
                endpoint,
                query,
                function (jsonObjOPB) {
                    // flux OPB
                    if (jsonObjOPB.results.bindings[0].opb.value == fluxOPB) {

                        query = srcDescMediatorOfFluxesSPARQL(modelEntityFullNameArray[index], model);

                        sendPostRequest(
                            endpoint,
                            query,
                            function (jsonObjFlux) {

                                console.log("jsonObjFlux in index.js: ", jsonObjFlux);

                                var chebi_uri = jsonObjFlux.results.bindings[0].solute_chebi.value;
                                var endpointOLS = abiOntoEndpoint + "/chebi/terms?iri=" + chebi_uri;

                                console.log("endpointOLS in index.js: ", endpointOLS);

                                sendGetRequest(
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

                                        // console.log("med_pr[0], med_pr in index.js: ", med_pr[0], med_pr);
                                        // console.log("med_fma in index.js: ", med_fma);

                                        var medURI, endpointOLS, srctext, temp_med_pr, med_pr_text_syn, tempvar;

                                        if (med_pr[0] == undefined)
                                            medURI = jsonObjFlux.results.bindings[0].protein.value;
                                        else
                                            medURI = med_pr[0].fma;

                                        if (medURI.indexOf(partOfCHEBIUri) != -1) {
                                            endpointOLS = abiOntoEndpoint + "/chebi/terms?iri=" + chebi_uri;
                                        }
                                        else if (medURI.indexOf(partOfGOUri) != -1) {
                                            endpointOLS = abiOntoEndpoint + "/go/terms?iri=" + medURI;
                                        }
                                        else
                                            endpointOLS = abiOntoEndpoint + "/pr/terms?iri=" + medURI;

                                        sendGetRequest(
                                            endpointOLS,
                                            function (jsonObjOLSMedPr) {

                                                // console.log("jsonObjOLSMedPr in index.js: ", jsonObjOLSMedPr);

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
                                                            srctext = parserFmaNameText(source_fma[i]);

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

                                                        epithelialPlatform(
                                                            combinedMembrane,
                                                            concentration_fma,
                                                            source_fma2,
                                                            sink_fma2,
                                                            apicalMembrane,
                                                            basolateralMembrane,
                                                            capillaryMembrane,
                                                            membrane);
                                                    }
                                                    else if (membrane.length <= 2) {

                                                        console.log("membrane.length <= 2 membrane: ", membrane);

                                                        console.log("membrane: ", membrane);
                                                        console.log("model2DArr: ", model2DArray);
                                                        console.log("modelEntityNameArray: ", modelEntityNameArray);
                                                        console.log("modelEntityFullNameArray: ", modelEntityFullNameArray);
                                                        console.log("templistOfModel: ", templistOfModel);

                                                        // make co-transporter
                                                        for (i = 0; i < membrane.length; i++) {
                                                            for (var j = i + 1; j < membrane.length; j++) {
                                                                mainUtils.makecotransporter(membrane[i], membrane[j]);
                                                            }
                                                        }
                                                    }
                                                    else if (membrane.length >= 3) {

                                                        console.log("membrane.length >= 3 membrane: ", membrane);

                                                        rmFromModelEntityFullNameArray(membrane, concentration_fma);

                                                        console.log("membrane: ", membrane);
                                                        console.log("model2DArr: ", model2DArray);
                                                        console.log("modelEntityNameArray: ", modelEntityNameArray);
                                                        console.log("modelEntityFullNameArray: ", modelEntityFullNameArray);
                                                        console.log("templistOfModel: ", templistOfModel);

                                                        var arr = [];
                                                        for (var i = 0; i < membrane.length; i++) {
                                                            if (membrane[i].med_pr == nkcc1) {
                                                                arr.push(membrane[i]);

                                                                membrane.splice(i, 1);
                                                                i--;
                                                            }
                                                        }

                                                        if (arr.length == 3) {
                                                            mainUtils.maketritransporter(arr[0], arr[1], arr[2]);
                                                        }
                                                        else {
                                                            for (var i = 0; i < arr.length; i++) {
                                                                membrane.push(arr.pop());
                                                                i--;
                                                            }
                                                        }

                                                        // make co-transporter
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
                    else if (jsonObjOPB.results.bindings[0].opb.value == concentrationOPB) {

                        query = concentrationOPBSPARQL(modelEntityFullNameArray[index], model);

                        sendPostRequest(
                            endpoint,
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

                                        epithelialPlatform(
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
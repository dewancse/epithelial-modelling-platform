/**
 * Created by dsar941 on 9/8/2016.
 */
var miscellaneous = require("./miscellaneous.js");
var ajaxUtils = require("./../libs/ajax-utils.js");
var sparqlUtils = require("./sparqlUtils.js");

"use strict";

var usecase = (function (global) {

    var mainUtils = {}, // namespace for utility
        model = [], // selected models in Load Models
        chebiURI,
        cellmlModelEntity;

    // MODEL DISCOVERY
    var modelEntity = [],
        biologicalMeaning = [],
        speciesList = [],
        geneList = [],
        proteinList = [],
        listOfProteinURIs = [],
        head = [],
        discoverIndex = 0;

    var relatedModel = [], membraneModelObj = [], alternativeModelObj = [], relatedModelObj = [],
        modelEntityObj = [], membraneModelID = [], proteinName, proteinText, cellmlModel, biological_meaning,
        speciesName, geneName, compartmentName, locationName, idProtein = 0, idAltProtein = 0, idMembrane = 0,
        locationOfModel, typeOfModel, organIndex, relatedModelEntity = [], cotransporterList = [], counter = 0;

    // DOCUMENTATION: load documentation from github
    mainUtils.loadDocumentation = function () {
        var uri = "https://github.com/dewancse/epithelial-modelling-platform";
        $("#main-content").html("Documentation can be found at " +
            "<a href=" + uri + " + target=_blank>README.md in github</a>");
    };

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
                sparqlUtils.usecaseHtml,
                function (usecaseHtmlContent) {
                    $("#main-content").html(usecaseHtmlContent);

                    $(".carousel").carousel({
                        interval: 2000
                    });
                },
                false);
        }

        $(".dropdown-toggle").dropdown();
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

            // chebi term from search text
            chebiURI = uriCHEBI;

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
                    // REMOVE duplicate cellml model and variable name (NOT component name)
                    jsonModel.results.bindings = miscellaneous.uniqueifyjsonModel(jsonModel.results.bindings);
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
                    else
                        endpointproteinOLS = sparqlUtils.abiOntoEndpoint + "/pr/terms?iri=" + pr_uri;

                    // dropdown list
                    listOfProteinURIs.push(pr_uri);
                }

                ajaxUtils.sendGetRequest(
                    endpointproteinOLS,
                    function (jsonProtein) {

                        var endpointgeneOLS;
                        if (jsonProtein._embedded.terms[0]._links.has_gene_template != undefined)
                            endpointgeneOLS = jsonProtein._embedded.terms[0]._links.has_gene_template.href;
                        else
                            endpointgeneOLS = sparqlUtils.abiOntoEndpoint + "/pr";

                        ajaxUtils.sendGetRequest(
                            endpointgeneOLS,
                            function (jsonGene) {

                                var endpointspeciesOLS;
                                if (jsonProtein._embedded.terms[0]._links.only_in_taxon != undefined)
                                    endpointspeciesOLS = jsonProtein._embedded.terms[0]._links.only_in_taxon.href;
                                else
                                    endpointspeciesOLS = sparqlUtils.abiOntoEndpoint + "/pr";

                                ajaxUtils.sendGetRequest(
                                    endpointspeciesOLS,
                                    function (jsonSpecies) {

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
    };

    // MODEL DISCOVERY: load the search html
    mainUtils.usecaseHtml = function () {
        if (!sessionStorage.getItem("searchListContent")) {
            ajaxUtils.sendGetRequest(
                sparqlUtils.usecaseHtml,
                function (searchHtmlContent) {
                    $("#main-content").html(searchHtmlContent);
                },
                false);
        }
        else {
            $("#main-content").html(sessionStorage.getItem("searchListContent"));
            mainUtils.showDiscoverModels();
        }
    };

    var dropcircle = function () {

        // parsing
        cellmlModel = cellmlModelEntity;
        var indexOfHash = cellmlModel.search("#");
        cellmlModel = cellmlModel.slice(0, indexOfHash);

        cellmlModel = cellmlModel + "#" + cellmlModel.slice(0, cellmlModel.indexOf("."));

        var query = "SELECT ?Protein ?Biological_meaning " +
            "WHERE { GRAPH ?g { " +
            "<" + cellmlModel + "> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein . " +
            "<" + cellmlModelEntity + "> <http://purl.org/dc/terms/description> ?Biological_meaning . " +
            "}}";

        // console.log("query: ", query);

        // protein name
        ajaxUtils.sendPostRequest(
            sparqlUtils.endpoint,
            query,
            function (jsonModel) {

                console.log("jsonModel: ", jsonModel);

                if (jsonModel.results.bindings.length == 0)
                    proteinName = undefined;
                else
                    proteinName = jsonModel.results.bindings[0].Protein.value;

                var endpointprOLS;
                if (proteinName != undefined) {
                    if (proteinName == sparqlUtils.epithelialcellID)
                        endpointprOLS = sparqlUtils.abiOntoEndpoint + "/cl/terms?iri=" + proteinName;
                    else
                        endpointprOLS = sparqlUtils.abiOntoEndpoint + "/pr/terms?iri=" + proteinName;
                }
                else
                    endpointprOLS = sparqlUtils.abiOntoEndpoint + "/pr";

                ajaxUtils.sendGetRequest(
                    endpointprOLS,
                    function (jsonPr) {

                        var endpointgeneOLS;
                        if (jsonPr._embedded == undefined || jsonPr._embedded.terms[0]._links.has_gene_template == undefined)
                            endpointgeneOLS = sparqlUtils.abiOntoEndpoint + "/pr";
                        else
                            endpointgeneOLS = jsonPr._embedded.terms[0]._links.has_gene_template.href;

                        ajaxUtils.sendGetRequest(
                            endpointgeneOLS,
                            function (jsonGene) {

                                var endpointspeciesOLS;
                                if (jsonPr._embedded == undefined || jsonPr._embedded.terms[0]._links.only_in_taxon == undefined)
                                    endpointspeciesOLS = sparqlUtils.abiOntoEndpoint + "/pr";
                                else
                                    endpointspeciesOLS = jsonPr._embedded.terms[0]._links.only_in_taxon.href;

                                ajaxUtils.sendGetRequest(
                                    endpointspeciesOLS,
                                    function (jsonSpecies) {

                                        var query = "SELECT ?Compartment " +
                                            "WHERE { " + "<" + cellmlModel + "> <http://www.obofoundry.org/ro/ro.owl#compartmentOf> ?Compartment. }";

                                        ajaxUtils.sendPostRequest(
                                            sparqlUtils.endpoint,
                                            query,
                                            function (jsonObjCompartment) {

                                                var query = "SELECT ?Located_in " +
                                                    "WHERE { " + "<" + cellmlModel + "> <http://www.obofoundry.org/ro/ro.owl#located_in> ?Located_in. }";

                                                ajaxUtils.sendPostRequest(
                                                    sparqlUtils.endpoint,
                                                    query,
                                                    function (jsonObjLocation) {

                                                        if (jsonPr._embedded == undefined)
                                                            proteinText = "Numerical model"; // Or undefined
                                                        else {
                                                            proteinText = jsonPr._embedded.terms[0].label;
                                                            proteinText = proteinText.slice(0, proteinText.indexOf("(") - 1);
                                                        }

                                                        if (jsonModel.results.bindings.length == 0)
                                                            biological_meaning = "";
                                                        else {
                                                            biological_meaning = jsonModel.results.bindings[0].Biological_meaning.value;
                                                        }

                                                        if (jsonSpecies._embedded == undefined)
                                                            speciesName = "Numerical model"; // Or undefined
                                                        else
                                                            speciesName = jsonSpecies._embedded.terms[0].label;

                                                        if (jsonGene._embedded == undefined)
                                                            geneName = "Numerical model"; // Or undefined
                                                        else {
                                                            geneName = jsonGene._embedded.terms[0].label;
                                                            geneName = geneName.slice(0, geneName.indexOf("(") - 1);
                                                        }

                                                        // compartment and location in LOAD MODELS
                                                        compartmentandlocation(
                                                            jsonObjCompartment.results.bindings,
                                                            jsonObjLocation.results.bindings);
                                                    },
                                                    true);
                                            },
                                            true);
                                    }, true);
                            }, true);
                    }, true);
            }, true);
    };

    var compartmentandlocation = function (compartment, location) {

        console.log("compartment, location: ", compartment, location);

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

                                        compartmentName = tempCompartment;
                                        locationName = tempLocation;

                                        dropcircleExtended();
                                    }
                                },
                                true);
                        }
                    }
                },
                true);
        }
    };

    // remaining part of dropcircle function
    var dropcircleExtended = function () {

        var query = "SELECT ?located_in " +
            "WHERE { GRAPH ?g { <" + cellmlModel + "> <http://www.obofoundry.org/ro/ro.owl#located_in> ?located_in . " +
            "}}";

        // location of that cellml model
        ajaxUtils.sendPostRequest(
            sparqlUtils.endpoint,
            query,
            function (jsonLocatedin) {

                console.log("jsonLocatedin: ", jsonLocatedin);

                var jsonLocatedinCounter = 0;
                // Type of model - kidney, lungs, etc
                for (i = 0; i < jsonLocatedin.results.bindings.length; i++) {
                    for (j = 0; j < sparqlUtils.organ.length; j++) {
                        for (var k = 0; k < sparqlUtils.organ[j].key.length; k++) {
                            if (jsonLocatedin.results.bindings[i].located_in.value == sparqlUtils.organ[j].key[k].key)
                                jsonLocatedinCounter++;

                            if (jsonLocatedinCounter == jsonLocatedin.results.bindings.length) {
                                typeOfModel = sparqlUtils.organ[j].value;
                                organIndex = j;
                                break;
                            }
                        }
                        if (jsonLocatedinCounter == jsonLocatedin.results.bindings.length)
                            break;
                    }
                    if (jsonLocatedinCounter == jsonLocatedin.results.bindings.length)
                        break;
                }

                locationOfModel = "";
                jsonLocatedinCounter = 0;
                // location of the above type of model
                for (i = 0; i < jsonLocatedin.results.bindings.length; i++) {
                    for (j = 0; j < sparqlUtils.organ[organIndex].key.length; j++) {
                        if (jsonLocatedin.results.bindings[i].located_in.value == sparqlUtils.organ[organIndex].key[j].key) {
                            locationOfModel += sparqlUtils.organ[organIndex].key[j].value;

                            if (i == jsonLocatedin.results.bindings.length - 1)
                                locationOfModel += ".";
                            else
                                locationOfModel += ", ";

                            jsonLocatedinCounter++;
                        }
                        if (jsonLocatedinCounter == jsonLocatedin.results.bindings.length)
                            break;
                    }
                    if (jsonLocatedinCounter == jsonLocatedin.results.bindings.length)
                        break;
                }

                // related cellml model, i.e. kidney, lungs, etc
                query = "SELECT ?cellmlmodel ?located_in " +
                    "WHERE { GRAPH ?g { ?cellmlmodel <http://www.obofoundry.org/ro/ro.owl#located_in> ?located_in. " +
                    "}}";

                ajaxUtils.sendPostRequest(
                    sparqlUtils.endpoint,
                    query,
                    function (jsonRelatedModel) {

                        console.log("jsonRelatedModel: ", jsonRelatedModel);

                        var query = "PREFIX semsim: <http://www.bhi.washington.edu/SemSim#> " +
                            "PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#> " +
                            "SELECT ?med_entity_uri " +
                            "WHERE { " +
                            "<" + cellmlModelEntity + "> semsim:isComputationalComponentFor ?model_prop. " +
                            "?model_prop semsim:physicalPropertyOf ?model_proc. " +
                            "?model_proc semsim:hasMediatorParticipant ?model_medparticipant. " +
                            "?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity. " +
                            "?med_entity semsim:hasPhysicalDefinition ?med_entity_uri. " +
                            "}";

                        ajaxUtils.sendPostRequest(
                            sparqlUtils.endpoint,
                            query,
                            function (jsonMediator) {

                                console.log("jsonMediator: ", jsonMediator);

                                for (i = 0; i < jsonRelatedModel.results.bindings.length; i++) {
                                    for (j = 0; j < sparqlUtils.organ[organIndex].key.length; j++) {
                                        if (jsonRelatedModel.results.bindings[i].located_in.value == sparqlUtils.organ[organIndex].key[j].key) {
                                            // parsing
                                            var tempModel = jsonRelatedModel.results.bindings[i].cellmlmodel.value;
                                            var indexOfHash = tempModel.search("#");
                                            tempModel = tempModel.slice(0, indexOfHash);

                                            relatedModel.push(tempModel);

                                            break;
                                        }
                                    }
                                }

                                relatedModel = miscellaneous.uniqueify(relatedModel);

                                var alternativeCellmlArray = [], tempcellmlModel,
                                    indexOfHash = cellmlModel.search("#");
                                tempcellmlModel = cellmlModel.slice(0, indexOfHash);
                                for (i = 0; i < relatedModel.length; i++) {
                                    if (relatedModel[i] != tempcellmlModel) {
                                        alternativeCellmlArray.push(relatedModel[i]);
                                    }
                                }

                                var membrane;
                                for (i = 0; i < jsonMediator.results.bindings.length; i++) {
                                    var mediatorValue = jsonMediator.results.bindings[i].med_entity_uri.value;

                                    if (mediatorValue == sparqlUtils.apicalID)
                                        membrane = sparqlUtils.apicalID;
                                    else if (mediatorValue == sparqlUtils.basolateralID)
                                        membrane = sparqlUtils.basolateralID;
                                    else if (mediatorValue == sparqlUtils.paracellularID)
                                        membrane = sparqlUtils.paracellularID;
                                }

                                // console.log("membrane dropcircleExtended: ", membrane);

                                // console.log("relatedModel: ", relatedModel);
                                relatedCellmlModel(relatedModel, alternativeCellmlArray, membrane);

                            }, true);
                    }, true);
            }, true);
    };

    // related kidney, lungs, etc model
    var relatedCellmlModel = function (relatedModel, alternativeCellmlArray, membrane) {

        var modelname, indexOfcellml, query;
        if (relatedModel[idProtein] == undefined) {
            modelname = undefined;
        }
        else {
            indexOfcellml = relatedModel[idProtein].search(".cellml");
            modelname = relatedModel[idProtein] + "#" + relatedModel[idProtein].slice(0, indexOfcellml);
        }

        // console.log("modelname in relatedCellmlModel: ", modelname);

        query = "SELECT ?Protein ?workspaceName " +
            "WHERE { GRAPH ?workspaceName { <" + modelname + "> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein . " +
            "}}";

        ajaxUtils.sendPostRequest(
            sparqlUtils.endpoint,
            query,
            function (jsonProtein) {

                var endpointprOLS;
                if (jsonProtein.results.bindings.length == 0)
                    endpointprOLS = sparqlUtils.abiOntoEndpoint + "/pr";
                else {
                    var pr_uri = jsonProtein.results.bindings[0].Protein.value;
                    if (pr_uri == sparqlUtils.epithelialcellID)
                        endpointprOLS = sparqlUtils.abiOntoEndpoint + "/cl/terms?iri=" + pr_uri;
                    else
                        endpointprOLS = sparqlUtils.abiOntoEndpoint + "/pr/terms?iri=" + pr_uri;
                }

                ajaxUtils.sendGetRequest(
                    endpointprOLS,
                    function (jsonPr) {

                        if (jsonProtein.results.bindings.length != 0) {

                            relatedModelObj.push({
                                protein: jsonProtein.results.bindings[0].Protein.value,
                                prname: jsonPr._embedded.terms[0].label,
                                workspaceName: jsonProtein.results.bindings[0].workspaceName.value,
                                modelEntity: relatedModel[idProtein] // relatedModel which have #protein
                            });
                        }

                        if (idProtein == relatedModel.length - 1) {
                            idProtein = 0;
                            console.log("idProtein INSIDE: ", idProtein);
                            alternativeCellmlModel(alternativeCellmlArray, membrane);
                            return;
                        }

                        idProtein++;
                        relatedCellmlModel(relatedModel, alternativeCellmlArray, membrane);
                    },
                    true);
            },
            true);
    };

    // alternative model of a dragged transporter, e.g. rat NHE3, mouse NHE3
    var alternativeCellmlModel = function (alternativeCellmlArray, membrane) {

        // console.log("alternativeCellmlArray: ", alternativeCellmlArray[idAltProtein], membrane, alternativeCellmlArray);
        var modelname, indexOfcellml, endpointOLS;
        if (alternativeCellmlArray[idAltProtein] == undefined) {
            modelname = undefined;
        }
        else {
            indexOfcellml = alternativeCellmlArray[idAltProtein].search(".cellml");
            modelname = alternativeCellmlArray[idAltProtein] + "#" +
                alternativeCellmlArray[idAltProtein].slice(0, indexOfcellml);
        }
        // console.log("modelname in alternativeCellmlModel: ", modelname);

        var query = "SELECT ?Protein ?workspaceName " +
            "WHERE { GRAPH ?workspaceName { <" + modelname + "> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein . " +
            "}}";

        ajaxUtils.sendPostRequest(
            sparqlUtils.endpoint,
            query,
            function (jsonAltProtein) {

                if (jsonAltProtein.results.bindings.length == 0)
                    endpointOLS = sparqlUtils.abiOntoEndpoint + "/pr";
                else {
                    var pr_uri = jsonAltProtein.results.bindings[0].Protein.value;
                    if (pr_uri == sparqlUtils.epithelialcellID)
                        endpointOLS = sparqlUtils.abiOntoEndpoint + "/cl/terms?iri=" + pr_uri;
                    else
                        endpointOLS = sparqlUtils.abiOntoEndpoint + "/pr/terms?iri=" + pr_uri;
                }

                ajaxUtils.sendGetRequest(
                    endpointOLS,
                    function (jsonOLSObj) {

                        if (jsonAltProtein.results.bindings.length != 0) {

                            if (jsonAltProtein.results.bindings[0].Protein.value == proteinName) { // comment this

                                alternativeModelObj.push({
                                    protein: jsonAltProtein.results.bindings[0].Protein.value,
                                    prname: jsonOLSObj._embedded.terms[0].label,
                                    modelEntity: modelname,
                                    workspaceName: jsonAltProtein.results.bindings[0].workspaceName.value
                                });
                            }
                        }

                        idAltProtein++;

                        if (idAltProtein == alternativeCellmlArray.length - 1) {

                            idAltProtein = 0;

                            // If apical Then basolateral and vice versa
                            var membraneName;
                            if (membrane == sparqlUtils.apicalID) {
                                membrane = sparqlUtils.basolateralID;
                                membraneName = "Basolateral membrane";

                                console.log("membrane and membraneName: ", membrane, membraneName);
                            }
                            else if (membrane == sparqlUtils.basolateralID) {
                                membrane = sparqlUtils.apicalID;
                                membraneName = "Apical membrane";

                                console.log("membrane and membraneName: ", membrane, membraneName);
                            }
                            else if (membrane == sparqlUtils.paracellularID) {
                                membrane = sparqlUtils.paracellularID;
                                membraneName = "Paracellular membrane";

                                console.log("membrane and membraneName: ", membrane, membraneName);
                            }

                            relatedMembrane(membrane, membraneName);
                            // showModalWindow(membraneName, ModelEntity);
                            return;
                        }

                        alternativeCellmlModel(alternativeCellmlArray, membrane);
                    },
                    true);
            }, true);
    };

    var makecotransporter = function (membrane1, membrane2, fluxList, membraneName) {

        var query = sparqlUtils.makecotransporterSPARQL(membrane1, membrane2);
        ajaxUtils.sendPostRequest(
            sparqlUtils.endpoint,
            query,
            function (jsonObj) {

                // console.log("jsonObj in makecotransporter: ", jsonObj);
                var tempProtein = [], tempFMA = [];
                for (var m = 0; m < jsonObj.results.bindings.length; m++) {
                    var tmpPro = jsonObj.results.bindings[m].med_entity_uri.value;
                    var tmpFMA = jsonObj.results.bindings[m].med_entity_uri.value;

                    if (tmpPro.indexOf("http://purl.obolibrary.org/obo/PR_") != -1) {
                        tempProtein.push(jsonObj.results.bindings[m].med_entity_uri.value);
                    }

                    if (tmpFMA.indexOf("http://identifiers.org/fma/FMA:") != -1) {
                        tempFMA.push(jsonObj.results.bindings[m].med_entity_uri.value);
                    }
                }

                // remove duplicate protein ID
                // TODO: probably no need to do this!
                tempProtein = tempProtein.filter(function (item, pos) {
                    return tempProtein.indexOf(item) == pos;
                });
                tempFMA = tempFMA.filter(function (item, pos) {
                    return tempFMA.indexOf(item) == pos;
                });

                // console.log("tempProtein, and fma: ", tempProtein, tempFMA);

                for (var i in tempProtein) {
                    // cotransporter
                    if (tempProtein.length != 0 && tempFMA.length != 0) {
                        cotransporterList.push({
                            "membrane1": membrane1,
                            "membrane2": membrane2
                        });
                    }
                }

                counter++;

                if (counter == miscellaneous.iteration(fluxList.length)) {

                    // delete cotransporter indices from fluxList
                    for (var i in cotransporterList) {
                        for (var j in fluxList) {
                            if (cotransporterList[i].membrane1 == fluxList[j] ||
                                cotransporterList[i].membrane2 == fluxList[j]) {

                                fluxList.splice(j, 1);
                            }
                        }
                    }

                    // make cotransproter in modelEntityObj
                    for (var i in cotransporterList) {
                        modelEntityObj.push({
                            "model_entity": cotransporterList[i].membrane1,
                            "model_entity2": cotransporterList[i].membrane2
                        });
                    }

                    // make flux in modelEntityObj
                    for (var i in fluxList) {
                        modelEntityObj.push({
                            "model_entity": fluxList[i],
                            "model_entity2": ""
                        });
                    }

                    console.log("makecotransporter: fluxList -> ", fluxList);
                    console.log("makecotransporter: cotransporterList -> ", cotransporterList);
                    console.log("makecotransporter: modelEntityObj -> ", modelEntityObj);

                    relatedMembraneModel(membraneName, cotransporterList);
                    return;
                }
            },
            true);
    };

    // apical or basolateral membrane in PMR
    var relatedMembrane = function (membrane, membraneName) {

        console.log("relatedMembrane: ", membrane, membraneName);

        var fstCHEBI, sndCHEBI;
        fstCHEBI = chebiURI.slice(1, chebiURI.length - 1);
        sndCHEBI = fstCHEBI;

        console.log("chebiURI: ", chebiURI);
        console.log("fstCHEBI and sndCHEBI: ", fstCHEBI, sndCHEBI);

        var query = sparqlUtils.relatedMembraneSPARQL(fstCHEBI, sndCHEBI, membrane);

        ajaxUtils.sendPostRequest(
            sparqlUtils.endpoint,
            query,
            function (jsonRelatedMembrane) {

                console.log("jsonRelatedMembrane: ", jsonRelatedMembrane);

                var fluxList = [], cotransporterList = [];
                for (i = 0; i < jsonRelatedMembrane.results.bindings.length; i++) {

                    // allow only related apical or basolateral membrane from my workspace
                    if (jsonRelatedMembrane.results.bindings[i].g.value != sparqlUtils.myWorkspaneName)
                        continue;

                    fluxList.push(jsonRelatedMembrane.results.bindings[i].Model_entity.value);
                }

                var tempfluxList = [];
                for (i = 0; i < fluxList.length; i++) {
                    if (!miscellaneous.isExist(fluxList[i], tempfluxList)) {
                        tempfluxList.push(fluxList[i]);
                    }
                }

                fluxList = tempfluxList;
                if (fluxList.length <= 1) {
                    console.log("fluxList.length <= 1");
                    modelEntityObj.push({
                        "model_entity": fluxList[0],
                        "model_entity2": ""
                    });

                    console.log("relatedMembrane: fluxList -> ", fluxList);
                    console.log("relatedMembrane: cotransporterList -> ", cotransporterList);
                    console.log("relatedMembrane: modelEntityObj -> ", modelEntityObj);

                    relatedMembraneModel(membraneName, cotransporterList);
                    return;
                }
                else {
                    for (i = 0; i < fluxList.length; i++) {
                        for (j = i + 1; j < fluxList.length; j++) {
                            makecotransporter(fluxList[i], fluxList[j], fluxList, membraneName);
                        }
                    }
                }
            },
            true);
    };

    var source_fma = [], sink_fma = [], med_fma = [], med_pr = [], solute_chebi = [];
    var source_fma2 = [], sink_fma2 = [], solute_chebi2 = [];

    var relatedMembraneModel = function (membraneName, cotransporterList) {

        var tempmembraneModel, indexOfHash, indexOfcellml, modelname, query;
        if (modelEntityObj.length == 0 || modelEntityObj[idMembrane].model_entity == undefined)
            tempmembraneModel = undefined;
        else {
            indexOfHash = modelEntityObj[idMembrane].model_entity.search("#");
            tempmembraneModel = modelEntityObj[idMembrane].model_entity.slice(0, indexOfHash);

            indexOfcellml = tempmembraneModel.search(".cellml");
            modelname = tempmembraneModel.slice(0, indexOfcellml);

            tempmembraneModel = tempmembraneModel + "#" + modelname;
        }

        console.log("relatedMembraneModel: tempmembraneModel ->", tempmembraneModel);
        console.log("relatedMembraneModel: modelEntityObj -> ", modelEntityObj);

        query = "PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>" +
            "PREFIX dcterms: <http://purl.org/dc/terms/>" +
            "SELECT ?Protein WHERE { <" + tempmembraneModel + "> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein . " +
            "}";

        ajaxUtils.sendPostRequest(
            sparqlUtils.endpoint,
            query,
            function (jsonRelatedMembraneModel) {

                console.log("relatedMembraneModel: jsonRelatedMembraneModel -> ", jsonRelatedMembraneModel);

                var endpointprOLS;
                if (jsonRelatedMembraneModel.results.bindings.length == 0) {
                    showModalWindow(membraneName);
                    return;
                } else {
                    var pr_uri = jsonRelatedMembraneModel.results.bindings[0].Protein.value;
                    if (pr_uri == sparqlUtils.epithelialcellID)
                        endpointprOLS = sparqlUtils.abiOntoEndpoint + "/cl/terms?iri=" + pr_uri;
                    else
                        endpointprOLS = sparqlUtils.abiOntoEndpoint + "/pr/terms?iri=" + pr_uri;
                }

                console.log("endpointprOLS: ", endpointprOLS);

                ajaxUtils.sendGetRequest(
                    endpointprOLS,
                    function (jsonPr) {

                        var query = sparqlUtils.relatedMembraneModelSPARQL(modelEntityObj[idMembrane].model_entity, modelEntityObj[idMembrane].model_entity2);

                        // console.log("query: ", query);

                        ajaxUtils.sendPostRequest(
                            sparqlUtils.endpoint,
                            query,
                            function (jsonObjFlux) {
                                console.log("relatedMembraneModel: jsonObjFlux -> ", jsonObjFlux);

                                var endpointOLS;
                                if (jsonObjFlux.results.bindings[0].solute_chebi == undefined) {
                                    endpointOLS = undefined;
                                }
                                else {
                                    var chebi_uri = jsonObjFlux.results.bindings[0].solute_chebi.value,
                                        indexofColon = chebi_uri.indexOf("CHEBI:");
                                    chebi_uri = "http://purl.obolibrary.org/obo/CHEBI_" + chebi_uri.slice(indexofColon + 6);
                                    endpointOLS = sparqlUtils.abiOntoEndpoint + "/chebi/terms?iri=" + chebi_uri;
                                }

                                console.log("relatedMembraneModel: jsonObjFlux After: ", endpointOLS);

                                ajaxUtils.sendGetRequest(
                                    endpointOLS,
                                    function (jsonObjOLSChebi) {

                                        console.log("relatedMembraneModel: jsonObjOLSChebi: ", jsonObjOLSChebi);

                                        var endpointOLS2;
                                        if (jsonObjFlux.results.bindings[0].solute_chebi2 == undefined) {
                                            endpointOLS2 = undefined;
                                        }
                                        else {
                                            var chebi_uri2 = jsonObjFlux.results.bindings[0].solute_chebi2.value,
                                                indexofColon2 = chebi_uri2.indexOf("CHEBI:");
                                            chebi_uri2 = "http://purl.obolibrary.org/obo/CHEBI_" + chebi_uri2.slice(indexofColon2 + 6);

                                            endpointOLS2 = sparqlUtils.abiOntoEndpoint + "/chebi/terms?iri=" + chebi_uri2;
                                        }

                                        ajaxUtils.sendGetRequest(
                                            endpointOLS2,
                                            function (jsonObjOLSChebi2) {

                                                console.log("relatedMembraneModel: jsonObjOLSChebi2: ", jsonObjOLSChebi2);

                                                for (var i = 0; i < jsonObjFlux.results.bindings.length; i++) {
                                                    // solute chebi
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
                                                        solute_chebi.push({
                                                            name: solute_chebi_name,
                                                            uri: jsonObjFlux.results.bindings[i].solute_chebi.value
                                                        });

                                                    // solute chebi 2
                                                    var temparr2 = jsonObjOLSChebi2._embedded.terms[0].annotation["has_related_synonym"],
                                                        solute_chebi_name2;
                                                    for (var m = 0; m < temparr2.length; m++) {
                                                        if (temparr2[m].slice(-1) == "+" || temparr2[m].slice(-1) == "-") {
                                                            solute_chebi_name2 = temparr2[m];
                                                            break;
                                                        }
                                                    }

                                                    if (jsonObjFlux.results.bindings[i].solute_chebi2 == undefined)
                                                        solute_chebi2.push("");
                                                    else
                                                        solute_chebi2.push({
                                                            name: solute_chebi_name2,
                                                            uri: jsonObjFlux.results.bindings[i].solute_chebi2.value
                                                        });

                                                    // source fma
                                                    if (jsonObjFlux.results.bindings[i].source_fma == undefined)
                                                        source_fma.push("");
                                                    else
                                                        source_fma.push({fma: jsonObjFlux.results.bindings[i].source_fma.value});

                                                    // source fma 2
                                                    if (jsonObjFlux.results.bindings[i].source_fma2 == undefined)
                                                        source_fma2.push("");
                                                    else
                                                        source_fma2.push({fma2: jsonObjFlux.results.bindings[i].source_fma2.value});

                                                    // sink fma
                                                    if (jsonObjFlux.results.bindings[i].sink_fma == undefined)
                                                        sink_fma.push("");
                                                    else
                                                        sink_fma.push({fma: jsonObjFlux.results.bindings[i].sink_fma.value});

                                                    // sink fma 2
                                                    if (jsonObjFlux.results.bindings[i].sink_fma2 == undefined)
                                                        sink_fma2.push("");
                                                    else
                                                        sink_fma2.push({fma2: jsonObjFlux.results.bindings[i].sink_fma2.value});

                                                    // med pr and fma
                                                    if (jsonObjFlux.results.bindings[i].med_entity_uri == undefined) {
                                                        med_pr.push("");
                                                        med_fma.push("");
                                                    }
                                                    else {
                                                        var temp = jsonObjFlux.results.bindings[i].med_entity_uri.value;
                                                        if (temp.indexOf(sparqlUtils.partOfProteinUri) != -1 || temp.indexOf(sparqlUtils.partOfGOUri) != -1 || temp.indexOf(sparqlUtils.partOfCHEBIUri) != -1) {
                                                            med_pr.push({
                                                                // name of med_pr from OLS
                                                                // TODO: J_sc_K two PR and one FMA URI!!
                                                                med_pr: jsonObjFlux.results.bindings[i].med_entity_uri.value
                                                            });
                                                        }
                                                        else {
                                                            if (temp.indexOf(sparqlUtils.partOfFMAUri) != -1) {
                                                                med_fma.push({med_fma: jsonObjFlux.results.bindings[i].med_entity_uri.value});
                                                            }
                                                        }
                                                    }
                                                }

                                                // remove duplicate fma
                                                solute_chebi = miscellaneous.uniqueifyEpithelial(solute_chebi);
                                                solute_chebi2 = miscellaneous.uniqueifyEpithelial(solute_chebi2);
                                                source_fma = miscellaneous.uniqueifyEpithelial(source_fma);
                                                sink_fma = miscellaneous.uniqueifyEpithelial(sink_fma);
                                                source_fma2 = miscellaneous.uniqueifyEpithelial(source_fma2);
                                                sink_fma2 = miscellaneous.uniqueifyEpithelial(sink_fma2);
                                                med_pr = miscellaneous.uniqueifyEpithelial(med_pr);
                                                med_fma = miscellaneous.uniqueifyEpithelial(med_fma);

                                                if (jsonRelatedMembraneModel.results.bindings.length != 0) {

                                                    var tempVal, PID;
                                                    if (med_pr.length == 0) {
                                                        tempVal = jsonRelatedMembraneModel.results.bindings[0].Protein.value;
                                                        PID = tempVal.slice(tempVal.search("PR_") + 3, tempVal.length);
                                                    }
                                                    else {
                                                        tempVal = med_pr[0].med_pr;
                                                        PID = tempVal.slice(tempVal.search("PR_") + 3, tempVal.length);

                                                        // If PID start with 0 digit
                                                        if (PID.charAt(0) != "P") {
                                                            if (PID.charAt(0) != "Q") {
                                                                PID = "P" + PID.replace(/^0+/, ""); // Or parseInt("065", 10)
                                                            }
                                                        }
                                                    }

                                                    membraneModelObj.push({
                                                        protein: jsonRelatedMembraneModel.results.bindings[0].Protein.value,
                                                        pid: PID, // med PID
                                                        prname: jsonPr._embedded.terms[0].label,
                                                        medfma: med_fma[0].med_fma, //combinedMembrane[0].med_fma,
                                                        medpr: tempVal,
                                                        similar: 0 // initial percent
                                                    });

                                                    var sourcefma2, sinkfma2, modelentity2, variabletext,
                                                        variabletext2, sourcefma, sinkfma, solutechebi2, medfma, medpr,
                                                        solutetext2, solutechebi, solutetext, indexOfdot, indexOfHash;

                                                    if (modelEntityObj[idMembrane].model_entity2 == "") {

                                                        indexOfHash = modelEntityObj[idMembrane].model_entity.search("#");
                                                        variabletext = modelEntityObj[idMembrane].model_entity.slice(indexOfHash + 1);
                                                        indexOfdot = variabletext.indexOf(".");

                                                        variabletext = variabletext.slice(indexOfdot + 1);

                                                        var tempjsonObjFlux = miscellaneous.uniqueifyjsonFlux(jsonObjFlux.results.bindings);

                                                        // console.log("tempjsonObjFlux: ", tempjsonObjFlux);

                                                        if (tempjsonObjFlux.length == 1) {
                                                            var vartext2;
                                                            if (med_pr.length != 0) {
                                                                if (med_pr[0].med_pr == sparqlUtils.Nachannel || med_pr[0].med_pr == sparqlUtils.Kchannel ||
                                                                    med_pr[0].med_pr == sparqlUtils.Clchannel) {
                                                                    vartext2 = "channel";
                                                                }
                                                                else if (tempjsonObjFlux[0].source_fma.value == sparqlUtils.luminalID &&
                                                                    tempjsonObjFlux[0].sink_fma.value == sparqlUtils.interstitialID) {
                                                                    vartext2 = "diffusiveflux";
                                                                }
                                                                else {
                                                                    vartext2 = "flux"; // flux
                                                                }
                                                            }

                                                            // TODO: ??
                                                            if (med_pr.length == 0) {
                                                                vartext2 = "flux"; // "no mediator"
                                                            }

                                                            // console.log("vartext2, med_pr: ", vartext2, med_pr);

                                                            sourcefma = tempjsonObjFlux[0].source_fma.value;
                                                            sinkfma = tempjsonObjFlux[0].sink_fma.value;
                                                            solutechebi = solute_chebi[0].uri;
                                                            solutetext = solute_chebi[0].name;
                                                            medfma = med_fma[0].med_fma;

                                                            if (med_pr.length != 0) {
                                                                medpr = med_pr[0].med_pr; // TODO: J_Sc_Na has 2 PR and 1 FMA URIs!! Fix this!!
                                                            }
                                                            else {
                                                                medpr = "";
                                                            }

                                                            modelentity2 = "";
                                                            if (vartext2 == "channel" || vartext2 == "diffusiveflux") {
                                                                sourcefma2 = vartext2;
                                                                sinkfma2 = vartext2;
                                                                variabletext2 = vartext2; // flux/channel/diffusiveflux
                                                                solutechebi2 = vartext2;
                                                                solutetext2 = vartext2;
                                                            }
                                                            else {
                                                                sourcefma2 = "";
                                                                sinkfma2 = "";
                                                                variabletext2 = vartext2; // flux/channel/diffusiveflux
                                                                solutechebi2 = "";
                                                                solutetext2 = "";
                                                            }
                                                        }
                                                        else {
                                                            // same solute - J_Na in mackenzie model
                                                            if (tempjsonObjFlux.length == 2 && modelEntityObj[idMembrane].model_entity2 == "") {
                                                                modelentity2 = modelEntityObj[idMembrane].model_entity;
                                                                sourcefma = tempjsonObjFlux[0].source_fma.value;
                                                                sinkfma = tempjsonObjFlux[0].sink_fma.value;
                                                                sourcefma2 = tempjsonObjFlux[1].source_fma.value;
                                                                sinkfma2 = tempjsonObjFlux[1].sink_fma.value;
                                                                medfma = med_fma[0].med_fma;

                                                                if (med_pr.length != 0) {
                                                                    medpr = med_pr[0].med_pr;
                                                                }
                                                                else {
                                                                    medpr = "";
                                                                }

                                                                variabletext2 = variabletext;
                                                                solutechebi = solute_chebi[0].uri;
                                                                solutetext = solute_chebi[0].name;
                                                                solutechebi2 = solutechebi;
                                                                solutetext2 = solutetext;
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        indexOfHash = modelEntityObj[idMembrane].model_entity.search("#");
                                                        variabletext = modelEntityObj[idMembrane].model_entity.slice(indexOfHash + 1);
                                                        indexOfdot = variabletext.indexOf(".");
                                                        variabletext = variabletext.slice(indexOfdot + 1);

                                                        indexOfHash = modelEntityObj[idMembrane].model_entity2.search("#");
                                                        variabletext2 = modelEntityObj[idMembrane].model_entity2.slice(indexOfHash + 1);
                                                        indexOfdot = variabletext2.indexOf(".");
                                                        variabletext2 = variabletext2.slice(indexOfdot + 1);

                                                        modelentity2 = modelEntityObj[idMembrane].model_entity2;
                                                        sourcefma = source_fma[0].fma;
                                                        sinkfma = sink_fma[0].fma;
                                                        sourcefma2 = source_fma2[0].fma2;
                                                        sinkfma2 = sink_fma2[0].fma2;
                                                        solutechebi = solute_chebi[0].uri;
                                                        solutetext = solute_chebi[0].name;
                                                        solutechebi2 = solute_chebi2[0].uri;
                                                        solutetext2 = solute_chebi2[0].name;
                                                        medfma = med_fma[0].med_fma;
                                                        medpr = med_pr[0].med_pr;
                                                    }
                                                }

                                                // console.log("medpr, protein.value: ", medpr, jsonRelatedMembraneModel, jsonRelatedMembraneModel.results.bindings[0].Protein.value);

                                                var medURI, endpointOLS;
                                                if (medpr == undefined || medpr == "") {
                                                    medURI = jsonRelatedMembraneModel.results.bindings[0].Protein.value;
                                                }
                                                else
                                                    medURI = medpr;

                                                // console.log("medURI: ", medURI);

                                                if (medURI.indexOf(sparqlUtils.partOfCHEBIUri) != -1) {
                                                    var indexofColon = medURI.indexOf("CHEBI:");
                                                    chebi_uri = "http://purl.obolibrary.org/obo/CHEBI_" + medURI.slice(indexofColon + 6);
                                                    endpointOLS = sparqlUtils.abiOntoEndpoint + "/chebi/terms?iri=" + chebi_uri;
                                                }
                                                else if (medURI.indexOf(sparqlUtils.partOfGOUri) != -1) {
                                                    var indexofColon = medURI.indexOf("GO:");
                                                    var go_uri = "http://purl.obolibrary.org/obo/GO_" + medURI.slice(indexofColon + 3);
                                                    endpointOLS = sparqlUtils.abiOntoEndpoint + "/go/terms?iri=" + go_uri;
                                                }
                                                else if (medURI.indexOf(sparqlUtils.partOfCellUri) != -1) {
                                                    endpointOLS = sparqlUtils.abiOntoEndpoint + "/cl/terms?iri=" + medURI;
                                                }
                                                else
                                                    endpointOLS = sparqlUtils.abiOntoEndpoint + "/pr/terms?iri=" + medURI;

                                                ajaxUtils.sendGetRequest(
                                                    endpointOLS,
                                                    function (jsonObjOLSMedPr) {

                                                        console.log("relatedMembraneModel: jsonObjOLSMedPr: ", jsonObjOLSMedPr);

                                                        var tempvar, med_pr_text_syn;
                                                        if (medURI.indexOf(sparqlUtils.partOfCellUri) != -1) {
                                                            med_pr_text_syn = "epithelial cell";
                                                        }
                                                        else {
                                                            if (jsonObjOLSMedPr._embedded.terms[0].annotation["has_related_synonym"] == undefined) {
                                                                med_pr_text_syn = jsonObjOLSMedPr._embedded.terms[0].annotation["id"][0].slice(3);
                                                            }
                                                            else {
                                                                tempvar = jsonObjOLSMedPr._embedded.terms[0].annotation["has_related_synonym"];
                                                                med_pr_text_syn = tempvar[0].toUpperCase();
                                                            }
                                                        }

                                                        membraneModelID.push([
                                                            modelEntityObj[idMembrane].model_entity, // model_entity
                                                            modelentity2, // model_entity2
                                                            variabletext, // variable_text
                                                            variabletext2, // variable_text2
                                                            sourcefma,
                                                            sinkfma,
                                                            sourcefma2,
                                                            sinkfma2,
                                                            medfma, // jsonObjFlux.results.bindings[0].med_entity_uri.value, // med_fma
                                                            medpr, // med_pr, e.g. mediator in a cotransporter protein
                                                            solutechebi, // solute_chebi
                                                            solutechebi2, // solute_chebi2
                                                            solutetext, //solute_text
                                                            solutetext2, //solute_text2
                                                            jsonObjOLSMedPr._embedded.terms[0].label, //med_pr_text,
                                                            med_pr_text_syn, //med_pr_text_syn
                                                            jsonRelatedMembraneModel.results.bindings[0].Protein.value // protein_name
                                                        ]);

                                                        solute_chebi = [];
                                                        solute_chebi2 = [];
                                                        source_fma = [];
                                                        sink_fma = [];
                                                        source_fma2 = [];
                                                        sink_fma2 = [];
                                                        med_pr = [];
                                                        med_fma = [];

                                                        console.log("relatedMembraneModel: idMembrane -> ", idMembrane);
                                                        console.log("relatedMembraneModel: modelEntityObj -> ", modelEntityObj);
                                                        console.log("relatedMembraneModel: membraneModelID -> ", membraneModelID);

                                                        if (modelEntityObj[idMembrane].model_entity != undefined)
                                                            idMembrane++;

                                                        if (idMembrane == modelEntityObj.length) {
                                                            showModalWindow(membraneName);
                                                            return;
                                                        }

                                                        relatedMembraneModel(membraneName, cotransporterList);

                                                    }, true);
                                            }, true);
                                    }, true);
                            }, true);
                    }, true);
            }, true);
    };

    var showModalWindow = function (membraneName) {

        idMembrane = 0;

        var msg2 = "<p><b>" + proteinText + "</b> is a <b>" + typeOfModel + "</b> model. It is located in " +
            "<b>" + locationOfModel + "</b><\p>";

        var workspaceuri = sparqlUtils.myWorkspaneName + "/" + "rawfile" + "/" + "HEAD" + "/" + cellmlModelEntity;

        var model = "<b>Model: </b><a href=" + workspaceuri + " + target=_blank " +
            "data-toggle=tooltip data-placement=right " +
            "title=" + proteinText + ">" + cellmlModelEntity + "</a>";

        var biological = "<p><b>Biological Meaning: </b>" + biological_meaning + "</p>";

        var species = "<p><b>Species: </b>" + speciesName + "</p>";
        var gene = "<p><b>Gene: </b>" + geneName + "</p>";
        var protein = "<p data-toggle=tooltip data-placement=right title=" + proteinName + ">" +
            "<b>Protein: </b>" + proteinText + "</p>";

        var compartment = "<p><b>Compartment: </b>" + compartmentName + "</p>";
        var location = "<p><b>Location: </b>" + locationName + "</p>";

        // apical or basolateral membrane
        var membraneModel = "<p id=membraneModelsID><b>" + membraneName + " model</b>";

        for (var i = 0; i < membraneModelObj.length; i++) {

            var workspaceuri = sparqlUtils.myWorkspaneName + "/" + "rawfile" + "/" + "HEAD" + "/" + membraneModelID[i][0];

            var label = document.createElement("label");
            label.innerHTML = '<br><a href="' + workspaceuri + '" target="_blank" ' +
                'data-toggle="tooltip" data-placement="right" ' +
                'title="Protein name: ' + membraneModelObj[i].prname + '\n' +
                'Protein uri: ' + membraneModelObj[i].protein + '\n' +
                'Mediator name: ' + membraneModelID[i][14] + '\n' +
                'Mediator uri: ' + membraneModelObj[i].medpr + '\n' +
                // 'Similarity value: ' + membraneModelObj[i].similar + '\n' +
                'Model entity: ' + membraneModelID[i][0] + '\n' +
                'Model entity2: ' + membraneModelID[i][1] + '"' +
                '>' + membraneModelID[i][14] + '</a></label>'; // membraneModelObj[i].prname

            membraneModel += label.innerHTML;
        }

        if (membraneModel == "<p id=membraneModelsID><b>" + membraneName + " model</b>") {
            membraneModel += "<br>Not Exist" + "<br>";
        }

        // alternative model
        var alternativeModel = "<p id=alternativeModelID><b>Alternative model of " + proteinText + "</b>";
        if (alternativeModelObj.length == 0) {
            alternativeModel += "<br>Not Exist" + "<br>";
        }
        else {
            for (var i = 0; i < alternativeModelObj.length; i++) {
                var workspaceuri = alternativeModelObj[i].workspaceName +
                    "/" + "rawfile" + "/" + "HEAD" + "/" + alternativeModelObj[i].modelEntity;

                var label = document.createElement("label");
                label.innerHTML = '<br><input id="' + alternativeModelObj[i].modelEntity + '" ' +
                    'type="checkbox" value="' + alternativeModelObj[i].modelEntity + '">' +
                    '<a href="' + workspaceuri + '" target="_blank" ' +
                    'data-toggle="tooltip" data-placement="right" ' +
                    'title="Protein name: ' + alternativeModelObj[i].prname + '\n' +
                    'Protein uri: ' + alternativeModelObj[i].protein + '\n' +
                    'Model entity: ' + alternativeModelObj[i].modelEntity + '"' +
                    '>' + alternativeModelObj[i].prname + '</a></label>';

                alternativeModel += label.innerHTML;
            }
        }

        // related organ models (kidney, lungs, etc) in PMR
        var relatedOrganModel = "<p id=relatedOrganModelID><b>" + typeOfModel + " model in PMR</b>";
        if (relatedModelObj.length == 1) { // includes own protein name
            relatedOrganModel += "<br>Not Exist" + "<br>";
        }
        else {
            for (var i = 0; i < relatedModelObj.length; i++) {

                if (proteinName == relatedModelObj[i].protein)
                    continue;

                var workspaceuri = relatedModelObj[i].workspaceName +
                    "/" + "rawfile" + "/" + "HEAD" + "/" + relatedModelObj[i].modelEntity;

                var label = document.createElement("label");
                label.innerHTML = '<br><a href="' + workspaceuri + '" target="_blank" ' +
                    'data-toggle="tooltip" data-placement="right" ' +
                    'title="Protein name: ' + relatedModelObj[i].prname + '\n' +
                    'Protein uri: ' + relatedModelObj[i].protein + '\n' +
                    'Model entity: ' + relatedModelObj[i].modelEntity + '"' +
                    '>' + relatedModelObj[i].prname + '</a></label>';

                relatedOrganModel += label.innerHTML;
            }
        }

        // append message inside corresponding hiders
        for (var i = 0; i < $('.hiders').length; i++) {

            if (cellmlModelEntity == $('.hiders')[i].id) {

                $('.hiders')[i].innerHTML = msg2 + model + biological + species + gene + protein + compartment + location;

                var msg3 = "<br><p><b>Recommendations/suggestions based on existing models in PMR<b><\p>";
                $('.hiders')[i].innerHTML += msg3 + membraneModel + alternativeModel + relatedOrganModel;

                break;
            }
        }

        return;
    };

    // reinitialize variable for next miscellaneous.iteration
    var reinitVariable = function () {
        idProtein = 0;
        idAltProtein = 0;
        idMembrane = 0;
        counter = 0;

        membraneModelObj = [];
        alternativeModelObj = [];
        relatedModelObj = [];

        relatedModel = [];
        modelEntityObj = [];
        membraneModelID = [];

        relatedModelEntity = [];
        cotransporterList = [];
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
            tr.append($("<th/>").append(head[i]));
        }

        thead.append(tr);
        table.append(thead);

        // Table body
        var tbody = $("<tbody/>");
        for (var i in modelEntity) {
            tr = $("<tr/>");

            var modelhtm = '<fieldset id="' + modelEntity[i] + '" class="majorpoints"><legend class="majorpointslegend">' + modelEntity[i] + '</legend>' +
                '<div id="' + modelEntity[i] + '" class="hiders" style="display: none"></div></fieldset>';

            tr.append($("<td/>").append(modelhtm)); // model

            // tr.append($("<td/>").append(modelEntity[i].model)); // model
            tr.append($("<td/>").append(biologicalMeaning[i])); // biological meaning

            tr.append($("<td/>").append(speciesList[i])); // species

            tr.append($("<td/>").append(geneList[i])); // gene

            tr.append($("<td/>").append(proteinList[i])); // protein

            tbody.append(tr);
        }

        table.append(tbody);
        $("#searchList").append(table);

        $('.majorpoints').click(function () {

            reinitVariable();
            cellmlModelEntity = $(this)[0].id;

            console.log("hiders: ", $('.hiders'));
            console.log("majorpoints: ", $('majorpoints'));

            if ($(this)[0].childNodes[1].innerText == "") {
                // miscellaneous.showLoading("." + $(this)[0].childNodes[1].className);
                dropcircle();
            }

            $(this).find('.hiders').toggle();
        });

        // Fill in search attribute value
        $("#searchTxt").attr("value", sessionStorage.getItem("searchTxtContent"));

        // SET main content in local storage
        sessionStorage.setItem("searchListContent", $("#main-content").html());
    };

    // Expose utility to the global object
    global.$mainUtils = mainUtils;

})(window);
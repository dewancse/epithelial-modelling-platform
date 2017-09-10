/**
 * Created by dsar941 on 9/8/2016.
 */
var parseModelName = require("./utils/misc.js").parseModelName;
var parserFmaNameText = require("./utils/misc.js").parserFmaNameText;
var headTitle = require("./utils/misc.js").headTitle;
var compare = require("./utils/misc.js").compare;
var uniqueifyEpithelial = require("./utils/misc.js").uniqueifyEpithelial;
var uniqueifySrcSnkMed = require("./utils/misc.js").uniqueifySrcSnkMed;
var iteration = require("./utils/misc.js").iteration;
var showView = require("./utils/showView.js").showView;
var showSVGModelHtml = require("./utils/showSVGModel.js").showSVGModelHtml;
var showsvgEpithelial = require("./utils/showSVGEpithelial.js").showsvgEpithelial;
var showLoading = require("./utils/misc.js").showLoading;
var activeMenu = require("./utils/misc.js").activeMenu;
var switchMenuToActive = require("./utils/misc.js").switchMenuToActive;

var sendGetRequest = require("./libs/ajax-utils.js").sendGetRequest;
var sendPostRequest = require("./libs/ajax-utils.js").sendPostRequest;

(function (global) {
    'use strict';

    var endpoint = "https://models.physiomeproject.org/pmr2_virtuoso_search";

    var viewHtml = "./snippets/view.html";
    var modelHtml = "./snippets/model.html";
    var searchHtml = "./snippets/search.html";
    var svgmodelHtml = "./snippets/svgmodel.html";
    var svgepithelialHtml = "./snippets/svgepithelial.html";

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

    // process AJAX call
    var modelEntity = [],
        biologicalMeaning = [],
        speciesList = [],
        geneList = [],
        proteinList = [],
        head = [],
        filterModelEntity = [],
        id = 0;

    var str = [];

    mainUtils.loadHomeHtml = function () {
        // Switch from current active button to home button
        var activeItem = "#" + activeMenu();
        switchMenuToActive(activeItem, "#listHome");

        $("#main-content").html("... Home Page !!!");
    };

    mainUtils.loadHelp = function () {
        // Switch from current active button to home button
        var activeItem = "#" + activeMenu();
        switchMenuToActive(activeItem, "#help");

        $("#main-content").html("... Help Page !!!");
    };

    // On page load (before img or CSS)
    // $(document).ready(function (event) {
    //     // Place some startup code here
    // });

    var isExist = function (element) {
        // console.log("element: ", element);
        // remove duplicate components with same variable
        var indexOfHash = element.search("#"),
            cellmlModelName = element.slice(0, indexOfHash), // weinstein_1995.cellml
            componentVariableName = element.slice(indexOfHash + 1), // NHE3.J_NHE3_Na
            indexOfDot = componentVariableName.indexOf('.'),
            variableName = componentVariableName.slice(indexOfDot + 1); // J_NHE3_Na

        for (var i = 0; i < templistOfModel.length; i++) {
            var indexOfHash2 = templistOfModel[i].search("#"),
                cellmlModelName2 = templistOfModel[i].slice(0, indexOfHash2), // weinstein_1995.cellml
                componentVariableName2 = templistOfModel[i].slice(indexOfHash2 + 1), // NHE3.J_NHE3_Na
                indexOfDot2 = componentVariableName2.indexOf('.'),
                variableName2 = componentVariableName2.slice(indexOfDot2 + 1); // J_NHE3_Na

            if (cellmlModelName == cellmlModelName2 && variableName == variableName2) {
                return true;
            }
        }

        return false;
    }

    // Event handling for SEARCH, MODEL
    var actions = {

        search: function (event) {

            console.log("search event: ", event);

            if (event.srcElement.className == "checkbox") {

                if (event.srcElement.checked) {
                    var idWithStr = event.srcElement.id;
                    var index = idWithStr.search("#");
                    var workspaceName = idWithStr.slice(0, index);

                    mainUtils.workspaceName = workspaceName;

                    modelEntityName = idWithStr;
                }
                else {
                    mainUtils.workspaceName = "";
                }
            }


        },

        model: function (event) {

            console.log("model event: ", event);

            // select one by one
            if (event.srcElement.className == "attribute") {

                if (event.srcElement.checked) {

                    if (!isExist(event.srcElement.value)) {
                        templistOfModel.push(event.srcElement.value);

                        // for making visualization graph
                        modelEntityNameArray.push(event.srcElement.value);
                        modelEntityFullNameArray.push(event.srcElement.value);
                    }
                }
                else {
                    var pos = templistOfModel.indexOf(event.srcElement.value);
                    templistOfModel.splice(pos, 1);

                    // for making visualization graph
                    var pos2 = modelEntityNameArray.indexOf(event.srcElement.value);
                    modelEntityNameArray.splice(pos2, 1);
                    modelEntityFullNameArray.splice(pos2, 1);
                }

                var idWithStr = event.srcElement.id;
                var index = idWithStr.search("#");
                var workspaceName = idWithStr.slice(0, index);

                // mainUtils.workspaceName.push(workspaceName);
                mainUtils.workspaceName = workspaceName;
            }

            // select all
            if (event.srcElement.className == "attributeAll") {

                if (event.srcElement.checked == true) {
                    for (var i = 0; i < $('.attribute').length; i++) {
                        $('.attribute')[i].checked = true;

                        if (!isExist($('.attribute')[i].value)) {
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
            $("#main-content").html(sessionStorage.getItem('searchListContent'));
        }

        // Switch from current active button to discovery button
        var activeItem = "#" + activeMenu();
        switchMenuToActive(activeItem, "#listDiscovery");
    };

    // Event invocation to SEARCH, MODEL
    document.addEventListener('click', function (event) {
        // If there's an action with the given name, call it
        if (typeof actions[event.srcElement.dataset.action] === "function") {
            actions[event.srcElement.dataset.action].call(this, event);
        }
    })

    // $(document).click(function (event) {
    //     // If there's an action with the given name, call it
    //     if (typeof actions[event.srcElement.dataset.action] === "function") {
    //         actions[event.srcElement.dataset.action].call(this, event);
    //     }
    // })

    // semantic annotation based on search items
    $(document).keydown(function (event) {
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
            filterModelEntity = [];

            id = 0; // id to index each Model_entity

            mainUtils.discoverModels(uriOPB, uriCHEBI, keyValue);
        }
    })

    // semantic annotation based on search items
    // document.addEventListener('keydown', function (event) {
    //     if (event.key == 'Enter') {
    //
    //         var uriOPB, uriCHEBI, keyValue;
    //         var searchTxt = document.getElementById("searchTxt").value;
    //
    //         // set local storage
    //         sessionStorage.setItem('searchTxtContent', searchTxt);
    //
    //         // dictionary object
    //         var dictionary = [
    //             {
    //                 "key1": "flux", "key2": "",
    //                 "opb": "<http://identifiers.org/opb/OPB_00593>", "chebi": ""
    //             },
    //             {
    //                 "key1": "flux", "key2": "sodium",
    //                 "opb": "<http://identifiers.org/opb/OPB_00593>",
    //                 "chebi": "<http://identifiers.org/chebi/CHEBI:26708>"
    //             },
    //             {
    //                 "key1": "flux", "key2": "hydrogen",
    //                 "opb": "<http://identifiers.org/opb/OPB_00593>",
    //                 "chebi": "<http://identifiers.org/chebi/CHEBI:49637>"
    //             },
    //             {
    //                 "key1": "flux", "key2": "ammonium",
    //                 "opb": "<http://identifiers.org/opb/OPB_00593>",
    //                 "chebi": "<http://identifiers.org/chebi/CHEBI:28938>"
    //             },
    //             {
    //                 "key1": "flux", "key2": "chloride",
    //                 "opb": "<http://identifiers.org/opb/OPB_00593>",
    //                 "chebi": "<http://identifiers.org/chebi/CHEBI:17996>"
    //             },
    //             {
    //                 "key1": "flux", "key2": "potassium",
    //                 "opb": "<http://identifiers.org/opb/OPB_00593>",
    //                 "chebi": "<http://identifiers.org/chebi/CHEBI:26216>"
    //             },
    //             {
    //                 "key1": "flux", "key2": "calcium",
    //                 "opb": "<http://identifiers.org/opb/OPB_00593>",
    //                 "chebi": "<http://identifiers.org/chebi/CHEBI:22984>"
    //             },
    //             {
    //                 "key1": "flux", "key2": "IP3",
    //                 "opb": "<http://identifiers.org/opb/OPB_00593>",
    //                 "chebi": "<http://identifiers.org/chebi/CHEBI:131186>"
    //             },
    //             {
    //                 "key1": "flux", "key2": "glucose",
    //                 "opb": "<http://identifiers.org/opb/OPB_00593>",
    //                 "chebi": "<http://identifiers.org/chebi/CHEBI:17234>"
    //             },
    //             {
    //                 "key1": "flux", "key2": "lactate",
    //                 "opb": "<http://identifiers.org/opb/OPB_00593>",
    //                 "chebi": "<http://identifiers.org/chebi/CHEBI:24996>"
    //             },
    //             {
    //                 "key1": "flux", "key2": "aldosterone",
    //                 "opb": "<http://identifiers.org/opb/OPB_00593>",
    //                 "chebi": "<http://identifiers.org/chebi/CHEBI:27584>"
    //             },
    //             {
    //                 "key1": "flux", "key2": "thiazide",
    //                 "opb": "<http://identifiers.org/opb/OPB_00593>",
    //                 "chebi": "<http://identifiers.org/chebi/CHEBI:50264>"
    //             },
    //             {
    //                 "key1": "flux", "key2": "ATP",
    //                 "opb": "<http://identifiers.org/opb/OPB_00593>",
    //                 "chebi": "<http://identifiers.org/chebi/CHEBI:15422>"
    //             },
    //             {
    //                 "key1": "concentration", "key2": "",
    //                 "opb": "<http://identifiers.org/opb/OPB_00340>", "chebi": ""
    //             },
    //             {
    //                 "key1": "concentration", "key2": "sodium",
    //                 "opb": "<http://identifiers.org/opb/OPB_00340>",
    //                 "chebi": "<http://identifiers.org/chebi/CHEBI:26708>"
    //             },
    //             {
    //                 "key1": "concentration", "key2": "hydrogen",
    //                 "opb": "<http://identifiers.org/opb/OPB_00340>",
    //                 "chebi": "<http://identifiers.org/chebi/CHEBI:49637>"
    //             },
    //             {
    //                 "key1": "concentration", "key2": "ammonium",
    //                 "opb": "<http://identifiers.org/opb/OPB_00340>",
    //                 "chebi": "<http://identifiers.org/chebi/CHEBI:28938>"
    //             },
    //             {
    //                 "key1": "concentration", "key2": "chloride",
    //                 "opb": "<http://identifiers.org/opb/OPB_00340>",
    //                 "chebi": "<http://identifiers.org/chebi/CHEBI:17996>"
    //             },
    //             {
    //                 "key1": "concentration", "key2": "potassium",
    //                 "opb": "<http://identifiers.org/opb/OPB_00340>",
    //                 "chebi": "<http://identifiers.org/chebi/CHEBI:26216>"
    //             },
    //             {
    //                 "key1": "concentration", "key2": "calcium",
    //                 "opb": "<http://identifiers.org/opb/OPB_00340>",
    //                 "chebi": "<http://identifiers.org/chebi/CHEBI:22984>"
    //             },
    //             {
    //                 "key1": "concentration", "key2": "IP3",
    //                 "opb": "<http://identifiers.org/opb/OPB_00340>",
    //                 "chebi": "<http://identifiers.org/chebi/CHEBI:131186>"
    //             },
    //             {
    //                 "key1": "concentration", "key2": "ATP",
    //                 "opb": "<http://identifiers.org/opb/OPB_00340>",
    //                 "chebi": "<http://identifiers.org/chebi/CHEBI:15422>"
    //             },
    //             {
    //                 "key1": "concentration", "key2": "glucose",
    //                 "opb": "<http://identifiers.org/opb/OPB_00340>",
    //                 "chebi": "<http://identifiers.org/chebi/CHEBI:17234>"
    //             },
    //             {
    //                 "key1": "concentration", "key2": "lactate",
    //                 "opb": "<http://identifiers.org/opb/OPB_00340>",
    //                 "chebi": "<http://identifiers.org/chebi/CHEBI:24996>"
    //             },
    //             {
    //                 "key1": "concentration", "key2": "aldosterone",
    //                 "opb": "<http://identifiers.org/opb/OPB_00340>",
    //                 "chebi": "<http://identifiers.org/chebi/CHEBI:27584>"
    //             },
    //             {
    //                 "key1": "concentration", "key2": "thiazide",
    //                 "opb": "<http://identifiers.org/opb/OPB_00340>",
    //                 "chebi": "<http://identifiers.org/chebi/CHEBI:50264>"
    //             }
    //         ];
    //
    //         for (var i = 0; i < dictionary.length; i++) {
    //             var key1 = searchTxt.indexOf("" + dictionary[i].key1 + ""),
    //                 key2 = searchTxt.indexOf("" + dictionary[i].key2 + "");
    //
    //             if (key1 != -1 && key2 != -1) {
    //                 uriOPB = dictionary[i].opb;
    //                 uriCHEBI = dictionary[i].chebi;
    //                 keyValue = dictionary[i].key1;
    //             }
    //         }
    //
    //         showLoading("#searchList");
    //
    //         modelEntity = [];
    //         biologicalMeaning = [];
    //         speciesList = [];
    //         geneList = [];
    //         proteinList = [];
    //         head = [];
    //         filterModelEntity = [];
    //
    //         id = 0; // id to index each Model_entity
    //
    //         mainUtils.discoverModels(uriOPB, uriCHEBI, keyValue);
    //     }
    // })

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
        sendPostRequest(
            endpoint,
            query,
            function (jsonModel) {

                if (jsonModel.results.bindings.length == 0) {
                    mainUtils.showDiscoverModels(head, modelEntity, biologicalMeaning, speciesList, geneList, proteinList);
                    return;
                }

                var model = parseModelName(jsonModel.results.bindings[id].Model_entity.value);
                var query = 'SELECT ?Species ' + 'WHERE ' +
                    '{ ' + '<' + model + '#Species> <http://purl.org/dc/terms/description> ?Species.' + '}';

                // Species
                sendPostRequest(
                    endpoint,
                    query,
                    function (jsonSpecies) {

                        var model = parseModelName(jsonModel.results.bindings[id].Model_entity.value);
                        var query = 'SELECT ?Gene ' + 'WHERE ' +
                            '{ ' + '<' + model + '#Gene> <http://purl.org/dc/terms/description> ?Gene.' + '}';

                        // Gene
                        sendPostRequest(
                            endpoint,
                            query,
                            function (jsonGene) {

                                var model = parseModelName(jsonModel.results.bindings[id].Model_entity.value);
                                var query = 'SELECT ?Protein ' + 'WHERE ' +
                                    '{ ' + '<' + model + '#Protein> <http://purl.org/dc/terms/description> ?Protein.' + '}';

                                // Protein
                                sendPostRequest(
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

                                        mainUtils.showDiscoverModels(
                                            head,
                                            modelEntity,
                                            biologicalMeaning,
                                            speciesList,
                                            geneList,
                                            proteinList);

                                        id++; // increment index of modelEntity

                                        if (id == jsonModel.results.bindings.length) {
                                            return;
                                        }

                                        mainUtils.discoverModels(uriOPB, uriCHEBI, keyValue); // callback
                                    },
                                    true);
                            },
                            true);
                    },
                    true);
            },
            true
        );
    }

    // TODO: make a common table platform for all functions
    // Show semantic annotation extracted from PMR
    mainUtils.showDiscoverModels = function (head, modelEntity, biologicalMeaning, speciesList, geneList, proteinList) {

        // Search result does not match
        if (head.length == 0) {
            $("#searchList").html("<section class='container-fluid'><label><br>No Search Results!</label></section>");
            return;
        }

        // Empty space for a new search result
        $("#searchList").html("");

        var table = $("<table/>").addClass("table table-hover table-condensed"); //table-bordered table-striped

        // Table header
        var thead = $("<thead/>"), tr = $("<tr/>");
        for (var i = 0; i < head.length; i++) {
            // Empty header for checkbox column
            if (i == 0) {
                tr.append($("<th/>").append(""));
            }

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
                    tr.append($("<td/>").append($('<label/>')
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

        // Fill in the search attribute value
        $("#searchTxt").attr("value", sessionStorage.getItem('searchTxtContent'));

        // SET main content in the local storage
        sessionStorage.setItem('searchListContent', $("#main-content").html());

        // Reinitialize so that last workspace does not appear in the Load Models
        // page when clicked from Model Discovery and Epithelial Model Platform page
        // mainUtils.workspaceName = "";
    }

    // Load the view
    mainUtils.loadViewHtml = function () {

        var cellmlModel = mainUtils.workspaceName;

        var query = 'SELECT ?Workspace ?Title ?Author ?Abstract ?Keyword ?Protein ?Species ?Gene ?Compartment ' +
            '?Located_in ?DOI WHERE { GRAPH ?Workspace { ' +
            '<' + cellmlModel + '#Title> <http://purl.org/dc/terms/description> ?Title . ' +
            'OPTIONAL { <' + cellmlModel + '#Author> <http://www.w3.org/2001/vcard-rdf/3.0#FN> ?Author } . ' +
            'OPTIONAL { <' + cellmlModel + '#Abstract> <http://purl.org/dc/terms/description> ?Abstract } . ' +
            'OPTIONAL { <' + cellmlModel + '#Keyword> <http://purl.org/dc/terms/description> ?Keyword } . ' +
            'OPTIONAL { <' + cellmlModel + '#Protein> <http://purl.org/dc/terms/description> ?Protein } . ' +
            'OPTIONAL { <' + cellmlModel + '#Species> <http://purl.org/dc/terms/description> ?Species } . ' +
            'OPTIONAL { <' + cellmlModel + '#Gene> <http://purl.org/dc/terms/description> ?Gene } . ' +
            'OPTIONAL { <' + cellmlModel + '#Compartment> <http://purl.org/dc/terms/description> ?Compartment } . ' +
            'OPTIONAL { <' + cellmlModel + '#located_in> <http://www.obofoundry.org/ro/ro.owl#located_in> ?Located_in } . ' +
            'OPTIONAL { <' + cellmlModel + '#DOI> <http://biomodels.net/model-qualifiers/isDescribedBy> ?DOI } . ' +
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
                        sendPostRequest(endpoint, query, showView, true);
                    },
                    false);
            },
            true);

        // Reinitialize so that last workspace does not appear in the Load Models
        // page when clicked from Model Discovery and Epithelial Model Platform page
        // mainUtils.workspaceName = "";
    };

    // Load the model
    mainUtils.loadModelHtml = function () {

        var cellmlModel = mainUtils.workspaceName;

        console.log("cellmlModel in loadModelHtml: ", cellmlModel);

        var query = 'SELECT ?Model_entity ?Protein ?Species ?Gene ?Compartment ' +
            'WHERE { GRAPH ?Workspace { ' +
            'OPTIONAL { ' + '<' + cellmlModel + '#Protein> <http://purl.org/dc/terms/description> ?Protein } . ' +
            'OPTIONAL { ?Model_entity <http://purl.org/dc/terms/description> ?Protein } . ' +
            'OPTIONAL { ' + '<' + cellmlModel + '#Species> <http://purl.org/dc/terms/description> ?Species } . ' +
            'OPTIONAL { ' + '<' + cellmlModel + '#Gene> <http://purl.org/dc/terms/description> ?Gene } . ' +
            'OPTIONAL { ' + '<' + cellmlModel + '#Compartment> <http://purl.org/dc/terms/description> ?Compartment } . ' +
            '}}';

        // showLoading("#main-content");
        sendGetRequest(
            modelHtml,
            function (modelHtmlContent) {
                $("#main-content").html(modelHtmlContent);

                sendPostRequest(endpoint, query, mainUtils.showModel, true);
            },
            false);


        // Switch from current active button to models button
        var activeItem = "#" + activeMenu();
        switchMenuToActive(activeItem, "#listModels");
    };

    // TODO: move to utils directory
    // Show selected items in a table
    mainUtils.showModel = function (jsonObj) {

        console.log("showModel: ", jsonObj);

        var table = $("<table/>").addClass("table table-hover table-condensed"); //table-bordered table-striped

        // Table header
        var thead = $("<thead/>"), tr = $("<tr/>");
        for (var i = 0; i < jsonObj.head.vars.length; i++) {
            if (i == 0) {
                tr.append($("<th/>").append($("<label/>")
                    .html('<input id="' + jsonObj.head.vars[0] + '" type="checkbox" name="attributeAll" ' +
                        'class="attributeAll" data-action="model" value="' + jsonObj.head.vars[0] + '" >')));
            }

            tr.append($("<th/>").append(jsonObj.head.vars[i]));
        }

        thead.append(tr);
        table.append(thead);

        for (var i = 0; i < jsonObj.head.vars.length; i++) {
            if (i == 0) {
                // search list to model list with empty model
                if (jsonObj.results.bindings.length == 0) break;

                model.push($("<label/>").html('<input id="' + modelEntityName + '" type="checkbox" ' +
                    'name="attribute" class="attribute" data-action="model" value="' + modelEntityName + '" >'));
            }

            if (jsonObj.head.vars[i] == "Compartment") {
                var compartment = "";
                for (var c = 0; c < jsonObj.results.bindings.length; c++) {
                    if (c == 0)
                        compartment += jsonObj.results.bindings[c][jsonObj.head.vars[i]].value;
                    else
                        compartment += "," + jsonObj.results.bindings[c][jsonObj.head.vars[i]].value;
                }

                model.push(compartment);
            }
            else {
                if (jsonObj.head.vars[i] == "Model_entity") {
                    model.push(modelEntityName);
                }
                else
                    model.push(jsonObj.results.bindings[0][jsonObj.head.vars[i]].value);
            }
        }

        // 1D to 2D array
        while (model.length) {
            model2DArray.push(model.splice(0, 6)); // 5 + 1 (checkbox) header elemenet
        }

        console.log("model and model2DArray: ", model, model2DArray);

        // Table body
        var tbody = $("<tbody/>"), td = [];
        for (var ix = 0; ix < model2DArray.length; ix++) {
            var tr = $("<tr/>");
            // +1 for adding checkbox column
            for (var j = 0; j < jsonObj.head.vars.length + 1; j++) {
                td[j] = $("<td/>");
                if (j == 0)
                    td[j].append(model2DArray[ix][j]);
                else
                    td[j].append(model2DArray[ix][j]);

                // Id for each row
                if (j == 1)
                    tr.attr("id", model2DArray[ix][j]);

                tr.append(td[j]);
            }

            tbody.append(tr);
        }

        table.append(tbody);
        $("#modelList").append(table);

        // Un-check checkbox in the model page
        // load epithelial to model discovery to load model
        for (var i = 0; i < $('table tr td label').length; i++) {
            if ($('table tr td label')[i].firstChild.checked == true) {
                $('table tr td label')[i].firstChild.checked = false;
            }
        }

        // Reinitialize so that last workspace does not appear in the Load Models
        // page when clicked from Model Discovery and Epithelial Model Platform page
        // mainUtils.workspaceName = "";
    };

    // Toggle table column in Model discovery
    mainUtils.toggleColHtml = function () {

        if (event.srcElement.checked == false) {
            var id = event.srcElement.id;

            console.log("id: ", id);

            $('td:nth-child(' + id + '),th:nth-child(' + id + ')').hide();
        }

        if (event.srcElement.checked == true) {
            var id = event.srcElement.id;

            console.log("id: ", id);

            $('td:nth-child(' + id + '),th:nth-child(' + id + ')').show();
        }
    };

    // Toggle table column in Load model
    mainUtils.toggleColModelHtml = function () {

        if (event.srcElement.checked == false) {
            var id = event.srcElement.id;

            console.log("id: ", id);

            $('td:nth-child(' + id + '),th:nth-child(' + id + ')').hide();
        }

        if (event.srcElement.checked == true) {
            var id = event.srcElement.id;

            console.log("id: ", id);

            $('td:nth-child(' + id + '),th:nth-child(' + id + ')').show();
        }
    };

    // Filter search results
    mainUtils.filterSearchHtml = function () {

        var tempstr = [];

        if (event.srcElement.checked == true) {

            var id = event.srcElement.id;
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

        if (event.srcElement.checked == false) {

            var tempstr = [];
            var id = event.srcElement.id;

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

    // TODO: move to utils directory
    mainUtils.deleteRowModelHtml = function () {

        // Un-check header checkbox if body is empty
        if ($('table tr th label')[0].firstChild.checked == true) {
            $('table tr th label')[0].firstChild.checked = false;
        }

        // Model_entity with same name will be removed
        // regardless of the current instance of checkboxes
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

                    // Remove from modelEntityNameArray
                    modelEntityNameArray.splice(tempIndex, 1);

                    // Remove from modelEntityFullNameArray
                    modelEntityFullNameArray.splice(tempIndex, 1);
                }
            }
        });

        // Empty temp model list
        templistOfModel = [];

        // TODO: click when empty loadmodel table!! Fix this!!
    };

    // Load the SVG model
    mainUtils.loadSVGModelHtml = function () {

        sendGetRequest(
            svgmodelHtml,
            function (svgmodelHtmlContent) {
                $("#main-content").html(svgmodelHtmlContent);

                // TODO: Fix it!!
                sendGetRequest(svgmodelHtml, showSVGModelHtml(links, model2DArray, modelEntityNameArray), false);
            },
            false);
    };

    // Load the epithelial
    mainUtils.loadEpithelialHtml = function () {

        sendGetRequest(
            svgepithelialHtml,
            function (epithelialHtmlContent) {
                $("#main-content").html(epithelialHtmlContent);

                sendGetRequest(svgepithelialHtml, mainUtils.loadEpithelial, false);
            },
            false);
    };

    mainUtils.loadEpithelial = function (epithelialHtmlContent) {

        // Reinitialize so that last workspace does not appear in the Load Models
        // page when clicked from Model Discovery and Epithelial Model Platform page
        // mainUtils.workspaceName = "";

        // remove model name, keep only solutes
        for (var i = 0; i < modelEntityNameArray.length; i++) {
            var indexOfHash = modelEntityNameArray[i].search("#");
            modelEntityNameArray[i] = modelEntityNameArray[i].slice(indexOfHash + 1);
        }

        console.log("loadEpithelial in model2DArr: ", model2DArray);
        console.log("loadEpithelial in modelEntityNameArray: ", modelEntityNameArray);
        console.log("loadEpithelial in modelEntityFullNameArray: ", modelEntityFullNameArray);

        var concentration_fma = [], source_fma = [], sink_fma = [], med_fma = [], med_pr = [];
        var source_fma2 = [], sink_fma2 = [];

        var apicalID = "http://identifiers.org/fma/FMA:84666";
        var basolateralID = "http://identifiers.org/fma/FMA:84669";
        var partOfProteinUri = "http://purl.obolibrary.org/obo/PR";
        var partOfCHEBIUri = "http://identifiers.org/chebi/CHEBI";
        var leakID = "http://identifiers.org/go/GO:0022840";

        var index = 0, counter = 0;
        var membrane = [], apicalMembrane = [], basolateralMembrane = [];

        // making cotransporter from the RDF graph using SPARQL
        mainUtils.makecotransporter = function (membrane1, membrane2) {
            // query for finding fluxes to make a cotransporter
            var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
                'SELECT ?med_entity_uri ?med_entity_uriCl ' +
                'WHERE { GRAPH ?Workspace { ' +
                '<' + membrane1.source_name + '> semsim:isComputationalComponentFor ?model_prop. ' +
                '?model_prop semsim:physicalPropertyOf ?model_proc. ' +
                '?model_proc semsim:hasMediatorParticipant ?model_medparticipant. ' +
                '?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity. ' +
                '?med_entity semsim:hasPhysicalDefinition ?med_entity_uri.' +
                '<' + membrane2.source_name + '> semsim:isComputationalComponentFor ?model_propCl. ' +
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

                    // console.log("jsonObj: ", jsonObj);

                    var tempProtein = [], tempApical = [], tempBasolateral = [];

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

                    // remove duplicate of protein ID
                    tempProtein = tempProtein.filter(function (item, pos) {
                        return tempProtein.indexOf(item) == pos;
                    })

                    // remove duplicate of fma ID
                    tempApical = tempApical.filter(function (item, pos) {
                        return tempApical.indexOf(item) == pos;
                    })

                    // remove duplicate of fma ID
                    tempBasolateral = tempBasolateral.filter(function (item, pos) {
                        return tempBasolateral.indexOf(item) == pos;
                    })

                    console.log("temp protein, apical, and basolateral: ", tempProtein, tempApical, tempBasolateral);

                    var NHE3 = "http://purl.obolibrary.org/obo/PR_P26433";
                    for (var i = 0; i < tempProtein.length; i++) {

                        if (tempProtein[i] == NHE3) continue;

                        // cotransporter in apical membrane
                        if (tempProtein.length != 0 && tempApical.length != 0) {
                            apicalMembrane.push(
                                {
                                    source_name: membrane1.source_name,
                                    sink_name: membrane1.sink_name,
                                    med_text: membrane1.med_text,
                                    med_fma: membrane1.med_fma,
                                    med_pr: membrane1.med_pr,
                                    source_text: membrane1.source_text,
                                    source_fma: membrane1.source_fma,
                                    sink_text: membrane1.sink_text,
                                    sink_fma: membrane1.sink_fma,
                                    source_name2: membrane2.source_name,
                                    sink_name2: membrane2.sink_name,
                                    med_text2: membrane2.med_text,
                                    med_fma2: membrane2.med_fma,
                                    med_pr2: membrane2.med_pr,
                                    source_text2: membrane2.source_text,
                                    source_fma2: membrane2.source_fma,
                                    sink_text2: membrane2.sink_text,
                                    sink_fma2: membrane2.sink_fma
                                });
                        }

                        // cotransporter in basolateral membrane
                        if (tempProtein.length != 0 && tempBasolateral.length != 0) {
                            basolateralMembrane.push(
                                {
                                    source_name: membrane1.source_name,
                                    sink_name: membrane1.sink_name,
                                    med_text: membrane1.med_text,
                                    med_fma: membrane1.med_fma,
                                    med_pr: membrane1.med_pr,
                                    source_text: membrane1.source_text,
                                    source_fma: membrane1.source_fma,
                                    sink_text: membrane1.sink_text,
                                    sink_fma: membrane1.sink_fma,
                                    source_name2: membrane2.source_name,
                                    sink_name2: membrane2.sink_name,
                                    med_text2: membrane2.med_text,
                                    med_fma2: membrane2.med_fma,
                                    med_pr2: membrane2.med_pr,
                                    source_text2: membrane2.source_text,
                                    source_fma2: membrane2.source_fma,
                                    sink_text2: membrane2.sink_text,
                                    sink_fma2: membrane2.sink_fma
                                });
                        }
                    }

                    counter++;

                    if (counter == iteration(membrane.length)) {
                        showsvgEpithelial(
                            concentration_fma,
                            source_fma2,
                            sink_fma2,
                            apicalMembrane,
                            basolateralMembrane,
                            membrane);
                    }
                },
                true);
        };

        mainUtils.srcDescMediatorOfFluxes = function () {

            if (index == modelEntityFullNameArray.length) {

                // exceptional case: one flux is chosen
                if (membrane.length <= 1) {
                    // console.log("membrane.length <= 1 concentration_fma: ", concentration_fma);
                    // console.log("membrane.length <= 1 source_fma2: ", source_fma2);
                    // console.log("membrane.length <= 1 sink_fma2: ", sink_fma2);
                    // console.log("membrane.length <= 1 apicalMembrane: ", apicalMembrane);
                    // console.log("membrane.length <= 1 basolateralMembrane: ", basolateralMembrane);
                    // console.log("membrane.length <= 1 membrane: ", membrane);

                    showsvgEpithelial(
                        concentration_fma,
                        source_fma2,
                        sink_fma2,
                        apicalMembrane,
                        basolateralMembrane,
                        membrane);
                }
                else {

                    console.log("membrane.length >= 1 membrane: ", membrane);

                    for (var i = 0; i < membrane.length; i++) {
                        for (var j = i + 1; j < membrane.length; j++) {
                            mainUtils.makecotransporter(membrane[i], membrane[j]);
                        }
                    }
                }

                return;
            }

            var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
                'SELECT ?source_fma ?sink_fma ?med_entity_uri ' +
                'WHERE { ' +
                '<' + modelEntityFullNameArray[index] + '> semsim:isComputationalComponentFor ?model_prop. ' +
                '?model_prop semsim:physicalPropertyOf ?model_proc. ' +
                '?model_proc semsim:hasSourceParticipant ?model_srcparticipant. ' +
                '?model_srcparticipant semsim:hasPhysicalEntityReference ?source_entity. ' +
                '?source_entity ro:part_of ?source_part_of_entity. ' +
                '?source_part_of_entity semsim:hasPhysicalDefinition ?source_fma. ' +
                '?model_proc semsim:hasSinkParticipant ?model_sinkparticipant. ' +
                '?model_sinkparticipant semsim:hasPhysicalEntityReference ?sink_entity. ' +
                '?sink_entity ro:part_of ?sink_part_of_entity. ' +
                '?sink_part_of_entity semsim:hasPhysicalDefinition ?sink_fma.' +
                '?model_proc semsim:hasMediatorParticipant ?model_medparticipant.' +
                '?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity.' +
                '?med_entity semsim:hasPhysicalDefinition ?med_entity_uri.' +
                '}'

            sendPostRequest(
                endpoint,
                query,
                function (jsonObjFlux) {

                    // console.log("jsonObjFlux: ", jsonObjFlux);

                    for (var i = 0; i < jsonObjFlux.results.bindings.length; i++) {

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
                            if (temp.indexOf(partOfProteinUri) != -1 || temp.indexOf(partOfCHEBIUri) != -1 ||
                                temp.indexOf(leakID) != -1) {
                                med_pr.push({
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
                    source_fma = uniqueifyEpithelial(source_fma);
                    sink_fma = uniqueifyEpithelial(sink_fma);
                    med_pr = uniqueifyEpithelial(med_pr);
                    med_fma = uniqueifyEpithelial(med_fma);

                    var query2 = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                        'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
                        'SELECT ?concentration_fma ' +
                        'WHERE { ' +
                        '<' + modelEntityFullNameArray[index] + '> semsim:isComputationalComponentFor ?model_prop. ' +
                        '?model_prop semsim:physicalPropertyOf ?source_entity. ' +
                        '?source_entity ro:part_of ?source_part_of_entity. ' +
                        '?source_part_of_entity semsim:hasPhysicalDefinition ?concentration_fma.' +
                        '}'

                    sendPostRequest(
                        endpoint,
                        query2,
                        function (jsonObjCon) {

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

                            if (source_fma.length != 0) {
                                if (source_fma.length == 1) {
                                    var srctext = parserFmaNameText(source_fma[0]);
                                    var snktext = parserFmaNameText(sink_fma[0]);
                                    var medfmatext = parserFmaNameText(med_fma[0]);

                                    if (med_pr[0] == undefined) { // temp solution
                                        membrane.push({
                                            source_text: srctext,
                                            source_fma: source_fma[0].fma,
                                            source_name: source_fma[0].name,
                                            sink_text: snktext,
                                            sink_fma: sink_fma[0].fma,
                                            sink_name: sink_fma[0].name,
                                            med_text: medfmatext,
                                            med_fma: med_fma[0].fma,
                                            med_pr: undefined
                                        });
                                    }
                                    else {
                                        membrane.push({
                                            source_text: srctext,
                                            source_fma: source_fma[0].fma,
                                            source_name: source_fma[0].name,
                                            sink_text: snktext,
                                            sink_fma: sink_fma[0].fma,
                                            sink_name: sink_fma[0].name,
                                            med_text: medfmatext,
                                            med_fma: med_fma[0].fma,
                                            med_pr: med_pr[0].fma
                                        });
                                    }

                                    source_fma2.push(source_fma[0]);
                                    sink_fma2.push(sink_fma[0]);
                                } else {
                                    // Swap if source and sink faces same direction
                                    if (source_fma[0].fma == sink_fma[0].fma) {
                                        var tempFMA = sink_fma[0].fma,
                                            tempName = sink_fma[0].name;

                                        sink_fma[0].fma = sink_fma[1].fma;
                                        sink_fma[0].name = sink_fma[1].name;
                                        sink_fma[1].fma = tempFMA;
                                        sink_fma[1].name = tempName;
                                    }

                                    for (var i = 0; i < source_fma.length; i++) {
                                        var srctext = parserFmaNameText(source_fma[i]);
                                        var snktext = parserFmaNameText(sink_fma[i]);

                                        if (med_fma[i] != undefined)
                                            var medfmatext = parserFmaNameText(med_fma[i]);

                                        if (med_pr[i] == undefined) { // temp solution
                                            membrane.push({
                                                source_text: srctext,
                                                source_fma: source_fma[i].fma,
                                                source_name: source_fma[i].name,
                                                sink_text: snktext,
                                                sink_fma: sink_fma[i].fma,
                                                sink_name: sink_fma[i].name,
                                                med_text: medfmatext,
                                                med_fma: undefined, // med_fma[i].fma,
                                                med_pr: undefined
                                            });
                                        }
                                        else {
                                            membrane.push({
                                                source_text: srctext,
                                                source_fma: source_fma[i].fma,
                                                source_name: source_fma[i].name,
                                                sink_text: snktext,
                                                sink_fma: sink_fma[i].fma,
                                                sink_name: sink_fma[i].name,
                                                med_text: medfmatext,
                                                med_fma: med_fma[i].fma,
                                                med_pr: med_pr[i].fma
                                            });
                                        }

                                        source_fma2.push(source_fma[i]);
                                        sink_fma2.push(sink_fma[i]);
                                    }
                                }
                            }

                            source_fma = [];
                            sink_fma = [];
                            med_fma = [];
                            med_pr = [];

                            mainUtils.srcDescMediatorOfFluxes(); // callback
                        },
                        true);
                },
                true);
        }

        mainUtils.srcDescMediatorOfFluxes();
    };

    // Expose utility to the global object
    global.$mainUtils = mainUtils;

})(window);
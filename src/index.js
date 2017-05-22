/**
 * Created by dsar941 on 9/8/2016.
 */
var parseModelName = require("./utils/misc.js").parseModelName;
var parserFmaNameText = require("./utils/misc.js").parserFmaNameText;
var headTitle = require("./utils/misc.js").headTitle;
var compare = require("./utils/misc.js").compare;
var uniqueifyModelEntity = require("./utils/misc.js").uniqueifyModelEntity;
var uniqueifyEpithelial = require("./utils/misc.js").uniqueifyEpithelial;
var uniqueifySrcSnkMed = require("./utils/misc.js").uniqueifySrcSnkMed;
var iteration = require("./utils/misc.js").iteration;
var showView = require("./utils/showView.js").showView;
var showSVGModelHtml = require("./utils/showSVGModel.js").showSVGModelHtml;
var showsvgEpithelial = require("./utils/showSVGEpithelial.js").showsvgEpithelial;

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

    var modelEntityName,
        modelEntityNameArray = [],
        modelEntityFullNameArray = [];

    // svg visualization
    var links = [];

    // process AJAX call
    var modelEntity = [],
        biologicalMeaning = [],
        speciesList = [],
        geneList = [],
        proteinList = [],
        sourcefmaList = [],
        sinkfmaList = [],
        meduriList = [],
        totalList = [],
        fmaList = [],
        head = [],
        id = 0;

    var str = [];

    // Convenience function for inserting innerHTML for 'select'
    var insertHtml = function (selector, html) {
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    // Show loading icon inside element identified by 'selector'.
    var showLoading = function (selector) {
        var html = "<div class='text-center'>";
        html += "<img src='img/ajax-loader.gif'></div>";
        insertHtml(selector, html);
    };

    // Find the current active menu button
    var activeMenu = function () {
        var classes = document.querySelector("#ulistItems");
        for (var i = 0; i < classes.getElementsByTagName("li").length; i++) {
            if (classes.getElementsByTagName("li")[i].className === "active")
                return classes.getElementsByTagName("li")[i].id;
        }
    };

    // Remove the class 'active' from source to target button
    var switchMenuToActive = function (source, target) {
        // Remove 'active' from source button
        var classes = document.querySelector(source).className;
        classes = classes.replace(new RegExp("active", "g"), "");
        document.querySelector(source).className = classes;

        // Add 'active' to target button if not already there
        classes = document.querySelector(target).className;
        if (classes.indexOf("active") === -1) {
            classes += "active";
            document.querySelector(target).className = classes;
        }
    };

    mainUtils.loadHomeHtml = function () {
        // Switch from current active button to home button
        var activeItem = "#" + activeMenu();
        switchMenuToActive(activeItem, "#listHome");

        insertHtml("#main-content", "... Home Page !!!");
    };

    mainUtils.loadHelp = function () {
        // Switch from current active button to home button
        var activeItem = "#" + activeMenu();
        switchMenuToActive(activeItem, "#help");

        insertHtml("#main-content", "... Help Page !!!");
    };

    // On page load (before img or CSS)
    document.addEventListener("DOMContentLoaded", function (event) {
        // Place some startup code here
    });

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

                    // indexOfSemSimURI + 1 ==> weinstein_1995#NHE3_C_ext_Na
                    modelEntityName = idWithStr.slice(36 + 1);

                    // Temporary for display
                    if (modelEntityName.indexOf("16032017100850239p1300") != -1) {

                        var indexOfHash = modelEntityName.search("#");
                        modelEntityName = "weinstein_1995" + modelEntityName.slice(indexOfHash);
                    }

                    if (modelEntityName.indexOf("17032017142614972p1300") != -1) {

                        var indexOfHash = modelEntityName.search("#");
                        modelEntityName = "chang_fujita_b_1999" + modelEntityName.slice(indexOfHash);
                    }

                    if (modelEntityName.indexOf("21042017112802526p1200") != -1) {

                        var indexOfHash = modelEntityName.search("#");
                        modelEntityName = "wilkins_sneyd_1998" + modelEntityName.slice(indexOfHash);
                    }

                    if (modelEntityName.indexOf("23042017142938531p1200") != -1) {

                        var indexOfHash = modelEntityName.search("#");
                        modelEntityName = "warren_2010" + modelEntityName.slice(indexOfHash);
                    }
                    if (modelEntityName.indexOf("20042017200857265p1200") != -1) {

                        var indexOfHash = modelEntityName.search("#");
                        modelEntityName = "sneyd_1995" + modelEntityName.slice(indexOfHash);
                    }

                    if (modelEntityName.indexOf("22042017214418158p1200") != -1) {

                        var indexOfHash = modelEntityName.search("#");
                        modelEntityName = "bindschadler_sneyd_2001" + modelEntityName.slice(indexOfHash);
                    }
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
                    templistOfModel.push(event.srcElement.value);

                    // for making visualization graph
                    modelEntityNameArray.push(event.srcElement.value);
                    modelEntityFullNameArray.push(event.srcElement.value);
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

                        templistOfModel.push($('.attribute')[i].value);

                        // for making visualization graph
                        modelEntityNameArray.push($('.attribute')[i].value);
                        modelEntityFullNameArray.push($('.attribute')[i].value);
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
        }
    };

    // Load search html
    mainUtils.loadSearchHtml = function () {

        if (!sessionStorage.getItem("searchListContent")) {
            sendGetRequest(
                searchHtml,
                function (searchHtmlContent) {
                    insertHtml("#main-content", searchHtmlContent);
                },
                false);

        }
        else {
            insertHtml("#main-content", sessionStorage.getItem('searchListContent'));
        }

        // Switch from current active button to discovery button
        var activeItem = "#" + activeMenu();
        switchMenuToActive(activeItem, "#listDiscovery");
    };

    // Event invocation to SEARCH, MODEL
    document.addEventListener('click', function (event) {

        console.log("event: ", event);
        // If there's an action with the given name, call it
        if (typeof actions[event.srcElement.dataset.action] === "function") {
            actions[event.srcElement.dataset.action].call(this, event);
        }
    })

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
            sourcefmaList = [];
            sinkfmaList = [];
            meduriList = [];
            totalList = [];
            fmaList = [];
            head = [];

            id = 0; // id to index each Model_entity

            mainUtils.ontologyQuery(uriOPB, uriCHEBI, keyValue);
        }
    })

    mainUtils.ontologyQuery = function (uriOPB, uriCHEBI, keyValue) {

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

                if (id == jsonModel.results.bindings.length) {
                    return;
                }

                // source fma, sink fma and mediator
                var model = jsonModel.results.bindings[id].Model_entity.value;
                var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                    'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
                    'SELECT ?source_fma ?sink_fma ?med_entity_uri ' +
                    'WHERE { ' +
                    '<' + model + '> semsim:isComputationalComponentFor ?model_prop. ' +
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

                                                // reinitialize flux instances
                                                sourcefmaList = [];
                                                sinkfmaList = [];
                                                meduriList = [];

                                                // source fma, sink fma and mediator
                                                for (var i = 0; i < jsonObjFlux.results.bindings.length; i++) {

                                                    if (jsonObjFlux.results.bindings[i].source_fma == undefined)
                                                        sourcefmaList.push("");
                                                    else
                                                        sourcefmaList.push(jsonObjFlux.results.bindings[i].source_fma.value);

                                                    if (jsonObjFlux.results.bindings[i].sink_fma == undefined)
                                                        sinkfmaList.push("");
                                                    else
                                                        sinkfmaList.push(jsonObjFlux.results.bindings[i].sink_fma.value);

                                                    if (jsonObjFlux.results.bindings[i].med_entity_uri == undefined)
                                                        meduriList.push("");
                                                    else
                                                        meduriList.push(jsonObjFlux.results.bindings[i].med_entity_uri.value);
                                                }

                                                // remove duplicate
                                                sourcefmaList = uniqueifySrcSnkMed(sourcefmaList);
                                                sinkfmaList = uniqueifySrcSnkMed(sinkfmaList);
                                                meduriList = uniqueifySrcSnkMed(meduriList);

                                                totalList.push(sourcefmaList + "," + sinkfmaList + "," + meduriList);

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
                                                mainUtils.searchListAJAX(
                                                    modelEntity[len - 1],
                                                    speciesList[len - 1],
                                                    geneList[len - 1],
                                                    proteinList[len - 1],
                                                    totalList,
                                                    id);

                                                id++; // increment index of modelEntity
                                                mainUtils.ontologyQuery(uriOPB, uriCHEBI, keyValue); // callback
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

    mainUtils.searchListAJAX = function (modelEntityid, speciesListid, geneListid, proteinListid, totalList, id) {

        // query for flux or flux of solutes
        var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
            'PREFIX dcterms: <http://purl.org/dc/terms/>' +
            'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
            'SELECT ?Model_srcentity ?Biological_srcmeaning ?source_fma ?Model_snkentity ?Biological_snkmeaning ?sink_fma ' +
            'WHERE { ' +
            '<' + modelEntityid + '> semsim:isComputationalComponentFor ?model_prop. ' +
            '?model_prop semsim:physicalPropertyOf ?model_proc. ' +
            '?model_proc semsim:hasSourceParticipant ?model_srcparticipant. ' +
            '?model_srcparticipant semsim:hasPhysicalEntityReference ?source_entity. ' +
            '?source_prop semsim:physicalPropertyOf ?source_entity. ' +
            '?Model_srcentity semsim:isComputationalComponentFor ?source_prop. ' +
            '?Model_srcentity dcterms:description ?Biological_srcmeaning. ' +
            '?source_entity ro:part_of ?source_entity_fma. ' +
            '?source_entity_fma semsim:hasPhysicalDefinition ?source_fma. ' +
            '?model_proc semsim:hasSinkParticipant ?model_sinkparticipant. ' +
            '?model_sinkparticipant semsim:hasPhysicalEntityReference ?sink_entity. ' +
            '?sink_prop semsim:physicalPropertyOf ?sink_entity. ' +
            '?Model_snkentity semsim:isComputationalComponentFor ?sink_prop. ' +
            '?Model_snkentity dcterms:description ?Biological_snkmeaning. ' +
            '?sink_entity ro:part_of ?sink_entity_fma. ' +
            '?sink_entity_fma semsim:hasPhysicalDefinition ?sink_fma. ' +
            '}'

        sendPostRequest(
            endpoint,
            query,
            function (jsonModel) {

                var jsonModelObj = [];

                // Parsing into Model_entity and Biological_meaning object
                for (var i = 0; i < jsonModel.results.bindings.length; i++) {
                    jsonModelObj.push({
                        Model_entity: jsonModel.results.bindings[i].Model_srcentity.value,
                        Biological_meaning: jsonModel.results.bindings[i].Biological_srcmeaning.value,
                        fma: jsonModel.results.bindings[i].source_fma.value
                    });
                }

                for (var i = 0; i < jsonModel.results.bindings.length; i++) {
                    jsonModelObj.push({
                        Model_entity: jsonModel.results.bindings[i].Model_snkentity.value,
                        Biological_meaning: jsonModel.results.bindings[i].Biological_snkmeaning.value,
                        fma: jsonModel.results.bindings[i].sink_fma.value
                    });
                }

                // remove redundant objects
                jsonModelObj = uniqueifyModelEntity(jsonModelObj);

                for (var m = 0; m < jsonModelObj.length; m++) {
                    modelEntity.push(jsonModelObj[m].Model_entity);
                    biologicalMeaning.push(jsonModelObj[m].Biological_meaning);
                    speciesList.push(speciesListid);
                    geneList.push(geneListid);
                    proteinList.push(proteinListid);
                    totalList.push(jsonModelObj[m].fma);
                }

                // concentration block
                if (jsonModelObj.length == 0) {
                    // query for concentration or concentration of solutes
                    var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                        'PREFIX dcterms: <http://purl.org/dc/terms/>' +
                        'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
                        'SELECT ?biologicalMeaning ?fma ' +
                        'WHERE { ' +
                        '<' + modelEntityid + '> dcterms:description ?biologicalMeaning. ' +
                        '<' + modelEntityid + '> semsim:isComputationalComponentFor ?model_prop. ' +
                        '?model_prop semsim:physicalPropertyOf ?entity. ' +
                        '?entity ro:part_of ?entity_fma. ' +
                        '?entity_fma semsim:hasPhysicalDefinition ?fma. ' +
                        '}'

                    sendPostRequest(
                        endpoint,
                        query,
                        function (jsonModelCon) {

                            totalList[id] = jsonModelCon.results.bindings[0].fma.value;

                            mainUtils.searchList(
                                head,
                                modelEntity,
                                biologicalMeaning,
                                speciesList,
                                geneList,
                                proteinList,
                                totalList);
                        },
                        true);
                }
                else { // flux block

                    mainUtils.searchList(
                        head,
                        modelEntity,
                        biologicalMeaning,
                        speciesList,
                        geneList,
                        proteinList,
                        totalList);
                }
            },
            true
        );
    }

    // TODO: make a common table platform for all functions
    // Show semantic annotation extracted from PMR
    mainUtils.searchList = function (head, modelEntity, biologicalMeaning, speciesList, geneList, proteinList, totalList) {

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
        for (var i = 0; i < totalList.length; i++) {
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
                    label.innerHTML = '<input id="' + totalList[i] + '" type="checkbox" ' +
                        'data-action="search" value="' + totalList[i] + '" class="checkbox"></label>';

                    td[j].appendChild(label);
                    tr.appendChild(td[j]);
                }

                if (j == 1) {
                    td[j] = document.createElement("td");
                    td[j].id = totalList[i];
                    td[j].appendChild(document.createTextNode(temp[j]));
                    tr.appendChild(td[j]);
                }
                else {
                    td[j] = document.createElement("td");
                    td[j].appendChild(document.createTextNode(temp[j]));
                    tr.appendChild(td[j]);
                }
            }

            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        searchList.appendChild(table);

        console.log("table: ", table);

        // Fill in the search attribute value
        var searchTxt = document.getElementById("searchTxt");
        searchTxt.setAttribute('value', sessionStorage.getItem('searchTxtContent'));

        // SET main content in the local storage
        var maincontent = document.getElementById('main-content');
        sessionStorage.setItem('searchListContent', $(maincontent).html());
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
                        insertHtml("#main-content", viewHtmlContent);
                        sendPostRequest(endpoint, query, showView, true);
                    },
                    false);
            },
            true);
    };

    // Load the model
    mainUtils.loadModelHtml = function () {

        var cellmlModel = mainUtils.workspaceName;

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
                insertHtml("#main-content", modelHtmlContent);

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

        var modelList = document.getElementById("modelList");

        var table = document.createElement("table");
        table.className = "table table-hover table-condensed"; //table-bordered table-striped

        // Table header
        var thead = document.createElement("thead");
        var tr = document.createElement("tr");
        for (var i = 0; i < jsonObj.head.vars.length; i++) {
            if (i == 0) {
                var th = document.createElement("th");
                var label = document.createElement('label');
                label.innerHTML = '<input id="' + jsonObj.head.vars[0] + '" type="checkbox" name="attributeAll" ' +
                    'class="attributeAll" data-action="model" value="' + jsonObj.head.vars[0] + '" ></label>';

                th.appendChild(label);
                tr.appendChild(th);
            }

            var th = document.createElement("th");
            th.appendChild(document.createTextNode(jsonObj.head.vars[i]));
            tr.appendChild(th);
        }

        thead.appendChild(tr);
        table.appendChild(thead);

        // Table body
        for (var i = 0; i < jsonObj.head.vars.length; i++) {
            if (i == 0) {
                // search list to model list with empty model
                if (jsonObj.results.bindings.length == 0) break;

                //modelEntityName <== jsonObj.results.bindings[i].Model_entity.value;
                var label = document.createElement('label');
                label.innerHTML = '<input id="' + modelEntityName + '" type="checkbox" name="attribute" ' +
                    'class="attribute" data-action="model" value="' + modelEntityName + '" ></label>';

                model.push(label);
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
                if (jsonObj.head.vars[i] == "Model_entity")
                    model.push(modelEntityName); // something#Protein ==> modelEntityName
                else
                    model.push(jsonObj.results.bindings[0][jsonObj.head.vars[i]].value);
            }
        }

        // 1D to 2D array
        while (model.length) {
            model2DArray.push(model.splice(0, 6)); // 5 + 1 (checkbox) header elemenet
        }

        var td = [];
        var tbody = document.createElement("tbody");
        for (var ix = 0; ix < model2DArray.length; ix++) {
            var tr = document.createElement("tr");
            // +1 for adding checkbox column
            for (var j = 0; j < jsonObj.head.vars.length + 1; j++) {
                td[j] = document.createElement("td");
                if (j == 0)
                    td[j].appendChild(model2DArray[ix][j]);
                else
                    td[j].appendChild(document.createTextNode(model2DArray[ix][j]));

                // Id for each row
                if (j == 1)
                    tr.setAttribute("id", model2DArray[ix][j]);

                tr.appendChild(td[j]);
            }

            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        modelList.appendChild(table);

        // Un-check checkbox in the model page
        // load epithelial to model discovery to load model
        for (var i = 0; i < $('table tr td label').length; i++) {
            if ($('table tr td label')[i].firstChild.checked == true) {
                $('table tr td label')[i].firstChild.checked = false;
            }
        }
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
        templistOfModel.forEach(function (element) {
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
                insertHtml("#main-content", svgmodelHtmlContent);

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
                insertHtml("#main-content", epithelialHtmlContent);

                sendGetRequest(svgepithelialHtml, mainUtils.loadEpithelial, false);
            },
            false);
    };

    mainUtils.loadEpithelial = function (epithelialHtmlContent) {

        // remove model name, keep only solutes
        for (var i = 0; i < modelEntityNameArray.length; i++) {
            var indexOfHash = modelEntityNameArray[i].search("#");
            modelEntityNameArray[i] = modelEntityNameArray[i].slice(indexOfHash + 1);
        }

        // remove duplicate
        modelEntityNameArray = modelEntityNameArray.filter(function (item, pos) {
            return modelEntityNameArray.indexOf(item) == pos;
        })

        // Temporary for testing
        for (var i = 0; i < modelEntityFullNameArray.length; i++) {
            var indexOfHash = modelEntityFullNameArray[i].search("#");
            if (modelEntityFullNameArray[i].slice(0, indexOfHash) == "weinstein_1995")
                modelEntityFullNameArray[i] = "http://www.bhi.washington.edu/SemSim/16032017100850239p1300" + modelEntityFullNameArray[i].slice(indexOfHash);
            if (modelEntityFullNameArray[i].slice(0, indexOfHash) == "mackenzie_1996")
                modelEntityFullNameArray[i] = "http://www.bhi.washington.edu/SemSim/mackenzie_1996" + modelEntityFullNameArray[i].slice(indexOfHash);
            if (modelEntityFullNameArray[i].slice(0, indexOfHash) == "chang_fujita_b_1999")
                modelEntityFullNameArray[i] = "http://www.bhi.washington.edu/SemSim/17032017142614972p1300" + modelEntityFullNameArray[i].slice(indexOfHash);
            if (modelEntityFullNameArray[i].slice(0, indexOfHash) == "wilkins_sneyd_1998")
                modelEntityFullNameArray[i] = "http://www.bhi.washington.edu/SemSim/21042017112802526p1200" + modelEntityFullNameArray[i].slice(indexOfHash);
            if (modelEntityFullNameArray[i].slice(0, indexOfHash) == "warren_2010")
                modelEntityFullNameArray[i] = "http://www.bhi.washington.edu/SemSim/23042017142938531p1200" + modelEntityFullNameArray[i].slice(indexOfHash);
            if (modelEntityFullNameArray[i].slice(0, indexOfHash) == "sneyd_1995")
                modelEntityFullNameArray[i] = "http://www.bhi.washington.edu/SemSim/20042017200857265p1200" + modelEntityFullNameArray[i].slice(indexOfHash);
            if (modelEntityFullNameArray[i].slice(0, indexOfHash) == "bindschadler_sneyd_2001")
                modelEntityFullNameArray[i] = "http://www.bhi.washington.edu/SemSim/22042017214418158p1200" + modelEntityFullNameArray[i].slice(indexOfHash);
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

                    // cotransporter in apical membrane
                    if (tempProtein.length != 0 && tempApical.length != 0) {
                        apicalMembrane.push(
                            {
                                source_text: membrane1.source_text,
                                source_fma: membrane1.source_fma,
                                sink_text: membrane1.sink_text,
                                sink_fma: membrane1.sink_fma,
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
                                source_text: membrane1.source_text,
                                source_fma: membrane1.source_fma,
                                sink_text: membrane1.sink_text,
                                sink_fma: membrane1.sink_fma,
                                source_text2: membrane2.source_text,
                                source_fma2: membrane2.source_fma,
                                sink_text2: membrane2.sink_text,
                                sink_fma2: membrane2.sink_fma
                            });
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
                    showsvgEpithelial(
                        concentration_fma,
                        source_fma2,
                        sink_fma2,
                        apicalMembrane,
                        basolateralMembrane,
                        membrane);
                }
                else {
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

                                source_fma = [];
                                sink_fma = [];
                                med_fma = [];
                                med_pr = [];
                            }
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
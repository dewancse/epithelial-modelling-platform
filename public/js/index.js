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

    var compartmentVal, proteinVal, searchStatus = "local";
    var soluteFlux1, soluteFlux1val, sourceFlux1, sourceFlux1val,
        sinkFlux1, sinkFlux1val, mediatorFlux1, mediatorFlux1val;
    var soluteFlux2, soluteFlux2val, sourceFlux2, sourceFlux2val,
        sinkFlux2, sinkFlux2val, mediatorFlux2, mediatorFlux2val;

    // HOME: load the home page
    mainUtils.loadHomeHtml = function () {
        showLoading("#main-content");
        sendGetRequest(
            homeHtml,
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

        $('#bioportal').change(function () {
            if (this.checked) {
                searchStatus = "bioportal";
                console.log("bioportal checked: ", this.checked);
                $('#local').attr("checked", false);
                $('#local').attr("disabled", true);
            }
            else {
                console.log("bioportal unchecked: ", this.checked);
                $('#local').attr("checked", false);
                $('#local').attr("disabled", false);
            }
        });

        $('#local').change(function () {
            if (this.checked) {
                searchStatus = "local";
                console.log("local checked: ", this.checked);
                $('#bioportal').attr("checked", false);
                $('#bioportal').attr("disabled", true);
            }
            else {
                console.log("local unchecked: ", this.checked);
                $('#bioportal').attr("checked", false);
                $('#bioportal').attr("disabled", false);
            }
        });

        if (event.target.id == "compartmentTxt") {
            var index = event.target.options.selectedIndex;
            // console.log("InnerText:", $("#compartmentTxt option")[i].innerText);
            compartmentVal = $("#compartmentTxt option")[index].value;
        }
        if (event.target.id == "soluteFlux1Txt") {
            var index = event.target.options.selectedIndex;
            $("#sourceCon1Txt").val($("#soluteFlux1Txt option")[index].innerText);
        }

        if (event.target.id == "soluteFlux1Txt") {
            var index = event.target.options.selectedIndex;
            soluteFlux1 = $("#soluteFlux1Txt option")[index].innerText;
            soluteFlux1val = $("#soluteFlux1Txt option")[index].value;
            $("#sourceCon1Txt").val(soluteFlux1);
        }
        if (event.target.id == "sourceFlux1Txt") {
            var index = event.target.options.selectedIndex;
            sourceFlux1 = $("#sourceFlux1Txt option")[index].innerText;
            sourceFlux1val = $("#sourceFlux1Txt option")[index].value;
            sourceFlux2 = $("#sourceFlux1Txt option")[index].innerText;
            sourceFlux2val = $("#sourceFlux1Txt option")[index].value;
            $("#sourceSrcComp1Txt").val(sourceFlux1);
            $("#sourceSrcComp2Txt").val(sourceFlux2);
            $("#sourceFlux2Txt").val(sourceFlux2);
        }
        if (event.target.id == "sinkFlux1Txt") {
            var index = event.target.options.selectedIndex;
            sinkFlux1 = $("#sinkFlux1Txt option")[index].innerText;
            sinkFlux1val = $("#sinkFlux1Txt option")[index].value;
            sinkFlux2 = $("#sinkFlux1Txt option")[index].innerText;
            sinkFlux2val = $("#sinkFlux1Txt option")[index].value;
            $("#sourceSnkComp1Txt").val(sinkFlux1);
            $("#sourceSnkComp2Txt").val(sinkFlux2);
            $("#sinkFlux2Txt").val(sinkFlux2);
        }
        if (event.target.id == "mediatorFlux1Txt") {
            var index = event.target.options.selectedIndex;
            mediatorFlux1 = $("#mediatorFlux1Txt option")[index].innerText;
            mediatorFlux1val = $("#mediatorFlux1Txt option")[index].value;
            mediatorFlux2 = $("#mediatorFlux1Txt option")[index].innerText;
            mediatorFlux2val = $("#mediatorFlux1Txt option")[index].value;
            $("#mediatorFlux2Txt").val(mediatorFlux2);
        }
        if (event.target.id == "soluteFlux2Txt") {
            var index = event.target.options.selectedIndex;
            soluteFlux2 = $("#soluteFlux2Txt option")[index].innerText;
            soluteFlux2val = $("#soluteFlux2Txt option")[index].value;
            $("#sourceCon2Txt").val(soluteFlux2);
        }
    });

    // MODEL DISCOVERY: enter search texts
    $(document).on("keydown", function (event) {
        if (event.key == "Enter" && document.getElementById("searchTxt")) {

            var searchListFunc = function (uriOPB, uriCHEBI, uriFMA, keyValue) {
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
                    if (keyValue == "flux" || keyValue == "chemical concentration flow rate") {
                        // model discovery with 'flux of sodium', etc.
                        if (uriFMA == "")
                            query = discoveryWithFluxOfSolute(uriCHEBI);
                        else
                            query = discoveryWithFluxOfSoluteFMA(uriCHEBI, uriFMA);
                    }
                    else if (keyValue == "concentration" || keyValue == "concentration of chemical") {
                        // model disocvery with 'concentration of sodium', etc.
                        if (uriFMA == "")
                            query = discoveryWithConcentrationOfSolute(uriCHEBI);
                        else
                            query = discoveryWithConcentrationOfSoluteFMA(uriCHEBI, uriFMA);
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
            };

            if (searchStatus == "local") {
                var uriOPB, uriCHEBI, uriFMA, keyValue;
                var searchTxt = document.getElementById("searchTxt").value.toLowerCase();

                // set local storage
                sessionStorage.setItem("searchTxtContent", searchTxt);

                // dictionary object
                for (var i in dictionary) {
                    var key1 = searchTxt.indexOf("" + dictionary[i].key1 + ""),
                        key2 = searchTxt.indexOf("" + dictionary[i].key2 + ""),
                        key3 = searchTxt.indexOf("" + dictionary[i].key3 + "");

                    if (key1 != -1 && key2 != -1 && key3 != -1) {
                        uriOPB = dictionary[i].opb;
                        uriCHEBI = dictionary[i].chebi;
                        uriFMA = dictionary[i].fma;
                        keyValue = dictionary[i].key1;
                    }
                }

                console.log("uriOPB local: ", uriOPB);
                console.log("uriCHEBI local: ", uriCHEBI);
                console.log("uriFMA: local", uriFMA);

                searchListFunc(uriOPB, uriCHEBI, uriFMA, keyValue);
            }
            else if (searchStatus == "bioportal") {
                var uriOPB = "", uriOPBTxt = "", uriCHEBI = "", uriCHEBITxt = "", uriFMA = "", uriFMATxt = "", keyValue;
                var dictKeyWordsCHEBI = [
                    "sodium", "hydrogen", "ammonium", "chloride", "potassium", "bicarbonate", "glucose"
                ];
                var dictKeyWordsFMA = [
                    "luminal", "cytosol", "portion of cytosol", "interstitial fluid", "tissue fluid", "portion of tissue fluid",
                    "apical membrane", "apical plasma membrane", "basolateral membrane", "basolateral plasma membrane"
                ];
                var dictOPB = [
                    {
                        "key1": "concentration",
                        "opb": "<http://identifiers.org/opb/OPB_00340>"
                    },
                    {
                        "key1": "flux",
                        "opb": "<http://identifiers.org/opb/OPB_00593>"
                    }
                ];
                var dictCHEBI = [
                    {
                        "key1": "sodium",
                        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_29101>"
                    },
                    {
                        "key1": "hydrogen",
                        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_15378>"
                    },
                    {
                        "key1": "ammonium",
                        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_28938>"
                    },
                    {
                        "key1": "chloride",
                        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_17996>"
                    },
                    {
                        "key1": "potassium",
                        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_29103>"
                    },
                    {
                        "key1": "bicarbonate",
                        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_17544>"
                    },
                    {
                        "key1": "glucose",
                        "chebi": "<http://purl.obolibrary.org/obo/CHEBI_17234>"
                    }
                ];
                var dictFMA = [
                    {
                        "key1": "luminal",
                        "fma": "<http://purl.obolibrary.org/obo/FMA_74550>"
                    },
                    {
                        "key1": "cytosol",
                        "fma": "<http://purl.obolibrary.org/obo/FMA_66836>"
                    },
                    {
                        "key1": "interstitial fluid",
                        "fma": "<http://purl.obolibrary.org/obo/FMA_9673>"
                    },
                    {
                        "key1": "tissue fluid",
                        "fma": "<http://purl.obolibrary.org/obo/FMA_9673>"
                    },
                    {
                        "key1": "apical membrane",
                        "fma": "<http://purl.obolibrary.org/obo/FMA_84666>"
                    },
                    {
                        "key1": "basolateral membrane",
                        "fma": "<http://purl.obolibrary.org/obo/FMA_84669>"
                    }
                ];

                var searchTxt = document.getElementById("searchTxt").value.toLowerCase();

                // set local storage
                sessionStorage.setItem("searchTxtContent", searchTxt);

                var endpointbioportal = bioportalAnnotatorEndpoint + searchTxt + "&ontologies=CHEBI,FMA,OPB,PR&longest_only=true";

                sendGetRequest(
                    endpointbioportal,
                    function (jsonAnnotatorList) {
                        console.log("jsonAnnotatorList: ", jsonAnnotatorList);
                        // OPB
                        for (var i = 0; i < jsonAnnotatorList.length; i++) {
                            var id = jsonAnnotatorList[i].annotatedClass["@id"],
                                text = jsonAnnotatorList[i].annotations[0].text.toLowerCase(),
                                mType = jsonAnnotatorList[i].annotations[0].matchType;
                            if (id.search("OPB_") != -1) {
                                if (mType == "PREF") {
                                    uriOPB = "<http://identifiers.org/opb/" + id.slice(id.search("#") + 1) + ">";
                                    uriOPBTxt = text;
                                    keyValue = text;
                                    break;
                                }
                            }
                        }
                        if (uriOPBTxt == "") {
                            if (searchTxt.indexOf("flux") != -1)
                                uriOPBTxt = "flux";
                            else if (searchTxt.indexOf("concentration") != -1)
                                uriOPBTxt = "concentration";

                            for (var j in dictOPB) {
                                var key1 = dictOPB[j].key1;
                                if (key1 == uriOPBTxt) {
                                    uriOPB = dictOPB[j].opb;
                                    uriOPBTxt = dictOPB[j].key1;
                                    keyValue = uriOPBTxt;
                                    break;
                                }
                            }
                        }

                        // CHEBI
                        var chebiArray = [];
                        for (var i = 0; i < jsonAnnotatorList.length; i++) {
                            var id = jsonAnnotatorList[i].annotatedClass["@id"],
                                text = jsonAnnotatorList[i].annotations[0].text.toLowerCase(),
                                mType = jsonAnnotatorList[i].annotations[0].matchType;
                            if (id.search("CHEBI_") != -1) {
                                if (mType == "PREF") {
                                    if (dictKeyWordsCHEBI.indexOf(text) != -1) {
                                        uriCHEBI = id;
                                        uriCHEBITxt = text;
                                        break;
                                    }
                                }
                                chebiArray.push(text);
                            }
                        }
                        if (uriCHEBITxt == "") {
                            for (var i = 0; i < chebiArray.length; i++) {
                                var flag = false;
                                for (var j in dictCHEBI) {
                                    var key1 = dictCHEBI[j].key1;
                                    if (key1 == chebiArray[i]) {
                                        uriCHEBI = dictCHEBI[j].chebi;
                                        uriCHEBITxt = dictCHEBI[j].key1;
                                        flag = true;
                                        break;
                                    }
                                }
                                if (flag == true) break;
                            }
                        }

                        // FMA
                        var fmaArray = [];
                        for (var i = 0; i < jsonAnnotatorList.length; i++) {
                            var id = jsonAnnotatorList[i].annotatedClass["@id"],
                                text = jsonAnnotatorList[i].annotations[0].text.toLowerCase(),
                                mType = jsonAnnotatorList[i].annotations[0].matchType;
                            if (id.search("/fma") != -1) {
                                if (mType == "PREF") {
                                    if (dictKeyWordsFMA.indexOf(text) != -1) {
                                        uriFMA = "<http://purl.obolibrary.org/obo/FMA_" + id.slice(id.search("/fma") + 8) + ">";
                                        uriFMATxt = text;
                                        break;
                                    }
                                }
                                fmaArray.push(text);
                            }
                        }
                        for (var i = 0; i < fmaArray.length; i++) {
                            if (fmaArray[i] == "membrane") {
                                if (searchTxt.indexOf("apical") != -1)
                                    fmaArray[i] = "apical " + fmaArray[i];
                                else if (searchTxt.indexOf("basolateral") != -1)
                                    fmaArray[i] = "basolateral " + fmaArray[i];
                            }
                        }
                        if (uriFMATxt == "") {
                            for (var i = 0; i < fmaArray.length; i++) {
                                var flag = false;
                                for (var j in dictFMA) {
                                    var key1 = dictFMA[j].key1;
                                    if (key1 == fmaArray[i]) {
                                        uriFMA = dictFMA[j].fma;
                                        uriFMATxt = dictFMA[j].key1;
                                        flag = true;
                                        break;
                                    }
                                }
                                if (flag == true) break;
                            }
                        }

                        console.log("uriOPB bioportal: ", uriOPB, uriOPBTxt);
                        console.log("uriCHEBI bioportal: ", uriCHEBI, uriCHEBITxt);
                        console.log("uriFMA bioportal: ", uriFMA, uriFMATxt);

                        searchListFunc(uriOPB, uriCHEBI, uriFMA, keyValue);
                    },
                    true
                );
            }
        }
        if (event.key == "Enter" && document.getElementById("proteinTxt")) {

            var m = new AddModal({
                id: "myAddModel",
                header: "Protein Information from Bioportal and OLS",
                footer: "My footer",
                footerCloseButton: "Close",
                footerSaveButton: "Save"
            });

            $("#myModal").modal({backdrop: "static", keyboard: false});
            m.getBody().html("<div id=addModalBody></div>");
            m.show();

            showLoading("#addModalBody");

            var proteinTxt = document.getElementById("proteinTxt").value;
            var proteinIDs = [], proteinNames = [], speciesNames = [], geneNames = [];

            // showLoading("#proteinList");
            var endpointbioportal = bioportalPrEndpoint + proteinTxt + "&ontologies=PR&roots_only=true";

            sendGetRequest(
                endpointbioportal,
                function (jsonProteinList) {
                    console.log(jsonProteinList);
                    for (var i = 0; i < jsonProteinList.collection.length; i++) {
                        proteinIDs.push(jsonProteinList.collection[i]["@id"]);
                        console.log(jsonProteinList.collection[i]["@id"]);
                    }

                    var proteinIDFunction = function (proteinIDCnt) {
                        var endpointproteinOLS = abiOntoEndpoint + "/pr/terms?iri=" + proteinIDs[proteinIDCnt];
                        sendGetRequest(
                            endpointproteinOLS,
                            function (jsonProtein) {
                                var endpointgeneOLS;
                                if (jsonProtein._embedded.terms[0]._links.has_gene_template != undefined)
                                    endpointgeneOLS = jsonProtein._embedded.terms[0]._links.has_gene_template.href;
                                else
                                    endpointgeneOLS = abiOntoEndpoint + "/pr";

                                sendGetRequest(
                                    endpointgeneOLS,
                                    function (jsonGene) {
                                        var endpointspeciesOLS;
                                        if (jsonProtein._embedded.terms[0]._links.only_in_taxon != undefined)
                                            endpointspeciesOLS = jsonProtein._embedded.terms[0]._links.only_in_taxon.href;
                                        else
                                            endpointspeciesOLS = abiOntoEndpoint + "/pr";

                                        sendGetRequest(
                                            endpointspeciesOLS,
                                            function (jsonSpecies) {
                                                // species
                                                if (jsonSpecies._embedded == undefined)
                                                    speciesNames.push("Not Found"); // Or undefined
                                                else
                                                    speciesNames.push(jsonSpecies._embedded.terms[0].label);

                                                // gene
                                                if (jsonGene._embedded == undefined)
                                                    geneNames.push("Not Found"); // Or undefined
                                                else {
                                                    var geneName = jsonGene._embedded.terms[0].label;
                                                    geneName = geneName.slice(0, geneName.indexOf("(") - 1);
                                                    geneNames.push(geneName); // Or undefined
                                                }

                                                // protein
                                                if (jsonProtein._embedded == undefined)
                                                    proteinNames.push("Not Found"); // Or undefined
                                                else {
                                                    var proteinName = jsonProtein._embedded.terms[0].label;
                                                    proteinName = proteinName.slice(0, proteinName.indexOf("(") - 1);
                                                    proteinNames.push(proteinName);
                                                }

                                                if (proteinIDCnt == proteinIDs.length - 1) {
                                                    mainUtils.showProteinIDs(proteinIDs, proteinNames, speciesNames, geneNames);
                                                    return;
                                                }

                                                proteinIDCnt++;
                                                proteinIDFunction(proteinIDCnt); // callback
                                            },
                                            true);
                                    },
                                    true);
                            },
                            true);
                    }
                    proteinIDFunction(0); // first call
                },
                true
            );
        }
    });

    // ADD MODAL WINDOW
    var AddModal = function (options) {

        console.log("Add Modal function");

        var $this = this;

        options = options ? options : {};
        $this.options = {};
        $this.options.header = options.header !== undefined ? options.header : false;
        $this.options.footer = options.footer !== undefined ? options.footer : false;
        $this.options.closeButton = options.closeButton !== undefined ? options.closeButton : true;
        $this.options.footerCloseButton = options.footerCloseButton !== undefined ? options.footerCloseButton : false;
        $this.options.footerSaveButton = options.footerSaveButton !== undefined ? options.footerSaveButton : false;
        $this.options.id = options.id !== undefined ? options.id : "myAddModel";

        /**
         * Append modal window html to body
         */
        $this.createModal = function () {
            $('body').append('<div id="' + $this.options.id + '" class="modal fade"></div>');
            $($this.selector).append('<div class="modal-dialog custom-modal"><div class="modal-content"></div></div>');
            var win = $('.modal-content', $this.selector);

            var someText = "Retrieving protein identifiers from Bioportal \n" +
                "and then looking at the Auckland OLS to get protein names, \n" +
                "species and gene names by utilizing the protein identifiers!";

            var headerHtml = '<div class="modal-header">' +
                '<h4 class="modal-title" data-toggle="tooltip" data-placement="right" title="' + someText + '" lang="de">' +
                '</h4></div>';

            if ($this.options.header) {
                // win.append('<div class="modal-header"><h4 class="modal-title" lang="de"></h4></div>');
                win.append(headerHtml);

                if ($this.options.closeButton) {
                    win.find('.modal-header').prepend('<button type="button" ' +
                        'class="close" data-dismiss="modal">&times;</button>');
                }
            }

            win.append('<div class="modal-body"></div>');
            if ($this.options.footer) {
                win.append('<div class="modal-footer"></div>');

                if ($this.options.footerCloseButton) {
                    win.find('.modal-footer').append('<a data-dismiss="modal" id="addModelcloseID" href="#" ' +
                        'class="btn btn-default" lang="de">' + $this.options.footerCloseButton + '</a>');
                }

                if ($this.options.footerSaveButton) {
                    win.find('.modal-footer').append('<a data-dismiss="modal" id="addModelsaveID" href="#" ' +
                        'class="btn btn-default" lang="de">' + $this.options.footerSaveButton + '</a>');
                }
            }

            // close button clicked!
            $("#addModelcloseID").click(function (event) {
                return;
            });

            // save button clicked!
            $("#addModelsaveID").click(function (event) {
                for (var i = 0; i < $("#addModelTableID input").length; i++) {
                    if ($("#addModelTableID input")[i].checked) {
                        for (var j = 0; j < $("#addModelTableID tbody tr td").length; j = j + 4) {
                            if (i == 0) {
                                proteinVal = $("#addModelTableID tbody tr td input")[i].id;
                                $("#proteinTxt").val($("#addModelTableID tbody tr td")[i + 1].innerText);
                                $("#speciesTxt").val($("#addModelTableID tbody tr td")[i + 2].innerText);
                                $("#geneTxt").val($("#addModelTableID tbody tr td")[i + 3].innerText);
                                break;
                            }
                            else {
                                proteinVal = $("#addModelTableID tbody tr td input")[i].id;
                                $("#proteinTxt").val($("#addModelTableID tbody tr td")[i + 3 * i + 1].innerText);
                                $("#speciesTxt").val($("#addModelTableID tbody tr td")[i + 3 * i + 2].innerText);
                                $("#geneTxt").val($("#addModelTableID tbody tr td")[i + 3 * i + 3].innerText);
                                break;
                            }
                        }
                    }
                }
                return;
            });
        };

        /**
         * Set header text. It makes sense only if the options.header is logical true.
         * @param {String} html New header text.
         */
        $this.setHeader = function (html) {
            $this.window.find(".modal-title").html(html);
        };

        /**
         * Set body HTML.
         * @param {String} html New body HTML
         */
        $this.setBody = function (html) {
            $this.window.find(".modal-body").html(html);
        };

        /**
         * Set footer HTML.
         * @param {String} html New footer HTML
         */
        $this.setFooter = function (html) {
            $this.window.find(".modal-footer").html(html);
        };

        /**
         * Return window body element.
         * @returns {jQuery} The body element
         */
        $this.getBody = function () {
            return $this.window.find(".modal-body");
        };

        /**
         * Show modal window
         */
        $this.show = function () {
            $this.window.modal("show");
        };

        /**
         * Hide modal window
         */
        $this.hide = function () {
            $this.window.modal("hide");
        };

        /**
         * Toggle modal window
         */
        $this.toggle = function () {
            $this.window.modal("toggle");
        };

        $this.selector = "#" + $this.options.id;
        if (!$($this.selector).length) {
            $this.createModal();
        }

        $this.window = $($this.selector);
        $this.setHeader($this.options.header);
    };

    // RDF for concentration
    var concentrationRDF = function (xmlDoc, propCnt, entCnt, flux, fluxval, soluteFlux, soluteFluxval) {
        var entComp, variableName;
        if ("http://purl.obolibrary.org/obo/" + fluxval == luminalID) {
            entComp = 0;
            variableName = "C_m_" + soluteFlux;
        }
        else if ("http://purl.obolibrary.org/obo/" + fluxval == cytosolID) {
            entComp = 1;
            variableName = "C_c_" + soluteFlux;
        }
        else if ("http://purl.obolibrary.org/obo/" + fluxval == interstitialID) {
            entComp = 2;
            variableName = "C_s_" + soluteFlux;
        }

        var rdfDescription = xmlDoc.createElement("rdf:Description");
        rdfDescription.setAttribute("rdf:about", "#modelComp." + variableName);

        var semsimIsComputationalComponentFor = xmlDoc.createElement("semsim:isComputationalComponentFor");
        var dctermsDescription = xmlDoc.createElement("dcterms:description");
        var newText = xmlDoc.createTextNode("Concentration of " + soluteFlux + " in the " + flux + " compartment");
        dctermsDescription.appendChild(newText);

        var rdfDescriptionProp = xmlDoc.createElement("rdf:Description");
        rdfDescriptionProp.setAttribute("rdf:about", "#property_" + propCnt);
        var semsimPhysicalPropertyOf = xmlDoc.createElement("semsim:physicalPropertyOf");
        var semsimHasPhysicalDefinition3 = xmlDoc.createElement("semsim:hasPhysicalDefinition");
        semsimHasPhysicalDefinition3.setAttribute("rdf:resource", "http://identifiers.org/opb/OPB_00340");
        var rdfDescriptionEntity = xmlDoc.createElement("rdf:Description");
        rdfDescriptionEntity.setAttribute("rdf:about", "#entity_" + entCnt);

        var roPartOf = xmlDoc.createElement("ro:part_of");
        var rdfDescriptionEntity2 = xmlDoc.createElement("rdf:Description");
        rdfDescriptionEntity2.setAttribute("rdf:about", "#entity_" + entComp);
        var semsimHasPhysicalDefinition = xmlDoc.createElement("semsim:hasPhysicalDefinition");
        semsimHasPhysicalDefinition.setAttribute("rdf:resource", "http://purl.obolibrary.org/obo/" + fluxval);
        var semsimHasPhysicalDefinition2 = xmlDoc.createElement("semsim:hasPhysicalDefinition");
        semsimHasPhysicalDefinition2.setAttribute("rdf:resource", "http://purl.obolibrary.org/obo/" + soluteFluxval);

        rdfDescriptionEntity2.appendChild(semsimHasPhysicalDefinition);
        roPartOf.appendChild(rdfDescriptionEntity2);
        rdfDescriptionEntity.appendChild(roPartOf);
        rdfDescriptionEntity.appendChild(semsimHasPhysicalDefinition2);
        semsimPhysicalPropertyOf.appendChild(rdfDescriptionEntity);
        rdfDescriptionProp.appendChild(semsimPhysicalPropertyOf);
        rdfDescriptionProp.appendChild(semsimHasPhysicalDefinition3);
        semsimIsComputationalComponentFor.appendChild(rdfDescriptionProp);
        rdfDescription.appendChild(semsimIsComputationalComponentFor);
        rdfDescription.appendChild(dctermsDescription);

        var element = xmlDoc.getElementsByTagName("rdf:Description")[0];
        element.parentNode.insertBefore(rdfDescription, element.nextSibling);
    }

    // RDF for flux
    var fluxRDF = function (xmlDoc, coTransCnt, propCnt, srcEntCnt, snkEntCnt, processCnt, sourceCnt, sinkCnt, mediatorCnt,
                            mediatorCnt2, soluteFlux, soluteFluxval, sourceFlux, sourceFluxval,
                            sinkFlux, sinkFluxval, mediatorFlux, mediatorFluxval, proteinName, proteinVal) {
        var entMedComp, entMedPrComp = 5;
        var variableName = "J_" + soluteFlux;

        if ("http://purl.obolibrary.org/obo/" + mediatorFluxval == apicalID)
            entMedComp = 3;
        else if ("http://purl.obolibrary.org/obo/" + mediatorFluxval == basolateralID)
            entMedComp = 4;

        var rdfDescription = xmlDoc.createElement("rdf:Description");
        rdfDescription.setAttribute("rdf:about", "#modelComp." + variableName);
        var semsimIsComputationalComponentFor = xmlDoc.createElement("semsim:isComputationalComponentFor");
        var rdfDescription2 = xmlDoc.createElement("rdf:Description");
        rdfDescription2.setAttribute("rdf:about", "#Property_" + propCnt);
        var semsimPhysicalProperyOf = xmlDoc.createElement("semsim:physicalPropertyOf");
        var semsimHasPhysicalDefinition0 = xmlDoc.createElement("semsim:hasPhysicalDefinition");
        semsimHasPhysicalDefinition0.setAttribute("rdf:resource", "http://identifiers.org/opb/OPB_00593");
        var rdfDescription3 = xmlDoc.createElement("rdf:Description");
        rdfDescription3.setAttribute("rdf:about", "#process_" + processCnt);
        rdfDescription3.setAttribute("dcterms:description", "");

        // mediator participant
        if (coTransCnt == 1) {
            // mediator participant PR
            var semsimHasMediatorParticipant = xmlDoc.createElement("semsim:hasMediatorParticipant");
            var rdfDescription4 = xmlDoc.createElement("rdf:Description");
            rdfDescription4.setAttribute("rdf:about", "#mediator_" + mediatorCnt2);
            var semsimHasPhysicalEntityReference = xmlDoc.createElement("semsim:hasPhysicalEntityReference");
            var rdfDescription5 = xmlDoc.createElement("rdf:Description");
            rdfDescription5.setAttribute("rdf:about", "#entity_" + entMedPrComp);
            var semsimHasPhysicalDefinition = xmlDoc.createElement("semsim:hasPhysicalDefinition");
            semsimHasPhysicalDefinition.setAttribute("rdf:resource", proteinVal);
            rdfDescription5.appendChild(semsimHasPhysicalDefinition);
            semsimHasPhysicalEntityReference.appendChild(rdfDescription5);
            rdfDescription4.appendChild(semsimHasPhysicalEntityReference);
            semsimHasMediatorParticipant.appendChild(rdfDescription4);
            rdfDescription3.appendChild(semsimHasMediatorParticipant);

            // mediator participant FMA
            var semsimHasMediatorParticipant2 = xmlDoc.createElement("semsim:hasMediatorParticipant");
            var rdfDescription4 = xmlDoc.createElement("rdf:Description");
            rdfDescription4.setAttribute("rdf:about", "#mediator_" + mediatorCnt);
            var semsimHasPhysicalEntityReference = xmlDoc.createElement("semsim:hasPhysicalEntityReference");
            var rdfDescription5 = xmlDoc.createElement("rdf:Description");
            rdfDescription5.setAttribute("rdf:about", "#entity_" + entMedComp);
            var semsimHasPhysicalDefinition = xmlDoc.createElement("semsim:hasPhysicalDefinition");
            semsimHasPhysicalDefinition.setAttribute("rdf:resource", "http://purl.obolibrary.org/obo/" + mediatorFluxval);
            rdfDescription5.appendChild(semsimHasPhysicalDefinition);
            semsimHasPhysicalEntityReference.appendChild(rdfDescription5);
            rdfDescription4.appendChild(semsimHasPhysicalEntityReference);
            semsimHasMediatorParticipant2.appendChild(rdfDescription4);
            rdfDescription3.appendChild(semsimHasMediatorParticipant2);
        }
        else if (coTransCnt == 2) {
            // mediator participant PR
            var semsimHasMediatorParticipant = xmlDoc.createElement("semsim:hasMediatorParticipant");
            var rdfDescription4 = xmlDoc.createElement("rdf:Description");
            rdfDescription4.setAttribute("rdf:about", "#mediator_" + mediatorCnt2);
            var semsimHasPhysicalEntityReference = xmlDoc.createElement("semsim:hasPhysicalEntityReference");
            semsimHasPhysicalEntityReference.setAttribute("rdf:resource", "#entity_" + entMedPrComp);
            rdfDescription4.appendChild(semsimHasPhysicalEntityReference);
            semsimHasMediatorParticipant.appendChild(rdfDescription4);
            rdfDescription3.appendChild(semsimHasMediatorParticipant);

            // mediator participant FMA
            var semsimHasMediatorParticipant2 = xmlDoc.createElement("semsim:hasMediatorParticipant");
            var rdfDescription4 = xmlDoc.createElement("rdf:Description");
            rdfDescription4.setAttribute("rdf:about", "#mediator_" + mediatorCnt);
            var semsimHasPhysicalEntityReference = xmlDoc.createElement("semsim:hasPhysicalEntityReference");
            semsimHasPhysicalEntityReference.setAttribute("rdf:resource", "#entity_" + entMedComp);
            rdfDescription4.appendChild(semsimHasPhysicalEntityReference);
            semsimHasMediatorParticipant2.appendChild(rdfDescription4);
            rdfDescription3.appendChild(semsimHasMediatorParticipant2);
        }

        // sink participant
        var semsimHasSinkParticipant = xmlDoc.createElement("semsim:hasSinkParticipant");
        var rdfDescription4 = xmlDoc.createElement("rdf:Description");
        rdfDescription4.setAttribute("rdf:about", "#sink_" + sinkCnt);
        rdfDescription4.setAttribute("semsim:hasMultiplier", "1.0");
        var semsimHasPhysicalEntityReference = xmlDoc.createElement("semsim:hasPhysicalEntityReference");
        semsimHasPhysicalEntityReference.setAttribute("rdf:resource", "#entity_" + snkEntCnt);
        rdfDescription4.appendChild(semsimHasPhysicalEntityReference);
        semsimHasSinkParticipant.appendChild(rdfDescription4);
        rdfDescription3.appendChild(semsimHasSinkParticipant);

        // source participant
        var semsimHasSourceParticipant = xmlDoc.createElement("semsim:hasSourceParticipant");
        var rdfDescription4 = xmlDoc.createElement("rdf:Description");
        rdfDescription4.setAttribute("rdf:about", "#source_" + sourceCnt);
        rdfDescription4.setAttribute("semsim:hasMultiplier", "1.0");
        var semsimHasPhysicalEntityReference = xmlDoc.createElement("semsim:hasPhysicalEntityReference");
        semsimHasPhysicalEntityReference.setAttribute("rdf:resource", "#entity_" + srcEntCnt);
        rdfDescription4.appendChild(semsimHasPhysicalEntityReference);
        semsimHasSourceParticipant.appendChild(rdfDescription4);
        rdfDescription3.appendChild(semsimHasSourceParticipant);

        // name
        var semsimName = xmlDoc.createElement("semsim:name");
        var newText = xmlDoc.createTextNode(soluteFlux + " flow through " + mediatorFlux);
        semsimName.appendChild(newText);
        rdfDescription3.appendChild(semsimName);

        semsimPhysicalProperyOf.appendChild(rdfDescription3);
        rdfDescription2.appendChild(semsimPhysicalProperyOf);
        rdfDescription2.appendChild(semsimHasPhysicalDefinition0);
        semsimIsComputationalComponentFor.appendChild(rdfDescription2);
        rdfDescription.appendChild(semsimIsComputationalComponentFor);

        var dctermsDescription = xmlDoc.createElement("dcterms:description");
        var newText = xmlDoc.createTextNode("Flux of " + soluteFlux + " from " + sourceFlux + " to " + sinkFlux + " through " + mediatorFlux + " and " + proteinName);
        dctermsDescription.appendChild(newText);
        rdfDescription.appendChild(dctermsDescription);

        var element = xmlDoc.getElementsByTagName("rdf:Description")[0];
        element.parentNode.insertBefore(rdfDescription, element.nextSibling);
    }

    // Name of concentration and flux variable
    var conandfluxVariable = function (varCon, fluxval, soluteFlux, unit) {
        var variableName;
        if (unit == "flux")
            variableName = "J_" + soluteFlux;
        else {
            if ("http://purl.obolibrary.org/obo/" + fluxval == luminalID)
                variableName = "C_m_" + soluteFlux;
            else if ("http://purl.obolibrary.org/obo/" + fluxval == cytosolID)
                variableName = "C_c_" + soluteFlux;
            else if ("http://purl.obolibrary.org/obo/" + fluxval == interstitialID)
                variableName = "C_s_" + soluteFlux;
        }

        varCon.setAttribute("name", variableName);
        varCon.setAttribute("units", unit);
        varCon.setAttribute("interface", "public");
        varCon.setAttribute("id", "modelComp." + variableName);
    }

    // Create a CellML model
    mainUtils.createCellML = function () {
        var parser, xmlDoc;
        sendGetRequest(
            modelXML,
            function (str) {
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(str, "text/xml");

                // component
                var componentEle = xmlDoc.createElement("component");
                componentEle.setAttribute("name", "modelComp");

                // component: time variable
                var varTime = xmlDoc.createElement("variable");
                varTime.setAttribute("name", "time");
                varTime.setAttribute("units", "second");
                varTime.setAttribute("interface", "public");
                varTime.setAttribute("id", "modelComp.time");

                // component: concentration variable
                var varCon1 = xmlDoc.createElement("variable");
                conandfluxVariable(varCon1, sourceFlux1val, soluteFlux1, "mmol_per_cm3");
                var varCon2 = xmlDoc.createElement("variable");
                conandfluxVariable(varCon2, sinkFlux1val, soluteFlux1, "mmol_per_cm3");
                var varCon3 = xmlDoc.createElement("variable");
                conandfluxVariable(varCon3, sourceFlux2val, soluteFlux2, "mmol_per_cm3");
                var varCon4 = xmlDoc.createElement("variable");
                conandfluxVariable(varCon4, sinkFlux2val, soluteFlux2, "mmol_per_cm3");

                // component: flux variable
                var varFlux1 = xmlDoc.createElement("variable");
                conandfluxVariable(varFlux1, "", soluteFlux1, "flux");
                var varFlux2 = xmlDoc.createElement("variable");
                conandfluxVariable(varFlux2, "", soluteFlux2, "flux");

                // component: math section
                var mathEle = xmlDoc.createElement("math");
                mathEle.setAttribute("xmls", "http://www.w3.org/1998/Math/MathML");
                var mathText = xmlDoc.createTextNode("<!--Please fill out this section-->");
                mathEle.appendChild(mathText);

                componentEle.appendChild(varCon1);
                componentEle.appendChild(varCon2);
                componentEle.appendChild(varCon3);
                componentEle.appendChild(varCon4);
                componentEle.appendChild(varFlux1);
                componentEle.appendChild(varFlux2);
                componentEle.appendChild(varTime);
                componentEle.appendChild(mathEle);

                var element = xmlDoc.getElementsByTagName("component")[0];
                element.parentNode.insertBefore(componentEle, element.nextSibling);

                // connection
                var connectionEle = xmlDoc.createElement("connection");
                var connectionText = xmlDoc.createTextNode("<!--Please fill out this section-->");
                connectionEle.appendChild(connectionText);

                var element = xmlDoc.getElementsByTagName("component")[1];
                element.parentNode.insertBefore(connectionEle, element.nextSibling);

                // RDF for concentration
                var propCnt = -1, entCnt = 5, srcEntCnt1, snkEntCnt1, srcEntCnt2, snkEntCnt2;
                srcEntCnt1 = ++entCnt;
                concentrationRDF(xmlDoc, ++propCnt, srcEntCnt1, sourceFlux1, sourceFlux1val, soluteFlux1, soluteFlux1val);
                snkEntCnt1 = ++entCnt;
                concentrationRDF(xmlDoc, ++propCnt, snkEntCnt1, sinkFlux1, sinkFlux1val, soluteFlux1, soluteFlux1val);
                srcEntCnt2 = ++entCnt;
                concentrationRDF(xmlDoc, ++propCnt, srcEntCnt2, sourceFlux2, sourceFlux2val, soluteFlux2, soluteFlux2val);
                snkEntCnt2 = ++entCnt;
                concentrationRDF(xmlDoc, ++propCnt, snkEntCnt2, sinkFlux2, sinkFlux2val, soluteFlux2, soluteFlux2val);

                // RDF for protein and compartment
                var rdfDescription = xmlDoc.createElement("rdf:Description");
                rdfDescription.setAttribute("rdf:about", "#model");
                var roModelOf = xmlDoc.createElement("ro:modelOf");
                roModelOf.setAttribute("rdf:resource", proteinVal);
                rdfDescription.appendChild(roModelOf);
                for (var i = 0; i < compartmentVal.split(",").length; i++) {
                    var roCompartmentOf = xmlDoc.createElement("ro:compartmentOf");
                    roCompartmentOf.setAttribute("rdf:resource", "http://purl.obolibrary.org/obo/" + compartmentVal.split(",")[i]);
                    rdfDescription.appendChild(roCompartmentOf);
                }
                var element = xmlDoc.getElementsByTagName("rdf:Description")[0];
                element.parentNode.insertBefore(rdfDescription, element.nextSibling);

                // RDF for flux
                var processCnt = -1, sourceCnt = -1, sinkCnt = -1, mediatorCnt = -1, coTransCnt = 1;
                mediatorCnt = mediatorCnt + 1;
                var mediatorCnt2 = mediatorCnt + 1;
                fluxRDF(xmlDoc, coTransCnt, ++propCnt, srcEntCnt1, snkEntCnt1, ++processCnt, ++sourceCnt, ++sinkCnt,
                    mediatorCnt, mediatorCnt2, soluteFlux1, soluteFlux1val, sourceFlux1, sourceFlux1val,
                    sinkFlux1, sinkFlux1val, mediatorFlux1, mediatorFlux1val, $("#proteinTxt").val(), proteinVal);

                mediatorCnt = mediatorCnt2 + 1;
                var mediatorCnt2 = mediatorCnt + 1;
                fluxRDF(xmlDoc, ++coTransCnt, ++propCnt, srcEntCnt2, snkEntCnt2, ++processCnt, ++sourceCnt, ++sinkCnt,
                    mediatorCnt, mediatorCnt2, soluteFlux2, soluteFlux2val, sourceFlux2, sourceFlux2val,
                    sinkFlux2, sinkFlux2val, mediatorFlux2, mediatorFlux2val, $("#proteinTxt").val(), proteinVal);

                console.log(xmlDoc);

                var xmlText = new XMLSerializer().serializeToString(xmlDoc);
                var uri = 'data:application/xml;charset=utf-8,' + xmlText;

                var downloadLink = document.createElement("a");
                downloadLink.href = uri;
                downloadLink.download = "model.xml";

                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            },
            false);
    }

    // ADD MODEL: show proteins from bioportal
    mainUtils.showProteinIDs = function (proteinIDs, proteinNames, speciesNames, geneNames) {
        // Reinitialize for a new search result
        $("#addModalBody").html("");

        var table = $("<table id='addModelTableID'/>").addClass("table table-hover table-condensed"); //table-bordered table-striped

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
        for (var i in proteinIDs) {
            var temp = [];
            tr = $("<tr/>");
            // temp.push(proteinIDs[i], proteinNames[i], speciesNames[i], geneNames[i]);
            temp.push(proteinNames[i], speciesNames[i], geneNames[i]);

            for (var j in temp) {
                if (j == 0) {
                    tr.append($("<td/>")
                        .append($("<label/>")
                            .html("<input id=" + proteinIDs[i] + " uri=" + proteinIDs[i] + " type=checkbox " +
                                "data-action=search value=" + proteinIDs[i] + " + class=checkbox>")));
                }

                if (j == 1)
                    tr.append($("<td/>").append(temp[j]));
                else
                    tr.append($("<td/>").append(temp[j]));
            }

            tbody.append(tr);
        }

        table.append(tbody);
        // $("#proteinList").append(table);

        $("#addModalBody")
            .append(table);

        console.log("outside addModalBody!");
    }

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

    // ADD MODEL
    mainUtils.loadAddmodelHtml = function () {
        sendGetRequest(
            addmodelHtml,
            function (addmodelHtmlContent) {
                $("#main-content").html(addmodelHtmlContent);
            },
            false);
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
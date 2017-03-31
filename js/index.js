/**
 * Created by dsar941 on 9/8/2016.
 * TODO: OPTIMIZE CODE
 * TODO: OPTIMIZE CODE
 * TODO: OPTIMIZE CODE
 */
(function (global) {
    'use strict';

    var endpoint = "https://models.physiomeproject.org/pmr2_virtuoso_search";

    var viewHtml = "snippets/view.html";
    var modelHtml = "snippets/model.html";
    var searchHtml = "snippets/search.html";
    var svgmodelHtml = "snippets/svgmodel.html";
    var svgepithelialHtml = "snippets/svgepithelial.html";

    // Set up a namespace for our utility
    var mainUtils = {};

    // delete operation
    var templistOfModel = [];

    // selected models in load models
    var model = [], model2DArray = [];

    var modelEntityName,
        modelEntityNameArray = [],
        modelEntityFullNameArray = [];

    var links = []; // svg visualization

    // process AJAX call
    var modelEntity = [],
        biologicalMeaning = [],
        speciesList = [],
        geneList = [],
        proteinList = [],
        head = [],
        id = 0;

    // Initial declarations for a table
    var table = document.createElement("table");
    table.className = "table";

    // Convenience function for inserting innerHTML for 'select'
    var insertHtml = function (selector, html) {
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    // Show loading icon inside element identified by 'selector'.
    var showLoading = function (selector) {
        var html = "<div class='text-center'>";
        html += "<img src='images/ajax-loader.gif'></div>";
        insertHtml(selector, html);
    };

    // Find the current active menu button
    var findActiveItem = function () {
        var classes = document.querySelector("#ulistItems");
        for (var i = 0; i < classes.getElementsByTagName("li").length; i++) {
            if (classes.getElementsByTagName("li")[i].className === "active")
                return classes.getElementsByTagName("li")[i].id;
        }
    };

    // Remove the class 'active' from source to target button
    var switchListItemToActive = function (source, target) {
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
        var activeItem = "#" + findActiveItem();
        switchListItemToActive(activeItem, "#listHome");

        insertHtml("#main-content", "... Coming soon");
    };

    mainUtils.loadHelp = function () {
        // Switch from current active button to home button
        var activeItem = "#" + findActiveItem();
        switchListItemToActive(activeItem, "#help");

        insertHtml("#main-content", "...Coming soon");
    };

    // On page load (before images or CSS)
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

    // Even invocation to SEARCH, MODEL
    document.addEventListener('click', function (event) {
        // If there's an action with the given name, call it
        if (typeof actions[event.srcElement.dataset.action] === "function") {
            actions[event.srcElement.dataset.action].call(this, event);
        }
    })

    // Load search html
    mainUtils.loadSearchHtml = function () {

        if (!sessionStorage.getItem("searchListContent")) {
            $ajaxUtils.sendGetRequest(
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
        var activeItem = "#" + findActiveItem();
        switchListItemToActive(activeItem, "#listDiscovery");
    };

    // Remove duplicate links
    function uniqueify(es) {
        var retval = [];
        es.forEach(function (e) {
            for (var j = 0; j < retval.length; j++) {
                if (retval[j].Model_entity === e.Model_entity &&
                    retval[j].Biological_meaning === e.Biological_meaning)

                    return;
            }
            retval.push(e);
        });
        return retval;
    }

    // TODO: make a common table platform for all functions
    // Show semantic annotation extracted from PMR
    mainUtils.searchList = function (head, modelEntity, biologicalMeaning, speciesList, geneList, proteinList) {

        var searchList = document.getElementById("searchList");

        // Search result does not match
        if (head.length == 0) {
            searchList.innerHTML = "<section class='container-fluid'><label><br>No Search Results!</label></section>";
            return;
        }

        // Make empty space for a new search
        searchList.innerHTML = "";

        var table = document.createElement("table");
        table.className = "table";

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

        // SET main content in the local storage
        var maincontent = document.getElementById('main-content');
        sessionStorage.setItem('searchListContent', $(maincontent).html());
    }

    // Utility function to extract species, gene, and protein names
    var parseModelName = function (modelEntity) {
        var indexOfHash = modelEntity.search("#");
        var modelName = modelEntity.slice(0, indexOfHash);

        return modelName;
    }

    // Process table headers
    var headTitle = function (jsonModel, jsonSpecies, jsonGene, jsonProtein) {
        var head = [];

        for (var i = 0; i < jsonModel.head.vars.length; i++)
            head.push(jsonModel.head.vars[i]);

        head.push(jsonSpecies.head.vars[0]);
        head.push(jsonGene.head.vars[0]);
        head.push(jsonProtein.head.vars[0]);

        return head;
    }

    mainUtils.searchListAJAX = function (modelEntityid, speciesListid, geneListid, proteinListid) {

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

        mainUtils.searchListAJAXObj = function () {
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
                    // End of Parsing

                    for (var m = 0; m < jsonModelObj.length; m++) {
                        modelEntity.push(jsonModelObj[m].Model_entity);
                        biologicalMeaning.push(jsonModelObj[m].Biological_meaning);
                        speciesList.push(speciesListid);
                        geneList.push(geneListid);
                        proteinList.push(proteinListid);
                    }

                    mainUtils.searchList(
                        head,
                        modelEntity,
                        biologicalMeaning,
                        speciesList,
                        geneList,
                        proteinList);

                    // No search results found, so sent empty arrays
                    if (!jsonModelObj.length) {
                        console.log("No search results found in searchListAJAX", jsonModelObj.length);
                        mainUtils.searchList(
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

        mainUtils.searchListAJAXObj(); // callback
    }

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

            mainUtils.addEventListener(uriOPB, uriCHEBI, keyValue);
        }
    });

    mainUtils.addEventListener = function (uriOPB, uriCHEBI, keyValue) {

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
                                        mainUtils.searchListAJAX(
                                            modelEntity[len - 1],
                                            speciesList[len - 1],
                                            geneList[len - 1],
                                            proteinList[len - 1]);

                                        // show search results
                                        mainUtils.searchList(
                                            head,
                                            modelEntity,
                                            biologicalMeaning,
                                            speciesList,
                                            geneList,
                                            proteinList);

                                        id++; // increment index of modelEntity
                                        mainUtils.addEventListener(uriOPB, uriCHEBI, keyValue); // callback
                                    },
                                    true);
                            },
                            true);
                    },
                    true);
            },
            true);
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
        $ajaxUtils.sendPostRequest(
            endpoint,
            query,
            function (jsonObj) {
                $ajaxUtils.sendGetRequest(
                    viewHtml,
                    function (viewHtmlContent) {
                        insertHtml("#main-content", viewHtmlContent);
                        $ajaxUtils.sendPostRequest(endpoint, query, mainUtils.showView, true);
                    },
                    false);
            },
            true);
    };

    // Create anchor tag
    var createAnchor = function (value) {
        var aText = document.createElement('a');
        aText.setAttribute('href', value);
        aText.setAttribute('target', "_blank");
        aText.innerHTML = value;
        return aText;
    };

    // Find duplicate items
    var searchFn = function (searchItem, arrayOfItems) {
        var counter = 0;
        for (var i = 0; i < arrayOfItems.length; i++) {
            if (arrayOfItems[i] == searchItem)
                counter++;
        }

        return counter;
    };

    // Show a selected entry from search results
    mainUtils.showView = function (jsonObj, viewHtmlContent) {

        var viewList = document.getElementById("viewList");

        for (var i = 0; i < jsonObj.head.vars.length; i++) {
            var divHead = document.createElement("div");
            divHead.className = "h2";

            var divText = document.createElement("div");
            divText.className = "p";

            divHead.appendChild(document.createTextNode(jsonObj.head.vars[i]));
            divHead.appendChild(document.createElement("hr"));
            viewList.appendChild(divHead);

            var tempArrayOfURL = [];
            var tempArray = [];

            // IF more than one result in the JSON object
            for (var j = 0; j < jsonObj.results.bindings.length; j++) {
                var tempValue = jsonObj.results.bindings[j][jsonObj.head.vars[i]].value;

                // TODO: regular expression to validate a URL
                if (tempValue.indexOf("http") != -1) {
                    var aText = createAnchor(tempValue);
                    tempArrayOfURL.push(tempValue);
                    if (searchFn(tempValue, tempArrayOfURL) <= 1)
                        divText.appendChild(aText);
                }
                else {
                    tempArray.push(tempValue);
                    if (searchFn(tempValue, tempArray) <= 1)
                        divText.appendChild(document.createTextNode(tempValue));
                }

                viewList.appendChild(divText);

                var divText = document.createElement("div");
                divText.className = "p";
            }
        }
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
        $ajaxUtils.sendGetRequest(
            modelHtml,
            function (modelHtmlContent) {
                insertHtml("#main-content", modelHtmlContent);

                $ajaxUtils.sendPostRequest(endpoint, query, mainUtils.showModel, true);
            },
            false);

        // Switch from current active button to models button
        var activeItem = "#" + findActiveItem();
        switchListItemToActive(activeItem, "#listModels");
    };

    // Show selected items in a table
    mainUtils.showModel = function (jsonObj) {

        console.log("showModel: ", jsonObj);

        var modelList = document.getElementById("modelList");

        var table = document.createElement("table");
        table.className = "table";

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

    mainUtils.loadSVGModelHtml = function () {

        $ajaxUtils.sendGetRequest(
            svgmodelHtml,
            function (svgmodelHtmlContent) {
                insertHtml("#main-content", svgmodelHtmlContent);

                $ajaxUtils.sendGetRequest(svgmodelHtml, mainUtils.showSVGModelHtml, false);
            },
            false);
    }

    mainUtils.showSVGModelHtml = function (svgmodelHtmlContent) {

        console.log("visualization in model2DArr: ", model2DArray);
        console.log("visualization in templistOfModel: ", templistOfModel);

        // remove duplicate
        modelEntityNameArray = modelEntityNameArray.filter(function (item, pos) {
            return modelEntityNameArray.indexOf(item) == pos;
        })

        console.log("visualization in modelEntityNameArray: ", modelEntityNameArray);

        for (var ix = 0; ix < modelEntityNameArray.length; ix++) {
            for (var i = 0; i < model2DArray.length; i++) {
                if (modelEntityNameArray[ix] == model2DArray[i][1]) {
                    for (var j = 2; j < model2DArray[i].length; j++) {

                        var name;
                        if (j == 2) name = "Protein";
                        if (j == 3) name = "Species";
                        if (j == 4) name = "Gene";
                        if (j == 5) name = "Compartment";

                        links.push({
                            source: model2DArray[i][1],
                            target: model2DArray[i][j],
                            name: name
                        });
                    }
                }
            }
        }

        // Remove duplicate links
        function uniqueify(es) {
            var retval = [];
            es.forEach(function (e) {
                for (var j = 0; j < retval.length; j++) {
                    if (retval[j].source === e.source && retval[j].target === e.target)
                        return;
                }
                retval.push(e);
            });
            return retval;
        }

        links = uniqueify(links);

        var nodes = {};

        // Compute distinct nodes from the links.
        links.forEach(function (link) {
            link.source = nodes[link.source] ||
                (nodes[link.source] = {name: link.source});

            link.target = nodes[link.target] ||
                (nodes[link.target] = {name: link.target});
        });

        // Making edges ...
        console.log("nodes: ", nodes);
        console.log("links: ", links);

        // SVG graph
        var g = document.getElementById("#svgVisualize2"),
            width = 1200,
            height = 700;

        var svg = d3.select("#svgVisualize2").append("svg")
            .attrs({
                "width": width,
                "height": height
            })
            .append("g");

        var color = d3.scaleOrdinal(d3.schemeCategory20);

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) {
                return d.name;
            }))
            .force("charge", d3.forceManyBody().strength(-100))
            .force("center", d3.forceCenter(width / 3, height / 2))
            .force("link", d3.forceLink().distance(100).strength(0.1));

        //build the arrow.
        svg.append("svg:defs").selectAll("marker")
            .data(["end"])      // Different link/path types can be defined here
            .enter().append("svg:marker")    // This section adds in the arrows
            .attrs({
                "id": String,
                "viewBox": "0 -5 10 10",
                "refX": 15,
                "refY": -1.5,
                "markerWidth": 4,
                "markerHeight": 4,
                "orient": "auto"
            })
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");

        // label edges with different color
        var edgelabels = ["Protein", "Species", "Gene", "Compartment"];
        var py = 20;

        // add the links and the arrows
        var link = svg.append("svg:g").selectAll("path")
            .data(links)
            .enter().append("svg:path")
            .attr("class", "pathlink")
            .style("stroke", function (d) {
                for (var i = 0; i < edgelabels.length; i++) {
                    if (d.name == edgelabels[i]) {
                        svg.append("text")
                            .style("font", "14px sans-serif")
                            .attr("stroke", color(d.name))
                            .attr("x", 10)
                            .attr("y", py)
                            .text(d.name);

                        //increment to get distinct color
                        color(d.name + 1);
                        py = py + 20;
                        edgelabels[i] = "";
                        break;
                    }
                }

                return color(d.name);
            })
            .attr("marker-end", "url(#end)");

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(d3.values(nodes))
            .enter().append("g")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("circle")
            .attr("r", 7)
            .styles({
                "fill": function (d) {
                    if (modelEntityNameArray.indexOf(d.name) != -1) {
                        return "red";
                    }
                },
                "r": function (d) {
                    if (modelEntityNameArray.indexOf(d.name) != -1) {
                        return 10;
                    }
                }
            })

        // add the text
        node.append("text")
            .attrs({
                "x": 12,
                "dy": ".35em"
            })
            .text(function (d) {
                return d.name;
            });

        simulation
            .nodes(d3.values(nodes))
            .on("tick", tick);

        simulation.force("link")
            .links(links);

        // add the curvy lines
        function tick() {
            link.attr("d", function (d) {

                // Total difference in x and y from source to target
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y;

                // Length of path from center of source node to center of target node
                var dr = Math.sqrt(dx * dx + dy * dy);

                return "M" +
                    d.source.x + "," +
                    d.source.y + "A" +
                    dr + "," + dr + " 0 0,1 " +
                    d.target.x + "," +
                    d.target.y;
            });

            node.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        }

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        // Empty list
        modelEntityNameArray = [];
    }

    // Load Ontology Lookup Service
    mainUtils.loadOLS = function () {
        //FMA:70973 Epithelial cell of proximal tubule
        //FMA:17693 Proximal convoluted tubule
        //FMA:17716 Proximal straight tubule
        //FMA:84666 Apical plasma membrane

        // var endpointOLS = "http://www.ebi.ac.uk/ols/api/ontologies/fma/terms?iri=http://purl.obolibrary.org/obo/FMA_17693";
        var endpointOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/fma/terms?iri=http://purl.org/sig/ont/fma/fma17693";

        $ajaxUtils.sendGetRequest(endpointOLS, mainUtils.showOLS, true);
    };

    mainUtils.showOLS = function (jsonObj) {
        console.log("OLS: ", jsonObj);
        console.log("OLS Label: ", jsonObj._embedded.terms[0].label);

        // ebi EMBL
        // console.log("OLS Synonyms: ", jsonObj._embedded.terms[0].synonyms);

        // Auckland OLS
        console.log("OLS annotation: ", jsonObj._embedded.terms[0].annotation);
        console.log("OLS FMAID: ", jsonObj._embedded.terms[0].annotation.FMAID);
        console.log("OLS preferred name: ", jsonObj._embedded.terms[0].annotation["preferred name"]);
        console.log("OLS synonym: ", jsonObj._embedded.terms[0].annotation.synonym);
        console.log("OLS Synonyms: ", jsonObj._embedded.terms[0].synonyms);
    };

    mainUtils.loadEpithelialHtml = function () {

        $ajaxUtils.sendGetRequest(
            svgepithelialHtml,
            function (epithelialHtmlContent) {
                insertHtml("#main-content", epithelialHtmlContent);

                $ajaxUtils.sendGetRequest(svgepithelialHtml, mainUtils.showEpithelial, false);
            },
            false);
    }

    mainUtils.solutesBouncing = function (newg, solutes) {

        var m = 10,
            maxSpeed = 1,
            color = d3.scaleOrdinal(d3.schemeCategory20).domain(d3.range(m));

        var nodes = [];

        for (var i = 0; i < solutes.length; i++) {
            nodes.push({
                text: solutes[i].value,
                color: color(Math.floor(Math.random() * m)),
                x: solutes[i].xrect + (Math.random() * (solutes[i].width - solutes[i].xrect)),
                y: solutes[i].yrect + (Math.random() * (solutes[i].height - solutes[i].yrect)),
                speedX: Math.random() * maxSpeed,
                speedY: Math.random() * maxSpeed,
                xrect: solutes[i].xrect,
                yrect: solutes[i].yrect,
                width: solutes[i].width,
                height: solutes[i].height,
                length: solutes[i].length
            });
        }

        console.log(nodes);

        var simulation = d3.forceSimulation()
            .force("charge", d3.forceManyBody().strength(0))
            .force("gravity", d3.forceManyBody().strength(0));

        var text = newg.append("g").selectAll("text")
            .data(nodes)
            .enter().append("text")
            .attr("x", function (d) {
                return d.x;
            })
            .attr("y", function (d) {
                return d.y;
            })
            .style("fill", function (d) {
                return d.color;
            })
            .text(function (d) {
                return d.text;
            });

        simulation
            .nodes(nodes)
            .on("tick", tick);

        function tick(e) {
            simulation.alpha(0.1);
            text
                .each(gravity())
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                });
        }

        function gravity() {
            return function (d) {
                // TODO: approximate solution, fix this later
                if (d.x <= d.xrect) d.speedX = Math.abs(d.speedX); // each char is 6.5 unit
                if (d.x + d.length + 6.5 * 2 >= d.xrect + d.width) d.speedX = -1 * Math.abs(d.speedX);
                if (d.y - 6.5 * 2 <= d.yrect) d.speedY = -1 * Math.abs(d.speedY); // assuming 2 char equiv to height
                if (d.y >= d.yrect + d.height) d.speedY = Math.abs(d.speedY);

                d.x = d.x + (d.speedX);
                d.y = d.y + (-1 * d.speedY);
            };
        }
    }

    // TODO: temp solution, fix this in svg
    function getTextWidth(text, fontSize, fontFace) {
        var a = document.createElement('canvas');
        var b = a.getContext('2d');
        b.font = fontSize + 'px ' + fontFace;
        return b.measureText(text).width;
    }

    mainUtils.showsvgEpithelial = function (concentration_fma, source_fma, sink_fma, finalapicalMembrane) {
        var apicalID = "http://identifiers.org/fma/FMA:84666";
        var serosalID = "http://identifiers.org/fma/FMA:84669";
        var luminalID = "http://identifiers.org/fma/FMA:74550";
        var cytosolID = "http://identifiers.org/fma/FMA:66836";
        var paracellularID = "paracellular";
        var interstitialID = "http://identifiers.org/fma/FMA:9673";

        var g = document.getElementById("#svgVisualize"),
            wth = 1200,
            hth = 900,
            width = 300,
            height = 400;

        var svg = d3.select("#svgVisualize").append("svg")
            .attr("width", wth)
            .attr("height", hth);

        var w = 800,
            h = 900;

        var newg = svg.append("g")
            .data([{x: w / 3, y: height / 3}]);

        // TODO: extend this with lines and circles
        var newgdefs = svg.append("g");
        newgdefs.append("defs")
            .append("pattern")
            .attr("id", "basicPattern")
            .attr("patternUnits", "userSpaceOnUse")
            .attr("width", 4)
            .attr("height", 4)
            .append("circle")
            .attr("cx", "0")
            .attr("cy", "0")
            .attr("r", "1.5")
            // .append("line")
            // .attr("x1", "0")
            // .attr("y1", "0")
            // .attr("x2", "4")
            // .attr("y2", "0")
            .attr("stroke", "#6495ED")
            .attr("stroke-width", 1.5);

        var dragrect = newg.append("rect")
            .attr("x", function (d) {
                return d.x;
            })
            .attr("y", function (d) {
                return d.y;
            })
            .attr("width", width)
            .attr("height", height)
            .attr("rx", 10)
            .attr("ry", 20)
            .attr("fill", "white")
            .attr("stroke", "url(#basicPattern)")
            .attr("stroke-width", 25)
            .attr("cursor", "move")
            .call(d3.drag()
                .on("drag", dragmove));

        var dragleft = newg.append("rect")
            .attr("x", function (d) {
                return d.x;
            })
            .attr("y", function (d) {
                return d.y;
            })
            .attr("height", height)
            .attr("fill-opacity", 0);

        var dragright = newg.append("rect")
            .attr("x", function (d) {
                return d.x + width;
            })
            .attr("y", function (d) {
                return d.y;
            })
            .attr("height", height)
            .attr("fill-opacity", 0)
            .attr("cursor", "ew-resize")
            .call(d3.drag()
                .on("drag", rdragresize));

        var dragtop = newg.append("rect")
            .attr("x", function (d) {
                return d.x;
            })
            .attr("y", function (d) {
                return d.y;
            })
            .attr("width", width)
            .attr("fill-opacity", 0)

        var dragbottom = newg.append("rect")
            .attr("x", function (d) {
                return d.x;
            })
            .attr("y", function (d) {
                return d.y + height;
            })
            .attr("width", width)
            .attr("fill-opacity", 0)
            .attr("cursor", "ns-resize")
            .call(d3.drag().on("drag", rdragresize));

        // Extracellular rectangle
        var extracellular = newg.append("rect")
            .attr("id", luminalID)
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", w / 3 - 30)
            .attr("height", h)
            .attr("stroke", "purple")
            .attr("strokeWidth", "4px")
            .attr("fill", "white");

        // Intracellular rectangle
        var intracellular = newg.append("rect")
            .attr("id", cytosolID)
            .attr("x", w / 3 + 30)
            .attr("y", height / 3 + 20)
            .attr("width", width - 60)
            .attr("height", height - 40)
            .attr("stroke", "blue")
            .attr("strokeWidth", "4px")
            .attr("fill", "white");

        // Interstitial fluid rectangle
        var interstitial = newg.append("rect")
            .attr("id", interstitialID)
            .attr("x", w / 3 + width + 30)
            .attr("y", 0)
            .attr("width", w - (w / 3 + width + 30))
            .attr("height", h)
            .attr("stroke", "teal")
            .attr("strokeWidth", "4px")
            .attr("fill", "white");

        // Interstitial fluid rectangle
        var interstitial2 = newg.append("rect")
            .attr("id", interstitialID)
            .attr("x", w / 3 - 10)
            .attr("y", 0)
            .attr("width", width + 40)
            .attr("height", height / 3 - 30)
            .attr("stroke", "teal")
            .attr("strokeWidth", "4px")
            .attr("fill", "white");

        // Paracellular rectangle
        var paracellular = newg.append("rect")
            .attr("id", paracellularID)
            .attr("x", w / 3 - 10)
            .attr("y", height / 3 + height + 30)
            .attr("width", width + 20)
            .attr("height", height / 3)
            .attr("stroke", "indigo")
            .attr("strokeWidth", "4px")
            .attr("fill", "white");

        var solutes = [];

        for (var i = 0; i < concentration_fma.length; i++) {

            // luminal(5), cytosol(6), interstitial(7), interstitial2(8), paracellular(9)
            for (var j = 5; j <= 9; j++) {
                if (concentration_fma[i].fma == document.getElementsByTagName("rect")[j].id)
                    break;
            }

            // compartments
            if (concentration_fma[i].fma == document.getElementsByTagName("rect")[j].id) {
                var xrect = document.getElementsByTagName("rect")[j].x.baseVal.value;
                var yrect = document.getElementsByTagName("rect")[j].y.baseVal.value;
                var xwidth = document.getElementsByTagName("rect")[j].width.baseVal.value;
                var yheight = document.getElementsByTagName("rect")[j].height.baseVal.value;
                var svgtext = svg.append("g").data([{x: xrect + 10, y: yrect + 20}]);

                var indexOfHash = concentration_fma[i].name.search("#");
                var value = concentration_fma[i].name.slice(indexOfHash + 1);
                var indexOfdot = value.indexOf('.');
                value = value.slice(indexOfdot + 1);

                solutes.push(
                    {
                        compartment: document.getElementsByTagName("rect")[j].id,
                        xrect: xrect,
                        yrect: yrect,
                        width: xwidth,
                        height: yheight,
                        value: value,
                        length: getTextWidth(value, 12) //value.length
                    });
            }
        }

        mainUtils.solutesBouncing(newg, solutes);

        // line apical and serosal
        var x = document.getElementsByTagName("rect")[0].x.baseVal.value;
        var y = document.getElementsByTagName("rect")[0].y.baseVal.value;

        var lineapical = newg.append("line")
            .attr("id", apicalID)
            .attr("x1", function (d) {
                return d.x;
            })
            .attr("y1", function (d) {
                return d.y + 10;
            })
            .attr("x2", function (d) {
                return d.x;
            })
            .attr("y2", function (d) {
                return d.y + height - 10;
            })
            .attr("stroke", function (d) {
                svg.append("text")
                    .style("font", "16px sans-serif")
                    .attr("stroke", "green")
                    .attr("x", 850)
                    .attr("y", 20)
                    .text("Apical Membrane");

                return "green";
            })
            .attr("stroke-width", 25)
            .attr("opacity", 0.5)
            .attr("cursor", "pointer")
            .call(d3.drag().on("drag", dragmove));

        var lineserosal = newg.append("line")
            .attr("id", serosalID)
            .attr("x1", function (d) {
                return d.x + width;
            })
            .attr("y1", function (d) {
                return d.y + 10;
            })
            .attr("x2", function (d) {
                return d.x + width;
            })
            .attr("y2", function (d) {
                return d.y + height - 10;
            })
            .attr("stroke", function (d) {
                svg.append("text")
                    .style("font", "16px sans-serif")
                    .attr("stroke", "orange")
                    .attr("x", 850)
                    .attr("y", 40)
                    .text("Basolateral Membrane");

                return "orange";
            })
            .attr("stroke-width", 25)
            .attr("opacity", 0.5)
            .attr("cursor", "pointer")
            .call(d3.drag().on("drag", dragmove));

        // Paracellular Rectangle
        newg.append("polygon")
            .attr("transform", "translate(265,720)")
            .attr("points", "0,0 0,100 0,0 300,0 300,100 300,0")
            .attr("fill", "white")
            .attr("stroke", "url(#basicPattern)")
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 25)
            .attr("cursor", "move")
            .call(d3.drag().on("drag", dragpolygon));

        // solutes in apical and serosal membrane
        // TODO: drag when flux is NBC_Current.J_Na
        console.log("solutes in apical and serosal membrane");

        // Circle and line arrow from lumen to cytosol
        var xrect = document.getElementsByTagName("rect")[0].x.baseVal.value;
        var yrect = document.getElementsByTagName("rect")[0].y.baseVal.value;

        var lineLen = 50,
            radius = 20,
            lineg,
            xvalue = xrect - lineLen / 2, // x coordinate before epithelial rectangle
            yvalue = yrect + 10 + 50, // initial distance 50
            ydistance = 70,
            circlewithlineg = [],
            linewithlineg = [],
            linewithlinegstart = [],
            linewithtextg = [],
            linewithtextgstart = [],
            cxvalue = xrect,
            cyvalue = yrect + 10 + 50; // initial distance 50

        // Handling two directional flux - swap if source
        // and sink have same fma stored in an index
        for (var i = 0; i < source_fma.length; i++) {
            if (source_fma[i].fma == sink_fma[i].fma) {
                sink_fma[i].fma = source_fma[i + 1].fma;
                sink_fma[i].name = source_fma[i + 1].name;

                sink_fma[i + 1].fma = source_fma[i].fma;
                sink_fma[i + 1].name = source_fma[i].name;
            }
        }

        // TODO: does not work for bi-directional arrow, Fix this
        // SVG checkbox with drag on-off
        var checkboxsvg = newg.append("g");

        var checkBox = [],
            textvaluechk = [],
            checkedchk = [],
            ydistancechk = 50,
            yinitialchk = 160,
            ytextinitialchk = 178;

        for (var i = 0; i < source_fma.length; i++) {
            checkBox[i] = new d3CheckBox();
        }

        // var id;
        var update = function () {
            for (var i = 0; i < source_fma.length; i++) {
                checkedchk[i] = checkBox[i].checked();
                // drag enable and disable
                if (checkedchk[i] == true) {
                    // var id = "linewithlineg" + i;
                    // d3.select("#" + id + "").on("click", function () {
                    //         markerDir(id);
                    //     }
                    // );
                    circlewithlineg[i].call(d3.drag().on("drag", dragcircleline));
                    linewithlineg[i].call(d3.drag().on("drag", dragcircleline));
                    linewithtextg[i].call(d3.drag().on("drag", dragcircleline));
                }
                else {
                    circlewithlineg[i].call(d3.drag().on("drag", dragcircleendchkbx));
                    linewithlineg[i].call(d3.drag().on("drag", dragcircleendchkbx));
                    linewithtextg[i].call(d3.drag().on("drag", dragcircleendchkbx));
                }
            }
        };

        for (var i = 0; i < source_fma.length; i++) {
            var indexOfHash = source_fma[i].name.search("#");
            textvaluechk[i] = source_fma[i].name.slice(indexOfHash + 1);

            checkBox[i].x(850).y(yinitialchk).checked(false).clickEvent(update);
            checkBox[i].xtext(890).ytext(ytextinitialchk).text("" + textvaluechk[i] + "");

            checkboxsvg.call(checkBox[i]);

            yinitialchk += ydistancechk;
            ytextinitialchk += ydistancechk;
        }

        function dragcircleendchkbx(d) {
            d3.select(this).classed("dragging", false);
        }

        function d3CheckBox() {

            var size = 20,
                x = 0,
                y = 0,
                rx = 0,
                ry = 0,
                markStrokeWidth = 2,
                boxStrokeWidth = 2,
                checked = false,
                clickEvent,
                xtext = 0,
                ytext = 0,
                text = "Empty";

            function checkBox(selection) {
                var g = selection.append("g"),
                    box = g.append("rect")
                        .attr("width", size)
                        .attr("height", size)
                        .attr("x", x)
                        .attr("y", y)
                        .attr("rx", rx)
                        .attr("ry", ry)
                        .styles({
                            "fill-opacity": 0,
                            "stroke-width": boxStrokeWidth,
                            "stroke": "black"
                        }),
                    txt = g.append("text").attr("x", xtext).attr("y", ytext).text("" + text + "");

                //Data to represent the check mark
                var coordinates = [
                    {x: x + (size / 8), y: y + (size / 3)},
                    {x: x + (size / 2.2), y: (y + size) - (size / 4)},
                    {x: (x + size) - (size / 8), y: (y + (size / 10))}
                ];

                var line = d3.line()
                    .x(function (d) {
                        return d.x;
                    })
                    .y(function (d) {
                        return d.y;
                    });

                var mark = g.append("path")
                    .attr("d", line(coordinates))
                    .styles({
                        "stroke-width": markStrokeWidth,
                        "stroke": "black",
                        "fill": "none",
                        "opacity": (checked) ? 1 : 0
                    });

                g.on("click", function () {
                    checked = !checked;
                    mark.style("opacity", (checked) ? 1 : 0);

                    if (clickEvent) {
                        clickEvent();
                    }

                    d3.event.stopPropagation();
                });
            }

            checkBox.size = function (val) {
                size = val;
                return checkBox;
            }

            checkBox.x = function (val) {
                x = val;
                return checkBox;
            }

            checkBox.y = function (val) {
                y = val;
                return checkBox;
            }

            checkBox.rx = function (val) {
                rx = val;
                return checkBox;
            }

            checkBox.ry = function (val) {
                ry = val;
                return checkBox;
            }

            checkBox.markStrokeWidth = function (val) {
                markStrokeWidth = val;
                return checkBox;
            }

            checkBox.boxStrokeWidth = function (val) {
                boxStrokeWidth = val;
                return checkBox;
            }

            checkBox.checked = function (val) {
                if (val === undefined) {
                    return checked;
                } else {
                    checked = val;
                    return checkBox;
                }
            }

            checkBox.clickEvent = function (val) {
                clickEvent = val;
                return checkBox;
            }

            checkBox.xtext = function (val) {
                xtext = val;
                return checkBox;
            }

            checkBox.ytext = function (val) {
                ytext = val;
                return checkBox;
            }

            checkBox.text = function (val) {
                text = val;
                return checkBox;
            }

            return checkBox;
        }

        // End of svg checkbox

        for (var i = 0; i < source_fma.length; i++) {

            if (source_fma[i].fma == luminalID && sink_fma[i].fma == cytosolID) {

                var indexOfHash = source_fma[i].name.search("#");
                var textvalue = source_fma[i].name.slice(indexOfHash + 1);
                var indexOfdot = textvalue.indexOf('.');
                textvalue = textvalue.slice(indexOfdot + 1);
                var textWidth = getTextWidth(textvalue, 12);

                lineg = newg.append("g").data([{x: xvalue, y: yvalue}]);

                linewithlineg[i] = lineg.append("line")
                    .attr("id", "linewithlineg" + i)
                    .attr("x1", function (d) {
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        return d.x + lineLen;
                    })
                    .attr("y2", function (d) {
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#end)")
                    .attr("cursor", "pointer");

                // .call(d3.drag().on("drag", dragcircleline));

                var linegtext = lineg.append("g").data([{x: xvalue + lineLen + 10, y: yvalue + 5}]);

                linewithtextg[i] = linegtext.append("text")
                    .attr("id", "linewithtextg" + i)
                    .attr("x", function (d) {
                        return d.x;
                    })
                    .attr("y", function (d) {
                        return d.y;
                    })
                    .attr("font-family", "Times New Roman")
                    .attr("font-size", "12px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(textvalue);

                // .call(d3.drag().on("drag", dragcircleline));

                var linegcircle = lineg.append("g").data([{x: cxvalue, y: cyvalue}]);

                circlewithlineg[i] = linegcircle.append("circle")
                    .attr("id", "circlewithlineg" + i)
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y + radius;
                    })
                    .attr("r", radius)
                    .attr("fill", "lightgreen")
                    .attr("stroke-width", 20)
                    .attr("cursor", "move");

                // .call(d3.drag().on("drag", dragcircleline));

                // var linegstart = lineg.append("g").data([{x: xvalue, y: yvalue + radius * 2}]);
                //
                // linewithlinegstart[i] = linegstart.append("line")
                //     .attr("id", "linewithlinegstart" + i)
                //     .attr("x1", function (d) {
                //         return d.x;
                //     })
                //     .attr("y1", function (d) {
                //         return d.y;
                //     })
                //     .attr("x2", function (d) {
                //         return d.x + lineLen;
                //     })
                //     .attr("y2", function (d) {
                //         return d.y;
                //     })
                //     .attr("stroke", "black")
                //     .attr("stroke-width", 2)
                //     .attr("marker-start", "url(#start)")
                //     .attr("cursor", "pointer")
                //     .call(d3.drag().on("drag", dragcircleline));
                //
                // var linegtextstart = linegstart.append("g")
                //     .data([{x: xvalue - textWidth - 10 - markerWidth, y: yvalue + radius * 2 + markerHeight}]);
                //
                // linewithtextgstart[i] = linegtextstart.append("text")
                //     .attr("id", "linewithtextgstart" + i)
                //     .attr("x", function (d) {
                //         return d.x;
                //     })
                //     .attr("y", function (d) {
                //         return d.y;
                //     })
                //     .attr("font-family", "Times New Roman")
                //     .attr("font-size", "12px")
                //     .attr("font-weight", "bold")
                //     .attr("fill", "red")
                //     .attr("cursor", "move")
                //     .text(textvalue)
                //     .call(d3.drag().on("drag", dragcircleline));

                // increment y-axis of line and circle
                yvalue += ydistance;
                cyvalue += ydistance;
            }
        }

        function dragcircleline(d) {

            // Circle: strip all the non-digit characters (\D or [^0-9])
            var ic = this.id.replace(/\D/g, '');
            var axis = groupcordinates2("circlewithlineg" + ic, ic);
            circlewithlineg[ic]
                .attr("cx", axis.shift())
                .attr("cy", axis.shift());

            // Text: strip all the non-digit characters (\D or [^0-9])
            var axis = groupcordinates2("linewithtextg" + ic, ic);
            linewithtextg[ic]
                .attr("x", axis.shift())
                .attr("y", axis.shift());

            // Text: strip all the non-digit characters (\D or [^0-9])
            // if (combineID[3] != undefined) {
            //     var axis = groupcordinates2("linewithtextgstart" + ic, ic);
            //     linewithtextgstart[ic]
            //         .attr("x", axis.shift())
            //         .attr("y", axis.shift());
            // }

            // line: strip all the non-digit characters (\D or [^0-9])
            var axis = groupcordinates2("linewithlineg" + ic, ic);
            linewithlineg[ic]
                .attr("x1", axis.shift())
                .attr("y1", axis.shift())
                .attr("x2", axis.shift())
                .attr("y2", axis.shift());

            // line2: strip all the non-digit characters (\D or [^0-9])
            // if (combineID[4] != undefined) {
            //     var axis = groupcordinates2("linewithlinegstart" + ic, ic);
            //     linewithlinegstart[ic]
            //         .attr("x1", axis.shift())
            //         .attr("y1", axis.shift())
            //         .attr("x2", axis.shift())
            //         .attr("y2", axis.shift());
            // }
        }

        function groupcordinates2(groups, ic) {

            var dx = d3.event.dx;
            var dy = d3.event.dy;

            if (groups == "circlewithlineg" + ic) { // circle groups
                var cxNew = parseFloat(d3.select("#" + groups + "").attr("cx")) + dx;
                var cyNew = parseFloat(d3.select("#" + groups + "").attr("cy")) + dy;

                return [cxNew, cyNew];
            }
            else if ((groups == "linewithtextg" + ic) || (groups == "linewithtextgstart" + ic)) { // text groups
                var xNew = parseFloat(d3.select("#" + groups + "").attr("x")) + dx;
                var yNew = parseFloat(d3.select("#" + groups + "").attr("y")) + dy;

                return [xNew, yNew];
            }
            else { // Line groups
                var x1New = parseFloat(d3.select("#" + groups + "").attr("x1")) + dx;
                var y1New = parseFloat(d3.select("#" + groups + "").attr("y1")) + dy;
                var x2New = parseFloat(d3.select("#" + groups + "").attr("x2")) + dx;
                var y2New = parseFloat(d3.select("#" + groups + "").attr("y2")) + dy;

                return [x1New, y1New, x2New, y2New];
            }
        }

        function dragpolygon(d) {
            var dx = d3.event.dx;
            var dy = d3.event.dy;

            var xNew = [], yNew = [], points = "";
            var pointsLen = d3.select(this)._groups[0][0].points.length;

            for (var i = 0; i < pointsLen; i++) {
                xNew[i] = parseFloat(d3.select(this)._groups[0][0].points[i].x) + dx;
                yNew[i] = parseFloat(d3.select(this)._groups[0][0].points[i].y) + dy;

                points = points.concat("" + xNew[i] + "").concat(",").concat("" + yNew[i] + "");

                if (i != pointsLen - 1)
                    points = points.concat(" ");
            }

            d3.select(this).attr("points", points);
            // console.log("polygon: ", d3.select(this).attr("points"));
        }

// circle drag on-off based on checked event
        var radius = 20;

        var circledrag1 = svg.append("g").data([{x: 870, y: 80}]);

        var circle1 = circledrag1.append("circle")
            .attr("id", apicalID)
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            })
            .attr("r", radius)
            .attr("fill", "lightgreen")
            .attr("opacity", 0.5)
            .attr("stroke-width", 20)
            .attr("cursor", "move")
            .call(d3.drag()
                .on("drag", dragcircle)
                .on("end", dragcircleend));

        var circledrag2 = svg.append("g").data([{x: 915, y: 80}]);

        var circle2 = circledrag2.append("circle")
            .attr("id", serosalID)
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            })
            .attr("r", radius)
            .attr("fill", "orange")
            .attr("opacity", 0.5)
            .attr("stroke-width", 20)
            .attr("cursor", "move")
            .call(d3.drag()
                .on("drag", dragcircle)
                .on("end", dragcircleend));

        var circledrag3 = svg.append("g").data([{x: 960, y: 80}]);

        var circle3 = circledrag3.append("circle")
            .attr("id", cytosolID)
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            })
            .attr("r", radius)
            .attr("fill", "blue")
            .attr("opacity", 0.5)
            .attr("stroke-width", 20)
            .attr("cursor", "move")
            .call(d3.drag()
                .on("drag", dragcircle)
                .on("end", dragcircleend));

        var circledrag4 = svg.append("g").data([{x: 1005, y: 80}]);

        var circle4 = circledrag4.append("circle")
            .attr("id", luminalID)
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            })
            .attr("r", radius)
            .attr("fill", "purple")
            .attr("opacity", 0.5)
            .attr("stroke-width", 20)
            .attr("cursor", "move")
            .call(d3.drag()
                .on("drag", dragcircle)
                .on("end", dragcircleend));

        function dragcircle(d) {
            d3.select(this)
                .attr("cx", d.x = d3.event.x)
                .attr("cy", d.y = d3.event.y);

            console.log("dragcircle: ", d3.select(this));

            // Test: detect apical membrane
            var line_x = document.getElementsByTagName("line")[0].x1.baseVal.value;
            var line_y1 = document.getElementsByTagName("line")[0].y1.baseVal.value;
            var line_y2 = document.getElementsByTagName("line")[0].y2.baseVal.value;
            var cx = d3.select(this)._groups[0][0].cx.baseVal.value;
            var cy = d3.select(this)._groups[0][0].cy.baseVal.value;
            var line_id = document.getElementsByTagName("line")[0].id;
            var circle_id = d3.select(this)._groups[0][0].id;

            if ((cx >= (line_x - radius) && cx <= line_x + 20 + radius) && (cy >= line_y1 && cy <= line_y2) && (line_id == circle_id)) {
                document.getElementsByTagName("line")[0].style.setProperty("stroke", "red");

                circle1
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .attr("cx", d.x = 870)
                    .attr("cy", d.y = 80);

                console.log("d.x: ", d.x);
                console.log("d.y: ", d.y);
            }
            else {
                document.getElementsByTagName("line")[0].style.setProperty("stroke", "green");
            }

            // Test: detect serosal membrane
            var line_xx = document.getElementsByTagName("line")[1].x1.baseVal.value;
            var line_yy1 = document.getElementsByTagName("line")[1].y1.baseVal.value;
            var line_yy2 = document.getElementsByTagName("line")[1].y2.baseVal.value;
            var cxx = d3.select(this)._groups[0][0].cx.baseVal.value;
            var cyy = d3.select(this)._groups[0][0].cy.baseVal.value;
            var line_idd = document.getElementsByTagName("line")[1].id;
            var circle_id = d3.select(this)._groups[0][0].id;

            if ((cxx >= (line_xx - radius) && cxx <= line_xx + 20 + radius) && (cyy >= line_yy1 && cyy <= line_yy2) && (line_idd == circle_id)) {
                document.getElementsByTagName("line")[1].style.setProperty("stroke", "red");

                circle2
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .attr("cx", d.x = 915)
                    .attr("cy", d.y = 80);
            }
            else {
                document.getElementsByTagName("line")[1].style.setProperty("stroke", "orange");
            }

            // Test: detect extracellular membrane
            var rect_x = document.getElementsByTagName("rect")[5].x.baseVal.value;
            var rect_y = document.getElementsByTagName("rect")[5].y.baseVal.value;
            var rect_id = document.getElementsByTagName("rect")[5].id;
            var cxp = d3.select(this)._groups[0][0].cx.baseVal.value;
            var cyp = d3.select(this)._groups[0][0].cy.baseVal.value;
            var circle_id = d3.select(this)._groups[0][0].id;

            if ((cxp >= rect_x && cxp <= rect_x + w / 3 - 30) && (cyp >= rect_y && cyp <= rect_y + h) && (rect_id == circle_id)) {
                document.getElementsByTagName("rect")[5].style.setProperty("stroke", "red");
            }
            else {
                document.getElementsByTagName("rect")[5].style.setProperty("stroke", "purple");
            }

            // Test: detect intracellular membrane
            var rect_xc = document.getElementsByTagName("rect")[6].x.baseVal.value;
            var rect_yc = document.getElementsByTagName("rect")[6].y.baseVal.value;
            var rect_idc = document.getElementsByTagName("rect")[6].id;
            var cxc = d3.select(this)._groups[0][0].cx.baseVal.value;
            var cyc = d3.select(this)._groups[0][0].cy.baseVal.value;
            var circle_idc = d3.select(this)._groups[0][0].id;

            if ((cxc >= rect_xc && cxc <= rect_xc + width - 60) && (cyc >= rect_yc && cyc <= rect_yc + height - 40) && (rect_idc == circle_idc)) {
                document.getElementsByTagName("rect")[6].style.setProperty("stroke", "red");
            }
            else {
                document.getElementsByTagName("rect")[6].style.setProperty("stroke", "blue");
            }
        }

        function dragcircleend(d) {
            d3.select(this).classed("dragging", false);
        }

        function dragmove(d) {

            // drag move
            dragrect
                .attr("x", d.x = Math.max(0, Math.min(w - width, d3.event.x)));
            dragrect
                .attr("y", d.y = Math.max(0, Math.min(h - height, d3.event.y)));

            // drag left
            dragleft
                .attr("x", function (d) {
                    return d.x;
                })
            dragleft
                .attr("y", function (d) {
                    return d.y;
                });

            // drag right
            dragright
                .attr("x", function (d) {
                    return d.x + width;
                })
            dragright
                .attr("y", function (d) {
                    return d.y;
                });

            // drag top
            dragtop
                .attr("x", function (d) {
                    return d.x;
                })
            dragtop
                .attr("y", function (d) {
                    return d.y;
                });

            // drag bottom
            dragbottom
                .attr("x", function (d) {
                    return d.x;
                })
            dragbottom
                .attr("y", function (d) {
                    return d.y + height;
                });

            // drag apical line
            lineapical
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y + 10;
                })
                .attr("x2", function (d) {
                    return d.x;
                })
                .attr("y2", function (d) {
                    return d.y + height - 10;
                })

            // drag serosal line
            lineserosal
                .attr("x1", function (d) {
                    return d.x + width;
                })
                .attr("y1", function (d) {
                    return d.y + 10;
                })
                .attr("x2", function (d) {
                    return d.x + width;
                })
                .attr("y2", function (d) {
                    return d.y + height - 10;
                })
        }

        function rdragresize(d) {

            //Max x on the left is x - width
            //Max x on the right is width of screen
            var dragx = Math.max(d.x, Math.min(w, d.x + width + d3.event.dx));

            //recalculate width
            width = dragx - d.x;

            //move the right drag handle
            dragright
                .attr("x", function (d) {
                    return dragx
                });

            //resize the drag rectangle
            //as we are only resizing from the right, the x coordinate does not need to change
            dragrect
                .attr("width", width);
            dragtop
                .attr("width", width)
            dragbottom
                .attr("width", width)

            //Max x on the left is x - width
            //Max x on the right is width of screen
            var dragy = Math.max(d.y, Math.min(h, d.y + height + d3.event.dy));

            //recalculate width
            height = dragy - d.y;

            //move the right drag handle
            dragbottom
                .attr("y", function (d) {
                    return dragy
                });

            //resize the drag rectangle
            //as we are only resizing from the right, the x coordinate does not need to change
            dragrect
                .attr("height", height);
            dragleft
                .attr("height", height);
            dragright
                .attr("height", height);

            // drag apical line
            lineapical
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y + 10;
                })
                .attr("x2", function (d) {
                    return d.x;
                })
                .attr("y2", function (d) {
                    return d.y + height - 10;
                })

            // drag serosal line
            lineserosal
                .attr("x1", function (d) {
                    return d.x + width;
                })
                .attr("y1", function (d) {
                    return d.y + 10;
                })
                .attr("x2", function (d) {
                    return d.x + width;
                })
                .attr("y2", function (d) {
                    return d.y + height - 10;
                })
        }

// Text
        var svgtext = svg.append("g").data([{x: 850, y: 720}]);

        var compartment = ["Luminal", "Serosal", "Paracellular", "Na+", "K+", "Cl-"];

        compartment.forEach(function (element, index) {
            if (index > 0)
                svgtext.data([{x: 850, y: 690 + 30 * (index + 1)}]);

            svgtext.append("text")
                .attr("id", element)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-family", "Times New Roman")
                .attr("font-size", "20px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text(element)
                .call(d3.drag()
                    .on("drag", dragtext)
                    .on("end", dragendtext));
        });

        function dragtext(d) {

            console.log("dragtext: ", d3.select(this));

            d3.select(this)
            // .attr("pointer-events", "none") // hide text and make visible rectangles
                .attr("x", d.x = d3.event.x)
                .attr("y", d.y = d3.event.y);
        }

        function dragendtext(d) {
            console.log("dragtextend: ", d3.select(this));

            d3.select(this)
                .classed("dragging", false);
            // .attr("pointer-events", "all");
        }

        var markerWidth = 4;
        var markerHeight = 4;

// build the start arrow.
        svg.append("svg:defs")
            .selectAll("marker")
            .data(["start"])      // Different link/path types can be defined here
            .enter().append("svg:marker")    // This section adds in the arrows
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 1)
            .attr("refY", -0.25)
            .attr("markerWidth", markerWidth)
            .attr("markerHeight", markerHeight)
            .attr("orient", "180")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");

// build the end arrow.
        svg.append("svg:defs").selectAll("marker")
            .data(["end"])      // Different link/path types can be defined here
            .enter().append("svg:marker")    // This section adds in the arrows
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 1)
            .attr("refY", -0.25)
            .attr("markerWidth", markerWidth)
            .attr("markerHeight", markerHeight)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");

        // Utility for marker direction
        function markerDir(selection) {
            console.log(selection);

            if (selection == undefined) {
                return;
            }

            var mstart = d3.select("#" + selection + "")
                ._groups[0][0]
                .getAttribute("marker-start");

            var mend = d3.select("#" + selection + "")
                ._groups[0][0]
                .getAttribute("marker-end");

            if (mstart == "") {
                d3.select("#" + selection + "")
                    .attr("marker-start", "url(#start)")
                    .attr("marker-end", "");
            }
            else {
                d3.select("#" + selection + "")
                    .attr("marker-end", "url(#end)")
                    .attr("marker-start", "");
            }

            if (mend == "") {
                d3.select("#" + selection + "")
                    .attr("marker-end", "url(#end)")
                    .attr("marker-start", "");
            }
            else {
                d3.select("#" + selection + "")
                    .attr("marker-start", "url(#start)")
                    .attr("marker-end", "");
            }
        }

        // Polygon with arrow lines
        var polygonwitharrowsg = svg.append("g").data([{x: 840, y: 525}]);
        var polygonlineLen = 60;

        var polygonmarkerend = polygonwitharrowsg.append("line")
            .attr("id", "polygonmarkerend")
            .attr("x1", function (d) {
                return d.x;
            })
            .attr("y1", function (d) {
                return d.y;
            })
            .attr("x2", function (d) {
                return d.x + polygonlineLen;
            })
            .attr("y2", function (d) {
                return d.y;
            })
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#end)")
            .attr("cursor", "pointer")
            .call(d3.drag().on("drag", dragpolygonandline));

        // Click to change the marker direction
        d3.select("#polygonmarkerend").on("click", function () {
            markerDir("polygonmarkerend");
        });

        // Polygon
        var polygonmarker = svg.append("g").append("polygon")
            .attr("transform", "translate(850,500)")
            .attr("id", "channel")
            // .attr("points", "10,10 30,10 40,25 30,40 10,40 0,25")
            .attr("points", "10,15 30,15 40,25 30,35 10,35 0,25")
            .attr("fill", "orange")
            .attr("stroke", "black")
            .attr("stroke-linecap", "round")
            .attr("stroke-linejoin", "round")
            .attr("cursor", "move")
            .call(d3.drag().on("drag", dragpolygonandline));

        function dragpolygonandline(d) {

            // polygon line
            var axis = groupcordinates("polygonmarkerend");
            polygonmarkerend
                .attr("x1", axis.shift())
                .attr("y1", axis.shift())
                .attr("x2", axis.shift())
                .attr("y2", axis.shift());

            // polygon
            var dx = d3.event.dx;
            var dy = d3.event.dy;

            var xNew = [], yNew = [], points = "";
            var pointsLen = d3.select(this)._groups[0][0].points.length;

            for (var i = 0; i < pointsLen; i++) {
                xNew[i] = parseFloat(d3.select(this)._groups[0][0].points[i].x) + dx;
                yNew[i] = parseFloat(d3.select(this)._groups[0][0].points[i].y) + dy;

                points = points.concat("" + xNew[i] + "").concat(",").concat("" + yNew[i] + "");

                if (i != pointsLen - 1)
                    points = points.concat(" ");
            }

            d3.select(this).attr("points", points);
        }

        function dragpolygon(d) {
            var dx = d3.event.dx;
            var dy = d3.event.dy;

            var xNew = [], yNew = [], points = "";
            var pointsLen = d3.select(this)._groups[0][0].points.length;

            for (var i = 0; i < pointsLen; i++) {
                xNew[i] = parseFloat(d3.select(this)._groups[0][0].points[i].x) + dx;
                yNew[i] = parseFloat(d3.select(this)._groups[0][0].points[i].y) + dy;

                points = points.concat("" + xNew[i] + "").concat(",").concat("" + yNew[i] + "");

                if (i != pointsLen - 1)
                    points = points.concat(" ");
            }

            d3.select(this).attr("points", points);
            // console.log("polygon: ", d3.select(this).attr("points"));
        }

// Circle with arrow lines
        var circlewitharrowsg = svg.append("g").data([{x: 850, y: 600}]);
        var lineLen = 40;
        var radius = 20;

        var linemarkerend = circlewitharrowsg.append("line")
            .attr("id", "linemarkerend")
            .attr("x1", function (d) {
                return d.x;
            })
            .attr("y1", function (d) {
                return d.y;
            })
            .attr("x2", function (d) {
                return d.x + lineLen;
            })
            .attr("y2", function (d) {
                return d.y;
            })
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#end)")
            .attr("cursor", "pointer")
            .call(d3.drag().on("drag", dragcircleandline));

        var linemarkerstart = circlewitharrowsg.append("line")
            .attr("id", "linemarkerstart")
            .attr("x1", function (d) {
                return d.x;
            })
            .attr("y1", function (d) {
                return d.y + lineLen;
            })
            .attr("x2", function (d) {
                return d.x + lineLen;
            })
            .attr("y2", function (d) {
                return d.y + lineLen;
            })
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("marker-start", "url(#start)")
            .attr("cursor", "pointer")
            .call(d3.drag().on("drag", dragcircleandline));

        var circlemarker = circlewitharrowsg.append("circle")
            .attr("id", "circlemarker")
            .attr("cx", function (d) {
                return d.x + radius;
            })
            .attr("cy", function (d) {
                return d.y + radius;
            })
            .attr("r", radius)
            .attr("fill", "SteelBlue")
            .attr("stroke-width", 20)
            .attr("cursor", "move")
            .call(d3.drag().on("drag", dragcircleandline));

// Click to change the marker direction
        d3.select("#linemarkerend").on("click", function () {
            markerDir("linemarkerend");
        });

        d3.select("#linemarkerstart").on("click", function () {
            markerDir("linemarkerstart");
        });

        function dragcircleandline(d) {

            // circle line
            var axis = groupcordinates("linemarkerend");
            linemarkerend
                .attr("x1", axis.shift())
                .attr("y1", axis.shift())
                .attr("x2", axis.shift())
                .attr("y2", axis.shift());

            var axis = groupcordinates("linemarkerstart");
            linemarkerstart
                .attr("x1", axis.shift())
                .attr("y1", axis.shift())
                .attr("x2", axis.shift())
                .attr("y2", axis.shift());

            // Circle
            var axis = groupcordinates("circlemarker");
            circlemarker
                .attr("cx", axis.shift())
                .attr("cy", axis.shift());
        }

// TODO: make generic for all shapes
        function groupcordinates(groups) {

            var dx = d3.event.dx;
            var dy = d3.event.dy;

            // Circle groups
            if (groups == "circlemarker") {
                var cxNew = parseFloat(d3.select("#" + groups + "").attr("cx")) + dx;
                var cyNew = parseFloat(d3.select("#" + groups + "").attr("cy")) + dy;

                return [cxNew, cyNew];
            } else { // Line groups

                var x1New = parseFloat(d3.select("#" + groups + "").attr("x1")) + dx;
                var y1New = parseFloat(d3.select("#" + groups + "").attr("y1")) + dy;
                var x2New = parseFloat(d3.select("#" + groups + "").attr("x2")) + dx;
                var y2New = parseFloat(d3.select("#" + groups + "").attr("y2")) + dy;

                return [x1New, y1New, x2New, y2New];
            }
        }
    }

    // Testing whether two fluxes have common cotransporter
    mainUtils.testTwoFluxCotransporterHtml = function (apicalMembrane1, apicalMembrane2) {

        console.log("apicalMembrane: ", apicalMembrane1, apicalMembrane2);

        var finalapicalMembrane = [];

        mainUtils.apicalajax = function () {

            var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
                'SELECT ?med_entity_uri ?med_entity_uriCl ' +
                'WHERE { GRAPH ?Workspace { ' +
                '<' + apicalMembrane1.source_name + '> semsim:isComputationalComponentFor ?model_prop. ' +
                '?model_prop semsim:physicalPropertyOf ?model_proc. ' +
                '?model_proc semsim:hasMediatorParticipant ?model_medparticipant. ' +
                '?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity. ' +
                '?med_entity semsim:hasPhysicalDefinition ?med_entity_uri.' +
                '<' + apicalMembrane2.source_name + '> semsim:isComputationalComponentFor ?model_propCl. ' +
                '?model_propCl semsim:physicalPropertyOf ?model_procCl. ' +
                '?model_procCl semsim:hasMediatorParticipant ?model_medparticipantCl. ' +
                '?model_medparticipantCl semsim:hasPhysicalEntityReference ?med_entityCl. ' +
                '?med_entityCl semsim:hasPhysicalDefinition ?med_entity_uriCl.' +
                'FILTER (?med_entity_uri = ?med_entity_uriCl) . ' +
                '}}'

            $ajaxUtils.sendPostRequest(
                endpoint,
                query,
                function (jsonObj) {
                    var tempvalues = [];

                    for (var m = 0; m < jsonObj.results.bindings.length; m++) {
                        var tmpval = jsonObj.results.bindings[m].med_entity_uri.value;
                        if (tmpval.indexOf("http://purl.obolibrary.org/obo/PR") != -1) {
                            tempvalues.push(jsonObj.results.bindings[m].med_entity_uri.value);
                        }
                    }

                    // remove duplicate of protein ID
                    tempvalues = tempvalues.filter(function (item, pos) {
                        return tempvalues.indexOf(item) == pos;
                    })

                    if (tempvalues.length != 0) {
                        finalapicalMembrane.push(
                            {
                                source_text: apicalMembrane1.source_text,
                                source_fma: apicalMembrane1.source_fma,
                                sink_text: apicalMembrane1.sink_text,
                                sink_fma: apicalMembrane1.sink_fma,
                                source_text2: apicalMembrane2.source_text,
                                source_fma2: apicalMembrane2.source_fma,
                                sink_text2: apicalMembrane2.sink_text,
                                sink_fma2: apicalMembrane2.sink_fma
                            });
                    }

                    console.log("finalapicalMembrane: ", finalapicalMembrane);
                },
                true
            );
        }

        mainUtils.apicalajax();
    };

    mainUtils.showEpithelial = function (epithelialHtmlContent) {

        // mainUtils.loadOLS();

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
        }

        // // remove duplicate
        // modelEntityFullNameArray = modelEntityFullNameArray.filter(function (item, pos) {
        //     return modelEntityFullNameArray.indexOf(item) == pos;
        // })

        console.log("showEpithelial in model2DArr: ", model2DArray);
        console.log("showEpithelial in modelEntityNameArray: ", modelEntityNameArray);
        console.log("showEpithelial in modelEntityFullNameArray: ", modelEntityFullNameArray);

        var concentration_fma = [], source_fma = [], sink_fma = [];
        var source_fma2 = [], sink_fma2 = [];

        var apicalMembrane = [], basolateralMembrane = [];

        var index = 0, counter = 0;
        var finalapicalMembrane = [];

        mainUtils.testAJAX = function () {

            if (index == modelEntityFullNameArray.length) {
                console.log("concentration_fma: ", concentration_fma);
                console.log("source_fma: ", source_fma2);
                console.log("sink_fma: ", sink_fma2);

                // Exceptional case when only one flux
                if (apicalMembrane.length == 1) {
                    finalapicalMembrane.push(
                        {
                            source_text: apicalMembrane[0].source_text,
                            source_fma: apicalMembrane[0].source_fma,
                            sink_text: apicalMembrane[0].sink_text,
                            sink_fma: apicalMembrane[0].sink_fma,
                            source_text2: undefined,
                            source_fma2: undefined,
                            sink_text2: undefined,
                            sink_fma2: undefined
                        });

                    console.log("finalapicalMembrane: ", finalapicalMembrane);
                    mainUtils.showsvgEpithelial(
                        concentration_fma,
                        source_fma,
                        sink_fma,
                        finalapicalMembrane);
                }

                for (var i = 0; i < apicalMembrane.length; i++) {
                    for (var j = i + 1; j < apicalMembrane.length; j++) {
                        // mainUtils.testTwoFluxCotransporterHtml(apicalMembrane[i], apicalMembrane[j]);

                        console.log("apicalMembrane: ", apicalMembrane[i], apicalMembrane[j]);

                        mainUtils.apicalajax = function (apicalMembrane1, apicalMembrane2) {

                            var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                                'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
                                'SELECT ?med_entity_uri ?med_entity_uriCl ' +
                                'WHERE { GRAPH ?Workspace { ' +
                                '<' + apicalMembrane1.source_name + '> semsim:isComputationalComponentFor ?model_prop. ' +
                                '?model_prop semsim:physicalPropertyOf ?model_proc. ' +
                                '?model_proc semsim:hasMediatorParticipant ?model_medparticipant. ' +
                                '?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity. ' +
                                '?med_entity semsim:hasPhysicalDefinition ?med_entity_uri.' +
                                '<' + apicalMembrane2.source_name + '> semsim:isComputationalComponentFor ?model_propCl. ' +
                                '?model_propCl semsim:physicalPropertyOf ?model_procCl. ' +
                                '?model_procCl semsim:hasMediatorParticipant ?model_medparticipantCl. ' +
                                '?model_medparticipantCl semsim:hasPhysicalEntityReference ?med_entityCl. ' +
                                '?med_entityCl semsim:hasPhysicalDefinition ?med_entity_uriCl.' +
                                'FILTER (?med_entity_uri = ?med_entity_uriCl) . ' +
                                '}}'

                            $ajaxUtils.sendPostRequest(
                                endpoint,
                                query,
                                function (jsonObj) {
                                    var tempvalues = [];

                                    for (var m = 0; m < jsonObj.results.bindings.length; m++) {
                                        var tmpval = jsonObj.results.bindings[m].med_entity_uri.value;
                                        if (tmpval.indexOf("http://purl.obolibrary.org/obo/PR") != -1) {
                                            tempvalues.push(jsonObj.results.bindings[m].med_entity_uri.value);
                                        }
                                    }

                                    // remove duplicate of protein ID
                                    tempvalues = tempvalues.filter(function (item, pos) {
                                        return tempvalues.indexOf(item) == pos;
                                    })

                                    if (tempvalues.length != 0) {
                                        finalapicalMembrane.push(
                                            {
                                                source_text: apicalMembrane1.source_text,
                                                source_fma: apicalMembrane1.source_fma,
                                                sink_text: apicalMembrane1.sink_text,
                                                sink_fma: apicalMembrane1.sink_fma,
                                                source_text2: apicalMembrane2.source_text,
                                                source_fma2: apicalMembrane2.source_fma,
                                                sink_text2: apicalMembrane2.sink_text,
                                                sink_fma2: apicalMembrane2.sink_fma
                                            });
                                    }

                                    counter++;
                                    if (counter == apicalMembrane.length) {
                                        console.log("finalapicalMembrane: ", finalapicalMembrane);
                                        mainUtils.showsvgEpithelial(
                                            concentration_fma,
                                            source_fma,
                                            sink_fma,
                                            finalapicalMembrane);
                                    }
                                },
                                true
                            );
                        }

                        mainUtils.apicalajax(apicalMembrane[i], apicalMembrane[j]);
                    }
                }

                return;
            }

            var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
                'SELECT ?source_fma ?sink_fma ' +
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
                '}'

            $ajaxUtils.sendPostRequest(
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
                    }

                    // Remove duplicate links
                    function uniqueify(es) {
                        var retval = [];
                        es.forEach(function (e) {
                            for (var j = 0; j < retval.length; j++) {
                                if (retval[j].name === e.name && retval[j].fma === e.fma)
                                    return;
                            }
                            retval.push(e);
                        });
                        return retval;
                    }

                    source_fma = uniqueify(source_fma);
                    sink_fma = uniqueify(sink_fma);

                    var query2 = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                        'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
                        'SELECT ?concentration_fma ' +
                        'WHERE { ' +
                        '<' + modelEntityFullNameArray[index] + '> semsim:isComputationalComponentFor ?model_prop. ' +
                        '?model_prop semsim:physicalPropertyOf ?source_entity. ' +
                        '?source_entity ro:part_of ?source_part_of_entity. ' +
                        '?source_part_of_entity semsim:hasPhysicalDefinition ?concentration_fma.' +
                        '}'

                    $ajaxUtils.sendPostRequest(
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
                                // keep only name of solutes
                                var indexOfHash = source_fma[0].name.search("#");
                                var srctext = source_fma[0].name.slice(indexOfHash + 1);
                                var indexOfdot = srctext.indexOf('.');
                                srctext = srctext.slice(indexOfdot + 1);

                                var indexOfHash = sink_fma[0].name.search("#");
                                var snktext = sink_fma[0].name.slice(indexOfHash + 1);
                                var indexOfdot = snktext.indexOf('.');
                                snktext = snktext.slice(indexOfdot + 1);

                                apicalMembrane.push({
                                    source_text: srctext,
                                    source_fma: source_fma[0].fma,
                                    source_name: source_fma[0].name,
                                    sink_text: snktext,
                                    sink_fma: sink_fma[0].fma,
                                    sink_name: sink_fma[0].name
                                });

                                // console.log("source_text: ", srctext);
                                // console.log("source_fma: ", source_fma[0].fma);
                                // console.log("sink_text: ", snktext);
                                // console.log("sink_fma: ", sink_fma[0].fma);

                                source_fma2.push(source_fma[0]);
                                sink_fma2.push(sink_fma[0]);

                                source_fma = [];
                                sink_fma = [];
                            }
                            mainUtils.testAJAX(); // callback
                        },
                        true);
                },
                true);
        }

        mainUtils.testAJAX();
    }

// Expose utility to the global object
    global.$mainUtils = mainUtils;
})
(window);
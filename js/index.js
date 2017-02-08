/**
 * Created by dsar941 on 9/8/2016.
 * TODO: optimize code
 */

(function (global) {
    'use strict';

    var endpoint = "https://models.physiomeproject.org/pmr2_virtuoso_search";

    var annotationHtml = "snippets/annotation.html";
    var epithelialHtml = "snippets/epithelial.html";
    var modelHtml = "snippets/model.html";
    var searchHtml = "snippets/search.html";
    var viewHtml = "snippets/view.html";

    // Set up a namespace for our utility
    var mainUtils = {};

    // Track models for delete operation
    mainUtils.listOfModels = [];

    // List of workspace names
    // mainUtils.workspaceName = [];

    // Pre-process models before list of models
    // selection for delete operation
    mainUtils.templistOfModel = [];

    // Save table rows for epithelial
    var listOfItemsForEpithelial = [];

    // Add models in the loadModelHtml
    mainUtils.model = [];
    mainUtils.model2DArr = [];
    mainUtils.headCount;

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

    // Return substitute of '{{propName}}'
    // with propValue in given 'string'
    var insertProperty = function (string, propName, propValue) {
        var propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace, "g"), propValue);
        return string;
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

        insertHtml("#main-content", "");
    };

    // On page load (before images or CSS)
    document.addEventListener("DOMContentLoaded", function (event) {
        // Place some startup code here
    });

    // Load the annotation view
    mainUtils.loadAnnotationHtml = function () {
        // Switch from current active button to annotation button
        var activeItem = "#" + findActiveItem();
        switchListItemToActive(activeItem, "#listAnnotation");

        var query = 'SELECT ?id WHERE { ?id  <http://biomodels.net/biology-qualifiers/isVersionOf> ' +
            '<http://identifiers.org/go/GO:0005272> }';

        showLoading("#main-content");

        $ajaxUtils.sendPostRequest(
            endpoint,
            query,
            function (jsonObj) {
                $ajaxUtils.sendGetRequest(
                    annotationHtml,
                    function (annotationHtmlContent) {
                        var annotationHtmlViewToIndexHtml = mainUtils.showWorkspace(jsonObj, annotationHtmlContent);
                        insertHtml("#main-content", annotationHtmlViewToIndexHtml);
                    },
                    false);
            },
            true);
    };

    /*
     * TODO: make use of accordion
     * */
    // Show workspaces in the annotation html
    mainUtils.showWorkspace = function (jsonObj, annotationHtmlContent) {

        var label = [];
        var finalHtml = annotationHtmlContent;

        var html = "<section class='row'>";

        for (var i = 0; i < jsonObj.results.bindings.length; i++) {

            // id with workspace name as a string
            var idWithStr = jsonObj.results.bindings[i].id.value;
            var index = idWithStr.search(".cellml");
            var workspaceName = idWithStr.slice(0, index);

            var workspaceUrl = "https://models.physiomeproject.org/workspace" + "/" + workspaceName + "/" + "@@file" +
                "/" + "HEAD" + "/" + jsonObj.results.bindings[i].id.value;

            label[i] = document.createElement("label");
            label[i].id = idWithStr;
            label[i].innerHTML = '<input id="' + label[i].id + '" type="checkbox" data-action="annotation" value="" ' +
                'class="checkbox-inline"> ';

            label[i].innerHTML += '<a href=' + workspaceUrl + ' + target=_blank>' + workspaceName + " / " + idWithStr +
                '</a></label>';

            html += '<label>' + label[i].innerHTML + '</label><br>';
        }

        html += "</section>";

        finalHtml = insertProperty(finalHtml, "description", html);

        return finalHtml;
    };

    // Even handling for ANNOTATION, SEARCH, MODEL
    var actions = {
        annotation: function (event) {

            console.log("annotation event: ", event);

            if (event.srcElement.className == "checkbox" && event.srcElement.checked == true) {
                var idWithStr = event.srcElement.id;
                var n = idWithStr.search("#");
                var id = idWithStr.slice(n + 1, idWithStr.length);

                // id
                var index = idWithStr.search(".cellml");
                var workspaceName = idWithStr.slice(0, index);

                /*
                 * TODO: choose multiple checkboxes, mainUtils.workspaceName array!!
                 * TODO: Choose multiple items from the search results
                 * */
                mainUtils.workspaceName = workspaceName;

                var vEndPoint = "https://models.physiomeproject.org/workspace" + "/" + workspaceName + "/" + "rawfile" +
                    "/" + "HEAD" + "/" + idWithStr;

                // Get variable name for a particular CellML Id
                mainUtils.showVariableName = function (str) {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(str, "text/xml");

                    var vHtml = event.srcElement.parentElement;

                    // Look up by variable tag
                    for (var i = 0; i < xmlDoc.getElementsByTagName("variable").length; i++) {
                        if (xmlDoc.getElementsByTagName("variable")[i].getAttribute("cmeta:id") == id) {
                            vHtml.innerHTML += '<hr>';
                            vHtml.innerHTML += id + '<br>';
                            vHtml.innerHTML += xmlDoc.getElementsByTagName("variable")[i].getAttribute("name") + '<br>';
                            vHtml.innerHTML += '<hr>';
                        }
                    }
                };

                $ajaxUtils.sendGetRequest(vEndPoint, mainUtils.showVariableName, false);
            }
        },

        search: function (event) {

            console.log("search event: ", event);

            if (event.srcElement.className == "checkbox" && event.srcElement.checked == true) {
                var idWithStr = event.srcElement.id;
                var index = idWithStr.search("#");
                var workspaceName = idWithStr.slice(0, index);

                // mainUtils.workspaceName.push(workspaceName);
                mainUtils.workspaceName = workspaceName;
            }
        },

        model: function (event) {

            console.log("model event: ", event);

            if (event.srcElement.className == "checkbox" && event.srcElement.checked == true) {

                if (document.getElementsByClassName("checkbox")[0].checked == true) {
                    for (var i = 0; i < $('table tr').length; i++) {
                        if (i == 0) {
                            mainUtils.templistOfModel.push(event.srcElement);
                        }

                        // Assign TRUE to all table data
                        if (i < $('table tr').length - 1)
                            $('table tr td label')[i].firstChild.checked = true;
                    }
                }
                else {
                    mainUtils.templistOfModel.push(event.srcElement);

                    var idWithStr = event.srcElement.id;
                    var index = idWithStr.search("#");
                    var workspaceName = idWithStr.slice(0, index);

                    // mainUtils.workspaceName.push(workspaceName);
                    mainUtils.workspaceName = workspaceName;
                }
            }
        }
    };

    // Even invocation to ANNOTATION, SEARCH, MODEL
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
    }
    ;

    /*
     * TODO: Checkboxes do not show up in the Github link
     * TODO: Should make a common table platform for all functions
     * */
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
            temp.push(modelEntity[i], biologicalMeaning[i], speciesList[i], geneList[i], proteinList[i]);

            for (var j = 0; j < temp.length; j++) {
                if (j == 0) {
                    td[j] = document.createElement("td");
                    var label = document.createElement('label');
                    label.innerHTML = '<input id="' + modelEntity[i] + '" type="checkbox" data-action="search" value="' +
                        modelEntity[i] + '" class="checkbox"></label>';

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

    // Utility function to extract a model name
    var parseModel = function (modelEntity) {
        var indexOfCellML = modelEntity.search(".cellml");
        var indexOfHash = modelEntity.search("#");
        var modelName = modelEntity.slice(0, indexOfCellML);
        var modelNameWithExt = modelEntity.slice(0, indexOfHash + 1);
        var model = modelNameWithExt.concat(modelName);

        return model;
    }

    // Table headers in search table
    var headTitle = function (jsonModel, jsonSpecies, jsonGene, jsonProtein) {
        var head = [];

        for (var i = 0; i < jsonModel.head.vars.length; i++)
            head.push(jsonModel.head.vars[i]);

        head.push(jsonSpecies.head.vars[0]);
        head.push(jsonGene.head.vars[0]);
        head.push(jsonProtein.head.vars[0]);

        return head;
    }

    /*
     * TODO: make it more efficient, use less variables
     * */
    // Plain text search for semantic annotation
    document.addEventListener('keydown', function (event) {
        if (event.key == 'Enter') {

            /*
             * TODO: regular expression
             * */
            var searchTxt = document.getElementById("searchTxt").value;

            // set local storage
            sessionStorage.setItem('searchTxtContent', searchTxt);

            var query = 'SELECT ?Model_entity ?Biological_meaning WHERE ' +
                '{ GRAPH ?Workspace { ?Model_entity ?Location ?Biological_meaning . ' +
                'FILTER regex(str(?Biological_meaning), "' + searchTxt + '", "i") . ' +
                '}}';

            showLoading("#searchList");

            // Index to get model name for species, genes, and breaking condition
            var idxSpecies = 0, idxGene = 0, idxBreak = 0;
            var modelEntity = [], biologicalMeaning = [];
            var speciesList = [], geneList = [], proteinList = [];
            var head = [];

            // Model
            $ajaxUtils.sendPostRequest(
                endpoint,
                query,
                function (jsonModel) {
                    for (var id = 0; id < jsonModel.results.bindings.length; id++) {
                        modelEntity.push(jsonModel.results.bindings[id].Model_entity.value);
                        biologicalMeaning.push(jsonModel.results.bindings[id].Biological_meaning.value);

                        var model = parseModel(jsonModel.results.bindings[id].Model_entity.value);
                        var query = 'SELECT ?Species WHERE { <' + model + '> <http://purl.org/dc/terms/Species> ?Species }';

                        // Species
                        $ajaxUtils.sendPostRequest(
                            endpoint,
                            query,
                            function (jsonSpecies) {
                                if (jsonSpecies.results.bindings.length == 0)
                                    speciesList.push("Undefined");
                                else
                                    speciesList.push(jsonSpecies.results.bindings[0].Species.value);

                                model = parseModel(jsonModel.results.bindings[idxSpecies++].Model_entity.value);

                                var query = 'SELECT ?Gene WHERE { <' + model + '> <http://purl.org/dc/terms/Gene> ?Gene }';

                                // Gene
                                $ajaxUtils.sendPostRequest(
                                    endpoint,
                                    query,
                                    function (jsonGene) {
                                        if (jsonGene.results.bindings.length == 0)
                                            geneList.push("Undefined");
                                        else
                                            geneList.push(jsonGene.results.bindings[0].Gene.value);

                                        model = parseModel(jsonModel.results.bindings[idxGene++].Model_entity.value);

                                        var query = 'SELECT ?Protein WHERE ' +
                                            '{ <' + model + '> <http://purl.org/dc/terms/Protein> ?Protein }';

                                        // Protein
                                        $ajaxUtils.sendPostRequest(
                                            endpoint,
                                            query,
                                            function (jsonProtein) {
                                                if (jsonProtein.results.bindings.length == 0)
                                                    proteinList.push("Undefined");
                                                else
                                                    proteinList.push(jsonProtein.results.bindings[0].Protein.value);

                                                idxBreak++;

                                                if (idxBreak == jsonModel.results.bindings.length) {
                                                    head = headTitle(jsonModel, jsonSpecies, jsonGene, jsonProtein);

                                                    mainUtils.searchList(
                                                        head,
                                                        modelEntity,
                                                        biologicalMeaning,
                                                        speciesList,
                                                        geneList,
                                                        proteinList);
                                                }
                                            },
                                            true);
                                    },
                                    true);
                            },
                            true);
                    }

                    // No search results found, so sent empty arrays
                    if (!jsonModel.results.bindings.length) {
                        mainUtils.searchList(head, modelEntity, biologicalMeaning, speciesList, geneList, proteinList);
                    }
                },
                true
            );
        }
    });

    // Load the view
    mainUtils.loadViewHtml = function () {

        var cellmlModel = mainUtils.workspaceName;

        var indexOfCellML = cellmlModel.search(".cellml");
        var modelName = "#" + cellmlModel.slice(0, indexOfCellML);
        var subject = cellmlModel.concat(modelName);

        var query = 'SELECT ?Workspace ?Title ?Author ?Abstract ?Keyword ?Protein ?Species ?Gene ?Compartment ?Located_in ?DOI ' +
            'WHERE { GRAPH ?Workspace { ' +
            '<' + subject + '> <http://purl.org/dc/terms/title> ?Title . ' +
            'OPTIONAL { <' + subject + '> <http://www.w3.org/2001/vcard-rdf/3.0#FN> ?Author } . ' +
            'OPTIONAL { <' + subject + '> <http://purl.org/dc/terms/Abstract> ?Abstract } . ' +
            'OPTIONAL { <' + subject + '> <http://purl.org/dc/terms/Keyword> ?Keyword } . ' +
            'OPTIONAL { <' + subject + '> <http://purl.org/dc/terms/Protein> ?Protein } . ' +
            'OPTIONAL { <' + subject + '> <http://purl.org/dc/terms/Species> ?Species } . ' +
            'OPTIONAL { <' + subject + '> <http://purl.org/dc/terms/Gene> ?Gene } . ' +
            'OPTIONAL { <' + subject + '> <http://purl.org/dc/terms/Compartment> ?Compartment } . ' +
            'OPTIONAL { <' + subject + '> <http://www.obofoundry.org/ro/ro.owl#located_in> ?Located_in } . ' +
            'OPTIONAL { <' + subject + '> <http://biomodels.net/model-qualifiers/isDescribedBy> ?DOI } . ' +
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

    /*
     * TODO: make a valid url
     * */
    // Test a valid URL
    var isURL = function (str) {
        // var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        //     '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
        //     '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        //     '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        //     '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        //     '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        // return pattern.test(str);

        if (str.indexOf("http") === -1)
            return false;

        return true;
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

    // Show a selected entry from the search results
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
                // Checking a valid URL
                if (isURL(tempValue)) {
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

        var indexOfCellML = cellmlModel.search(".cellml");
        var modelName = "#" + cellmlModel.slice(0, indexOfCellML);
        var subject = cellmlModel.concat(modelName); // e.g. weinstein_1995.cellml#weinstein_1995

        var query = 'SELECT ?Model_entity ?Protein ?Species ?Gene ' +
            'WHERE { GRAPH ?Workspace { ' +
            'OPTIONAL { ?Model_entity <http://purl.org/dc/terms/Protein> ?Protein } . ' +
            'OPTIONAL { ?Model_entity <http://purl.org/dc/terms/Species> ?Species } . ' +
            'OPTIONAL { ?Model_entity <http://purl.org/dc/terms/Gene> ?Gene } . ' +
            'FILTER (?Model_entity = <' + subject + '>) . ' +
            '}}';

        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            modelHtml,
            function (modelHtmlContent) {
                insertHtml("#main-content", modelHtmlContent);

                $ajaxUtils.sendPostRequest(endpoint, query, mainUtils.showModel, true);
            },
            false);
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
        mainUtils.headCount = jsonObj.head.vars.length;
        for (var i = 0; i < jsonObj.head.vars.length; i++) {
            if (i == 0) {
                var th = document.createElement("th");
                mainUtils.headId = jsonObj.head.vars[0];
                tr.id = mainUtils.headId;
                var label = document.createElement('label');
                label.innerHTML = '<input id="' + mainUtils.headId + '" type="checkbox" data-action="model" value="' +
                    mainUtils.headId + '" class="checkbox"></label>';

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
                var id = jsonObj.results.bindings[i].Model_entity.value;
                var label = document.createElement('label');
                label.innerHTML = '<input id="' + id + '" type="checkbox" data-action="model" value="' +
                    id + '" class="checkbox"></label>';

                mainUtils.model.push(label);
            }
            mainUtils.model.push(jsonObj.results.bindings[0][jsonObj.head.vars[i]].value);
        }

        // 1D to 2D array
        while (mainUtils.model.length) mainUtils.model2DArr.push(mainUtils.model.splice(0, 5));

        var td = [];
        var tbody = document.createElement("tbody");
        for (var ix = 0; ix < mainUtils.model2DArr.length; ix++) {
            var tr = document.createElement("tr");
            // +1 for adding checkbox column
            for (var j = 0; j < jsonObj.head.vars.length + 1; j++) {
                td[j] = document.createElement("td");
                if (j == 0)
                    td[j].appendChild(mainUtils.model2DArr[ix][j]);
                else
                    td[j].appendChild(document.createTextNode(mainUtils.model2DArr[ix][j]));

                // Id for each row
                if (j == 1)
                    tr.setAttribute("id", mainUtils.model2DArr[ix][j]);

                tr.appendChild(td[j]);
            }

            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        modelList.appendChild(table);
    };

    mainUtils.deleteRowModelHtml = function () {
        /*
         * TODO: Uncheck and then check does not work
         */
        // IF header checkbox exist, but length of pre processed
        // list of models is greater than 1, delete header checkbox
        if (mainUtils.templistOfModel.length > 1) {
            for (var i = 0; i < mainUtils.templistOfModel.length; i++) {
                if ($('table tr th label')[0].firstChild.id == mainUtils.templistOfModel[i].id) {
                    mainUtils.templistOfModel.splice(i, 1);
                }
            }
        }

        console.log("mainUtils.templistOfModel: ", mainUtils.templistOfModel);
        // Handling current instance of (un)checked status
        for (var i = 0; i < mainUtils.templistOfModel.length; i++) {
            // IF header checkbox is selected
            console.log("TRUE mainUtils.templistOfModel: ", mainUtils.templistOfModel);
            console.log("TRUE mainUtils.listOfModels: ", mainUtils.listOfModels);
            if (mainUtils.templistOfModel[i].checked == true) {
                if ($('table tr th label')[0].firstChild.id == mainUtils.templistOfModel[0].id) {

                    console.log("$('table tr td'): ", $('table tr td label')[i].firstChild.checked);

                    for (var i = 0; i < mainUtils.model2DArr.length; i++) {
                        mainUtils.listOfModels.push(mainUtils.model2DArr[i][1]);
                    }
                }
                else {
                    mainUtils.listOfModels.push(mainUtils.templistOfModel[i].id);
                }
            }
        }

        console.log("mainUtils.listOfModels BEFORE: ", mainUtils.listOfModels);

        var hasElement = function (id) {
            for (var i = 0; i < $('table tr').length; i++) {

                if ($('table tr')[i].id == id) {
                    // Remove selected row
                    $('table tr')[i].remove();

                    // Remove the selected row from the model2DArr that
                    // populated the table, see showModel function
                    for (var i = 0; i < mainUtils.model2DArr.length; i++) {
                        if (mainUtils.model2DArr[i][1] == id)
                            mainUtils.model2DArr.splice(i, 1);
                    }

                    return id;
                }
            }
        };

        var deleted = mainUtils.listOfModels.filter(hasElement);

        // Remove deleted items from the list of models
        for (var i = 0; i < deleted.length; i++) {
            for (var j = 0; j < mainUtils.listOfModels.length; j++) {
                if (mainUtils.listOfModels[j] == deleted[i])
                    mainUtils.listOfModels.splice(j, 1);
            }
        }

        console.log("mainUtils.listOfModels AFTER: ", mainUtils.listOfModels);
        console.log("deleted: ", deleted);
        console.log("table: ", $('table tr'));

        // Un-check header checkbox if body is empty
        if ($('table tr th label')[0].firstChild.checked == true) {
            if ($('table tr').length == 1)
                $('table tr th label')[0].firstChild.checked = false;
        }
    };

    /*
     * TODO: Show them nicely in the epithelial model
     * */
    mainUtils.loadEpithelialHtml = function () {
        var deleteElement = function (id) {

            for (var i = 0; i < $('table tr').length; i++) {

                if ($('table tr')[i].id == 0)
                    continue;

                if ($('table tr')[i].id == id) {
                    listOfItemsForEpithelial.push($('table tr')[i]);
                    table.deleteRow(i);

                    return id;
                }
            }
        };

        var deleted = mainUtils.listOfModels.filter(deleteElement);
        console.log(deleted);

        showLoading("#main-content");

        $ajaxUtils.sendGetRequest(
            epithelialHtml,
            function (epithelialHtmlContent) {
                insertHtml("#main-content", epithelialHtmlContent);

                $ajaxUtils.sendGetRequest(epithelialHtml, mainUtils.showEpithelial, false);
            },
            false);
    }

    mainUtils.showEpithelial = function (epithelialHtmlContent) {

        // List of compartments
        var compartmentsList = document.getElementById("compartmentsList");

        for (var i = 0; i < listOfItemsForEpithelial.length; i++) {

            if (mainUtils.listOfModels.length == 0)
                break;

            for (var j = 0; j < mainUtils.listOfModels.length; j++) {
                if (mainUtils.listOfModels[j] == listOfItemsForEpithelial[i].id) {
                    compartmentsList.innerHTML += '<p id="drag1" draggable="true" ondragstart="$mainUtils.drag(event)">' +
                        listOfItemsForEpithelial[i].getElementsByTagName('td')[3].innerText + '</p>';
                }
            }
        }

        // SVG diagram
        var g = document.getElementById("#svgVisualize"),
            width = 800,
            height = 800;

        var mainUtils = {};

        var svg = d3.select("#svgVisualize").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g");

        // line
        var data = [
            {x: 0, y: 0},
            {x: 20, y: 0}
        ];

        // line for paracellular pathway
        var dataParacellular = [
            {x: 10, y: 415},
            {x: 10, y: 485}
        ];

        // function to get line data
        var lineFunc = d3.line()
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return d.y;
            });

        // line in paracellular
        svg.append("svg:path")
            .attr("transform", "translate(30,0)")
            .attr("d", lineFunc(dataParacellular))
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .style("stroke-dasharray", "5, 5")
            .attr("id", "paracellular");

        // rectangle
        var rectangle = svg.attr("transform", "translate(150,50)")
            .append("rect")
            .attr("width", 300)
            .attr("height", 400)
            .attr("rx", 10)
            .attr("ry", 20)
            .attr("fill", "white")
            .attr("stroke", "#7bb3f7")
            .attr("stroke-width", 20);

        var luminalCompartments = [];
        var serosalCompartments = [];

        var compartmentFunc = function (compartment) {
            if (compartment == "luminal")
                luminalCompartments.push(compartment);
            else if (compartment == "serosal")
                serosalCompartments.push(compartment);
        };

        var circles = [];
        var circlePos = 0;
        var radius = 15;

        for (var i = 0; i < 3; i++) {
            if (i % 2 == 0) {
                circles[i] = svg.append("circle")
                    .attr("transform", "translate(-100," + circlePos + ")")
                    .attr("cx", 10)
                    .attr("cy", 10)
                    .attr("r", radius)
                    .attr("fill", "lightgreen")
                    .attr("id", "luminal");
            }
            else {
                circles[i] = svg.append("circle")
                    .attr("transform", "translate(-100," + circlePos + ")")
                    .attr("cx", 10)
                    .attr("cy", 10)
                    .attr("r", radius)
                    .attr("fill", "purple")
                    .attr("id", "serosal");
            }

            compartmentFunc(circles[i]._groups[0][0].getAttribute("id"));
            circlePos = circlePos + 50;
        }

        console.log(rectangle._groups[0][0]);
        console.log("height: ", rectangle._groups[0][0].getAttribute("height"));
        console.log("width: ", rectangle._groups[0][0].getAttribute("width"));

        // variables used to plot lines in compartments
        var rectHeight = rectangle._groups[0][0].getAttribute("height");
        var rectWidth = rectangle._groups[0][0].getAttribute("width");
        var lengthOfLuminal = luminalCompartments.length;
        var lengthOfSerosal = serosalCompartments.length;
        var luminal = [], serosal = [];

        // components in luminal compartment
        for (var i = 50, j = 0; i < rectHeight; i = i + 50, j++) {

            lengthOfLuminal--;
            if (lengthOfLuminal < 0)
                break;

            luminal[j] = svg.append("svg:path")
                .attr("transform", "translate(-20, " + i + ")")
                .attr("d", lineFunc(data))
                .attr("stroke", "black")
                .attr("stroke-width", 5)
                .attr("id", "luminal");
        }

        console.log(luminal[0]._groups[0][0]);
        console.log(luminal[1]._groups[0][0]);

        // components in serosal compartment
        for (var i = 50, j = 0; i < rectHeight; i = i + 50, j++) {

            lengthOfSerosal--;
            if (lengthOfSerosal < 0)
                break;

            serosal[j] = svg.append("svg:path")
                .attr("transform", "translate(" + rectWidth + ", " + i + ")")
                .attr("d", lineFunc(data))
                .attr("stroke", "black")
                .attr("stroke-width", 5)
                .attr("id", "serosal");
        }

        console.log(serosal[0]._groups[0][0]);

        // line drag and drop
        svg.selectAll("path")
            .on("mouseover", handleMouseOver);

        function handleMouseOver(d) {
            //console.log("handleMouseOver: ", d3.select(this)._groups[0][0].id);
            console.log("handleMouseOver: ", this.getAttribute("id"));

            $mainUtils.line = this;

            d3.select("path#" + this.getAttribute("id") + "").raise().classed("active", true);

            // If circle is red, change back to previous color
            if ($mainUtils.circle.getAttribute("fill") == "red") {
                d3.select($mainUtils.circle)
                    .attr("fill", $mainUtils.fillback);
            }

            //If circle is placed in wrong compartment
            //change its color to red
            if ($mainUtils.circle.getAttribute("id") != $mainUtils.line.getAttribute("id")) {
                $mainUtils.fillback = $mainUtils.circle.getAttribute("fill");

                d3.select($mainUtils.circle)
                    .attr("fill", "red");
            }
        }

        // circle drag and drop
        svg.selectAll("circle")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        function dragstarted(d) {
            // If circle is red, change back to previous color
            if (this.getAttribute("fill") == "red") {
                d3.select(this)
                    .attr("fill", $mainUtils.fillback);
            }

            //d3.select("path#" + $mainUtils.circle.getAttribute("id") + "").raise().classed("active", true);
        }

        function dragged(d) {
            d3.select(this)
                .attr("cx", d = d3.mouse(this)[0])
                .attr("cy", d = d3.mouse(this)[1]);
        }

        function dragended(d) {
            d3.select(this)
                .classed("active", false);

            $mainUtils.circle = this;

            d3.select("path#" + $mainUtils.circle.getAttribute("id") + "").raise().classed("active", true);
        }

        svg.append("svg:path")
            .attr("transform", "translate(0,500)")
            .attr("d", "M0,0 L300,0 V0,100 M0,-10 V0,100")
            .attr("fill", "none")
            .attr("stroke", "#7bb3f7")
            .attr("stroke-width", 20);
    }

    // Expose utility to the global object
    global.$mainUtils = mainUtils;
})
(window);
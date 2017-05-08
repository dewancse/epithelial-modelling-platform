/**
 * Created by dsar941 on 5/8/2017.
 */
var endpoint = require("../index.js").endpoint;
var modelHtml = require("../index.js").modelHtml;
var table = require("../index.js").table;
var findActiveItem = require("../utils/misc").findActiveItem;
var switchListItemToActive = require("../utils/misc").switchListItemToActive;
var insertHtml = require("../utils/misc.js").insertHtml;
var mainUtilsWorkspaceName = require("../utils/actions.js").mainUtilsWorkspaceName;

var loadViewHtml = require("./viewModel").loadViewHtml;
var deleteRowModelHtml = require("./deleteModels").deleteRowModelHtml;
var loadSVGModelHtml = require("./svgModels").loadSVGModelHtml;
var loadEpithelialHtml = require("../epithelial/epithelial.js").loadEpithelialHtml;

// selected models in load models
var model = [], model2DArray = [];

var view = document.getElementById("viewBtn");
view.onclick = loadViewHtml();

var confirm = document.getElementById("confirmBtn");
confirm.onclick = loadEpithelialHtml();

var del = document.getElementById("deleteBtn");
del.onclick = deleteRowModelHtml();

var visualization = document.getElementById("visualizationBtn");
visualization.onclick = loadSVGModelHtml();

// Load the model
var loadModelHtml = function () {

    var cellmlModel = mainUtilsWorkspaceName;

    var query = 'SELECT ?Model_entity ?Protein ?Species ?Gene ?Compartment ' +
        'WHERE { GRAPH ?Workspace { ' +
        'OPTIONAL { ' + '<' + cellmlModel + '#Protein> <http://purl.org/dc/terms/description> ?Protein } . ' +
        'OPTIONAL { ?Model_entity <http://purl.org/dc/terms/description> ?Protein } . ' +
        'OPTIONAL { ' + '<' + cellmlModel + '#Species> <http://purl.org/dc/terms/description> ?Species } . ' +
        'OPTIONAL { ' + '<' + cellmlModel + '#Gene> <http://purl.org/dc/terms/description> ?Gene } . ' +
        'OPTIONAL { ' + '<' + cellmlModel + '#Compartment> <http://purl.org/dc/terms/description> ?Compartment } . ' +
        '}}';

    // showLoading("#home-content");
    $ajaxUtils.sendGetRequest(
        modelHtml,
        function (modelHtmlContent) {
            insertHtml("#home-content", modelHtmlContent);

            $ajaxUtils.sendPostRequest(endpoint, query, showModel, true);
        },
        false);

    // Switch from current active button to models button
    var activeItem = "#" + findActiveItem();
    switchListItemToActive(activeItem, "#listModels");
};

// Show selected items in a table
var showModel = function (jsonObj) {

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

exports.loadModelHtml = loadModelHtml;
exports.model2DArray = model2DArray;
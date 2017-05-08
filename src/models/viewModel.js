/**
 * Created by dsar941 on 5/8/2017.
 */
var endpoint = require("../index.js").endpoint;
var viewHtml = require("../index.js").viewHtml;
var mainUtilsWorkspaceName = require("../utils/actions.js").mainUtilsWorkspaceName;
var insertHtml = require("../utils/misc.js").insertHtml;
var showLoading = require("../utils/misc.js").showLoading;
var createAnchor = require("./utilities").createAnchor;
var searchFn = require("./utilities").searchFn;

// Load the view
var loadViewHtml = function () {

    var cellmlModel = mainUtilsWorkspaceName;

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

    showLoading("#home-content");
    $ajaxUtils.sendPostRequest(
        endpoint,
        query,
        function (jsonObj) {
            $ajaxUtils.sendGetRequest(
                viewHtml,
                function (viewHtmlContent) {
                    insertHtml("#home-content", viewHtmlContent);
                    $ajaxUtils.sendPostRequest(endpoint, query, showView, true);
                },
                false);
        },
        true);
};

// Show a selected entry from search results
var showView = function (jsonObj, viewHtmlContent) {

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

exports.loadViewHtml = loadViewHtml;
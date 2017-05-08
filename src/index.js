/**
 * Created by dsar941 on 9/8/2016.
 */

var endpoint = "https://models.physiomeproject.org/pmr2_virtuoso_search";
var searchHtml = "snippets/search.html";
var modelHtml = "snippets/model.html";
var viewHtml = "snippets/view.html";
var svgmodelHtml = "snippets/svgmodel.html";
var svgepithelialHtml = "snippets/svgepithelial.html";
var loadHomeHtml = require("./home/home.js").loadHomeHtml;
var loadHelp = require("./documentation/help.js").loadHelp;
var loadSearchHtml = require("./discovery/modelDiscovery.js").loadSearchHtml;
var loadModelHtml = require("./models/models").loadModelHtml;
var actions = require("./utils/actions.js").actions;

// Initial declarations for a table
var table = document.createElement("table");
table.className = "table";

var home = document.getElementById("listHome");
home.onclick = loadHomeHtml();

var help = document.getElementById("documentation");
help.onclick = loadHelp();

// Event invocation to SEARCH, MODEL
document.addEventListener('click', function (event) {
    console.log("event: ", event);
    // If there's an action with the given name, call it
    if (typeof actions[event.srcElement.dataset.action] === "function") {
        actions[event.srcElement.dataset.action].call(this, event);
    }
})

var discovery = document.getElementById("listDiscovery");
discovery.onclick = loadSearchHtml();

var models = document.getElementById("listModels");
models.onclick = loadModelHtml();

exports.table = table;
exports.endpoint = endpoint;
exports.searchHtml = searchHtml;
exports.modelHtml = modelHtml;
exports.viewHtml = viewHtml;
exports.svgmodelHtml = svgmodelHtml;
exports.svgepithelialHtml = svgepithelialHtml;
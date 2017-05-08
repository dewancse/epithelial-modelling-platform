/**
 * Created by dsar941 on 5/8/2017.
 */
var findActiveItem = require("../utils/misc.js").findActiveItem;
var switchListItemToActive = require("../utils/misc.js").switchListItemToActive;
var insertHtml = require("../utils/misc.js").insertHtml;

var loadHelp = function () {
    var activeItem = "#" + findActiveItem();
    switchListItemToActive(activeItem, "#documentation");

    insertHtml("#home-content", "...Coming soon");
};

exports.loadHelp = loadHelp;
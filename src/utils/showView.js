/**
 * Created by dsar941 on 5/11/2017.
 */
var createAnchor = require("../utils/misc.js").createAnchor;
var searchFn = require("../utils/misc.js").searchFn;

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

exports.showView = showView;
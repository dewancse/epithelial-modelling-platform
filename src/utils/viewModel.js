/**
 * Created by dsar941 on 5/11/2017.
 */
var createAnchor = require("./miscellaneous.js").createAnchor;
var searchFn = require("./miscellaneous.js").searchFn;

// Show a selected entry from search results
var viewModel = function (jsonObj) {

    // console.log("viewModel jsonObj: ", jsonObj);

    for (var i = 0; i < jsonObj.head.vars.length; i++) {
        var divHead = $("<div/>").addClass("h4").css("font-weight", "bold");

        var divText = $("<div/>").addClass("p");

        divHead.append(jsonObj.head.vars[i]);
        divHead.append($("<hr/>"));
        $("#viewList").append(divHead);

        var tempArrayOfURL = [];
        var tempArray = [];

        // IF more than one result in the JSON object
        for (var j = 0; j < jsonObj.results.bindings.length; j++) {

            var tempValue;
            if (i == 1) {
                tempValue = jsonObj.results.bindings[j][jsonObj.head.vars[i - 1]].value + "/" +
                    "rawfile" + "/" + "HEAD" + "/" + jsonObj.results.bindings[j][jsonObj.head.vars[i]].value;
            }
            else {
                tempValue = jsonObj.results.bindings[j][jsonObj.head.vars[i]].value;
            }

            // TODO: regular expression to validate a URL
            if (tempValue.indexOf("http") != -1) {
                var aText = createAnchor(tempValue);
                tempArrayOfURL.push(tempValue);
                if (searchFn(tempValue, tempArrayOfURL) <= 1)
                    divText.append(aText);
            }
            else {
                tempArray.push(tempValue);
                if (searchFn(tempValue, tempArray) <= 1)
                    divText.append(tempValue);
            }

            $("#viewList").append(divText);

            var divText = $("<div/>").addClass("p");
        }

        $("#viewList").append("<br>");
    }
};

exports.viewModel = viewModel;
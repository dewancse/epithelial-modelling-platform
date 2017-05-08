/**
 * Created by dsar941 on 5/8/2017.
 */
var model2DArray = require("./models").model2DArray;
var table = require("../index.js").table;
var templistOfModel = [];

var deleteRowModelHtml = function () {
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

exports.deleteRowModelHtml = deleteRowModelHtml;
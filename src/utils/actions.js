/**
 * Created by dsar941 on 5/8/2017.
 */
var mainUtilsWorkspaceName;
var templistOfModel = require("../models/deleteModels.js").templistOfModel;

var modelEntityName,
    modelEntityNameArray = [],
    modelEntityFullNameArray = [];

// Event handling for SEARCH, MODEL
var actions = {
    search: function (event) {

        console.log("search event: ", event);

        if (event.srcElement.className == "checkbox") {

            if (event.srcElement.checked) {
                var idWithStr = event.srcElement.id;
                var index = idWithStr.search("#");
                var workspaceName = idWithStr.slice(0, index);

                mainUtilsWorkspaceName = workspaceName;

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

                if (modelEntityName.indexOf("21042017112802526p1200") != -1) {

                    var indexOfHash = modelEntityName.search("#");
                    modelEntityName = "wilkins_sneyd_1998" + modelEntityName.slice(indexOfHash);
                }

                if (modelEntityName.indexOf("23042017142938531p1200") != -1) {

                    var indexOfHash = modelEntityName.search("#");
                    modelEntityName = "warren_2010" + modelEntityName.slice(indexOfHash);
                }
                if (modelEntityName.indexOf("20042017200857265p1200") != -1) {

                    var indexOfHash = modelEntityName.search("#");
                    modelEntityName = "sneyd_1995" + modelEntityName.slice(indexOfHash);
                }

                if (modelEntityName.indexOf("22042017214418158p1200") != -1) {

                    var indexOfHash = modelEntityName.search("#");
                    modelEntityName = "bindschadler_sneyd_2001" + modelEntityName.slice(indexOfHash);
                }
            }
            else {
                mainUtilsWorkspaceName = "";
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

            // mainUtilsWorkspaceName.push(workspaceName);
            mainUtilsWorkspaceName = workspaceName;
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

exports.actions = actions;
exports.templistOfModel = templistOfModel;
exports.modelEntityName = modelEntityName;
exports.modelEntityNameArray = modelEntityNameArray;
exports.modelEntityFullNameArray = modelEntityFullNameArray;
exports.mainUtilsWorkspaceName = mainUtilsWorkspaceName;



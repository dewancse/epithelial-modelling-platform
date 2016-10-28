/**
 * Created by dsar941 on 9/8/2016.
 */

(function (global) {
    'use strict';

    var endpoint = "https://models.physiomeproject.org/pmr2_virtuoso_search";
    var query = 'SELECT ?id WHERE { ?id  <http://biomodels.net/biology-qualifiers/isVersionOf> ' +
        '<http://identifiers.org/go/GO:0005272> }';

    var label = [];

    // Set up a namespace for our utility
    var indexUtils = {};

    indexUtils.showWorkspace = function (jsonObj) {

        var workspaceList = document.getElementById("workspacelist");

        for (var i = 0; i < jsonObj.results.bindings.length; i++) {

            // id with workspace name as a string
            var idWithStr = jsonObj.results.bindings[i].id.value;
            var index = idWithStr.search(".cellml");
            var workspaceName = idWithStr.slice(0, index);

            var workspaceUrl = "https://models.physiomeproject.org/workspace" + "/" + workspaceName + "/" + "@@file" +
                "/" + "HEAD" + "/" + jsonObj.results.bindings[i].id.value;

            label[i] = document.createElement("label");
            label[i].id = idWithStr;
            label[i].innerHTML = '<input id="' + label[i].id + '" type="checkbox" value="" class="checkbox-inline"> ';
            label[i].innerHTML += '<a href=' + workspaceUrl + ' + target=_blank>' + workspaceName + " / " + idWithStr +
                '</a></label>';

            workspaceList.appendChild(label[i]);
            workspaceList.appendChild(document.createElement("br"));
        }
    };

    document.addEventListener('click', function (event) {
        if (event.srcElement.className == "checkbox-inline" && event.srcElement.checked == true) {

            console.log(event);

            var idWithStr = event.srcElement.id;
            var n = idWithStr.search("#");
            var id = idWithStr.slice(n + 1, idWithStr.length);

            // id
            var index = idWithStr.search(".cellml");
            var workspaceName = idWithStr.slice(0, index);

            var vEndPoint = "https://models.physiomeproject.org/workspace" + "/" + workspaceName + "/" + "rawfile" +
                "/" + "HEAD" + "/" + idWithStr;

            indexUtils.showVariableName = function (str) {
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

            $ajaxUtils.sendGetRequest(vEndPoint, indexUtils.showVariableName, false);
        }
    });

    $(document).ready(function () {

        $ajaxUtils.sendPostRequest(endpoint, query, indexUtils.showWorkspace, true);

    });

    // Expose utility to the global object
    global.$indexUtils = indexUtils;

})(window);
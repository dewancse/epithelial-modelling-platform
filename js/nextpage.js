/**
 * Created by dsar941 on 10/5/2016.
 */

var test = function () {
    var t = document.getElementById("workspacelist");
    var item = ["one", "two", "three", "four", "five"];
    var label = [];
    for (var i = 0; i < item.length; i++) {
        label[i] = document.createElement('label');
        label[i].className = "checkbox-inline";
        label[i].innerHTML = '<input id="item[i]" type="checkbox" value="item[i]">' + item[i] + '</label>';

        t.appendChild(label[i]);
        t.appendChild(document.createElement("br"));
    }
};

$(document).ready(function () {
    test();
});
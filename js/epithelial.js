/**
 * Created by dsar941 on 10/28/2016.
 */
(function (global) {
    'use strict';

    // Set up a namespace for our utility
    var epithelialUtils = {};
    var luminal = ["Na-Cl cotransporter", "K-Cl cotransporter", "Na channel", "K channel", "Cl channel"];
    var basolateral = ["Na-K-ATPase", "K channel", "Cl channel"];
    var paracellular = ["Na channel", "K channel", "Cl channel"];

    // Convenience function for inserting innerHTML for 'select'
    var insertHtml = function (selector, html) {
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML += html;
    };

    // Show loading icon inside element identified by 'selector'.
    var showLoading = function (selector) {
        var html = "<div class='text-center'>";
        html += "<img src='../images/ajax-loader.gif'></div>";
        insertHtml(selector, html);
    };

    var compartmentsList = function (header, compartments) {
        var html = '<h4 class="list-group-item-heading">' + header + '</h4>';
        html += '<select class="list-group" multiple style="width: 200px">';
        for (var i = 0; i < compartments.length; i++)
            html += '<option class="list-group-item">' + compartments[i] + '</option>';
        html += '</select>';

        insertHtml("#compartmentsList", html);
    };

    compartmentsList("Luminal membrane", luminal);
    compartmentsList("Basolateral membrane", basolateral);
    compartmentsList("Paracellular pathway", paracellular);

    var drag = d3.drag();

    // Expose utility to the global object
    global.$epitheUtils = epithelialUtils;

})(window);

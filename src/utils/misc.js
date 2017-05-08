/**
 * Created by Dewan Sarwar on 5/8/2017.
 */

// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
};

// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<images src='images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
};

// Find the current active menu button
var findActiveItem = function () {
    var classes = document.querySelector("#ulistItems");
    for (var i = 0; i < classes.getElementsByTagName("li").length; i++) {
        if (classes.getElementsByTagName("li")[i].className === "active")
            return classes.getElementsByTagName("li")[i].id;
    }
};

// Remove the class 'active' from source to target button
var switchListItemToActive = function (source, target) {
    // Remove 'active' from source button
    var classes = document.querySelector(source).className;
    classes = classes.replace(new RegExp("active", "g"), "");
    document.querySelector(source).className = classes;

    // Add 'active' to target button if not already there
    classes = document.querySelector(target).className;
    if (classes.indexOf("active") === -1) {
        classes += "active";
        document.querySelector(target).className = classes;
    }
};

exports.findActiveItem = findActiveItem;
exports.switchListItemToActive = switchListItemToActive;
exports.insertHtml = insertHtml;
exports.showLoading = showLoading;

/**
 * Created by dsar941 on 5/8/2017.
 */
// Create anchor tag
var createAnchor = function (value) {
    var aText = document.createElement('a');
    aText.setAttribute('href', value);
    aText.setAttribute('target', "_blank");
    aText.innerHTML = value;
    return aText;
};

// Find duplicate items
var searchFn = function (searchItem, arrayOfItems) {
    var counter = 0;
    for (var i = 0; i < arrayOfItems.length; i++) {
        if (arrayOfItems[i] == searchItem)
            counter++;
    }

    return counter;
};

exports.createAnchor = createAnchor;
exports.searchFn = searchFn;
/**
 * Created by Dewan Sarwar on 5/8/2017.
 */
// parse text from the epithelial name
function parserFmaNameText(fma) {
    var indexOfHash = fma.name.search("#");
    var srctext = fma.name.slice(indexOfHash + 1);
    var indexOfdot = srctext.indexOf('.');

    return srctext.slice(indexOfdot + 1);
}

// extract species, gene, and protein names
var parseModelName = function (modelEntity) {
    var indexOfHash = modelEntity.search("#");
    var modelName = modelEntity.slice(0, indexOfHash);

    return modelName;
}

// process table headers
var headTitle = function (jsonModel, jsonSpecies, jsonGene, jsonProtein) {
    var head = [];

    // Getting first 2 head title, not i < jsonModel.head.vars.length
    for (var i = 0; i < 2; i++)
        head.push(jsonModel.head.vars[i]);

    head.push(jsonSpecies.head.vars[0]);
    head.push(jsonGene.head.vars[0]);
    head.push(jsonProtein.head.vars[0]);

    return head;
}

function compare(str, tempstr) {

    for (var i = 0; i < str.length; i++) {
        for (var j = 0; j < tempstr.length; j++) {
            if (str[i] == tempstr[j]) {
                return true;
            }
        }
    }

    return false;
}

// remove duplicate model entity and biological meaning
function uniqueifySrcSnkMed(es) {
    var retval = [];
    es.forEach(function (e) {
        for (var j = 0; j < retval.length; j++) {
            if (retval[j] === e)
                return;
        }
        retval.push(e);
    });
    return retval;
}

// remove duplicate model entity and biological meaning
function uniqueifyModelEntity(es) {
    var retval = [];
    es.forEach(function (e) {
        for (var j = 0; j < retval.length; j++) {
            if (retval[j].Model_entity === e.Model_entity &&
                retval[j].Biological_meaning === e.Biological_meaning &&
                retval[j].fma === e.fma)

                return;
        }
        retval.push(e);
    });
    return retval;
}

// Remove duplicate fma
function uniqueifyEpithelial(es) {
    var retval = [];
    es.forEach(function (e) {
        for (var j = 0; j < retval.length; j++) {
            if (retval[j].name === e.name && retval[j].fma === e.fma)
                return;
        }
        retval.push(e);
    });
    return retval;
}

// Remove duplicate links
function uniqueifySVG(es) {
    var retval = [];
    es.forEach(function (e) {
        for (var j = 0; j < retval.length; j++) {
            if (retval[j].source === e.source && retval[j].target === e.target)
                return;
        }
        retval.push(e);
    });
    return retval;
}

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

// TODO: temp solution, fix this in svg
function getTextWidth(text, fontSize, fontFace) {
    var a = document.createElement('canvas');
    var b = a.getContext('2d');
    b.font = fontSize + 'px ' + fontFace;
    return b.measureText(text).width;
}

// Utility to calculate number of iterations
function iteration(length) {
    var sum = 0;
    for (var i = 0; i < length; i++) {
        sum = sum + (length - i - 1);
    }

    return sum;
}

exports.parseModelName = parseModelName;
exports.parserFmaNameText = parserFmaNameText;
exports.headTitle = headTitle;
exports.uniqueifySrcSnkMed = uniqueifySrcSnkMed;
exports.uniqueifyModelEntity = uniqueifyModelEntity;
exports.uniqueifyEpithelial = uniqueifyEpithelial;
exports.uniqueifySVG = uniqueifySVG;
exports.createAnchor = createAnchor;
exports.searchFn = searchFn;
exports.getTextWidth = getTextWidth;
exports.iteration = iteration;
exports.compare = compare;
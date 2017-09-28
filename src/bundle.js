/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * Created by Dewan Sarwar on 5/8/2017.
 */
// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
    $(selector).html("<div class='text-center'><img src='../src/img/ajax-loader.gif'></div>");
};

// Find the current active menu button
var activeMenu = function () {
    for (var i = 0; i < $("#ulistItems li").length; i++) {
        if ($($("#ulistItems li")[i]).attr("class") === "active")
            return $("#ulistItems li")[i].id;
    }
};

// Remove the class 'active' from source to target button
var switchMenuToActive = function (source, target) {
    // Remove 'active' from source button
    var classes = $(source).attr("class");
    classes = classes.replace(new RegExp("active", "g"), "");
    $(source).addClass(classes);

    // Add 'active' to target button if not already there
    classes = $(target).attr("class");
    if (classes != "active") {
        classes += "active";
        $(target).addClass(classes);
    }
};

// remove duplicate model entity and biological meaning
var uniqueify = function (es) {
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

// parse text from the epithelial name
var parserFmaNameText = function (fma) {
    var indexOfHash = fma.name.search("#"),
        srctext = fma.name.slice(indexOfHash + 1),
        indexOfdot = srctext.indexOf('.');

    return srctext.slice(indexOfdot + 1);
}

// extract species, gene, and protein names
var parseModelName = function (modelEntity) {
    var indexOfHash = modelEntity.search("#"),
        modelName = modelEntity.slice(0, indexOfHash);

    return modelName;
}

// process table headers
var headTitle = function (jsonModel, jsonSpecies, jsonGene, jsonProtein) {
    var head = [];

    // Getting first 2 head title, not i < jsonModel.head.vars.length
    // for (var i = 0; i < 2; i++)
    //     head.push(jsonModel.head.vars[i]);

    head.push("Model_entity");
    head.push("Biological_meaning");
    head.push("Species");
    head.push("Gene");
    head.push("Protein");

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
            if (retval[j].fma === e.fma)

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

// Remove duplicate links
function uniqueifyjsonFlux(es) {
    var retval = [];
    es.forEach(function (e) {
        for (var j = 0; j < retval.length; j++) {
            if (retval[j].source_fma.value === e.source_fma.value &&
                retval[j].sink_fma.value === e.sink_fma.value)
                return;
        }

        if (e.source_fma.value != e.sink_fma.value)
            retval.push(e);
    });
    return retval;
}

// Create anchor tag
var createAnchor = function (value) {
    var aText = $("<a/>");
    aText.attr("href", value);
    aText.attr("target", "_blank");
    aText.html(value);
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
    var a = document.createElement('canvas'); // $("<canvas/>");
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
exports.uniqueify = uniqueify;
exports.uniqueifySrcSnkMed = uniqueifySrcSnkMed;
exports.uniqueifyModelEntity = uniqueifyModelEntity;
exports.uniqueifyEpithelial = uniqueifyEpithelial;
exports.uniqueifySVG = uniqueifySVG;
exports.uniqueifyjsonFlux = uniqueifyjsonFlux;
exports.createAnchor = createAnchor;
exports.searchFn = searchFn;
exports.getTextWidth = getTextWidth;
exports.iteration = iteration;
exports.compare = compare;
exports.showLoading = showLoading;
exports.activeMenu = activeMenu;
exports.switchMenuToActive = switchMenuToActive;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// Returns an HTTP request object
function getRequestObject() {
    if (window.XMLHttpRequest) {
        return (new XMLHttpRequest());
    }
    else if (window.ActiveXObject) {
        // For very old IE browsers (optional)
        return (new ActiveXObject("Microsoft.XMLHTTP"));
    }
    else {
        alert("Ajax is not supported!");
        return (null);
    }
}

// Makes an Ajax GET request to 'requestUrl'
var sendGetRequest = function (requestUrl, responseHandler, isJsonResponse) {
    var request = getRequestObject();
    request.onreadystatechange = function () {
        handleResponse(request, responseHandler, isJsonResponse);
    };
    request.open("GET", requestUrl, true);
    request.send(null); // for POST only
};

// Makes an Ajax POST request to 'requestUrl'
var sendPostRequest = function (requestUrl, query, responseHandler, isJsonResponse) {
    var request = getRequestObject();

    request.onreadystatechange = function () {
        handleResponse(request, responseHandler, isJsonResponse);
    };

    request.open("POST", requestUrl, true);

    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.setRequestHeader("Accept", "application/sparql-results+json");

    request.send(query); // for POST only
};


// Only calls user provided 'responseHandler'
// function if response is ready
// and not an error
function handleResponse(request, responseHandler, isJsonResponse) {
    if ((request.readyState == 4) && (request.status == 200)) {

        // Default to isJsonResponse = true
        if (isJsonResponse == undefined) {
            isJsonResponse = true;
        }

        if (isJsonResponse) {
            responseHandler(JSON.parse(request.responseText));
        }
        else {
            responseHandler(request.responseText);
        }
    }
}

exports.sendGetRequest = sendGetRequest;
exports.sendPostRequest = sendPostRequest;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by dsar941 on 5/11/2017.
 */
var solutesBouncing = __webpack_require__(6).solutesBouncing;
var getTextWidth = __webpack_require__(0).getTextWidth;
var uniqueify = __webpack_require__(0).uniqueify;
var uniqueifyjsonFlux = __webpack_require__(0).uniqueifyjsonFlux;
var sendPostRequest = __webpack_require__(1).sendPostRequest;
var sendGetRequest = __webpack_require__(1).sendGetRequest;
var showLoading = __webpack_require__(0).showLoading;

var showsvgEpithelial = function (concentration_fma, source_fma, sink_fma, apicalMembrane, basolateralMembrane, membrane) {

    var apicalID = "http://identifiers.org/fma/FMA:84666";
    var basolateralID = "http://identifiers.org/fma/FMA:84669";
    var paracellularID = "http://identifiers.org/fma/FMA:67394";
    var luminalID = "http://identifiers.org/fma/FMA:74550";
    var cytosolID = "http://identifiers.org/fma/FMA:66836";
    var interstitialID = "http://identifiers.org/fma/FMA:9673";
    var Nachannel = "http://purl.obolibrary.org/obo/PR_000014527";
    var Clchannel = "http://purl.obolibrary.org/obo/PR_Q06393";
    var Kchannel = "http://purl.obolibrary.org/obo/PR_P15387";

    var tempapical = [];
    var tempBasolateral = [];
    var paracellularMembrane = [];

    var endpoint = "https://models.physiomeproject.org/pmr2_virtuoso_search";

    /*
     * relatedModel - all related models
     * relatedModelValue - filtered related models which have #protein
     * relatedModelID - relatedModel which have #protein
     * */
    var relatedModel = [], relatedModelValue = [], relatedModelID = [], workspaceName = "";
    var membraneModel = [], membraneModelValue = [], membraneModelID = [], membraneObject = [];
    var proteinName, proteinText, cellmlModel, biological_meaning, biological_meaning2, speciesName, geneName;
    var idProtein = 0, idAltProtein = 0, idMembrane = 0, loc, typeOfModel, altCellmlModel = "", cthis;
    var icircleGlobal, organIndex, source_name, source_name2;

    var line = [], mindex;

    var dx = [], dy = [],
        dxtext = [], dytext = [], dxtext2 = [], dytext2 = [],
        dx1line = [], dy1line = [], dx2line = [], dy2line = [],
        dx1line2 = [], dy1line2 = [], dx2line2 = [], dy2line2 = [];

    var id = 0;

    var organ = [
        {
            "key": [
                {
                    "key": "http://identifiers.org/fma/FMA:7203",
                    "value": "kidney"
                },
                {
                    "key": "http://identifiers.org/fma/FMA:84666",
                    "value": "apical plasma membrane"
                },
                {
                    "key": "http://identifiers.org/fma/FMA:70973",
                    "value": "epithelial cell of proximal tubule"
                },
                {
                    "key": "http://identifiers.org/fma/FMA:70981",
                    "value": "epithelial cell of Distal tubule"
                },
                {
                    "key": "http://identifiers.org/fma/FMA:17693",
                    "value": "proximal convoluted tubule"
                },
                {
                    "key": "http://identifiers.org/fma/FMA:17721",
                    "value": "distal convoluted tubule"
                },
                {
                    "key": "http://identifiers.org/fma/FMA:66836",
                    "value": "portion of cytosol"
                },
                {
                    "key": "http://identifiers.org/fma/FMA:84669",
                    "value": "basolateralMembrane plasma membrane"
                },
                {
                    "key": "http://identifiers.org/fma/FMA:17716",
                    "value": "proximal straight tubule"
                },
                {
                    "key": "http://identifiers.org/fma/FMA:17717",
                    "value": "ascending limb of loop of Henle"
                },
                {
                    "key": "http://identifiers.org/fma/FMA:17705",
                    "value": "descending limb of loop of Henle"
                },
                {
                    "key": "http://identifiers.org/go/GO:0072061",
                    "value": "inner medullary collecting duct development"
                },
                {
                    "key": "http://identifiers.org/ma/MA:0002595",
                    "value": "renal medullary capillary"
                },
                {
                    "key": "http://identifiers.org/uberon/UBERON:0004726",
                    "value": "vasa recta"
                },
                {
                    "key": "http://identifiers.org/uberon/UBERON:0009091",
                    "value": "vasa recta ascending limb"
                },
                {
                    "key": "http://identifiers.org/uberon/UBERON:0004775",
                    "value": "outer renal medulla vasa recta"
                },
                {
                    "key": "http://identifiers.org/uberon/UBERON:0004776",
                    "value": "inner renal medulla vasa recta"
                }
            ],

            "value": "Kidney"
        }
    ];

    // Extract apical fluxes
    for (var i = 0; i < apicalMembrane.length; i++) {
        tempapical.push({
            srctext: apicalMembrane[i].source_text,
            srcfma: apicalMembrane[i].source_fma,
            snkfma: apicalMembrane[i].sink_fma
        });

        tempapical.push({
            srctext: apicalMembrane[i].source_text2,
            srcfma: apicalMembrane[i].source_fma2,
            snkfma: apicalMembrane[i].sink_fma2
        });
    }

    // Extract basolateral fluxes
    for (var i = 0; i < basolateralMembrane.length; i++) {
        tempBasolateral.push({
            srctext: basolateralMembrane[i].source_text,
            srcfma: basolateralMembrane[i].source_fma,
            snkfma: basolateralMembrane[i].sink_fma
        });

        tempBasolateral.push({
            srctext: basolateralMembrane[i].source_text2,
            srcfma: basolateralMembrane[i].source_fma2,
            snkfma: basolateralMembrane[i].sink_fma2
        });
    }

    // remove apical fluxes from membrane array
    for (var i = 0; i < tempapical.length; i++) {
        for (var j = 0; j < membrane.length; j++) {
            if (tempapical[i].srctext == membrane[j].source_text &&
                tempapical[i].srcfma == membrane[j].source_fma &&
                tempapical[i].snkfma == membrane[j].sink_fma) {

                membrane.splice(j, 1);
            }
        }
    }

    // remove basolateral fluxes from membrane array
    for (var i = 0; i < tempBasolateral.length; i++) {
        for (var j = 0; j < membrane.length; j++) {
            if (tempBasolateral[i].srctext == membrane[j].source_text &&
                tempBasolateral[i].srcfma == membrane[j].source_fma &&
                tempBasolateral[i].snkfma == membrane[j].sink_fma) {

                membrane.splice(j, 1);
            }
        }
    }

    // TODO: now skipping source_name2, etc below, however, it is used to
    // TODO: make cotransporters in the apical and basolateral membrane (see index.js)

    // TODO: Hard coded for Nachannel, Clchannel, Kchannel
    for (var i = 0; i < membrane.length; i++) {
        if (membrane[i].med_fma == apicalID && (membrane[i].med_pr == Nachannel ||
            membrane[i].med_pr == Clchannel || membrane[i].med_pr == Kchannel)) {
            apicalMembrane.push(
                {
                    solute_chebi: membrane[i].solute_chebi,
                    solute_text: membrane[i].solute_text,
                    source_text: membrane[i].source_text,
                    source_fma: membrane[i].source_fma,
                    sink_text: membrane[i].sink_text,
                    sink_fma: membrane[i].sink_fma,
                    solute_chebi2: membrane[i].solute_chebi2,
                    solute_text2: membrane[i].solute_text2,
                    source_text2: "channel",
                    source_fma2: "channel",
                    sink_text2: "channel",
                    sink_fma2: "channel",
                    source_name: membrane[i].source_name,
                    sink_name: membrane[i].sink_name,
                    med_text: membrane[i].med_text,
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr,
                    med_pr_text: membrane[i].med_pr_text,
                    med_pr_text_syn: membrane[i].med_pr_text_syn
                });

            membrane[i].source_text2 = "channel";
            membrane[i].source_fma2 = "channel";
            membrane[i].sink_text2 = "channel";
            membrane[i].sink_fma2 = "channel";
        }

        if (membrane[i].med_fma == basolateralID && (membrane[i].med_pr == Nachannel ||
            membrane[i].med_pr == Clchannel || membrane[i].med_pr == Kchannel)) {
            basolateralMembrane.push(
                {
                    solute_chebi: membrane[i].solute_chebi,
                    solute_text: membrane[i].solute_text,
                    source_text: membrane[i].source_text,
                    source_fma: membrane[i].source_fma,
                    sink_text: membrane[i].sink_text,
                    sink_fma: membrane[i].sink_fma,
                    solute_chebi2: membrane[i].solute_chebi2,
                    solute_text2: membrane[i].solute_text2,
                    source_text2: "channel",
                    source_fma2: "channel",
                    sink_text2: "channel",
                    sink_fma2: "channel",
                    source_name: membrane[i].source_name,
                    sink_name: membrane[i].sink_name,
                    med_text: membrane[i].med_text,
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr,
                    med_pr_text: membrane[i].med_pr_text,
                    med_pr_text_syn: membrane[i].med_pr_text_syn
                });

            membrane[i].source_text2 = "channel";
            membrane[i].source_fma2 = "channel";
            membrane[i].sink_text2 = "channel";
            membrane[i].sink_fma2 = "channel";
        }

        if (membrane[i].source_fma == luminalID && membrane[i].sink_fma == interstitialID) {
            paracellularMembrane.push(
                {
                    solute_chebi: membrane[i].solute_chebi,
                    solute_text: membrane[i].solute_text,
                    source_text: membrane[i].source_text,
                    source_fma: membrane[i].source_fma,
                    sink_text: membrane[i].sink_text,
                    sink_fma: membrane[i].sink_fma,
                    solute_chebi2: membrane[i].solute_chebi2,
                    solute_text2: membrane[i].solute_text2,
                    source_text2: "diffusive channel",
                    source_fma2: "diffusive channel",
                    sink_text2: "diffusive channel",
                    sink_fma2: "diffusive channel",
                    source_name: membrane[i].source_name,
                    sink_name: membrane[i].sink_name,
                    med_text: membrane[i].med_text,
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr,
                    med_pr_text: membrane[i].med_pr_text,
                    med_pr_text_syn: membrane[i].med_pr_text_syn
                });

            membrane[i].source_text2 = "diffusive channel";
            membrane[i].source_fma2 = "diffusive channel";
            membrane[i].sink_text2 = "diffusive channel";
            membrane[i].sink_fma2 = "diffusive channel";
        }
    }

    // single flux
    for (var i = 0; i < membrane.length; i++) {
        if (membrane[i].med_fma == apicalID && membrane[i].source_text2 != "channel" &&
            membrane[i].source_text2 != "diffusive channel") {
            apicalMembrane.push(
                {
                    solute_chebi: membrane[i].solute_chebi,
                    solute_text: membrane[i].solute_text,
                    source_text: membrane[i].source_text,
                    source_fma: membrane[i].source_fma,
                    sink_text: membrane[i].sink_text,
                    sink_fma: membrane[i].sink_fma,
                    solute_chebi2: membrane[i].solute_chebi2,
                    solute_text2: membrane[i].solute_text2,
                    source_text2: "single flux",
                    source_fma2: membrane[i].source_fma,
                    sink_text2: "single flux",
                    sink_fma2: membrane[i].sink_fma,
                    source_name: membrane[i].source_name,
                    sink_name: membrane[i].sink_name,
                    med_text: membrane[i].med_text,
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr,
                    med_pr_text: membrane[i].med_pr_text,
                    med_pr_text_syn: membrane[i].med_pr_text_syn
                });
        }

        if (membrane[i].med_fma == basolateralID && membrane[i].source_text2 != "channel" &&
            membrane[i].source_text2 != "diffusive channel") {
            basolateralMembrane.push(
                {
                    solute_chebi: membrane[i].solute_chebi,
                    solute_text: membrane[i].solute_text,
                    source_text: membrane[i].source_text,
                    source_fma: membrane[i].source_fma,
                    sink_text: membrane[i].sink_text,
                    sink_fma: membrane[i].sink_fma,
                    solute_chebi2: membrane[i].solute_chebi2,
                    solute_text2: membrane[i].solute_text2,
                    source_text2: "single flux",
                    source_fma2: membrane[i].source_fma,
                    sink_text2: "single flux",
                    sink_fma2: membrane[i].sink_fma,
                    source_name: membrane[i].source_name,
                    sink_name: membrane[i].sink_name,
                    med_text: membrane[i].med_text,
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr,
                    med_pr_text: membrane[i].med_pr_text,
                    med_pr_text_syn: membrane[i].med_pr_text_syn
                });
        }
    }

    // Note: otherwise membrane array should have both directional fluxes (i.e., cotransporter)

    console.log("membrane: ", membrane);
    console.log("concentration_fma: ", concentration_fma);
    console.log("source_fma: ", source_fma);
    console.log("sink_fma: ", sink_fma);
    console.log("apicalMembrane: ", apicalMembrane);
    console.log("basolateralMembrane: ", basolateralMembrane);
    console.log("paracellularMembrane: ", paracellularMembrane);

    var combinedMembrane = [];

    for (var i = 0; i < apicalMembrane.length; i++)
        combinedMembrane.push(apicalMembrane[i]);
    for (var i = 0; i < basolateralMembrane.length; i++)
        combinedMembrane.push(basolateralMembrane[i]);
    for (var i = 0; i < paracellularMembrane.length; i++)
        combinedMembrane.push(paracellularMembrane[i]);

    console.log("combinedMembrane: ", combinedMembrane);

    var g = $("#svgVisualize"),
        wth = 1200,
        hth = 900,
        width = 300,
        height = 400;

    var w = 800,
        h = height + 500; // Init 400 + 500 = 900

    var prevHeight = height;

    if (apicalMembrane.length > basolateralMembrane.length && apicalMembrane.length > 4)
        height += 50 * (apicalMembrane.length - 4);

    if (basolateralMembrane.length > apicalMembrane.length && basolateralMembrane.length > 4)
        height += 50 * (basolateralMembrane.length - 4);

    if (prevHeight != height) {
        h += (height - prevHeight);
        hth += (height - prevHeight);
    }

    console.log("Prev and Height: ", prevHeight, height, h, hth);

    var svg = d3.select("#svgVisualize").append("svg")
        .attr("width", wth)
        .attr("height", hth);

    var newg = svg.append("g")
        .data([{x: w / 3, y: height / 3}]);

    var newgdefs = svg.append("g");
    newgdefs.append("defs")
        .append("pattern")
        .attr("id", "basicPattern")
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", 4)
        .attr("height", 4)
        .append("circle")
        .attr("cx", "0")
        .attr("cy", "0")
        .attr("r", "1.5")
        .attr("stroke", "#6495ED")
        .attr("stroke-width", 1.5);

    var dragrect = newg.append("rect")
        .attr("x", function (d) {
            return d.x;
        })
        .attr("y", function (d) {
            return d.y;
        })
        .attr("width", width)
        .attr("height", height)
        .attr("rx", 10)
        .attr("ry", 20)
        .attr("fill", "white")
        .attr("stroke", "url(#basicPattern)")
        .attr("stroke-width", 25);

    // Extracellular rectangle
    var extracellular = newg.append("rect")
        .attr("id", luminalID)
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", w / 3 - 30)
        .attr("height", h)
        .attr("stroke", function (d) {
            svg.append("text")
                .style("font", "16px sans-serif")
                .attr("stroke", "purple")
                .attr("opacity", 0.5)
                .attr("x", 850)
                .attr("y", 70)
                .text("Luminal Compartment");

            return "purple";
        })
        .attr("strokeWidth", "6px")
        .attr("fill", "white");

    // Intracellular rectangle
    var intracellular = newg.append("rect")
        .attr("id", cytosolID)
        .attr("x", w / 3 + 30)
        .attr("y", height / 3 + 20)
        .attr("width", width - 60)
        .attr("height", height - 40)
        .attr("stroke", function (d) {
            svg.append("text")
                .style("font", "16px sans-serif")
                .attr("stroke", "blue")
                .attr("opacity", 0.5)
                .attr("x", 850)
                .attr("y", 95)
                .text("Cytosol Compartment");

            return "blue";
        })
        .attr("strokeWidth", "6px")
        .attr("fill", "white");

    // Interstitial fluid rectangle
    var interstitial = newg.append("rect")
        .attr("id", interstitialID)
        .attr("x", w / 3 + width + 30)
        .attr("y", 0)
        .attr("width", w - (w / 3 + width + 30))
        .attr("height", h)
        .attr("stroke", function (d) {
            svg.append("text")
                .style("font", "16px sans-serif")
                .attr("stroke", "teal")
                .attr("opacity", 0.5)
                .attr("x", 850)
                .attr("y", 120)
                .text("Interstitial Fluid");

            return "teal";
        })
        .attr("strokeWidth", "6px")
        .attr("fill", "white");

    // Interstitial fluid rectangle
    var interstitial2 = newg.append("rect")
        .attr("id", interstitialID)
        .attr("x", w / 3 - 10)
        .attr("y", 0)
        .attr("width", width + 40)
        .attr("height", height / 3 - 30)
        .attr("stroke", "teal")
        .attr("strokeWidth", "6px")
        .attr("fill", "white");

    // Paracellular rectangle
    var paracellular = newg.append("rect")
        .attr("id", paracellularID)
        .attr("x", w / 3 - 10)
        .attr("y", height / 3 + height + 30)
        .attr("width", width + 20)
        .attr("height", height / 3)
        .attr("stroke", function (d) {
            svg.append("text")
                .style("font", "16px sans-serif")
                .attr("stroke", "violet")
                .attr("opacity", 0.5)
                .attr("x", 850)
                .attr("y", 145)
                .text("Paracellular Pathway");

            return "violet";
        })
        .attr("strokeWidth", "6px")
        .attr("fill", "white");

    var solutes = [];

    for (var i = 0; i < concentration_fma.length; i++) {

        // luminal(1), cytosol(2), interstitial(3), interstitial2(4), paracellular(5)
        for (var j = 1; j <= 5; j++) {
            if (concentration_fma[i].fma == $("rect")[j].id)
                break;
        }

        // compartments
        if (concentration_fma[i].fma == $("rect")[j].id) {
            var xrect = $("rect")[j].x.baseVal.value;
            var yrect = $("rect")[j].y.baseVal.value;
            var xwidth = $("rect")[j].width.baseVal.value;
            var yheight = $("rect")[j].height.baseVal.value;

            var indexOfHash = concentration_fma[i].name.search("#");
            var value = concentration_fma[i].name.slice(indexOfHash + 1);
            var indexOfdot = value.indexOf('.');
            value = value.slice(indexOfdot + 1);

            solutes.push(
                {
                    compartment: $("rect")[j].id,
                    xrect: xrect,
                    yrect: yrect,
                    width: xwidth,
                    height: yheight,
                    value: value,
                    length: getTextWidth(value, 12) //value.length
                });
        }
    }

    solutesBouncing(newg, solutes);

    // line apical and basolateral
    var x = $("rect")[0].x.baseVal.value;
    var y = $("rect")[0].y.baseVal.value;

    var lineapical = newg.append("line")
        .attr("id", apicalID)
        .attr("x1", function (d) {
            return d.x;
        })
        .attr("y1", function (d) {
            return d.y + 10;
        })
        .attr("x2", function (d) {
            return d.x;
        })
        .attr("y2", function (d) {
            return d.y + height - 10;
        })
        .attr("stroke", function (d) {
            svg.append("text")
                .style("font", "16px sans-serif")
                .attr("stroke", "green")
                .attr("x", 850)
                .attr("y", 20)
                .text("Apical Membrane");

            return "green";
        })
        .attr("stroke-width", 25)
        .attr("opacity", 0.5);

    var linebasolateral = newg.append("line")
        .attr("id", basolateralID)
        .attr("x1", function (d) {
            return d.x + width;
        })
        .attr("y1", function (d) {
            return d.y + 10;
        })
        .attr("x2", function (d) {
            return d.x + width;
        })
        .attr("y2", function (d) {
            return d.y + height - 10;
        })
        .attr("stroke", function (d) {
            svg.append("text")
                .style("font", "16px sans-serif")
                .attr("stroke", "orange")
                .attr("x", 850)
                .attr("y", 45)
                .text("Basolateral Membrane");

            return "orange";
        })
        .attr("stroke-width", 25)
        .attr("opacity", 0.5);

    var px = 265, py = height / 3 + height + height / 3 + 60; // 720
    // Neighbour epithelial cell
    newg.append("polygon")
        .attr("transform", "translate(" + px + ", " + py + ")")
        .attr("points", "0,0 0,100 0,0 300,0 300,100 300,0")
        .attr("fill", "white")
        .attr("stroke", "url(#basicPattern)")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 25);

    // Circle and line arrow from lumen to cytosol
    var xrect = $("rect")[0].x.baseVal.value;
    var yrect = $("rect")[0].y.baseVal.value;

    console.log("$(rect)", $("rect"));

    // Paracellular membrane
    var xprect = $("rect")[5].x.baseVal.value;
    var yprect = $("rect")[5].y.baseVal.value;
    var xpvalue = xprect + 10;
    var ypvalue = yprect + 25;
    var ypdistance = 35;

    var radius = 20,
        lineLen = 50, polygonlineLen = 60, pcellLen = 100,

        xvalue = xrect - lineLen / 2, // x coordinate before epithelial rectangle
        yvalue = yrect + 10 + 50, // initial distance 50
        cxvalue = xrect, cyvalue = yrect + 10 + 50, // initial distance 50
        ydistance = 70,

        yvalueb = yrect + 10 + 50, // initial distance 50
        cyvalueb = yrect + 10 + 50, // initial distance 50

        circlewithlineg = [], circlewithtext = [],
        linewithlineg = [], linewithlineg2 = [],
        linewithtextg = [], linewithtextg2 = [], polygon = [];

    // TODO: does not work for bi-directional arrow, Fix this
    // SVG checkbox with drag on-off
    var checkboxsvg = newg.append("g");

    var checkBox = [], checkedchk = [],
        ydistancechk = 50, yinitialchk = 185, ytextinitialchk = 200,
        markerWidth = 4, markerHeight = 4;

    for (var i = 0; i < combinedMembrane.length; i++) {
        checkBox[i] = new d3CheckBox();
    }

    var update = function () {
        for (var i = 0; i < combinedMembrane.length; i++) {
            checkedchk[i] = checkBox[i].checked();
            if (checkedchk[i] == true) {
                circlewithlineg[i].call(d3.drag().on("drag", dragcircleline).on("end", dragcircleendline));
            }
            else {
                circlewithlineg[i].call(d3.drag().on("end", dragcircleunchecked));
            }
        }
    };

    for (var i = 0; i < combinedMembrane.length; i++) {
        // var textvaluechk = combinedMembrane[i].source_text + " " + combinedMembrane[i].source_text2;
        var textvaluechk = combinedMembrane[i].med_pr_text;
        var indexOfParen = textvaluechk.indexOf('(');
        textvaluechk = textvaluechk.slice(0, indexOfParen - 1) + ' (' + combinedMembrane[i].med_pr_text_syn + ')';

        checkBox[i].x(850).y(yinitialchk).checked(false).clickEvent(update);
        checkBox[i].xtext(890).ytext(ytextinitialchk).text("" + textvaluechk + "");

        checkboxsvg.call(checkBox[i]);

        yinitialchk += ydistancechk;
        ytextinitialchk += ydistancechk;
    }

    function d3CheckBox() {

        var size = 20,
            x = 0,
            y = 0,
            rx = 0,
            ry = 0,
            markStrokeWidth = 2,
            boxStrokeWidth = 2,
            checked = false,
            clickEvent,
            xtext = 0,
            ytext = 0,
            text = "Empty";

        function checkBox(selection) {
            var g = selection.append("g"),
                box = g.append("rect")
                    .attr("width", size)
                    .attr("height", size)
                    .attr("x", x)
                    .attr("y", y)
                    .attr("rx", rx)
                    .attr("ry", ry)
                    .styles({
                        "fill-opacity": 0,
                        "stroke-width": boxStrokeWidth,
                        "stroke": "black"
                    }),
                txt = g.append("text").attr("x", xtext).attr("y", ytext).text("" + text + "");

            //Data to represent the check mark
            var coordinates = [
                {x: x + (size / 8), y: y + (size / 3)},
                {x: x + (size / 2.2), y: (y + size) - (size / 4)},
                {x: (x + size) - (size / 8), y: (y + (size / 10))}
            ];

            var line = d3.line()
                .x(function (d) {
                    return d.x;
                })
                .y(function (d) {
                    return d.y;
                });

            var mark = g.append("path")
                .attr("d", line(coordinates))
                .styles({
                    "stroke-width": markStrokeWidth,
                    "stroke": "black",
                    "fill": "none",
                    "opacity": (checked) ? 1 : 0
                });

            g.on("click", function () {
                checked = !checked;
                mark.style("opacity", (checked) ? 1 : 0);

                if (clickEvent) {
                    clickEvent();
                }

                d3.event.stopPropagation();
            });
        }

        checkBox.size = function (val) {
            size = val;
            return checkBox;
        }

        checkBox.x = function (val) {
            x = val;
            return checkBox;
        }

        checkBox.y = function (val) {
            y = val;
            return checkBox;
        }

        checkBox.rx = function (val) {
            rx = val;
            return checkBox;
        }

        checkBox.ry = function (val) {
            ry = val;
            return checkBox;
        }

        checkBox.markStrokeWidth = function (val) {
            markStrokeWidth = val;
            return checkBox;
        }

        checkBox.boxStrokeWidth = function (val) {
            boxStrokeWidth = val;
            return checkBox;
        }

        checkBox.checked = function (val) {
            if (val === undefined) {
                return checked;
            } else {
                checked = val;
                return checkBox;
            }
        }

        checkBox.clickEvent = function (val) {
            clickEvent = val;
            return checkBox;
        }

        checkBox.xtext = function (val) {
            xtext = val;
            return checkBox;
        }

        checkBox.ytext = function (val) {
            ytext = val;
            return checkBox;
        }

        checkBox.text = function (val) {
            text = val;
            return checkBox;
        }

        return checkBox;
    }

    var div = d3.select("#svgVisualize").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var state = 0;
    $(document).on({
        mousedown: function () {
            // console.log("mousedown: ", event.which);

            // 1 => left click, 2 => middle click, 3 => right click
            if (event.which == 2)
                div.style("display", "none");
        }
        // ,
        // click: function () {
        //     // Change marker direction and text position
        //     if (event.target.localName == "line" && event.target.nodeName == "line") {
        //
        //         // marker direction
        //         var id = event.srcElement.id;
        //         markerDir(id);
        //
        //         // text position
        //         var idText = event.srcElement.nextSibling.firstChild.id;
        //         var textContent = event.srcElement.nextSibling.firstChild.innerHTML;
        //         var textWidth = getTextWidth(textContent, 12);
        //         if (state == 0) {
        //             d3.select("#" + idText + "")
        //                 .transition()
        //                 .delay(1000)
        //                 .duration(1000)
        //                 .attr("x", event.srcElement.x1.baseVal.value - textWidth - 10)
        //                 .attr("y", event.srcElement.y1.baseVal.value + 5);
        //
        //             state = 1;
        //         }
        //         else {
        //             d3.select("#" + idText + "")
        //                 .transition()
        //                 .delay(1000)
        //                 .duration(1000)
        //                 .attr("x", event.srcElement.x1.baseVal.value + textWidth + 20)
        //                 .attr("y", event.srcElement.y1.baseVal.value + 5);
        //
        //             state = 0;
        //         }
        //     }
        // }
    });

    // apical, basolateral, and paracellular membrane
    for (var i = 0; i < combinedMembrane.length; i++) {
        source_name = combinedMembrane[i].source_name;

        var tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
            "rawfile" + "/" + "HEAD" + "/" + source_name;

        if (combinedMembrane[i].source_name2 != undefined)
            source_name2 = combinedMembrane[i].source_name2;
        else source_name2 = "";

        var mediator_fma = combinedMembrane[i].med_fma,
            mediator_pr = combinedMembrane[i].med_pr,
            mediator_pr_text = combinedMembrane[i].med_pr_text,
            mediator_pr_text_syn = combinedMembrane[i].med_pr_text_syn,

            solute_chebi = combinedMembrane[i].solute_chebi,
            solute_chebi2 = combinedMembrane[i].solute_chebi2,
            solute_text = combinedMembrane[i].solute_text,
            solute_text2 = combinedMembrane[i].solute_text2,

            textvalue = combinedMembrane[i].source_text,
            textvalue2 = combinedMembrane[i].source_text2,
            src_fma = combinedMembrane[i].source_fma,
            src_fma2 = combinedMembrane[i].source_fma2,
            snk_fma = combinedMembrane[i].sink_fma,
            snk_fma2 = combinedMembrane[i].sink_fma2,
            snk_textvalue = combinedMembrane[i].sink_text,
            snk_textvalue2 = combinedMembrane[i].sink_text2,
            textWidth = getTextWidth(textvalue, 12),

            tempID = circlewithlineg.length;

        /*  Apical Membrane */
        if (mediator_fma == apicalID) {
            // case 1
            if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == luminalID && snk_fma2 == cytosolID)) {
                var lineg = newg.append("g").data([{x: xvalue, y: yvalue}]);
                linewithlineg[i] = lineg.append("line")
                    .attr("id", "linewithlineg" + tempID)
                    .attr("x1", function (d) {
                        dx1line[i] = d.x;
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        dy1line[i] = d.y;
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        dx2line[i] = d.x + lineLen;
                        return d.x + lineLen;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y;
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#end)")
                    .attr("cursor", "pointer");

                var linegtext = lineg.append("g").data([{x: xvalue + lineLen + 10, y: yvalue + 5}]);
                linewithtextg[i] = linegtext.append("text")
                    .attr("id", "linewithtextg" + tempID)
                    .attr("x", function (d) {
                        dxtext[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dytext[i] = d.y;
                        return d.y;
                    })
                    .attr("font-family", "Times New Roman")
                    .attr("font-size", "12px")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(solute_text);

                var linegcircle = lineg.append("g").data([{x: cxvalue, y: cyvalue}]);
                circlewithlineg[i] = linegcircle.append("circle")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2,
                            mediator_fma, mediator_pr,
                            solute_chebi, solute_chebi2, solute_text, solute_text2,
                            mediator_pr_text, mediator_pr_text_syn
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", apicalID)
                    .attr("cx", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        dy[i] = d.y + radius;
                        return d.y + radius;
                    })
                    .attr("r", radius)
                    .attr("fill", "lightgreen")
                    .attr("stroke-width", 20)
                    .attr("cursor", "move")
                    .on("mouseover", function () {
                        div.style("display", "inline");
                        div.transition()
                            .duration(200)
                            .style("opacity", 1);

                        var id = d3.select(this)._groups[0][0].id,
                            indexOfComma = id.indexOf(','),
                            tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                                "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                        div.html(
                            '<b>CellML </b> ' +
                            '<a href="' + tempworkspace + '" target="_blank">' +
                            '<img border="0" alt="CellML" src="img/cellml.png" width="30" height="20"></a>' +
                            '<br/>' +
                            '<b>SEDML </b> ' +
                            '<a href="https://sed-ml.github.io/index.html" target="_blank">' +
                            '<img border="0" alt="SEDML" src="img/SEDML.png" width="30" height="20"></a>' +
                            '<br/>' +
                            '<b>Click middle mouse to close</b>')
                            .style("left", d3.mouse(this)[0] + 140 + "px")
                            .style("top", d3.mouse(this)[1] + 90 + "px");
                    });

                // protein name inside this circle
                circlewithtext[i] = linegcircle.append("text")
                    .attr("id", "circlewithtext" + tempID)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x - 15;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
                        return d.y + 23;
                    })
                    .attr("font-size", "12px")
                    .attr("fill", "red")
                    .attr("fontWeight", "bold")
                    .attr("cursor", "move")
                    .text(mediator_pr_text_syn);

                if (textvalue2 != "single flux") {
                    var lineg2 = lineg.append("g").data([{x: xvalue, y: yvalue + radius * 2}]);
                    linewithlineg2[i] = lineg2.append("line")
                        .attr("id", "linewithlineg2" + tempID)
                        .attr("x1", function (d) {
                            dx1line2[i] = d.x;
                            return d.x;
                        })
                        .attr("y1", function (d) {
                            dy1line2[i] = d.y;
                            return d.y;
                        })
                        .attr("x2", function (d) {
                            dx2line2[i] = d.x + lineLen;
                            return d.x + lineLen;
                        })
                        .attr("y2", function (d) {
                            dy2line2[i] = d.y;
                            return d.y;
                        })
                        .attr("stroke", "black")
                        .attr("stroke-width", 2)
                        .attr("marker-end", "url(#end)")
                        .attr("cursor", "pointer");

                    var linegtext2 = lineg2.append("g").data([{
                        x: xvalue + lineLen + 10, y: yvalue + radius * 2 + markerHeight
                    }]);
                    linewithtextg2[i] = linegtext2.append("text")
                        .attr("id", "linewithtextg2" + tempID)
                        .attr("x", function (d) {
                            dxtext2[i] = d.x;
                            return d.x;
                        })
                        .attr("y", function (d) {
                            dytext2[i] = d.y;
                            return d.y;
                        })
                        .attr("font-family", "Times New Roman")
                        .attr("font-size", "12px")
                        .attr("font-weight", "bold")
                        .attr("fill", "red")
                        .attr("cursor", "pointer")
                        .text(solute_text2);
                }

                // increment y-axis of line and circle
                yvalue += ydistance;
                cyvalue += ydistance;
            }

            // case 2
            if ((src_fma == cytosolID && snk_fma == luminalID) && (src_fma2 == cytosolID && snk_fma2 == luminalID)) {
                var lineg = newg.append("g").data([{x: xvalue, y: yvalue}]);
                linewithlineg[i] = lineg.append("line")
                    .attr("id", "linewithlineg" + tempID)
                    .attr("x1", function (d) {
                        dx1line[i] = d.x;
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        dy1line[i] = d.y;
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        dx2line[i] = d.x + lineLen;
                        return d.x + lineLen;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y;
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-start", "url(#start)")
                    .attr("cursor", "pointer");

                var linegtext = lineg.append("g").data([{x: xvalue - 30, y: yvalue + 5}]);
                linewithtextg[i] = linegtext.append("text")
                    .attr("id", "linewithtextg" + tempID)
                    .attr("x", function (d) {
                        dxtext[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dytext[i] = d.y;
                        return d.y;
                    })
                    .attr("font-family", "Times New Roman")
                    .attr("font-size", "12px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(solute_text);

                var linegcircle = lineg.append("g").data([{x: cxvalue, y: cyvalue}]);
                circlewithlineg[i] = linegcircle.append("circle")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2,
                            mediator_fma, mediator_pr,
                            solute_chebi, solute_chebi2, solute_text, solute_text2,
                            mediator_pr_text, mediator_pr_text_syn
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", apicalID)
                    .attr("cx", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        dy[i] = d.y + radius;
                        return d.y + radius;
                    })
                    .attr("r", radius)
                    .attr("fill", "lightgreen")
                    .attr("stroke-width", 20)
                    .attr("cursor", "move")
                    .on("mouseover", function () {
                        div.style("display", "inline");
                        div.transition()
                            .duration(200)
                            .style("opacity", 1);

                        var id = d3.select(this)._groups[0][0].id,
                            indexOfComma = id.indexOf(','),
                            tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                                "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                        div.html(
                            '<b>CellML </b> ' +
                            '<a href="' + tempworkspace + '" target="_blank">' +
                            '<img border="0" alt="CellML" src="img/cellml.png" width="30" height="20"></a>' +
                            '<br/>' +
                            '<b>SEDML </b> ' +
                            '<a href="https://sed-ml.github.io/index.html" target="_blank">' +
                            '<img border="0" alt="SEDML" src="img/SEDML.png" width="30" height="20"></a>' +
                            '<br/>' +
                            '<b>Click middle mouse to close</b>')
                            .style("left", d3.mouse(this)[0] + 140 + "px")
                            .style("top", d3.mouse(this)[1] + 90 + "px");
                    });

                // protein name inside this circle
                circlewithtext[i] = linegcircle.append("text")
                    .attr("id", "circlewithtext" + tempID)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x - 15;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
                        return d.y + 23;
                    })
                    .attr("font-size", "12px")
                    .attr("fill", "red")
                    .attr("fontWeight", "bold")
                    .attr("cursor", "move")
                    .text(mediator_pr_text_syn);

                if (textvalue2 != "single flux") {
                    var lineg2 = lineg.append("g").data([{x: xvalue, y: yvalue + radius * 2}]);
                    linewithlineg2[i] = lineg2.append("line")
                        .attr("id", "linewithlineg2" + tempID)
                        .attr("x1", function (d) {
                            dx1line2[i] = d.x;
                            return d.x;
                        })
                        .attr("y1", function (d) {
                            dy1line2[i] = d.y;
                            return d.y;
                        })
                        .attr("x2", function (d) {
                            dx2line2[i] = d.x + lineLen;
                            return d.x + lineLen;
                        })
                        .attr("y2", function (d) {
                            dy2line2[i] = d.y;
                            return d.y;
                        })
                        .attr("stroke", "black")
                        .attr("stroke-width", 2)
                        .attr("marker-end", "url(#end)")
                        .attr("cursor", "pointer");

                    var linegtext2 = lineg2.append("g").data([{
                        x: xvalue - textWidth - 10, y: yvalue + radius * 2 + markerHeight
                    }]);
                    linewithtextg2[i] = linegtext2.append("text")
                        .attr("id", "linewithtextg2" + tempID)
                        .attr("x", function (d) {
                            dxtext2[i] = d.x;
                            return d.x;
                        })
                        .attr("y", function (d) {
                            dytext2[i] = d.y;
                            return d.y;
                        })
                        .attr("font-family", "Times New Roman")
                        .attr("font-size", "12px")
                        .attr("font-weight", "bold")
                        .attr("fill", "red")
                        .attr("cursor", "pointer")
                        .text(solute_text2);
                }

                // increment y-axis of line and circle
                yvalue += ydistance;
                cyvalue += ydistance;
            }

            // case 3
            if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == cytosolID && snk_fma2 == luminalID)) {
                var lineg = newg.append("g").data([{x: xvalue, y: yvalue}]);
                linewithlineg[i] = lineg.append("line")
                    .attr("id", "linewithlineg" + tempID)
                    .attr("x1", function (d) {
                        dx1line[i] = d.x;
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        dy1line[i] = d.y;
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        dx2line[i] = d.x + lineLen;
                        return d.x + lineLen;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y;
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#end)")
                    .attr("cursor", "pointer");

                var linegtext = lineg.append("g").data([{x: xvalue + lineLen + 10, y: yvalue + 5}]);
                linewithtextg[i] = linegtext.append("text")
                    .attr("id", "linewithtextg" + tempID)
                    .attr("x", function (d) {
                        dxtext[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dytext[i] = d.y;
                        return d.y;
                    })
                    .attr("font-family", "Times New Roman")
                    .attr("font-size", "12px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(solute_text);

                var linegcircle = lineg.append("g").data([{x: cxvalue, y: cyvalue}]);
                circlewithlineg[i] = linegcircle.append("circle")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2,
                            mediator_fma, mediator_pr,
                            solute_chebi, solute_chebi2, solute_text, solute_text2,
                            mediator_pr_text, mediator_pr_text_syn
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", apicalID)
                    .attr("cx", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        dy[i] = d.y + radius;
                        return d.y + radius;
                    })
                    .attr("r", radius)
                    .attr("fill", "lightgreen")
                    .attr("stroke-width", 20)
                    .attr("cursor", "move")
                    .on("mouseover", function () {
                        div.style("display", "inline");
                        div.transition()
                            .duration(200)
                            .style("opacity", 1);

                        var id = d3.select(this)._groups[0][0].id,
                            indexOfComma = id.indexOf(','),
                            tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                                "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                        div.html(
                            '<b>CellML </b> ' +
                            '<a href="' + tempworkspace + '" target="_blank">' +
                            '<img border="0" alt="CellML" src="img/cellml.png" width="30" height="20"></a>' +
                            '<br/>' +
                            '<b>SEDML </b> ' +
                            '<a href="https://sed-ml.github.io/index.html" target="_blank">' +
                            '<img border="0" alt="SEDML" src="img/SEDML.png" width="30" height="20"></a>' +
                            '<br/>' +
                            '<b>Click middle mouse to close</b>')
                            .style("left", d3.mouse(this)[0] + 140 + "px")
                            .style("top", d3.mouse(this)[1] + 90 + "px");
                    });

                // protein name inside this circle
                circlewithtext[i] = linegcircle.append("text")
                    .attr("id", "circlewithtext" + tempID)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x - 15;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
                        return d.y + 23;
                    })
                    .attr("font-size", "12px")
                    .attr("fill", "red")
                    .attr("fontWeight", "bold")
                    .attr("cursor", "move")
                    .text(mediator_pr_text_syn);

                if (textvalue2 != "single flux") {
                    var lineg2 = lineg.append("g").data([{x: xvalue, y: yvalue + radius * 2}]);
                    linewithlineg2[i] = lineg2.append("line")
                        .attr("id", "linewithlineg2" + tempID)
                        .attr("x1", function (d) {
                            dx1line2[i] = d.x;
                            return d.x;
                        })
                        .attr("y1", function (d) {
                            dy1line2[i] = d.y;
                            return d.y;
                        })
                        .attr("x2", function (d) {
                            dx2line2[i] = d.x + lineLen;
                            return d.x + lineLen;
                        })
                        .attr("y2", function (d) {
                            dy2line2[i] = d.y;
                            return d.y;
                        })
                        .attr("stroke", "black")
                        .attr("stroke-width", 2)
                        .attr("marker-start", "url(#start)")
                        .attr("cursor", "pointer");

                    var linegtext2 = lineg2.append("g").data([{
                        x: xvalue - textWidth - 10, y: yvalue + radius * 2 + markerHeight
                    }]);
                    linewithtextg2[i] = linegtext2.append("text")
                        .attr("id", "linewithtextg2" + tempID)
                        .attr("x", function (d) {
                            dxtext2[i] = d.x;
                            return d.x;
                        })
                        .attr("y", function (d) {
                            dytext2[i] = d.y;
                            return d.y;
                        })
                        .attr("font-family", "Times New Roman")
                        .attr("font-size", "12px")
                        .attr("font-weight", "bold")
                        .attr("fill", "red")
                        .attr("cursor", "pointer")
                        .text(solute_text2);
                }

                // increment y-axis of line and circle
                yvalue += ydistance;
                cyvalue += ydistance;
            }

            // case 4
            if ((src_fma == cytosolID && snk_fma == luminalID) && (src_fma2 == luminalID && snk_fma2 == cytosolID)) {
                var lineg = newg.append("g").data([{x: xvalue, y: yvalue}]);
                linewithlineg[i] = lineg.append("line")
                    .attr("id", "linewithlineg" + tempID)
                    .attr("x1", function (d) {
                        dx1line[i] = d.x;
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        dy1line[i] = d.y;
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        dx2line[i] = d.x + lineLen;
                        return d.x + lineLen;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y;
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-start", "url(#start)")
                    .attr("cursor", "pointer");

                var linegtext = lineg.append("g").data([{x: xvalue - 30, y: yvalue + 5}]);
                linewithtextg[i] = linegtext.append("text")
                    .attr("id", "linewithtextg" + tempID)
                    .attr("x", function (d) {
                        dxtext[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dytext[i] = d.y;
                        return d.y;
                    })
                    .attr("font-family", "Times New Roman")
                    .attr("font-size", "12px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(solute_text);

                var linegcircle = lineg.append("g").data([{x: cxvalue, y: cyvalue}]);
                circlewithlineg[i] = linegcircle.append("circle")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2,
                            mediator_fma, mediator_pr,
                            solute_chebi, solute_chebi2, solute_text, solute_text2,
                            mediator_pr_text, mediator_pr_text_syn
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", apicalID)
                    .attr("cx", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        dy[i] = d.y + radius;
                        return d.y + radius;
                    })
                    .attr("r", radius)
                    .attr("fill", "lightgreen")
                    .attr("stroke-width", 20)
                    .attr("cursor", "move")
                    .on("mouseover", function () {
                        div.style("display", "inline");
                        div.transition()
                            .duration(200)
                            .style("opacity", 1);

                        var id = d3.select(this)._groups[0][0].id,
                            indexOfComma = id.indexOf(','),
                            tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                                "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                        div.html(
                            '<b>CellML </b> ' +
                            '<a href="' + tempworkspace + '" target="_blank">' +
                            '<img border="0" alt="CellML" src="img/cellml.png" width="30" height="20"></a>' +
                            '<br/>' +
                            '<b>SEDML </b> ' +
                            '<a href="https://sed-ml.github.io/index.html" target="_blank">' +
                            '<img border="0" alt="SEDML" src="img/SEDML.png" width="30" height="20"></a>' +
                            '<br/>' +
                            '<b>Click middle mouse to close</b>')
                            .style("left", d3.mouse(this)[0] + 140 + "px")
                            .style("top", d3.mouse(this)[1] + 90 + "px");
                    });

                // protein name inside this circle
                circlewithtext[i] = linegcircle.append("text")
                    .attr("id", "circlewithtext" + tempID)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x - 15;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
                        return d.y + 23;
                    })
                    .attr("font-size", "12px")
                    .attr("fill", "red")
                    .attr("fontWeight", "bold")
                    .attr("cursor", "move")
                    .text(mediator_pr_text_syn);

                if (textvalue2 != "single flux") {
                    var lineg2 = lineg.append("g").data([{x: xvalue, y: yvalue + radius * 2}]);
                    linewithlineg2[i] = lineg2.append("line")
                        .attr("id", "linewithlineg2" + tempID)
                        .attr("x1", function (d) {
                            dx1line2[i] = d.x;
                            return d.x;
                        })
                        .attr("y1", function (d) {
                            dy1line2[i] = d.y;
                            return d.y;
                        })
                        .attr("x2", function (d) {
                            dx2line2[i] = d.x + lineLen;
                            return d.x + lineLen;
                        })
                        .attr("y2", function (d) {
                            dy2line2[i] = d.y;
                            return d.y;
                        })
                        .attr("stroke", "black")
                        .attr("stroke-width", 2)
                        .attr("marker-end", "url(#end)")
                        .attr("cursor", "pointer");

                    var linegtext2 = lineg2.append("g").data([{
                        x: xvalue + lineLen + 10, y: yvalue + radius * 2 + markerHeight
                    }]);
                    linewithtextg2[i] = linegtext2.append("text")
                        .attr("id", "linewithtextg2" + tempID)
                        .attr("x", function (d) {
                            dxtext2[i] = d.x;
                            return d.x;
                        })
                        .attr("y", function (d) {
                            dytext2[i] = d.y;
                            return d.y;
                        })
                        .attr("font-family", "Times New Roman")
                        .attr("font-size", "12px")
                        .attr("font-weight", "bold")
                        .attr("fill", "red")
                        .attr("cursor", "pointer")
                        .text(solute_text2);
                }

                // increment y-axis of line and circle
                yvalue += ydistance;
                cyvalue += ydistance;
            }

            // case 5
            if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == "channel" && snk_fma2 == "channel")) {
                var polygong = newg.append("g").data([{x: xvalue - 5, y: yvalue}]);
                linewithlineg[i] = polygong.append("line")
                    .attr("id", "linewithlineg" + tempID)
                    .attr("x1", function (d) {
                        dx1line[i] = d.x;
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        dy1line[i] = d.y;
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        dx2line[i] = d.x + polygonlineLen;
                        return d.x + polygonlineLen;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y;
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#end)")
                    .attr("cursor", "pointer");

                var linegtext = polygong.append("g").data([{x: xvalue + polygonlineLen + 10, y: yvalue + 5}]);
                linewithtextg[i] = linegtext.append("text")
                    .attr("id", "linewithtextg" + tempID)
                    .attr("x", function (d) {
                        dxtext[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dytext[i] = d.y;
                        return d.y;
                    })
                    .attr("font-family", "Times New Roman")
                    .attr("font-size", "12px")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(solute_text);

                // Polygon
                circlewithlineg[i] = polygong.append("g").append("polygon")
                    .attr("transform", "translate(" + (xvalue - 5) + "," + (yvalue - 30) + ")")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2,
                            mediator_fma, mediator_pr,
                            solute_chebi, solute_chebi2, solute_text, solute_text2,
                            mediator_pr_text, mediator_pr_text_syn
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", apicalID)
                    .attr("cx", function (d) {
                        dx[i] = xvalue - 5;
                        return dx[i];
                    })
                    .attr("cy", function (d) {
                        dy[i] = yvalue - 30;
                        return dy[i];
                    })
                    .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                    .attr("fill", "yellow")
                    .attr("stroke", "black")
                    .attr("stroke-linecap", "round")
                    .attr("stroke-linejoin", "round")
                    .attr("cursor", "move")
                    .on("mouseover", function () {
                        div.style("display", "inline");
                        div.transition()
                            .duration(200)
                            .style("opacity", 1);

                        var id = d3.select(this)._groups[0][0].id,
                            indexOfComma = id.indexOf(','),
                            tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                                "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                        div.html(
                            '<b>CellML </b> ' +
                            '<a href="' + tempworkspace + '" target="_blank">' +
                            '<img border="0" alt="CellML" src="img/cellml.png" width="30" height="20"></a>' +
                            '<br/>' +
                            '<b>SEDML </b> ' +
                            '<a href="https://sed-ml.github.io/index.html" target="_blank">' +
                            '<img border="0" alt="SEDML" src="img/SEDML.png" width="30" height="20"></a>' +
                            '<br/>' +
                            '<b>Click middle mouse to close</b>')
                            .style("left", d3.mouse(this)[0] + 140 + "px")
                            .style("top", d3.mouse(this)[1] + 90 + "px");
                    });

                // text inside polygon
                var polygontext = polygong.append("g").data([{x: xvalue + 12, y: yvalue + 4}]);
                circlewithtext[i] = polygontext.append("text")
                    .attr("id", "circlewithtext" + tempID)
                    .attr("x", function (d) {
                        dxtext[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dytext[i] = d.y;
                        return d.y;
                    })
                    .attr("font-size", "10px")
                    .attr("fill", "red")
                    .attr("cursor", "move")
                    .text(mediator_pr_text_syn);

                // increment y-axis of line and circle
                yvalue += ydistance;
                cyvalue += ydistance;
            }

            // case 6
            if ((src_fma == cytosolID && snk_fma == luminalID) && (src_fma2 == "channel" && snk_fma2 == "channel")) {
                var polygong = newg.append("g").data([{x: xvalue - 5, y: yvalue}]);
                linewithlineg[i] = polygong.append("line")
                    .attr("id", "linewithlineg" + tempID)
                    .attr("x1", function (d) {
                        dx1line[i] = d.x;
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        dy1line[i] = d.y;
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        dx2line[i] = d.x + polygonlineLen;
                        return d.x + polygonlineLen;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y;
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-start", "url(#start)")
                    .attr("cursor", "pointer");

                var linegtext = polygong.append("g").data([{x: xvalue - 30, y: yvalue + 5}]);
                linewithtextg[i] = linegtext.append("text")
                    .attr("id", "linewithtextg" + tempID)
                    .attr("x", function (d) {
                        dxtext[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dytext[i] = d.y;
                        return d.y;
                    })
                    .attr("font-family", "Times New Roman")
                    .attr("font-size", "12px")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(solute_text);

                // Polygon
                circlewithlineg[i] = polygong.append("g").append("polygon")
                    .attr("transform", "translate(" + (xvalue - 5) + "," + (yvalue - 30) + ")")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2,
                            mediator_fma, mediator_pr,
                            solute_chebi, solute_chebi2, solute_text, solute_text2,
                            mediator_pr_text, mediator_pr_text_syn
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", apicalID)
                    .attr("cx", function (d) {
                        dx[i] = xvalue - 5;
                        return dx[i];
                    })
                    .attr("cy", function (d) {
                        dy[i] = yvalue - 30;
                        return dy[i];
                    })
                    .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                    .attr("fill", "yellow")
                    .attr("stroke", "black")
                    .attr("stroke-linecap", "round")
                    .attr("stroke-linejoin", "round")
                    .attr("cursor", "move")
                    .on("mouseover", function () {
                        div.style("display", "inline");
                        div.transition()
                            .duration(200)
                            .style("opacity", 1);

                        var id = d3.select(this)._groups[0][0].id,
                            indexOfComma = id.indexOf(','),
                            tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                                "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                        div.html(
                            '<b>CellML </b> ' +
                            '<a href="' + tempworkspace + '" target="_blank">' +
                            '<img border="0" alt="CellML" src="img/cellml.png" width="30" height="20"></a>' +
                            '<br/>' +
                            '<b>SEDML </b> ' +
                            '<a href="https://sed-ml.github.io/index.html" target="_blank">' +
                            '<img border="0" alt="SEDML" src="img/SEDML.png" width="30" height="20"></a>' +
                            '<br/>' +
                            '<b>Click middle mouse to close</b>')
                            .style("left", d3.mouse(this)[0] + 140 + "px")
                            .style("top", d3.mouse(this)[1] + 90 + "px");
                    });

                // text inside polygon
                var polygontext = polygong.append("g").data([{x: xvalue + 12, y: yvalue + 4}]);
                circlewithtext[i] = polygontext.append("text")
                    .attr("id", "circlewithtext" + tempID)
                    .attr("x", function (d) {
                        dxtext[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dytext[i] = d.y;
                        return d.y;
                    })
                    .attr("font-size", "10px")
                    .attr("fill", "red")
                    .attr("cursor", "move")
                    .text(mediator_pr_text_syn);

                // increment y-axis of line and circle
                yvalue += ydistance;
                cyvalue += ydistance;
            }
        }

        /*  Basolateral Membrane */
        if (mediator_fma == basolateralID) {
            // case 1
            if ((src_fma == cytosolID && snk_fma == interstitialID) && (src_fma2 == cytosolID && snk_fma2 == interstitialID)) {
                var lineg = newg.append("g").data([{x: xvalue + width, y: yvalueb}]);
                linewithlineg[i] = lineg.append("line")
                    .attr("id", "linewithlineg" + tempID)
                    .attr("x1", function (d) {
                        dx1line[i] = d.x;
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        dy1line[i] = d.y;
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        dx2line[i] = d.x + lineLen;
                        return d.x + lineLen;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y;
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#end)")
                    .attr("cursor", "pointer");

                var linegtext = lineg.append("g").data([{x: xvalue + lineLen + 10 + width, y: yvalueb + 5}]);
                linewithtextg[i] = linegtext.append("text")
                    .attr("id", "linewithtextg" + tempID)
                    .attr("x", function (d) {
                        dxtext[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dytext[i] = d.y;
                        return d.y;
                    })
                    .attr("font-family", "Times New Roman")
                    .attr("font-size", "12px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(solute_text);

                var linegcircle = lineg.append("g").data([{x: cxvalue + width, y: cyvalueb}]);
                circlewithlineg[i] = linegcircle.append("circle")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2,
                            mediator_fma, mediator_pr,
                            solute_chebi, solute_chebi2, solute_text, solute_text2,
                            mediator_pr_text, mediator_pr_text_syn
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", basolateralID)
                    .attr("cx", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        dy[i] = d.y + radius;
                        return d.y + radius;
                    })
                    .attr("r", radius)
                    .attr("fill", "orange")
                    .attr("stroke-width", 20)
                    .attr("cursor", "move")
                    .on("mouseover", function () {
                        div.style("display", "inline");
                        div.transition()
                            .duration(200)
                            .style("opacity", 1);

                        var id = d3.select(this)._groups[0][0].id,
                            indexOfComma = id.indexOf(','),
                            tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                                "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                        div.html(
                            '<b>CellML </b> ' +
                            '<a href="' + tempworkspace + '" target="_blank">' +
                            '<img border="0" alt="CellML" src="img/cellml.png" width="30" height="20"></a>' +
                            '<br/>' +
                            '<b>SEDML </b> ' +
                            '<a href="https://sed-ml.github.io/index.html" target="_blank">' +
                            '<img border="0" alt="SEDML" src="img/SEDML.png" width="30" height="20"></a>' +
                            '<br/>' +
                            '<b>Click middle mouse to close</b>')
                            .style("left", d3.mouse(this)[0] + 140 + "px")
                            .style("top", d3.mouse(this)[1] + 90 + "px");
                    });

                // protein name inside this circle
                circlewithtext[i] = linegcircle.append("text")
                    .attr("id", "circlewithtext" + tempID)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x - 15;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
                        return d.y + 23;
                    })
                    .attr("font-size", "12px")
                    .attr("fill", "red")
                    .attr("fontWeight", "bold")
                    .attr("cursor", "move")
                    .text(mediator_pr_text_syn);

                if (textvalue2 != "single flux") {
                    var lineg2 = lineg.append("g").data([{x: xvalue + width, y: yvalueb + radius * 2}]);
                    linewithlineg2[i] = lineg2.append("line")
                        .attr("id", "linewithlineg2" + tempID)
                        .attr("x1", function (d) {
                            dx1line2[i] = d.x;
                            return d.x;
                        })
                        .attr("y1", function (d) {
                            dy1line2[i] = d.y;
                            return d.y;
                        })
                        .attr("x2", function (d) {
                            dx2line2[i] = d.x + lineLen;
                            return d.x + lineLen;
                        })
                        .attr("y2", function (d) {
                            dy2line2[i] = d.y;
                            return d.y;
                        })
                        .attr("stroke", "black")
                        .attr("stroke-width", 2)
                        .attr("marker-end", "url(#end)")
                        .attr("cursor", "pointer");

                    var linegtext2 = lineg2.append("g").data([{
                        x: xvalue + lineLen + 10 + width, y: yvalueb + radius * 2 + markerHeight
                    }]);
                    linewithtextg2[i] = linegtext2.append("text")
                        .attr("id", "linewithtextg2" + tempID)
                        .attr("x", function (d) {
                            dxtext2[i] = d.x;
                            return d.x;
                        })
                        .attr("y", function (d) {
                            dytext2[i] = d.y;
                            return d.y;
                        })
                        .attr("font-family", "Times New Roman")
                        .attr("font-size", "12px")
                        .attr("font-weight", "bold")
                        .attr("fill", "red")
                        .attr("cursor", "pointer")
                        .text(solute_text2);
                }

                // increment y-axis of line and circle
                yvalueb += ydistance;
                cyvalueb += ydistance;
            }

            // case 2
            if ((src_fma == interstitialID && snk_fma == cytosolID) && (src_fma2 == interstitialID && snk_fma2 == cytosolID)) {
                var lineg = newg.append("g").data([{x: xvalue + width, y: yvalueb}]);
                linewithlineg[i] = lineg.append("line")
                    .attr("id", "linewithlineg" + tempID)
                    .attr("x1", function (d) {
                        dx1line[i] = d.x;
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        dy1line[i] = d.y;
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        dx2line[i] = d.x + lineLen;
                        return d.x + lineLen;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y;
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-start", "url(#start)")
                    .attr("cursor", "pointer");

                var linegtext = lineg.append("g").data([{x: xvalue - 30 + width, y: yvalueb + 5}]);
                linewithtextg[i] = linegtext.append("text")
                    .attr("id", "linewithtextg" + tempID)
                    .attr("x", function (d) {
                        dxtext[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dytext[i] = d.y;
                        return d.y;
                    })
                    .attr("font-family", "Times New Roman")
                    .attr("font-size", "12px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(solute_text);

                var linegcircle = lineg.append("g").data([{x: cxvalue + width, y: cyvalueb}]);
                circlewithlineg[i] = linegcircle.append("circle")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2,
                            mediator_fma, mediator_pr,
                            solute_chebi, solute_chebi2, solute_text, solute_text2,
                            mediator_pr_text, mediator_pr_text_syn
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", basolateralID)
                    .attr("cx", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        dy[i] = d.y + radius;
                        return d.y + radius;
                    })
                    .attr("r", radius)
                    .attr("fill", "orange")
                    .attr("stroke-width", 20)
                    .attr("cursor", "move")
                    .on("mouseover", function () {
                        div.style("display", "inline");
                        div.transition()
                            .duration(200)
                            .style("opacity", 1);

                        var id = d3.select(this)._groups[0][0].id,
                            indexOfComma = id.indexOf(','),
                            tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                                "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                        div.html(
                            '<b>CellML </b> ' +
                            '<a href="' + tempworkspace + '" target="_blank">' +
                            '<img border="0" alt="CellML" src="img/cellml.png" width="30" height="20"></a>' +
                            '<br/>' +
                            '<b>SEDML </b> ' +
                            '<a href="https://sed-ml.github.io/index.html" target="_blank">' +
                            '<img border="0" alt="SEDML" src="img/SEDML.png" width="30" height="20"></a>' +
                            '<br/>' +
                            '<b>Click middle mouse to close</b>')
                            .style("left", d3.mouse(this)[0] + 140 + "px")
                            .style("top", d3.mouse(this)[1] + 90 + "px");
                    });

                // protein name inside this circle
                circlewithtext[i] = linegcircle.append("text")
                    .attr("id", "circlewithtext" + tempID)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x - 15;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
                        return d.y + 23;
                    })
                    .attr("font-size", "12px")
                    .attr("fill", "red")
                    .attr("fontWeight", "bold")
                    .attr("cursor", "move")
                    .text(mediator_pr_text_syn);

                if (textvalue2 != "single flux") {
                    var lineg2 = lineg.append("g").data([{x: xvalue + width, y: yvalueb + radius * 2}]);
                    linewithlineg2[i] = lineg2.append("line")
                        .attr("id", "linewithlineg2" + tempID)
                        .attr("x1", function (d) {
                            dx1line2[i] = d.x;
                            return d.x;
                        })
                        .attr("y1", function (d) {
                            dy1line2[i] = d.y;
                            return d.y;
                        })
                        .attr("x2", function (d) {
                            dx2line2[i] = d.x + lineLen;
                            return d.x + lineLen;
                        })
                        .attr("y2", function (d) {
                            dy2line2[i] = d.y;
                            return d.y;
                        })
                        .attr("stroke", "black")
                        .attr("stroke-width", 2)
                        .attr("marker-start", "url(#start)")
                        .attr("cursor", "pointer");

                    var linegtext2 = lineg2.append("g").data([{
                        x: xvalue - textWidth - 10 + width, y: yvalueb + radius * 2 + markerHeight
                    }]);
                    linewithtextg2[i] = linegtext2.append("text")
                        .attr("id", "linewithtextg2" + tempID)
                        .attr("x", function (d) {
                            dxtext2[i] = d.x;
                            return d.x;
                        })
                        .attr("y", function (d) {
                            dytext2[i] = d.y;
                            return d.y;
                        })
                        .attr("font-family", "Times New Roman")
                        .attr("font-size", "12px")
                        .attr("font-weight", "bold")
                        .attr("fill", "red")
                        .attr("cursor", "pointer")
                        .text(solute_text2);
                }

                // increment y-axis of line and circle
                yvalueb += ydistance;
                cyvalueb += ydistance;
            }

            // case 3
            if ((src_fma == cytosolID && snk_fma == interstitialID) && (src_fma2 == interstitialID && snk_fma2 == cytosolID)) {
                var lineg = newg.append("g").data([{x: xvalue + width, y: yvalueb}]);
                linewithlineg[i] = lineg.append("line")
                    .attr("id", "linewithlineg" + tempID)
                    .attr("x1", function (d) {
                        dx1line[i] = d.x;
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        dy1line[i] = d.y;
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        dx2line[i] = d.x + lineLen;
                        return d.x + lineLen;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y;
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#end)")
                    .attr("cursor", "pointer");

                var linegtext = lineg.append("g").data([{x: xvalue + lineLen + 10 + width, y: yvalueb + 5}]);
                linewithtextg[i] = linegtext.append("text")
                    .attr("id", "linewithtextg" + tempID)
                    .attr("x", function (d) {
                        dxtext[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dytext[i] = d.y;
                        return d.y;
                    })
                    .attr("font-family", "Times New Roman")
                    .attr("font-size", "12px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(solute_text);

                var linegcircle = lineg.append("g").data([{x: cxvalue + width, y: cyvalueb}]);
                circlewithlineg[i] = linegcircle.append("circle")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2,
                            mediator_fma, mediator_pr,
                            solute_chebi, solute_chebi2, solute_text, solute_text2,
                            mediator_pr_text, mediator_pr_text_syn
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", basolateralID)
                    .attr("cx", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        dy[i] = d.y + radius;
                        return d.y + radius;
                    })
                    .attr("r", radius)
                    .attr("fill", "orange")
                    .attr("stroke-width", 20)
                    .attr("cursor", "move")
                    .on("mouseover", function () {
                        div.style("display", "inline");
                        div.transition()
                            .duration(200)
                            .style("opacity", 1);

                        var id = d3.select(this)._groups[0][0].id,
                            indexOfComma = id.indexOf(','),
                            tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                                "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                        div.html(
                            '<b>CellML </b> ' +
                            '<a href="' + tempworkspace + '" target="_blank">' +
                            '<img border="0" alt="CellML" src="img/cellml.png" width="30" height="20"></a>' +
                            '<br/>' +
                            '<b>SEDML </b> ' +
                            '<a href="https://sed-ml.github.io/index.html" target="_blank">' +
                            '<img border="0" alt="SEDML" src="img/SEDML.png" width="30" height="20"></a>' +
                            '<br/>' +
                            '<b>Click middle mouse to close</b>')
                            .style("left", d3.mouse(this)[0] + 140 + "px")
                            .style("top", d3.mouse(this)[1] + 90 + "px");
                    });

                // protein name inside this circle
                circlewithtext[i] = linegcircle.append("text")
                    .attr("id", "circlewithtext" + tempID)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x - 15;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
                        return d.y + 23;
                    })
                    .attr("font-size", "12px")
                    .attr("fill", "red")
                    .attr("fontWeight", "bold")
                    .attr("cursor", "move")
                    .text(mediator_pr_text_syn);

                if (textvalue2 != "single flux") {
                    var lineg2 = lineg.append("g").data([{x: xvalue + width, y: yvalueb + radius * 2}]);
                    linewithlineg2[i] = lineg2.append("line")
                        .attr("id", "linewithlineg2" + tempID)
                        .attr("x1", function (d) {
                            dx1line2[i] = d.x;
                            return d.x;
                        })
                        .attr("y1", function (d) {
                            dy1line2[i] = d.y;
                            return d.y;
                        })
                        .attr("x2", function (d) {
                            dx2line2[i] = d.x + lineLen;
                            return d.x + lineLen;
                        })
                        .attr("y2", function (d) {
                            dy2line2[i] = d.y;
                            return d.y;
                        })
                        .attr("stroke", "black")
                        .attr("stroke-width", 2)
                        .attr("marker-start", "url(#start)")
                        .attr("cursor", "pointer");

                    var linegtext2 = lineg2.append("g").data([{
                        x: xvalue - textWidth - 10 + width, y: yvalueb + radius * 2 + markerHeight
                    }]);
                    linewithtextg2[i] = linegtext2.append("text")
                        .attr("id", "linewithtextg2" + tempID)
                        .attr("x", function (d) {
                            dxtext2[i] = d.x;
                            return d.x;
                        })
                        .attr("y", function (d) {
                            dytext2[i] = d.y;
                            return d.y;
                        })
                        .attr("font-family", "Times New Roman")
                        .attr("font-size", "12px")
                        .attr("font-weight", "bold")
                        .attr("fill", "red")
                        .attr("cursor", "pointer")
                        .text(solute_text2);
                }

                // increment y-axis of line and circle
                yvalueb += ydistance;
                cyvalueb += ydistance;
            }

            // case 4
            if ((src_fma == interstitialID && snk_fma == cytosolID) && (src_fma2 == cytosolID && snk_fma2 == interstitialID)) {
                var lineg = newg.append("g").data([{x: xvalue + width, y: yvalueb}]);
                linewithlineg[i] = lineg.append("line")
                    .attr("id", "linewithlineg" + tempID)
                    .attr("x1", function (d) {
                        dx1line[i] = d.x;
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        dy1line[i] = d.y;
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        dx2line[i] = d.x + lineLen;
                        return d.x + lineLen;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y;
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-start", "url(#start)")
                    .attr("cursor", "pointer");

                var linegtext = lineg.append("g").data([{x: xvalue - 30 + width, y: yvalueb + 5}]);
                linewithtextg[i] = linegtext.append("text")
                    .attr("id", "linewithtextg" + tempID)
                    .attr("x", function (d) {
                        dxtext[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dytext[i] = d.y;
                        return d.y;
                    })
                    .attr("font-family", "Times New Roman")
                    .attr("font-size", "12px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(solute_text);

                var linegcircle = lineg.append("g").data([{x: cxvalue + width, y: cyvalueb}]);
                circlewithlineg[i] = linegcircle.append("circle")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2,
                            mediator_fma, mediator_pr,
                            solute_chebi, solute_chebi2, solute_text, solute_text2,
                            mediator_pr_text, mediator_pr_text_syn
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", basolateralID)
                    .attr("cx", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        dy[i] = d.y + radius;
                        return d.y + radius;
                    })
                    .attr("r", radius)
                    .attr("fill", "orange")
                    .attr("stroke-width", 20)
                    .attr("cursor", "move")
                    .on("mouseover", function () {
                        div.style("display", "inline");
                        div.transition()
                            .duration(200)
                            .style("opacity", 1);

                        var id = d3.select(this)._groups[0][0].id,
                            indexOfComma = id.indexOf(','),
                            tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                                "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                        div.html(
                            '<b>CellML </b> ' +
                            '<a href="' + tempworkspace + '" target="_blank">' +
                            '<img border="0" alt="CellML" src="img/cellml.png" width="30" height="20"></a>' +
                            '<br/>' +
                            '<b>SEDML </b> ' +
                            '<a href="https://sed-ml.github.io/index.html" target="_blank">' +
                            '<img border="0" alt="SEDML" src="img/SEDML.png" width="30" height="20"></a>' +
                            '<br/>' +
                            '<b>Click middle mouse to close</b>')
                            .style("left", d3.mouse(this)[0] + 140 + "px")
                            .style("top", d3.mouse(this)[1] + 90 + "px");
                    });

                // protein name inside this circle
                circlewithtext[i] = linegcircle.append("text")
                    .attr("id", "circlewithtext" + tempID)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x - 15;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
                        return d.y + 23;
                    })
                    .attr("font-size", "12px")
                    .attr("fill", "red")
                    .attr("fontWeight", "bold")
                    .attr("cursor", "move")
                    .text(mediator_pr_text_syn);

                if (textvalue2 != "single flux") {
                    var lineg2 = lineg.append("g").data([{x: xvalue + width, y: yvalueb + radius * 2}]);
                    linewithlineg2[i] = lineg2.append("line")
                        .attr("id", "linewithlineg2" + tempID)
                        .attr("x1", function (d) {
                            dx1line2[i] = d.x;
                            return d.x;
                        })
                        .attr("y1", function (d) {
                            dy1line2[i] = d.y;
                            return d.y;
                        })
                        .attr("x2", function (d) {
                            dx2line2[i] = d.x + lineLen;
                            return d.x + lineLen;
                        })
                        .attr("y2", function (d) {
                            dy2line2[i] = d.y;
                            return d.y;
                        })
                        .attr("stroke", "black")
                        .attr("stroke-width", 2)
                        .attr("marker-end", "url(#end)")
                        .attr("cursor", "pointer");

                    var linegtext2 = lineg2.append("g").data([{
                        x: xvalue + lineLen + 10 + width, y: yvalueb + radius * 2 + markerHeight
                    }]);
                    linewithtextg2[i] = linegtext2.append("text")
                        .attr("id", "linewithtextg2" + tempID)
                        .attr("x", function (d) {
                            dxtext2[i] = d.x;
                            return d.x;
                        })
                        .attr("y", function (d) {
                            dytext2[i] = d.y;
                            return d.y;
                        })
                        .attr("font-family", "Times New Roman")
                        .attr("font-size", "12px")
                        .attr("font-weight", "bold")
                        .attr("fill", "red")
                        .attr("cursor", "pointer")
                        .text(solute_text2);
                }

                // increment y-axis of line and circle
                yvalueb += ydistance;
                cyvalueb += ydistance;
            }

            // case 5
            if ((src_fma == interstitialID && snk_fma == cytosolID) && (src_fma2 == "channel" && snk_fma2 == "channel")) {
                var polygong = newg.append("g").data([{x: xvalue - 5 + width, y: yvalueb}]);
                linewithlineg[i] = polygong.append("line")
                    .attr("id", "linewithlineg" + tempID)
                    .attr("x1", function (d) {
                        dx1line[i] = d.x;
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        dy1line[i] = d.y;
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        dx2line[i] = d.x + polygonlineLen;
                        return d.x + polygonlineLen;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y;
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-start", "url(#start)")
                    .attr("cursor", "pointer");

                var linegtext = polygong.append("g").data([{x: xvalue - 30 + width, y: yvalueb + 5}]);
                linewithtextg[i] = linegtext.append("text")
                    .attr("id", "linewithtextg" + tempID)
                    .attr("x", function (d) {
                        dxtext[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dytext[i] = d.y;
                        return d.y;
                    })
                    .attr("font-family", "Times New Roman")
                    .attr("font-size", "12px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(solute_text);

                // Polygon
                circlewithlineg[i] = polygong.append("g").append("polygon")
                    .attr("transform", "translate(" + (xvalue - 5 + width) + "," + (yvalueb - 30) + ")")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2,
                            mediator_fma, mediator_pr,
                            solute_chebi, solute_chebi2, solute_text, solute_text2,
                            mediator_pr_text, mediator_pr_text_syn
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", basolateralID)
                    .attr("cx", function (d) {
                        dx[i] = xvalue - 5 + width;
                        return dx[i];
                    })
                    .attr("cy", function (d) {
                        dy[i] = yvalueb - 30;
                        return dy[i];
                    })
                    .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                    .attr("fill", "yellow")
                    .attr("stroke", "black")
                    .attr("stroke-linecap", "round")
                    .attr("stroke-linejoin", "round")
                    .attr("cursor", "move")
                    .on("mouseover", function () {
                        div.style("display", "inline");
                        div.transition()
                            .duration(200)
                            .style("opacity", 1);

                        var id = d3.select(this)._groups[0][0].id,
                            indexOfComma = id.indexOf(','),
                            tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                                "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                        div.html(
                            '<b>CellML </b> ' +
                            '<a href="' + tempworkspace + '" target="_blank">' +
                            '<img border="0" alt="CellML" src="img/cellml.png" width="30" height="20"></a>' +
                            '<br/>' +
                            '<b>SEDML </b> ' +
                            '<a href="https://sed-ml.github.io/index.html" target="_blank">' +
                            '<img border="0" alt="SEDML" src="img/SEDML.png" width="30" height="20"></a>' +
                            '<br/>' +
                            '<b>Click middle mouse to close</b>')
                            .style("left", d3.mouse(this)[0] + 140 + "px")
                            .style("top", d3.mouse(this)[1] + 90 + "px");
                    });

                var polygontext = polygong.append("g").data([{x: xvalue + 12 + width, y: yvalueb + 4}]);
                circlewithtext[i] = polygontext.append("text")
                    .attr("id", "circlewithtext" + tempID)
                    .attr("x", function (d) {
                        dxtext[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dytext[i] = d.y;
                        return d.y;
                    })
                    .attr("font-size", "10px")
                    .attr("fill", "red")
                    .attr("cursor", "move")
                    .text(mediator_pr_text_syn);

                // increment y-axis of line and circle
                yvalueb += ydistance;
                cyvalueb += ydistance;
            }

            // case 6
            if ((src_fma == cytosolID && snk_fma == interstitialID) && (src_fma2 == "channel" && snk_fma2 == "channel")) {
                var polygong = newg.append("g").data([{x: xvalue - 5 + width, y: yvalueb}]);
                linewithlineg[i] = polygong.append("line")
                    .attr("id", "linewithlineg" + tempID)
                    .attr("x1", function (d) {
                        dx1line[i] = d.x;
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        dy1line[i] = d.y;
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        dx2line[i] = d.x + polygonlineLen;
                        return d.x + polygonlineLen;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y;
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#end)")
                    .attr("cursor", "pointer");

                var linegtext = polygong.append("g").data([{x: xvalue + lineLen + 10 + width, y: yvalueb + 5}]);
                linewithtextg[i] = linegtext.append("text")
                    .attr("id", "linewithtextg" + tempID)
                    .attr("x", function (d) {
                        dxtext[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dytext[i] = d.y;
                        return d.y;
                    })
                    .attr("font-family", "Times New Roman")
                    .attr("font-size", "12px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(solute_text);

                // Polygon
                circlewithlineg[i] = polygong.append("g").append("polygon")
                    .attr("transform", "translate(" + (xvalue - 5 + width) + "," + (yvalueb - 30) + ")")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2,
                            mediator_fma, mediator_pr,
                            solute_chebi, solute_chebi2, solute_text, solute_text2,
                            mediator_pr_text, mediator_pr_text_syn
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", basolateralID)
                    .attr("cx", function (d) {
                        dx[i] = xvalue - 5 + width;
                        return dx[i];
                    })
                    .attr("cy", function (d) {
                        dy[i] = yvalueb - 30;
                        return dy[i];
                    })
                    .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                    .attr("fill", "yellow")
                    .attr("stroke", "black")
                    .attr("stroke-linecap", "round")
                    .attr("stroke-linejoin", "round")
                    .attr("cursor", "move")
                    .on("mouseover", function () {
                        div.style("display", "inline");
                        div.transition()
                            .duration(200)
                            .style("opacity", 1);

                        var id = d3.select(this)._groups[0][0].id,
                            indexOfComma = id.indexOf(','),
                            tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                                "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                        div.html(
                            '<b>CellML </b> ' +
                            '<a href="' + tempworkspace + '" target="_blank">' +
                            '<img border="0" alt="CellML" src="img/cellml.png" width="30" height="20"></a>' +
                            '<br/>' +
                            '<b>SEDML </b> ' +
                            '<a href="https://sed-ml.github.io/index.html" target="_blank">' +
                            '<img border="0" alt="SEDML" src="img/SEDML.png" width="30" height="20"></a>' +
                            '<br/>' +
                            '<b>Click middle mouse to close</b>')
                            .style("left", d3.mouse(this)[0] + 140 + "px")
                            .style("top", d3.mouse(this)[1] + 90 + "px");
                    });

                var polygontext = polygong.append("g").data([{x: xvalue + 12 + width, y: yvalueb + 4}]);
                circlewithtext[i] = polygontext.append("text")
                    .attr("id", "circlewithtext" + tempID)
                    .attr("x", function (d) {
                        dxtext[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dytext[i] = d.y;
                        return d.y;
                    })
                    .attr("font-size", "10px")
                    .attr("fill", "red")
                    .attr("cursor", "move")
                    .text(solute_text);

                // increment y-axis of line and circle
                yvalueb += ydistance;
                cyvalueb += ydistance;
            }
        }

        /*  Paracellular Membrane */
        if (textvalue2 == "diffusive channel") {
            var lineg = newg.append("g").data([{x: xpvalue, y: ypvalue + 5}]);
            circlewithlineg[i] = lineg.append("text") // linewithtextg
                .attr("id", "linewithtextg" + tempID)
                .attr("index", tempID)
                .attr("x", function (d) {
                    dx[i] = d.x; // dxtext
                    return d.x;
                })
                .attr("y", function (d) {
                    dy[i] = d.y; // dytext
                    return d.y;
                })
                .attr("font-family", "Times New Roman")
                .attr("font-size", "12px")
                .attr("font-weight", "bold")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text(solute_text)
                .on("mouseover", function () {
                    div.style("display", "inline");
                    div.transition()
                        .duration(200)
                        .style("opacity", 1);

                    var id = d3.select(this)._groups[0][0].id,
                        indexOfComma = id.indexOf(','),
                        tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                            "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                    div.html(
                        '<b>CellML </b> ' +
                        '<a href="' + tempworkspace + '" target="_blank">' +
                        '<img border="0" alt="CellML" src="img/cellml.png" width="30" height="20"></a>' +
                        '<br/>' +
                        '<b>SEDML </b> ' +
                        '<a href="https://sed-ml.github.io/index.html" target="_blank">' +
                        '<img border="0" alt="SEDML" src="img/SEDML.png" width="30" height="20"></a>' +
                        '<br/>' +
                        '<b>Click middle mouse to close</b>')
                        .style("left", d3.mouse(this)[0] + 140 + "px")
                        .style("top", d3.mouse(this)[1] + 90 + "px");
                });

            var linetextg = lineg.append("g").data([{x: xpvalue + 20, y: ypvalue}]);
            linewithlineg[i] = linetextg.append("line")
                .attr("id", "linewithlineg" + tempID)
                .attr("index", tempID)
                .attr("x1", function (d) {
                    dx1line[i] = d.x;
                    return d.x;
                })
                .attr("y1", function (d) {
                    dy1line[i] = d.y;
                    return d.y;
                })
                .attr("x2", function (d) {
                    dx2line[i] = d.x + pcellLen;
                    return d.x + pcellLen;
                })
                .attr("y2", function (d) {
                    dy2line[i] = d.y;
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#end)")
                .attr("cursor", "move");

            ypvalue += ypdistance;
        }
    }

    var initdragcircleandend = function () {
        var membrane = $(cthis).attr("membrane");
        for (var i = 0; i < $("line").length; i++) {
            if ($("line")[i].id == membrane && i == 0) {
                mindex = 1;
                break;
            }
            if ($("line")[i].id == membrane && i == 1) {
                mindex = 0;
                break;
            }
        }

        // console.log("membrane, mindex: ", membrane, mindex);
    }

    function dragcircleline(d) {
        // console.log("this: ", this);
        // console.log("d3.select(this): ", d3.select(this));
        // icircleGlobal = this.getAttribute("index");
        icircleGlobal = $(this).attr("index");

        cthis = this; // remember to debug cthis!!

        // console.log("cthis in dragcircleline: ", cthis);
        // console.log("index: ", icircleGlobal);

        var dx = d3.event.dx;
        var dy = d3.event.dy;

        if ($(this).prop("tagName") == "circle") {
            d3.select(this)
                .attr("cx", parseFloat($(this).prop("cx").baseVal.value) + dx)
                .attr("cy", parseFloat($(this).prop("cy").baseVal.value) + dy);
        }

        if ($(this).prop("tagName") == "text") {
            circlewithlineg[icircleGlobal] // text
                .attr("x", parseFloat(d3.select("#" + "linewithtextg" + icircleGlobal).attr("x")) + dx)
                .attr("y", parseFloat(d3.select("#" + "linewithtextg" + icircleGlobal).attr("y")) + dy);
        }

        if ($(this).prop("tagName") == "polygon") {
            var xNew = [], yNew = [], points = "";
            var pointsLen = d3.select(this)._groups[0][0].points.length;

            for (var i = 0; i < pointsLen; i++) {
                xNew[i] = parseFloat(d3.select(this)._groups[0][0].points[i].x) + dx;
                yNew[i] = parseFloat(d3.select(this)._groups[0][0].points[i].y) + dy;

                points = points.concat("" + xNew[i] + "").concat(",").concat("" + yNew[i] + "");

                if (i != pointsLen - 1)
                    points = points.concat(" ");
            }

            d3.select(this).attr("points", points);
        }

        if (circlewithtext[icircleGlobal] != undefined) {
            // text inside circle
            circlewithtext[icircleGlobal]
                .attr("x", parseFloat(d3.select("#" + "circlewithtext" + icircleGlobal).attr("x")) + dx)
                .attr("y", parseFloat(d3.select("#" + "circlewithtext" + icircleGlobal).attr("y")) + dy);
        }

        if (linewithlineg[icircleGlobal] != undefined) {
            // line 1
            linewithlineg[icircleGlobal]
                .attr("x1", parseFloat(d3.select("#" + "linewithlineg" + icircleGlobal).attr("x1")) + dx)
                .attr("y1", parseFloat(d3.select("#" + "linewithlineg" + icircleGlobal).attr("y1")) + dy)
                .attr("x2", parseFloat(d3.select("#" + "linewithlineg" + icircleGlobal).attr("x2")) + dx)
                .attr("y2", parseFloat(d3.select("#" + "linewithlineg" + icircleGlobal).attr("y2")) + dy);
        }

        if (linewithtextg[icircleGlobal] != undefined) {
            // text 1
            linewithtextg[icircleGlobal]
                .attr("x", parseFloat(d3.select("#" + "linewithtextg" + icircleGlobal).attr("x")) + dx)
                .attr("y", parseFloat(d3.select("#" + "linewithtextg" + icircleGlobal).attr("y")) + dy);
        }

        if (linewithlineg2[icircleGlobal] != undefined) {
            // line 2
            linewithlineg2[icircleGlobal]
                .attr("x1", parseFloat(d3.select("#" + "linewithlineg2" + icircleGlobal).attr("x1")) + dx)
                .attr("y1", parseFloat(d3.select("#" + "linewithlineg2" + icircleGlobal).attr("y1")) + dy)
                .attr("x2", parseFloat(d3.select("#" + "linewithlineg2" + icircleGlobal).attr("x2")) + dx)
                .attr("y2", parseFloat(d3.select("#" + "linewithlineg2" + icircleGlobal).attr("y2")) + dy);
        }

        if (linewithtextg2[icircleGlobal] != undefined) {
            // text 2
            linewithtextg2[icircleGlobal]
                .attr("x", parseFloat(d3.select("#" + "linewithtextg2" + icircleGlobal).attr("x")) + dx)
                .attr("y", parseFloat(d3.select("#" + "linewithtextg2" + icircleGlobal).attr("y")) + dy);
        }

        // initdragcircleandend();
        for (var i = 0; i < $("line").length; i++) {
            if ($("line")[i].id == $(this).attr("membrane") && i == 0) {
                mindex = 1;
                break;
            }
            if ($("line")[i].id == $(this).attr("membrane") && i == 1) {
                mindex = 0;
                break;
            }
        }

        // If paracellular's diffusive channel Then undefined
        if ($("line")[mindex] != undefined) {
            // detect basolateralMembrane - 0 apical, 1 basolateralMembrane, 3 cell junction
            var lineb_x = $($("line")[mindex]).prop("x1").baseVal.value;
            var lineb_y1 = $($("line")[mindex]).prop("y1").baseVal.value;
            var lineb_y2 = $($("line")[mindex]).prop("y2").baseVal.value;

            var cx, cy;
            if ($(this).prop("tagName") == "circle") {
                cx = $(this).prop("cx").baseVal.value;
                cy = $(this).prop("cy").baseVal.value;
            }

            if ($(this).prop("tagName") == "polygon") {
                cx = event.x;
                cy = event.y;
            }

            var lineb_id = $($("line")[mindex]).prop("id");
            var circle_id = $(this).prop("id");

            // if ((cx >= lineb_x && cx <= lineb_x + 1) &&
            //     (cy >= lineb_y1 && cy <= lineb_y2) && (lineb_id != circle_id)) {
            //     $($("line")[mindex]).css("stroke", "red");

            if ((cx >= lineb_x - radius / 2 && cx <= lineb_x + radius / 2) && (lineb_id != circle_id)) {
                $($("line")[mindex]).css("stroke", "red");

                var tempYvalue;
                if (mindex == 1) tempYvalue = yvalueb;
                else tempYvalue = yvalue;

                // if ((cx >= lineb_x && cx <= lineb_x + 5) &&
                //     (cy >= (tempYvalue + radius) && cy <= (tempYvalue + radius + 5)) && (lineb_id != circle_id)) {
                //     $($("line")[mindex]).css("stroke", "yellow");

                if ((cx >= lineb_x - radius / 2 && cx <= lineb_x + radius / 2) && (lineb_id != circle_id)) {
                    $($("line")[mindex]).css("stroke", "yellow");
                }
            }
            else {
                if (mindex == 1)
                    $($("line")[mindex]).css("stroke", "orange");

                else
                    $($("line")[mindex]).css("stroke", "green");
            }
        }
    }

    function dragcircleendline(d) {
        initdragcircleandend();

        // If paracellular's diffusive channel Then undefined
        if ($("line")[mindex] != undefined) {
            // detect basolateralMembrane - 0 apical, 1 basolateralMembrane, 3 cell junction
            var lineb_x = $($("line")[mindex]).prop("x1").baseVal.value;
            var lineb_y1 = $($("line")[mindex]).prop("y1").baseVal.value;
            var lineb_y2 = $($("line")[mindex]).prop("y2").baseVal.value;

            var cx, cy;
            if ($(cthis).prop("tagName") == "circle") {
                cx = $(cthis).prop("cx").baseVal.value;
                cy = $(cthis).prop("cy").baseVal.value;
            }

            if ($(cthis).prop("tagName") == "polygon") {
                cx = event.x;
                cy = event.y;
            }

            var lineb_id = $($("line")[mindex]).prop("id");
            var circle_id = $(cthis).prop("id");

            // if ((cx >= lineb_x && cx <= lineb_x + 1) &&
            //     (cy >= lineb_y1 && cy <= lineb_y2) && (lineb_id != circle_id)) {

            if ((cx >= lineb_x - radius / 2 && cx <= lineb_x + radius / 2) && (lineb_id != circle_id)) {

                var tempYvalue;
                if (mindex == 1) tempYvalue = yvalueb;
                else tempYvalue = yvalue;

                // if ((cx >= lineb_x && cx <= lineb_x + 5) &&
                //     (cy >= (tempYvalue + radius) && cy <= (tempYvalue + radius + 5)) && (lineb_id != circle_id)) {

                if ((cx >= lineb_x - radius / 2 && cx <= lineb_x + radius / 2) && (lineb_id != circle_id)) {

                    $($("line")[mindex]).css("stroke", "yellow");

                    var m = new welcomeModal({
                        id: 'myWelcomeModal',
                        header: 'Are you sure you want to move?',
                        footer: 'My footer',
                        footerCloseButton: 'No',
                        footerSaveButton: 'Yes'
                    });

                    $('#myWelcomeModal').modal({backdrop: 'static', keyboard: false});
                    m.show();

                    function welcomeModal(options) {
                        var $this = this;

                        options = options ? options : {};
                        $this.options = {};
                        $this.options.header = options.header !== undefined ? options.header : false;
                        $this.options.footer = options.footer !== undefined ? options.footer : false;
                        $this.options.closeButton = options.closeButton !== undefined ? options.closeButton : true;
                        $this.options.footerCloseButton = options.footerCloseButton !== undefined ? options.footerCloseButton : false;
                        $this.options.footerSaveButton = options.footerSaveButton !== undefined ? options.footerSaveButton : false;
                        $this.options.id = options.id !== undefined ? options.id : "myWelcomeModal";

                        /**
                         * Append modal window html to body
                         */
                        $this.createModal = function () {
                            $('body').append('<div id="' + $this.options.id + '" class="modal fade"></div>');
                            $($this.selector).append('<div class="modal-dialog custom-modal"><div class="modal-content"></div></div>');
                            var win = $('.modal-content', $this.selector);

                            if ($this.options.header) {
                                win.append('<div class="modal-header"><h4 class="modal-title" lang="de"></h4></div>');

                                if ($this.options.closeButton) {
                                    win.find('.modal-header').prepend('<button type="button" ' +
                                        'class="close" data-dismiss="modal">&times;</button>');
                                }
                            }

                            if ($this.options.footer) {
                                win.append('<div class="modal-footer"></div>');

                                if ($this.options.footerCloseButton) {
                                    win.find('.modal-footer').append('<a data-dismiss="modal" id="closeID" href="#" ' +
                                        'class="btn btn-default" lang="de">' + $this.options.footerCloseButton + '</a>');
                                }

                                if ($this.options.footerSaveButton) {
                                    win.find('.modal-footer').append('<a data-dismiss="modal" id="saveID" href="#" ' +
                                        'class="btn btn-default" lang="de">' + $this.options.footerSaveButton + '</a>');
                                }
                            }

                            // No button clicked!!
                            $("#closeID").click(function (event) {
                                console.log("No clicked!");
                                console.log("first close button clicked!");

                                moveBack();
                                membraneColorBack();
                            })

                            // Yes button clicked!!
                            $("#saveID").click(function (event) {

                                console.log("Yes clicked!");
                                console.log("first save button clicked!");

                                var m = new Modal({
                                    id: 'myModal',
                                    header: 'Recommender System',
                                    footer: 'My footer',
                                    footerCloseButton: 'Close',
                                    footerSaveButton: 'Save'
                                });

                                $('#myModal').modal({backdrop: 'static', keyboard: false});
                                m.getBody().html('<div id="modalBody"></div>');
                                m.show();

                                showLoading("#modalBody");

                                var circleID = $(cthis).prop("id").split(",");
                                console.log("circleID in myWelcomeModal: ", circleID);

                                // parsing
                                cellmlModel = circleID[0];
                                var indexOfHash = cellmlModel.search("#");
                                cellmlModel = cellmlModel.slice(0, indexOfHash);

                                cellmlModel = cellmlModel + "#" + cellmlModel.slice(0, cellmlModel.indexOf('.'));

                                console.log("cellmlModel: ", cellmlModel);

                                if (circleID[1] != "") {
                                    var query = 'SELECT ?Protein ?Biological_meaning ?Biological_meaning2 ?Species ?Gene ' +
                                        'WHERE { GRAPH ?g { ' +
                                        '<' + cellmlModel + '#Protein> <http://purl.org/dc/terms/description> ?Protein . ' +
                                        '<' + circleID[0] + '> <http://purl.org/dc/terms/description> ?Biological_meaning . ' +
                                        '<' + circleID[1] + '> <http://purl.org/dc/terms/description> ?Biological_meaning2 . ' +
                                        '<' + cellmlModel + '#Species> <http://purl.org/dc/terms/description> ?Species . ' +
                                        '<' + cellmlModel + '#Gene> <http://purl.org/dc/terms/description> ?Gene . ' +
                                        '}}'
                                }
                                else {
                                    // var query = 'SELECT ?Protein ?Biological_meaning ?Biological_meaning2 ?Species ?Gene ' +
                                    //     'WHERE { GRAPH ?g { ' +
                                    //     '<' + cellmlModel + '#Protein> <http://purl.org/dc/terms/description> ?Protein . ' +
                                    //     '<' + circleID[0] + '> <http://purl.org/dc/terms/description> ?Biological_meaning . ' +
                                    //     '<' + cellmlModel + '#Species> <http://purl.org/dc/terms/description> ?Species . ' +
                                    //     '<' + cellmlModel + '#Gene> <http://purl.org/dc/terms/description> ?Gene . ' +
                                    //     '}}'

                                    var query = 'SELECT ?Protein ?Biological_meaning ?Biological_meaning2 ' +
                                        'WHERE { GRAPH ?g { ' +
                                        '<' + cellmlModel + '> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein . ' +
                                        '<' + circleID[0] + '> <http://purl.org/dc/terms/description> ?Biological_meaning . ' +
                                        '}}'
                                }

                                // protein name
                                sendPostRequest(
                                    endpoint,
                                    query,
                                    function (jsonModel) {

                                        console.log("jsonModel: ", jsonModel);

                                        proteinName = jsonModel.results.bindings[0].Protein.value;
                                        var endpointprOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/pr/terms?iri=" + proteinName;

                                        sendGetRequest(
                                            endpointprOLS,
                                            function (jsonPr) {

                                                if (jsonPr._embedded.terms[0]._links.has_gene_template != undefined)
                                                    var endpointgeneOLS = jsonPr._embedded.terms[0]._links.has_gene_template.href;

                                                sendGetRequest(
                                                    endpointgeneOLS,
                                                    function (jsonGene) {

                                                        if (jsonPr._embedded.terms[0]._links.only_in_taxon != undefined)
                                                            var endpointspeciesOLS = jsonPr._embedded.terms[0]._links.only_in_taxon.href;

                                                        sendGetRequest(
                                                            endpointspeciesOLS,
                                                            function (jsonSpecies) {

                                                                proteinText = jsonPr._embedded.terms[0].label;
                                                                var indexOfParen = proteinText.indexOf('(');
                                                                proteinText = proteinText.slice(0, indexOfParen - 1);
                                                                biological_meaning = jsonModel.results.bindings[0].Biological_meaning.value;

                                                                if (circleID[1] != "")
                                                                    biological_meaning2 = jsonModel.results.bindings[0].Biological_meaning2.value;
                                                                else
                                                                    biological_meaning2 = "";

                                                                speciesName = jsonSpecies._embedded.terms[0].label;
                                                                geneName = jsonGene._embedded.terms[0].label;
                                                                var indexOfParen = geneName.indexOf('(');
                                                                geneName = geneName.slice(0, indexOfParen - 1);

                                                                var query = 'SELECT ?cellmlmodel ' +
                                                                    'WHERE { GRAPH ?g { ' +
                                                                    '?cellmlmodel <http://www.obofoundry.org/ro/ro.owl#modelOf> <' + proteinName + '> . ' +
                                                                    '}}'

                                                                sendPostRequest(
                                                                    endpoint,
                                                                    query,
                                                                    function (jsonCellmlModel) {

                                                                        console.log("jsonCellmlModel: ", jsonCellmlModel);

                                                                        var query = 'SELECT ?located_in ' +
                                                                            'WHERE { GRAPH ?g { ' +
                                                                            '<' + cellmlModel + '> <http://www.obofoundry.org/ro/ro.owl#located_in> ?located_in . ' +
                                                                            '}}'

                                                                        // location of that cellml model
                                                                        sendPostRequest(
                                                                            endpoint,
                                                                            query,
                                                                            function (jsonLocatedin) {

                                                                                console.log("jsonLocatedin: ", jsonLocatedin);

                                                                                var counter = 0;
                                                                                // Type of model - kidney, lungs, etc
                                                                                for (var i = 0; i < jsonLocatedin.results.bindings.length; i++) {
                                                                                    for (var j = 0; j < organ.length; j++) {
                                                                                        for (var k = 0; k < organ[j].key.length; k++) {
                                                                                            if (jsonLocatedin.results.bindings[i].located_in.value == organ[j].key[k].key)
                                                                                                counter++;

                                                                                            if (counter == jsonLocatedin.results.bindings.length) {
                                                                                                typeOfModel = organ[j].value;
                                                                                                organIndex = j;
                                                                                                break;
                                                                                            }
                                                                                        }
                                                                                        if (counter == jsonLocatedin.results.bindings.length)
                                                                                            break;
                                                                                    }
                                                                                    if (counter == jsonLocatedin.results.bindings.length)
                                                                                        break;
                                                                                }

                                                                                loc = "";
                                                                                counter = 0;
                                                                                // get locations of the above type of model
                                                                                for (var i = 0; i < jsonLocatedin.results.bindings.length; i++) {
                                                                                    for (var j = 0; j < organ[organIndex].key.length; j++) {
                                                                                        if (jsonLocatedin.results.bindings[i].located_in.value == organ[organIndex].key[j].key) {
                                                                                            loc += organ[organIndex].key[j].value;

                                                                                            if (i == jsonLocatedin.results.bindings.length - 1)
                                                                                                loc += ".";
                                                                                            else
                                                                                                loc += ", ";

                                                                                            counter++;
                                                                                        }
                                                                                        if (counter == jsonLocatedin.results.bindings.length)
                                                                                            break;
                                                                                    }
                                                                                    if (counter == jsonLocatedin.results.bindings.length)
                                                                                        break;
                                                                                }

                                                                                // related cellml model, i.e. kidney, lungs, etc
                                                                                var query = 'SELECT ?cellmlmodel ?located_in ' +
                                                                                    'WHERE { GRAPH ?g { ' +
                                                                                    '?cellmlmodel <http://www.obofoundry.org/ro/ro.owl#located_in> ?located_in. ' +
                                                                                    '}}'

                                                                                sendPostRequest(
                                                                                    endpoint,
                                                                                    query,
                                                                                    function (jsonRelatedModel) {

                                                                                        console.log("jsonRelatedModel: ", jsonRelatedModel);

                                                                                        for (var i = 0; i < jsonRelatedModel.results.bindings.length; i++) {
                                                                                            for (var j = 0; j < organ[organIndex].key.length; j++) {
                                                                                                if (jsonRelatedModel.results.bindings[i].located_in.value == organ[organIndex].key[j].key) {
                                                                                                    // parsing
                                                                                                    var tempModel = jsonRelatedModel.results.bindings[i].cellmlmodel.value;
                                                                                                    var indexOfHash = tempModel.search("#");
                                                                                                    tempModel = tempModel.slice(0, indexOfHash);

                                                                                                    relatedModel.push(tempModel);

                                                                                                    break;
                                                                                                }
                                                                                            }
                                                                                        }

                                                                                        relatedModel = uniqueify(relatedModel);

                                                                                        // kidney, lungs, heart, etc
                                                                                        console.log("relatedModel: ", relatedModel);

                                                                                        console.log("jsonCellmlModel: ", jsonCellmlModel);

                                                                                        var alternativeCellmlArray = [];
                                                                                        for (var i = 0; i < relatedModel.length; i++) {
                                                                                            if (relatedModel[i] != cellmlModel) {
                                                                                                alternativeCellmlArray.push(relatedModel[i]);
                                                                                            }
                                                                                        }

                                                                                        relatedCellmlModel(
                                                                                            relatedModel,
                                                                                            alternativeCellmlArray,
                                                                                            $(cthis).attr("membrane")
                                                                                        );

                                                                                    }, true);
                                                                            }, true);
                                                                    }, true)
                                                            },
                                                            true);
                                                    },
                                                    true);

                                            }, true);

                                    }, true);

                                jQuery(window).trigger('resize');
                            })
                        };

                        /**
                         * Set header text. It makes sense only if the options.header is logical true.
                         * @param {String} html New header text.
                         */
                        $this.setHeader = function (html) {
                            $this.window.find('.modal-title').html(html);
                        };

                        /**
                         * Show modal window
                         */
                        $this.show = function () {
                            $this.window.modal('show');
                        };

                        $this.selector = "#" + $this.options.id;
                        if (!$($this.selector).length) {
                            $this.createModal();
                        }

                        $this.window = $($this.selector);
                        $this.setHeader($this.options.header);
                    }
                }
                else {
                    moveBack();

                    if (mindex == 1)
                        linebasolateral.transition().delay(1000).duration(1000).style("stroke", "orange");
                    else
                        lineapical.transition().delay(1000).duration(1000).style("stroke", "green");
                }
            }
            else {
                if (mindex == 1)
                    $($("line")[mindex]).css("stroke", "orange");
                else
                    $($("line")[mindex]).css("stroke", "green");
            }
        }
    }

    function dragcircleunchecked(d) {
        d3.select(this).classed("dragging", false);
    }

    // related kidney, lungs, etc model
    var relatedCellmlModel = function (relatedModel, alternativeCellmlArray, membrane) {

        var indexOfcellml = relatedModel[idProtein].search(".cellml");
        var modelname = relatedModel[idProtein].slice(0, indexOfcellml);

        modelname = relatedModel[idProtein] + "#" + modelname;

        var query = 'SELECT ?Protein ?workspaceName ' +
            'WHERE { GRAPH ?workspaceName { ' +
            '<' + modelname + '> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein . ' +
            '}}'

        sendPostRequest(
            endpoint,
            query,
            function (jsonProtein) {

                if (jsonProtein.results.bindings.length == 0) {
                    idProtein++;
                    relatedCellmlModel(relatedModel, alternativeCellmlArray, membrane);
                }

                // console.log("jsonProtein.results.bindings: ", jsonProtein.results.bindings);
                var endpointprOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/pr/terms?iri=" +
                    jsonProtein.results.bindings[0].Protein.value;

                sendGetRequest(
                    endpointprOLS,
                    function (jsonPr) {

                        if (jsonProtein.results.bindings.length != 0) {
                            // relatedModelValue.push(jsonProtein.results.bindings[0].Protein.value);
                            relatedModelValue.push({
                                protein: jsonProtein.results.bindings[0].Protein.value,
                                prname: jsonPr._embedded.terms[0].label
                            });
                            relatedModelID.push(relatedModel[idProtein]);
                            workspaceName = jsonProtein.results.bindings[0].workspaceName.value;
                        }

                        idProtein++;

                        if (idProtein == relatedModel.length) {
                            idProtein = 0;

                            // console.log("alternativeCellmlArray Before: ", alternativeCellmlArray, membrane);

                            alternativeCellmlModel(alternativeCellmlArray, membrane);
                            return;
                        }

                        relatedCellmlModel(relatedModel, alternativeCellmlArray, membrane);
                    },
                    true);
            },
            true);
    }

    // alternative model of a dragged transporter, e.g. rat NHE3, mouse NHE3
    var alternativeCellmlModel = function (alternativeCellmlArray, membrane) {

        // console.log("alternativeCellmlArray: ", alternativeCellmlArray, membrane);

        // if (alternativeCellmlArray[idAltProtein] != undefined) {
        var indexOfcellml = alternativeCellmlArray[idAltProtein].search(".cellml");
        var modelname = alternativeCellmlArray[idAltProtein].slice(0, indexOfcellml);

        modelname = alternativeCellmlArray[idAltProtein] + "#" + modelname;

        var query = 'SELECT ?Protein ?workspaceName ' +
            'WHERE { GRAPH ?workspaceName { ' +
            '<' + modelname + '> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein . ' +
            '}}'

        // console.log("query: ", modelname, query);
        // }
        // else {
        //     modelname = "";
        // }

        sendPostRequest(
            endpoint,
            query,
            function (jsonAltProtein) {

                // console.log("jsonAltProtein: ", jsonAltProtein);

                // console.log("jsonAltProtein OUTSIDE: ", jsonAltProtein);
                var flagvar = true;

                if (jsonAltProtein.results.bindings.length != 0) {
                    if (jsonAltProtein.results.bindings[0].Protein.value == proteinName) {

                        // console.log("jsonAltProtein INSIDE: ", jsonAltProtein);
                        flagvar = false;

                        var callOLS = function () {

                            // console.log("jsonAltProtein INSIDE callOLS: ", jsonAltProtein);

                            workspaceName = jsonAltProtein.results.bindings[0].workspaceName.value;
                            var pruri = jsonAltProtein.results.bindings[0].Protein.value;
                            var workspaceuri = workspaceName + "/" + "rawfile" + "/" + "HEAD" + "/" + alternativeCellmlArray[idAltProtein];

                            var endpointOLS = "https://www.ebi.ac.uk/ols/api/ontologies/pr/terms?iri=" + pruri;

                            sendGetRequest(
                                endpointOLS,
                                function (jsonOLSObj) {
                                    var label = document.createElement('label');
                                    label.innerHTML = '<br><input id="' + alternativeCellmlArray[idAltProtein] + '" ' +
                                        'type="checkbox" value="' + alternativeCellmlArray[idAltProtein] + '">' +
                                        '<a href="' + workspaceuri + '" target="_blank" ' +
                                        'data-toggle="tooltip" data-placement="right" ' +
                                        'title="' + pruri + '">' + jsonOLSObj._embedded.terms[0].label + '</a></label>';

                                    altCellmlModel += label.innerHTML;

                                    flagvar = true;

                                    // console.log("jsonAltProtein INSIDE sendGetRequest: ", jsonAltProtein);

                                    idAltProtein++;

                                    if (idAltProtein == alternativeCellmlArray.length) {

                                        // If apical Then basolateral and vice versa
                                        var membraneName;
                                        if (membrane == apicalID) {
                                            membrane = basolateralID;
                                            membraneName = "Basolateral membrane";
                                        }
                                        else {
                                            membrane = apicalID;
                                            membraneName = "Apical membrane";
                                        }

                                        // TODO: make it dynamic
                                        if (workspaceName == "") {
                                            relatedMembrane(267, membrane, membraneName);
                                            return;
                                        }
                                        else {
                                            relatedMembrane(workspaceName, membrane, membraneName);
                                            return;
                                        }
                                    }

                                    alternativeCellmlModel(alternativeCellmlArray, membrane);
                                },
                                true);
                        }

                        callOLS();
                    }
                }

                if (flagvar == true) {
                    idAltProtein++;

                    if (idAltProtein == alternativeCellmlArray.length) {

                        idAltProtein = 0;

                        // If apical Then basolateral and vice versa
                        var membraneName;
                        if (membrane == apicalID) {
                            membrane = basolateralID;
                            membraneName = "Basolateral membrane";
                        }
                        else {
                            membrane = apicalID;
                            membraneName = "Apical membrane";
                        }

                        // TODO: make it dynamic
                        if (workspaceName == "") {
                            relatedMembrane(267, membrane, membraneName);
                            return;
                        }
                        else {
                            relatedMembrane(workspaceName, membrane, membraneName);
                            return;
                        }
                    }

                    alternativeCellmlModel(alternativeCellmlArray, membrane);
                }
            }, true);
    }

    // existing apical or basolateral membrane in PMR
    var relatedMembrane = function (workspaceName, membrane, membraneName) {

        console.log("relatedMembrane: ", workspaceName, membrane, membraneName);
        console.log("CHEBI: ", $(cthis).prop("id").split(","));
        // TODO: change arrow and variable name in epithelial platform
        var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
            'PREFIX dcterms: <http://purl.org/dc/terms/>' +
            'SELECT ?cellmlmodel ?Model_entity ' +
            'WHERE { GRAPH ?g { ' +
            '?cellmlmodel <http://www.obofoundry.org/ro/ro.owl#located_in> <' + membrane + '>. ' +
            '?entity semsim:hasPhysicalDefinition <' + $(cthis).prop("id").split(",")[12] + '>. ' +
            '?source semsim:hasPhysicalEntityReference ?entity. ' +
            '?process semsim:hasSourceParticipant ?source. ' +
            '?property semsim:physicalPropertyOf ?process. ' +
            '?Model_entity semsim:isComputationalComponentFor ?property.' +
            '}}';

        sendPostRequest(
            endpoint,
            query,
            function (jsonRelatedMembrane) {

                console.log("jsonRelatedMembrane: ", jsonRelatedMembrane);

                var tempmembraneModel = [];
                for (var i = 0; i < jsonRelatedMembrane.results.bindings.length; i++) {
                    for (var j = 0; j < organ[organIndex].key.length; j++) {
                        // parsing
                        var kModel = jsonRelatedMembrane.results.bindings[i].cellmlmodel.value;
                        var indexOfHash = kModel.search("#");
                        kModel = kModel.slice(0, indexOfHash);

                        membraneModel.push(kModel);

                        break;
                    }

                    tempmembraneModel.push(jsonRelatedMembrane.results.bindings[i].Model_entity.value);
                }

                membraneModel = uniqueify(membraneModel);
                console.log("membraneModel: ", membraneModel);

                // find and make model_entity#component.variable
                tempmembraneModel = uniqueify(tempmembraneModel);
                for (var i = 0; i < membraneModel.length; i++) {
                    for (var j = 0; j < tempmembraneModel.length; j++) {
                        var kModel = tempmembraneModel[j];
                        var indexOfHash = kModel.search("#");
                        kModel = kModel.slice(0, indexOfHash);
                        if (membraneModel[i] == kModel) {
                            membraneModel[i] = tempmembraneModel[j];
                        }
                    }
                }

                relatedMembraneModel(workspaceName, membraneName);

            }, true);
    }

    var relatedMembraneModel = function (workspaceName, membraneName) {

        if (membraneModel[idMembrane] != undefined) {
            var indexOfHash = membraneModel[idMembrane].search("#");
            var tempmembraneModel = membraneModel[idMembrane].slice(0, indexOfHash);
        }

        var indexOfcellml = tempmembraneModel.search(".cellml");
        var modelname = tempmembraneModel.slice(0, indexOfcellml);

        tempmembraneModel = tempmembraneModel + "#" + modelname;

        console.log("tempmembraneModel: ", tempmembraneModel);
        console.log("membraneModel: ", membraneModel);

        var query = 'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
            'PREFIX dcterms: <http://purl.org/dc/terms/>' +
            'SELECT ?Protein ' +
            'WHERE { ' +
            '<' + tempmembraneModel + '> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein . ' +
            '}'

        sendPostRequest(
            endpoint,
            query,
            function (jsonRelatedMembraneModel) {

                console.log("jsonRelatedMembraneModel: ", jsonRelatedMembraneModel);

                var endpointprOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/pr/terms?iri=" +
                    jsonRelatedMembraneModel.results.bindings[0].Protein.value;

                sendGetRequest(
                    endpointprOLS,
                    function (jsonPr) {

                        var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                            'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
                            'SELECT ?source_fma ?sink_fma ?med_entity_uri ' +
                            'WHERE { ' +
                            '<' + membraneModel[idMembrane] + '> semsim:isComputationalComponentFor ?model_prop. ' +
                            '?model_prop semsim:physicalPropertyOf ?model_proc. ' +
                            '?model_proc semsim:hasSourceParticipant ?model_srcparticipant. ' +
                            '?model_srcparticipant semsim:hasPhysicalEntityReference ?source_entity. ' +
                            '?source_entity ro:part_of ?source_part_of_entity. ' +
                            '?source_part_of_entity semsim:hasPhysicalDefinition ?source_fma. ' +
                            '?model_proc semsim:hasSinkParticipant ?model_sinkparticipant. ' +
                            '?model_sinkparticipant semsim:hasPhysicalEntityReference ?sink_entity. ' +
                            '?sink_entity ro:part_of ?sink_part_of_entity. ' +
                            '?sink_part_of_entity semsim:hasPhysicalDefinition ?sink_fma.' +
                            '?model_proc semsim:hasMediatorParticipant ?model_medparticipant.' +
                            '?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity.' +
                            '?med_entity semsim:hasPhysicalDefinition ?med_entity_uri.' +
                            '}'

                        sendPostRequest(
                            endpoint,
                            query,
                            function (jsonObjFlux) {
                                console.log("jsonObjFlux: ", jsonObjFlux);

                                if (jsonRelatedMembraneModel.results.bindings.length != 0) {

                                    membraneModelValue.push({
                                        protein: jsonRelatedMembraneModel.results.bindings[0].Protein.value,
                                        prname: jsonPr._embedded.terms[0].label,
                                        // uri1 is the dragged circle
                                        uri1: combinedMembrane[0].med_pr,
                                        medfma: combinedMembrane[0].med_fma,
                                        similar: 0 // initial percent
                                    });
                                    // membraneModeID.push(membraneModel[idMembrane]);

                                    membraneObject.push({
                                        source_fma: jsonObjFlux.results.bindings[0].source_fma.value,
                                        sink_fma: jsonObjFlux.results.bindings[0].sink_fma.value,
                                        med_fma: jsonObjFlux.results.bindings[0].med_entity_uri.value
                                    });

                                    var circleID = $(cthis).prop("id").split(",");
                                    var indexOfHash = membraneModel[idMembrane].search("#"),
                                        srctext = membraneModel[idMembrane].slice(indexOfHash + 1),
                                        indexOfdot = srctext.indexOf('.');

                                    srctext = srctext.slice(indexOfdot + 1);

                                    var tempjsonObjFlux = uniqueifyjsonFlux(jsonObjFlux.results.bindings);

                                    console.log("tempjsonObjFlux: ", tempjsonObjFlux);

                                    var temp_med_pr;
                                    if (jsonObjFlux.results.bindings[1] == undefined)
                                        temp_med_pr = undefined;
                                    else
                                        temp_med_pr = jsonObjFlux.results.bindings[1].med_entity_uri.value;

                                    // For now consider only single flux
                                    if (circleID[1] == "") {
                                        membraneModelID.push([
                                            membraneModel[idMembrane],
                                            circleID[1],
                                            srctext,
                                            circleID[3],
                                            srctext,
                                            circleID[5],
                                            tempjsonObjFlux[0].source_fma.value,
                                            tempjsonObjFlux[0].source_fma.value,
                                            tempjsonObjFlux[0].sink_fma.value,
                                            tempjsonObjFlux[0].sink_fma.value,
                                            jsonObjFlux.results.bindings[0].med_entity_uri.value, // med_fma
                                            temp_med_pr // med_pr
                                        ]);
                                    }
                                }

                                // console.log("membraneObject: ", membraneObject);
                                // console.log("idMembrane: ", idMembrane);
                                // console.log("membraneModel.length: ", membraneModel.length);
                                console.log("membraneModelID: ", membraneModelID);

                                if (membraneModel[idMembrane] != undefined)
                                    idMembrane++;

                                if (idMembrane == membraneModel.length) {
                                    idMembrane = 0;

                                    var msg2 = "<p><b>" + proteinText + "</b> is a <b>" + typeOfModel + "</b> model. It is located in " +
                                        "<b>" + loc + "</b><\p>";

                                    var workspaceuri = "https://models.physiomeproject.org/workspace/267" + "/" +
                                        "rawfile" + "/" + "HEAD" + "/" + $(cthis).prop("id").split(",")[0];

                                    var model = "<b>Model: </b><a href='" + workspaceuri + "' target='_blank " +
                                        "data-toggle='tooltip' data-placement='right' " +
                                        "title='" + proteinText + "'>" + $(cthis).prop("id").split(",")[0] + "</a>";

                                    var biological = "<p><b>Biological Meaning: </b>" + biological_meaning + "</p>";

                                    if (biological_meaning2 != "")
                                        biological += "<p>" + biological_meaning2 + "</p>";

                                    var species = "<p><b>Species: </b>" + speciesName + "</p>";
                                    var gene = "<p><b>Gene: </b>" + geneName + "</p>";
                                    var protein = "<p data-toggle='tooltip' data-placement='right' title='" + proteinName + "'>" +
                                        "<b>Protein: </b>" + proteinText + "</p>";

                                    // Related apical or basolateral model
                                    var dataJSON = [];
                                    d3.json("protein_alignment.json", function (data) {
                                        for (var i = 0; i < data.length; i++) {
                                            dataJSON.push({
                                                pid1: data[i].pid1,
                                                pid2: data[i].pid2,
                                                name1: data[i].name1,
                                                name2: data[i].name2,
                                                uri1: data[i].uri1,
                                                uri2: data[i].uri2,
                                                similar: data[i].similar
                                            })
                                        }

                                        console.log("dataJSON: ", dataJSON);

                                        for (var m = 0; m < membraneModelValue.length; m++) {
                                            for (var n = 0; n < dataJSON.length; n++) {
                                                if (membraneModelValue[m].uri1 == dataJSON[n].uri1 &&
                                                    membraneModelValue[m].uri2 == dataJSON[n].uri2) {
                                                    membraneModelValue[m].similar = dataJSON[n].similar;
                                                }
                                            }
                                        }

                                        console.log("membraneModelValue: ", membraneModelValue);

                                        // Descending sorting
                                        membraneModelValue.sort(function (a, b) {
                                            return b.similar - a.similar;
                                        });

                                        console.log("AFTER membraneModelValue: ", membraneModelValue);

                                        var membraneTransporter = "<p><b>" + membraneName + " model</b>";
                                        if (membraneModelValue.length == 0) {
                                            membraneTransporter += "<br>Not Exist";
                                        }
                                        else {
                                            for (var i = 0; i < membraneModelValue.length; i++) {
                                                var workspaceuri = workspaceName + "/" + "rawfile" + "/" + "HEAD" + "/" + membraneModelID[i][0];

                                                var label = document.createElement('label');
                                                label.innerHTML = '<br><input id="' + membraneModelID[i] + '" ' +
                                                    'type="checkbox" value="' + membraneModelValue[i].prname + '">' +
                                                    '<a href="' + workspaceuri + '" target="_blank" ' +
                                                    'data-toggle="tooltip" data-placement="right" ' +
                                                    'title="' + membraneModelValue[i].protein + '">' + membraneModelValue[i].prname + '</a></label>';

                                                membraneTransporter += label.innerHTML;
                                            }
                                        }

                                        // Alternative model
                                        var alternativeModel = "<p><b>Alternative model of " + proteinText + "</b>";
                                        // console.log("Alternative model: ", altCellmlModel);
                                        if (altCellmlModel == "") {
                                            alternativeModel += "<br>Not Exist";
                                        }
                                        else {
                                            alternativeModel += "</b>" + altCellmlModel + "</p>";
                                        }

                                        // related organ models (kidney, lungs, etc) in PMR
                                        var relatedOrganModels = "<p><b>" + typeOfModel + " model in PMR</b>";
                                        // console.log("related kidney model: ", relatedModelValue, relatedOrganModels);
                                        if (relatedModelValue.length == 1) { // includes own protein name
                                            relatedOrganModels += "<br>Not Exist";
                                        }
                                        else {
                                            for (var i = 0; i < relatedModelValue.length; i++) {

                                                if (proteinName == relatedModelValue[i].protein)
                                                    continue;

                                                var workspaceuri = workspaceName + "/" + "rawfile" + "/" + "HEAD" + "/" + relatedModelID[i];

                                                var label = document.createElement('label');
                                                label.innerHTML = '<br><a href="' + workspaceuri + '" target="_blank" ' +
                                                    'data-toggle="tooltip" data-placement="right" ' +
                                                    'title="' + relatedModelValue[i].protein + '">' + relatedModelValue[i].prname + '' +
                                                    '</a></label>';

                                                relatedOrganModels += label.innerHTML;
                                            }
                                        }

                                        $('#modalBody').empty();

                                        $('#modalBody')
                                            .append(msg2)
                                            .append(model)
                                            .append(biological)
                                            .append(species)
                                            .append(gene)
                                            .append(protein);

                                        var msg3 = "<br><p><b>Recommendations/suggestions based on existing models in PMR<b><\p>";

                                        $('#modalBody')
                                            .append(msg3)
                                            .append(membraneTransporter)
                                            .append(alternativeModel)
                                            .append(relatedOrganModels);

                                        console.log("outside modelbody!");

                                    })

                                    return;
                                }

                                relatedMembraneModel(workspaceName, membraneName);

                            }, true);
                    },
                    true);
            },
            true);
    }

    // utility function
    var moveBack = function () {
        if (linewithlineg[icircleGlobal] != undefined) {
            linewithlineg[icircleGlobal]
                .transition()
                .delay(1000)
                .duration(1000)
                .attr("x1", dx1line[icircleGlobal])
                .attr("y1", dy1line[icircleGlobal])
                .attr("x2", dx2line[icircleGlobal])
                .attr("y2", dy2line[icircleGlobal]);
        }

        if (linewithtextg[icircleGlobal] != undefined) {
            linewithtextg[icircleGlobal]
                .transition()
                .delay(1000)
                .duration(1000)
                .attr("x", dxtext[icircleGlobal])
                .attr("y", dytext[icircleGlobal]);
        }

        if (circlewithlineg[icircleGlobal]._groups[0][0].tagName == "polygon") {
            circlewithlineg[icircleGlobal]
                .transition()
                .delay(1000)
                .duration(1000)
                .attr("transform", "translate(" + dx[icircleGlobal] + "," + dy[icircleGlobal] + ")")
                .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30");
        }

        if (circlewithlineg[icircleGlobal]._groups[0][0].tagName == "circle") {
            circlewithlineg[icircleGlobal]
                .transition()
                .delay(1000)
                .duration(1000)
                .attr("cx", dx[icircleGlobal])
                .attr("cy", dy[icircleGlobal]);
        }

        // text inside circle
        if (circlewithtext[icircleGlobal] != undefined) {
            circlewithtext[icircleGlobal]
                .transition()
                .delay(1000)
                .duration(1000)
                .attr("x", dx[icircleGlobal] - 15)
                .attr("y", dy[icircleGlobal] + 23);
        }

        if (linewithlineg2[icircleGlobal] != undefined) {
            linewithlineg2[icircleGlobal]
                .transition()
                .delay(1000)
                .duration(1000)
                .attr("x1", dx1line2[icircleGlobal])
                .attr("y1", dy1line2[icircleGlobal])
                .attr("x2", dx2line2[icircleGlobal])
                .attr("y2", dy2line2[icircleGlobal]);
        }

        if (linewithtextg2[icircleGlobal] != undefined) {
            linewithtextg2[icircleGlobal]
                .transition()
                .delay(1000)
                .duration(1000)
                .attr("x", dxtext2[icircleGlobal])
                .attr("y", dytext2[icircleGlobal]);
        }
    }

    // utility function
    var membraneColorBack = function () {
        for (var i = 0; i < $("line").length; i++) {
            if ($("line")[i].id == $(cthis).attr("membrane") && i == 0) {
                linebasolateral
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .style("stroke", "orange");

                yvalueb += ydistance;
                break;
            }
            if ($("line")[i].id == $(this).attr("membrane") && i == 1) {
                lineapical
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .style("stroke", "green");

                yvalue += ydistance;
                break;
            }
        }
    }

    var circleRearrange = function () {
        // initial values for apical
        var cyinitial = 213.3333282470703,
            dy1lineinitial = 193.3333282470703,
            dy1lineinitial2 = 233.3333282470703,
            dytextinitial = 198.3333282470703,
            dytextinitial2 = 237.3333282470703;
        for (var i = 0; i < circlewithlineg.length; i++) {
            if (circlewithlineg[i].attr("membrane") == apicalID) {
                // line 1
                dy1line[i] = dy1lineinitial;
                dy2line[i] = dy1lineinitial;
                linewithlineg[i]
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .attr("y1", dy1line[i])
                    .attr("y2", dy2line[i])

                // text 1
                dytext[i] = dytextinitial;
                linewithtextg[i]
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .attr("y", dytext[i])

                if (linewithlineg2[i] != undefined) {

                    console.log("apical !!!");

                    // line 2
                    dy1line2[i] = dy1lineinitial2;
                    dy2line2[i] = dy1lineinitial2;
                    linewithlineg2[i]
                        .transition()
                        .delay(1000)
                        .duration(1000)
                        .attr("y1", dy1line2[i])
                        .attr("y2", dy2line2[i])

                    // text 2
                    dytext2[i] = dytextinitial2;
                    linewithtextg2[i]
                        .transition()
                        .delay(1000)
                        .duration(1000)
                        .attr("y", dytext2[i])
                }

                if (circlewithlineg[i]._groups[0][0].tagName == "circle") {
                    dy[i] = cyinitial;
                    circlewithlineg[i]
                        .transition()
                        .delay(1000)
                        .duration(1000)
                        .attr("cy", dy[i]);
                }

                if (circlewithlineg[i]._groups[0][0].tagName == "polygon") {
                    dy[i] = cyinitial;
                    circlewithlineg[i]
                        .transition()
                        .delay(1000)
                        .duration(1000)
                        .attr("transform", "translate(" + dx[i] + "," + dy[i] + ")")
                        .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30");
                }

                cyinitial += ydistance;
                dy1lineinitial += ydistance;
                dy1lineinitial2 += ydistance;
                dytextinitial += ydistance;
                dytextinitial2 += ydistance;
            }
        }

        // initial values for basolateral
        var cyinitialb = 213.3333282470703,
            dy1lineinitialb = 193.3333282470703,
            dy1lineinitialb2 = 233.3333282470703,
            dytextinitialb = 198.3333282470703,
            dytextinitialb2 = 237.3333282470703;
        for (var i = 0; i < circlewithlineg.length; i++) {
            if (circlewithlineg[i].attr("membrane") == basolateralID) {
                // line 1
                dy1line[i] = dy1lineinitialb;
                dy2line[i] = dy1lineinitialb;
                linewithlineg[i]
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .attr("y1", dy1line[i])
                    .attr("y2", dy2line[i])

                // text 1
                dytext[i] = dytextinitialb;
                linewithtextg[i]
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .attr("y", dytext[i])

                if (linewithlineg2[i] != undefined) {
                    // line 2
                    dy1line2[i] = dy1lineinitialb2;
                    dy2line2[i] = dy1lineinitialb2;
                    linewithlineg2[i]
                        .transition()
                        .delay(1000)
                        .duration(1000)
                        .attr("y1", dy1line2[i])
                        .attr("y2", dy2line2[i])

                    // text 2
                    dytext2[i] = dytextinitialb2;
                    linewithtextg2[i]
                        .transition()
                        .delay(1000)
                        .duration(1000)
                        .attr("y", dytext2[i])
                }

                if (circlewithlineg[i]._groups[0][0].tagName == "circle") {
                    dy[i] = cyinitialb;
                    circlewithlineg[i]
                        .transition()
                        .delay(1000)
                        .duration(1000)
                        .attr("cy", dy[i]);
                }

                if (circlewithlineg[i]._groups[0][0].tagName == "polygon") {
                    dy[i] = cyinitialb;
                    circlewithlineg[i]
                        .transition()
                        .delay(1000)
                        .duration(1000)
                        .attr("transform", "translate(" + dx[i] + "," + dy[i] + ")")
                        .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30");
                }

                // decrement y-axis of line and circle
                cyinitialb += ydistance;
                dy1lineinitialb += ydistance;
                dy1lineinitialb2 += ydistance;
                dytextinitialb += ydistance;
                dytextinitialb2 += ydistance;
            }
        }
    }

    var Modal = function (options) {
        var $this = this;

        options = options ? options : {};
        $this.options = {};
        $this.options.header = options.header !== undefined ? options.header : false;
        $this.options.footer = options.footer !== undefined ? options.footer : false;
        $this.options.closeButton = options.closeButton !== undefined ? options.closeButton : true;
        $this.options.footerCloseButton = options.footerCloseButton !== undefined ? options.footerCloseButton : false;
        $this.options.footerSaveButton = options.footerSaveButton !== undefined ? options.footerSaveButton : false;
        $this.options.id = options.id !== undefined ? options.id : "myModal";

        /**
         * Append modal window html to body
         */
        $this.createModal = function () {
            $('body').append('<div id="' + $this.options.id + '" class="modal fade"></div>');
            $($this.selector).append('<div class="modal-dialog custom-modal"><div class="modal-content"></div></div>');
            var win = $('.modal-content', $this.selector);

            var someText = "A recommender system or a recommendation system (sometimes replacing " +
                "\nsystem with a synonym such as platform or engine) is a subclass of information " +
                "\nfiltering system that seeks to predict the rating or preference that a user " +
                "\nwould give to an item.";

            var headerHtml = '<div class="modal-header">' +
                '<h4 class="modal-title" data-toggle="tooltip" data-placement="right" title="' + someText + '" lang="de">' +
                '</h4></div>'

            if ($this.options.header) {
                // win.append('<div class="modal-header"><h4 class="modal-title" lang="de"></h4></div>');
                win.append(headerHtml);

                if ($this.options.closeButton) {
                    win.find('.modal-header').prepend('<button type="button" ' +
                        'class="close" data-dismiss="modal">&times;</button>');
                }
            }

            win.append('<div class="modal-body"></div>');
            if ($this.options.footer) {
                win.append('<div class="modal-footer"></div>');

                if ($this.options.footerCloseButton) {
                    win.find('.modal-footer').append('<a data-dismiss="modal" id="mcloseID" href="#" ' +
                        'class="btn btn-default" lang="de">' + $this.options.footerCloseButton + '</a>');
                }

                if ($this.options.footerSaveButton) {
                    win.find('.modal-footer').append('<a data-dismiss="modal" id="msaveID" href="#" ' +
                        'class="btn btn-default" lang="de">' + $this.options.footerSaveButton + '</a>');
                }
            }

            console.log("win BEFORE close and save clicked: ", win);

            // close button clicked!!
            $("#mcloseID").click(function (event) {

                console.log("second close button clicked!!");

                moveBack();
                membraneColorBack();
            })

            // save button clicked!!
            $("#msaveID").click(function (event) {

                console.log("second save button clicked!");
                console.log("cthis and $(cthis): ", cthis, $(cthis));
                console.log("win AFTER save clicked: ", win);

                var tempIndex = 0;
                var filter = function (membraneID) {
                    var circleID = $(cthis).prop("id").split(",");
                    for (var i = 0; i < membrane.length; i++) {
                        console.log("Inside filter: ", membrane[i].source_name, circleID[0]);
                        if (membrane[i].source_name == circleID[0]) {
                            // membrane[i].med_fma = membraneID;
                            tempIndex = i;
                            return;
                        }
                    }
                }

                // apicalID -> basolateralID
                if ($(cthis).attr("membrane") == apicalID) {
                    $(cthis).attr("membrane", basolateralID);
                    filter(basolateralID); // membrane attr
                }
                else {
                    $(cthis).attr("membrane", apicalID);
                    filter(apicalID); // membrane attr
                }

                console.log("input ID: ", win[0].children[1].children[0].children[9].getElementsByTagName("input"));
                console.log("input ID children[0]: ", win[0].children[1].children[0]);

                // checkbox!!
                if (win[0].children[1].children[0].children[9] != undefined) {
                    for (var i = 0; i < win[0].children[1].children[0].children[9].getElementsByTagName("input").length; i++) {
                        if (win[0].children[1].children[0].children[9].getElementsByTagName("input")[i].checked) {

                            console.log("Basolateral or apical model clicked!!");

                            console.log("checked: ", win[0].children[1].children[0].children[9].getElementsByTagName("input")[i].checked);
                            console.log("id CHECKBOX: ", win[0].children[1].children[0].children[9].getElementsByTagName("input")[i].id);

                            $(cthis).attr("id", win[0].children[1].children[0].children[9].getElementsByTagName("input")[i].id)
                            // cthis.id = win[0].children[1].children[0].children[9].getElementsByTagName("input")[i].id;
                            console.log("cthis AFTER: ", cthis);
                            console.log("id CHECKBOX: ", win[0].children[1].children[0].children[9].getElementsByTagName("input")[i].id);
                        }
                    }
                }

                // checkbox!!
                if (win[0].children[1].children[0].children[10] != undefined) {
                    for (var i = 0; i < win[0].children[1].children[0].children[10].getElementsByTagName("input").length; i++) {
                        if (win[0].children[1].children[0].children[10].getElementsByTagName("input")[i].checked) {

                            console.log("Alternative model clicked!!");

                            console.log("checked: ", win[0].children[1].children[0].children[10].getElementsByTagName("input")[i].checked);
                            console.log("id CHECKBOX: ", win[0].children[1].children[0].children[10].getElementsByTagName("input")[i].id);

                            $(cthis).attr("id", win[0].children[1].children[0].children[10].getElementsByTagName("input")[i].id);
                            // cthis.id = win[0].children[1].children[0].children[10].getElementsByTagName("input")[i].id;
                            console.log("cthis AFTER: ", cthis);
                            console.log("id CHECKBOX: ", win[0].children[1].children[0].children[10].getElementsByTagName("input")[i].id);
                        }
                    }
                }

                // checkbox!!
                if (win[0].children[1].children[0].children[11] != undefined) {
                    for (var i = 0; i < win[0].children[1].children[0].children[11].getElementsByTagName("input").length; i++) {
                        if (win[0].children[1].children[0].children[11].getElementsByTagName("input")[i].checked) {

                            console.log("Related cellml model clicked!!");

                            console.log("checked CHECKBOX: ", win[0].children[1].children[0].children[11].getElementsByTagName("input")[i].checked);
                            console.log("id CHECKBOX: ", win[0].children[1].children[0].children[11].getElementsByTagName("input")[i].id);

                            $(cthis).attr("id", win[0].children[1].children[0].children[11].getElementsByTagName("input")[i].id);
                            // cthis.id = win[0].children[1].children[0].children[11].getElementsByTagName("input")[i].id;
                            console.log("cthis AFTER: ", cthis);
                            console.log("id CHECKBOX: ", win[0].children[1].children[0].children[11].getElementsByTagName("input")[i].id);
                        }
                    }
                }

                membraneColorBack();

                var index = d3.select(cthis)._groups[0][0].attributes[1].value;
                var stylefill = d3.select(cthis)._groups[0][0].attributes[6].value;

                // channel in yellow color showing error - temp solution
                // if (circlewithlineg[index] != undefined) {
                if (stylefill == "lightgreen")
                    circlewithlineg[index].transition().delay(1000).duration(1000).style("fill", "orange");
                else
                    circlewithlineg[index].transition().delay(1000).duration(1000).style("fill", "lightgreen");
                // }

                var circleID = $(cthis).prop("id").split(",");
                console.log("circleID: ", circleID);

                // update source, sink, and med fma
                membrane[tempIndex].source_name = circleID[0];

                // For now comment to know previous cellml model entity
                // membrane[tempIndex].sink_name = circleID[1];

                membrane[tempIndex].source_text = circleID[2];
                membrane[tempIndex].sink_text = circleID[4];
                membrane[tempIndex].med_text = circleID[2];

                membrane[tempIndex].source_fma = circleID[6];
                membrane[tempIndex].sink_fma = circleID[8];
                membrane[tempIndex].med_pr = circleID[10];
                membrane[tempIndex].med_fma = circleID[11];

                // JSON to make a new cellml model
                console.log("membrane: ", membrane);
                xmlIndex = 0;
                createJSON();

                // TODO: circle placement and rearrangement
                // TODO: membrane attr changed above, thus it affects here.
                if ($(cthis).attr("membrane") == apicalID) {
                    linebasolateral
                        .transition()
                        .delay(1000)
                        .duration(1000)
                        .style("stroke", "orange");

                    // line 1
                    dx1line[icircleGlobal] = xvalue + width;
                    dy1line[icircleGlobal] = yvalueb;
                    dx2line[icircleGlobal] = xvalue + width + lineLen;
                    dy2line[icircleGlobal] = yvalueb;
                    linewithlineg[icircleGlobal]
                        .attr("x1", dx1line[icircleGlobal])
                        .attr("y1", dy1line[icircleGlobal])
                        .attr("x2", dx2line[icircleGlobal])
                        .attr("y2", dy2line[icircleGlobal])

                    // text 1
                    dxtext[icircleGlobal] = xvalue + lineLen + 10 + width;
                    dytext[icircleGlobal] = yvalueb + 5;
                    linewithtextg[icircleGlobal]
                        .attr("x", dxtext[icircleGlobal])
                        .attr("y", dytext[icircleGlobal])

                    // circle
                    dx[icircleGlobal] = cxvalue + width;
                    dy[icircleGlobal] = cyvalueb + radius;
                    circlewithlineg[icircleGlobal]
                        .attr("cx", dx[icircleGlobal])
                        .attr("cy", dy[icircleGlobal])
                        .attr("membrane", basolateralID)

                    if (linewithlineg2[icircleGlobal] != undefined) {
                        // line 2
                        dx1line2[icircleGlobal] = xvalue + width;
                        dy1line2[icircleGlobal] = yvalueb + radius * 2;
                        dx2line2[icircleGlobal] = xvalue + width + lineLen;
                        dy2line2[icircleGlobal] = yvalueb + radius * 2;
                        linewithlineg2[icircleGlobal]
                            .attr("x1", dx1line2[icircleGlobal])
                            .attr("y1", dy1line2[icircleGlobal])
                            .attr("x2", dx2line2[icircleGlobal])
                            .attr("y2", dy2line2[icircleGlobal])

                        // text 2
                        dxtext2[icircleGlobal] = xvalue + lineLen + 10 + width;
                        dytext2[icircleGlobal] = yvalueb + radius * 2 + markerHeight;
                        linewithtextg2[icircleGlobal]
                            .attr("x", dxtext2[icircleGlobal])
                            .attr("y", dytext2[icircleGlobal])
                    }

                    // decrement y-axis of line and circle
                    yvalue -= ydistance;
                    cyvalue -= ydistance;

                    // increment y-axis of line and circle

                    console.log("yvalueb cyvalueb: ", yvalueb, cyvalueb);

                    yvalueb += ydistance;
                    cyvalueb += ydistance;

                    console.log("After yvalueb cyvalueb: ", yvalueb, cyvalueb);

                    circleRearrange();
                }
                else {
                    lineapical
                        .transition()
                        .delay(1000)
                        .duration(1000)
                        .style("stroke", "green");

                    // line 1
                    dx1line[icircleGlobal] = xvalue;
                    dy1line[icircleGlobal] = yvalue;
                    dx2line[icircleGlobal] = xvalue + lineLen;
                    dy2line[icircleGlobal] = yvalue;
                    linewithlineg[icircleGlobal]
                        .attr("x1", dx1line[icircleGlobal])
                        .attr("y1", dy1line[icircleGlobal])
                        .attr("x2", dx2line[icircleGlobal])
                        .attr("y2", dy2line[icircleGlobal])

                    // text 1
                    dxtext[icircleGlobal] = xvalue + lineLen + 10;
                    dytext[icircleGlobal] = yvalue + 5;
                    linewithtextg[icircleGlobal]
                        .attr("x", dxtext[icircleGlobal])
                        .attr("y", dytext[icircleGlobal])

                    // circle
                    dx[icircleGlobal] = cxvalue;
                    dy[icircleGlobal] = cyvalue + radius;
                    circlewithlineg[icircleGlobal]
                        .attr("cx", dx[icircleGlobal])
                        .attr("cy", dy[icircleGlobal])
                        .attr("membrane", apicalID)

                    if (linewithlineg2[icircleGlobal] != undefined) {
                        // line 2
                        dx1line2[icircleGlobal] = xvalue;
                        dy1line2[icircleGlobal] = yvalue + radius * 2;
                        dx2line2[icircleGlobal] = xvalue + lineLen;
                        dy2line2[icircleGlobal] = yvalue + radius * 2;
                        linewithlineg2[icircleGlobal]
                            .attr("x1", dx1line2[icircleGlobal])
                            .attr("y1", dy1line2[icircleGlobal])
                            .attr("x2", dx2line2[icircleGlobal])
                            .attr("y2", dy2line2[icircleGlobal])

                        // text 2
                        dxtext2[icircleGlobal] = xvalue + lineLen + 10;
                        dytext2[icircleGlobal] = yvalue + radius * 2 + markerHeight;
                        linewithtextg2[icircleGlobal]
                            .attr("x", dxtext2[icircleGlobal])
                            .attr("y", dytext2[icircleGlobal])
                    }

                    // decrement y-axis of line and circle
                    yvalueb -= ydistance;
                    cyvalueb -= ydistance;

                    // increment y-axis of line and circle
                    yvalue += ydistance;
                    cyvalue += ydistance;

                    circleRearrange();
                }

                // reinitialize for next dragged circle
                idProtein = 0;
                idAltProtein = 0;
                idMembrane = 0;

                // TODO: change line arrow and text
                console.log("cthis: ", cthis);
                console.log("linewithlineg: ", linewithlineg);
                console.log("linewithtextg: ", linewithtextg);

                // Don't know why did I write this?
                linewithtextg[i].text(circleID[2]);

                // Reinitialise to store fluxes/models in next iteration
                membraneModelValue = [];
                altCellmlModel = "";
                relatedModelValue = [];
            })
        };

        /**
         * Set header text. It makes sense only if the options.header is logical true.
         * @param {String} html New header text.
         */
        $this.setHeader = function (html) {
            $this.window.find('.modal-title').html(html);
        };

        /**
         * Set body HTML.
         * @param {String} html New body HTML
         */
        $this.setBody = function (html) {
            $this.window.find('.modal-body').html(html);
        };

        /**
         * Set footer HTML.
         * @param {String} html New footer HTML
         */
        $this.setFooter = function (html) {
            $this.window.find('.modal-footer').html(html);
        };

        /**
         * Return window body element.
         * @returns {jQuery} The body element
         */
        $this.getBody = function () {
            return $this.window.find('.modal-body');
        };

        /**
         * Show modal window
         */
        $this.show = function () {
            $this.window.modal('show');
        };

        /**
         * Hide modal window
         */
        $this.hide = function () {
            $this.window.modal('hide');
        };

        /**
         * Toggle modal window
         */
        $this.toggle = function () {
            $this.window.modal('toggle');
        };

        $this.selector = "#" + $this.options.id;
        if (!$($this.selector).length) {
            $this.createModal();
        }

        $this.window = $($this.selector);
        $this.setHeader($this.options.header);
    }

    var xmlIndex = 0, modelJSON = [], unitsObj = [], compVarObj = [];
    var createJSON = function () {
        var modelEntity = membrane[xmlIndex].source_name,
            indexOfHash = modelEntity.search("#"),
            componentandVariable = modelEntity.slice(indexOfHash + 1, modelEntity.length);

        var componentName = componentandVariable.slice(0, componentandVariable.indexOf('.'));

        // id
        var indexOfCellml = modelEntity.search(".cellml"),
            workspaceName = 267; // modelEntity.slice(0, indexOfCellml);

        var vEndPoint = "https://models.physiomeproject.org/workspace" + "/" + workspaceName + "/" + "rawfile" +
            "/" + "HEAD" + "/" + modelEntity;

        sendGetRequest(
            vEndPoint,
            function (str) {
                var xml = str,
                    xmlDoc = $.parseXML(xml),
                    $xml = $(xmlDoc);

                $xml.find("component").each(function (index, xmlElem) {
                    if ($(xmlElem).attr("name") == componentName) {
                        $(xmlElem).find("variable").each(function (index, xmlElemVar) {
                            if ($(xmlElemVar).attr("cmeta:id") == componentandVariable) {
                                compVarObj.push(
                                    {
                                        "component": $(xmlElem).attr("name"),
                                        "variable": {
                                            "cmeta:id": $(xmlElemVar).attr("cmeta:id"),
                                            "initial_value": $(xmlElemVar).attr("initial_value"),
                                            "variable_name": $(xmlElemVar).attr("name"),
                                            "public_interface": $(xmlElemVar).attr("public_interface"),
                                            "units": $(xmlElemVar).attr("units")
                                        }
                                    }
                                );

                                $xml.find("units").each(function (index, xmlElemUnit) {
                                    if ($(xmlElemUnit).attr("name") == $(xmlElemVar).attr("units")) {
                                        var temp = [];
                                        temp.push({"name": $(xmlElemUnit).attr("name")});
                                        // Iterate over sub unit elements
                                        $(xmlElemUnit).find("unit").each(function (index, xmlElemSubUnit) {
                                            var subtemp = [];
                                            for (var i = 0; i < $(xmlElemSubUnit)[0].attributes.length; i++) {
                                                subtemp.push(
                                                    {
                                                        "nodeName": $(xmlElemSubUnit)[0].attributes[i].nodeName,
                                                        "nodeValue": $(xmlElemSubUnit)[0].attributes[i].nodeValue
                                                    }
                                                )
                                            }

                                            temp.push(subtemp);
                                        });

                                        unitsObj.push(temp);
                                    }
                                });
                            }
                        });
                    }
                });

                xmlIndex++;
                if (xmlIndex == membrane.length) {

                    var namespaces = "";
                    $xml.find("model").each(function (index, xmlElemModel) {
                        // console.log("xmlElemModel: ", xmlElemModel);
                        console.log("$(xmlElemModel): ", $(xmlElemModel));
                        for (var i = 0; i < $(xmlElemModel)[0].attributes.length; i++) {
                            namespaces += $(xmlElemModel)[0].attributes[i].nodeName + "=" +
                                '"' + $(xmlElemModel)[0].attributes[i].nodeValue + '"';
                            namespaces += " ";
                        }
                    });

                    // mapping
                    var connectionObj = [];
                    for (var i = 0; i < membrane.length; i++) {
                        for (var j = i + 1; j < membrane.length; j++) {
                            if (membrane[i].source_fma === membrane[j].source_fma &&
                                membrane[i].sink_fma === membrane[j].sink_fma &&
                                membrane[i].med_fma === membrane[j].med_fma) {

                                var cellmlEntity1 = membrane[i].source_name,
                                    cellmlEntity2 = membrane[j].source_name,
                                    indexOfHash1 = cellmlEntity1.search("#"),
                                    compandVar1 = cellmlEntity1.slice(indexOfHash1 + 1),
                                    indexOfHash2 = cellmlEntity2.search("#"),
                                    compandVar2 = cellmlEntity2.slice(indexOfHash2 + 1);

                                console.log("cellmlEntity: ", cellmlEntity1, cellmlEntity2);

                                connectionObj.push(
                                    {
                                        "component_1": compandVar1.slice(0, compandVar1.indexOf('.')),
                                        "component_2": compandVar2.slice(0, compandVar2.indexOf('.')),
                                        "variable_1": compandVar1.slice(compandVar1.indexOf('.') + 1),
                                        "variable_2": compandVar2.slice(compandVar2.indexOf('.') + 1)
                                    }
                                );
                            }
                        }
                    }

                    modelJSON.push(
                        {"namespaces": namespaces},
                        {"units": unitsObj},
                        {"component": compVarObj},
                        {"connection": connectionObj}
                    );

                    console.log("model: ", modelJSON);

                    return;
                }

                createJSON(); // callback
            },
            false);
    }

    console.log("membrane: ", membrane);
    createJSON();

    // build the start arrow.
    svg.append("svg:defs")
        .selectAll("marker")
        .data(["start"])      // Different link/path types can be defined here
        .enter().append("svg:marker")    // This section adds in the arrows
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 1)
        .attr("refY", -0.25)
        .attr("markerWidth", markerWidth)
        .attr("markerHeight", markerHeight)
        .attr("orient", "180")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

    // build the starttop arrow.
    svg.append("svg:defs")
        .selectAll("marker")
        .data(["starttop"])      // Different link/path types can be defined here
        .enter().append("svg:marker")    // This section adds in the arrows
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 1)
        .attr("refY", -0.25)
        .attr("markerWidth", markerWidth)
        .attr("markerHeight", markerHeight)
        .attr("orient", "270")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

    // build the end arrow.
    svg.append("svg:defs").selectAll("marker")
        .data(["end"])      // Different link/path types can be defined here
        .enter().append("svg:marker")    // This section adds in the arrows
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 1)
        .attr("refY", -0.25)
        .attr("markerWidth", markerWidth)
        .attr("markerHeight", markerHeight)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

    // Utility for marker direction
    // function markerDir(selection) {
    //     console.log("selection: ", selection);
    //
    //     var mstart = d3.select("#" + selection + "")
    //         ._groups[0][0]
    //         .getAttribute("marker-start");
    //
    //     var mend = d3.select("#" + selection + "")
    //         ._groups[0][0]
    //         .getAttribute("marker-end");
    //
    //     if (mstart == "") {
    //         d3.select("#" + selection + "")
    //             .attr("marker-start", "url(#start)")
    //             .attr("marker-end", "");
    //     }
    //     else {
    //         d3.select("#" + selection + "")
    //             .attr("marker-end", "url(#end)")
    //             .attr("marker-start", "");
    //     }
    //
    //     if (mend == "") {
    //         d3.select("#" + selection + "")
    //             .attr("marker-end", "url(#end)")
    //             .attr("marker-start", "");
    //     }
    //     else {
    //         d3.select("#" + selection + "")
    //             .attr("marker-start", "url(#start)")
    //             .attr("marker-end", "");
    //     }
    // }
}

exports.showsvgEpithelial = showsvgEpithelial;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by dsar941 on 5/11/2017.
 */
var uniqueifySVG = __webpack_require__(0).uniqueifySVG;

var showSVGModelHtml = function (links, model2DArray, modelEntityNameArray) {

    console.log("showSVGModelHtml links: ", links);
    console.log("showSVGModelHtml model2DArray: ", model2DArray);
    console.log("showSVGModelHtml modelEntityNameArray: ", modelEntityNameArray);

    // remove duplicate
    modelEntityNameArray = modelEntityNameArray.filter(function (item, pos) {
        return modelEntityNameArray.indexOf(item) == pos;
    })

    console.log("visualization in modelEntityNameArray: ", modelEntityNameArray);

    for (var ix = 0; ix < modelEntityNameArray.length; ix++) {
        for (var i = 0; i < model2DArray.length; i++) {
            if (modelEntityNameArray[ix] == model2DArray[i][1]) {
                for (var j = 2; j < model2DArray[i].length; j++) {

                    var name;
                    if (j == 2) name = "Protein";
                    if (j == 3) name = "Species";
                    if (j == 4) name = "Gene";
                    if (j == 5) name = "Compartment";

                    links.push({
                        source: model2DArray[i][1],
                        target: model2DArray[i][j],
                        name: name
                    });
                }
            }
        }
    }

    links = uniqueifySVG(links);

    var nodes = {};

    // Compute distinct nodes from the links.
    links.forEach(function (link) {
        link.source = nodes[link.source] ||
            (nodes[link.source] = {name: link.source});

        link.target = nodes[link.target] ||
            (nodes[link.target] = {name: link.target});
    });

    // Making edges ...
    console.log("nodes: ", nodes);
    console.log("links: ", links);

    // SVG graph
    var g = $("#svgVisualize2"),
        width = 1200,
        height = 700;

    var svg = d3.select("#svgVisualize2").append("svg")
        .attrs({
            "width": width,
            "height": height
        })
        .append("g");

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {
            return d.name;
        }))
        .force("charge", d3.forceManyBody().strength(-100))
        .force("center", d3.forceCenter(width / 3, height / 2))
        .force("link", d3.forceLink().distance(100).strength(0.1));

    //build the arrow.
    svg.append("svg:defs").selectAll("marker")
        .data(["end"])      // Different link/path types can be defined here
        .enter().append("svg:marker")    // This section adds in the arrows
        .attrs({
            "id": String,
            "viewBox": "0 -5 10 10",
            "refX": 15,
            "refY": -1.5,
            "markerWidth": 4,
            "markerHeight": 4,
            "orient": "auto"
        })
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

    // label edges with different color
    var edgelabels = ["Protein", "Species", "Gene", "Compartment"];
    var py = 20;

    // add the links and the arrows
    var link = svg.append("svg:g").selectAll("path")
        .data(links)
        .enter().append("svg:path")
        .attr("class", "pathlink")
        .style("stroke", function (d) {
            for (var i = 0; i < edgelabels.length; i++) {
                if (d.name == edgelabels[i]) {
                    svg.append("text")
                        .style("font", "14px sans-serif")
                        .attr("stroke", color(d.name))
                        .attr("x", 10)
                        .attr("y", py)
                        .text(d.name);

                    //increment to get distinct color
                    color(d.name + 1);
                    py = py + 20;
                    edgelabels[i] = "";
                    break;
                }
            }

            return color(d.name);
        })
        .attr("marker-end", "url(#end)");

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(d3.values(nodes))
        .enter().append("g")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node.append("circle")
        .attr("r", 7)
        .styles({
            "fill": function (d) {
                if (modelEntityNameArray.indexOf(d.name) != -1) {
                    return "red";
                }
            },
            "r": function (d) {
                if (modelEntityNameArray.indexOf(d.name) != -1) {
                    return 10;
                }
            }
        })

    // add the text
    node.append("text")
        .attrs({
            "x": 12,
            "dy": ".35em"
        })
        .text(function (d) {
            return d.name;
        });

    simulation
        .nodes(d3.values(nodes))
        .on("tick", tick);

    simulation.force("link")
        .links(links);

    // add the curvy lines
    function tick() {
        link.attr("d", function (d) {

            // Total difference in x and y from source to target
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y;

            // Length of path from center of source node to center of target node
            var dr = Math.sqrt(dx * dx + dy * dy);

            return "M" +
                d.source.x + "," +
                d.source.y + "A" +
                dr + "," + dr + " 0 0,1 " +
                d.target.x + "," +
                d.target.y;
        });

        node.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    // Empty list
    modelEntityNameArray = [];
}

exports.showSVGModelHtml = showSVGModelHtml;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by dsar941 on 5/11/2017.
 */
var createAnchor = __webpack_require__(0).createAnchor;
var searchFn = __webpack_require__(0).searchFn;

// Show a selected entry from search results
var showView = function (jsonObj, viewHtmlContent) {

    console.log("jsonObj: ", jsonObj);

    for (var i = 0; i < jsonObj.head.vars.length; i++) {
        var divHead = $("<div/>").addClass("h3");

        var divText = $("<div/>").addClass("p");

        divHead.append(jsonObj.head.vars[i]);
        divHead.append($("<hr/>"));
        $("#viewList").append(divHead);

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
    }
};

exports.showView = showView;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by dsar941 on 9/8/2016.
 */
var parseModelName = __webpack_require__(0).parseModelName;
var parserFmaNameText = __webpack_require__(0).parserFmaNameText;
var headTitle = __webpack_require__(0).headTitle;
var compare = __webpack_require__(0).compare;
var uniqueifyEpithelial = __webpack_require__(0).uniqueifyEpithelial;
var uniqueifySrcSnkMed = __webpack_require__(0).uniqueifySrcSnkMed;
var iteration = __webpack_require__(0).iteration;
var showView = __webpack_require__(4).showView;
var showSVGModelHtml = __webpack_require__(3).showSVGModelHtml;
var showsvgEpithelial = __webpack_require__(2).showsvgEpithelial;
var showLoading = __webpack_require__(0).showLoading;
var activeMenu = __webpack_require__(0).activeMenu;
var switchMenuToActive = __webpack_require__(0).switchMenuToActive;

var sendGetRequest = __webpack_require__(1).sendGetRequest;
var sendPostRequest = __webpack_require__(1).sendPostRequest;

(function (global) {
    'use strict';

    var endpoint = "https://models.physiomeproject.org/pmr2_virtuoso_search";

    var viewHtml = "./snippets/view.html";
    var modelHtml = "./snippets/model.html";
    var searchHtml = "./snippets/search.html";
    var svgmodelHtml = "./snippets/svgmodel.html";
    var svgepithelialHtml = "./snippets/svgepithelial.html";

    // namespace for utility
    var mainUtils = {};

    // delete operation
    var templistOfModel = [];

    // selected models in load models
    var model = [], model2DArray = [];

    var modelEntityName, // search action
        modelEntityNameArray = [], // model action
        modelEntityFullNameArray = [];

    // svg visualization
    var links = [];

    // process AJAX call
    var modelEntity = [],
        biologicalMeaning = [],
        speciesList = [],
        geneList = [],
        proteinList = [],
        head = [],
        filterModelEntity = [],
        id = 0;

    var str = [];

    mainUtils.loadHomeHtml = function () {
        // Switch from current active button to home button
        var activeItem = "#" + activeMenu();
        switchMenuToActive(activeItem, "#listHome");

        $("#main-content").html("... Home Page !!!");
    };

    mainUtils.loadHelp = function () {
        // Switch from current active button to home button
        var activeItem = "#" + activeMenu();
        switchMenuToActive(activeItem, "#help");

        $("#main-content").html("... Help Page !!!");
    };

    // On page load (before img or CSS)
    $(document).ready(function (event) {
        // Place some startup code here
    });

    $(document).on({
        click: function () {
            // If there's an action with the given name, call it
            if (typeof actions[event.target.dataset.action] === "function") {
                actions[event.target.dataset.action].call(this, event);
            }

        },

        keydown: function () {
            // semantic annotation based on search items
            if (event.key == 'Enter') {

                var uriOPB, uriCHEBI, keyValue;
                var searchTxt = document.getElementById("searchTxt").value;

                // set local storage
                sessionStorage.setItem('searchTxtContent', searchTxt);

                // dictionary object
                var dictionary = [
                    {
                        "key1": "flux", "key2": "",
                        "opb": "<http://identifiers.org/opb/OPB_00593>", "chebi": ""
                    },
                    {
                        "key1": "flux", "key2": "sodium",
                        "opb": "<http://identifiers.org/opb/OPB_00593>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:29101>"
                    },
                    {
                        "key1": "flux", "key2": "hydrogen",
                        "opb": "<http://identifiers.org/opb/OPB_00593>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:15378>"
                    },
                    {
                        "key1": "flux", "key2": "ammonium",
                        "opb": "<http://identifiers.org/opb/OPB_00593>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:28938>"
                    },
                    {
                        "key1": "flux", "key2": "chloride",
                        "opb": "<http://identifiers.org/opb/OPB_00593>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:17996>"
                    },
                    {
                        "key1": "flux", "key2": "potassium",
                        "opb": "<http://identifiers.org/opb/OPB_00593>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:29103>"
                    },
                    {
                        "key1": "flux", "key2": "calcium",
                        "opb": "<http://identifiers.org/opb/OPB_00593>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:22984>"
                    },
                    {
                        "key1": "flux", "key2": "IP3",
                        "opb": "<http://identifiers.org/opb/OPB_00593>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:131186>"
                    },
                    {
                        "key1": "flux", "key2": "glucose",
                        "opb": "<http://identifiers.org/opb/OPB_00593>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:17234>"
                    },
                    {
                        "key1": "flux", "key2": "lactate",
                        "opb": "<http://identifiers.org/opb/OPB_00593>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:24996>"
                    },
                    {
                        "key1": "flux", "key2": "aldosterone",
                        "opb": "<http://identifiers.org/opb/OPB_00593>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:27584>"
                    },
                    {
                        "key1": "flux", "key2": "thiazide",
                        "opb": "<http://identifiers.org/opb/OPB_00593>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:50264>"
                    },
                    {
                        "key1": "flux", "key2": "ATP",
                        "opb": "<http://identifiers.org/opb/OPB_00593>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:15422>"
                    },
                    {
                        "key1": "concentration", "key2": "",
                        "opb": "<http://identifiers.org/opb/OPB_00340>", "chebi": ""
                    },
                    {
                        "key1": "concentration", "key2": "sodium",
                        "opb": "<http://identifiers.org/opb/OPB_00340>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:29101>"
                    },
                    {
                        "key1": "concentration", "key2": "hydrogen",
                        "opb": "<http://identifiers.org/opb/OPB_00340>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:15378>"
                    },
                    {
                        "key1": "concentration", "key2": "ammonium",
                        "opb": "<http://identifiers.org/opb/OPB_00340>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:28938>"
                    },
                    {
                        "key1": "concentration", "key2": "chloride",
                        "opb": "<http://identifiers.org/opb/OPB_00340>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:17996>"
                    },
                    {
                        "key1": "concentration", "key2": "potassium",
                        "opb": "<http://identifiers.org/opb/OPB_00340>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:29103>"
                    },
                    {
                        "key1": "concentration", "key2": "calcium",
                        "opb": "<http://identifiers.org/opb/OPB_00340>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:22984>"
                    },
                    {
                        "key1": "concentration", "key2": "IP3",
                        "opb": "<http://identifiers.org/opb/OPB_00340>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:131186>"
                    },
                    {
                        "key1": "concentration", "key2": "ATP",
                        "opb": "<http://identifiers.org/opb/OPB_00340>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:15422>"
                    },
                    {
                        "key1": "concentration", "key2": "glucose",
                        "opb": "<http://identifiers.org/opb/OPB_00340>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:17234>"
                    },
                    {
                        "key1": "concentration", "key2": "lactate",
                        "opb": "<http://identifiers.org/opb/OPB_00340>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:24996>"
                    },
                    {
                        "key1": "concentration", "key2": "aldosterone",
                        "opb": "<http://identifiers.org/opb/OPB_00340>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:27584>"
                    },
                    {
                        "key1": "concentration", "key2": "thiazide",
                        "opb": "<http://identifiers.org/opb/OPB_00340>",
                        "chebi": "<http://identifiers.org/chebi/CHEBI:50264>"
                    }
                ];

                for (var i = 0; i < dictionary.length; i++) {
                    var key1 = searchTxt.indexOf("" + dictionary[i].key1 + ""),
                        key2 = searchTxt.indexOf("" + dictionary[i].key2 + "");

                    if (key1 != -1 && key2 != -1) {
                        uriOPB = dictionary[i].opb;
                        uriCHEBI = dictionary[i].chebi;
                        keyValue = dictionary[i].key1;
                    }
                }

                showLoading("#searchList");

                modelEntity = [];
                biologicalMeaning = [];
                speciesList = [];
                geneList = [];
                proteinList = [];
                head = [];
                filterModelEntity = [];

                id = 0; // id to index each Model_entity

                mainUtils.discoverModels(uriOPB, uriCHEBI, keyValue);
            }
        }
    });

    var isExist = function (element) {
        // console.log("element: ", element);
        // remove duplicate components with same variable
        var indexOfHash = element.search("#"),
            cellmlModelName = element.slice(0, indexOfHash), // weinstein_1995.cellml
            componentVariableName = element.slice(indexOfHash + 1), // NHE3.J_NHE3_Na
            indexOfDot = componentVariableName.indexOf('.'),
            variableName = componentVariableName.slice(indexOfDot + 1); // J_NHE3_Na

        for (var i = 0; i < templistOfModel.length; i++) {
            var indexOfHash2 = templistOfModel[i].search("#"),
                cellmlModelName2 = templistOfModel[i].slice(0, indexOfHash2), // weinstein_1995.cellml
                componentVariableName2 = templistOfModel[i].slice(indexOfHash2 + 1), // NHE3.J_NHE3_Na
                indexOfDot2 = componentVariableName2.indexOf('.'),
                variableName2 = componentVariableName2.slice(indexOfDot2 + 1); // J_NHE3_Na

            if (cellmlModelName == cellmlModelName2 && variableName == variableName2) {
                return true;
            }
        }

        return false;
    }

    // Event handling for SEARCH, MODEL
    var actions = {

        search: function (event) {

            console.log("search event: ", event);

            if (event.target.className == "checkbox") {

                if (event.target.checked) {
                    var idWithStr = event.target.id;
                    var index = idWithStr.search("#");
                    var workspaceName = idWithStr.slice(0, index);

                    var tempidWithStr = event.target.id;
                    ;

                    mainUtils.workspaceName = workspaceName;
                    mainUtils.tempidWithStr = tempidWithStr;

                    modelEntityName = idWithStr;
                }
                else {
                    mainUtils.workspaceName = "";
                    mainUtils.tempidWithStr = "";
                }
            }


        },

        model: function (event) {

            console.log("model event: ", event);

            // select one by one
            if (event.target.className == "attribute") {

                if (event.target.checked) {

                    if (!isExist(event.target.value)) {
                        templistOfModel.push(event.target.value);

                        // for making visualization graph
                        modelEntityNameArray.push(event.target.value);
                        modelEntityFullNameArray.push(event.target.value);
                    }
                }
                else {
                    var pos = templistOfModel.indexOf(event.target.value);
                    templistOfModel.splice(pos, 1);

                    // for making visualization graph
                    var pos2 = modelEntityNameArray.indexOf(event.target.value);
                    modelEntityNameArray.splice(pos2, 1);
                    modelEntityFullNameArray.splice(pos2, 1);
                }

                var idWithStr = event.target.id;
                var index = idWithStr.search("#");
                var workspaceName = idWithStr.slice(0, index);

                var tempidWithStr = event.target.id;
                ;

                // mainUtils.workspaceName.push(workspaceName);
                mainUtils.workspaceName = workspaceName;
                mainUtils.tempidWithStr = tempidWithStr;
            }

            // select all
            if (event.target.className == "attributeAll") {

                if (event.target.checked == true) {
                    for (var i = 0; i < $('.attribute').length; i++) {
                        $('.attribute')[i].checked = true;

                        if (!isExist($('.attribute')[i].value)) {
                            templistOfModel.push($('.attribute')[i].value);

                            // for making visualization graph
                            modelEntityNameArray.push($('.attribute')[i].value);
                            modelEntityFullNameArray.push($('.attribute')[i].value);
                        }
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

            // remove duplicate in templistOfModel
            templistOfModel = templistOfModel.filter(function (item, pos) {
                return templistOfModel.indexOf(item) == pos;
            })

            // remove duplicate in modelEntityNameArray
            modelEntityNameArray = modelEntityNameArray.filter(function (item, pos) {
                return modelEntityNameArray.indexOf(item) == pos;
            })

            // remove duplicate in modelEntityFullNameArray
            modelEntityFullNameArray = modelEntityFullNameArray.filter(function (item, pos) {
                return modelEntityFullNameArray.indexOf(item) == pos;
            })
        }
    };

    // Load search html
    mainUtils.loadSearchHtml = function () {

        if (!sessionStorage.getItem("searchListContent")) {
            sendGetRequest(
                searchHtml,
                function (searchHtmlContent) {
                    $("#main-content").html(searchHtmlContent);
                },
                false);

        }
        else {
            $("#main-content").html(sessionStorage.getItem('searchListContent'));
        }

        // Switch from current active button to discovery button
        var activeItem = "#" + activeMenu();
        switchMenuToActive(activeItem, "#listDiscovery");
    };

    mainUtils.discoverModels = function (uriOPB, uriCHEBI, keyValue) {

        if (uriCHEBI == "") {
            var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                'PREFIX dcterms: <http://purl.org/dc/terms/>' +
                'SELECT ?Model_entity ?Biological_meaning ' +
                'WHERE { ' +
                '?property semsim:hasPhysicalDefinition ' + uriOPB + '. ' +
                '?Model_entity semsim:isComputationalComponentFor ?property. ' +
                '?Model_entity dcterms:description ?Biological_meaning.' +
                '}';
        }
        else {
            if (keyValue == "flux") {
                var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                    'PREFIX dcterms: <http://purl.org/dc/terms/>' +
                    'SELECT DISTINCT ?g ?Model_entity ?Biological_meaning ' +
                    'WHERE { GRAPH ?g { ' +
                    '?entity semsim:hasPhysicalDefinition ' + uriCHEBI + '. ' +
                    '?source semsim:hasPhysicalEntityReference ?entity. ' +
                    '?process semsim:hasSourceParticipant ?source. ' +
                    '?property semsim:physicalPropertyOf ?process. ' +
                    '?Model_entity semsim:isComputationalComponentFor ?property. ' +
                    '?Model_entity dcterms:description ?Biological_meaning.' +
                    '}}'
            }
            else {
                var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                    'PREFIX dcterms: <http://purl.org/dc/terms/>' +
                    'SELECT ?Model_entity ?Biological_meaning ' +
                    'WHERE { ' +
                    '?entity semsim:hasPhysicalDefinition ' + uriCHEBI + '. ' +
                    '?property semsim:physicalPropertyOf ?entity. ' +
                    '?Model_entity semsim:isComputationalComponentFor ?property. ' +
                    '?Model_entity dcterms:description ?Biological_meaning.' +
                    '}'
            }
        }

        // Model
        sendPostRequest(
            endpoint,
            query,
            function (jsonModel) {

                // console.log("jsonModel in index.js: ", jsonModel);

                if (jsonModel.results.bindings.length == 0) {
                    mainUtils.showDiscoverModels(head, modelEntity, biologicalMeaning, speciesList, geneList, proteinList);
                    return;
                }

                var model = parseModelName(jsonModel.results.bindings[id].Model_entity.value);

                // console.log("model: ", model);

                model = model + "#" + model.slice(0, model.indexOf('.'));

                // console.log("model#: ", model);

                var query = 'SELECT ?Protein ' +
                    'WHERE { ' + '<' + model + '> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein. }';

                // console.log("query: ", query);

                // Species
                sendPostRequest(
                    endpoint,
                    query,
                    function (jsonProteinUri) {

                        // console.log("jsonProteinUri: ", jsonProteinUri);

                        // pig SGLT2 (PR_P31636) is missing in protein ontology
                        // Write a test case for unsuccessful OLS query and handle this issue as undefined
                        // Just assign mouse species for the time being
                        var pr_uri = jsonProteinUri.results.bindings[0].Protein.value;
                        var endpointproteinOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/pr/terms?iri=" + pr_uri;

                        sendGetRequest(
                            endpointproteinOLS,
                            function (jsonProtein) {

                                // console.log("jsonProtein: ", jsonProtein);

                                if (jsonProtein._embedded.terms[0]._links.has_gene_template != undefined)
                                    var endpointgeneOLS = jsonProtein._embedded.terms[0]._links.has_gene_template.href;

                                sendGetRequest(
                                    endpointgeneOLS,
                                    function (jsonGene) {

                                        // console.log("jsonGene: ", jsonGene);

                                        if (jsonProtein._embedded.terms[0]._links.only_in_taxon != undefined)
                                            var endpointspeciesOLS = jsonProtein._embedded.terms[0]._links.only_in_taxon.href;

                                        sendGetRequest(
                                            endpointspeciesOLS,
                                            function (jsonSpecies) {

                                                // console.log("jsonSpecies: ", jsonSpecies);

                                                // console.log("jsonModel: ", jsonModel);

                                                // model and biological meaning
                                                modelEntity.push(jsonModel.results.bindings[id].Model_entity.value);
                                                biologicalMeaning.push(jsonModel.results.bindings[id].Biological_meaning.value);

                                                // species
                                                if (jsonSpecies._embedded.terms.length == 0)
                                                    speciesList.push("Undefined");
                                                else
                                                    speciesList.push(jsonSpecies._embedded.terms[0].label);

                                                // gene
                                                if (jsonGene._embedded.terms.length == 0)
                                                    geneList.push("Undefined");
                                                else {
                                                    var geneName = jsonGene._embedded.terms[0].label;
                                                    var indexOfParen = geneName.indexOf('(');
                                                    geneName = geneName.slice(0, indexOfParen - 1);
                                                    geneList.push(geneName);
                                                }

                                                // protein
                                                if (jsonProtein._embedded.terms.length == 0)
                                                    proteinList.push("Undefined");
                                                else {
                                                    var proteinName = jsonProtein._embedded.terms[0].label;
                                                    var indexOfParen = proteinName.indexOf('(');
                                                    proteinName = proteinName.slice(0, indexOfParen - 1);
                                                    proteinList.push(proteinName);
                                                }

                                                head = headTitle(jsonModel, jsonSpecies, jsonGene, jsonProtein);

                                                mainUtils.showDiscoverModels(
                                                    head,
                                                    modelEntity,
                                                    biologicalMeaning,
                                                    speciesList,
                                                    geneList,
                                                    proteinList);

                                                id++; // increment index of modelEntity

                                                if (id == jsonModel.results.bindings.length) {
                                                    return;
                                                }

                                                mainUtils.discoverModels(uriOPB, uriCHEBI, keyValue); // callback
                                            },
                                            true);
                                    },
                                    true);
                            },
                            true);
                    },
                    true);
            },
            true);
    }

    // TODO: make a common table platform for all functions
    // Show discovered models from PMR
    mainUtils.showDiscoverModels = function (head, modelEntity, biologicalMeaning, speciesList, geneList, proteinList) {

        // Empty search result
        if (head.length == 0) {
            $("#searchList").html(
                "<section class='container-fluid'><label><br>No Search Results!</label></section>"
            );

            return;
        }

        // Reinitialize for a new search result
        $("#searchList").html("");

        var table = $("<table/>").addClass("table table-hover table-condensed"); //table-bordered table-striped

        // Table header
        var thead = $("<thead/>"), tr = $("<tr/>");
        for (var i = 0; i < head.length; i++) {
            // Empty header for checkbox column
            if (i == 0)
                tr.append($("<th/>").append(""));

            tr.append($("<th/>").append(head[i]));
        }

        thead.append(tr);
        table.append(thead);

        // Table body
        var tbody = $("<tbody/>");
        for (var i = 0; i < modelEntity.length; i++) {
            var tr = $("<tr/>"), temp = [];
            temp.push(modelEntity[i], biologicalMeaning[i], speciesList[i], geneList[i], proteinList[i]);

            for (var j = 0; j < temp.length; j++) {
                if (j == 0) {
                    tr.append($("<td/>")
                        .append($('<label/>')
                            .html('<input id="' + modelEntity[i] + '" type="checkbox" ' +
                                'data-action="search" value="' + modelEntity[i] + '" class="checkbox">')));
                }

                if (j == 1)
                    tr.append($("<td/>").append(temp[j]));
                else
                    tr.append($("<td/>").append(temp[j]));
            }

            tbody.append(tr);
        }

        table.append(tbody);
        $("#searchList").append(table);

        // Fill in search attribute value
        $("#searchTxt").attr("value", sessionStorage.getItem('searchTxtContent'));

        // SET main content in local storage
        sessionStorage.setItem('searchListContent', $("#main-content").html());
    }

    // Load the view
    mainUtils.loadViewHtml = function () {

        var cellmlModel = mainUtils.workspaceName;

        var query = 'SELECT ?Workspace ?Title ?Author ?Abstract ?Keyword ?Protein ?Species ?Gene ?Compartment ' +
            '?Located_in ?DOI WHERE { GRAPH ?Workspace { ' +
            '<' + cellmlModel + '#Title> <http://purl.org/dc/terms/description> ?Title . ' +
            'OPTIONAL { <' + cellmlModel + '#Author> <http://www.w3.org/2001/vcard-rdf/3.0#FN> ?Author } . ' +
            'OPTIONAL { <' + cellmlModel + '#Abstract> <http://purl.org/dc/terms/description> ?Abstract } . ' +
            'OPTIONAL { <' + cellmlModel + '#Keyword> <http://purl.org/dc/terms/description> ?Keyword } . ' +
            'OPTIONAL { <' + cellmlModel + '#Protein> <http://purl.org/dc/terms/description> ?Protein } . ' +
            'OPTIONAL { <' + cellmlModel + '#Species> <http://purl.org/dc/terms/description> ?Species } . ' +
            'OPTIONAL { <' + cellmlModel + '#Gene> <http://purl.org/dc/terms/description> ?Gene } . ' +
            'OPTIONAL { <' + cellmlModel + '#Compartment> <http://purl.org/dc/terms/description> ?Compartment } . ' +
            'OPTIONAL { <' + cellmlModel + '#located_in> <http://www.obofoundry.org/ro/ro.owl#located_in> ?Located_in } . ' +
            'OPTIONAL { <' + cellmlModel + '#DOI> <http://biomodels.net/model-qualifiers/isDescribedBy> ?DOI } . ' +
            '}}';

        showLoading("#main-content");
        sendPostRequest(
            endpoint,
            query,
            function (jsonObj) {
                sendGetRequest(
                    viewHtml,
                    function (viewHtmlContent) {
                        $("#main-content").html(viewHtmlContent);
                        sendPostRequest(endpoint, query, showView, true);
                    },
                    false);
            },
            true);

        // Reinitialize so that last workspace does not appear in the Load Models
        // page when clicked from Model Discovery and Epithelial Model Platform page
        // mainUtils.workspaceName = "";
    };

    // Load the model
    mainUtils.loadModelHtml = function () {

        var model = mainUtils.workspaceName;
        var tempidWithStr = mainUtils.tempidWithStr;
        model = model + "#" + model.slice(0, model.indexOf('.'));
        var index = $.inArray(tempidWithStr, modelEntity);

        // console.log("model and tempidWithStr in loadModelHtml: ", model, tempidWithStr);
        var query = 'SELECT ?Compartment ' +
            'WHERE { ' + '<' + model + '> <http://www.obofoundry.org/ro/ro.owl#compartmentOf> ?Compartment. }';

        sendPostRequest(
            endpoint,
            query,
            function (jsonObjComp) {
                var query = 'SELECT ?Located_in ' +
                    'WHERE { ' + '<' + model + '> <http://www.obofoundry.org/ro/ro.owl#located_in> ?Located_in. }';

                sendPostRequest(
                    endpoint,
                    query,
                    function (jsonObjLoc) {
                        // showLoading("#main-content");
                        sendGetRequest(
                            modelHtml,
                            function (modelHtmlContent) {
                                $("#main-content").html(modelHtmlContent);

                                var tempComp = "", counterOLS = 0;
                                for (var i = 0; i < jsonObjComp.results.bindings.length; i++) {
                                    var fma_uri = jsonObjComp.results.bindings[i].Compartment.value;
                                    var indexofColon = fma_uri.indexOf('FMA:');
                                    // fma_uri = "http://purl.obolibrary.org/obo/FMA_" + fma_uri.slice(indexofColon + 4);
                                    fma_uri = "http://purl.org/sig/ont/fma/fma" + fma_uri.slice(indexofColon + 4);

                                    var endpointOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/fma/terms?iri=" + fma_uri;
                                    sendGetRequest(
                                        endpointOLS,
                                        function (jsonObjOLS) {
                                            counterOLS++;
                                            tempComp += jsonObjOLS._embedded.terms[0].label;
                                            if (counterOLS < jsonObjComp.results.bindings.length)
                                                tempComp += ", ";
                                            else
                                                tempComp += "";

                                            if (counterOLS == jsonObjComp.results.bindings.length) {
                                                var tempLoc = "", counterOLSLoc = 0;
                                                for (var i = 0; i < jsonObjLoc.results.bindings.length; i++) {
                                                    var fma_uri = jsonObjLoc.results.bindings[i].Located_in.value;
                                                    var indexofColon = fma_uri.indexOf('FMA:');
                                                    // fma_uri = "http://purl.obolibrary.org/obo/FMA_" + fma_uri.slice(indexofColon + 4);
                                                    fma_uri = "http://purl.org/sig/ont/fma/fma" + fma_uri.slice(indexofColon + 4);

                                                    var endpointOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/fma/terms?iri=" + fma_uri;
                                                    sendGetRequest(
                                                        endpointOLS,
                                                        function (jsonObjOLSLoc) {
                                                            counterOLSLoc++;
                                                            tempLoc += jsonObjOLSLoc._embedded.terms[0].label;
                                                            if (counterOLSLoc < jsonObjLoc.results.bindings.length)
                                                                tempLoc += ", ";
                                                            else
                                                                tempLoc += "";

                                                            if (counterOLSLoc == jsonObjLoc.results.bindings.length) {
                                                                var jsonObj = {
                                                                    "Model_entity": tempidWithStr,
                                                                    "Protein": proteinList[index],
                                                                    "Species": speciesList[index],
                                                                    "Gene": geneList[index],
                                                                    "Compartment": tempComp,
                                                                    "Located_in": tempLoc
                                                                }

                                                                // console.log("jsonObj in loadModelHtml: ", jsonObj);
                                                                mainUtils.showModel(jsonObj);
                                                            }
                                                        },
                                                        true);
                                                }
                                            }
                                        },
                                        true);
                                }
                            },
                            false);
                    },
                    true);
            },
            true);

        // Switch from current active button to models button
        var activeItem = "#" + activeMenu();
        switchMenuToActive(activeItem, "#listModels");
    };

// TODO: move to utils directory
// Show selected items in a table
    mainUtils.showModel = function (jsonObj) {

        // console.log("showModel: ", jsonObj);

        var head = ["Model_entity", "Protein", "Species", "Gene", "Compartment", "Located_in"];
        var table = $("<table/>").addClass("table table-hover table-condensed"); //table-bordered table-striped

        // Table header
        var thead = $("<thead/>"), tr = $("<tr/>");
        for (var i = 0; i < head.length; i++) {
            if (i == 0) {
                tr.append($("<th/>")
                    .append($("<label/>")
                        .html('<input id="' + head[0] + '" type="checkbox" name="attributeAll" ' +
                            'class="attributeAll" data-action="model" value="' + head[0] + '" >')));
            }

            tr.append($("<th/>").append(head[i]));
        }

        thead.append(tr);
        table.append(thead);

        for (var i = 0; i < head.length; i++) {
            if (i == 0) {
                // search list to model list with empty model
                if (jsonObj.length == 0) break;

                model.push($("<label/>").html('<input id="' + modelEntityName + '" type="checkbox" ' +
                    'name="attribute" class="attribute" data-action="model" value="' + modelEntityName + '" >'));
            }

            if (head[i] == "Model_entity") {
                model.push(modelEntityName);
            }
            else
                model.push(jsonObj[head[i]]);
        }

        // 1D to 2D array
        while (model.length) {
            model2DArray.push(model.splice(0, 7)); // 6 + 1 (checkbox) header elemenet
        }

        console.log("model and model2DArray: ", model, model2DArray);

        // Table body
        var tbody = $("<tbody/>"), td = [];
        for (var i = 0; i < model2DArray.length; i++) {
            var tr = $("<tr/>");
            // +1 for adding checkbox column
            for (var j = 0; j < head.length + 1; j++) {
                td[j] = $("<td/>");
                if (j == 0)
                    td[j].append(model2DArray[i][j]);
                else
                    td[j].append(model2DArray[i][j]);

                // Id for each row
                if (j == 1)
                    tr.attr("id", model2DArray[i][j]);

                tr.append(td[j]);
            }

            tbody.append(tr);
        }

        table.append(tbody);
        $("#modelList").append(table);

        // Un-check checkbox in the model page
        // load epithelial to model discovery to load model
        for (var i = 0; i < $('table tr td label').length; i++) {
            if ($('table tr td label')[i].firstChild.checked == true) {
                $('table tr td label')[i].firstChild.checked = false;
            }
        }
    };

// Toggle table column in Model discovery
    mainUtils.toggleColHtml = function () {

        if (event.target.checked == false) {
            var id = event.target.id;

            console.log("id: ", id);

            $('td:nth-child(' + id + '),th:nth-child(' + id + ')').hide();
        }

        if (event.target.checked == true) {
            var id = event.target.id;

            console.log("id: ", id);

            $('td:nth-child(' + id + '),th:nth-child(' + id + ')').show();
        }
    };

// Toggle table column in Load model
    mainUtils.toggleColModelHtml = function () {

        if (event.target.checked == false) {
            var id = event.target.id;

            console.log("id: ", id);

            $('td:nth-child(' + id + '),th:nth-child(' + id + ')').hide();
        }

        if (event.target.checked == true) {
            var id = event.target.id;

            console.log("id: ", id);

            $('td:nth-child(' + id + '),th:nth-child(' + id + ')').show();
        }
    };

// Filter search results
    mainUtils.filterSearchHtml = function () {

        var tempstr = [];

        if (event.target.checked == true) {

            var id = event.target.id;
            for (var i = 1; i < $('table tr').length; i++) {

                tempstr = $('table tr')[i].childNodes[2].id.split(',');

                // id repository
                str.push(id);
                str = uniqueifySrcSnkMed(str);

                // check whether str is in tempstr!!!
                if (compare(str, tempstr) == true) {
                    $('table tr')[i].hidden = false;
                }
                else {
                    $('table tr')[i].hidden = true;
                }
            }
        }

        if (event.target.checked == false) {

            var tempstr = [];
            var id = event.target.id;

            str = uniqueifySrcSnkMed(str); // remove duplicate
            str.splice(str.indexOf(id), 1); // delete id

            if (str.length != 0) {
                for (var i = 1; i < $('table tr').length; i++) {

                    tempstr = $('table tr')[i].childNodes[2].id.split(',');

                    // check whether str is in tempstr
                    if (tempstr.indexOf(id) != -1 && tempstr.length == 1) {
                        $('table tr')[i].hidden = true;
                    }
                    else {
                        $('table tr')[i].hidden = false;
                    }
                }
            }
            else { // if empty then show all
                for (var i = 1; i < $('table tr').length; i++) {
                    $('table tr')[i].hidden = false;
                }
            }
        }

    };

// TODO: move to utils directory
    mainUtils.deleteRowModelHtml = function () {

        // Un-check header checkbox if body is empty
        if ($('table tr th label')[0].firstChild.checked == true) {
            $('table tr th label')[0].firstChild.checked = false;
        }

        // Model_entity with same name will be removed
        // regardless of the current instance of checkboxes
        templistOfModel.forEach(function (element, tempIndex) {
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

                    // Remove from modelEntityNameArray
                    modelEntityNameArray.splice(tempIndex, 1);

                    // Remove from modelEntityFullNameArray
                    modelEntityFullNameArray.splice(tempIndex, 1);
                }
            }
        });

        // Empty temp model list
        templistOfModel = [];

        // TODO: click when empty loadmodel table!! Fix this!!
    };

// Load the SVG model
    mainUtils.loadSVGModelHtml = function () {

        sendGetRequest(
            svgmodelHtml,
            function (svgmodelHtmlContent) {
                $("#main-content").html(svgmodelHtmlContent);

                // TODO: Fix it!!
                sendGetRequest(svgmodelHtml, showSVGModelHtml(links, model2DArray, modelEntityNameArray), false);
            },
            false);
    };

// Load the epithelial
    mainUtils.loadEpithelialHtml = function () {

        sendGetRequest(
            svgepithelialHtml,
            function (epithelialHtmlContent) {
                $("#main-content").html(epithelialHtmlContent);

                sendGetRequest(svgepithelialHtml, mainUtils.loadEpithelial, false);
            },
            false);
    };

    mainUtils.loadEpithelial = function (epithelialHtmlContent) {

        // Reinitialize so that last workspace does not appear in the Load Models
        // page when clicked from Model Discovery and Epithelial Model Platform page
        // mainUtils.workspaceName = "";

        // remove model name, keep only solutes
        for (var i = 0; i < modelEntityNameArray.length; i++) {
            var indexOfHash = modelEntityNameArray[i].search("#");
            modelEntityNameArray[i] = modelEntityNameArray[i].slice(indexOfHash + 1);
        }

        console.log("loadEpithelial in model2DArr: ", model2DArray);
        console.log("loadEpithelial in modelEntityNameArray: ", modelEntityNameArray);
        console.log("loadEpithelial in modelEntityFullNameArray: ", modelEntityFullNameArray);

        var concentration_fma = [], source_fma = [], sink_fma = [], med_fma = [], med_pr = [];
        var source_fma2 = [], sink_fma2 = [], solute_chebi = [];

        var apicalID = "http://identifiers.org/fma/FMA:84666";
        var basolateralID = "http://identifiers.org/fma/FMA:84669";
        var partOfProteinUri = "http://purl.obolibrary.org/obo/PR";
        var partOfCHEBIUri = "http://identifiers.org/chebi/CHEBI";

        var index = 0, counter = 0;
        var membrane = [], apicalMembrane = [], basolateralMembrane = [];

        // making cotransporter from RDF graph using SPARQL
        mainUtils.makecotransporter = function (membrane1, membrane2) {
            // query to find fluxes in order to make a cotransporter
            var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
                'SELECT ?med_entity_uri ?med_entity_uriCl ' +
                'WHERE { GRAPH ?Workspace { ' +
                '<' + membrane1.source_name + '> semsim:isComputationalComponentFor ?model_prop. ' +
                '?model_prop semsim:physicalPropertyOf ?model_proc. ' +
                '?model_proc semsim:hasMediatorParticipant ?model_medparticipant. ' +
                '?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity. ' +
                '?med_entity semsim:hasPhysicalDefinition ?med_entity_uri.' +
                '<' + membrane2.source_name + '> semsim:isComputationalComponentFor ?model_propCl. ' +
                '?model_propCl semsim:physicalPropertyOf ?model_procCl. ' +
                '?model_procCl semsim:hasMediatorParticipant ?model_medparticipantCl. ' +
                '?model_medparticipantCl semsim:hasPhysicalEntityReference ?med_entityCl. ' +
                '?med_entityCl semsim:hasPhysicalDefinition ?med_entity_uriCl.' +
                'FILTER (?med_entity_uri = ?med_entity_uriCl) . ' +
                '}}'

            sendPostRequest(
                endpoint,
                query,
                function (jsonObj) {

                    console.log("jsonObj in makecotransporter: ", jsonObj);

                    var tempProtein = [], tempApical = [], tempBasolateral = [];

                    // loop to iterate over med_fma and med_pr in jsonObj
                    for (var m = 0; m < jsonObj.results.bindings.length; m++) {
                        var tmpPro = jsonObj.results.bindings[m].med_entity_uri.value;
                        var tmpApi = jsonObj.results.bindings[m].med_entity_uri.value;
                        var tmpBas = jsonObj.results.bindings[m].med_entity_uri.value;

                        if (tmpPro.indexOf(partOfProteinUri) != -1) {
                            tempProtein.push(jsonObj.results.bindings[m].med_entity_uri.value);
                        }

                        if (tmpApi.indexOf(apicalID) != -1) {
                            tempApical.push(jsonObj.results.bindings[m].med_entity_uri.value);
                        }

                        if (tmpBas.indexOf(basolateralID) != -1) {
                            tempBasolateral.push(jsonObj.results.bindings[m].med_entity_uri.value);
                        }
                    }

                    // remove duplicate protein ID
                    // TODO: probably no need to do this!
                    tempProtein = tempProtein.filter(function (item, pos) {
                        return tempProtein.indexOf(item) == pos;
                    })

                    tempApical = tempApical.filter(function (item, pos) {
                        return tempApical.indexOf(item) == pos;
                    })

                    tempBasolateral = tempBasolateral.filter(function (item, pos) {
                        return tempBasolateral.indexOf(item) == pos;
                    })

                    console.log("temp protein, apical, and basolateral: ", tempProtein, tempApical, tempBasolateral);

                    var membraneOBJ = {
                        solute_chebi: membrane1.solute_chebi,
                        solute_text: membrane1.solute_text,
                        source_name: membrane1.source_name,
                        sink_name: membrane1.sink_name,
                        med_text: membrane1.med_text,
                        med_fma: membrane1.med_fma,
                        med_pr: membrane1.med_pr,
                        med_pr_text: membrane1.med_pr_text,
                        med_pr_text_syn: membrane1.med_pr_text_syn,
                        source_text: membrane1.source_text,
                        source_fma: membrane1.source_fma,
                        sink_text: membrane1.sink_text,
                        sink_fma: membrane1.sink_fma,
                        solute_chebi2: membrane2.solute_chebi,
                        solute_text2: membrane2.solute_text,
                        source_name2: membrane2.source_name,
                        sink_name2: membrane2.sink_name,
                        med_text2: membrane2.med_text,
                        med_fma2: membrane2.med_fma,
                        med_pr2: membrane2.med_pr,
                        med_pr_text2: membrane2.med_pr_text,
                        med_pr_text_syn2: membrane2.med_pr_text_syn,
                        source_text2: membrane2.source_text,
                        source_fma2: membrane2.source_fma,
                        sink_text2: membrane2.sink_text,
                        sink_fma2: membrane2.sink_fma
                    }

                    console.log("tempprotein: ", tempProtein);

                    for (var i = 0; i < tempProtein.length; i++) {

                        console.log("tempprotein inside: ", tempProtein);

                        // cotransporter in apical membrane
                        if (tempProtein.length != 0 && tempApical.length != 0) {
                            apicalMembrane.push(membraneOBJ);
                        }

                        // cotransporter in basolateral membrane
                        if (tempProtein.length != 0 && tempBasolateral.length != 0) {
                            basolateralMembrane.push(membraneOBJ);
                        }
                    }

                    // same solute cotransporter in apical membrane
                    if (membrane1.med_fma == apicalID && membrane2.med_fma == apicalID &&
                        membrane1.med_pr == membrane2.med_pr &&
                        membrane1.source_name == membrane2.source_name) {

                        console.log("tempprotein inside same solute: ", tempProtein);

                        apicalMembrane.push(membraneOBJ);
                    }

                    // same solute cotransporter in basolateral membrane
                    if (membrane1.med_fma == basolateralID && membrane2.med_fma == basolateralID &&
                        membrane1.med_pr == membrane2.med_pr &&
                        membrane1.source_name == membrane2.source_name) {
                        basolateralMembrane.push(membraneOBJ);
                    }

                    // TODO: sample object attributes name to make it user-friendly
                    // TODO: apply this also in the membrane object below
                    // membrane.push({
                    //     solute_chebi: solute_chebi[i].fma,
                    //     solute_text: solutetext,
                    //     solute_chebi2: solute_chebi2[0].fma,
                    //     solute_text2: solutetext2,
                    //     variable_text: srctext,
                    //     variable_text2: srctext2,
                    //     source_fma: source_fma[i].fma,
                    //     source_fma2: source_fma2[i].fma,
                    //     sink_fma: sink_fma[i].fma,
                    //     sink_fma2: sink_fma2[i].fma,
                    //     model_entity: source_fma[i].name,
                    //     prev_model_entity: sink_fma[i].name,
                    //     med_fma: med_fma[i].fma,
                    //     med_pr: med_pr[i].fma
                    // });

                    counter++;

                    if (counter == iteration(membrane.length)) {

                        console.log("membrane: ", membrane);

                        showsvgEpithelial(
                            concentration_fma,
                            source_fma2,
                            sink_fma2,
                            apicalMembrane,
                            basolateralMembrane,
                            membrane);
                    }
                },
                true
            );
        };

        mainUtils.srcDescMediatorOfFluxes = function () {

            var model = parseModelName(modelEntityFullNameArray[index]);
            model = model + "#" + model.slice(0, model.indexOf('.'));

            var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
                'SELECT ?source_fma ?sink_fma ?med_entity_uri ?solute_chebi ?protein ' +
                'WHERE { ' +
                '<' + modelEntityFullNameArray[index] + '> semsim:isComputationalComponentFor ?model_prop. ' +
                '?model_prop semsim:physicalPropertyOf ?model_proc. ' +
                '?model_proc semsim:hasSourceParticipant ?model_srcparticipant. ' +
                '?model_srcparticipant semsim:hasPhysicalEntityReference ?source_entity. ' +
                '?source_entity ro:part_of ?source_part_of_entity. ' +
                '?source_part_of_entity semsim:hasPhysicalDefinition ?source_fma. ' +
                '?source_entity semsim:hasPhysicalDefinition ?solute_chebi. ' +
                '?model_proc semsim:hasSinkParticipant ?model_sinkparticipant. ' +
                '?model_sinkparticipant semsim:hasPhysicalEntityReference ?sink_entity. ' +
                '?sink_entity ro:part_of ?sink_part_of_entity. ' +
                '?sink_part_of_entity semsim:hasPhysicalDefinition ?sink_fma.' +
                '?model_proc semsim:hasMediatorParticipant ?model_medparticipant.' +
                '?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity.' +
                '?med_entity semsim:hasPhysicalDefinition ?med_entity_uri.' +
                '<' + model + '>  <http://www.obofoundry.org/ro/ro.owl#modelOf> ?protein. ' +
                '}'

            sendPostRequest(
                endpoint,
                query,
                function (jsonObjFlux) {

                    // console.log("jsonObjFlux in index.js: ", jsonObjFlux);

                    var chebi_uri = jsonObjFlux.results.bindings[0].solute_chebi.value;
                    var indexofColon = chebi_uri.indexOf('CHEBI:');
                    chebi_uri = "http://purl.obolibrary.org/obo/CHEBI_" + chebi_uri.slice(indexofColon + 6);

                    var endpointOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/chebi/terms?iri=" + chebi_uri;
                    sendGetRequest(
                        endpointOLS,
                        function (jsonObjOLSChebi) {

                            // Name of a solute CHEBI from OLS
                            for (var i = 0; i < jsonObjFlux.results.bindings.length; i++) {
                                var temparr = jsonObjOLSChebi._embedded.terms[0].annotation["has_related_synonym"],
                                    solute_chebi_name;
                                for (var m = 0; m < temparr.length; m++) {
                                    if (temparr[m].slice(-1) == '+' || temparr[m].slice(-1) == '-') {
                                        solute_chebi_name = temparr[m];
                                        break;
                                    }
                                }

                                if (jsonObjFlux.results.bindings[i].solute_chebi == undefined)
                                    solute_chebi.push("");
                                else
                                    solute_chebi.push(
                                        {
                                            name: solute_chebi_name,
                                            fma: jsonObjFlux.results.bindings[i].solute_chebi.value
                                        }
                                    );

                                if (jsonObjFlux.results.bindings[i].source_fma == undefined)
                                    source_fma.push("");
                                else
                                    source_fma.push(
                                        {
                                            name: modelEntityFullNameArray[index],
                                            fma: jsonObjFlux.results.bindings[i].source_fma.value
                                        }
                                    );

                                if (jsonObjFlux.results.bindings[i].sink_fma == undefined)
                                    sink_fma.push("");
                                else
                                    sink_fma.push(
                                        {
                                            name: modelEntityFullNameArray[index],
                                            fma: jsonObjFlux.results.bindings[i].sink_fma.value
                                        }
                                    );

                                if (jsonObjFlux.results.bindings[i].med_entity_uri == undefined) {
                                    med_pr.push("");
                                    med_fma.push("");
                                }
                                else {
                                    var temp = jsonObjFlux.results.bindings[i].med_entity_uri.value;
                                    if (temp.indexOf(partOfProteinUri) != -1 || temp.indexOf(partOfCHEBIUri) != -1) {
                                        med_pr.push({
                                            // name of med_pr from OLS
                                            name: modelEntityFullNameArray[index],
                                            fma: jsonObjFlux.results.bindings[i].med_entity_uri.value
                                        });
                                    }
                                    else {
                                        med_fma.push(
                                            {
                                                name: modelEntityFullNameArray[index],
                                                fma: jsonObjFlux.results.bindings[i].med_entity_uri.value
                                            }
                                        );
                                    }
                                }
                            }

                            // remove duplicate fma
                            solute_chebi = uniqueifyEpithelial(solute_chebi);
                            source_fma = uniqueifyEpithelial(source_fma);
                            sink_fma = uniqueifyEpithelial(sink_fma);
                            med_pr = uniqueifyEpithelial(med_pr);
                            med_fma = uniqueifyEpithelial(med_fma);

                            var query2 = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                                'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
                                'SELECT ?concentration_fma ' +
                                'WHERE { ' +
                                '<' + modelEntityFullNameArray[index] + '> semsim:isComputationalComponentFor ?model_prop. ' +
                                '?model_prop semsim:physicalPropertyOf ?source_entity. ' +
                                '?source_entity ro:part_of ?source_part_of_entity. ' +
                                '?source_part_of_entity semsim:hasPhysicalDefinition ?concentration_fma.' +
                                '}'

                            sendPostRequest(
                                endpoint,
                                query2,
                                function (jsonObjCon) {
                                    // console.log("jsonObjCon in index.js: ", jsonObjCon);
                                    // console.log("med_pr[0] in index.js: ", med_pr[0]);

                                    var medURI, endpointOLS;
                                    if (med_pr[0] == undefined)
                                        medURI = jsonObjFlux.results.bindings[0].protein.value;
                                    else
                                        medURI = med_pr[0].fma;

                                    if (medURI.indexOf(partOfCHEBIUri) != -1) {
                                        var indexofColon = medURI.indexOf('CHEBI:');
                                        chebi_uri = "http://purl.obolibrary.org/obo/CHEBI_" + medURI.slice(indexofColon + 6);
                                        endpointOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/chebi/terms?iri=" + chebi_uri;
                                    }
                                    else
                                        endpointOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/pr/terms?iri=" + medURI;

                                    sendGetRequest(
                                        endpointOLS,
                                        function (jsonObjOLSMedPr) {

                                            // console.log("jsonObjOLSMedPr in index.js: ", jsonObjOLSMedPr);

                                            for (var i = 0; i < jsonObjCon.results.bindings.length; i++) {
                                                if (jsonObjCon.results.bindings[i].concentration_fma == undefined)
                                                    concentration_fma.push("");
                                                else
                                                    concentration_fma.push(
                                                        {
                                                            name: modelEntityFullNameArray[index],
                                                            fma: jsonObjCon.results.bindings[i].concentration_fma.value
                                                        }
                                                    );
                                            }

                                            index++;

                                            if (source_fma.length != 0) { // flux

                                                if (source_fma.length == 1) { // transporter (single flux)

                                                    var srctext = parserFmaNameText(source_fma[0]), // get this from OLS
                                                        snktext = parserFmaNameText(sink_fma[0]), // get this from OLS
                                                        medfmatext = parserFmaNameText(med_fma[0]), // get this from OLS
                                                        temp_med_pr, med_pr_text_syn;

                                                    // No mediator protein in NHE3, SGLT models
                                                    if (med_pr[0] == undefined)
                                                        temp_med_pr = undefined;
                                                    else
                                                        temp_med_pr = med_pr[0].fma;

                                                    var tempvar;
                                                    if (jsonObjOLSMedPr._embedded.terms[0].annotation["has_related_synonym"] == undefined) {
                                                        // med_pr_text_syn = undefined;
                                                        med_pr_text_syn = jsonObjOLSMedPr._embedded.terms[0].annotation["id"][0].slice(3);
                                                    }

                                                    else {
                                                        tempvar = jsonObjOLSMedPr._embedded.terms[0].annotation["has_related_synonym"];
                                                        med_pr_text_syn = tempvar[0].toUpperCase();
                                                    }

                                                    membrane.push({
                                                        solute_chebi: solute_chebi[0].fma,
                                                        solute_text: solute_chebi[0].name,
                                                        source_text: srctext,
                                                        source_fma: source_fma[0].fma,
                                                        source_name: source_fma[0].name,
                                                        sink_text: snktext,
                                                        sink_fma: sink_fma[0].fma,
                                                        sink_name: sink_fma[0].name,
                                                        med_text: medfmatext,
                                                        med_fma: med_fma[0].fma,
                                                        med_pr: temp_med_pr,
                                                        med_pr_text: jsonObjOLSMedPr._embedded.terms[0].label,
                                                        med_pr_text_syn: med_pr_text_syn
                                                    });

                                                    source_fma2.push(source_fma[0]);
                                                    sink_fma2.push(sink_fma[0]);

                                                }
                                                else { // same solute co-transporter

                                                    // console.log("ELSE source_fma.length == 1");
                                                    // console.log("modelEntity: ", modelEntity);
                                                    // console.log("biologicalMeaning: ", biologicalMeaning);
                                                    // console.log("speciesList: ", speciesList);
                                                    // console.log("geneList: ", geneList);
                                                    // console.log("proteinList: ", proteinList);

                                                    // Swap if source and sink have same direction
                                                    if (source_fma[0].fma == sink_fma[0].fma) {

                                                        // console.log("inside same faces", source_fma[0], sink_fma[0]);

                                                        var tempFMA = sink_fma[0].fma,
                                                            tempName = sink_fma[0].name;

                                                        sink_fma[0].fma = sink_fma[1].fma;
                                                        sink_fma[0].name = sink_fma[1].name;
                                                        sink_fma[1].fma = tempFMA;
                                                        sink_fma[1].name = tempName;
                                                    }

                                                    for (var i = 0; i < source_fma.length; i++) {
                                                        var srctext = parserFmaNameText(source_fma[i]),
                                                            snktext = parserFmaNameText(sink_fma[i]),
                                                            medfmatext, temp_med_pr, med_pr_text_syn;

                                                        if (med_pr[i] == undefined)
                                                            temp_med_pr = undefined;
                                                        else
                                                            temp_med_pr = med_pr[0].fma;

                                                        var tempvar;
                                                        if (jsonObjOLSMedPr._embedded.terms[0].annotation["has_related_synonym"] == undefined) {
                                                            // med_pr_text_syn = undefined;
                                                            med_pr_text_syn = jsonObjOLSMedPr._embedded.terms[0].annotation["id"][0].slice(3);
                                                        }
                                                        else {
                                                            tempvar = jsonObjOLSMedPr._embedded.terms[0].annotation["has_related_synonym"];
                                                            med_pr_text_syn = tempvar[0].toUpperCase();
                                                        }

                                                        // TODO: change object attributes (see above)
                                                        membrane.push({
                                                            solute_chebi: solute_chebi[0].fma,
                                                            solute_text: solute_chebi[0].name,
                                                            source_text: srctext,
                                                            source_fma: source_fma[i].fma,
                                                            source_name: source_fma[i].name,
                                                            sink_text: snktext,
                                                            sink_fma: sink_fma[i].fma,
                                                            sink_name: sink_fma[i].name,
                                                            med_text: medfmatext,
                                                            med_fma: med_fma[0].fma,
                                                            med_pr: temp_med_pr,
                                                            med_pr_text: jsonObjOLSMedPr._embedded.terms[0].label,
                                                            med_pr_text_syn: med_pr_text_syn
                                                        });

                                                        source_fma2.push(source_fma[i]);
                                                        sink_fma2.push(sink_fma[i]);
                                                    }
                                                }
                                            }

                                            source_fma = [];
                                            sink_fma = [];
                                            med_fma = [];
                                            med_pr = [];
                                            solute_chebi = [];

                                            if (index == modelEntityFullNameArray.length) {

                                                // special case: one flux is chosen
                                                if (membrane.length <= 1) {
                                                    // console.log("membrane.length <= 1 concentration_fma: ", concentration_fma);
                                                    // console.log("membrane.length <= 1 concentration_fma: ", concentration_fma);
                                                    // console.log("membrane.length <= 1 source_fma2: ", source_fma2);
                                                    // console.log("membrane.length <= 1 sink_fma2: ", sink_fma2);
                                                    // console.log("membrane.length <= 1 apicalMembrane: ", apicalMembrane);
                                                    // console.log("membrane.length <= 1 basolateralMembrane: ", basolateralMembrane);
                                                    // console.log("membrane.length <= 1 membrane: ", membrane);

                                                    showsvgEpithelial(
                                                        concentration_fma,
                                                        source_fma2,
                                                        sink_fma2,
                                                        apicalMembrane,
                                                        basolateralMembrane,
                                                        membrane);
                                                }
                                                else {

                                                    console.log("membrane.length >= 1 membrane: ", membrane);

                                                    for (var i = 0; i < membrane.length; i++) {
                                                        for (var j = i + 1; j < membrane.length; j++) {
                                                            mainUtils.makecotransporter(membrane[i], membrane[j]);
                                                        }
                                                    }
                                                }

                                                return;
                                            }
                                            else
                                                mainUtils.srcDescMediatorOfFluxes(); // callback
                                        },
                                        true);
                                },
                                true);
                        },
                        true);
                },
                true);
        }

        mainUtils.srcDescMediatorOfFluxes();
    };

// Expose utility to the global object
    global.$mainUtils = mainUtils;

})(window);

/***/ }),
/* 6 */
/***/ (function(module, exports) {

/**
 * Created by dsar941 on 5/11/2017.
 */
var solutesBouncing = function (newg, solutes) {

    var m = 10,
        maxSpeed = 1,
        color = d3.scaleOrdinal(d3.schemeCategory20).domain(d3.range(m));

    var nodes = [];

    for (var i = 0; i < solutes.length; i++) {
        nodes.push({
            text: solutes[i].value,
            color: color(Math.floor(Math.random() * m)),
            x: solutes[i].xrect + (Math.random() * (solutes[i].width - solutes[i].xrect)),
            y: solutes[i].yrect + (Math.random() * (solutes[i].height - solutes[i].yrect)),
            speedX: Math.random() * maxSpeed,
            speedY: Math.random() * maxSpeed,
            xrect: solutes[i].xrect,
            yrect: solutes[i].yrect,
            width: solutes[i].width,
            height: solutes[i].height,
            length: solutes[i].length
        });
    }

    console.log(nodes);

    var simulation = d3.forceSimulation()
        .force("charge", d3.forceManyBody().strength(0))
        .force("gravity", d3.forceManyBody().strength(0));

    var text = newg.append("g").selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("x", function (d) {
            return d.x;
        })
        .attr("y", function (d) {
            return d.y;
        })
        .style("fill", function (d) {
            return d.color;
        })
        .text(function (d) {
            return d.text;
        });

    simulation
        .nodes(nodes)
        .on("tick", tick);

    function tick(e) {
        simulation.alpha(0.1);
        text
            .each(gravity())
            .attr("x", function (d) {
                return d.x;
            })
            .attr("y", function (d) {
                return d.y;
            });
    }

    function gravity() {
        return function (d) {
            // TODO: approximate solution, fix this later
            if (d.x <= d.xrect) d.speedX = Math.abs(d.speedX); // each char is 6.5 unit
            if (d.x + d.length + 6.5 * 2 >= d.xrect + d.width) d.speedX = -1 * Math.abs(d.speedX);
            if (d.y - 6.5 * 2 <= d.yrect) d.speedY = -1 * Math.abs(d.speedY); // assuming 2 char equiv to height
            if (d.y >= d.yrect + d.height) d.speedY = Math.abs(d.speedY);

            d.x = d.x + (d.speedX);
            d.y = d.y + (-1 * d.speedY);
        };
    }
}

exports.solutesBouncing = solutesBouncing;

/***/ })
/******/ ]);
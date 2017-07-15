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
exports.uniqueify = uniqueify;
exports.uniqueifySrcSnkMed = uniqueifySrcSnkMed;
exports.uniqueifyModelEntity = uniqueifyModelEntity;
exports.uniqueifyEpithelial = uniqueifyEpithelial;
exports.uniqueifySVG = uniqueifySVG;
exports.createAnchor = createAnchor;
exports.searchFn = searchFn;
exports.getTextWidth = getTextWidth;
exports.iteration = iteration;
exports.compare = compare;

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
var sendPostRequest = __webpack_require__(1).sendPostRequest;
var sendGetRequest = __webpack_require__(1).sendGetRequest;

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
    var Cachannel = "http://purl.obolibrary.org/obo/PR_P22002"; // ??
    var ER = "http://identifiers.org/fma/FMA:63842";
    var wallOfSmoothER = "http://identifiers.org/fma/FMA:80352";
    var wallOfRoughER = "http://identifiers.org/fma/FMA:80353";
    var IP3receptor = "http://identifiers.org/chebi/CHEBI:131186";
    var celljunctionID = "http://identifiers.org/fma/FMA:67394"; // paracellularID same??
    var leakID = "http://identifiers.org/go/GO:0022840"; // Calcium leak??
    var ATPID = "http://identifiers.org/chebi/CHEBI:15422";
    var p2y2ID = "http://identifiers.org/chebi/CHEBI:53142";

    var tempapical = [];
    var tempBasolateral = [];
    var paracellularMembrane = [];
    var wallOfSmoothERMembrane = [];
    var wallOfRoughERMembrane = [];
    var celljunction = [];

    var endpoint = "https://models.physiomeproject.org/pmr2_virtuoso_search";

    /*
     * relatedModel - all related models
     * relatedModelValue - filtered related models which have #protein
     * relatedModelID - relatedModel which have #protein
     * */
    var relatedModel = [], relatedModelValue = [], relatedModelID = [], workspaceName = "";
    var membraneModel = [], membraneModelValue = [], membraneModelID = [], membraneObject = [];
    var proteinName, cellmlModel, biological_meaning, biological_meaning2, speciesName, geneName;
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
        },
        {
            "key": [
                {
                    "key": "http://identifiers.org/fma/FMA:7195",
                    "value": "lung"
                }
            ],

            "value": "Lung"
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

    // TODO: Hard coded for Nachannel, Clchannel, Kchannel, IP3 receptor, ATP, p2y2
    for (var i = 0; i < membrane.length; i++) {
        if (membrane[i].med_fma == apicalID && membrane[i].med_pr == leakID) {
            apicalMembrane.push(
                {
                    source_text: membrane[i].source_text,
                    source_fma: membrane[i].source_fma,
                    sink_text: membrane[i].sink_text,
                    sink_fma: membrane[i].sink_fma,
                    source_text2: "leak",
                    source_fma2: "leak",
                    sink_text2: "leak",
                    sink_fma2: "leak",
                    source_name: membrane[i].source_name,
                    sink_name: membrane[i].sink_name,
                    med_text: membrane[i].med_text,
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr
                });

            membrane[i].source_text2 = "leak";
            membrane[i].source_fma2 = "leak";
            membrane[i].sink_text2 = "leak";
            membrane[i].sink_fma2 = "leak";
        }

        if (membrane[i].med_fma == apicalID && membrane[i].med_pr == ATPID) {
            apicalMembrane.push(
                {
                    source_text: membrane[i].source_text,
                    source_fma: membrane[i].source_fma,
                    sink_text: membrane[i].sink_text,
                    sink_fma: membrane[i].sink_fma,
                    source_text2: "ATP",
                    source_fma2: "ATP",
                    sink_text2: "ATP",
                    sink_fma2: "ATP",
                    source_name: membrane[i].source_name,
                    sink_name: membrane[i].sink_name,
                    med_text: membrane[i].med_text,
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr
                });

            membrane[i].source_text2 = "ATP";
            membrane[i].source_fma2 = "ATP";
            membrane[i].sink_text2 = "ATP";
            membrane[i].sink_fma2 = "ATP";
        }

        if (membrane[i].med_fma == apicalID && membrane[i].med_pr == p2y2ID) {
            apicalMembrane.push(
                {
                    source_text: membrane[i].source_text,
                    source_fma: membrane[i].source_fma,
                    sink_text: membrane[i].sink_text,
                    sink_fma: membrane[i].sink_fma,
                    source_text2: "p2y2",
                    source_fma2: "p2y2",
                    sink_text2: "p2y2",
                    sink_fma2: "p2y2",
                    source_name: membrane[i].source_name,
                    sink_name: membrane[i].sink_name,
                    med_text: membrane[i].med_text,
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr
                });

            membrane[i].source_text2 = "p2y2";
            membrane[i].source_fma2 = "p2y2";
            membrane[i].sink_text2 = "p2y2";
            membrane[i].sink_fma2 = "p2y2";
        }

        if (membrane[i].med_fma == apicalID && (membrane[i].med_pr == IP3receptor || membrane[i].med_pr == Cachannel ||
            membrane[i].med_pr == Nachannel || membrane[i].med_pr == Clchannel || membrane[i].med_pr == Kchannel)) {
            apicalMembrane.push(
                {
                    source_text: membrane[i].source_text,
                    source_fma: membrane[i].source_fma,
                    sink_text: membrane[i].sink_text,
                    sink_fma: membrane[i].sink_fma,
                    source_text2: "channel",
                    source_fma2: "channel",
                    sink_text2: "channel",
                    sink_fma2: "channel",
                    source_name: membrane[i].source_name,
                    sink_name: membrane[i].sink_name,
                    med_text: membrane[i].med_text,
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr
                });

            membrane[i].source_text2 = "channel";
            membrane[i].source_fma2 = "channel";
            membrane[i].sink_text2 = "channel";
            membrane[i].sink_fma2 = "channel";
        }

        if (membrane[i].med_fma == basolateralID && membrane[i].med_pr == leakID) {
            basolateralMembrane.push(
                {
                    source_text: membrane[i].source_text,
                    source_fma: membrane[i].source_fma,
                    sink_text: membrane[i].sink_text,
                    sink_fma: membrane[i].sink_fma,
                    source_text2: "leak",
                    source_fma2: "leak",
                    sink_text2: "leak",
                    sink_fma2: "leak",
                    source_name: membrane[i].source_name,
                    sink_name: membrane[i].sink_name,
                    med_text: membrane[i].med_text,
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr
                });

            membrane[i].source_text2 = "leak";
            membrane[i].source_fma2 = "leak";
            membrane[i].sink_text2 = "leak";
            membrane[i].sink_fma2 = "leak";
        }

        if (membrane[i].med_fma == basolateralID && membrane[i].med_pr == ATPID) {
            basolateralMembrane.push(
                {
                    source_text: membrane[i].source_text,
                    source_fma: membrane[i].source_fma,
                    sink_text: membrane[i].sink_text,
                    sink_fma: membrane[i].sink_fma,
                    source_text2: "ATP",
                    source_fma2: "ATP",
                    sink_text2: "ATP",
                    sink_fma2: "ATP",
                    source_name: membrane[i].source_name,
                    sink_name: membrane[i].sink_name,
                    med_text: membrane[i].med_text,
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr
                });

            membrane[i].source_text2 = "ATP";
            membrane[i].source_fma2 = "ATP";
            membrane[i].sink_text2 = "ATP";
            membrane[i].sink_fma2 = "ATP";
        }

        if (membrane[i].med_fma == basolateralID && membrane[i].med_pr == p2y2ID) {
            apicalMembrane.push(
                {
                    source_text: membrane[i].source_text,
                    source_fma: membrane[i].source_fma,
                    sink_text: membrane[i].sink_text,
                    sink_fma: membrane[i].sink_fma,
                    source_text2: "p2y2",
                    source_fma2: "p2y2",
                    sink_text2: "p2y2",
                    sink_fma2: "p2y2",
                    source_name: membrane[i].source_name,
                    sink_name: membrane[i].sink_name,
                    med_text: membrane[i].med_text,
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr
                });

            membrane[i].source_text2 = "p2y2";
            membrane[i].source_fma2 = "p2y2";
            membrane[i].sink_text2 = "p2y2";
            membrane[i].sink_fma2 = "p2y2";
        }

        if (membrane[i].med_fma == basolateralID && (membrane[i].med_pr == IP3receptor || membrane[i].med_pr == Cachannel ||
            membrane[i].med_pr == Nachannel || membrane[i].med_pr == Clchannel || membrane[i].med_pr == Kchannel)) {
            basolateralMembrane.push(
                {
                    source_text: membrane[i].source_text,
                    source_fma: membrane[i].source_fma,
                    sink_text: membrane[i].sink_text,
                    sink_fma: membrane[i].sink_fma,
                    source_text2: "channel",
                    source_fma2: "channel",
                    sink_text2: "channel",
                    sink_fma2: "channel",
                    source_name: membrane[i].source_name,
                    sink_name: membrane[i].sink_name,
                    med_text: membrane[i].med_text,
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr
                });

            membrane[i].source_text2 = "channel";
            membrane[i].source_fma2 = "channel";
            membrane[i].sink_text2 = "channel";
            membrane[i].sink_fma2 = "channel";
        }

        if (membrane[i].source_fma == luminalID && membrane[i].sink_fma == interstitialID) {
            paracellularMembrane.push(
                {
                    source_text: membrane[i].source_text,
                    source_fma: membrane[i].source_fma,
                    sink_text: membrane[i].sink_text,
                    sink_fma: membrane[i].sink_fma,
                    source_text2: "diffusive channel",
                    source_fma2: "diffusive channel",
                    sink_text2: "diffusive channel",
                    sink_fma2: "diffusive channel",
                    source_name: membrane[i].source_name,
                    sink_name: membrane[i].sink_name,
                    med_text: membrane[i].med_text,
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr
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
            membrane[i].source_text2 != "diffusive channel" && membrane[i].source_text2 != "leak" &&
            membrane[i].source_text2 != "ATP" && membrane[i].source_text2 != "p2y2") {
            apicalMembrane.push(
                {
                    source_text: membrane[i].source_text,
                    source_fma: membrane[i].source_fma,
                    sink_text: membrane[i].sink_text,
                    sink_fma: membrane[i].sink_fma,
                    source_text2: "single flux",
                    source_fma2: membrane[i].source_fma,
                    sink_text2: "single flux",
                    sink_fma2: membrane[i].sink_fma,
                    source_name: membrane[i].source_name,
                    sink_name: membrane[i].sink_name,
                    med_text: membrane[i].med_text,
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr
                });
        }

        if (membrane[i].med_fma == basolateralID && membrane[i].source_text2 != "channel" &&
            membrane[i].source_text2 != "diffusive channel" && membrane[i].source_text2 != "leak" &&
            membrane[i].source_text2 != "ATP" && membrane[i].source_text2 != "p2y2") {
            basolateralMembrane.push(
                {
                    source_text: membrane[i].source_text,
                    source_fma: membrane[i].source_fma,
                    sink_text: membrane[i].sink_text,
                    sink_fma: membrane[i].sink_fma,
                    source_text2: "single flux",
                    source_fma2: membrane[i].source_fma,
                    sink_text2: "single flux",
                    sink_fma2: membrane[i].sink_fma,
                    source_name: membrane[i].source_name,
                    sink_name: membrane[i].sink_name,
                    med_text: membrane[i].med_text,
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr
                });
        }
    }

    // flux through IP3, wall of smooth/rough ER, and gap junction
    for (var i = 0; i < membrane.length; i++) {

        if (membrane[i].med_fma == celljunctionID) {
            celljunction.push(
                {
                    source_text: membrane[i].source_text,
                    source_fma: membrane[i].source_fma,
                    sink_text: membrane[i].sink_text,
                    sink_fma: membrane[i].sink_fma,
                    source_text2: "Gap Junction",
                    source_fma2: "Gap Junction",
                    sink_text2: "Gap Junction",
                    sink_fma2: "Gap Junction"
                });

            membrane[i].source_text2 = "Gap Junction";
            membrane[i].source_fma2 = "Gap Junction";
            membrane[i].sink_text2 = "Gap Junction";
            membrane[i].sink_fma2 = "Gap Junction";
        }

        if (membrane[i].med_fma == wallOfSmoothER && membrane[i].med_pr == IP3receptor) {
            wallOfSmoothERMembrane.push(
                {
                    source_text: membrane[i].source_text,
                    source_fma: membrane[i].source_fma,
                    sink_text: membrane[i].sink_text,
                    sink_fma: membrane[i].sink_fma,
                    source_text2: "IP3 flux",
                    source_fma2: "IP3 flux",
                    sink_text2: "IP3 flux",
                    sink_fma2: "IP3 flux"
                });

            membrane[i].source_text2 = "IP3 flux";
            membrane[i].source_fma2 = "IP3 flux";
            membrane[i].sink_text2 = "IP3 flux";
            membrane[i].sink_fma2 = "IP3 flux";
        }

        if (membrane[i].med_fma == wallOfSmoothER && membrane[i].med_pr == leakID) {
            wallOfSmoothERMembrane.push(
                {
                    source_text: membrane[i].source_text,
                    source_fma: membrane[i].source_fma,
                    sink_text: membrane[i].sink_text,
                    sink_fma: membrane[i].sink_fma,
                    source_text2: "leak",
                    source_fma2: "leak",
                    sink_text2: "leak",
                    sink_fma2: "leak"
                });

            membrane[i].source_text2 = "leak";
            membrane[i].source_fma2 = "leak";
            membrane[i].sink_text2 = "leak";
            membrane[i].sink_fma2 = "leak";
        }

        if (membrane[i].med_fma == wallOfRoughER && membrane[i].med_pr == IP3receptor) {
            wallOfRoughERMembrane.push(
                {
                    source_text: membrane[i].source_text,
                    source_fma: membrane[i].source_fma,
                    sink_text: membrane[i].sink_text,
                    sink_fma: membrane[i].sink_fma,
                    source_text2: "IP3 flux",
                    source_fma2: "IP3 flux",
                    sink_text2: "IP3 flux",
                    sink_fma2: "IP3 flux"
                });

            membrane[i].source_text2 = "IP3 flux";
            membrane[i].source_fma2 = "IP3 flux";
            membrane[i].sink_text2 = "IP3 flux";
            membrane[i].sink_fma2 = "IP3 flux";
        }

        if (membrane[i].med_fma == wallOfRoughER && membrane[i].med_pr == leakID) {
            wallOfRoughERMembrane.push(
                {
                    source_text: membrane[i].source_text,
                    source_fma: membrane[i].source_fma,
                    sink_text: membrane[i].sink_text,
                    sink_fma: membrane[i].sink_fma,
                    source_text2: "leak",
                    source_fma2: "leak",
                    sink_text2: "leak",
                    sink_fma2: "leak"
                });

            membrane[i].source_text2 = "leak";
            membrane[i].source_fma2 = "leak";
            membrane[i].sink_text2 = "leak";
            membrane[i].sink_fma2 = "leak";
        }
    }

    // flux through wall of smooth/rough ER
    for (var i = 0; i < membrane.length; i++) {
        if (membrane[i].med_fma == wallOfSmoothER && membrane[i].med_pr != IP3receptor && membrane[i].med_pr != leakID) {
            wallOfSmoothERMembrane.push(
                {
                    source_text: membrane[i].source_text,
                    source_fma: membrane[i].source_fma,
                    sink_text: membrane[i].sink_text,
                    sink_fma: membrane[i].sink_fma,
                    source_text2: "single flux",
                    source_fma2: "single flux",
                    sink_text2: "single flux",
                    sink_fma2: "single flux"
                });

            membrane[i].source_text2 = "single flux";
            membrane[i].source_fma2 = "single flux";
            membrane[i].sink_text2 = "single flux";
            membrane[i].sink_fma2 = "single flux";
        }

        if (membrane[i].med_fma == wallOfRoughER && membrane[i].med_pr != IP3receptor && membrane[i].med_pr != leakID) {
            wallOfRoughERMembrane.push(
                {
                    source_text: membrane[i].source_text,
                    source_fma: membrane[i].source_fma,
                    sink_text: membrane[i].sink_text,
                    sink_fma: membrane[i].sink_fma,
                    source_text2: "single flux",
                    source_fma2: "single flux",
                    sink_text2: "single flux",
                    sink_fma2: "single flux"
                });

            membrane[i].source_text2 = "single flux";
            membrane[i].source_fma2 = "single flux";
            membrane[i].sink_text2 = "single flux";
            membrane[i].sink_fma2 = "single flux";
        }
    }

    // Note: otherwise member array should have both directional fluxes (i.e., cotransporter)

    console.log("membrane: ", membrane);
    console.log("concentration_fma: ", concentration_fma);
    console.log("source_fma: ", source_fma);
    console.log("sink_fma: ", sink_fma);
    console.log("apicalMembrane: ", apicalMembrane);
    console.log("basolateralMembrane: ", basolateralMembrane);
    console.log("paracellularMembrane: ", paracellularMembrane);
    console.log("wallOfSmoothERMembrane: ", wallOfSmoothERMembrane);
    console.log("wallOfRoughERMembrane: ", wallOfRoughERMembrane);

    var combinedMembrane = [];

    for (var i = 0; i < apicalMembrane.length; i++)
        combinedMembrane.push(apicalMembrane[i]);
    for (var i = 0; i < basolateralMembrane.length; i++)
        combinedMembrane.push(basolateralMembrane[i]);
    for (var i = 0; i < paracellularMembrane.length; i++)
        combinedMembrane.push(paracellularMembrane[i]);

    console.log("combinedMembrane: ", combinedMembrane);

    var g = document.getElementById("#svgVisualize"),
        wth = 1200,
        hth = 900,
        width = 300,
        height = 400;

    var svg = d3.select("#svgVisualize").append("svg")
        .attr("width", wth)
        .attr("height", hth);

    var w = 800,
        h = 900;

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
            if (concentration_fma[i].fma == document.getElementsByTagName("rect")[j].id)
                break;
        }

        // compartments
        if (concentration_fma[i].fma == document.getElementsByTagName("rect")[j].id) {
            var xrect = document.getElementsByTagName("rect")[j].x.baseVal.value;
            var yrect = document.getElementsByTagName("rect")[j].y.baseVal.value;
            var xwidth = document.getElementsByTagName("rect")[j].width.baseVal.value;
            var yheight = document.getElementsByTagName("rect")[j].height.baseVal.value;

            var indexOfHash = concentration_fma[i].name.search("#");
            var value = concentration_fma[i].name.slice(indexOfHash + 1);
            var indexOfdot = value.indexOf('.');
            value = value.slice(indexOfdot + 1);

            solutes.push(
                {
                    compartment: document.getElementsByTagName("rect")[j].id,
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
    var x = document.getElementsByTagName("rect")[0].x.baseVal.value;
    var y = document.getElementsByTagName("rect")[0].y.baseVal.value;

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

    // example-svg: variable was linebasolateralMembrane
    // and id was basolateralMembraneID
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

    var linecelljunction = newg.append("line")
        .attr("id", celljunctionID)
        .attr("x1", function (d) {
            return d.x + 20;
        })
        .attr("y1", function (d) {
            return d.y + height;
        })
        .attr("x2", function (d) {
            return d.x + width - 20;
        })
        .attr("y2", function (d) {
            return d.y + height;
        })
        .attr("stroke", function (d) {
            svg.append("text")
                .style("font", "16px sans-serif")
                .attr("stroke", "indigo")
                .attr("x", 850)
                .attr("y", 170)
                .text("Cell junction");

            return "indigo";
        })
        .attr("stroke-width", 25)
        .attr("opacity", 0.5);

    // Paracellular Rectangle
    newg.append("polygon")
        .attr("transform", "translate(265,720)")
        .attr("points", "0,0 0,100 0,0 300,0 300,100 300,0")
        .attr("fill", "white")
        .attr("stroke", "url(#basicPattern)")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 25);

    // Endoplasmic Reticulum (ER)
    var xER, yER, widthER, heightER;
    var calciumcircle = [], calciumcircletext = [];
    if (wallOfSmoothERMembrane.length != 0 || wallOfRoughERMembrane.length != 0) {
        newg.append("rect")
            .attr("id", ER)
            .attr("x", w / 3 + 30 + 30)
            .attr("y", height / 3 + 20 + 200)
            .attr("width", width - 60 - 70) // 170
            .attr("height", height - 40 - 240) // 120
            .attr("rx", 10)
            .attr("ry", 20)
            .attr("stroke", function (d) {
                svg.append("text")
                    .style("font", "16px sans-serif")
                    .attr("stroke", "#6495ED")
                    .attr("x", 850)
                    .attr("y", 195)
                    .text("Endoplasmic Reticulum");

                return "#6495ED";
            })
            .attr("fill", "white")
            .attr("strokeWidth", "6px");

        // line: wall of smooth and rough ER
        xER = document.getElementsByTagName("rect")[6].x.baseVal.value;
        yER = document.getElementsByTagName("rect")[6].y.baseVal.value;
        widthER = document.getElementsByTagName("rect")[6].width.baseVal.value;
        heightER = document.getElementsByTagName("rect")[6].height.baseVal.value;

        // Ca2+ circle
        var xci = 0, yci = 0;
        for (var ci = 0; ci < 4; ci++) {

            if (ci % 2 == 0) {
                xci += 50;
                yci = 50;
            }
            else {
                xci = xci;
                yci += 40;
            }

            var calciumcircleg = newg.append("g").data([{x: xER + xci, y: yER + yci}]);
            calciumcircle[i] = calciumcircleg.append("circle")
                .attr("id", "calciumcircle" + i)
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("r", 10)
                .attr("fill", "yellow")
                .attr("stroke-width", 20)
                .attr("cursor", "move");

            calciumcircletext[i] = calciumcircleg.append("text")
                .attr("id", "calciumcircletext" + i)
                .attr("x", function (d) {
                    return d.x - 8;
                })
                .attr("y", function (d) {
                    return d.y + 4;
                })
                .attr("font-size", "8px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text("Ca2+");
        }

        // line of wall of smooth ER (Top ER membrane)
        var linesmoothER = newg.append("line")
            .attr("id", wallOfSmoothER)
            .attr("x1", function (d) {
                return xER + 10;
            })
            .attr("y1", function (d) {
                return yER;
            })
            .attr("x2", function (d) {
                return xER + widthER - 10;
            })
            .attr("y2", function (d) {
                return yER;
            })
            .attr("stroke", function (d) {
                svg.append("text")
                    .style("font", "16px sans-serif")
                    .attr("stroke", "maroon")
                    .attr("x", 850)
                    .attr("y", 220)
                    .text("Wall of smooth ER Membrane");

                return "maroon";
            })
            .attr("stroke-width", 10)
            .attr("opacity", 0.5);

        // line of wall of rough ER (Right ER membrane)
        var lineroughER = newg.append("line")
            .attr("id", wallOfRoughER)
            .attr("x1", function (d) {
                return xER + widthER;
            })
            .attr("y1", function (d) {
                return yER + 10;
            })
            .attr("x2", function (d) {
                return xER + widthER;
            })
            .attr("y2", function (d) {
                return yER + heightER - 10;
            })
            .attr("stroke", function (d) {
                svg.append("text")
                    .style("font", "16px sans-serif")
                    .attr("stroke", "navy")
                    .attr("x", 850)
                    .attr("y", 245)
                    .text("Wall of rough ER Membrane");

                return "navy";
            })
            .attr("stroke-width", 10)
            .attr("opacity", 0.5);
    }

    // Circle and line arrow from lumen to cytosol
    var xrect = document.getElementsByTagName("rect")[0].x.baseVal.value;
    var yrect = document.getElementsByTagName("rect")[0].y.baseVal.value;

    // Paracellular membrane
    var xprect = document.getElementsByTagName("rect")[5].x.baseVal.value;
    var yprect = document.getElementsByTagName("rect")[5].y.baseVal.value;
    var xpvalue = xprect + 10;
    var ypvalue = yprect + 25;
    var ypdistance = 35;

    var lineLen = 50, radius = 20, radiuswser = 15,
        polygonlineLen = 60, lineLenwser = 40, pcellLen = 100,
        xvalue = xrect - lineLen / 2, // x coordinate before epithelial rectangle
        yvalue = yrect + 10 + 50, // initial distance 50
        yvalueb = yrect + 10 + 50, // initial distance 50
        xvaluewser = xER + 10 + 20, yvaluewser = yER - lineLen / 2,
        xvaluewrer = xER - lineLenwser / 2, yvaluewrer = yER + 10 + 20,
        ydistance = 70, ydistanceb = 70, xdistancewser = 40, ydistancewrer = 40,
        polygonlineg = [], polygon = [], polygontextg = [], polygonlinegwser = [], polygonlinegwrer = [],
        leaktextwser = [], leaktextwrer = [], leaklinegwser = [], leaklinegwrer = [],
        leaklineg = [], leaktext = [], leaklinegb = [], leaktextb = [],
        polygontextwser = [], polygontextwrer = [],
        circlewithlineg = [], linewithlineg = [], circletextwser = [], circletextwrer = [],
        linewithlineg2 = [], linewithtextg = [], linewithtextg2 = [],
        linewithlinegwser = [], linewithlineg2wser = [],
        linewithtextgwser = [], linewithtextg2wser = [], circlewithlinegwser = [],
        linewithlinegwrer = [], linewithlineg2wrer = [],
        linewithtextgwrer = [], linewithtextg2wrer = [], circlewithlinegwrer = [],
        polygonlinegctoc = [], polygontextctoc = [],
        polygonlinegATP = [], polygontextATP = [], atprectText = [],
        polygonlinegATPb = [], polygontextATPb = [], atprectTextb = [],
        linewithlinegpy = [], linewithlinegpy2 = [], linewithlinegpy3 = [],
        linewithlinegpyb = [], linewithlinegpy2b = [], linewithlinegpy3b = [],
        xvaluectoc = x + 10 + 20, yvaluectoc = y - lineLen / 2,
        cxvaluectoc = x + 10 + 30, xdistancectoc = 40, cxvalue = xrect, cxvaluewser = xER + 10 + 20,
        cyvaluewser = yER, cxvaluewrer = xER, cyvaluewrer = yER + 10 + 20,
        cyvalue = yrect + 10 + 50, // initial distance 50
        cyvalueb = yrect + 10 + 50; // initial distance 50

    // TODO: does not work for bi-directional arrow, Fix this
    // SVG checkbox with drag on-off
    var checkboxsvg = newg.append("g");

    var checkBox = [], checkBoxwser = [], checkBoxwrer = [],
        checkedchk = [], ydistancechk = 50, yinitialchk = 185,
        ytextinitialchk = 200, markerWidth = 4, markerHeight = 4;

    for (var i = 0; i < wallOfSmoothERMembrane.length; i++) {
        checkBoxwser[i] = new d3CheckBox();
    }

    for (var i = 0; i < wallOfRoughERMembrane.length; i++) {
        checkBoxwrer[i] = new d3CheckBox();
    }

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
        var textvaluechk = combinedMembrane[i].source_text + " " + combinedMembrane[i].source_text2;

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

    // Gap Junction
    for (var i = 0; i < celljunction.length; i++) {
        var textvalue = celljunction[i].source_text;
        var textvalue2 = celljunction[i].source_text2;
        var src_fma = celljunction[i].source_fma;
        var src_fma2 = celljunction[i].source_fma2;
        var snk_fma = celljunction[i].sink_fma;
        var snk_fma2 = celljunction[i].sink_fma2;
        var textWidth = getTextWidth(textvalue, 12);

        // TODO: cytosol to cytosol OR cytosol to paracellular!!
        if ((src_fma == cytosolID && snk_fma == cytosolID) && (src_fma2 == "Gap Junction" && snk_fma2 == "Gap Junction")) {
            var polygongctoc = newg.append("g").data([{x: xvaluectoc + 120, y: (yvaluectoc - 5 + height)}]);
            polygonlinegctoc[i] = polygongctoc.append("line")
                .attr("id", "polygonlinegctoc" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x;
                })
                .attr("y2", function (d) {
                    return d.y + polygonlineLen * 2 + height / 3;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#end)")
                .attr("cursor", "pointer");

            // Polygon
            polygon[i] = polygongctoc.append("g").append("polygon")
                .attr("transform", "translate(" + (xvaluectoc + 30 + 120) + "," + (yvaluectoc - 5 + height) + ")rotate(90)")
                .attr("id", "polygon" + i)
                .attr("points", "10,20 240,20 235,30 240,40 10,40 15,30")
                .attr("fill", "yellow")
                .attr("stroke", "black")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round")
                .attr("cursor", "move");

            var polygontext = polygongctoc.append("g").data([{
                x: xvaluectoc - 15 + 120,
                y: yvaluectoc - 15 + height
            }]);
            polygontextctoc[i] = polygontext.append("text")
                .attr("id", "polygontextctoc" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-size", "8px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text(textvalue);

            // increment x-axis of line and circle
            xvaluectoc += xdistancectoc;
            cxvaluectoc += xdistancectoc;
        }
    }

    // Wall of smooth ER membrane
    for (var i = 0; i < wallOfSmoothERMembrane.length; i++) {
        var textvalue = wallOfSmoothERMembrane[i].source_text;
        var textvalue2 = wallOfSmoothERMembrane[i].source_text2;
        var src_fma = wallOfSmoothERMembrane[i].source_fma;
        var src_fma2 = wallOfSmoothERMembrane[i].source_fma2;
        var snk_fma = wallOfSmoothERMembrane[i].sink_fma;
        var snk_fma2 = wallOfSmoothERMembrane[i].sink_fma2;
        var textWidth = getTextWidth(textvalue, 12);

        // case 1
        if ((src_fma == cytosolID && snk_fma == ER) && (src_fma2 == cytosolID && snk_fma2 == ER)) {
            var linegwser = newg.append("g").data([{x: xvaluewser, y: yvaluewser}]);
            linewithlinegwser[i] = linegwser.append("line")
                .attr("id", "linewithlinegwser" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x;
                })
                .attr("y2", function (d) {
                    return d.y + lineLenwser;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#end)")
                .attr("cursor", "pointer");

            var linegtextwser = linegwser.append("g").data([{
                x: xvaluewser - 15,
                y: yvaluewser + lineLenwser + 15
            }]);
            linewithtextgwser[i] = linegtextwser.append("text")
                .attr("id", "linewithtextgwser" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-family", "Times New Roman")
                .attr("font-size", "8px")
                .attr("font-weight", "bold")
                .attr("fill", "red")
                .attr("cursor", "pointer")
                .text(textvalue);

            var linegcirclewser = linegwser.append("g").data([{x: cxvaluewser, y: cyvaluewser}]);
            circlewithlinegwser[i] = linegcirclewser.append("circle")
                .attr("id", "circlewithlinegwser" + i)
                .attr("cx", function (d) {
                    return d.x + radiuswser;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("r", radiuswser)
                .attr("fill", "lightgreen")
                .attr("stroke-width", 20)
                .attr("cursor", "move");

            if (textvalue2 != "single flux") {
                var lineg2wser = linegwser.append("g").data([{x: xvaluewser + radiuswser * 2, y: yvaluewser}]);
                linewithlineg2wser[i] = lineg2wser.append("line")
                    .attr("id", "linewithlineg2wser" + i)
                    .attr("x1", function (d) {
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        return d.x;
                    })
                    .attr("y2", function (d) {
                        return d.y + lineLenwser;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#end)")
                    .attr("cursor", "pointer");

                var linegtext2wser = lineg2wser.append("g").data([{
                    x: xvaluewser + radiuswser * 2 - 15, y: yvaluewser + lineLenwser + 15
                }]);
                linewithtextg2wser[i] = linegtext2wser.append("text")
                    .attr("id", "linewithtextg2wser" + i)
                    .attr("x", function (d) {
                        return d.x;
                    })
                    .attr("y", function (d) {
                        return d.y;
                    })
                    .attr("font-family", "Times New Roman")
                    .attr("font-size", "8px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(textvalue2);
            }

            // increment x-axis of line and circle
            xvaluewser += xdistancewser;
            cxvaluewser += xdistancewser;
        }

        // case 2
        if ((src_fma == ER && snk_fma == cytosolID) && (src_fma2 == ER && snk_fma2 == cytosolID)) {
            var linegwser = newg.append("g").data([{x: xvaluewser, y: yvaluewser}]);
            linewithlinegwser[i] = linegwser.append("line")
                .attr("id", "linewithlinegwser" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x;
                })
                .attr("y2", function (d) {
                    return d.y + lineLenwser;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-start", "url(#starttop)")
                .attr("cursor", "pointer");

            var linegtextwser = linegwser.append("g").data([{
                x: xvaluewser - 15,
                y: yvaluewser - 15
            }]);
            linewithtextgwser[i] = linegtextwser.append("text")
                .attr("id", "linewithtextgwser" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-family", "Times New Roman")
                .attr("font-size", "8px")
                .attr("font-weight", "bold")
                .attr("fill", "red")
                .attr("cursor", "pointer")
                .text(textvalue);

            var linegcirclewser = linegwser.append("g").data([{x: cxvaluewser, y: cyvaluewser}]);
            circlewithlinegwser[i] = linegcirclewser.append("circle")
                .attr("id", "circlewithlinegwser" + i)
                .attr("cx", function (d) {
                    return d.x + radiuswser;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("r", radiuswser)
                .attr("fill", "lightgreen")
                .attr("stroke-width", 20)
                .attr("cursor", "move");

            if (textvalue2 != "single flux") {
                var lineg2wser = linegwser.append("g").data([{x: xvaluewser + radiuswser * 2, y: yvaluewser}]);
                linewithlineg2wser[i] = lineg2wser.append("line")
                    .attr("id", "linewithlineg2wser" + i)
                    .attr("x1", function (d) {
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        return d.x;
                    })
                    .attr("y2", function (d) {
                        return d.y + lineLenwser;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-start", "url(#starttop)")
                    .attr("cursor", "pointer");

                var linegtext2wser = lineg2wser.append("g").data([{
                    x: xvaluewser + radiuswser * 2 - 15, y: yvaluewser - 15
                }]);
                linewithtextg2wser[i] = linegtext2wser.append("text")
                    .attr("id", "linewithtextg2wser" + i)
                    .attr("x", function (d) {
                        return d.x;
                    })
                    .attr("y", function (d) {
                        return d.y;
                    })
                    .attr("font-family", "Times New Roman")
                    .attr("font-size", "8px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(textvalue2);
            }

            // increment x-axis of line and circle
            xvaluewser += xdistancewser;
            cxvaluewser += xdistancewser;
        }

        // case 3
        if ((src_fma == cytosolID && snk_fma == ER) && (src_fma2 == ER && snk_fma2 == cytosolID)) {
            var linegwser = newg.append("g").data([{x: xvaluewser, y: yvaluewser}]);
            linewithlinegwser[i] = linegwser.append("line")
                .attr("id", "linewithlinegwser" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x;
                })
                .attr("y2", function (d) {
                    return d.y + lineLenwser;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#end)")
                .attr("cursor", "pointer");

            var linegtextwser = linegwser.append("g").data([{
                x: xvaluewser - 15,
                y: yvaluewser + lineLenwser + 15
            }]);
            linewithtextgwser[i] = linegtextwser.append("text")
                .attr("id", "linewithtextgwser" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-family", "Times New Roman")
                .attr("font-size", "8px")
                .attr("font-weight", "bold")
                .attr("fill", "red")
                .attr("cursor", "pointer")
                .text(textvalue);

            var linegcirclewser = linegwser.append("g").data([{x: cxvaluewser, y: cyvaluewser}]);
            circlewithlinegwser[i] = linegcirclewser.append("circle")
                .attr("id", "circlewithlinegwser" + i)
                .attr("cx", function (d) {
                    return d.x + radiuswser;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("r", radiuswser)
                .attr("fill", "lightgreen")
                .attr("stroke-width", 20)
                .attr("cursor", "move");

            if (textvalue2 != "single flux") {
                var lineg2wser = linegwser.append("g").data([{x: xvaluewser + radiuswser * 2, y: yvaluewser}]);
                linewithlineg2wser[i] = lineg2wser.append("line")
                    .attr("id", "linewithlineg2wser" + i)
                    .attr("x1", function (d) {
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        return d.x;
                    })
                    .attr("y2", function (d) {
                        return d.y + lineLenwser;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-start", "url(#starttop)")
                    .attr("cursor", "pointer");

                var linegtext2wser = lineg2wser.append("g").data([{
                    x: xvaluewser + radiuswser * 2 - 15, y: yvaluewser - 15
                }]);
                linewithtextg2wser[i] = linegtext2wser.append("text")
                    .attr("id", "linewithtextg2wser" + i)
                    .attr("x", function (d) {
                        return d.x;
                    })
                    .attr("y", function (d) {
                        return d.y;
                    })
                    .attr("font-family", "Times New Roman")
                    .attr("font-size", "8px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(textvalue2);
            }

            // increment x-axis of line and circle
            xvaluewser += xdistancewser;
            cxvaluewser += xdistancewser;
        }

        // case 4
        if ((src_fma == ER && snk_fma == cytosolID) && (src_fma2 == cytosolID && snk_fma2 == ER)) {
            var linegwser = newg.append("g").data([{x: xvaluewser, y: yvaluewser}]);
            linewithlinegwser[i] = linegwser.append("line")
                .attr("id", "linewithlinegwser" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x;
                })
                .attr("y2", function (d) {
                    return d.y + lineLenwser;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-start", "url(#starttop)")
                .attr("cursor", "pointer");

            var linegtextwser = linegwser.append("g").data([{
                x: xvaluewser - 15,
                y: yvaluewser - 15
            }]);
            linewithtextgwser[i] = linegtextwser.append("text")
                .attr("id", "linewithtextgwser" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-family", "Times New Roman")
                .attr("font-size", "8px")
                .attr("font-weight", "bold")
                .attr("fill", "red")
                .attr("cursor", "pointer")
                .text(textvalue);

            var linegcirclewser = linegwser.append("g").data([{x: cxvaluewser, y: cyvaluewser}]);
            circlewithlinegwser[i] = linegcirclewser.append("circle")
                .attr("id", "circlewithlinegwser" + i)
                .attr("cx", function (d) {
                    return d.x + radiuswser;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("r", radiuswser)
                .attr("fill", "lightgreen")
                .attr("stroke-width", 20)
                .attr("cursor", "move");

            if (textvalue2 != "single flux") {
                var lineg2wser = linegwser.append("g").data([{x: xvaluewser + radiuswser * 2, y: yvaluewser}]);
                linewithlineg2wser[i] = lineg2wser.append("line")
                    .attr("id", "linewithlineg2wser" + i)
                    .attr("x1", function (d) {
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        return d.x;
                    })
                    .attr("y2", function (d) {
                        return d.y + lineLenwser;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#end)")
                    .attr("cursor", "pointer");

                var linegtext2wser = lineg2wser.append("g").data([{
                    x: xvaluewser + radiuswser * 2 - 15, y: yvaluewser + lineLenwser + 15
                }]);
                linewithtextg2wser[i] = linegtext2wser.append("text")
                    .attr("id", "linewithtextg2wser" + i)
                    .attr("x", function (d) {
                        return d.x;
                    })
                    .attr("y", function (d) {
                        return d.y;
                    })
                    .attr("font-family", "Times New Roman")
                    .attr("font-size", "8px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(textvalue2);
            }

            // increment x-axis of line and circle
            xvaluewser += xdistancewser;
            cxvaluewser += xdistancewser;
        }

        // case 5
        if ((src_fma == ER && snk_fma == cytosolID) && (src_fma2 == "single flux" && snk_fma2 == "single flux")) {
            var linegwser = newg.append("g").data([{x: xvaluewser, y: yvaluewser + 5}]);
            linewithlinegwser[i] = linegwser.append("line")
                .attr("id", "linewithlinegwser" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x;
                })
                .attr("y2", function (d) {
                    return d.y + lineLenwser;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-start", "url(#starttop)")
                .attr("cursor", "pointer");

            var linegtextwser = linegwser.append("g").data([{
                x: xvaluewser - 15,
                y: yvaluewser - 10
            }]);
            linewithtextgwser[i] = linegtextwser.append("text")
                .attr("id", "linewithtextgwser" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-family", "Times New Roman")
                .attr("font-size", "8px")
                .attr("font-weight", "bold")
                .attr("fill", "red")
                .attr("cursor", "pointer")
                .text(textvalue);

            var linegcirclewser = linegwser.append("g").data([{x: cxvaluewser, y: cyvaluewser}]);
            circlewithlinegwser[i] = linegcirclewser.append("circle")
                .attr("id", "circlewithlinegwser" + i)
                .attr("cx", function (d) {
                    return d.x + radiuswser;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("r", radiuswser)
                .attr("fill", "lightgreen")
                .attr("stroke-width", 20)
                .attr("cursor", "move");

            // increment x-axis of line and circle
            xvaluewser += xdistancewser;
            cxvaluewser += xdistancewser;
        }

        // case 6
        if ((src_fma == cytosolID && snk_fma == ER) && (src_fma2 == "single flux" && snk_fma2 == "single flux")) {
            var linegwser = newg.append("g").data([{x: xvaluewser, y: yvaluewser + 5}]);
            linewithlinegwser[i] = linegwser.append("line")
                .attr("id", "linewithlinegwser" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x;
                })
                .attr("y2", function (d) {
                    return d.y + lineLenwser;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#end)")
                .attr("cursor", "pointer");

            var linegtextwser = linegwser.append("g").data([{
                x: xvaluewser - 15,
                y: yvaluewser + lineLenwser + 10
            }]);
            linewithtextgwser[i] = linegtextwser.append("text")
                .attr("id", "linewithtextgwser" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-family", "Times New Roman")
                .attr("font-size", "8px")
                .attr("font-weight", "bold")
                .attr("fill", "red")
                .attr("cursor", "pointer")
                .text(textvalue);

            var linegcirclewser = linegwser.append("g").data([{x: cxvaluewser, y: cyvaluewser}]);
            circlewithlinegwser[i] = linegcirclewser.append("circle")
                .attr("id", "circlewithlinegwser" + i)
                .attr("cx", function (d) {
                    return d.x + radiuswser;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("r", radiuswser)
                .attr("fill", "lightgreen")
                .attr("stroke-width", 20)
                .attr("cursor", "move");

            // increment x-axis of line and circle
            xvaluewser += xdistancewser;
            cxvaluewser += xdistancewser;
        }

        // case 7
        if ((src_fma == ER && snk_fma == cytosolID) && (src_fma2 == "IP3 flux" && snk_fma2 == "IP3 flux")) {
            var polygongwser = newg.append("g").data([{x: xvaluewser, y: (yvaluewser - 5)}]);
            polygonlinegwser[i] = polygongwser.append("line")
                .attr("id", "polygonlinegwser" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x;
                })
                .attr("y2", function (d) {
                    return d.y + polygonlineLen;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-start", "url(#starttop)")
                .attr("cursor", "pointer");

            // Polygon
            polygon[i] = polygongwser.append("g").append("polygon")
                .attr("transform", "translate(" + (xvaluewser + 30) + "," + (yvaluewser - 5) + ")rotate(90)")
                .attr("id", "polygon" + i)
                .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                .attr("fill", "yellow")
                .attr("stroke", "black")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round")
                .attr("cursor", "move");

            var polygontext = polygongwser.append("g").data([{x: xvaluewser - 15, y: yvaluewser - 15}]);
            polygontextwser[i] = polygontext.append("text")
                .attr("id", "polygontextwser" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-size", "8px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text(textvalue);

            // increment x-axis of line and circle
            xvaluewser += xdistancewser;
            cxvaluewser += xdistancewser;

            // circle for IP3 receptor
            var linegcirclewser = polygongwser.append("g").data([{x: xvaluewser - 55, y: yvaluewser + 10}]);
            circlewithlinegwser[i] = linegcirclewser.append("circle")
                .attr("id", "circlewithlinegwser" + i)
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("r", 10)
                .attr("fill", "lightgreen")
                .attr("stroke-width", 20)
                .attr("cursor", "move");

            circletextwser[i] = linegcirclewser.append("text")
                .attr("id", "circletextwser" + i)
                .attr("x", function (d) {
                    return d.x - 8;
                })
                .attr("y", function (d) {
                    return d.y + 4;
                })
                .attr("font-size", "10px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text("IP3");
        }

        // case 8
        if ((src_fma == cytosolID && snk_fma == ER) && (src_fma2 == "IP3 flux" && snk_fma2 == "IP3 flux")) {
            var polygongwser = newg.append("g").data([{x: xvaluewser, y: (yvaluewser - 5)}]);
            polygonlinegwser[i] = polygongwser.append("line")
                .attr("id", "polygonlinegwser" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x;
                })
                .attr("y2", function (d) {
                    return d.y + polygonlineLen;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#end)")
                .attr("cursor", "pointer");

            // Polygon
            polygon[i] = polygongwser.append("g").append("polygon")
                .attr("transform", "translate(" + (xvaluewser + 30) + "," + (yvaluewser - 5) + ")rotate(90)")
                .attr("id", "polygon" + i)
                .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                .attr("fill", "yellow")
                .attr("stroke", "black")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round")
                .attr("cursor", "move");

            var polygontext = polygongwser.append("g").data([{
                x: xvaluewser - 15,
                y: yvaluewser + polygonlineLen + 15
            }]);

            polygontextwser[i] = polygontext.append("text")
                .attr("id", "polygontextwser" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-size", "8px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text(textvalue);

            // increment x-axis of line and circle
            xvaluewser += xdistancewser;
            cxvaluewser += xdistancewser;

            // circle for IP3 receptor
            var linegcirclewser = polygongwser.append("g").data([{x: xvaluewser - 50, y: yvaluewser + 15}]);
            circlewithlinegwser[i] = linegcirclewser.append("circle")
                .attr("id", "circlewithlinegwser" + i)
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("r", 10)
                .attr("fill", "lightgreen")
                .attr("stroke-width", 20)
                .attr("cursor", "move");

            circletextwser[i] = linegcirclewser.append("text")
                .attr("id", "circletextwser" + i)
                .attr("x", function (d) {
                    return d.x - 8;
                })
                .attr("y", function (d) {
                    return d.y + 4;
                })
                .attr("font-size", "10px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text("IP3");
        }

        // case 9
        if ((src_fma == ER && snk_fma == cytosolID) && (src_fma2 == "leak" && snk_fma2 == "leak")) {
            var leakgwser = newg.append("g").data([{x: xvaluewser, y: (yvaluewser - 5)}]);
            leaklinegwser[i] = leakgwser.append("line")
                .attr("id", "leaklinegwser" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x;
                })
                .attr("y2", function (d) {
                    return d.y + polygonlineLen;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-start", "url(#starttop)")
                .attr("cursor", "pointer");

            var leaktextg = leakgwser.append("g").data([{x: xvaluewser - 15, y: yvaluewser - 15}]);
            leaktextwser[i] = leaktextg.append("text")
                .attr("id", "leaktextwser" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-size", "8px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text(textvalue);

            // increment x-axis of line and circle
            xvaluewser += xdistancewser;
            cxvaluewser += xdistancewser;
        }

        // case 10
        if ((src_fma == cytosolID && snk_fma == ER) && (src_fma2 == "leak" && snk_fma2 == "leak")) {
            var leakgwser = newg.append("g").data([{x: xvaluewser, y: (yvaluewser - 5)}]);
            leaklinegwser[i] = leakgwser.append("line")
                .attr("id", "leaklinegwser" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x;
                })
                .attr("y2", function (d) {
                    return d.y + polygonlineLen;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#end)")
                .attr("cursor", "pointer");

            var leaktextg = polygongwser.append("g").data([{
                x: xvaluewser - 15,
                y: yvaluewser + polygonlineLen + 15
            }]);

            leaktextwser[i] = leaktextg.append("text")
                .attr("id", "leaktextwser" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-size", "8px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text(textvalue);

            // increment x-axis of line and circle
            xvaluewser += xdistancewser;
            cxvaluewser += xdistancewser;
        }
    }

    // Wall of rough ER membrane
    for (var i = 0; i < wallOfRoughERMembrane.length; i++) {
        var textvalue = wallOfRoughERMembrane[i].source_text;
        var textvalue2 = wallOfRoughERMembrane[i].source_text2;
        var src_fma = wallOfRoughERMembrane[i].source_fma;
        var src_fma2 = wallOfRoughERMembrane[i].source_fma2;
        var snk_fma = wallOfRoughERMembrane[i].sink_fma;
        var snk_fma2 = wallOfRoughERMembrane[i].sink_fma2;
        var textWidth = getTextWidth(textvalue, 12);

        // case 1
        if ((src_fma == cytosolID && snk_fma == ER) && (src_fma2 == cytosolID && snk_fma2 == ER)) {
            var linegwrer = newg.append("g").data([{x: xvaluewrer + widthER, y: yvaluewrer}]);
            linewithlinegwrer[i] = linegwrer.append("line")
                .attr("id", "linewithlinegwrer" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + lineLenwser;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-start", "url(#start)")
                .attr("cursor", "pointer");

            var linegtextwrer = linegwrer.append("g").data([{
                x: xvaluewrer - lineLenwser + widthER,
                y: yvaluewrer
            }]);
            linewithtextgwrer[i] = linegtextwrer.append("text")
                .attr("id", "linewithtextgwrer" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-family", "Times New Roman")
                .attr("font-size", "8px")
                .attr("font-weight", "bold")
                .attr("fill", "red")
                .attr("cursor", "pointer")
                .text(textvalue);

            var linegcirclewrer = linegwrer.append("g").data([{x: cxvaluewrer + widthER, y: cyvaluewrer}]);
            circlewithlinegwrer[i] = linegcirclewrer.append("circle")
                .attr("id", "circlewithlinegwrer" + i)
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y + radiuswser;
                })
                .attr("r", radiuswser)
                .attr("fill", "lightgreen")
                .attr("stroke-width", 20)
                .attr("cursor", "move");

            if (textvalue2 != "single flux") {
                var lineg2wrer = linegwrer.append("g").data([{
                    x: xvaluewrer + widthER,
                    y: yvaluewrer + radiuswser * 2
                }]);
                linewithlineg2wrer[i] = lineg2wrer.append("line")
                    .attr("id", "linewithlineg2wrer" + i)
                    .attr("x1", function (d) {
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        return d.x + lineLenwser;
                    })
                    .attr("y2", function (d) {
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-start", "url(#start)")
                    .attr("cursor", "pointer");

                var linegtext2wrer = lineg2wrer.append("g").data([{
                    x: xvaluewrer - lineLenwser + widthER, y: yvaluewrer + radiuswser * 2
                }]);
                linewithtextg2wrer[i] = linegtext2wrer.append("text")
                    .attr("id", "linewithtextg2wrer" + i)
                    .attr("x", function (d) {
                        return d.x;
                    })
                    .attr("y", function (d) {
                        return d.y;
                    })
                    .attr("font-family", "Times New Roman")
                    .attr("font-size", "8px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(textvalue2);
            }

            // increment x-axis of line and circle
            yvaluewrer += ydistancewrer;
            cyvaluewrer += ydistancewrer;
        }

        // case 2
        if ((src_fma == ER && snk_fma == cytosolID) && (src_fma2 == ER && snk_fma2 == cytosolID)) {
            var linegwrer = newg.append("g").data([{x: xvaluewrer + widthER, y: yvaluewrer}]);
            linewithlinegwrer[i] = linegwrer.append("line")
                .attr("id", "linewithlinegwrer" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + lineLenwser;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#end)")
                .attr("cursor", "pointer");

            var linegtextwrer = linegwrer.append("g").data([{
                x: xvaluewrer + lineLenwser + 10 + widthER,
                y: yvaluewrer + 5
            }]);
            linewithtextgwrer[i] = linegtextwrer.append("text")
                .attr("id", "linewithtextgwrer" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-family", "Times New Roman")
                .attr("font-size", "8px")
                .attr("font-weight", "bold")
                .attr("fill", "red")
                .attr("cursor", "pointer")
                .text(textvalue);

            var linegcirclewrer = linegwrer.append("g").data([{x: cxvaluewrer + widthER, y: cyvaluewrer}]);
            circlewithlinegwrer[i] = linegcirclewrer.append("circle")
                .attr("id", "circlewithlinegwrer" + i)
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y + radiuswser;
                })
                .attr("r", radiuswser)
                .attr("fill", "lightgreen")
                .attr("stroke-width", 20)
                .attr("cursor", "move");

            if (textvalue2 != "single flux") {
                var lineg2wrer = linegwrer.append("g").data([{
                    x: xvaluewrer + widthER,
                    y: yvaluewrer + radiuswser * 2
                }]);
                linewithlineg2wrer[i] = lineg2wrer.append("line")
                    .attr("id", "linewithlineg2wrer" + i)
                    .attr("x1", function (d) {
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        return d.x + lineLenwser;
                    })
                    .attr("y2", function (d) {
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#end)")
                    .attr("cursor", "pointer");

                var linegtext2wrer = lineg2wrer.append("g").data([{
                    x: xvaluewrer + lineLenwser + 10 + widthER, y: yvaluewrer + radiuswser * 2 + 5
                }]);
                linewithtextg2wrer[i] = linegtext2wrer.append("text")
                    .attr("id", "linewithtextg2wrer" + i)
                    .attr("x", function (d) {
                        return d.x;
                    })
                    .attr("y", function (d) {
                        return d.y;
                    })
                    .attr("font-family", "Times New Roman")
                    .attr("font-size", "8px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(textvalue2);
            }

            // increment x-axis of line and circle
            yvaluewrer += ydistancewrer;
            cyvaluewrer += ydistancewrer;
        }

        // case 3
        if ((src_fma == cytosolID && snk_fma == ER) && (src_fma2 == ER && snk_fma2 == cytosolID)) {
            var linegwrer = newg.append("g").data([{x: xvaluewrer + widthER, y: yvaluewrer}]);
            linewithlinegwrer[i] = linegwrer.append("line")
                .attr("id", "linewithlinegwrer" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + lineLenwser;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-start", "url(#start)")
                .attr("cursor", "pointer");

            var linegtextwrer = linegwrer.append("g").data([{
                x: xvaluewrer - lineLenwser + widthER,
                y: yvaluewrer
            }]);
            linewithtextgwrer[i] = linegtextwrer.append("text")
                .attr("id", "linewithtextgwrer" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-family", "Times New Roman")
                .attr("font-size", "8px")
                .attr("font-weight", "bold")
                .attr("fill", "red")
                .attr("cursor", "pointer")
                .text(textvalue);

            var linegcirclewrer = linegwrer.append("g").data([{x: cxvaluewrer + widthER, y: cyvaluewrer}]);
            circlewithlinegwrer[i] = linegcirclewrer.append("circle")
                .attr("id", "circlewithlinegwrer" + i)
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y + radiuswser;
                })
                .attr("r", radiuswser)
                .attr("fill", "lightgreen")
                .attr("stroke-width", 20)
                .attr("cursor", "move");

            if (textvalue2 != "single flux") {
                var lineg2wrer = linegwrer.append("g").data([{
                    x: xvaluewrer + widthER,
                    y: yvaluewrer + radiuswser * 2
                }]);
                linewithlineg2wrer[i] = lineg2wrer.append("line")
                    .attr("id", "linewithlineg2wrer" + i)
                    .attr("x1", function (d) {
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        return d.x + lineLenwser;
                    })
                    .attr("y2", function (d) {
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#end)")
                    .attr("cursor", "pointer");

                var linegtext2wrer = lineg2wrer.append("g").data([{
                    x: xvaluewrer + lineLenwser + 10 + widthER, y: yvaluewrer + radiuswser * 2 + 5
                }]);
                linewithtextg2wrer[i] = linegtext2wrer.append("text")
                    .attr("id", "linewithtextg2wrer" + i)
                    .attr("x", function (d) {
                        return d.x;
                    })
                    .attr("y", function (d) {
                        return d.y;
                    })
                    .attr("font-family", "Times New Roman")
                    .attr("font-size", "8px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(textvalue2);
            }

            // increment x-axis of line and circle
            yvaluewrer += ydistancewrer;
            cyvaluewrer += ydistancewrer;
        }

        // case 4
        if ((src_fma == ER && snk_fma == cytosolID) && (src_fma2 == cytosolID && snk_fma2 == ER)) {
            var linegwrer = newg.append("g").data([{x: xvaluewrer + widthER, y: yvaluewrer}]);
            linewithlinegwrer[i] = linegwrer.append("line")
                .attr("id", "linewithlinegwrer" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + lineLenwser;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#end)")
                .attr("cursor", "pointer");

            var linegtextwrer = linegwrer.append("g").data([{
                x: xvaluewrer + lineLenwser + 10 + widthER,
                y: yvaluewrer + 5
            }]);
            linewithtextgwrer[i] = linegtextwrer.append("text")
                .attr("id", "linewithtextgwrer" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-family", "Times New Roman")
                .attr("font-size", "8px")
                .attr("font-weight", "bold")
                .attr("fill", "red")
                .attr("cursor", "pointer")
                .text(textvalue);

            var linegcirclewrer = linegwrer.append("g").data([{x: cxvaluewrer + widthER, y: cyvaluewrer}]);
            circlewithlinegwrer[i] = linegcirclewrer.append("circle")
                .attr("id", "circlewithlinegwrer" + i)
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y + radiuswser;
                })
                .attr("r", radiuswser)
                .attr("fill", "lightgreen")
                .attr("stroke-width", 20)
                .attr("cursor", "move");

            if (textvalue2 != "single flux") {
                var lineg2wrer = linegwrer.append("g").data([{
                    x: xvaluewrer + widthER,
                    y: yvaluewrer + radiuswser * 2
                }]);
                linewithlineg2wrer[i] = lineg2wrer.append("line")
                    .attr("id", "linewithlineg2wrer" + i)
                    .attr("x1", function (d) {
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        return d.x + lineLenwser;
                    })
                    .attr("y2", function (d) {
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-start", "url(#start)")
                    .attr("cursor", "pointer");

                var linegtext2wrer = lineg2wrer.append("g").data([{
                    x: xvaluewrer - lineLenwser + widthER, y: yvaluewrer + radiuswser * 2
                }]);
                linewithtextg2wrer[i] = linegtext2wrer.append("text")
                    .attr("id", "linewithtextg2wrer" + i)
                    .attr("x", function (d) {
                        return d.x;
                    })
                    .attr("y", function (d) {
                        return d.y;
                    })
                    .attr("font-family", "Times New Roman")
                    .attr("font-size", "8px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(textvalue2);
            }

            // increment x-axis of line and circle
            yvaluewrer += ydistancewrer;
            cyvaluewrer += ydistancewrer;
        }

        // case 5
        if ((src_fma == ER && snk_fma == cytosolID) && (src_fma2 == "single flux" && snk_fma2 == "single flux")) {
            var linegwrer = newg.append("g").data([{x: xvaluewrer + widthER, y: yvaluewrer}]);
            linewithlinegwrer[i] = linegwrer.append("line")
                .attr("id", "linewithlinegwrer" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + lineLenwser;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#end)")
                .attr("cursor", "pointer");

            var linegtextwrer = linegwrer.append("g").data([{
                x: xvaluewrer + lineLenwser + 10 + widthER,
                y: yvaluewrer + 5
            }]);
            linewithtextgwrer[i] = linegtextwrer.append("text")
                .attr("id", "linewithtextgwrer" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-family", "Times New Roman")
                .attr("font-size", "8px")
                .attr("font-weight", "bold")
                .attr("fill", "red")
                .attr("cursor", "pointer")
                .text(textvalue);

            var linegcirclewrer = linegwrer.append("g").data([{x: cxvaluewrer + widthER, y: cyvaluewrer}]);
            circlewithlinegwrer[i] = linegcirclewrer.append("circle")
                .attr("id", "circlewithlinegwrer" + i)
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y + radiuswser;
                })
                .attr("r", radiuswser)
                .attr("fill", "lightgreen")
                .attr("stroke-width", 20)
                .attr("cursor", "move");

            // increment x-axis of line and circle
            yvaluewrer += ydistancewrer;
            cyvaluewrer += ydistancewrer;
        }

        // case 6
        if ((src_fma == cytosolID && snk_fma == ER) && (src_fma2 == "single flux" && snk_fma2 == "single flux")) {
            var linegwrer = newg.append("g").data([{x: xvaluewrer + widthER, y: yvaluewrer}]);
            linewithlinegwrer[i] = linegwrer.append("line")
                .attr("id", "linewithlinegwrer" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + lineLenwser;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-start", "url(#start)")
                .attr("cursor", "pointer");

            var linegtextwrer = linegwrer.append("g").data([{
                x: xvaluewrer - lineLenwser + widthER,
                y: yvaluewrer
            }]);
            linewithtextgwrer[i] = linegtextwrer.append("text")
                .attr("id", "linewithtextgwrer" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-family", "Times New Roman")
                .attr("font-size", "8px")
                .attr("font-weight", "bold")
                .attr("fill", "red")
                .attr("cursor", "pointer")
                .text(textvalue);

            var linegcirclewrer = linegwrer.append("g").data([{x: cxvaluewrer + widthER, y: cyvaluewrer}]);
            circlewithlinegwrer[i] = linegcirclewrer.append("circle")
                .attr("id", "circlewithlinegwrer" + i)
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y + radiuswser;
                })
                .attr("r", radiuswser)
                .attr("fill", "lightgreen")
                .attr("stroke-width", 20)
                .attr("cursor", "move");

            // increment x-axis of line and circle
            yvaluewrer += ydistancewrer;
            cyvaluewrer += ydistancewrer;
        }

        // case 7
        if ((src_fma == ER && snk_fma == cytosolID) && (src_fma2 == "IP3 flux" && snk_fma2 == "IP3 flux")) {
            var polygongwrer = newg.append("g").data([{x: xvaluewrer - 10 + widthER, y: (yvaluewrer)}]);
            polygonlinegwrer[i] = polygongwrer.append("line")
                .attr("id", "polygonlinegwrer" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + polygonlineLen;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#end)")
                .attr("cursor", "pointer");

            // Polygon
            polygon[i] = polygongwrer.append("g").append("polygon")
                .attr("transform", "translate(" + (xvaluewrer - 10 + widthER) + "," + (yvaluewrer - 30) + ")")
                .attr("id", "polygon" + i)
                .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                .attr("fill", "yellow")
                .attr("stroke", "black")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round")
                .attr("cursor", "move");

            var polygontext = polygongwrer.append("g").data([{
                x: xvaluewrer + polygonlineLen + widthER,
                y: yvaluewrer + 5
            }]);

            polygontextwrer[i] = polygontext.append("text")
                .attr("id", "polygontextwrer" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-size", "8px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text(textvalue);

            // increment x-axis of line and circle
            yvaluewrer += ydistancewrer;
            cyvaluewrer += ydistancewrer;

            // circle for IP3 receptor
            var linegcirclewrer = polygongwrer.append("g").data([{
                x: xvaluewrer + 30 + widthER,
                y: yvaluewrer - 55
            }]);
            circlewithlinegwrer[i] = linegcirclewrer.append("circle")
                .attr("id", "circlewithlinegwrer" + i)
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("r", 10)
                .attr("fill", "lightgreen")
                .attr("stroke-width", 20)
                .attr("cursor", "move");

            circletextwrer[i] = linegcirclewrer.append("text")
                .attr("id", "circletextwrer" + i)
                .attr("x", function (d) {
                    return d.x - 8;
                })
                .attr("y", function (d) {
                    return d.y + 4;
                })
                .attr("font-size", "10px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text("IP3");
        }

        // case 8
        if ((src_fma == cytosolID && snk_fma == ER) && (src_fma2 == "IP3 flux" && snk_fma2 == "IP3 flux")) {
            var polygongwrer = newg.append("g").data([{x: xvaluewrer - 10 + widthER, y: (yvaluewrer)}]);
            polygonlinegwrer[i] = polygongwrer.append("line")
                .attr("id", "polygonlinegwrer" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + polygonlineLen;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-start", "url(#start)")
                .attr("cursor", "pointer");

            // Polygon
            polygon[i] = polygongwrer.append("g").append("polygon")
                .attr("transform", "translate(" + (xvaluewrer - 10 + widthER) + "," + (yvaluewrer - 30) + ")")
                .attr("id", "polygon" + i)
                .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                .attr("fill", "yellow")
                .attr("stroke", "black")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round")
                .attr("cursor", "move");

            var polygontext = polygongwrer.append("g").data([{
                x: xvaluewrer - 10 - polygonlineLen + widthER,
                y: yvaluewrer + 5
            }]);

            polygontextwrer[i] = polygontext.append("text")
                .attr("id", "polygontextwrer" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-size", "8px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text(textvalue);

            // increment x-axis of line and circle
            yvaluewrer += ydistancewrer;
            cyvaluewrer += ydistancewrer;

            // circle for IP3 receptor
            var linegcirclewrer = polygongwrer.append("g").data([{
                x: xvaluewrer + 30 + widthER,
                y: yvaluewrer - 55
            }]);
            circlewithlinegwrer[i] = linegcirclewrer.append("circle")
                .attr("id", "circlewithlinegwrer" + i)
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("r", 10)
                .attr("fill", "lightgreen")
                .attr("stroke-width", 20)
                .attr("cursor", "move");

            circletextwrer[i] = linegcirclewrer.append("text")
                .attr("id", "circletextwrer" + i)
                .attr("x", function (d) {
                    return d.x - 8;
                })
                .attr("y", function (d) {
                    return d.y + 4;
                })
                .attr("font-size", "10px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text("IP3");
        }

        // case 9
        if ((src_fma == ER && snk_fma == cytosolID) && (src_fma2 == "leak" && snk_fma2 == "leak")) {
            var leakgwrer = newg.append("g").data([{x: xvaluewrer - 10 + widthER, y: (yvaluewrer)}]);
            leaklinegwrer[i] = leakgwrer.append("line")
                .attr("id", "leaklinegwrer" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + polygonlineLen;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#end)")
                .attr("cursor", "pointer");

            var leaktextg = leakgwrer.append("g").data([{
                x: xvaluewrer + polygonlineLen + widthER,
                y: yvaluewrer + 5
            }]);

            leaktextwrer[i] = leaktextg.append("text")
                .attr("id", "leaktextwrer" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-size", "8px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text(textvalue);

            // increment x-axis of line and circle
            yvaluewrer += ydistancewrer;
            cyvaluewrer += ydistancewrer;
        }

        // case 10
        if ((src_fma == cytosolID && snk_fma == ER) && (src_fma2 == "leak" && snk_fma2 == "leak")) {
            var leakgwrer = newg.append("g").data([{x: xvaluewrer - 10 + widthER, y: (yvaluewrer)}]);
            leaklinegwrer[i] = leakgwrer.append("line")
                .attr("id", "leaklinegwrer" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + polygonlineLen;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-start", "url(#start)")
                .attr("cursor", "pointer");

            var leaktextg = leakgwrer.append("g").data([{
                x: xvaluewrer - 10 - polygonlineLen + widthER,
                y: yvaluewrer + 5
            }]);

            leaktextwrer[i] = leaktextg.append("text")
                .attr("id", "leaktextwrer" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-size", "8px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text(textvalue);

            // increment x-axis of line and circle
            yvaluewrer += ydistancewrer;
            cyvaluewrer += ydistancewrer;
        }
    }

    // apical, basolateral and paracellular membrane
    for (var i = 0; i < combinedMembrane.length; i++) {
        source_name = combinedMembrane[i].source_name;
        source_name2 = combinedMembrane[i].source_name2;
        var textvalue = combinedMembrane[i].source_text;
        var textvalue2 = combinedMembrane[i].source_text2;
        var src_fma = combinedMembrane[i].source_fma;
        var src_fma2 = combinedMembrane[i].source_fma2;
        var snk_fma = combinedMembrane[i].sink_fma;
        var snk_fma2 = combinedMembrane[i].sink_fma2;
        var snk_textvalue = combinedMembrane[i].sink_text;
        var snk_textvalue2 = combinedMembrane[i].sink_text2;
        var textWidth = getTextWidth(textvalue, 12);

        // case 1
        if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == luminalID && snk_fma2 == cytosolID)) {
            var tempID = circlewithlineg.length;
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
                .text(textvalue);

            var linegcircle = lineg.append("g").data([{x: cxvalue, y: cyvalue}]);
            circlewithlineg[i] = linegcircle.append("circle")
                .attr("id", function (d) {
                    return [
                        source_name, source_name2,
                        textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                        src_fma, src_fma2, snk_fma, snk_fma2
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
                .attr("cursor", "move");

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
                    .text(textvalue2);
            }

            // increment y-axis of line and circle
            yvalue += ydistance;
            cyvalue += ydistance;
        }

        // case 2
        if ((src_fma == cytosolID && snk_fma == luminalID) && (src_fma2 == cytosolID && snk_fma2 == luminalID)) {
            var tempID = circlewithlineg.length;
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

            var linegtext = lineg.append("g").data([{x: xvalue - textWidth - 10, y: yvalue + 5}]);
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
                .text(textvalue);

            var linegcircle = lineg.append("g").data([{x: cxvalue, y: cyvalue}]);
            circlewithlineg[i] = linegcircle.append("circle")
                .attr("id", function (d) {
                    return [
                        source_name, source_name2,
                        textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                        src_fma, src_fma2, snk_fma, snk_fma2
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
                .attr("cursor", "move");

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
                    .text(textvalue2);
            }

            // increment y-axis of line and circle
            yvalue += ydistance;
            cyvalue += ydistance;
        }

        // case 3
        if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == cytosolID && snk_fma2 == luminalID)) {
            var tempID = circlewithlineg.length;
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
                .text(textvalue);

            var linegcircle = lineg.append("g").data([{x: cxvalue, y: cyvalue}]);
            circlewithlineg[i] = linegcircle.append("circle")
                .attr("id", function (d) {
                    return [
                        source_name, source_name2,
                        textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                        src_fma, src_fma2, snk_fma, snk_fma2
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
                .attr("cursor", "move");

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
                    .text(textvalue2);
            }

            // increment y-axis of line and circle
            yvalue += ydistance;
            cyvalue += ydistance;
        }

        // case 4
        if ((src_fma == cytosolID && snk_fma == luminalID) && (src_fma2 == luminalID && snk_fma2 == cytosolID)) {
            var tempID = circlewithlineg.length;
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

            var linegtext = lineg.append("g").data([{x: xvalue - textWidth - 10, y: yvalue + 5}]);
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
                .text(textvalue);

            var linegcircle = lineg.append("g").data([{x: cxvalue, y: cyvalue}]);
            circlewithlineg[i] = linegcircle.append("circle")
                .attr("id", function (d) {
                    return [
                        source_name, source_name2,
                        textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                        src_fma, src_fma2, snk_fma, snk_fma2
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
                .attr("cursor", "move");

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
                    .text(textvalue2);
            }

            // increment y-axis of line and circle
            yvalue += ydistance;
            cyvalue += ydistance;
        }

        // case 5
        if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == "channel" && snk_fma2 == "channel")) {
            var tempID = circlewithlineg.length;
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

            // Polygon
            circlewithlineg[i] = polygong.append("g").append("polygon")
                .attr("transform", "translate(" + (xvalue - 5) + "," + (yvalue - 30) + ")")
                .attr("id", function (d) {
                    return [
                        source_name, source_name2,
                        textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                        src_fma, src_fma2, snk_fma, snk_fma2
                    ];
                })
                .attr("index", tempID)
                .attr("membrane", apicalID)
                .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                .attr("fill", "yellow")
                .attr("stroke", "black")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round")
                .attr("cursor", "move");

            var polygontext = polygong.append("g").data([{x: xvalue + 20 - 5, y: yvalue + 5}]);

            var txt = textvalue.substr(5); // temp solution
            if (txt == "Cl") txt = txt + "-";
            else txt = txt + "+";

            linewithtextg[i] = polygontext.append("text")
                .attr("id", "linewithtextg" + tempID)
                .attr("x", function (d) {
                    dxtext[i] = d.x;
                    return d.x;
                })
                .attr("y", function (d) {
                    dytext[i] = d.y;
                    return d.y;
                })
                .attr("font-size", "12px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text(txt);

            // increment y-axis of line and circle
            yvalue += ydistance;
            cyvalue += ydistance;
        }

        // case 6
        if ((src_fma == cytosolID && snk_fma == luminalID) && (src_fma2 == "channel" && snk_fma2 == "channel")) {
            var tempID = circlewithlineg.length;
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

            // Polygon
            circlewithlineg[i] = polygong.append("g").append("polygon")
                .attr("transform", "translate(" + (xvalue - 5) + "," + (yvalue - 30) + ")")
                .attr("id", function (d) {
                    return [
                        source_name, source_name2,
                        textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                        src_fma, src_fma2, snk_fma, snk_fma2
                    ];
                })
                .attr("index", tempID)
                .attr("membrane", apicalID)
                .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                .attr("fill", "yellow")
                .attr("stroke", "black")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round")
                .attr("cursor", "move");

            var polygontext = polygong.append("g").data([{x: xvalue + 20 - 5, y: yvalue + 5}]);

            var txt = textvalue.substr(5); // temp solution
            if (txt == "Cl") txt = txt + "-";
            else txt = txt + "+";

            linewithtextg[i] = polygontext.append("text")
                .attr("id", "linewithtextg" + tempID)
                .attr("x", function (d) {
                    dxtext[i] = d.x;
                    return d.x;
                })
                .attr("y", function (d) {
                    dytext[i] = d.y;
                    return d.y;
                })
                .attr("font-size", "12px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text(txt);

            // increment y-axis of line and circle
            yvalue += ydistance;
            cyvalue += ydistance;
        }

        // case 1
        if ((src_fma == cytosolID && snk_fma == interstitialID) && (src_fma2 == cytosolID && snk_fma2 == interstitialID)) {
            var tempID = circlewithlineg.length;
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
                .text(textvalue);

            var linegcircle = lineg.append("g").data([{x: cxvalue + width, y: cyvalueb}]);
            circlewithlineg[i] = linegcircle.append("circle")
                .attr("id", function (d) {
                    return [
                        source_name, source_name2,
                        textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                        src_fma, src_fma2, snk_fma, snk_fma2
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
                .attr("cursor", "move");

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
                    .text(textvalue2);
            }

            // increment y-axis of line and circle
            yvalueb += ydistance;
            cyvalueb += ydistance;
        }

        // case 2
        if ((src_fma == interstitialID && snk_fma == cytosolID) && (src_fma2 == interstitialID && snk_fma2 == cytosolID)) {
            var tempID = circlewithlineg.length;
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

            var linegtext = lineg.append("g").data([{x: xvalue - textWidth - 10 + width, y: yvalueb + 5}]);
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
                .text(textvalue);

            var linegcircle = lineg.append("g").data([{x: cxvalue + width, y: cyvalueb}]);
            circlewithlineg[i] = linegcircle.append("circle")
                .attr("id", function (d) {
                    return [
                        source_name, source_name2,
                        textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                        src_fma, src_fma2, snk_fma, snk_fma2
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
                .attr("cursor", "move");

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
                    .text(textvalue2);
            }

            // increment y-axis of line and circle
            yvalueb += ydistance;
            cyvalueb += ydistance;
        }

        // case 3
        if ((src_fma == cytosolID && snk_fma == interstitialID) && (src_fma2 == interstitialID && snk_fma2 == cytosolID)) {
            var tempID = circlewithlineg.length;
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
                .text(textvalue);

            var linegcircle = lineg.append("g").data([{x: cxvalue + width, y: cyvalueb}]);
            circlewithlineg[i] = linegcircle.append("circle")
                .attr("id", function (d) {
                    return [
                        source_name, source_name2,
                        textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                        src_fma, src_fma2, snk_fma, snk_fma2
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
                .attr("cursor", "move");

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
                    .text(textvalue2);
            }

            // increment y-axis of line and circle
            yvalueb += ydistance;
            cyvalueb += ydistance;
        }

        // case 4
        if ((src_fma == interstitialID && snk_fma == cytosolID) && (src_fma2 == cytosolID && snk_fma2 == interstitialID)) {
            var tempID = circlewithlineg.length;
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

            var linegtext = lineg.append("g").data([{x: xvalue - textWidth - 10 + width, y: yvalueb + 5}]);
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
                .text(textvalue);

            var linegcircle = lineg.append("g").data([{x: cxvalue + width, y: cyvalueb}]);
            circlewithlineg[i] = linegcircle.append("circle")
                .attr("id", function (d) {
                    return [
                        source_name, source_name2,
                        textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                        src_fma, src_fma2, snk_fma, snk_fma2
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
                .attr("cursor", "move");

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
                    .text(textvalue2);
            }

            // increment y-axis of line and circle
            yvalueb += ydistance;
            cyvalueb += ydistance;
        }

        // case 5
        if ((src_fma == interstitialID && snk_fma == cytosolID) && (src_fma2 == "channel" && snk_fma2 == "channel")) {
            var tempID = circlewithlineg.length;
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

            // Polygon
            circlewithlineg[i] = polygong.append("g").append("polygon")
                .attr("transform", "translate(" + (xvalue - 5 + width) + "," + (yvalueb - 30) + ")")
                .attr("id", function (d) {
                    return [
                        source_name, source_name2,
                        textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                        src_fma, src_fma2, snk_fma, snk_fma2
                    ];
                })
                .attr("index", tempID)
                .attr("membrane", basolateralID)
                .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                .attr("fill", "yellow")
                .attr("stroke", "black")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round")
                .attr("cursor", "move");

            var polygontext = polygong.append("g").data([{x: xvalue + 20 - 5 + width, y: yvalueb + 5}]);

            var txt = textvalue.substr(5); // temp solution
            if (txt == "Cl") txt = txt + "-";
            else txt = txt + "+";

            linewithtextg[i] = polygontext.append("text")
                .attr("id", "linewithtextg" + tempID)
                .attr("x", function (d) {
                    dxtext[i] = d.x;
                    return d.x;
                })
                .attr("y", function (d) {
                    dytext[i] = d.y;
                    return d.y;
                })
                .attr("font-size", "12px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text(txt);

            // increment y-axis of line and circle
            yvalueb += ydistance;
            cyvalueb += ydistance;
        }

        // case 6
        if ((src_fma == cytosolID && snk_fma == interstitialID) && (src_fma2 == "channel" && snk_fma2 == "channel")) {
            var tempID = circlewithlineg.length;
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

            // Polygon
            circlewithlineg[i] = polygong.append("g").append("polygon")
                .attr("transform", "translate(" + (xvalue - 5 + width) + "," + (yvalueb - 30) + ")")
                .attr("id", function (d) {
                    return [
                        source_name, source_name2,
                        textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                        src_fma, src_fma2, snk_fma, snk_fma2
                    ];
                })
                .attr("index", tempID)
                .attr("membrane", basolateralID)
                .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                .attr("fill", "yellow")
                .attr("stroke", "black")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round")
                .attr("cursor", "move");

            var polygontext = polygong.append("g").data([{x: xvalue + 20 - 5 + width, y: yvalueb + 5}]);

            var txt = textvalue.substr(5); // temp solution
            if (txt == "Cl") txt = txt + "-";
            else txt = txt + "+";

            linewithtextg[i] = polygontext.append("text")
                .attr("id", "linewithtextg" + tempID)
                .attr("x", function (d) {
                    dxtext[i] = d.x;
                    return d.x;
                })
                .attr("y", function (d) {
                    dytext[i] = d.y;
                    return d.y;
                })
                .attr("font-size", "12px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text(txt);

            // increment y-axis of line and circle
            yvalueb += ydistance;
            cyvalueb += ydistance;
        }

        // paracellular flux: add object ID later
        if (textvalue2 == "diffusive channel") {
            var tempID = circlewithlineg.length;
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
                .text(textvalue);

            var linetextg = lineg.append("g").data([{x: xpvalue + textWidth + 10, y: ypvalue}]);
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

    // Apical membrane
    for (var i = 0; i < apicalMembrane.length; i++) {
        var textvalue = apicalMembrane[i].source_text;
        var textvalue2 = apicalMembrane[i].source_text2;
        var src_fma = apicalMembrane[i].source_fma;
        var src_fma2 = apicalMembrane[i].source_fma2;
        var snk_fma = apicalMembrane[i].sink_fma;
        var snk_fma2 = apicalMembrane[i].sink_fma2;
        var textWidth = getTextWidth(textvalue, 12);

        // TODO: Fix variable names later
        // case 7
        if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == "leak" && snk_fma2 == "leak")) {
            var leakg = newg.append("g").data([{x: xvalue - 5, y: yvalue}]);
            leaklineg[i] = leakg.append("line")
                .attr("id", "leaklineg" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + polygonlineLen;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#end)")
                .attr("cursor", "pointer");

            var leaktextg = leakg.append("g").data([{x: xvalue - polygonlineLen / 2 - 10, y: yvalue + 5}]);

            leaktext[i] = leaktextg.append("text")
                .attr("id", "leaktext" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-size", "12px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text(textvalue);

            // increment y-axis of line and circle
            yvalue += ydistance;
            cyvalue += ydistance;
        }

        // case 8
        if ((src_fma == cytosolID && snk_fma == luminalID) && (src_fma2 == "leak" && snk_fma2 == "leak")) {
            var leakg = newg.append("g").data([{x: xvalue - 5, y: yvalue}]);
            leaklineg[i] = leakg.append("line")
                .attr("id", "leaklineg" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + polygonlineLen;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-start", "url(#start)")
                .attr("cursor", "pointer");

            var leaktextg = leakg.append("g").data([{x: xvalue + polygonlineLen / 2 + 10, y: yvalue + 5}]);

            leaktext[i] = leaktextg.append("text")
                .attr("id", "leaktext" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-size", "12px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text(textvalue);

            // increment y-axis of line and circle
            yvalue += ydistance;
            cyvalue += ydistance;
        }

        // case 9
        if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == "ATP" && snk_fma2 == "ATP")) {
            var polygongATP = newg.append("g").data([{x: xvalue - 5, y: yvalue}]);
            polygonlinegATP[i] = polygongATP.append("line")
                .attr("id", "polygonlinegATP" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + polygonlineLen;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#end)")
                .attr("cursor", "pointer");

            // Polygon
            polygon[i] = polygongATP.append("g").append("polygon")
                .attr("transform", "translate(" + (xvalue - 5) + "," + (yvalue - 30) + ")")
                .attr("id", "polygon" + i)
                .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                .attr("fill", "yellow")
                .attr("stroke", "black")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round")
                .attr("cursor", "move");

            var polygontext = polygongATP.append("g").data([{x: xvalue + 20 - 5, y: yvalue + 5}]);

            var txt = textvalue.substr(5); // temp solution
            if (txt == "Cl") txt = txt + "-";
            else txt = txt + "+";

            polygontextATP[i] = polygontext.append("g").append("text")
                .attr("id", "polygontextATP" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-size", "12px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text(txt);

            // ATP rectangle
            var atprect = polygongATP.append("g").append("rect")
                .attr("transform", "translate(" + (xvalue - 5) + "," + (yvalue) + ")rotate(-45)")
                .attr("id", ATPID)
                .attr("width", 26)
                .attr("height", 26)
                .attr("stroke", "black")
                .attr("strokeWidth", "10px")
                .attr("fill", "white");

            var atptextg = polygongATP.append("g").data([{x: xvalue + 8, y: yvalue + 5}]);
            atprectText[i] = atptextg.append("text")
                .attr("id", "atprectText" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-family", "Times New Roman")
                .attr("font-size", "16px")
                .attr("font-weight", "bold")
                .attr("fill", "red")
                .attr("cursor", "pointer")
                .text("A");

            // increment y-axis of line and circle
            yvalue += ydistance;
            cyvalue += ydistance;
        }

        // case 10
        if ((src_fma == cytosolID && snk_fma == luminalID) && (src_fma2 == "ATP" && snk_fma2 == "ATP")) {
            var polygongATP = newg.append("g").data([{x: xvalue - 5, y: yvalue}]);
            polygonlinegATP[i] = polygongATP.append("line")
                .attr("id", "polygonlinegATP" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + polygonlineLen;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-start", "url(#start)")
                .attr("cursor", "pointer");

            // Polygon
            polygon[i] = polygongATP.append("g").append("polygon")
                .attr("transform", "translate(" + (xvalue - 5) + "," + (yvalue - 30) + ")")
                .attr("id", "polygon" + i)
                .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                .attr("fill", "yellow")
                .attr("stroke", "black")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round")
                .attr("cursor", "move");

            var polygontext = polygongATP.append("g").data([{x: xvalue + 20 - 5, y: yvalue + 5}]);

            var txt = textvalue.substr(5); // temp solution
            if (txt == "Cl") txt = txt + "-";
            else txt = txt + "+";

            polygontextATP[i] = polygontext.append("text")
                .attr("id", "polygontextATP" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-size", "12px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text(txt);

            // ATP rectangle
            var atprect = polygongATP.append("g").append("rect")
                .attr("transform", "translate(" + (xvalue - 5 + polygonlineLen) + "," + (yvalue) + ")rotate(-45)")
                .attr("id", ATPID)
                .attr("width", 26)
                .attr("height", 26)
                .attr("stroke", "black")
                .attr("strokeWidth", "10px")
                .attr("fill", "white");

            var atptextg = polygongATP.append("g").data([{x: xvalue + polygonlineLen + 8, y: yvalue + 5}]);
            atprectText[i] = atptextg.append("text")
                .attr("id", "atprectText" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-family", "Times New Roman")
                .attr("font-size", "16px")
                .attr("font-weight", "bold")
                .attr("fill", "red")
                .attr("cursor", "pointer")
                .text("A");

            // increment y-axis of line and circle
            yvalue += ydistance;
            cyvalue += ydistance;
        }

        // case 11
        if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == "p2y2" && snk_fma2 == "p2y2")) {
            var linegpy = newg.append("g").data([{x: xvalue, y: yvalue}]);
            linewithlinegpy[i] = linegpy.append("g").append("rect")
                .attr("id", "linewithlinegpy" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("width", lineLen)
                .attr("height", 4)
                .attr("stroke", "black")
                .attr("strokeWidth", "12px")
                .attr("fill", "white");

            var linegpy2 = newg.append("g").data([{x: xvalue, y: yvalue + 8}]);
            linewithlinegpy2[i] = linegpy2.append("g").append("rect")
                .attr("id", "linewithlinegpy2" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("width", lineLen)
                .attr("height", 4)
                .attr("stroke", "black")
                .attr("strokeWidth", "12px")
                .attr("fill", "white");

            var linegpy3 = newg.append("g").data([{x: xvalue, y: yvalue + 16}]);
            linewithlinegpy3[i] = linegpy3.append("g").append("rect")
                .attr("id", "linewithlinegpy3" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("width", lineLen)
                .attr("height", 4)
                .attr("stroke", "black")
                .attr("strokeWidth", "12px")
                .attr("fill", "white");

            // increment y-axis of line and circle
            yvalue += ydistance;
            cyvalue += ydistance;
        }

        // case 12
        if ((src_fma == cytosolID && snk_fma == luminalID) && (src_fma2 == "p2y2" && snk_fma2 == "p2y2")) {
            var linegpy = newg.append("g").data([{x: xvalue, y: yvalue}]);
            linewithlinegpy[i] = linegpy.append("g").append("rect")
                .attr("id", "linewithlinegpy" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("width", lineLen)
                .attr("height", 3)
                .attr("stroke", "black")
                .attr("strokeWidth", "12px")
                .attr("fill", "white");

            var linegpy2 = newg.append("g").data([{x: xvalue, y: yvalue + 8}]);
            linewithlinegpy2[i] = linegpy2.append("g").append("rect")
                .attr("id", "linewithlinegpy2" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("width", lineLen)
                .attr("height", 4)
                .attr("stroke", "black")
                .attr("strokeWidth", "12px")
                .attr("fill", "white");

            var linegpy3 = newg.append("g").data([{x: xvalue, y: yvalue + 16}]);
            linewithlinegpy3[i] = linegpy3.append("g").append("rect")
                .attr("id", "linewithlinegpy3" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("width", lineLen)
                .attr("height", 4)
                .attr("stroke", "black")
                .attr("strokeWidth", "12px")
                .attr("fill", "white");

            // increment y-axis of line and circle
            yvalue += ydistance;
            cyvalue += ydistance;
        }
    }

    // Basolateral membrane
    for (var i = 0; i < basolateralMembrane.length; i++) {
        var textvalue = basolateralMembrane[i].source_text;
        var textvalue2 = basolateralMembrane[i].source_text2;
        var src_fma = basolateralMembrane[i].source_fma;
        var src_fma2 = basolateralMembrane[i].source_fma2;
        var snk_fma = basolateralMembrane[i].sink_fma;
        var snk_fma2 = basolateralMembrane[i].sink_fma2;
        var textWidth = getTextWidth(textvalue, 12);

        // TODO: Fix variable names later
        // case 7
        if ((src_fma == interstitialID && snk_fma == cytosolID) && (src_fma2 == "leak" && snk_fma2 == "leak")) {
            var leakgb = newg.append("g").data([{x: xvalue - 5 + width, y: yvalueb}]);
            leaklinegb[i] = leakgb.append("line")
                .attr("id", "leaklinegb" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + polygonlineLen;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-start", "url(#start)")
                .attr("cursor", "pointer");

            var leaktextgb = leakgb.append("g").data([{x: xvalue + polygonlineLen / 2 + 10 + width, y: yvalueb + 5}]);

            leaktextb[i] = leaktextgb.append("text")
                .attr("id", "leaktextb" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-size", "12px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text(textvalue);

            // increment y-axis of line and circle
            yvalueb += ydistanceb;
            cyvalueb += ydistanceb;
        }

        // case 8
        if ((src_fma == cytosolID && snk_fma == interstitialID) && (src_fma2 == "leak" && snk_fma2 == "leak")) {
            var leakgb = newg.append("g").data([{x: xvalue - 5 + width, y: yvalueb}]);
            leaklinegb[i] = leakgb.append("line")
                .attr("id", "leaklinegb" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + polygonlineLen;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#end)")
                .attr("cursor", "pointer");

            var leaktextgb = leakgb.append("g").data([{x: xvalue - polygonlineLen / 2 - 10 + width, y: yvalueb + 5}]);

            leaktextb[i] = leaktextgb.append("text")
                .attr("id", "leaktextb" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-size", "12px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text(textvalue);

            // increment y-axis of line and circle
            yvalueb += ydistanceb;
            cyvalueb += ydistanceb;
        }

        // case 9
        if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == "ATP" && snk_fma2 == "ATP")) {
            var polygongATPb = newg.append("g").data([{x: xvalue - 5 + width, y: yvalue}]);
            polygonlinegATPb[i] = polygongATPb.append("line")
                .attr("id", "polygonlinegATP" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + polygonlineLen;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#end)")
                .attr("cursor", "pointer");

            // Polygon
            polygon[i] = polygongATPb.append("g").append("polygon")
                .attr("transform", "translate(" + (xvalue - 5 + width) + "," + (yvalue - 30) + ")")
                .attr("id", "polygon" + i)
                .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                .attr("fill", "yellow")
                .attr("stroke", "black")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round")
                .attr("cursor", "move");

            var polygontext = polygongATPb.append("g").data([{x: xvalue + 20 - 5 + width, y: yvalue + 5}]);

            var txt = textvalue.substr(5); // temp solution
            if (txt == "Cl") txt = txt + "-";
            else txt = txt + "+";

            polygontextATPb[i] = polygontext.append("g").append("text")
                .attr("id", "polygontextATPb" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-size", "12px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text(txt);

            // ATP rectangle
            var atprect = polygongATPb.append("g").append("rect")
                .attr("transform", "translate(" + (xvalue - 5 + width) + "," + (yvalue) + ")rotate(-45)")
                .attr("id", ATPID)
                .attr("width", 26)
                .attr("height", 26)
                .attr("stroke", "black")
                .attr("strokeWidth", "10px")
                .attr("fill", "white");

            var atptextg = polygongATPb.append("g").data([{x: xvalue + 8 + width, y: yvalue + 5}]);
            atprectTextb[i] = atptextg.append("text")
                .attr("id", "atprectTextb" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-family", "Times New Roman")
                .attr("font-size", "16px")
                .attr("font-weight", "bold")
                .attr("fill", "red")
                .attr("cursor", "pointer")
                .text("A");

            // increment y-axis of line and circle
            yvalue += ydistance;
            cyvalue += ydistance;
        }

        // case 10
        if ((src_fma == cytosolID && snk_fma == luminalID) && (src_fma2 == "ATP" && snk_fma2 == "ATP")) {
            var polygongATPb = newg.append("g").data([{x: xvalue - 5 + width, y: yvalue}]);
            polygonlinegATPb[i] = polygongATPb.append("line")
                .attr("id", "polygonlinegATPb" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + polygonlineLen;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-start", "url(#start)")
                .attr("cursor", "pointer");

            // Polygon
            polygon[i] = polygongATPb.append("g").append("polygon")
                .attr("transform", "translate(" + (xvalue - 5 + width) + "," + (yvalue - 30) + ")")
                .attr("id", "polygon" + i)
                .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                .attr("fill", "yellow")
                .attr("stroke", "black")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round")
                .attr("cursor", "move");

            var polygontext = polygongATPb.append("g").data([{x: xvalue + 20 - 5 + width, y: yvalue + 5}]);

            var txt = textvalue.substr(5); // temp solution
            if (txt == "Cl") txt = txt + "-";
            else txt = txt + "+";

            polygontextATPb[i] = polygontext.append("text")
                .attr("id", "polygontextATPb" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-size", "12px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text(txt);

            // ATP rectangle
            var atprect = polygongATPb.append("g").append("rect")
                .attr("transform", "translate(" + (xvalue - 5 + polygonlineLen + width) + "," + (yvalue) + ")rotate(-45)")
                .attr("id", ATPID)
                .attr("width", 26)
                .attr("height", 26)
                .attr("stroke", "black")
                .attr("strokeWidth", "10px")
                .attr("fill", "white");

            var atptextg = polygongATPb.append("g").data([{x: xvalue + polygonlineLen + 8 + width, y: yvalue + 5}]);
            atprectTextb[i] = atptextg.append("text")
                .attr("id", "atprectTextb" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("font-family", "Times New Roman")
                .attr("font-size", "16px")
                .attr("font-weight", "bold")
                .attr("fill", "red")
                .attr("cursor", "pointer")
                .text("A");

            // increment y-axis of line and circle
            yvalue += ydistance;
            cyvalue += ydistance;
        }

        // case 11
        if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == "p2y2" && snk_fma2 == "p2y2")) {
            var linegpyb = newg.append("g").data([{x: xvalue, y: yvalue}]);
            linewithlinegpyb[i] = linegpyb.append("g").append("rect")
                .attr("id", "linewithlinegpyb" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("width", lineLen)
                .attr("height", 4)
                .attr("stroke", "black")
                .attr("strokeWidth", "12px")
                .attr("fill", "white");

            var linegpy2b = newg.append("g").data([{x: xvalue, y: yvalue + 8}]);
            linewithlinegpy2b[i] = linegpy2b.append("g").append("rect")
                .attr("id", "linewithlinegpy2b" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("width", lineLen)
                .attr("height", 4)
                .attr("stroke", "black")
                .attr("strokeWidth", "12px")
                .attr("fill", "white");

            var linegpy3b = newg.append("g").data([{x: xvalue, y: yvalue + 16}]);
            linewithlinegpy3b[i] = linegpy3b.append("g").append("rect")
                .attr("id", "linewithlinegpy3b" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("width", lineLen)
                .attr("height", 4)
                .attr("stroke", "black")
                .attr("strokeWidth", "12px")
                .attr("fill", "white");

            // increment y-axis of line and circle
            yvalue += ydistance;
            cyvalue += ydistance;
        }

        // case 12
        if ((src_fma == cytosolID && snk_fma == luminalID) && (src_fma2 == "p2y2" && snk_fma2 == "p2y2")) {
            var linegpyb = newg.append("g").data([{x: xvalue, y: yvalue}]);
            linewithlinegpyb[i] = linegpyb.append("g").append("rect")
                .attr("id", "linewithlinegpyb" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("width", lineLen)
                .attr("height", 3)
                .attr("stroke", "black")
                .attr("strokeWidth", "12px")
                .attr("fill", "white");

            var linegpy2b = newg.append("g").data([{x: xvalue, y: yvalue + 8}]);
            linewithlinegpy2b[i] = linegpy2b.append("g").append("rect")
                .attr("id", "linewithlinegpy2b" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("width", lineLen)
                .attr("height", 4)
                .attr("stroke", "black")
                .attr("strokeWidth", "12px")
                .attr("fill", "white");

            var linegpy3b = newg.append("g").data([{x: xvalue, y: yvalue + 16}]);
            linewithlinegpy3b[i] = linegpy3b.append("g").append("rect")
                .attr("id", "linewithlinegpy3b" + i)
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
                .attr("width", lineLen)
                .attr("height", 4)
                .attr("stroke", "black")
                .attr("strokeWidth", "12px")
                .attr("fill", "white");

            // increment y-axis of line and circle
            yvalue += ydistance;
            cyvalue += ydistance;
        }
    }

    // Change marker direction and text position
    var state = 0;
    document.addEventListener('click', function (event) {
        if (event.srcElement.localName == "line" && event.srcElement.nodeName == "line") {

            // marker direction
            var id = event.srcElement.id;
            markerDir(id);

            // text position
            var idText = event.srcElement.nextSibling.firstChild.id;
            var textContent = event.srcElement.nextSibling.firstChild.innerHTML;
            var textWidth = getTextWidth(textContent, 12);
            if (state == 0) {
                d3.select("#" + idText + "")
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .attr("x", event.srcElement.x1.baseVal.value - textWidth - 10)
                    .attr("y", event.srcElement.y1.baseVal.value + 5);

                state = 1;
            }
            else {
                d3.select("#" + idText + "")
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .attr("x", event.srcElement.x1.baseVal.value + textWidth + 20)
                    .attr("y", event.srcElement.y1.baseVal.value + 5);

                state = 0;
            }
        }
    })

    var initdragcircleandend = function () {
        var membrane = cthis.getAttribute("membrane");
        line = document.getElementsByTagName("line");

        for (var i = 0; i < document.getElementsByTagName("line").length; i++) {
            if (line[i].id == membrane && i == 0) {
                mindex = 1;
                break;
            }
            if (line[i].id == membrane && i == 1) {
                mindex = 0;
                break;
            }
        }

        // console.log("membrane, mindex: ", membrane, mindex);
    }

    function dragcircleline(d) {
        // console.log("this: ", this);
        // console.log("d3.select(this): ", d3.select(this));
        icircleGlobal = this.getAttribute("index");

        cthis = this;

        // console.log("index: ", icircleGlobal);

        var dx = d3.event.dx;
        var dy = d3.event.dy;

        if (this.tagName == "circle") {
            d3.select(this)
                .attr("cx", parseFloat(this.cx.baseVal.value) + dx)
                .attr("cy", parseFloat(this.cy.baseVal.value) + dy);
        }

        if (this.tagName == "text") {
            circlewithlineg[icircleGlobal] // text
                .attr("x", parseFloat(d3.select("#" + "linewithtextg" + icircleGlobal).attr("x")) + dx)
                .attr("y", parseFloat(d3.select("#" + "linewithtextg" + icircleGlobal).attr("y")) + dy);
        }

        if (this.tagName == "polygon") {
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

        initdragcircleandend();
        // If paracellular's diffusive channel Then undefined
        if (line[mindex] != undefined && this.cx != undefined) {
            // detect basolateralMembrane - 0 apical, 1 basolateralMembrane, 3 cell junction
            var lineb_x = line[mindex].x1.baseVal.value;
            var lineb_y1 = line[mindex].y1.baseVal.value;
            var lineb_y2 = line[mindex].y2.baseVal.value;
            var cx = this.cx.baseVal.value;
            var cy = this.cy.baseVal.value;
            var lineb_id = line[mindex].id;
            var circle_id = this.id;

            if ((cx >= lineb_x && cx <= lineb_x + 1) &&
                (cy >= lineb_y1 && cy <= lineb_y2) && (lineb_id != circle_id)) {
                document.getElementsByTagName("line")[mindex].style.setProperty("stroke", "red");

                var tempYvalue;
                if (mindex == 1) tempYvalue = yvalueb;
                else tempYvalue = yvalue;

                if ((cx >= lineb_x && cx <= lineb_x + 5) &&
                    (cy >= (tempYvalue + radius) && cy <= (tempYvalue + radius + 5)) && (lineb_id != circle_id)) {
                    document.getElementsByTagName("line")[mindex].style.setProperty("stroke", "yellow");
                }
            }
            else {
                if (mindex == 1)
                    document.getElementsByTagName("line")[mindex].style.setProperty("stroke", "orange");
                else
                    document.getElementsByTagName("line")[mindex].style.setProperty("stroke", "green");
            }
        }
    }

    function dragcircleendline(d) {
        // d3.select(this).classed("dragging", false);
        initdragcircleandend();
        // If paracellular's diffusive channel Then undefined
        if (line[mindex] != undefined && this.cx != undefined) {
            // detect basolateralMembrane - 0 apical, 1 basolateralMembrane, 3 cell junction
            var lineb_x = line[mindex].x1.baseVal.value;
            var lineb_y1 = line[mindex].y1.baseVal.value;
            var lineb_y2 = line[mindex].y2.baseVal.value;
            var cx = cthis.cx.baseVal.value;
            var cy = cthis.cy.baseVal.value;
            var lineb_id = line[mindex].id;
            var circle_id = cthis.id;

            if ((cx >= lineb_x && cx <= lineb_x + 1) &&
                (cy >= lineb_y1 && cy <= lineb_y2) && (lineb_id != circle_id)) {

                var tempYvalue;
                if (mindex == 1) tempYvalue = yvalueb;
                else tempYvalue = yvalue;

                if ((cx >= lineb_x && cx <= lineb_x + 5) &&
                    (cy >= (tempYvalue + radius) && cy <= (tempYvalue + radius + 5)) && (lineb_id != circle_id)) {

                    document.getElementsByTagName("line")[mindex].style.setProperty("stroke", "yellow");

                    var m = new Modal({
                        id: 'myModal',
                        header: 'Recommender System',
                        footer: 'My footer',
                        footerCloseButton: 'Close',
                        footerSaveButton: 'Save'
                    });

                    m.getBody().html('<div id="modalBody"></div>');
                    m.show();

                    // $('#myModal').on('shown.bs.modal', function () {

                    var circleID = cthis.getAttribute("id").split(",");
                    console.log("circleID: ", circleID);

                    // parsing
                    cellmlModel = circleID[0];
                    var indexOfHash = cellmlModel.search("#");
                    cellmlModel = cellmlModel.slice(0, indexOfHash);

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
                        var query = 'SELECT ?Protein ?Biological_meaning ?Biological_meaning2 ?Species ?Gene ' +
                            'WHERE { GRAPH ?g { ' +
                            '<' + cellmlModel + '#Protein> <http://purl.org/dc/terms/description> ?Protein . ' +
                            '<' + circleID[0] + '> <http://purl.org/dc/terms/description> ?Biological_meaning . ' +
                            '<' + cellmlModel + '#Species> <http://purl.org/dc/terms/description> ?Species . ' +
                            '<' + cellmlModel + '#Gene> <http://purl.org/dc/terms/description> ?Gene . ' +
                            '}}'
                    }

                    // protein name
                    sendPostRequest(
                        endpoint,
                        query,
                        function (jsonModel) {

                            console.log("jsonModel: ", jsonModel);

                            proteinName = jsonModel.results.bindings[0].Protein.value;
                            biological_meaning = jsonModel.results.bindings[0].Biological_meaning.value;

                            if (circleID[1] != "")
                                biological_meaning2 = jsonModel.results.bindings[0].Biological_meaning2.value;
                            else
                                biological_meaning2 = "";

                            speciesName = jsonModel.results.bindings[0].Species.value;
                            geneName = jsonModel.results.bindings[0].Gene.value;

                            console.log("protein, species, gene: ", proteinName, speciesName, geneName);

                            var query = 'SELECT ?cellmlmodel ' +
                                'WHERE { GRAPH ?g { ' +
                                '?cellmlmodel <http://purl.org/dc/terms/description> "' + proteinName + '". ' +
                                '}}'

                            sendPostRequest(
                                endpoint,
                                query,
                                function (jsonCellmlModel) {

                                    console.log("jsonCellmlModel: ", jsonCellmlModel);

                                    var query = 'SELECT ?located_in ' +
                                        'WHERE { GRAPH ?g { ' +
                                        '<' + cellmlModel + '#located_in> <http://www.obofoundry.org/ro/ro.owl#located_in> ?located_in . ' +
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
                                                        cthis.getAttribute("membrane")
                                                    );

                                                }, true);
                                        }, true);
                                }, true);
                        }, true);
                    // });

                    jQuery(window).trigger('resize');
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
                    document.getElementsByTagName("line")[mindex].style.setProperty("stroke", "orange");
                else
                    document.getElementsByTagName("line")[mindex].style.setProperty("stroke", "green");
            }
        }
    }

    function dragcircleunchecked(d) {
        d3.select(this).classed("dragging", false);
    }

    // related kidney, lungs, etc model
    var relatedCellmlModel = function (relatedModel, alternativeCellmlArray, membrane) {
        var query = 'SELECT ?Protein ?workspaceName ' +
            'WHERE { GRAPH ?workspaceName { ' +
            '<' + relatedModel[idProtein] + '#Protein> <http://purl.org/dc/terms/description> ?Protein . ' +
            '}}'

        sendPostRequest(
            endpoint,
            query,
            function (jsonProtein) {
                if (jsonProtein.results.bindings.length != 0) {
                    relatedModelValue.push(jsonProtein.results.bindings[0].Protein.value);
                    relatedModelID.push(relatedModel[idProtein]);
                    workspaceName = jsonProtein.results.bindings[0].workspaceName.value;
                }

                idProtein++;

                if (idProtein == relatedModel.length) {
                    idProtein = 0;
                    alternativeCellmlModel(alternativeCellmlArray, membrane);
                    return;
                }

                relatedCellmlModel(relatedModel, alternativeCellmlArray, membrane);

            }, true);
    }

    // alternative model of a dragged transporter, e.g. rat NHE3, mouse NHE3
    var alternativeCellmlModel = function (alternativeCellmlArray, membrane) {

        var query = 'SELECT ?Protein ?URI ?workspaceName ' +
            'WHERE { GRAPH ?workspaceName { ' +
            '<' + alternativeCellmlArray[idAltProtein] + '#Protein> <http://purl.org/dc/terms/description> ?Protein . ' +
            '<' + alternativeCellmlArray[idAltProtein] + '#Protein> <http://www.obofoundry.org/ro/ro.owl#hasPhysicalDefinition> ?URI . ' +
            '}}'

        sendPostRequest(
            endpoint,
            query,
            function (jsonAltProtein) {

                // console.log("jsonAltProtein OUTSIDE: ", jsonAltProtein);
                var flagvar = true;

                if (jsonAltProtein.results.bindings.length != 0) {
                    if (jsonAltProtein.results.bindings[0].Protein.value == proteinName) {

                        // console.log("jsonAltProtein INSIDE: ", jsonAltProtein);
                        flagvar = false;

                        var callOLS = function () {

                            // console.log("jsonAltProtein INSIDE callOLS: ", jsonAltProtein);

                            workspaceName = jsonAltProtein.results.bindings[0].workspaceName.value;
                            var URI = jsonAltProtein.results.bindings[0].URI.value;
                            var workspaceURI = workspaceName + "/" + "rawfile" + "/" + "HEAD" + "/" + alternativeCellmlArray[idAltProtein];

                            var endpointOLS = "http://www.ebi.ac.uk/ols/api/ontologies/pr/terms?iri=" + URI;

                            sendGetRequest(
                                endpointOLS,
                                function (jsonOLSObj) {
                                    var label = document.createElement('label');
                                    label.innerHTML = '<br><input id="' + alternativeCellmlArray[idAltProtein] + '" type="checkbox" ' +
                                        'value="' + alternativeCellmlArray[idAltProtein] + '">' +
                                        '<a href="' + workspaceURI + '" target="_blank"> ' + jsonOLSObj._embedded.terms[0].label + '</a></label>';

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
        var query = 'SELECT ?cellmlmodel ?located_in ' +
            'WHERE { GRAPH ?g { ' +
            '?cellmlmodel <http://www.obofoundry.org/ro/ro.owl#located_in> <' + membrane + '>. ' +
            '}}'

        sendPostRequest(
            endpoint,
            query,
            function (jsonRelatedMembrane) {

                console.log("jsonRelatedMembrane: ", jsonRelatedMembrane);

                for (var i = 0; i < jsonRelatedMembrane.results.bindings.length; i++) {
                    for (var j = 0; j < organ[organIndex].key.length; j++) {
                        // parsing
                        var kModel = jsonRelatedMembrane.results.bindings[i].cellmlmodel.value;
                        var indexOfHash = kModel.search("#");
                        kModel = kModel.slice(0, indexOfHash);

                        membraneModel.push(kModel);

                        break;
                    }
                }

                membraneModel = uniqueify(membraneModel);
                // console.log("membraneModel: ", membraneModel);

                relatedMembraneModel(workspaceName, membraneName);

            }, true);
    }

    var relatedMembraneModel = function (workspaceName, membraneName) {
        var query = 'SELECT ?Protein ' +
            'WHERE { GRAPH ?g { ' +
            '<' + membraneModel[idMembrane] + '#Protein> <http://purl.org/dc/terms/description> ?Protein . ' +
            '}}'

        sendPostRequest(
            endpoint,
            query,
            function (jsonRelatedMembraneModel) {

                console.log("jsonRelatedMembraneModel: ", jsonRelatedMembraneModel);

                // TODO: membraneModel[idMembrane] has cellml model name without component and
                // TODO: variable name which can not make an object similar to membrane in index.js.
                // TODO: find out how to integrate this: membraneModel[idMembrane]#component.variable
                var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                    'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
                    'SELECT ?source_fma ?sink_fma ?med_entity_uri ' +
                    'WHERE { ' +
                    '<' + source_name + '> semsim:isComputationalComponentFor ?model_prop. ' +
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
                            membraneModelValue.push(jsonRelatedMembraneModel.results.bindings[0].Protein.value);
                            // membraneModeID.push(membraneModel[idMembrane]);

                            membraneObject.push({
                                source_fma: jsonObjFlux.results.bindings[0].source_fma.value,
                                sink_fma: jsonObjFlux.results.bindings[0].sink_fma.value,
                                med_fma: jsonObjFlux.results.bindings[0].med_entity_uri.value,
                            });

                            membraneModelID.push([
                                jsonObjFlux.results.bindings[0].source_fma.value,
                                jsonObjFlux.results.bindings[0].sink_fma.value,
                                jsonObjFlux.results.bindings[0].med_entity_uri.value
                            ]);
                        }

                        console.log("membraneObject: ", membraneObject);
                        console.log("idMembrane: ", idMembrane);
                        console.log("membraneModel.length: ", membraneModel.length);
                        console.log("membraneModelID: ", membraneModelID);

                        idMembrane++;

                        if (idMembrane == membraneModel.length) {
                            idMembrane = 0;

                            var msg = "<p><b>Would you like to move?</b><\p>";
                            var msg2 = "<p><b>" + proteinName + "</b> is a <b>" + typeOfModel + "</b> model. It is located in " +
                                "<b>" + loc + "</b><\p>";

                            var model = "<p><b>Model: </b>" + cellmlModel + "</p>";
                            var biological = "<p><b>Biological Meaning: </b>" + biological_meaning + "</p>";

                            if (biological_meaning2 != "")
                                biological += "<p>" + biological_meaning2 + "</p>";

                            var species = "<p><b>Species: </b>" + speciesName + "</p>";
                            var gene = "<p><b>Gene: </b>" + geneName + "</p>";
                            var protein = "<p><b>Protein: </b>" + proteinName + "</p>";

                            // Related apical or basolateral model
                            var membraneTransporter = "<p><b>" + membraneName + " model</b>";
                            if (membraneModelValue.length == 0) {
                                membraneTransporter += "<br>Not Exist";
                            }
                            else {
                                for (var i = 0; i < membraneModelValue.length; i++) {
                                    var label = document.createElement('label');
                                    label.innerHTML = '<br><input id="' + membraneModelID[i] + '" type="checkbox" ' +
                                        'value="' + membraneModelValue[i] + '"> ' + membraneModelValue[i] + '</label>';

                                    membraneTransporter += label.innerHTML;
                                }
                            }

                            // Alternative model
                            var alternativeModel = "<p><b>Alternative model of " + proteinName + "</b>";
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

                                    if (proteinName == relatedModelValue[i])
                                        continue;

                                    var workspaceURI = workspaceName + "/" + "rawfile" + "/" + "HEAD" + "/" + relatedModelID[i];

                                    var label = document.createElement('label');
                                    label.innerHTML = '<br><a href="' + workspaceURI + '" target="_blank"> ' + relatedModelValue[i] + '</a></label>';

                                    relatedOrganModels += label.innerHTML;
                                }
                            }

                            $('#modalBody')
                                .append(msg)
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

                            return;
                        }

                        relatedMembraneModel(workspaceName, membraneName);

                    }, true);
            }, true);
    }

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

        // TODO: Polygon move back
        circlewithlineg[icircleGlobal]
            .transition()
            .delay(1000)
            .duration(1000)
            .attr("cx", dx[icircleGlobal])
            .attr("cy", dy[icircleGlobal]);

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

    var membraneColorBack = function () {
        var membrane = cthis.getAttribute("membrane");
        line = document.getElementsByTagName("line");
        for (var i = 0; i < document.getElementsByTagName("line").length; i++) {
            if (line[i].id == membrane && i == 0) {
                linebasolateral
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .style("stroke", "orange");

                yvalueb += ydistance;
                break;
            }

            if (line[i].id == membrane && i == 1) {
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

            if ($this.options.header) {
                win.append('<div class="modal-header"><h4 class="modal-title" lang="de"></h4></div>');

                if ($this.options.closeButton) {
                    win.find('.modal-header').prepend('<button type="button" class="close" data-dismiss="modal">&times;</button>');
                }
            }

            win.append('<div class="modal-body"></div>');
            if ($this.options.footer) {
                win.append('<div class="modal-footer"></div>');

                if ($this.options.footerCloseButton) {
                    win.find('.modal-footer').append('<a data-dismiss="modal" href="#" class="btn btn-default" lang="de">' + $this.options.footerCloseButton + '</a>');
                }

                if ($this.options.footerSaveButton) {
                    win.find('.modal-footer').append('<a data-dismiss="modal" href="#" class="btn btn-default" lang="de">' + $this.options.footerSaveButton + '</a>');
                }
            }

            // close button clicked!!
            win[0].lastElementChild.children[0].onclick = function (event) {
                moveBack();
                membraneColorBack();
            }

            // save button clicked!!
            win[0].lastElementChild.children[1].onclick = function (event) {

                console.log("save clicked!");
                console.log("cthis: ", cthis);

                // checkbox!!
                for (var i = 0; i < win[0].children[1].children[0].children[12].getElementsByTagName("input").length; i++) {
                    if (win[0].children[1].children[0].children[12].getElementsByTagName("input")[i].checked) {

                        console.log("Basolateral or apical model clicked!!");

                        console.log("checked: ", win[0].children[1].children[0].children[12].getElementsByTagName("input")[i].checked);
                        console.log("id CHECKBOX: ", win[0].children[1].children[0].children[12].getElementsByTagName("input")[i].id);
                        cthis.id = win[0].children[1].children[0].children[12].getElementsByTagName("input")[i].id;
                        console.log("cthis AFTER: ", cthis);
                        console.log("id CHECKBOX: ", win[0].children[1].children[0].children[12].getElementsByTagName("input")[i].id);
                    }
                }

                // checkbox!!
                for (var i = 0; i < win[0].children[1].children[0].children[13].getElementsByTagName("input").length; i++) {
                    if (win[0].children[1].children[0].children[13].getElementsByTagName("input")[i].checked) {

                        console.log("Alternative model clicked!!");

                        console.log("checked: ", win[0].children[1].children[0].children[13].getElementsByTagName("input")[i].checked);
                        console.log("id: ", win[0].children[1].children[0].children[13].getElementsByTagName("input")[i].id);
                    }
                }

                // checkbox!!
                for (var i = 0; i < win[0].children[1].children[0].children[14].getElementsByTagName("input").length; i++) {
                    if (win[0].children[1].children[0].children[14].getElementsByTagName("input")[i].checked) {

                        console.log("Related cellml model clicked!!");

                        console.log("checked: ", win[0].children[1].children[0].children[14].getElementsByTagName("input")[i].checked);
                        console.log("id: ", win[0].children[1].children[0].children[14].getElementsByTagName("input")[i].id);
                    }
                }

                membraneColorBack();

                var index = d3.select(cthis)._groups[0][0].attributes[1].value;
                var stylefill = d3.select(cthis)._groups[0][0].attributes[6].value;

                if (stylefill == "lightgreen")
                    circlewithlineg[index].transition().delay(1000).duration(1000).style("fill", "orange");
                else
                    circlewithlineg[index].transition().delay(1000).duration(1000).style("fill", "lightgreen");

                // Reinitialise to store fluxes/models in next iteration
                membraneModelValue = [];
                altCellmlModel = "";
                relatedModelValue = [];
            }
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
    function markerDir(selection) {
        console.log("selection: ", selection);

        var mstart = d3.select("#" + selection + "")
            ._groups[0][0]
            .getAttribute("marker-start");

        var mend = d3.select("#" + selection + "")
            ._groups[0][0]
            .getAttribute("marker-end");

        if (mstart == "") {
            d3.select("#" + selection + "")
                .attr("marker-start", "url(#start)")
                .attr("marker-end", "");
        }
        else {
            d3.select("#" + selection + "")
                .attr("marker-end", "url(#end)")
                .attr("marker-start", "");
        }

        if (mend == "") {
            d3.select("#" + selection + "")
                .attr("marker-end", "url(#end)")
                .attr("marker-start", "");
        }
        else {
            d3.select("#" + selection + "")
                .attr("marker-start", "url(#start)")
                .attr("marker-end", "");
        }
    }
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
    var g = document.getElementById("#svgVisualize2"),
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

    var viewList = document.getElementById("viewList");

    for (var i = 0; i < jsonObj.head.vars.length; i++) {
        var divHead = document.createElement("div");
        divHead.className = "h2";

        var divText = document.createElement("div");
        divText.className = "p";

        divHead.appendChild(document.createTextNode(jsonObj.head.vars[i]));
        divHead.appendChild(document.createElement("hr"));
        viewList.appendChild(divHead);

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
                    divText.appendChild(aText);
            }
            else {
                tempArray.push(tempValue);
                if (searchFn(tempValue, tempArray) <= 1)
                    divText.appendChild(document.createTextNode(tempValue));
            }

            viewList.appendChild(divText);

            var divText = document.createElement("div");
            divText.className = "p";
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
var uniqueifyModelEntity = __webpack_require__(0).uniqueifyModelEntity;
var uniqueifyEpithelial = __webpack_require__(0).uniqueifyEpithelial;
var uniqueifySrcSnkMed = __webpack_require__(0).uniqueifySrcSnkMed;
var iteration = __webpack_require__(0).iteration;
var showView = __webpack_require__(4).showView;
var showSVGModelHtml = __webpack_require__(3).showSVGModelHtml;
var showsvgEpithelial = __webpack_require__(2).showsvgEpithelial;

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

    // Convenience function for inserting innerHTML for 'select'
    var insertHtml = function (selector, html) {
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    // Show loading icon inside element identified by 'selector'.
    var showLoading = function (selector) {
        var html = "<div class='text-center'>";
        html += "<img src='img/ajax-loader.gif'></div>";
        insertHtml(selector, html);
    };

    // Find the current active menu button
    var activeMenu = function () {
        var classes = document.querySelector("#ulistItems");
        for (var i = 0; i < classes.getElementsByTagName("li").length; i++) {
            if (classes.getElementsByTagName("li")[i].className === "active")
                return classes.getElementsByTagName("li")[i].id;
        }
    };

    // Remove the class 'active' from source to target button
    var switchMenuToActive = function (source, target) {
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

    mainUtils.loadHomeHtml = function () {
        // Switch from current active button to home button
        var activeItem = "#" + activeMenu();
        switchMenuToActive(activeItem, "#listHome");

        insertHtml("#main-content", "... Home Page !!!");
    };

    mainUtils.loadHelp = function () {
        // Switch from current active button to home button
        var activeItem = "#" + activeMenu();
        switchMenuToActive(activeItem, "#help");

        insertHtml("#main-content", "... Help Page !!!");
    };

    // On page load (before img or CSS)
    document.addEventListener("DOMContentLoaded", function (event) {
        // Place some startup code here
    });

    // Event handling for SEARCH, MODEL
    var actions = {
        search: function (event) {

            console.log("search event: ", event);

            if (event.srcElement.className == "checkbox") {

                if (event.srcElement.checked) {
                    var idWithStr = event.srcElement.id;
                    var index = idWithStr.search("#");
                    var workspaceName = idWithStr.slice(0, index);

                    mainUtils.workspaceName = workspaceName;

                    modelEntityName = idWithStr;
                }
                else {
                    mainUtils.workspaceName = "";
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

                // mainUtils.workspaceName.push(workspaceName);
                mainUtils.workspaceName = workspaceName;
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

    // Load search html
    mainUtils.loadSearchHtml = function () {

        if (!sessionStorage.getItem("searchListContent")) {
            sendGetRequest(
                searchHtml,
                function (searchHtmlContent) {
                    insertHtml("#main-content", searchHtmlContent);
                },
                false);

        }
        else {
            insertHtml("#main-content", sessionStorage.getItem('searchListContent'));
        }

        // Switch from current active button to discovery button
        var activeItem = "#" + activeMenu();
        switchMenuToActive(activeItem, "#listDiscovery");
    };

    // Event invocation to SEARCH, MODEL
    document.addEventListener('click', function (event) {

        console.log("event: ", event);
        // If there's an action with the given name, call it
        if (typeof actions[event.srcElement.dataset.action] === "function") {
            actions[event.srcElement.dataset.action].call(this, event);
        }
    })

    // semantic annotation based on search items
    document.addEventListener('keydown', function (event) {
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
                    "chebi": "<http://identifiers.org/chebi/CHEBI:26708>"
                },
                {
                    "key1": "flux", "key2": "hydrogen",
                    "opb": "<http://identifiers.org/opb/OPB_00593>",
                    "chebi": "<http://identifiers.org/chebi/CHEBI:49637>"
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
                    "chebi": "<http://identifiers.org/chebi/CHEBI:26216>"
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
                    "chebi": "<http://identifiers.org/chebi/CHEBI:26708>"
                },
                {
                    "key1": "concentration", "key2": "hydrogen",
                    "opb": "<http://identifiers.org/opb/OPB_00340>",
                    "chebi": "<http://identifiers.org/chebi/CHEBI:49637>"
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
                    "chebi": "<http://identifiers.org/chebi/CHEBI:26216>"
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
    })

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
                    'SELECT ?Model_entity ?Biological_meaning ' +
                    'WHERE { ' +
                    '?entity semsim:hasPhysicalDefinition ' + uriCHEBI + '. ' +
                    '?source semsim:hasPhysicalEntityReference ?entity. ' +
                    '?process semsim:hasSourceParticipant ?source. ' +
                    '?property semsim:physicalPropertyOf ?process. ' +
                    '?Model_entity semsim:isComputationalComponentFor ?property. ' +
                    '?Model_entity dcterms:description ?Biological_meaning.' +
                    '}'
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

                var model = parseModelName(jsonModel.results.bindings[id].Model_entity.value);
                var query = 'SELECT ?Species ' + 'WHERE ' +
                    '{ ' + '<' + model + '#Species> <http://purl.org/dc/terms/description> ?Species.' + '}';

                // Species
                sendPostRequest(
                    endpoint,
                    query,
                    function (jsonSpecies) {

                        var model = parseModelName(jsonModel.results.bindings[id].Model_entity.value);
                        var query = 'SELECT ?Gene ' + 'WHERE ' +
                            '{ ' + '<' + model + '#Gene> <http://purl.org/dc/terms/description> ?Gene.' + '}';

                        // Gene
                        sendPostRequest(
                            endpoint,
                            query,
                            function (jsonGene) {

                                var model = parseModelName(jsonModel.results.bindings[id].Model_entity.value);
                                var query = 'SELECT ?Protein ' + 'WHERE ' +
                                    '{ ' + '<' + model + '#Protein> <http://purl.org/dc/terms/description> ?Protein.' + '}';

                                // Protein
                                sendPostRequest(
                                    endpoint,
                                    query,
                                    function (jsonProtein) {

                                        // model and biological meaning
                                        modelEntity.push(jsonModel.results.bindings[id].Model_entity.value);
                                        biologicalMeaning.push(jsonModel.results.bindings[id].Biological_meaning.value);

                                        // species
                                        if (jsonSpecies.results.bindings.length == 0)
                                            speciesList.push("Undefined");
                                        else
                                            speciesList.push(jsonSpecies.results.bindings[0].Species.value);

                                        // gene
                                        if (jsonGene.results.bindings.length == 0)
                                            geneList.push("Undefined");
                                        else
                                            geneList.push(jsonGene.results.bindings[0].Gene.value);

                                        // protein
                                        if (jsonProtein.results.bindings.length == 0)
                                            proteinList.push("Undefined");
                                        else
                                            proteinList.push(jsonProtein.results.bindings[0].Protein.value);

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
            true
        );
    }

    // TODO: make a common table platform for all functions
    // Show semantic annotation extracted from PMR
    mainUtils.showDiscoverModels = function (head, modelEntity, biologicalMeaning, speciesList, geneList, proteinList) {

        var searchList = document.getElementById("searchList");

        // Search result does not match
        if (head.length == 0) {
            searchList.innerHTML = "<section class='container-fluid'><label><br>No Search Results!</label></section>";
            return;
        }

        // Make empty space for a new search
        searchList.innerHTML = "";

        var table = document.createElement("table");
        table.className = "table table-hover table-condensed"; //table-bordered table-striped

        // Table header
        var thead = document.createElement("thead");
        var tr = document.createElement("tr");
        for (var i = 0; i < head.length; i++) {
            // Empty header for checkbox column
            if (i == 0) {
                var th = document.createElement("th");
                th.appendChild(document.createTextNode(""));
                tr.appendChild(th);
            }

            var th = document.createElement("th");
            th.appendChild(document.createTextNode(head[i]));
            tr.appendChild(th);
        }

        thead.appendChild(tr);
        table.appendChild(thead);

        // Table body
        var tbody = document.createElement("tbody");
        for (var i = 0; i < modelEntity.length; i++) {
            var tr = document.createElement("tr");

            var temp = [];
            var td = [];

            temp.push(modelEntity[i], biologicalMeaning[i], speciesList[i], geneList[i], proteinList[i]);

            for (var j = 0; j < temp.length; j++) {
                if (j == 0) {
                    td[j] = document.createElement("td");
                    var label = document.createElement('label');
                    label.innerHTML = '<input id="' + modelEntity[i] + '" type="checkbox" ' +
                        'data-action="search" value="' + modelEntity[i] + '" class="checkbox"></label>';

                    td[j].appendChild(label);
                    tr.appendChild(td[j]);
                }

                if (j == 1) {
                    td[j] = document.createElement("td");
                    td[j].appendChild(document.createTextNode(temp[j]));
                    tr.appendChild(td[j]);
                }
                else {
                    td[j] = document.createElement("td");
                    td[j].appendChild(document.createTextNode(temp[j]));
                    tr.appendChild(td[j]);
                }
            }

            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        searchList.appendChild(table);

        // Fill in the search attribute value
        var searchTxt = document.getElementById("searchTxt");
        searchTxt.setAttribute('value', sessionStorage.getItem('searchTxtContent'));

        // SET main content in the local storage
        var maincontent = document.getElementById('main-content');
        sessionStorage.setItem('searchListContent', $(maincontent).html());
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
                        insertHtml("#main-content", viewHtmlContent);
                        sendPostRequest(endpoint, query, showView, true);
                    },
                    false);
            },
            true);
    };

    // Load the model
    mainUtils.loadModelHtml = function () {

        var cellmlModel = mainUtils.workspaceName;

        console.log("cellmlModel in loadModelHtml: ", cellmlModel);

        var query = 'SELECT ?Model_entity ?Protein ?Species ?Gene ?Compartment ' +
            'WHERE { GRAPH ?Workspace { ' +
            'OPTIONAL { ' + '<' + cellmlModel + '#Protein> <http://purl.org/dc/terms/description> ?Protein } . ' +
            'OPTIONAL { ?Model_entity <http://purl.org/dc/terms/description> ?Protein } . ' +
            'OPTIONAL { ' + '<' + cellmlModel + '#Species> <http://purl.org/dc/terms/description> ?Species } . ' +
            'OPTIONAL { ' + '<' + cellmlModel + '#Gene> <http://purl.org/dc/terms/description> ?Gene } . ' +
            'OPTIONAL { ' + '<' + cellmlModel + '#Compartment> <http://purl.org/dc/terms/description> ?Compartment } . ' +
            '}}';

        // showLoading("#main-content");
        sendGetRequest(
            modelHtml,
            function (modelHtmlContent) {
                insertHtml("#main-content", modelHtmlContent);

                sendPostRequest(endpoint, query, mainUtils.showModel, true);
            },
            false);

        // Switch from current active button to models button
        var activeItem = "#" + activeMenu();
        switchMenuToActive(activeItem, "#listModels");
    };

    // TODO: move to utils directory
    // Show selected items in a table
    mainUtils.showModel = function (jsonObj) {

        console.log("showModel: ", jsonObj);

        var modelList = document.getElementById("modelList");

        var table = document.createElement("table");
        table.className = "table table-hover table-condensed"; //table-bordered table-striped

        // Table header
        var thead = document.createElement("thead");
        var tr = document.createElement("tr");
        for (var i = 0; i < jsonObj.head.vars.length; i++) {
            if (i == 0) {
                var th = document.createElement("th");
                var label = document.createElement('label');
                label.innerHTML = '<input id="' + jsonObj.head.vars[0] + '" type="checkbox" name="attributeAll" ' +
                    'class="attributeAll" data-action="model" value="' + jsonObj.head.vars[0] + '" ></label>';

                th.appendChild(label);
                tr.appendChild(th);
            }

            var th = document.createElement("th");
            th.appendChild(document.createTextNode(jsonObj.head.vars[i]));
            tr.appendChild(th);
        }

        thead.appendChild(tr);
        table.appendChild(thead);

        // Table body
        for (var i = 0; i < jsonObj.head.vars.length; i++) {
            if (i == 0) {
                // search list to model list with empty model
                if (jsonObj.results.bindings.length == 0) break;

                var label = document.createElement('label');
                label.innerHTML = '<input id="' + modelEntityName + '" type="checkbox" name="attribute" ' +
                    'class="attribute" data-action="model" value="' + modelEntityName + '" ></label>';

                model.push(label);
            }

            if (jsonObj.head.vars[i] == "Compartment") {
                var compartment = "";
                for (var c = 0; c < jsonObj.results.bindings.length; c++) {
                    if (c == 0)
                        compartment += jsonObj.results.bindings[c][jsonObj.head.vars[i]].value;
                    else
                        compartment += "," + jsonObj.results.bindings[c][jsonObj.head.vars[i]].value;
                }

                model.push(compartment);
            }
            else {
                if (jsonObj.head.vars[i] == "Model_entity") {
                    model.push(modelEntityName);
                }
                else
                    model.push(jsonObj.results.bindings[0][jsonObj.head.vars[i]].value);
            }
        }

        // 1D to 2D array
        while (model.length) {
            model2DArray.push(model.splice(0, 6)); // 5 + 1 (checkbox) header elemenet
        }

        console.log("model and model2DArray: ", model, model2DArray);

        var td = [];
        var tbody = document.createElement("tbody");
        for (var ix = 0; ix < model2DArray.length; ix++) {
            var tr = document.createElement("tr");
            // +1 for adding checkbox column
            for (var j = 0; j < jsonObj.head.vars.length + 1; j++) {
                td[j] = document.createElement("td");
                if (j == 0)
                    td[j].appendChild(model2DArray[ix][j]);
                else
                    td[j].appendChild(document.createTextNode(model2DArray[ix][j]));

                // Id for each row
                if (j == 1)
                    tr.setAttribute("id", model2DArray[ix][j]);

                tr.appendChild(td[j]);
            }

            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        modelList.appendChild(table);

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

        if (event.srcElement.checked == false) {
            var id = event.srcElement.id;

            console.log("id: ", id);

            $('td:nth-child(' + id + '),th:nth-child(' + id + ')').hide();
        }

        if (event.srcElement.checked == true) {
            var id = event.srcElement.id;

            console.log("id: ", id);

            $('td:nth-child(' + id + '),th:nth-child(' + id + ')').show();
        }
    };

    // Toggle table column in Load model
    mainUtils.toggleColModelHtml = function () {

        if (event.srcElement.checked == false) {
            var id = event.srcElement.id;

            console.log("id: ", id);

            $('td:nth-child(' + id + '),th:nth-child(' + id + ')').hide();
        }

        if (event.srcElement.checked == true) {
            var id = event.srcElement.id;

            console.log("id: ", id);

            $('td:nth-child(' + id + '),th:nth-child(' + id + ')').show();
        }
    };

    // Filter search results
    mainUtils.filterSearchHtml = function () {

        var tempstr = [];

        if (event.srcElement.checked == true) {

            var id = event.srcElement.id;
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

        if (event.srcElement.checked == false) {

            var tempstr = [];
            var id = event.srcElement.id;

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

    // Load the SVG model
    mainUtils.loadSVGModelHtml = function () {

        sendGetRequest(
            svgmodelHtml,
            function (svgmodelHtmlContent) {
                insertHtml("#main-content", svgmodelHtmlContent);

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
                insertHtml("#main-content", epithelialHtmlContent);

                sendGetRequest(svgepithelialHtml, mainUtils.loadEpithelial, false);
            },
            false);
    };

    mainUtils.loadEpithelial = function (epithelialHtmlContent) {

        // remove model name, keep only solutes
        for (var i = 0; i < modelEntityNameArray.length; i++) {
            var indexOfHash = modelEntityNameArray[i].search("#");
            modelEntityNameArray[i] = modelEntityNameArray[i].slice(indexOfHash + 1);
        }

        // remove duplicate
        modelEntityNameArray = modelEntityNameArray.filter(function (item, pos) {
            return modelEntityNameArray.indexOf(item) == pos;
        })

        console.log("loadEpithelial in model2DArr: ", model2DArray);
        console.log("loadEpithelial in modelEntityNameArray: ", modelEntityNameArray);
        console.log("loadEpithelial in modelEntityFullNameArray: ", modelEntityFullNameArray);

        var concentration_fma = [], source_fma = [], sink_fma = [], med_fma = [], med_pr = [];
        var source_fma2 = [], sink_fma2 = [];

        var apicalID = "http://identifiers.org/fma/FMA:84666";
        var basolateralID = "http://identifiers.org/fma/FMA:84669";
        var partOfProteinUri = "http://purl.obolibrary.org/obo/PR";
        var partOfCHEBIUri = "http://identifiers.org/chebi/CHEBI";
        var leakID = "http://identifiers.org/go/GO:0022840";

        var index = 0, counter = 0;
        var membrane = [], apicalMembrane = [], basolateralMembrane = [];

        // making cotransporter from the RDF graph using SPARQL
        mainUtils.makecotransporter = function (membrane1, membrane2) {
            // query for finding fluxes to make a cotransporter
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
                    var tempProtein = [], tempApical = [], tempBasolateral = [];

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

                    // remove duplicate of protein ID
                    tempProtein = tempProtein.filter(function (item, pos) {
                        return tempProtein.indexOf(item) == pos;
                    })

                    // remove duplicate of fma ID
                    tempApical = tempApical.filter(function (item, pos) {
                        return tempApical.indexOf(item) == pos;
                    })

                    // remove duplicate of fma ID
                    tempBasolateral = tempBasolateral.filter(function (item, pos) {
                        return tempBasolateral.indexOf(item) == pos;
                    })

                    // cotransporter in apical membrane
                    if (tempProtein.length != 0 && tempApical.length != 0) {
                        apicalMembrane.push(
                            {
                                source_name: membrane1.source_name,
                                sink_name: membrane1.sink_name,
                                med_text: membrane1.med_text,
                                med_fma: membrane1.med_fma,
                                med_pr: membrane1.med_pr,
                                source_text: membrane1.source_text,
                                source_fma: membrane1.source_fma,
                                sink_text: membrane1.sink_text,
                                sink_fma: membrane1.sink_fma,
                                source_name2: membrane2.source_name,
                                sink_name2: membrane2.sink_name,
                                med_text2: membrane2.med_text,
                                med_fma2: membrane2.med_fma,
                                med_pr2: membrane2.med_pr,
                                source_text2: membrane2.source_text,
                                source_fma2: membrane2.source_fma,
                                sink_text2: membrane2.sink_text,
                                sink_fma2: membrane2.sink_fma
                            });
                    }

                    // cotransporter in basolateral membrane
                    if (tempProtein.length != 0 && tempBasolateral.length != 0) {
                        basolateralMembrane.push(
                            {
                                source_name: membrane1.source_name,
                                sink_name: membrane1.sink_name,
                                med_text: membrane1.med_text,
                                med_fma: membrane1.med_fma,
                                med_pr: membrane1.med_pr,
                                source_text: membrane1.source_text,
                                source_fma: membrane1.source_fma,
                                sink_text: membrane1.sink_text,
                                sink_fma: membrane1.sink_fma,
                                source_name2: membrane2.source_name,
                                sink_name2: membrane2.sink_name,
                                med_text2: membrane2.med_text,
                                med_fma2: membrane2.med_fma,
                                med_pr2: membrane2.med_pr,
                                source_text2: membrane2.source_text,
                                source_fma2: membrane2.source_fma,
                                sink_text2: membrane2.sink_text,
                                sink_fma2: membrane2.sink_fma,
                            });
                    }

                    counter++;

                    if (counter == iteration(membrane.length)) {
                        showsvgEpithelial(
                            concentration_fma,
                            source_fma2,
                            sink_fma2,
                            apicalMembrane,
                            basolateralMembrane,
                            membrane);
                    }
                },
                true);
        };

        mainUtils.srcDescMediatorOfFluxes = function () {

            if (index == modelEntityFullNameArray.length) {

                // exceptional case: one flux is chosen
                if (membrane.length <= 1) {
                    console.log("membrane.length <= 1 concentration_fma: ", concentration_fma);
                    console.log("membrane.length <= 1 source_fma2: ", source_fma2);
                    console.log("membrane.length <= 1 sink_fma2: ", sink_fma2);
                    console.log("membrane.length <= 1 apicalMembrane: ", apicalMembrane);
                    console.log("membrane.length <= 1 basolateralMembrane: ", basolateralMembrane);
                    console.log("membrane.length <= 1 membrane: ", membrane);

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

            var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
                'SELECT ?source_fma ?sink_fma ?med_entity_uri ' +
                'WHERE { ' +
                '<' + modelEntityFullNameArray[index] + '> semsim:isComputationalComponentFor ?model_prop. ' +
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

                    for (var i = 0; i < jsonObjFlux.results.bindings.length; i++) {

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
                            if (temp.indexOf(partOfProteinUri) != -1 || temp.indexOf(partOfCHEBIUri) != -1 ||
                                temp.indexOf(leakID) != -1) {
                                med_pr.push({
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

                            if (source_fma.length != 0) {

                                var srctext = parserFmaNameText(source_fma[0]);
                                var snktext = parserFmaNameText(sink_fma[0]);
                                var medfmatext = parserFmaNameText(med_fma[0]);

                                if (med_pr[0] == undefined) { // temp solution
                                    membrane.push({
                                        source_text: srctext,
                                        source_fma: source_fma[0].fma,
                                        source_name: source_fma[0].name,
                                        sink_text: snktext,
                                        sink_fma: sink_fma[0].fma,
                                        sink_name: sink_fma[0].name,
                                        med_text: medfmatext,
                                        med_fma: med_fma[0].fma,
                                        med_pr: undefined
                                    });
                                }
                                else {
                                    membrane.push({
                                        source_text: srctext,
                                        source_fma: source_fma[0].fma,
                                        source_name: source_fma[0].name,
                                        sink_text: snktext,
                                        sink_fma: sink_fma[0].fma,
                                        sink_name: sink_fma[0].name,
                                        med_text: medfmatext,
                                        med_fma: med_fma[0].fma,
                                        med_pr: med_pr[0].fma
                                    });
                                }

                                source_fma2.push(source_fma[0]);
                                sink_fma2.push(sink_fma[0]);

                                source_fma = [];
                                sink_fma = [];
                                med_fma = [];
                                med_pr = [];
                            }

                            mainUtils.srcDescMediatorOfFluxes(); // callback
                        },
                        true);
                },
                true);
        }

        mainUtils.srcDescMediatorOfFluxes();
    };

    // Expose utility to the global object
    global.$mainUtils = mainUtils;
})
(window);

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
/**
 * Created by dsar941 on 5/11/2017.
 */
var solutesBouncing = require("./solutesBouncing.js").solutesBouncing;
var getTextWidth = require("../utils/misc.js").getTextWidth;
var uniqueify = require("../utils/misc.js").uniqueify;
var sendPostRequest = require("../libs/ajax-utils.js").sendPostRequest;
var sendGetRequest = require("../libs/ajax-utils.js").sendGetRequest;
var showLoading = require("../utils/misc.js").showLoading;

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
                    sink_fma2: "Gap Junction",
                    source_name: membrane[i].source_name,
                    sink_name: membrane[i].sink_name,
                    med_text: membrane[i].med_text,
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr
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
                    sink_fma2: "IP3 flux",
                    source_name: membrane[i].source_name,
                    sink_name: membrane[i].sink_name,
                    med_text: membrane[i].med_text,
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr
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
                    sink_fma2: "IP3 flux",
                    source_name: membrane[i].source_name,
                    sink_name: membrane[i].sink_name,
                    med_text: membrane[i].med_text,
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr
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
                    sink_fma2: "single flux",
                    source_name: membrane[i].source_name,
                    sink_name: membrane[i].sink_name,
                    med_text: membrane[i].med_text,
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr
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
                    sink_fma2: "single flux",
                    source_name: membrane[i].source_name,
                    sink_name: membrane[i].sink_name,
                    med_text: membrane[i].med_text,
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr
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
    for (var i = 0; i < celljunction.length; i++)
        combinedMembrane.push(celljunction[i]);
    for (var i = 0; i < wallOfSmoothERMembrane.length; i++)
        combinedMembrane.push(wallOfSmoothERMembrane[i]);
    for (var i = 0; i < wallOfRoughERMembrane.length; i++)
        combinedMembrane.push(wallOfRoughERMembrane[i]);

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

    var radius = 20, radiuswser = 15,
        lineLen = 50, polygonlineLen = 60, lineLenwser = 40, pcellLen = 100,

        xvalue = xrect - lineLen / 2, // x coordinate before epithelial rectangle
        yvalue = yrect + 10 + 50, // initial distance 50
        cxvalue = xrect, cyvalue = yrect + 10 + 50, // initial distance 50
        ydistance = 70,

        yvalueb = yrect + 10 + 50, // initial distance 50
        ydistanceb = 70, cyvalueb = yrect + 10 + 50, // initial distance 50

        xvaluewser = xER + 10 + 20, yvaluewser = yER - lineLen / 2,
        xvaluewrer = xER - lineLenwser / 2, yvaluewrer = yER + 10 + 20,

        circlewithlineg = [], linewithlineg = [], linewithlineg2 = [],
        linewithtextg = [], linewithtextg2 = [], circlewithlinegIP3 = [], polygon = [],

        xvaluectoc = x + 10 + 20, yvaluectoc = y - lineLen / 2,
        cxvaluectoc = x + 10 + 30, xdistancectoc = 40,

        cxvaluewser = xER + 10 + 20, cyvaluewser = yER, xdistancewser = 40,
        cxvaluewrer = xER, cyvaluewrer = yER + 10 + 20, ydistancewrer = 40;


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

    // apical, basolateral, paracellular, cell junction, wall of smooth and rough ER membrane
    for (var i = 0; i < combinedMembrane.length; i++) {
        source_name = combinedMembrane[i].source_name;

        if (combinedMembrane[i].source_name2 != undefined)
            source_name2 = combinedMembrane[i].source_name2;
        else source_name2 = "";

        var mediator_fma = combinedMembrane[i].med_fma;

        var textvalue = combinedMembrane[i].source_text;
        var textvalue2 = combinedMembrane[i].source_text2;
        var src_fma = combinedMembrane[i].source_fma;
        var src_fma2 = combinedMembrane[i].source_fma2;
        var snk_fma = combinedMembrane[i].sink_fma;
        var snk_fma2 = combinedMembrane[i].sink_fma2;
        var snk_textvalue = combinedMembrane[i].sink_text;
        var snk_textvalue2 = combinedMembrane[i].sink_text2;
        var textWidth = getTextWidth(textvalue, 12);

        var tempID = circlewithlineg.length;

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

            // case 7
            if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == "leak" && snk_fma2 == "leak")) {
                var leakg = newg.append("g").data([{x: xvalue - 5, y: yvalue}]);
                var leaktextg = leakg.append("g").data([{x: xvalue - polygonlineLen / 2 - 10, y: yvalue + 5}]);

                circlewithlineg[i] = leaktextg.append("text")
                    .attr("id", "linewithtextg" + tempID)
                    .attr("index", tempID)
                    .attr("membrane", apicalID)
                    .attr("x", function (d) {
                        dx[i] = d.x; // dxtext
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y; // dytext
                        return d.y;
                    })
                    .attr("font-size", "12px")
                    .attr("fill", "red")
                    .attr("cursor", "move")
                    .text(textvalue);

                linewithlineg[i] = leakg.append("line")
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

                // increment y-axis of line and circle
                yvalue += ydistance;
                cyvalue += ydistance;
            }

            // case 8
            if ((src_fma == cytosolID && snk_fma == luminalID) && (src_fma2 == "leak" && snk_fma2 == "leak")) {
                var leakg = newg.append("g").data([{x: xvalue - 5, y: yvalue}]);
                var leaktextg = leakg.append("g").data([{x: xvalue + polygonlineLen / 2 + 10, y: yvalue + 5}]);

                circlewithlineg[i] = leaktextg.append("text")
                    .attr("id", "linewithtextg" + tempID)
                    .attr("index", tempID)
                    .attr("membrane", apicalID)
                    .attr("x", function (d) {
                        dx[i] = d.x; // dxtext
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y; // dytext
                        return d.y;
                    })
                    .attr("font-size", "12px")
                    .attr("fill", "red")
                    .attr("cursor", "move")
                    .text(textvalue);

                linewithlineg[i] = leakg.append("line")
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

                // increment y-axis of line and circle
                yvalue += ydistance;
                cyvalue += ydistance;
            }

            // case 9
            if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == "ATP" && snk_fma2 == "ATP")) {
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

                linewithtextg[i] = polygontext.append("g").append("text")
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

                // ATP rectangle
                // TODO: how to move rect?
                var atprect = polygong.append("g").append("rect")
                    .attr("transform", "translate(" + (xvalue - 5) + "," + (yvalue) + ")rotate(-45)")
                    // .attr("id", ATPID)
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", apicalID)
                    .attr("width", 26)
                    .attr("height", 26)
                    .attr("stroke", "black")
                    .attr("strokeWidth", "10px")
                    .attr("fill", "white");

                var atptextg = polygong.append("g").data([{x: xvalue + 8, y: yvalue + 5}]);
                linewithtextg2[i] = atptextg.append("text") // atprectText
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
                        dx2line2[i] = d.x + polygonlineLen;
                        return d.x + polygonlineLen;
                    })
                    .attr("y2", function (d) {
                        dy2line2[i] = d.y;
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

                // ATP rectangle
                var atprect = polygong.append("g").append("rect")
                    .attr("transform", "translate(" + (xvalue - 5 + polygonlineLen) + "," + (yvalue) + ")rotate(-45)")
                    // .attr("id", ATPID)
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", apicalID)
                    .attr("width", 26)
                    .attr("height", 26)
                    .attr("stroke", "black")
                    .attr("strokeWidth", "10px")
                    .attr("fill", "white");

                var atptextg = polygong.append("g").data([{x: xvalue + polygonlineLen + 8, y: yvalue + 5}]);
                linewithtextg2[i] = atptextg.append("text")
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
            // TODO: probably should try appending things after circlewithlineg[i]
            if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == "p2y2" && snk_fma2 == "p2y2")) {
                var lineg = newg.append("g").data([{x: xvalue, y: yvalue}]);
                circlewithlineg[i] = lineg.append("g").append("rect")
                    .attr("id", "linewithlineg" + tempID)
                    .attr("index", tempID)
                    .attr("membrane", apicalID)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
                        return d.y;
                    })
                    .attr("width", lineLen)
                    .attr("height", 4)
                    .attr("stroke", "black")
                    .attr("strokeWidth", "12px")
                    .attr("fill", "white");

                var lineg2 = newg.append("g").data([{x: xvalue, y: yvalue + 8}]);
                circlewithlineg[i] = lineg2.append("g").append("rect")
                    .attr("id", "linewithlineg2" + tempID)
                    .attr("index", tempID)
                    .attr("membrane", apicalID)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
                        return d.y;
                    })
                    .attr("width", lineLen)
                    .attr("height", 4)
                    .attr("stroke", "black")
                    .attr("strokeWidth", "12px")
                    .attr("fill", "white");

                var lineg3 = newg.append("g").data([{x: xvalue, y: yvalue + 16}]);
                circlewithlineg[i] = lineg3.append("g").append("rect")
                    .attr("id", "linewithlineg2" + tempID)
                    .attr("index", tempID)
                    .attr("membrane", apicalID)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
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
                var lineg = newg.append("g").data([{x: xvalue, y: yvalue}]);
                circlewithlineg[i] = lineg.append("g").append("rect")
                    .attr("id", "linewithlineg" + tempID)
                    .attr("index", tempID)
                    .attr("membrane", apicalID)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
                        return d.y;
                    })
                    .attr("width", lineLen)
                    .attr("height", 3)
                    .attr("stroke", "black")
                    .attr("strokeWidth", "12px")
                    .attr("fill", "white");

                var lineg2 = newg.append("g").data([{x: xvalue, y: yvalue + 8}]);
                circlewithlineg[i] = lineg2.append("g").append("rect")
                    .attr("id", "linewithlineg2" + tempID)
                    .attr("index", tempID)
                    .attr("membrane", apicalID)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
                        return d.y;
                    })
                    .attr("width", lineLen)
                    .attr("height", 4)
                    .attr("stroke", "black")
                    .attr("strokeWidth", "12px")
                    .attr("fill", "white");

                var lineg3 = newg.append("g").data([{x: xvalue, y: yvalue + 16}]);
                circlewithlineg[i] = lineg3.append("g").append("rect")
                    .attr("id", "linewithlineg3" + tempID)
                    .attr("index", tempID)
                    .attr("membrane", apicalID)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
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

            // case 7
            if ((src_fma == interstitialID && snk_fma == cytosolID) && (src_fma2 == "leak" && snk_fma2 == "leak")) {
                var leakg = newg.append("g").data([{x: xvalue - 5 + width, y: yvalueb}]);
                var leaktextg = leakg.append("g").data([{x: xvalue + polygonlineLen / 2 + 10 + width, y: yvalueb + 5}]);

                circlewithlineg[i] = leaktextg.append("text")
                    .attr("id", "linewithtextg" + tempID)
                    .attr("index", tempID)
                    .attr("membrane", basolateralID)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
                        return d.y;
                    })
                    .attr("font-size", "12px")
                    .attr("fill", "red")
                    .attr("cursor", "move")
                    .text(textvalue);

                linewithlineg[i] = leakgb.append("line")
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

                // increment y-axis of line and circle
                yvalueb += ydistanceb;
                cyvalueb += ydistanceb;
            }

            // case 8
            if ((src_fma == cytosolID && snk_fma == interstitialID) && (src_fma2 == "leak" && snk_fma2 == "leak")) {
                var leakg = newg.append("g").data([{x: xvalue - 5 + width, y: yvalueb}]);
                var leaktextg = leakg.append("g").data([{x: xvalue - polygonlineLen / 2 - 10 + width, y: yvalueb + 5}]);

                circlewithlineg[i] = leaktextg.append("text")
                    .attr("id", "linewithtextg" + tempID)
                    .attr("index", tempID)
                    .attr("membrane", basolateralID)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
                        return d.y;
                    })
                    .attr("font-size", "12px")
                    .attr("fill", "red")
                    .attr("cursor", "move")
                    .text(textvalue);

                linewithlineg[i] = leakg.append("line")
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

                // increment y-axis of line and circle
                yvalueb += ydistanceb;
                cyvalueb += ydistanceb;
            }

            // case 9
            if ((src_fma == interstitialID && snk_fma == cytosolID) && (src_fma2 == "ATP" && snk_fma2 == "ATP")) {
                var polygong = newg.append("g").data([{x: xvalue - 5 + width, y: yvalue}]);
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
                    .attr("transform", "translate(" + (xvalue - 5 + width) + "," + (yvalue - 30) + ")")
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

                var polygontext = polygong.append("g").data([{x: xvalue + 20 - 5 + width, y: yvalue + 5}]);

                var txt = textvalue.substr(5); // temp solution
                if (txt == "Cl") txt = txt + "-";
                else txt = txt + "+";

                linewithtextg[i] = polygontext.append("g").append("text")
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

                // ATP rectangle
                var atprect = polygong.append("g").append("rect")
                    .attr("transform", "translate(" + (xvalue - 5 + width) + "," + (yvalue) + ")rotate(-45)")
                    // .attr("id", ATPID)
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", basolateralID)
                    .attr("width", 26)
                    .attr("height", 26)
                    .attr("stroke", "black")
                    .attr("strokeWidth", "10px")
                    .attr("fill", "white");

                var atptextg = polygong.append("g").data([{x: xvalue + 8 + width, y: yvalue + 5}]);
                linewithtextg2[i] = atptextg.append("text")
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
            if ((src_fma == cytosolID && snk_fma == interstitialID) && (src_fma2 == "ATP" && snk_fma2 == "ATP")) {
                var polygong = newg.append("g").data([{x: xvalue - 5 + width, y: yvalue}]);
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
                    .attr("transform", "translate(" + (xvalue - 5 + width) + "," + (yvalue - 30) + ")")
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

                var polygontext = polygong.append("g").data([{x: xvalue + 20 - 5 + width, y: yvalue + 5}]);

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

                // ATP rectangle
                var atprect = polygong.append("g").append("rect")
                    .attr("transform", "translate(" + (xvalue - 5 + polygonlineLen + width) + "," + (yvalue) + ")rotate(-45)")
                    // .attr("id", ATPID)
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", basolateralID)
                    .attr("width", 26)
                    .attr("height", 26)
                    .attr("stroke", "black")
                    .attr("strokeWidth", "10px")
                    .attr("fill", "white");

                var atptextg = polygong.append("g").data([{x: xvalue + polygonlineLen + 8 + width, y: yvalue + 5}]);
                linewithtextg2[i] = atptextg.append("text")
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
            if ((src_fma == interstitialID && snk_fma == cytosolID) && (src_fma2 == "p2y2" && snk_fma2 == "p2y2")) {
                var lineg = newg.append("g").data([{x: xvalue, y: yvalue}]);
                circlewithlineg[i] = lineg.append("g").append("rect")
                    .attr("id", "linewithlineg" + tempID)
                    .attr("index", tempID)
                    .attr("membrane", basolateralID)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
                        return d.y;
                    })
                    .attr("width", lineLen)
                    .attr("height", 4)
                    .attr("stroke", "black")
                    .attr("strokeWidth", "12px")
                    .attr("fill", "white");

                var lineg2 = newg.append("g").data([{x: xvalue, y: yvalue + 8}]);
                circlewithlineg[i] = lineg2.append("g").append("rect")
                    .attr("id", "linewithlineg2" + tempID)
                    .attr("index", tempID)
                    .attr("membrane", basolateralID)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
                        return d.y;
                    })
                    .attr("width", lineLen)
                    .attr("height", 4)
                    .attr("stroke", "black")
                    .attr("strokeWidth", "12px")
                    .attr("fill", "white");

                var lineg3 = newg.append("g").data([{x: xvalue, y: yvalue + 16}]);
                circlewithlineg[i] = lineg3.append("g").append("rect")
                    .attr("id", "linewithlineg3" + tempID)
                    .attr("index", tempID)
                    .attr("membrane", basolateralID)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
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
            if ((src_fma == cytosolID && snk_fma == interstitialID) && (src_fma2 == "p2y2" && snk_fma2 == "p2y2")) {
                var lineg = newg.append("g").data([{x: xvalue, y: yvalue}]);
                circlewithlineg[i] = lineg.append("g").append("rect")
                    .attr("id", "linewithlineg" + tempID)
                    .attr("index", tempID)
                    .attr("membrane", basolateralID)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
                        return d.y;
                    })
                    .attr("width", lineLen)
                    .attr("height", 3)
                    .attr("stroke", "black")
                    .attr("strokeWidth", "12px")
                    .attr("fill", "white");

                var lineg2 = newg.append("g").data([{x: xvalue, y: yvalue + 8}]);
                circlewithlineg[i] = lineg2.append("g").append("rect")
                    .attr("id", "linewithlineg2" + tempID)
                    .attr("index", tempID)
                    .attr("membrane", basolateralID)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
                        return d.y;
                    })
                    .attr("width", lineLen)
                    .attr("height", 4)
                    .attr("stroke", "black")
                    .attr("strokeWidth", "12px")
                    .attr("fill", "white");

                var lineg3 = newg.append("g").data([{x: xvalue, y: yvalue + 16}]);
                circlewithlineg[i] = lineg3.append("g").append("rect")
                    .attr("id", "linewithlineg3" + tempID)
                    .attr("index", tempID)
                    .attr("membrane", basolateralID)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
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

        /* Gap or Cell Junction Membrane */
        // TODO: cytosol to cytosol OR cytosol to paracellular!!
        if ((src_fma == cytosolID && snk_fma == cytosolID) && (src_fma2 == "Gap Junction" && snk_fma2 == "Gap Junction")) {
            var polygong = newg.append("g").data([{x: xvaluectoc + 120, y: (yvaluectoc - 5 + height)}]);
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
                    dx2line[i] = d.x;
                    return d.x;
                })
                .attr("y2", function (d) {
                    dy2line[i] = d.y + polygonlineLen * 2 + height / 3;
                    return d.y + polygonlineLen * 2 + height / 3;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#end)")
                .attr("cursor", "pointer");

            // Polygon
            circlewithlineg[i] = polygong.append("g").append("polygon")
                .attr("transform", "translate(" + (xvaluectoc + 30 + 120) + "," + (yvaluectoc - 5 + height) + ")rotate(90)")
                .attr("id", function (d) {
                    return [
                        source_name, source_name2,
                        textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                        src_fma, src_fma2, snk_fma, snk_fma2
                    ];
                })
                .attr("index", tempID)
                .attr("membrane", celljunctionID)
                .attr("points", "10,20 240,20 235,30 240,40 10,40 15,30")
                .attr("fill", "yellow")
                .attr("stroke", "black")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round")
                .attr("cursor", "move");

            var polygontext = polygong.append("g").data([{
                x: xvaluectoc - 15 + 120,
                y: yvaluectoc - 15 + height
            }]);

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
                .attr("font-size", "8px")
                .attr("fill", "red")
                .attr("cursor", "move")
                .text(textvalue);

            // increment x-axis of line and circle
            xvaluectoc += xdistancectoc;
            cxvaluectoc += xdistancectoc;
        }

        /* Wall of smooth ER membrane */
        if (mediator_fma == wallOfSmoothER) {
            // case 1
            if ((src_fma == cytosolID && snk_fma == ER) && (src_fma2 == cytosolID && snk_fma2 == ER)) {
                var lineg = newg.append("g").data([{x: xvaluewser, y: yvaluewser}]);
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
                        dx2line[i] = d.x;
                        return d.x;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y + lineLenwser;
                        return d.y + lineLenwser;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#end)")
                    .attr("cursor", "pointer");

                var linegtext = lineg.append("g").data([{
                    x: xvaluewser - 15,
                    y: yvaluewser + lineLenwser + 15
                }]);
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
                    .attr("font-size", "8px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(textvalue);

                var linegcircle = lineg.append("g").data([{x: cxvaluewser, y: cyvaluewser}]);
                circlewithlineg[i] = linegcircle.append("circle")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", wallOfSmoothER)
                    .attr("cx", function (d) {
                        dx[i] = d.x + radiuswser;
                        return d.x + radiuswser;
                    })
                    .attr("cy", function (d) {
                        dy[i] = d.y;
                        return d.y;
                    })
                    .attr("r", radiuswser)
                    .attr("fill", "lightgreen")
                    .attr("stroke-width", 20)
                    .attr("cursor", "move");

                if (textvalue2 != "single flux") {
                    var lineg2 = lineg.append("g").data([{x: xvaluewser + radiuswser * 2, y: yvaluewser}]);
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
                            dx2line2[i] = d.x;
                            return d.x;
                        })
                        .attr("y2", function (d) {
                            dy2line2[i] = d.y + lineLenwser;
                            return d.y + lineLenwser;
                        })
                        .attr("stroke", "black")
                        .attr("stroke-width", 2)
                        .attr("marker-end", "url(#end)")
                        .attr("cursor", "pointer");

                    var linegtext2 = lineg2.append("g").data([{
                        x: xvaluewser + radiuswser * 2 - 15, y: yvaluewser + lineLenwser + 15
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
                var lineg = newg.append("g").data([{x: xvaluewser, y: yvaluewser}]);
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
                        dx2line[i] = d.x;
                        return d.x;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y + lineLenwser;
                        return d.y + lineLenwser;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-start", "url(#starttop)")
                    .attr("cursor", "pointer");

                var linegtext = lineg.append("g").data([{
                    x: xvaluewser - 15,
                    y: yvaluewser - 15
                }]);
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
                    .attr("font-size", "8px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(textvalue);

                var linegcircle = lineg.append("g").data([{x: cxvaluewser, y: cyvaluewser}]);
                circlewithlineg[i] = linegcircle.append("circle")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", wallOfSmoothER)
                    .attr("cx", function (d) {
                        dx[i] = d.x + radiuswser;
                        return d.x + radiuswser;
                    })
                    .attr("cy", function (d) {
                        dy[i] = d.y;
                        return d.y;
                    })
                    .attr("r", radiuswser)
                    .attr("fill", "lightgreen")
                    .attr("stroke-width", 20)
                    .attr("cursor", "move");

                if (textvalue2 != "single flux") {
                    var lineg2 = lineg.append("g").data([{x: xvaluewser + radiuswser * 2, y: yvaluewser}]);
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
                            dx2line2[i] = d.x;
                            return d.x;
                        })
                        .attr("y2", function (d) {
                            dy2line2[i] = d.y + lineLenwser;
                            return d.y + lineLenwser;
                        })
                        .attr("stroke", "black")
                        .attr("stroke-width", 2)
                        .attr("marker-start", "url(#starttop)")
                        .attr("cursor", "pointer");

                    var linegtext2 = lineg2.append("g").data([{
                        x: xvaluewser + radiuswser * 2 - 15, y: yvaluewser - 15
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
                var lineg = newg.append("g").data([{x: xvaluewser, y: yvaluewser}]);
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
                        dx2line[i] = d.x;
                        return d.x;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y + lineLenwser;
                        return d.y + lineLenwser;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#end)")
                    .attr("cursor", "pointer");

                var linegtext = lineg.append("g").data([{
                    x: xvaluewser - 15,
                    y: yvaluewser + lineLenwser + 15
                }]);
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
                    .attr("font-size", "8px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(textvalue);

                var linegcircle = lineg.append("g").data([{x: cxvaluewser, y: cyvaluewser}]);
                circlewithlineg[i] = linegcircle.append("circle")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", wallOfSmoothER)
                    .attr("cx", function (d) {
                        dx[i] = d.x + radiuswser;
                        return d.x + radiuswser;
                    })
                    .attr("cy", function (d) {
                        dy[i] = d.y;
                        return d.y;
                    })
                    .attr("r", radiuswser)
                    .attr("fill", "lightgreen")
                    .attr("stroke-width", 20)
                    .attr("cursor", "move");

                if (textvalue2 != "single flux") {
                    var lineg2 = lineg.append("g").data([{x: xvaluewser + radiuswser * 2, y: yvaluewser}]);
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
                            dx2line2[i] = d.x;
                            return d.x;
                        })
                        .attr("y2", function (d) {
                            dy2line2[i] = d.y + lineLenwser;
                            return d.y + lineLenwser;
                        })
                        .attr("stroke", "black")
                        .attr("stroke-width", 2)
                        .attr("marker-start", "url(#starttop)")
                        .attr("cursor", "pointer");

                    var linegtext2 = lineg2.append("g").data([{
                        x: xvaluewser + radiuswser * 2 - 15, y: yvaluewser - 15
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
                var lineg = newg.append("g").data([{x: xvaluewser, y: yvaluewser}]);
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
                        dx2line[i] = d.x;
                        return d.x;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y + lineLenwser;
                        return d.y + lineLenwser;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-start", "url(#starttop)")
                    .attr("cursor", "pointer");

                var linegtext = lineg.append("g").data([{
                    x: xvaluewser - 15,
                    y: yvaluewser - 15
                }]);
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
                    .attr("font-size", "8px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(textvalue);

                var linegcircle = lineg.append("g").data([{x: cxvaluewser, y: cyvaluewser}]);
                circlewithlineg[i] = linegcircle.append("circle")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", wallOfSmoothER)
                    .attr("cx", function (d) {
                        dx[i] = d.x + radiuswser;
                        return d.x + radiuswser;
                    })
                    .attr("cy", function (d) {
                        dy[i] = d.y;
                        return d.y;
                    })
                    .attr("r", radiuswser)
                    .attr("fill", "lightgreen")
                    .attr("stroke-width", 20)
                    .attr("cursor", "move");

                if (textvalue2 != "single flux") {
                    var lineg2 = lineg.append("g").data([{x: xvaluewser + radiuswser * 2, y: yvaluewser}]);
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
                            dx2line2[i] = d.x;
                            return d.x;
                        })
                        .attr("y2", function (d) {
                            dy2line2[i] = d.y + lineLenwser;
                            return d.y + lineLenwser;
                        })
                        .attr("stroke", "black")
                        .attr("stroke-width", 2)
                        .attr("marker-end", "url(#end)")
                        .attr("cursor", "pointer");

                    var linegtext2 = lineg2.append("g").data([{
                        x: xvaluewser + radiuswser * 2 - 15, y: yvaluewser + lineLenwser + 15
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
                var lineg = newg.append("g").data([{x: xvaluewser, y: yvaluewser + 5}]);
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
                        dx2line[i] = d.x;
                        return d.x;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y + lineLenwser;
                        return d.y + lineLenwser;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-start", "url(#starttop)")
                    .attr("cursor", "pointer");

                var linegtext = lineg.append("g").data([{
                    x: xvaluewser - 15,
                    y: yvaluewser - 10
                }]);
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
                    .attr("font-size", "8px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(textvalue);

                var linegcircle = lineg.append("g").data([{x: cxvaluewser, y: cyvaluewser}]);
                circlewithlineg[i] = linegcircle.append("circle")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", wallOfSmoothER)
                    .attr("cx", function (d) {
                        dx[i] = d.x;
                        return d.x + radiuswser;
                    })
                    .attr("cy", function (d) {
                        dy[i] = d.y;
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
                var lineg = newg.append("g").data([{x: xvaluewser, y: yvaluewser + 5}]);
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
                        dx2line[i] = d.x;
                        return d.x;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y + lineLenwser;
                        return d.y + lineLenwser;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#end)")
                    .attr("cursor", "pointer");

                var linegtext = lineg.append("g").data([{
                    x: xvaluewser - 15,
                    y: yvaluewser + lineLenwser + 10
                }]);
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
                    .attr("font-size", "8px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(textvalue);

                var linegcircle = lineg.append("g").data([{x: cxvaluewser, y: cyvaluewser}]);
                circlewithlineg[i] = linegcircle.append("circle")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", wallOfSmoothER)
                    .attr("cx", function (d) {
                        dx[i] = d.x + radiuswser;
                        return d.x + radiuswser;
                    })
                    .attr("cy", function (d) {
                        dy[i] = d.y;
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
                var polygong = newg.append("g").data([{x: xvaluewser, y: (yvaluewser - 5)}]);
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
                        dx2line[i] = d.x;
                        return d.x;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y + polygonlineLen;
                        return d.y + polygonlineLen;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-start", "url(#starttop)")
                    .attr("cursor", "pointer");

                // Polygon
                circlewithlineg[i] = polygong.append("g").append("polygon")
                    .attr("transform", "translate(" + (xvaluewser + 30) + "," + (yvaluewser - 5) + ")rotate(90)")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", wallOfSmoothER)
                    .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                    .attr("fill", "yellow")
                    .attr("stroke", "black")
                    .attr("stroke-linecap", "round")
                    .attr("stroke-linejoin", "round")
                    .attr("cursor", "move");

                var polygontext = polygong.append("g").data([{x: xvaluewser - 15, y: yvaluewser - 15}]);
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
                    .attr("font-size", "8px")
                    .attr("fill", "red")
                    .attr("cursor", "move")
                    .text(textvalue);

                // increment x-axis of line and circle
                xvaluewser += xdistancewser;
                cxvaluewser += xdistancewser;

                // circle for IP3 receptor
                var linegcircle = polygong.append("g").data([{x: xvaluewser - 55, y: yvaluewser + 10}]);
                circlewithlinegIP3[i] = linegcircle.append("circle")
                    .attr("id", "circlewithlinegIP3" + tempID)
                    .attr("cx", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        dy[i] = d.y;
                        return d.y;
                    })
                    .attr("r", 10)
                    .attr("fill", "lightgreen")
                    .attr("stroke-width", 20)
                    .attr("cursor", "move");

                linewithtextg2[i] = linegcircle.append("text")
                    .attr("id", "linewithtextg2" + i)
                    .attr("x", function (d) {
                        dxtext2[i] = d.x - 8;
                        return d.x - 8;
                    })
                    .attr("y", function (d) {
                        dytext2[i] = d.y + 4;
                        return d.y + 4;
                    })
                    .attr("font-size", "10px")
                    .attr("fill", "red")
                    .attr("cursor", "move")
                    .text("IP3");
            }

            // case 8
            if ((src_fma == cytosolID && snk_fma == ER) && (src_fma2 == "IP3 flux" && snk_fma2 == "IP3 flux")) {
                var polygong = newg.append("g").data([{x: xvaluewser, y: (yvaluewser - 5)}]);
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
                        dx2line[i] = d.x;
                        return d.x;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y + polygonlineLen;
                        return d.y + polygonlineLen;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#end)")
                    .attr("cursor", "pointer");

                // Polygon
                circlewithlineg[i] = polygong.append("g").append("polygon")
                    .attr("transform", "translate(" + (xvaluewser + 30) + "," + (yvaluewser - 5) + ")rotate(90)")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", wallOfSmoothER)
                    .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                    .attr("fill", "yellow")
                    .attr("stroke", "black")
                    .attr("stroke-linecap", "round")
                    .attr("stroke-linejoin", "round")
                    .attr("cursor", "move");

                var polygontext = polygong.append("g").data([{
                    x: xvaluewser - 15,
                    y: yvaluewser + polygonlineLen + 15
                }]);

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
                    .attr("font-size", "8px")
                    .attr("fill", "red")
                    .attr("cursor", "move")
                    .text(textvalue);

                // increment x-axis of line and circle
                xvaluewser += xdistancewser;
                cxvaluewser += xdistancewser;

                // circle for IP3 receptor
                var linegcircle = polygong.append("g").data([{x: xvaluewser - 50, y: yvaluewser + 15}]);
                circlewithlinegIP3[i] = linegcircle.append("circle")
                    .attr("id", "circlewithlinegIP3" + tempID)
                    .attr("cx", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        dy[i] = d.y;
                        return d.y;
                    })
                    .attr("r", 10)
                    .attr("fill", "lightgreen")
                    .attr("stroke-width", 20)
                    .attr("cursor", "move");

                linewithtextg2[i] = linegcircle.append("text")
                    .attr("id", "linewithtextg2" + tempID)
                    .attr("x", function (d) {
                        dxtext2[i] = d.x - 8;
                        return d.x - 8;
                    })
                    .attr("y", function (d) {
                        dytext2[i] = d.y + 4;
                        return d.y + 4;
                    })
                    .attr("font-size", "10px")
                    .attr("fill", "red")
                    .attr("cursor", "move")
                    .text("IP3");
            }

            // case 9
            if ((src_fma == ER && snk_fma == cytosolID) && (src_fma2 == "leak" && snk_fma2 == "leak")) {
                var leakg = newg.append("g").data([{x: xvaluewser, y: (yvaluewser - 5)}]);
                var leaktextg = leakg.append("g").data([{x: xvaluewser - 15, y: yvaluewser - 15}]);

                circlewithlineg[i] = leaktextg.append("text")
                    .attr("id", "linewithtextg" + tempID)
                    .attr("index", tempID)
                    .attr("membrane", wallOfSmoothER)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
                        return d.y;
                    })
                    .attr("font-size", "8px")
                    .attr("fill", "red")
                    .attr("cursor", "move")
                    .text(textvalue);

                linewithlineg[i] = leakg.append("line")
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
                        dx2line[i] = d.x;
                        return d.x;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y + polygonlineLen;
                        return d.y + polygonlineLen;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-start", "url(#starttop)")
                    .attr("cursor", "pointer");

                // increment x-axis of line and circle
                xvaluewser += xdistancewser;
                cxvaluewser += xdistancewser;
            }

            // case 10
            if ((src_fma == cytosolID && snk_fma == ER) && (src_fma2 == "leak" && snk_fma2 == "leak")) {
                var leakg = newg.append("g").data([{x: xvaluewser, y: (yvaluewser - 5)}]);
                var leaktextg = leakg.append("g").data([{
                    x: xvaluewser - 15,
                    y: yvaluewser + polygonlineLen + 15
                }]);

                circlewithlineg[i] = leaktextg.append("text")
                    .attr("id", "linewithtextg" + tempID)
                    .attr("index", tempID)
                    .attr("membrane", wallOfSmoothER)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
                        return d.y;
                    })
                    .attr("font-size", "8px")
                    .attr("fill", "red")
                    .attr("cursor", "move")
                    .text(textvalue);

                linewithlineg[i] = leakg.append("line")
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
                        dx2line[i] = d.x;
                        return d.x;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y + polygonlineLen;
                        return d.y + polygonlineLen;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#end)")
                    .attr("cursor", "pointer");

                // increment x-axis of line and circle
                xvaluewser += xdistancewser;
                cxvaluewser += xdistancewser;
            }
        }

        /* Wall of rough ER membrane */
        if (mediator_fma == wallOfRoughER) {
            // case 1
            if ((src_fma == cytosolID && snk_fma == ER) && (src_fma2 == cytosolID && snk_fma2 == ER)) {
                var lineg = newg.append("g").data([{x: xvaluewrer + widthER, y: yvaluewrer}]);
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
                        dx2line[i] = d.x + lineLenwser;
                        return d.x + lineLenwser;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y;
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-start", "url(#start)")
                    .attr("cursor", "pointer");

                var linegtext = lineg.append("g").data([{
                    x: xvaluewrer - lineLenwser + widthER,
                    y: yvaluewrer
                }]);
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
                    .attr("font-size", "8px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(textvalue);

                var linegcircle = lineg.append("g").data([{x: cxvaluewrer + widthER, y: cyvaluewrer}]);
                circlewithlineg[i] = linegcircle.append("circle")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", wallOfRoughER)
                    .attr("cx", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        dy[i] = d.y + radiuswser;
                        return d.y + radiuswser;
                    })
                    .attr("r", radiuswser)
                    .attr("fill", "lightgreen")
                    .attr("stroke-width", 20)
                    .attr("cursor", "move");

                if (textvalue2 != "single flux") {
                    var lineg2 = lineg.append("g").data([{
                        x: xvaluewrer + widthER,
                        y: yvaluewrer + radiuswser * 2
                    }]);
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
                            dx2line2[i] = d.x + lineLenwser;
                            return d.x + lineLenwser;
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
                        x: xvaluewrer - lineLenwser + widthER, y: yvaluewrer + radiuswser * 2
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
                var lineg = newg.append("g").data([{x: xvaluewrer + widthER, y: yvaluewrer}]);
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
                        dx2line[i] = d.x + lineLenwser;
                        return d.x + lineLenwser;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y;
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#end)")
                    .attr("cursor", "pointer");

                var linegtext = lineg.append("g").data([{
                    x: xvaluewrer + lineLenwser + 10 + widthER,
                    y: yvaluewrer + 5
                }]);
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
                    .attr("font-size", "8px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(textvalue);

                var linegcircle = lineg.append("g").data([{x: cxvaluewrer + widthER, y: cyvaluewrer}]);
                circlewithlineg[i] = linegcircle.append("circle")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", wallOfRoughER)
                    .attr("cx", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        dy[i] = d.y + radiuswser;
                        return d.y + radiuswser;
                    })
                    .attr("r", radiuswser)
                    .attr("fill", "lightgreen")
                    .attr("stroke-width", 20)
                    .attr("cursor", "move");

                if (textvalue2 != "single flux") {
                    var lineg2 = lineg.append("g").data([{
                        x: xvaluewrer + widthER,
                        y: yvaluewrer + radiuswser * 2
                    }]);
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
                            dx2line2[i] = d.x + lineLenwser;
                            return d.x + lineLenwser;
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
                        x: xvaluewrer + lineLenwser + 10 + widthER, y: yvaluewrer + radiuswser * 2 + 5
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
                var lineg = newg.append("g").data([{x: xvaluewrer + widthER, y: yvaluewrer}]);
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
                        dx2line[i] = d.x + lineLenwser;
                        return d.x + lineLenwser;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y;
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-start", "url(#start)")
                    .attr("cursor", "pointer");

                var linegtext = lineg.append("g").data([{
                    x: xvaluewrer - lineLenwser + widthER,
                    y: yvaluewrer
                }]);
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
                    .attr("font-size", "8px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(textvalue);

                var linegcircle = lineg.append("g").data([{x: cxvaluewrer + widthER, y: cyvaluewrer}]);
                circlewithlineg[i] = linegcircle.append("circle")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", wallOfRoughER)
                    .attr("cx", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        dy[i] = d.y + radiuswser;
                        return d.y + radiuswser;
                    })
                    .attr("r", radiuswser)
                    .attr("fill", "lightgreen")
                    .attr("stroke-width", 20)
                    .attr("cursor", "move");

                if (textvalue2 != "single flux") {
                    var lineg2 = lineg.append("g").data([{
                        x: xvaluewrer + widthER,
                        y: yvaluewrer + radiuswser * 2
                    }]);
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
                            dx2line2[i] = d.x + lineLenwser;
                            return d.x + lineLenwser;
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
                        x: xvaluewrer + lineLenwser + 10 + widthER, y: yvaluewrer + radiuswser * 2 + 5
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
                var lineg = newg.append("g").data([{x: xvaluewrer + widthER, y: yvaluewrer}]);
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
                        dx2line[i] = d.x + lineLenwser;
                        return d.x + lineLenwser;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y;
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#end)")
                    .attr("cursor", "pointer");

                var linegtext = lineg.append("g").data([{
                    x: xvaluewrer + lineLenwser + 10 + widthER,
                    y: yvaluewrer + 5
                }]);
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
                    .attr("font-size", "8px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(textvalue);

                var linegcircle = lineg.append("g").data([{x: cxvaluewrer + widthER, y: cyvaluewrer}]);
                circlewithlineg[i] = linegcircle.append("circle")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", wallOfRoughER)
                    .attr("cx", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        dy[i] = d.y + radiuswser;
                        return d.y + radiuswser;
                    })
                    .attr("r", radiuswser)
                    .attr("fill", "lightgreen")
                    .attr("stroke-width", 20)
                    .attr("cursor", "move");

                if (textvalue2 != "single flux") {
                    var lineg2 = lineg.append("g").data([{
                        x: xvaluewrer + widthER,
                        y: yvaluewrer + radiuswser * 2
                    }]);
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
                            dx2line2[i] = d.x + lineLenwser;
                            return d.x + lineLenwser;
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
                        x: xvaluewrer - lineLenwser + widthER, y: yvaluewrer + radiuswser * 2
                    }]);
                    linewithtextg2[i] = linegtext2.append("text")
                        .attr("id", "linewithtextg2" + i)
                        .attr("x", function (d) {
                            dxtext2[i] = d.x;
                            return d.x;
                        })
                        .attr("y", function (d) {
                            dytext2[i] = d.y;
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
                var lineg = newg.append("g").data([{x: xvaluewrer + widthER, y: yvaluewrer}]);
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
                        dx2line[i] = d.x + lineLenwser;
                        return d.x + lineLenwser;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y;
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#end)")
                    .attr("cursor", "pointer");

                var linegtext = lineg.append("g").data([{
                    x: xvaluewrer + lineLenwser + 10 + widthER,
                    y: yvaluewrer + 5
                }]);
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
                    .attr("font-size", "8px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(textvalue);

                var linegcircle = lineg.append("g").data([{x: cxvaluewrer + widthER, y: cyvaluewrer}]);
                circlewithlineg[i] = linegcircle.append("circle")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", wallOfRoughER)
                    .attr("cx", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        dy[i] = d.y + radiuswser;
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
                var lineg = newg.append("g").data([{x: xvaluewrer + widthER, y: yvaluewrer}]);
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
                        dx2line[i] = d.x + lineLenwser;
                        return d.x + lineLenwser;
                    })
                    .attr("y2", function (d) {
                        dy2line[i] = d.y;
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-start", "url(#start)")
                    .attr("cursor", "pointer");

                var linegtext = lineg.append("g").data([{
                    x: xvaluewrer - lineLenwser + widthER,
                    y: yvaluewrer
                }]);
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
                    .attr("font-size", "8px")
                    .attr("font-weight", "bold")
                    .attr("fill", "red")
                    .attr("cursor", "pointer")
                    .text(textvalue);

                var linegcircle = lineg.append("g").data([{x: cxvaluewrer + widthER, y: cyvaluewrer}]);
                circlewithlineg[i] = linegcircle.append("circle")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", wallOfRoughER)
                    .attr("cx", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        dy[i] = d.y + radiuswser;
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
                var polygong = newg.append("g").data([{x: xvaluewrer - 10 + widthER, y: (yvaluewrer)}]);
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
                    .attr("transform", "translate(" + (xvaluewrer - 10 + widthER) + "," + (yvaluewrer - 30) + ")")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", wallOfRoughER)
                    .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                    .attr("fill", "yellow")
                    .attr("stroke", "black")
                    .attr("stroke-linecap", "round")
                    .attr("stroke-linejoin", "round")
                    .attr("cursor", "move");

                var polygontext = polygong.append("g").data([{
                    x: xvaluewrer + polygonlineLen + widthER,
                    y: yvaluewrer + 5
                }]);

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
                    .attr("font-size", "8px")
                    .attr("fill", "red")
                    .attr("cursor", "move")
                    .text(textvalue);

                // increment x-axis of line and circle
                yvaluewrer += ydistancewrer;
                cyvaluewrer += ydistancewrer;

                // circle for IP3 receptor
                var linegcircle = polygong.append("g").data([{
                    x: xvaluewrer + 30 + widthER,
                    y: yvaluewrer - 55
                }]);
                circlewithlinegIP3[i] = linegcircle.append("circle")
                    .attr("id", "circlewithlinegIP3" + tempID)
                    .attr("cx", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        dy[i] = d.y;
                        return d.y;
                    })
                    .attr("r", 10)
                    .attr("fill", "lightgreen")
                    .attr("stroke-width", 20)
                    .attr("cursor", "move");

                linewithtextg2[i] = linegcircle.append("text")
                    .attr("id", "linewithtextg2" + tempID)
                    .attr("x", function (d) {
                        dxtext2[i] = d.x - 8;
                        return d.x - 8;
                    })
                    .attr("y", function (d) {
                        dytext2[i] = d.y + 4;
                        return d.y + 4;
                    })
                    .attr("font-size", "10px")
                    .attr("fill", "red")
                    .attr("cursor", "move")
                    .text("IP3");
            }

            // case 8
            if ((src_fma == cytosolID && snk_fma == ER) && (src_fma2 == "IP3 flux" && snk_fma2 == "IP3 flux")) {
                var polygong = newg.append("g").data([{x: xvaluewrer - 10 + widthER, y: (yvaluewrer)}]);
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
                polygon[i] = polygong.append("g").append("polygon")
                    .attr("transform", "translate(" + (xvaluewrer - 10 + widthER) + "," + (yvaluewrer - 30) + ")")
                    .attr("id", function (d) {
                        return [
                            source_name, source_name2,
                            textvalue, textvalue2, snk_textvalue, snk_textvalue2,
                            src_fma, src_fma2, snk_fma, snk_fma2
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", wallOfRoughER)
                    .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                    .attr("fill", "yellow")
                    .attr("stroke", "black")
                    .attr("stroke-linecap", "round")
                    .attr("stroke-linejoin", "round")
                    .attr("cursor", "move");

                var polygontext = polygong.append("g").data([{
                    x: xvaluewrer - 10 - polygonlineLen + widthER,
                    y: yvaluewrer + 5
                }]);

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
                    .attr("font-size", "8px")
                    .attr("fill", "red")
                    .attr("cursor", "move")
                    .text(textvalue);

                // increment x-axis of line and circle
                yvaluewrer += ydistancewrer;
                cyvaluewrer += ydistancewrer;

                // circle for IP3 receptor
                var linegcircle = polygong.append("g").data([{
                    x: xvaluewrer + 30 + widthER,
                    y: yvaluewrer - 55
                }]);
                circlewithlinegIP3[i] = linegcircle.append("circle")
                    .attr("id", "circlewithlinegIP3" + tempID)
                    .attr("cx", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        dy[i] = d.y;
                        return d.y;
                    })
                    .attr("r", 10)
                    .attr("fill", "lightgreen")
                    .attr("stroke-width", 20)
                    .attr("cursor", "move");

                linewithtextg2[i] = linegcircle.append("text")
                    .attr("id", "linewithtextg2" + tempID)
                    .attr("x", function (d) {
                        dxtext2[i] = d.x - 8;
                        return d.x - 8;
                    })
                    .attr("y", function (d) {
                        dytext2[i] = d.y + 4;
                        return d.y + 4;
                    })
                    .attr("font-size", "10px")
                    .attr("fill", "red")
                    .attr("cursor", "move")
                    .text("IP3");
            }

            // case 9
            if ((src_fma == ER && snk_fma == cytosolID) && (src_fma2 == "leak" && snk_fma2 == "leak")) {
                var leakg = newg.append("g").data([{x: xvaluewrer - 10 + widthER, y: (yvaluewrer)}]);
                var leaktextg = leakg.append("g").data([{
                    x: xvaluewrer + polygonlineLen + widthER,
                    y: yvaluewrer + 5
                }]);

                circlewithlineg[i] = leaktextg.append("text")
                    .attr("id", "linewithtextg" + tempID)
                    .attr("index", tempID)
                    .attr("membrane", wallOfRoughER)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
                        return d.y;
                    })
                    .attr("font-size", "8px")
                    .attr("fill", "red")
                    .attr("cursor", "move")
                    .text(textvalue);

                linewithlineg[i] = leakg.append("line")
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

                // increment x-axis of line and circle
                yvaluewrer += ydistancewrer;
                cyvaluewrer += ydistancewrer;
            }

            // case 10
            if ((src_fma == cytosolID && snk_fma == ER) && (src_fma2 == "leak" && snk_fma2 == "leak")) {
                var leakg = newg.append("g").data([{x: xvaluewrer - 10 + widthER, y: (yvaluewrer)}]);
                var leaktextg = leakg.append("g").data([{
                    x: xvaluewrer - 10 - polygonlineLen + widthER,
                    y: yvaluewrer + 5
                }]);

                circlewithlineg[i] = leaktextg.append("text")
                    .attr("id", "linewithtextg" + tempID)
                    .attr("index", tempID)
                    .attr("membrane", wallOfRoughER)
                    .attr("x", function (d) {
                        dx[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dy[i] = d.y;
                        return d.y;
                    })
                    .attr("font-size", "8px")
                    .attr("fill", "red")
                    .attr("cursor", "move")
                    .text(textvalue);

                linewithlineg[i] = leakg.append("line")
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

                // increment x-axis of line and circle
                yvaluewrer += ydistancewrer;
                cyvaluewrer += ydistancewrer;
            }
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

                    var m = new welcomeModal({
                        id: 'myWelcomeModal',
                        header: 'Are you sure you want to move?',
                        footer: 'My footer',
                        footerCloseButton: 'No',
                        footerSaveButton: 'Yes'
                    });

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
                                    win.find('.modal-header').prepend('<button type="button" class="close" data-dismiss="modal">&times;</button>');
                                }
                            }

                            if ($this.options.footer) {
                                win.append('<div class="modal-footer"></div>');

                                if ($this.options.footerCloseButton) {
                                    win.find('.modal-footer').append('<a data-dismiss="modal" href="#" class="btn btn-default" lang="de">' + $this.options.footerCloseButton + '</a>');
                                }

                                if ($this.options.footerSaveButton) {
                                    win.find('.modal-footer').append('<a data-dismiss="modal" href="#" class="btn btn-default" lang="de">' + $this.options.footerSaveButton + '</a>');
                                }
                            }

                            // No button clicked!!
                            win[0].lastElementChild.children[0].onclick = function (event) {
                                console.log("No clicked!");
                                moveBack();
                                membraneColorBack();
                            }

                            // Yes button clicked!!
                            win[0].lastElementChild.children[1].onclick = function (event) {
                                console.log("Yes clicked!");

                                var m = new Modal({
                                    id: 'myModal',
                                    header: 'Recommender System',
                                    footer: 'My footer',
                                    footerCloseButton: 'Close',
                                    footerSaveButton: 'Save'
                                });

                                m.getBody().html('<div id="modalBody"></div>');
                                m.show();

                                showLoading("#modalBody");

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

                                jQuery(window).trigger('resize');
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

                            return;
                        }

                        relatedMembraneModel(workspaceName, membraneName);

                    }, true);
            }, true);
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

    // utility function
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
                if (win[0].children[1].children[0].children[12] != undefined) {
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
                }

                // checkbox!!
                if (win[0].children[1].children[0].children[13] != undefined) {
                    for (var i = 0; i < win[0].children[1].children[0].children[13].getElementsByTagName("input").length; i++) {
                        if (win[0].children[1].children[0].children[13].getElementsByTagName("input")[i].checked) {

                            console.log("Alternative model clicked!!");

                            console.log("checked: ", win[0].children[1].children[0].children[13].getElementsByTagName("input")[i].checked);
                            console.log("id: ", win[0].children[1].children[0].children[13].getElementsByTagName("input")[i].id);
                        }
                    }
                }

                // checkbox!!
                if (win[0].children[1].children[0].children[14] != undefined) {
                    for (var i = 0; i < win[0].children[1].children[0].children[14].getElementsByTagName("input").length; i++) {
                        if (win[0].children[1].children[0].children[14].getElementsByTagName("input")[i].checked) {

                            console.log("Related cellml model clicked!!");

                            console.log("checked: ", win[0].children[1].children[0].children[14].getElementsByTagName("input")[i].checked);
                            console.log("id: ", win[0].children[1].children[0].children[14].getElementsByTagName("input")[i].id);
                        }
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
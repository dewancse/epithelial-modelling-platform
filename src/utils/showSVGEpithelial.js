/**
 * Created by dsar941 on 5/11/2017.
 */
var solutesBouncing = require("./solutesBouncing.js").solutesBouncing;
var getTextWidth = require("../utils/misc.js").getTextWidth;
var sendPostRequest = require("../libs/ajax-utils.js").sendPostRequest;

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

    // Code for drag and pop up .....
    var apicalCircle = "http://identifiers.org/fma/FMA:84666";
    var basolateralMembraneID = "http://identifiers.org/fma/FMA:84669";

    var endpoint = "https://models.physiomeproject.org/pmr2_virtuoso_search";

    // weinstein model
    var membraneOBJ = {
        source_text: "J_NHE3_Na",
        source_fma: apicalID,
        source_name: "weinstein_1995.cellml#NHE3.J_NHE3_Na"
    };

    // chang fujita epithelial model
    // var membraneOBJ = {
    //     source_text: "J_mc_Na",
    //     source_fma: apicalID,
    //     source_name: "chang_fujita_b_1999.cellml#mc_sodium_flux.J_mc_Na"
    // };

    // warren model
    // var membraneOBJ = {
    //     source_text: "J_mc_Na",
    //     source_fma: apicalID,
    //     source_name: "warren_2010.cellml#Jserca_Jserca"
    // };

    /*
     * relatedModel - all related models
     * relatedModelValue - filtered related models which have #protein
     * relatedModelID - relatedModel which have #protein
     * */
    var relatedModel = [], relatedModelValue = [], relatedModelID = [], workspaceName = "";
    var membraneModel = [], membraneModelValue = [], membraneModeID = [], membraneObject = [];
    var proteinName, cellmlModel, loc, typeOfModel, altCellmlModel = "", cthis;
    var idProtein = 0, idAltProtein = 0, idMembrane = 0, counterbr = 0, iGlobal, organIndex;

    var dx = [], dy = [],
        dxtext = [], dytext = [], dxtext2 = [], dytext2 = [],
        dx1line = [], dy1line = [], dx2line = [], dy2line = [],
        dx1line2 = [], dy1line2 = [], dx2line2 = [], dy2line2 = [];

    var id = 0;

    var tempJSON = [
        {
            "key": "Model: ",
            "value": "Chang_fujita"
        },
        {
            "key": "Biological_meaning: ",
            "value": "Flux of sodium from luminal to cytosol compartment through Na-Cl cotransporter, K-Cl cotransporter, and apical membrane"
        },
        {
            "key": "Species",
            "value": "RAT"
        },
        {
            "key": "Gene",
            "value": "SlAC5"
        },
        {
            "key": "Protein",
            "value": "Sodium Hydrogen 3 Antiporter"
        }
    ];

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
                    sink_fma2: "leak"
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
                    sink_fma2: "ATP"
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
                    sink_fma2: "p2y2"
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
                    sink_fma2: "channel"
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
                    sink_fma2: "leak"
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
                    sink_fma2: "ATP"
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
                    sink_fma2: "p2y2"
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
                    sink_fma2: "channel"
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
                    sink_fma2: "diffusive channel"
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
                    sink_fma2: membrane[i].sink_fma
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
                    sink_fma2: membrane[i].sink_fma
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

    var lineLen = 50, radius = 20, radiuswser = 15, lineLenwser = 40,
        polygonlineLen = 60,
        xvalue = xrect - lineLen / 2, // x coordinate before epithelial rectangle
        yvalue = yrect + 10 + 50, // initial distance 50
        yvalueb = yrect + 10 + 50, // initial distance 50
        xvaluewser = xER + 10 + 20, yvaluewser = yER - lineLen / 2,
        xvaluewrer = xER - lineLenwser / 2, yvaluewrer = yER + 10 + 20,
        ydistance = 70, ydistanceb = 70, xdistancewser = 40, ydistancewrer = 40,
        polygonlineg = [], polygon = [], polygontext = [], polygonlinegwser = [], polygonlinegwrer = [],
        leaktextwser = [], leaktextwrer = [], leaklinegwser = [], leaklinegwrer = [],
        leaklineg = [], leaktext = [], leaklinegb = [], leaktextb = [],
        polygonlinegb = [], polygonb = [], polygontextb = [], polygontextwser = [], polygontextwrer = [],
        circlewithlineg = [], linewithlineg = [], circletextwser = [], circletextwrer = [],
        linewithlineg2 = [], linewithtextg = [], linewithtextg2 = [],
        linewithlinegwser = [], linewithlineg2wser = [],
        linewithtextgwser = [], linewithtextg2wser = [], circlewithlinegwser = [],
        linewithlinegwrer = [], linewithlineg2wrer = [],
        linewithtextgwrer = [], linewithtextg2wrer = [], circlewithlinegwrer = [],
        circlewithlinegb = [], linewithlinegb = [],
        linewithlineg2b = [], linewithtextgb = [], linewithtextg2b = [],
        linewithlinegc = [], linewithtextgc = [],
        polygongctoc = [], polygonlinegctoc = [], polygontextctoc = [],
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

    var checkBox = [], checkBoxb = [], checkBoxc = [], checkBoxwser = [], checkBoxwrer = [],
        checkedchk = [], checkedchkb = [], checkedchkc = [],
        ydistancechk = 50, yinitialchk = 185,
        ytextinitialchk = 200,
        markerWidth = 4, markerHeight = 4;

    for (var i = 0; i < wallOfSmoothERMembrane.length; i++) {
        checkBoxwser[i] = new d3CheckBox();
    }

    for (var i = 0; i < wallOfRoughERMembrane.length; i++) {
        checkBoxwrer[i] = new d3CheckBox();
    }

    for (var i = 0; i < combinedMembrane.length; i++) {
        checkBox[i] = new d3CheckBox();
    }

    for (var i = 0; i < paracellularMembrane.length; i++) {
        checkBoxc[i] = new d3CheckBox();
    }

    var update = function () {
        for (var i = 0; i < combinedMembrane.length; i++) {
            if (combinedMembrane[i].source_text2 != "channel") {
                checkedchk[i] = checkBox[i].checked();
                // drag enable and disable
                if (checkedchk[i] == true) {
                    circlewithlineg[i].call(d3.drag().on("drag", dragcircleline));
                }
                else {
                    circlewithlineg[i].call(d3.drag().on("drag", dragcircleendchkbx));
                }
            } else {
                checkedchk[i] = checkBox[i].checked();
                // drag enable and disable
                if (checkedchk[i] == true) {
                    polygonlineg[i].call(d3.drag().on("drag", dragpolygonandline));
                    polygontext[i].call(d3.drag().on("drag", dragpolygonandline));
                    polygon[i].call(d3.drag().on("drag", dragpolygonandline));
                }
                else {
                    polygonlineg[i].call(d3.drag().on("drag", dragcircleendchkbx));
                    polygontext[i].call(d3.drag().on("drag", dragcircleendchkbx));
                    polygon[i].call(d3.drag().on("drag", dragcircleendchkbx));
                }
            }
        }

        for (var i = 0; i < paracellularMembrane.length; i++) {
            checkedchkc[i] = checkBoxc[i].checked();
            // drag enable and disable
            if (checkedchkc[i] == true) {
                linewithlinegc[i].call(d3.drag().on("drag", dragtextandline));
                linewithtextgc[i].call(d3.drag().on("drag", dragtextandline));
            }
            else {
                linewithlinegc[i].call(d3.drag().on("drag", dragcircleendchkbx));
                linewithtextgc[i].call(d3.drag().on("drag", dragcircleendchkbx));
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

    for (var i = 0; i < paracellularMembrane.length; i++) {
        var textvaluechkc = paracellularMembrane[i].source_text + " " + paracellularMembrane[i].source_text2;

        checkBoxc[i].x(850).y(yinitialchk).checked(false).clickEvent(update);
        checkBoxc[i].xtext(890).ytext(ytextinitialchk).text("" + textvaluechkc + "");

        checkboxsvg.call(checkBoxc[i]);

        yinitialchk += ydistancechk;
        ytextinitialchk += ydistancechk;
    }

    function dragcircleendchkbx(d) {
        d3.select(this).classed("dragging", false);
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

    // End of svg checkbox

    // remove duplicate model entity and biological meaning
    function uniqueify(es) {
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

            var polygontextg = polygongctoc.append("g").data([{
                x: xvaluectoc - 15 + 120,
                y: yvaluectoc - 15 + height
            }]);
            polygontextctoc[i] = polygontextg.append("text")
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

            var polygontextg = polygongwser.append("g").data([{x: xvaluewser - 15, y: yvaluewser - 15}]);
            polygontextwser[i] = polygontextg.append("text")
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

            var polygontextg = polygongwser.append("g").data([{
                x: xvaluewser - 15,
                y: yvaluewser + polygonlineLen + 15
            }]);

            polygontextwser[i] = polygontextg.append("text")
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

            var polygontextg = polygongwrer.append("g").data([{
                x: xvaluewrer + polygonlineLen + widthER,
                y: yvaluewrer + 5
            }]);

            polygontextwrer[i] = polygontextg.append("text")
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

            var polygontextg = polygongwrer.append("g").data([{
                x: xvaluewrer - 10 - polygonlineLen + widthER,
                y: yvaluewrer + 5
            }]);

            polygontextwrer[i] = polygontextg.append("text")
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

    // Apical and basolateral membrane
    for (var i = 0; i < combinedMembrane.length; i++) {
        var textvalue = combinedMembrane[i].source_text;
        var textvalue2 = combinedMembrane[i].source_text2;
        var src_fma = combinedMembrane[i].source_fma;
        var src_fma2 = combinedMembrane[i].source_fma2;
        var snk_fma = combinedMembrane[i].sink_fma;
        var snk_fma2 = combinedMembrane[i].sink_fma2;
        var textWidth = getTextWidth(textvalue, 12);

        // case 1
        if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == luminalID && snk_fma2 == cytosolID)) {
            var lineg = newg.append("g").data([{x: xvalue, y: yvalue}]);
            linewithlineg[i] = lineg.append("line")
                .attr("id", "linewithlineg" + linewithlineg.length)
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
                .attr("id", "linewithtextg" + linewithtextg.length)
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
                        membraneOBJ.source_text,
                        membraneOBJ.source_fma,
                        membraneOBJ.source_name
                    ];
                })
                .attr("index", circlewithlineg.length)
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
                    .attr("id", "linewithlineg2" + linewithlineg2.length)
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
                    .attr("id", "linewithtextg2" + linewithtextg2.length)
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
                .attr("id", "linewithlineg" + linewithlineg.length)
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
                .attr("id", "linewithtextg" + linewithtextg.length)
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
                        membraneOBJ.source_text,
                        membraneOBJ.source_fma,
                        membraneOBJ.source_name
                    ];
                })
                .attr("index", circlewithlineg.length)
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
                    .attr("id", "linewithlineg2" + linewithlineg2.length)
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
                    .attr("id", "linewithtextg2" + linewithtextg2.length)
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
                .attr("id", "linewithlineg" + linewithlineg.length)
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
                .attr("id", "linewithtextg" + linewithtextg.length)
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
                        membraneOBJ.source_text,
                        membraneOBJ.source_fma,
                        membraneOBJ.source_name
                    ];
                })
                .attr("index", circlewithlineg.length)
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
                    .attr("id", "linewithlineg2" + linewithlineg2.length)
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
                    .attr("id", "linewithtextg2" + linewithtextg2.length)
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
                .attr("id", "linewithlineg" + linewithlineg.length)
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
                .attr("id", "linewithtextg" + linewithtextg.length)
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
                        membraneOBJ.source_text,
                        membraneOBJ.source_fma,
                        membraneOBJ.source_name
                    ];
                })
                .attr("index", circlewithlineg.length)
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
                    .attr("id", "linewithlineg2" + linewithlineg2.length)
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
                    .attr("id", "linewithtextg2" + linewithtextg2.length)
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

        // case 1
        if ((src_fma == cytosolID && snk_fma == interstitialID) && (src_fma2 == cytosolID && snk_fma2 == interstitialID)) {
            var lineg = newg.append("g").data([{x: xvalue + width, y: yvalueb}]);
            linewithlineg[i] = lineg.append("line")
                .attr("id", "linewithlineg" + linewithlineg.length)
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
                .attr("id", "linewithtextg" + linewithtextg.length)
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
                        membraneOBJ.source_text,
                        membraneOBJ.source_fma,
                        membraneOBJ.source_name
                    ];
                })
                .attr("index", circlewithlineg.length)
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
                    .attr("id", "linewithlineg2" + linewithlineg2.length)
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
                    .attr("id", "linewithtextg2" + linewithtextg2.length)
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
                .attr("id", "linewithlineg" + linewithlineg.length)
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
                .attr("id", "linewithtextg" + linewithtextg.length)
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
                        membraneOBJ.source_text,
                        membraneOBJ.source_fma,
                        membraneOBJ.source_name
                    ];
                })
                .attr("index", circlewithlineg.length)
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
                    .attr("id", "linewithlineg2" + linewithlineg2.length)
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
                    .attr("id", "linewithtextg2" + linewithtextg2.length)
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
                .attr("id", "linewithlineg" + linewithlineg.length)
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
                .attr("id", "linewithtextg" + linewithtextg.length)
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
                        membraneOBJ.source_text,
                        membraneOBJ.source_fma,
                        membraneOBJ.source_name
                    ];
                })
                .attr("index", circlewithlineg.length)
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
                    .attr("id", "linewithlineg2" + linewithlineg2.length)
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
                    .attr("id", "linewithtextg2" + linewithtextg2.length)
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
                .attr("id", "linewithlineg" + linewithlineg.length)
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
                .attr("id", "linewithtextg" + linewithtextg.length)
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
                        membraneOBJ.source_text,
                        membraneOBJ.source_fma,
                        membraneOBJ.source_name
                    ];
                })
                .attr("index", circlewithlineg.length)
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
                    .attr("id", "linewithlineg2" + linewithlineg2.length)
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
                    .attr("id", "linewithtextg2" + linewithtextg2.length)
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
    }

    // // Basolateral membrane
    // for (var i = apicalMembrane.length; i < totalLength; i++) {
    //     var textvalue = basolateralMembrane[i].source_text;
    //     var textvalue2 = basolateralMembrane[i].source_text2;
    //     var src_fma = basolateralMembrane[i].source_fma;
    //     var src_fma2 = basolateralMembrane[i].source_fma2;
    //     var snk_fma = basolateralMembrane[i].sink_fma;
    //     var snk_fma2 = basolateralMembrane[i].sink_fma2;
    //     var textWidth = getTextWidth(textvalue, 12);
    //
    //     // case 1
    //     if ((src_fma == cytosolID && snk_fma == interstitialID) && (src_fma2 == cytosolID && snk_fma2 == interstitialID)) {
    //         var lineg = newg.append("g").data([{x: xvalue + width, y: yvalueb}]);
    //         linewithlineg[i] = lineg.append("line")
    //             .attr("id", "linewithlineg" + linewithlineg.length)
    //             .attr("x1", function (d) {
    //                 dx1line[i] = d.x;
    //                 return d.x;
    //             })
    //             .attr("y1", function (d) {
    //                 dy1line[i] = d.y;
    //                 return d.y;
    //             })
    //             .attr("x2", function (d) {
    //                 dx2line[i] = d.x + lineLen;
    //                 return d.x + lineLen;
    //             })
    //             .attr("y2", function (d) {
    //                 dy2line[i] = d.y;
    //                 return d.y;
    //             })
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 2)
    //             .attr("marker-end", "url(#end)")
    //             .attr("cursor", "pointer");
    //
    //         var linegtext = lineg.append("g").data([{x: xvalue + lineLen + 10 + width, y: yvalueb + 5}]);
    //         linewithtextg[i] = linegtext.append("text")
    //             .attr("id", "linewithtextg" + linewithtextg.length)
    //             .attr("x", function (d) {
    //                 dxtext[i] = d.x;
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 dytext[i] = d.y;
    //                 return d.y;
    //             })
    //             .attr("font-family", "Times New Roman")
    //             .attr("font-size", "12px")
    //             .attr("font-weight", "bold")
    //             .attr("fill", "red")
    //             .attr("cursor", "pointer")
    //             .text(textvalue);
    //
    //         var linegcircle = lineg.append("g").data([{x: cxvalue + width, y: cyvalueb}]);
    //         circlewithlineg[i] = linegcircle.append("circle")
    //             .attr("id", function (d) {
    //                 return [
    //                     membraneOBJ.source_text,
    //                     membraneOBJ.source_fma,
    //                     membraneOBJ.source_name
    //                 ];
    //             })
    //             .attr("index", circlewithlineg.length)
    //             .attr("membrane", basolateralID)
    //             .attr("cx", function (d) {
    //                 dx[i] = d.x;
    //                 return d.x;
    //             })
    //             .attr("cy", function (d) {
    //                 dy[i] = d.y + radius;
    //                 return d.y + radius;
    //             })
    //             .attr("r", radius)
    //             .attr("fill", "orange")
    //             .attr("stroke-width", 20)
    //             .attr("cursor", "move");
    //
    //         if (textvalue2 != "single flux") {
    //             var lineg2 = lineg.append("g").data([{x: xvalue + width, y: yvalueb + radius * 2}]);
    //             linewithlineg2[i] = lineg2.append("line")
    //                 .attr("id", "linewithlineg2" + linewithlineg2.length)
    //                 .attr("x1", function (d) {
    //                     dx1line2[i] = d.x;
    //                     return d.x;
    //                 })
    //                 .attr("y1", function (d) {
    //                     dy1line2[i] = d.y;
    //                     return d.y;
    //                 })
    //                 .attr("x2", function (d) {
    //                     dx2line2[i] = d.x + lineLen;
    //                     return d.x + lineLen;
    //                 })
    //                 .attr("y2", function (d) {
    //                     dy2line2[i] = d.y;
    //                     return d.y;
    //                 })
    //                 .attr("stroke", "black")
    //                 .attr("stroke-width", 2)
    //                 .attr("marker-end", "url(#end)")
    //                 .attr("cursor", "pointer");
    //
    //             var linegtext2 = lineg2.append("g").data([{
    //                 x: xvalue + lineLen + 10 + width, y: yvalueb + radius * 2 + markerHeight
    //             }]);
    //             linewithtextg2[i] = linegtext2.append("text")
    //                 .attr("id", "linewithtextg2" + linewithtextg2.length)
    //                 .attr("x", function (d) {
    //                     dxtext2[i] = d.x;
    //                     return d.x;
    //                 })
    //                 .attr("y", function (d) {
    //                     dytext2[i] = d.y;
    //                     return d.y;
    //                 })
    //                 .attr("font-family", "Times New Roman")
    //                 .attr("font-size", "12px")
    //                 .attr("font-weight", "bold")
    //                 .attr("fill", "red")
    //                 .attr("cursor", "pointer")
    //                 .text(textvalue2);
    //         }
    //
    //         // increment y-axis of line and circle
    //         yvalueb += ydistance;
    //         cyvalueb += ydistance;
    //     }
    //
    //     // case 2
    //     if ((src_fma == interstitialID && snk_fma == cytosolID) && (src_fma2 == interstitialID && snk_fma2 == cytosolID)) {
    //         var lineg = newg.append("g").data([{x: xvalue + width, y: yvalueb}]);
    //         linewithlineg[i] = lineg.append("line")
    //             .attr("id", "linewithlineg" + linewithlineg.length)
    //             .attr("x1", function (d) {
    //                 dx1line[i] = d.x;
    //                 return d.x;
    //             })
    //             .attr("y1", function (d) {
    //                 dy1line[i] = d.y;
    //                 return d.y;
    //             })
    //             .attr("x2", function (d) {
    //                 dx2line[i] = d.x + lineLen;
    //                 return d.x + lineLen;
    //             })
    //             .attr("y2", function (d) {
    //                 dy2line[i] = d.y;
    //                 return d.y;
    //             })
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 2)
    //             .attr("marker-start", "url(#start)")
    //             .attr("cursor", "pointer");
    //
    //         var linegtext = lineg.append("g").data([{x: xvalue - textWidth - 10 + width, y: yvalueb + 5}]);
    //         linewithtextg[i] = linegtext.append("text")
    //             .attr("id", "linewithtextg" + linewithtextg.length)
    //             .attr("x", function (d) {
    //                 dxtext[i] = d.x;
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 dytext[i] = d.y;
    //                 return d.y;
    //             })
    //             .attr("font-family", "Times New Roman")
    //             .attr("font-size", "12px")
    //             .attr("font-weight", "bold")
    //             .attr("fill", "red")
    //             .attr("cursor", "pointer")
    //             .text(textvalue);
    //
    //         var linegcircle = lineg.append("g").data([{x: cxvalue + width, y: cyvalueb}]);
    //         circlewithlineg[i] = linegcircle.append("circle")
    //             .attr("id", function (d) {
    //                 return [
    //                     membraneOBJ.source_text,
    //                     membraneOBJ.source_fma,
    //                     membraneOBJ.source_name
    //                 ];
    //             })
    //             .attr("index", circlewithlineg.length)
    //             .attr("membrane", basolateralID)
    //             .attr("cx", function (d) {
    //                 dx[i] = d.x;
    //                 return d.x;
    //             })
    //             .attr("cy", function (d) {
    //                 dy[i] = d.y + radius;
    //                 return d.y + radius;
    //             })
    //             .attr("r", radius)
    //             .attr("fill", "orange")
    //             .attr("stroke-width", 20)
    //             .attr("cursor", "move");
    //
    //         if (textvalue2 != "single flux") {
    //             var lineg2 = lineg.append("g").data([{x: xvalue + width, y: yvalueb + radius * 2}]);
    //             linewithlineg2[i] = lineg2.append("line")
    //                 .attr("id", "linewithlineg2" + linewithlineg2.length)
    //                 .attr("x1", function (d) {
    //                     dx1line2[i] = d.x;
    //                     return d.x;
    //                 })
    //                 .attr("y1", function (d) {
    //                     dy1line2[i] = d.y;
    //                     return d.y;
    //                 })
    //                 .attr("x2", function (d) {
    //                     dx2line2[i] = d.x + lineLen;
    //                     return d.x + lineLen;
    //                 })
    //                 .attr("y2", function (d) {
    //                     dy2line2[i] = d.y;
    //                     return d.y;
    //                 })
    //                 .attr("stroke", "black")
    //                 .attr("stroke-width", 2)
    //                 .attr("marker-start", "url(#start)")
    //                 .attr("cursor", "pointer");
    //
    //             var linegtext2 = lineg2.append("g").data([{
    //                 x: xvalue - textWidth - 10 + width, y: yvalueb + radius * 2 + markerHeight
    //             }]);
    //             linewithtextg2[i] = linegtext2.append("text")
    //                 .attr("id", "linewithtextg2" + linewithtextg2.length)
    //                 .attr("x", function (d) {
    //                     dxtext2[i] = d.x;
    //                     return d.x;
    //                 })
    //                 .attr("y", function (d) {
    //                     dytext2[i] = d.y;
    //                     return d.y;
    //                 })
    //                 .attr("font-family", "Times New Roman")
    //                 .attr("font-size", "12px")
    //                 .attr("font-weight", "bold")
    //                 .attr("fill", "red")
    //                 .attr("cursor", "pointer")
    //                 .text(textvalue2);
    //         }
    //
    //         // increment y-axis of line and circle
    //         yvalueb += ydistance;
    //         cyvalueb += ydistance;
    //     }
    //
    //     // case 3
    //     if ((src_fma == cytosolID && snk_fma == interstitialID) && (src_fma2 == interstitialID && snk_fma2 == cytosolID)) {
    //         var lineg = newg.append("g").data([{x: xvalue + width, y: yvalueb}]);
    //         linewithlineg[i] = lineg.append("line")
    //             .attr("id", "linewithlineg" + linewithlineg.length)
    //             .attr("x1", function (d) {
    //                 dx1line[i] = d.x;
    //                 return d.x;
    //             })
    //             .attr("y1", function (d) {
    //                 dy1line[i] = d.y;
    //                 return d.y;
    //             })
    //             .attr("x2", function (d) {
    //                 dx2line[i] = d.x + lineLen;
    //                 return d.x + lineLen;
    //             })
    //             .attr("y2", function (d) {
    //                 dy2line[i] = d.y;
    //                 return d.y;
    //             })
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 2)
    //             .attr("marker-end", "url(#end)")
    //             .attr("cursor", "pointer");
    //
    //         var linegtext = lineg.append("g").data([{x: xvalue + lineLen + 10 + width, y: yvalueb + 5}]);
    //         linewithtextg[i] = linegtext.append("text")
    //             .attr("id", "linewithtextg" + linewithtextg.length)
    //             .attr("x", function (d) {
    //                 dxtext[i] = d.x;
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 dytext[i] = d.y;
    //                 return d.y;
    //             })
    //             .attr("font-family", "Times New Roman")
    //             .attr("font-size", "12px")
    //             .attr("font-weight", "bold")
    //             .attr("fill", "red")
    //             .attr("cursor", "pointer")
    //             .text(textvalue);
    //
    //         var linegcircle = lineg.append("g").data([{x: cxvalue + width, y: cyvalueb}]);
    //         circlewithlineg[i] = linegcircle.append("circle")
    //             .attr("id", function (d) {
    //                 return [
    //                     membraneOBJ.source_text,
    //                     membraneOBJ.source_fma,
    //                     membraneOBJ.source_name
    //                 ];
    //             })
    //             .attr("index", circlewithlineg.length)
    //             .attr("membrane", basolateralID)
    //             .attr("cx", function (d) {
    //                 dx[i] = d.x;
    //                 return d.x;
    //             })
    //             .attr("cy", function (d) {
    //                 dy[i] = d.y + radius;
    //                 return d.y + radius;
    //             })
    //             .attr("r", radius)
    //             .attr("fill", "orange")
    //             .attr("stroke-width", 20)
    //             .attr("cursor", "move");
    //
    //         if (textvalue2 != "single flux") {
    //             var lineg2 = lineg.append("g").data([{x: xvalue + width, y: yvalueb + radius * 2}]);
    //             linewithlineg2[i] = lineg2.append("line")
    //                 .attr("id", "linewithlineg2" + linewithlineg2.length)
    //                 .attr("x1", function (d) {
    //                     dx1line2[i] = d.x;
    //                     return d.x;
    //                 })
    //                 .attr("y1", function (d) {
    //                     dy1line2[i] = d.y;
    //                     return d.y;
    //                 })
    //                 .attr("x2", function (d) {
    //                     dx2line2[i] = d.x + lineLen;
    //                     return d.x + lineLen;
    //                 })
    //                 .attr("y2", function (d) {
    //                     dy2line2[i] = d.y;
    //                     return d.y;
    //                 })
    //                 .attr("stroke", "black")
    //                 .attr("stroke-width", 2)
    //                 .attr("marker-start", "url(#start)")
    //                 .attr("cursor", "pointer");
    //
    //             var linegtext2 = lineg2.append("g").data([{
    //                 x: xvalue - textWidth - 10 + width, y: yvalueb + radius * 2 + markerHeight
    //             }]);
    //             linewithtextg2[i] = linegtext2.append("text")
    //                 .attr("id", "linewithtextg2" + linewithtextg2.length)
    //                 .attr("x", function (d) {
    //                     dxtext2[i] = d.x;
    //                     return d.x;
    //                 })
    //                 .attr("y", function (d) {
    //                     dytext2[i] = d.y;
    //                     return d.y;
    //                 })
    //                 .attr("font-family", "Times New Roman")
    //                 .attr("font-size", "12px")
    //                 .attr("font-weight", "bold")
    //                 .attr("fill", "red")
    //                 .attr("cursor", "pointer")
    //                 .text(textvalue2);
    //         }
    //
    //         // increment y-axis of line and circle
    //         yvalueb += ydistance;
    //         cyvalueb += ydistance;
    //     }
    //
    //     // case 4
    //     if ((src_fma == interstitialID && snk_fma == cytosolID) && (src_fma2 == cytosolID && snk_fma2 == interstitialID)) {
    //         var lineg = newg.append("g").data([{x: xvalue + width, y: yvalueb}]);
    //         linewithlineg[i] = lineg.append("line")
    //             .attr("id", "linewithlineg" + linewithlineg.length)
    //             .attr("x1", function (d) {
    //                 dx1line[i] = d.x;
    //                 return d.x;
    //             })
    //             .attr("y1", function (d) {
    //                 dy1line[i] = d.y;
    //                 return d.y;
    //             })
    //             .attr("x2", function (d) {
    //                 dx2line[i] = d.x + lineLen;
    //                 return d.x + lineLen;
    //             })
    //             .attr("y2", function (d) {
    //                 dy2line[i] = d.y;
    //                 return d.y;
    //             })
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 2)
    //             .attr("marker-start", "url(#start)")
    //             .attr("cursor", "pointer");
    //
    //         var linegtext = lineg.append("g").data([{x: xvalue - textWidth - 10 + width, y: yvalueb + 5}]);
    //         linewithtextg[i] = linegtext.append("text")
    //             .attr("id", "linewithtextg" + linewithtextg.length)
    //             .attr("x", function (d) {
    //                 dxtext[i] = d.x;
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 dytext[i] = d.y;
    //                 return d.y;
    //             })
    //             .attr("font-family", "Times New Roman")
    //             .attr("font-size", "12px")
    //             .attr("font-weight", "bold")
    //             .attr("fill", "red")
    //             .attr("cursor", "pointer")
    //             .text(textvalue);
    //
    //         var linegcircle = lineg.append("g").data([{x: cxvalue + width, y: cyvalueb}]);
    //         circlewithlineg[i] = linegcircle.append("circle")
    //             .attr("id", function (d) {
    //                 return [
    //                     membraneOBJ.source_text,
    //                     membraneOBJ.source_fma,
    //                     membraneOBJ.source_name
    //                 ];
    //             })
    //             .attr("index", circlewithlineg.length)
    //             .attr("membrane", basolateralID)
    //             .attr("cx", function (d) {
    //                 dx[i] = d.x;
    //                 return d.x;
    //             })
    //             .attr("cy", function (d) {
    //                 dy[i] = d.y + radius;
    //                 return d.y + radius;
    //             })
    //             .attr("r", radius)
    //             .attr("fill", "orange")
    //             .attr("stroke-width", 20)
    //             .attr("cursor", "move");
    //
    //         if (textvalue2 != "single flux") {
    //             var lineg2 = lineg.append("g").data([{x: xvalue + width, y: yvalueb + radius * 2}]);
    //             linewithlineg2[i] = lineg2.append("line")
    //                 .attr("id", "linewithlineg2" + linewithlineg2.length)
    //                 .attr("x1", function (d) {
    //                     dx1line2[i] = d.x;
    //                     return d.x;
    //                 })
    //                 .attr("y1", function (d) {
    //                     dy1line2[i] = d.y;
    //                     return d.y;
    //                 })
    //                 .attr("x2", function (d) {
    //                     dx2line2[i] = d.x + lineLen;
    //                     return d.x + lineLen;
    //                 })
    //                 .attr("y2", function (d) {
    //                     dy2line2[i] = d.y;
    //                     return d.y;
    //                 })
    //                 .attr("stroke", "black")
    //                 .attr("stroke-width", 2)
    //                 .attr("marker-end", "url(#end)")
    //                 .attr("cursor", "pointer");
    //
    //             var linegtext2 = lineg2.append("g").data([{
    //                 x: xvalue + lineLen + 10 + width, y: yvalueb + radius * 2 + markerHeight
    //             }]);
    //             linewithtextg2[i] = linegtext2.append("text")
    //                 .attr("id", "linewithtextg2" + linewithtextg2.length)
    //                 .attr("x", function (d) {
    //                     dxtext2[i] = d.x;
    //                     return d.x;
    //                 })
    //                 .attr("y", function (d) {
    //                     dytext2[i] = d.y;
    //                     return d.y;
    //                 })
    //                 .attr("font-family", "Times New Roman")
    //                 .attr("font-size", "12px")
    //                 .attr("font-weight", "bold")
    //                 .attr("fill", "red")
    //                 .attr("cursor", "pointer")
    //                 .text(textvalue2);
    //         }
    //
    //         // increment y-axis of line and circle
    //         yvalueb += ydistance;
    //         cyvalueb += ydistance;
    //     }
    // }

    // // Apical membrane
    // for (var i = 0; i < apicalMembrane.length; i++) {
    //     var textvalue = apicalMembrane[i].source_text;
    //     var textvalue2 = apicalMembrane[i].source_text2;
    //     var src_fma = apicalMembrane[i].source_fma;
    //     var src_fma2 = apicalMembrane[i].source_fma2;
    //     var snk_fma = apicalMembrane[i].sink_fma;
    //     var snk_fma2 = apicalMembrane[i].sink_fma2;
    //     var textWidth = getTextWidth(textvalue, 12);
    //
    //     // case 1
    //     if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == luminalID && snk_fma2 == cytosolID)) {
    //         var lineg = newg.append("g").data([{x: xvalue, y: yvalue}]);
    //         linewithlineg[i] = lineg.append("line")
    //             .attr("id", "linewithlineg" + linewithlineg.length)
    //             .attr("x1", function (d) {
    //                 dx1line[i] = d.x;
    //                 return d.x;
    //             })
    //             .attr("y1", function (d) {
    //                 dy1line[i] = d.y;
    //                 return d.y;
    //             })
    //             .attr("x2", function (d) {
    //                 dx2line[i] = d.x + lineLen;
    //                 return d.x + lineLen;
    //             })
    //             .attr("y2", function (d) {
    //                 dy2line[i] = d.y;
    //                 return d.y;
    //             })
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 2)
    //             .attr("marker-end", "url(#end)")
    //             .attr("cursor", "pointer");
    //
    //         var linegtext = lineg.append("g").data([{x: xvalue + lineLen + 10, y: yvalue + 5}]);
    //         linewithtextg[i] = linegtext.append("text")
    //             .attr("id", "linewithtextg" + linewithtextg.length)
    //             .attr("x", function (d) {
    //                 dxtext[i] = d.x;
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 dytext[i] = d.y;
    //                 return d.y;
    //             })
    //             .attr("font-family", "Times New Roman")
    //             .attr("font-size", "12px")
    //             .attr("font-weight", "bold")
    //             .attr("fill", "red")
    //             .attr("cursor", "pointer")
    //             .text(textvalue);
    //
    //         var linegcircle = lineg.append("g").data([{x: cxvalue, y: cyvalue}]);
    //         circlewithlineg[i] = linegcircle.append("circle")
    //             .attr("id", function (d) {
    //                 return [
    //                     membraneOBJ.source_text,
    //                     membraneOBJ.source_fma,
    //                     membraneOBJ.source_name
    //                 ];
    //             })
    //             .attr("index", circlewithlineg.length)
    //             .attr("membrane", apicalID)
    //             .attr("cx", function (d) {
    //                 dx[i] = d.x;
    //                 return d.x;
    //             })
    //             .attr("cy", function (d) {
    //                 dy[i] = d.y + radius;
    //                 return d.y + radius;
    //             })
    //             .attr("r", radius)
    //             .attr("fill", "lightgreen")
    //             .attr("stroke-width", 20)
    //             .attr("cursor", "move");
    //
    //         if (textvalue2 != "single flux") {
    //             var lineg2 = lineg.append("g").data([{x: xvalue, y: yvalue + radius * 2}]);
    //             linewithlineg2[i] = lineg2.append("line")
    //                 .attr("id", "linewithlineg2" + linewithlineg2.length)
    //                 .attr("x1", function (d) {
    //                     dx1line2[i] = d.x;
    //                     return d.x;
    //                 })
    //                 .attr("y1", function (d) {
    //                     dy1line2[i] = d.y;
    //                     return d.y;
    //                 })
    //                 .attr("x2", function (d) {
    //                     dx2line2[i] = d.x + lineLen;
    //                     return d.x + lineLen;
    //                 })
    //                 .attr("y2", function (d) {
    //                     dy2line2[i] = d.y;
    //                     return d.y;
    //                 })
    //                 .attr("stroke", "black")
    //                 .attr("stroke-width", 2)
    //                 .attr("marker-end", "url(#end)")
    //                 .attr("cursor", "pointer");
    //
    //             var linegtext2 = lineg2.append("g").data([{
    //                 x: xvalue + lineLen + 10, y: yvalue + radius * 2 + markerHeight
    //             }]);
    //             linewithtextg2[i] = linegtext2.append("text")
    //                 .attr("id", "linewithtextg2" + linewithtextg2.length)
    //                 .attr("x", function (d) {
    //                     dxtext2[i] = d.x;
    //                     return d.x;
    //                 })
    //                 .attr("y", function (d) {
    //                     dytext2[i] = d.y;
    //                     return d.y;
    //                 })
    //                 .attr("font-family", "Times New Roman")
    //                 .attr("font-size", "12px")
    //                 .attr("font-weight", "bold")
    //                 .attr("fill", "red")
    //                 .attr("cursor", "pointer")
    //                 .text(textvalue2);
    //         }
    //
    //         // increment y-axis of line and circle
    //         yvalue += ydistance;
    //         cyvalue += ydistance;
    //     }
    //
    //     // case 2
    //     if ((src_fma == cytosolID && snk_fma == luminalID) && (src_fma2 == cytosolID && snk_fma2 == luminalID)) {
    //         var lineg = newg.append("g").data([{x: xvalue, y: yvalue}]);
    //         linewithlineg[i] = lineg.append("line")
    //             .attr("id", "linewithlineg" + linewithlineg.length)
    //             .attr("x1", function (d) {
    //                 dx1line[i] = d.x;
    //                 return d.x;
    //             })
    //             .attr("y1", function (d) {
    //                 dy1line[i] = d.y;
    //                 return d.y;
    //             })
    //             .attr("x2", function (d) {
    //                 dx2line[i] = d.x + lineLen;
    //                 return d.x + lineLen;
    //             })
    //             .attr("y2", function (d) {
    //                 dy2line[i] = d.y;
    //                 return d.y;
    //             })
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 2)
    //             .attr("marker-start", "url(#start)")
    //             .attr("cursor", "pointer");
    //
    //         var linegtext = lineg.append("g").data([{x: xvalue - textWidth - 10, y: yvalue + 5}]);
    //         linewithtextg[i] = linegtext.append("text")
    //             .attr("id", "linewithtextg" + linewithtextg.length)
    //             .attr("x", function (d) {
    //                 dxtext[i] = d.x;
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 dytext[i] = d.y;
    //                 return d.y;
    //             })
    //             .attr("font-family", "Times New Roman")
    //             .attr("font-size", "12px")
    //             .attr("font-weight", "bold")
    //             .attr("fill", "red")
    //             .attr("cursor", "pointer")
    //             .text(textvalue);
    //
    //         var linegcircle = lineg.append("g").data([{x: cxvalue, y: cyvalue}]);
    //         circlewithlineg[i] = linegcircle.append("circle")
    //             .attr("id", function (d) {
    //                 return [
    //                     membraneOBJ.source_text,
    //                     membraneOBJ.source_fma,
    //                     membraneOBJ.source_name
    //                 ];
    //             })
    //             .attr("index", circlewithlineg.length)
    //             .attr("membrane", apicalID)
    //             .attr("cx", function (d) {
    //                 dx[i] = d.x;
    //                 return d.x;
    //             })
    //             .attr("cy", function (d) {
    //                 dy[i] = d.y + radius;
    //                 return d.y + radius;
    //             })
    //             .attr("r", radius)
    //             .attr("fill", "lightgreen")
    //             .attr("stroke-width", 20)
    //             .attr("cursor", "move");
    //
    //         if (textvalue2 != "single flux") {
    //             var lineg2 = lineg.append("g").data([{x: xvalue, y: yvalue + radius * 2}]);
    //             linewithlineg2[i] = lineg2.append("line")
    //                 .attr("id", "linewithlineg2" + linewithlineg2.length)
    //                 .attr("x1", function (d) {
    //                     dx1line2[i] = d.x;
    //                     return d.x;
    //                 })
    //                 .attr("y1", function (d) {
    //                     dy1line2[i] = d.y;
    //                     return d.y;
    //                 })
    //                 .attr("x2", function (d) {
    //                     dx2line2[i] = d.x + lineLen;
    //                     return d.x + lineLen;
    //                 })
    //                 .attr("y2", function (d) {
    //                     dy2line2[i] = d.y;
    //                     return d.y;
    //                 })
    //                 .attr("stroke", "black")
    //                 .attr("stroke-width", 2)
    //                 .attr("marker-end", "url(#end)")
    //                 .attr("cursor", "pointer");
    //
    //             var linegtext2 = lineg2.append("g").data([{
    //                 x: xvalue - textWidth - 10, y: yvalue + radius * 2 + markerHeight
    //             }]);
    //             linewithtextg2[i] = linegtext2.append("text")
    //                 .attr("id", "linewithtextg2" + linewithtextg2.length)
    //                 .attr("x", function (d) {
    //                     dxtext2[i] = d.x;
    //                     return d.x;
    //                 })
    //                 .attr("y", function (d) {
    //                     dytext2[i] = d.y;
    //                     return d.y;
    //                 })
    //                 .attr("font-family", "Times New Roman")
    //                 .attr("font-size", "12px")
    //                 .attr("font-weight", "bold")
    //                 .attr("fill", "red")
    //                 .attr("cursor", "pointer")
    //                 .text(textvalue2);
    //         }
    //
    //         // increment y-axis of line and circle
    //         yvalue += ydistance;
    //         cyvalue += ydistance;
    //     }
    //
    //     // case 3
    //     if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == cytosolID && snk_fma2 == luminalID)) {
    //         var lineg = newg.append("g").data([{x: xvalue, y: yvalue}]);
    //         linewithlineg[i] = lineg.append("line")
    //             .attr("id", "linewithlineg" + linewithlineg.length)
    //             .attr("x1", function (d) {
    //                 dx1line[i] = d.x;
    //                 return d.x;
    //             })
    //             .attr("y1", function (d) {
    //                 dy1line[i] = d.y;
    //                 return d.y;
    //             })
    //             .attr("x2", function (d) {
    //                 dx2line[i] = d.x + lineLen;
    //                 return d.x + lineLen;
    //             })
    //             .attr("y2", function (d) {
    //                 dy2line[i] = d.y;
    //                 return d.y;
    //             })
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 2)
    //             .attr("marker-end", "url(#end)")
    //             .attr("cursor", "pointer");
    //
    //         var linegtext = lineg.append("g").data([{x: xvalue + lineLen + 10, y: yvalue + 5}]);
    //         linewithtextg[i] = linegtext.append("text")
    //             .attr("id", "linewithtextg" + linewithtextg.length)
    //             .attr("x", function (d) {
    //                 dxtext[i] = d.x;
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 dytext[i] = d.y;
    //                 return d.y;
    //             })
    //             .attr("font-family", "Times New Roman")
    //             .attr("font-size", "12px")
    //             .attr("font-weight", "bold")
    //             .attr("fill", "red")
    //             .attr("cursor", "pointer")
    //             .text(textvalue);
    //
    //         var linegcircle = lineg.append("g").data([{x: cxvalue, y: cyvalue}]);
    //         circlewithlineg[i] = linegcircle.append("circle")
    //             .attr("id", function (d) {
    //                 return [
    //                     membraneOBJ.source_text,
    //                     membraneOBJ.source_fma,
    //                     membraneOBJ.source_name
    //                 ];
    //             })
    //             .attr("index", circlewithlineg.length)
    //             .attr("membrane", apicalID)
    //             .attr("cx", function (d) {
    //                 dx[i] = d.x;
    //                 return d.x;
    //             })
    //             .attr("cy", function (d) {
    //                 dy[i] = d.y + radius;
    //                 return d.y + radius;
    //             })
    //             .attr("r", radius)
    //             .attr("fill", "lightgreen")
    //             .attr("stroke-width", 20)
    //             .attr("cursor", "move");
    //
    //         if (textvalue2 != "single flux") {
    //             var lineg2 = lineg.append("g").data([{x: xvalue, y: yvalue + radius * 2}]);
    //             linewithlineg2[i] = lineg2.append("line")
    //                 .attr("id", "linewithlineg2" + linewithlineg2.length)
    //                 .attr("x1", function (d) {
    //                     dx1line2[i] = d.x;
    //                     return d.x;
    //                 })
    //                 .attr("y1", function (d) {
    //                     dy1line2[i] = d.y;
    //                     return d.y;
    //                 })
    //                 .attr("x2", function (d) {
    //                     dx2line2[i] = d.x + lineLen;
    //                     return d.x + lineLen;
    //                 })
    //                 .attr("y2", function (d) {
    //                     dy2line2[i] = d.y;
    //                     return d.y;
    //                 })
    //                 .attr("stroke", "black")
    //                 .attr("stroke-width", 2)
    //                 .attr("marker-start", "url(#start)")
    //                 .attr("cursor", "pointer");
    //
    //             var linegtext2 = lineg2.append("g").data([{
    //                 x: xvalue - textWidth - 10, y: yvalue + radius * 2 + markerHeight
    //             }]);
    //             linewithtextg2[i] = linegtext2.append("text")
    //                 .attr("id", "linewithtextg2" + linewithtextg2.length)
    //                 .attr("x", function (d) {
    //                     dxtext2[i] = d.x;
    //                     return d.x;
    //                 })
    //                 .attr("y", function (d) {
    //                     dytext2[i] = d.y;
    //                     return d.y;
    //                 })
    //                 .attr("font-family", "Times New Roman")
    //                 .attr("font-size", "12px")
    //                 .attr("font-weight", "bold")
    //                 .attr("fill", "red")
    //                 .attr("cursor", "pointer")
    //                 .text(textvalue2);
    //         }
    //
    //         // increment y-axis of line and circle
    //         yvalue += ydistance;
    //         cyvalue += ydistance;
    //     }
    //
    //     // case 4
    //     if ((src_fma == cytosolID && snk_fma == luminalID) && (src_fma2 == luminalID && snk_fma2 == cytosolID)) {
    //         var lineg = newg.append("g").data([{x: xvalue, y: yvalue}]);
    //         linewithlineg[i] = lineg.append("line")
    //             .attr("id", "linewithlineg" + linewithlineg.length)
    //             .attr("x1", function (d) {
    //                 dx1line[i] = d.x;
    //                 return d.x;
    //             })
    //             .attr("y1", function (d) {
    //                 dy1line[i] = d.y;
    //                 return d.y;
    //             })
    //             .attr("x2", function (d) {
    //                 dx2line[i] = d.x + lineLen;
    //                 return d.x + lineLen;
    //             })
    //             .attr("y2", function (d) {
    //                 dy2line[i] = d.y;
    //                 return d.y;
    //             })
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 2)
    //             .attr("marker-start", "url(#start)")
    //             .attr("cursor", "pointer");
    //
    //         var linegtext = lineg.append("g").data([{x: xvalue - textWidth - 10, y: yvalue + 5}]);
    //         linewithtextg[i] = linegtext.append("text")
    //             .attr("id", "linewithtextg" + linewithtextg.length)
    //             .attr("x", function (d) {
    //                 dxtext[i] = d.x;
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 dytext[i] = d.y;
    //                 return d.y;
    //             })
    //             .attr("font-family", "Times New Roman")
    //             .attr("font-size", "12px")
    //             .attr("font-weight", "bold")
    //             .attr("fill", "red")
    //             .attr("cursor", "pointer")
    //             .text(textvalue);
    //
    //         var linegcircle = lineg.append("g").data([{x: cxvalue, y: cyvalue}]);
    //         circlewithlineg[i] = linegcircle.append("circle")
    //             .attr("id", function (d) {
    //                 return [
    //                     membraneOBJ.source_text,
    //                     membraneOBJ.source_fma,
    //                     membraneOBJ.source_name
    //                 ];
    //             })
    //             .attr("index", circlewithlineg.length)
    //             .attr("membrane", apicalID)
    //             .attr("cx", function (d) {
    //                 dx[i] = d.x;
    //                 return d.x;
    //             })
    //             .attr("cy", function (d) {
    //                 dy[i] = d.y + radius;
    //                 return d.y + radius;
    //             })
    //             .attr("r", radius)
    //             .attr("fill", "lightgreen")
    //             .attr("stroke-width", 20)
    //             .attr("cursor", "move");
    //
    //         if (textvalue2 != "single flux") {
    //             var lineg2 = lineg.append("g").data([{x: xvalue, y: yvalue + radius * 2}]);
    //             linewithlineg2[i] = lineg2.append("line")
    //                 .attr("id", "linewithlineg2" + linewithlineg2.length)
    //                 .attr("x1", function (d) {
    //                     dx1line2[i] = d.x;
    //                     return d.x;
    //                 })
    //                 .attr("y1", function (d) {
    //                     dy1line2[i] = d.y;
    //                     return d.y;
    //                 })
    //                 .attr("x2", function (d) {
    //                     dx2line2[i] = d.x + lineLen;
    //                     return d.x + lineLen;
    //                 })
    //                 .attr("y2", function (d) {
    //                     dy2line2[i] = d.y;
    //                     return d.y;
    //                 })
    //                 .attr("stroke", "black")
    //                 .attr("stroke-width", 2)
    //                 .attr("marker-end", "url(#end)")
    //                 .attr("cursor", "pointer");
    //
    //             var linegtext2 = lineg2.append("g").data([{
    //                 x: xvalue + lineLen + 10, y: yvalue + radius * 2 + markerHeight
    //             }]);
    //             linewithtextg2[i] = linegtext2.append("text")
    //                 .attr("id", "linewithtextg2" + linewithtextg2.length)
    //                 .attr("x", function (d) {
    //                     dxtext2[i] = d.x;
    //                     return d.x;
    //                 })
    //                 .attr("y", function (d) {
    //                     dytext2[i] = d.y;
    //                     return d.y;
    //                 })
    //                 .attr("font-family", "Times New Roman")
    //                 .attr("font-size", "12px")
    //                 .attr("font-weight", "bold")
    //                 .attr("fill", "red")
    //                 .attr("cursor", "pointer")
    //                 .text(textvalue2);
    //         }
    //
    //         // increment y-axis of line and circle
    //         yvalue += ydistance;
    //         cyvalue += ydistance;
    //     }
    //
    //     // case 5
    //     if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == "channel" && snk_fma2 == "channel")) {
    //         var polygong = newg.append("g").data([{x: xvalue - 5, y: yvalue}]);
    //         polygonlineg[i] = polygong.append("line")
    //             .attr("id", "polygonlineg" + i)
    //             .attr("x1", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y1", function (d) {
    //                 return d.y;
    //             })
    //             .attr("x2", function (d) {
    //                 return d.x + polygonlineLen;
    //             })
    //             .attr("y2", function (d) {
    //                 return d.y;
    //             })
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 2)
    //             .attr("marker-end", "url(#end)")
    //             .attr("cursor", "pointer");
    //
    //         // Polygon
    //         polygon[i] = polygong.append("g").append("polygon")
    //             .attr("transform", "translate(" + (xvalue - 5) + "," + (yvalue - 30) + ")")
    //             .attr("id", "polygon" + i)
    //             .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
    //             .attr("fill", "yellow")
    //             .attr("stroke", "black")
    //             .attr("stroke-linecap", "round")
    //             .attr("stroke-linejoin", "round")
    //             .attr("cursor", "move");
    //
    //         var polygontextg = polygong.append("g").data([{x: xvalue + 20 - 5, y: yvalue + 5}]);
    //
    //         var txt = textvalue.substr(5); // temp solution
    //         if (txt == "Cl") txt = txt + "-";
    //         else txt = txt + "+";
    //
    //         polygontext[i] = polygontextg.append("text")
    //             .attr("id", "polygontext" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("font-size", "12px")
    //             .attr("fill", "red")
    //             .attr("cursor", "move")
    //             .text(txt);
    //
    //         // increment y-axis of line and circle
    //         yvalue += ydistance;
    //         cyvalue += ydistance;
    //     }
    //
    //     // case 6
    //     if ((src_fma == cytosolID && snk_fma == luminalID) && (src_fma2 == "channel" && snk_fma2 == "channel")) {
    //         var polygong = newg.append("g").data([{x: xvalue - 5, y: yvalue}]);
    //         polygonlineg[i] = polygong.append("line")
    //             .attr("id", "polygonlineg" + i)
    //             .attr("x1", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y1", function (d) {
    //                 return d.y;
    //             })
    //             .attr("x2", function (d) {
    //                 return d.x + polygonlineLen;
    //             })
    //             .attr("y2", function (d) {
    //                 return d.y;
    //             })
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 2)
    //             .attr("marker-start", "url(#start)")
    //             .attr("cursor", "pointer");
    //
    //         // Polygon
    //         polygon[i] = polygong.append("g").append("polygon")
    //             .attr("transform", "translate(" + (xvalue - 5) + "," + (yvalue - 30) + ")")
    //             .attr("id", "polygon" + i)
    //             .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
    //             .attr("fill", "yellow")
    //             .attr("stroke", "black")
    //             .attr("stroke-linecap", "round")
    //             .attr("stroke-linejoin", "round")
    //             .attr("cursor", "move");
    //
    //         var polygontextg = polygong.append("g").data([{x: xvalue + 20 - 5, y: yvalue + 5}]);
    //
    //         var txt = textvalue.substr(5); // temp solution
    //         if (txt == "Cl") txt = txt + "-";
    //         else txt = txt + "+";
    //
    //         polygontext[i] = polygontextg.append("text")
    //             .attr("id", "polygontext" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("font-size", "12px")
    //             .attr("fill", "red")
    //             .attr("cursor", "move")
    //             .text(txt);
    //
    //         // increment y-axis of line and circle
    //         yvalue += ydistance;
    //         cyvalue += ydistance;
    //     }
    //
    //     // case 7
    //     if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == "leak" && snk_fma2 == "leak")) {
    //         var leakg = newg.append("g").data([{x: xvalue - 5, y: yvalue}]);
    //         leaklineg[i] = leakg.append("line")
    //             .attr("id", "leaklineg" + i)
    //             .attr("x1", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y1", function (d) {
    //                 return d.y;
    //             })
    //             .attr("x2", function (d) {
    //                 return d.x + polygonlineLen;
    //             })
    //             .attr("y2", function (d) {
    //                 return d.y;
    //             })
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 2)
    //             .attr("marker-end", "url(#end)")
    //             .attr("cursor", "pointer");
    //
    //         var leaktextg = leakg.append("g").data([{x: xvalue - polygonlineLen / 2 - 10, y: yvalue + 5}]);
    //
    //         leaktext[i] = leaktextg.append("text")
    //             .attr("id", "leaktext" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("font-size", "12px")
    //             .attr("fill", "red")
    //             .attr("cursor", "move")
    //             .text(textvalue);
    //
    //         // increment y-axis of line and circle
    //         yvalue += ydistance;
    //         cyvalue += ydistance;
    //     }
    //
    //     // case 8
    //     if ((src_fma == cytosolID && snk_fma == luminalID) && (src_fma2 == "leak" && snk_fma2 == "leak")) {
    //         var leakg = newg.append("g").data([{x: xvalue - 5, y: yvalue}]);
    //         leaklineg[i] = leakg.append("line")
    //             .attr("id", "leaklineg" + i)
    //             .attr("x1", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y1", function (d) {
    //                 return d.y;
    //             })
    //             .attr("x2", function (d) {
    //                 return d.x + polygonlineLen;
    //             })
    //             .attr("y2", function (d) {
    //                 return d.y;
    //             })
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 2)
    //             .attr("marker-start", "url(#start)")
    //             .attr("cursor", "pointer");
    //
    //         var leaktextg = leakg.append("g").data([{x: xvalue + polygonlineLen / 2 + 10, y: yvalue + 5}]);
    //
    //         leaktext[i] = leaktextg.append("text")
    //             .attr("id", "leaktext" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("font-size", "12px")
    //             .attr("fill", "red")
    //             .attr("cursor", "move")
    //             .text(textvalue);
    //
    //         // increment y-axis of line and circle
    //         yvalue += ydistance;
    //         cyvalue += ydistance;
    //     }
    //
    //     // case 9
    //     if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == "ATP" && snk_fma2 == "ATP")) {
    //         var polygongATP = newg.append("g").data([{x: xvalue - 5, y: yvalue}]);
    //         polygonlinegATP[i] = polygongATP.append("line")
    //             .attr("id", "polygonlinegATP" + i)
    //             .attr("x1", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y1", function (d) {
    //                 return d.y;
    //             })
    //             .attr("x2", function (d) {
    //                 return d.x + polygonlineLen;
    //             })
    //             .attr("y2", function (d) {
    //                 return d.y;
    //             })
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 2)
    //             .attr("marker-end", "url(#end)")
    //             .attr("cursor", "pointer");
    //
    //         // Polygon
    //         polygon[i] = polygongATP.append("g").append("polygon")
    //             .attr("transform", "translate(" + (xvalue - 5) + "," + (yvalue - 30) + ")")
    //             .attr("id", "polygon" + i)
    //             .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
    //             .attr("fill", "yellow")
    //             .attr("stroke", "black")
    //             .attr("stroke-linecap", "round")
    //             .attr("stroke-linejoin", "round")
    //             .attr("cursor", "move");
    //
    //         var polygontextg = polygongATP.append("g").data([{x: xvalue + 20 - 5, y: yvalue + 5}]);
    //
    //         var txt = textvalue.substr(5); // temp solution
    //         if (txt == "Cl") txt = txt + "-";
    //         else txt = txt + "+";
    //
    //         polygontextATP[i] = polygontextg.append("g").append("text")
    //             .attr("id", "polygontextATP" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("font-size", "12px")
    //             .attr("fill", "red")
    //             .attr("cursor", "move")
    //             .text(txt);
    //
    //         // ATP rectangle
    //         var atprect = polygongATP.append("g").append("rect")
    //             .attr("transform", "translate(" + (xvalue - 5) + "," + (yvalue) + ")rotate(-45)")
    //             .attr("id", ATPID)
    //             .attr("width", 26)
    //             .attr("height", 26)
    //             .attr("stroke", "black")
    //             .attr("strokeWidth", "10px")
    //             .attr("fill", "white");
    //
    //         var atptextg = polygongATP.append("g").data([{x: xvalue + 8, y: yvalue + 5}]);
    //         atprectText[i] = atptextg.append("text")
    //             .attr("id", "atprectText" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("font-family", "Times New Roman")
    //             .attr("font-size", "16px")
    //             .attr("font-weight", "bold")
    //             .attr("fill", "red")
    //             .attr("cursor", "pointer")
    //             .text("A");
    //
    //         // increment y-axis of line and circle
    //         yvalue += ydistance;
    //         cyvalue += ydistance;
    //     }
    //
    //     // case 10
    //     if ((src_fma == cytosolID && snk_fma == luminalID) && (src_fma2 == "ATP" && snk_fma2 == "ATP")) {
    //         var polygongATP = newg.append("g").data([{x: xvalue - 5, y: yvalue}]);
    //         polygonlinegATP[i] = polygongATP.append("line")
    //             .attr("id", "polygonlinegATP" + i)
    //             .attr("x1", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y1", function (d) {
    //                 return d.y;
    //             })
    //             .attr("x2", function (d) {
    //                 return d.x + polygonlineLen;
    //             })
    //             .attr("y2", function (d) {
    //                 return d.y;
    //             })
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 2)
    //             .attr("marker-start", "url(#start)")
    //             .attr("cursor", "pointer");
    //
    //         // Polygon
    //         polygon[i] = polygongATP.append("g").append("polygon")
    //             .attr("transform", "translate(" + (xvalue - 5) + "," + (yvalue - 30) + ")")
    //             .attr("id", "polygon" + i)
    //             .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
    //             .attr("fill", "yellow")
    //             .attr("stroke", "black")
    //             .attr("stroke-linecap", "round")
    //             .attr("stroke-linejoin", "round")
    //             .attr("cursor", "move");
    //
    //         var polygontextg = polygongATP.append("g").data([{x: xvalue + 20 - 5, y: yvalue + 5}]);
    //
    //         var txt = textvalue.substr(5); // temp solution
    //         if (txt == "Cl") txt = txt + "-";
    //         else txt = txt + "+";
    //
    //         polygontextATP[i] = polygontextg.append("text")
    //             .attr("id", "polygontextATP" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("font-size", "12px")
    //             .attr("fill", "red")
    //             .attr("cursor", "move")
    //             .text(txt);
    //
    //         // ATP rectangle
    //         var atprect = polygongATP.append("g").append("rect")
    //             .attr("transform", "translate(" + (xvalue - 5 + polygonlineLen) + "," + (yvalue) + ")rotate(-45)")
    //             .attr("id", ATPID)
    //             .attr("width", 26)
    //             .attr("height", 26)
    //             .attr("stroke", "black")
    //             .attr("strokeWidth", "10px")
    //             .attr("fill", "white");
    //
    //         var atptextg = polygongATP.append("g").data([{x: xvalue + polygonlineLen + 8, y: yvalue + 5}]);
    //         atprectText[i] = atptextg.append("text")
    //             .attr("id", "atprectText" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("font-family", "Times New Roman")
    //             .attr("font-size", "16px")
    //             .attr("font-weight", "bold")
    //             .attr("fill", "red")
    //             .attr("cursor", "pointer")
    //             .text("A");
    //
    //         // increment y-axis of line and circle
    //         yvalue += ydistance;
    //         cyvalue += ydistance;
    //     }
    //
    //     // case 11
    //     if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == "p2y2" && snk_fma2 == "p2y2")) {
    //         var linegpy = newg.append("g").data([{x: xvalue, y: yvalue}]);
    //         linewithlinegpy[i] = linegpy.append("g").append("rect")
    //             .attr("id", "linewithlinegpy" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("width", lineLen)
    //             .attr("height", 4)
    //             .attr("stroke", "black")
    //             .attr("strokeWidth", "12px")
    //             .attr("fill", "white");
    //
    //         var linegpy2 = newg.append("g").data([{x: xvalue, y: yvalue + 8}]);
    //         linewithlinegpy2[i] = linegpy2.append("g").append("rect")
    //             .attr("id", "linewithlinegpy2" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("width", lineLen)
    //             .attr("height", 4)
    //             .attr("stroke", "black")
    //             .attr("strokeWidth", "12px")
    //             .attr("fill", "white");
    //
    //         var linegpy3 = newg.append("g").data([{x: xvalue, y: yvalue + 16}]);
    //         linewithlinegpy3[i] = linegpy3.append("g").append("rect")
    //             .attr("id", "linewithlinegpy3" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("width", lineLen)
    //             .attr("height", 4)
    //             .attr("stroke", "black")
    //             .attr("strokeWidth", "12px")
    //             .attr("fill", "white");
    //
    //         // increment y-axis of line and circle
    //         yvalue += ydistance;
    //         cyvalue += ydistance;
    //     }
    //
    //     // case 12
    //     if ((src_fma == cytosolID && snk_fma == luminalID) && (src_fma2 == "p2y2" && snk_fma2 == "p2y2")) {
    //         var linegpy = newg.append("g").data([{x: xvalue, y: yvalue}]);
    //         linewithlinegpy[i] = linegpy.append("g").append("rect")
    //             .attr("id", "linewithlinegpy" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("width", lineLen)
    //             .attr("height", 3)
    //             .attr("stroke", "black")
    //             .attr("strokeWidth", "12px")
    //             .attr("fill", "white");
    //
    //         var linegpy2 = newg.append("g").data([{x: xvalue, y: yvalue + 8}]);
    //         linewithlinegpy2[i] = linegpy2.append("g").append("rect")
    //             .attr("id", "linewithlinegpy2" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("width", lineLen)
    //             .attr("height", 4)
    //             .attr("stroke", "black")
    //             .attr("strokeWidth", "12px")
    //             .attr("fill", "white");
    //
    //         var linegpy3 = newg.append("g").data([{x: xvalue, y: yvalue + 16}]);
    //         linewithlinegpy3[i] = linegpy3.append("g").append("rect")
    //             .attr("id", "linewithlinegpy3" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("width", lineLen)
    //             .attr("height", 4)
    //             .attr("stroke", "black")
    //             .attr("strokeWidth", "12px")
    //             .attr("fill", "white");
    //
    //         // increment y-axis of line and circle
    //         yvalue += ydistance;
    //         cyvalue += ydistance;
    //     }
    // }

    // Basolateral membrane
    // for (var i = 0; i < basolateralMembrane.length; i++) {
    //     var textvalue = basolateralMembrane[i].source_text;
    //     var textvalue2 = basolateralMembrane[i].source_text2;
    //     var src_fma = basolateralMembrane[i].source_fma;
    //     var src_fma2 = basolateralMembrane[i].source_fma2;
    //     var snk_fma = basolateralMembrane[i].sink_fma;
    //     var snk_fma2 = basolateralMembrane[i].sink_fma2;
    //     var textWidth = getTextWidth(textvalue, 12);
    //
    //     // case 1
    //     if ((src_fma == cytosolID && snk_fma == interstitialID) && (src_fma2 == cytosolID && snk_fma2 == interstitialID)) {
    //         var linegb = newg.append("g").data([{x: xvalue + width, y: yvalueb}]);
    //         linewithlinegb[i] = linegb.append("line")
    //             .attr("id", "linewithlinegb" + i)
    //             .attr("x1", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y1", function (d) {
    //                 return d.y;
    //             })
    //             .attr("x2", function (d) {
    //                 return d.x + lineLen;
    //             })
    //             .attr("y2", function (d) {
    //                 return d.y;
    //             })
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 2)
    //             .attr("marker-end", "url(#end)")
    //             .attr("cursor", "pointer");
    //
    //         var linegtextb = linegb.append("g").data([{x: xvalue + lineLen + 10 + width, y: yvalueb + 5}]);
    //         linewithtextgb[i] = linegtextb.append("text")
    //             .attr("id", "linewithtextgb" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("font-family", "Times New Roman")
    //             .attr("font-size", "12px")
    //             .attr("font-weight", "bold")
    //             .attr("fill", "red")
    //             .attr("cursor", "pointer")
    //             .text(textvalue);
    //
    //         var linegcircleb = linegb.append("g").data([{x: cxvalue + width, y: cyvalueb}]);
    //         circlewithlinegb[i] = linegcircleb.append("circle")
    //             .attr("id", "circlewithlinegb" + i)
    //             .attr("cx", function (d) {
    //                 return d.x;
    //             })
    //             .attr("cy", function (d) {
    //                 return d.y + radius;
    //             })
    //             .attr("r", radius)
    //             .attr("fill", "orange")
    //             .attr("stroke-width", 20)
    //             .attr("cursor", "move");
    //
    //         if (textvalue2 != "single flux") {
    //             var lineg2b = linegb.append("g").data([{x: xvalue + width, y: yvalueb + radius * 2}]);
    //             linewithlineg2b[i] = lineg2b.append("line")
    //                 .attr("id", "linewithlineg2b" + i)
    //                 .attr("x1", function (d) {
    //                     return d.x;
    //                 })
    //                 .attr("y1", function (d) {
    //                     return d.y;
    //                 })
    //                 .attr("x2", function (d) {
    //                     return d.x + lineLen;
    //                 })
    //                 .attr("y2", function (d) {
    //                     return d.y;
    //                 })
    //                 .attr("stroke", "black")
    //                 .attr("stroke-width", 2)
    //                 .attr("marker-end", "url(#end)")
    //                 .attr("cursor", "pointer");
    //
    //             var linegtext2b = lineg2b.append("g").data([{
    //                 x: xvalue + lineLen + 10 + width, y: yvalueb + radius * 2 + markerHeight
    //             }]);
    //             linewithtextg2b[i] = linegtext2b.append("text")
    //                 .attr("id", "linewithtextg2b" + i)
    //                 .attr("x", function (d) {
    //                     return d.x;
    //                 })
    //                 .attr("y", function (d) {
    //                     return d.y;
    //                 })
    //                 .attr("font-family", "Times New Roman")
    //                 .attr("font-size", "12px")
    //                 .attr("font-weight", "bold")
    //                 .attr("fill", "red")
    //                 .attr("cursor", "pointer")
    //                 .text(textvalue2);
    //         }
    //
    //         // increment y-axis of line and circle
    //         yvalueb += ydistanceb;
    //         cyvalueb += ydistanceb;
    //     }
    //
    //     // case 2
    //     if ((src_fma == interstitialID && snk_fma == cytosolID) && (src_fma2 == interstitialID && snk_fma2 == cytosolID)) {
    //         var linegb = newg.append("g").data([{x: xvalue + width, y: yvalueb}]);
    //         linewithlinegb[i] = linegb.append("line")
    //             .attr("id", "linewithlinegb" + i)
    //             .attr("x1", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y1", function (d) {
    //                 return d.y;
    //             })
    //             .attr("x2", function (d) {
    //                 return d.x + lineLen;
    //             })
    //             .attr("y2", function (d) {
    //                 return d.y;
    //             })
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 2)
    //             .attr("marker-start", "url(#start)")
    //             .attr("cursor", "pointer");
    //
    //         var linegtextb = linegb.append("g").data([{x: xvalue - textWidth - 10 + width, y: yvalueb + 5}]);
    //         linewithtextgb[i] = linegtextb.append("text")
    //             .attr("id", "linewithtextgb" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("font-family", "Times New Roman")
    //             .attr("font-size", "12px")
    //             .attr("font-weight", "bold")
    //             .attr("fill", "red")
    //             .attr("cursor", "pointer")
    //             .text(textvalue);
    //
    //         var linegcircleb = linegb.append("g").data([{x: cxvalue + width, y: cyvalueb}]);
    //         circlewithlinegb[i] = linegcircleb.append("circle")
    //             .attr("id", "circlewithlinegb" + i)
    //             .attr("cx", function (d) {
    //                 return d.x;
    //             })
    //             .attr("cy", function (d) {
    //                 return d.y + radius;
    //             })
    //             .attr("r", radius)
    //             .attr("fill", "orange")
    //             .attr("stroke-width", 20)
    //             .attr("cursor", "move");
    //
    //         if (textvalue2 != "single flux") {
    //             var lineg2b = linegb.append("g").data([{x: xvalue + width, y: yvalueb + radius * 2}]);
    //             linewithlineg2b[i] = lineg2b.append("line")
    //                 .attr("id", "linewithlineg2b" + i)
    //                 .attr("x1", function (d) {
    //                     return d.x;
    //                 })
    //                 .attr("y1", function (d) {
    //                     return d.y;
    //                 })
    //                 .attr("x2", function (d) {
    //                     return d.x + lineLen;
    //                 })
    //                 .attr("y2", function (d) {
    //                     return d.y;
    //                 })
    //                 .attr("stroke", "black")
    //                 .attr("stroke-width", 2)
    //                 .attr("marker-start", "url(#start)")
    //                 .attr("cursor", "pointer");
    //
    //             var linegtext2b = lineg2b.append("g").data([{
    //                 x: xvalue - textWidth - 10 + width, y: yvalueb + radius * 2 + markerHeight
    //             }]);
    //             linewithtextg2b[i] = linegtext2b.append("text")
    //                 .attr("id", "linewithtextg2b" + i)
    //                 .attr("x", function (d) {
    //                     return d.x;
    //                 })
    //                 .attr("y", function (d) {
    //                     return d.y;
    //                 })
    //                 .attr("font-family", "Times New Roman")
    //                 .attr("font-size", "12px")
    //                 .attr("font-weight", "bold")
    //                 .attr("fill", "red")
    //                 .attr("cursor", "pointer")
    //                 .text(textvalue2);
    //         }
    //
    //         // increment y-axis of line and circle
    //         yvalueb += ydistanceb;
    //         cyvalueb += ydistanceb;
    //     }
    //
    //     // case 3
    //     if ((src_fma == cytosolID && snk_fma == interstitialID) && (src_fma2 == interstitialID && snk_fma2 == cytosolID)) {
    //
    //         var linegb = newg.append("g").data([{x: xvalue + width, y: yvalueb}]);
    //         linewithlinegb[i] = linegb.append("line")
    //             .attr("id", "linewithlinegb" + i)
    //             .attr("x1", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y1", function (d) {
    //                 return d.y;
    //             })
    //             .attr("x2", function (d) {
    //                 return d.x + lineLen;
    //             })
    //             .attr("y2", function (d) {
    //                 return d.y;
    //             })
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 2)
    //             .attr("marker-end", "url(#end)")
    //             .attr("cursor", "pointer");
    //
    //         var linegtextb = linegb.append("g").data([{x: xvalue + lineLen + 10 + width, y: yvalueb + 5}]);
    //         linewithtextgb[i] = linegtextb.append("text")
    //             .attr("id", "linewithtextgb" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("font-family", "Times New Roman")
    //             .attr("font-size", "12px")
    //             .attr("font-weight", "bold")
    //             .attr("fill", "red")
    //             .attr("cursor", "pointer")
    //             .text(textvalue);
    //
    //         var linegcircleb = linegb.append("g").data([{x: cxvalue + width, y: cyvalueb}]);
    //         circlewithlinegb[i] = linegcircleb.append("circle")
    //             .attr("id", "circlewithlinegb" + i)
    //             .attr("cx", function (d) {
    //                 return d.x;
    //             })
    //             .attr("cy", function (d) {
    //                 return d.y + radius;
    //             })
    //             .attr("r", radius)
    //             .attr("fill", "orange")
    //             .attr("stroke-width", 20)
    //             .attr("cursor", "move");
    //
    //         if (textvalue2 != "single flux") {
    //             var lineg2b = linegb.append("g").data([{x: xvalue + width, y: yvalueb + radius * 2}]);
    //             linewithlineg2b[i] = lineg2b.append("line")
    //                 .attr("id", "linewithlineg2b" + i)
    //                 .attr("x1", function (d) {
    //                     return d.x;
    //                 })
    //                 .attr("y1", function (d) {
    //                     return d.y;
    //                 })
    //                 .attr("x2", function (d) {
    //                     return d.x + lineLen;
    //                 })
    //                 .attr("y2", function (d) {
    //                     return d.y;
    //                 })
    //                 .attr("stroke", "black")
    //                 .attr("stroke-width", 2)
    //                 .attr("marker-start", "url(#start)")
    //                 .attr("cursor", "pointer");
    //
    //             var linegtext2b = lineg2b.append("g").data([{
    //                 x: xvalue - textWidth - 10 + width, y: yvalueb + radius * 2 + markerHeight
    //             }]);
    //             linewithtextg2b[i] = linegtext2b.append("text")
    //                 .attr("id", "linewithtextg2b" + i)
    //                 .attr("x", function (d) {
    //                     return d.x;
    //                 })
    //                 .attr("y", function (d) {
    //                     return d.y;
    //                 })
    //                 .attr("font-family", "Times New Roman")
    //                 .attr("font-size", "12px")
    //                 .attr("font-weight", "bold")
    //                 .attr("fill", "red")
    //                 .attr("cursor", "pointer")
    //                 .text(textvalue2);
    //         }
    //
    //         // increment y-axis of line and circle
    //         yvalueb += ydistanceb;
    //         cyvalueb += ydistanceb;
    //     }
    //
    //     // case 4
    //     if ((src_fma == interstitialID && snk_fma == cytosolID) && (src_fma2 == cytosolID && snk_fma2 == interstitialID)) {
    //         var linegb = newg.append("g").data([{x: xvalue + width, y: yvalueb}]);
    //         linewithlinegb[i] = linegb.append("line")
    //             .attr("id", "linewithlinegb" + i)
    //             .attr("x1", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y1", function (d) {
    //                 return d.y;
    //             })
    //             .attr("x2", function (d) {
    //                 return d.x + lineLen;
    //             })
    //             .attr("y2", function (d) {
    //                 return d.y;
    //             })
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 2)
    //             .attr("marker-start", "url(#start)")
    //             .attr("cursor", "pointer");
    //
    //         var linegtextb = linegb.append("g").data([{x: xvalue - textWidth - 10 + width, y: yvalueb + 5}]);
    //         linewithtextgb[i] = linegtextb.append("text")
    //             .attr("id", "linewithtextgb" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("font-family", "Times New Roman")
    //             .attr("font-size", "12px")
    //             .attr("font-weight", "bold")
    //             .attr("fill", "red")
    //             .attr("cursor", "pointer")
    //             .text(textvalue);
    //
    //         var linegcircleb = linegb.append("g").data([{x: cxvalue + width, y: cyvalueb}]);
    //         circlewithlinegb[i] = linegcircleb.append("circle")
    //             .attr("id", "circlewithlinegb" + i)
    //             .attr("cx", function (d) {
    //                 return d.x;
    //             })
    //             .attr("cy", function (d) {
    //                 return d.y + radius;
    //             })
    //             .attr("r", radius)
    //             .attr("fill", "orange")
    //             .attr("stroke-width", 20)
    //             .attr("cursor", "move");
    //
    //         if (textvalue2 != "single flux") {
    //             var lineg2b = linegb.append("g").data([{x: xvalue + width, y: yvalueb + radius * 2}]);
    //             linewithlineg2b[i] = lineg2b.append("line")
    //                 .attr("id", "linewithlineg2b" + i)
    //                 .attr("x1", function (d) {
    //                     return d.x;
    //                 })
    //                 .attr("y1", function (d) {
    //                     return d.y;
    //                 })
    //                 .attr("x2", function (d) {
    //                     return d.x + lineLen;
    //                 })
    //                 .attr("y2", function (d) {
    //                     return d.y;
    //                 })
    //                 .attr("stroke", "black")
    //                 .attr("stroke-width", 2)
    //                 .attr("marker-end", "url(#end)")
    //                 .attr("cursor", "pointer");
    //
    //             var linegtext2b = lineg2b.append("g").data([{
    //                 x: xvalue + lineLen + 10 + width, y: yvalueb + radius * 2 + markerHeight
    //             }]);
    //             linewithtextg2b[i] = linegtext2b.append("text")
    //                 .attr("id", "linewithtextg2b" + i)
    //                 .attr("x", function (d) {
    //                     return d.x;
    //                 })
    //                 .attr("y", function (d) {
    //                     return d.y;
    //                 })
    //                 .attr("font-family", "Times New Roman")
    //                 .attr("font-size", "12px")
    //                 .attr("font-weight", "bold")
    //                 .attr("fill", "red")
    //                 .attr("cursor", "pointer")
    //                 .text(textvalue2);
    //         }
    //
    //         // increment y-axis of line and circle
    //         yvalueb += ydistanceb;
    //         cyvalueb += ydistanceb;
    //     }
    //
    //     // case 5
    //     if ((src_fma == interstitialID && snk_fma == cytosolID) && (src_fma2 == "channel" && snk_fma2 == "channel")) {
    //         var polygongb = newg.append("g").data([{x: xvalue - 5 + width, y: yvalueb}]);
    //         polygonlinegb[i] = polygongb.append("line")
    //             .attr("id", "polygonlinegb" + i)
    //             .attr("x1", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y1", function (d) {
    //                 return d.y;
    //             })
    //             .attr("x2", function (d) {
    //                 return d.x + polygonlineLen;
    //             })
    //             .attr("y2", function (d) {
    //                 return d.y;
    //             })
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 2)
    //             .attr("marker-start", "url(#start)")
    //             .attr("cursor", "pointer");
    //
    //         // Polygon
    //         polygonb[i] = polygongb.append("g").append("polygon")
    //             .attr("transform", "translate(" + (xvalue - 5 + width) + "," + (yvalueb - 30) + ")")
    //             .attr("id", "polygonb" + i)
    //             .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
    //             .attr("fill", "yellow")
    //             .attr("stroke", "black")
    //             .attr("stroke-linecap", "round")
    //             .attr("stroke-linejoin", "round")
    //             .attr("cursor", "move");
    //
    //         var polygontextgb = polygongb.append("g").data([{x: xvalue + 20 - 5 + width, y: yvalueb + 5}]);
    //
    //         var txt = textvalue.substr(5); // temp solution
    //         if (txt == "Cl") txt = txt + "-";
    //         else txt = txt + "+";
    //
    //         polygontextb[i] = polygontextgb.append("text")
    //             .attr("id", "polygontextb" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("font-size", "12px")
    //             .attr("fill", "red")
    //             .attr("cursor", "move")
    //             .text(txt);
    //
    //         // increment y-axis of line and circle
    //         yvalueb += ydistanceb;
    //         cyvalueb += ydistanceb;
    //     }
    //
    //     // case 6
    //     if ((src_fma == cytosolID && snk_fma == interstitialID) && (src_fma2 == "channel" && snk_fma2 == "channel")) {
    //         var polygongb = newg.append("g").data([{x: xvalue - 5 + width, y: yvalueb}]);
    //         polygonlinegb[i] = polygongb.append("line")
    //             .attr("id", "polygonlinegb" + i)
    //             .attr("x1", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y1", function (d) {
    //                 return d.y;
    //             })
    //             .attr("x2", function (d) {
    //                 return d.x + polygonlineLen;
    //             })
    //             .attr("y2", function (d) {
    //                 return d.y;
    //             })
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 2)
    //             .attr("marker-end", "url(#end)")
    //             .attr("cursor", "pointer");
    //
    //         // Polygon
    //         polygonb[i] = polygongb.append("g").append("polygon")
    //             .attr("transform", "translate(" + (xvalue - 5 + width) + "," + (yvalueb - 30) + ")")
    //             .attr("id", "polygonb" + i)
    //             .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
    //             .attr("fill", "yellow")
    //             .attr("stroke", "black")
    //             .attr("stroke-linecap", "round")
    //             .attr("stroke-linejoin", "round")
    //             .attr("cursor", "move");
    //
    //         var polygontextgb = polygongb.append("g").data([{x: xvalue + 20 - 5 + width, y: yvalueb + 5}]);
    //
    //         var txt = textvalue.substr(5); // temp solution
    //         if (txt == "Cl") txt = txt + "-";
    //         else txt = txt + "+";
    //
    //         polygontextb[i] = polygontextgb.append("text")
    //             .attr("id", "polygontextb" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("font-size", "12px")
    //             .attr("fill", "red")
    //             .attr("cursor", "move")
    //             .text(txt);
    //
    //         // increment y-axis of line and circle
    //         yvalueb += ydistanceb;
    //         cyvalueb += ydistanceb;
    //     }
    //
    //     // case 7
    //     if ((src_fma == interstitialID && snk_fma == cytosolID) && (src_fma2 == "leak" && snk_fma2 == "leak")) {
    //         var leakgb = newg.append("g").data([{x: xvalue - 5 + width, y: yvalueb}]);
    //         leaklinegb[i] = leakgb.append("line")
    //             .attr("id", "leaklinegb" + i)
    //             .attr("x1", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y1", function (d) {
    //                 return d.y;
    //             })
    //             .attr("x2", function (d) {
    //                 return d.x + polygonlineLen;
    //             })
    //             .attr("y2", function (d) {
    //                 return d.y;
    //             })
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 2)
    //             .attr("marker-start", "url(#start)")
    //             .attr("cursor", "pointer");
    //
    //         var leaktextgb = leakgb.append("g").data([{x: xvalue + polygonlineLen / 2 + 10 + width, y: yvalueb + 5}]);
    //
    //         leaktextb[i] = leaktextgb.append("text")
    //             .attr("id", "leaktextb" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("font-size", "12px")
    //             .attr("fill", "red")
    //             .attr("cursor", "move")
    //             .text(textvalue);
    //
    //         // increment y-axis of line and circle
    //         yvalueb += ydistanceb;
    //         cyvalueb += ydistanceb;
    //     }
    //
    //     // case 8
    //     if ((src_fma == cytosolID && snk_fma == interstitialID) && (src_fma2 == "leak" && snk_fma2 == "leak")) {
    //         var leakgb = newg.append("g").data([{x: xvalue - 5 + width, y: yvalueb}]);
    //         leaklinegb[i] = leakgb.append("line")
    //             .attr("id", "leaklinegb" + i)
    //             .attr("x1", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y1", function (d) {
    //                 return d.y;
    //             })
    //             .attr("x2", function (d) {
    //                 return d.x + polygonlineLen;
    //             })
    //             .attr("y2", function (d) {
    //                 return d.y;
    //             })
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 2)
    //             .attr("marker-end", "url(#end)")
    //             .attr("cursor", "pointer");
    //
    //         var leaktextgb = leakgb.append("g").data([{x: xvalue - polygonlineLen / 2 - 10 + width, y: yvalueb + 5}]);
    //
    //         leaktextb[i] = leaktextgb.append("text")
    //             .attr("id", "leaktextb" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("font-size", "12px")
    //             .attr("fill", "red")
    //             .attr("cursor", "move")
    //             .text(textvalue);
    //
    //         // increment y-axis of line and circle
    //         yvalueb += ydistanceb;
    //         cyvalueb += ydistanceb;
    //     }
    //
    //     // case 9
    //     if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == "ATP" && snk_fma2 == "ATP")) {
    //         var polygongATPb = newg.append("g").data([{x: xvalue - 5 + width, y: yvalue}]);
    //         polygonlinegATPb[i] = polygongATPb.append("line")
    //             .attr("id", "polygonlinegATP" + i)
    //             .attr("x1", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y1", function (d) {
    //                 return d.y;
    //             })
    //             .attr("x2", function (d) {
    //                 return d.x + polygonlineLen;
    //             })
    //             .attr("y2", function (d) {
    //                 return d.y;
    //             })
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 2)
    //             .attr("marker-end", "url(#end)")
    //             .attr("cursor", "pointer");
    //
    //         // Polygon
    //         polygon[i] = polygongATPb.append("g").append("polygon")
    //             .attr("transform", "translate(" + (xvalue - 5 + width) + "," + (yvalue - 30) + ")")
    //             .attr("id", "polygon" + i)
    //             .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
    //             .attr("fill", "yellow")
    //             .attr("stroke", "black")
    //             .attr("stroke-linecap", "round")
    //             .attr("stroke-linejoin", "round")
    //             .attr("cursor", "move");
    //
    //         var polygontextg = polygongATPb.append("g").data([{x: xvalue + 20 - 5 + width, y: yvalue + 5}]);
    //
    //         var txt = textvalue.substr(5); // temp solution
    //         if (txt == "Cl") txt = txt + "-";
    //         else txt = txt + "+";
    //
    //         polygontextATPb[i] = polygontextg.append("g").append("text")
    //             .attr("id", "polygontextATPb" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("font-size", "12px")
    //             .attr("fill", "red")
    //             .attr("cursor", "move")
    //             .text(txt);
    //
    //         // ATP rectangle
    //         var atprect = polygongATPb.append("g").append("rect")
    //             .attr("transform", "translate(" + (xvalue - 5 + width) + "," + (yvalue) + ")rotate(-45)")
    //             .attr("id", ATPID)
    //             .attr("width", 26)
    //             .attr("height", 26)
    //             .attr("stroke", "black")
    //             .attr("strokeWidth", "10px")
    //             .attr("fill", "white");
    //
    //         var atptextg = polygongATPb.append("g").data([{x: xvalue + 8 + width, y: yvalue + 5}]);
    //         atprectTextb[i] = atptextg.append("text")
    //             .attr("id", "atprectTextb" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("font-family", "Times New Roman")
    //             .attr("font-size", "16px")
    //             .attr("font-weight", "bold")
    //             .attr("fill", "red")
    //             .attr("cursor", "pointer")
    //             .text("A");
    //
    //         // increment y-axis of line and circle
    //         yvalue += ydistance;
    //         cyvalue += ydistance;
    //     }
    //
    //     // case 10
    //     if ((src_fma == cytosolID && snk_fma == luminalID) && (src_fma2 == "ATP" && snk_fma2 == "ATP")) {
    //         var polygongATPb = newg.append("g").data([{x: xvalue - 5 + width, y: yvalue}]);
    //         polygonlinegATPb[i] = polygongATPb.append("line")
    //             .attr("id", "polygonlinegATPb" + i)
    //             .attr("x1", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y1", function (d) {
    //                 return d.y;
    //             })
    //             .attr("x2", function (d) {
    //                 return d.x + polygonlineLen;
    //             })
    //             .attr("y2", function (d) {
    //                 return d.y;
    //             })
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 2)
    //             .attr("marker-start", "url(#start)")
    //             .attr("cursor", "pointer");
    //
    //         // Polygon
    //         polygon[i] = polygongATPb.append("g").append("polygon")
    //             .attr("transform", "translate(" + (xvalue - 5 + width) + "," + (yvalue - 30) + ")")
    //             .attr("id", "polygon" + i)
    //             .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
    //             .attr("fill", "yellow")
    //             .attr("stroke", "black")
    //             .attr("stroke-linecap", "round")
    //             .attr("stroke-linejoin", "round")
    //             .attr("cursor", "move");
    //
    //         var polygontextg = polygongATPb.append("g").data([{x: xvalue + 20 - 5 + width, y: yvalue + 5}]);
    //
    //         var txt = textvalue.substr(5); // temp solution
    //         if (txt == "Cl") txt = txt + "-";
    //         else txt = txt + "+";
    //
    //         polygontextATPb[i] = polygontextg.append("text")
    //             .attr("id", "polygontextATPb" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("font-size", "12px")
    //             .attr("fill", "red")
    //             .attr("cursor", "move")
    //             .text(txt);
    //
    //         // ATP rectangle
    //         var atprect = polygongATPb.append("g").append("rect")
    //             .attr("transform", "translate(" + (xvalue - 5 + polygonlineLen + width) + "," + (yvalue) + ")rotate(-45)")
    //             .attr("id", ATPID)
    //             .attr("width", 26)
    //             .attr("height", 26)
    //             .attr("stroke", "black")
    //             .attr("strokeWidth", "10px")
    //             .attr("fill", "white");
    //
    //         var atptextg = polygongATPb.append("g").data([{x: xvalue + polygonlineLen + 8 + width, y: yvalue + 5}]);
    //         atprectTextb[i] = atptextg.append("text")
    //             .attr("id", "atprectTextb" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("font-family", "Times New Roman")
    //             .attr("font-size", "16px")
    //             .attr("font-weight", "bold")
    //             .attr("fill", "red")
    //             .attr("cursor", "pointer")
    //             .text("A");
    //
    //         // increment y-axis of line and circle
    //         yvalue += ydistance;
    //         cyvalue += ydistance;
    //     }
    //
    //     // case 11
    //     if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == "p2y2" && snk_fma2 == "p2y2")) {
    //         var linegpyb = newg.append("g").data([{x: xvalue, y: yvalue}]);
    //         linewithlinegpyb[i] = linegpyb.append("g").append("rect")
    //             .attr("id", "linewithlinegpyb" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("width", lineLen)
    //             .attr("height", 4)
    //             .attr("stroke", "black")
    //             .attr("strokeWidth", "12px")
    //             .attr("fill", "white");
    //
    //         var linegpy2b = newg.append("g").data([{x: xvalue, y: yvalue + 8}]);
    //         linewithlinegpy2b[i] = linegpy2b.append("g").append("rect")
    //             .attr("id", "linewithlinegpy2b" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("width", lineLen)
    //             .attr("height", 4)
    //             .attr("stroke", "black")
    //             .attr("strokeWidth", "12px")
    //             .attr("fill", "white");
    //
    //         var linegpy3b = newg.append("g").data([{x: xvalue, y: yvalue + 16}]);
    //         linewithlinegpy3b[i] = linegpy3b.append("g").append("rect")
    //             .attr("id", "linewithlinegpy3b" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("width", lineLen)
    //             .attr("height", 4)
    //             .attr("stroke", "black")
    //             .attr("strokeWidth", "12px")
    //             .attr("fill", "white");
    //
    //         // increment y-axis of line and circle
    //         yvalue += ydistance;
    //         cyvalue += ydistance;
    //     }
    //
    //     // case 12
    //     if ((src_fma == cytosolID && snk_fma == luminalID) && (src_fma2 == "p2y2" && snk_fma2 == "p2y2")) {
    //         var linegpyb = newg.append("g").data([{x: xvalue, y: yvalue}]);
    //         linewithlinegpyb[i] = linegpyb.append("g").append("rect")
    //             .attr("id", "linewithlinegpyb" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("width", lineLen)
    //             .attr("height", 3)
    //             .attr("stroke", "black")
    //             .attr("strokeWidth", "12px")
    //             .attr("fill", "white");
    //
    //         var linegpy2b = newg.append("g").data([{x: xvalue, y: yvalue + 8}]);
    //         linewithlinegpy2b[i] = linegpy2b.append("g").append("rect")
    //             .attr("id", "linewithlinegpy2b" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("width", lineLen)
    //             .attr("height", 4)
    //             .attr("stroke", "black")
    //             .attr("strokeWidth", "12px")
    //             .attr("fill", "white");
    //
    //         var linegpy3b = newg.append("g").data([{x: xvalue, y: yvalue + 16}]);
    //         linewithlinegpy3b[i] = linegpy3b.append("g").append("rect")
    //             .attr("id", "linewithlinegpy3b" + i)
    //             .attr("x", function (d) {
    //                 return d.x;
    //             })
    //             .attr("y", function (d) {
    //                 return d.y;
    //             })
    //             .attr("width", lineLen)
    //             .attr("height", 4)
    //             .attr("stroke", "black")
    //             .attr("strokeWidth", "12px")
    //             .attr("fill", "white");
    //
    //         // increment y-axis of line and circle
    //         yvalue += ydistance;
    //         cyvalue += ydistance;
    //     }
    // }

    // Paracellular membrane
    var xprect = document.getElementsByTagName("rect")[5].x.baseVal.value;
    var yprect = document.getElementsByTagName("rect")[5].y.baseVal.value;
    var xpvalue = xprect + 10;
    var ypvalue = yprect + 25;
    var ypdistance = 35;
    for (var i = 0; i < paracellularMembrane.length; i++) {
        var textvalue = paracellularMembrane[i].source_text;
        var src_fma = paracellularMembrane[i].source_fma;
        var snk_fma = paracellularMembrane[i].sink_fma;
        var textWidth = getTextWidth(textvalue, 12);
        var pcellLen = 100;

        var linegc = newg.append("g").data([{x: xpvalue, y: ypvalue + 5}]);
        linewithtextgc[i] = linegc.append("text")
            .attr("id", "linewithtextgc" + i)
            .attr("x", function (d) {
                return d.x;
            })
            .attr("y", function (d) {
                return d.y;
            })
            .attr("font-family", "Times New Roman")
            .attr("font-size", "12px")
            .attr("font-weight", "bold")
            .attr("fill", "red")
            .attr("cursor", "move")
            .text(textvalue);

        var linetextg = linegc.append("g").data([{x: xpvalue + textWidth + 10, y: ypvalue}]);
        linewithlinegc[i] = linetextg.append("line")
            .attr("id", "linewithlinegc" + i)
            .attr("x1", function (d) {
                return d.x;
            })
            .attr("y1", function (d) {
                return d.y;
            })
            .attr("x2", function (d) {
                return d.x + pcellLen;
            })
            .attr("y2", function (d) {
                return d.y;
            })
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#end)")
            .attr("cursor", "move");

        ypvalue += ypdistance;
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

    function dragtextandline(d) {

        // line: strip all the non-digit characters (\D or [^0-9])
        var ic = this.id.replace(/\D/g, '');
        var axis = groupcordinates("linewithlinegc" + ic, ic);
        linewithlinegc[ic]
            .attr("x1", axis.shift())
            .attr("y1", axis.shift())
            .attr("x2", axis.shift())
            .attr("y2", axis.shift());

        // text
        var axis = groupcordinates("linewithtextgc" + ic, ic);
        linewithtextgc[ic]
            .attr("x", axis.shift())
            .attr("y", axis.shift())

    }

    function dragpolygonandline(d) {

        // Circle: strip all the non-digit characters (\D or [^0-9])
        var ic = this.id.replace(/\D/g, '');
        var axis = groupcordinates("polygonlineg" + ic, ic);
        polygonlineg[ic]
            .attr("x1", axis.shift())
            .attr("y1", axis.shift())
            .attr("x2", axis.shift())
            .attr("y2", axis.shift());

        // text
        var axis = groupcordinates("polygontext" + ic, ic);
        polygontext[ic]
            .attr("x", axis.shift())
            .attr("y", axis.shift())

        // polygon
        var dx = d3.event.dx;
        var dy = d3.event.dy;

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

    function dragpolygonandlineb(d) {

        // Circle: strip all the non-digit characters (\D or [^0-9])
        var ic = this.id.replace(/\D/g, '');
        var axis = groupcordinates("polygonlinegb" + ic, ic);
        polygonlinegb[ic]
            .attr("x1", axis.shift())
            .attr("y1", axis.shift())
            .attr("x2", axis.shift())
            .attr("y2", axis.shift());

        // text
        var axis = groupcordinates("polygontextb" + ic, ic);
        polygontextb[ic]
            .attr("x", axis.shift())
            .attr("y", axis.shift())

        // polygon
        var dx = d3.event.dx;
        var dy = d3.event.dy;

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

    function dragcircleline(d) {
        // console.log("this: ", this);
        // console.log("d3.select(this): ", d3.select(this));
        iGlobal = this.getAttribute("index");

        cthis = this;

        // console.log("index: ", iGlobal);

        var dx = d3.event.dx;
        var dy = d3.event.dy;

        // if (this.tagName == "circle") {}
        d3.select(this)
            .attr("cx", parseFloat(this.cx.baseVal.value) + dx)
            .attr("cy", parseFloat(this.cy.baseVal.value) + dy);

        // line 1
        // if (this.tagName == "line") {}
        linewithlineg[iGlobal]
            .attr("x1", parseFloat(d3.select("#" + "linewithlineg" + iGlobal).attr("x1")) + dx)
            .attr("y1", parseFloat(d3.select("#" + "linewithlineg" + iGlobal).attr("y1")) + dy)
            .attr("x2", parseFloat(d3.select("#" + "linewithlineg" + iGlobal).attr("x2")) + dx)
            .attr("y2", parseFloat(d3.select("#" + "linewithlineg" + iGlobal).attr("y2")) + dy);

        // text 1
        // if (this.tagName == "text") {}
        linewithtextg[iGlobal]
            .attr("x", parseFloat(d3.select("#" + "linewithtextg" + iGlobal).attr("x")) + dx)
            .attr("y", parseFloat(d3.select("#" + "linewithtextg" + iGlobal).attr("y")) + dy);

        if (linewithlineg2[iGlobal] != undefined && linewithtextg2[iGlobal] != undefined) {
            // line 2
            // if (this.tagName == "line") {}
            linewithlineg2[iGlobal]
                .attr("x1", parseFloat(d3.select("#" + "linewithlineg2" + iGlobal).attr("x1")) + dx)
                .attr("y1", parseFloat(d3.select("#" + "linewithlineg2" + iGlobal).attr("y1")) + dy)
                .attr("x2", parseFloat(d3.select("#" + "linewithlineg2" + iGlobal).attr("x2")) + dx)
                .attr("y2", parseFloat(d3.select("#" + "linewithlineg2" + iGlobal).attr("y2")) + dy);

            // text 2
            // if (this.tagName == "text") {}
            linewithtextg2[iGlobal]
                .attr("x", parseFloat(d3.select("#" + "linewithtextg2" + iGlobal).attr("x")) + dx)
                .attr("y", parseFloat(d3.select("#" + "linewithtextg2" + iGlobal).attr("y")) + dy);
        }

        var mindex, membrane = this.getAttribute("membrane");
        var line = document.getElementsByTagName("line");

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

        // detect basolateralMembrane - 0 apical, 1 basolateralMembrane, 3 cell junction
        var lineb_x = line[mindex].x1.baseVal.value;
        var lineb_y1 = line[mindex].y1.baseVal.value;
        var lineb_y2 = line[mindex].y2.baseVal.value;
        var cx = this.cx.baseVal.value;
        var cy = this.cy.baseVal.value;
        var lineb_id = line[mindex].id;
        var circle_id = this.id;

        if ((cx >= (lineb_x - radius) && cx <= lineb_x + 20 + radius) &&
            (cy >= lineb_y1 && cy <= lineb_y2) && (lineb_id != circle_id)) {

            document.getElementsByTagName("line")[1].style.setProperty("stroke", "red");

            if (counterbr == 0) {

                counterbr = 1;

                var m = new Modal({
                    id: 'myModal',
                    header: 'Recommender System',
                    footer: 'My footer',
                    footerCloseButton: 'Close',
                    footerSaveButton: 'Save'
                });

                m.getBody().html('<div id="modalBody"></div>');

                m.show();

                $('#myModal').on('shown.bs.modal', function () {

                    var circleID = cthis.getAttribute("id").split(",");
                    console.log("circleID: ", circleID);

                    // parsing
                    cellmlModel = circleID[2];
                    var indexOfHash = cellmlModel.search("#");
                    cellmlModel = cellmlModel.slice(0, indexOfHash);

                    var query = 'SELECT ?Protein ' +
                        'WHERE { GRAPH ?g { ' +
                        '<' + cellmlModel + '#Protein> <http://purl.org/dc/terms/description> ?Protein . ' +
                        '}}'

                    // protein name
                    sendPostRequest(
                        endpoint,
                        query,
                        function (jsonModel) {

                            proteinName = jsonModel.results.bindings[0].Protein.value;
                            console.log("jsonModel: ", jsonModel);
                            console.log("protein name: ", proteinName);

                            var query = 'SELECT ?cellmlmodel ' +
                                'WHERE { GRAPH ?g { ' +
                                '?cellmlmodel <http://purl.org/dc/terms/description> "' + jsonModel.results.bindings[0].Protein.value + '". ' +
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
                                                    // console.log("relatedModel: ", relatedModel);

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
                });

                jQuery(window).trigger('resize');
            }
        }
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
                if (jsonAltProtein.results.bindings.length != 0) {
                    if (jsonAltProtein.results.bindings[0].Protein.value == proteinName) {
                        workspaceName = jsonAltProtein.results.bindings[0].workspaceName.value;
                        var URI = jsonAltProtein.results.bindings[0].URI.value;

                        var workspaceURI = workspaceName + "/" + "rawfile" + "/" + "HEAD" + "/" + alternativeCellmlArray[idAltProtein];
                        var label = document.createElement('label');
                        label.innerHTML = '<br><input id="' + alternativeCellmlArray[idAltProtein] + '#Protein" type="checkbox" ' +
                            'value="' + alternativeCellmlArray[idAltProtein] + '">' +
                            '<a href="' + workspaceURI + '" target="_blank"> ' + URI + '</a></label>';

                        altCellmlModel += label.innerHTML;
                    }
                }

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

                var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                    'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
                    'SELECT ?source_fma ?sink_fma ?med_entity_uri ' +
                    'WHERE { ' +
                    '<weinstein_1995-human-baso.cellml#NHE3.J_NHE3_Na> semsim:isComputationalComponentFor ?model_prop. ' +
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

                            membraneModeID.push([
                                jsonObjFlux.results.bindings[0].source_fma.value,
                                jsonObjFlux.results.bindings[0].sink_fma.value,
                                jsonObjFlux.results.bindings[0].med_entity_uri.value
                            ]);
                        }

                        // console.log("membraneObject: ", membraneObject);
                        // console.log("idMembrane: ", idMembrane);
                        // console.log("membraneModel.length: ", membraneModel.length);
                        // console.log("membraneModeID: ", membraneModeID);

                        idMembrane++;

                        if (idMembrane == membraneModel.length) {
                            var msg = "<p><b>Would you like to move?</b><\p>";
                            var msg2 = "<p><b>" + proteinName + "</b> is a <b>" + typeOfModel + "</b> model. It is located in " +
                                "<b>" + loc + "</b><\p>";

                            // TODO: make similar URI thing on model, biological, species, gene, and protein
                            var model = "<p><b>Model: </b>" + tempJSON[0].value + "</p>";
                            var biological = "<p><b>Biological Meaning: </b>" + tempJSON[1].value + "</p>";
                            var species = "<p><b>Species: </b>" + tempJSON[2].value + "</p>";
                            var gene = "<p><b>Gene: </b>" + tempJSON[3].value + "</p>";
                            var protein = "<p><b>Protein: </b>" + tempJSON[4].value + "</p>";

                            var alternativeModel = "<p><b>Alternative model of <b>" + proteinName + "</b></b>" + altCellmlModel + "</p>";

                            // Related apical or basolateral model
                            var membraneTransporter = "<p><b>" + membraneName + " model</b>";
                            if (membraneModelValue.length == 0) {
                                membraneTransporter += "<br>Not Exist";
                            }
                            else {
                                for (var i = 0; i < membraneModelValue.length; i++) {
                                    var label = document.createElement('label');
                                    label.innerHTML = '<br><input id="' + membraneModeID[i] + '#Protein" type="checkbox" ' +
                                        'value="' + membraneModelValue[i] + '"> ' + membraneModelValue[i] + '</label>';

                                    membraneTransporter += label.innerHTML;
                                }
                            }

                            // related organ models in PMR
                            var relatedOrganModels = "<p><b>" + typeOfModel + " model in PMR</b>";
                            if (relatedModelValue.length == 0) {
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

                            // TODO: How to write test case
                            // https://code.tutsplus.com/tutorials/testing-javascript-with-phantomjs--net-28243
                            // http://mochajs.org/#getting-started
                            // git commit and push; Travis will automate  continuous testing
                            // mocha.ui('bdd');
                            // mocha.reporter('html');
                            // var assert = chai.assert;
                            //
                            // describe('modelBody test', function () {
                            //     describe('modelBody test', function () {
                            //         it('should return -1 when the value is not present', function () {
                            //             assert.equal(1, [1, 2, 3].indexOf(4));
                            //             console.log("inside modelbody!");
                            //         });
                            //     });
                            // });

                            return;
                        }

                        relatedMembraneModel(workspaceName, membraneName);
                    },
                    true);
            }, true);
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
                // line 1
                linewithlineg[iGlobal]
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .attr("x1", dx1line[iGlobal])
                    .attr("y1", dy1line[iGlobal])
                    .attr("x2", dx2line[iGlobal])
                    .attr("y2", dy2line[iGlobal]);

                // text 1
                linewithtextg[iGlobal]
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .attr("x", dxtext[iGlobal])
                    .attr("y", dytext[iGlobal]);

                // circle
                circlewithlineg[iGlobal]
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .attr("cx", dx[iGlobal])
                    .attr("cy", dy[iGlobal]);

                if (linewithlineg2[iGlobal] != undefined && linewithtextg2[iGlobal] != undefined) {
                    // line 2
                    linewithlineg2[iGlobal]
                        .transition()
                        .delay(1000)
                        .duration(1000)
                        .attr("x1", dx1line2[iGlobal])
                        .attr("y1", dy1line2[iGlobal])
                        .attr("x2", dx2line2[iGlobal])
                        .attr("y2", dy2line2[iGlobal]);

                    // text 2
                    linewithtextg2[iGlobal]
                        .transition()
                        .delay(1000)
                        .duration(1000)
                        .attr("x", dxtext2[iGlobal])
                        .attr("y", dytext2[iGlobal]);
                }
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

                // lineBasolateralMembrane
                // TODO: apical!!

                linebasolateral
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .style("stroke", "orange");
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

    function dragcircle(d) {
        d3.select(this)
            .attr("cx", d.x = d3.event.x)
            .attr("cy", d.y = d3.event.y);
    }

    function dragcircleend(d) {
        d3.select(this).classed("dragging", false);
    }

    var markerWidth = 4;
    var markerHeight = 4;

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
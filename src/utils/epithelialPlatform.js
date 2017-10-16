/**
 * Created by dsar941 on 5/11/2017.
 */
var solutesBouncing = require("./solutesBouncing.js").solutesBouncing;
var getTextWidth = require("./miscellaneous.js").getTextWidth;
var uniqueify = require("./miscellaneous.js").uniqueify;
var uniqueifyjsonFlux = require("./miscellaneous.js").uniqueifyjsonFlux;
var sendPostRequest = require("../libs/ajax-utils.js").sendPostRequest;
var sendGetRequest = require("../libs/ajax-utils.js").sendGetRequest;
var showLoading = require("./miscellaneous.js").showLoading;
var uniqueifyEpithelial = require("./miscellaneous.js").uniqueifyEpithelial;
var getRequestObject = require("../libs/ajax-utils.js").getRequestObject;
var handleResponse = require("../libs/ajax-utils.js").handleResponse;

var epithelialPlatform = function (combinedMembrane, concentration_fma, source_fma, sink_fma,
                                  apicalMembrane, basolateralMembrane, membrane) {

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
    var membraneModel = [], membraneModelValue = [], membraneModelID = [];
    var proteinName, proteinText, cellmlModel, biological_meaning, biological_meaning2, speciesName, geneName;
    var idProtein = 0, idAltProtein = 0, idMembrane = 0, loc, typeOfModel, altCellmlModel = "", cthis;
    var icircleGlobal, organIndex, model_entity, model_entity2;

    var dx = [], dy = [], dxcircletext = [], dycircletext = [],
        dxtext = [], dytext = [], dxtext2 = [], dytext2 = [],
        dx1line = [], dy1line = [], dx2line = [], dy2line = [],
        dx1line2 = [], dy1line2 = [], dx2line2 = [], dy2line2 = [];

    var line = [], mindex;

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
            srctext: apicalMembrane[i].variable_text,
            srcfma: apicalMembrane[i].source_fma,
            snkfma: apicalMembrane[i].sink_fma
        });

        tempapical.push({
            srctext: apicalMembrane[i].variable_text2,
            srcfma: apicalMembrane[i].source_fma2,
            snkfma: apicalMembrane[i].sink_fma2
        });
    }

    // Extract basolateral fluxes
    for (var i = 0; i < basolateralMembrane.length; i++) {
        tempBasolateral.push({
            srctext: basolateralMembrane[i].variable_text,
            srcfma: basolateralMembrane[i].source_fma,
            snkfma: basolateralMembrane[i].sink_fma
        });

        tempBasolateral.push({
            srctext: basolateralMembrane[i].variable_text2,
            srcfma: basolateralMembrane[i].source_fma2,
            snkfma: basolateralMembrane[i].sink_fma2
        });
    }

    // remove apical fluxes from membrane array
    for (var i = 0; i < tempapical.length; i++) {
        for (var j = 0; j < membrane.length; j++) {
            if (tempapical[i].srctext == membrane[j].variable_text &&
                tempapical[i].srcfma == membrane[j].source_fma &&
                tempapical[i].snkfma == membrane[j].sink_fma) {

                membrane.splice(j, 1);
            }
        }
    }

    // remove basolateral fluxes from membrane array
    for (var i = 0; i < tempBasolateral.length; i++) {
        for (var j = 0; j < membrane.length; j++) {
            if (tempBasolateral[i].srctext == membrane[j].variable_text &&
                tempBasolateral[i].srcfma == membrane[j].source_fma &&
                tempBasolateral[i].snkfma == membrane[j].sink_fma) {

                membrane.splice(j, 1);
            }
        }
    }

    // TODO: Hard coded for Nachannel, Clchannel, Kchannel
    for (var i = 0; i < membrane.length; i++) {
        if (membrane[i].med_fma == apicalID && (membrane[i].med_pr == Nachannel ||
            membrane[i].med_pr == Clchannel || membrane[i].med_pr == Kchannel)) {
            apicalMembrane.push(
                {
                    solute_chebi: membrane[i].solute_chebi,
                    solute_text: membrane[i].solute_text,
                    variable_text: membrane[i].variable_text,
                    source_fma: membrane[i].source_fma,
                    sink_fma: membrane[i].sink_fma,
                    solute_chebi2: "channel",
                    solute_text2: "channel",
                    variable_text2: "channel",
                    source_fma2: "channel",
                    sink_fma2: "channel",
                    model_entity: membrane[i].model_entity,
                    model_entity2: "channel",
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr,
                    med_pr_text: membrane[i].med_pr_text,
                    med_pr_text_syn: membrane[i].med_pr_text_syn
                });

            membrane[i].solute_chebi2 = "channel";
            membrane[i].solute_text2 = "channel";
            membrane[i].variable_text2 = "channel";
            membrane[i].source_fma2 = "channel";
            membrane[i].sink_fma2 = "channel";
        }

        if (membrane[i].med_fma == basolateralID && (membrane[i].med_pr == Nachannel ||
            membrane[i].med_pr == Clchannel || membrane[i].med_pr == Kchannel)) {
            basolateralMembrane.push(
                {
                    solute_chebi: membrane[i].solute_chebi,
                    solute_text: membrane[i].solute_text,
                    variable_text: membrane[i].variable_text,
                    source_fma: membrane[i].source_fma,
                    sink_fma: membrane[i].sink_fma,
                    solute_chebi2: "channel",
                    solute_text2: "channel",
                    variable_text2: "channel",
                    source_fma2: "channel",
                    sink_fma2: "channel",
                    model_entity: membrane[i].model_entity,
                    model_entity2: "channel",
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr,
                    med_pr_text: membrane[i].med_pr_text,
                    med_pr_text_syn: membrane[i].med_pr_text_syn
                });

            membrane[i].solute_chebi2 = "channel";
            membrane[i].solute_text2 = "channel";
            membrane[i].variable_text2 = "channel";
            membrane[i].source_fma2 = "channel";
            membrane[i].sink_fma2 = "channel";
        }

        if (membrane[i].source_fma == luminalID && membrane[i].sink_fma == interstitialID) {
            paracellularMembrane.push(
                {
                    solute_chebi: membrane[i].solute_chebi,
                    solute_text: membrane[i].solute_text,
                    variable_text: membrane[i].variable_text,
                    source_fma: membrane[i].source_fma,
                    sink_fma: membrane[i].sink_fma,
                    solute_chebi2: "diffusive channel",
                    solute_text2: "diffusive channel",
                    variable_text2: "diffusive channel",
                    source_fma2: "diffusive channel",
                    sink_fma2: "diffusive channel",
                    model_entity: membrane[i].model_entity,
                    model_entity2: "diffusive channel",
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr,
                    med_pr_text: membrane[i].med_pr_text,
                    med_pr_text_syn: membrane[i].med_pr_text_syn
                });

            membrane[i].solute_chebi2 = "diffusive channel";
            membrane[i].solute_text2 = "diffusive channel";
            membrane[i].variable_text2 = "diffusive channel";
            membrane[i].source_fma2 = "diffusive channel";
            membrane[i].sink_fma2 = "diffusive channel";
        }
    }

    // single flux
    for (var i = 0; i < membrane.length; i++) {
        if (membrane[i].med_fma == apicalID && membrane[i].variable_text2 != "channel" &&
            membrane[i].variable_text2 != "diffusive channel") {
            apicalMembrane.push(
                {
                    solute_chebi: membrane[i].solute_chebi,
                    solute_text: membrane[i].solute_text,
                    variable_text: membrane[i].variable_text,
                    source_fma: membrane[i].source_fma,
                    sink_fma: membrane[i].sink_fma,
                    solute_chebi2: "",
                    solute_text2: "",
                    variable_text2: "single flux",
                    source_fma2: membrane[i].source_fma,
                    sink_fma2: membrane[i].sink_fma,
                    model_entity: membrane[i].model_entity,
                    model_entity2: "",
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr,
                    med_pr_text: membrane[i].med_pr_text,
                    med_pr_text_syn: membrane[i].med_pr_text_syn
                });
        }

        if (membrane[i].med_fma == basolateralID && membrane[i].variable_text2 != "channel" &&
            membrane[i].variable_text2 != "diffusive channel") {
            basolateralMembrane.push(
                {
                    solute_chebi: membrane[i].solute_chebi,
                    solute_text: membrane[i].solute_text,
                    variable_text: membrane[i].variable_text,
                    source_fma: membrane[i].source_fma,
                    sink_fma: membrane[i].sink_fma,
                    solute_chebi2: "",
                    solute_text2: "",
                    variable_text2: "single flux",
                    source_fma2: membrane[i].source_fma,
                    sink_fma2: membrane[i].sink_fma,
                    model_entity: membrane[i].model_entity,
                    model_entity2: "",
                    med_fma: membrane[i].med_fma,
                    med_pr: membrane[i].med_pr,
                    med_pr_text: membrane[i].med_pr_text,
                    med_pr_text_syn: membrane[i].med_pr_text_syn
                });
        }
    }

    console.log("membrane: ", membrane);
    console.log("concentration_fma: ", concentration_fma);
    console.log("apicalMembrane: ", apicalMembrane);
    console.log("basolateralMembrane: ", basolateralMembrane);
    console.log("paracellularMembrane: ", paracellularMembrane);

    // var combinedMembrane = [];

    for (var i = 0; i < apicalMembrane.length; i++)
        combinedMembrane.push(apicalMembrane[i]);
    for (var i = 0; i < basolateralMembrane.length; i++)
        combinedMembrane.push(basolateralMembrane[i]);
    for (var i = 0; i < paracellularMembrane.length; i++)
        combinedMembrane.push(paracellularMembrane[i]);

    console.log("combinedMembrane: ", combinedMembrane);

    var g = $("#svgVisualize"),
        wth = 2000, // 1200,
        hth = 900,
        width = 300,
        height = 400;

    var w = 800,
        h = height + 500; // Init 400 + 500 = 900

    var prevHeight = height;

    var lengthOfApicalMem = 0, lengthOfBasoMem = 0;
    for (var i = 0; i < combinedMembrane.length; i++) {
        if (combinedMembrane[i].med_fma == apicalID)
            lengthOfApicalMem++;
        else if (combinedMembrane[i].med_fma == basolateralID)
            lengthOfBasoMem++;
    }

    // if (apicalMembrane.length > basolateralMembrane.length && apicalMembrane.length > 4)
    //     height += 50 * (apicalMembrane.length - 4);
    //
    // if (basolateralMembrane.length > apicalMembrane.length && basolateralMembrane.length > 4)
    //     height += 50 * (basolateralMembrane.length - 4);

    if (lengthOfApicalMem > lengthOfBasoMem && lengthOfApicalMem > 4)
        height += 50 * (lengthOfApicalMem - 4);

    if (lengthOfBasoMem > lengthOfApicalMem && lengthOfBasoMem > 4)
        height += 50 * (lengthOfBasoMem - 4);

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
        // var textvaluechk = combinedMembrane[i].variable_text + " " + combinedMembrane[i].variable_text2;
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
        },

        click: function () {
            // Change marker direction and text position
            if (event.target.localName == "line" && event.target.nodeName == "line") {

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
        }
    });

    // apical, basolateral, and paracellular membrane
    for (var i = 0; i < combinedMembrane.length; i++) {
        model_entity = combinedMembrane[i].model_entity;

        var tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
            "rawfile" + "/" + "HEAD" + "/" + model_entity;

        if (combinedMembrane[i].model_entity2 != undefined)
            model_entity2 = combinedMembrane[i].model_entity2;
        else model_entity2 = "";

        var mediator_fma = combinedMembrane[i].med_fma,
            mediator_pr = combinedMembrane[i].med_pr,
            mediator_pr_text = combinedMembrane[i].med_pr_text,
            mediator_pr_text_syn = combinedMembrane[i].med_pr_text_syn,

            solute_chebi = combinedMembrane[i].solute_chebi,
            solute_chebi2 = combinedMembrane[i].solute_chebi2,
            solute_text = combinedMembrane[i].solute_text,
            solute_text2 = combinedMembrane[i].solute_text2,

            textvalue = combinedMembrane[i].variable_text,
            textvalue2 = combinedMembrane[i].variable_text2,
            src_fma = combinedMembrane[i].source_fma,
            src_fma2 = combinedMembrane[i].source_fma2,
            snk_fma = combinedMembrane[i].sink_fma,
            snk_fma2 = combinedMembrane[i].sink_fma2,
            textWidth = getTextWidth(textvalue, 12),

            tempID = circlewithlineg.length;

        /*  Apical Membrane */
        if (mediator_fma == apicalID) {
            // case 1
            if ((src_fma == luminalID && snk_fma == cytosolID) &&
                ((src_fma2 == "" && snk_fma2 == "") || (src_fma2 == luminalID && snk_fma2 == cytosolID))) {
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
                        if (model_entity2 == "") {
                            src_fma2 = "";
                            snk_fma2 = "";
                            combinedMembrane[i].source_fma2 = "";
                            combinedMembrane[i].sink_fma2 = "";
                        }
                        return [
                            model_entity, model_entity2,
                            textvalue, textvalue2,
                            src_fma, snk_fma, src_fma2, snk_fma2,
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
                        dxcircletext[i] = d.x - 15;
                        return d.x - 15;
                    })
                    .attr("y", function (d) {
                        dycircletext[i] = d.y + 23;
                        return d.y + 23;
                    })
                    .attr("font-size", "12px")
                    .attr("fill", "red")
                    .attr("fontWeight", "bold")
                    .attr("cursor", "move")
                    .text(mediator_pr_text_syn);

                if (textvalue2 == "single flux") {
                    linewithlineg2[i] = "";
                    linewithtextg2[i] = "";
                    dx1line2[i] = "";
                    dy1line2[i] = "";
                    dx2line2[i] = "";
                    dy2line2[i] = "";
                    dxtext2[i] = "";
                    dytext2[i] = "";
                }

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
            if ((src_fma == cytosolID && snk_fma == luminalID) &&
                ((src_fma2 == "" && snk_fma2 == "") || (src_fma2 == cytosolID && snk_fma2 == luminalID))) {
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
                        if (model_entity2 == "") {
                            src_fma2 = "";
                            snk_fma2 = "";
                            combinedMembrane[i].source_fma2 = "";
                            combinedMembrane[i].sink_fma2 = "";
                        }
                        return [
                            model_entity, model_entity2,
                            textvalue, textvalue2,
                            src_fma, snk_fma, src_fma2, snk_fma2,
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
                        dxcircletext[i] = d.x - 15;
                        return d.x - 15;
                    })
                    .attr("y", function (d) {
                        dycircletext[i] = d.y + 23;
                        return d.y + 23;
                    })
                    .attr("font-size", "12px")
                    .attr("fill", "red")
                    .attr("fontWeight", "bold")
                    .attr("cursor", "move")
                    .text(mediator_pr_text_syn);

                if (textvalue2 == "single flux") {
                    linewithlineg2[i] = "";
                    linewithtextg2[i] = "";
                    dx1line2[i] = "";
                    dy1line2[i] = "";
                    dx2line2[i] = "";
                    dy2line2[i] = "";
                    dxtext2[i] = "";
                    dytext2[i] = "";
                }

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
                        if (model_entity2 == "") {
                            src_fma2 = "";
                            snk_fma2 = "";
                            combinedMembrane[i].source_fma2 = "";
                            combinedMembrane[i].sink_fma2 = "";
                        }
                        return [
                            model_entity, model_entity2,
                            textvalue, textvalue2,
                            src_fma, snk_fma, src_fma2, snk_fma2,
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
                        dxcircletext[i] = d.x - 15;
                        return d.x - 15;
                    })
                    .attr("y", function (d) {
                        dycircletext[i] = d.y + 23;
                        return d.y + 23;
                    })
                    .attr("font-size", "12px")
                    .attr("fill", "red")
                    .attr("fontWeight", "bold")
                    .attr("cursor", "move")
                    .text(mediator_pr_text_syn);

                if (textvalue2 == "single flux") {
                    linewithlineg2[i] = "";
                    linewithtextg2[i] = "";
                    dx1line2[i] = "";
                    dy1line2[i] = "";
                    dx2line2[i] = "";
                    dy2line2[i] = "";
                    dxtext2[i] = "";
                    dytext2[i] = "";
                }

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
                        if (model_entity2 == "") {
                            src_fma2 = "";
                            snk_fma2 = "";
                            combinedMembrane[i].source_fma2 = "";
                            combinedMembrane[i].sink_fma2 = "";
                        }
                        return [
                            model_entity, model_entity2,
                            textvalue, textvalue2,
                            src_fma, snk_fma, src_fma2, snk_fma2,
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
                        dxcircletext[i] = d.x - 15;
                        return d.x - 15;
                    })
                    .attr("y", function (d) {
                        dycircletext[i] = d.y + 23;
                        return d.y + 23;
                    })
                    .attr("font-size", "12px")
                    .attr("fill", "red")
                    .attr("fontWeight", "bold")
                    .attr("cursor", "move")
                    .text(mediator_pr_text_syn);

                if (textvalue2 == "single flux") {
                    linewithlineg2[i] = "";
                    linewithtextg2[i] = "";
                    dx1line2[i] = "";
                    dy1line2[i] = "";
                    dx2line2[i] = "";
                    dy2line2[i] = "";
                    dxtext2[i] = "";
                    dytext2[i] = "";
                }

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
            if ((src_fma == luminalID && snk_fma == cytosolID) && (textvalue2 == "channel")) {
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
                        if (model_entity2 == "") {
                            src_fma2 = "";
                            snk_fma2 = "";
                            combinedMembrane[i].source_fma2 = "";
                            combinedMembrane[i].sink_fma2 = "";
                        }
                        return [
                            model_entity, model_entity2,
                            textvalue, textvalue2,
                            src_fma, snk_fma, src_fma2, snk_fma2,
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
                        dxcircletext[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dycircletext[i] = d.y;
                        return d.y;
                    })
                    .attr("font-size", "10px")
                    .attr("fill", "red")
                    .attr("cursor", "move")
                    .text(mediator_pr_text_syn);

                linewithlineg2[i] = "";
                linewithtextg2[i] = "";
                dx1line2[i] = "";
                dy1line2[i] = "";
                dx2line2[i] = "";
                dy2line2[i] = "";
                dxtext2[i] = "";
                dytext2[i] = "";

                // increment y-axis of line and circle
                yvalue += ydistance;
                cyvalue += ydistance;
            }

            // case 6
            if ((src_fma == cytosolID && snk_fma == luminalID) && (textvalue2 == "channel")) {
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
                        if (model_entity2 == "") {
                            src_fma2 = "";
                            snk_fma2 = "";
                            combinedMembrane[i].source_fma2 = "";
                            combinedMembrane[i].sink_fma2 = "";
                        }
                        return [
                            model_entity, model_entity2,
                            textvalue, textvalue2,
                            src_fma, snk_fma, src_fma2, snk_fma2,
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
                        dxcircletext[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dycircletext[i] = d.y;
                        return d.y;
                    })
                    .attr("font-size", "10px")
                    .attr("fill", "red")
                    .attr("cursor", "move")
                    .text(mediator_pr_text_syn);

                linewithlineg2[i] = "";
                linewithtextg2[i] = "";
                dx1line2[i] = "";
                dy1line2[i] = "";
                dx2line2[i] = "";
                dy2line2[i] = "";
                dxtext2[i] = "";
                dytext2[i] = "";

                // increment y-axis of line and circle
                yvalue += ydistance;
                cyvalue += ydistance;
            }
        }

        /*  Basolateral Membrane */
        if (mediator_fma == basolateralID) {
            // case 1
            if ((src_fma == cytosolID && snk_fma == interstitialID) &&
                ((src_fma2 == "" && snk_fma2 == "") || (src_fma2 == cytosolID && snk_fma2 == interstitialID))) {
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
                        if (model_entity2 == "") {
                            src_fma2 = "";
                            snk_fma2 = "";
                            combinedMembrane[i].source_fma2 = "";
                            combinedMembrane[i].sink_fma2 = "";
                        }
                        return [
                            model_entity, model_entity2,
                            textvalue, textvalue2,
                            src_fma, snk_fma, src_fma2, snk_fma2,
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
                        dxcircletext[i] = d.x - 15;
                        return d.x - 15;
                    })
                    .attr("y", function (d) {
                        dycircletext[i] = d.y + 23;
                        return d.y + 23;
                    })
                    .attr("font-size", "12px")
                    .attr("fill", "red")
                    .attr("fontWeight", "bold")
                    .attr("cursor", "move")
                    .text(mediator_pr_text_syn);

                if (textvalue2 == "single flux") {
                    linewithlineg2[i] = "";
                    linewithtextg2[i] = "";
                    dx1line2[i] = "";
                    dy1line2[i] = "";
                    dx2line2[i] = "";
                    dy2line2[i] = "";
                    dxtext2[i] = "";
                    dytext2[i] = "";
                }

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
            if ((src_fma == interstitialID && snk_fma == cytosolID) &&
                ((src_fma2 == "" && snk_fma2 == "") || (src_fma2 == interstitialID && snk_fma2 == cytosolID))) {
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
                        if (model_entity2 == "") {
                            src_fma2 = "";
                            snk_fma2 = "";
                            combinedMembrane[i].source_fma2 = "";
                            combinedMembrane[i].sink_fma2 = "";
                        }
                        return [
                            model_entity, model_entity2,
                            textvalue, textvalue2,
                            src_fma, snk_fma, src_fma2, snk_fma2,
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
                        dxcircletext[i] = d.x - 15;
                        return d.x - 15;
                    })
                    .attr("y", function (d) {
                        dycircletext[i] = d.y + 23;
                        return d.y + 23;
                    })
                    .attr("font-size", "12px")
                    .attr("fill", "red")
                    .attr("fontWeight", "bold")
                    .attr("cursor", "move")
                    .text(mediator_pr_text_syn);

                if (textvalue2 == "single flux") {
                    linewithlineg2[i] = "";
                    linewithtextg2[i] = "";
                    dx1line2[i] = "";
                    dy1line2[i] = "";
                    dx2line2[i] = "";
                    dy2line2[i] = "";
                    dxtext2[i] = "";
                    dytext2[i] = "";
                }

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
                        if (model_entity2 == "") {
                            src_fma2 = "";
                            snk_fma2 = "";
                            combinedMembrane[i].source_fma2 = "";
                            combinedMembrane[i].sink_fma2 = "";
                        }
                        return [
                            model_entity, model_entity2,
                            textvalue, textvalue2,
                            src_fma, snk_fma, src_fma2, snk_fma2,
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
                        dxcircletext[i] = d.x - 15;
                        return d.x - 15;
                    })
                    .attr("y", function (d) {
                        dycircletext[i] = d.y + 23;
                        return d.y + 23;
                    })
                    .attr("font-size", "12px")
                    .attr("fill", "red")
                    .attr("fontWeight", "bold")
                    .attr("cursor", "move")
                    .text(mediator_pr_text_syn);

                if (textvalue2 == "single flux") {
                    linewithlineg2[i] = "";
                    linewithtextg2[i] = "";
                    dx1line2[i] = "";
                    dy1line2[i] = "";
                    dx2line2[i] = "";
                    dy2line2[i] = "";
                    dxtext2[i] = "";
                    dytext2[i] = "";
                }

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
                        if (model_entity2 == "") {
                            src_fma2 = "";
                            snk_fma2 = "";
                            combinedMembrane[i].source_fma2 = "";
                            combinedMembrane[i].sink_fma2 = "";
                        }
                        return [
                            model_entity, model_entity2,
                            textvalue, textvalue2,
                            src_fma, snk_fma, src_fma2, snk_fma2,
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
                        dxcircletext[i] = d.x - 15;
                        return d.x - 15;
                    })
                    .attr("y", function (d) {
                        dycircletext[i] = d.y + 23;
                        return d.y + 23;
                    })
                    .attr("font-size", "12px")
                    .attr("fill", "red")
                    .attr("fontWeight", "bold")
                    .attr("cursor", "move")
                    .text(mediator_pr_text_syn);

                if (textvalue2 == "single flux") {
                    linewithlineg2[i] = "";
                    linewithtextg2[i] = "";
                    dx1line2[i] = "";
                    dy1line2[i] = "";
                    dx2line2[i] = "";
                    dy2line2[i] = "";
                    dxtext2[i] = "";
                    dytext2[i] = "";
                }

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
            if ((src_fma == interstitialID && snk_fma == cytosolID) && (textvalue2 == "channel")) {
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
                        if (model_entity2 == "") {
                            src_fma2 = "";
                            snk_fma2 = "";
                            combinedMembrane[i].source_fma2 = "";
                            combinedMembrane[i].sink_fma2 = "";
                        }
                        return [
                            model_entity, model_entity2,
                            textvalue, textvalue2,
                            src_fma, snk_fma, src_fma2, snk_fma2,
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
                        dxcircletext[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dycircletext[i] = d.y;
                        return d.y;
                    })
                    .attr("font-size", "10px")
                    .attr("fill", "red")
                    .attr("cursor", "move")
                    .text(mediator_pr_text_syn);

                linewithlineg2[i] = "";
                linewithtextg2[i] = "";
                dx1line2[i] = "";
                dy1line2[i] = "";
                dx2line2[i] = "";
                dy2line2[i] = "";
                dxtext2[i] = "";
                dytext2[i] = "";

                // increment y-axis of line and circle
                yvalueb += ydistance;
                cyvalueb += ydistance;
            }

            // case 6
            if ((src_fma == cytosolID && snk_fma == interstitialID) && (textvalue2 == "channel")) {
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
                        if (model_entity2 == "") {
                            src_fma2 = "";
                            snk_fma2 = "";
                            combinedMembrane[i].source_fma2 = "";
                            combinedMembrane[i].sink_fma2 = "";
                        }
                        return [
                            model_entity, model_entity2,
                            textvalue, textvalue2,
                            src_fma, snk_fma, src_fma2, snk_fma2,
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
                    .attr("id", function (d) {                 // .attr("id", "circlewithtext" + tempID)
                        if (model_entity2 == "") {
                            src_fma2 = "";
                            snk_fma2 = "";
                            combinedMembrane[i].source_fma2 = "";
                            combinedMembrane[i].sink_fma2 = "";
                        }
                        return [
                            model_entity, model_entity2,
                            textvalue, textvalue2,
                            src_fma, snk_fma, src_fma2, snk_fma2,
                            mediator_fma, mediator_pr,
                            solute_chebi, solute_chebi2, solute_text, solute_text2,
                            mediator_pr_text, mediator_pr_text_syn
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", paracellularID)
                    .attr("x", function (d) {
                        dxcircletext[i] = d.x;
                        return d.x;
                    })
                    .attr("y", function (d) {
                        dycircletext[i] = d.y;
                        return d.y;
                    })
                    .attr("font-size", "10px")
                    .attr("fill", "red")
                    .attr("cursor", "move")
                    .text(solute_text);

                linewithlineg2[i] = "";
                linewithtextg2[i] = "";
                dx1line2[i] = "";
                dy1line2[i] = "";
                dx2line2[i] = "";
                dy2line2[i] = "";
                dxtext2[i] = "";
                dytext2[i] = "";

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
                .attr("idParacellular", function (d) {
                    if (model_entity2 == "") {
                        src_fma2 = "";
                        snk_fma2 = "";
                        combinedMembrane[i].source_fma2 = "";
                        combinedMembrane[i].sink_fma2 = "";
                    }
                    return [
                        model_entity, model_entity2,
                        textvalue, textvalue2,
                        src_fma, snk_fma, src_fma2, snk_fma2,
                        mediator_fma, mediator_pr,
                        solute_chebi, solute_chebi2, solute_text, solute_text2,
                        mediator_pr_text, mediator_pr_text_syn
                    ];
                })
                .attr("index", tempID)
                .attr("membrane", paracellularID)
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

                    console.log("INSIDE PARACELLULAR: ", $(this).attr("idParacellular"));

                    // var id = d3.select(this)._groups[0][0].id,
                    var id = $(this).attr("idParacellular"),
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

            var linetextg = lineg.append("g").data([{x: xpvalue + 25, y: ypvalue}]);
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

            dxcircletext[i] = "";
            dycircletext[i] = "";
            linewithtextg[i] = "";
            linewithlineg2[i] = "";
            linewithtextg2[i] = "";
            dx1line2[i] = "";
            dy1line2[i] = "";
            dx2line2[i] = "";
            dy2line2[i] = "";
            dxtext[i] = "";
            dytext[i] = "";
            dxtext2[i] = "";
            dytext2[i] = "";

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

            // TODO: First condition always true!! change later
            if (membrane == paracellularID && i == 0) {
                mindex = 1;
                break;
            }
            if (membrane == paracellularID && i == 1) {
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
            if (circlewithtext[icircleGlobal] != "") {
                // text inside circle
                circlewithtext[icircleGlobal]
                    .attr("x", parseFloat(d3.select("#" + "circlewithtext" + icircleGlobal).attr("x")) + dx)
                    .attr("y", parseFloat(d3.select("#" + "circlewithtext" + icircleGlobal).attr("y")) + dy);
            }
        }

        if (linewithlineg[icircleGlobal] != undefined) {
            if (linewithlineg[icircleGlobal] != "") {
                // line 1
                linewithlineg[icircleGlobal]
                    .attr("x1", parseFloat(d3.select("#" + "linewithlineg" + icircleGlobal).attr("x1")) + dx)
                    .attr("y1", parseFloat(d3.select("#" + "linewithlineg" + icircleGlobal).attr("y1")) + dy)
                    .attr("x2", parseFloat(d3.select("#" + "linewithlineg" + icircleGlobal).attr("x2")) + dx)
                    .attr("y2", parseFloat(d3.select("#" + "linewithlineg" + icircleGlobal).attr("y2")) + dy);
            }
        }

        if (linewithtextg[icircleGlobal] != undefined) {
            if (linewithtextg[icircleGlobal] != "") {
                // text 1
                linewithtextg[icircleGlobal]
                    .attr("x", parseFloat(d3.select("#" + "linewithtextg" + icircleGlobal).attr("x")) + dx)
                    .attr("y", parseFloat(d3.select("#" + "linewithtextg" + icircleGlobal).attr("y")) + dy);
            }
        }

        if (linewithlineg2[icircleGlobal] != undefined) {
            if (linewithlineg2[icircleGlobal] != "") {
                // line 2
                linewithlineg2[icircleGlobal]
                    .attr("x1", parseFloat(d3.select("#" + "linewithlineg2" + icircleGlobal).attr("x1")) + dx)
                    .attr("y1", parseFloat(d3.select("#" + "linewithlineg2" + icircleGlobal).attr("y1")) + dy)
                    .attr("x2", parseFloat(d3.select("#" + "linewithlineg2" + icircleGlobal).attr("x2")) + dx)
                    .attr("y2", parseFloat(d3.select("#" + "linewithlineg2" + icircleGlobal).attr("y2")) + dy);
            }
        }

        if (linewithtextg2[icircleGlobal] != undefined) {
            if (linewithtextg2[icircleGlobal] != "") {
                // text 2
                linewithtextg2[icircleGlobal]
                    .attr("x", parseFloat(d3.select("#" + "linewithtextg2" + icircleGlobal).attr("x")) + dx)
                    .attr("y", parseFloat(d3.select("#" + "linewithtextg2" + icircleGlobal).attr("y")) + dy);
            }
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

            // TODO: First condition always true!! change later
            if ($(this).attr("membrane") == paracellularID && i == 0) {
                mindex = 1;
                break;
            }
            if ($(this).attr("membrane") == paracellularID && i == 1) {
                mindex = 0;
                break;
            }
        }

        // If paracellular's diffusive channel Then undefined
        // if ($("line")[mindex] != undefined) {
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

        // paracellular
        if ($(this).prop("tagName") == "text") { // OR if ($(this).attr("membrane") == paracellularID) {}
            cx = $(this).attr("x");
            cy = $(this).attr("y");
        }

        var lineb_id = $($("line")[mindex]).prop("id");

        var circle_id;
        if ($(this).attr("membrane") == paracellularID) {
            circle_id = $(this).attr("idParacellular");
        }
        else {
            circle_id = $(this).prop("id");
        }

        // if ((cx >= lineb_x && cx <= lineb_x + 1) &&
        //     (cy >= lineb_y1 && cy <= lineb_y2) && (lineb_id != circle_id)) {
        //     $($("line")[mindex]).css("stroke", "red");

        // console.log("drop cx, cy: ", cx, cy, lineb_x, circle_id, lineb_id);

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
        // }
    }

    function dragcircleendline(d) {
        initdragcircleandend();

        // If paracellular's diffusive channel Then undefined
        // if ($("line")[mindex] != undefined) {
        // detect basolateralMembrane - 0 apical, 1 basolateralMembrane, 3 cell junction
        var lineb_x = $($("line")[mindex]).prop("x1").baseVal.value;
        // var lineb_y1 = $($("line")[mindex]).prop("y1").baseVal.value;
        // var lineb_y2 = $($("line")[mindex]).prop("y2").baseVal.value;

        var cx, cy;
        if ($(cthis).prop("tagName") == "circle") {
            cx = $(cthis).prop("cx").baseVal.value;
            cy = $(cthis).prop("cy").baseVal.value;
        }

        if ($(cthis).prop("tagName") == "polygon") {
            cx = event.x;
            cy = event.y;
        }

        // paracellular
        if ($(cthis).prop("tagName") == "text") { // OR if ($(cthis).attr("membrane") == paracellularID) {}
            cx = $(cthis).attr("x");
            cy = $(cthis).attr("y");
        }

        var lineb_id = $($("line")[mindex]).prop("id");

        var circle_id;
        if ($(cthis).attr("membrane") == paracellularID) {
            circle_id = $(cthis).attr("idParacellular");
        }
        else {
            circle_id = $(cthis).prop("id");
        }

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
                            reinitVariable();
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

                            var circleID;
                            if ($(cthis).attr("membrane") == paracellularID) {
                                circleID = $(cthis).attr("idParacellular").split(",");
                            }
                            else {
                                circleID = $(cthis).prop("id").split(",");
                            }

                            // var circleID = $(cthis).prop("id").split(",");
                            console.log("circleID in myWelcomeModal: ", circleID);

                            // parsing
                            cellmlModel = circleID[0];
                            var indexOfHash = cellmlModel.search("#");
                            cellmlModel = cellmlModel.slice(0, indexOfHash);

                            cellmlModel = cellmlModel + "#" + cellmlModel.slice(0, cellmlModel.indexOf('.'));

                            console.log("cellmlModel: ", cellmlModel);

                            if (circleID[1] != "") {
                                var query = 'SELECT ?Protein ?Biological_meaning ?Biological_meaning2 ' +
                                    'WHERE { GRAPH ?g { ' +
                                    '<' + cellmlModel + '> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein . ' +
                                    '<' + circleID[0] + '> <http://purl.org/dc/terms/description> ?Biological_meaning . ' +
                                    '<' + circleID[1] + '> <http://purl.org/dc/terms/description> ?Biological_meaning2 . ' +
                                    '}}'
                            }
                            else {
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

                                                                                    var alternativeCellmlArray = [],
                                                                                        cellmlModel2 = cellmlModel,
                                                                                        indexOfHash = cellmlModel2.search("#");
                                                                                    cellmlModel2 = cellmlModel2.slice(0, indexOfHash);
                                                                                    for (var i = 0; i < relatedModel.length; i++) {
                                                                                        if (relatedModel[i] != cellmlModel2) {
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
        // }
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

        // console.log("alternativeCellmlArray: ", alternativeCellmlArray[idAltProtein], membrane, alternativeCellmlArray);
        var modelname;
        if (alternativeCellmlArray[idAltProtein] == undefined) {
            modelname = undefined;
        }
        else {
            var indexOfcellml = alternativeCellmlArray[idAltProtein].search(".cellml");
            modelname = alternativeCellmlArray[idAltProtein].slice(0, indexOfcellml);
            modelname = alternativeCellmlArray[idAltProtein] + "#" + modelname;
        }

        // console.log("modelname: ", modelname);

        var query = 'SELECT ?Protein ?workspaceName ' +
            'WHERE { GRAPH ?workspaceName { ' +
            '<' + modelname + '> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein . ' +
            '}}'

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
                        console.log("jsonAltProtein INSIDE: ", jsonAltProtein.results.bindings[0].Protein.value);

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

        var circleID;
        if ($(cthis).attr("membrane") == paracellularID) {
            circleID = $(cthis).attr("idParacellular").split(",");
            console.log("CHEBI: ", circleID);
        }
        else {
            circleID = $(cthis).prop("id").split(",");
            console.log("CHEBI: ", circleID);
        }

        // TODO: single flux may look for cotranssporters??
        // TODO: so also give a solute chebi in the first query??
        if (circleID[11] == "") { // single flux
            var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                'PREFIX dcterms: <http://purl.org/dc/terms/>' +
                'SELECT ?Model_entity ' +
                'WHERE { GRAPH ?g { ' +
                '?entity semsim:hasPhysicalDefinition <' + circleID[10] + '>. ' +
                '?source semsim:hasPhysicalEntityReference ?entity. ' +
                '?process semsim:hasSourceParticipant ?source. ' +
                '?property semsim:physicalPropertyOf ?process. ' +
                '?Model_entity semsim:isComputationalComponentFor ?property.' +
                '?process semsim:hasMediatorParticipant ?model_medparticipant.' +
                '?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity.' +
                '?med_entity semsim:hasPhysicalDefinition <' + membrane + '>.' +
                '}}';
        }
        else { // cotransporter
            var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                'PREFIX dcterms: <http://purl.org/dc/terms/>' +
                'SELECT ?Model_entity ?Model_entity2 ' +
                'WHERE { GRAPH ?g { ' +
                '?entity semsim:hasPhysicalDefinition <' + circleID[10] + '>. ' +
                '?source semsim:hasPhysicalEntityReference ?entity. ' +
                '?process semsim:hasSourceParticipant ?source. ' +
                '?property semsim:physicalPropertyOf ?process. ' +
                '?Model_entity semsim:isComputationalComponentFor ?property.' +
                '?process semsim:hasMediatorParticipant ?model_medparticipant.' +
                '?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity.' +
                '?med_entity semsim:hasPhysicalDefinition <' + membrane + '>.' +
                '?entity2 semsim:hasPhysicalDefinition <' + circleID[11] + '>. ' +
                '?source2 semsim:hasPhysicalEntityReference ?entity2. ' +
                '?process2 semsim:hasSourceParticipant ?source2. ' +
                '?property2 semsim:physicalPropertyOf ?process2. ' +
                '?Model_entity2 semsim:isComputationalComponentFor ?property2.' +
                '?process2 semsim:hasMediatorParticipant ?model_medparticipant2.' +
                '?model_medparticipant2 semsim:hasPhysicalEntityReference ?med_entity2.' +
                '?med_entity2 semsim:hasPhysicalDefinition <' + membrane + '>.' +
                '}}';
        }

        sendPostRequest(
            endpoint,
            query,
            function (jsonRelatedMembrane) {

                console.log("jsonRelatedMembrane: ", jsonRelatedMembrane);

                var fluxList = [], cotransporterList = [];
                for (var i = 0; i < jsonRelatedMembrane.results.bindings.length; i++) {

                    fluxList.push(jsonRelatedMembrane.results.bindings[i].Model_entity.value);

                    if (circleID[11] != "") {
                        fluxList.push(jsonRelatedMembrane.results.bindings[i].Model_entity2.value);
                    }
                }

                console.log("fluxList 1ST: ", fluxList);

                // delete: model name and variable name are same but component name different
                for (var i = 0; i < fluxList.length; i++) {

                    if (fluxList[i].search("#") == undefined) continue;

                    var cellmlmodel = fluxList[i],
                        indexOfHash = cellmlmodel.search("#"),
                        name = cellmlmodel.slice(0, indexOfHash),
                        compvartext = cellmlmodel.slice(indexOfHash + 1),
                        indexOfdot = compvartext.indexOf("."),
                        text = compvartext.slice(indexOfdot + 1);

                    for (var j = i + 1; j < fluxList.length; j++) {
                        var cellmlmodel2 = fluxList[j],
                            indexOfHash2 = cellmlmodel2.search("#"),
                            name2 = cellmlmodel2.slice(0, indexOfHash2),
                            compvartext2 = cellmlmodel2.slice(indexOfHash2 + 1),
                            indexOfdot2 = compvartext2.indexOf("."),
                            text2 = compvartext2.slice(indexOfdot2 + 1);

                        if (name == name2 && text == text2) {
                            fluxList.splice(j, 1);
                            // i--;
                            j--;
                        }
                    }
                }
                console.log("fluxList 2ND: ", fluxList);

                var counter = 0;
                // Utility to calculate number of iterations
                function iteration(length) {
                    var sum = 0;
                    for (var i = 0; i < length; i++) {
                        sum = sum + (length - i - 1);
                    }

                    return sum;
                }

                var makecotransporter = function (membrane1, membrane2) {
                    var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                        'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
                        'SELECT ?med_entity_uri ?med_entity_uriCl ' +
                        'WHERE { GRAPH ?Workspace { ' +
                        '<' + membrane1 + '> semsim:isComputationalComponentFor ?model_prop. ' +
                        '?model_prop semsim:physicalPropertyOf ?model_proc. ' +
                        '?model_proc semsim:hasMediatorParticipant ?model_medparticipant. ' +
                        '?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity. ' +
                        '?med_entity semsim:hasPhysicalDefinition ?med_entity_uri.' +
                        '<' + membrane2 + '> semsim:isComputationalComponentFor ?model_propCl. ' +
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
                            var tempProtein = [], tempFMA = [];
                            for (var m = 0; m < jsonObj.results.bindings.length; m++) {
                                var tmpPro = jsonObj.results.bindings[m].med_entity_uri.value;
                                var tmpFMA = jsonObj.results.bindings[m].med_entity_uri.value;

                                if (tmpPro.indexOf("http://purl.obolibrary.org/obo/PR_") != -1) {
                                    tempProtein.push(jsonObj.results.bindings[m].med_entity_uri.value);
                                }

                                if (tmpFMA.indexOf("http://identifiers.org/fma/FMA:") != -1) {
                                    tempFMA.push(jsonObj.results.bindings[m].med_entity_uri.value);
                                }
                            }

                            // remove duplicate protein ID
                            // TODO: probably no need to do this!
                            tempProtein = tempProtein.filter(function (item, pos) {
                                return tempProtein.indexOf(item) == pos;
                            })
                            tempFMA = tempFMA.filter(function (item, pos) {
                                return tempFMA.indexOf(item) == pos;
                            })

                            console.log("temp protein, and fma: ", tempProtein, tempFMA);

                            for (var i = 0; i < tempProtein.length; i++) {
                                // cotransporter
                                if (tempProtein.length != 0 && tempFMA.length != 0) {
                                    cotransporterList.push({
                                        "membrane1": membrane1,
                                        "membrane2": membrane2
                                    });
                                }
                            }

                            counter++;

                            console.log("counter and iteration: ", counter, iteration(fluxList.length));

                            if (counter == iteration(fluxList.length)) {

                                // delete cotransporter indices from fluxList
                                for (var i = 0; i < cotransporterList.length; i++) {
                                    for (var j = 0; j < fluxList.length; j++) {
                                        if (cotransporterList[i].membrane1 == fluxList[j] ||
                                            cotransporterList[i].membrane2 == fluxList[j]) {

                                            fluxList.splice(j, 1);
                                        }
                                    }
                                }

                                // make cotransproter in membraneModel
                                for (var i = 0; i < cotransporterList.length; i++) {
                                    membraneModel.push({
                                        "model_entity": cotransporterList[i].membrane1,
                                        "model_entity2": cotransporterList[i].membrane2
                                    });
                                }

                                // make single flux in membraneModel
                                for (var i = 0; i < fluxList.length; i++) {
                                    membraneModel.push({
                                        "model_entity": fluxList[i],
                                        "model_entity2": ""
                                    });
                                }

                                console.log("fluxList: ", fluxList);
                                console.log("cotransporterList: ", cotransporterList);
                                console.log("membraneModel: ", membraneModel);

                                console.log("counter and iteration: ", counter, iteration(fluxList.length));

                                relatedMembraneModel(workspaceName, membraneName, cotransporterList);
                            }
                        },
                        true);
                };

                if (fluxList.length <= 1) {
                    console.log("fluxList.length <= 1");
                    // make single flux in membraneModel
                    membraneModel.push({
                        "model_entity": fluxList[0],
                        "model_entity2": ""
                    });

                    console.log("fluxList: ", fluxList);
                    console.log("cotransporterList: ", cotransporterList);
                    console.log("membraneModel: ", membraneModel);

                    relatedMembraneModel(workspaceName, membraneName, cotransporterList);
                }
                else {
                    for (var i = 0; i < fluxList.length; i++) {
                        for (var j = i + 1; j < fluxList.length; j++) {
                            makecotransporter(fluxList[i], fluxList[j]);
                        }
                    }
                }
            },
            true);
    }

    var sendEBIPostRequest = function (requestUrl, query, responseHandler, isJsonResponse) {
        var request = getRequestObject();

        request.onreadystatechange = function () {
            handleResponse(request, responseHandler, isJsonResponse);
        };

        request.open("POST", requestUrl, true);

        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.setRequestHeader("Accept", "text/plain");

        var data = '';
        for (var key in query) {
            data += encodeURIComponent(key);
            data += '=';
            data += encodeURIComponent(query[key]);
            data += '&';
        }
        console.log('data: ', data);
        request.send(data); // for POST only
    };

    var showModalWindow = function (workspaceName, membraneName) {
        idMembrane = 0;

        var circleID;
        if ($(cthis).attr("membrane") == paracellularID) {
            circleID = $(cthis).attr("idParacellular").split(",");
        }
        else {
            circleID = $(cthis).prop("id").split(",");
        }

        var msg2 = "<p><b>" + proteinText + "</b> is a <b>" + typeOfModel + "</b> model. It is located in " +
            "<b>" + loc + "</b><\p>";

        var workspaceuri = "https://models.physiomeproject.org/workspace/267" + "/" +
            "rawfile" + "/" + "HEAD" + "/" + circleID[0];

        var model = "<b>Model: </b><a href='" + workspaceuri + "' target='_blank " +
            "data-toggle='tooltip' data-placement='right' " +
            "title='" + proteinText + "'>" + circleID[0] + "</a>";

        var biological = "<p><b>Biological Meaning: </b>" + biological_meaning + "</p>";

        if (biological_meaning2 != "")
            biological += "<p>" + biological_meaning2 + "</p>";

        var species = "<p><b>Species: </b>" + speciesName + "</p>";
        var gene = "<p><b>Gene: </b>" + geneName + "</p>";
        var protein = "<p data-toggle='tooltip' data-placement='right' title='" + proteinName + "'>" +
            "<b>Protein: </b>" + proteinText + "</p>";

        // Related apical or basolateral model
        var index = 0,
            ProteinSeq = "",
            requestData,
            PID = [],
            // PID = ["P11170", "P31636", "P26433", "Q62439", "Q9ET37", "P48764"],
            baseUrl = 'https://www.ebi.ac.uk/Tools/services/rest/clustalo';

        for (var i = 0; i < membraneModelID.length; i++) {
            PID.push(membraneModelID[i][15]); // PROTEIN id
        }

        console.log("PID: ", PID);

        // TODO: if PID is empty, i.e. no related baso or apical membrane, then add the dragged
        // TODO: protein Id in PID. After having the sequence, append a "0" digit after the protein Id in the
        // TODO: result. e.g. >sp|P11170"0"|SC5A1_RABIT ...And we will get 100 percent matching.
        // TODO: Make a comparison at the end that if 100 percent then "Not exist".

        //TODO: how to deal with running time issue?

        // https://www.ebi.ac.uk/seqdb/confluence/pages/viewpage.action?pageId=48923608
        var WSDbfetchREST = function () {

            var dbfectendpoint = "http://www.ebi.ac.uk/Tools/dbfetch/dbfetch/uniprotkb/" + PID[index] + "/fasta";

            sendGetRequest(
                dbfectendpoint,
                function (psequence) {
                    ProteinSeq += psequence;

                    index++;
                    if (index == PID.length) {
                        // console.log("ProteinSeq: ", ProteinSeq);

                        requestData = {
                            "sequence": ProteinSeq,
                            "email": "dsar941@aucklanduni.ac.nz"
                        }

                        // console.log("requestData: ", requestData);

                        // https://www.ebi.ac.uk/seqdb/confluence/display/WEBSERVICES/clustalo_rest

                        var requestUrl = baseUrl + '/run/';

                        sendEBIPostRequest(
                            requestUrl,
                            requestData,
                            function (jobId) {
                                console.log("jobId: ", jobId); // jobId

                                var jobIdUrl = baseUrl + '/status/' + jobId;
                                sendGetRequest(
                                    jobIdUrl,
                                    function (resultObj) {
                                        console.log("result: ", resultObj); // jobId status

                                        var pimUrl = baseUrl + '/result/' + jobId + '/pim';
                                        sendGetRequest(
                                            pimUrl,
                                            function (identityMatrix) {

                                                console.log("Identity Matrix: ", identityMatrix);

                                                // var identityMatrix = 'Identity Matrix:  #' +
                                                //     '#' +
                                                //     '#  Percent Identity  Matrix - created by Clustal2.1' +
                                                //     '#' +
                                                //     '#' +
                                                //     '1: sp|P11170|SC5A1_RABIT   100.00   73.03   18.47   20.34   67.38   17.34 ' +
                                                //     '2: sp|P31636|SC5A4_PIG      73.03  100.00   18.55   22.09   78.96   17.83 ' +
                                                //     '3: sp|P26433|SL9A3_RAT      18.47   18.55  100.00   18.14   16.77   89.49 ' +
                                                //     '4: tr|Q62439|Q62439_MOUSE   20.34   22.09   18.14  100.00   20.71   19.58 ' +
                                                //     '5: sp|Q9ET37|S5A4A_MOUSE    67.38   78.96   16.77   20.71  100.00   16.06 ' +
                                                //     '6: sp|P48764|SL9A3_HUMAN    17.34   17.83   89.49   19.58   16.06  100.00 ';

                                                var indexOfColon = identityMatrix.search("1:");

                                                console.log("index1stBar: ", identityMatrix.slice(indexOfColon - 1, identityMatrix.length));
                                                identityMatrix = identityMatrix.slice(indexOfColon - 1, identityMatrix.length);

                                                console.log("New Identity Matrix: ", identityMatrix);

                                                var matrixArray = identityMatrix.match(/[(\w\:)*\d\.]+/gi),
                                                    proteinIndex = [],
                                                    twoDMatrix = [];

                                                console.log("matrixArray: ", matrixArray);

                                                for (var i = 0; i < matrixArray.length; i = i + PID.length + 3) // +3 for digit:, PID, and Genes and Species
                                                    matrixArray.splice(i, 1);

                                                for (var i = 0; i < matrixArray.length; i = i + PID.length + 2) // +2 for PID and Genes and Species
                                                    matrixArray.splice(i, 1);

                                                for (var i = 1; i < matrixArray.length; i = i + PID.length + 1) // +1 for PID
                                                    matrixArray.splice(i, 1);

                                                console.log("matrixArray: ", matrixArray);

                                                for (var i = 0; i < matrixArray.length; i++) {
                                                    if (matrixArray[i].charAt(0).match(/[A-Za-z]/gi)) {
                                                        proteinIndex.push([matrixArray[i], i]);
                                                    }
                                                }

                                                console.log("proteinIndex: ", proteinIndex);

                                                // 1D to 2D array
                                                while (matrixArray.length) {
                                                    matrixArray.splice(0, 1); // remove protein ID
                                                    twoDMatrix.push(matrixArray.splice(0, proteinIndex.length));
                                                }

                                                for (var i = 0; i < twoDMatrix.length; i++) {
                                                    for (var j = 0; j < twoDMatrix[i].length; j++) {
                                                        twoDMatrix[i][j] = parseFloat(twoDMatrix[i][j]);
                                                    }
                                                }

                                                console.log("twoDMatrix: ", twoDMatrix);

                                                var similarityOBJ = [];
                                                for (var i = 0; i < twoDMatrix.length; i++) {
                                                    for (var j = 0; j < twoDMatrix.length; j++) {
                                                        if (i == j || j < i) continue;

                                                        similarityOBJ.push({
                                                            "PID1": proteinIndex[i][0],
                                                            "PID2": proteinIndex[j][0],
                                                            "similarity": twoDMatrix[i][j]
                                                        })
                                                    }
                                                }

                                                console.log("similarityOBJ: ", similarityOBJ);
                                                console.log("membraneModelValue: ", membraneModelValue);

                                                var indexOfPR = proteinName.search("PR_"),
                                                    draggedProteinID = proteinName.slice(indexOfPR + 3, proteinName.length);

                                                console.log("draggedProteinID: ", draggedProteinID);

                                                for (var m = 0; m < membraneModelValue.length; m++) {
                                                    for (var n = 0; n < similarityOBJ.length; n++) {
                                                        if ((membraneModelValue[m].pid == similarityOBJ[n].PID1 &&
                                                            draggedProteinID == similarityOBJ[n].PID2) ||
                                                            (membraneModelValue[m].pid == similarityOBJ[n].PID2 &&
                                                            draggedProteinID == similarityOBJ[n].PID1)) {
                                                            membraneModelValue[m].similar = similarityOBJ[n].similarity;
                                                        }
                                                    }
                                                }

                                                console.log("membraneModelValue: ", membraneModelValue);

                                                // Descending sorting
                                                membraneModelValue.sort(function (a, b) {
                                                    return b.similar - a.similar;
                                                });

                                                console.log("AFTER membraneModelValue: ", membraneModelValue);
                                                console.log("AFTER membraneModelId: ", membraneModelID);

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

                                                reinitVariable();

                                            },
                                            false);
                                    },
                                    false);
                            },
                            false);

                        return;
                    }

                    WSDbfetchREST();
                },
                false);
        }

        WSDbfetchREST();
    }

    var source_fma = [], sink_fma = [], med_fma = [], med_pr = [], solute_chebi = [];
    var source_fma2 = [], sink_fma2 = [], solute_chebi2 = [];

    var partOfProteinUri = "http://purl.obolibrary.org/obo/PR";
    var partOfCHEBIUri = "http://identifiers.org/chebi/CHEBI";
    var partOfFMAUri = "http://identifiers.org/fma/FMA";

    var relatedMembraneModel = function (workspaceName, membraneName, cotransporterList) {

        var tempmembraneModel;
        if (membraneModel.length == 0)
            tempmembraneModel = undefined;
        else {
            var indexOfHash = membraneModel[idMembrane].model_entity.search("#");
            tempmembraneModel = membraneModel[idMembrane].model_entity.slice(0, indexOfHash);

            var indexOfcellml = tempmembraneModel.search(".cellml");
            var modelname = tempmembraneModel.slice(0, indexOfcellml);

            tempmembraneModel = tempmembraneModel + "#" + modelname;
        }

        // console.log("tempmembraneModel: ", tempmembraneModel);
        // console.log("membraneModel: ", membraneModel);

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

                var endpointprOLS;
                if (jsonRelatedMembraneModel.results.bindings.length == 0) {
                    showModalWindow(workspaceName, membraneName);
                    return;
                } else {
                    endpointprOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/pr/terms?iri=" +
                        jsonRelatedMembraneModel.results.bindings[0].Protein.value;
                }

                sendGetRequest(
                    endpointprOLS,
                    function (jsonPr) {

                        if (membraneModel[idMembrane].model_entity2 == "") {
                            var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                                'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
                                'SELECT ?source_fma ?sink_fma ?med_entity_uri ?solute_chebi ?solute_chebi2 ' +
                                'WHERE { ' +
                                '<' + membraneModel[idMembrane].model_entity + '> semsim:isComputationalComponentFor ?model_prop. ' +
                                '?model_prop semsim:physicalPropertyOf ?model_proc. ' +
                                '?model_proc semsim:hasSourceParticipant ?model_srcparticipant. ' +
                                '?model_srcparticipant semsim:hasPhysicalEntityReference ?source_entity. ' +
                                '?source_entity ro:part_of ?source_part_of_entity. ' +
                                '?source_part_of_entity semsim:hasPhysicalDefinition ?source_fma. ' +
                                '?source_entity semsim:hasPhysicalDefinition ?solute_chebi. ' +
                                '?source_entity semsim:hasPhysicalDefinition ?solute_chebi2. ' + // change this later
                                '?model_proc semsim:hasSinkParticipant ?model_sinkparticipant. ' +
                                '?model_sinkparticipant semsim:hasPhysicalEntityReference ?sink_entity. ' +
                                '?sink_entity ro:part_of ?sink_part_of_entity. ' +
                                '?sink_part_of_entity semsim:hasPhysicalDefinition ?sink_fma.' +
                                '?model_proc semsim:hasMediatorParticipant ?model_medparticipant.' +
                                '?model_medparticipant semsim:hasPhysicalEntityReference ?med_entity.' +
                                '?med_entity semsim:hasPhysicalDefinition ?med_entity_uri.' +
                                '}'
                        }
                        else {
                            var query = 'PREFIX semsim: <http://www.bhi.washington.edu/SemSim#>' +
                                'PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>' +
                                'SELECT ?source_fma ?sink_fma ?med_entity_uri ?solute_chebi ?source_fma2 ?sink_fma2 ?med_entity_uri2 ?solute_chebi2 ' +
                                'WHERE { ' +
                                '<' + membraneModel[idMembrane].model_entity + '> semsim:isComputationalComponentFor ?model_prop. ' +
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
                                '<' + membraneModel[idMembrane].model_entity2 + '> semsim:isComputationalComponentFor ?model_prop2. ' +
                                '?model_prop2 semsim:physicalPropertyOf ?model_proc2. ' +
                                '?model_proc2 semsim:hasSourceParticipant ?model_srcparticipant2. ' +
                                '?model_srcparticipant2 semsim:hasPhysicalEntityReference ?source_entity2. ' +
                                '?source_entity2 ro:part_of ?source_part_of_entity2. ' +
                                '?source_part_of_entity2 semsim:hasPhysicalDefinition ?source_fma2. ' +
                                '?source_entity2 semsim:hasPhysicalDefinition ?solute_chebi2. ' +
                                '?model_proc2 semsim:hasSinkParticipant ?model_sinkparticipant2. ' +
                                '?model_sinkparticipant2 semsim:hasPhysicalEntityReference ?sink_entity2. ' +
                                '?sink_entity2 ro:part_of ?sink_part_of_entity2. ' +
                                '?sink_part_of_entity2 semsim:hasPhysicalDefinition ?sink_fma2.' +
                                '?model_proc2 semsim:hasMediatorParticipant ?model_medparticipant2.' +
                                '?model_medparticipant2 semsim:hasPhysicalEntityReference ?med_entity2.' +
                                '?med_entity2 semsim:hasPhysicalDefinition ?med_entity_uri2.' +
                                '}'
                        }

                        sendPostRequest(
                            endpoint,
                            query,
                            function (jsonObjFlux) {
                                console.log("jsonObjFlux: ", jsonObjFlux);

                                var endpointOLS;
                                if (jsonObjFlux.results.bindings[0].solute_chebi == undefined) {
                                    endpointOLS = undefined;
                                }
                                else {
                                    var chebi_uri = jsonObjFlux.results.bindings[0].solute_chebi.value;
                                    var indexofColon = chebi_uri.indexOf('CHEBI:');
                                    chebi_uri = "http://purl.obolibrary.org/obo/CHEBI_" + chebi_uri.slice(indexofColon + 6);
                                    endpointOLS = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/chebi/terms?iri=" + chebi_uri;
                                }

                                sendGetRequest(
                                    endpointOLS,
                                    function (jsonObjOLSChebi) {

                                        var endpointOLS2;
                                        if (jsonObjFlux.results.bindings[0].solute_chebi2 == undefined) {
                                            endpointOLS2 = undefined;
                                        }
                                        else {
                                            var chebi_uri2 = jsonObjFlux.results.bindings[0].solute_chebi2.value;
                                            var indexofColon2 = chebi_uri2.indexOf('CHEBI:');
                                            chebi_uri2 = "http://purl.obolibrary.org/obo/CHEBI_" + chebi_uri2.slice(indexofColon2 + 6);

                                            endpointOLS2 = "http://ontology.cer.auckland.ac.nz/ols-boot/api/ontologies/chebi/terms?iri=" + chebi_uri2;
                                        }

                                        sendGetRequest(
                                            endpointOLS2,
                                            function (jsonObjOLSChebi2) {

                                                for (var i = 0; i < jsonObjFlux.results.bindings.length; i++) {
                                                    // solute chebi
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
                                                                uri: jsonObjFlux.results.bindings[i].solute_chebi.value
                                                            }
                                                        );

                                                    // solute chebi 2
                                                    var temparr2 = jsonObjOLSChebi2._embedded.terms[0].annotation["has_related_synonym"],
                                                        solute_chebi_name2;
                                                    for (var m = 0; m < temparr2.length; m++) {
                                                        if (temparr2[m].slice(-1) == '+' || temparr2[m].slice(-1) == '-') {
                                                            solute_chebi_name2 = temparr2[m];
                                                            break;
                                                        }
                                                    }

                                                    if (jsonObjFlux.results.bindings[i].solute_chebi2 == undefined)
                                                        solute_chebi2.push("");
                                                    else
                                                        solute_chebi2.push(
                                                            {
                                                                name: solute_chebi_name2,
                                                                uri: jsonObjFlux.results.bindings[i].solute_chebi2.value
                                                            }
                                                        );

                                                    // source fma
                                                    if (jsonObjFlux.results.bindings[i].source_fma == undefined)
                                                        source_fma.push("");
                                                    else
                                                        source_fma.push({fma: jsonObjFlux.results.bindings[i].source_fma.value});

                                                    // source fma 2
                                                    if (jsonObjFlux.results.bindings[i].source_fma2 == undefined)
                                                        source_fma2.push("");
                                                    else
                                                        source_fma2.push({fma2: jsonObjFlux.results.bindings[i].source_fma2.value});

                                                    // sink fma
                                                    if (jsonObjFlux.results.bindings[i].sink_fma == undefined)
                                                        sink_fma.push("");
                                                    else
                                                        sink_fma.push({fma: jsonObjFlux.results.bindings[i].sink_fma.value});

                                                    // sink fma 2
                                                    if (jsonObjFlux.results.bindings[i].sink_fma2 == undefined)
                                                        sink_fma2.push("");
                                                    else
                                                        sink_fma2.push({fma2: jsonObjFlux.results.bindings[i].sink_fma2.value});

                                                    // med pr and fma
                                                    if (jsonObjFlux.results.bindings[i].med_entity_uri == undefined) {
                                                        med_pr.push("");
                                                        med_fma.push("");
                                                    }
                                                    else {
                                                        var temp = jsonObjFlux.results.bindings[i].med_entity_uri.value;
                                                        if (temp.indexOf(partOfProteinUri) != -1 || temp.indexOf(partOfCHEBIUri) != -1) {
                                                            med_pr.push({
                                                                // name of med_pr from OLS
                                                                // TODO: J_sc_K two PR and one FMA URI!!
                                                                med_pr: jsonObjFlux.results.bindings[i].med_entity_uri.value
                                                            });
                                                        }
                                                        else {
                                                            if (temp.indexOf(partOfFMAUri) != -1) {
                                                                med_fma.push({med_fma: jsonObjFlux.results.bindings[i].med_entity_uri.value});
                                                            }
                                                        }
                                                    }
                                                }

                                                // remove duplicate fma
                                                solute_chebi = uniqueifyEpithelial(solute_chebi);
                                                solute_chebi2 = uniqueifyEpithelial(solute_chebi2);
                                                source_fma = uniqueifyEpithelial(source_fma);
                                                sink_fma = uniqueifyEpithelial(sink_fma);
                                                source_fma2 = uniqueifyEpithelial(source_fma2);
                                                sink_fma2 = uniqueifyEpithelial(sink_fma2);
                                                med_pr = uniqueifyEpithelial(med_pr);
                                                med_fma = uniqueifyEpithelial(med_fma);

                                                if (jsonRelatedMembraneModel.results.bindings.length != 0) {

                                                    var indexOfPR = combinedMembrane[0].med_pr.search("PR_"),
                                                        PID = combinedMembrane[0].med_pr.slice(indexOfPR + 3, combinedMembrane[0].med_pr.length);

                                                    membraneModelValue.push({
                                                        protein: jsonRelatedMembraneModel.results.bindings[0].Protein.value,
                                                        pid: PID,
                                                        prname: jsonPr._embedded.terms[0].label,
                                                        // uri1 is the dragged circle
                                                        uri1: combinedMembrane[0].med_pr,
                                                        medfma: combinedMembrane[0].med_fma,
                                                        similar: 0 // initial percent
                                                    });
                                                    // membraneModeID.push(membraneModel[idMembrane]);

                                                    var sourcefma2, sinkfma2, modelentity2, variabletext,
                                                        variabletext2, sourcefma, sinkfma, solutechebi2, medfma, medpr,
                                                        solutetext2, solutechebi, solutetext, indexOfdot, indexOfHash;

                                                    if (membraneModel[idMembrane].model_entity2 == "") {
                                                        // var circleID = $(cthis).prop("id").split(",");

                                                        var circleID;
                                                        if ($(cthis).attr("membrane") == paracellularID) {
                                                            circleID = $(cthis).attr("idParacellular").split(",");
                                                        }
                                                        else {
                                                            circleID = $(cthis).prop("id").split(",");
                                                        }

                                                        indexOfHash = membraneModel[idMembrane].model_entity.search("#");
                                                        variabletext = membraneModel[idMembrane].model_entity.slice(indexOfHash + 1);
                                                        indexOfdot = variabletext.indexOf('.');

                                                        variabletext = variabletext.slice(indexOfdot + 1);

                                                        var tempjsonObjFlux = uniqueifyjsonFlux(jsonObjFlux.results.bindings);

                                                        console.log("tempjsonObjFlux: ", tempjsonObjFlux);
                                                        console.log("circleID: ", circleID);

                                                        if (tempjsonObjFlux.length == 1) {
                                                            var vartext2;
                                                            if (med_pr.length != 0) {
                                                                if (med_pr[0].med_pr == Nachannel || med_pr[0].med_pr == Kchannel || med_pr[0].med_pr == Clchannel) {
                                                                    vartext2 = "channel";
                                                                }
                                                                else if (tempjsonObjFlux[0].source_fma.value == luminalID &&
                                                                    tempjsonObjFlux[0].sink_fma.value == interstitialID) {
                                                                    vartext2 = "diffusive channel";
                                                                }
                                                                else {
                                                                    vartext2 = "single flux"; // single flux
                                                                }
                                                            }

                                                            // TODO: ??
                                                            if (med_pr.length == 0) {
                                                                vartext2 = "single flux"; // "no mediator"
                                                            }

                                                            console.log("vartext2: ", vartext2, med_pr);

                                                            sourcefma = tempjsonObjFlux[0].source_fma.value;
                                                            sinkfma = tempjsonObjFlux[0].sink_fma.value;
                                                            solutechebi = solute_chebi[0].uri;
                                                            solutetext = solute_chebi[0].name;
                                                            medfma = med_fma[0].med_fma;

                                                            if (med_pr.length != 0) {
                                                                medpr = med_pr[0].med_pr; // TODO: J_Sc_Na has 2 PR and 1 FMA URIs!! Fix this!!
                                                            }
                                                            else medpr = "";

                                                            modelentity2 = "";
                                                            sourcefma2 = "";
                                                            sinkfma2 = "";
                                                            variabletext2 = vartext2; // single flux/channel/diffusive channel
                                                            solutechebi2 = "";
                                                            solutetext2 = "";
                                                        }
                                                        else {
                                                            // same solute - J_Na in mackenzie model
                                                            if (tempjsonObjFlux.length == 2 && membraneModel[idMembrane].model_entity2 == "") {
                                                                modelentity2 = membraneModel[idMembrane].model_entity;
                                                                sourcefma = tempjsonObjFlux[0].source_fma.value;
                                                                sinkfma = tempjsonObjFlux[0].sink_fma.value;
                                                                sourcefma2 = tempjsonObjFlux[1].source_fma.value;
                                                                sinkfma2 = tempjsonObjFlux[1].sink_fma.value;
                                                                medfma = med_fma[0].med_fma;

                                                                if (med_pr.length != 0) {
                                                                    medpr = med_pr[0].med_pr;
                                                                }
                                                                else medpr = "";

                                                                variabletext2 = variabletext;
                                                                solutechebi = solute_chebi[0].uri;
                                                                solutetext = solute_chebi[0].name;
                                                                solutechebi2 = solutechebi;
                                                                solutetext2 = solutetext;
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        // console.log("solute_chebi: ", solute_chebi);
                                                        // console.log("solute_chebi2: ", solute_chebi2);
                                                        // console.log("source_fma: ", source_fma);
                                                        // console.log("sink_fma: ", sink_fma);
                                                        // console.log("source_fma2: ", source_fma2);
                                                        // console.log("sink_fma2: ", sink_fma2);
                                                        // console.log("med_pr: ", med_pr);
                                                        // console.log("med_fma: ", med_fma);

                                                        indexOfHash = membraneModel[idMembrane].model_entity.search("#");
                                                        variabletext = membraneModel[idMembrane].model_entity.slice(indexOfHash + 1);
                                                        indexOfdot = variabletext.indexOf('.');
                                                        variabletext = variabletext.slice(indexOfdot + 1);

                                                        indexOfHash = membraneModel[idMembrane].model_entity2.search("#");
                                                        variabletext2 = membraneModel[idMembrane].model_entity2.slice(indexOfHash + 1);
                                                        indexOfdot = variabletext2.indexOf('.');
                                                        variabletext2 = variabletext2.slice(indexOfdot + 1);

                                                        modelentity2 = membraneModel[idMembrane].model_entity2;
                                                        sourcefma = source_fma[0].fma;
                                                        sinkfma = sink_fma[0].fma;
                                                        sourcefma2 = source_fma2[0].fma2;
                                                        sinkfma2 = sink_fma2[0].fma2;
                                                        solutechebi = solute_chebi[0].uri;
                                                        solutetext = solute_chebi[0].name;
                                                        solutechebi2 = solute_chebi2[0].uri;
                                                        solutetext2 = solute_chebi2[0].name;
                                                        medfma = med_fma[0].med_fma;
                                                        medpr = med_pr[0].med_pr;
                                                    }
                                                }

                                                var tempvar, med_pr_text_syn;
                                                if (jsonPr._embedded.terms[0].annotation["has_related_synonym"] == undefined) {
                                                    med_pr_text_syn = jsonPr._embedded.terms[0].annotation["id"][0].slice(3);
                                                }
                                                else {
                                                    tempvar = jsonPr._embedded.terms[0].annotation["has_related_synonym"];
                                                    med_pr_text_syn = tempvar[0].toUpperCase();
                                                }

                                                membraneModelID.push([
                                                    membraneModel[idMembrane].model_entity, // model_entity
                                                    modelentity2, // model_entity2
                                                    variabletext, // variable_text
                                                    variabletext2, // variable_text2
                                                    sourcefma,
                                                    sinkfma,
                                                    sourcefma2,
                                                    sinkfma2,
                                                    medfma, // jsonObjFlux.results.bindings[0].med_entity_uri.value, // med_fma
                                                    medpr, // jsonRelatedMembraneModel.results.bindings[0].Protein.value, // med_pr
                                                    solutechebi, // solute_chebi
                                                    solutechebi2, // solute_chebi2
                                                    solutetext, //solute_text
                                                    solutetext2, //solute_text2
                                                    jsonPr._embedded.terms[0].label, //med_pr_text,
                                                    med_pr_text_syn //med_pr_text_syn
                                                ]);

                                                solute_chebi = [];
                                                solute_chebi2 = [];
                                                source_fma = [];
                                                sink_fma = [];
                                                source_fma2 = [];
                                                sink_fma2 = [];
                                                med_pr = [];
                                                med_fma = [];

                                                // console.log("idMembrane: ", idMembrane);
                                                // console.log("membraneModel.length: ", membraneModel.length);
                                                console.log("membraneModelID: ", membraneModelID);

                                                if (membraneModel[idMembrane].model_entity != undefined)
                                                    idMembrane++;

                                                if (idMembrane == membraneModel.length) {
                                                    showModalWindow(workspaceName, membraneName);
                                                    return;
                                                }

                                                relatedMembraneModel(workspaceName, membraneName, cotransporterList);

                                            }, true);
                                    }, true);
                            }, true);
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
                .attr("x", dxcircletext[icircleGlobal]) // - 15)
                .attr("y", dycircletext[icircleGlobal]); // + 23);
        }

        if (linewithlineg2[icircleGlobal] != undefined) {
            if (linewithlineg2[icircleGlobal] != "") {
                linewithlineg2[icircleGlobal]
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .attr("x1", dx1line2[icircleGlobal])
                    .attr("y1", dy1line2[icircleGlobal])
                    .attr("x2", dx2line2[icircleGlobal])
                    .attr("y2", dy2line2[icircleGlobal]);
            }
        }

        if (linewithtextg2[icircleGlobal] != undefined) {
            if (linewithtextg2[icircleGlobal] != "") {
                linewithtextg2[icircleGlobal]
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .attr("x", dxtext2[icircleGlobal])
                    .attr("y", dytext2[icircleGlobal]);
            }
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

                    if (linewithlineg2[i] != "") {
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

                // circle text
                dycircletext[i] = dy[i];
                circlewithtext[i]
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .attr("y", dycircletext[i])

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

                    if (linewithlineg2[i] != "") {
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

                // circle text
                dycircletext[i] = dy[i];
                circlewithtext[i]
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .attr("y", dycircletext[i])

                // decrement y-axis of line and circle
                cyinitialb += ydistance;
                dy1lineinitialb += ydistance;
                dy1lineinitialb2 += ydistance;
                dytextinitialb += ydistance;
                dytextinitialb2 += ydistance;
            }
        }
    }

    var reinitVariable = function () {
        // Reinitialise to store fluxes/models in next iteration
        idProtein = 0;
        idAltProtein = 0;
        idMembrane = 0;

        membraneModelValue = [];
        altCellmlModel = "";
        relatedModelValue = [];

        relatedModel = [];
        relatedModelID = [];
        workspaceName = "";
        membraneModel = [];
        membraneModelID = [];
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

            // Find dragged circle's index in the combinedMembrane
            var tempIndex = 0, circleIDIndex;
            if ($(cthis).attr("membrane") == paracellularID) {
                circleIDIndex = $(cthis).attr("idParacellular").split(",");
            }
            else {
                circleIDIndex = $(cthis).prop("id").split(",");
            }

            var findIndexOfCombinedMembrane = function () {
                for (var i = 0; i < combinedMembrane.length; i++) {
                    console.log("Inside filter: ", combinedMembrane[i].model_entity, circleIDIndex[0]);
                    if (combinedMembrane[i].model_entity == circleIDIndex[0]) {
                        // combinedMembrane[i].med_fma = membraneID;
                        tempIndex = i;
                        return;
                    }
                }
            }

            findIndexOfCombinedMembrane(); // combinedMembrane attr

            // close button clicked!!
            $("#mcloseID").click(function (event) {

                console.log("second close button clicked!!");

                moveBack();
                membraneColorBack();
                reinitVariable();

                if (mindex == 1)
                    linebasolateral.transition().delay(1000).duration(1000).style("stroke", "orange");
                else
                    lineapical.transition().delay(1000).duration(1000).style("stroke", "green");
            })

            // save button clicked!!
            $("#msaveID").click(function (event) {

                console.log("second save button clicked!");
                console.log("cthis and $(cthis): ", cthis, $(cthis));
                console.log("win AFTER save clicked: ", win);
                console.log("membrane: ", membrane);
                console.log("combinedMembrane: ", combinedMembrane);

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

                            // paracellular
                            if ($(cthis).attr("membrane") == paracellularID) {
                                $(cthis).attr("idParacellular", win[0].children[1].children[0].children[11].getElementsByTagName("input")[i].id);
                            }
                            else {
                                $(cthis).attr("id", win[0].children[1].children[0].children[11].getElementsByTagName("input")[i].id);
                            }

                            $(cthis).attr("id", win[0].children[1].children[0].children[11].getElementsByTagName("input")[i].id);
                            // cthis.id = win[0].children[1].children[0].children[11].getElementsByTagName("input")[i].id;
                            console.log("cthis AFTER: ", cthis);
                            console.log("id CHECKBOX: ", win[0].children[1].children[0].children[11].getElementsByTagName("input")[i].id);
                        }
                    }
                }

                // checkbox!!
                if (win[0].children[1].children[0].children[12] != undefined) {
                    for (var i = 0; i < win[0].children[1].children[0].children[12].getElementsByTagName("input").length; i++) {
                        if (win[0].children[1].children[0].children[12].getElementsByTagName("input")[i].checked) {

                            console.log("Related cellml model clicked 12!!");

                            console.log("checked CHECKBOX: ", win[0].children[1].children[0].children[12].getElementsByTagName("input")[i].checked);
                            console.log("id CHECKBOX: ", win[0].children[1].children[0].children[12].getElementsByTagName("input")[i].id);

                            $(cthis).attr("id", win[0].children[1].children[0].children[12].getElementsByTagName("input")[i].id);
                            // cthis.id = win[0].children[1].children[0].children[11].getElementsByTagName("input")[i].id;
                            console.log("cthis AFTER: ", cthis);
                            console.log("id CHECKBOX: ", win[0].children[1].children[0].children[12].getElementsByTagName("input")[i].id);
                        }
                    }
                }

                membraneColorBack();

                var circleID;
                if ($(cthis).attr("membrane") == paracellularID) {
                    circleID = $(cthis).attr("idParacellular").split(",");
                }
                else {
                    circleID = $(cthis).prop("id").split(",");
                }

                console.log("circleID: ", circleID);

                var totalCheckboxes = $("input:checkbox").length,
                    numberOfChecked = $("input:checkbox:checked").length,
                    numberOfNotChecked = totalCheckboxes - numberOfChecked;

                console.log("totalCheckboxes, numberOfChecked, numberNotChecked: ", totalCheckboxes, numberOfChecked, numberOfNotChecked);

                if (totalCheckboxes == numberOfNotChecked) {
                    console.log("totalCheckboxes, numberNotChecked: ", totalCheckboxes, numberOfNotChecked);
                    console.log("circleID checkboxes: ", circleID[4], circleID[5], circleID[8]);

                    console.log("tempIndex: ", tempIndex);

                    // mediator FMA uri
                    if (combinedMembrane[tempIndex].med_fma == apicalID) {
                        circleID[8] = basolateralID;
                        combinedMembrane[tempIndex].med_fma = basolateralID;

                        // source and sink FMA uri
                        if (combinedMembrane[tempIndex].source_fma == luminalID && combinedMembrane[tempIndex].sink_fma == cytosolID) {
                            circleID[4] = cytosolID;
                            combinedMembrane[tempIndex].source_fma = cytosolID;
                            circleID[5] = interstitialID;
                            combinedMembrane[tempIndex].sink_fma = interstitialID;
                        }

                        if (combinedMembrane[tempIndex].source_fma == cytosolID && combinedMembrane[tempIndex].sink_fma == luminalID) {
                            circleID[4] = interstitialID;
                            combinedMembrane[tempIndex].source_fma = interstitialID;
                            circleID[5] = cytosolID;
                            combinedMembrane[tempIndex].sink_fma = cytosolID;
                        }

                        // source2 and sink2 FMA uri
                        if (combinedMembrane[tempIndex].source_fma2 != "" && combinedMembrane[tempIndex].sink_fma2 != "") {
                            if (combinedMembrane[tempIndex].source_fma2 == luminalID && combinedMembrane[tempIndex].sink_fma2 == cytosolID) {
                                circleID[6] = cytosolID;
                                combinedMembrane[tempIndex].source_fma2 = cytosolID;
                                circleID[7] = interstitialID;
                                combinedMembrane[tempIndex].sink_fma2 = interstitialID;
                            }

                            if (combinedMembrane[tempIndex].source_fma2 == cytosolID && combinedMembrane[tempIndex].sink_fma2 == luminalID) {
                                circleID[6] = interstitialID;
                                combinedMembrane[tempIndex].source_fma2 = interstitialID;
                                circleID[7] = cytosolID;
                                combinedMembrane[tempIndex].sink_fma2 = cytosolID;
                            }
                        }
                    }
                    else {
                        circleID[8] = apicalID;
                        combinedMembrane[tempIndex].med_fma = apicalID;

                        // source and sink FMA uri
                        if (combinedMembrane[tempIndex].source_fma == cytosolID && combinedMembrane[tempIndex].sink_fma == interstitialID) {
                            circleID[4] = luminalID;
                            combinedMembrane[tempIndex].source_fma = luminalID;
                            circleID[5] = cytosolID;
                            combinedMembrane[tempIndex].sink_fma = cytosolID;
                        }

                        if (combinedMembrane[tempIndex].source_fma == interstitialID && combinedMembrane[tempIndex].sink_fma == cytosolID) {
                            circleID[4] = cytosolID;
                            combinedMembrane[tempIndex].source_fma = cytosolID;
                            circleID[5] = luminalID;
                            combinedMembrane[tempIndex].sink_fma = luminalID;
                        }

                        // source2 and sink2 FMA uri
                        if (circleIDIndex[6] != "" && circleIDIndex[7] != "") {
                            if (combinedMembrane[tempIndex].source_fma2 == cytosolID && combinedMembrane[tempIndex].sink_fma2 == interstitialID) {
                                circleID[6] = luminalID;
                                combinedMembrane[tempIndex].source_fma2 = luminalID;
                                circleID[7] = cytosolID;
                                combinedMembrane[tempIndex].sink_fma2 = cytosolID;
                            }

                            if (combinedMembrane[tempIndex].source_fma2 == interstitialID && combinedMembrane[tempIndex].sink_fma2 == cytosolID) {
                                circleID[6] = cytosolID;
                                combinedMembrane[tempIndex].source_fma2 = cytosolID;
                                circleID[7] = luminalID;
                                combinedMembrane[tempIndex].sink_fma2 = luminalID;
                            }
                        }
                    }
                }
                else {
                    // update combinedMembrane, this will be sent to GMS to assemble and reproduce a new cellml model
                    combinedMembrane[tempIndex].model_entity = circleID[0]; // cellml model entity (e.g. weinstein_1995.cellml#NHE3.J_NHE3_Na)
                    combinedMembrane[tempIndex].variable_text = circleID[2]; // cellml variable name (e.g. J_NHE_Na)
                    combinedMembrane[tempIndex].source_fma = circleID[4]; // source FMA uri
                    combinedMembrane[tempIndex].sink_fma = circleID[5]; // sink FMA uri
                    combinedMembrane[tempIndex].med_fma = circleID[8]; // mediator FMA uri
                    combinedMembrane[tempIndex].med_pr = circleID[9]; // mediator protein uri
                    combinedMembrane[tempIndex].solute_chebi = circleID[10]; // solute CHEBI uri
                    combinedMembrane[tempIndex].solute_text = circleID[12]; // solute text using the CHEBI uri from OLS
                    combinedMembrane[tempIndex].med_pr_text = circleID[14]; // mediator protein text using the mediator protein uri from OLS
                    combinedMembrane[tempIndex].med_pr_text_syn = circleID[15]; // synonym of a mediator protein text (e.g. NHE3, SGLT1) using the mediator protein uri from OLS
                    combinedMembrane[tempIndex].model_entity2 = circleID[1]; // cellml model entity => cotransporter or empty otherwise
                    combinedMembrane[tempIndex].variable_text2 = circleID[3]; // cellml variable name
                    combinedMembrane[tempIndex].source_fma2 = circleID[6]; // source FMA uri => cotransporter or empty otherwise
                    combinedMembrane[tempIndex].sink_fma2 = circleID[7]; // sink FMA uri => cotransporter or empty otherwise
                    combinedMembrane[tempIndex].solute_chebi2 = circleID[11]; // solute CHEBI uri
                    combinedMembrane[tempIndex].solute_text2 = circleID[13]; // solute text using the CHEBI uri from OLS
                }

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
                        .attr("fill", "orange")

                    // circle text
                    dxcircletext[icircleGlobal] = dx[icircleGlobal] - 15;
                    // dycircletext[icircleGlobal] = dy[icircleGlobal] + 23;
                    circlewithtext[icircleGlobal]
                        .transition()
                        .delay(1000)
                        .duration(1000)
                        .attr("x", dxcircletext[icircleGlobal])
                        .attr("y", dycircletext[icircleGlobal])

                    if (linewithlineg2[icircleGlobal] != undefined) {

                        if (linewithlineg2[icircleGlobal] != "") {
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
                    }

                    // decrement y-axis of line and circle
                    yvalue -= ydistance;
                    cyvalue -= ydistance;

                    // increment y-axis of line and circle

                    yvalueb += ydistance;
                    cyvalueb += ydistance;

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
                        .attr("fill", "lightgreen")

                    // circle text
                    dxcircletext[icircleGlobal] = dx[icircleGlobal] - 15;
                    // dycircletext[icircleGlobal] = dy[icircleGlobal] + 23;
                    circlewithtext[icircleGlobal]
                        .transition()
                        .delay(1000)
                        .duration(1000)
                        .attr("x", dxcircletext[icircleGlobal])
                        .attr("y", dycircletext[icircleGlobal])

                    if (linewithlineg2[icircleGlobal] != undefined) {

                        if (linewithlineg2[icircleGlobal] != "") {
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
                    }

                    // decrement y-axis of line and circle
                    yvalueb -= ydistance;
                    cyvalueb -= ydistance;

                    // increment y-axis of line and circle
                    yvalue += ydistance;
                    cyvalue += ydistance;

                    circleRearrange();
                }

                var sourcefma = combinedMembrane[tempIndex].source_fma,
                    sinkfma = combinedMembrane[tempIndex].sink_fma,
                    mediatorfma = combinedMembrane[tempIndex].med_fma,
                    sourcefma2 = combinedMembrane[tempIndex].source_fma2,
                    sinkfma2 = combinedMembrane[tempIndex].sink_fma2,
                    variable_text2 = combinedMembrane[tempIndex].variable_text2;

                if (mediatorfma == apicalID) {

                    // case 1
                    if ((sourcefma == luminalID && sinkfma == cytosolID) && variable_text2 == "single flux") {

                        if (linewithlineg[tempIndex].attr("marker-start") == "url(#start)") {
                            // line marker
                            linewithlineg[tempIndex].attr("marker-start", null);
                            linewithlineg[tempIndex].attr("marker-end", "url(#end)");

                            // text
                            linewithtextg[tempIndex]
                                .attr("x", dxtext[tempIndex])
                                .attr("y", dytext[tempIndex])
                                .text(combinedMembrane[tempIndex].solute_text);
                        }

                        circlewithtext[tempIndex].text(combinedMembrane[tempIndex].med_pr_text_syn);
                    }

                    // case 2
                    if ((sourcefma == cytosolID && sinkfma == luminalID) && variable_text2 == "single flux") {

                        if (linewithlineg[tempIndex].attr("marker-end") == "url(end)") {
                            // line marker
                            linewithlineg[tempIndex].attr("marker-end", null);
                            linewithlineg[tempIndex].attr("marker-start", "url(#start)");

                            // text
                            dxtext[tempIndex] = dxtext[tempIndex] - 90;
                            linewithtextg[tempIndex]
                                .attr("x", dxtext[tempIndex])
                                .attr("y", dytext[tempIndex])
                                .text(combinedMembrane[tempIndex].solute_text);
                        }

                        circlewithtext[tempIndex].text(combinedMembrane[tempIndex].med_pr_text_syn);
                    }

                    // case 3
                    if ((sourcefma == luminalID && sinkfma == cytosolID) && (sourcefma2 == luminalID && sinkfma2 == cytosolID)) {

                        if (linewithlineg[tempIndex].attr("marker-start") == "url(#start)") {
                            // line marker
                            linewithlineg[tempIndex].attr("marker-start", null);
                            linewithlineg[tempIndex].attr("marker-end", "url(#end)");

                            // text
                            linewithtextg[tempIndex]
                                .attr("x", dxtext[tempIndex])
                                .attr("y", dytext[tempIndex])
                                .text(combinedMembrane[tempIndex].solute_text);
                        }

                        if (linewithlineg2[tempIndex].attr("marker-start") == "url(#start)") {
                            // line marker
                            linewithlineg2[tempIndex].attr("marker-start", null);
                            linewithlineg2[tempIndex].attr("marker-end", "url(#end)");

                            // text
                            linewithtextg2[tempIndex]
                                .attr("x", dxtext2[tempIndex])
                                .attr("y", dytext2[tempIndex])
                                .text(combinedMembrane[tempIndex].solute_text2);
                        }

                        circlewithtext[tempIndex].text(combinedMembrane[tempIndex].med_pr_text_syn);
                    }

                    // case 4
                    if ((sourcefma == cytosolID && sinkfma == luminalID) && (sourcefma2 == cytosolID && sinkfma2 == luminalID)) {

                        if (linewithlineg[tempIndex].attr("marker-end") == "url(end)") {
                            // line marker
                            linewithlineg[tempIndex].attr("marker-end", null);
                            linewithlineg[tempIndex].attr("marker-start", "url(#start)");

                            // text
                            dxtext[tempIndex] = dxtext[tempIndex] - 90;
                            linewithtextg[tempIndex]
                                .attr("x", dxtext[tempIndex])
                                .attr("y", dytext[tempIndex])
                                .text(combinedMembrane[tempIndex].solute_text);
                        }

                        if (linewithlineg2[tempIndex].attr("marker-end") == "url(end)") {
                            // line marker
                            linewithlineg2[tempIndex].attr("marker-end", null);
                            linewithlineg2[tempIndex].attr("marker-start", "url(#start)");

                            // text
                            dxtext2[tempIndex] = dxtext2[tempIndex] - 90;
                            linewithtextg2[tempIndex]
                                .attr("x", dxtext2[tempIndex])
                                .attr("y", dytext2[tempIndex])
                                .text(combinedMembrane[tempIndex].solute_text2);
                        }

                        circlewithtext[tempIndex].text(combinedMembrane[tempIndex].med_pr_text_syn);
                    }

                    // case 5
                    if ((sourcefma == luminalID && sinkfma == cytosolID) && (sourcefma2 == cytosolID && sinkfma2 == luminalID)) {

                        if (linewithlineg[tempIndex].attr("marker-start") == "url(#start)") {
                            // line marker
                            linewithlineg[tempIndex].attr("marker-start", null);
                            linewithlineg[tempIndex].attr("marker-end", "url(#end)");

                            // text
                            linewithtextg[tempIndex]
                                .attr("x", dxtext[tempIndex])
                                .attr("y", dytext[tempIndex])
                                .text(combinedMembrane[tempIndex].solute_text);
                        }

                        if (linewithlineg2[tempIndex].attr("marker-end") == "url(end)") {
                            // line marker
                            linewithlineg2[tempIndex].attr("marker-end", null);
                            linewithlineg2[tempIndex].attr("marker-start", "url(#start)");

                            // text
                            dxtext2[tempIndex] = dxtext2[tempIndex] - 90;
                            linewithtextg2[tempIndex]
                                .attr("x", dxtext2[tempIndex])
                                .attr("y", dytext2[tempIndex])
                                .text(combinedMembrane[tempIndex].solute_text2);
                        }

                        circlewithtext[tempIndex].text(combinedMembrane[tempIndex].med_pr_text_syn);
                    }

                    // case 6
                    if ((sourcefma == cytosolID && sinkfma == luminalID) && (sourcefma2 == luminalID && sinkfma2 == cytosolID)) {

                        console.log("case 6 apical");

                        if (linewithlineg[tempIndex].attr("marker-end") == "url(end)") {
                            // line marker
                            linewithlineg[tempIndex].attr("marker-end", null);
                            linewithlineg[tempIndex].attr("marker-start", "url(#start)");

                            // text
                            dxtext[tempIndex] = dxtext[tempIndex] - 90;
                            linewithtextg[tempIndex]
                                .attr("x", dxtext[tempIndex])
                                .attr("y", dytext[tempIndex])
                                .text(combinedMembrane[tempIndex].solute_text);
                        }

                        if (linewithlineg2[tempIndex].attr("marker-start") == "url(#start)") {
                            // line marker
                            linewithlineg2[tempIndex].attr("marker-start", null);
                            linewithlineg2[tempIndex].attr("marker-end", "url(#end)");

                            // text
                            linewithtextg2[tempIndex]
                                .attr("x", dxtext2[tempIndex])
                                .attr("y", dytext2[tempIndex])
                                .text(combinedMembrane[tempIndex].solute_text2);
                        }

                        circlewithtext[tempIndex].text(combinedMembrane[tempIndex].med_pr_text_syn);
                    }
                }

                if (mediatorfma == basolateralID) {

                    // case 1
                    if ((sourcefma == cytosolID && sinkfma == interstitialID) && variable_text2 == "single flux") {
                        console.log("case 1");
                        if (linewithlineg[tempIndex].attr("marker-start") == "url(#start)") {
                            // line marker
                            linewithlineg[tempIndex].attr("marker-start", null);
                            linewithlineg[tempIndex].attr("marker-end", "url(#end)");

                            // text
                            linewithtextg[tempIndex]
                                .attr("x", dxtext[tempIndex])
                                .attr("y", dytext[tempIndex])
                                .text(combinedMembrane[tempIndex].solute_text);
                        }

                        circlewithtext[tempIndex].text(combinedMembrane[tempIndex].med_pr_text_syn);
                    }

                    // case 2
                    if ((sourcefma == interstitialID && sinkfma == cytosolID) && variable_text2 == "single flux") {

                        if (linewithlineg[tempIndex].attr("marker-end") == "url(#end)") {
                            // line marker
                            linewithlineg[tempIndex].attr("marker-end", null);
                            linewithlineg[tempIndex].attr("marker-start", "url(#start)");

                            // text
                            dxtext[tempIndex] = dxtext[tempIndex] - 90;
                            linewithtextg[tempIndex]
                                .attr("x", dxtext[tempIndex])
                                .attr("y", dytext[tempIndex])
                                .text(combinedMembrane[tempIndex].solute_text);
                        }

                        circlewithtext[tempIndex].text(combinedMembrane[tempIndex].med_pr_text_syn);
                    }

                    // case 3
                    if ((sourcefma == cytosolID && sinkfma == interstitialID) && (sourcefma2 == cytosolID && sinkfma2 == interstitialID)) {

                        if (linewithlineg[tempIndex].attr("marker-start") == "url(#start)") {
                            // line marker
                            linewithlineg[tempIndex].attr("marker-start", null);
                            linewithlineg[tempIndex].attr("marker-end", "url(#end)");

                            // text
                            linewithtextg[tempIndex]
                                .attr("x", dxtext[tempIndex])
                                .attr("y", dytext[tempIndex])
                                .text(combinedMembrane[tempIndex].solute_text);
                        }

                        if (linewithlineg2[tempIndex].attr("marker-start") == "url(#start)") {
                            // line marker
                            linewithlineg2[tempIndex].attr("marker-start", null);
                            linewithlineg2[tempIndex].attr("marker-end", "url(#end)");

                            // text
                            linewithtextg2[tempIndex]
                                .attr("x", dxtext2[tempIndex])
                                .attr("y", dytext2[tempIndex])
                                .text(combinedMembrane[tempIndex].solute_text2);
                        }

                        circlewithtext[tempIndex].text(combinedMembrane[tempIndex].med_pr_text_syn);
                    }

                    // case 4
                    if ((sourcefma == interstitialID && sinkfma == cytosolID) && (sourcefma2 == interstitialID && sinkfma2 == cytosolID)) {

                        if (linewithlineg[tempIndex].attr("marker-end") == "url(#end)") {
                            // line marker
                            linewithlineg[tempIndex].attr("marker-end", null);
                            linewithlineg[tempIndex].attr("marker-start", "url(#start)");

                            // text
                            dxtext[tempIndex] = dxtext[tempIndex] - 90;
                            linewithtextg[tempIndex]
                                .attr("x", dxtext[tempIndex])
                                .attr("y", dytext[tempIndex])
                                .text(combinedMembrane[tempIndex].solute_text);
                        }

                        if (linewithlineg2[tempIndex].attr("marker-end") == "url(#end)") {
                            // line marker
                            linewithlineg2[tempIndex].attr("marker-end", null);
                            linewithlineg2[tempIndex].attr("marker-start", "url(#start)");

                            // text
                            dxtext2[tempIndex] = dxtext2[tempIndex] - 90;
                            linewithtextg2[tempIndex]
                                .attr("x", dxtext2[tempIndex])
                                .attr("y", dytext2[tempIndex])
                                .text(combinedMembrane[tempIndex].solute_text2);
                        }

                        circlewithtext[tempIndex].text(combinedMembrane[tempIndex].med_pr_text_syn);
                    }

                    // case 5
                    if ((sourcefma == cytosolID && sinkfma == interstitialID) && (sourcefma2 == interstitialID && sinkfma2 == cytosolID)) {

                        if (linewithlineg[tempIndex].attr("marker-start") == "url(#start)") {
                            // line marker
                            linewithlineg[tempIndex].attr("marker-start", null);
                            linewithlineg[tempIndex].attr("marker-end", "url(#end)");

                            // text
                            linewithtextg[tempIndex]
                                .attr("x", dxtext[tempIndex])
                                .attr("y", dytext[tempIndex])
                                .text(combinedMembrane[tempIndex].solute_text);
                        }

                        if (linewithlineg2[tempIndex].attr("marker-end") == "url(#end)") {
                            // line marker
                            linewithlineg2[tempIndex].attr("marker-end", null);
                            linewithlineg2[tempIndex].attr("marker-start", "url(#start)");

                            // text
                            dxtext2[tempIndex] = dxtext2[tempIndex] - 90;
                            linewithtextg2[tempIndex]
                                .attr("x", dxtext2[tempIndex])
                                .attr("y", dytext2[tempIndex])
                                .text(combinedMembrane[tempIndex].solute_text2);
                        }

                        circlewithtext[tempIndex].text(combinedMembrane[tempIndex].med_pr_text_syn);
                    }

                    // case 6
                    if ((sourcefma == interstitialID && sinkfma == cytosolID) && (sourcefma2 == cytosolID && sinkfma2 == interstitialID)) {

                        if (linewithlineg[tempIndex].attr("marker-end") == "url(#end)") {
                            // line marker
                            linewithlineg[tempIndex].attr("marker-end", null);
                            linewithlineg[tempIndex].attr("marker-start", "url(#start)");

                            // text
                            dxtext[tempIndex] = dxtext[tempIndex] - 90;
                            linewithtextg[tempIndex]
                                .attr("x", dxtext[tempIndex])
                                .attr("y", dytext[tempIndex])
                                .text(combinedMembrane[tempIndex].solute_text);
                        }

                        if (linewithlineg2[tempIndex].attr("marker-start") == "url(#start)") {
                            // line marker
                            linewithlineg2[tempIndex].attr("marker-start", null);
                            linewithlineg2[tempIndex].attr("marker-end", "url(#end)");

                            // text
                            linewithtextg2[tempIndex]
                                .attr("x", dxtext2[tempIndex])
                                .attr("y", dytext2[tempIndex])
                                .text(combinedMembrane[tempIndex].solute_text2);
                        }

                        circlewithtext[tempIndex].text(combinedMembrane[tempIndex].med_pr_text_syn);
                    }
                }

                // Reinitialise variables for next iteration
                reinitVariable();
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

exports.epithelialPlatform = epithelialPlatform;
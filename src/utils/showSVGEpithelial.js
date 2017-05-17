/**
 * Created by dsar941 on 5/11/2017.
 */
var solutesBouncing = require("./solutesBouncing.js").solutesBouncing;
var getTextWidth = require("../utils/misc.js").getTextWidth;

var showsvgEpithelial = function (concentration_fma, source_fma, sink_fma, apicalMembrane, basolateralMembrane, membrane) {

    var apicalID = "http://identifiers.org/fma/FMA:84666";
    var basolateralID = "http://identifiers.org/fma/FMA:84669";
    var luminalID = "http://identifiers.org/fma/FMA:74550";
    var cytosolID = "http://identifiers.org/fma/FMA:66836";
    var paracellularID = "http://identifiers.org/fma/FMA:67394";
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

    var paracellularMembrane = [];
    var wallOfSmoothERMembrane = [];
    var wallOfRoughERMembrane = [];
    var celljunction = [];

    // remove apical fluxes from membrane array
    for (var i = 0; i < apicalMembrane.length; i++) {
        for (var j = 0; j < membrane.length; j++) {
            if ((apicalMembrane[i].source_text == membrane[j].source_text &&
                apicalMembrane[i].source_fma == membrane[j].source_fma &&
                apicalMembrane[i].sink_fma == membrane[j].sink_fma) ||
                (apicalMembrane[i].source_text2 == membrane[j].source_text &&
                apicalMembrane[i].source_fma2 == membrane[j].source_fma &&
                apicalMembrane[i].sink_fma2 == membrane[j].sink_fma)) {

                membrane.splice(j, 1);
            }
        }
    }

    // remove basolateral fluxes from membrane array
    for (var i = 0; i < basolateralMembrane.length; i++) {
        for (var j = 0; j < membrane.length; j++) {
            if ((basolateralMembrane[i].source_text == membrane[j].source_text &&
                basolateralMembrane[i].source_fma == membrane[j].source_fma &&
                basolateralMembrane[i].sink_fma == membrane[j].sink_fma) ||
                (basolateralMembrane[i].source_text2 == membrane[j].source_text &&
                basolateralMembrane[i].source_fma2 == membrane[j].source_fma &&
                basolateralMembrane[i].sink_fma2 == membrane[j].sink_fma)) {

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
        lineg, linegb, linegc, linegwser, linegwrer, polygong, polygongb, polygongwser,
        polygongwrer, leakgwser, leakgwrer, leakg, leakgb,
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
        polygongATP, polygonlinegATP = [], polygontextATP = [], atprectText = [],
        polygongATPb, polygonlinegATPb = [], polygontextATPb = [], atprectTextb = [],
        linegpy, linewithlinegpy = [], linegpy2, linewithlinegpy2 = [], linegpy3, linewithlinegpy3 = [],
        linegpyb, linewithlinegpyb = [], linegpy2b, linewithlinegpy2b = [], linegpy3b, linewithlinegpy3b = [],
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
        ydistancechk = 50, yinitialchk = 165,
        ytextinitialchk = 180,
        markerWidth = 4, markerHeight = 4;

    for (var i = 0; i < wallOfSmoothERMembrane.length; i++) {
        checkBoxwser[i] = new d3CheckBox();
    }

    for (var i = 0; i < wallOfRoughERMembrane.length; i++) {
        checkBoxwrer[i] = new d3CheckBox();
    }

    for (var i = 0; i < apicalMembrane.length; i++) {
        checkBox[i] = new d3CheckBox();
    }

    for (var i = 0; i < basolateralMembrane.length; i++) {
        checkBoxb[i] = new d3CheckBox();
    }

    for (var i = 0; i < paracellularMembrane.length; i++) {
        checkBoxc[i] = new d3CheckBox();
    }

    var update = function () {
        for (var i = 0; i < apicalMembrane.length; i++) {
            if (apicalMembrane[i].source_text2 != "channel") {
                checkedchk[i] = checkBox[i].checked();
                // drag enable and disable
                if (checkedchk[i] == true) {
                    linewithlineg[i].call(d3.drag().on("drag", dragcircleline));
                    linewithtextg[i].call(d3.drag().on("drag", dragcircleline));
                    circlewithlineg[i].call(d3.drag().on("drag", dragcircleline));

                    if (linewithlineg2[i] != undefined && linewithtextg2[i] != undefined) {
                        linewithlineg2[i].call(d3.drag().on("drag", dragcircleline));
                        linewithtextg2[i].call(d3.drag().on("drag", dragcircleline));
                    }
                }
                else {
                    linewithlineg[i].call(d3.drag().on("drag", dragcircleendchkbx));
                    linewithtextg[i].call(d3.drag().on("drag", dragcircleendchkbx));
                    circlewithlineg[i].call(d3.drag().on("drag", dragcircleendchkbx));

                    if (linewithlineg2[i] != undefined && linewithtextg2[i] != undefined) {
                        linewithlineg2[i].call(d3.drag().on("drag", dragcircleendchkbx));
                        linewithtextg2[i].call(d3.drag().on("drag", dragcircleendchkbx));
                    }
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

        for (var i = 0; i < basolateralMembrane.length; i++) {
            if (basolateralMembrane[i].source_text2 != "channel") {
                checkedchkb[i] = checkBoxb[i].checked();
                // drag enable and disable
                if (checkedchkb[i] == true) {
                    linewithlinegb[i].call(d3.drag().on("drag", dragcirclelineb));
                    linewithtextgb[i].call(d3.drag().on("drag", dragcirclelineb));
                    circlewithlinegb[i].call(d3.drag().on("drag", dragcirclelineb));

                    if (linewithlineg2b[i] != undefined && linewithtextg2b[i] != undefined) {
                        linewithlineg2b[i].call(d3.drag().on("drag", dragcirclelineb));
                        linewithtextg2b[i].call(d3.drag().on("drag", dragcirclelineb));
                    }
                }
                else {
                    linewithlinegb[i].call(d3.drag().on("drag", dragcircleendchkbx));
                    linewithtextgb[i].call(d3.drag().on("drag", dragcircleendchkbx));
                    circlewithlinegb[i].call(d3.drag().on("drag", dragcircleendchkbx));

                    if (linewithlineg2b[i] != undefined && linewithtextg2b[i] != undefined) {
                        linewithlineg2b[i].call(d3.drag().on("drag", dragcircleendchkbx));
                        linewithtextg2b[i].call(d3.drag().on("drag", dragcircleendchkbx));
                    }
                }
            } else {
                checkedchkb[i] = checkBoxb[i].checked();
                // drag enable and disable
                if (checkedchkb[i] == true) {
                    polygonlinegb[i].call(d3.drag().on("drag", dragpolygonandlineb));
                    polygontextb[i].call(d3.drag().on("drag", dragpolygonandlineb));
                    polygonb[i].call(d3.drag().on("drag", dragpolygonandlineb));
                }
                else {
                    polygonlinegb[i].call(d3.drag().on("drag", dragcircleendchkbx));
                    polygontextb[i].call(d3.drag().on("drag", dragcircleendchkbx));
                    polygonb[i].call(d3.drag().on("drag", dragcircleendchkbx));
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

    for (var i = 0; i < apicalMembrane.length; i++) {
        var textvaluechk = apicalMembrane[i].source_text + " " + apicalMembrane[i].source_text2;

        checkBox[i].x(850).y(yinitialchk).checked(false).clickEvent(update);
        checkBox[i].xtext(890).ytext(ytextinitialchk).text("" + textvaluechk + "");

        checkboxsvg.call(checkBox[i]);

        yinitialchk += ydistancechk;
        ytextinitialchk += ydistancechk;
    }

    for (var i = 0; i < basolateralMembrane.length; i++) {
        var textvaluechkb = basolateralMembrane[i].source_text + " " + basolateralMembrane[i].source_text2;

        checkBoxb[i].x(850).y(yinitialchk).checked(false).clickEvent(update);
        checkBoxb[i].xtext(890).ytext(ytextinitialchk).text("" + textvaluechkb + "");

        checkboxsvg.call(checkBoxb[i]);

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
            polygongctoc = newg.append("g").data([{x: xvaluectoc + 120, y: (yvaluectoc - 5 + height)}]);
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
            linegwser = newg.append("g").data([{x: xvaluewser, y: yvaluewser}]);
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
            linegwser = newg.append("g").data([{x: xvaluewser, y: yvaluewser}]);
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
            linegwser = newg.append("g").data([{x: xvaluewser, y: yvaluewser}]);
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
            linegwser = newg.append("g").data([{x: xvaluewser, y: yvaluewser}]);
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
            linegwser = newg.append("g").data([{x: xvaluewser, y: yvaluewser + 5}]);
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
            linegwser = newg.append("g").data([{x: xvaluewser, y: yvaluewser + 5}]);
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
            polygongwser = newg.append("g").data([{x: xvaluewser, y: (yvaluewser - 5)}]);
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
            polygongwser = newg.append("g").data([{x: xvaluewser, y: (yvaluewser - 5)}]);
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
            leakgwser = newg.append("g").data([{x: xvaluewser, y: (yvaluewser - 5)}]);
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
            leakgwser = newg.append("g").data([{x: xvaluewser, y: (yvaluewser - 5)}]);
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
            linegwrer = newg.append("g").data([{x: xvaluewrer + widthER, y: yvaluewrer}]);
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
            linegwrer = newg.append("g").data([{x: xvaluewrer + widthER, y: yvaluewrer}]);
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
            linegwrer = newg.append("g").data([{x: xvaluewrer + widthER, y: yvaluewrer}]);
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
            linegwrer = newg.append("g").data([{x: xvaluewrer + widthER, y: yvaluewrer}]);
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
            linegwrer = newg.append("g").data([{x: xvaluewrer + widthER, y: yvaluewrer}]);
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
            linegwrer = newg.append("g").data([{x: xvaluewrer + widthER, y: yvaluewrer}]);
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
            polygongwrer = newg.append("g").data([{x: xvaluewrer - 10 + widthER, y: (yvaluewrer)}]);
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
            polygongwrer = newg.append("g").data([{x: xvaluewrer - 10 + widthER, y: (yvaluewrer)}]);
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
            leakgwrer = newg.append("g").data([{x: xvaluewrer - 10 + widthER, y: (yvaluewrer)}]);
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
            leakgwrer = newg.append("g").data([{x: xvaluewrer - 10 + widthER, y: (yvaluewrer)}]);
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

    // Apical membrane
    for (var i = 0; i < apicalMembrane.length; i++) {
        var textvalue = apicalMembrane[i].source_text;
        var textvalue2 = apicalMembrane[i].source_text2;
        var src_fma = apicalMembrane[i].source_fma;
        var src_fma2 = apicalMembrane[i].source_fma2;
        var snk_fma = apicalMembrane[i].sink_fma;
        var snk_fma2 = apicalMembrane[i].sink_fma2;
        var textWidth = getTextWidth(textvalue, 12);

        // case 1
        if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == luminalID && snk_fma2 == cytosolID)) {
            lineg = newg.append("g").data([{x: xvalue, y: yvalue}]);
            linewithlineg[i] = lineg.append("line")
                .attr("id", "linewithlineg" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + lineLen;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#end)")
                .attr("cursor", "pointer");

            var linegtext = lineg.append("g").data([{x: xvalue + lineLen + 10, y: yvalue + 5}]);
            linewithtextg[i] = linegtext.append("text")
                .attr("id", "linewithtextg" + i)
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
                .attr("cursor", "pointer")
                .text(textvalue);

            var linegcircle = lineg.append("g").data([{x: cxvalue, y: cyvalue}]);
            circlewithlineg[i] = linegcircle.append("circle")
                .attr("id", "circlewithlineg" + i)
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y + radius;
                })
                .attr("r", radius)
                .attr("fill", "lightgreen")
                .attr("stroke-width", 20)
                .attr("cursor", "move");

            if (textvalue2 != "single flux") {
                var lineg2 = lineg.append("g").data([{x: xvalue, y: yvalue + radius * 2}]);
                linewithlineg2[i] = lineg2.append("line")
                    .attr("id", "linewithlineg2" + i)
                    .attr("x1", function (d) {
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        return d.x + lineLen;
                    })
                    .attr("y2", function (d) {
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
                    .attr("id", "linewithtextg2" + i)
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
                    .attr("cursor", "pointer")
                    .text(textvalue2);
            }

            // increment y-axis of line and circle
            yvalue += ydistance;
            cyvalue += ydistance;
        }

        // case 2
        if ((src_fma == cytosolID && snk_fma == luminalID) && (src_fma2 == cytosolID && snk_fma2 == luminalID)) {
            lineg = newg.append("g").data([{x: xvalue, y: yvalue}]);
            linewithlineg[i] = lineg.append("line")
                .attr("id", "linewithlineg" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + lineLen;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-start", "url(#start)")
                .attr("cursor", "pointer");

            var linegtext = lineg.append("g").data([{x: xvalue - textWidth - 10, y: yvalue + 5}]);
            linewithtextg[i] = linegtext.append("text")
                .attr("id", "linewithtextg" + i)
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
                .attr("cursor", "pointer")
                .text(textvalue);

            var linegcircle = lineg.append("g").data([{x: cxvalue, y: cyvalue}]);
            circlewithlineg[i] = linegcircle.append("circle")
                .attr("id", "circlewithlineg" + i)
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y + radius;
                })
                .attr("r", radius)
                .attr("fill", "lightgreen")
                .attr("stroke-width", 20)
                .attr("cursor", "move");

            if (textvalue2 != "single flux") {
                var lineg2 = lineg.append("g").data([{x: xvalue, y: yvalue + radius * 2}]);
                linewithlineg2[i] = lineg2.append("line")
                    .attr("id", "linewithlineg2" + i)
                    .attr("x1", function (d) {
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        return d.x + lineLen;
                    })
                    .attr("y2", function (d) {
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
                    .attr("id", "linewithtextg2" + i)
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
                    .attr("cursor", "pointer")
                    .text(textvalue2);
            }

            // increment y-axis of line and circle
            yvalue += ydistance;
            cyvalue += ydistance;
        }

        // case 3
        if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == cytosolID && snk_fma2 == luminalID)) {
            lineg = newg.append("g").data([{x: xvalue, y: yvalue}]);
            linewithlineg[i] = lineg.append("line")
                .attr("id", "linewithlineg" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + lineLen;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#end)")
                .attr("cursor", "pointer");

            var linegtext = lineg.append("g").data([{x: xvalue + lineLen + 10, y: yvalue + 5}]);
            linewithtextg[i] = linegtext.append("text")
                .attr("id", "linewithtextg" + i)
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
                .attr("cursor", "pointer")
                .text(textvalue);

            var linegcircle = lineg.append("g").data([{x: cxvalue, y: cyvalue}]);
            circlewithlineg[i] = linegcircle.append("circle")
                .attr("id", "circlewithlineg" + i)
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y + radius;
                })
                .attr("r", radius)
                .attr("fill", "lightgreen")
                .attr("stroke-width", 20)
                .attr("cursor", "move");

            if (textvalue2 != "single flux") {
                var lineg2 = lineg.append("g").data([{x: xvalue, y: yvalue + radius * 2}]);
                linewithlineg2[i] = lineg2.append("line")
                    .attr("id", "linewithlineg2" + i)
                    .attr("x1", function (d) {
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        return d.x + lineLen;
                    })
                    .attr("y2", function (d) {
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
                    .attr("id", "linewithtextg2" + i)
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
                    .attr("cursor", "pointer")
                    .text(textvalue2);
            }

            // increment y-axis of line and circle
            yvalue += ydistance;
            cyvalue += ydistance;
        }

        // case 4
        if ((src_fma == cytosolID && snk_fma == luminalID) && (src_fma2 == luminalID && snk_fma2 == cytosolID)) {
            lineg = newg.append("g").data([{x: xvalue, y: yvalue}]);
            linewithlineg[i] = lineg.append("line")
                .attr("id", "linewithlineg" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + lineLen;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-start", "url(#start)")
                .attr("cursor", "pointer");

            var linegtext = lineg.append("g").data([{x: xvalue - textWidth - 10, y: yvalue + 5}]);
            linewithtextg[i] = linegtext.append("text")
                .attr("id", "linewithtextg" + i)
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
                .attr("cursor", "pointer")
                .text(textvalue);

            var linegcircle = lineg.append("g").data([{x: cxvalue, y: cyvalue}]);
            circlewithlineg[i] = linegcircle.append("circle")
                .attr("id", "circlewithlineg" + i)
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y + radius;
                })
                .attr("r", radius)
                .attr("fill", "lightgreen")
                .attr("stroke-width", 20)
                .attr("cursor", "move");

            if (textvalue2 != "single flux") {
                var lineg2 = lineg.append("g").data([{x: xvalue, y: yvalue + radius * 2}]);
                linewithlineg2[i] = lineg2.append("line")
                    .attr("id", "linewithlineg2" + i)
                    .attr("x1", function (d) {
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        return d.x + lineLen;
                    })
                    .attr("y2", function (d) {
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
                    .attr("id", "linewithtextg2" + i)
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
                    .attr("cursor", "pointer")
                    .text(textvalue2);
            }

            // increment y-axis of line and circle
            yvalue += ydistance;
            cyvalue += ydistance;
        }

        // case 5
        if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == "channel" && snk_fma2 == "channel")) {
            polygong = newg.append("g").data([{x: xvalue - 5, y: yvalue}]);
            polygonlineg[i] = polygong.append("line")
                .attr("id", "polygonlineg" + i)
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
            polygon[i] = polygong.append("g").append("polygon")
                .attr("transform", "translate(" + (xvalue - 5) + "," + (yvalue - 30) + ")")
                .attr("id", "polygon" + i)
                .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                .attr("fill", "yellow")
                .attr("stroke", "black")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round")
                .attr("cursor", "move");

            var polygontextg = polygong.append("g").data([{x: xvalue + 20 - 5, y: yvalue + 5}]);

            var txt = textvalue.substr(5); // temp solution
            if (txt == "Cl") txt = txt + "-";
            else txt = txt + "+";

            polygontext[i] = polygontextg.append("text")
                .attr("id", "polygontext" + i)
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

            // increment y-axis of line and circle
            yvalue += ydistance;
            cyvalue += ydistance;
        }

        // case 6
        if ((src_fma == cytosolID && snk_fma == luminalID) && (src_fma2 == "channel" && snk_fma2 == "channel")) {
            polygong = newg.append("g").data([{x: xvalue - 5, y: yvalue}]);
            polygonlineg[i] = polygong.append("line")
                .attr("id", "polygonlineg" + i)
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
            polygon[i] = polygong.append("g").append("polygon")
                .attr("transform", "translate(" + (xvalue - 5) + "," + (yvalue - 30) + ")")
                .attr("id", "polygon" + i)
                .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                .attr("fill", "yellow")
                .attr("stroke", "black")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round")
                .attr("cursor", "move");

            var polygontextg = polygong.append("g").data([{x: xvalue + 20 - 5, y: yvalue + 5}]);

            var txt = textvalue.substr(5); // temp solution
            if (txt == "Cl") txt = txt + "-";
            else txt = txt + "+";

            polygontext[i] = polygontextg.append("text")
                .attr("id", "polygontext" + i)
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

            // increment y-axis of line and circle
            yvalue += ydistance;
            cyvalue += ydistance;
        }

        // case 7
        if ((src_fma == luminalID && snk_fma == cytosolID) && (src_fma2 == "leak" && snk_fma2 == "leak")) {
            leakg = newg.append("g").data([{x: xvalue - 5, y: yvalue}]);
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
            leakg = newg.append("g").data([{x: xvalue - 5, y: yvalue}]);
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
            polygongATP = newg.append("g").data([{x: xvalue - 5, y: yvalue}]);
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

            var polygontextg = polygongATP.append("g").data([{x: xvalue + 20 - 5, y: yvalue + 5}]);

            var txt = textvalue.substr(5); // temp solution
            if (txt == "Cl") txt = txt + "-";
            else txt = txt + "+";

            polygontextATP[i] = polygontextg.append("g").append("text")
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
            polygongATP = newg.append("g").data([{x: xvalue - 5, y: yvalue}]);
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

            var polygontextg = polygongATP.append("g").data([{x: xvalue + 20 - 5, y: yvalue + 5}]);

            var txt = textvalue.substr(5); // temp solution
            if (txt == "Cl") txt = txt + "-";
            else txt = txt + "+";

            polygontextATP[i] = polygontextg.append("text")
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
            linegpy = newg.append("g").data([{x: xvalue, y: yvalue}]);
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

            linegpy2 = newg.append("g").data([{x: xvalue, y: yvalue + 8}]);
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

            linegpy3 = newg.append("g").data([{x: xvalue, y: yvalue + 16}]);
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
            linegpy = newg.append("g").data([{x: xvalue, y: yvalue}]);
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

            linegpy2 = newg.append("g").data([{x: xvalue, y: yvalue + 8}]);
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

            linegpy3 = newg.append("g").data([{x: xvalue, y: yvalue + 16}]);
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

        // case 1
        if ((src_fma == cytosolID && snk_fma == interstitialID) && (src_fma2 == cytosolID && snk_fma2 == interstitialID)) {
            linegb = newg.append("g").data([{x: xvalue + width, y: yvalueb}]);
            linewithlinegb[i] = linegb.append("line")
                .attr("id", "linewithlinegb" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + lineLen;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#end)")
                .attr("cursor", "pointer");

            var linegtextb = linegb.append("g").data([{x: xvalue + lineLen + 10 + width, y: yvalueb + 5}]);
            linewithtextgb[i] = linegtextb.append("text")
                .attr("id", "linewithtextgb" + i)
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
                .attr("cursor", "pointer")
                .text(textvalue);

            var linegcircleb = linegb.append("g").data([{x: cxvalue + width, y: cyvalueb}]);
            circlewithlinegb[i] = linegcircleb.append("circle")
                .attr("id", "circlewithlinegb" + i)
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y + radius;
                })
                .attr("r", radius)
                .attr("fill", "orange")
                .attr("stroke-width", 20)
                .attr("cursor", "move");

            if (textvalue2 != "single flux") {
                var lineg2b = linegb.append("g").data([{x: xvalue + width, y: yvalueb + radius * 2}]);
                linewithlineg2b[i] = lineg2b.append("line")
                    .attr("id", "linewithlineg2b" + i)
                    .attr("x1", function (d) {
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        return d.x + lineLen;
                    })
                    .attr("y2", function (d) {
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#end)")
                    .attr("cursor", "pointer");

                var linegtext2b = lineg2b.append("g").data([{
                    x: xvalue + lineLen + 10 + width, y: yvalueb + radius * 2 + markerHeight
                }]);
                linewithtextg2b[i] = linegtext2b.append("text")
                    .attr("id", "linewithtextg2b" + i)
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
                    .attr("cursor", "pointer")
                    .text(textvalue2);
            }

            // increment y-axis of line and circle
            yvalueb += ydistanceb;
            cyvalueb += ydistanceb;
        }

        // case 2
        if ((src_fma == interstitialID && snk_fma == cytosolID) && (src_fma2 == interstitialID && snk_fma2 == cytosolID)) {
            linegb = newg.append("g").data([{x: xvalue + width, y: yvalueb}]);
            linewithlinegb[i] = linegb.append("line")
                .attr("id", "linewithlinegb" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + lineLen;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-start", "url(#start)")
                .attr("cursor", "pointer");

            var linegtextb = linegb.append("g").data([{x: xvalue - textWidth - 10 + width, y: yvalueb + 5}]);
            linewithtextgb[i] = linegtextb.append("text")
                .attr("id", "linewithtextgb" + i)
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
                .attr("cursor", "pointer")
                .text(textvalue);

            var linegcircleb = linegb.append("g").data([{x: cxvalue + width, y: cyvalueb}]);
            circlewithlinegb[i] = linegcircleb.append("circle")
                .attr("id", "circlewithlinegb" + i)
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y + radius;
                })
                .attr("r", radius)
                .attr("fill", "orange")
                .attr("stroke-width", 20)
                .attr("cursor", "move");

            if (textvalue2 != "single flux") {
                var lineg2b = linegb.append("g").data([{x: xvalue + width, y: yvalueb + radius * 2}]);
                linewithlineg2b[i] = lineg2b.append("line")
                    .attr("id", "linewithlineg2b" + i)
                    .attr("x1", function (d) {
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        return d.x + lineLen;
                    })
                    .attr("y2", function (d) {
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-start", "url(#start)")
                    .attr("cursor", "pointer");

                var linegtext2b = lineg2b.append("g").data([{
                    x: xvalue - textWidth - 10 + width, y: yvalueb + radius * 2 + markerHeight
                }]);
                linewithtextg2b[i] = linegtext2b.append("text")
                    .attr("id", "linewithtextg2b" + i)
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
                    .attr("cursor", "pointer")
                    .text(textvalue2);
            }

            // increment y-axis of line and circle
            yvalueb += ydistanceb;
            cyvalueb += ydistanceb;
        }

        // case 3
        if ((src_fma == cytosolID && snk_fma == interstitialID) && (src_fma2 == interstitialID && snk_fma2 == cytosolID)) {
            linegb = newg.append("g").data([{x: xvalue + width, y: yvalueb}]);
            linewithlinegb[i] = linegb.append("line")
                .attr("id", "linewithlinegb" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + lineLen;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#end)")
                .attr("cursor", "pointer");

            var linegtextb = linegb.append("g").data([{x: xvalue + lineLen + 10 + width, y: yvalueb + 5}]);
            linewithtextgb[i] = linegtextb.append("text")
                .attr("id", "linewithtextgb" + i)
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
                .attr("cursor", "pointer")
                .text(textvalue);

            var linegcircleb = linegb.append("g").data([{x: cxvalue + width, y: cyvalueb}]);
            circlewithlinegb[i] = linegcircleb.append("circle")
                .attr("id", "circlewithlinegb" + i)
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y + radius;
                })
                .attr("r", radius)
                .attr("fill", "orange")
                .attr("stroke-width", 20)
                .attr("cursor", "move");

            if (textvalue2 != "single flux") {
                var lineg2b = linegb.append("g").data([{x: xvalue + width, y: yvalueb + radius * 2}]);
                linewithlineg2b[i] = lineg2b.append("line")
                    .attr("id", "linewithlineg2b" + i)
                    .attr("x1", function (d) {
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        return d.x + lineLen;
                    })
                    .attr("y2", function (d) {
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-start", "url(#start)")
                    .attr("cursor", "pointer");

                var linegtext2b = lineg2b.append("g").data([{
                    x: xvalue - textWidth - 10 + width, y: yvalueb + radius * 2 + markerHeight
                }]);
                linewithtextg2b[i] = linegtext2b.append("text")
                    .attr("id", "linewithtextg2b" + i)
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
                    .attr("cursor", "pointer")
                    .text(textvalue2);
            }

            // increment y-axis of line and circle
            yvalueb += ydistanceb;
            cyvalueb += ydistanceb;
        }

        // case 4
        if ((src_fma == interstitialID && snk_fma == cytosolID) && (src_fma2 == cytosolID && snk_fma2 == interstitialID)) {
            linegb = newg.append("g").data([{x: xvalue + width, y: yvalueb}]);
            linewithlinegb[i] = linegb.append("line")
                .attr("id", "linewithlinegb" + i)
                .attr("x1", function (d) {
                    return d.x;
                })
                .attr("y1", function (d) {
                    return d.y;
                })
                .attr("x2", function (d) {
                    return d.x + lineLen;
                })
                .attr("y2", function (d) {
                    return d.y;
                })
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-start", "url(#start)")
                .attr("cursor", "pointer");

            var linegtextb = linegb.append("g").data([{x: xvalue - textWidth - 10 + width, y: yvalueb + 5}]);
            linewithtextgb[i] = linegtextb.append("text")
                .attr("id", "linewithtextgb" + i)
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
                .attr("cursor", "pointer")
                .text(textvalue);

            var linegcircleb = linegb.append("g").data([{x: cxvalue + width, y: cyvalueb}]);
            circlewithlinegb[i] = linegcircleb.append("circle")
                .attr("id", "circlewithlinegb" + i)
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y + radius;
                })
                .attr("r", radius)
                .attr("fill", "orange")
                .attr("stroke-width", 20)
                .attr("cursor", "move");

            if (textvalue2 != "single flux") {
                var lineg2b = linegb.append("g").data([{x: xvalue + width, y: yvalueb + radius * 2}]);
                linewithlineg2b[i] = lineg2b.append("line")
                    .attr("id", "linewithlineg2b" + i)
                    .attr("x1", function (d) {
                        return d.x;
                    })
                    .attr("y1", function (d) {
                        return d.y;
                    })
                    .attr("x2", function (d) {
                        return d.x + lineLen;
                    })
                    .attr("y2", function (d) {
                        return d.y;
                    })
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("marker-end", "url(#end)")
                    .attr("cursor", "pointer");

                var linegtext2b = lineg2b.append("g").data([{
                    x: xvalue + lineLen + 10 + width, y: yvalueb + radius * 2 + markerHeight
                }]);
                linewithtextg2b[i] = linegtext2b.append("text")
                    .attr("id", "linewithtextg2b" + i)
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
                    .attr("cursor", "pointer")
                    .text(textvalue2);
            }

            // increment y-axis of line and circle
            yvalueb += ydistanceb;
            cyvalueb += ydistanceb;
        }

        // case 5
        if ((src_fma == interstitialID && snk_fma == cytosolID) && (src_fma2 == "channel" && snk_fma2 == "channel")) {
            polygongb = newg.append("g").data([{x: xvalue - 5 + width, y: yvalueb}]);
            polygonlinegb[i] = polygongb.append("line")
                .attr("id", "polygonlinegb" + i)
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
            polygonb[i] = polygongb.append("g").append("polygon")
                .attr("transform", "translate(" + (xvalue - 5 + width) + "," + (yvalueb - 30) + ")")
                .attr("id", "polygonb" + i)
                .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                .attr("fill", "yellow")
                .attr("stroke", "black")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round")
                .attr("cursor", "move");

            var polygontextgb = polygongb.append("g").data([{x: xvalue + 20 - 5 + width, y: yvalueb + 5}]);

            var txt = textvalue.substr(5); // temp solution
            if (txt == "Cl") txt = txt + "-";
            else txt = txt + "+";

            polygontextb[i] = polygontextgb.append("text")
                .attr("id", "polygontextb" + i)
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

            // increment y-axis of line and circle
            yvalueb += ydistanceb;
            cyvalueb += ydistanceb;
        }

        // case 6
        if ((src_fma == cytosolID && snk_fma == interstitialID) && (src_fma2 == "channel" && snk_fma2 == "channel")) {
            polygongb = newg.append("g").data([{x: xvalue - 5 + width, y: yvalueb}]);
            polygonlinegb[i] = polygongb.append("line")
                .attr("id", "polygonlinegb" + i)
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
            polygonb[i] = polygongb.append("g").append("polygon")
                .attr("transform", "translate(" + (xvalue - 5 + width) + "," + (yvalueb - 30) + ")")
                .attr("id", "polygonb" + i)
                .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                .attr("fill", "yellow")
                .attr("stroke", "black")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round")
                .attr("cursor", "move");

            var polygontextgb = polygongb.append("g").data([{x: xvalue + 20 - 5 + width, y: yvalueb + 5}]);

            var txt = textvalue.substr(5); // temp solution
            if (txt == "Cl") txt = txt + "-";
            else txt = txt + "+";

            polygontextb[i] = polygontextgb.append("text")
                .attr("id", "polygontextb" + i)
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

            // increment y-axis of line and circle
            yvalueb += ydistanceb;
            cyvalueb += ydistanceb;
        }

        // case 7
        if ((src_fma == interstitialID && snk_fma == cytosolID) && (src_fma2 == "leak" && snk_fma2 == "leak")) {
            leakgb = newg.append("g").data([{x: xvalue - 5 + width, y: yvalueb}]);
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
            leakgb = newg.append("g").data([{x: xvalue - 5 + width, y: yvalueb}]);
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
            polygongATPb = newg.append("g").data([{x: xvalue - 5 + width, y: yvalue}]);
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

            var polygontextg = polygongATPb.append("g").data([{x: xvalue + 20 - 5 + width, y: yvalue + 5}]);

            var txt = textvalue.substr(5); // temp solution
            if (txt == "Cl") txt = txt + "-";
            else txt = txt + "+";

            polygontextATPb[i] = polygontextg.append("g").append("text")
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
            polygongATPb = newg.append("g").data([{x: xvalue - 5 + width, y: yvalue}]);
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

            var polygontextg = polygongATPb.append("g").data([{x: xvalue + 20 - 5 + width, y: yvalue + 5}]);

            var txt = textvalue.substr(5); // temp solution
            if (txt == "Cl") txt = txt + "-";
            else txt = txt + "+";

            polygontextATPb[i] = polygontextg.append("text")
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
            linegpyb = newg.append("g").data([{x: xvalue, y: yvalue}]);
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

            linegpy2b = newg.append("g").data([{x: xvalue, y: yvalue + 8}]);
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

            linegpy3b = newg.append("g").data([{x: xvalue, y: yvalue + 16}]);
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
            linegpyb = newg.append("g").data([{x: xvalue, y: yvalue}]);
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

            linegpy2b = newg.append("g").data([{x: xvalue, y: yvalue + 8}]);
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

            linegpy3b = newg.append("g").data([{x: xvalue, y: yvalue + 16}]);
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

        linegc = newg.append("g").data([{x: xpvalue, y: ypvalue + 5}]);
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
        var axis = groupcordinatesc("linewithlinegc" + ic, ic);
        linewithlinegc[ic]
            .attr("x1", axis.shift())
            .attr("y1", axis.shift())
            .attr("x2", axis.shift())
            .attr("y2", axis.shift());

        // text
        var axis = groupcordinatesc("linewithtextgc" + ic, ic);
        linewithtextgc[ic]
            .attr("x", axis.shift())
            .attr("y", axis.shift())

    }

    function groupcordinatesc(groups, ic) {

        var dx = d3.event.dx;
        var dy = d3.event.dy;

        // text groups
        if (groups == "linewithtextgc" + ic) {
            var xNew = parseFloat(d3.select("#" + groups + "").attr("x")) + dx;
            var yNew = parseFloat(d3.select("#" + groups + "").attr("y")) + dy;

            return [xNew, yNew];
        }
        else { // Line groups
            var x1New = parseFloat(d3.select("#" + groups + "").attr("x1")) + dx;
            var y1New = parseFloat(d3.select("#" + groups + "").attr("y1")) + dy;
            var x2New = parseFloat(d3.select("#" + groups + "").attr("x2")) + dx;
            var y2New = parseFloat(d3.select("#" + groups + "").attr("y2")) + dy;

            return [x1New, y1New, x2New, y2New];
        }
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

    function groupcordinates(groups, ic) {

        var dx = d3.event.dx;
        var dy = d3.event.dy;

        // Circle groups
        if (groups == "polygontext" + ic) {
            var xNew = parseFloat(d3.select("#" + groups + "").attr("x")) + dx;
            var yNew = parseFloat(d3.select("#" + groups + "").attr("y")) + dy;

            return [xNew, yNew];
        }
        else { // Line groups
            var x1New = parseFloat(d3.select("#" + groups + "").attr("x1")) + dx;
            var y1New = parseFloat(d3.select("#" + groups + "").attr("y1")) + dy;
            var x2New = parseFloat(d3.select("#" + groups + "").attr("x2")) + dx;
            var y2New = parseFloat(d3.select("#" + groups + "").attr("y2")) + dy;

            return [x1New, y1New, x2New, y2New];
        }
    }

    function dragpolygonandlineb(d) {

        // Circle: strip all the non-digit characters (\D or [^0-9])
        var ic = this.id.replace(/\D/g, '');
        var axis = groupcordinatesb("polygonlinegb" + ic, ic);
        polygonlinegb[ic]
            .attr("x1", axis.shift())
            .attr("y1", axis.shift())
            .attr("x2", axis.shift())
            .attr("y2", axis.shift());

        // text
        var axis = groupcordinatesb("polygontextb" + ic, ic);
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

    function groupcordinatesb(groups, ic) {

        var dx = d3.event.dx;
        var dy = d3.event.dy;

        // Circle groups
        if (groups == "polygontextb" + ic) {
            var xNew = parseFloat(d3.select("#" + groups + "").attr("x")) + dx;
            var yNew = parseFloat(d3.select("#" + groups + "").attr("y")) + dy;

            return [xNew, yNew];
        }
        else { // Line groups
            var x1New = parseFloat(d3.select("#" + groups + "").attr("x1")) + dx;
            var y1New = parseFloat(d3.select("#" + groups + "").attr("y1")) + dy;
            var x2New = parseFloat(d3.select("#" + groups + "").attr("x2")) + dx;
            var y2New = parseFloat(d3.select("#" + groups + "").attr("y2")) + dy;

            return [x1New, y1New, x2New, y2New];
        }
    }

    function dragcircleline(d) {

        // Circle: strip all the non-digit characters (\D or [^0-9])
        var ic = this.id.replace(/\D/g, '');
        var axis = groupcordinates2("circlewithlineg" + ic, ic);
        circlewithlineg[ic]
            .attr("cx", axis.shift())
            .attr("cy", axis.shift());

        // Text: strip all the non-digit characters (\D or [^0-9])
        var axis = groupcordinates2("linewithtextg" + ic, ic);
        linewithtextg[ic]
            .attr("x", axis.shift())
            .attr("y", axis.shift());

        if (linewithtextg2[ic] != undefined) {
            // Text: strip all the non-digit characters (\D or [^0-9])
            var axis = groupcordinates2("linewithtextg2" + ic, ic);
            linewithtextg2[ic]
                .attr("x", axis.shift())
                .attr("y", axis.shift());
        }

        // line: strip all the non-digit characters (\D or [^0-9])
        var axis = groupcordinates2("linewithlineg" + ic, ic);
        linewithlineg[ic]
            .attr("x1", axis.shift())
            .attr("y1", axis.shift())
            .attr("x2", axis.shift())
            .attr("y2", axis.shift());

        if (linewithlineg2[ic] != undefined) {
            // line2: strip all the non-digit characters (\D or [^0-9])
            var axis = groupcordinates2("linewithlineg2" + ic, ic);
            linewithlineg2[ic]
                .attr("x1", axis.shift())
                .attr("y1", axis.shift())
                .attr("x2", axis.shift())
                .attr("y2", axis.shift());
        }
    }

    function dragcirclelineb(d) {

        // Circle: strip all the non-digit characters (\D or [^0-9])
        var ic = this.id.replace(/\D/g, '');
        var axis = groupcordinates2b("circlewithlinegb" + ic, ic);
        circlewithlinegb[ic]
            .attr("cx", axis.shift())
            .attr("cy", axis.shift());

        // Text: strip all the non-digit characters (\D or [^0-9])
        var axis = groupcordinates2b("linewithtextgb" + ic, ic);
        linewithtextgb[ic]
            .attr("x", axis.shift())
            .attr("y", axis.shift());

        if (linewithtextg2b[ic] != undefined) {
            // Text: strip all the non-digit characters (\D or [^0-9])
            var axis = groupcordinates2b("linewithtextg2b" + ic, ic);
            linewithtextg2b[ic]
                .attr("x", axis.shift())
                .attr("y", axis.shift());
        }

        // line: strip all the non-digit characters (\D or [^0-9])
        var axis = groupcordinates2b("linewithlinegb" + ic, ic);
        linewithlinegb[ic]
            .attr("x1", axis.shift())
            .attr("y1", axis.shift())
            .attr("x2", axis.shift())
            .attr("y2", axis.shift());

        if (linewithlineg2b[ic] != undefined) {
            // line2: strip all the non-digit characters (\D or [^0-9])
            var axis = groupcordinates2b("linewithlineg2b" + ic, ic);
            linewithlineg2b[ic]
                .attr("x1", axis.shift())
                .attr("y1", axis.shift())
                .attr("x2", axis.shift())
                .attr("y2", axis.shift());
        }
    }

    function groupcordinates2(groups, ic) {

        var dx = d3.event.dx;
        var dy = d3.event.dy;

        if (groups == "circlewithlineg" + ic) { // circle groups
            var cxNew = parseFloat(d3.select("#" + groups + "").attr("cx")) + dx;
            var cyNew = parseFloat(d3.select("#" + groups + "").attr("cy")) + dy;

            return [cxNew, cyNew];
        }
        else if ((groups == "linewithtextg" + ic) || (groups == "linewithtextg2" + ic)) { // text groups
            var xNew = parseFloat(d3.select("#" + groups + "").attr("x")) + dx;
            var yNew = parseFloat(d3.select("#" + groups + "").attr("y")) + dy;

            return [xNew, yNew];
        }
        else { // Line groups
            var x1New = parseFloat(d3.select("#" + groups + "").attr("x1")) + dx;
            var y1New = parseFloat(d3.select("#" + groups + "").attr("y1")) + dy;
            var x2New = parseFloat(d3.select("#" + groups + "").attr("x2")) + dx;
            var y2New = parseFloat(d3.select("#" + groups + "").attr("y2")) + dy;

            return [x1New, y1New, x2New, y2New];
        }
    }

    function groupcordinates2b(groups, ic) {

        var dx = d3.event.dx;
        var dy = d3.event.dy;

        if (groups == "circlewithlinegb" + ic) { // circle groups
            var cxNew = parseFloat(d3.select("#" + groups + "").attr("cx")) + dx;
            var cyNew = parseFloat(d3.select("#" + groups + "").attr("cy")) + dy;

            return [cxNew, cyNew];
        }
        else if ((groups == "linewithtextgb" + ic) || (groups == "linewithtextg2b" + ic)) { // text groups
            var xNew = parseFloat(d3.select("#" + groups + "").attr("x")) + dx;
            var yNew = parseFloat(d3.select("#" + groups + "").attr("y")) + dy;

            return [xNew, yNew];
        }
        else { // Line groups
            var x1New = parseFloat(d3.select("#" + groups + "").attr("x1")) + dx;
            var y1New = parseFloat(d3.select("#" + groups + "").attr("y1")) + dy;
            var x2New = parseFloat(d3.select("#" + groups + "").attr("x2")) + dx;
            var y2New = parseFloat(d3.select("#" + groups + "").attr("y2")) + dy;

            return [x1New, y1New, x2New, y2New];
        }
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

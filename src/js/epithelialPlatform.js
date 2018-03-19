/**
 * Created by dsar941 on 5/11/2017.
 */
var solutesBouncing = require("./solutesBouncing.js");
var miscellaneous = require("./miscellaneous.js");
var ajaxUtils = require("../libs/ajax-utils.js");
var sparqlUtils = require("./sparqlUtils.js");
var svgPlatform = require("./svgPlatform.js");

var epithelialPlatform = function (combinedMembrane, concentration_fma, source_fma, sink_fma,
                                   apicalMembrane, basolateralMembrane, membrane) {

    var relatedModel = [], membraneModelObj = [], alternativeModelObj = [], relatedModelObj = [],
        modelEntityObj = [], membraneModelID = [], proteinName, proteinText, cellmlModel, biological_meaning,
        biological_meaning2, speciesName, geneName, idProtein = 0, idAltProtein = 0, idMembrane = 0,
        locationOfModel, typeOfModel, cthis, icircleGlobal, organIndex, model_entity, model_entity2,
        relatedModelEntity = [], cotransporterList = [], counter = 0;

    var dx = [], dy = [], dxcircletext = [], dycircletext = [], dxtext = [], dytext = [],
        dxtext2 = [], dytext2 = [], dx1line = [], dy1line = [], dx2line = [], dy2line = [],
        dx1line2 = [], dy1line2 = [], dx2line2 = [], dy2line2 = [], line = [], mindex, id = 0;

    var i, j, msaveIDflag = false;

    combinedMembrane = sparqlUtils.processCombinedMembrane(apicalMembrane, basolateralMembrane, membrane, combinedMembrane);
    combinedMembrane = miscellaneous.uniqueifyCombinedMembrane(combinedMembrane);

    console.log("epithelialPlatform membrane: ", membrane);
    console.log("epithelialPlatform concentration_fma: ", concentration_fma);
    console.log("epithelialPlatform apicalMembrane: ", apicalMembrane);
    console.log("epithelialPlatform basolateralMembrane: ", basolateralMembrane);

    console.log("epithelialPlatform combinedMembrane: ", combinedMembrane);

    var g = $("#svgVisualize"),
        wth = 2000, // 1200
        hth = 900,
        width = 300,
        height = 400;

    var w = 800,
        h = height + 500; // Init 400 + 500 = 900

    // change epithelial cell height
    var prevHeight = height, lengthOfApicalMem = 0, lengthOfBasoMem = 0;

    for (var i = 0; i < combinedMembrane.length; i++) {
        if (combinedMembrane[i].med_fma == sparqlUtils.apicalID)
            lengthOfApicalMem++;
        else if (combinedMembrane[i].med_fma == sparqlUtils.basolateralID)
            lengthOfBasoMem++;
    }

    // console.log("lengthOfApicalMem, lengthOfBasoMem: ", lengthOfApicalMem, lengthOfBasoMem);

    if (lengthOfApicalMem > lengthOfBasoMem && lengthOfApicalMem > 4)
        height += 50 * (lengthOfApicalMem - 4);

    if (lengthOfBasoMem > lengthOfApicalMem && lengthOfBasoMem > 4)
        height += 50 * (lengthOfBasoMem - 4);

    if (prevHeight != height) {
        h += (height - prevHeight);
        hth += (height - prevHeight);
    }

    // console.log("Prev and Height: ", prevHeight, height, h, hth);

    var svg = d3.select("#svgVisualize").append("svg")
        .attr("width", wth)
        .attr("height", hth);

    var newg = svg.append("g")
        .attr("id", "newgid")
        .data([{x: w / 3, y: height / 3}]);

    // draw svg platform
    var markerWidth = 4, markerHeight = 4;
    svgPlatform.svgPlatform(svg, newg, height, width, w, h, markerWidth, markerHeight);

    var solutes = [];

    for (i = 0; i < concentration_fma.length; i++) {

        // luminal(1), cytosol(2), interstitial(3), paracellular(4), paracellular2(5)
        for (var j = 1; j <= 5; j++) {
            if (concentration_fma[i].fma == $("rect")[j].id) {
                break;
            }
        }

        // compartments
        if (concentration_fma[i].fma == $("rect")[j].id) {
            var xrect = $("rect")[j].x.baseVal.value;
            var yrect = $("rect")[j].y.baseVal.value;
            var xwidth = $("rect")[j].width.baseVal.value;
            var yheight = $("rect")[j].height.baseVal.value;

            var indexOfHash = concentration_fma[i].name.search("#");
            var value = concentration_fma[i].name.slice(indexOfHash + 1);
            var indexOfdot = value.indexOf(".");
            value = value.slice(indexOfdot + 1);

            solutes.push(
                {
                    compartment: $("rect")[j].id,
                    xrect: xrect,
                    yrect: yrect,
                    width: xwidth,
                    height: yheight,
                    value: value
                });
        }
    }

    // solutes bouncing on the platform
    solutesBouncing.solutesBouncing(newg, solutes);

    // line apical and basolateral
    var x = $("rect")[0].x.baseVal.value;
    var y = $("rect")[0].y.baseVal.value;

    var lineapical = newg.append("line")
        .attr("id", sparqlUtils.apicalID)
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
        .attr("id", sparqlUtils.basolateralID)
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

    // Circle and line arrow from lumen to cytosol
    var xrect = $("rect")[0].x.baseVal.value,
        yrect = $("rect")[0].y.baseVal.value;

    // Paracellular membrane
    var xprect = $("rect")[4].x.baseVal.value,
        yprect = $("rect")[4].y.baseVal.value,
        xpvalue = xprect + 10,
        ypvalue = yprect + 25,
        ypdistance = 35;

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
        ydistancechk = 50, yinitialchk = 185, ytextinitialchk = 200;

    var update = function () {

        console.log("update: ", combinedMembrane);

        for (i = 0; i < combinedMembrane.length; i++) {
            checkedchk[i] = checkBox[i].checked();
            if (checkedchk[i] == true) {
                circlewithlineg[i].call(d3.drag().on("drag", dragcircle).on("end", dropcircle));
            }
            else {
                circlewithlineg[i].call(d3.drag().on("end", dragcircleunchecked));
            }
        }
    };

    var combinedMemChk = function (index) {

        console.log("combinedMemChk combinedMembrane and index: ", combinedMembrane, index);

        for (i = index; i < combinedMembrane.length; i++) {
            checkBox[i] = new miscellaneous.d3CheckBox();
        }

        for (i = index; i < combinedMembrane.length; i++) {
            // var textvaluechk = combinedMembrane[i].variable_text + " " + combinedMembrane[i].variable_text2;
            var textvaluechk = combinedMembrane[i].med_pr_text,
                indexOfParen = textvaluechk.indexOf("(");
            textvaluechk = textvaluechk.slice(0, indexOfParen - 1) + " (" + combinedMembrane[i].med_pr_text_syn + ")";

            checkBox[i].x(850).y(yinitialchk).checked(false).clickEvent(update);
            checkBox[i].xtext(890).ytext(ytextinitialchk).text("" + textvaluechk + "");

            checkboxsvg.call(checkBox[i]);

            yinitialchk += ydistancechk;
            ytextinitialchk += ydistancechk;
        }
    };

    // INITIAL call
    combinedMemChk(0);

    // tooltip
    // var div = d3.select("#svgVisualize").append("div")
    //     .attr("class", "tooltip")
    //     .style("opacity", 0);

    // closing tooltip
    $(document).on("mousedown", function () {
        // console.log("mousedown: ", event.which);

        // 1 => left click, 2 => middle click, 3 => right click
        if (event.which == 2)
            div.style("display", "none");
    });

    // add models without dragging
    $(document).on("click", function () {

        console.log("click FUNCTION!");

        var totalCheckboxes = $("#myModal input:checkbox").length,
            numberOfChecked = $("#myModal input:checkbox:checked").length,
            numberOfNotChecked = totalCheckboxes - numberOfChecked;

        console.log("click event -> totalCheckboxes, numberOfChecked, numberNotChecked: ",
            totalCheckboxes, numberOfChecked, numberOfNotChecked);

        $("#myModal input[type='checkbox']").prop("checked", function (i, val) {
            if (val == false) {
                $(this).prop({disabled: true});
            }
            return val;
        });

        if (totalCheckboxes == numberOfNotChecked) {
            $("#myModal input[type='checkbox']").prop({
                disabled: false
            });
        }

        console.log("click function -> combinedMembrane: ", combinedMembrane);

        console.log("click function -> linewithlineg, circlewithlineg: ", linewithlineg, circlewithlineg);
        console.log("click function -> dx, dy: ", dx, dy);

        // Change marker direction and text position
        if (event.target.localName == "line" && event.target.nodeName == "line") {
            console.log("event.srcElement.id: ", event.srcElement.id);
            if (event.srcElement.id == sparqlUtils.apicalID || event.srcElement.id == sparqlUtils.basolateralID)
                modalWindowToAddModels(event.srcElement.id);
        }
    });

    // apical, basolateral and paracellular membrane
    var combinedMemFunc = function (index, msaveIDflag) {

        console.log("combinedMemFunc: combinedMembrane -> ", combinedMembrane);
        console.log("combinedMemFunc: circlewithlineg -> ", circlewithlineg);

        for (i = index; i < combinedMembrane.length; i++) {
            model_entity = combinedMembrane[i].model_entity;

            if (combinedMembrane[i].model_entity2 != undefined)
                model_entity2 = combinedMembrane[i].model_entity2;
            else model_entity2 = "";

            var mediator_fma = combinedMembrane[i].med_fma,
                mediator_pr = combinedMembrane[i].med_pr,
                mediator_pr_text = combinedMembrane[i].med_pr_text,
                mediator_pr_text_syn = combinedMembrane[i].med_pr_text_syn,
                protein_name = combinedMembrane[i].protein_name,

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
                textWidth = miscellaneous.getTextWidth(textvalue, 12),
                tempID;

            if (msaveIDflag == true)
                tempID = icircleGlobal;
            else
                tempID = circlewithlineg.length;

            console.log("combinedMemFunc -> index, icircleGlobal and circlewithlineg: ", index, icircleGlobal, circlewithlineg);

            /*  Apical Membrane */
            if (mediator_fma == sparqlUtils.apicalID) {
                // case 1
                if ((src_fma == sparqlUtils.luminalID && snk_fma == sparqlUtils.cytosolID) &&
                    ((src_fma2 == "" && snk_fma2 == "") || (src_fma2 == sparqlUtils.luminalID && snk_fma2 == sparqlUtils.cytosolID))) {

                    console.log("case 1 sparqlUtils.luminalID ==> sparqlUtils.cytosolID: ", yvalue, cyvalue);

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
                                model_entity, model_entity2,
                                textvalue, textvalue2,
                                src_fma, snk_fma, src_fma2, snk_fma2,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_text, solute_text2,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
                            ];
                        })
                        .attr("index", tempID)
                        .attr("membrane", sparqlUtils.apicalID)
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
                                indexOfComma = id.indexOf(","),
                                tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                                    "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                            div.html(
                                "<b>CellML </b> " +
                                "<a href=" + tempworkspace + " + target=_blank>" +
                                "<img border=0 alt=CellML src=img/cellml.png width=30 height=20></a>" +
                                "<br/>" +
                                "<b>SEDML </b> " +
                                "<a href=" + sparqlUtils.uriSEDML + " + target=_blank>" +
                                "<img border=0 alt=SEDML src=img/SEDML.png width=30 height=20></a>" +
                                "<br/>" +
                                "<b>Click middle mouse to close</b>")
                                .style("left", d3.mouse(this)[0] + 540 + "px")
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
                        .attr("font-size", "10px")
                        .attr("fill", "red")
                        .attr("fontWeight", "bold")
                        .attr("cursor", "move")
                        .text(mediator_pr_text_syn);

                    if (textvalue2 == "flux") {
                        linewithlineg2[i] = "";
                        linewithtextg2[i] = "";
                        dx1line2[i] = "";
                        dy1line2[i] = "";
                        dx2line2[i] = "";
                        dy2line2[i] = "";
                        dxtext2[i] = "";
                        dytext2[i] = "";
                    }

                    if (textvalue2 != "flux") {
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

                    if (msaveIDflag == true) {
                        msaveIDflag = false;
                        break;
                    }

                    // increment y-axis of line and circle
                    yvalue += ydistance;
                    cyvalue += ydistance;

                    console.log("case 1 2 sparqlUtils.luminalID ==> sparqlUtils.cytosolID: ", yvalue, cyvalue);
                }

                // case 2
                if ((src_fma == sparqlUtils.cytosolID && snk_fma == sparqlUtils.luminalID) &&
                    ((src_fma2 == "" && snk_fma2 == "") || (src_fma2 == sparqlUtils.cytosolID && snk_fma2 == sparqlUtils.luminalID))) {
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
                                model_entity, model_entity2,
                                textvalue, textvalue2,
                                src_fma, snk_fma, src_fma2, snk_fma2,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_text, solute_text2,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
                            ];
                        })
                        .attr("index", tempID)
                        .attr("membrane", sparqlUtils.apicalID)
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
                                indexOfComma = id.indexOf(","),
                                tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                                    "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                            div.html(
                                "<b>CellML </b> " +
                                "<a href=" + tempworkspace + " + target=_blank>" +
                                "<img border=0 alt=CellML src=img/cellml.png width=30 height=20></a>" +
                                "<br/>" +
                                "<b>SEDML </b> " +
                                "<a href=" + sparqlUtils.uriSEDML + " + target=_blank>" +
                                "<img border=0 alt=SEDML src=img/SEDML.png width=30 height=20></a>" +
                                "<br/>" +
                                "<b>Click middle mouse to close</b>")
                                .style("left", d3.mouse(this)[0] + 540 + "px")
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
                        .attr("font-size", "10px")
                        .attr("fill", "red")
                        .attr("fontWeight", "bold")
                        .attr("cursor", "move")
                        .text(mediator_pr_text_syn);

                    if (textvalue2 == "flux") {
                        linewithlineg2[i] = "";
                        linewithtextg2[i] = "";
                        dx1line2[i] = "";
                        dy1line2[i] = "";
                        dx2line2[i] = "";
                        dy2line2[i] = "";
                        dxtext2[i] = "";
                        dytext2[i] = "";
                    }

                    if (textvalue2 != "flux") {
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

                    if (msaveIDflag == true) {
                        msaveIDflag = false;
                        break;
                    }

                    // increment y-axis of line and circle
                    yvalue += ydistance;
                    cyvalue += ydistance;
                }

                // case 3
                if ((src_fma == sparqlUtils.luminalID && snk_fma == sparqlUtils.cytosolID) && (src_fma2 == sparqlUtils.cytosolID && snk_fma2 == sparqlUtils.luminalID)) {
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
                                model_entity, model_entity2,
                                textvalue, textvalue2,
                                src_fma, snk_fma, src_fma2, snk_fma2,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_text, solute_text2,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
                            ];
                        })
                        .attr("index", tempID)
                        .attr("membrane", sparqlUtils.apicalID)
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
                                indexOfComma = id.indexOf(","),
                                tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                                    "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                            div.html(
                                "<b>CellML </b> " +
                                "<a href=" + tempworkspace + " + target=_blank>" +
                                "<img border=0 alt=CellML src=img/cellml.png width=30 height=20></a>" +
                                "<br/>" +
                                "<b>SEDML </b> " +
                                "<a href=" + sparqlUtils.uriSEDML + " + target=_blank>" +
                                "<img border=0 alt=SEDML src=img/SEDML.png width=30 height=20></a>" +
                                "<br/>" +
                                "<b>Click middle mouse to close</b>")
                                .style("left", d3.mouse(this)[0] + 540 + "px")
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
                        .attr("font-size", "10px")
                        .attr("fill", "red")
                        .attr("fontWeight", "bold")
                        .attr("cursor", "move")
                        .text(mediator_pr_text_syn);

                    if (textvalue2 == "flux") {
                        linewithlineg2[i] = "";
                        linewithtextg2[i] = "";
                        dx1line2[i] = "";
                        dy1line2[i] = "";
                        dx2line2[i] = "";
                        dy2line2[i] = "";
                        dxtext2[i] = "";
                        dytext2[i] = "";
                    }

                    if (textvalue2 != "flux") {
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

                    if (msaveIDflag == true) {
                        msaveIDflag = false;
                        break;
                    }

                    // increment y-axis of line and circle
                    yvalue += ydistance;
                    cyvalue += ydistance;
                }

                // case 4
                if ((src_fma == sparqlUtils.cytosolID && snk_fma == sparqlUtils.luminalID) && (src_fma2 == sparqlUtils.luminalID && snk_fma2 == sparqlUtils.cytosolID)) {
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
                                model_entity, model_entity2,
                                textvalue, textvalue2,
                                src_fma, snk_fma, src_fma2, snk_fma2,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_text, solute_text2,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
                            ];
                        })
                        .attr("index", tempID)
                        .attr("membrane", sparqlUtils.apicalID)
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
                                indexOfComma = id.indexOf(","),
                                tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                                    "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                            div.html(
                                "<b>CellML </b> " +
                                "<a href=" + tempworkspace + " + target=_blank>" +
                                "<img border=0 alt=CellML src=img/cellml.png width=30 height=20></a>" +
                                "<br/>" +
                                "<b>SEDML </b> " +
                                "<a href=" + sparqlUtils.uriSEDML + " + target=_blank>" +
                                "<img border=0 alt=SEDML src=img/SEDML.png width=30 height=20></a>" +
                                "<br/>" +
                                "<b>Click middle mouse to close</b>")
                                .style("left", d3.mouse(this)[0] + 540 + "px")
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
                        .attr("font-size", "10px")
                        .attr("fill", "red")
                        .attr("fontWeight", "bold")
                        .attr("cursor", "move")
                        .text(mediator_pr_text_syn);

                    if (textvalue2 == "flux") {
                        linewithlineg2[i] = "";
                        linewithtextg2[i] = "";
                        dx1line2[i] = "";
                        dy1line2[i] = "";
                        dx2line2[i] = "";
                        dy2line2[i] = "";
                        dxtext2[i] = "";
                        dytext2[i] = "";
                    }

                    if (textvalue2 != "flux") {
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

                    if (msaveIDflag == true) {
                        msaveIDflag = false;
                        break;
                    }

                    // increment y-axis of line and circle
                    yvalue += ydistance;
                    cyvalue += ydistance;
                }

                // case 5
                if ((src_fma == sparqlUtils.luminalID && snk_fma == sparqlUtils.cytosolID) && (textvalue2 == "channel")) {
                    console.log("case 5 sparqlUtils.cytosolID ==> sparqlUtils.luminalID and channel: ", yvalue, cyvalue);

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
                                model_entity, model_entity2,
                                textvalue, textvalue2,
                                src_fma, snk_fma, src_fma2, snk_fma2,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_text, solute_text2,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
                            ];
                        })
                        .attr("index", tempID)
                        .attr("membrane", sparqlUtils.apicalID)
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
                                indexOfComma = id.indexOf(","),
                                tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                                    "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                            div.html(
                                "<b>CellML </b> " +
                                "<a href=" + tempworkspace + " + target=_blank>" +
                                "<img border=0 alt=CellML src=img/cellml.png width=30 height=20></a>" +
                                "<br/>" +
                                "<b>SEDML </b> " +
                                "<a href=" + sparqlUtils.uriSEDML + " + target=_blank>" +
                                "<img border=0 alt=SEDML src=img/SEDML.png width=30 height=20></a>" +
                                "<br/>" +
                                "<b>Click middle mouse to close</b>")
                                .style("left", d3.mouse(this)[0] + 540 + "px")
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
                    // circle"s radius 20
                    // polygon - probably radius distance from middle point is 10
                    // yvalue += ydistance - 20;
                    // cyvalue += ydistance - 20;

                    if (msaveIDflag == true) {
                        msaveIDflag = false;
                        break;
                    }

                    yvalue += ydistance;
                    cyvalue += ydistance;

                    console.log("case 5 2 sparqlUtils.cytosolID ==> sparqlUtils.luminalID and channel: ", yvalue, cyvalue);
                }

                // case 6
                if ((src_fma == sparqlUtils.cytosolID && snk_fma == sparqlUtils.luminalID) && (textvalue2 == "channel")) {

                    console.log("case 6 sparqlUtils.cytosolID ==> sparqlUtils.luminalID and channel: ", yvalue, cyvalue);

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
                                model_entity, model_entity2,
                                textvalue, textvalue2,
                                src_fma, snk_fma, src_fma2, snk_fma2,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_text, solute_text2,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
                            ];
                        })
                        .attr("index", tempID)
                        .attr("membrane", sparqlUtils.apicalID)
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
                                indexOfComma = id.indexOf(","),
                                tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                                    "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                            div.html(
                                "<b>CellML </b> " +
                                "<a href=" + tempworkspace + " + target=_blank>" +
                                "<img border=0 alt=CellML src=img/cellml.png width=30 height=20></a>" +
                                "<br/>" +
                                "<b>SEDML </b> " +
                                "<a href=" + sparqlUtils.uriSEDML + " + target=_blank>" +
                                "<img border=0 alt=SEDML src=img/SEDML.png width=30 height=20></a>" +
                                "<br/>" +
                                "<b>Click middle mouse to close</b>")
                                .style("left", d3.mouse(this)[0] + 540 + "px")
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

                    if (msaveIDflag == true) {
                        msaveIDflag = false;
                        break;
                    }

                    // increment y-axis of line and circle
                    yvalue += ydistance;
                    cyvalue += ydistance;

                    console.log("case 6 2 sparqlUtils.cytosolID ==> sparqlUtils.luminalID and channel: ", yvalue, cyvalue);
                }
            }

            /*  Basolateral Membrane */
            if (mediator_fma == sparqlUtils.basolateralID) {
                // case 1
                if ((src_fma == sparqlUtils.cytosolID && snk_fma == sparqlUtils.interstitialID) &&
                    ((src_fma2 == "" && snk_fma2 == "") || (src_fma2 == sparqlUtils.cytosolID && snk_fma2 == sparqlUtils.interstitialID))) {

                    console.log("case 1 sparqlUtils.cytosolID ==> sparqlUtils.interstitialID: ", yvalueb, cyvalueb);

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
                                model_entity, model_entity2,
                                textvalue, textvalue2,
                                src_fma, snk_fma, src_fma2, snk_fma2,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_text, solute_text2,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
                            ];
                        })
                        .attr("index", tempID)
                        .attr("membrane", sparqlUtils.basolateralID)
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
                                indexOfComma = id.indexOf(","),
                                tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                                    "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                            div.html(
                                "<b>CellML </b> " +
                                "<a href=" + tempworkspace + " + target=_blank>" +
                                "<img border=0 alt=CellML src=img/cellml.png width=30 height=20></a>" +
                                "<br/>" +
                                "<b>SEDML </b> " +
                                "<a href=" + sparqlUtils.uriSEDML + " + target=_blank>" +
                                "<img border=0 alt=SEDML src=img/SEDML.png width=30 height=20></a>" +
                                "<br/>" +
                                "<b>Click middle mouse to close</b>")
                                .style("left", d3.mouse(this)[0] + 540 + "px")
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
                        .attr("font-size", "10px")
                        .attr("fill", "red")
                        .attr("fontWeight", "bold")
                        .attr("cursor", "move")
                        .text(mediator_pr_text_syn);

                    if (textvalue2 == "flux") {
                        linewithlineg2[i] = "";
                        linewithtextg2[i] = "";
                        dx1line2[i] = "";
                        dy1line2[i] = "";
                        dx2line2[i] = "";
                        dy2line2[i] = "";
                        dxtext2[i] = "";
                        dytext2[i] = "";
                    }

                    if (textvalue2 != "flux") {
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

                    if (msaveIDflag == true) {
                        msaveIDflag = false;
                        break;
                    }

                    // increment y-axis of line and circle
                    yvalueb += ydistance;
                    cyvalueb += ydistance;

                    console.log("case 1 2 sparqlUtils.cytosolID ==> sparqlUtils.interstitialID: ", yvalueb, cyvalueb);
                }

                // case 2
                if ((src_fma == sparqlUtils.interstitialID && snk_fma == sparqlUtils.cytosolID) &&
                    ((src_fma2 == "" && snk_fma2 == "") || (src_fma2 == sparqlUtils.interstitialID && snk_fma2 == sparqlUtils.cytosolID))) {
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
                                model_entity, model_entity2,
                                textvalue, textvalue2,
                                src_fma, snk_fma, src_fma2, snk_fma2,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_text, solute_text2,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
                            ];
                        })
                        .attr("index", tempID)
                        .attr("membrane", sparqlUtils.basolateralID)
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
                                indexOfComma = id.indexOf(","),
                                tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                                    "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                            div.html(
                                "<b>CellML </b> " +
                                "<a href=" + tempworkspace + " + target=_blank>" +
                                "<img border=0 alt=CellML src=img/cellml.png width=30 height=20></a>" +
                                "<br/>" +
                                "<b>SEDML </b> " +
                                "<a href=" + sparqlUtils.uriSEDML + " + target=_blank>" +
                                "<img border=0 alt=SEDML src=img/SEDML.png width=30 height=20></a>" +
                                "<br/>" +
                                "<b>Click middle mouse to close</b>")
                                .style("left", d3.mouse(this)[0] + 540 + "px")
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
                        .attr("font-size", "10px")
                        .attr("fill", "red")
                        .attr("fontWeight", "bold")
                        .attr("cursor", "move")
                        .text(mediator_pr_text_syn);

                    if (textvalue2 == "flux") {
                        linewithlineg2[i] = "";
                        linewithtextg2[i] = "";
                        dx1line2[i] = "";
                        dy1line2[i] = "";
                        dx2line2[i] = "";
                        dy2line2[i] = "";
                        dxtext2[i] = "";
                        dytext2[i] = "";
                    }

                    if (textvalue2 != "flux") {
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

                    if (msaveIDflag == true) {
                        msaveIDflag = false;
                        break;
                    }

                    // increment y-axis of line and circle
                    yvalueb += ydistance;
                    cyvalueb += ydistance;
                }

                // case 3
                if ((src_fma == sparqlUtils.cytosolID && snk_fma == sparqlUtils.interstitialID) && (src_fma2 == sparqlUtils.interstitialID && snk_fma2 == sparqlUtils.cytosolID)) {
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
                                model_entity, model_entity2,
                                textvalue, textvalue2,
                                src_fma, snk_fma, src_fma2, snk_fma2,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_text, solute_text2,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
                            ];
                        })
                        .attr("index", tempID)
                        .attr("membrane", sparqlUtils.basolateralID)
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
                                indexOfComma = id.indexOf(","),
                                tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                                    "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                            div.html(
                                "<b>CellML </b> " +
                                "<a href=" + tempworkspace + " + target=_blank>" +
                                "<img border=0 alt=CellML src=img/cellml.png width=30 height=20></a>" +
                                "<br/>" +
                                "<b>SEDML </b> " +
                                "<a href=" + sparqlUtils.uriSEDML + " + target=_blank>" +
                                "<img border=0 alt=SEDML src=img/SEDML.png width=30 height=20></a>" +
                                "<br/>" +
                                "<b>Click middle mouse to close</b>")
                                .style("left", d3.mouse(this)[0] + 540 + "px")
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
                        .attr("font-size", "10px")
                        .attr("fill", "red")
                        .attr("fontWeight", "bold")
                        .attr("cursor", "move")
                        .text(mediator_pr_text_syn);

                    if (textvalue2 == "flux") {
                        linewithlineg2[i] = "";
                        linewithtextg2[i] = "";
                        dx1line2[i] = "";
                        dy1line2[i] = "";
                        dx2line2[i] = "";
                        dy2line2[i] = "";
                        dxtext2[i] = "";
                        dytext2[i] = "";
                    }

                    if (textvalue2 != "flux") {
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
                            x: xvalue - 30 + width, y: yvalueb + radius * 2 + markerHeight
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

                    if (msaveIDflag == true) {
                        msaveIDflag = false;
                        break;
                    }

                    // increment y-axis of line and circle
                    yvalueb += ydistance;
                    cyvalueb += ydistance;
                }

                // case 4
                if ((src_fma == sparqlUtils.interstitialID && snk_fma == sparqlUtils.cytosolID) && (src_fma2 == sparqlUtils.cytosolID && snk_fma2 == sparqlUtils.interstitialID)) {
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
                                model_entity, model_entity2,
                                textvalue, textvalue2,
                                src_fma, snk_fma, src_fma2, snk_fma2,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_text, solute_text2,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
                            ];
                        })
                        .attr("index", tempID)
                        .attr("membrane", sparqlUtils.basolateralID)
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
                                indexOfComma = id.indexOf(","),
                                tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                                    "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                            div.html(
                                "<b>CellML </b> " +
                                "<a href=" + tempworkspace + " + target=_blank>" +
                                "<img border=0 alt=CellML src=img/cellml.png width=30 height=20></a>" +
                                "<br/>" +
                                "<b>SEDML </b> " +
                                "<a href=" + sparqlUtils.uriSEDML + " + target=_blank>" +
                                "<img border=0 alt=SEDML src=img/SEDML.png width=30 height=20></a>" +
                                "<br/>" +
                                "<b>Click middle mouse to close</b>")
                                .style("left", d3.mouse(this)[0] + 540 + "px")
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
                        .attr("font-size", "10px")
                        .attr("fill", "red")
                        .attr("fontWeight", "bold")
                        .attr("cursor", "move")
                        .text(mediator_pr_text_syn);

                    if (textvalue2 == "flux") {
                        linewithlineg2[i] = "";
                        linewithtextg2[i] = "";
                        dx1line2[i] = "";
                        dy1line2[i] = "";
                        dx2line2[i] = "";
                        dy2line2[i] = "";
                        dxtext2[i] = "";
                        dytext2[i] = "";
                    }

                    if (textvalue2 != "flux") {
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

                    if (msaveIDflag == true) {
                        msaveIDflag = false;
                        break;
                    }

                    // increment y-axis of line and circle
                    yvalueb += ydistance;
                    cyvalueb += ydistance;
                }

                // case 5
                if ((src_fma == sparqlUtils.cytosolID && snk_fma == sparqlUtils.interstitialID) && (textvalue2 == "channel")) {

                    console.log("case 5 sparqlUtils.cytosolID ==> sparqlUtils.interstitialID and channel: ", yvalueb, cyvalueb);

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
                                model_entity, model_entity2,
                                textvalue, textvalue2,
                                src_fma, snk_fma, src_fma2, snk_fma2,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_text, solute_text2,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
                            ];
                        })
                        .attr("index", tempID)
                        .attr("membrane", sparqlUtils.basolateralID)
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
                                indexOfComma = id.indexOf(","),
                                tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                                    "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                            div.html(
                                "<b>CellML </b> " +
                                "<a href=" + tempworkspace + " + target=_blank>" +
                                "<img border=0 alt=CellML src=img/cellml.png width=30 height=20></a>" +
                                "<br/>" +
                                "<b>SEDML </b> " +
                                "<a href=" + sparqlUtils.uriSEDML + " + target=_blank>" +
                                "<img border=0 alt=SEDML src=img/SEDML.png width=30 height=20></a>" +
                                "<br/>" +
                                "<b>Click middle mouse to close</b>")
                                .style("left", d3.mouse(this)[0] + 540 + "px")
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

                    if (msaveIDflag == true) {
                        msaveIDflag = false;
                        break;
                    }

                    // increment y-axis of line and circle
                    yvalueb += ydistance;
                    cyvalueb += ydistance;

                    console.log("case 5 2 sparqlUtils.cytosolID ==> sparqlUtils.interstitialID and channel: ", yvalueb, cyvalueb);
                }

                // case 6
                if ((src_fma == sparqlUtils.interstitialID && snk_fma == sparqlUtils.cytosolID) && (textvalue2 == "channel")) {

                    console.log("case 6 sparqlUtils.cytosolID ==> sparqlUtils.interstitialID and channel: ", yvalueb, cyvalueb);

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
                                model_entity, model_entity2,
                                textvalue, textvalue2,
                                src_fma, snk_fma, src_fma2, snk_fma2,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_text, solute_text2,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
                            ];
                        })
                        .attr("index", tempID)
                        .attr("membrane", sparqlUtils.basolateralID)
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
                                indexOfComma = id.indexOf(","),
                                tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                                    "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                            div.html(
                                "<b>CellML </b> " +
                                "<a href=" + tempworkspace + " + target=_blank>" +
                                "<img border=0 alt=CellML src=img/cellml.png width=30 height=20></a>" +
                                "<br/>" +
                                "<b>SEDML </b> " +
                                "<a href=" + sparqlUtils.uriSEDML + " + target=_blank>" +
                                "<img border=0 alt=SEDML src=img/SEDML.png width=30 height=20></a>" +
                                "<br/>" +
                                "<b>Click middle mouse to close</b>")
                                .style("left", d3.mouse(this)[0] + 540 + "px")
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

                    if (msaveIDflag == true) {
                        msaveIDflag = false;
                        break;
                    }

                    // increment y-axis of line and circle
                    yvalueb += ydistance;
                    cyvalueb += ydistance;

                    console.log("case 6 2 sparqlUtils.cytosolID ==> sparqlUtils.interstitialID and channel: ", yvalueb, cyvalueb);
                }
            }

            /*  Paracellular Membrane */
            if (textvalue2 == "diffusiveflux") {
                var lineg = newg.append("g").data([{x: xpvalue, y: ypvalue + 5}]);
                circlewithlineg[i] = lineg.append("text") // linewithtextg
                    .attr("id", "linewithtextg" + tempID)
                    .attr("idParacellular", function (d) {
                        return [
                            model_entity, model_entity2,
                            textvalue, textvalue2,
                            src_fma, snk_fma, src_fma2, snk_fma2,
                            mediator_fma, mediator_pr,
                            solute_chebi, solute_chebi2, solute_text, solute_text2,
                            mediator_pr_text, mediator_pr_text_syn, protein_name
                        ];
                    })
                    .attr("index", tempID)
                    .attr("membrane", sparqlUtils.paracellularID)
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

                        // console.log("INSIDE PARACELLULAR: ", $(this).attr("idParacellular"));

                        // var id = d3.select(this)._groups[0][0].id,
                        var id = $(this).attr("idParacellular"),
                            indexOfComma = id.indexOf(","),
                            tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                                "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

                        div.html(
                            "<b>CellML </b> " +
                            "<a href=" + tempworkspace + " + target=_blank>" +
                            "<img border=0 alt=CellML src=img/cellml.png width=30 height=20></a>" +
                            "<br/>" +
                            "<b>SEDML </b> " +
                            "<a href=" + sparqlUtils.uriSEDML + " + target=_blank>" +
                            "<img border=0 alt=SEDML src=img/SEDML.png width=30 height=20></a>" +
                            "<br/>" +
                            "<b>Click middle mouse to close</b>")
                            .style("left", d3.mouse(this)[0] + 540 + "px")
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
    };

    // INITIAL call
    combinedMemFunc(0, msaveIDflag);

    var lineb_id, circle_id, cx, cy, lt, gt;

    var dragcircle = function () {

        // div.style("display", "none");

        icircleGlobal = $(this).attr("index");
        cthis = this;

        var dx = d3.event.dx;
        var dy = d3.event.dy;

        if ($(this).prop("tagName") == "circle") {
            d3.select(this)
                .attr("cx", parseFloat($(this).prop("cx").baseVal.value) + dx)
                .attr("cy", parseFloat($(this).prop("cy").baseVal.value) + dy);
        }

        if ($(this).prop("tagName") == "text") {
            circlewithlineg[icircleGlobal] // text (probably for paracellular flux)
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

        // detect basolateralMembrane - 0 apical, 1 basolateralMembrane
        var lineb_x = $($("line")[mindex]).prop("x1").baseVal.value;

        if ($(this).prop("tagName") == "circle") {
            cx = $(this).prop("cx").baseVal.value;
            cy = $(this).prop("cy").baseVal.value;
        }

        if ($(this).prop("tagName") == "polygon") {
            cx = event.x;
            cy = event.y;
        }

        // paracellular
        if ($(this).prop("tagName") == "text") { // OR if ($(this).attr("membrane") == sparqlUtils.paracellularID) {}
            cx = $(this).attr("x");
            cy = $(this).attr("y");
        }

        lineb_id = $($("line")[mindex]).prop("id");
        circle_id = miscellaneous.circleIDSplitUtils($(this), sparqlUtils.paracellularID);

        // determine position on apical or basolateral membrane
        if ($(this).prop("tagName") == "circle") {
            lt = lineb_x - radius / 2;
            gt = lineb_x + radius / 2;
        }
        else if ($(this).prop("tagName") == "polygon") {
            lt = lineb_x + polygonlineLen + 40; //  + 60
            gt = lineb_x + polygonlineLen * 2; //  + 60
        }

        if ((cx >= lt && cx <= gt) && (lineb_id != circle_id)) {
            $($("line")[mindex]).css("stroke", "yellow");
        }
        else {
            if (mindex == 1)
                $($("line")[mindex]).css("stroke", "orange");

            else
                $($("line")[mindex]).css("stroke", "green");
        }
    };

    // remaining part of dropcircle function
    var dropcircleExtended = function (membrane) {

        console.log("dropcircleExtended combinedMembrane: ", combinedMembrane);

        var query;

        query = "SELECT ?located_in " +
            "WHERE { GRAPH ?g { <" + cellmlModel + "> <http://www.obofoundry.org/ro/ro.owl#located_in> ?located_in . " +
            "}}";

        // location of that cellml model
        ajaxUtils.sendPostRequest(
            sparqlUtils.endpoint,
            query,
            function (jsonLocatedin) {

                // console.log("jsonLocatedin: ", jsonLocatedin);

                var jsonLocatedinCounter = 0;
                // Type of model - kidney, lungs, etc
                for (i = 0; i < jsonLocatedin.results.bindings.length; i++) {
                    for (j = 0; j < sparqlUtils.organ.length; j++) {
                        for (var k = 0; k < sparqlUtils.organ[j].key.length; k++) {
                            if (jsonLocatedin.results.bindings[i].located_in.value == sparqlUtils.organ[j].key[k].key)
                                jsonLocatedinCounter++;

                            if (jsonLocatedinCounter == jsonLocatedin.results.bindings.length) {
                                typeOfModel = sparqlUtils.organ[j].value;
                                organIndex = j;
                                break;
                            }
                        }
                        if (jsonLocatedinCounter == jsonLocatedin.results.bindings.length)
                            break;
                    }
                    if (jsonLocatedinCounter == jsonLocatedin.results.bindings.length)
                        break;
                }

                locationOfModel = "";
                jsonLocatedinCounter = 0;
                // location of the above type of model
                for (i = 0; i < jsonLocatedin.results.bindings.length; i++) {
                    for (j = 0; j < sparqlUtils.organ[organIndex].key.length; j++) {
                        if (jsonLocatedin.results.bindings[i].located_in.value == sparqlUtils.organ[organIndex].key[j].key) {
                            locationOfModel += sparqlUtils.organ[organIndex].key[j].value;

                            if (i == jsonLocatedin.results.bindings.length - 1)
                                locationOfModel += ".";
                            else
                                locationOfModel += ", ";

                            jsonLocatedinCounter++;
                        }
                        if (jsonLocatedinCounter == jsonLocatedin.results.bindings.length)
                            break;
                    }
                    if (jsonLocatedinCounter == jsonLocatedin.results.bindings.length)
                        break;
                }

                // related cellml model, i.e. kidney, lungs, etc
                query = "SELECT ?cellmlmodel ?located_in " +
                    "WHERE { GRAPH ?g { ?cellmlmodel <http://www.obofoundry.org/ro/ro.owl#located_in> ?located_in. " +
                    "}}";

                ajaxUtils.sendPostRequest(
                    sparqlUtils.endpoint,
                    query,
                    function (jsonRelatedModel) {

                        for (i = 0; i < jsonRelatedModel.results.bindings.length; i++) {
                            for (j = 0; j < sparqlUtils.organ[organIndex].key.length; j++) {
                                if (jsonRelatedModel.results.bindings[i].located_in.value == sparqlUtils.organ[organIndex].key[j].key) {
                                    // parsing
                                    var tempModel = jsonRelatedModel.results.bindings[i].cellmlmodel.value;
                                    var indexOfHash = tempModel.search("#");
                                    tempModel = tempModel.slice(0, indexOfHash);

                                    relatedModel.push(tempModel);

                                    break;
                                }
                            }
                        }

                        relatedModel = miscellaneous.uniqueify(relatedModel);

                        // kidney, lungs, heart, etc
                        // console.log("relatedModel: ", relatedModel);

                        var alternativeCellmlArray = [], tempcellmlModel,
                            indexOfHash = cellmlModel.search("#");
                        tempcellmlModel = cellmlModel.slice(0, indexOfHash);
                        for (i = 0; i < relatedModel.length; i++) {
                            if (relatedModel[i] != tempcellmlModel) {
                                alternativeCellmlArray.push(relatedModel[i]);
                            }
                        }

                        // console.log("relatedModel: ", relatedModel);

                        relatedCellmlModel(relatedModel, alternativeCellmlArray, membrane);

                    }, true);
            }, true);
    };

    var dropcircle = function () {

        console.log("dropcircle!");

        // div.style("display", "none");

        if ((cx >= lt && cx <= gt) && (lineb_id != circle_id)) {

            if ((cx >= lt && cx <= gt) && (lineb_id != circle_id)) {

                $($("line")[mindex]).css("stroke", "yellow");

                var m = new welcomeModal({
                    id: "myWelcomeModal",
                    header: "Are you sure you want to move?",
                    footer: "My footer",
                    footerCloseButton: "No",
                    footerSaveButton: "Yes"
                });

                $("#myWelcomeModal").modal({backdrop: "static", keyboard: false});
                m.show();

                console.log("BEFORE function welcomeModal (options): ", combinedMembrane);

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

                            // reinitialization
                            reinitVariable();
                            return;
                        });

                        // Yes button clicked!!
                        $("#saveID").click(function (event) {

                            console.log("BEFORE Yes clicked: ", combinedMembrane);

                            console.log("Yes clicked!");
                            console.log("first save button clicked!");

                            var m = new Modal({
                                id: "myModal",
                                header: "Recommender System",
                                footer: "My footer",
                                footerCloseButton: "Close",
                                footerSaveButton: "Save"
                            });

                            $("#myModal").modal({backdrop: "static", keyboard: false});
                            m.getBody().html("<div id=modalBody></div>");
                            m.show();

                            miscellaneous.showLoading("#modalBody");

                            var circleID = miscellaneous.circleIDSplitUtils($(cthis), sparqlUtils.paracellularID);
                            console.log("circleID in myWelcomeModal: ", circleID);

                            // parsing
                            cellmlModel = circleID[0];
                            var indexOfHash = cellmlModel.search("#"), query;
                            cellmlModel = cellmlModel.slice(0, indexOfHash);

                            cellmlModel = cellmlModel + "#" + cellmlModel.slice(0, cellmlModel.indexOf("."));

                            console.log("cellmlModel: ", cellmlModel);
                            query = sparqlUtils.circleIDmyWelcomeWindowSPARQL(circleID, cellmlModel);

                            console.log("query: ", query);

                            // protein name
                            ajaxUtils.sendPostRequest(
                                sparqlUtils.endpoint,
                                query,
                                function (jsonModel) {

                                    console.log("jsonModel: ", jsonModel);

                                    if (jsonModel.results.bindings.length == 0)
                                        proteinName = undefined;
                                    else
                                        proteinName = jsonModel.results.bindings[0].Protein.value;

                                    var endpointprOLS;
                                    if (proteinName != undefined)
                                        endpointprOLS = sparqlUtils.abiOntoEndpoint + "/pr/terms?iri=" + proteinName;
                                    else
                                        endpointprOLS = sparqlUtils.abiOntoEndpoint + "/pr";

                                    ajaxUtils.sendGetRequest(
                                        endpointprOLS,
                                        function (jsonPr) {

                                            var endpointgeneOLS;
                                            if (jsonPr._embedded == undefined || jsonPr._embedded.terms[0]._links.has_gene_template == undefined)
                                                endpointgeneOLS = sparqlUtils.abiOntoEndpoint + "/pr";
                                            else
                                                endpointgeneOLS = jsonPr._embedded.terms[0]._links.has_gene_template.href;

                                            ajaxUtils.sendGetRequest(
                                                endpointgeneOLS,
                                                function (jsonGene) {

                                                    var endpointspeciesOLS;
                                                    if (jsonPr._embedded == undefined || jsonPr._embedded.terms[0]._links.only_in_taxon == undefined)
                                                        endpointspeciesOLS = sparqlUtils.abiOntoEndpoint + "/pr";
                                                    else
                                                        endpointspeciesOLS = jsonPr._embedded.terms[0]._links.only_in_taxon.href;

                                                    ajaxUtils.sendGetRequest(
                                                        endpointspeciesOLS,
                                                        function (jsonSpecies) {

                                                            if (jsonPr._embedded == undefined)
                                                                proteinText = "undefined";
                                                            else {
                                                                proteinText = jsonPr._embedded.terms[0].label;
                                                                proteinText = proteinText.slice(0, proteinText.indexOf("(") - 1);
                                                            }

                                                            if (jsonModel.results.bindings.length == 0)
                                                                biological_meaning = "";
                                                            else {
                                                                biological_meaning = jsonModel.results.bindings[0].Biological_meaning.value;

                                                                if (circleID[1] == "")
                                                                    biological_meaning2 = "";
                                                                else
                                                                    biological_meaning2 = jsonModel.results.bindings[0].Biological_meaning2.value;
                                                            }

                                                            if (jsonSpecies._embedded == undefined)
                                                                speciesName = "undefined";
                                                            else
                                                                speciesName = jsonSpecies._embedded.terms[0].label;

                                                            if (jsonGene._embedded == undefined)
                                                                geneName = "undefined";
                                                            else {
                                                                geneName = jsonGene._embedded.terms[0].label;
                                                                geneName = geneName.slice(0, geneName.indexOf("(") - 1);
                                                            }

                                                            console.log("BEFORE dropcircleExtended combinedMembrane: ", combinedMembrane);
                                                            dropcircleExtended(circleID[8]);

                                                        }, true);
                                                }, true);
                                        }, true);
                                }, true);

                            jQuery(window).trigger("resize");

                            console.log("END OF WELCOME SAVE -> combinedMembrane: ", combinedMembrane);
                            // reinitialization
                            // reinitVariable();
                            // return;
                        });
                    };

                    /**
                     * Set header text. It makes sense only if the options.header is logical true.
                     * @param {String} html New header text.
                     */
                    $this.setHeader = function (html) {
                        $this.window.find(".modal-title").html(html);
                    };

                    /**
                     * Show modal window
                     */
                    $this.show = function () {
                        $this.window.modal("show");
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

        console.log("END of dropcircle combinedMembrane: ", combinedMembrane);
    };

    var dragcircleunchecked = function () {
        d3.select(this).classed("dragging", false);
    };

    // related kidney, lungs, etc model
    var relatedCellmlModel = function (relatedModel, alternativeCellmlArray, membrane) {

        var modelname, indexOfcellml, query;
        if (relatedModel[idProtein] == undefined) {
            modelname = undefined;
        }
        else {
            indexOfcellml = relatedModel[idProtein].search(".cellml");
            modelname = relatedModel[idProtein] + "#" + relatedModel[idProtein].slice(0, indexOfcellml);
        }

        // console.log("modelname in relatedCellmlModel: ", modelname);

        query = "SELECT ?Protein ?workspaceName " +
            "WHERE { GRAPH ?workspaceName { <" + modelname + "> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein . " +
            "}}";

        ajaxUtils.sendPostRequest(
            sparqlUtils.endpoint,
            query,
            function (jsonProtein) {

                var endpointprOLS;
                if (jsonProtein.results.bindings.length == 0)
                    endpointprOLS = sparqlUtils.abiOntoEndpoint + "/pr";
                else {
                    endpointprOLS = sparqlUtils.abiOntoEndpoint + "/pr/terms?iri=" +
                        jsonProtein.results.bindings[0].Protein.value;
                }

                ajaxUtils.sendGetRequest(
                    endpointprOLS,
                    function (jsonPr) {

                        if (jsonProtein.results.bindings.length != 0) {

                            relatedModelObj.push({
                                protein: jsonProtein.results.bindings[0].Protein.value,
                                prname: jsonPr._embedded.terms[0].label,
                                workspaceName: jsonProtein.results.bindings[0].workspaceName.value,
                                modelEntity: relatedModel[idProtein] // relatedModel which have #protein
                            });
                        }

                        if (idProtein == relatedModel.length - 1) {

                            console.log("relatedCellmlModel combinedMembrane: ", combinedMembrane);

                            alternativeCellmlModel(alternativeCellmlArray, membrane);
                            return;
                        }

                        idProtein++;

                        relatedCellmlModel(relatedModel, alternativeCellmlArray, membrane);
                    },
                    true);
            },
            true);
    };

    // alternative model of a dragged transporter, e.g. rat NHE3, mouse NHE3
    var alternativeCellmlModel = function (alternativeCellmlArray, membrane) {

        // console.log("alternativeCellmlArray: ", alternativeCellmlArray[idAltProtein], membrane, alternativeCellmlArray);
        var modelname, indexOfcellml, query, endpointOLS;
        if (alternativeCellmlArray[idAltProtein] == undefined) {
            modelname = undefined;
        }
        else {
            indexOfcellml = alternativeCellmlArray[idAltProtein].search(".cellml");
            modelname = alternativeCellmlArray[idAltProtein] + "#" +
                alternativeCellmlArray[idAltProtein].slice(0, indexOfcellml);
        }
        // console.log("modelname in alternativeCellmlModel: ", modelname);

        query = "SELECT ?Protein ?workspaceName " +
            "WHERE { GRAPH ?workspaceName { <" + modelname + "> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein . " +
            "}}";

        ajaxUtils.sendPostRequest(
            sparqlUtils.endpoint,
            query,
            function (jsonAltProtein) {

                if (jsonAltProtein.results.bindings.length == 0)
                    endpointOLS = sparqlUtils.abiOntoEndpoint + "/pr";
                else {
                    endpointOLS = sparqlUtils.abiOntoEndpoint + "/pr/terms?iri=" +
                        jsonAltProtein.results.bindings[0].Protein.value;
                }

                ajaxUtils.sendGetRequest(
                    endpointOLS,
                    function (jsonOLSObj) {

                        if (jsonAltProtein.results.bindings.length != 0) {

                            if (jsonAltProtein.results.bindings[0].Protein.value == proteinName) { // comment this

                                alternativeModelObj.push({
                                    protein: jsonAltProtein.results.bindings[0].Protein.value,
                                    prname: jsonOLSObj._embedded.terms[0].label,
                                    modelEntity: modelname,
                                    workspaceName: jsonAltProtein.results.bindings[0].workspaceName.value
                                });
                            }
                        }

                        idAltProtein++;

                        if (idAltProtein == alternativeCellmlArray.length - 1) {

                            // If apical Then basolateral and vice versa
                            var membraneName;
                            if (membrane == sparqlUtils.apicalID) {
                                membrane = sparqlUtils.basolateralID;
                                membraneName = "Basolateral membrane";

                                console.log("membrane TESTING: ", membrane);
                            }
                            else if (membrane == sparqlUtils.basolateralID) {
                                membrane = sparqlUtils.apicalID;
                                membraneName = "Apical membrane";

                                console.log("membrane TESTING: ", membrane);
                            }

                            console.log("alternativeCellmlArray combinedMembrane: ", combinedMembrane);

                            relatedMembrane(membrane, membraneName, 1);
                            return;
                        }

                        alternativeCellmlModel(alternativeCellmlArray, membrane);
                    },
                    true);
            }, true);
    };

    var makecotransporter = function (membrane1, membrane2, fluxList, membraneName, flag) {

        var query = sparqlUtils.makecotransporterSPARQL(membrane1, membrane2);
        ajaxUtils.sendPostRequest(
            sparqlUtils.endpoint,
            query,
            function (jsonObj) {

                // console.log("jsonObj in makecotransporter: ", jsonObj);
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
                });
                tempFMA = tempFMA.filter(function (item, pos) {
                    return tempFMA.indexOf(item) == pos;
                });

                // console.log("tempProtein, and fma: ", tempProtein, tempFMA);

                for (var i in tempProtein) {
                    // cotransporter
                    if (tempProtein.length != 0 && tempFMA.length != 0) {
                        cotransporterList.push({
                            "membrane1": membrane1,
                            "membrane2": membrane2
                        });
                    }
                }

                counter++;

                if (counter == miscellaneous.iteration(fluxList.length)) {

                    // delete cotransporter indices from fluxList
                    for (var i in cotransporterList) {
                        for (var j in fluxList) {
                            if (cotransporterList[i].membrane1 == fluxList[j] ||
                                cotransporterList[i].membrane2 == fluxList[j]) {

                                fluxList.splice(j, 1);
                            }
                        }
                    }

                    // make cotransproter in modelEntityObj
                    for (var i in cotransporterList) {
                        modelEntityObj.push({
                            "model_entity": cotransporterList[i].membrane1,
                            "model_entity2": cotransporterList[i].membrane2
                        });
                    }

                    // make flux in modelEntityObj
                    for (var i in fluxList) {
                        modelEntityObj.push({
                            "model_entity": fluxList[i],
                            "model_entity2": ""
                        });
                    }

                    console.log("makecotransporter: fluxList -> ", fluxList);
                    console.log("makecotransporter: cotransporterList -> ", cotransporterList);
                    console.log("makecotransporter: modelEntityObj -> ", modelEntityObj);

                    console.log("makecotransporter: combinedMembrane -> ", combinedMembrane);


                    relatedMembraneModel(membraneName, cotransporterList, flag);
                }
            },
            true);
    };

    // apical or basolateral membrane in PMR
    var relatedMembrane = function (membrane, membraneName, flag) {

        console.log("relatedMembrane: ", membrane, membraneName);
        console.log("relatedMembrane -> combinedMembrane: ", combinedMembrane);

        var circleID = miscellaneous.circleIDSplitUtils($(cthis), sparqlUtils.paracellularID);
        console.log("relatedMembrane circleID: ", circleID);

        // A flux may look for a cotransporter and vice-versa
        var fstCHEBI, sndCHEBI;
        fstCHEBI = circleID[10];
        if (circleID[11] == "" || circleID[11] == "channel" || circleID[11] == "diffusiveflux")
            sndCHEBI = fstCHEBI;
        else sndCHEBI = circleID[11];

        var query = sparqlUtils.relatedMembraneSPARQL(fstCHEBI, sndCHEBI, membrane);

        ajaxUtils.sendPostRequest(
            sparqlUtils.endpoint,
            query,
            function (jsonRelatedMembrane) {

                console.log("jsonRelatedMembrane: ", jsonRelatedMembrane);

                var fluxList = [], cotransporterList = [];
                for (i = 0; i < jsonRelatedMembrane.results.bindings.length; i++) {

                    // allow only related apical or basolateral membrane from my workspace
                    if (jsonRelatedMembrane.results.bindings[i].g.value != sparqlUtils.myWorkspaneName)
                        continue;

                    fluxList.push(jsonRelatedMembrane.results.bindings[i].Model_entity.value);

                    if (circleID[11] != "" || circleID[11] != "channel" || circleID[11] != "diffusiveflux") {
                        fluxList.push(jsonRelatedMembrane.results.bindings[i].Model_entity2.value);
                    }
                }

                var tempfluxList = [];
                for (i = 0; i < fluxList.length; i++) {
                    if (!miscellaneous.isExist(fluxList[i], tempfluxList)) {
                        tempfluxList.push(fluxList[i]);
                    }
                }

                fluxList = tempfluxList;
                if (fluxList.length <= 1) {
                    console.log("fluxList.length <= 1");
                    modelEntityObj.push({
                        "model_entity": fluxList[0],
                        "model_entity2": ""
                    });

                    console.log("relatedMembrane: fluxList -> ", fluxList);
                    console.log("relatedMembrane: cotransporterList -> ", cotransporterList);
                    console.log("relatedMembrane: modelEntityObj -> ", modelEntityObj);

                    relatedMembraneModel(membraneName, cotransporterList, flag);
                }
                else {
                    for (i = 0; i < fluxList.length; i++) {
                        for (j = i + 1; j < fluxList.length; j++) {
                            makecotransporter(fluxList[i], fluxList[j], fluxList, membraneName, flag);
                        }
                    }
                }
            },
            true);
    };

    var source_fma = [], sink_fma = [], med_fma = [], med_pr = [], solute_chebi = [];
    var source_fma2 = [], sink_fma2 = [], solute_chebi2 = [];

    var relatedMembraneModel = function (membraneName, cotransporterList, flag) {

        console.log("flag in relatedMembraneModel: ", flag);

        var tempmembraneModel, indexOfHash, indexOfcellml, modelname, query;
        if (modelEntityObj.length == 0 || modelEntityObj[idMembrane].model_entity == undefined)
            tempmembraneModel = undefined;
        else {
            indexOfHash = modelEntityObj[idMembrane].model_entity.search("#");
            tempmembraneModel = modelEntityObj[idMembrane].model_entity.slice(0, indexOfHash);

            indexOfcellml = tempmembraneModel.search(".cellml");
            modelname = tempmembraneModel.slice(0, indexOfcellml);

            tempmembraneModel = tempmembraneModel + "#" + modelname;
        }

        console.log("relatedMembraneModel: tempmembraneModel ->", tempmembraneModel);
        console.log("relatedMembraneModel: modelEntityObj -> ", modelEntityObj);

        query = "PREFIX ro: <http://www.obofoundry.org/ro/ro.owl#>" +
            "PREFIX dcterms: <http://purl.org/dc/terms/>" +
            "SELECT ?Protein WHERE { <" + tempmembraneModel + "> <http://www.obofoundry.org/ro/ro.owl#modelOf> ?Protein . " +
            "}";

        ajaxUtils.sendPostRequest(
            sparqlUtils.endpoint,
            query,
            function (jsonRelatedMembraneModel) {

                console.log("relatedMembraneModel: jsonRelatedMembraneModel -> ", jsonRelatedMembraneModel);

                var endpointprOLS;
                if (jsonRelatedMembraneModel.results.bindings.length == 0) {

                    console.log("jsonRelatedMembraneModel.results.bindings.length == 0: combinedMembrane -> ", combinedMembrane);

                    showModalWindow(membraneName, flag);
                    return;
                } else {
                    endpointprOLS = sparqlUtils.abiOntoEndpoint + "/pr/terms?iri=" +
                        jsonRelatedMembraneModel.results.bindings[0].Protein.value;
                }

                ajaxUtils.sendGetRequest(
                    endpointprOLS,
                    function (jsonPr) {

                        var query = sparqlUtils.relatedMembraneModelSPARQL(modelEntityObj[idMembrane].model_entity, modelEntityObj[idMembrane].model_entity2);

                        // console.log("query: ", query);

                        ajaxUtils.sendPostRequest(
                            sparqlUtils.endpoint,
                            query,
                            function (jsonObjFlux) {
                                // console.log("relatedMembraneModel: jsonObjFlux -> ", jsonObjFlux);

                                var endpointOLS;
                                if (jsonObjFlux.results.bindings[0].solute_chebi == undefined) {
                                    endpointOLS = undefined;
                                }
                                else {
                                    var chebi_uri = jsonObjFlux.results.bindings[0].solute_chebi.value,
                                        indexofColon = chebi_uri.indexOf("CHEBI:");
                                    chebi_uri = "http://purl.obolibrary.org/obo/CHEBI_" + chebi_uri.slice(indexofColon + 6);
                                    endpointOLS = sparqlUtils.abiOntoEndpoint + "/chebi/terms?iri=" + chebi_uri;
                                }

                                ajaxUtils.sendGetRequest(
                                    endpointOLS,
                                    function (jsonObjOLSChebi) {

                                        var endpointOLS2;
                                        if (jsonObjFlux.results.bindings[0].solute_chebi2 == undefined) {
                                            endpointOLS2 = undefined;
                                        }
                                        else {
                                            var chebi_uri2 = jsonObjFlux.results.bindings[0].solute_chebi2.value,
                                                indexofColon2 = chebi_uri2.indexOf("CHEBI:");
                                            chebi_uri2 = "http://purl.obolibrary.org/obo/CHEBI_" + chebi_uri2.slice(indexofColon2 + 6);

                                            endpointOLS2 = sparqlUtils.abiOntoEndpoint + "/chebi/terms?iri=" + chebi_uri2;
                                        }

                                        ajaxUtils.sendGetRequest(
                                            endpointOLS2,
                                            function (jsonObjOLSChebi2) {

                                                for (var i = 0; i < jsonObjFlux.results.bindings.length; i++) {
                                                    // solute chebi
                                                    var temparr = jsonObjOLSChebi._embedded.terms[0].annotation["has_related_synonym"],
                                                        solute_chebi_name;
                                                    for (var m = 0; m < temparr.length; m++) {
                                                        if (temparr[m].slice(-1) == "+" || temparr[m].slice(-1) == "-") {
                                                            solute_chebi_name = temparr[m];
                                                            break;
                                                        }
                                                    }

                                                    if (jsonObjFlux.results.bindings[i].solute_chebi == undefined)
                                                        solute_chebi.push("");
                                                    else
                                                        solute_chebi.push({
                                                            name: solute_chebi_name,
                                                            uri: jsonObjFlux.results.bindings[i].solute_chebi.value
                                                        });

                                                    // solute chebi 2
                                                    var temparr2 = jsonObjOLSChebi2._embedded.terms[0].annotation["has_related_synonym"],
                                                        solute_chebi_name2;
                                                    for (var m = 0; m < temparr2.length; m++) {
                                                        if (temparr2[m].slice(-1) == "+" || temparr2[m].slice(-1) == "-") {
                                                            solute_chebi_name2 = temparr2[m];
                                                            break;
                                                        }
                                                    }

                                                    if (jsonObjFlux.results.bindings[i].solute_chebi2 == undefined)
                                                        solute_chebi2.push("");
                                                    else
                                                        solute_chebi2.push({
                                                            name: solute_chebi_name2,
                                                            uri: jsonObjFlux.results.bindings[i].solute_chebi2.value
                                                        });

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
                                                        if (temp.indexOf(sparqlUtils.partOfProteinUri) != -1 || temp.indexOf(sparqlUtils.partOfGOUri) != -1 || temp.indexOf(sparqlUtils.partOfCHEBIUri) != -1) {
                                                            med_pr.push({
                                                                // name of med_pr from OLS
                                                                // TODO: J_sc_K two PR and one FMA URI!!
                                                                med_pr: jsonObjFlux.results.bindings[i].med_entity_uri.value
                                                            });
                                                        }
                                                        else {
                                                            if (temp.indexOf(sparqlUtils.partOfFMAUri) != -1) {
                                                                med_fma.push({med_fma: jsonObjFlux.results.bindings[i].med_entity_uri.value});
                                                            }
                                                        }
                                                    }
                                                }

                                                // remove duplicate fma
                                                solute_chebi = miscellaneous.uniqueifyEpithelial(solute_chebi);
                                                solute_chebi2 = miscellaneous.uniqueifyEpithelial(solute_chebi2);
                                                source_fma = miscellaneous.uniqueifyEpithelial(source_fma);
                                                sink_fma = miscellaneous.uniqueifyEpithelial(sink_fma);
                                                source_fma2 = miscellaneous.uniqueifyEpithelial(source_fma2);
                                                sink_fma2 = miscellaneous.uniqueifyEpithelial(sink_fma2);
                                                med_pr = miscellaneous.uniqueifyEpithelial(med_pr);
                                                med_fma = miscellaneous.uniqueifyEpithelial(med_fma);

                                                if (jsonRelatedMembraneModel.results.bindings.length != 0) {

                                                    var tempVal, PID;
                                                    if (med_pr.length == 0) {
                                                        tempVal = jsonRelatedMembraneModel.results.bindings[0].Protein.value;
                                                        PID = tempVal.slice(tempVal.search("PR_") + 3, tempVal.length);
                                                    }
                                                    else {
                                                        tempVal = med_pr[0].med_pr;
                                                        PID = tempVal.slice(tempVal.search("PR_") + 3, tempVal.length);

                                                        // If PID start with 0 digit
                                                        if (PID.charAt(0) != "P") {
                                                            if (PID.charAt(0) != "Q") {
                                                                PID = "P" + PID.replace(/^0+/, ""); // Or parseInt("065", 10)
                                                            }
                                                        }
                                                    }

                                                    membraneModelObj.push({
                                                        protein: jsonRelatedMembraneModel.results.bindings[0].Protein.value,
                                                        pid: PID, // med PID
                                                        prname: jsonPr._embedded.terms[0].label,
                                                        medfma: med_fma[0].med_fma, //combinedMembrane[0].med_fma,
                                                        medpr: tempVal,
                                                        similar: 0 // initial percent
                                                    });

                                                    var sourcefma2, sinkfma2, modelentity2, variabletext,
                                                        variabletext2, sourcefma, sinkfma, solutechebi2, medfma, medpr,
                                                        solutetext2, solutechebi, solutetext, indexOfdot, indexOfHash;

                                                    if (modelEntityObj[idMembrane].model_entity2 == "") {

                                                        indexOfHash = modelEntityObj[idMembrane].model_entity.search("#");
                                                        variabletext = modelEntityObj[idMembrane].model_entity.slice(indexOfHash + 1);
                                                        indexOfdot = variabletext.indexOf(".");

                                                        variabletext = variabletext.slice(indexOfdot + 1);

                                                        var tempjsonObjFlux = miscellaneous.uniqueifyjsonFlux(jsonObjFlux.results.bindings);

                                                        // console.log("tempjsonObjFlux: ", tempjsonObjFlux);

                                                        if (tempjsonObjFlux.length == 1) {
                                                            var vartext2;
                                                            if (med_pr.length != 0) {
                                                                if (med_pr[0].med_pr == sparqlUtils.Nachannel || med_pr[0].med_pr == sparqlUtils.Kchannel ||
                                                                    med_pr[0].med_pr == sparqlUtils.Clchannel) {
                                                                    vartext2 = "channel";
                                                                }
                                                                else if (tempjsonObjFlux[0].source_fma.value == sparqlUtils.luminalID &&
                                                                    tempjsonObjFlux[0].sink_fma.value == sparqlUtils.interstitialID) {
                                                                    vartext2 = "diffusiveflux";
                                                                }
                                                                else {
                                                                    vartext2 = "flux"; // flux
                                                                }
                                                            }

                                                            // TODO: ??
                                                            if (med_pr.length == 0) {
                                                                vartext2 = "flux"; // "no mediator"
                                                            }

                                                            // console.log("vartext2, med_pr: ", vartext2, med_pr);

                                                            sourcefma = tempjsonObjFlux[0].source_fma.value;
                                                            sinkfma = tempjsonObjFlux[0].sink_fma.value;
                                                            solutechebi = solute_chebi[0].uri;
                                                            solutetext = solute_chebi[0].name;
                                                            medfma = med_fma[0].med_fma;

                                                            if (med_pr.length != 0) {
                                                                medpr = med_pr[0].med_pr; // TODO: J_Sc_Na has 2 PR and 1 FMA URIs!! Fix this!!
                                                            }
                                                            else {
                                                                medpr = "";
                                                            }

                                                            modelentity2 = "";
                                                            if (vartext2 == "channel" || vartext2 == "diffusiveflux") {
                                                                sourcefma2 = vartext2;
                                                                sinkfma2 = vartext2;
                                                                variabletext2 = vartext2; // flux/channel/diffusiveflux
                                                                solutechebi2 = vartext2;
                                                                solutetext2 = vartext2;
                                                            }
                                                            else {
                                                                sourcefma2 = "";
                                                                sinkfma2 = "";
                                                                variabletext2 = vartext2; // flux/channel/diffusiveflux
                                                                solutechebi2 = "";
                                                                solutetext2 = "";
                                                            }
                                                        }
                                                        else {
                                                            // same solute - J_Na in mackenzie model
                                                            if (tempjsonObjFlux.length == 2 && modelEntityObj[idMembrane].model_entity2 == "") {
                                                                modelentity2 = modelEntityObj[idMembrane].model_entity;
                                                                sourcefma = tempjsonObjFlux[0].source_fma.value;
                                                                sinkfma = tempjsonObjFlux[0].sink_fma.value;
                                                                sourcefma2 = tempjsonObjFlux[1].source_fma.value;
                                                                sinkfma2 = tempjsonObjFlux[1].sink_fma.value;
                                                                medfma = med_fma[0].med_fma;

                                                                if (med_pr.length != 0) {
                                                                    medpr = med_pr[0].med_pr;
                                                                }
                                                                else {
                                                                    medpr = "";
                                                                }

                                                                variabletext2 = variabletext;
                                                                solutechebi = solute_chebi[0].uri;
                                                                solutetext = solute_chebi[0].name;
                                                                solutechebi2 = solutechebi;
                                                                solutetext2 = solutetext;
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        indexOfHash = modelEntityObj[idMembrane].model_entity.search("#");
                                                        variabletext = modelEntityObj[idMembrane].model_entity.slice(indexOfHash + 1);
                                                        indexOfdot = variabletext.indexOf(".");
                                                        variabletext = variabletext.slice(indexOfdot + 1);

                                                        indexOfHash = modelEntityObj[idMembrane].model_entity2.search("#");
                                                        variabletext2 = modelEntityObj[idMembrane].model_entity2.slice(indexOfHash + 1);
                                                        indexOfdot = variabletext2.indexOf(".");
                                                        variabletext2 = variabletext2.slice(indexOfdot + 1);

                                                        modelentity2 = modelEntityObj[idMembrane].model_entity2;
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

                                                // console.log("medpr, protein.value: ", medpr, jsonRelatedMembraneModel, jsonRelatedMembraneModel.results.bindings[0].Protein.value);

                                                var medURI, endpointOLS;
                                                if (medpr == undefined || medpr == "") {
                                                    medURI = jsonRelatedMembraneModel.results.bindings[0].Protein.value;
                                                }
                                                else
                                                    medURI = medpr;

                                                // console.log("medURI: ", medURI);

                                                if (medURI.indexOf(sparqlUtils.partOfCHEBIUri) != -1) {
                                                    var indexofColon = medURI.indexOf("CHEBI:");
                                                    chebi_uri = "http://purl.obolibrary.org/obo/CHEBI_" + medURI.slice(indexofColon + 6);
                                                    endpointOLS = sparqlUtils.abiOntoEndpoint + "/chebi/terms?iri=" + chebi_uri;
                                                }
                                                else if (medURI.indexOf(sparqlUtils.partOfGOUri) != -1) {
                                                    var indexofColon = medURI.indexOf("GO:");
                                                    var go_uri = "http://purl.obolibrary.org/obo/GO_" + medURI.slice(indexofColon + 3);
                                                    endpointOLS = sparqlUtils.abiOntoEndpoint + "/go/terms?iri=" + go_uri;
                                                }
                                                else
                                                    endpointOLS = sparqlUtils.abiOntoEndpoint + "/pr/terms?iri=" + medURI;

                                                ajaxUtils.sendGetRequest(
                                                    endpointOLS,
                                                    function (jsonObjOLSMedPr) {

                                                        var tempvar, med_pr_text_syn;
                                                        if (jsonObjOLSMedPr._embedded.terms[0].annotation["has_related_synonym"] == undefined) {
                                                            med_pr_text_syn = jsonObjOLSMedPr._embedded.terms[0].annotation["id"][0].slice(3);
                                                        }
                                                        else {
                                                            tempvar = jsonObjOLSMedPr._embedded.terms[0].annotation["has_related_synonym"];
                                                            med_pr_text_syn = tempvar[0].toUpperCase();
                                                        }

                                                        membraneModelID.push([
                                                            modelEntityObj[idMembrane].model_entity, // model_entity
                                                            modelentity2, // model_entity2
                                                            variabletext, // variable_text
                                                            variabletext2, // variable_text2
                                                            sourcefma,
                                                            sinkfma,
                                                            sourcefma2,
                                                            sinkfma2,
                                                            medfma, // jsonObjFlux.results.bindings[0].med_entity_uri.value, // med_fma
                                                            medpr, // med_pr, e.g. mediator in a cotransporter protein
                                                            solutechebi, // solute_chebi
                                                            solutechebi2, // solute_chebi2
                                                            solutetext, //solute_text
                                                            solutetext2, //solute_text2
                                                            jsonObjOLSMedPr._embedded.terms[0].label, //med_pr_text,
                                                            med_pr_text_syn, //med_pr_text_syn
                                                            jsonRelatedMembraneModel.results.bindings[0].Protein.value // protein_name
                                                        ]);

                                                        solute_chebi = [];
                                                        solute_chebi2 = [];
                                                        source_fma = [];
                                                        sink_fma = [];
                                                        source_fma2 = [];
                                                        sink_fma2 = [];
                                                        med_pr = [];
                                                        med_fma = [];

                                                        console.log("relatedMembraneModel: idMembrane -> ", idMembrane);
                                                        console.log("relatedMembraneModel: modelEntityObj -> ", modelEntityObj);
                                                        console.log("relatedMembraneModel: membraneModelID -> ", membraneModelID);

                                                        if (modelEntityObj[idMembrane].model_entity != undefined)
                                                            idMembrane++;

                                                        if (idMembrane == modelEntityObj.length) {
                                                            console.log("relatedMembraneModel -> combinedMembrane: ", combinedMembrane);

                                                            showModalWindow(membraneName, flag);
                                                            return;
                                                        }

                                                        relatedMembraneModel(membraneName, cotransporterList, flag);

                                                    }, true);
                                            }, true);
                                    }, true);
                            }, true);
                    }, true);
            }, true);
    };

    var showModalWindow = function (membraneName, flag) {

        console.log("flag in showModalWindow: ", flag);
        console.log("showModalWindow -> combinedMembrane: ", combinedMembrane);

        // add models without dragging
        if (flag == 2) {
            var relatedOrganModels2 = "<p id=addModelsID>";
            for (var i = 0; i < membraneModelID.length; i++) {

                console.log("add models without dragging");
                console.log("flag in showModalWindow: ", flag);
                console.log("combinedMembrane: ", combinedMembrane);
                console.log("membraneModelID: ", membraneModelID);

                // Do not display already visualized models on the apical or basolateral membrane
                if (miscellaneous.searchInCombinedMembrane(membraneModelID[i][0], membraneModelID[i][1], combinedMembrane))
                    continue;

                var workspaceuri = sparqlUtils.myWorkspaneName + "/" + "rawfile" + "/" + "HEAD" + "/" + membraneModelID[i][0];

                var variableName;
                if (membraneModelID[i][1] != "") {
                    var indexOfHash = membraneModelID[i][1].search("#"),
                        componentVariableName = membraneModelID[i][1].slice(indexOfHash + 1), // NHE3.J_NHE3_Na
                        indexOfDot = componentVariableName.indexOf(".");

                    variableName = "and " + componentVariableName.slice(indexOfDot + 1); // J_NHE3_Na
                }
                else variableName = "";

                var label = document.createElement('label');
                label.innerHTML = '<input id="' + membraneModelID[i] + '" ' + // membraneModelID[i][0]
                    'type="checkbox" value="' + membraneModelID[i][0] + '">' + // "' + membraneModelID[i][0] + " " + variableName + '"
                    '<a href="' + workspaceuri + '" target="_blank" ' +
                    'data-toggle="tooltip" data-placement="right" ' +
                    'title="Protein name: ' + membraneModelID[i][14] + '\n' +
                    'Protein uri: ' + membraneModelID[i][16] + '\n' +
                    'Mediator name: ' + membraneModelID[i][14] + '\n' +
                    'Mediator uri: ' + membraneModelID[i][9] + '\n' +
                    'Model entity: ' + membraneModelID[i][0] + '\n' +
                    'Model entity2: ' + membraneModelID[i][1] + '"' +
                    '>' + membraneModelID[i][0] + " " + variableName + '</a></label>'; // membraneModelID[i][0]

                relatedOrganModels2 += label.innerHTML + "<br>";
            }

            if (relatedOrganModels2 == "<p id=addModelsID>") {
                relatedOrganModels2 += "Not Exist" + "<br>";
            }

            $("#modalBody").empty();

            var msg = "<br><p><b>" + membraneName + " model in PMR<b><\p>";

            $("#modalBody")
                .append(msg)
                .append(relatedOrganModels2);

            console.log("outside modelbody2!");

            return;
        }
        else if (flag == 1) {
            idMembrane = 0;

            var circleID = miscellaneous.circleIDSplitUtils($(cthis), sparqlUtils.paracellularID);

            var msg2 = "<p><b>" + proteinText + "</b> is a <b>" + typeOfModel + "</b> model. It is located in " +
                "<b>" + locationOfModel + "</b><\p>";

            var workspaceuri = sparqlUtils.myWorkspaneName + "/" + "rawfile" + "/" + "HEAD" + "/" + circleID[0];

            var model = "<b>Model: </b><a href=" + workspaceuri + " + target=_blank " +
                "data-toggle=tooltip data-placement=right " +
                "title=" + proteinText + ">" + circleID[0] + "</a>";

            var biological = "<p><b>Biological Meaning: </b>" + biological_meaning + "</p>";

            if (biological_meaning2 != "")
                biological += "<p>" + biological_meaning2 + "</p>";

            var species = "<p><b>Species: </b>" + speciesName + "</p>";
            var gene = "<p><b>Gene: </b>" + geneName + "</p>";
            var protein = "<p data-toggle=tooltip data-placement=right title=" + proteinName + ">" +
                "<b>Protein: </b>" + proteinText + "</p>";

            // Related apical or basolateral model
            var index = 0, ProteinSeq = "", requestData, PID = [],
                baseUrl = "https://www.ebi.ac.uk/Tools/services/rest/clustalo";

            miscellaneous.proteinOrMedPrID(membraneModelID, PID);
            console.log("PID BEFORE: ", PID);

            var draggedMedPrID = miscellaneous.splitPRFromProtein(circleID);
            PID.push(draggedMedPrID);

            console.log("PID BEFORE Filter: ", PID);

            // remove duplicate protein ID
            PID = PID.filter(function (item, pos) {
                return PID.indexOf(item) == pos;
            });

            console.log("PID AFTER Filter: ", PID);

            // PID does NOT start with P or Q
            for (var key in PID) {
                // console.log("PID[key]: ", PID[key]);
                if (PID[key].charAt(0) == "Q") continue;

                if (PID[key].charAt(0) != "P") {
                    PID[key] = "P" + PID[key].replace(/^0+/, ""); // Or parseInt("065", 10);
                }
            }

            console.log("PID AFTER: ", PID);

            // https://www.ebi.ac.uk/seqdb/confluence/pages/viewpage.action?pageId=48923608
            // https://www.ebi.ac.uk/seqdb/confluence/display/WEBSERVICES/clustalo_rest
            var WSDbfetchREST = function () {

                // var dbfectendpoint = "http://www.ebi.ac.uk/Tools/dbfetch/dbfetch/uniprotkb/" + PID[index] + "/fasta";
                var cors_api_url = "http://localhost:8080/",
                    // dbfectendpoint = cors_api_url + "https://www.ebi.ac.uk/Tools/dbfetch/dbfetch/uniprotkb/" + PID[index] + "/fasta";
                    dbfectendpoint = "https://www.ebi.ac.uk/Tools/dbfetch/dbfetch/uniprotkb/" + PID[index] + "/fasta";

                ajaxUtils.sendGetRequest(
                    dbfectendpoint,
                    function (psequence) {
                        ProteinSeq += psequence;

                        // PID is empty
                        if (PID.length == 1) { // in fact, PID.length == 0, to enable the above dbfectendpoint query

                            var indexOfBar = psequence.search(/\|/gi),
                                indexOfBar2 = psequence.slice(indexOfBar + 1, psequence.length).search(/\|/gi),
                                t1 = psequence.slice(0, indexOfBar + indexOfBar2 + 1),
                                t2 = psequence.slice(indexOfBar + indexOfBar2 + 1);

                            psequence = t1 + "0" + t2;
                            ProteinSeq += psequence;

                            console.log("ProteinSeq when empty: ", ProteinSeq, PID);
                        }

                        index++;
                        if (index == PID.length) {
                            // console.log("ProteinSeq: ", ProteinSeq);

                            requestData = {
                                "sequence": ProteinSeq,
                                "email": "dsar941@aucklanduni.ac.nz"
                            }

                            var requestUrl = baseUrl + "/run/";

                            ajaxUtils.sendEBIPostRequest(
                                requestUrl,
                                requestData,
                                function (jobId) {
                                    // console.log("jobId: ", jobId); // jobId

                                    var chkJobStatus = function (jobId) {
                                        var jobIdUrl = baseUrl + "/status/" + jobId;
                                        ajaxUtils.sendGetRequest(
                                            jobIdUrl,
                                            function (resultObj) {
                                                console.log("result: ", resultObj); // jobId status

                                                if (resultObj == "RUNNING") {
                                                    setTimeout(function () {
                                                        chkJobStatus(jobId);
                                                    }, 5000);
                                                }

                                                var pimUrl = baseUrl + "/result/" + jobId + "/pim";
                                                ajaxUtils.sendGetRequest(
                                                    pimUrl,
                                                    function (identityMatrix) {

                                                        var similarityOBJ = miscellaneous.similarityMatrixEBI(
                                                            identityMatrix, PID, draggedMedPrID, membraneModelObj);

                                                        var tempList = [];
                                                        for (var i = 0; i < membraneModelObj.length; i++) {
                                                            for (var j = 0; j < membraneModelID.length; j++) {

                                                                var tempID = miscellaneous.splitPRFromProtein(membraneModelID[j]);
                                                                if (tempID.charAt(0) != "P") {
                                                                    if (tempID.charAt(0) != "Q") {
                                                                        tempID = "P" + tempID.replace(/^0+/, "");
                                                                    }
                                                                }

                                                                if (membraneModelObj[i].pid == tempID) {
                                                                    tempList.push(membraneModelID[j]);
                                                                    break;
                                                                }
                                                            }
                                                        }

                                                        for (var i = 0; i < tempList.length; i++) {
                                                            membraneModelID[i] = tempList[i];
                                                        }

                                                        // console.log("tempList: ", tempList);
                                                        console.log("AFTER membraneModelID: ", membraneModelID);
                                                        console.log("membraneModelObj: ", membraneModelObj);
                                                        console.log("else if (flag == 1) combinedMembrane: ", combinedMembrane);

                                                        // apical or basolateral membrane
                                                        var membraneModel = "<p id=membraneModelsID><b>" + membraneName + " model</b>";
                                                        for (var i = 0; i < membraneModelObj.length; i++) {

                                                            // Do not display visualized models
                                                            if (miscellaneous.searchInCombinedMembrane(membraneModelID[i][0], membraneModelID[i][1], combinedMembrane))
                                                                continue;

                                                            var workspaceuri = sparqlUtils.myWorkspaneName + "/" + "rawfile" + "/" + "HEAD" + "/" + membraneModelID[i][0];

                                                            var label = document.createElement("label");
                                                            label.innerHTML = '<br><input id="' + membraneModelID[i] + '" ' +
                                                                'type="checkbox" value="' + membraneModelID[i][0] + '">' + // membraneModelObj[i].prname
                                                                '<a href="' + workspaceuri + '" target="_blank" ' +
                                                                'data-toggle="tooltip" data-placement="right" ' +
                                                                'title="Protein name: ' + membraneModelObj[i].prname + '\n' +
                                                                'Protein uri: ' + membraneModelObj[i].protein + '\n' +
                                                                'Mediator name: ' + membraneModelID[i][14] + '\n' +
                                                                'Mediator uri: ' + membraneModelObj[i].medpr + '\n' +
                                                                'Similarity value: ' + membraneModelObj[i].similar + '\n' +
                                                                'Model entity: ' + membraneModelID[i][0] + '\n' +
                                                                'Model entity2: ' + membraneModelID[i][1] + '"' +
                                                                '>' + membraneModelID[i][14] + '</a></label>'; // membraneModelObj[i].prname

                                                            membraneModel += label.innerHTML;
                                                        }

                                                        if (membraneModel == "<p id=membraneModelsID><b>" + membraneName + " model</b>") {
                                                            membraneModel += "<br>Not Exist" + "<br>";
                                                        }

                                                        // membraneModel += "</p>";
                                                        // console.log("alternativeModelObj: ", alternativeModelObj);

                                                        // alternative model
                                                        var alternativeModel = "<p id=alternativeModelID><b>Alternative model of " + proteinText + "</b>";
                                                        if (alternativeModelObj.length == 0) {
                                                            alternativeModel += "<br>Not Exist" + "<br>";
                                                        }
                                                        else {
                                                            for (var i = 0; i < alternativeModelObj.length; i++) {
                                                                var workspaceuri = alternativeModelObj[i].workspaceName +
                                                                    "/" + "rawfile" + "/" + "HEAD" + "/" + alternativeModelObj[i].modelEntity;

                                                                // TODO: SPARQL query to get flux of solutes similar to modalWindowToAddModels
                                                                var label = document.createElement("label");
                                                                label.innerHTML = '<br><input id="' + alternativeModelObj[i].modelEntity + '" ' +
                                                                    'type="checkbox" value="' + alternativeModelObj[i].modelEntity + '">' +
                                                                    '<a href="' + workspaceuri + '" target="_blank" ' +
                                                                    'data-toggle="tooltip" data-placement="right" ' +
                                                                    'title="Protein name: ' + alternativeModelObj[i].prname + '\n' +
                                                                    'Protein uri: ' + alternativeModelObj[i].protein + '\n' +
                                                                    'Model entity: ' + alternativeModelObj[i].modelEntity + '"' +
                                                                    '>' + alternativeModelObj[i].prname + '</a></label>';

                                                                alternativeModel += label.innerHTML;
                                                            }
                                                        }

                                                        // alternativeModel += "</p>";
                                                        // console.log("relatedModelObj: ", relatedModelObj);

                                                        // related organ models (kidney, lungs, etc) in PMR
                                                        var relatedOrganModel = "<p id=relatedOrganModelID><b>" + typeOfModel + " model in PMR</b>";
                                                        if (relatedModelObj.length == 1) { // includes own protein name
                                                            relatedOrganModel += "<br>Not Exist" + "<br>";
                                                        }
                                                        else {
                                                            for (var i = 0; i < relatedModelObj.length; i++) {

                                                                if (proteinName == relatedModelObj[i].protein)
                                                                    continue;

                                                                var workspaceuri = relatedModelObj[i].workspaceName +
                                                                    "/" + "rawfile" + "/" + "HEAD" + "/" + relatedModelObj[i].modelEntity;

                                                                var label = document.createElement("label");
                                                                label.innerHTML = '<br><a href="' + workspaceuri + '" target="_blank" ' +
                                                                    'data-toggle="tooltip" data-placement="right" ' +
                                                                    'title="Protein name: ' + relatedModelObj[i].prname + '\n' +
                                                                    'Protein uri: ' + relatedModelObj[i].protein + '\n' +
                                                                    'Model entity: ' + relatedModelObj[i].modelEntity + '"' +
                                                                    '>' + relatedModelObj[i].prname + '</a></label>';

                                                                relatedOrganModel += label.innerHTML;
                                                            }
                                                        }

                                                        // relatedModelObj += "</p>";

                                                        $("#modalBody").empty();

                                                        $("#modalBody")
                                                            .append(msg2)
                                                            .append(model)
                                                            .append(biological)
                                                            .append(species)
                                                            .append(gene)
                                                            .append(protein);

                                                        var msg3 = "<br><p><b>Recommendations/suggestions based on existing models in PMR<b><\p>";

                                                        $("#modalBody")
                                                            .append(msg3)
                                                            .append(membraneModel)
                                                            .append(alternativeModel)
                                                            .append(relatedOrganModel);

                                                        console.log("outside modelbody!");

                                                        return;
                                                    },
                                                    false);
                                            },
                                            false);
                                    }

                                    chkJobStatus(jobId);
                                    console.log("AFTER chkJobStatus(jobId)!");

                                    return;
                                },
                                false);

                            return;
                        }

                        // callback
                        WSDbfetchREST();
                        console.log("AFTER WSDbfetchREST!");
                    },
                    false);
            };

            WSDbfetchREST();
            console.log("AFTER WSDbfetchREST!");

            return;
        }
    };

    // circles, polygons and arrows move back if close clicked
    // circles, polygons and arrows move back if close clicked
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
        if (circlewithlineg[icircleGlobal] != undefined) {
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
    };

    // retain color of membranes
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
    };

    // rearrange circles, polygons, and arrows for a change
    var circleRearrange = function () {
        // initial values for apical
        var cyinitial = 213.3333282470703,
            dy1lineinitial = 193.3333282470703,
            dy1lineinitial2 = 233.3333282470703,
            dytextinitial = 198.3333282470703,
            dytextinitial2 = 237.3333282470703;
        for (i = 0; i < circlewithlineg.length; i++) {
            if (circlewithlineg[i].attr("membrane") == sparqlUtils.apicalID) {
                console.log("circleRearrange on apical membrane!");

                // line 1
                dy1line[i] = dy1lineinitial;
                dy2line[i] = dy1lineinitial;
                linewithlineg[i]
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .attr("y1", dy1line[i])
                    .attr("y2", dy2line[i]);

                // text 1
                dytext[i] = dytextinitial;
                linewithtextg[i]
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .attr("y", dytext[i]);

                if (linewithlineg2[i] != undefined) {

                    console.log("circleRearrange on apical membrane 2!");

                    if (linewithlineg2[i] != "") {
                        // line 2
                        dy1line2[i] = dy1lineinitial2;
                        dy2line2[i] = dy1lineinitial2;
                        linewithlineg2[i]
                            .transition()
                            .delay(1000)
                            .duration(1000)
                            .attr("y1", dy1line2[i])
                            .attr("y2", dy2line2[i]);

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

                    dycircletext[i] = dy[i];
                    circlewithtext[i]
                        .transition()
                        .delay(1000)
                        .duration(1000)
                        .attr("y", dycircletext[i])
                }

                if (circlewithlineg[i]._groups[0][0].tagName == "polygon") {
                    dy[i] = cyinitial;
                    circlewithlineg[i]
                        .transition()
                        .delay(1000)
                        .duration(1000)
                        .attr("transform", "translate(" + dx[i] + "," + (dy[i] - 50) + ")")
                        .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30");

                    // circle text
                    dycircletext[i] = dy[i] - 15;
                    circlewithtext[i]
                        .transition()
                        .delay(1000)
                        .duration(1000)
                        .attr("y", dycircletext[i])
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
        for (i = 0; i < circlewithlineg.length; i++) {
            if (circlewithlineg[i].attr("membrane") == sparqlUtils.basolateralID) {
                console.log("circleRearrange on basolateral membrane!");

                // line 1
                dy1line[i] = dy1lineinitialb;
                dy2line[i] = dy1lineinitialb;
                linewithlineg[i]
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .attr("y1", dy1line[i])
                    .attr("y2", dy2line[i]);

                // text 1
                dytext[i] = dytextinitialb;
                linewithtextg[i]
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .attr("y", dytext[i]);

                if (linewithlineg2[i] != undefined) {

                    console.log("circleRearrange on basolateral membrane 2!");

                    if (linewithlineg2[i] != "") {
                        // line 2
                        dy1line2[i] = dy1lineinitialb2;
                        dy2line2[i] = dy1lineinitialb2;
                        linewithlineg2[i]
                            .transition()
                            .delay(1000)
                            .duration(1000)
                            .attr("y1", dy1line2[i])
                            .attr("y2", dy2line2[i]);

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

                    // circle text
                    dycircletext[i] = dy[i];
                    circlewithtext[i]
                        .transition()
                        .delay(1000)
                        .duration(1000)
                        .attr("y", dycircletext[i])
                }

                if (circlewithlineg[i]._groups[0][0].tagName == "polygon") {
                    dy[i] = cyinitialb;
                    circlewithlineg[i]
                        .transition()
                        .delay(1000)
                        .duration(1000)
                        .attr("transform", "translate(" + dx[i] + "," + (dy[i] - 50) + ")")
                        .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30");

                    // circle text
                    dycircletext[i] = dy[i] - 15;
                    circlewithtext[i]
                        .transition()
                        .delay(1000)
                        .duration(1000)
                        .attr("y", dycircletext[i])
                }

                // decrement y-axis of line and circle
                cyinitialb += ydistance;
                dy1lineinitialb += ydistance;
                dy1lineinitialb2 += ydistance;
                dytextinitialb += ydistance;
                dytextinitialb2 += ydistance;
            }
        }
    };

    // reinitialize variable for next miscellaneous.iteration
    var reinitVariable = function () {
        idProtein = 0;
        idAltProtein = 0;
        idMembrane = 0;
        counter = 0;

        membraneModelObj = [];
        alternativeModelObj = [];
        relatedModelObj = [];

        relatedModel = [];
        modelEntityObj = [];
        membraneModelID = [];

        relatedModelEntity = [];
        cotransporterList = [];
    };

    var Modal = function (options) {

        console.log("Modal function");

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
                '</h4></div>';

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

            // close button clicked!!
            $("#mcloseID").click(function (event) {

                console.log("second close button clicked!!");

                moveBack();
                membraneColorBack();

                if (mindex == 1)
                    linebasolateral.transition().delay(1000).duration(1000).style("stroke", "orange");
                else
                    lineapical.transition().delay(1000).duration(1000).style("stroke", "green");

                reinitVariable();
                return;
            })

            // save button clicked!!
            $("#msaveID").click(function (event) {

                console.log("#msaveID: ", combinedMembrane);
                console.log("second save button clicked!");

                // add models without dragging
                for (i = 0; i < $("#addModelsID input").length; i++) {
                    if ($("#addModelsID input")[i].checked) {

                        console.log("add models without dragging!!");

                        var cTHIS = $("#addModelsID input")[i].id;
                        console.log("cTHIS AFTER: ", cTHIS);

                        var circleID = cTHIS.split(",");
                        console.log("circleID in addModelsID input: ", circleID);

                        combinedMembrane.push({
                            model_entity: circleID[0], // cellml model entity (e.g. weinstein_1995.cellml#NHE3.J_NHE3_Na)
                            variable_text: circleID[2], // cellml variable name (e.g. J_NHE_Na)
                            source_fma: circleID[4], // source FMA uri
                            sink_fma: circleID[5], // sink FMA uri
                            med_fma: circleID[8], // mediator FMA uri
                            med_pr: circleID[9], // mediator protein uri
                            solute_chebi: circleID[10], // solute CHEBI uri
                            solute_text: circleID[12], // solute text using the CHEBI uri from OLS
                            med_pr_text: circleID[14], // mediator protein text using the mediator protein uri from OLS
                            med_pr_text_syn: circleID[15], // synonym of a mediator protein text (e.g. NHE3, SGLT1) using the mediator protein uri from OLS
                            protein_name: circleID[16], // protein name
                            model_entity2: circleID[1], // cellml model entity => cotransporter or empty otherwise
                            variable_text2: circleID[3], // cellml variable name
                            source_fma2: circleID[6], // source FMA uri => cotransporter or empty otherwise
                            sink_fma2: circleID[7], // sink FMA uri => cotransporter or empty otherwise
                            solute_chebi2: circleID[11], // solute CHEBI uri
                            solute_text2: circleID[13] // solute text using the CHEBI uri from OLS
                        });
                        // combinedMembrane = miscellaneous.uniqueifyCombinedMembrane(combinedMembrane);

                        console.log("combinedMembrane in addModelsID input: ", combinedMembrane);

                        combinedMemChk(combinedMembrane.length - 1);
                        combinedMemFunc(combinedMembrane.length - 1, msaveIDflag);

                        reinitVariable();
                        return;
                    }
                }

                // apical or basolateral membrane models
                for (i = 0; i < $("#membraneModelsID input").length; i++) {
                    if ($("#membraneModelsID input")[i].checked) {

                        console.log("Apical or Basolateral membrane!!");

                        // paracellular
                        if ($(cthis).attr("membrane") == sparqlUtils.paracellularID) {
                            $(cthis).attr("idParacellular", $("#membraneModelsID input")[i].id);
                        }
                        else {
                            $(cthis).attr("id", $("#membraneModelsID input")[i].id);
                        }

                        $(cthis).attr("id", $("#membraneModelsID input")[i].id);
                        console.log("cthis AFTER: ", cthis);

                        console.log("$(#membraneModelsID input): ", combinedMembrane);
                    }
                }

                // alternative models
                for (i = 0; i < $("#alternativeModelID input").length; i++) {
                    if ($("#alternativeModelID input")[i].checked) {

                        console.log("Alternative model!!");

                        $(cthis).attr("id", $("#alternativeModelID input")[i].id);
                        console.log("cthis AFTER: ", cthis);
                    }
                }

                // related organ models in PMR
                for (i = 0; i < $("#relatedOrganModelID input").length; i++) {
                    if ($("#relatedOrganModelID input")[i].checked) {

                        console.log("Related organ model!!");

                        $(cthis).attr("id", $("#relatedOrganModelID input")[i].id);
                        console.log("cthis AFTER: ", cthis);
                    }
                }

                membraneColorBack();

                var circleID = miscellaneous.circleIDSplitUtils($(cthis), sparqlUtils.paracellularID);
                console.log("circleID at the end: ", circleID);

                var totalCheckboxes = $("input:checkbox").length,
                    numberOfChecked = $("input:checkbox:checked").length,
                    numberOfNotChecked = totalCheckboxes - numberOfChecked;

                console.log("totalCheckboxes, numberOfChecked, numberNotChecked: ", totalCheckboxes, numberOfChecked, numberOfNotChecked);
                console.log("$(#msaveID).click(function (event): combinedMembrane", combinedMembrane);

                if (totalCheckboxes == numberOfNotChecked) {
                    console.log("if (totalCheckboxes == numberOfNotChecked");
                    console.log("totalCheckboxes, numberNotChecked: ", totalCheckboxes, numberOfNotChecked);
                    console.log("circleID checkboxes: ", circleID[4], circleID[5], circleID[8]);

                    console.log("icircleGlobal: ", icircleGlobal);

                    // mediator FMA uri
                    if (combinedMembrane[icircleGlobal].med_fma == sparqlUtils.apicalID) {
                        circleID[8] = sparqlUtils.basolateralID;
                        combinedMembrane[icircleGlobal].med_fma = sparqlUtils.basolateralID;

                        // source and sink FMA uri
                        if (combinedMembrane[icircleGlobal].source_fma == sparqlUtils.luminalID && combinedMembrane[icircleGlobal].sink_fma == sparqlUtils.cytosolID) {
                            circleID[4] = sparqlUtils.cytosolID;
                            combinedMembrane[icircleGlobal].source_fma = sparqlUtils.cytosolID;
                            circleID[5] = sparqlUtils.interstitialID;
                            combinedMembrane[icircleGlobal].sink_fma = sparqlUtils.interstitialID;
                        }

                        if (combinedMembrane[icircleGlobal].source_fma == sparqlUtils.cytosolID && combinedMembrane[icircleGlobal].sink_fma == sparqlUtils.luminalID) {
                            circleID[4] = sparqlUtils.interstitialID;
                            combinedMembrane[icircleGlobal].source_fma = sparqlUtils.interstitialID;
                            circleID[5] = sparqlUtils.cytosolID;
                            combinedMembrane[icircleGlobal].sink_fma = sparqlUtils.cytosolID;
                        }

                        // source2 and sink2 FMA uri
                        if (combinedMembrane[icircleGlobal].source_fma2 != "" && combinedMembrane[icircleGlobal].sink_fma2 != "") {
                            if (combinedMembrane[icircleGlobal].source_fma2 == sparqlUtils.luminalID && combinedMembrane[icircleGlobal].sink_fma2 == sparqlUtils.cytosolID) {
                                circleID[6] = sparqlUtils.cytosolID;
                                combinedMembrane[icircleGlobal].source_fma2 = sparqlUtils.cytosolID;
                                circleID[7] = sparqlUtils.interstitialID;
                                combinedMembrane[icircleGlobal].sink_fma2 = sparqlUtils.interstitialID;
                            }

                            if (combinedMembrane[icircleGlobal].source_fma2 == sparqlUtils.cytosolID && combinedMembrane[icircleGlobal].sink_fma2 == sparqlUtils.luminalID) {
                                circleID[6] = sparqlUtils.interstitialID;
                                combinedMembrane[icircleGlobal].source_fma2 = sparqlUtils.interstitialID;
                                circleID[7] = sparqlUtils.cytosolID;
                                combinedMembrane[icircleGlobal].sink_fma2 = sparqlUtils.cytosolID;
                            }
                        }
                    }
                    else {
                        circleID[8] = sparqlUtils.apicalID;
                        combinedMembrane[icircleGlobal].med_fma = sparqlUtils.apicalID;

                        // source and sink FMA uri
                        if (combinedMembrane[icircleGlobal].source_fma == sparqlUtils.cytosolID && combinedMembrane[icircleGlobal].sink_fma == sparqlUtils.interstitialID) {
                            circleID[4] = sparqlUtils.luminalID;
                            combinedMembrane[icircleGlobal].source_fma = sparqlUtils.luminalID;
                            circleID[5] = sparqlUtils.cytosolID;
                            combinedMembrane[icircleGlobal].sink_fma = sparqlUtils.cytosolID;
                        }

                        if (combinedMembrane[icircleGlobal].source_fma == sparqlUtils.interstitialID && combinedMembrane[icircleGlobal].sink_fma == sparqlUtils.cytosolID) {
                            circleID[4] = sparqlUtils.cytosolID;
                            combinedMembrane[icircleGlobal].source_fma = sparqlUtils.cytosolID;
                            circleID[5] = sparqlUtils.luminalID;
                            combinedMembrane[icircleGlobal].sink_fma = sparqlUtils.luminalID;
                        }

                        // source2 and sink2 FMA uri
                        if (circleID[6] != "" && circleID[7] != "") {
                            if (combinedMembrane[icircleGlobal].source_fma2 == sparqlUtils.cytosolID && combinedMembrane[icircleGlobal].sink_fma2 == sparqlUtils.interstitialID) {
                                circleID[6] = sparqlUtils.luminalID;
                                combinedMembrane[icircleGlobal].source_fma2 = sparqlUtils.luminalID;
                                circleID[7] = sparqlUtils.cytosolID;
                                combinedMembrane[icircleGlobal].sink_fma2 = sparqlUtils.cytosolID;
                            }

                            if (combinedMembrane[icircleGlobal].source_fma2 == sparqlUtils.interstitialID && combinedMembrane[icircleGlobal].sink_fma2 == sparqlUtils.cytosolID) {
                                circleID[6] = sparqlUtils.cytosolID;
                                combinedMembrane[icircleGlobal].source_fma2 = sparqlUtils.cytosolID;
                                circleID[7] = sparqlUtils.luminalID;
                                combinedMembrane[icircleGlobal].sink_fma2 = sparqlUtils.luminalID;
                            }
                        }
                    }
                }
                else {

                    console.log("ELSE totalCheckboxes == numberOfNotChecked");

                    // update combinedMembrane, this will be sent to GMS to assemble and reproduce a new cellml model
                    combinedMembrane[icircleGlobal].model_entity = circleID[0]; // cellml model entity (e.g. weinstein_1995.cellml#NHE3.J_NHE3_Na)
                    combinedMembrane[icircleGlobal].variable_text = circleID[2]; // cellml variable name (e.g. J_NHE_Na)
                    combinedMembrane[icircleGlobal].source_fma = circleID[4]; // source FMA uri
                    combinedMembrane[icircleGlobal].sink_fma = circleID[5]; // sink FMA uri
                    combinedMembrane[icircleGlobal].med_fma = circleID[8]; // mediator FMA uri
                    combinedMembrane[icircleGlobal].med_pr = circleID[9]; // mediator protein uri
                    combinedMembrane[icircleGlobal].solute_chebi = circleID[10]; // solute CHEBI uri
                    combinedMembrane[icircleGlobal].solute_text = circleID[12]; // solute text using the CHEBI uri from OLS
                    combinedMembrane[icircleGlobal].med_pr_text = circleID[14]; // mediator protein text using the mediator protein uri from OLS
                    combinedMembrane[icircleGlobal].med_pr_text_syn = circleID[15]; // synonym of a mediator protein text (e.g. NHE3, SGLT1) using the mediator protein uri from OLS
                    combinedMembrane[icircleGlobal].protein_name = circleID[16]; // protein name
                    combinedMembrane[icircleGlobal].model_entity2 = circleID[1]; // cellml model entity => cotransporter or empty otherwise
                    combinedMembrane[icircleGlobal].variable_text2 = circleID[3]; // cellml variable name
                    combinedMembrane[icircleGlobal].source_fma2 = circleID[6]; // source FMA uri => cotransporter or empty otherwise
                    combinedMembrane[icircleGlobal].sink_fma2 = circleID[7]; // sink FMA uri => cotransporter or empty otherwise
                    combinedMembrane[icircleGlobal].solute_chebi2 = circleID[11]; // solute CHEBI uri
                    combinedMembrane[icircleGlobal].solute_text2 = circleID[13]; // solute text using the CHEBI uri from OLS
                }

                console.log("icircleGlobal: ", icircleGlobal);
                console.log("combinedMembrane: ", combinedMembrane);
                console.log("circlewithlineg: ", circlewithlineg);
                console.log("$('#newgid').prop('childNodes'): ", $('#newgid').prop('childNodes'));
                for (var i = 0; i < $('#newgid').prop('childNodes').length; i++) {

                    if ($('#newgid').prop('childNodes')[i].firstChild == undefined)
                        continue;

                    console.log("$('#newgid').prop('childNodes')[i].firstChild.id: ",
                        $('#newgid').prop('childNodes')[i].firstChild.id);

                    if ($('#newgid').prop('childNodes')[i].firstChild.id == "linewithlineg" + icircleGlobal) {
                        console.log("index of i: ", i);

                        $('#newgid').prop('childNodes')[i].remove();
                        // break;
                    }
                }

                // circle placement and rearrangement
                if ($(cthis).attr("membrane") == sparqlUtils.apicalID) {
                    linebasolateral
                        .transition()
                        .delay(1000)
                        .duration(1000)
                        .style("stroke", "orange");

                    msaveIDflag = true;
                    combinedMemFunc(icircleGlobal, msaveIDflag);

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

                    msaveIDflag = true;
                    combinedMemFunc(icircleGlobal, msaveIDflag);

                    // decrement y-axis of line and circle
                    yvalueb -= ydistance;
                    cyvalueb -= ydistance;

                    // increment y-axis of line and circle
                    yvalue += ydistance;
                    cyvalue += ydistance;

                    circleRearrange();
                }

                var reflectCheckbox = function (icircleGlobal) {
                    checkboxsvg.call(checkBox[icircleGlobal])._groups[0][0].textContent = combinedMembrane[icircleGlobal].med_pr_text;
                    console.log("checkboxsvg in reflectCheckbox: ", checkboxsvg._groups[0][0].textContent);

                    ydistancechk = 50;
                    yinitialchk = 185;
                    ytextinitialchk = 200;

                    for (var i = 0; i < combinedMembrane.length; i++) {
                        var textvaluechk = combinedMembrane[i].med_pr_text;
                        var indexOfParen = textvaluechk.indexOf("(");
                        textvaluechk = textvaluechk.slice(0, indexOfParen - 1) + " (" + combinedMembrane[i].med_pr_text_syn + ")";

                        checkBox[i].x(850).y(yinitialchk).checked(false).clickEvent(update);
                        checkBox[i].xtext(890).ytext(ytextinitialchk).text("" + textvaluechk + "");

                        checkboxsvg.call(checkBox[i]);

                        yinitialchk += ydistancechk;
                        ytextinitialchk += ydistancechk;
                    }
                };
                reflectCheckbox(icircleGlobal);

                // reinitialization
                reinitVariable();
                return;
            });
        };

        /**
         * Set header text. It makes sense only if the options.header is logical true.
         * @param {String} html New header text.
         */
        $this.setHeader = function (html) {
            $this.window.find(".modal-title").html(html);
        };

        /**
         * Set body HTML.
         * @param {String} html New body HTML
         */
        $this.setBody = function (html) {
            $this.window.find(".modal-body").html(html);
        };

        /**
         * Set footer HTML.
         * @param {String} html New footer HTML
         */
        $this.setFooter = function (html) {
            $this.window.find(".modal-footer").html(html);
        };

        /**
         * Return window body element.
         * @returns {jQuery} The body element
         */
        $this.getBody = function () {
            return $this.window.find(".modal-body");
        };

        /**
         * Show modal window
         */
        $this.show = function () {
            $this.window.modal("show");
        };

        /**
         * Hide modal window
         */
        $this.hide = function () {
            $this.window.modal("hide");
        };

        /**
         * Toggle modal window
         */
        $this.toggle = function () {
            $this.window.modal("toggle");
        };

        $this.selector = "#" + $this.options.id;
        if (!$($this.selector).length) {
            $this.createModal();
        }

        $this.window = $($this.selector);
        $this.setHeader($this.options.header);
    };

    // display modal window after clicking either apical or basolateral membrane
    function modalWindowToAddModels(located_in) {

        console.log("modalWindowToAddModels located_in: ", located_in);

        var membraneName;
        if (located_in == sparqlUtils.apicalID)
            membraneName = "Apical";
        else
            membraneName = "Basolateral";

        var m = new Modal({
            id: "myModal",
            header: "Recommender system",
            footer: "My footer",
            footerCloseButton: "Close",
            footerSaveButton: "Save"
        });

        $("#myModal").modal({backdrop: "static", keyboard: false});
        m.getBody().html("<div id=modalBody></div>");
        m.show();

        miscellaneous.showLoading("#modalBody");

        var query = sparqlUtils.modalWindowToAddModelsSPARQL(located_in);

        ajaxUtils.sendPostRequest(
            sparqlUtils.endpoint,
            query,
            function (jsonRelatedModelEntity) {

                console.log("modalWindowToAddModels jsonRelatedModelEntity: ", jsonRelatedModelEntity, combinedMembrane);
                for (var i = 0; i < jsonRelatedModelEntity.results.bindings.length; i++) {
                    if (!miscellaneous.isExist(jsonRelatedModelEntity.results.bindings[i].modelEntity.value, relatedModelEntity)) {
                        relatedModelEntity.push(jsonRelatedModelEntity.results.bindings[i].modelEntity.value);
                    }
                }

                console.log("modalWindowToAddModels relatedModelEntity: ", relatedModelEntity); // fluxList

                if (relatedModelEntity.length <= 1) {
                    // console.log("fluxList.length <= 1");
                    // make flux in modelEntityObj
                    modelEntityObj.push({
                        "model_entity": relatedModelEntity[0],
                        "model_entity2": ""
                    });

                    console.log("addModels fluxList: ", relatedModelEntity);
                    console.log("addModels cotransporterList: ", cotransporterList);
                    console.log("addModels modelEntityObj: ", modelEntityObj);

                    // 2 for addModels, i.e., add models window without dragging
                    relatedMembraneModel(membraneName, cotransporterList, 2);
                }
                else {
                    for (var i = 0; i < relatedModelEntity.length; i++) {
                        for (var j = i + 1; j < relatedModelEntity.length; j++) {
                            makecotransporter(relatedModelEntity[i], relatedModelEntity[j], relatedModelEntity, membraneName, 2);
                        }
                    }
                }
            }, true);

        jQuery(window).trigger("resize");
    }
};

exports.epithelialPlatform = epithelialPlatform;
/**
 * Created by dsar941 on 5/11/2017.
 */
var epithelialPlatform = function (combinedMembrane, concentration_fma, source_fma, sink_fma,
                                   apicalMembrane, basolateralMembrane, capillaryMembrane, membrane) {

    var relatedModel = [], membraneModelObj = [], alternativeModelObj = [], relatedModelObj = [],
        modelEntityObj = [], membraneModelID = [], proteinName, proteinText, cellmlModel, biological_meaning,
        biological_meaning2, biological_meaning3, speciesName, geneName, idProtein = 0, idAltProtein = 0,
        idMembrane = 0,
        locationOfModel, typeOfModel, cthis, icircleGlobal, organIndex, model_entity, model_entity2, model_entity3,
        relatedModelEntity = [], cotransporterList = [], counter = 0;

    var dx = [], dy = [], dxcircletext = [], dycircletext = [], dxtext = [], dytext = [],
        dxtext2 = [], dytext2 = [], dx1line = [], dy1line = [], dx2line = [], dy2line = [],
        dx1line2 = [], dy1line2 = [], dx2line2 = [], dy2line2 = [], line = [], mindex, id = 0,
        dx1line3 = [], dy1line3 = [], dx2line3 = [], dy2line3 = [], dxtext3 = [], dytext3 = [];

    var i, j, msaveIDflag = false;

    combinedMembrane = processCombinedMembrane(apicalMembrane, basolateralMembrane, capillaryMembrane, membrane, combinedMembrane);
    combinedMembrane = uniqueifyCombinedMembrane(combinedMembrane);

    console.log("epithelialPlatform membrane: ", membrane);
    console.log("epithelialPlatform concentration_fma: ", concentration_fma);
    console.log("epithelialPlatform apicalMembrane: ", apicalMembrane);
    console.log("epithelialPlatform basolateralMembrane: ", basolateralMembrane);
    console.log("epithelialPlatform capillaryMembrane: ", capillaryMembrane);

    console.log("epithelialPlatform combinedMembrane: ", combinedMembrane);

    // making transporters after rediscovering member of a pair
    for (var i = 0; i < combinedMembrane.length; i++) {
        for (var j = i + 1; j < combinedMembrane.length; j++) {
            if (combinedMembrane[i].med_pr == combinedMembrane[j].med_pr && combinedMembrane[i].variable_text2 == "flux") {
                combinedMembrane[i].solute_chebi2 = combinedMembrane[j].solute_chebi;
                combinedMembrane[i].solute_text2 = combinedMembrane[j].solute_text;
                combinedMembrane[i].model_entity2 = combinedMembrane[j].model_entity;
                combinedMembrane[i].variable_text2 = combinedMembrane[j].variable_text;
                combinedMembrane[i].source_fma2 = combinedMembrane[j].source_fma;
                combinedMembrane[i].sink_fma2 = combinedMembrane[j].sink_fma;

                // assign empty string to avoid drawing middle line like NKCC1
                combinedMembrane[i].variable_text3 = "";

                combinedMembrane.splice(j, 1);
                j--;
            }
            else if (combinedMembrane[i].med_pr == combinedMembrane[j].med_pr && combinedMembrane[i].variable_text2 != "flux" && combinedMembrane[i].variable_text2 != "channel") { // NKCC1 tri-transporter
                combinedMembrane[i].solute_chebi3 = combinedMembrane[j].solute_chebi;
                combinedMembrane[i].solute_text3 = combinedMembrane[j].solute_text;
                combinedMembrane[i].model_entity3 = combinedMembrane[j].model_entity;
                combinedMembrane[i].variable_text3 = combinedMembrane[j].variable_text;
                combinedMembrane[i].source_fma3 = combinedMembrane[j].source_fma;
                combinedMembrane[i].sink_fma3 = combinedMembrane[j].sink_fma;

                combinedMembrane.splice(j, 1);
                j--;
            }
        }
    }

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
        if (combinedMembrane[i].med_fma == apicalID)
            lengthOfApicalMem++;
        else if (combinedMembrane[i].med_fma == basolateralID)
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
    svgPlatform(svg, newg, height, width, w, h, markerWidth, markerHeight);

    var solutes = [];

    for (i = 0; i < concentration_fma.length; i++) {

        // luminal(1), cytosol(2), interstitial(3), blood capillary(4), paracellular(5), paracellular2(6)
        console.log("rect: ", $("rect"));
        for (var j = 1; j <= 6; j++) {
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
                .attr("x", 960)
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
                .attr("x", 960)
                .attr("y", 45)
                .text("Basolateral Membrane");

            return "orange";
        })
        .attr("stroke-width", 25)
        .attr("opacity", 0.5);

    var linecapillary = newg.append("line")
        .attr("id", capillaryID)
        .attr("x1", w + 10 + 20)
        .attr("y1", function (d) {
            return d.y + 10;
        })
        .attr("x2", w + 10 + 20)
        .attr("y2", function (d) {
            return d.y + height - 10;
        })
        .attr("stroke", function (d) {
            svg.append("text")
                .style("font", "16px sans-serif")
                .attr("stroke", "darkred")
                .attr("x", 960)
                .attr("y", 195)
                .text("Capillary Membrane")
                .attr("opacity", 0.5);

            return "darkred";
        })
        .attr("stroke-width", 25)
        .attr("opacity", 0.5);

    // Circle and line arrow from lumen to cytosol
    var xrect = $("rect")[0].x.baseVal.value,
        yrect = $("rect")[0].y.baseVal.value;

    // Paracellular membrane
    var xprect = $("rect")[5].x.baseVal.value,
        yprect = $("rect")[5].y.baseVal.value,
        xpvalue = xprect + 10,
        ypvalue = yprect + 25,
        ypdistance = 35;

    var radius = 20,
        lineLen = 50, polygonlineLen = 60, pcellLen = 100,

        xvalue = xrect - lineLen / 2, // x coordinate before epithelial rectangle
        yvalue = yrect + 10 + 50, // initial distance 50
        cxvalue = xrect, cyvalue = yrect + 10 + 50, // initial distance 50
        ydistance = 70,

        yvalueb = yrect + 10 + 50, // initial distance 50 for basoalteral
        cyvalueb = yrect + 10 + 50, // initial distance 50

        yvaluec = yrect + 10 + 50, // initial distance 50 for capillary
        cyvaluec = yrect + 10 + 50, // initial distance 50

        circlewithlineg = [], circlewithtext = [],
        linewithlineg = [], linewithlineg2 = [], linewithlineg3 = [],
        linewithtextg = [], linewithtextg2 = [], linewithtextg3 = [], polygon = [];

    // TODO: does not work for bi-directional arrow, Fix this
    // SVG checkbox with drag on-off
    var checkboxsvg = newg.append("g");

    var checkBox = [], checkedchk = [],
        ydistancechk = 50, yinitialchk = 215, ytextinitialchk = 230;

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
            checkBox[i] = new d3CheckBox();
        }

        for (i = index; i < combinedMembrane.length; i++) {
            // var textvaluechk = combinedMembrane[i].variable_text + " " + combinedMembrane[i].variable_text2;
            var textvaluechk = combinedMembrane[i].med_pr_text,
                indexOfParen = textvaluechk.indexOf("(");
            textvaluechk = textvaluechk.slice(0, indexOfParen - 1) + " (" + combinedMembrane[i].med_pr_text_syn + ")";

            checkBox[i].x(960).y(yinitialchk).checked(false).clickEvent(update);
            checkBox[i].xtext(1000).ytext(ytextinitialchk).text("" + textvaluechk + "");

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
    $(document).on("mousedown", function (event) {
        // console.log("mousedown: ", event.which);

        // 1 => left click, 2 => middle click, 3 => right click
        if (event.which == 2)
            div.style("display", "none");
    });

    // add models without dragging
    $(document).on("click", function (event) {

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
            console.log("event.target.id: ", event.target.id);
            if (event.target.id == apicalID || event.target.id == basolateralID)
                modalWindowToAddModels(event.target.id);
        }
    });

    var tooltipFunc = function (div, id, left, top) {
        div.style("display", "inline");
        div.transition()
            .duration(200)
            .style("opacity", 1);

        // var id = d3.select(this)._groups[0][0].id,
        var indexOfComma = id.indexOf(","),
            tempworkspace = "https://models.physiomeproject.org/workspace/267" + "/" +
                "rawfile" + "/" + "HEAD" + "/" + id.slice(0, indexOfComma);

        div.html(
            "<b>CellML </b> " +
            "<a href=" + tempworkspace + " + target=_blank>" +
            "<img border=0 alt=CellML src=img/cellml.png width=30 height=20></a>" +
            "<br/>" +
            "<b>SEDML </b> " +
            "<a href=" + uriSEDML + " + target=_blank>" +
            "<img border=0 alt=SEDML src=img/SEDML.png width=30 height=20></a>" +
            "<br/>" +
            "<b>Click middle mouse to close</b>")
            .style("left", left + 240 + "px") // 540
            .style("top", top + 90 + "px");
    }

    // apical, basolateral and paracellular membrane
    var combinedMemFunc = function (index, msaveIDflag) {

        console.log("combinedMemFunc: combinedMembrane -> ", combinedMembrane);
        console.log("combinedMemFunc: circlewithlineg -> ", circlewithlineg);

        for (i = index; i < combinedMembrane.length; i++) {
            model_entity = combinedMembrane[i].model_entity;

            if (combinedMembrane[i].model_entity2 != undefined)
                model_entity2 = combinedMembrane[i].model_entity2;
            else model_entity2 = "";

            if (combinedMembrane[i].model_entity3 != undefined)
                model_entity3 = combinedMembrane[i].model_entity3;
            else model_entity3 = "";

            var mediator_fma = combinedMembrane[i].med_fma,
                mediator_pr = combinedMembrane[i].med_pr,
                mediator_pr_text = combinedMembrane[i].med_pr_text,
                mediator_pr_text_syn = combinedMembrane[i].med_pr_text_syn,
                protein_name = combinedMembrane[i].protein_name,

                solute_chebi = combinedMembrane[i].solute_chebi,
                solute_chebi2 = combinedMembrane[i].solute_chebi2,
                solute_chebi3 = combinedMembrane[i].solute_chebi3,
                solute_text = combinedMembrane[i].solute_text,
                solute_text2 = combinedMembrane[i].solute_text2,
                solute_text3 = combinedMembrane[i].solute_text3,

                textvalue = combinedMembrane[i].variable_text,
                textvalue2 = combinedMembrane[i].variable_text2,
                textvalue3 = combinedMembrane[i].variable_text3,
                src_fma = combinedMembrane[i].source_fma,
                src_fma2 = combinedMembrane[i].source_fma2,
                src_fma3 = combinedMembrane[i].source_fma3,
                snk_fma = combinedMembrane[i].sink_fma,
                snk_fma2 = combinedMembrane[i].sink_fma2,
                snk_fma3 = combinedMembrane[i].sink_fma3,
                textWidth = getTextWidth(textvalue, 12),
                tempID;

            if (msaveIDflag == true)
                tempID = icircleGlobal;
            else
                tempID = circlewithlineg.length;

            console.log("combinedMemFunc -> index, icircleGlobal and circlewithlineg: ", index, icircleGlobal, circlewithlineg);

            /*  Apical Membrane */
            if (mediator_fma == apicalID) {
                // case 1
                if ((src_fma == luminalID && snk_fma == cytosolID) &&
                    ((src_fma2 == "" && snk_fma2 == "") || (src_fma2 == luminalID && snk_fma2 == cytosolID))) {

                    console.log("case 1 luminalID ==> cytosolID: ", yvalue, cyvalue);

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

                    if (textvalue3 == "flux") {
                        linewithlineg3[i] = "";
                        linewithtextg3[i] = "";
                        dx1line3[i] = "";
                        dy1line3[i] = "";
                        dx2line3[i] = "";
                        dy2line3[i] = "";
                        dxtext3[i] = "";
                        dytext3[i] = "";
                    }

                    if (mediator_pr == nkcc1) {
                        var lineg3 = lineg.append("g").data([{x: xvalue, y: yvalue + radius}]);
                        linewithlineg3[i] = lineg3.append("line")
                            .attr("id", "linewithlineg3" + tempID)
                            .attr("x1", function (d) {
                                dx1line3[i] = d.x;
                                return d.x;
                            })
                            .attr("y1", function (d) {
                                dy1line3[i] = d.y;
                                return d.y;
                            })
                            .attr("x2", function (d) {
                                dx2line3[i] = d.x + lineLen;
                                return d.x + lineLen;
                            })
                            .attr("y2", function (d) {
                                dy2line3[i] = d.y;
                                return d.y;
                            })
                            .attr("stroke", "black")
                            .attr("stroke-width", 2)
                            .attr("marker-end", "url(#end)")
                            .attr("cursor", "pointer");

                        var linegtext3 = lineg3.append("g").data([{
                            x: xvalue + lineLen + 10, y: yvalue + radius + markerHeight
                        }]);
                        linewithtextg3[i] = linegtext3.append("text")
                            .attr("id", "linewithtextg3" + tempID)
                            .attr("x", function (d) {
                                dxtext3[i] = d.x;
                                return d.x;
                            })
                            .attr("y", function (d) {
                                dytext3[i] = d.y;
                                return d.y;
                            })
                            .attr("font-family", "Times New Roman")
                            .attr("font-size", "12px")
                            .attr("font-weight", "bold")
                            .attr("fill", "red")
                            .attr("cursor", "pointer")
                            .text(solute_text3);
                    }

                    var linegcircle = lineg.append("g").data([{x: cxvalue, y: cyvalue}]);
                    circlewithlineg[i] = linegcircle.append("circle")
                        .attr("id", function (d) {
                            return [
                                model_entity, model_entity2, model_entity3,
                                textvalue, textvalue2, textvalue3,
                                src_fma, snk_fma, src_fma2, snk_fma2, src_fma3, snk_fma3,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_chebi3, solute_text, solute_text2, solute_text3,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
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
                            tooltipFunc(div, d3.select(this)._groups[0][0].id, d3.mouse(this)[0], d3.mouse(this)[1]);
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

                    console.log("case 1 2 luminalID ==> cytosolID: ", yvalue, cyvalue);
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

                    if (textvalue3 == "flux") {
                        linewithlineg3[i] = "";
                        linewithtextg3[i] = "";
                        dx1line3[i] = "";
                        dy1line3[i] = "";
                        dx2line3[i] = "";
                        dy2line3[i] = "";
                        dxtext3[i] = "";
                        dytext3[i] = "";
                    }

                    if (mediator_pr == nkcc1) {
                        var lineg3 = lineg.append("g").data([{x: xvalue, y: yvalue + radius}]);
                        linewithlineg3[i] = lineg3.append("line")
                            .attr("id", "linewithlineg3" + tempID)
                            .attr("x1", function (d) {
                                dx1line3[i] = d.x;
                                return d.x;
                            })
                            .attr("y1", function (d) {
                                dy1line3[i] = d.y;
                                return d.y;
                            })
                            .attr("x2", function (d) {
                                dx2line3[i] = d.x + lineLen;
                                return d.x + lineLen;
                            })
                            .attr("y2", function (d) {
                                dy2line3[i] = d.y;
                                return d.y;
                            })
                            .attr("stroke", "black")
                            .attr("stroke-width", 2)
                            .attr("marker-end", "url(#end)")
                            .attr("cursor", "pointer");

                        var linegtext3 = lineg3.append("g").data([{
                            x: xvalue - textWidth - 10, y: yvalue + radius + markerHeight
                        }]);
                        linewithtextg3[i] = linegtext3.append("text")
                            .attr("id", "linewithtextg3" + tempID)
                            .attr("x", function (d) {
                                dxtext3[i] = d.x;
                                return d.x;
                            })
                            .attr("y", function (d) {
                                dytext3[i] = d.y;
                                return d.y;
                            })
                            .attr("font-family", "Times New Roman")
                            .attr("font-size", "12px")
                            .attr("font-weight", "bold")
                            .attr("fill", "red")
                            .attr("cursor", "pointer")
                            .text(solute_text3);
                    }

                    var linegcircle = lineg.append("g").data([{x: cxvalue, y: cyvalue}]);
                    circlewithlineg[i] = linegcircle.append("circle")
                        .attr("id", function (d) {
                            return [
                                model_entity, model_entity2, model_entity3,
                                textvalue, textvalue2, textvalue3,
                                src_fma, snk_fma, src_fma2, snk_fma2, src_fma3, snk_fma3,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_chebi3, solute_text, solute_text2, solute_text3,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
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
                            tooltipFunc(div, d3.select(this)._groups[0][0].id, d3.mouse(this)[0], d3.mouse(this)[1]);
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

                    if (textvalue3 == "flux") {
                        linewithlineg3[i] = "";
                        linewithtextg3[i] = "";
                        dx1line3[i] = "";
                        dy1line3[i] = "";
                        dx2line3[i] = "";
                        dy2line3[i] = "";
                        dxtext3[i] = "";
                        dytext3[i] = "";
                    }

                    if (mediator_pr == nkcc1) {
                        var lineg3 = lineg.append("g").data([{x: xvalue, y: yvalue + radius}]);
                        linewithlineg3[i] = lineg3.append("line")
                            .attr("id", "linewithlineg3" + tempID)
                            .attr("x1", function (d) {
                                dx1line3[i] = d.x;
                                return d.x;
                            })
                            .attr("y1", function (d) {
                                dy1line3[i] = d.y;
                                return d.y;
                            })
                            .attr("x2", function (d) {
                                dx2line3[i] = d.x + lineLen;
                                return d.x + lineLen;
                            })
                            .attr("y2", function (d) {
                                dy2line3[i] = d.y;
                                return d.y;
                            })
                            .attr("stroke", "black")
                            .attr("stroke-width", 2)
                            .attr("marker-start", "url(#start)")
                            .attr("cursor", "pointer");

                        var linegtext3 = lineg3.append("g").data([{
                            x: xvalue - textWidth - 10, y: yvalue + radius + markerHeight
                        }]);
                        linewithtextg3[i] = linegtext3.append("text")
                            .attr("id", "linewithtextg3" + tempID)
                            .attr("x", function (d) {
                                dxtext3[i] = d.x;
                                return d.x;
                            })
                            .attr("y", function (d) {
                                dytext3[i] = d.y;
                                return d.y;
                            })
                            .attr("font-family", "Times New Roman")
                            .attr("font-size", "12px")
                            .attr("font-weight", "bold")
                            .attr("fill", "red")
                            .attr("cursor", "pointer")
                            .text(solute_text3);
                    }

                    var linegcircle = lineg.append("g").data([{x: cxvalue, y: cyvalue}]);
                    circlewithlineg[i] = linegcircle.append("circle")
                        .attr("id", function (d) {
                            return [
                                model_entity, model_entity2, model_entity3,
                                textvalue, textvalue2, textvalue3,
                                src_fma, snk_fma, src_fma2, snk_fma2, src_fma3, snk_fma3,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_chebi3, solute_text, solute_text2, solute_text3,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
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
                            tooltipFunc(div, d3.select(this)._groups[0][0].id, d3.mouse(this)[0], d3.mouse(this)[1]);
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

                    if (textvalue3 == "flux") {
                        linewithlineg3[i] = "";
                        linewithtextg3[i] = "";
                        dx1line3[i] = "";
                        dy1line3[i] = "";
                        dx2line3[i] = "";
                        dy2line3[i] = "";
                        dxtext3[i] = "";
                        dytext3[i] = "";
                    }

                    if (mediator_pr == nkcc1) {
                        var lineg3 = lineg.append("g").data([{x: xvalue, y: yvalue + radius}]);
                        linewithlineg3[i] = lineg3.append("line")
                            .attr("id", "linewithlineg3" + tempID)
                            .attr("x1", function (d) {
                                dx1line3[i] = d.x;
                                return d.x;
                            })
                            .attr("y1", function (d) {
                                dy1line3[i] = d.y;
                                return d.y;
                            })
                            .attr("x2", function (d) {
                                dx2line3[i] = d.x + lineLen;
                                return d.x + lineLen;
                            })
                            .attr("y2", function (d) {
                                dy2line3[i] = d.y;
                                return d.y;
                            })
                            .attr("stroke", "black")
                            .attr("stroke-width", 2)
                            .attr("marker-end", "url(#end)")
                            .attr("cursor", "pointer");

                        var linegtext3 = lineg3.append("g").data([{
                            x: xvalue + lineLen + 10, y: yvalue + radius + markerHeight
                        }]);
                        linewithtextg3[i] = linegtext3.append("text")
                            .attr("id", "linewithtextg3" + tempID)
                            .attr("x", function (d) {
                                dxtext3[i] = d.x;
                                return d.x;
                            })
                            .attr("y", function (d) {
                                dytext3[i] = d.y;
                                return d.y;
                            })
                            .attr("font-family", "Times New Roman")
                            .attr("font-size", "12px")
                            .attr("font-weight", "bold")
                            .attr("fill", "red")
                            .attr("cursor", "pointer")
                            .text(solute_text3);
                    }

                    var linegcircle = lineg.append("g").data([{x: cxvalue, y: cyvalue}]);
                    circlewithlineg[i] = linegcircle.append("circle")
                        .attr("id", function (d) {
                            return [
                                model_entity, model_entity2, model_entity3,
                                textvalue, textvalue2, textvalue3,
                                src_fma, snk_fma, src_fma2, snk_fma2, src_fma3, snk_fma3,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_chebi3, solute_text, solute_text2, solute_text3,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
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
                            tooltipFunc(div, d3.select(this)._groups[0][0].id, d3.mouse(this)[0], d3.mouse(this)[1]);
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
                if ((src_fma == luminalID && snk_fma == cytosolID) && (textvalue2 == "channel")) {
                    console.log("case 5 cytosolID ==> luminalID and channel: ", yvalue, cyvalue);

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
                                model_entity, model_entity2, model_entity3,
                                textvalue, textvalue2, textvalue3,
                                src_fma, snk_fma, src_fma2, snk_fma2, src_fma3, snk_fma3,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_chebi3, solute_text, solute_text2, solute_text3,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
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
                            tooltipFunc(div, d3.select(this)._groups[0][0].id, d3.mouse(this)[0], d3.mouse(this)[1]);
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

                    linewithlineg3[i] = "";
                    linewithtextg3[i] = "";
                    dx1line3[i] = "";
                    dy1line3[i] = "";
                    dx2line3[i] = "";
                    dy2line3[i] = "";
                    dxtext3[i] = "";
                    dytext3[i] = "";

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

                    console.log("case 5 2 cytosolID ==> luminalID and channel: ", yvalue, cyvalue);
                }

                // case 6
                if ((src_fma == cytosolID && snk_fma == luminalID) && (textvalue2 == "channel")) {

                    console.log("case 6 cytosolID ==> luminalID and channel: ", yvalue, cyvalue);

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
                                model_entity, model_entity2, model_entity3,
                                textvalue, textvalue2, textvalue3,
                                src_fma, snk_fma, src_fma2, snk_fma2, src_fma3, snk_fma3,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_chebi3, solute_text, solute_text2, solute_text3,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
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
                            tooltipFunc(div, d3.select(this)._groups[0][0].id, d3.mouse(this)[0], d3.mouse(this)[1]);
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

                    linewithlineg3[i] = "";
                    linewithtextg3[i] = "";
                    dx1line3[i] = "";
                    dy1line3[i] = "";
                    dx2line3[i] = "";
                    dy2line3[i] = "";
                    dxtext3[i] = "";
                    dytext3[i] = "";

                    if (msaveIDflag == true) {
                        msaveIDflag = false;
                        break;
                    }

                    // increment y-axis of line and circle
                    yvalue += ydistance;
                    cyvalue += ydistance;

                    console.log("case 6 2 cytosolID ==> luminalID and channel: ", yvalue, cyvalue);
                }
            }

            /*  Basolateral Membrane */
            if (mediator_fma == basolateralID) {
                // case 1
                if ((src_fma == cytosolID && snk_fma == interstitialID) &&
                    (((src_fma2 == "" && snk_fma2 == "") && (src_fma3 == "" && snk_fma3 == "")) || (src_fma2 == cytosolID && snk_fma2 == interstitialID))) {

                    console.log("case 1 cytosolID ==> interstitialID: ", yvalueb, cyvalueb);

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

                    if (textvalue3 == "flux") {
                        linewithlineg3[i] = "";
                        linewithtextg3[i] = "";
                        dx1line3[i] = "";
                        dy1line3[i] = "";
                        dx2line3[i] = "";
                        dy2line3[i] = "";
                        dxtext3[i] = "";
                        dytext3[i] = "";
                    }

                    if (mediator_pr == nkcc1) {
                        var lineg3 = lineg.append("g").data([{x: xvalue + width, y: yvalueb + radius}]);
                        linewithlineg3[i] = lineg3.append("line")
                            .attr("id", "linewithlineg3" + tempID)
                            .attr("x1", function (d) {
                                dx1line3[i] = d.x;
                                return d.x;
                            })
                            .attr("y1", function (d) {
                                dy1line3[i] = d.y;
                                return d.y;
                            })
                            .attr("x2", function (d) {
                                dx2line3[i] = d.x + lineLen;
                                return d.x + lineLen;
                            })
                            .attr("y2", function (d) {
                                dy2line3[i] = d.y;
                                return d.y;
                            })
                            .attr("stroke", "black")
                            .attr("stroke-width", 2)
                            .attr("marker-end", "url(#end)")
                            .attr("cursor", "pointer");

                        var linegtext3 = lineg3.append("g").data([{
                            x: xvalue + lineLen + 10 + width, y: yvalueb + radius + markerHeight
                        }]);
                        linewithtextg3[i] = linegtext3.append("text")
                            .attr("id", "linewithtextg3" + tempID)
                            .attr("x", function (d) {
                                dxtext3[i] = d.x;
                                return d.x;
                            })
                            .attr("y", function (d) {
                                dytext3[i] = d.y;
                                return d.y;
                            })
                            .attr("font-family", "Times New Roman")
                            .attr("font-size", "12px")
                            .attr("font-weight", "bold")
                            .attr("fill", "red")
                            .attr("cursor", "pointer")
                            .text(solute_text3);
                    }

                    var linegcircle = lineg.append("g").data([{x: cxvalue + width, y: cyvalueb}]);
                    circlewithlineg[i] = linegcircle.append("circle")
                        .attr("id", function (d) {
                            return [
                                model_entity, model_entity2, model_entity3,
                                textvalue, textvalue2, textvalue3,
                                src_fma, snk_fma, src_fma2, snk_fma2, src_fma3, snk_fma3,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_chebi3, solute_text, solute_text2, solute_text3,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
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
                            tooltipFunc(div, d3.select(this)._groups[0][0].id, d3.mouse(this)[0], d3.mouse(this)[1]);
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

                    console.log("case 1 2 cytosolID ==> interstitialID: ", yvalueb, cyvalueb);
                }

                // case 2
                if ((src_fma == interstitialID && snk_fma == cytosolID) &&
                    ((src_fma2 == "" && snk_fma2 == "") || (src_fma2 == interstitialID && snk_fma2 == cytosolID))) {

                    // line 1
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

                    // line 3
                    if (textvalue3 == "flux") {
                        linewithlineg3[i] = "";
                        linewithtextg3[i] = "";
                        dx1line3[i] = "";
                        dy1line3[i] = "";
                        dx2line3[i] = "";
                        dy2line3[i] = "";
                        dxtext3[i] = "";
                        dytext3[i] = "";
                    }

                    if (mediator_pr == nkcc1) {
                        var lineg3 = lineg.append("g").data([{x: xvalue + width, y: yvalueb + radius}]);
                        linewithlineg3[i] = lineg3.append("line")
                            .attr("id", "linewithlineg3" + tempID)
                            .attr("x1", function (d) {
                                dx1line3[i] = d.x;
                                return d.x;
                            })
                            .attr("y1", function (d) {
                                dy1line3[i] = d.y;
                                return d.y;
                            })
                            .attr("x2", function (d) {
                                dx2line3[i] = d.x + lineLen;
                                return d.x + lineLen;
                            })
                            .attr("y2", function (d) {
                                dy2line3[i] = d.y;
                                return d.y;
                            })
                            .attr("stroke", "black")
                            .attr("stroke-width", 2)
                            .attr("marker-start", "url(#start)")
                            .attr("cursor", "pointer");

                        var linegtext3 = lineg3.append("g").data([{
                            x: xvalue - textWidth - 10 + width, y: yvalueb + radius + markerHeight
                        }]);
                        linewithtextg3[i] = linegtext3.append("text")
                            .attr("id", "linewithtextg3" + tempID)
                            .attr("x", function (d) {
                                dxtext3[i] = d.x;
                                return d.x;
                            })
                            .attr("y", function (d) {
                                dytext3[i] = d.y;
                                return d.y;
                            })
                            .attr("font-family", "Times New Roman")
                            .attr("font-size", "12px")
                            .attr("font-weight", "bold")
                            .attr("fill", "red")
                            .attr("cursor", "pointer")
                            .text(solute_text3);
                    }

                    // circle
                    var linegcircle = lineg.append("g").data([{x: cxvalue + width, y: cyvalueb}]);
                    circlewithlineg[i] = linegcircle.append("circle")
                        .attr("id", function (d) {
                            return [
                                model_entity, model_entity2, model_entity3,
                                textvalue, textvalue2, textvalue3,
                                src_fma, snk_fma, src_fma2, snk_fma2, src_fma3, snk_fma3,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_chebi3, solute_text, solute_text2, solute_text3,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
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
                            tooltipFunc(div, d3.select(this)._groups[0][0].id, d3.mouse(this)[0], d3.mouse(this)[1]);
                            s
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

                    // line 2
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

                    if (textvalue3 == "flux") {
                        linewithlineg3[i] = "";
                        linewithtextg3[i] = "";
                        dx1line3[i] = "";
                        dy1line3[i] = "";
                        dx2line3[i] = "";
                        dy2line3[i] = "";
                        dxtext3[i] = "";
                        dytext3[i] = "";
                    }

                    if (mediator_pr == nkcc1) {
                        var lineg3 = lineg.append("g").data([{x: xvalue + width, y: yvalueb + radius}]);
                        linewithlineg3[i] = lineg3.append("line")
                            .attr("id", "linewithlineg3" + tempID)
                            .attr("x1", function (d) {
                                dx1line3[i] = d.x;
                                return d.x;
                            })
                            .attr("y1", function (d) {
                                dy1line3[i] = d.y;
                                return d.y;
                            })
                            .attr("x2", function (d) {
                                dx2line3[i] = d.x + lineLen;
                                return d.x + lineLen;
                            })
                            .attr("y2", function (d) {
                                dy2line3[i] = d.y;
                                return d.y;
                            })
                            .attr("stroke", "black")
                            .attr("stroke-width", 2)
                            .attr("marker-start", "url(#start)")
                            .attr("cursor", "pointer");

                        var linegtext3 = lineg3.append("g").data([{
                            x: xvalue - 30 + width, y: yvalueb + radius + markerHeight
                        }]);
                        linewithtextg3[i] = linegtext3.append("text")
                            .attr("id", "linewithtextg3" + tempID)
                            .attr("x", function (d) {
                                dxtext3[i] = d.x;
                                return d.x;
                            })
                            .attr("y", function (d) {
                                dytext3[i] = d.y;
                                return d.y;
                            })
                            .attr("font-family", "Times New Roman")
                            .attr("font-size", "12px")
                            .attr("font-weight", "bold")
                            .attr("fill", "red")
                            .attr("cursor", "pointer")
                            .text(solute_text3);
                    }

                    var linegcircle = lineg.append("g").data([{x: cxvalue + width, y: cyvalueb}]);
                    circlewithlineg[i] = linegcircle.append("circle")
                        .attr("id", function (d) {
                            return [
                                model_entity, model_entity2, model_entity3,
                                textvalue, textvalue2, textvalue3,
                                src_fma, snk_fma, src_fma2, snk_fma2, src_fma3, snk_fma3,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_chebi3, solute_text, solute_text2, solute_text3,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
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
                            tooltipFunc(div, d3.select(this)._groups[0][0].id, d3.mouse(this)[0], d3.mouse(this)[1]);
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

                    if (textvalue3 == "flux") {
                        linewithlineg3[i] = "";
                        linewithtextg3[i] = "";
                        dx1line3[i] = "";
                        dy1line3[i] = "";
                        dx2line3[i] = "";
                        dy2line3[i] = "";
                        dxtext3[i] = "";
                        dytext3[i] = "";
                    }

                    if (mediator_pr == nkcc1) {
                        var lineg3 = lineg.append("g").data([{x: xvalue + width, y: yvalueb + radius}]);
                        linewithlineg3[i] = lineg3.append("line")
                            .attr("id", "linewithlineg3" + tempID)
                            .attr("x1", function (d) {
                                dx1line3[i] = d.x;
                                return d.x;
                            })
                            .attr("y1", function (d) {
                                dy1line3[i] = d.y;
                                return d.y;
                            })
                            .attr("x2", function (d) {
                                dx2line3[i] = d.x + lineLen;
                                return d.x + lineLen;
                            })
                            .attr("y2", function (d) {
                                dy2line3[i] = d.y;
                                return d.y;
                            })
                            .attr("stroke", "black")
                            .attr("stroke-width", 2)
                            .attr("marker-end", "url(#end)")
                            .attr("cursor", "pointer");

                        var linegtext3 = lineg3.append("g").data([{
                            x: xvalue + lineLen + 10 + width, y: yvalueb + radius + markerHeight
                        }]);
                        linewithtextg3[i] = linegtext3.append("text")
                            .attr("id", "linewithtextg3" + tempID)
                            .attr("x", function (d) {
                                dxtext3[i] = d.x;
                                return d.x;
                            })
                            .attr("y", function (d) {
                                dytext3[i] = d.y;
                                return d.y;
                            })
                            .attr("font-family", "Times New Roman")
                            .attr("font-size", "12px")
                            .attr("font-weight", "bold")
                            .attr("fill", "red")
                            .attr("cursor", "pointer")
                            .text(solute_text3);
                    }

                    var linegcircle = lineg.append("g").data([{x: cxvalue + width, y: cyvalueb}]);
                    circlewithlineg[i] = linegcircle.append("circle")
                        .attr("id", function (d) {
                            return [
                                model_entity, model_entity2, model_entity3,
                                textvalue, textvalue2, textvalue3,
                                src_fma, snk_fma, src_fma2, snk_fma2, src_fma3, snk_fma3,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_chebi3, solute_text, solute_text2, solute_text3,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
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
                            tooltipFunc(div, d3.select(this)._groups[0][0].id, d3.mouse(this)[0], d3.mouse(this)[1]);
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
                if ((src_fma == cytosolID && snk_fma == interstitialID) && (textvalue2 == "channel")) {

                    console.log("case 5 cytosolID ==> interstitialID and channel: ", yvalueb, cyvalueb);

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
                                model_entity, model_entity2, model_entity3,
                                textvalue, textvalue2, textvalue3,
                                src_fma, snk_fma, src_fma2, snk_fma2, src_fma3, snk_fma3,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_chebi3, solute_text, solute_text2, solute_text3,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
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
                            tooltipFunc(div, d3.select(this)._groups[0][0].id, d3.mouse(this)[0], d3.mouse(this)[1]);
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

                    linewithlineg3[i] = "";
                    linewithtextg3[i] = "";
                    dx1line3[i] = "";
                    dy1line3[i] = "";
                    dx2line3[i] = "";
                    dy2line3[i] = "";
                    dxtext3[i] = "";
                    dytext3[i] = "";

                    if (msaveIDflag == true) {
                        msaveIDflag = false;
                        break;
                    }

                    // increment y-axis of line and circle
                    yvalueb += ydistance;
                    cyvalueb += ydistance;

                    console.log("case 5 2 cytosolID ==> interstitialID and channel: ", yvalueb, cyvalueb);
                }

                // case 6
                if ((src_fma == interstitialID && snk_fma == cytosolID) && (textvalue2 == "channel")) {

                    console.log("case 6 cytosolID ==> interstitialID and channel: ", yvalueb, cyvalueb);

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
                                model_entity, model_entity2, model_entity3,
                                textvalue, textvalue2, textvalue3,
                                src_fma, snk_fma, src_fma2, snk_fma2, src_fma3, snk_fma3,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_chebi3, solute_text, solute_text2, solute_text3,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
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
                            tooltipFunc(div, d3.select(this)._groups[0][0].id, d3.mouse(this)[0], d3.mouse(this)[1]);
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

                    linewithlineg3[i] = "";
                    linewithtextg3[i] = "";
                    dx1line3[i] = "";
                    dy1line3[i] = "";
                    dx2line3[i] = "";
                    dy2line3[i] = "";
                    dxtext3[i] = "";
                    dytext3[i] = "";

                    if (msaveIDflag == true) {
                        msaveIDflag = false;
                        break;
                    }

                    // increment y-axis of line and circle
                    yvalueb += ydistance;
                    cyvalueb += ydistance;

                    console.log("case 6 2 cytosolID ==> interstitialID and channel: ", yvalueb, cyvalueb);
                }
            }

            /*  Capillary Membrane */
            if (mediator_fma == capillaryID) {
                // case 1
                if ((src_fma == interstitialID && snk_fma == bloodCapillary) &&
                    ((src_fma2 == "" && snk_fma2 == "") || (src_fma2 == interstitialID && snk_fma2 == bloodCapillary))) {

                    console.log("case 1 cytosolID ==> interstitialID: ", yvalueb, cyvalueb);

                    var lineg = newg.append("g").data([{
                        x: xvalue + width + (w - (w / 3 + width + 30)) + 40 + 20,
                        y: yvaluec
                    }]);
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

                    var linegtext = lineg.append("g").data([{
                        x: xvalue + lineLen + 10 + width + (w - (w / 3 + width + 30)) + 40 + 20,
                        y: yvaluec + 5
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
                        .attr("font-size", "12px")
                        .attr("font-weight", "bold")
                        .attr("fill", "red")
                        .attr("cursor", "pointer")
                        .text(solute_text);

                    if (textvalue3 == "flux") {
                        linewithlineg3[i] = "";
                        linewithtextg3[i] = "";
                        dx1line3[i] = "";
                        dy1line3[i] = "";
                        dx2line3[i] = "";
                        dy2line3[i] = "";
                        dxtext3[i] = "";
                        dytext3[i] = "";
                    }

                    if (mediator_pr == nkcc1) {
                        var lineg3 = lineg.append("g").data([{
                            x: xvalue + width + (w - (w / 3 + width + 30)) + 40 + 20,
                            y: yvaluec + radius
                        }]);
                        linewithlineg3[i] = lineg3.append("line")
                            .attr("id", "linewithlineg3" + tempID)
                            .attr("x1", function (d) {
                                dx1line3[i] = d.x;
                                return d.x;
                            })
                            .attr("y1", function (d) {
                                dy1line3[i] = d.y;
                                return d.y;
                            })
                            .attr("x2", function (d) {
                                dx2line3[i] = d.x + lineLen;
                                return d.x + lineLen;
                            })
                            .attr("y2", function (d) {
                                dy2line3[i] = d.y;
                                return d.y;
                            })
                            .attr("stroke", "black")
                            .attr("stroke-width", 2)
                            .attr("marker-end", "url(#end)")
                            .attr("cursor", "pointer");

                        var linegtext3 = lineg3.append("g").data([{
                            x: xvalue + lineLen + 10 + width + (w - (w / 3 + width + 30)) + 40 + 20,
                            y: yvaluec + radius + markerHeight
                        }]);
                        linewithtextg3[i] = linegtext3.append("text")
                            .attr("id", "linewithtextg3" + tempID)
                            .attr("x", function (d) {
                                dxtext3[i] = d.x;
                                return d.x;
                            })
                            .attr("y", function (d) {
                                dytext3[i] = d.y;
                                return d.y;
                            })
                            .attr("font-family", "Times New Roman")
                            .attr("font-size", "12px")
                            .attr("font-weight", "bold")
                            .attr("fill", "red")
                            .attr("cursor", "pointer")
                            .text(solute_text3);
                    }

                    var linegcircle = lineg.append("g").data([{
                        x: cxvalue + width + (w - (w / 3 + width + 30)) + 40 + 20,
                        y: cyvaluec
                    }]);
                    circlewithlineg[i] = linegcircle.append("circle")
                        .attr("id", function (d) {
                            return [
                                model_entity, model_entity2, model_entity3,
                                textvalue, textvalue2, textvalue3,
                                src_fma, snk_fma, src_fma2, snk_fma2, src_fma3, snk_fma3,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_chebi3, solute_text, solute_text2, solute_text3,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
                            ];
                        })
                        .attr("index", tempID)
                        .attr("membrane", capillaryID)
                        .attr("cx", function (d) {
                            dx[i] = d.x;
                            return d.x;
                        })
                        .attr("cy", function (d) {
                            dy[i] = d.y + radius;
                            return d.y + radius;
                        })
                        .attr("r", radius)
                        .attr("fill", "darkred")
                        .attr("opacity", 0.6)
                        .attr("stroke-width", 20)
                        .attr("cursor", "move")
                        .on("mouseover", function () {
                            tooltipFunc(div, d3.select(this)._groups[0][0].id, d3.mouse(this)[0], d3.mouse(this)[1]);
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
                        .attr("fill", "white")
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
                        var lineg2 = lineg.append("g").data([{
                            x: xvalue + width + (w - (w / 3 + width + 30)) + 40 + 20,
                            y: yvaluec + radius * 2
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
                            x: xvalue + lineLen + 10 + width + (w - (w / 3 + width + 30)) + 40 + 20,
                            y: yvaluec + radius * 2 + markerHeight
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
                    yvaluec += ydistance;
                    cyvaluec += ydistance;

                    console.log("case 1 2 cytosolID ==> interstitialID: ", yvaluec, cyvaluec);
                }

                // case 2
                if ((src_fma == bloodCapillary && snk_fma == interstitialID) &&
                    ((src_fma2 == "" && snk_fma2 == "") || (src_fma2 == bloodCapillary && snk_fma2 == interstitialID))) {
                    var lineg = newg.append("g").data([{
                        x: xvalue + width + (w - (w / 3 + width + 30)) + 40 + 20,
                        y: yvaluec
                    }]);
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

                    var linegtext = lineg.append("g").data([{
                        x: xvalue - 30 + width + (w - (w / 3 + width + 30)) + 40 + 20,
                        y: yvaluec + 5
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
                        .attr("font-size", "12px")
                        .attr("font-weight", "bold")
                        .attr("fill", "red")
                        .attr("cursor", "pointer")
                        .text(solute_text);

                    if (textvalue3 == "flux") {
                        linewithlineg3[i] = "";
                        linewithtextg3[i] = "";
                        dx1line3[i] = "";
                        dy1line3[i] = "";
                        dx2line3[i] = "";
                        dy2line3[i] = "";
                        dxtext3[i] = "";
                        dytext3[i] = "";
                    }

                    if (mediator_pr == nkcc1) {
                        var lineg3 = lineg.append("g").data([{
                            x: xvalue + width + (w - (w / 3 + width + 30)) + 40 + 20,
                            y: yvaluec + radius
                        }]);
                        linewithlineg3[i] = lineg3.append("line")
                            .attr("id", "linewithlineg3" + tempID)
                            .attr("x1", function (d) {
                                dx1line3[i] = d.x;
                                return d.x;
                            })
                            .attr("y1", function (d) {
                                dy1line3[i] = d.y;
                                return d.y;
                            })
                            .attr("x2", function (d) {
                                dx2line3[i] = d.x + lineLen;
                                return d.x + lineLen;
                            })
                            .attr("y2", function (d) {
                                dy2line3[i] = d.y;
                                return d.y;
                            })
                            .attr("stroke", "black")
                            .attr("stroke-width", 2)
                            .attr("marker-start", "url(#start)")
                            .attr("cursor", "pointer");

                        var linegtext3 = lineg3.append("g").data([{
                            x: xvalue - textWidth - 10 + width + (w - (w / 3 + width + 30)) + 40 + 20,
                            y: yvaluec + radius + markerHeight
                        }]);
                        linewithtextg3[i] = linegtext3.append("text")
                            .attr("id", "linewithtextg3" + tempID)
                            .attr("x", function (d) {
                                dxtext3[i] = d.x;
                                return d.x;
                            })
                            .attr("y", function (d) {
                                dytext3[i] = d.y;
                                return d.y;
                            })
                            .attr("font-family", "Times New Roman")
                            .attr("font-size", "12px")
                            .attr("font-weight", "bold")
                            .attr("fill", "red")
                            .attr("cursor", "pointer")
                            .text(solute_text3);
                    }

                    var linegcircle = lineg.append("g").data([{
                        x: cxvalue + width + (w - (w / 3 + width + 30)) + 40 + 20,
                        y: cyvaluec
                    }]);
                    circlewithlineg[i] = linegcircle.append("circle")
                        .attr("id", function (d) {
                            return [
                                model_entity, model_entity2, model_entity3,
                                textvalue, textvalue2, textvalue3,
                                src_fma, snk_fma, src_fma2, snk_fma2, src_fma3, snk_fma3,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_chebi3, solute_text, solute_text2, solute_text3,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
                            ];
                        })
                        .attr("index", tempID)
                        .attr("membrane", capillaryID)
                        .attr("cx", function (d) {
                            dx[i] = d.x;
                            return d.x;
                        })
                        .attr("cy", function (d) {
                            dy[i] = d.y + radius;
                            return d.y + radius;
                        })
                        .attr("r", radius)
                        .attr("fill", "darkred")
                        .attr("opacity", 0.6)
                        .attr("stroke-width", 20)
                        .attr("cursor", "move")
                        .on("mouseover", function () {
                            tooltipFunc(div, d3.select(this)._groups[0][0].id, d3.mouse(this)[0], d3.mouse(this)[1]);
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
                        .attr("fill", "white")
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
                        var lineg2 = lineg.append("g").data([{
                            x: xvalue + width + (w - (w / 3 + width + 30)) + 40 + 20,
                            y: yvaluec + radius * 2
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
                            x: xvalue - textWidth - 10 + width + (w - (w / 3 + width + 30)) + 40 + 20,
                            y: yvaluec + radius * 2 + markerHeight
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
                    yvaluec += ydistance;
                    cyvaluec += ydistance;
                }

                // case 3
                if ((src_fma == interstitialID && snk_fma == bloodCapillary) && (src_fma2 == bloodCapillary && snk_fma2 == interstitialID)) {
                    var lineg = newg.append("g").data([{
                        x: xvalue + width + (w - (w / 3 + width + 30)) + 40 + 20,
                        y: yvaluec
                    }]);
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

                    var linegtext = lineg.append("g").data([{
                        x: xvalue + lineLen + 10 + width + (w - (w / 3 + width + 30)) + 40 + 20,
                        y: yvaluec + 5
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
                        .attr("font-size", "12px")
                        .attr("font-weight", "bold")
                        .attr("fill", "red")
                        .attr("cursor", "pointer")
                        .text(solute_text);

                    if (textvalue3 == "flux") {
                        linewithlineg3[i] = "";
                        linewithtextg3[i] = "";
                        dx1line3[i] = "";
                        dy1line3[i] = "";
                        dx2line3[i] = "";
                        dy2line3[i] = "";
                        dxtext3[i] = "";
                        dytext3[i] = "";
                    }

                    if (mediator_pr == nkcc1) {
                        var lineg3 = lineg.append("g").data([{
                            x: xvalue + width + (w - (w / 3 + width + 30)) + 40 + 20,
                            y: yvaluec + radius
                        }]);
                        linewithlineg3[i] = lineg3.append("line")
                            .attr("id", "linewithlineg3" + tempID)
                            .attr("x1", function (d) {
                                dx1line3[i] = d.x;
                                return d.x;
                            })
                            .attr("y1", function (d) {
                                dy1line3[i] = d.y;
                                return d.y;
                            })
                            .attr("x2", function (d) {
                                dx2line3[i] = d.x + lineLen;
                                return d.x + lineLen;
                            })
                            .attr("y2", function (d) {
                                dy2line3[i] = d.y;
                                return d.y;
                            })
                            .attr("stroke", "black")
                            .attr("stroke-width", 2)
                            .attr("marker-start", "url(#start)")
                            .attr("cursor", "pointer");

                        var linegtext3 = lineg3.append("g").data([{
                            x: xvalue - 30 + width + (w - (w / 3 + width + 30)) + 40 + 20,
                            y: yvaluec + radius + markerHeight
                        }]);
                        linewithtextg3[i] = linegtext3.append("text")
                            .attr("id", "linewithtextg3" + tempID)
                            .attr("x", function (d) {
                                dxtext3[i] = d.x;
                                return d.x;
                            })
                            .attr("y", function (d) {
                                dytext3[i] = d.y;
                                return d.y;
                            })
                            .attr("font-family", "Times New Roman")
                            .attr("font-size", "12px")
                            .attr("font-weight", "bold")
                            .attr("fill", "red")
                            .attr("cursor", "pointer")
                            .text(solute_text3);
                    }

                    var linegcircle = lineg.append("g").data([{
                        x: cxvalue + width + (w - (w / 3 + width + 30)) + 40 + 20,
                        y: cyvaluec
                    }]);
                    circlewithlineg[i] = linegcircle.append("circle")
                        .attr("id", function (d) {
                            return [
                                model_entity, model_entity2, model_entity3,
                                textvalue, textvalue2, textvalue3,
                                src_fma, snk_fma, src_fma2, snk_fma2, src_fma3, snk_fma3,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_chebi3, solute_text, solute_text2, solute_text3,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
                            ];
                        })
                        .attr("index", tempID)
                        .attr("membrane", capillaryID)
                        .attr("cx", function (d) {
                            dx[i] = d.x;
                            return d.x;
                        })
                        .attr("cy", function (d) {
                            dy[i] = d.y + radius;
                            return d.y + radius;
                        })
                        .attr("r", radius)
                        .attr("fill", "darkred")
                        .attr("opacity", 0.6)
                        .attr("stroke-width", 20)
                        .attr("cursor", "move")
                        .on("mouseover", function () {
                            tooltipFunc(div, d3.select(this)._groups[0][0].id, d3.mouse(this)[0], d3.mouse(this)[1]);
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
                        .attr("fill", "white")
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
                        var lineg2 = lineg.append("g").data([{
                            x: xvalue + width + (w - (w / 3 + width + 30)) + 40 + 20,
                            y: yvaluec + radius * 2
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
                            x: xvalue - 30 + width + (w - (w / 3 + width + 30)) + 40 + 20,
                            y: yvaluec + radius * 2 + markerHeight
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
                    yvaluec += ydistance;
                    cyvaluec += ydistance;
                }

                // case 4
                if ((src_fma == bloodCapillary && snk_fma == interstitialID) && (src_fma2 == interstitialID && snk_fma2 == bloodCapillary)) {
                    var lineg = newg.append("g").data([{
                        x: xvalue + width + (w - (w / 3 + width + 30)) + 40 + 20,
                        y: yvaluec
                    }]);
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

                    var linegtext = lineg.append("g").data([{
                        x: xvalue - 30 + width + (w - (w / 3 + width + 30)) + 40 + 20,
                        y: yvaluec + 5
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
                        .attr("font-size", "12px")
                        .attr("font-weight", "bold")
                        .attr("fill", "red")
                        .attr("cursor", "pointer")
                        .text(solute_text);

                    if (textvalue3 == "flux") {
                        linewithlineg3[i] = "";
                        linewithtextg3[i] = "";
                        dx1line3[i] = "";
                        dy1line3[i] = "";
                        dx2line3[i] = "";
                        dy2line3[i] = "";
                        dxtext3[i] = "";
                        dytext3[i] = "";
                    }

                    if (mediator_pr == nkcc1) {
                        var lineg3 = lineg.append("g").data([{
                            x: xvalue + width + (w - (w / 3 + width + 30)) + 40 + 20,
                            y: yvaluec + radius
                        }]);
                        linewithlineg3[i] = lineg3.append("line")
                            .attr("id", "linewithlineg3" + tempID)
                            .attr("x1", function (d) {
                                dx1line3[i] = d.x;
                                return d.x;
                            })
                            .attr("y1", function (d) {
                                dy1line3[i] = d.y;
                                return d.y;
                            })
                            .attr("x2", function (d) {
                                dx2line3[i] = d.x + lineLen;
                                return d.x + lineLen;
                            })
                            .attr("y2", function (d) {
                                dy2line3[i] = d.y;
                                return d.y;
                            })
                            .attr("stroke", "black")
                            .attr("stroke-width", 2)
                            .attr("marker-end", "url(#end)")
                            .attr("cursor", "pointer");

                        var linegtext3 = lineg3.append("g").data([{
                            x: xvalue + lineLen + 10 + width + (w - (w / 3 + width + 30)) + 40 + 20,
                            y: yvaluec + radius + markerHeight
                        }]);
                        linewithtextg3[i] = linegtext3.append("text")
                            .attr("id", "linewithtextg3" + tempID)
                            .attr("x", function (d) {
                                dxtext3[i] = d.x;
                                return d.x;
                            })
                            .attr("y", function (d) {
                                dytext3[i] = d.y;
                                return d.y;
                            })
                            .attr("font-family", "Times New Roman")
                            .attr("font-size", "12px")
                            .attr("font-weight", "bold")
                            .attr("fill", "red")
                            .attr("cursor", "pointer")
                            .text(solute_text3);
                    }

                    var linegcircle = lineg.append("g").data([{
                        x: cxvalue + width + (w - (w / 3 + width + 30)) + 40 + 20,
                        y: cyvaluec
                    }]);
                    circlewithlineg[i] = linegcircle.append("circle")
                        .attr("id", function (d) {
                            return [
                                model_entity, model_entity2, model_entity3,
                                textvalue, textvalue2, textvalue3,
                                src_fma, snk_fma, src_fma2, snk_fma2, src_fma3, snk_fma3,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_chebi3, solute_text, solute_text2, solute_text3,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
                            ];
                        })
                        .attr("index", tempID)
                        .attr("membrane", capillaryID)
                        .attr("cx", function (d) {
                            dx[i] = d.x;
                            return d.x;
                        })
                        .attr("cy", function (d) {
                            dy[i] = d.y + radius;
                            return d.y + radius;
                        })
                        .attr("r", radius)
                        .attr("fill", "darkred")
                        .attr("opacity", 0.6)
                        .attr("stroke-width", 20)
                        .attr("cursor", "move")
                        .on("mouseover", function () {
                            tooltipFunc(div, d3.select(this)._groups[0][0].id, d3.mouse(this)[0], d3.mouse(this)[1]);
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
                        .attr("fill", "white")
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
                        var lineg2 = lineg.append("g").data([{
                            x: xvalue + width + (w - (w / 3 + width + 30)) + 40 + 20,
                            y: yvaluec + radius * 2
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
                            x: xvalue + lineLen + 10 + width + (w - (w / 3 + width + 30)) + 40 + 20,
                            y: yvaluec + radius * 2 + markerHeight
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
                    yvaluec += ydistance;
                    cyvaluec += ydistance;
                }

                // case 5
                if ((src_fma == interstitialID && snk_fma == bloodCapillary) && (textvalue2 == "channel")) {

                    console.log("case 5 cytosolID ==> interstitialID and channel: ", yvaluec, cyvaluec);

                    var polygong = newg.append("g").data([{
                        x: xvalue - 5 + width + (w - (w / 3 + width + 30)) + 40 + 20,
                        y: yvaluec
                    }]);
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

                    var linegtext = polygong.append("g").data([{
                        x: xvalue + lineLen + 10 + width + (w - (w / 3 + width + 30)) + 40 + 20,
                        y: yvaluec + 5
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
                        .attr("font-size", "12px")
                        .attr("font-weight", "bold")
                        .attr("fill", "red")
                        .attr("cursor", "pointer")
                        .text(solute_text);

                    // Polygon
                    circlewithlineg[i] = polygong.append("g").append("polygon")
                        .attr("transform", "translate(" + (xvalue - 5 + width + (w - (w / 3 + width + 30)) + 40 + 20) + "," + (yvaluec - 30) + ")")
                        .attr("id", function (d) {
                            return [
                                model_entity, model_entity2, model_entity3,
                                textvalue, textvalue2, textvalue3,
                                src_fma, snk_fma, src_fma2, snk_fma2, src_fma3, snk_fma3,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_chebi3, solute_text, solute_text2, solute_text3,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
                            ];
                        })
                        .attr("index", tempID)
                        .attr("membrane", capillaryID)
                        .attr("cx", function (d) {
                            dx[i] = xvalue - 5 + width + (w - (w / 3 + width + 30)) + 40 + 20;
                            return dx[i];
                        })
                        .attr("cy", function (d) {
                            dy[i] = yvaluec - 30;
                            return dy[i];
                        })
                        .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                        .attr("fill", "yellow")
                        .attr("stroke", "black")
                        .attr("stroke-linecap", "round")
                        .attr("stroke-linejoin", "round")
                        .attr("cursor", "move")
                        .on("mouseover", function () {
                            tooltipFunc(div, d3.select(this)._groups[0][0].id, d3.mouse(this)[0], d3.mouse(this)[1]);
                        });

                    var polygontext = polygong.append("g").data([{
                        x: xvalue + 12 + width + (w - (w / 3 + width + 30)) + 40 + 15,
                        y: yvaluec + 4
                    }]);
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

                    linewithlineg3[i] = "";
                    linewithtextg3[i] = "";
                    dx1line3[i] = "";
                    dy1line3[i] = "";
                    dx2line3[i] = "";
                    dy2line3[i] = "";
                    dxtext3[i] = "";
                    dytext3[i] = "";

                    if (msaveIDflag == true) {
                        msaveIDflag = false;
                        break;
                    }

                    // increment y-axis of line and circle
                    yvaluec += ydistance;
                    cyvaluec += ydistance;

                    console.log("case 5 2 cytosolID ==> interstitialID and channel: ", yvaluec, cyvaluec);
                }

                // case 6
                if ((src_fma == bloodCapillary && snk_fma == interstitialID) && (textvalue2 == "channel")) {

                    console.log("case 6 cytosolID ==> interstitialID and channel: ", yvaluec, cyvaluec);

                    var polygong = newg.append("g").data([{
                        x: xvalue - 5 + width + (w - (w / 3 + width + 30)) + 40 + 20,
                        y: yvaluec
                    }]);
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

                    var linegtext = polygong.append("g").data([{
                        x: xvalue - 30 + width + (w - (w / 3 + width + 30)) + 40 + 20,
                        y: yvaluec + 5
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
                        .attr("font-size", "12px")
                        .attr("font-weight", "bold")
                        .attr("fill", "red")
                        .attr("cursor", "pointer")
                        .text(solute_text);

                    // Polygon
                    circlewithlineg[i] = polygong.append("g").append("polygon")
                        .attr("transform", "translate(" + (xvalue - 5 + width + (w - (w / 3 + width + 30)) + 40 + 20) + "," + (yvaluec - 30) + ")")
                        .attr("id", function (d) {
                            return [
                                model_entity, model_entity2, model_entity3,
                                textvalue, textvalue2, textvalue3,
                                src_fma, snk_fma, src_fma2, snk_fma2, src_fma3, snk_fma3,
                                mediator_fma, mediator_pr,
                                solute_chebi, solute_chebi2, solute_chebi3, solute_text, solute_text2, solute_text3,
                                mediator_pr_text, mediator_pr_text_syn, protein_name
                            ];
                        })
                        .attr("index", tempID)
                        .attr("membrane", capillaryID)
                        .attr("cx", function (d) {
                            dx[i] = xvalue - 5 + width + (w - (w / 3 + width + 30)) + 40 + 20;
                            return dx[i];
                        })
                        .attr("cy", function (d) {
                            dy[i] = yvaluec - 30;
                            return dy[i];
                        })
                        .attr("points", "10,20 50,20 45,30 50,40 10,40 15,30")
                        .attr("fill", "yellow")
                        .attr("stroke", "black")
                        .attr("stroke-linecap", "round")
                        .attr("stroke-linejoin", "round")
                        .attr("cursor", "move")
                        .on("mouseover", function () {
                            tooltipFunc(div, d3.select(this)._groups[0][0].id, d3.mouse(this)[0], d3.mouse(this)[1]);
                        });

                    var polygontext = polygong.append("g").data([{
                        x: xvalue + 12 + width + (w - (w / 3 + width + 30)) + 40 + 20,
                        y: yvaluec + 4
                    }]);
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

                    linewithlineg3[i] = "";
                    linewithtextg3[i] = "";
                    dx1line3[i] = "";
                    dy1line3[i] = "";
                    dx2line3[i] = "";
                    dy2line3[i] = "";
                    dxtext3[i] = "";
                    dytext3[i] = "";

                    if (msaveIDflag == true) {
                        msaveIDflag = false;
                        break;
                    }

                    // increment y-axis of line and circle
                    yvaluec += ydistance;
                    cyvaluec += ydistance;

                    console.log("case 6 2 cytosolID ==> interstitialID and channel: ", yvaluec, cyvaluec);
                }
            }

            /*  Paracellular Membrane */
            if (textvalue2 == "diffusiveflux") {
                var lineg = newg.append("g").data([{x: xpvalue, y: ypvalue + 5}]);
                linewithtextg[i] = lineg.append("text")
                    .attr("id", "linewithtextg" + tempID)
                    .attr("index", tempID)
                    .attr("membrane", paracellularID)
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
                    .attr("cursor", "move")
                    .text(solute_text);

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
                circlewithlineg[i] = "";
                linewithlineg2[i] = "";
                linewithtextg2[i] = "";
                dx1line2[i] = "";
                dy1line2[i] = "";
                dx2line2[i] = "";
                dy2line2[i] = "";
                dx[i] = "";
                dy[i] = "";
                dxtext2[i] = "";
                dytext2[i] = "";

                linewithlineg3[i] = "";
                linewithtextg3[i] = "";
                dx1line3[i] = "";
                dy1line3[i] = "";
                dx2line3[i] = "";
                dy2line3[i] = "";
                dxtext3[i] = "";
                dytext3[i] = "";

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

        if (linewithlineg3[icircleGlobal] != undefined) {
            if (linewithlineg3[icircleGlobal] != "") {
                // line 3
                linewithlineg3[icircleGlobal]
                    .attr("x1", parseFloat(d3.select("#" + "linewithlineg3" + icircleGlobal).attr("x1")) + dx)
                    .attr("y1", parseFloat(d3.select("#" + "linewithlineg3" + icircleGlobal).attr("y1")) + dy)
                    .attr("x2", parseFloat(d3.select("#" + "linewithlineg3" + icircleGlobal).attr("x2")) + dx)
                    .attr("y2", parseFloat(d3.select("#" + "linewithlineg3" + icircleGlobal).attr("y2")) + dy);
            }
        }

        if (linewithtextg3[icircleGlobal] != undefined) {
            if (linewithtextg3[icircleGlobal] != "") {
                // text 3
                linewithtextg3[icircleGlobal]
                    .attr("x", parseFloat(d3.select("#" + "linewithtextg3" + icircleGlobal).attr("x")) + dx)
                    .attr("y", parseFloat(d3.select("#" + "linewithtextg3" + icircleGlobal).attr("y")) + dy);
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
        if ($(this).prop("tagName") == "text") { // OR if ($(this).attr("membrane") == paracellularID) {}
            cx = $(this).attr("x");
            cy = $(this).attr("y");
        }

        lineb_id = $($("line")[mindex]).prop("id");
        circle_id = $(this).prop("id").split(",");

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
        console.log("dropcircleExtended membrane: ", membrane);

        var query;

        query = "SELECT ?located_in " +
            "WHERE { GRAPH ?g { <" + cellmlModel + "> <http://www.obofoundry.org/ro/ro.owl#located_in> ?located_in . " +
            "}}";

        // location of that cellml model
        sendPostRequest(
            endpoint,
            query,
            function (jsonLocatedin) {

                // console.log("jsonLocatedin: ", jsonLocatedin);

                var jsonLocatedinCounter = 0;
                // Type of model - kidney, lungs, etc
                for (i = 0; i < jsonLocatedin.results.bindings.length; i++) {
                    for (j = 0; j < organ.length; j++) {
                        for (var k = 0; k < organ[j].key.length; k++) {
                            if (jsonLocatedin.results.bindings[i].located_in.value == organ[j].key[k].key)
                                jsonLocatedinCounter++;

                            if (jsonLocatedinCounter == jsonLocatedin.results.bindings.length) {
                                typeOfModel = organ[j].value;
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
                    for (j = 0; j < organ[organIndex].key.length; j++) {
                        if (jsonLocatedin.results.bindings[i].located_in.value == organ[organIndex].key[j].key) {
                            locationOfModel += organ[organIndex].key[j].value;

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

                sendPostRequest(
                    endpoint,
                    query,
                    function (jsonRelatedModel) {

                        for (i = 0; i < jsonRelatedModel.results.bindings.length; i++) {
                            for (j = 0; j < organ[organIndex].key.length; j++) {
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

                            showLoading("#modalBody");

                            var circleID = $(cthis).prop("id").split(",");
                            console.log("circleID in myWelcomeModal: ", circleID);

                            // parsing
                            cellmlModel = circleID[0];
                            var indexOfHash = cellmlModel.search("#"), query;
                            cellmlModel = cellmlModel.slice(0, indexOfHash);

                            cellmlModel = cellmlModel + "#" + cellmlModel.slice(0, cellmlModel.indexOf("."));

                            console.log("cellmlModel: ", cellmlModel);
                            query = circleIDmyWelcomeWindowSPARQL(circleID, cellmlModel);

                            console.log("query: ", query);

                            // protein name
                            sendPostRequest(
                                endpoint,
                                query,
                                function (jsonModel) {

                                    console.log("jsonModel: ", jsonModel);

                                    if (jsonModel.results.bindings.length == 0)
                                        proteinName = undefined;
                                    else
                                        proteinName = jsonModel.results.bindings[0].Protein.value;

                                    var endpointprOLS;
                                    if (proteinName != undefined) {
                                        if (proteinName == epithelialcellID)
                                            endpointprOLS = abiOntoEndpoint + "/cl/terms?iri=" + proteinName;
                                        else if (proteinName.indexOf(partOfGOUri) != -1) {
                                            endpointprOLS = abiOntoEndpoint + "/go/terms?iri=" + proteinName;
                                        }
                                        else
                                            endpointprOLS = abiOntoEndpoint + "/pr/terms?iri=" + proteinName;
                                    }
                                    else
                                        endpointprOLS = abiOntoEndpoint + "/pr";

                                    sendGetRequest(
                                        endpointprOLS,
                                        function (jsonPr) {

                                            var endpointgeneOLS;
                                            if (jsonPr._embedded == undefined || jsonPr._embedded.terms[0]._links.has_gene_template == undefined)
                                                endpointgeneOLS = abiOntoEndpoint + "/pr";
                                            else
                                                endpointgeneOLS = jsonPr._embedded.terms[0]._links.has_gene_template.href;

                                            sendGetRequest(
                                                endpointgeneOLS,
                                                function (jsonGene) {

                                                    var endpointspeciesOLS;
                                                    if (jsonPr._embedded == undefined || jsonPr._embedded.terms[0]._links.only_in_taxon == undefined)
                                                        endpointspeciesOLS = abiOntoEndpoint + "/pr";
                                                    else
                                                        endpointspeciesOLS = jsonPr._embedded.terms[0]._links.only_in_taxon.href;

                                                    sendGetRequest(
                                                        endpointspeciesOLS,
                                                        function (jsonSpecies) {

                                                            if (jsonPr._embedded == undefined)
                                                                proteinText = "Numerical model"; // Or undefined
                                                            else {
                                                                proteinText = jsonPr._embedded.terms[0].label;
                                                                proteinText = proteinText.slice(0, proteinText.indexOf("(") - 1);
                                                            }

                                                            if (jsonModel.results.bindings.length == 0)
                                                                biological_meaning = "";
                                                            else {
                                                                biological_meaning = jsonModel.results.bindings[0].Biological_meaning.value;

                                                                if (circleID[1] == "" && circleID[2] == "")
                                                                    biological_meaning2 = "";
                                                                else
                                                                    biological_meaning2 = jsonModel.results.bindings[0].Biological_meaning2.value;

                                                                if (circleID[2] == "")
                                                                    biological_meaning3 = "";
                                                                else
                                                                    biological_meaning3 = jsonModel.results.bindings[0].Biological_meaning3.value;
                                                            }

                                                            if (jsonSpecies._embedded == undefined)
                                                                speciesName = "Numerical model"; // Or undefined
                                                            else
                                                                speciesName = jsonSpecies._embedded.terms[0].label;

                                                            if (jsonGene._embedded == undefined)
                                                                geneName = "Numerical model"; // Or undefined
                                                            else {
                                                                geneName = jsonGene._embedded.terms[0].label;
                                                                geneName = geneName.slice(0, geneName.indexOf("(") - 1);
                                                            }

                                                            console.log("BEFORE dropcircleExtended combinedMembrane: ", combinedMembrane);
                                                            console.log("BEFORE dropcircleExtended circleID: ", circleID);
                                                            dropcircleExtended(circleID[12]);

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
            moveBack();

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

        sendPostRequest(
            endpoint,
            query,
            function (jsonProtein) {

                var endpointprOLS;
                if (jsonProtein.results.bindings.length == 0)
                    endpointprOLS = abiOntoEndpoint + "/pr";
                else {
                    var pr_uri = jsonProtein.results.bindings[0].Protein.value;
                    if (pr_uri == epithelialcellID)
                        endpointprOLS = abiOntoEndpoint + "/cl/terms?iri=" + pr_uri;
                    else if (pr_uri.indexOf(partOfGOUri) != -1) {
                        endpointprOLS = abiOntoEndpoint + "/go/terms?iri=" + pr_uri;
                    }
                    else
                        endpointprOLS = abiOntoEndpoint + "/pr/terms?iri=" + pr_uri;
                }

                sendGetRequest(
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

        sendPostRequest(
            endpoint,
            query,
            function (jsonAltProtein) {

                if (jsonAltProtein.results.bindings.length == 0)
                    endpointOLS = abiOntoEndpoint + "/pr";
                else {
                    var pr_uri = jsonAltProtein.results.bindings[0].Protein.value;
                    if (pr_uri == epithelialcellID)
                        endpointOLS = abiOntoEndpoint + "/cl/terms?iri=" + pr_uri;
                    else if (pr_uri.indexOf(partOfGOUri) != -1) {
                        endpointOLS = abiOntoEndpoint + "/go/terms?iri=" + pr_uri;
                    }
                    else
                        endpointOLS = abiOntoEndpoint + "/pr/terms?iri=" + pr_uri;
                }

                sendGetRequest(
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
                            if (membrane == apicalID) {
                                membrane = basolateralID;
                                membraneName = "Basolateral membrane";

                                console.log("membrane TESTING: ", membrane);
                            }
                            else if (membrane == basolateralID) {
                                membrane = apicalID;
                                membraneName = "Apical membrane";

                                console.log("membrane TESTING: ", membrane);
                            }

                            console.log("alternativeCellmlArray combinedMembrane: ", combinedMembrane);
                            console.log("membrane: ", membrane);

                            relatedMembrane(membrane, membraneName, 1);
                            return;
                        }

                        alternativeCellmlModel(alternativeCellmlArray, membrane);
                    },
                    true);
            }, true);
    };

    var makecotransporter = function (membrane1, membrane2, fluxList, membraneName, flag) {

        var query = makecotransporterSPARQL(membrane1, membrane2);
        sendPostRequest(
            endpoint,
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
                            "membrane2": membrane2,
                            "membrane3": ""
                        });
                    }
                }

                counter++;

                if (counter == iteration(fluxList.length)) {

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
                            "model_entity2": cotransporterList[i].membrane2,
                            "model_entity3": cotransporterList[i].membrane3
                        });
                    }

                    // make flux in modelEntityObj
                    for (var i in fluxList) {
                        modelEntityObj.push({
                            "model_entity": fluxList[i],
                            "model_entity2": "",
                            "model_entity3": ""
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

    var maketritransporter = function (membrane1, membrane2, membrane3, fluxList, membraneName, flag) {

        var query = maketritransporterSPARQL(membrane1, membrane2, membrane3);
        sendPostRequest(
            endpoint,
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
                            "membrane2": membrane2,
                            "membrane3": membrane3
                        });
                    }
                }

                counter++;

                if (counter == iteration(fluxList.length)) {

                    // delete cotransporter indices from fluxList
                    for (var i in cotransporterList) {
                        for (var j in fluxList) {
                            if (cotransporterList[i].membrane1 == fluxList[j] ||
                                cotransporterList[i].membrane2 == fluxList[j] ||
                                cotransporterList[i].membrane3 == fluxList[j]) {

                                fluxList.splice(j, 1);
                            }
                        }
                    }

                    // make cotransproter in modelEntityObj
                    for (var i in cotransporterList) {
                        modelEntityObj.push({
                            "model_entity": cotransporterList[i].membrane1,
                            "model_entity2": cotransporterList[i].membrane2,
                            "model_entity3": cotransporterList[i].membrane3
                        });
                    }

                    // make flux in modelEntityObj
                    for (var i in fluxList) {
                        modelEntityObj.push({
                            "model_entity": fluxList[i],
                            "model_entity2": "",
                            "model_entity3": ""
                        });
                    }

                    console.log("maketritransporter: fluxList -> ", fluxList);
                    console.log("maketritransporter: cotransporterList -> ", cotransporterList);
                    console.log("maketritransporter: modelEntityObj -> ", modelEntityObj);

                    console.log("maketritransporter: combinedMembrane -> ", combinedMembrane);

                    if (fluxList.length == 0) {
                        relatedMembraneModel(membraneName, cotransporterList, flag);
                    }
                }
            },
            true);
    };

    // apical or basolateral membrane in PMR
    var relatedMembrane = function (membrane, membraneName, flag) {

        console.log("relatedMembrane: ", membrane, membraneName);
        console.log("relatedMembrane -> combinedMembrane: ", combinedMembrane);

        var circleID = $(cthis).prop("id").split(",");
        console.log("relatedMembrane circleID: ", circleID);

        // A flux may look for a cotransporter and vice-versa
        var fstCHEBI, sndCHEBI;
        fstCHEBI = circleID[14];
        if (circleID[15] == "" || circleID[15] == "channel" || circleID[15] == "diffusiveflux")
            sndCHEBI = fstCHEBI;
        else sndCHEBI = circleID[15];

        var query = relatedMembraneSPARQL(fstCHEBI, sndCHEBI, membrane);

        sendPostRequest(
            endpoint,
            query,
            function (jsonRelatedMembrane) {

                console.log("jsonRelatedMembrane: ", jsonRelatedMembrane);

                var fluxList = [], cotransporterList = [];
                for (var i = 0; i < jsonRelatedMembrane.results.bindings.length; i++) {

                    // allow only related apical or basolateral membrane from my workspace
                    if (jsonRelatedMembrane.results.bindings[i].g.value != myWorkspaceName)
                        continue;

                    fluxList.push(jsonRelatedMembrane.results.bindings[i].Model_entity.value);

                    if (circleID[11] != "" || circleID[11] != "channel" || circleID[11] != "diffusiveflux") {
                        fluxList.push(jsonRelatedMembrane.results.bindings[i].Model_entity2.value);
                    }
                }

                var tempfluxList = [];
                for (var i = 0; i < fluxList.length; i++) {
                    if (!isExist(fluxList[i], tempfluxList)) {
                        tempfluxList.push(fluxList[i]);
                    }
                }

                fluxList = tempfluxList;
                if (fluxList.length <= 1) {
                    console.log("fluxList.length <= 1");
                    modelEntityObj.push({
                        "model_entity": fluxList[0],
                        "model_entity2": "",
                        "model_entity3": ""
                    });

                    console.log("relatedMembrane: fluxList -> ", fluxList);
                    console.log("relatedMembrane: cotransporterList -> ", cotransporterList);
                    console.log("relatedMembrane: modelEntityObj -> ", modelEntityObj);

                    relatedMembraneModel(membraneName, cotransporterList, flag);
                }
                else if (fluxList.length <= 2) {
                    console.log("fluxList.length <= 2");

                    for (var i = 0; i < fluxList.length; i++) {
                        for (var j = i + 1; j < fluxList.length; j++) {
                            makecotransporter(fluxList[i], fluxList[j], fluxList, membraneName, flag);
                        }
                    }
                }
                else if (fluxList.length >= 3) {

                    console.log("fluxList.length >= 3");

                    var arr = [];
                    for (var i = 0; i < fluxList.length; i++) {
                        if (fluxList[i].med_pr == nkcc1) {
                            arr.push(fluxList[i]);

                            fluxList.splice(i, 1);
                            i--;
                        }
                    }

                    if (arr.length == 3) {
                        maketritransporter(arr[0], arr[1], arr[2], fluxList, membraneName, flag);
                    }
                    else {
                        for (var i = 0; i < arr.length; i++) {
                            fluxList.push(arr.pop());
                            i--;
                        }
                    }

                    // make co-transporter
                    for (var i = 0; i < fluxList.length; i++) {
                        for (var j = i + 1; j < fluxList.length; j++) {
                            makecotransporter(fluxList[i], fluxList[j], fluxList, membraneName, flag);
                        }
                    }
                }
            },
            true);
    };

    var source_fma = [], sink_fma = [], med_fma = [], med_pr = [], solute_chebi = [];
    var source_fma2 = [], sink_fma2 = [], solute_chebi2 = [];
    var source_fma3 = [], sink_fma3 = [], solute_chebi3 = [];

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

        sendPostRequest(
            endpoint,
            query,
            function (jsonRelatedMembraneModel) {

                console.log("relatedMembraneModel: jsonRelatedMembraneModel -> ", jsonRelatedMembraneModel);

                var endpointprOLS;
                if (jsonRelatedMembraneModel.results.bindings.length == 0) {

                    console.log("jsonRelatedMembraneModel.results.bindings.length == 0: combinedMembrane -> ", combinedMembrane);

                    showModalWindow(membraneName, flag);
                    return;
                } else {
                    var pr_uri = jsonRelatedMembraneModel.results.bindings[0].Protein.value;
                    if (pr_uri == epithelialcellID)
                        endpointprOLS = abiOntoEndpoint + "/cl/terms?iri=" + pr_uri;
                    else if (pr_uri.indexOf(partOfGOUri) != -1) {
                        endpointprOLS = abiOntoEndpoint + "/go/terms?iri=" + pr_uri;
                    }
                    else
                        endpointprOLS = abiOntoEndpoint + "/pr/terms?iri=" + pr_uri;
                }

                sendGetRequest(
                    endpointprOLS,
                    function (jsonPr) {

                        var query = relatedMembraneModelSPARQL(modelEntityObj[idMembrane].model_entity, modelEntityObj[idMembrane].model_entity2, modelEntityObj[idMembrane].model_entity3);

                        // console.log("query: ", query);

                        sendPostRequest(
                            endpoint,
                            query,
                            function (jsonObjFlux) {
                                // console.log("relatedMembraneModel: jsonObjFlux -> ", jsonObjFlux);

                                var endpointOLS;
                                if (jsonObjFlux.results.bindings[0].solute_chebi == undefined) {
                                    endpointOLS = undefined;
                                }
                                else {
                                    var chebi_uri = jsonObjFlux.results.bindings[0].solute_chebi.value;
                                    var endpointOLS = abiOntoEndpoint + "/chebi/terms?iri=" + chebi_uri;
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
                                            var endpointOLS2 = abiOntoEndpoint + "/chebi/terms?iri=" + chebi_uri2;
                                        }

                                        sendGetRequest(
                                            endpointOLS2,
                                            function (jsonObjOLSChebi2) {

                                                var endpointOLS3;
                                                if (jsonObjFlux.results.bindings[0].solute_chebi3 == undefined) {
                                                    endpointOLS3 = undefined;
                                                }
                                                else {
                                                    var chebi_uri3 = jsonObjFlux.results.bindings[0].solute_chebi3.value;
                                                    var endpointOLS3 = abiOntoEndpoint + "/chebi/terms?iri=" + chebi_uri3;
                                                }

                                                sendGetRequest(
                                                    endpointOLS3,
                                                    function (jsonObjOLSChebi3) {

                                                        for (var i = 0; i < jsonObjFlux.results.bindings.length; i++) {
                                                            // solute chebi
                                                            var temparr = jsonObjOLSChebi._embedded.terms[0].annotation["has_related_synonym"],
                                                                solute_chebi_name;
                                                            for (var m = 0; m < temparr.length; m++) {
                                                                if (temparr[m].slice(-1) == "+" || temparr[m].slice(-1) == "-" || temparr[m] == "Glc") {
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

                                                            // solute chebi 3
                                                            var temparr3 = jsonObjOLSChebi3._embedded.terms[0].annotation["has_related_synonym"],
                                                                solute_chebi_name3;
                                                            for (var m = 0; m < temparr3.length; m++) {
                                                                if (temparr3[m].slice(-1) == "+" || temparr3[m].slice(-1) == "-") {
                                                                    solute_chebi_name3 = temparr3[m];
                                                                    break;
                                                                }
                                                            }

                                                            if (jsonObjFlux.results.bindings[i].solute_chebi3 == undefined)
                                                                solute_chebi3.push("");
                                                            else
                                                                solute_chebi3.push({
                                                                    name: solute_chebi_name3,
                                                                    uri: jsonObjFlux.results.bindings[i].solute_chebi3.value
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

                                                            // source fma 3
                                                            if (jsonObjFlux.results.bindings[i].source_fma3 == undefined)
                                                                source_fma3.push("");
                                                            else
                                                                source_fma3.push({fma3: jsonObjFlux.results.bindings[i].source_fma3.value});

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

                                                            // sink fma 3
                                                            if (jsonObjFlux.results.bindings[i].sink_fma3 == undefined)
                                                                sink_fma3.push("");
                                                            else
                                                                sink_fma3.push({fma3: jsonObjFlux.results.bindings[i].sink_fma3.value});

                                                            // med pr and fma
                                                            if (jsonObjFlux.results.bindings[i].med_entity_uri == undefined) {
                                                                med_pr.push("");
                                                                med_fma.push("");
                                                            }
                                                            else {
                                                                var temp = jsonObjFlux.results.bindings[i].med_entity_uri.value;
                                                                if (temp.indexOf(partOfProteinUri) != -1 || temp.indexOf(partOfGOUri) != -1 || temp.indexOf(partOfCHEBIUri) != -1) {
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
                                                        solute_chebi3 = uniqueifyEpithelial(solute_chebi3);
                                                        source_fma = uniqueifyEpithelial(source_fma);
                                                        sink_fma = uniqueifyEpithelial(sink_fma);
                                                        source_fma2 = uniqueifyEpithelial(source_fma2);
                                                        sink_fma2 = uniqueifyEpithelial(sink_fma2);
                                                        source_fma3 = uniqueifyEpithelial(source_fma3);
                                                        sink_fma3 = uniqueifyEpithelial(sink_fma3);
                                                        med_pr = uniqueifyEpithelial(med_pr);
                                                        med_fma = uniqueifyEpithelial(med_fma);

                                                        if (jsonRelatedMembraneModel.results.bindings.length != 0) {

                                                            console.log("jsonRelatedMembraneModel: ", jsonRelatedMembraneModel);

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

                                                            console.log("PID: ", PID);

                                                            membraneModelObj.push({
                                                                protein: jsonRelatedMembraneModel.results.bindings[0].Protein.value,
                                                                pid: PID, // med PID
                                                                prname: jsonPr._embedded.terms[0].label,
                                                                medfma: med_fma[0].med_fma, //combinedMembrane[0].med_fma,
                                                                medpr: tempVal,
                                                                similar: 0 // initial percent
                                                            });

                                                            console.log("membraneModelObj: ", membraneModelObj);

                                                            var sourcefma, sinkfma, variabletext, solutechebi,
                                                                solutetext,
                                                                modelentity2, sourcefma2, sinkfma2, variabletext2,
                                                                solutechebi2, solutetext2,
                                                                modelentity3, sourcefma3, sinkfma3, variabletext3,
                                                                solutechebi3, solutetext3,
                                                                medfma, medpr, indexOfdot, indexOfHash;

                                                            if (modelEntityObj[idMembrane].model_entity2 == "" && modelEntityObj[idMembrane].model_entity3 == "") {

                                                                indexOfHash = modelEntityObj[idMembrane].model_entity.search("#");
                                                                variabletext = modelEntityObj[idMembrane].model_entity.slice(indexOfHash + 1);
                                                                indexOfdot = variabletext.indexOf(".");

                                                                variabletext = variabletext.slice(indexOfdot + 1);

                                                                var tempjsonObjFlux = uniqueifyjsonFlux(jsonObjFlux.results.bindings);

                                                                // console.log("tempjsonObjFlux: ", tempjsonObjFlux);

                                                                if (tempjsonObjFlux.length == 1) {
                                                                    var vartext2, vartext3;
                                                                    if (med_pr.length != 0) {
                                                                        if (med_pr[0].med_pr == Nachannel || med_pr[0].med_pr == Kchannel ||
                                                                            med_pr[0].med_pr == Clchannel) {
                                                                            vartext2 = "channel";
                                                                            vartext3 = "channel";
                                                                        }
                                                                        else if (tempjsonObjFlux[0].source_fma.value == luminalID &&
                                                                            tempjsonObjFlux[0].sink_fma.value == interstitialID) {
                                                                            vartext2 = "diffusiveflux";
                                                                            vartext3 = "diffusiveflux";
                                                                        }
                                                                        else {
                                                                            vartext2 = "flux"; // flux
                                                                            vartext3 = "flux"; // flux
                                                                        }
                                                                    }

                                                                    // TODO: ??
                                                                    if (med_pr.length == 0) {
                                                                        vartext2 = "flux"; // "no mediator"
                                                                        vartext3 = "flux"; // "no mediator"
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
                                                                    modelentity3 = "";
                                                                    if (vartext2 == "channel" || vartext2 == "diffusiveflux") {
                                                                        sourcefma2 = vartext2;
                                                                        sinkfma2 = vartext2;
                                                                        variabletext2 = vartext2; // flux/channel/diffusiveflux
                                                                        solutechebi2 = vartext2;
                                                                        solutetext2 = vartext2;
                                                                        sourcefma3 = vartext3;
                                                                        sinkfma3 = vartext3;
                                                                        variabletext3 = vartext3; // flux/channel/diffusiveflux
                                                                        solutechebi3 = vartext3;
                                                                        solutetext3 = vartext3;
                                                                    }
                                                                    else {
                                                                        sourcefma2 = "";
                                                                        sinkfma2 = "";
                                                                        variabletext2 = vartext2; // flux/channel/diffusiveflux
                                                                        solutechebi2 = "";
                                                                        solutetext2 = "";
                                                                        sourcefma3 = "";
                                                                        sinkfma3 = "";
                                                                        variabletext3 = vartext3; // flux/channel/diffusiveflux
                                                                        solutechebi3 = "";
                                                                        solutetext3 = "";
                                                                    }
                                                                }
                                                                else {
                                                                    // same solute - J_Na in mackenzie model
                                                                    if (tempjsonObjFlux.length == 2 && modelEntityObj[idMembrane].model_entity2 == "" && modelEntityObj[idMembrane].model_entity3 == "") {
                                                                        modelentity2 = modelEntityObj[idMembrane].model_entity;
                                                                        sourcefma = tempjsonObjFlux[0].source_fma.value;
                                                                        sinkfma = tempjsonObjFlux[0].sink_fma.value;
                                                                        sourcefma2 = tempjsonObjFlux[1].source_fma.value;
                                                                        sinkfma2 = tempjsonObjFlux[1].sink_fma.value;
                                                                        medfma = med_fma[0].med_fma;

                                                                        modelentity3 = "";
                                                                        sourcefma3 = "";
                                                                        sinkfma3 = "";

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

                                                                        variabletext3 = "";
                                                                        solutechebi3 = "";
                                                                        solutetext3 = "";
                                                                    }
                                                                    // same solute - J_Na in nkcc1 model if all are same, i.e. same solute tritransporter
                                                                    else if (tempjsonObjFlux.length == 3 && modelEntityObj[idMembrane].model_entity2 == "" && modelEntityObj[idMembrane].model_entity3 == "") {
                                                                        modelentity2 = modelEntityObj[idMembrane].model_entity;
                                                                        sourcefma = tempjsonObjFlux[0].source_fma.value;
                                                                        sinkfma = tempjsonObjFlux[0].sink_fma.value;
                                                                        sourcefma2 = tempjsonObjFlux[1].source_fma.value;
                                                                        sinkfma2 = tempjsonObjFlux[1].sink_fma.value;
                                                                        medfma = med_fma[0].med_fma;

                                                                        modelentity3 = modelEntityObj[idMembrane].model_entity;
                                                                        sourcefma3 = tempjsonObjFlux[2].source_fma.value;
                                                                        sinkfma3 = tempjsonObjFlux[2].sink_fma.value;

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

                                                                        variabletext3 = variabletext;
                                                                        solutechebi3 = solutechebi;
                                                                        solutetext3 = solutetext;
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

                                                                indexOfHash = modelEntityObj[idMembrane].model_entity3.search("#");
                                                                variabletext3 = modelEntityObj[idMembrane].model_entity3.slice(indexOfHash + 1);
                                                                indexOfdot = variabletext3.indexOf(".");
                                                                variabletext3 = variabletext3.slice(indexOfdot + 1);

                                                                modelentity2 = modelEntityObj[idMembrane].model_entity2;
                                                                modelentity3 = modelEntityObj[idMembrane].model_entity3;
                                                                sourcefma = source_fma[0].fma;
                                                                sinkfma = sink_fma[0].fma;
                                                                sourcefma2 = source_fma2[0].fma2;
                                                                sinkfma2 = sink_fma2[0].fma2;
                                                                sourcefma3 = source_fma3[0].fma3;
                                                                sinkfma3 = sink_fma3[0].fma3;
                                                                solutechebi = solute_chebi[0].uri;
                                                                solutetext = solute_chebi[0].name;
                                                                solutechebi2 = solute_chebi2[0].uri;
                                                                solutetext2 = solute_chebi2[0].name;
                                                                solutechebi3 = solute_chebi3[0].uri;
                                                                solutetext3 = solute_chebi3[0].name;
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

                                                        console.log("medURI: ", medURI);

                                                        if (medURI.indexOf(partOfCHEBIUri) != -1) {
                                                            endpointOLS = abiOntoEndpoint + "/chebi/terms?iri=" + medURI;
                                                        }
                                                        else if (medURI.indexOf(partOfGOUri) != -1) {
                                                            endpointOLS = abiOntoEndpoint + "/go/terms?iri=" + medURI;
                                                        }
                                                        else
                                                            endpointOLS = abiOntoEndpoint + "/pr/terms?iri=" + medURI;

                                                        sendGetRequest(
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
                                                                    modelentity3, // model_entity3
                                                                    variabletext, // variable_text
                                                                    variabletext2, // variable_text2
                                                                    variabletext2, // variable_text3
                                                                    sourcefma,
                                                                    sinkfma,
                                                                    sourcefma2,
                                                                    sinkfma2,
                                                                    sourcefma3,
                                                                    sinkfma3,
                                                                    medfma, // jsonObjFlux.results.bindings[0].med_entity_uri.value, // med_fma
                                                                    medpr, // med_pr, e.g. mediator in a cotransporter protein
                                                                    solutechebi, // solute_chebi
                                                                    solutechebi2, // solute_chebi2
                                                                    solutechebi3, // solute_chebi3
                                                                    solutetext, //solute_text
                                                                    solutetext2, //solute_text2
                                                                    solutetext3, //solute_text3
                                                                    jsonObjOLSMedPr._embedded.terms[0].label, //med_pr_text,
                                                                    med_pr_text_syn, //med_pr_text_syn
                                                                    jsonRelatedMembraneModel.results.bindings[0].Protein.value // protein_name
                                                                ]);

                                                                solute_chebi = [];
                                                                solute_chebi2 = [];
                                                                solute_chebi3 = [];
                                                                source_fma = [];
                                                                sink_fma = [];
                                                                source_fma2 = [];
                                                                sink_fma2 = [];
                                                                source_fma3 = [];
                                                                sink_fma3 = [];
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
                if (searchInCombinedMembrane(membraneModelID[i][0], membraneModelID[i][1], membraneModelID[i][2], combinedMembrane))
                    continue;

                var workspaceuri = myWorkspaceName + "/" + "rawfile" + "/" + "HEAD" + "/" + membraneModelID[i][0];

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
                    'title="Protein name: ' + membraneModelID[i][20] + '\n' +
                    'Protein uri: ' + membraneModelID[i][22] + '\n' +
                    'Mediator name: ' + membraneModelID[i][20] + '\n' +
                    'Mediator uri: ' + membraneModelID[i][13] + '\n' +
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

            var circleID = $(cthis).prop("id").split(",");

            var msg2 = "<p><b>" + proteinText + "</b> is a <b>" + typeOfModel + "</b> model. It is located in " +
                "<b>" + locationOfModel + "</b><\p>";

            var workspaceuri = myWorkspaceName + "/" + "rawfile" + "/" + "HEAD" + "/" + circleID[0];

            var model = "<b>Model: </b><a href=" + workspaceuri + " + target=_blank " +
                "data-toggle=tooltip data-placement=right " +
                "title=" + proteinText + ">" + circleID[0] + "</a>";

            var biological = "<p><b>Biological Meaning: </b>" + biological_meaning + "</p>";

            if (biological_meaning2 != "")
                biological += "<p>" + biological_meaning2 + "</p>";

            if (biological_meaning3 != "")
                biological += "<p>" + biological_meaning3 + "</p>";

            var species = "<p><b>Species: </b>" + speciesName + "</p>";
            var gene = "<p><b>Gene: </b>" + geneName + "</p>";
            var protein = "<p data-toggle=tooltip data-placement=right title=" + proteinName + ">" +
                "<b>Protein: </b>" + proteinText + "</p>";

            // Related apical or basolateral model
            var index = 0, ProteinSeq = "", requestData, PID = [];
            // var baseUrl = "https://www.ebi.ac.uk/Tools/services/rest/clustalo";
            var baseUrl = "/.api/ebi/clustalo";

            console.log("membraneModelID: ", membraneModelID);

            proteinOrMedPrID(membraneModelID, PID);
            console.log("PID BEFORE: ", PID);

            var draggedMedPrID = splitPRFromProtein(circleID);
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

                // var dbfectendpoint = "https://www.ebi.ac.uk/Tools/dbfetch/dbfetch/uniprotkb/" + PID[index] + "/fasta";
                var dbfectendpoint = "/.api/ebi/uniprotkb/" + PID[index] + "/fasta";

                sendGetRequest(
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

                            sendEBIPostRequest(
                                requestUrl,
                                requestData,
                                function (jobId) {
                                    // console.log("jobId: ", jobId); // jobId

                                    var chkJobStatus = function (jobId) {
                                        var jobIdUrl = baseUrl + "/status/" + jobId;
                                        sendGetRequest(
                                            jobIdUrl,
                                            function (resultObj) {
                                                console.log("result: ", resultObj); // jobId status

                                                if (resultObj == "RUNNING") {
                                                    setTimeout(function () {
                                                        chkJobStatus(jobId);
                                                    }, 5000);
                                                }

                                                var pimUrl = baseUrl + "/result/" + jobId + "/pim";
                                                sendGetRequest(
                                                    pimUrl,
                                                    function (identityMatrix) {

                                                        var similarityOBJ = similarityMatrixEBI(
                                                            identityMatrix, PID, draggedMedPrID, membraneModelObj);

                                                        var tempList = [];
                                                        for (var i = 0; i < membraneModelObj.length; i++) {
                                                            for (var j = 0; j < membraneModelID.length; j++) {

                                                                var tempID = splitPRFromProtein(membraneModelID[j]);
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
                                                            if (searchInCombinedMembrane(membraneModelID[i][0], membraneModelID[i][1], membraneModelID[i][2], combinedMembrane))
                                                                continue;

                                                            var workspaceuri = myWorkspaceName + "/" + "rawfile" + "/" + "HEAD" + "/" + membraneModelID[i][0];

                                                            var label = document.createElement("label");
                                                            label.innerHTML = '<br><input id="' + membraneModelID[i] + '" ' +
                                                                'type="checkbox" value="' + membraneModelID[i][0] + '">' + // membraneModelObj[i].prname
                                                                '<a href="' + workspaceuri + '" target="_blank" ' +
                                                                'data-toggle="tooltip" data-placement="right" ' +
                                                                'title="Protein name: ' + membraneModelObj[i].prname + '\n' +
                                                                'Protein uri: ' + membraneModelObj[i].protein + '\n' +
                                                                'Mediator name: ' + membraneModelID[i][20] + '\n' +
                                                                'Mediator uri: ' + membraneModelObj[i].medpr + '\n' +
                                                                'Similarity value: ' + membraneModelObj[i].similar + '\n' +
                                                                'Model entity: ' + membraneModelID[i][0] + '\n' +
                                                                'Model entity2: ' + membraneModelID[i][1] + '"' +
                                                                '>' + membraneModelID[i][20] + '</a></label>'; // membraneModelObj[i].prname

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
    var moveBack = function () {

        console.log("circlewithlineg: ", circlewithlineg);
        console.log("icircleGlobal: ", icircleGlobal);

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

        if (linewithlineg3[icircleGlobal] != undefined) {
            if (linewithlineg3[icircleGlobal] != "") {
                linewithlineg3[icircleGlobal]
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .attr("x1", dx1line3[icircleGlobal])
                    .attr("y1", dy1line3[icircleGlobal])
                    .attr("x2", dx2line3[icircleGlobal])
                    .attr("y2", dy2line3[icircleGlobal]);
            }
        }

        if (linewithtextg3[icircleGlobal] != undefined) {
            if (linewithtextg3[icircleGlobal] != "") {
                linewithtextg3[icircleGlobal]
                    .transition()
                    .delay(1000)
                    .duration(1000)
                    .attr("x", dxtext3[icircleGlobal])
                    .attr("y", dytext3[icircleGlobal]);
            }
        }

        reflectCheckbox(icircleGlobal);
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
            if (circlewithlineg[i].attr("membrane") == apicalID) {
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
            if (circlewithlineg[i].attr("membrane") == basolateralID) {
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

    // reinitialize variable for next iteration
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

    var reflectCheckbox = function (icircleGlobal) {
        checkboxsvg.call(checkBox[icircleGlobal])._groups[0][0].textContent = combinedMembrane[icircleGlobal].med_pr_text;
        console.log("checkboxsvg in reflectCheckbox: ", checkboxsvg._groups[0][0].textContent);

        ydistancechk = 50;
        yinitialchk = 215;
        ytextinitialchk = 230;

        for (var i = 0; i < combinedMembrane.length; i++) {
            var textvaluechk = combinedMembrane[i].med_pr_text;
            var indexOfParen = textvaluechk.indexOf("(");
            textvaluechk = textvaluechk.slice(0, indexOfParen - 1) + " (" + combinedMembrane[i].med_pr_text_syn + ")";

            checkBox[i].x(960).y(yinitialchk).checked(false).clickEvent(update);
            checkBox[i].xtext(1000).ytext(ytextinitialchk).text("" + textvaluechk + "");

            checkboxsvg.call(checkBox[i]);

            yinitialchk += ydistancechk;
            ytextinitialchk += ydistancechk;
        }
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
                            model_entity2: circleID[1], // cellml model entity => cotransporter or empty otherwise
                            model_entity3: circleID[2],
                            variable_text: circleID[3], // cellml variable name (e.g. J_NHE_Na)
                            variable_text2: circleID[4], // cellml variable name
                            variable_text3: circleID[5],
                            source_fma: circleID[6], // source FMA uri
                            sink_fma: circleID[7], // sink FMA uri
                            source_fma2: circleID[8], // source FMA uri => cotransporter or empty otherwise
                            sink_fma2: circleID[9], // sink FMA uri => cotransporter or empty otherwise
                            source_fma3: circleID[10],
                            sink_fma3: circleID[11],
                            med_fma: circleID[12], // mediator FMA uri
                            med_pr: circleID[13], // mediator protein uri
                            solute_chebi: circleID[14], // solute CHEBI uri
                            solute_chebi2: circleID[15], // solute CHEBI uri
                            solute_chebi3: circleID[16],
                            solute_text: circleID[17], // solute text using the CHEBI uri from OLS
                            solute_text2: circleID[18], // solute text using the CHEBI uri from OLS
                            solute_text3: circleID[19],
                            med_pr_text: circleID[20], // mediator protein text using the mediator protein uri from OLS
                            med_pr_text_syn: circleID[21], // synonym of a mediator protein text (e.g. NHE3, SGLT1) using the mediator protein uri from OLS
                            protein_name: circleID[22] // protein name
                        });
                        // combinedMembrane = uniqueifyCombinedMembrane(combinedMembrane);

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
                        if ($(cthis).attr("membrane") == paracellularID) {
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

                var circleID = $(cthis).prop("id").split(",");
                console.log("circleID at the end: ", circleID);

                var totalCheckboxes = $("input:checkbox").length,
                    numberOfChecked = $("input:checkbox:checked").length,
                    numberOfNotChecked = totalCheckboxes - numberOfChecked;

                console.log("totalCheckboxes, numberOfChecked, numberNotChecked: ", totalCheckboxes, numberOfChecked, numberOfNotChecked);
                console.log("$(#msaveID).click(function (event): combinedMembrane", combinedMembrane);

                if (totalCheckboxes == numberOfNotChecked) {
                    console.log("if (totalCheckboxes == numberOfNotChecked");
                    console.log("totalCheckboxes, numberNotChecked: ", totalCheckboxes, numberOfNotChecked);
                    console.log("circleID checkboxes: ", circleID[6], circleID[7], circleID[12]);

                    console.log("icircleGlobal: ", icircleGlobal);

                    // mediator FMA uri
                    if (combinedMembrane[icircleGlobal].med_fma == apicalID) {
                        circleID[12] = basolateralID;
                        combinedMembrane[icircleGlobal].med_fma = basolateralID;

                        // source and sink FMA uri
                        if (combinedMembrane[icircleGlobal].source_fma == luminalID && combinedMembrane[icircleGlobal].sink_fma == cytosolID) {
                            circleID[6] = cytosolID;
                            combinedMembrane[icircleGlobal].source_fma = cytosolID;
                            circleID[7] = interstitialID;
                            combinedMembrane[icircleGlobal].sink_fma = interstitialID;
                        }

                        if (combinedMembrane[icircleGlobal].source_fma == cytosolID && combinedMembrane[icircleGlobal].sink_fma == luminalID) {
                            circleID[6] = interstitialID;
                            combinedMembrane[icircleGlobal].source_fma = interstitialID;
                            circleID[7] = cytosolID;
                            combinedMembrane[icircleGlobal].sink_fma = cytosolID;
                        }

                        // source2 and sink2 FMA uri
                        if (combinedMembrane[icircleGlobal].source_fma2 != "" && combinedMembrane[icircleGlobal].sink_fma2 != "") {
                            if (combinedMembrane[icircleGlobal].source_fma2 == luminalID && combinedMembrane[icircleGlobal].sink_fma2 == cytosolID) {
                                circleID[8] = cytosolID;
                                combinedMembrane[icircleGlobal].source_fma2 = cytosolID;
                                circleID[9] = interstitialID;
                                combinedMembrane[icircleGlobal].sink_fma2 = interstitialID;
                            }

                            if (combinedMembrane[icircleGlobal].source_fma2 == cytosolID && combinedMembrane[icircleGlobal].sink_fma2 == luminalID) {
                                circleID[8] = interstitialID;
                                combinedMembrane[icircleGlobal].source_fma2 = interstitialID;
                                circleID[9] = cytosolID;
                                combinedMembrane[icircleGlobal].sink_fma2 = cytosolID;
                            }
                        }
                    }
                    else {
                        circleID[12] = apicalID;
                        combinedMembrane[icircleGlobal].med_fma = apicalID;

                        // source and sink FMA uri
                        if (combinedMembrane[icircleGlobal].source_fma == cytosolID && combinedMembrane[icircleGlobal].sink_fma == interstitialID) {
                            circleID[6] = luminalID;
                            combinedMembrane[icircleGlobal].source_fma = luminalID;
                            circleID[7] = cytosolID;
                            combinedMembrane[icircleGlobal].sink_fma = cytosolID;
                        }

                        if (combinedMembrane[icircleGlobal].source_fma == interstitialID && combinedMembrane[icircleGlobal].sink_fma == cytosolID) {
                            circleID[6] = cytosolID;
                            combinedMembrane[icircleGlobal].source_fma = cytosolID;
                            circleID[7] = luminalID;
                            combinedMembrane[icircleGlobal].sink_fma = luminalID;
                        }

                        // source2 and sink2 FMA uri
                        if (circleID[8] != "" && circleID[9] != "") {
                            if (combinedMembrane[icircleGlobal].source_fma2 == cytosolID && combinedMembrane[icircleGlobal].sink_fma2 == interstitialID) {
                                circleID[8] = luminalID;
                                combinedMembrane[icircleGlobal].source_fma2 = luminalID;
                                circleID[9] = cytosolID;
                                combinedMembrane[icircleGlobal].sink_fma2 = cytosolID;
                            }

                            if (combinedMembrane[icircleGlobal].source_fma2 == interstitialID && combinedMembrane[icircleGlobal].sink_fma2 == cytosolID) {
                                circleID[8] = cytosolID;
                                combinedMembrane[icircleGlobal].source_fma2 = cytosolID;
                                circleID[9] = luminalID;
                                combinedMembrane[icircleGlobal].sink_fma2 = luminalID;
                            }
                        }
                    }
                }
                else {

                    console.log("ELSE totalCheckboxes == numberOfNotChecked");

                    // update combinedMembrane, this will be sent to GMS to assemble and reproduce a new cellml model
                    combinedMembrane[icircleGlobal].model_entity = circleID[0]; // cellml model entity (e.g. weinstein_1995.cellml#NHE3.J_NHE3_Na)
                    combinedMembrane[icircleGlobal].model_entity2 = circleID[1]; // cellml model entity => cotransporter or empty otherwise
                    combinedMembrane[icircleGlobal].model_entity3 = circleID[2];
                    combinedMembrane[icircleGlobal].variable_text = circleID[3]; // cellml variable name (e.g. J_NHE_Na)
                    combinedMembrane[icircleGlobal].variable_text2 = circleID[4]; // cellml variable name
                    combinedMembrane[icircleGlobal].variable_text3 = circleID[5];
                    combinedMembrane[icircleGlobal].source_fma = circleID[6]; // source FMA uri
                    combinedMembrane[icircleGlobal].sink_fma = circleID[7]; // sink FMA uri
                    combinedMembrane[icircleGlobal].source_fma2 = circleID[8]; // source FMA uri => cotransporter or empty otherwise
                    combinedMembrane[icircleGlobal].sink_fma2 = circleID[9]; // sink FMA uri => cotransporter or empty otherwise
                    combinedMembrane[icircleGlobal].source_fma3 = circleID[10];
                    combinedMembrane[icircleGlobal].sink_fma3 = circleID[11];
                    combinedMembrane[icircleGlobal].med_fma = circleID[12]; // mediator FMA uri
                    combinedMembrane[icircleGlobal].med_pr = circleID[13]; // mediator protein uri
                    combinedMembrane[icircleGlobal].solute_chebi = circleID[14]; // solute CHEBI uri
                    combinedMembrane[icircleGlobal].solute_chebi2 = circleID[15]; // solute CHEBI uri
                    combinedMembrane[icircleGlobal].solute_chebi3 = circleID[16];
                    combinedMembrane[icircleGlobal].solute_text = circleID[17]; // solute text using the CHEBI uri from OLS
                    combinedMembrane[icircleGlobal].solute_text2 = circleID[18]; // solute text using the CHEBI uri from OLS
                    combinedMembrane[icircleGlobal].solute_text3 = circleID[19];
                    combinedMembrane[icircleGlobal].med_pr_text = circleID[20]; // mediator protein text using the mediator protein uri from OLS
                    combinedMembrane[icircleGlobal].med_pr_text_syn = circleID[21]; // synonym of a mediator protein text (e.g. NHE3, SGLT1) using the mediator protein uri from OLS
                    combinedMembrane[icircleGlobal].protein_name = circleID[22]; // protein name
                }

                console.log("circleID at the end 2: ", circleID);
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
                if ($(cthis).attr("membrane") == apicalID) {
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

                // reflect changes in respective checkbox
                reflectCheckbox(icircleGlobal);

                console.log("circleID at the end 3: ", circleID);
                console.log("combinedMembrane at the end 3: ", combinedMembrane);

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
        if (located_in == apicalID)
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

        showLoading("#modalBody");

        var query = modalWindowToAddModelsSPARQL(located_in);

        sendPostRequest(
            endpoint,
            query,
            function (jsonRelatedModelEntity) {

                console.log("modalWindowToAddModels jsonRelatedModelEntity: ", jsonRelatedModelEntity, combinedMembrane);
                for (var i = 0; i < jsonRelatedModelEntity.results.bindings.length; i++) {
                    if (!isExist(jsonRelatedModelEntity.results.bindings[i].modelEntity.value, relatedModelEntity)) {
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

    $("#modelassembly").html("<div><h3>Model Assembly Service:</h3> <button id='btnModel'>Click Here</button></div>");

    var data = [
        {
            "med_fma": "http://purl.obolibrary.org/obo/FMA_84666",
            "med_pr": "http://purl.obolibrary.org/obo/PR_P55018",
            "med_pr_text": "solute carrier family 12 member 3 (rat)",
            "med_pr_text_syn": "TSC",
            "model_entity": "chang_fujita_b_1999.cellml#total_transepithelial_sodium_flux.J_mc_Na",
            "model_entity2": "chang_fujita_b_1999.cellml#solute_concentrations.J_mc_Cl",
            "model_entity3": "",
            "protein_name": "http://purl.obolibrary.org/obo/CL_0000066",
            "sink_fma": "http://purl.obolibrary.org/obo/FMA_66836",
            "sink_fma2": "http://purl.obolibrary.org/obo/FMA_66836",
            "sink_fma3": "",
            "solute_chebi": "http://purl.obolibrary.org/obo/CHEBI_29101",
            "solute_chebi2": "http://purl.obolibrary.org/obo/CHEBI_17996",
            "solute_chebi3": "",
            "solute_text": "Na+",
            "solute_text2": "Cl-",
            "solute_text3": "",
            "source_fma": "http://purl.obolibrary.org/obo/FMA_74550",
            "source_fma2": "http://purl.obolibrary.org/obo/FMA_74550",
            "source_fma3": "",
            "variable_text": "J_mc_Na",
            "variable_text2": "J_mc_Cl",
            "variable_text3": ""
        },
        {
            "med_fma": "http://purl.obolibrary.org/obo/FMA_84666",
            "med_pr": "http://purl.obolibrary.org/obo/PR_Q63633",
            "med_pr_text": "solute carrier family 12 member 5 (rat)",
            "med_pr_text_syn": "Q63633",
            "model_entity": "chang_fujita_b_1999.cellml#solute_concentrations.J_mc_Cl",
            "model_entity2": "chang_fujita_b_1999.cellml#total_transepithelial_potassium_flux.J_mc_K",
            "model_entity3": "",
            "protein_name": "http://purl.obolibrary.org/obo/CL_0000066",
            "sink_fma": "http://purl.obolibrary.org/obo/FMA_66836",
            "sink_fma2": "http://purl.obolibrary.org/obo/FMA_66836",
            "sink_fma3": "",
            "solute_chebi": "http://purl.obolibrary.org/obo/CHEBI_17996",
            "solute_chebi2": "http://purl.obolibrary.org/obo/CHEBI_29103",
            "solute_chebi3": "",
            "solute_text": "Cl-",
            "solute_text2": "K+",
            "solute_text3": "",
            "source_fma": "http://purl.obolibrary.org/obo/FMA_74550",
            "source_fma2": "http://purl.obolibrary.org/obo/FMA_74550",
            "source_fma3": "",
            "variable_text": "J_mc_Cl",
            "variable_text2": "J_mc_K",
            "variable_text3": ""
        }
    ];

    $("#btnModel").click(function () {
        console.log("inside button model!");
        showLoading("#newmodel");
        // var url = "http://127.0.0.1:8000/post";
        var url = "http://130.216.216.219:8000/post";
        sendPostRequest(
            url,
            JSON.stringify(combinedMembrane),
            function (content) {
                console.log(content);
                $("#newmodel").html(content);
            },
            false);
    });
};
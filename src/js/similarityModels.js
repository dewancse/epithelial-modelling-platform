/**
 * Created by dsar941 on 5/11/2017.
 */
var uniqueifySVG = require("./miscellaneous.js").uniqueifySVG;

var similarityModels = function (model2DArray, modelEntityNameArray) {


    var links = [];

    // remove duplicate
    modelEntityNameArray = modelEntityNameArray.filter(function (item, pos) {
        return modelEntityNameArray.indexOf(item) == pos;
    });

    // console.log("visualization in modelEntityNameArray: ", modelEntityNameArray);
    // console.log("visualization in model2DArray: ", model2DArray);

    // Rearrange items in compartment and located_in
    for (var i = 0; i < model2DArray.length; i++) {

        // compartment
        if (Array.isArray(model2DArray[i][5]) == false) {
            model2DArray[i][5] = model2DArray[i][5].split(",").map(function (item) {
                return item.trim();
            });
        }

        // located_in
        if (Array.isArray(model2DArray[i][6]) == false) {
            model2DArray[i][6] = model2DArray[i][6].split(",").map(function (item) {
                return item.trim();
            });
        }

        model2DArray[i][5].sort();
        model2DArray[i][6].sort();
    }

    for (var ix = 0; ix < modelEntityNameArray.length; ix++) {
        for (i = 0; i < model2DArray.length; i++) {
            if (modelEntityNameArray[ix] == model2DArray[i][1]) {

                for (var j = 2; j < model2DArray[i].length; j++) {

                    var name;
                    if (j == 2) name = "Protein";
                    if (j == 3) name = "Species";
                    if (j == 4) name = "Gene";
                    if (j == 5) name = "Compartment";
                    if (j == 6) name = "Located_in";

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
    // console.log("nodes: ", nodes);
    // console.log("links: ", links);

    // SVG graph
    var width = 2000, // 1200
        height = 900; // 700

    var svg = d3.select("#svgSimilarityModels").append("svg")
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
        .force("charge", d3.forceManyBody().strength(-100)) // -100
        .force("center", d3.forceCenter(width / 4, height / 2)) // width / 3 and height / 2
        .force("link", d3.forceLink().distance(100).strength(0.1)); // 100

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
    var edgelabels = ["Protein", "Species", "Gene", "Compartment", "Located_in"];
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
        });

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
};

exports.similarityModels = similarityModels;
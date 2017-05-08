/**
 * Created by dsar941 on 5/8/2017.
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
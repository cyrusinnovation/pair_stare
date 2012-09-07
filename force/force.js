var width = 1200,
    height = 800;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("ps.json", function (json) {
    force
        .nodes(json.nodes)
//      .links(json.links)
        .start();

//  var link = svg.selectAll("line.link")
//      .data(json.links)
//    .enter().append("line")
//      .attr("class", "link")
//      .style("stroke-width", 1);

    var g = svg.selectAll("circle.node")
        .data(json.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", "translate(100.27381112210236,300.4319341249866)")

//        .attr("transform", function (d) {
//            return "translate(" + (d.x * 400 + 100) + "," + (d.y * 400 + 100) + ")";
//        })
        .call(force.drag);
    var node = g.append("circle")
        .attr("class", "node")
        .attr("r", 25)
        .style("fill", "lightgrey");

    g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".3em")
        .attr("font-size", "10px")
        .text(function (d) {
            return d.name;
        });

    force.on("tick", function () {
//    link.attr("x1", function(d) { return d.source.x; })
//        .attr("y1", function(d) { return d.source.y; })
//        .attr("x2", function(d) { return d.target.x; })
//        .attr("y2", function(d) { return d.target.y; });

        g.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    });
});

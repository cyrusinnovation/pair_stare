var width = 1200,
    height = 850;

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);

function circle_style(circle) {
    circle
        .attr("r", 25)
        .style("fill", "lightgoldenrodyellow")
        .style("stroke", "darkgreen")
        .style("stroke-width", 1.5);
}
d3.json("ps_final.json", function (json) {
    var g = svg.selectAll("g")
        .data(json.nodes)
        .enter().append("g")
        .attr("transform", function (d) {
            return "translate(" + (d.x * 500 + 100) + "," + (d.y * 500 + 100) + ")";
        });
    circle_style(g.append("circle"));
    g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".3em")
        .attr("font-size", "10px")
        .text(function (d) {
            return d.name;
        });
    var circle = svg.selectAll("circle")
        .on("mouseover", function (data, index) {
            circle = d3.select(this);
            circle.style("fill", "steelblue");
            circle.attr("r", 30);
        })
        .on("mouseout", function (data, index) {
            circle = d3.select(this);
            circle.style("fill", "lightgoldenrodyellow");
            circle.attr("r", 25);
        })
});

var width = 1200,
    height = 850;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-5000)
    .linkDistance(50)
    .gravity(1)
    .size([width, height]);

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("ps_final.json", function (json) {
    force
        .nodes(json.nodes)
        .links(json.links)
        .start();

    var link = svg.selectAll("line.link")
        .data(json.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", 1);

    var g = svg.selectAll("circle.node")
        .data(json.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + (d.x * 400 + 100) + "," + (d.y * 400 + 100) + ")";
        })
        .call(force.drag);
    var node = g.append("circle")
        .attr("class", "node")
        .attr("r", 25)
        .style("fill", "lightyellow")
        .style("stroke", "darkgreen")
        .style("stroke-width", 1.5);

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
            var myEdges = svg.selectAll("line").filter(function (line, index) {
                return line.source == data || line.target == data;
            });
            myEdges.each(function (edge) {
                var source = d3.select(edge.source).select("circle");
                var target = d3.select(edge.target).select("circle");
                source.style("fill", "steelblue");
                source.attr("r", 30);
                target.style("fill", "steelblue");
                target.attr("r", 30);
            });
        })
        .on("mouseout", function (data, index) {
            circle = d3.select(this);
            circle.style("fill", "lightgoldenrodyellow");
            circle.attr("r", 25);
        });

    force.on("tick", function () {
        link.attr("x1", function (d) {
            return d.source.x;
        })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        g.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    });
});

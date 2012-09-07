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

function unhighlight(circle) {
    return circle
        .style("fill", "lightyellow")
        .style("stroke", "darkgreen")
        .style("stroke-width", 1.5);
}
function highlight(circle) {
    circle.style("fill", "steelblue");
}

function has_endpoint_on(edge_data, node_data) {
    return edge_data.source === node_data || edge_data.target === node_data;
}
function find_incident_edges(node_data) {
    return svg.selectAll("line").filter(function (edge_data, index) {
        return has_endpoint_on(edge_data, node_data);
    });
}
function style_adjacent_nodes(data, style_function) {
    find_incident_edges(data).each(function (edge_data) {
        style_function(d3.select("#node_" + edge_data.target.index).select("circle"));
        style_function(d3.select("#node_" + edge_data.source.index).select("circle"));
    });
}
d3.json("ps_final.json", function (json) {
    force
        .nodes(json.nodes)
        .links(json.links)
        .start();

    var link = svg.selectAll("line.link")
        .data(json.links)
        .enter().append("line")
        .attr("id", function (edge_data, index) {
            return "edge_" + index;
        })
        .attr("class", "link")
        .style("stroke-width", 1);

    var g = svg.selectAll("circle.node")
        .data(json.nodes)
        .enter().append("g")
        .attr("id", function (node_data) {
            return "node_" + node_data.index;
        })
        .attr("class", "node")
        .attr("transform", function (node_data) {
            return "translate(" + (node_data.x * 400 + 100) + "," + (node_data.y * 400 + 100) + ")";
        })
        .call(force.drag);
    var circlething = g.append("circle")
        .attr("class", "node")
        .attr("r", 25);
    var node = unhighlight(circlething);

    g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".3em")
        .attr("font-size", "10px")
        .text(function (node_data) {
            return node_data.name;
        });

    svg.selectAll("g")
        .on("mouseover", function (node_data) {
            style_adjacent_nodes(node_data, highlight);
        })
        .on("mouseout", function (node_data) {
            style_adjacent_nodes(node_data, unhighlight);
        });

    force.on("tick", function () {
        link
            .attr("x1", function (edge_data) {
                return edge_data.source.x;
            })
            .attr("y1", function (edge_data) {
                return edge_data.source.y;
            })
            .attr("x2", function (edge_data) {
                return edge_data.target.x;
            })
            .attr("y2", function (edge_data) {
                return edge_data.target.y;
            });

        g.attr("transform", function (node_data) {
            return "translate(" + node_data.x + "," + node_data.y + ")";
        });
    });
});

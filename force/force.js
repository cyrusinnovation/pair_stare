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

function has_endpoint_on(line, data) {
    return line.source === data || line.target === data;
}
function find_node_by_name(name) {
    return d3.select("g[data-name='" + name + "']");
}
function find_incident_edges(data) {
    return svg.selectAll("line").filter(function (line, index) {
        return has_endpoint_on(line, data);
    });
}
function style_adjacent_nodes(data, style_function) {
    find_incident_edges(data).each(function (edge) {
        style_function(find_node_by_name(edge.target.name).select("circle"));
        style_function(find_node_by_name(edge.source.name).select("circle"));
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
        .attr("class", "link")
        .style("stroke-width", 1);

    var g = svg.selectAll("circle.node")
        .data(json.nodes)
        .enter().append("g")
        .attr("data-name", function (data) {
            return data.name;
        })
        .attr("class", "node")
        .attr("transform", function (data) {
            return "translate(" + (data.x * 400 + 100) + "," + (data.y * 400 + 100) + ")";
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
        .text(function (d) {
            return d.name;
        });

    var circle = svg.selectAll("circle")
        .on("mouseover", function (data, index) {
            circle = d3.select(this);
            style_adjacent_nodes(data, highlight);
        })
        .on("mouseout", function (data, index) {
            circle = d3.select(this);
            style_adjacent_nodes(data, unhighlight);
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

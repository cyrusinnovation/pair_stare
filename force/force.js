var width = $(window).width(),
    height = width / 1.4;

var force = d3.layout.force()
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

function unhighlight_edge(edge) {
    edge.style("stroke-width", 1);
    edge.style("stroke", "darkgray");
}

function highlight(circle) {
    circle.style("fill", "steelblue");
}

function highlight_edge(edge) {
    edge.style("stroke-width", 10);
    edge.style("stroke", "darkgreen");
}

function has_endpoint_on(edge_data, node_data) {
    return edge_data.source === node_data || edge_data.target === node_data;
}


function find_incident_edges(node_data) {
    return svg.selectAll("line").filter(function (edge_data) {
        return has_endpoint_on(edge_data, node_data);
    });
}

function style_adjacent_nodes(node_data, style_function) {
    find_incident_edges(node_data).each(function (edge_data) {
        style_function(d3.select("#node_" + edge_data.target.index).select("circle"));
        style_function(d3.select("#node_" + edge_data.source.index).select("circle"));
    });
}

function style_incident_edges(node_data, style_function) {
    find_incident_edges(node_data).each(function(edge_data){
        style_function(d3.select("#edge_" + edge_data.index));
    });
}

function translate_onto_page(normalized_coordinate, scale_factor, padding) {
    return normalized_coordinate * ($(window).width() / scale_factor - padding) + padding / 2;
}

d3.json("ps_final.json", function (json) {
    for (var i in json.nodes) {
        var node = json.nodes[i];
        node.x = translate_onto_page(node.x, 1, 100);
        node.y = translate_onto_page(node.y, 1.4, 100);
    }

    for (var j in json.links) {
        json.links[j]["index"] = j;
    }

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
    unhighlight_edge(link);

    var g = svg.selectAll("circle.node")
        .data(json.nodes)
        .enter().append("g")
        .attr("id", function (node_data) {
            return "node_" + node_data.index;
        })
        .attr("class", "node")
        .attr("transform", function (node_data) {
            return "translate(" + node_data.x + "," + node_data.y + ")";
        });
    var circle = g.append("circle")
        .attr("class", "node")
        .attr("r", 25);
    unhighlight(circle);

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
            style_incident_edges(node_data, highlight_edge)
        })
        .on("mouseout", function (node_data) {
            style_adjacent_nodes(node_data, unhighlight);
            style_incident_edges(node_data, unhighlight_edge)
        });
});

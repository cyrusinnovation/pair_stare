var width = Math.max($(window).width(), 1000),
    height = width / 1.4;

var layout = d3.layout.force()
    .size([width, height]);

var svg = d3.select("#chart").append("svg")
    .attr("width", width - 25)
    .attr("height", height);

function brighten(g) {
    circle = g.select("circle");
    circle.style("fill", "lightgoldenrodyellow");
    circle.style("stroke", "goldenrod");

    text = g.select("text");
    text.style("fill", "black")
}

function brighten_edge(edge) {
    edge.style("stroke", "skyblue");
}

function dim(g) {
    circle = g.select("circle");
    circle.style("fill", "whitesmoke");
    circle.style("stroke", "whitesmoke");

    text = g.select("text");
    text.style("fill", "gray")
}

function dim_edge(edge) {
    edge.style("stroke", "whitesmoke");
}

function has_endpoint_on(edge_data, node_data) {
    return edge_data.source === node_data || edge_data.target === node_data;
}

function find_incident_edges(node_data) {
    return svg.selectAll("line").filter(function (edge_data) {
        return has_endpoint_on(edge_data, node_data);
    });
}

function find_unrelated_edges(node_data) {
    return svg.selectAll("line").filter(function (edge_data) {
        return !has_endpoint_on(edge_data, node_data);
    });
}

function style_adjacent_nodes(node_data, adjacent_style, nonadjacent_style) {
    nonadjacent_style(d3.selectAll("g"));
    find_incident_edges(node_data).each(function (edge_data) {
        adjacent_style(d3.select("#node_" + edge_data.target.index));
        adjacent_style(d3.select("#node_" + edge_data.source.index));
    });
}

function style_unrelated_edges(node_data, unrelated_style) {
    find_unrelated_edges(node_data).each(function(edge_data){
        unrelated_style(d3.select("#edge_" + edge_data.index));
    });
}

function translate_onto_page(normalized_coordinate, scale_factor, padding) {
    return normalized_coordinate * (width / scale_factor - padding) + padding / 2;
}

function calculate_degree(node_id, edge_json) {
    var degree = 0;
    for (var i in edge_json) {
        if(edge_json[i].source.toString() === node_id || edge_json[i].target.toString() === node_id) {
            degree++;
        }
    }
    return degree;
}

d3.json("pair_stare.json", function (json) {
    for (var i in json.nodes) {
        var node = json.nodes[i];
        node.x = translate_onto_page(node.x, 1, 150);
        node.y = translate_onto_page(node.y, 1.4, 100);
        node.degree = calculate_degree(i, json.links);
    }

    for (var j in json.links) {
        json.links[j]["index"] = j;
    }

    layout
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
    brighten_edge(link);

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
        .attr("r", function(node_data) {
            return (node_data.degree + 5) * 2;
        });
    brighten(g);

    var text = g.append("text")
        .attr("dy", "-0.3em")
        .text(function (node_data) {
            return node_data.name.split(" ")[0];
        });
    text.append("tspan")
        .attr("x", 0)
        .attr("dy", "1.3em")
        .text(function (node_data) {
            return node_data.name.split(" ")[1];
        });

    svg.selectAll("g")
        .on("mouseover", function (node_data) {
            style_adjacent_nodes(node_data, brighten, dim);
            style_unrelated_edges(node_data, dim_edge)
        })
        .on("mouseout", function (node_data) {
            style_adjacent_nodes(node_data, brighten, brighten);
            style_unrelated_edges(node_data, brighten_edge)
        });
});

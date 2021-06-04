// Artists Graph d3 Visualisation

//Credits to:
// - Graph with hover: https://bl.ocks.org/almsuarez/4333a12d2531d6c1f6f22b74f2c57102
// - Add/remove nodes: https://bl.ocks.org/sgcc/7ad094c9acd1877785ee39cde67eb6c7
// - Shortest path algorithm: https://stackoverflow.com/questions/32527026/shortest-path-in-javascript


//
let zoomScale = 1;
const PATH_LENGTH_THRESHOLD = 3; // Filter the arcs path value to improve loading time.

// Settings values
let displayArcs = false;
let displayRelated = false;
let displayArtistText = false;
let displayForce = false;
let displayLegend = true;
let displayTooltip = false;

/**
 * Disable settings button
 * @param name
 */
function disable_button(name) {
    let span = $(`#button-${name}`);
    let toggle = $(`#toggle-${name}`);

    span.css("pointer-events", "none");
    span.css("opacity", "0.6");
    toggle.prop('disabled', true);
    toggle.removeProp('checked');
}

/**
 * Enable settings button
 * @param name
 */
function enable_button(name) {

    let span = $(`#button-${name}`);
    let toggle = $(`#toggle-${name}`);

    span.css("pointer-events", "auto");
    span.css("opacity", "1");
    toggle.prop('disabled', false);

}

// Settings buttons
$("#toggle-force").click(() => {
    displayForce = !!$("#toggle-force").is(':checked');

    if (displayForce) {
        disable_button('arcs');
        displayArcs = false;
        disable_button('texts');
        displayArtistText = false;


        //$("#button-arcs").prop('fill-opacity', 0.5);
    } else {

        enable_button('arcs');
        enable_button('texts');

    }
    $.ajax() // update graph
});

$("#toggle-texts").click(() => {
    displayArtistText = !!$("#toggle-texts").is(':checked');
    $.ajax() // update graph
});

$("#toggle-tooltip").click(() => {
    displayTooltip = !!$("#toggle-tooltip").is(':checked');
    $.ajax() // update graph
});

$("#toggle-legend").click(() => {
    displayLegend = !!$("#toggle-legend").is(':checked');
    $.ajax() // update graph
});

$("#toggle-related").click(() => {
    displayRelated = !!$("#toggle-related").is(':checked');
    $.ajax() // update graph
});

$("#toggle-arcs").click(() => {
    displayArcs = !!$("#toggle-arcs").is(':checked');

    if (displayArcs) {
        disable_button('force');
        displayForce = false;
        disable_button('texts');
        displayArtistText = false;
        disable_button('related');
        displayRelated = false;
        //$("#button-arcs").prop('fill-opacity', 0.5);
    } else {

        enable_button('force');
        enable_button('texts');
        enable_button('related');

    }
    $.ajax() // update graph
});

// Playlists colors
let color = d3.scaleOrdinal(d3.schemeCategory10);

// Tooltip
let tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Global variables
let related_artists = new Map();
let artists_id_to_name = new Map();
const linkedByIndex = {};

// Wait for graph-data and related artists data are loaded
$(document).ajaxStop(function () {

        // Graph viz global variables
        let g = new Graph();

        let songs_map = build_songs_map();
        let all_tracks_id = get_all_tracks();
        let all_artists_id = get_all_artists();

        // Create variables for d3 viz
        let width, height;
        let chartWidth, chartHeight;
        let margin;
        d3.select("#graph-artists").html('');
        let svg = d3.select("#graph-artists").append("svg");
        let gDraw;
        let simulation;
        let data;

        // Run graph viz
        main();

        /**
         * Graph d3 visualization
         */
        function main() {

            let graph = build_graph();
            //console.log(graph);

            //  Build first link
            graph.links.forEach(d => {
                linkedByIndex[`${d.source},${d.target}`] = 1;
            });

            data = {
                nodes: graph.nodes,
                links: graph.links,
                arcs: graph.arcs
            };

            set_graph_size();
            draw_tracks(data);
            if (displayLegend) {
                draw_legend();
            }
        }

        /**
         * Return all artists ids
         * @returns {Set<String>} artists id
         */
        function get_all_artists() {
            let artists_id = new Set();
            for (let track_id of all_tracks_id) {
                for (let artist of songs_map.get(track_id).artists) {
                    if (!artists_id.has(artist)) {
                        artists_id.add(artist.id);
                        artists_id_to_name.set(artist.id, artist.name);
                        get_related_artists(artist.id)
                    }
                }
            }
            return artists_id;
        }

        /**
         * Build map of track id to track data
         * @returns {Map<String, Object>}
         */
        function build_songs_map() {
            let songs = new Map();

            for (let playlist of graph_data) {
                for (let track of playlist.tracks) {
                    let track_data = track;
                    track_data.playlist_name = playlist.playlist_name;
                    track_data.playlist_color = playlist.playlist_color;
                    songs.set(track.id, track_data);
                }
            }

            return songs
        }


        /**
         * Get all the tracks from selected playlists
         * @returns {[]} list of tracks
         */
        function get_all_tracks() {
            let tracks = [];
            for (let playlist of graph_data) {
                for (let track of playlist.tracks) {
                    tracks.push(track.id)
                }
            }
            return tracks
        }

        /**
         * Return scale with playlists and artist node color
         * @returns {*}
         */
        function get_legend_scale() {
            let legend_items = graph_data.map(p => p.playlist_name);
            let legend_colors = graph_data.map(p => p.playlist_color);

            // Add artist nodes legend
            legend_items.push('Artists');
            legend_colors.push(8);

            return d3.scaleOrdinal()
                .domain(legend_items).range(legend_colors.map(c => color(c)))
        }

        /**
         * Given an artist id, get the list of related artists
         * @param artist_id
         * @returns {null|[]} null if require ajax request, list of artist id otherwise
         */
        function get_related_artists(artist_id) {

            if (related_artists.has(artist_id)) {
                return related_artists.get(artist_id)
            } else {
                $.ajax({
                    url: `https://api.spotify.com/v1/artists/${artist_id}/related-artists`,
                    headers: headers,
                    success: function (response) {
                        let related = response.artists.map(a => clean_artist_data(a));
                        related_artists.set(artist_id, related);
                    }
                });
                return null
            }

        }

        /**
         * Convert radial index to x, y coordinates. an index (pos), total number of points on circle (total) and a radius scale (scale) return the equivalent x, y coordinates
         * @param pos Index for the node
         * @param total total number of points on circle
         * @param scale radius scale
         * @returns {{x: number, y: number}}
         */
        function compute_coordinates(pos, total, scale = 1) {
            const rad = (pos / total) * 2 * Math.PI;

            return {x: Math.cos(rad) * scale, y: Math.sin(rad) * scale}
        }

        /**
         * Build a node object for the graph
         * @param id
         * @param label
         * @param pos_x
         * @param pos_y
         * @param color
         * @param layer (0: tracks, 1: artists, 2: related artists)
         * @param r radius
         * @returns {{pos_y: *, r: number, pos_x: *, color: *, label: *, id: *, layer: number}}
         */
        function build_node(id, label, pos_x, pos_y, color, layer = 0, r = 10) {
            return {
                label: label, r: r, id: id, pos_x: pos_x, pos_y: pos_y, color: color, layer: layer
            }
        }

        /**
         * Return true if nodes a and b are directly connected
         * @param a
         * @param b
         * @returns {*|boolean}
         */
        function isConnected(a, b) {
            return linkedByIndex[`${a.id},${b.id}`] || linkedByIndex[`${b.id},${a.id}`] || a.id === b.id;
        }

        /**
         * Build nodes and links from playlist tracks and artists
         * @returns {{nodes: [], links: [], arcs: []}}
         */
        function build_graph() {


            let nodes = [];
            let links = [];
            let arcs = [];

            const layer_0_scale = 6;
            const layer_2_scale = 4;
            const layer_1_scale = 5;

            let layer_2_artists = new Set();
            let l1_links = new Map();
            zoomScale = find_related_artists();
            const global_scale = 4 * zoomScale;

            build_track_nodes();
            // Add artist nodes
            build_artists_node_links();
            build_new_related_artists_node_links();
            // Build arcs graph
            g = new Graph();
            for (let l of links) {
                g.addEdge(l.source, l.target);
            }
            // Build arcs
            build_arcs();

            function build_arcs() {
                if (displayArcs) {
                    for (let n of nodes) {
                        if (n.layer === 0) {
                            for (let n2 of nodes) {
                                if (n2.layer === 0) {
                                    let path_length = shortestPath(g, n.id, n2.id);
                                    if (path_length > 0 && path_length <= PATH_LENGTH_THRESHOLD) {
                                        arcs.push({source: n, target: n2, color: path_length});
                                    }
                                }
                            }
                        }
                    }
                }

                return arcs

            }

            function build_track_nodes() {
                let track_node_pos = 0;
                for (let track_id of all_tracks_id) {
                    let coordinates = compute_coordinates(track_node_pos, all_tracks_id.length, global_scale * layer_0_scale);
                    let track_data = songs_map.get(track_id);
                    let track_node = build_node(track_id, track_data.name, coordinates.x, coordinates.y,
                        track_data.playlist_color, 0, Math.log(global_scale) * 4);
                    nodes.push(track_node);

                    track_node_pos += 1;
                }
            }

            function build_artists_node_links() {
                // Build artists nodes
                let artist_node_pos = 0;
                for (let artist_id of all_artists_id) {
                    let artist_coordinates = compute_coordinates(artist_node_pos, all_artists_id.size, global_scale * layer_1_scale);
                    //TODO Change nodes color
                    let artist_node = build_node(artist_id, artists_id_to_name.get(artist_id),
                        artist_coordinates.x, artist_coordinates.y, 8, 1, Math.log(global_scale) * 4);

                    nodes.push(artist_node);
                    artist_node_pos += 1;

                    for (let track_id of all_tracks_id) {

                        let track_artists_id = songs_map.get(track_id).artists.map(a => a.id);
                        if (track_artists_id.includes(artist_id)) {
                            links.push({source: track_id, target: artist_id, layer: 0})
                        }
                    }
                }

            }

            function find_related_artists() {

                for (let artist_id of all_artists_id) {
                    let r_artists = get_related_artists(artist_id);

                    if (r_artists !== null) {
                        for (let related_artist of r_artists) {
                            if (!all_artists_id.has(related_artist.id)) {
                                // If new related artist
                                if (!layer_2_artists.has(related_artist.id)) {
                                    artists_id_to_name.set(related_artist.id, related_artist.name);
                                    layer_2_artists.add(related_artist.id);
                                    l1_links.set(related_artist.id, [artist_id]);
                                } else {
                                    // At least two artist are related to this new artist;
                                    l1_links.get(related_artist.id).push(artist_id);
                                }

                            } else {
                                // Add links for already existing nodes
                                links.push({source: artist_id, target: related_artist.id, layer: 0})
                            }
                        }
                    }

                }

                return [...l1_links.values()].filter(x => (x.length > 1)).length


            }

            function build_new_related_artists_node_links() {

                let layer_2_pos = 0;
                for (let r_id of layer_2_artists) {
                    // Do not add nodes that have less than 2 links.
                    if (l1_links.get(r_id).length > 1) {

                        // Add node
                        let a_coordinates = compute_coordinates(layer_2_pos, zoomScale, global_scale * layer_2_scale);
                        let a_node = build_node(r_id, artists_id_to_name.get(r_id), a_coordinates.x, a_coordinates.y, 8, 2, Math.log(global_scale) * 2);
                        nodes.push(a_node);
                        layer_2_pos += 1;

                        // Add links
                        for (let a_id of l1_links.get(r_id)) {
                            links.push({source: a_id, target: r_id, layer: 1})
                        }
                    }

                }

            }

            return {nodes: nodes, links: links, arcs: arcs};

        }

        /**
         * Set d3 graph visualization  size
         */
        function set_graph_size() {
            width = document.querySelector("#graph-artists").clientWidth;
            height = document.querySelector("#graph-artists").clientHeight;

            margin = {top: 0, left: 0, bottom: 0, right: 0};

            chartWidth = width - (margin.left + margin.right);
            chartHeight = height - (margin.top + margin.bottom);

            svg.attr("width", width).attr("height", height)
                .attr("style", "outline: thin solid white;");
            // Add border
            //TODO: Add back zoom
            //.call(d3.zoom().on("zoom", function () {svg.attr("transform", d3.event.transform)}));


            gDraw = svg.append('g');
            let zoom = d3.zoom().on('zoom', zoomed);
            zoom.scaleBy(svg, 1 / Math.sqrt(zoomScale));
            svg.call(zoom);


            function zoomed() {
                gDraw.attr('transform', d3.event.transform);
            }

        }

        /**
         * Draw the legend element on the visualization
         */
        function draw_legend() {


            svg.append("g")
                .attr("class", "legendSequential")
                .attr("transform", "translate(" + (width - 140) + "," + (height - 200) + ")")
                .style('fill', '#FFF');


            const legendSequential = d3.legendColor()
                .shapeWidth(30)
                .orient("vertical")
                .title("Legend:")
                .titleWidth(100)
                .scale(get_legend_scale());

            svg.select(".legendSequential")
                .call(legendSequential);
        }


        /**
         * Draw the nodes, Links, Arcs, Labels
         * @param data
         */
        function draw_tracks(data) {


            let forceLink = d3.forceLink().id(d => d.id).iterations(10);
            if (!displayForce) {
                forceLink = forceLink.strength(0).distance(200);
            }

            simulation = d3.forceSimulation()
                //.force("charge", d3.forceManyBody().strength(-80))
                .force("link", forceLink) // .strength
                //.force('link', d3.forceLink().id(d => d.id))
                .force("collide", d3.forceCollide(d => d.r + 8).iterations(16))
                .force('center', d3.forceCenter(chartWidth / 2, chartHeight / 2))
                //.force("charge", d3.forceManyBody())
                .force("y", d3.forceY(d => d.pos_y))
                .force("x", d3.forceX(d => d.pos_x));


            // Draw graph links

            let link = gDraw.append("g")
                .attr("class", "link")
                .selectAll("line")
                .data(data.links)
                .enter()
                .append("line");


            // Draw graph nodes
            let node = gDraw.append("g")
                .attr("class", "nodes")
                .selectAll("g")
                .data(data.nodes)
                .enter().append("g")
                .on('mouseover.fade', fade(0.1))
                .on('mouseout.fade', fade(1));

            // Add tooltip
            if (displayTooltip) {
                node
                    .on('mouseover', function (d) {
                        tooltip.transition()
                            .duration(300)
                            .style("opacity", 0.9);
                        tooltip.html("<p/>Name: " + d.label + "<p/>Type: " + ((d.layer > 0) ? "Artist" : "Track"))
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY + 10) + "px").style('color', '#000')
                    })
                    .on("mouseout", function () {
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
            }

            // Add node circle
            node.append("circle")
                .attr("r", d => d.r)
                .attr("fill", d => color(d.color));


            // Add node labels
            let labels = node.append("text")
                .text(function (d) {

                    if (displayForce) {
                        return ""
                    }

                    if (d.layer === 0) {
                        return d.label
                    }

                    return displayArtistText ? d.label : "";

                    //return d.layer > 0 ? null : d.label
                })
                .attr("font-size", zoomScale + 'px')
                .attr("fill", d => color(d.color));

            labels
                .attr('y', () => 0)
                .attr('x', d => {
                    const offset = (d.label.length * zoomScale) / 2 + 50;
                    const direction = Math.sign(d.pos_x);
                    return direction * (d.pos_x < 0) ? -offset : 50
                }).attr('transform', function (d) {
                let angle = (Math.atan(d.pos_y / d.pos_x)) * (180) / Math.PI;
                return `rotate(${angle})`
            });


            // Add arcs
            const curve = d3.line().curve(d3.curveCardinal);

            const arcs_color = d3.schemeGreens[4];

            let arcs = gDraw.append("g")
                .attr("class", "arc")
                .selectAll("path")
                .data(data.arcs)
                .enter()
                .append('path')
                .attr('d', d => {

                    const s = d.source;
                    const t = d.target;

                    return curve([[s.x, s.y], [(s.x + t.x) / 4, (s.y + t.y) / 4], [t.x, t.y]])
                })
                .attr('stroke', d => arcs_color[d.color]);

            /**
             * Change graph display from settings display button value
             */
            function settings_display() {
                if (displayForce) {
                    labels.style('fill-opacity', 0);
                    arcs.style('stroke-opacity', 0)
                }

                if (!displayRelated) {

                    node.filter(function (d) {
                        if (d.layer === 2) {
                            return this
                        }
                    }).style('fill-opacity', 0);
                    link.filter(function (d) {
                        if (d.layer === 1) {
                            return this
                        }
                    }).style('stroke-opacity', 0);
                }

                if (displayArcs) {
                    link.style('stroke-opacity', 0);

                    node.filter(function (d) {
                        if (d.layer === 1) {
                            return this
                        }
                    }).style('fill-opacity', 0)
                }

            }

            /**
             * Find nodes that connects two track at artist distance of 1.
             * @param d
             * @returns {Set<unknown>}
             */
            function find_connected_nodes(d) {

                let connected_nodes = new Set();
                connected_nodes.add(d);

                // Find distance 1 nodes and links
                for (let n of data.nodes) {
                    if (isConnected(d, n)) {
                        connected_nodes.add(n)
                    }
                }

                // Find distance 2 tracks
                for (let c of connected_nodes) {
                    if (c.layer === 1) {
                        for (let t of data.nodes) {
                            if (isConnected(c, t) && t.layer === 0 && !connected_nodes.has(t)) {
                                connected_nodes.add(t)
                            }
                        }
                    }
                }
                return connected_nodes
            }

            /**
             * Find the links that connects two track at artist distance of 1.
             * @param connected_nodes
             * @returns {Set<unknown>}
             */
            function find_connected_links(connected_nodes) {
                let connected_links = new Set();
                // Add connected links
                for (let l of data.links) {
                    if (connected_nodes.has(l.source) && connected_nodes.has(l.target)) {
                        connected_links.add(l);
                    }
                }

                return connected_links


            }


            /**
             * Change the opacity of an element when user has mouse on node
             * @param opacity
             * @returns {function(...[*]=)}
             */
            function fade(opacity) {
                return d => {

                    const connected_nodes_set = find_connected_nodes(d);
                    const connected_links_set = find_connected_links(connected_nodes_set);

                    node.style('stroke-opacity', function (o) {

                        let condition = connected_nodes_set.has(o);

                        if (displayArcs) {
                            condition = (shortestPath(g, d.id, o.id) > 0
                                && shortestPath(g, d.id, o.id) <= PATH_LENGTH_THRESHOLD)
                                || d.id === o.id;
                        }

                        const thisOpacity = condition ? 1 : opacity;
                        this.setAttribute('fill-opacity', thisOpacity);
                        return thisOpacity;
                    });

                    link.style('stroke-opacity', o => (connected_links_set.has(o) ? 1 : opacity));
                    arcs.style('stroke-opacity', o => o.source.id === d.id || o.target.id === d.id ? 1 : opacity);

                    settings_display()

                };
            }

            /**
             * Update svg elements after simulation updates
             */
            const ticked = function () {

                node.attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });


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


                arcs.attr('d', d => {
                    const s = d.source;
                    const t = d.target;

                    return curve([[s.x, s.y], [(s.x + t.x) / 4, (s.y + t.y) / 4], [t.x, t.y]])
                });
            };

            // Apply simulation
            simulation.nodes(data.nodes).on('tick', ticked);
            simulation.force("link").links(data.links);
            settings_display()

        }


    }
);


/**
 * Store artists and tracks in graph object to compute paths for Arcs display
 * @returns {Graph}
 * @constructor
 */
function Graph() {

    let neighbors = this.neighbors = {}; // Key = vertex, value = array of neighbors.

    this.addEdge = function (u, v) {
        if (neighbors[u] === undefined) {  // Add the edge u -> v.
            neighbors[u] = [];
        }
        neighbors[u].push(v);
        if (neighbors[v] === undefined) {  // Also add the edge v -> u so as
            neighbors[v] = [];               // to implement an undirected graph.
        }                                  // For a directed graph, delete
        neighbors[v].push(u);              // these four lines.
    };

    return this;
}

/**
 * Given a graph and two nodes, compute the shortest path between them.
 * @param graph
 * @param source
 * @param target
 * @returns {number}
 */
function shortestPath(graph, source, target) {
    if (source === target) {
        return 0; // We do not want to build arcs for same node
    }

    let queue = [source],
        visited = {source: true},
        predecessor = {},
        tail = 0;
    while (tail < queue.length) {
        let u = queue[tail++],  // Pop a vertex off the queue.
            neighbors = graph.neighbors[u];
        if (neighbors === undefined) {
            return -1
        }
        for (let i = 0; i < neighbors.length; ++i) {
            const v = neighbors[i];
            if (visited[v]) {
                continue;
            }
            visited[v] = true;
            if (v === target) {   // Check if the path is complete.
                const path = [v];   // If so, backtrack through the path.
                while (u !== source) {
                    path.push(u);
                    u = predecessor[u];
                }
                path.push(u);
                path.reverse();

                return path.length - 2; // Remove 2 for the first connection Track -> Artist

            }
            predecessor[v] = u;
            queue.push(v);
        }
    }
    return -1;
}
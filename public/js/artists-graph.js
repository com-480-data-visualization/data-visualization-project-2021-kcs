// Artists Graph d3 Visualisation

//Credits to:
// -- https://bl.ocks.org/heybignick/3faf257bbbbc7743bb72310d03b86ee8
// -- https://bl.ocks.org/pkerpedjiev/f2e6ebb2532dae603de13f0606563f5b
// - Graph with hover: https://bl.ocks.org/almsuarez/4333a12d2531d6c1f6f22b74f2c57102
// - Add/remove nodes: https://bl.ocks.org/sgcc/7ad094c9acd1877785ee39cde67eb6c7


// TODO: Add  $(document).ajaxStop( ) wrapper and remove example data


//
// console.log('Graph data');
//console.log(graph_data);

let related_artists = new Map();
let artists_id_to_name = new Map();
const linkedByIndex = {};

$(document).ajaxStop(function () {

        /** Reset graph **/


            // Create of Map of songs
        let songs_map = build_songs_map();
        let all_tracks_id = get_all_tracks();
        let all_artists_id = get_all_artists();


        let width, height;
        let chartWidth, chartHeight;
        let margin;
        d3.select("#graph-artists").html('');
        let svg = d3.select("#graph-artists").append("svg");
        let gDraw;
        let chartLayer = svg.append("g").classed("chartLayer", true);
        let simulation;

        let data;

        let color = d3.scaleOrdinal()
            .domain([1, 2, 3, 4, 5, 6, 7, 8, 9])
            .range(["#FF0000", "#80FF00", "#00C9FF", "#FFFB00", "#FF00F7", "#FFC500", "#00FFA2", "#8F00FF", "#0013FF"]);

        main();


        function main() {

            let graph = build_graph();
            //console.log(graph);

            graph.links.forEach(d => {
                linkedByIndex[`${d.source},${d.target}`] = 1;
            });

            data = {
                nodes: graph.nodes,
                links: graph.links
            };

            set_graph_size();
            draw_tracks(data);
            draw_legend();
        }


        function build_songs_map() {
            let songs = new Map();
            let pos = 0;

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

        function get_all_tracks() {
            let tracks = [];
            for (let playlist of graph_data) {
                for (let track of playlist.tracks) {
                    tracks.push(track.id)
                }
            }
            return tracks
        }

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

        function get_legend_scale() {
            let legend_items = graph_data.map(p => p.playlist_name);
            let legend_colors = graph_data.map(p => p.playlist_color);

            // Add artist nodes legend
            legend_items.push('Artists');
            legend_colors.push(8);

            let scale = d3.scaleOrdinal()
                .domain(legend_items).range(legend_colors.map(c => color(c)));

            return scale
        }

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

        function compute_coordinates(pos, total, scale = 1) {
            const rad = (pos / total) * 2 * Math.PI;
            //console.log(pos, rad, total, scale)

            return {x: Math.cos(rad) * scale, y: Math.sin(rad) * scale}
        }

        function build_node(id, label, pos_x, pos_y, color, layer = 0, r = 10) {
            return {
                label: label, r: r, id: id, pos_x: pos_x, pos_y: pos_y, color: color, layer: layer
            }
        }

        function isConnected(a, b) {
            //console.log(a, b);
            return linkedByIndex[`${a.id},${b.id}`] || linkedByIndex[`${b.id},${a.id}`] || a.id === b.id;
        }


        function build_graph() {


            const global_scale = 4*all_tracks_id.length;
            const layer_0_scale = 6;
            const layer_2_scale = 4;
            const layer_1_scale = 5;

            let track_node_pos = 0;
            let nodes = [];
            let links = [];

            // Add tracks nodes
            for (let track_id of all_tracks_id) {
                //console.log(songs_map.get(track_id).name);
                let coordinates = compute_coordinates(track_node_pos, all_tracks_id.length, global_scale * layer_0_scale);
                let track_data = songs_map.get(track_id);
                let track_node = build_node(track_id, track_data.name, coordinates.x, coordinates.y,
                    track_data.playlist_color, 0, Math.log(global_scale) * 4);
                nodes.push(track_node);

                track_node_pos += 1;
            }

            // Compute artists

            let artist_node_pos = 0;

            for (let artist_id of all_artists_id) {
                let artist_coordinates = compute_coordinates(artist_node_pos, all_artists_id.size, global_scale * layer_1_scale)
                //TODO Change nodes color
                let artist_node = build_node(artist_id, artists_id_to_name.get(artist_id),
                    artist_coordinates.x, artist_coordinates.y, 8, 1,Math.log(global_scale) * 3);
                nodes.push(artist_node);
                artist_node_pos += 1;

                for (let track_id of all_tracks_id) {

                    let track_artists_id = songs_map.get(track_id).artists.map(a => a.id);
                    if (track_artists_id.includes(artist_id)) {
                        links.push({source: track_id, target: artist_id})
                    }
                }
            }

            // Compute layer 2 related artists
            let layer_2_artists = new Set();
            let l1_links_count = new Map();
            let l1_links = new Map();

            // Create existing artist related links
            for (let artist_id of all_artists_id) {
                let r_artists = get_related_artists(artist_id);
                //console.log('related artists');
                //console.log(r_artists);

                if (r_artists !== null) {
                    for (let related_artist of r_artists) {
                        if (!all_artists_id.has(related_artist.id)) {
                            // If new related artist
                            if (!layer_2_artists.has(related_artist.id)) {
                                artists_id_to_name.set(related_artist.id, related_artist.name)
                                layer_2_artists.add(related_artist.id);
                                l1_links.set(related_artist.id, [artist_id]);
                            } else {
                                // At least two artist are related to this new artist;
                                l1_links.get(related_artist.id).push(artist_id);
                                //console.log(l1_links);
                            }

                        } else {
                            // Add links for already existing nodes
                            links.push({source: artist_id, target: related_artist.id})
                        }
                    }
                }

            }


            // Add layer1 nodes and links
            const layer_2_count = [...l1_links.values()].filter(x => (x.length > 1)).length
            let layer_2_pos = 0;
            for (let r_id of layer_2_artists) {

                // Do not add nodes that have less than 2 links.
                if (l1_links.get(r_id).length > 1) {

                    // Add node
                    let a_coordinates = compute_coordinates(layer_2_pos, layer_2_count, global_scale * layer_2_scale);
                    //console.log(a_coordinates);
                    let a_node = build_node(r_id, artists_id_to_name.get(r_id), a_coordinates.x, a_coordinates.y, 8, 2, Math.log(global_scale) * 2);
                    //console.log(a_node);
                    nodes.push(a_node);
                    layer_2_pos += 1;

                    // Add links
                    for (let a_id of l1_links.get(r_id)) {
                        links.push({source: a_id, target: r_id})
                    }
                }

            }





            //console.log(`Layer 1 length ${layer_1_artists.size}`);

            return {nodes: nodes, links: links};

        }

        function set_graph_size() {
            width = document.querySelector("#graph-artists").clientWidth;
            height = document.querySelector("#graph-artists").clientHeight;

            margin = {top: 0, left: 10, bottom: 0, right: 0};

            chartWidth = width - (margin.left + margin.right);
            chartHeight = height - (margin.top + margin.bottom);

            svg.attr("width", width).attr("height", height)
                .attr("style", "outline: thin solid white;")
            // Add border
            //TODO: Add back zoom
            //.call(d3.zoom().on("zoom", function () {svg.attr("transform", d3.event.transform)}));


            chartLayer
                .attr("width", chartWidth)
                .attr("height", chartHeight)
                .attr("transform", "translate(" + [margin.left, margin.top] + ")")

            gDraw = svg.append('g');
            let zoom = d3.zoom().on('zoom', zoomed)
            //zoom.scaleBy(svg, 2/Math.sqrt(all_tracks_id.length));
            svg.call(zoom);


            function zoomed() {
                gDraw.attr('transform', d3.event.transform);
            }

        }

        function draw_legend() {


            svg.append("g")
                .attr("class", "legendSequential")
                .attr("transform", "translate(" + (width - 140) + "," + (height - 200) + ")")
                .style('fill', '#FFF');


            var legendSequential = d3.legendColor()
                .shapeWidth(30)
                .orient("vertical")
                .title("Legend:")
                .titleWidth(100)
                .scale(get_legend_scale());

            svg.select(".legendSequential")
                .call(legendSequential);
        }

        function click_node(d) {
            console.log('Node click!');
            console.log(d.id);
            console.log(d.label);

            if (d.layer === 1) {
                let related = get_related_artists(d.id);

                console.log(`Related of ${d.id} are: ${related.map(a => a.name)}`);
            }
        }

        function draw_tracks(data) {

            let data_nodes = data.nodes;
            let data_links = data.links;

            simulation = d3.forceSimulation()
                //.force("charge", d3.forceManyBody().strength(-80))
                .force("link", d3.forceLink().id(d => d.id).strength(0).iterations(10))
                //.force('link', d3.forceLink().id(d => d.id))
                .force("collide", d3.forceCollide(d => d.r + 8).iterations(16))
                .force('center', d3.forceCenter(chartWidth / 2, chartHeight / 2))
                //.force("charge", d3.forceManyBody())
                .force("y", d3.forceY(d => d.pos_y))
                .force("x", d3.forceX(d => d.pos_x));

            let tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            let node = gDraw.append("g")
                .attr("class", "nodes")
                .selectAll("g")
                .data(data_nodes)
                .enter().append("g")
                .on('mousedown', d => click_node(d))
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
                }).on('mouseover.fade', fade(0.1)).on('mouseout.fade', fade(1));

            let link = gDraw.append("g")
                .attr("class", "link")
                .selectAll("line")
                .data(data_links)
                .enter()
                .append("line");
            link.on('mouseout.fade', fade(1));


            let circles = node.append("circle")
                .attr("r", d => d.r)
                .attr("fill", d => color(d.color));

            let labels = node.append("text")
                .text(function (d) {
                    return d.layer > 0 ? null : d.label
                })
                .attr("font-size", all_artists_id.size + 'px')
                .attr("fill", d => color(d.color));

            labels.attr('y', d => {
                const direction = Math.sign(d.pos_x);
                const offset = 20;
                return 0 //direction * offset;
            }).attr('x', d => {
                //const offset = labels.nodes().select(d2 => d2.id = d.id).getComputedTextLength()
                const offset = (d.label.length*all_artists_id.size)/2 +  20
                const direction = Math.sign(d.pos_x)
                return direction * (d.pos_x < 0) ? -offset : 20
            }).attr('transform', function (d) {
                let angle = (Math.atan(d.pos_y / d.pos_x)) * (180) / Math.PI;
                return `rotate(${angle})`
            });




            function fade(opacity) {
                return d => {
                    node.style('stroke-opacity', function (o) {

                        const thisOpacity = isConnected(d, o) ? 1 : opacity;
                        this.setAttribute('fill-opacity', thisOpacity);
                        return thisOpacity;
                    });


                    link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));

                };
            }

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

            };


            simulation.nodes(data_nodes).on('tick', ticked)
            simulation.force("link").links(data_links);
        }


    }
); // TODO: Remove ()
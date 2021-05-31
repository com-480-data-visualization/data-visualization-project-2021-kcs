// Artists Graph d3 Visualisation

//Credits to:
// -- https://bl.ocks.org/heybignick/3faf257bbbbc7743bb72310d03b86ee8
// -- https://bl.ocks.org/pkerpedjiev/f2e6ebb2532dae603de13f0606563f5b
// - Graph with hover: https://bl.ocks.org/almsuarez/4333a12d2531d6c1f6f22b74f2c57102
// - Add/remove nodes: https://bl.ocks.org/sgcc/7ad094c9acd1877785ee39cde67eb6c7


// TODO: Add  $(document).ajaxStop( ) wrapper and remove example data
$(document).ajaxStop(function () {

    console.log('Graph data')
    console.log(graph_data)

    // Create of Map of songs

    let related_artists = new Map();
    let songs_map = build_songs_map();
    let all_tracks_id = get_all_tracks();
    let all_artists_id = get_all_artists();

    let width, height;
    let chartWidth, chartHeight;
    let margin;
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

        console.log(graph);

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
        let artists = [];
        for (let track_id of all_tracks_id) {
            for (let artist of songs_map.get(track_id).artists) {
                artists.push(artist.id);
                get_related_artists(artist.id)
            }
        }
        return artists
    }

    function get_legend_scale() {
        let legend_items = graph_data.map(p => p.playlist_name);
        let legend_colors = graph_data.map(p => p.playlist_color);

        // Add artist nodes legend
        legend_items.push('Artists');
        legend_colors.push(8);

        let scale = d3.scaleOrdinal()
            .domain(legend_items ).range(legend_colors.map(c => color(c)));

        return scale
    }

    function get_related_artists(artist_id) {

        if (related_artists.has(artist_id)) {
            return related_artists.get(artist_id)
        } else {
            $.ajax({
                url: `https://api.spotify.com/v1/artists/${artist_id}/related-artists`,
                headers: headers,
                global: false,
                success: function (response) {
                    let related = response.artists.map(a => clean_artist_data(a));
                    related_artists.set(artist_id, related);
                }
            });
            return null
        }

    }

    function compute_coordinates(pos, total, scale = 100) {
        const rad = (pos / total) * 2 * Math.PI;

        return {x: Math.cos(rad) * scale, y: Math.sin(rad) * scale}
    }

    function build_node(id, label, pos_x, pos_y, color, is_artist=true,  r=4)
    {
        return {
            label: label, r: r, id: id, pos_x:pos_x, pos_y:pos_y, color:color, is_artist: is_artist
        }
    }

    function get_artist_count() {
        return all_tracks_id.map(i => songs_map.get(i).artists.length).reduce((a, b) => a+b, 0)
    }

    function build_graph() {

        let track_node_pos = 0;
        let track_nodes_level = 400;
        let nodes = [];
        let links = [];

        // Add tracks nodes
        for (let track_id of all_tracks_id) {
            //console.log(songs_map.get(track_id).name);
            let coordinates = compute_coordinates(track_node_pos, all_tracks_id.length, track_nodes_level);
            let track_data = songs_map.get(track_id);
            let track_node = build_node(track_id, track_data.name, coordinates.x, coordinates.y,
                track_data.playlist_color, false);
            nodes.push(track_node);

            track_node_pos += 1;
        }

        // Compute artists

        let artist_node_pos = 0;
        const artist_nodes_level = 350;

        let artist_count = get_artist_count();

        for (let track_id of all_tracks_id) {
            let track_data = songs_map.get(track_id);
            for (let artist of track_data.artists) {
                let artist_coordinates = compute_coordinates(artist_node_pos, artist_count, artist_nodes_level)
                let artist_node = build_node(artist.id, artist.name, artist_coordinates.x, artist_coordinates.y, 8)
                nodes.push(artist_node);

                links.push({source: track_id, target: artist.id})

                artist_node_pos +=1;
            }
        }

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
        svg.call(zoom);


        function zoomed() {
            gDraw.attr('transform', d3.event.transform);
        }

    }

    function draw_legend() {


        svg.append("g")
            .attr("class", "legendSequential")
            .attr("transform", "translate("+(width-140)+","+(height-200)+")")
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

        if (d.is_artist) {
            let related = get_related_artists(d.id);
            console.log(`Related of ${d.id} are: ${related.map(a => a.name)}`);

            //related_nodes = []

            /**

            for (let r_node of related) {
                r_node = build_node(r_node.id, r_node.name, d.pos_x - 10 , d.pos_y - 10, 8)
                r_node.x = d.pos_x - 10;
                r_node.y = d.pos_y -10;
                data.nodes.push(r_node);
                console.log(data.nodes)
            }

             **/
            //draw_tracks(data);
            //simulation.restart();
            //simulation.alpha(1);

        }


        //nodes.splice(i, 1);
        //links = links.filter(function(l) {
        //return l.source !== d && l.target !== d;
        //});
        //d3.event.stopPropagation();
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
            .on('mousedown', d=> click_node(d))
            .on('mouseover', function(d) {
                tooltip.transition()
                    .duration(300)
                    .style("opacity", 0.9);
                console.log(d);
                tooltip.html("<p/>Name: " + d.label + "<p/>Type: " + ((d.is_artist) ? "Artist" : "Track"))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 10) + "px").style('color', '#000')
            })
            .on("mouseout", function() {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        let link = gDraw.append("g")
            .attr("class", "link")
            .selectAll("line")
            .data(data_links)
            .enter()
            .append("line");


        let circles = node.append("circle")
            .attr("r", d => d.r)
            .attr("fill", d => color(d.color));

        let labels = node.append("text")
            .text(function (d) {
                return d.is_artist ? null : d.label
            })
            .attr("fill", d => color(d.color));

        labels.attr('y', d => {
            const direction = Math.sign(d.pos_x);
            const offset = 20;
            return 0 //direction * offset;
        }).attr('x', d => {
            //const offset = labels.nodes().select(d2 => d2.id = d.id).getComputedTextLength()
            const offset = d.label.length * 5 + 30
            const direction = Math.sign(d.pos_x)
            return direction * (d.pos_x < 0) ? -offset : 5
        }).attr('transform', function (d) {
            let angle = (Math.atan( d.pos_y/d.pos_x)) * (180) / Math.PI;
            return `rotate(${angle})`
        });


        function get_diretion(d) {
            return compute_coordinates(d.pos, all_tracks_id.length).x

        }




        /*

        const node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(data.nodes)
            .enter().append("circle")
            .attr("r", d => d.r)
            .style("fill", d =>  color(d.color))

        node.append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function(d) { return "Test" });


         */

        const ticked = function () {

            node.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });




            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

        };



        simulation.nodes(data_nodes).on('tick', ticked)
        simulation.force("link").links(data_links);
    }


}); // TODO: Remove ()
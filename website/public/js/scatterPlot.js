// Wait for data to be imported from the server
$(document).ajaxStop(function () {

// Remove content
    document.getElementById('scatter-plot').innerHTML = "";
    document.getElementById('x-select-button').innerHTML = "";
    document.getElementById('y-select-button').innerHTML = "";

// List of groups (here I have one group per column)
    let features = ["acousticness", "danceability", "energy", "instrumentalness", "liveness", "speechiness", "valence"];

// set the dimensions and margins of the graph
    let margin = {top: 60, right: 60, bottom: 60, left: 60},
        width = 1040 - margin.left - margin.right,
        height = 520 - margin.top - margin.bottom;


// Add the SVG object to the page
    let SVG = d3.select("#scatter-plot")
        .style("background-color", "#10171a")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


// Add audio features to the button
    d3.select("#x-select-button")
        .selectAll('myOptions')
        .data(features)
        .enter()
        .append('option')
        .text(function (d) {
            return d;
        }) // text showed in the menu
        .attr("value", function (d) {
            return d;
        }); // corresponding value returned by the button


// Add audio features to the two button
    d3.select("#y-select-button")
        .selectAll('myOptions')
        .data(features)
        .enter()
        .append('option')
        .text(function (d) {
            return d;
        }) // text showed in the menu
        .attr("value", function (d) {
            return d;
        }); // corresponding value returned by the button


// Add X axis
    let x = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width]);
    SVG.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

// Add Y axis
    let y = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0])
        .nice();
    SVG.append("g")
        .call(d3.axisLeft(y));

// Add X axis label:
    SVG.append("text")
        .attr('id', 'xLabel')
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + margin.top)
        .text("ACOUSTICNESS")
        .style("fill", "white");

// Y axis label:
    SVG.append("text")
        .attr('id', 'yLabel')
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 10)
        .attr("x", -margin.top)
        .text("DANCEABILITY")
        .style("fill", "white");


// Tooltip 
    let tooltip = d3.select("#scatter-plot")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("color", "black")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("width", "50%")
        .style("padding", "10px");


// A function that change this tooltip when the user hover a point.
    let mouseover = function () {
        tooltip.style("opacity", 1)
    };

    let mousemove = function (d) {
        tooltip.html(d[2])
            .style("left", (d3.mouse(this)[0] + 90) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
    };

    let mouseleave = function () {
        tooltip.transition().duration(200)
            .style("opacity", 0)
    };


// Colors to use for each playlist 
    let color = d3.scaleOrdinal()
        .domain([1, 2, 3, 4, 5, 6, 7, 8, 9])
        .range(["#FF0000", "#80FF00", "#00C9FF", "#FFFB00", "#FF00F7", "#FFC500", "#00FFA2", "#8F00FF", "#0013FF"]);

// Basic Customization
    SVG.selectAll(".tick line").attr("stroke", "white");
    SVG.selectAll(".tick text").attr("stroke", "white").style("font-size", 10);


    update('acousticness', 'danceability');


// Update the chart 
    function update(x_axis, y_axis) {

        d3.select('#xLabel')
            .transition()
            .duration(1000)
            .text(x_axis.toUpperCase());

        d3.select('#yLabel')
            .transition()
            .duration(1000)
            .text(y_axis.toUpperCase());


        SVG.selectAll("circle").remove();

        user_data.forEach(function (pl_data) {
            // Add circles
            let dots = SVG.selectAll("circle")
                .data(d3.zip(pl_data[x_axis], pl_data[y_axis], pl_data['tracknames']));

            dots.enter().append("circle")
                .style("fill", function () {
                    return color(pl_data.nb)
                })
                .style("stroke", "white")
                .style("stroke-width", 1)
                .style("opacity", 0.8)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
                .attr("cx", function (d) {
                    return x(d[0]);
                })
                .transition().duration(500)
                .attr("cy", function (d) {
                    return y(d[1]);
                })
                .attr("r", 5)


        });

    }


// When the button is changed, run the updateChart function
    d3.select("#x-select-button").on("change", function () {
        // recover the option that has been chosen
        let x_axis = d3.select("#x-select-button").property("value");
        let y_axis = d3.select("#y-select-button").property("value");
        // run the updateChart function with this selected option
        update(x_axis, y_axis);
    });


// When the button is changed, run the updateChart function
    d3.select("#y-select-button").on("change", function () {
        // recover the option that has been chosen
        let x_axis = d3.select("#x-select-button").property("value");
        let y_axis = d3.select("#y-select-button").property("value");
        // run the updateChart function with this selected option
        update(x_axis, y_axis);
    })


});
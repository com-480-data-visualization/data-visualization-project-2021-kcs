// Wait for data to be imported from the server
$(document).ajaxStop(function () {

// Remove content
document.getElementById('feature-select-button').innerHTML = "";

// set the dimensions and margins of the graph
let margin = {top: 60, right: 60, bottom: 60, left: 60};
let width = 512 - margin.left - margin.right;
let height = 512 - margin.top - margin.bottom;

// List of groups (here I have one group per column)
const features = ["acousticness", "danceability", "energy", "instrumentalness", "liveness", "speechiness", "valence"];

function add_scatter_plot(x_feature, y_feature) {
  var vlSpec = {
    mark: 'point',
    encoding: {
      y: {
        field: y_feature,
        type: 'quantitative',
        axis: {
          title: y_feature
        }
      },
      x: {
        field: x_feature,
        type: 'quantitative',
        axis: {
          title: x_feature
        }
      },
      color: {
        condition: {param: 'brush', field: 'playlist_name', type: 'ordinal'},
        value: "grey"
      }
    }
  }

  return vlSpec

  // Basic Customization
  /*SVG.selectAll(".tick line").attr("stroke", "white");
  SVG.selectAll(".tick text").attr("stroke", "white").style("font-size", 10);*/

  /*user_data.forEach(function (pl_data) {
    // Add circles
    let dots = SVG.selectAll("circle")
        .data(d3.zip(pl_data[x_feature], pl_data[y_feature], pl_data['track_names']));

    dots.enter().append("circle")
        .style("fill", function () {
            return color(pl_data.color)
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
  });*/

  //return SVG
}

function add_histogram(feature) {
  var vlSpec = {
    mark: 'bar',
    transform: [
      {filter: {param: 'brush'}}
    ],
    encoding: {
      x: {
        bin: true,
        field: feature,
        type: 'quantitative',
        axis: {
          title: feature
        }
      },
      y: {
        aggregate: 'count',
        axis: {
          title: 'Count'
        }
      },
      color: {
        field: 'playlist_name',
        type: 'nominal'
      }
    }
  }

  return vlSpec
}

// Add audio features to the button
d3.select("#feature-select-button")
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

// Update the chart 
function update(features) {
  document.getElementById('cross-correlation-grid').innerHTML = "";

  plot_values = []

  user_data.forEach(function (playlist_data) {
    for (i = 0; i < playlist_data[features[0]].length; i++) {
      track = {'track_name': playlist_data['track_names'][i], 'playlist_name': playlist_data.playlist_name}
      for (feature of features) {
        track[feature] = playlist_data[feature][i]
      }
      plot_values.push(track)
    }
  })

  plot_data = {
    values: plot_values
  }

  view_specs = []

  for (x_feature of features) {
    for (y_feature of features) {
      if (x_feature == y_feature) {
        view_specs.push(add_histogram(x_feature))
      } else {
        view_specs.push(add_scatter_plot(x_feature, y_feature))
      }
    }
  }

  vlSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    data: plot_data,
    background: null,
    axis: {
      domainColor: 'white',
      gridColor: 'white',
      labelColor: 'white',
      tickColor: 'white',
      titleColor: 'white'
    },
    legend: {
      labelColor: 'white',
      titleColor: 'white'
    },
    title: {
      color: 'white'
    },
    params: [{name: 'brush', select: 'interval'}],
    columns: features.length,
    concat: view_specs
  }

  vegaEmbed(vlSpec, {actions: false}).then(res => document.getElementById('cross-correlation-grid').append(res))
}

update(['acousticness', 'danceability']);

// When the button is changed, run the updateChart function
d3.select("#feature-select-button").on("change", function () {
    // recover the option that has been chosen
    let features = d3.select("#feature-select-button").property("selectedOptions");
    features = Array.from(features).map(el => el.value)
    // run the updateChart function with this selected option
    console.log(features)
    update(features);
});

})
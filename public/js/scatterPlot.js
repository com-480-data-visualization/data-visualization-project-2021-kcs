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

  radar_values = []

  playlist_counter = 0

  user_data.forEach(function (playlist_data) {
    for (feature of features) {
      playlist_feature = {'key': feature, 'category': playlist_counter}
      feature_value = 0
      for (i = 0; i < playlist_data[features[0]].length; i++) {
        feature_value += playlist_data[feature][i]
      }
      playlist_feature['value'] = Math.round(feature_value)
      
      radar_values.push(playlist_feature)
    }
    playlist_counter += 1
  })

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

  // TODO fix scrolling which zooms selection window and plot itself at the same time

  radarSpec = {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width: 400,
    height: 400,
    padding: 40,
    autosize: {type: 'none', contains: 'padding'},
    signals: [
      {name: 'radius', update: 'width / 2'}
    ],
    data: [
      {
        name: 'table',
        values: radar_values
      },
      {
        name: 'keys',
        source: 'table',
        transform: [
          {
            type: 'aggregate',
            groupby: ['key']
          }
        ]
      }
    ],
    scales: [
      {
        name: 'angular',
        type: 'point',
        range: {signal: '[-PI, PI]'},
        padding: 0.5,
        domain: {data: 'table', field: 'key'}
      },
      {
        name: 'radial',
        type: 'linear',
        range: {signal: '[0, radius]'},
        domain: {data: 'table', field: 'value'},
        domainMin: 0
      },
      {
        name: 'color',
        type: 'ordinal',
        domain: {data: 'table', field: 'category'},
        range: {scheme: 'category10'}
      }
    ],
    encode: {
      enter: {
        x: {signal: 'radius'},
        y: {signal: 'radius'}
      }
    },
    marks: [
      {
        type: 'group',
        name: 'categories',
        zindex: 1,
        from: {
          facet: {data: 'table', name: 'facet', groupby: 'category'}
        },
        marks: [
          {
            type: 'line',
            name: 'category-line',
            from: {data: 'facet'},
            encode: {
              enter: {
                interpolate: {value: 'linear-closed'},
                x: {signal: "scale('radial', datum.value) * cos(scale('angular', datum.key))"},
                y: {signal: "scale('radial', datum.value) * sin(scale('angular', datum.key))"},
                stroke: {scale: 'color', field: 'category'},
                strokeWidth: {value: 1},
                fill: {scale: 'color', field: 'category'},
                fillOpacity: {value: 0.1}
              }
            }
          },
        ]
      },
      {
        type: 'rule',
        name: 'radial-grid',
        from: {data: 'keys'},
        zindex: 0,
        encode: {
          enter: {
            x: {value: 0},
            y: {value: 0},
            x2: {signal: "radius * cos(scale('angular', datum.key))"},
            y2: {signal: "radius * sin(scale('angular', datum.key))"},
            stroke: {value: 'lightgrey'},
            strokeWidth: {value: 1}
          }
        }
      },
      {
        type: 'text',
        name: 'key-label',
        from: {data: 'keys'},
        zindex: 1,
        encode: {
          enter: {
            x: {signal: "(radius + 5) * cos(scale('angular', datum.key))"},
            y: {signal: "(radius + 5) * sin(scale('angular', datum.key))"},
            text: {field: 'key'},
            align: [
              {
                test: "abs(scale('angular', datum.key)) > PI / 2",
                value: 'right'
              },
              {
                value: 'left'
              }
            ],
            baseline: [
              {
                test: "scale('angular', datum.key) > 0",
                value: 'top'
              },
              {
                test: "scale('angular', datum.key) == 0",
                value: 'middle'
              },
              {
                value: 'bottom'
              }
            ],
            fill: {value: 'white'},
            fontWeight: {value: 'bold'}
          }
        }
      },
      {
        type: 'line',
        name: 'outer-line',
        from: {data: 'radial-grid'},
        encode: {
          enter: {
            interpolate: {value: 'linear-closed'},
            x: {field: 'x2'},
            y: {field: 'y2'},
            stroke: {value: 'white'},
            strokeWidth: {value: 1}
          }
        }
      }
    ]
  }

  scatterSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    data: plot_data,
    background: null,
    config: {
      axis: {
        domainColor: 'white',
        gridColor: 'white',
        labelColor: 'white',
        tickColor: 'white',
        titleColor: 'white'
      },
      legend: {
        title: null,
        labelColor: 'white',
        titleColor: 'white'
      }
    },
    title: {
      color: 'white'
    },
    params: [{name: 'brush', select: {
      type: 'interval', 
      on: "[mousedown[event.shiftKey], mouseup] > mousemove",
      translate: "[mousedown[event.shiftKey], mouseup] > mousemove!"
    }},
    {name: 'grid', select: {
      type: 'interval',
      on: "[mousedown[!event.shiftKey], mouseup] > mousemove",
      translate: "[mousedown[!event.shiftKey], mouseup] > mousemove!"},
      bind: 'scales'}
    ],
    columns: features.length,
    concat: view_specs
  }

  // Embed the general and the detailed visualizations in the web page
  vegaEmbed(radarSpec, {actions: false}).then(res => document.getElementById('cross-correlation-grid').append(res))
  vegaEmbed(scatterSpec, {actions: false}).then(res => {
    document.getElementById('cross-correlation-grid').append(res)
  })
}

update(['acousticness', 'danceability', 'speechiness']);

// When the button is changed, run the updateChart function
d3.select("#feature-select-button").on("change", function () {
    // recover the option that has been chosen
    let features = d3.select("#feature-select-button").property("selectedOptions");
    features = Array.from(features).map(el => el.value)
    // run the updateChart function with this selected option
    update(features);
});

})
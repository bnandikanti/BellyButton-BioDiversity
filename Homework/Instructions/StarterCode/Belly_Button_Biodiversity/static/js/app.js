function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var sampleMetadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sampleMetadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    d3.json(`/metadata/${sample}`).then((sampleInfo) => {
    Object.entries(sampleInfo).forEach(([i, d]) => {
      sampleMetadata
        .append("p")
        .text(`${i}:${d}`);
    });
  });
}
    // BONUS: Build the Gauge Chart
function buildGaugeChart(sample) {
      var url = `/metadata/${sample}`;
      d3.json(url).then(function(data) {
      
    console.log(data.WFREQ);
     var chart_data = [{domain: {x: [0, 1], y: [0, 1]}, value: data.WFREQ, title: {text: "Belly Button Washing Frequency <hr> Number of scrubs per week"},
     type: "indicator", mode: "gauge+number", gauge:
     {axis: {range: [null, 10]}, steps: [{range: [0-1], color: "lightseagreen"},
     {range: [1, 2], color: "gray"},
     {range: [2, 3], color: "honeydew"},
     {range: [3, 4], color: "lavender"}, 
     {range: [4, 5], color: "lightsalmon"}, 
     {range: [5, 6], color: "lightpink"}, 
     {range: [6, 7], color: "lightgoldenrodyellow"},
     {range: [7, 8], color: "lightcoral"}, 
     {range: [8, 9], color: "lightskyblue"},
     {range: [9, 10], color: "lightslategrey"} 
  ]}}];

     var layout = {width: 600, height: 500, margin: {t: 0, b: 0}};
     Plotly.newPlot("gauge",chart_data,layout);
    
});
    }


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
   var url = `/samples/${sample}`;
   d3.json(url).then(function(data) {

    //console.log(data.otu_ids);
    //console.log(data.sample_values);

     // @TODO: Build a Bubble Chart using the sample data
    var otu_ids = data.otu_ids;
    var otu_labels = data.otu_labels;
    var sample_values = data.sample_values;
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: sample_values,
        color: otu_ids,
        text: otu_labels
      }
    };
    var layout = {
      title: `OTUID`
     
    };

    plot_data = [trace1];
    Plotly.newPlot("bubble", plot_data, layout);
   

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    
    sample_values = sample_values.slice(0, 10);
    console.log(sample_values);

    otu_ids = otu_ids.slice(0, 10);
    otu_labels = otu_labels.slice(0, 10);
    

    var pie_data = [{
      values: sample_values,
      labels: otu_ids,
      type: 'pie'
     }];
    var layout = {
    hoverinfo: otu_labels,
    textinfo: 'none'
    };
  
    // // Render the plot to the div tag with id "pie"
     Plotly.newPlot("pie", pie_data, layout);

});
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    buildGaugeChart(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGaugeChart(newSample);
}

// Initialize the dashboard
init();


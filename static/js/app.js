const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Calls optionChanged function when selected value is changed
function optionChanged() {
    const selectedValue = d3.select("#selDataset").property("value");
    console.log("Selected value:", selectedValue);

    // When selDataset is changed, grab the data
    d3.json(url).then(function(data) {
        console.log(data)
        getData(data, selectedValue);
    });
}

// Attach event listener to the dropdown
d3.select("#selDataset").on("change", optionChanged);

// When data is grabbed, it selects the ID equal to the value in the dropdown and then returns the values, ID, and labels.
function getData(data, selectedValue) {

    // Empty lists to store values, ids, and labels
    const allSampleValues = [];
    const allotuIDS = [];
    const allotuLabels = [];

    // Find the sample based on the selected value
    const sample = data.samples.find(sample => sample.id === selectedValue);
    if (sample) {
        for (let i = 0; i < sample.otu_ids.length; i++) {
            allotuIDS.push(sample.otu_ids[i]);
        }
        for (let i = 0; i < sample.otu_labels.length; i++) {
            allotuLabels.push(sample.otu_labels[i]);
        }
        for (let i = 0; i < sample.sample_values.length; i++) {
            allSampleValues.push(sample.sample_values[i]);
        }

        // Selects top 10 values
        top10SampleValues = allSampleValues.slice(0, 10);
        top10otuIDS = allotuIDS.slice(0, 10);
        top10otuLabels = allotuLabels.slice(0,10);

        // Reverse to put it in descending order
        top10otuIDS.reverse();
        top10otuLabels.reverse();
        top10SampleValues.reverse();
        
        // Sets ylabels
        const yLabels = top10otuIDS.map(id => `OTU ${id}`);

        // Creates the bar chart
        const dataTrace = {
            x: top10SampleValues,
            y: yLabels,
            text: top10otuLabels,
            type: 'bar',
            orientation: 'h',
        };

        const barData = [dataTrace];

        const barLayout = {
            xaxis: { title: 'Sample Values' },
            yaxis: { title: 'OTU Labels' },
        };

        Plotly.newPlot('bar', barData, barLayout);

        // Creates the bubble chart

        const bubbleTrace = {
            x: allotuIDS,
            y: allSampleValues,
            text: allotuLabels,
            mode: 'markers',
            marker: {
                color: allotuIDS,
                size: allSampleValues
            }

        };

        const bubbleData = [bubbleTrace]

        const bubbleLayout = {
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Sample Values' }
        };

        Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    } else {
        const barData = []
        const barLayout = {}
        const bubbleData = []
        const bubbleLayout = {}
        Plotly.newPlot('bar', barData, barLayout);
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);
        console.log("No sample found");
    }

    // Retrieve metadata
    const selectedValueAsNumber = parseInt(selectedValue, 10); // Convert to number
    const metadata = data.metadata.find(metadata => metadata.id === selectedValueAsNumber);
    const metadataDiv = document.getElementById("sample-metadata"); // Get the div element

    // Display the metadata
    if (metadata) {
        metadataDiv.innerHTML = 
        `id: ${metadata.id} <br>
        ethnicity: ${metadata.ethnicity} <br>
        gender: ${metadata.gender} <br>
        age: ${metadata.age} <br>
        location: ${metadata.location} <br>
        bbtype: ${metadata.bbtype} <br>
        wfreq : ${metadata.wfreq}`

    // If no metadata is found
    } else {
        console.log("No metadata found");
        metadataDiv.textContent = "No metadata found"
    }

}

// url for the data
const data_url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// global variable for retrieved data
var retrievedData;

// retrieve json data from url 
d3.json(data_url).then(function(data) {
    loadTestSubjects(data.names);
    retrievedData = data;
});

// populate the combobox with the list of subjects
function loadTestSubjects(userList) {
    let dropDownMenu = d3.select('#selDataset')
    
    userList.forEach(name => {
        dropDownMenu.append('option').text(name).property('value', name);
    });

    dropDownMenu.property('selectedIndex', -1);
}

// combobox change event handler
function optionChanged(selectedID) {
    // filter the json data for the selected subject ID and return the sample array
    let selectedSample = (retrievedData.samples.filter(item => {
        return item.id == selectedID;
    }));

    // filter the json data for the selected subject ID and return the metadata array
    let selectedSubject = (retrievedData.metadata.filter(item => {
        return item.id == selectedID;
    }));

    // pass the filtered data to the helper functions to display data
    loadSubjectSampleGraph(selectedSample);
    loadSubjectBubbleChart(selectedSample);
    loadSubjectDemographics(selectedSubject);
    loadGaugeChart(selectedSubject);
}

// create the bar chart for the sample data
function loadSubjectSampleGraph(sample) {
    var subjectValues = []

    for (let i = 0; i < sample[0].otu_ids.length; i++) {
        let subjectValue = {
            label: 'OTU ' + sample[0].otu_ids[i],
            value: sample[0].sample_values[i],
            text: sample[0].otu_labels[i]
        }

        subjectValues.push(subjectValue)
    };

    let sortedSample = subjectValues.sort((a, b) => b.value - a.value);
    let slicedSample = sortedSample.slice(0, 10);
    let reverseSample = slicedSample.reverse();

    let trace = {
        x: reverseSample.map(object => object.value),
        y: reverseSample.map(object => object.label),
        text: reverseSample.map(object => object.text),
        type: 'bar',
        orientation: 'h'
    };

    Plotly.newPlot('bar', [trace])
    
}

// create the bubble chart for the sample data
function loadSubjectBubbleChart(sample) {
    var subjectValues = []

    for (let i = 0; i < sample[0].otu_ids.length; i++) {
        let subjectValue = {
            x: sample[0].otu_ids[i],
            y: sample[0].sample_values[i],
            marker_size: sample[0].sample_values[i],
            color: sample[0].otu_ids[i],
            text: sample[0].otu_labels[i]
        }

        subjectValues.push(subjectValue)
    };

    var trace = {
        x: subjectValues.map(object => object.x),
        y: subjectValues.map(object => object.y),
        marker: {
            size: subjectValues.map(object => object.marker_size),
            color: subjectValues.map(object => object.color),
            colorscale: 'Earth'
        },
        text: subjectValues.map(object => object.text),
        mode: 'markers'
    }

    var layout = {
        showlegend: false,
        xaxis: {
            title: {
                text: 'OTU ID'
            }
        }
    };

    Plotly.newPlot('bubble', [trace], layout)
}

// set the selected subject's metadata values
function loadSubjectDemographics(subject) {
    let metadataDiv = d3.select('#sample-metadata')
    metadataDiv.selectAll('h5').remove();

    Object.keys(subject[0]).forEach(item => {
        let label = item;
        let value = subject[0][label]
        
        metadataDiv.append('h5').text(label + ': ' + value)
    })
    
}
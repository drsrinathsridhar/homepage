// Wrapping in nv.addGraph allows for '0 timeout render', stores rendered charts in nv.graphs, and may do more in the future... it's NOT required
var chart;
var wc = [];
var timeStamps = [];  // Only the timestamps as an array
var wcts = []; // The word count vs. timestamps array list
var authCommitFreq = []; // The number of commits by author
var authNumLines = []; // Number of lines edited by an author

var TSFormat = d3.time.format("%Y-%m-%d_%H%M"); // The format of the time stamps

window.onload = function() {
    loadWC();
};

function loadWC() {
    jQuery.get('WordCount.txt', function(data) {
	var lines = [];
	var tmplines = data.split("\n");
	for(i in tmplines) {
	    if(tmplines[i].length >= 1)
		lines.push(parseInt(tmplines[i]));
	}

	for(var i = 0; i < lines.length; ++i) {
	    if(isNaN(lines[i]) == false) {
		wc.push(lines[i]);
	    }
	}

	loadTS();
    });
}

function loadTS() {
    jQuery.get('TimeStamps.txt', function(data) {
	var lines = [];
	var tmplines = data.split("\n");
	for(i in tmplines) {
	    if(tmplines[i].length >= 1)
		lines.push(tmplines[i]);
	}

	for(var i = 0; i < lines.length; ++i) {
	    timeStamps.push(TSFormat.parse(lines[i]));
	    wcts.push({x: timeStamps[i], y: wc[i]});
	    // timeStamps.push(lines[i]);
	    // wcts.push({x: i, y: wc[i]});
	}

	// console.log(timeStamps.length)
	// console.log(wc.length)
	// console.log(wcts)

	loadAuthFreq();
    });
}

function loadAuthFreq() {
    jQuery.get('AuthorCommitFreq.txt', function(data) {
	var lines = [];
	var tmplines = data.split("\n");
	for(i in tmplines) {
	    if(tmplines[i].length >= 1)
		lines.push(tmplines[i]);
	}

	
	for(var i = 0; i < lines.length; ++i) {
	    var authCtr = lines[i].trim().split(" ");
	    authCommitFreq.push({label: authCtr[1], value: parseInt(authCtr[0])});
	}

	loadAuthNumLines();
    });
}

function loadAuthNumLines() {
    jQuery.get('AuthorNumLines.txt', function(data) {
	var lines = [];
	var tmplines = data.split("\n");
	for(i in tmplines) {
	    if(tmplines[i].length >= 1)
		lines.push(tmplines[i]);
	}

	
	for(var i = 0; i < lines.length; ++i) {
	    var authCtr = lines[i].trim().split(" ");
	    authNumLines.push({label: authCtr[1], value: parseInt(authCtr[0])});
	}
	afterLoadFunc();
    });
}

function afterLoadFunc() {
    nv.addGraph(function() {
	// var chart = nv.models.lineChart()
	//     .transitionDuration(350)
	//     .useInteractiveGuideline(true)
	// ;
	var chart = nv.models.multiBarChart()
	    .transitionDuration(350)
	    .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
	    .rotateLabels(-30)      //Angle to rotate x-axis labels.
	    .showControls(false)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
	    .groupSpacing(0.1)    //Distance between each group of bars.
	;

	chart.xAxis
	    .axisLabel('Time')
	    // .tickFormat(function(d) { return d3.time.format('%d-%b, %I %p')(new Date(d)); })
	    .tickFormat(function(d) { return d3.time.format('%d-%b')(new Date(d)); })
	;

	chart.yAxis
	    .axisLabel('Number of Words')
	    .tickFormat(d3.format('6d'))
	;

	d3.select('#WCChart svg')
	    .datum(wcData())
	    .transition().duration(1000)
	    .call(chart)
	;

	nv.utils.windowResize(chart.update);

	return chart;
    })

    nv.addGraph(function() {
	var chart = nv.models.pieChart()
	    .x(function(d) { return d.label })
	    .y(function(d) { return d.value })
	    .showLabels(true)     //Display pie labels
	    .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
	    .labelType("value") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
	    .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
	    .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
	;

	d3.select("#AuthNumLinesChart svg")
            .datum(authNumLines)
            .transition().duration(1000)
            .call(chart);

	nv.utils.windowResize(chart.update);

	return chart;
    })

    nv.addGraph(function() {
	var chart = nv.models.pieChart()
	    .x(function(d) { return d.label })
	    .y(function(d) { return d.value })
	    .showLabels(true)     //Display pie labels
	    .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
	    .labelType("value") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
	    .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
	    .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
	;

	d3.select("#AuthCommits svg")
            .datum(authCommitFreq)
            .transition().duration(1000)
            .call(chart);

	nv.utils.windowResize(chart.update);

	return chart;
    })
};

function wcData() {
    if(wc.length < 1 || timeStamps.length < 1 || wc.length != timeStamps.length) {
	console.log('Looks like file reading failed or the array sizes do not match.');
	return [];
    }

    return [
	{
	    values: wcts,
	    key: 'PDF Word Count',
	    color: '#2ca02c'
	}
    ];
}

function sampleData() {
    var sin = [],
    cos = [];

    for (var i = 0; i < 100; i++) {
	sin.push({x: i, y: Math.sin(i/10)});
	cos.push({x: i, y: .5 * Math.cos(i/10)});
    }

    return [
	{
	    values: sin,
	    key: 'Sine Wave',
	    color: '#ff7f0e'
	},
	{
	    values: cos,
	    key: 'Cosine Wave',
	    color: '#2ca02c'
	}
    ];
}

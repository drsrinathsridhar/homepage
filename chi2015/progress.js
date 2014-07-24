// Wrapping in nv.addGraph allows for '0 timeout render', stores rendered charts in nv.graphs, and may do more in the future... it's NOT required
var chart;
var wc = [];

jQuery.get('WordCount.txt', function(data) {
    var lines = [];
    var tmplines = data.split("\n");
    for(i in tmplines) {
	lines.push(parseInt(tmplines[i]));
    }

    for(var i = 0; i < lines.length; ++i) {
	if(isNaN(lines[i]) == false) {
	    wc.push({x: i, y: lines[i]});
	    // console.log(lines[i])
	}
    }

    afterLoadFunc();
});

function afterLoadFunc() {
    nv.addGraph(function() {
	var chart = nv.models.lineChart()
	    .useInteractiveGuideline(true)
	;

	chart.xAxis
	    .axisLabel('Time (8 hour increments)')
	    .tickFormat(d3.format(',r'))
	;

	chart.yAxis
	    .axisLabel('Number of Words')
	    .tickFormat(d3.format('.3s'))
	;

	d3.select('#chart svg')
	// .datum(sampleData())
	    .datum(wcData())
	    .transition().duration(1000)
	    .call(chart)
	;

	nv.utils.windowResize(chart.update);

	return chart;
    })
};

function wcData() {
    if(wc.length < 1) {
	console.log('Looks like file reading failed. No word counting data.');
	return [];
    }

    return [
	{
	    values: wc,
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

function clustered_bar_chart(){
	// attr
	var margin = {top: 10, right: 30, bottom: 20, left: 60};
	var width = 500 - margin.right - margin.left, height = 300 - margin.top - margin.bottom;
	var svg = d3.select("#g2")
			.append("svg")
			.attr("width", width+margin.right+margin.left)
			.attr("height", height+margin.top+margin.bottom+40)
			.append("g")
			.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

	d3.csv("https://raw.githubusercontent.com/zih-an/visualization/master/lab1/2.csv")
		.then(d => chart_clusteredBar(d, svg, margin, width, height));
}


function chart_clusteredBar(data, svg, margin, width, height){
	// preprocess the data
	var groups = ["1", "2", "3", "4"];
	var subgroup = ["East", "West", "North"];
	var pdata = [];
	for(var i=0; i<4; i++) {
		//
		var tmp = {
			"Quarter": groups[i],
			"East": data[i].Sales,
			"West": data[i+4].Sales,
			"North": data[i+8].Sales
		};
		pdata.push(tmp);
	}
	console.log(pdata);

	// add X axis
	var x = d3.scaleBand()
		.domain(groups)
		.range([0, width])
		.padding([0.2]);
	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x).tickSize(0));
	// add Y axis
	var y = d3.scaleLinear()
		.domain([0,100])
		.range([height,0]);
	svg.append("g")
		.call(d3.axisLeft(y));
	// add subgroup axis
	var xSub = d3.scaleBand()
		.domain(subgroup)
		.range([0, x.bandwidth()])
		.padding([0.05]);

	//text label for x axis
    svg.append("text")
      .attr("transform", `translate(${(width/2)}, ${height + margin.top*4})`)
      .style("text-anchor", "middle")
      .text("Seasons")
      .attr("font-weight", "bold");

    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr('y', 0 - margin.left*0.70)
        .attr('x', 0 - (height/2))
        .style("text-anchor", "middle")
        .text("Sales")
        .attr("font-weight", "bold");

	// color
	var colors = ["#3CB300", "#8B4513", "#008B8B"];
	var color = d3.scaleOrdinal()
		.domain(subgroup)
		.range(colors);



	// show the bars
	svg.append("g")
		.selectAll("g")
		.data(pdata)
		.enter()
		.append("g")
		.attr("transform", function(d) { return "translate(" + x(d.Quarter) + "0)"; })
		.selectAll("rect")
		.data(function(d) { return subgroup.map(function(key) { return {key: key, value: d[key]}; }); })
    	.enter().append("rect")
    		.attr("x", function(d) { return xSub(d.key); })
        	.attr("y", function(d) { return y(d.value); })
        	.attr("width", xSub.bandwidth())
        	.attr("height", function(d) { return height - y(d.value); })
        	.attr("fill", function(d) { return color(d.key); });

    // add legend
    var legendh = 100;
    var legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(0,0)');

    
    legend.selectAll('rect')
        .data(subgroup)
        .enter()
        .append('rect')
        .attr('x', 20)
        .attr('y', function(d,i){
            return i * 18;
        })
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', function(d,i){
        	return colors[i];
        });

    legend.selectAll('text')
        .data(subgroup)
        .enter()
        .append('text')
        .text(d => d)
        .attr('x', 40)
        .attr('y', function(d, i) {
            return i * 18;
        })
        .attr('text-anchor', 'start')
        .attr('alignment-baseline', 'hanging')
        .attr("font-size", 12);
}

clustered_bar_chart();
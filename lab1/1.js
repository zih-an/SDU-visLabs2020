function stacked_bar_chart(){
	// attr
	var margin = {top: 10, right: 30, bottom: 20, left: 60};
	var width = 500 - margin.right - margin.left, height = 300 - margin.top - margin.bottom;
	var svg = d3
			.select("#g1")
	  		.append("svg")
	  		.attr("width", width + margin.left + margin.right)
	  		.attr("height", height + margin.top + margin.bottom + 40)
	  		.append("g")
	  		.attr("transform", "translate(" + margin.left + ","+ margin.top + ")");

	//data
	d3.csv("https://raw.githubusercontent.com/zih-an/visualization/master/lab1/1.csv")
		.then( d => chart_stack(d,svg,margin, width, height) );
}


function chart_stack(data, svg, margin, width, height){ 
	var colors = ["#000000", "#603F20", "#E62B00", "#FFED33"];  // color for each segment

	// preprocess
	data.forEach( d => delete d.Total);

	// stack
	var keys = data.columns.slice(1,-1);
	var stack = d3.stack().keys(keys);
	var series = stack(data);
	
	// coordinates
	var x = d3.scaleBand().range([0, width]).padding([0.2]);
	var y = d3.scaleLinear().range([height, 0]).domain([0,600]);
	x.domain(data.map(function(d) { return d.EyeColor; }));

	// add axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSizeOuter(0));
    svg.append("g")
      .call(d3.axisLeft(y));

    //text label for x axis
    svg.append("text")
      .attr("transform", `translate(${(width/2)}, ${height + margin.top*4})`)
      .style("text-anchor", "middle")
      .text("Eye Color")
      .attr("font-weight", "bold");

    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr('y', 0 - margin.left*0.75)
        .attr('x', 0 - (height/2))
        .style("text-anchor", "middle")
        .text("Number of  Students")
        .attr("font-weight", "bold");

	// draw rects
	svg
		.append("g")
    	.selectAll("g")
    	.data(series)
    	.enter()
    	.append("g")
          .attr("fill", function(d,i) { return colors[i]; })
    	.selectAll("rect")
    	.data(function(d) { return d; })
    	.enter()
    	.append("rect")
          .attr("x", function(d) { return x(d.data.EyeColor); })
          .attr("y", function(d) { return y(d[1]); })
          .attr("height", function(d) { return y(d[0]) - y(d[1]); })
          .attr("width", x.bandwidth());

    // add legend
    var legendh = 100;
    var legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(0,0)');

    
    legend.selectAll('rect')
        .data(series)
        .enter()
        .append('rect')
        .attr('x', 20)
        .attr('y', function(d,i){
            return (i+1) * 18;
        })
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', function(d,i){
        	return colors[i];
        });

    series.unshift("Hair Color");
    legend.selectAll('text')
        .data(series)
        .enter()
        .append('text')
        .text(function(d, i){
        	if(i==0) return d;
            return d.key;
        })
        .attr('x', function(d, i) {
        	if(i==0) return 15;
        	return 40;
        })
        .attr('y', function(d, i) {
        	if(i==0) return -5;
            return i * 18;
        })
        .attr('text-anchor', 'start')
        .attr('alignment-baseline', 'hanging')
        .attr("font-weight", function(d,i) { 
        	if(i==0) return "bold"; 
        })
        .attr("font-size", function(d,i){
        	if(i==0) return 15;
        	return 12;
        })
}


stacked_bar_chart();
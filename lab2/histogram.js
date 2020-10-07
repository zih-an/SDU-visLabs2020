function histogram(){
	// svg
	var margin = {top: 70, right: 30, bottom: 30, left: 60};
    var width = 500 - margin.left - margin.right, height = 300 - margin.top - margin.bottom;

    // load data
    d3.csv("https://raw.githubusercontent.com/zih-an/visualization/master/lab2/heart_disease_uci.csv")
    	.then(d => draw_histogram(d,margin,width,height));
}

function draw_histogram(data, margin, width, height){
	for(var i=0; i<4; i++){
		var type = [];
		data.forEach(function(d){
			if(d["type"]==i) type.push(d);
		});

		var svg = d3.select("#histogram")
	    	.append("svg")
	    	.attr("width", width + margin.left + margin.right)
	    	.attr("height", height + margin.top + margin.bottom + 40)
	    	.append("g")
	    	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
	    // add title
	    svg.append("text")
	        .attr("x", (width / 2))             
	        .attr("y", 0 - (margin.top / 3))
	        .attr("text-anchor", "middle")  
	        .style("font-size", "16px")
	        .style("font-weight", "bold")
	        .style("text-decoration", "underline")  
	        .text("Type "+ i);

		histEach(type, svg, margin, width, height);
	}
}

function histEach(data, svg, margin, width, height){
	// add axis
	var x = d3.scaleLinear().range([0, width]).domain([25,80]);
	svg.append("g")
		.attr("transform", "translate(0, "+height+")")
		.call(d3.axisBottom(x));

	var hist = d3.histogram()
			.value(function(d){ return d.age; })
			.domain(x.domain())
			.thresholds(x.ticks(11));  // divide into 11 parts

	// fit to the histogram
	var bins = hist(data);

	var y = d3.scaleLinear().range([height, 0]).domain([0, d3.max(bins, function(d){ return d.length; })]);
	svg.append("g")
		.call(d3.axisLeft(y).ticks(7).tickFormat(d3.format("d")));

	//text label for x axis
    svg.append("text")
      .attr("transform", `translate(${(width/2)}, ${height + margin.top/1.5})`)
      .style("text-anchor", "middle")
      .text("Age")
      .attr("font-weight", "bold");

    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr('y', 0 - margin.left*0.75)
        .attr('x', 0 - (height/2))
        .style("text-anchor", "middle")
        .text("Frequency")
        .attr("font-weight", "bold");

	// draw rectangles
	svg.selectAll("rect")
		.data(bins)
		.enter()
		.append("rect")
		.attr("x", 1)
		.attr("transform", function(d){ return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
		.attr("width", function(d){ return x(d.x1) - x(d.x0); })
		.attr("height", function(d){ return height-y(d.length); })
		.style("fill", "#8cffee")
		.attr("stroke", "black");
}



histogram();
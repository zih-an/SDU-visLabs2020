function lineChart(){
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
		.then(d => chart_lines(d, svg, margin, width, height));
}

function chart_lines(data, svg, margin, width, height){
	// 
	// Add X axis
    var x = d3.scaleLinear()
      .domain([1,4])
      .rangeRound([40,width]);
      
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSize(0).ticks(4));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, 100])
      .range([ height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

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


    var colors = ["#3CB300", "#8B4513", "#008B8B"];
    // Add the line 1
    for(var i=0, cnt=0; i<3; i++, cnt+=4){
    	svg.append("path")
	      .datum(data.slice(cnt,cnt+4))
	      .attr("fill", "none")
	      .attr("stroke", colors[i])
	      .attr("stroke-width", 2)
	      .attr("d", d3.line()
	        .x(function(d) { return x(d.Quarter) })
	        .y(function(d) { return y(d.Sales) })
        );
    }

    // Data dots
	svg.selectAll("circle")
	    .data(data)
	   	.enter().append("circle")
	    .attr("stroke", function(d,i){
	    	var idx = parseInt(i/4);
	    	console.log(colors[idx]);
	    	console.log(idx);
	    	return colors[idx];
	    })
	    .attr("fill", function(d,i){
	    	var idx = parseInt(i/4);
	    	console.log(colors[idx]);
	    	console.log(idx);
	    	return colors[idx];
	    })
	    .attr("r", 5)
	    .attr("cx", function(d) { return x(d.Quarter); })
	    .attr("cy", function(d) { return y(d.Sales); });


	// add legend
	var group = ["East", "West", "North"];
    var legendh = 100;
    var legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(0,0)');

    
    legend.selectAll('circle')
        .data(group)
        .enter()
        .append('circle')
        .attr("r", 5)
        .attr('cx', 25)
        .attr('cy', function(d,i){
            return i * 18 +5;
        })
        .attr('fill', function(d,i){
        	return colors[i];
        });

    legend.selectAll('text')
        .data(group)
        .enter()
        .append('text')
        .text(d => d)
        .attr('x', 38)
        .attr('y', function(d, i) {
            return i * 18;
        })
        .attr('text-anchor', 'start')
        .attr('alignment-baseline', 'hanging')
        .attr("font-size", 12);

}

lineChart();
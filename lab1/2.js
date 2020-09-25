function heatmap(){
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
		.then( d => chart_heatmap(d,svg,margin, width, height) );
}


function chart_heatmap(data, svg, margin, width, height){
	//
	var cols = data.columns.slice(1); 
	var rows = [];
	data.forEach(function(d){ rows.unshift(d.EyeColor); });

	// Build X scales and axis:
	var x = d3.scaleBand()
	  .range([ 0, width ])
	  .domain(cols)
	  .padding(0.01);
	svg.append("g")
	  .attr("transform", "translate(0," + height + ")")
	  .call(d3.axisBottom(x));

	// Build Y scales and axis:
	var y = d3.scaleBand()
	  .range([ height, 0 ])
	  .domain(rows)
	  .padding(0.01);
	svg.append("g")
	  .call(d3.axisLeft(y));

	//text label for x axis
    svg.append("text")
      .attr("transform", `translate(${(width/2)}, ${height + margin.top*4})`)
      .style("text-anchor", "middle")
      .text("Hair Color")
      .attr("font-weight", "bold");

    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr('y', 0 - margin.left*0.8)
        .attr('x', 0 - (height/2))
        .style("text-anchor", "middle")
        .text("Eye Color")
        .attr("font-weight", "bold");

	// Build color scale
	var myColor_seg = d3.scaleLinear()
	  .range(["white", "#008080"])
	  .domain([0,150]);
	var color_tot = d3.scaleLinear()
	  .range(["white", "#8B0000"])
	  .domain([55,600]);

	// preprocess
	var hairs = ["Black", "Brown", "Red", "Blond", "Total"];
	var heat_vals = [];
	for(var i=0; i<5; i++){
		for(var j=0; j<5 ;j++){
			var valkey = hairs[j];
			var tmp = {
					"EyeColor": data[i].EyeColor, 
					"HairColor": valkey,
					"value": data[i][valkey]
			};
			heat_vals.push(tmp);
		}
	}
	// create a tooltip
	var tooltip = d3.select("#g1")
	    .append("div")
	    .style("opacity", 0)
	    .attr("class", "tooltip")
	    .style("background-color", "white")
	    .style("border", "solid")
	    .style("border-width", "2px")
	    .style("border-radius", "5px")
	    .style("padding", "5px")
	    .style("position", "absolute");
	// Three function that change the tooltip when user hover / move / leave a cell
	var mouseover = function(d) {
	    tooltip.style("opacity", 1)
	}
	var mousemove = function(d) {
	    tooltip
	      .html("The Number of Students<br>This Cell Is: " + d.value)
	      .style("left", (d3.mouse(this)[0]+620) + "px")
	      .style("top", (d3.mouse(this)[1]) + "px")
	}
	var mouseleave = function(d) {
	    tooltip.style("opacity", 0)
	}

    //
	svg.selectAll()
      .data(heat_vals)
      .enter()
      .append("rect")
      .attr("x", function(d) { return x(d.HairColor) })
      .attr("y", function(d) { return y(d.EyeColor) })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { 
      	if(d.EyeColor!="Total" && d.HairColor!="Total")
      		return myColor_seg(d.value);
      	return color_tot(d.value)} 
      )
      .on("mouseover", mouseover)
	  .on("mousemove", mousemove)
	  .on("mouseleave", mouseleave);
}

heatmap();
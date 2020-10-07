function boxplot(){
	// svg
	var margin = {top: 10, right: 30, bottom: 30, left: 60};
    var width = 500 - margin.left - margin.right, height = 300 - margin.top - margin.bottom;

	var svg = d3.select("#boxplot")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom + 40)
		.append("g")
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
	// load data
	d3.csv("https://raw.githubusercontent.com/zih-an/visualization/master/lab2/heart_disease_uci.csv")
		.then(d => draw_boxplot(d, svg, margin, width, height));
}


function draw_boxplot(data, svg, margin, width, height){
	// preprocess
	var type=[ [], [], [], [] ];
	for(var i=0; i<data.length; i++){
		if(data[i]["type"]==0) type[0].push(data[i]["age"]);
		else if(data[i]["type"]==1) type[1].push(data[i]["age"]);
		else if(data[i]["type"]==2) type[2].push(data[i]["age"]);
		else type[3].push(data[i]["age"]);
	}
	var cmp = function(aa,bb){return (aa-bb);};
	
	// boxplot data
	var dta_box = [ [], [], [], [] ];
	for(var i=0; i<4; i++){
		var t = type[i].sort(cmp);
		var len = t.length;
		var p = [0, 0.25, 0.5, 0.75, 1];
		p.forEach(d => dta_box[i].push(t[Math.max(parseInt(d*len-1), 0)]));
		
	}

	// coordinates
	var x = d3.scaleBand().range([0,width]).domain([0,1,2,3])
		.paddingInner(1).paddingOuter(.5);
	var y = d3.scaleLinear().range([height,0]).domain([20, 80]);

	// add axis
	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x).tickSizeOuter(0));
	svg.append("g")
		.call(d3.axisLeft(y));

	//text label for x axis
    svg.append("text")
      .attr("transform", `translate(${(width/2)}, ${height + margin.top*5})`)
      .style("text-anchor", "middle")
      .text("Chest Pain Type")
      .attr("font-weight", "bold");

    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr('y', 0 - margin.left*0.75)
        .attr('x', 0 - (height/2))
        .style("text-anchor", "middle")
        .text("Age")
        .attr("font-weight", "bold");

	// vertical lines
	svg.selectAll("vertLines")
		.data(dta_box)
		.enter()
		.append("line")
		.attr("x1", function(d,i) { return x(i); })
		.attr("y1", function(d,i) { return y(d[0]); })
		.attr("x2", function(d,i) { return x(i); })
		.attr("y2", function(d,i){ return y(d[4]); })
		.attr("stroke", "black")
		.style("width", 40);

	// rectangle
	svg.selectAll("boxes")
		.data(dta_box)
		.enter()
		.append("rect")
		.attr("x", function(d,i) { return x(i)-15; })
		.attr("y", function(d,i) { return y(d[3]); })
		.attr("width", 30)
		.attr("height", function(d,i) { return y(d[1])-y(d[3]); })
		.attr("stroke", "black")
		.attr("stroke-width", "0.1")
		.style("fill", "#ffd500");

	// mid horizontal lines
	svg.selectAll("hrznLines")
		.data(dta_box)
		.enter()
		.append("line")
		.attr("x1", function(d,i) { return x(i)-15; })
		.attr("y1", function(d,i) { return y(d[2]); })
		.attr("x2", function(d,i) { return x(i)+15; })
		.attr("y2", function(d,i){ return y(d[2]); })
		.attr("stroke", "black")
		.style("width", 40);

	// up horizontal lines
	svg.selectAll("hrznLines")
		.data(dta_box)
		.enter()
		.append("line")
		.attr("x1", function(d,i) { return x(i)-5; })
		.attr("y1", function(d,i) { return y(d[4]); })
		.attr("x2", function(d,i) { return x(i)+5; })
		.attr("y2", function(d,i){ return y(d[4]); })
		.attr("stroke", "black")
		.style("width", 40);

	// down horizontal lines
	svg.selectAll("hrznLines")
		.data(dta_box)
		.enter()
		.append("line")
		.attr("x1", function(d,i) { return x(i)-5; })
		.attr("y1", function(d,i) { return y(d[0]); })
		.attr("x2", function(d,i) { return x(i)+5; })
		.attr("y2", function(d,i){ return y(d[0]); })
		.attr("stroke", "black")
		.style("width", 40);
}


boxplot();
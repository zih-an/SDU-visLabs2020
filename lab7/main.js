function main() {
    // show top xx
    prepareContainer();
    d3.csv("combined3.csv")
        .then(d => sparkcloud(d));
}


function prepareContainer() {
    document.getElementsByClassName("cloud")[0].innerHTML = "";
    let topNum = document.getElementById("topinput").value;
    let cloud = document.getElementsByClassName("cloud");
    for(let i=0; i<topNum; i++) {
        let num = document.createElement("div");
        num.setAttribute("style", `
            display: inline-block;
            margin: 20px 20px 20px 20px;
        `);
        // sub containers: text+line
        let text = document.createElement("div");
        text.setAttribute("class", "wordContainer");
        let line = document.createElement("div");
        line.setAttribute("class", "lineContainer");
        // append div
        num.appendChild(text);
        num.appendChild(line);
        cloud[0].appendChild(num);
    }
}


function sparkcloud(data) {
    // aggregate data
    let nestData = d3.nest()
        .key(d => d.word)
        .entries(data);
    for(let i=0; i<nestData.length; i++) {
        let tot = 0;
        for(let j=0; j<nestData[i].values.length; j++) {
            tot += Number(nestData[i].values[j].freq);
        }
        nestData[i].totfreq = tot;
    }
    nestData.sort(function(a,b){ return (b.totfreq - a.totfreq); });
    
    // add text
    let textScale = d3.scaleLinear()
        .range([10, 70]).nice()
        .domain(d3.extent(nestData, d => d.totfreq));
    let texts = d3.select(".cloud").selectAll(".wordContainer")
        .data(nestData)
        .append("text")
        .text(d => d.key)
        .style("font-size", d => `${textScale(d.totfreq)}px`)
        .style("color", "#ff9a00");
    
    // add sparklines
    let lineWidth = 60,
        lineHeight = 30;
    let xScale = d3.scaleLinear()
        .range([0, lineWidth])
        .domain([2001, 2016]);
    let yScale = d3.scaleLinear()
        .range([0, lineHeight])
        .domain([d3.max(data, d => Number(d.freq)), d3.min(data, d => Number(d.freq))]);
    
    let lineSvg = d3.select(".cloud").selectAll(".lineContainer")
        .append("svg")
        .attr("width", lineWidth+10)
        .attr("height", lineHeight+10)
        .data(nestData)
        .append("path")
        .datum(d => d.values)
        .attr("fill", "#faf5cf")
        .attr("stroke", "#ffe100")
        .attr("stroke-width", 2)
        .attr("d", d3.area()
            .x(function(d){ return xScale(Number(d.year)); })
            .y0(yScale(0))
            .y1(function(d){ return yScale(Number(d.freq)); })
        );
}

main();

var SVG_WIDTH = 500,
    SVG_HEIGHT = 500,
    MAX_DIS_SQUARED = 8,
    COMPUTE_TIMES = 2000;
var epsilon = 1e-6;

// attributes
var L = 2,  // spring rest length
    k_r = 0.1,  // repulsive force constant
    k_s = 0.025,  // spring force constant
    delta_t = 10;  // time step


// get data from remote
function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}
//var data_url = "https://raw.githubusercontent.com/zih-an/scale-free_network/master/newLink.json";
var data_url = "https://raw.githubusercontent.com/zih-an/SDU-visLabs2020/master/lab6/test_data.json";
var data = JSON.parse(Get(data_url));
//var NUM_NODES = 168;
var NUM_NODES = 7;


// algorithm
function fd_layout() {
    // data
    var nodes = [], edges = [];
    init_nodes(nodes,edges);
    console.log(data);
    // compute
    //for(var i=0; i<COMPUTE_TIMES; i++) {
    var run=0;
    do{
        // strategies
        //no_speedup_strategy(nodes,edges);  // no speed up  -> COMPUTE_TIMES=800..3000 is good
        strategy1(nodes, edges);  // speed up strategy 1  -> COMPUTE_TIMES=20,30 is good
        update(nodes);

        if(run==10) layout(nodes);
        if(run==30) layout(nodes);
        if(run==200) layout(nodes);
        if(run==600) layout(nodes);
        
        run++;
    } while(run < COMPUTE_TIMES);
    console.log(run);
    layout(nodes);
}

// repulsion + spring forces
function no_speedup_strategy(nodes, edges) {
    repulsion_all(nodes);
    spring_all(nodes, edges);
}
// use L,2L,3L,... instead of repulsion
// data_small
/*
var SVG_WIDTH = 800,
    SVG_HEIGHT = 800,
    MAX_DIS_SQUARED = 10,
    COMPUTE_TIMES = 80000;
var epsilon = 1e-2;

// attributes
var L = 4,  // spring rest length
    k_r = 0.02,  // repulsive force constant
    k_s = 0.5,  // spring force constant
    delta_t = 0.001;  // time step
*/
function strategy1(nodes, edges){
    spring_multi(nodes,edges);
}



// initialize nodes and its related net forces
function init_nodes(nodes, edges){
    var links = data.links;  // {target: n1, source: n2}
    // process nodes
    for(var i=0; i<NUM_NODES; i++) {
        var node = {
            val: i, 
            vx: 0,
            vy: 0,
            x: Math.random() * 400,
            y: Math.random() * 400,
            force_x: 0,
            force_y: 0
        };
        nodes.push(node);
        edges.push([]);
    }
    // process edges
    for(var i=0; i<links.length; i++) {
        var source = links[i].source,
            target = links[i].target;
        edges[target].push(source);
        edges[source].push(target);
    }
}

// repulsion between all pairs
function repulsion_all(nodes){
    for(var i=0; i<nodes.lenth-1; i++) {
        var node1 = nodes[i];
        for(var j=i+1; j<nodes.length; j++) {
            var node2 = nodes[j];
            var dx = node2.x - node1.x, 
                dy = node2.y - node1.y;
            if(Math.abs(dx) > epsilon || Math.abs(dy) > epsilon) {
                var disSquared =dx*dx + dy*dy;
                var dis = Math.sqrt(disSquared);
                // Coulomb's law
                var force = k_r / disSquared;
                var fx = force * dx/dis,
                    fy = force * dy/dis;
                // refresh forces
                node1.force_x -= fx;
                node1.force_y -= fy;
                node2.force_x += fx;
                node2.force_y += fy;
            }
            else {  // generate a small force to separate them
                var small_force = 0.01;
                node1.force_x -= small_force;
                node1.force_y -= small_force;
                node2.force_x += small_force;
                node2.force_y += small_force;
            }
        }
    }
}

// spring force between all pairs
function spring_all(nodes, edges) {
    for(var i=0; i<nodes.length; i++)  {
        var node1 = nodes[i];
        for(var j=0; j<edges[i].length; j++) {
            var node2 = nodes[edges[i][j]];
            if(i < edges[i][j]) {
                var dx = node2.x - node1.x, 
                    dy = node2.y - node1.y;
                if(Math.abs(dx) > epsilon || Math.abs(dy) > epsilon) {
                    var dis = Math.sqrt(dx*dx + dy*dy);
                    // Hooke's law
                    var force = k_s * (dis - L);
                    var fx = force * dx/dis,
                        fy = force * dy/dis;
                    // refresh forces
                    node1.force_x += fx;
                    node1.force_y += fy;
                    node2.force_x -= fx;
                    node2.force_y -= fy;
                }
            }
        }
    }
}

// spring forces L, 2L, 3L, ... among all paris
function spring_multi(nodes, edges) {
    for(var i=0; i<nodes.length; i++) {
        // visited array
        var vis = [];
        for(var row=0; row<nodes.length; row++)
            vis.push(0);
        vis[i] = 1;
        // preparation
        var node1 = nodes[i];
        var layer = 1;
        var neighbors = edges[i];  // init neighbors

        // layer L neighbors
        while(neighbors.length>0) {
            var nbLen = neighbors.length;
            for(var j=0; j<nbLen; j++) {
                // get 
                var nb = neighbors.shift();  // get the head and delete 
                vis[nb] = 1;  // visited
                var node2 = nodes[nb];
                // handle with node2
                if(i < nb) {
                    var dx = node2.x - node1.x, 
                        dy = node2.y - node1.y;
                    if(Math.abs(dx) > epsilon || Math.abs(dy) > epsilon) {
                        var dis = Math.sqrt(dx*dx + dy*dy);
                        // Hooke's law
                        var force = k_s * (dis - layer * L);  // original distance: layer * L
                        var fx = force * dx/dis,
                            fy = force * dy/dis;
                        // refresh forces
                        node1.force_x += fx;
                        node1.force_y += fy;
                        node2.force_x -= fx;
                        node2.force_y -= fy;
                    }
                }
                // update neighbors
                edges[nb].forEach(function(d) { if(!vis[d]) neighbors.push(d); });
            }
            layer++;
        }
    }
}



// update positions
function update(nodes) {
    for(var i=0; i<nodes.length; i++) {
        var node = nodes[i];
        var dx = delta_t * node.force_x,
            dy = delta_t * node.force_y;
        var displacementSquared = dx*dx + dy*dy;
        if(displacementSquared - MAX_DIS_SQUARED > epsilon) {
            var s = Math.sqrt(MAX_DIS_SQUARED / displacementSquared);
            dx *= s, dy *= s;
        }
        node.x += dx, node.y += dy;
    }
}

// output
function layout(nodes){
    var margin = {top: 10, right: 60, bottom: 20, left: 60};
    var svg = d3
        .select("#graph")
        .append("svg")
        .attr("width", SVG_WIDTH + margin.right + margin.left)
        .attr("height", SVG_HEIGHT + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    // build scales
    var xmn = d3.min(nodes, function (d) { return d.x; }),
        xmx = d3.max(nodes, function (d) { return d.x; }),
        ymn = d3.min(nodes, function (d) { return d.y; }),
        ymx = d3.max(nodes, function (d) { return d.y; });
    var xAxis = d3.scaleLinear()
        .range([0, SVG_WIDTH])
        .domain( [xmn-Math.abs(xmn*0.1), xmx+Math.abs(xmx*0.1)] );
    var yAxis = d3.scaleLinear()
        .range([SVG_HEIGHT, 0])
        .domain( [ymn-Math.abs(ymn*0.1), ymx+Math.abs(ymx*0.1)] );
    

    console.log("xmn: "+xmn+ "  xmx: "+xmx+"  ymn: "+ymn+"  ymx: "+ymx);

    // nodes
    svg.append("g")
        .selectAll("circle")
        .data(nodes).enter().append("circle")
        .attr("stroke", "#e8f0a3")
        .attr("stroke-width", 2)
        .attr("fill", "#414f78")
        .attr("r", 4)
        .attr("cx", d => xAxis(d.x))
        .attr("cy", d => yAxis(d.y));
    
    // edges
    var edges_pos = [];
    for(var i=0; i<data.links.length; i++) {
        var  edge = {
            x1: nodes[data.links[i].target].x,
            y1: nodes[data.links[i].target].y,
            x2: nodes[data.links[i].source].x,
            y2: nodes[data.links[i].source].y,
        };
        edges_pos.push(edge);
    }

    svg.append("g")
        .selectAll("line")
        .data(edges_pos).enter().append("line")
        .attr("stroke", "#e8f0a3")
        .attr("stroke-width", 0.3)
        .attr("x1", function(d){
            return xAxis(d.x1);
        })
        .attr("y1", function(d){
            return yAxis(d.y1);
        })
        .attr("x2", function(d){
            return xAxis(d.x2);
        })
        .attr("y2", function(d){
            return yAxis(d.y2);
        });
}



// excute
fd_layout();

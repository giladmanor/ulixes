
//http://bl.ocks.org/mbostock/1153292

var Graph = function(nodes, links,openNodeFormFunction,openLinkFormFunction){
	// Compute the distinct nodes from the links.
	
	links.forEach(function(link) {
	  link.source = nodes[link.source] ;//|| (nodes[link.source] = {name: link.source});
	  link.target = nodes[link.target] ;//|| (nodes[link.target] = {name: link.target});
	});
		
	var width = 960,
	    height = 600;
	
	var force = d3.layout.force()
	    .nodes(d3.values(nodes))
	    .links(links)
	    .size([width, height])
	    .linkDistance(120)
	    .charge(-1500)
	    .on("tick", tick)
	    .start();
	
	var svg = d3.select(".graph-goes-here").append("svg")
	    .attr("width", width)
	    .attr("height", height);
	
	// Per-type markers, as they don't inherit styles.
	var marker = svg.append("defs").selectAll("marker")
	    .data(["suit", "licensing", "resolved"])
	  .enter().append("marker")
	    .attr("id", function(d) { return d; })
	    .attr("viewBox", "0 -5 10 10")
	    .attr("refX", 16)
	    .attr("refY", -1)
	    .attr("markerWidth", 1.1)
	    .attr("markerHeight", 1.1)
	    .attr("orient", "auto")
	  .append("path")
	    .attr("d", "M0,-5L10,0L0,5");
	
	var path = svg.append("g").selectAll("path")
	    .data(force.links())
	  .enter().append("path")
	    .attr("class", function(d) { return "link " + d.type; })
	    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });
	
	var circle = svg.append("g").selectAll("circle")
	    .data(force.nodes())
	  .enter().append("circle")
	    .attr("r", 20)
	    .call(force.drag);
	
	var text = svg.append("g").selectAll("text")
	    .data(force.nodes())
	  .enter().append("text")
	    .attr("y", ".31em")
	    .style("text-anchor", "middle")
	    .text(function(d) { return d.name; });
	
	// Use elliptical arc path segments to doubly-encode directionality.
	function tick() {
	  path.attr("d", linkArc);
	  circle.attr("transform", transform);
	  text.attr("transform", transform);
	}
	
	function linkArc(d) {
	  var dx = d.target.x - d.source.x,
	      dy = d.target.y - d.source.y,
	      dr = Math.sqrt(dx * dx + dy * dy);
	  return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
	}
	
	function transform(d) {
	  return "translate(" + d.x + "," + d.y + ")";
	}
	
	circle.on("click", function(d) {
	    openNodeFormFunction(d);
	});
	
	path.on("click", function(d) {
	    openLinkFormFunction(d);
	});
	
	marker.on("click", function(d) {
	    alert(d.type);
	});
	
};





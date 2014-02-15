function bubbles(data) {
	console.log("Badges: ", data);
	
	var width = 600, height = 350;
	$(".badgesCloud").text("");
	var svg = d3.select(".bubbles").append("svg").attr("width", width).attr("height", height);

	var force = d3.layout.force().gravity(.5).charge(-400).size([width, height]);
	force.nodes(data).start();

	var color = d3.scale.category20();
	var node = svg.selectAll(".node").data(data).enter().append("g").attr("class", "node").call(force.drag);

	var circle = svg.append("g").selectAll("circle").data(force.nodes()).enter().append("circle").attr("r", function(d){return d.size;}).style("fill", function(d) {
		return color(d.size);
	}).call(force.drag);

	var text = svg.append("g").selectAll("text").data(force.nodes()).enter().append("text").attr("x", -10).attr("y", ".31em").text(function(d) { return d.name; });

	function transform(d) {
	  return "translate(" + d.x + "," + d.y + ")";
	}
	
	force.on("tick", function() {
		node.attr("transform", transform);
		circle.attr("transform", transform);
		text.attr("transform", transform);
	});

};




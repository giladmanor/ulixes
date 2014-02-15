function bubbles(data) {
	console.log("Badges: ", data);

	var width = 600, height = 350;
	$(".bubbles").text("");
	var svg = d3.select(".bubbles").append("svg").attr("width", width).attr("height", height);

	var force = d3.layout.force().gravity(.5).charge(-400).size([width, height]);
	force.nodes(data).start();

	var color = d3.scale.category20();
	var node = svg.selectAll(".node").data(data).enter().append("g").attr("class", "node").call(force.drag);

	var circle = svg.append("g").selectAll("circle").data(force.nodes()).enter().append("circle").attr("r", function(d) {
		return d.size;
	}).style("fill", function(d) {
		return color(d.size);
	}).call(force.drag);

	var text = svg.append("g").selectAll("text").data(force.nodes()).enter().append("text").attr("x", -10).attr("y", ".31em").text(function(d) {
		return d.name;
	});

	function transform(d) {
		return "translate(" + d.x + "," + d.y + ")";
	}


	force.on("tick", function() {
		node.attr("transform", transform);
		circle.attr("transform", transform);
		text.attr("transform", transform);
	});

	circle.on("click", function(d) {
		openActions(d);
	});

};

function openActions(node) {
	$.ajax({
		url : "/visual_aid/get_node_trace",
		data : {id:node.id},
		dataType : "json" // you want a difference between normal and ajax-calls, and json is standard
	}).success(function(res) {
		drawD4(res.actions);
	});
}

function drawD4(data) {// Draw Bagel for activities
	console.log("draw D3:::", data);
	$(".actionChart").text("");
	var width = 300, height = 300, radius = Math.min(width, height) / 2;
	var color = d3.scale.category20();
	//d3.scale.ordinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
	var arc = d3.svg.arc().outerRadius(radius - 20).innerRadius(radius - 50);
	var pie = d3.layout.pie().sort(null).value(function(d) {
		return d.value;
	});
	var svg = d3.select(".actionChart").append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	// data.forEach(function(d) {
	// d.population = +d.population;
	// });
	var g = svg.data(data).selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc");
	g.append("path").attr("d", arc).style("fill", function(d) {
		return color(d.value);
	});
	g.append("text").attr("transform", function(d) {
		return "translate(" + arc.centroid(d) + ")";
	}).attr("dy", ".35em").style("text-anchor", "middle").text(function(d) {
		return "";
	});

};

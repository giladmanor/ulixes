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
		data : {
			id : node.id
		},
		dataType : "json" // you want a difference between normal and ajax-calls, and json is standard
	}).success(function(res) {
		$("#node_name").text(res.name);
		$("#node_size").text(res.size);
		actionPie(res.actions);
		actionBars(res.actions);
	});
}

function actionBars(data) {
	console.log("bar chart: ",data);
	$(".actionBarChart").text("");
	var margin = {
		top : 20,
		right : 20,
		bottom : 30,
		left : 40
	}, width = 760 - margin.left - margin.right, height = 300 - margin.top - margin.bottom;
	var formatPercent = d3.format(".0");
	var x = d3.scale.ordinal().rangeRoundBands([0, width], .1, 1);
	var y = d3.scale.linear().range([height, 0]);
	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(formatPercent);
	var svg = d3.select(".actionBarChart").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	

	data.forEach(function(d) {
		d.value = +d.value;
	}); 
	
	x.domain(data.map(function(d) {return d.name;}));
	y.domain([0, d3.max(data, function(d) {return d.value;})]);

	svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
	svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("value");

	svg.selectAll(".bar").data(data).enter().append("rect").attr("class", "bar").attr("x", function(d) {
		return x(d.name);
	}).attr("width", x.rangeBand()).attr("y", function(d) {
		return y(d.value);
	}).attr("height", function(d) {
		return height - y(d.value);
	});

	d3.select("#doSort").on("change", change);

	var sortTimeout = setTimeout(function() {
		d3.select("#doSort").property("checked", true).each(change);
	}, 2000);

	function change() {
		clearTimeout(sortTimeout);

		// Copy-on-write since tweens are evaluated after a delay.
		var x0 = x.domain(data.sort(this.checked ? function(a, b) {
			return b.value - a.value;
		} : function(a, b) {
			return d3.ascending(a.name, b.name);
		}).map(function(d) {
			return d.name;
		})).copy();

		var transition = svg.transition().duration(750), delay = function(d, i) {
			return i * 50;
		};

		transition.selectAll(".bar").delay(delay).attr("x", function(d) {
			return x0(d.name);
		});

		transition.select(".x.axis").call(xAxis).selectAll("g").delay(delay);
	}

}

function actionPie(data) {// Draw Bagel for activities
	console.log("draw D3:::", data);
	$(".actionChart").text("");
	var width = 300, height = 300, radius = Math.min(width, height) / 2;
	var color = d3.scale.category20();
	//d3.scale.ordinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
	var arc = d3.svg.arc().outerRadius(radius - 20).innerRadius(radius - 70);
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

var draw = {
	pie : function(handle_id, data) {// Draw Bagel for activities
		console.log("draw pie:::", data);
		$("#" + handle_id).text("");
		var width = 150, height = 150, radius = Math.min(width, height) / 2;
		var color = d3.scale.category20();
		//d3.scale.ordinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
		var arc = d3.svg.arc().outerRadius(radius - 20).innerRadius(radius - 50);
		var pie = d3.layout.pie().sort(null).value(function(d) {
			return d.value;
		});
		var svg = d3.select("#" + handle_id).append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
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

			if (d.value > 0) {
				console.log("::::", d);
				return d.data.name;
			} else {
				return "";
			}

		});

	},
	horisontalBars : function(handle_id, data) {
		console.log("draw horisontalBars:::", data);
		var margin = {
			top : 50,
			right : 20,
			bottom : 10,
			left : 65
		};
		var width = $("#" + handle_id).width() - margin.left - margin.right, height = 250 - margin.top - margin.bottom;

		var y = d3.scale.ordinal().rangeRoundBands([0, height], .3);

		var x = d3.scale.linear().rangeRound([0, width]);

		var color = d3.scale.ordinal().range(["#c7001e", "#f6a580", "#cccccc", "#92c6db", "#086fad"]);

		var xAxis = d3.svg.axis().scale(x).orient("top");

		var yAxis = d3.svg.axis().scale(y).orient("left");

		var svg = d3.select("#" + handle_id).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).attr("id", "d3-plot").append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		var keys = Object.keys(data[0]);
		keys.splice(keys.indexOf("label"),1);
		color.domain(keys);
		console.log("keys: ",keys);

		data.forEach(function(d) {
			// calc percentages
			var total = 0;
			keys.forEach(function(k){
				total = total + d[k];
				
			});
			console.log("===>",total);
			
			keys.forEach(function(k){
				d[k] = d[k]*100 / total;
				
			});
			
			var x0 = 0;//-1 * (d["Neither agree nor disagree"] / 2 + d["Disagree"] + d["Strongly disagree"]);
			var idx = 0;
			d.boxes = color.domain().map(function(name) {
				return {
					name : name,
					x0 : x0,
					x1 : x0 += +d[name],
					N : +total,
					n : +d[keys[idx += 1]]
				};
			});
			
			
		});

		var min_val = d3.min(data, function(d) {
			console.log(d.boxes);
			return d.boxes[0].x0;
		});

		var max_val = d3.max(data, function(d) {
			return d.boxes[d.boxes.length-1].x1;
		});

		x.domain([min_val, max_val]).nice();
		y.domain(data.map(function(d) {
			return d.label;
		}));

		svg.append("g").attr("class", "x axis").call(xAxis);

		svg.append("g").attr("class", "y axis").call(yAxis);

		var vakken = svg.selectAll(".question").data(data).enter().append("g").attr("class", "bar").attr("transform", function(d) {
			return "translate(0," + y(d.label) + ")";
		});

		var bars = vakken.selectAll("rect").data(function(d) {
			return d.boxes;
		}).enter().append("g").attr("class", "subbar");

		bars.append("rect").attr("height", y.rangeBand()).attr("x", function(d) {
			return x(d.x0);
		}).attr("width", function(d) {
			return x(d.x1) - x(d.x0);
		}).style("fill", function(d) {
			return color(d.name);
		});

		bars.append("text").attr("x", function(d) {
			return x(d.x0);
		}).attr("y", y.rangeBand() / 2).attr("dy", "0.5em").attr("dx", "0.5em").style("font", "10px sans-serif").style("text-anchor", "begin").text(function(d) {
			return d.n !== 0 && (d.x1 - d.x0) > 3 ? d.n : "";
		});

		vakken.insert("rect", ":first-child").attr("height", y.rangeBand()).attr("x", "1").attr("width", width).attr("fill-opacity", "0.5").style("fill", "#F5F5F5").attr("class", function(d, index) {
			return index % 2 == 0 ? "even" : "uneven";
		});

		svg.append("g").attr("class", "y axis").append("line").attr("x1", x(0)).attr("x2", x(0)).attr("y2", height);

		var startp = svg.append("g").attr("class", "legendbox").attr("id", "mylegendbox");
		// this is not nice, we should calculate the bounding box and use that
		var legend_tabs = [0, 120, 200, 375, 450];
		var legend = startp.selectAll(".legend").data(color.domain().slice()).enter().append("g").attr("class", "legend").attr("transform", function(d, i) {
			return "translate(" + legend_tabs[i] + ",-45)";
		});

		legend.append("rect").attr("x", 0).attr("width", 18).attr("height", 18).style("fill", color);

		legend.append("text").attr("x", 22).attr("y", 9).attr("dy", ".35em").style("text-anchor", "begin").style("font", "10px sans-serif").text(function(d) {
			return d;
		});

		d3.selectAll(".axis path").style("fill", "none").style("stroke", "#000").style("shape-rendering", "crispEdges");

		d3.selectAll(".axis line").style("fill", "none").style("stroke", "#000").style("shape-rendering", "crispEdges");

		var movesize = width / 2 - startp.node().getBBox().width / 2;
		d3.selectAll(".legendbox").attr("transform", "translate(" + movesize + ",0)");

	},
	gaussian : function(handle_id, data) {

	},
};

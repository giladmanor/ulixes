// Display a warning for browsers without SVG
function svgWarning() {
	if (!document.createElementNS || !document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect)
		window.onload = function() {
			var a = document.createElement("div");
			a.innerHTML = svgWarningHtml, document.body.appendChild(a), document.getElementById("warnclose").onclick = function() {
				document.getElementById("svgWarning").style.display = "none"
			}
		};
	else
		return
}

function totalsToFrequencies(a, b) {
	var c = 0;
	for (var d in a)
	c += a[d];
	c == 0 && ( c = 1);
	var e = {};
	e.dirs = [], e.sum = c;
	for (var d in a) {
		var f = a[d] / c, g;
		a[d] > 0 ? g = b[d] / a[d] : g = 0, d == "null" ? e.calm = {
			d : null,
			p : f,
			s : null
		} : e.dirs.push({
			d : parseInt(d),
			p : f,
			s : g
		})
	}
	return e
}

function rollupForMonths(a, b) {
	var c = {}, d = {};
	for (var e = 10; e < 361; e += 10)
		c["" + e] = 0, d["" + e] = 0;
	c["null"] = 0, d["null"] = 0;
	for (var f in a.data) {
		var g = f.split(":");
		if (g.length == 1)
			var h = g[0];
		else
			var i = g[0], h = g[1];
		if (b && !b[i - 1])
			continue;
		c[h] += a.data[f][0], d[h] += a.data[f][0] * a.data[f][1]
	}
	return totalsToFrequencies(c, d)
}

function probArcTextT(a) {
	var b = probabilityToRadius(a);
	return "translate(" + visWidth + "," + (visWidth - b) + ")" + "rotate(" + a.d + ",0," + b + ")"
}

function speedArcTextT(a) {
	var b = speedToRadius(a);
	return "translate(" + visWidth + "," + (visWidth - b) + ")" + "rotate(" + a.d + ",0," + b + ")"
}

function speedText(a) {
	return a.s < 10 ? "" : a.s.toFixed(0)
}

function probabilityText(a) {
	return a.p < .02 ? "" : (100 * a.p).toFixed(0)
}

function speedToColor(a) {
	return speedToColorScale(a.s)
}

function probabilityToColor(a) {
	return probabilityToColorScale(a.p)
}

function probabilityToRadius(a) {
	return probabilityToRadiusScale(a.p)
}

function speedToRadius(a) {
	return speedToRadiusScale(a.s)
}

function drawComplexArcs(a, b, c, d, e, f) {
	a.append("svg:g").attr("class", "arcs").selectAll("path").data(b.dirs).enter().append("svg:path").attr("d", arc(e)).style("fill", c).attr("transform", "translate(" + visWidth + "," + visWidth + ")").append("svg:title").text(function(a) {
		return a.d + "° " + (100 * a.p).toFixed(1) + "% " + a.s.toFixed(0) + "kts"
	});
	if (!1)
		a.append("svg:g").attr("class", "arctext").selectAll("text").data(b.dirs).enter().append("svg:text").text(d).attr("dy", "-3px").attr("transform", f);
	var g = a.append("svg:g").attr("class", "calmwind").selectAll("text").data([b.calm.p]).enter();
	g.append("svg:text").attr("transform", "translate(" + visWidth + "," + visWidth + ")").text(function(a) {
		return Math.round(a * 100) + "%"
	}), g.append("svg:text").attr("transform", "translate(" + visWidth + "," + (visWidth + 14) + ")").attr("class", "calmcaption").text("calm")
}

function updatePageText(a) {
	if (!("info" in a)) {
		d3.selectAll(".stationid").text("????"), d3.selectAll(".stationname").text("Unknown station");
		return
	}
	document.title = "Wind History for " + a.info.id, d3.selectAll(".stationid").text(a.info.id), d3.selectAll(".stationname").text(a.info.name.toLowerCase());
	var b = "map.html#10.00/" + a.info.lat + "/" + a.info.lon;
	d3.select("#maplink").html('<a href="' + b + '">' + a.info.lat + ", " + a.info.lon + "</a>"), d3.select("#whlink").attr("href", b);
	var c = "http://weatherspark.com/#!dashboard;loc=" + a.info.lat + "," + a.info.lon + ";t0=01/01;t1=12/31";
	d3.select("#wslink").attr("href", c);
	var d = "http://www.wunderground.com/cgi-bin/findweather/getForecast?query=" + a.info.id;
	d3.select("#wulink").attr("href", d);
	var e = "http://vfrmap.com/?type=vfrc&lat=" + a.info.lat + "&lon=" + a.info.lon + "&zoom=10";
	d3.select("#vmlink").attr("href", e);
	var f = "http://runwayfinder.com/?loc=" + a.info.id;
	d3.select("#rflink").attr("href", f);
	var g = "http://www.navmonster.com/apt/" + a.info.id;
	d3.select("#nmlink").attr("href", g)
}

function updateWindVisDiagrams(a) {
	updateBigWindrose(a, "#windrose"), updateBigWindrose(a, "#windspeed")
}

function updateBigWindrose(a, b) {
	var c = d3.select(b).select("svg"), d = rollupForMonths(a, selectedMonthControl.selected());
	b == "#windrose" ? updateComplexArcs(c, d, speedToColor, speedText, windroseArcOptions, probArcTextT) : updateComplexArcs(c, d, probabilityToColor, probabilityText, windspeedArcOptions, speedArcTextT)
}

function updateComplexArcs(a, b, c, d, e, f) {
	a.select("g.arcs").selectAll("path").data(b.dirs).transition().duration(200).style("fill", c).attr("d", arc(e)), a.select("g.arcs").selectAll("path").select("title").text(function(a) {
		return a.d + "° " + (100 * a.p).toFixed(1) + "% " + a.s.toFixed(0) + "kts";
	}), a.select("g.calmwind").select("text").data([b.calm.p]).text(function(a) {
		return Math.round(a * 100) + "%";
	});
}


// ENTRY POINT /////////////////////
// TODO: EP
function makeWindVis(a) {
	var b = "data/" + a + ".json", c = null;
	d3.json(b, function(a) {
		c = a, updatePageText(a),
		 drawBigWindrose(a, "#windrose", "Frequency by Direction"),
		 drawBigWindrose(a, "#windspeed", "Average Speed by Direction"), 
		 selectedMonthControl.setCallback(function() {
			updateWindVisDiagrams(a);
		});
	}), selectedMonthControl = new monthControl(null), selectedMonthControl.install("#monthControlDiv");
}


// DRAW GRAPH
// a: data
// b: html tag ID
// c: text title
function drawBigWindrose(a, b, c) {
	var d = 400, e = 400, f = Math.min(d, e) / 2, g = 20, h = 34, i = d3.select(b).append("svg:svg").attr("width", d + "px").attr("height", e + 30 + "px");
	if (b == "#windrose")
		var j = d3.range(.025, .151, .025), k = d3.range(.05, .101, .05), l = probabilityToRadiusScale, m = function(a) {
			return "" + (a * 100).toFixed(0) + "%";
		};
	else
		var j = d3.range(5, 20.1, 5), k = d3.range(5, 15.1, 5), l = speedToRadiusScale, m = function(a) {
			return "" + a + "kts";
		};
	i.append("svg:g").attr("class", "axes").selectAll("circle").data(j).enter().append("svg:circle").attr("cx", f).attr("cy", f).attr("r", l), i.append("svg:g").attr("class", "tickmarks").selectAll("text").data(k).enter().append("svg:text").text(m).attr("dy", "-2px").attr("transform", function(a) {
		var b = visWidth - l(a);
		return "translate(" + f + "," + b + ") ";
	}), i.append("svg:g").attr("class", "labels").selectAll("text").data(d3.range(30, 361, 30)).enter().append("svg:text").attr("dy", "-4px").attr("transform", function(a) {
		return "translate(" + f + "," + g + ") rotate(" + a + ",0," + (f - g) + ")";
	}).text(function(a) {
		return a;
	});
	var n = rollupForMonths(a, selectedMonthControl.selected());
	b == "#windrose" ? drawComplexArcs(i, n, speedToColor, speedText, windroseArcOptions, probArcTextT) : drawComplexArcs(i, n, probabilityToColor, probabilityText, windspeedArcOptions, speedArcTextT), i.append("svg:text").text(c).attr("class", "caption").attr("transform", "translate(" + d / 2 + "," + (e + 20) + ")");
}

function plotSmallRose(a, b) {
	var c = [], d = selectedMonthControl.selected();
	for (var e = 1; e < 13; e++) {
		var f = 0;
		sum = 0;
		for (var g = 0; g < 12; g++)
			d[g] && (f += 1, sum += b[g][e]);
		var h = sum / f;
		c.push({
			d : e * 30,
			p : h / 100
		})
	}
	a.append("svg:g").selectAll("path").data(c).enter().append("svg:path").attr("d", arc(smallArcOptions)), a.append("svg:circle").attr("r", smallArcOptions.from)
}

function installGeoTiler() {
	if (d3.geo.tiler)
		console.log("d3.geo.tiler defined: not using ours. Good luck!");
	else {
		d3.geo.tiler = function() {
			function h(b, c, d, e) {
				if (e >= f)
					return b.map(a);
				var g = -1, i = b.length, j = [[], [], [], []], k = 1 << e++, l;
				while (++g < i) {
					l = b[g];
					var m = l[0] * k - c >= .5, n = l[1] * k - d >= .5;
					j[m << 1 | n].push(l)
				}
				return c <<= 1, d <<= 1, {
					0 : j[0].length && h(j[0], c, d, e),
					1 : j[1].length && h(j[1], c, d + 1, e),
					2 : j[2].length && h(j[2], c + 1, d, e),
					3 : j[3].length && h(j[3], c + 1, d + 1, e)
				}
			}

			var b = {}, c = [], d = d3.geo.mercator().scale(1).translate([.5, .5]), e = Object, f = 8, g = null;
			return b.location = function(a) {
				return arguments.length ? ( e = a, g = null, b) : e
			}, b.projection = function(a) {
				return arguments.length ? ( d = a, g = null, b) : d
			}, b.zoom = function(a) {
				return arguments.length ? ( f = a, g = null, b) : f
			}, b.points = function(a) {
				return arguments.length ? ( c = a, g = null, b) : c
			}, b.tile = function(a, f, i) {
				function k(b, c, d, e) {
					if (!b)
						return;
					if (e < i) {
						var g = Math.pow(2, e - i), h = a * g - c >= .5, j = f * g - d >= .5;
						k(b[h << 1 | j], c << 1 | h, d << 1 | j, e + 1)
					} else
						l(b)
				}

				function l(a) {
					if (a.length)
						for (var b = -1, c = a.length; ++b < c; )
							j.push(a[b]);
					else
						for (var b = -1; ++b < 4; )
							a[b] && l(a[b])
				}

				var j = [];
				return g || ( g = h(c.map(function(a, c) {
					var f = d(e.call(b, a, c));
					return f.data = a, f
				}), 0, 0, 0)), k(g, 0, 0, 0), j
			}, b
		};
		function a(a) {
			return a.data
		}

	}
}

function stations(a, b) {
	function e(a, b) {
		function e(a) {
			return a = b({
				lon : a.value[0],
				lat : a.value[1]
			}), "translate(" + a.x + "," + a.y + ")"
		}

		b = b(a).locationPoint;
		var d = d3.select(a.element = po.svg("g")).selectAll("g").data(c.tile(a.column, a.row, a.zoom)).enter().append("svg:a").attr("xlink:href", function(a) {
			return "station.html?" + a.key
		}).attr("target", "_blank").append("svg:g").attr("class", "station").attr("transform", e);
		d.append("svg:title").text(function(a) {
			return a.value[2]
		}), a.zoom > 6 ? d.each(function(a) {
			plotSmallRose(d3.select(this), a.value[3])
		}) : d.append("svg:circle").attr("r", 5).attr("class", "alone")
	}

	installGeoTiler();
	var c = d3.geo.tiler().zoom(12).location(function(a) {
		return a.value
	}), d = org.polymaps.layer(e);
	return d.id("stations"), d3.json(a, function(a) {
		b(a), c.points(d3.entries(a)), d.reload()
	}), d
}

function makeMap() {
	var a = location.hash != "";
	map = po.map().container(document.getElementById("map").appendChild(po.svg("svg"))).add(po.dblclick()).add(po.drag()).add(po.arrow()).add(po.wheel().smooth(!1)).add(po.hash()).add(po.touch().rotate(!1)), a || (map.center({
		lon : -95,
		lat : 36
	}), map.zoom(4), !navigator.geolocation || navigator.geolocation.getCurrentPosition(function(a) {
		map.center({
			lon : a.coords.longitude,
			lat : a.coords.latitude
		}), map.zoom(8)
	}, function(a, b) {
	}, {
		maximumAge : 36e5,
		timeout : 1e4,
		enableHighAccuracy : !1
	})), map.add(po.image().id("osmMapnik").url(po.url("http://{S}tile.openstreetmap.org/{Z}/{X}/{Y}.png").hosts(["a.", "b.", "c.", ""]))), map.zoomRange([2, 12]);
	var b = stations("data/stations-md.json", function(a) {
		stationDb = a
	});
	map.add(b), map.add(po.compass().pan("none")), selectedMonthControl = new monthControl(b.reload), selectedMonthControl.install("#monthControlDiv")
}

function searchMap(a) {
	var b = document.forms[0].elements[0].value;
	b = b.toUpperCase();
	var c = stationDb[b];
	c ? (map.center({
		lon : c[0],
		lat : c[1]
	}), map.zoom() < 8 && map.zoom(8)) : (document.forms[0].elements[0].style["background-color"] = "#d55", setTimeout(function() {
		document.forms[0].elements[0].style.removeProperty("background-color")
	}, 150))
}

function monthControl(a) {
	var b = a, c = [!0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0];
	this.selected = function() {
		return c
	}, this.setCallback = function(a) {
		b = a
	}, this.install = function(a) {
		function e(a, b, e) {
			d && ( d = !1, c = [!1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1]), c[b] = !c[b], g()
		}

		function f() {
			c.unshift(c.pop()), g()
		}

		function g() {
			d3.select("#monthControl").selectAll("g.month").data(c), d3.selectAll("#monthControl>g>path").attr("class", function(a, b) {
				return c[b] ? "selected" : null
			}), b && b(c)
		}

		function i() {
			h != null ? (window.clearInterval(h), h = null, k.attr("display", "none"), j.attr("display", null)) : (d && ( d = !1, c = [!1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !0]), f(), h = window.setInterval(f, 1e3), j.attr("display", "none"), k.attr("display", null))
		}

		var d = !0, h = null;
		d3.selectAll(a).append("svg:svg").attr("width", "150").attr("height", "150"), d3.select("#monthControlDiv>svg").append("svg:g").attr("id", "monthControl"), d3.select("#monthControl").append("svg:circle").attr("class", "backdrop").attr("r", 71.5).attr("transform", "translate(75, 75)"), d3.select("#monthControl").append("svg:g").on("click", i).on("touchmove", function() {
			d3.event.preventDefault()
		}).on("mousedown", function() {
			d3.event.preventDefault()
		}).append("svg:circle").attr("r", 20).attr("class", "center").attr("transform", "translate(75, 75)");
		var j = d3.select("#monthControl>g").append("svg:g").attr("transform", "translate(75, 75)");
		j.append("svg:polygon").attr("points", "-6,-8, -6,8 9,0");
		var k = d3.select("#monthControl>g").append("svg:g").attr("transform", "translate(75, 75)");
		k.append("svg:rect").attr("x", -8).attr("y", -8).attr("height", "16").attr("width", "6"), k.append("svg:rect").attr("x", 2).attr("y", -8).attr("height", "16").attr("width", "6"), k.attr("display", "none"), d3.select("#monthControl").selectAll("g.month").data(c).enter().append("svg:g").attr("class", "month"), d3.selectAll("g.month").attr("transform", "translate(75, 75)").append("svg:path").attr("d", d3.svg.arc().innerRadius(20).outerRadius(70).startAngle(function(a, b) {
			return b * Math.PI * 2 / 12 - Math.PI * 2 / 24
		}).endAngle(function(a, b) {
			return (b + 1) * Math.PI * 2 / 12 - Math.PI * 2 / 24
		})).attr("class", function(a, b) {
			return c[b] ? "selected" : null
		}), d3.selectAll("g.month").append("svg:text").attr("transform", function(a, b) {
			return "rotate(" + (b * 30 - 90) + "), translate(58, 0), rotate(90)"
		}).attr("dy", ".35em").text(function(a, b) {
			return ["J","F","M","A","M","J","J","A","S","O","N","D"][b]
		}), d3.selectAll("g.month").on("mousedown", function() {
			d3.event.preventDefault()
		}).on("touchmove", function() {
			d3.event.preventDefault()
		}).on("click", function(a, b) {
			e(a, b, d3.select(this))
		})
	}
}

var svgWarningHtml = '<div id="svgWarning"     style="z-index: 1; width: 300px; padding: 8px 8px 8px 8px;     position: fixed; top: 200px; left: 50%; margin-left: -150px;     background: #ffd; border: solid 4px #b00; font-size: 14pt;">  <div id="warnclose"       style="position: absolute; right: 12px; color: white; font-weight: bold; cursor: default;"  >X</div>  <div id="warntitle"       style="font-weight: bold; background: #b00; color: white; text-align: center;"  >WARNING</div>  Your browser does not support SVG, a required feature for this site.  Please see <A href="about.html#browser">about browser compatibility</a>.</div></div>';
(function() {
	function e() {
		return this
	}

	function f(a) {
		return a.length
	}

	function g(a) {
		return a == null
	}

	function h(a) {
		return a.replace(/(^\s+)|(\s+$)/g, "").replace(/\s+/g, " ")
	}

	function j(a) {
		var b = {}, c = [];
		return b.add = function(a) {
			for (var d = 0; d < c.length; d++)
				if (c[d].listener == a)
					return b;
			return c.push({
				listener : a,
				on : !0
			}), b
		}, b.remove = function(a) {
			for (var d = 0; d < c.length; d++) {
				var e = c[d];
				if (e.listener == a) {
					e.on = !1, c = c.slice(0, d).concat(c.slice(d + 1));
					break
				}
			}
			return b
		}, b.dispatch = function() {
			var a = c;
			for (var b = 0, d = a.length; b < d; b++) {
				var e = a[b];
				e.on && e.listener.apply(this, arguments)
			}
		}, b
	}

	function m(a) {
		return a + ""
	}

	function n(a) {
		var b = a.lastIndexOf("."), c = b >= 0 ? a.substring(b) : ( b = a.length, ""), d = [];
		while (b > 0)
		d.push(a.substring(b -= 3, b + 3));
		return d.reverse().join(",") + c
	}

	function s(a) {
		return function(b) {
			return b <= 0 ? 0 : b >= 1 ? 1 : a(b)
		}
	}

	function t(a) {
		return function(b) {
			return 1 - a(1 - b)
		}
	}

	function u(a) {
		return function(b) {
			return .5 * (b < .5 ? a(2 * b) : 2 - a(2 - 2 * b))
		}
	}

	function v(a) {
		return a
	}

	function w(a) {
		return function(b) {
			return Math.pow(b, a)
		}
	}

	function x(a) {
		return 1 - Math.cos(a * Math.PI / 2)
	}

	function y(a) {
		return Math.pow(2, 10 * (a - 1))
	}

	function z(a) {
		return 1 - Math.sqrt(1 - a * a)
	}

	function A(a, b) {
		var c;
		return arguments.length < 2 && ( b = .45), arguments.length < 1 ? ( a = 1, c = b / 4) : c = b / (2 * Math.PI) * Math.asin(1 / a),
		function(d) {
			return 1 + a * Math.pow(2, 10 * -d) * Math.sin((d - c) * 2 * Math.PI / b)
		}

	}

	function B(a) {
		return a || ( a = 1.70158),
		function(b) {
			return b * b * ((a + 1) * b - a)
		}

	}

	function C(a) {
		return a < 1 / 2.75 ? 7.5625 * a * a : a < 2 / 2.75 ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : a < 2.5 / 2.75 ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375
	}

	function F(a) {
		return a in E || /\bcolor\b/.test(a) ? d3.interpolateRgb : d3.interpolate
	}

	function G(a, b) {
		return b = b - ( a = +a) ? 1 / (b - a) : 0,
		function(c) {
			return (c - a) * b
		}

	}

	function H(a, b) {
		return b = b - ( a = +a) ? 1 / (b - a) : 0,
		function(c) {
			return Math.max(0, Math.min(1, (c - a) * b))
		}

	}

	function I(a, b, c) {
		return new J(a, b, c)
	}

	function J(a, b, c) {
		this.r = a, this.g = b, this.b = c
	}

	function K(a) {
		return a < 16 ? "0" + a.toString(16) : a.toString(16)
	}

	function L(a, b, c) {
		var d = 0, e = 0, f = 0, g, h, i;
		g = /([a-z]+)\((.*)\)/i.exec(a);
		if (g) {
			h = g[2].split(",");
			switch(g[1]) {
				case"hsl":
					return c(parseFloat(h[0]), parseFloat(h[1]) / 100, parseFloat(h[2]) / 100);
				case"rgb":
					return b(N(h[0]), N(h[1]), N(h[2]))
			}
		}
		return ( i = O[a]) ? b(i.r, i.g, i.b) : (a != null && a.charAt(0) === "#" && (a.length === 4 ? ( d = a.charAt(1), d += d, e = a.charAt(2), e += e, f = a.charAt(3), f += f) : a.length === 7 && ( d = a.substring(1, 3), e = a.substring(3, 5), f = a.substring(5, 7)), d = parseInt(d, 16), e = parseInt(e, 16), f = parseInt(f, 16)), b(d, e, f))
	}

	function M(a, b, c) {
		var d = Math.min(a /= 255, b /= 255, c /= 255), e = Math.max(a, b, c), f = e - d, g, h, i = (e + d) / 2;
		return f ? ( h = i < .5 ? f / (e + d) : f / (2 - e - d), a == e ? g = (b - c) / f + (b < c ? 6 : 0) : b == e ? g = (c - a) / f + 2 : g = (a - b) / f + 4, g *= 60) : h = g = 0, Q(g, h, i)
	}

	function N(a) {
		var b = parseFloat(a);
		return a.charAt(a.length - 1) === "%" ? Math.round(b * 2.55) : b
	}

	function Q(a, b, c) {
		return new R(a, b, c)
	}

	function R(a, b, c) {
		this.h = a, this.s = b, this.l = c
	}

	function S(a, b, c) {
		function f(a) {
			return a > 360 ? a -= 360 : a < 0 && (a += 360), a < 60 ? d + (e - d) * a / 60 : a < 180 ? e : a < 240 ? d + (e - d) * (240 - a) / 60 : d
		}

		function g(a) {
			return Math.round(f(a) * 255)
		}

		var d, e;
		return a = a % 360, a < 0 && (a += 360), b = b < 0 ? 0 : b > 1 ? 1 : b, c = c < 0 ? 0 : c > 1 ? 1 : c, e = c <= .5 ? c * (1 + b) : c + b - c * b, d = 2 * c - e, I(g(a + 120), g(a), g(a - 120))
	}

	function T(a) {
		return d(a, W), a
	}

	function X(a) {
		return function() {
			return U(a, this)
		}
	}

	function Y(a) {
		return function() {
			return V(a, this)
		}
	}

	function Z(a) {
		return {
			__data__ : a
		}
	}

	function $(a) {
		return d(a, _), a
	}

	function ba(a) {
		return arguments.length || ( a = d3.ascending),
		function(b, c) {
			return a(b && b.__data__, c && c.__data__)
		}

	}

	function bc(a, b) {
		d(a, be);
		var c = {}, e = d3.dispatch("start", "end"), f = bh, g = Date.now();
		return a.id = b, a.tween = function(b, d) {
			return arguments.length < 2 ? c[b] : (d == null ?
			delete c[b] : c[b] = d, a)
		}, a.ease = function(b) {
			return arguments.length ? ( f = typeof b == "function" ? b : d3.ease.apply(d3, arguments), a) : f
		}, a.each = function(b, c) {
			return arguments.length < 2 ? bi.call(a, b) : (e[b].add(c), a)
		}, d3.timer(function(d) {
			return a.each(function(h, i, j) {
				function p(a) {
					if (o.active > b)
						return r();
					o.active = b;
					for (var d in c)( d = c[d].call(l, h, i)) && k.push(d);
					return e.start.dispatch.call(l, h, i), q(a) || d3.timer(q, 0, g), 1
				}

				function q(a) {
					if (o.active !== b)
						return r();
					var c = (a - m) / n, d = f(c), g = k.length;
					while (g > 0)
					k[--g].call(l, d);
					if (c >= 1)
						return r(), bg = b, e.end.dispatch.call(l, h, i), bg = 0, 1
				}

				function r() {
					return --o.count ||
					delete l.__transition__, 1
				}

				var k = [], l = this, m = a[j][i].delay, n = a[j][i].duration, o = l.__transition__ || (l.__transition__ = {
					active : 0,
					count : 0
				});
				++o.count, m <= d ? p(d) : d3.timer(p, m, g)
			}), 1
		}, 0, g), a
	}

	function bd(a) {
		return typeof a == "function" ? function(b, c, d) {
			var e = a.call(this, b, c) + "";
			return d != e && d3.interpolate(d, e)
		} : ( a = a + "",
		function(b, c, d) {
			return d != a && d3.interpolate(d, a)
		})

	}

	function bi(a) {
		for (var b = 0, c = this.length; b < c; b++)
			for (var d = this[b], e = 0, f = d.length; e < f; e++) {
				var g = d[e];
				g && a.call( g = g.node, g.__data__, e, b)
			}
		return this
	}

	function bm() {
		var a, b = Date.now(), c = bj;
		while (c) a = b - c.then, a >= c.delay && (c.flush = c.callback(a)), c = c.next;
		var d = bn() - b;
		d > 24 ? (isFinite(d) && (clearTimeout(bl), bl = setTimeout(bm, d)), bk = 0) : ( bk = 1, bo(bm))
	}

	function bn() {
		var a = null, b = bj, c = Infinity;
		while (b)
		b.flush ? b = a ? a.next = b.next : bj = b.next : ( c = Math.min(c, b.then + b.delay), b = ( a = b).next);
		return c
	}

	function bp() {
	}

	function bq(a) {
		var b = a[0], c = a[a.length - 1];
		return b < c ? [b, c] : [c, b]
	}

	function br(a, b) {
		var c = 0, d = a.length - 1, e = a[c], f = a[d], g;
		return f < e && ( g = c, c = d, d = g, g = e, e = f, f = g), b = b(f - e), a[c] = b.floor(e), a[d] = b.ceil(f), a
	}

	function bs() {
		return Math
	}

	function bt(a, b, c, d) {
		function g() {
			var g = a.length == 2 ? bz : bA, i = d ? H : G;
			return e = g(a, b, i, c), f = g(b, a, i, d3.interpolate), h
		}

		function h(a) {
			return e(a)
		}

		var e, f;
		return h.invert = function(a) {
			return f(a)
		}, h.domain = function(b) {
			return arguments.length ? ( a = b.map(Number), g()) : a
		}, h.range = function(a) {
			return arguments.length ? ( b = a, g()) : b
		}, h.rangeRound = function(a) {
			return h.range(a).interpolate(d3.interpolateRound)
		}, h.clamp = function(a) {
			return arguments.length ? ( d = a, g()) : d
		}, h.interpolate = function(a) {
			return arguments.length ? ( c = a, g()) : c
		}, h.ticks = function(b) {
			return bx(a, b)
		}, h.tickFormat = function(b) {
			return by(a, b)
		}, h.nice = function() {
			return br(a, bv), g()
		}, h.copy = function() {
			return bt(a, b, c, d)
		}, g()
	}

	function bu(a, b) {
		return a.range = d3.rebind(a, b.range), a.rangeRound = d3.rebind(a, b.rangeRound), a.interpolate = d3.rebind(a, b.interpolate), a.clamp = d3.rebind(a, b.clamp), a
	}

	function bv(a) {
		return a = Math.pow(10, Math.round(Math.log(a) / Math.LN10) - 1), {
			floor : function(b) {
				return Math.floor(b / a) * a
			},
			ceil : function(b) {
				return Math.ceil(b / a) * a
			}
		}
	}

	function bw(a, b) {
		var c = bq(a), d = c[1] - c[0], e = Math.pow(10, Math.floor(Math.log(d / b) / Math.LN10)), f = b / d * e;
		return f <= .15 ? e *= 10 : f <= .35 ? e *= 5 : f <= .75 && (e *= 2), c[0] = Math.ceil(c[0] / e) * e, c[1] = Math.floor(c[1] / e) * e + e * .5, c[2] = e, c
	}

	function bx(a, b) {
		return d3.range.apply(d3, bw(a, b))
	}

	function by(a, b) {
		return d3.format(",." + Math.max(0, -Math.floor(Math.log(bw(a,b)[2]) / Math.LN10 + .01)) + "f")
	}

	function bz(a, b, c, d) {
		var e = c(a[0], a[1]), f = d(b[0], b[1]);
		return function(a) {
			return f(e(a))
		}
	}

	function bA(a, b, c, d) {
		var e = [], f = [], g = 0, h = a.length;
		while (++g < h)e.push(c(a[g - 1], a[g])), f.push(d(b[g - 1], b[g]));
		return function(b) {
			var c = d3.bisect(a, b, 1, a.length - 1) - 1;
			return f[c](e[c](b))
		}
	}

	function bB(a, b) {
		function d(c) {
			return a(b(c))
		}

		var c = b.pow;
		return d.invert = function(b) {
			return c(a.invert(b))
		}, d.domain = function(e) {
			return arguments.length ? ( b = e[0] < 0 ? bD : bC, c = b.pow, a.domain(e.map(b)), d) : a.domain().map(c)
		}, d.nice = function() {
			return a.domain(br(a.domain(), bs)), d
		}, d.ticks = function() {
			var d = bq(a.domain()), e = [];
			if (d.every(isFinite)) {
				var f = Math.floor(d[0]), g = Math.ceil(d[1]), h = c(d[0]), i = c(d[1]);
				if (b === bD) {
					e.push(c(f));
					for (; f++ < g; )
						for (var j = 9; j > 0; j--)
							e.push(c(f) * j)
				} else {
					for (; f < g; f++)
						for (var j = 1; j < 10; j++)
							e.push(c(f) * j);
					e.push(c(f))
				}
				for ( f = 0; e[f] < h; f++);
				for ( g = e.length; e[g - 1] > i; g--);
				e = e.slice(f, g)
			}
			return e
		}, d.tickFormat = function() {
			return bE
		}, d.copy = function() {
			return bB(a.copy(), b)
		}, bu(d, a)
	}

	function bC(a) {
		return Math.log(a) / Math.LN10
	}

	function bD(a) {
		return -Math.log(-a) / Math.LN10
	}

	function bE(a) {
		return a.toPrecision(1)
	}

	function bF(a, b) {
		function e(b) {
			return a(c(b))
		}

		var c = bG(b), d = bG(1 / b);
		return e.invert = function(b) {
			return d(a.invert(b))
		}, e.domain = function(b) {
			return arguments.length ? (a.domain(b.map(c)), e) : a.domain().map(d)
		}, e.ticks = function(a) {
			return bx(e.domain(), a)
		}, e.tickFormat = function(a) {
			return by(e.domain(), a)
		}, e.nice = function() {
			return e.domain(br(e.domain(), bv))
		}, e.exponent = function(a) {
			if (!arguments.length)
				return b;
			var f = e.domain();
			return c = bG( b = a), d = bG(1 / b), e.domain(f)
		}, e.copy = function() {
			return bF(a.copy(), b)
		}, bu(e, a)
	}

	function bG(a) {
		return function(b) {
			return b < 0 ? -Math.pow(-b, a) : Math.pow(b, a)
		}
	}

	function bH(a, b) {
		function f(b) {
			return d[((c[b] || (c[b] = a.push(b))) - 1) % d.length]
		}

		var c, d, e;
		return f.domain = function(d) {
			if (!arguments.length)
				return a;
			a = [], c = {};
			var e = -1, g = d.length, h;
			while (++e < g)
			c[ h = d[e]] || (c[h] = a.push(h));
			return f[b.t](b.x, b.p)
		}, f.range = function(a) {
			return arguments.length ? ( d = a, e = 0, b = {
				t : "range",
				x : a
			}, f) : d
		}, f.rangePoints = function(c, g) {
			arguments.length < 2 && ( g = 0);
			var h = c[0], i = c[1], j = (i - h) / (a.length - 1 + g);
			return d = a.length < 2 ? [(h + i) / 2] : d3.range(h + j * g / 2, i + j / 2, j), e = 0, b = {
				t : "rangePoints",
				x : c,
				p : g
			}, f
		}, f.rangeBands = function(c, g) {
			arguments.length < 2 && ( g = 0);
			var h = c[0], i = c[1], j = (i - h) / (a.length + g);
			return d = d3.range(h + j * g, i, j), e = j * (1 - g), b = {
				t : "rangeBands",
				x : c,
				p : g
			}, f
		}, f.rangeRoundBands = function(c, g) {
			arguments.length < 2 && ( g = 0);
			var h = c[0], i = c[1], j = Math.floor((i - h) / (a.length + g)), k = i - h - (a.length - g) * j;
			return d = d3.range(h + Math.round(k / 2), i, j), e = Math.round(j * (1 - g)), b = {
				t : "rangeRoundBands",
				x : c,
				p : g
			}, f
		}, f.rangeBand = function() {
			return e
		}, f.copy = function() {
			return bH(a, b)
		}, f.domain(a)
	}

	function bM(a, b) {
		function d() {
			var d = 0, f = a.length, g = b.length;
			c = [];
			while (++d < g)
			c[d - 1] = d3.quantile(a, d / g);
			return e
		}

		function e(a) {
			return isNaN( a = +a) ? NaN : b[d3.bisect(c, a)]
		}

		var c;
		return e.domain = function(b) {
			return arguments.length ? ( a = b.filter(function(a) {
				return !isNaN(a)
			}).sort(d3.ascending), d()) : a
		}, e.range = function(a) {
			return arguments.length ? ( b = a, d()) : b
		}, e.quantiles = function() {
			return c
		}, e.copy = function() {
			return bM(a, b)
		}, d()
	}

	function bN(a, b, c) {
		function f(b) {
			return c[Math.max(0, Math.min(e, Math.floor(d * (b - a))))]
		}

		function g() {
			return d = c.length / (b - a), e = c.length - 1, f
		}

		var d, e;
		return f.domain = function(c) {
			return arguments.length ? ( a = +c[0], b = +c[c.length - 1], g()) : [a, b]
		}, f.range = function(a) {
			return arguments.length ? ( c = a, g()) : c
		}, f.copy = function() {
			return bN(a, b, c)
		}, g()
	}

	function bQ(a) {
		return a.innerRadius
	}

	function bR(a) {
		return a.outerRadius
	}

	function bS(a) {
		return a.startAngle
	}

	function bT(a) {
		return a.endAngle
	}

	function bU(a) {
		function g(d) {
			return d.length < 1 ? null : "M" + e(a(bV(this, d, b, c)), f)
		}

		var b = bW, c = bX, d = "linear", e = bY[d], f = .7;
		return g.x = function(a) {
			return arguments.length ? ( b = a, g) : b
		}, g.y = function(a) {
			return arguments.length ? ( c = a, g) : c
		}, g.interpolate = function(a) {
			return arguments.length ? ( e = bY[ d = a], g) : d
		}, g.tension = function(a) {
			return arguments.length ? ( f = a, g) : f
		}, g
	}

	function bV(a, b, c, d) {
		var e = [], f = -1, g = b.length, h = typeof c == "function", i = typeof d == "function", j;
		if (h && i)
			while (++f < g)
			e.push([c.call(a, j = b[f], f), d.call(a, j, f)]);
		else if (h)
			while (++f < g)
			e.push([c.call(a, b[f], f), d]);
		else if (i)
			while (++f < g)
			e.push([c, d.call(a, b[f], f)]);
		else
			while (++f < g)
			e.push([c, d]);
		return e
	}

	function bW(a) {
		return a[0]
	}

	function bX(a) {
		return a[1]
	}

	function bZ(a) {
		var b = [], c = 0, d = a.length, e = a[0];
		b.push(e[0], ",", e[1]);
		while (++c < d)
		b.push("L", (e=a[c])[0], ",", e[1]);
		return b.join("")
	}

	function b$(a) {
		var b = [], c = 0, d = a.length, e = a[0];
		b.push(e[0], ",", e[1]);
		while (++c < d)
		b.push("V", (e=a[c])[1], "H", e[0]);
		return b.join("")
	}

	function b_(a) {
		var b = [], c = 0, d = a.length, e = a[0];
		b.push(e[0], ",", e[1]);
		while (++c < d)
		b.push("H", (e=a[c])[0], "V", e[1]);
		return b.join("")
	}

	function ca(a, b) {
		return a.length < 4 ? bZ(a) : a[1] + cd(a.slice(1, a.length - 1), ce(a, b))
	}

	function cb(a, b) {
		return a.length < 3 ? bZ(a) : a[0] + cd((a.push(a[0]), a), ce([a[a.length - 2]].concat(a, [a[1]]), b))
	}

	function cc(a, b, c) {
		return a.length < 3 ? bZ(a) : a[0] + cd(a, ce(a, b))
	}

	function cd(a, b) {
		if (b.length < 1 || a.length != b.length && a.length != b.length + 2)
			return bZ(a);
		var c = a.length != b.length, d = "", e = a[0], f = a[1], g = b[0], h = g, i = 1;
		c && (d += "Q" + (f[0] - g[0] * 2 / 3) + "," + (f[1] - g[1] * 2 / 3) + "," + f[0] + "," + f[1], e = a[1], i = 2);
		if (b.length > 1) {
			h = b[1], f = a[i], i++, d += "C" + (e[0] + g[0]) + "," + (e[1] + g[1]) + "," + (f[0] - h[0]) + "," + (f[1] - h[1]) + "," + f[0] + "," + f[1];
			for (var j = 2; j < b.length; j++, i++)
				f = a[i], h = b[j], d += "S" + (f[0] - h[0]) + "," + (f[1] - h[1]) + "," + f[0] + "," + f[1]
		}
		if (c) {
			var k = a[i];
			d += "Q" + (f[0] + h[0] * 2 / 3) + "," + (f[1] + h[1] * 2 / 3) + "," + k[0] + "," + k[1]
		}
		return d
	}

	function ce(a, b) {
		var c = [], d = (1 - b) / 2, e, f = a[0], g = a[1], h = 1, i = a.length;
		while (++h < i) e = f, f = g, g = a[h], c.push([d * (g[0] - e[0]), d * (g[1] - e[1])]);
		return c
	}

	function cf(a) {
		if (a.length < 3)
			return bZ(a);
		var b = [], c = 1, d = a.length, e = a[0], f = e[0], g = e[1], h = [f, f, f, (e=a[1])[0]], i = [g, g, g, e[1]];
		b.push(f, ",", g), cn(b, h, i);
		while (++c < d) e = a[c], h.shift(), h.push(e[0]), i.shift(), i.push(e[1]), cn(b, h, i);
		c = -1;
		while (++c < 2)h.shift(), h.push(e[0]), i.shift(), i.push(e[1]), cn(b, h, i);
		return b.join("")
	}

	function cg(a) {
		if (a.length < 4)
			return bZ(a);
		var b = [], c = -1, d = a.length, e, f = [0], g = [0];
		while (++c < 3) e = a[c], f.push(e[0]), g.push(e[1]);
		b.push(cj(cm, f) + "," + cj(cm, g)), --c;
		while (++c < d) e = a[c], f.shift(), f.push(e[0]), g.shift(), g.push(e[1]), cn(b, f, g);
		return b.join("")
	}

	function ch(a) {
		var b, c = -1, d = a.length, e = d + 4, f, g = [], h = [];
		while (++c < 4) f = a[c % d], g.push(f[0]), h.push(f[1]);
		b = [cj(cm, g), ",", cj(cm, h)], --c;
		while (++c < e) f = a[c % d], g.shift(), g.push(f[0]), h.shift(), h.push(f[1]), cn(b, g, h);
		return b.join("")
	}

	function ci(a, b) {
		var c = a.length - 1, d = a[0][0], e = a[0][1], f = a[c][0] - d, g = a[c][1] - e, h = -1, i, j;
		while (++h <= c) i = a[h], j = h / c, i[0] = b * i[0] + (1 - b) * (d + j * f), i[1] = b * i[1] + (1 - b) * (e + j * g);
		return cf(a)
	}

	function cj(a, b) {
		return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
	}

	function cn(a, b, c) {
		a.push("C", cj(ck, b), ",", cj(ck, c), ",", cj(cl, b), ",", cj(cl, c), ",", cj(cm, b), ",", cj(cm, c))
	}

	function co(a, b) {
		return (b[1] - a[1]) / (b[0] - a[0])
	}

	function cp(a) {
		var b = 0, c = a.length - 1, d = [], e = a[0], f = a[1], g = d[0] = co(e, f);
		while (++b < c)
		d[b] = g + ( g = co( e = f, f = a[b + 1]));
		return d[b] = g, d
	}

	function cq(a) {
		var b = [], c, d, e, f, g = cp(a), h = -1, i = a.length - 1;
		while (++h < i) c = co(a[h], a[h + 1]), Math.abs(c) < 1e-6 ? g[h] = g[h + 1] = 0 : ( d = g[h] / c, e = g[h + 1] / c, f = d * d + e * e, f > 9 && ( f = c * 3 / Math.sqrt(f), g[h] = f * d, g[h + 1] = f * e));
		h = -1;
		while (++h <= i) f = (a[Math.min(i,h+1)][0] - a[Math.max(0,h-1)][0]) / (6 * (1 + g[h] * g[h])), b.push([f || 0, g[h] * f || 0]);
		return b
	}

	function cr(a) {
		return a.length < 3 ? bZ(a) : a[0] + cd(a, cq(a))
	}

	function cs(a) {
		var b, c = -1, d = a.length, e, f;
		while (++c < d) b = a[c], e = b[0], f = b[1] + bO, b[0] = e * Math.cos(f), b[1] = e * Math.sin(f);
		return a
	}

	function ct(a) {
		function i(f) {
			if (f.length < 1)
				return null;
			var i = bV(this, f, b, d), j = bV(this, f, b === c ? cu(i) : c, d === e ? cv(i) : e);
			return "M" + g(a(j), h) + "L" + g(a(i.reverse()), h) + "Z"
		}

		var b = bW, c = bW, d = 0, e = bX, f = "linear", g = bY[f], h = .7;
		return i.x = function(a) {
			return arguments.length ? ( b = c = a, i) : c
		}, i.x0 = function(a) {
			return arguments.length ? ( b = a, i) : b
		}, i.x1 = function(a) {
			return arguments.length ? ( c = a, i) : c
		}, i.y = function(a) {
			return arguments.length ? ( d = e = a, i) : e
		}, i.y0 = function(a) {
			return arguments.length ? ( d = a, i) : d
		}, i.y1 = function(a) {
			return arguments.length ? ( e = a, i) : e
		}, i.interpolate = function(a) {
			return arguments.length ? ( g = bY[ f = a], i) : f
		}, i.tension = function(a) {
			return arguments.length ? ( h = a, i) : h
		}, i
	}

	function cu(a) {
		return function(b, c) {
			return a[c][0]
		}
	}

	function cv(a) {
		return function(b, c) {
			return a[c][1]
		}
	}

	function cw(a) {
		return a.source
	}

	function cx(a) {
		return a.target
	}

	function cy(a) {
		return a.radius
	}

	function cz(a) {
		return a.startAngle
	}

	function cA(a) {
		return a.endAngle
	}

	function cB(a) {
		return [a.x, a.y]
	}

	function cC(a) {
		return function() {
			var b = a.apply(this, arguments), c = b[0], d = b[1] + bO;
			return [c * Math.cos(d), c * Math.sin(d)]
		}
	}

	function cE(a, b) {
		var c = (a.ownerSVGElement || a).createSVGPoint();
		if (cD < 0 && (window.scrollX || window.scrollY)) {
			var d = d3.select(document.body).append("svg:svg").style("position", "absolute").style("top", 0).style("left", 0), e = d[0][0].getScreenCTM();
			cD = !e.f && !e.e, d.remove()
		}
		return cD ? (c.x = b.pageX, c.y = b.pageY) : (c.x = b.clientX, c.y = b.clientY), c = c.matrixTransform(a.getScreenCTM().inverse()), [c.x, c.y]
	}

	function cF() {
		return 64
	}

	function cG() {
		return "circle"
	}

	function cK(a, b) {
		a.attr("transform", function(a) {
			return "translate(" + b(a) + ",0)"
		})
	}

	function cL(a, b) {
		a.attr("transform", function(a) {
			return "translate(0," + b(a) + ")"
		})
	}

	function cM(a, b, c) {
		e = [];
		if (c && b.length > 1) {
			var d = bq(a.domain()), e, f = -1, g = b.length, h = (b[1] - b[0]) / ++c, i, j;
			while (++f < g)
			for ( i = c; --i > 0; )
				( j = +b[f] - i * h) >= d[0] && e.push(j);
			for (--f, i = 0; ++i < c && ( j = +b[f] + i * h) < d[1]; )
				e.push(j)
		}
		return e
	}

	function cT(a) {
		var b = d3.event, c = cO.parentNode, d = 0, e = 0;
		c && ( c = cU(c), d = c[0] - cQ[0], e = c[1] - cQ[1], cQ = c, cR |= d | e);
		try {
			d3.event = {
				dx : d,
				dy : e
			}, cN[a].dispatch.apply(cO, cP)
		} finally {
			d3.event = b
		}
		b.preventDefault()
	}

	function cU(a) {
		return d3.event.touches ? d3.svg.touches(a)[0] : d3.svg.mouse(a)
	}

	function cV() {
		if (!cO)
			return;
		var a = cO.parentNode;
		if (!a)
			return cW();
		cT("drag"), cY()
	}

	function cW() {
		if (!cO)
			return;
		cT("dragend"), cO = null, cR && ( cS = !0, cY())
	}

	function cX() {
		cS && (cY(), cS = !1)
	}

	function cY() {
		d3.event.stopPropagation(), d3.event.preventDefault()
	}

	function di(a) {
		return [a[0] - dc[0], a[1] - dc[1], dc[2]]
	}

	function dj() {
		cZ || ( cZ = d3.select("body").append("div").style("visibility", "hidden").style("top", 0).style("height", 0).style("width", 0).style("overflow-y", "scroll").append("div").style("height", "2000px").node().parentNode);
		var a = d3.event, b;
		try {
			cZ.scrollTop = 1e3, cZ.dispatchEvent(a), b = 1e3 - cZ.scrollTop
		} catch(c) {
			b = a.wheelDelta || -a.detail * 5
		}
		return b * .005
	}

	function dk() {
		var a = d3.svg.touches(de), b = -1, c = a.length, d;
		while (++b < c)
		da[( d = a[b]).identifier] = di(d);
		return a
	}

	function dl() {
		var a = d3.svg.touches(de);
		switch(a.length) {
			case 1:
				var b = a[0];
				dq(dc[2], b, da[b.identifier]);
				break;
			case 2:
				var c = a[0], d = a[1], e = [(c[0] + d[0]) / 2, (c[1] + d[1]) / 2], f = da[c.identifier], g = da[d.identifier], h = [(f[0] + g[0]) / 2, (f[1] + g[1]) / 2, f[2]];
				dq(Math.log(d3.event.scale) / Math.LN2 + f[2], e, h)
		}
	}

	function dm() {
		c_ = null, c$ && ( dg = !0, dq(dc[2], d3.svg.mouse(de), c$))
	}

	function dn() {
		c$ && (dg && ( dh = !0), dm(), c$ = null)
	}

	function dp() {
		dh && (d3.event.stopPropagation(), d3.event.preventDefault(), dh = !1)
	}

	function dq(a, b, c) {
		function i(a, b) {
			var c = a.__domain || (a.__domain = a.domain()), d = a.range().map(function(a) {
				return (a - b) / h
			});
			a.domain(c).domain(d.map(a.invert))
		}

		var d = Math.pow(2, (dc[2] = a) - c[2]), e = dc[0] = b[0] - d * c[0], f = dc[1] = b[1] - d * c[1], g = d3.event, h = Math.pow(2, a);
		d3.event = {
			scale : h,
			translate : [e, f],
			transform : function(a, b) {
				a && i(a, e), b && i(b, f)
			}
		};
		try {
			dd.apply(de, df)
		} finally {
			d3.event = g
		}
		g.preventDefault()
	}
	Date.now || (Date.now = function() {
		return +(new Date)
	});
	try {
		document.createElement("div").style.setProperty("opacity", 0, "")
	} catch(a) {
		var b = CSSStyleDeclaration.prototype, c = b.setProperty;
		b.setProperty = function(a, b, d) {
			c.call(this, a, b + "", d)
		}
	}
	d3 = {
		version : "2.1.3"
	};
	var d = [].__proto__ ? function(a, b) {
		a.__proto__ = b
	} : function(a, b) {
		for (var c in b)
		a[c] = b[c]
	};
	d3.functor = function(a) {
		return typeof a == "function" ? a : function() {
			return a
		}
	}, d3.rebind = function(a, b) {
		return function() {
			var c = b.apply(a, arguments);
			return arguments.length ? a : c
		}
	}, d3.ascending = function(a, b) {
		return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN
	}, d3.descending = function(a, b) {
		return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN
	}, d3.min = function(a, b) {
		var c = -1, d = a.length, e, f;
		if (arguments.length === 1) {
			while (++c < d && (( e = a[c]) == null || e != e))
			e = undefined;
			while (++c < d)( f = a[c]) != null && e > f && ( e = f)
		} else {
			while (++c < d && (( e = b.call(a, a[c], c)) == null || e != e))
			e = undefined;
			while (++c < d)( f = b.call(a, a[c], c)) != null && e > f && ( e = f)
		}
		return e
	}, d3.max = function(a, b) {
		var c = -1, d = a.length, e, f;
		if (arguments.length === 1) {
			while (++c < d && (( e = a[c]) == null || e != e))
			e = undefined;
			while (++c < d)( f = a[c]) != null && f > e && ( e = f)
		} else {
			while (++c < d && (( e = b.call(a, a[c], c)) == null || e != e))
			e = undefined;
			while (++c < d)( f = b.call(a, a[c], c)) != null && f > e && ( e = f)
		}
		return e
	}, d3.sum = function(a, b) {
		var c = 0, d = a.length, e, f = -1;
		if (arguments.length === 1)
			while (++f < d)isNaN( e = +a[f]) || (c += e);
		else
			while (++f < d)isNaN( e = +b.call(a, a[f], f)) || (c += e);
		return c
	}, d3.quantile = function(a, b) {
		var c = (a.length - 1) * b + 1, d = Math.floor(c), e = a[d - 1], f = c - d;
		return f ? e + f * (a[d] - e) : e
	}, d3.zip = function() {
		if (!( e = arguments.length))
			return [];
		for (var a = -1, b = d3.min(arguments, f), c = new Array(b); ++a < b; )
			for (var d = -1, e, g = c[a] = new Array(e); ++d < e; )
				g[d] = arguments[d][a];
		return c
	}, d3.bisectLeft = function(a, b, c, d) {
		arguments.length < 3 && ( c = 0), arguments.length < 4 && ( d = a.length);
		while (c < d) {
			var e = c + d >> 1;
			a[e] < b ? c = e + 1 : d = e
		}
		return c
	}, d3.bisect = d3.bisectRight = function(a, b, c, d) {
		arguments.length < 3 && ( c = 0), arguments.length < 4 && ( d = a.length);
		while (c < d) {
			var e = c + d >> 1;
			b < a[e] ? d = e : c = e + 1
		}
		return c
	}, d3.first = function(a, b) {
		var c = 0, d = a.length, e = a[0], f;
		arguments.length === 1 && ( b = d3.ascending);
		while (++c < d)b.call(a, e, f = a[c]) > 0 && ( e = f);
		return e
	}, d3.last = function(a, b) {
		var c = 0, d = a.length, e = a[0], f;
		arguments.length === 1 && ( b = d3.ascending);
		while (++c < d)b.call(a, e, f = a[c]) <= 0 && ( e = f);
		return e
	}, d3.nest = function() {
		function f(c, g) {
			if (g >= b.length)
				return e ? e.call(a, c) : d ? c.sort(d) : c;
			var h = -1, i = c.length, j = b[g++], k, l, m = {};
			while (++h < i)( k = j( l = c[h])) in m ? m[k].push(l) : m[k] = [l];
			for (k in m)
			m[k] = f(m[k], g);
			return m
		}

		function g(a, d) {
			if (d >= b.length)
				return a;
			var e = [], f = c[d++], h;
			for (h in a)
			e.push({
				key : h,
				values : g(a[h], d)
			});
			return f && e.sort(function(a, b) {
				return f(a.key, b.key)
			}), e
		}

		var a = {}, b = [], c = [], d, e;
		return a.map = function(a) {
			return f(a, 0)
		}, a.entries = function(a) {
			return g(f(a, 0), 0)
		}, a.key = function(c) {
			return b.push(c), a
		}, a.sortKeys = function(d) {
			return c[b.length - 1] = d, a
		}, a.sortValues = function(b) {
			return d = b, a
		}, a.rollup = function(b) {
			return e = b, a
		}, a
	}, d3.keys = function(a) {
		var b = [];
		for (var c in a)
		b.push(c);
		return b
	}, d3.values = function(a) {
		var b = [];
		for (var c in a)
		b.push(a[c]);
		return b
	}, d3.entries = function(a) {
		var b = [];
		for (var c in a)
		b.push({
			key : c,
			value : a[c]
		});
		return b
	}, d3.permute = function(a, b) {
		var c = [], d = -1, e = b.length;
		while (++d < e)
		c[d] = a[b[d]];
		return c
	}, d3.merge = function(a) {
		return Array.prototype.concat.apply([], a)
	}, d3.split = function(a, b) {
		var c = [], d = [], e, f = -1, h = a.length;
		arguments.length < 2 && ( b = g);
		while (++f < h)b.call(d, e = a[f], f) ? d = [] : (d.length || c.push(d), d.push(e));
		return c
	}, d3.range = function(a, b, c) {
		arguments.length < 3 && ( c = 1, arguments.length < 2 && ( b = a, a = 0));
		if ((b - a) / c == Infinity)
			throw new Error("infinite range");
		var d = [], e = -1, f;
		if (c < 0)
			while (( f = a + c * ++e) > b)
			d.push(f);
		else
			while (( f = a + c * ++e) < b)
			d.push(f);
		return d
	}, d3.requote = function(a) {
		return a.replace(i, "\\$&")
	};
	var i = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
	d3.round = function(a, b) {
		return b ? Math.round(a * Math.pow(10, b)) * Math.pow(10, -b) : Math.round(a)
	}, d3.xhr = function(a, b, c) {
		var d = new XMLHttpRequest;
		arguments.length < 3 ? c = b : b && d.overrideMimeType && d.overrideMimeType(b), d.open("GET", a, !0), d.onreadystatechange = function() {
			d.readyState === 4 && c(d.status < 300 ? d : null)
		}, d.send(null)
	}, d3.text = function(a, b, c) {
		function d(a) {
			c(a && a.responseText)
		}
		arguments.length < 3 && ( c = b, b = null), d3.xhr(a, b, d)
	}, d3.json = function(a, b) {
		d3.text(a, "application/json", function(a) {
			b( a ? JSON.parse(a) : null)
		})
	}, d3.html = function(a, b) {
		d3.text(a, "text/html", function(a) {
			if (a != null) {
				var c = document.createRange();
				c.selectNode(document.body), a = c.createContextualFragment(a)
			}
			b(a)
		})
	}, d3.xml = function(a, b, c) {
		function d(a) {
			c(a && a.responseXML)
		}
		arguments.length < 3 && ( c = b, b = null), d3.xhr(a, b, d)
	}, d3.ns = {
		prefix : {
			svg : "http://www.w3.org/2000/svg",
			xhtml : "http://www.w3.org/1999/xhtml",
			xlink : "http://www.w3.org/1999/xlink",
			xml : "http://www.w3.org/XML/1998/namespace",
			xmlns : "http://www.w3.org/2000/xmlns/"
		},
		qualify : function(a) {
			var b = a.indexOf(":");
			return b < 0 ? a : {
				space : d3.ns.prefix[a.substring(0, b)],
				local : a.substring(b + 1)
			}
		}
	}, d3.dispatch = function(a) {
		var b = {}, c;
		for (var d = 0, e = arguments.length; d < e; d++)
			c = arguments[d], b[c] = j(c);
		return b
	}, d3.format = function(a) {
		var b = k.exec(a), c = b[1] || " ", d = b[3] || "", e = b[5], f = +b[6], g = b[7], h = b[8], i = b[9], j = !1, o = !1;
		h && ( h = h.substring(1)), e && ( c = "0", g && (f -= Math.floor((f - 1) / 4)));
		switch(i) {
			case"n":
				g = !0, i = "g";
				break;
			case"%":
				j = !0, i = "f";
				break;
			case"p":
				j = !0, i = "r";
				break;
			case"d":
				o = !0, h = "0"
		}
		return i = l[i] || m,
		function(a) {
			var b = j ? a * 100 : +a, k = b < 0 && ( b = -b) ? "−" : d;
			if (o && b % 1)
				return "";
			a = i(b, h);
			if (e) {
				var l = a.length + k.length;
				l < f && ( a = (new Array(f - l + 1)).join(c) + a), g && ( a = n(a)), a = k + a
			} else {
				g && ( a = n(a)), a = k + a;
				var l = a.length;
				l < f && ( a = (new Array(f - l + 1)).join(c) + a)
			}
			return j && (a += "%"), a
		}

	};
	var k = /(?:([^{])?([<>=^]))?([+\- ])?(#)?(0)?([0-9]+)?(,)?(\.[0-9]+)?([a-zA-Z%])?/, l = {
		g : function(a, b) {
			return a.toPrecision(b)
		},
		e : function(a, b) {
			return a.toExponential(b)
		},
		f : function(a, b) {
			return a.toFixed(b)
		},
		r : function(a, b) {
			var c = 1 + Math.floor(1e-15 + Math.log(a) / Math.LN10);
			return d3.round(a, b - c).toFixed(Math.max(0, Math.min(20, b - c)))
		}
	}, o = w(2), p = w(3), q = {
		linear : function() {
			return v
		},
		poly : w,
		quad : function() {
			return o
		},
		cubic : function() {
			return p
		},
		sin : function() {
			return x
		},
		exp : function() {
			return y
		},
		circle : function() {
			return z
		},
		elastic : A,
		back : B,
		bounce : function() {
			return C
		}
	}, r = {
		"in" : function(a) {
			return a
		},
		out : t,
		"in-out" : u,
		"out-in" : function(a) {
			return u(t(a))
		}
	};
	d3.ease = function(a) {
		var b = a.indexOf("-"), c = b >= 0 ? a.substring(0, b) : a, d = b >= 0 ? a.substring(b + 1) : "in";
		return s(r[d](q[c].apply(null, Array.prototype.slice.call(arguments, 1))))
	}, d3.event = null, d3.interpolate = function(a, b) {
		var c = d3.interpolators.length, d;
		while (--c >= 0 && !( d = d3.interpolators[c](a, b)));
		return d
	}, d3.interpolateNumber = function(a, b) {
		return b -= a,
		function(c) {
			return a + b * c
		}

	}, d3.interpolateRound = function(a, b) {
		return b -= a,
		function(c) {
			return Math.round(a + b * c)
		}

	}, d3.interpolateString = function(a, b) {
		var c, d, e, f = 0, g = 0, h = [], i = [], j, k;
		D.lastIndex = 0;
		for ( d = 0; c = D.exec(b); ++d)
			c.index && h.push(b.substring(f, g = c.index)), i.push({
				i : h.length,
				x : c[0]
			}), h.push(null), f = D.lastIndex;
		f < b.length && h.push(b.substring(f));
		for ( d = 0, j = i.length; ( c = D.exec(a)) && d < j; ++d) {
			k = i[d];
			if (k.x == c[0]) {
				if (k.i)
					if (h[k.i + 1] == null) {
						h[k.i - 1] += k.x, h.splice(k.i, 1);
						for ( e = d + 1; e < j; ++e)
							i[e].i--
					} else {
						h[k.i - 1] += k.x + h[k.i + 1], h.splice(k.i, 2);
						for ( e = d + 1; e < j; ++e)
							i[e].i -= 2
					}
				else if (h[k.i + 1] == null)
					h[k.i] = k.x;
				else {
					h[k.i] = k.x + h[k.i + 1], h.splice(k.i + 1, 1);
					for ( e = d + 1; e < j; ++e)
						i[e].i--
				}
				i.splice(d, 1), j--, d--
			} else
				k.x = d3.interpolateNumber(parseFloat(c[0]), parseFloat(k.x))
		}
		while (d < j) k = i.pop(), h[k.i + 1] == null ? h[k.i] = k.x : (h[k.i] = k.x + h[k.i + 1], h.splice(k.i + 1, 1)), j--;
		return h.length === 1 ? h[0] == null ? i[0].x : function() {
			return b
		} : function(a) {
			for ( d = 0; d < j; ++d)
				h[( k = i[d]).i] = k.x(a);
			return h.join("")
		}
	}, d3.interpolateRgb = function(a, b) {
		a = d3.rgb(a), b = d3.rgb(b);
		var c = a.r, d = a.g, e = a.b, f = b.r - c, g = b.g - d, h = b.b - e;
		return function(a) {
			return "rgb(" + Math.round(c + f * a) + "," + Math.round(d + g * a) + "," + Math.round(e + h * a) + ")"
		}
	}, d3.interpolateHsl = function(a, b) {
		a = d3.hsl(a), b = d3.hsl(b);
		var c = a.h, d = a.s, e = a.l, f = b.h - c, g = b.s - d, h = b.l - e;
		return function(a) {
			return S(c + f * a, d + g * a, e + h * a).toString()
		}
	}, d3.interpolateArray = function(a, b) {
		var c = [], d = [], e = a.length, f = b.length, g = Math.min(a.length, b.length), h;
		for ( h = 0; h < g; ++h)
			c.push(d3.interpolate(a[h], b[h]));
		for (; h < e; ++h)
			d[h] = a[h];
		for (; h < f; ++h)
			d[h] = b[h];
		return function(a) {
			for ( h = 0; h < g; ++h)
				d[h] = c[h](a);
			return d
		}
	}, d3.interpolateObject = function(a, b) {
		var c = {}, d = {}, e;
		for (e in a) e in b ? c[e] = F(e)(a[e], b[e]) : d[e] = a[e];
		for (e in b) e in a || (d[e] = b[e]);
		return function(a) {
			for (e in c)
			d[e] = c[e](a);
			return d
		}
	};
	var D = /[-+]?(?:\d+\.\d+|\d+\.|\.\d+|\d+)(?:[eE][-]?\d+)?/g, E = {
		background : 1,
		fill : 1,
		stroke : 1
	};
	d3.interpolators = [d3.interpolateObject,
	function(a, b) {
		return b instanceof Array && d3.interpolateArray(a, b)
	},
	function(a, b) {
		return typeof b == "string" && d3.interpolateString(String(a), b)
	},
	function(a, b) {
		return ( typeof b == "string" ? b in O || /^(#|rgb\(|hsl\()/.test(b) : b instanceof J || b instanceof R) && d3.interpolateRgb(String(a), b)
	},
	function(a, b) {
		return typeof b == "number" && d3.interpolateNumber(+a, b)
	}], d3.rgb = function(a, b, c) {
		return arguments.length === 1 ? L("" + a, I, S) : I(~~a, ~~b, ~~c)
	}, J.prototype.brighter = function(a) {
		a = Math.pow(.7, arguments.length ? a : 1);
		var b = this.r, c = this.g, d = this.b, e = 30;
		return !b && !c && !d ? I(e, e, e) : (b && b < e && ( b = e), c && c < e && ( c = e), d && d < e && ( d = e), I(Math.min(255, Math.floor(b / a)), Math.min(255, Math.floor(c / a)), Math.min(255, Math.floor(d / a))))
	}, J.prototype.darker = function(a) {
		return a = Math.pow(.7, arguments.length ? a : 1), I(Math.max(0, Math.floor(a * this.r)), Math.max(0, Math.floor(a * this.g)), Math.max(0, Math.floor(a * this.b)))
	}, J.prototype.hsl = function() {
		return M(this.r, this.g, this.b)
	}, J.prototype.toString = function() {
		return "#" + K(this.r) + K(this.g) + K(this.b)
	};
	var O = {
		aliceblue : "#f0f8ff",
		antiquewhite : "#faebd7",
		aqua : "#00ffff",
		aquamarine : "#7fffd4",
		azure : "#f0ffff",
		beige : "#f5f5dc",
		bisque : "#ffe4c4",
		black : "#000000",
		blanchedalmond : "#ffebcd",
		blue : "#0000ff",
		blueviolet : "#8a2be2",
		brown : "#a52a2a",
		burlywood : "#deb887",
		cadetblue : "#5f9ea0",
		chartreuse : "#7fff00",
		chocolate : "#d2691e",
		coral : "#ff7f50",
		cornflowerblue : "#6495ed",
		cornsilk : "#fff8dc",
		crimson : "#dc143c",
		cyan : "#00ffff",
		darkblue : "#00008b",
		darkcyan : "#008b8b",
		darkgoldenrod : "#b8860b",
		darkgray : "#a9a9a9",
		darkgreen : "#006400",
		darkgrey : "#a9a9a9",
		darkkhaki : "#bdb76b",
		darkmagenta : "#8b008b",
		darkolivegreen : "#556b2f",
		darkorange : "#ff8c00",
		darkorchid : "#9932cc",
		darkred : "#8b0000",
		darksalmon : "#e9967a",
		darkseagreen : "#8fbc8f",
		darkslateblue : "#483d8b",
		darkslategray : "#2f4f4f",
		darkslategrey : "#2f4f4f",
		darkturquoise : "#00ced1",
		darkviolet : "#9400d3",
		deeppink : "#ff1493",
		deepskyblue : "#00bfff",
		dimgray : "#696969",
		dimgrey : "#696969",
		dodgerblue : "#1e90ff",
		firebrick : "#b22222",
		floralwhite : "#fffaf0",
		forestgreen : "#228b22",
		fuchsia : "#ff00ff",
		gainsboro : "#dcdcdc",
		ghostwhite : "#f8f8ff",
		gold : "#ffd700",
		goldenrod : "#daa520",
		gray : "#808080",
		green : "#008000",
		greenyellow : "#adff2f",
		grey : "#808080",
		honeydew : "#f0fff0",
		hotpink : "#ff69b4",
		indianred : "#cd5c5c",
		indigo : "#4b0082",
		ivory : "#fffff0",
		khaki : "#f0e68c",
		lavender : "#e6e6fa",
		lavenderblush : "#fff0f5",
		lawngreen : "#7cfc00",
		lemonchiffon : "#fffacd",
		lightblue : "#add8e6",
		lightcoral : "#f08080",
		lightcyan : "#e0ffff",
		lightgoldenrodyellow : "#fafad2",
		lightgray : "#d3d3d3",
		lightgreen : "#90ee90",
		lightgrey : "#d3d3d3",
		lightpink : "#ffb6c1",
		lightsalmon : "#ffa07a",
		lightseagreen : "#20b2aa",
		lightskyblue : "#87cefa",
		lightslategray : "#778899",
		lightslategrey : "#778899",
		lightsteelblue : "#b0c4de",
		lightyellow : "#ffffe0",
		lime : "#00ff00",
		limegreen : "#32cd32",
		linen : "#faf0e6",
		magenta : "#ff00ff",
		maroon : "#800000",
		mediumaquamarine : "#66cdaa",
		mediumblue : "#0000cd",
		mediumorchid : "#ba55d3",
		mediumpurple : "#9370db",
		mediumseagreen : "#3cb371",
		mediumslateblue : "#7b68ee",
		mediumspringgreen : "#00fa9a",
		mediumturquoise : "#48d1cc",
		mediumvioletred : "#c71585",
		midnightblue : "#191970",
		mintcream : "#f5fffa",
		mistyrose : "#ffe4e1",
		moccasin : "#ffe4b5",
		navajowhite : "#ffdead",
		navy : "#000080",
		oldlace : "#fdf5e6",
		olive : "#808000",
		olivedrab : "#6b8e23",
		orange : "#ffa500",
		orangered : "#ff4500",
		orchid : "#da70d6",
		palegoldenrod : "#eee8aa",
		palegreen : "#98fb98",
		paleturquoise : "#afeeee",
		palevioletred : "#db7093",
		papayawhip : "#ffefd5",
		peachpuff : "#ffdab9",
		peru : "#cd853f",
		pink : "#ffc0cb",
		plum : "#dda0dd",
		powderblue : "#b0e0e6",
		purple : "#800080",
		red : "#ff0000",
		rosybrown : "#bc8f8f",
		royalblue : "#4169e1",
		saddlebrown : "#8b4513",
		salmon : "#fa8072",
		sandybrown : "#f4a460",
		seagreen : "#2e8b57",
		seashell : "#fff5ee",
		sienna : "#a0522d",
		silver : "#c0c0c0",
		skyblue : "#87ceeb",
		slateblue : "#6a5acd",
		slategray : "#708090",
		slategrey : "#708090",
		snow : "#fffafa",
		springgreen : "#00ff7f",
		steelblue : "#4682b4",
		tan : "#d2b48c",
		teal : "#008080",
		thistle : "#d8bfd8",
		tomato : "#ff6347",
		turquoise : "#40e0d0",
		violet : "#ee82ee",
		wheat : "#f5deb3",
		white : "#ffffff",
		whitesmoke : "#f5f5f5",
		yellow : "#ffff00",
		yellowgreen : "#9acd32"
	};
	for (var P in O)
	O[P] = L(O[P], I, S);
	d3.hsl = function(a, b, c) {
		return arguments.length === 1 ? L("" + a, M, Q) : Q(+a, +b, +c)
	}, R.prototype.brighter = function(a) {
		return a = Math.pow(.7, arguments.length ? a : 1), Q(this.h, this.s, this.l / a)
	}, R.prototype.darker = function(a) {
		return a = Math.pow(.7, arguments.length ? a : 1), Q(this.h, this.s, a * this.l)
	}, R.prototype.rgb = function() {
		return S(this.h, this.s, this.l)
	}, R.prototype.toString = function() {
		return "hsl(" + this.h + "," + this.s * 100 + "%," + this.l * 100 + "%)"
	};
	var U = function(a, b) {
		return b.querySelector(a)
	}, V = function(a, b) {
		return b.querySelectorAll(a)
	};
	typeof Sizzle == "function" && ( U = function(a, b) {
		return Sizzle(a,b)[0]
	}, V = function(a, b) {
		return Sizzle.uniqueSort(Sizzle(a, b))
	});
	var W = [];
	d3.selection = function() {
		return bb
	}, d3.selection.prototype = W, W.select = function(a) {
		var b = [], c, d, e, f;
		typeof a != "function" && ( a = X(a));
		for (var g = -1, h = this.length; ++g < h; ) {
			b.push( c = []), c.parentNode = ( e = this[g]).parentNode;
			for (var i = -1, j = e.length; ++i < j; )
				( f = e[i]) ? (c.push( d = a.call(f, f.__data__, i)), d && "__data__" in f && (d.__data__ = f.__data__)) : c.push(null)
		}
		return T(b)
	}, W.selectAll = function(a) {
		var b = [], c, d;
		typeof a != "function" && ( a = Y(a));
		for (var e = -1, f = this.length; ++e < f; )
			for (var g = this[e], h = -1, i = g.length; ++h < i; )
				if ( d = g[h])
					b.push( c = a.call(d, d.__data__, h)), c.parentNode = d;
		return T(b)
	}, W.attr = function(a, b) {
		function d() {
			this.removeAttribute(a)
		}

		function e() {
			this.removeAttributeNS(a.space, a.local)
		}

		function f() {
			this.setAttribute(a, b)
		}

		function g() {
			this.setAttributeNS(a.space, a.local, b)
		}

		function h() {
			var c = b.apply(this, arguments);
			c == null ? this.removeAttribute(a) : this.setAttribute(a, c)
		}

		function i() {
			var c = b.apply(this, arguments);
			c == null ? this.removeAttributeNS(a.space, a.local) : this.setAttributeNS(a.space, a.local, c)
		}

		a = d3.ns.qualify(a);
		if (arguments.length < 2) {
			var c = this.node();
			return a.local ? c.getAttributeNS(a.space, a.local) : c.getAttribute(a)
		}
		return this.each(b == null ? a.local ? e : d : typeof b == "function" ? a.local ? i : h : a.local ? g : f)
	}, W.classed = function(a, b) {
		function f() {
			if ( b = this.classList)
				return b.add(a);
			var b = this.className, d = b.baseVal != null, e = d ? b.baseVal : b;
			c.lastIndex = 0, c.test(e) || ( e = h(e + " " + a), d ? b.baseVal = e : this.className = e)
		}

		function g() {
			if ( b = this.classList)
				return b.remove(a);
			var b = this.className, d = b.baseVal != null, e = d ? b.baseVal : b;
			e = h(e.replace(c, " ")), d ? b.baseVal = e : this.className = e
		}

		function i() {
			(b.apply(this, arguments) ? f : g).call(this)
		}

		var c = new RegExp("(^|\\s+)" + d3.requote(a) + "(\\s+|$)", "g");
		if (arguments.length < 2) {
			var d = this.node();
			if ( e = d.classList)
				return e.contains(a);
			var e = d.className;
			return c.lastIndex = 0, c.test(e.baseVal != null ? e.baseVal : e)
		}
		return this.each( typeof b == "function" ? i : b ? f : g)
	}, W.style = function(a, b, c) {
		function d() {
			this.style.removeProperty(a)
		}

		function e() {
			this.style.setProperty(a, b, c)
		}

		function f() {
			var d = b.apply(this, arguments);
			d == null ? this.style.removeProperty(a) : this.style.setProperty(a, d, c)
		}
		return arguments.length < 3 && ( c = ""), arguments.length < 2 ? window.getComputedStyle(this.node(), null).getPropertyValue(a) : this.each(b == null ? d : typeof b == "function" ? f : e)
	}, W.property = function(a, b) {
		function c() {
			delete this[a]
		}

		function d() {
			this[a] = b
		}

		function e() {
			var c = b.apply(this, arguments);
			c == null ?
			delete this[a] : this[a] = c
		}
		return arguments.length < 2 ? this.node()[a] : this.each(b == null ? c : typeof b == "function" ? e : d)
	}, W.text = function(a) {
		return arguments.length < 1 ? this.node().textContent : this.each( typeof a == "function" ? function() {
			this.textContent = a.apply(this, arguments)
		} : function() {
			this.textContent = a
		})
	}, W.html = function(a) {
		return arguments.length < 1 ? this.node().innerHTML : this.each( typeof a == "function" ? function() {
			this.innerHTML = a.apply(this, arguments)
		} : function() {
			this.innerHTML = a
		})
	}, W.append = function(a) {
		function b() {
			return this.appendChild(document.createElement(a))
		}

		function c() {
			return this.appendChild(document.createElementNS(a.space, a.local))
		}
		return a = d3.ns.qualify(a), this.select(a.local ? c : b)
	}, W.insert = function(a, b) {
		function c() {
			return this.insertBefore(document.createElement(a), U(b, this))
		}

		function d() {
			return this.insertBefore(document.createElementNS(a.space, a.local), U(b, this))
		}
		return a = d3.ns.qualify(a), this.select(a.local ? d : c)
	}, W.remove = function() {
		return this.each(function() {
			var a = this.parentNode;
			a && a.removeChild(this)
		})
	}, W.data = function(a, b) {
		function f(a, f) {
			var g, h = a.length, i = f.length, j = Math.min(h, i), k = Math.max(h, i), l = [], m = [], n = [], o, p;
			if (b) {
				var q = {}, r = [], s, t = f.length;
				for ( g = -1; ++g < h; )
					s = b.call( o = a[g], o.__data__, g), s in q ? n[t++] = o : q[s] = o, r.push(s);
				for ( g = -1; ++g < i; )
					o = q[ s = b.call(f, p = f[g], g)], o ? (o.__data__ = p, l[g] = o, m[g] = n[g] = null) : (m[g] = Z(p), l[g] = n[g] = null),
					delete q[s];
				for ( g = -1; ++g < h; )
					r[g] in q && (n[g] = a[g])
			} else {
				for ( g = -1; ++g < j; )
					o = a[g], p = f[g], o ? (o.__data__ = p, l[g] = o, m[g] = n[g] = null) : (m[g] = Z(p), l[g] = n[g] = null);
				for (; g < i; ++g)
					m[g] = Z(f[g]), l[g] = n[g] = null;
				for (; g < k; ++g)
					n[g] = a[g], m[g] = l[g] = null
			}
			m.update = l, m.parentNode = l.parentNode = n.parentNode = a.parentNode, c.push(m), d.push(l), e.push(n)
		}

		var c = [], d = [], e = [], g = -1, h = this.length, i;
		if ( typeof a == "function")
			while (++g < h)f( i = this[g], a.call(i, i.parentNode.__data__, g));
		else
			while (++g < h)f( i = this[g], a);
		var j = T(d);
		return j.enter = function() {
			return $(c)
		}, j.exit = function() {
			return T(e)
		}, j
	};
	var _ = [];
	_.append = W.append, _.insert = W.insert, _.empty = W.empty, _.select = function(a) {
		var b = [], c, d, e, f, g;
		for (var h = -1, i = this.length; ++h < i; ) {
			e = ( f = this[h]).update, b.push( c = []), c.parentNode = f.parentNode;
			for (var j = -1, k = f.length; ++j < k; )
				( g = f[j]) ? (c.push(e[j] = d = a.call(f.parentNode, g.__data__, j)), d.__data__ = g.__data__) : c.push(null)
		}
		return T(b)
	}, W.filter = function(a) {
		var b = [], c, d, e;
		for (var f = 0, g = this.length; f < g; f++) {
			b.push( c = []), c.parentNode = ( d = this[f]).parentNode;
			for (var h = 0, i = d.length; h < i; h++)
				( e = d[h]) && a.call(e, e.__data__, h) && c.push(e)
		}
		return T(b)
	}, W.map = function(a) {
		return this.each(function() {
			this.__data__ = a.apply(this, arguments)
		})
	}, W.sort = function(a) {
		a = ba.apply(this, arguments);
		for (var b = 0, c = this.length; b < c; b++)
			for (var d = this[b].sort(a), e = 1, f = d.length, g = d[0]; e < f; e++) {
				var h = d[e];
				h && (g && g.parentNode.insertBefore(h, g.nextSibling), g = h)
			}
		return this
	}, W.on = function(a, b, c) {
		arguments.length < 3 && ( c = !1);
		var d = "__on" + a, e = a.indexOf(".");
		return e > 0 && ( a = a.substring(0, e)), arguments.length < 2 ? ( e = this.node()[d]) && e._ : this.each(function(e, f) {
			function h(a) {
				var c = d3.event;
				d3.event = a;
				try {
					b.call(g, g.__data__, f)
				} finally {
					d3.event = c
				}
			}

			var g = this;
			g[d] && g.removeEventListener(a, g[d], c), b && g.addEventListener(a, g[d] = h, c), h._ = b
		})
	}, W.each = function(a) {
		for (var b = -1, c = this.length; ++b < c; )
			for (var d = this[b], e = -1, f = d.length; ++e < f; ) {
				var g = d[e];
				g && a.call(g, g.__data__, e, b)
			}
		return this
	}, W.call = function(a) {
		return a.apply(this, (arguments[0] = this, arguments)), this
	}, W.empty = function() {
		return !this.node()
	}, W.node = function(a) {
		for (var b = 0, c = this.length; b < c; b++)
			for (var d = this[b], e = 0, f = d.length; e < f; e++) {
				var g = d[e];
				if (g)
					return g
			}
		return null
	}, W.transition = function() {
		var a = [], b, c;
		for (var d = -1, e = this.length; ++d < e; ) {
			a.push( b = []);
			for (var f = this[d], g = -1, h = f.length; ++g < h; )
				b.push(( c = f[g]) ? {
					node : c,
					delay : 0,
					duration : 250
				} : null)
		}
		return bc(a, bg || ++bf)
	};
	var bb = T([[document]]);
	bb[0].parentNode = document.documentElement, d3.select = function(a) {
		return typeof a == "string" ? bb.select(a) : T([[a]])
	}, d3.selectAll = function(a) {
		return typeof a == "string" ? bb.selectAll(a) : T([a])
	};
	var be = [], bf = 0, bg = 0, bh = d3.ease("cubic-in-out");
	be.call = W.call, d3.transition = function() {
		return bb.transition()
	}, d3.transition.prototype = be, be.select = function(a) {
		var b = [], c, d, e;
		typeof a != "function" && ( a = X(a));
		for (var f = -1, g = this.length; ++f < g; ) {
			b.push( c = []);
			for (var h = this[f], i = -1, j = h.length; ++i < j; )
				( e = h[i]) && ( d = a.call(e.node, e.node.__data__, i)) ? ("__data__" in e.node && (d.__data__ = e.node.__data__), c.push({
					node : d,
					delay : e.delay,
					duration : e.duration
				})) : c.push(null)
		}
		return bc(b, this.id).ease(this.ease())
	}, be.selectAll = function(a) {
		var b = [], c, d;
		typeof a != "function" && ( a = Y(a));
		for (var e = -1, f = this.length; ++e < f; )
			for (var g = this[e], h = -1, i = g.length; ++h < i; )
				if ( d = g[h]) {
					b.push( c = a.call(d.node, d.node.__data__, h));
					for (var j = -1, k = c.length; ++j < k; )
						c[j] = {
							node : c[j],
							delay : d.delay,
							duration : d.duration
						}
				}
		return bc(b, this.id).ease(this.ease())
	}, be.attr = function(a, b) {
		return this.attrTween(a, bd(b))
	}, be.attrTween = function(a, b) {
		function c(c, d) {
			var e = b.call(this, c, d, this.getAttribute(a));
			return e &&
			function(b) {
				this.setAttribute(a, e(b))
			}

		}

		function d(c, d) {
			var e = b.call(this, c, d, this.getAttributeNS(a.space, a.local));
			return e &&
			function(b) {
				this.setAttributeNS(a.space, a.local, e(b))
			}

		}
		return a = d3.ns.qualify(a), this.tween("attr." + a, a.local ? d : c)
	}, be.style = function(a, b, c) {
		return arguments.length < 3 && ( c = ""), this.styleTween(a, bd(b), c)
	}, be.styleTween = function(a, b, c) {
		return arguments.length < 3 && ( c = ""), this.tween("style." + a, function(d, e) {
			var f = b.call(this, d, e, window.getComputedStyle(this, null).getPropertyValue(a));
			return f &&
			function(b) {
				this.style.setProperty(a, f(b), c)
			}

		})
	}, be.text = function(a) {
		return this.tween("text", function(b, c) {
			this.textContent = typeof a == "function" ? a.call(this, b, c) : a
		})
	}, be.remove = function() {
		return this.each("end", function() {
			var a;
			!this.__transition__ && ( a = this.parentNode) && a.removeChild(this)
		})
	}, be.delay = function(a) {
		var b = this;
		return b.each( typeof a == "function" ? function(c, d, e) {
			b[e][d].delay = +a.apply(this, arguments)
		} : ( a = +a,
		function(c, d, e) {
			b[e][d].delay = a
		}))

	}, be.duration = function(a) {
		var b = this;
		return b.each( typeof a == "function" ? function(c, d, e) {
			b[e][d].duration = +a.apply(this, arguments)
		} : ( a = +a,
		function(c, d, e) {
			b[e][d].duration = a
		}))

	}, be.transition = function() {
		return this.select(e)
	};
	var bj = null, bk, bl;
	d3.timer = function(a, b, c) {
		var d = !1, e, f = bj;
		if (arguments.length < 3) {
			if (arguments.length < 2)
				b = 0;
			else if (!isFinite(b))
				return;
			c = Date.now()
		}
		while (f) {
			if (f.callback === a) {
				f.then = c, f.delay = b, d = !0;
				break
			}
			e = f, f = f.next
		}
		d || ( bj = {
			callback : a,
			then : c,
			delay : b,
			next : bj
		}), bk || ( bl = clearTimeout(bl), bk = 1, bo(bm))
	}, d3.timer.flush = function() {
		var a, b = Date.now(), c = bj;
		while (c) a = b - c.then, c.delay || (c.flush = c.callback(a)), c = c.next;
		bn()
	};
	var bo = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(a) {
		setTimeout(a, 17)
	};
	d3.scale = {}, d3.scale.linear = function() {
		return bt([0, 1], [0, 1], d3.interpolate, !1)
	}, d3.scale.log = function() {
		return bB(d3.scale.linear(), bC)
	}, bC.pow = function(a) {
		return Math.pow(10, a)
	}, bD.pow = function(a) {
		return -Math.pow(10, -a)
	}, d3.scale.pow = function() {
		return bF(d3.scale.linear(), 1)
	}, d3.scale.sqrt = function() {
		return d3.scale.pow().exponent(.5)
	}, d3.scale.ordinal = function() {
		return bH([], {
			t : "range",
			x : []
		})
	}, d3.scale.category10 = function() {
		return d3.scale.ordinal().range(bI)
	}, d3.scale.category20 = function() {
		return d3.scale.ordinal().range(bJ)
	}, d3.scale.category20b = function() {
		return d3.scale.ordinal().range(bK)
	}, d3.scale.category20c = function() {
		return d3.scale.ordinal().range(bL)
	};
	var bI = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"], bJ = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"], bK = ["#393b79", "#5254a3", "#6b6ecf", "#9c9ede", "#637939", "#8ca252", "#b5cf6b", "#cedb9c", "#8c6d31", "#bd9e39", "#e7ba52", "#e7cb94", "#843c39", "#ad494a", "#d6616b", "#e7969c", "#7b4173", "#a55194", "#ce6dbd", "#de9ed6"], bL = ["#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#e6550d", "#fd8d3c", "#fdae6b", "#fdd0a2", "#31a354", "#74c476", "#a1d99b", "#c7e9c0", "#756bb1", "#9e9ac8", "#bcbddc", "#dadaeb", "#636363", "#969696", "#bdbdbd", "#d9d9d9"];
	d3.scale.quantile = function() {
		return bM([], [])
	}, d3.scale.quantize = function() {
		return bN(0, 1, [0, 1])
	}, d3.svg = {}, d3.svg.arc = function() {
		function e() {
			var e = a.apply(this, arguments), f = b.apply(this, arguments), g = c.apply(this, arguments) + bO, h = d.apply(this, arguments) + bO, i = (h < g && ( i = g, g = h, h = i), h - g), j = i < Math.PI ? "0" : "1", k = Math.cos(g), l = Math.sin(g), m = Math.cos(h), n = Math.sin(h);
			return i >= bP ? e ? "M0," + f + "A" + f + "," + f + " 0 1,1 0," + -f + "A" + f + "," + f + " 0 1,1 0," + f + "M0," + e + "A" + e + "," + e + " 0 1,0 0," + -e + "A" + e + "," + e + " 0 1,0 0," + e + "Z" : "M0," + f + "A" + f + "," + f + " 0 1,1 0," + -f + "A" + f + "," + f + " 0 1,1 0," + f + "Z" : e ? "M" + f * k + "," + f * l + "A" + f + "," + f + " 0 " + j + ",1 " + f * m + "," + f * n + "L" + e * m + "," + e * n + "A" + e + "," + e + " 0 " + j + ",0 " + e * k + "," + e * l + "Z" : "M" + f * k + "," + f * l + "A" + f + "," + f + " 0 " + j + ",1 " + f * m + "," + f * n + "L0,0" + "Z"
		}

		var a = bQ, b = bR, c = bS, d = bT;
		return e.innerRadius = function(b) {
			return arguments.length ? ( a = d3.functor(b), e) : a
		}, e.outerRadius = function(a) {
			return arguments.length ? ( b = d3.functor(a), e) : b
		}, e.startAngle = function(a) {
			return arguments.length ? ( c = d3.functor(a), e) : c
		}, e.endAngle = function(a) {
			return arguments.length ? ( d = d3.functor(a), e) : d
		}, e.centroid = function() {
			var e = (a.apply(this, arguments) + b.apply(this, arguments)) / 2, f = (c.apply(this, arguments) + d.apply(this, arguments)) / 2 + bO;
			return [Math.cos(f) * e, Math.sin(f) * e]
		}, e
	};
	var bO = -Math.PI / 2, bP = 2 * Math.PI - 1e-6;
	d3.svg.line = function() {
		return bU(Object)
	};
	var bY = {
		linear : bZ,
		"step-before" : b$,
		"step-after" : b_,
		basis : cf,
		"basis-open" : cg,
		"basis-closed" : ch,
		bundle : ci,
		cardinal : cc,
		"cardinal-open" : ca,
		"cardinal-closed" : cb,
		monotone : cr
	}, ck = [0, 2 / 3, 1 / 3, 0], cl = [0, 1 / 3, 2 / 3, 0], cm = [0, 1 / 6, 2 / 3, 1 / 6];
	d3.svg.line.radial = function() {
		var a = bU(cs);
		return a.radius = a.x,
		delete a.x, a.angle = a.y,
		delete a.y, a
	}, d3.svg.area = function() {
		return ct(Object)
	}, d3.svg.area.radial = function() {
		var a = ct(cs);
		return a.radius = a.x,
		delete a.x, a.innerRadius = a.x0,
		delete a.x0, a.outerRadius = a.x1,
		delete a.x1, a.angle = a.y,
		delete a.y, a.startAngle = a.y0,
		delete a.y0, a.endAngle = a.y1,
		delete a.y1, a
	}, d3.svg.chord = function() {
		function f(c, d) {
			var e = g(this, a, c, d), f = g(this, b, c, d);
			return "M" + e.p0 + i(e.r, e.p1) + (h(e, f) ? j(e.r, e.p1, e.r, e.p0) : j(e.r, e.p1, f.r, f.p0) + i(f.r, f.p1) + j(f.r, f.p1, e.r, e.p0)) + "Z"
		}

		function g(a, b, f, g) {
			var h = b.call(a, f, g), i = c.call(a, h, g), j = d.call(a, h, g) + bO, k = e.call(a, h, g) + bO;
			return {
				r : i,
				a0 : j,
				a1 : k,
				p0 : [i * Math.cos(j), i * Math.sin(j)],
				p1 : [i * Math.cos(k), i * Math.sin(k)]
			}
		}

		function h(a, b) {
			return a.a0 == b.a0 && a.a1 == b.a1
		}

		function i(a, b) {
			return "A" + a + "," + a + " 0 0,1 " + b
		}

		function j(a, b, c, d) {
			return "Q 0,0 " + d
		}

		var a = cw, b = cx, c = cy, d = bS, e = bT;
		return f.radius = function(a) {
			return arguments.length ? ( c = d3.functor(a), f) : c
		}, f.source = function(b) {
			return arguments.length ? ( a = d3.functor(b), f) : a
		}, f.target = function(a) {
			return arguments.length ? ( b = d3.functor(a), f) : b
		}, f.startAngle = function(a) {
			return arguments.length ? ( d = d3.functor(a), f) : d
		}, f.endAngle = function(a) {
			return arguments.length ? ( e = d3.functor(a), f) : e
		}, f
	}, d3.svg.diagonal = function() {
		function d(d, e) {
			var f = a.call(this, d, e), g = b.call(this, d, e), h = (f.y + g.y) / 2, i = [f, {
				x : f.x,
				y : h
			}, {
				x : g.x,
				y : h
			}, g];
			return i = i.map(c), "M" + i[0] + "C" + i[1] + " " + i[2] + " " + i[3]
		}

		var a = cw, b = cx, c = cB;
		return d.source = function(b) {
			return arguments.length ? ( a = d3.functor(b), d) : a
		}, d.target = function(a) {
			return arguments.length ? ( b = d3.functor(a), d) : b
		}, d.projection = function(a) {
			return arguments.length ? ( c = a, d) : c
		}, d
	}, d3.svg.diagonal.radial = function() {
		var a = d3.svg.diagonal(), b = cB, c = a.projection;
		return a.projection = function(a) {
			return arguments.length ? c(cC( b = a)) : b
		}, a
	}, d3.svg.mouse = function(a) {
		return cE(a, d3.event)
	};
	var cD = /WebKit/.test(navigator.userAgent) ? -1 : 0;
	d3.svg.touches = function(a) {
		var b = d3.event.touches;
		return b ? Array.prototype.map.call(b, function(b) {
			var c = cE(a, b);
			return c.identifier = b.identifier, c
		}) : []
	}, d3.svg.symbol = function() {
		function c(c, d) {
			return (cH[a.call(this, c, d)] || cH.circle)(b.call(this, c, d))
		}

		var a = cG, b = cF;
		return c.type = function(b) {
			return arguments.length ? ( a = d3.functor(b), c) : a
		}, c.size = function(a) {
			return arguments.length ? ( b = d3.functor(a), c) : b
		}, c
	};
	var cH = {
		circle : function(a) {
			var b = Math.sqrt(a / Math.PI);
			return "M0," + b + "A" + b + "," + b + " 0 1,1 0," + -b + "A" + b + "," + b + " 0 1,1 0," + b + "Z"
		},
		cross : function(a) {
			var b = Math.sqrt(a / 5) / 2;
			return "M" + -3 * b + "," + -b + "H" + -b + "V" + -3 * b + "H" + b + "V" + -b + "H" + 3 * b + "V" + b + "H" + b + "V" + 3 * b + "H" + -b + "V" + b + "H" + -3 * b + "Z"
		},
		diamond : function(a) {
			var b = Math.sqrt(a / (2 * cJ)), c = b * cJ;
			return "M0," + -b + "L" + c + ",0" + " 0," + b + " " + -c + ",0" + "Z"
		},
		square : function(a) {
			var b = Math.sqrt(a) / 2;
			return "M" + -b + "," + -b + "L" + b + "," + -b + " " + b + "," + b + " " + -b + "," + b + "Z"
		},
		"triangle-down" : function(a) {
			var b = Math.sqrt(a / cI), c = b * cI / 2;
			return "M0," + c + "L" + b + "," + -c + " " + -b + "," + -c + "Z"
		},
		"triangle-up" : function(a) {
			var b = Math.sqrt(a / cI), c = b * cI / 2;
			return "M0," + -c + "L" + b + "," + c + " " + -b + "," + c + "Z"
		}
	};
	d3.svg.symbolTypes = d3.keys(cH);
	var cI = Math.sqrt(3), cJ = Math.tan(30 * Math.PI / 180);
	d3.svg.axis = function() {
		function j(j) {
			j.each(function(k, l, m) {
				function F(a) {
					return j.delay ? a.transition().delay(j[m][l].delay).duration(j[m][l].duration).ease(j.ease()) : a
				}

				var n = d3.select(this), o = a.ticks.apply(a, g), p = h == null ? a.tickFormat.apply(a, g) : h, q = cM(a, o, i), r = n.selectAll(".minor").data(q, String), s = r.enter().insert("svg:line", "g").attr("class", "tick minor").style("opacity", 1e-6), t = F(r.exit()).style("opacity", 1e-6).remove(), u = F(r).style("opacity", 1), v = n.selectAll("g").data(o, String), w = v.enter().insert("svg:g", "path").style("opacity", 1e-6), x = F(v.exit()).style("opacity", 1e-6).remove(), y = F(v).style("opacity", 1), z, A = bq(a.range()), B = n.selectAll(".domain").data([0]), C = B.enter().append("svg:path").attr("class", "domain"), D = F(B), E = this.__chart__ || a;
				this.__chart__ = a.copy(), w.append("svg:line").attr("class", "tick"), w.append("svg:text"), y.select("text").text(p);
				switch(b) {
					case"bottom":
						z = cK, u.attr("y2", d), w.select("text").attr("dy", ".71em").attr("text-anchor", "middle"), y.select("line").attr("y2", c), y.select("text").attr("y", Math.max(c, 0) + f), D.attr("d", "M" + A[0] + "," + e + "V0H" + A[1] + "V" + e);
						break;
					case"top":
						z = cK, u.attr("y2", -d), w.select("text").attr("text-anchor", "middle"), y.select("line").attr("y2", -c), y.select("text").attr("y", -(Math.max(c, 0) + f)), D.attr("d", "M" + A[0] + "," + -e + "V0H" + A[1] + "V" + -e);
						break;
					case"left":
						z = cL, u.attr("x2", -d), w.select("text").attr("dy", ".32em").attr("text-anchor", "end"), y.select("line").attr("x2", -c), y.select("text").attr("x", -(Math.max(c, 0) + f)), D.attr("d", "M" + -e + "," + A[0] + "H0V" + A[1] + "H" + -e);
						break;
					case"right":
						z = cL, u.attr("x2", d), w.select("text").attr("dy", ".32em"), y.select("line").attr("x2", c), y.select("text").attr("x", Math.max(c, 0) + f), D.attr("d", "M" + e + "," + A[0] + "H0V" + A[1] + "H" + e)
				}
				w.call(z, E), y.call(z, a), x.call(z, a), s.call(z, E), u.call(z, a), t.call(z, a)
			})
		}

		var a = d3.scale.linear(), b = "bottom", c = 6, d = 6, e = 6, f = 3, g = [10], h, i = 0;
		return j.scale = function(b) {
			return arguments.length ? ( a = b, j) : a
		}, j.orient = function(a) {
			return arguments.length ? ( b = a, j) : b
		}, j.ticks = function() {
			return arguments.length ? ( g = arguments, j) : g
		}, j.tickFormat = function(a) {
			return arguments.length ? ( h = a, j) : h
		}, j.tickSize = function(a, b, f) {
			if (!arguments.length)
				return c;
			var g = arguments.length - 1;
			return c = +a, d = g > 1 ? +b : c, e = g > 0 ? +arguments[g] : c, j
		}, j.tickPadding = function(a) {
			return arguments.length ? ( f = +a, j) : f
		}, j.tickSubdivide = function(a) {
			return arguments.length ? ( i = +a, j) : i
		}, j
	}, d3.behavior = {}, d3.behavior.drag = function() {
		function b() {
			this.on("mousedown.drag", d).on("touchstart.drag", d), d3.select(window).on("mousemove.drag", cV).on("touchmove.drag", cV).on("mouseup.drag", cW, !0).on("touchend.drag", cW, !0).on("click.drag", cX, !0)
		}

		function c() {
			cN = a, cQ = cU(( cO = this).parentNode), cR = 0, cP = arguments
		}

		function d() {
			c.apply(this, arguments), cT("dragstart")
		}

		var a = d3.dispatch("drag", "dragstart", "dragend");
		return b.on = function(c, d) {
			return a[c].add(d), b
		}, b
	};
	var cN, cO, cP, cQ, cR, cS;
	d3.behavior.zoom = function() {
		function c() {
			this.on("mousedown.zoom", e).on("mousewheel.zoom", f).on("DOMMouseScroll.zoom", f).on("dblclick.zoom", g).on("touchstart.zoom", h), d3.select(window).on("mousemove.zoom", dm).on("mouseup.zoom", dn).on("touchmove.zoom", dl).on("touchend.zoom", dk).on("click.zoom", dp, !0)
		}

		function d() {
			dc = a, dd = b.zoom.dispatch, de = this, df = arguments
		}

		function e() {
			d.apply(this, arguments), c$ = di(d3.svg.mouse(de)), dg = !1, d3.event.preventDefault(), window.focus()
		}

		function f() {
			d.apply(this, arguments), c_ || ( c_ = di(d3.svg.mouse(de))), dq(dj() + a[2], d3.svg.mouse(de), c_)
		}

		function g() {
			d.apply(this, arguments);
			var b = d3.svg.mouse(de);
			dq(d3.event.shiftKey ? Math.ceil(a[2] - 1) : Math.floor(a[2] + 1), b, di(b))
		}

		function h() {
			d.apply(this, arguments);
			var b = dk(), c, e = Date.now();
			b.length === 1 && e - db < 300 && dq(1 + Math.floor(a[2]), c = b[0], da[c.identifier]), db = e
		}

		var a = [0, 0, 0], b = d3.dispatch("zoom");
		return c.on = function(a, d) {
			return b[a].add(d), c
		}, c
	};
	var cZ, c$, c_, da = {}, db = 0, dc, dd, de, df, dg, dh
})(), function() {
	function b(a) {
		return "m0," + a + "a" + a + "," + a + " 0 1,1 0," + -2 * a + "a" + a + "," + a + " 0 1,1 0," + 2 * a + "z"
	}

	function c() {
		return 0
	}

	function d(a, b) {
		return b && b.type in a ? a[b.type](b) : ""
	}

	function e(a, b) {
		a.type in f && f[a.type](a, b)
	}

	function g(a, b) {
		e(a.geometry, b)
	}

	function h(a, b) {
		for (var c = a.features, d = 0, f = c.length; d < f; d++)
			e(c[d].geometry, b)
	}

	function i(a, b) {
		for (var c = a.coordinates, d = 0, e = c.length; d < e; d++)
			b.apply(null, c[d])
	}

	function j(a, b) {
		for (var c = a.coordinates, d = 0, e = c.length; d < e; d++)
			for (var f = c[d], g = 0, h = f.length; g < h; g++)
				b.apply(null, f[g])
	}

	function k(a, b) {
		for (var c = a.coordinates, d = 0, e = c.length; d < e; d++)
			for (var f = c[d][0], g = 0, h = f.length; g < h; g++)
				b.apply(null, f[g])
	}

	function l(a, b) {
		b.apply(null, a.coordinates)
	}

	function m(a, b) {
		for (var c = a.coordinates[0], d = 0, e = c.length; d < e; d++)
			b.apply(null, c[d])
	}

	function n(a) {
		return a.source
	}

	function o(a) {
		return a.target
	}
	d3.geo = {}, d3.geo.azimuthal = function() {
		function j(c) {
			var g = c[0] * a - f, j = c[1] * a, k = Math.cos(g), l = Math.sin(g), m = Math.cos(j), n = Math.sin(j), o = b === "stereographic" ? 1 / (1 + i * n + h * m * k) : 1, p = o * m * l, q = o * (i * m * k - h * n);
			return [d * p + e[0], d * q + e[1]]
		}

		var b = "orthographic", c, d = 200, e = [480, 250], f, g, h, i;
		return j.invert = function(c) {
			var g = (c[0] - e[0]) / d, j = (c[1] - e[1]) / d, k = Math.sqrt(g * g + j * j), l = b === "stereographic" ? 2 * Math.atan(k) : Math.asin(k), m = Math.sin(l), n = Math.cos(l);
			return [(f + Math.atan2(g * m, k * h * n + j * i * m)) / a, Math.asin(n * i - j * m * h / k) / a]
		}, j.mode = function(a) {
			return arguments.length ? ( b = a + "", j) : b
		}, j.origin = function(b) {
			return arguments.length ? ( c = b, f = c[0] * a, g = c[1] * a, h = Math.cos(g), i = Math.sin(g), j) : c
		}, j.scale = function(a) {
			return arguments.length ? ( d = +a, j) : d
		}, j.translate = function(a) {
			return arguments.length ? ( e = [+a[0], +a[1]], j) : e
		}, j.origin([0, 0])
	}, d3.geo.albers = function() {
		function j(b) {
			var c = g * (a * b[0] - f), j = Math.sqrt(h - 2 * g * Math.sin(a * b[1])) / g;
			return [d * j * Math.sin(c) + e[0], d * (j * Math.cos(c) - i) + e[1]]
		}

		function k() {
			var d = a * c[0], e = a * c[1], k = a * b[1], l = Math.sin(d), m = Math.cos(d);
			return f = a * b[0], g = .5 * (l + Math.sin(e)), h = m * m + 2 * g * l, i = Math.sqrt(h - 2 * g * Math.sin(k)) / g, j
		}

		var b = [-98, 38], c = [29.5, 45.5], d = 1e3, e = [480, 250], f, g, h, i;
		return j.invert = function(b) {
			var c = (b[0] - e[0]) / d, j = (b[1] - e[1]) / d, k = i + j, l = Math.atan2(c, k), m = Math.sqrt(c * c + k * k);
			return [(f + l / g) / a, Math.asin((h - m * m * g * g) / (2 * g)) / a]
		}, j.origin = function(a) {
			return arguments.length ? ( b = [+a[0], +a[1]], k()) : b
		}, j.parallels = function(a) {
			return arguments.length ? ( c = [+a[0], +a[1]], k()) : c
		}, j.scale = function(a) {
			return arguments.length ? ( d = +a, j) : d
		}, j.translate = function(a) {
			return arguments.length ? ( e = [+a[0], +a[1]], j) : e
		}, k()
	}, d3.geo.albersUsa = function() {
		function e(e) {
			var f = e[0], g = e[1];
			return (g > 50 ? b : f < -140 ? c : g < 21 ? d : a)(e)
		}

		var a = d3.geo.albers(), b = d3.geo.albers().origin([-160, 60]).parallels([55, 65]), c = d3.geo.albers().origin([-160, 20]).parallels([8, 18]), d = d3.geo.albers().origin([-60, 10]).parallels([8, 18]);
		return e.scale = function(f) {
			return arguments.length ? (a.scale(f), b.scale(f * .6), c.scale(f), d.scale(f * 1.5), e.translate(a.translate())) : a.scale()
		}, e.translate = function(f) {
			if (!arguments.length)
				return a.translate();
			var g = a.scale() / 1e3, h = f[0], i = f[1];
			return a.translate(f), b.translate([h - 400 * g, i + 170 * g]), c.translate([h - 190 * g, i + 200 * g]), d.translate([h + 580 * g, i + 430 * g]), e
		}, e.scale(a.scale())
	};
	var a = Math.PI / 180;
	d3.geo.mercator = function() {
		function d(d) {
			var e = d[0] / 360, f = -(Math.log(Math.tan(Math.PI / 4 + d[1] * a / 2)) / a) / 360;
			return [b * e + c[0], b * Math.max(-0.5, Math.min(.5, f)) + c[1]]
		}

		var b = 500, c = [480, 250];
		return d.invert = function(d) {
			var e = (d[0] - c[0]) / b, f = (d[1] - c[1]) / b;
			return [360 * e, 2 * Math.atan(Math.exp(-360 * f * a)) / a - 90]
		}, d.scale = function(a) {
			return arguments.length ? ( b = +a, d) : b
		}, d.translate = function(a) {
			return arguments.length ? ( c = [+a[0], +a[1]], d) : c
		}, d
	}, d3.geo.path = function() {
		function g(c, f) {
			return typeof a == "function" && ( e = b(a.apply(this, arguments))), d(i, c)
		}

		function h(a) {
			return f(a).join(",")
		}

		function k(a) {
			var b = n(a[0]), c = 0, d = a.length;
			while (++c < d)
			b -= n(a[c]);
			return b
		}

		function l(a) {
			var b = d3.geom.polygon(a[0].map(f)), c = b.centroid(1), d = c[0], e = c[1], g = Math.abs(b.area()), h = 0, i = a.length;
			while (++h < i) b = d3.geom.polygon(a[h].map(f)), c = b.centroid(1), d -= c[0], e -= c[1], g -= Math.abs(b.area());
			return [d, e, 6 * g]
		}

		function n(a) {
			return Math.abs(d3.geom.polygon(a.map(f)).area())
		}

		var a = 4.5, e = b(a), f = d3.geo.albersUsa(), i = {
			FeatureCollection : function(a) {
				var b = [], c = a.features, e = -1, f = c.length;
				while (++e < f)
				b.push(d(i, c[e].geometry));
				return b.join("")
			},
			Feature : function(a) {
				return d(i, a.geometry)
			},
			Point : function(a) {
				return "M" + h(a.coordinates) + e
			},
			MultiPoint : function(a) {
				var b = [], c = a.coordinates, d = -1, f = c.length;
				while (++d < f)
				b.push("M", h(c[d]), e);
				return b.join("")
			},
			LineString : function(a) {
				var b = ["M"], c = a.coordinates, d = -1, e = c.length;
				while (++d < e)
				b.push(h(c[d]), "L");
				return b.pop(), b.join("")
			},
			MultiLineString : function(a) {
				var b = [], c = a.coordinates, d = -1, e = c.length, f, g, i;
				while (++d < e) {
					f = c[d], g = -1, i = f.length, b.push("M");
					while (++g < i)
					b.push(h(f[g]), "L");
					b.pop()
				}
				return b.join("")
			},
			Polygon : function(a) {
				var b = [], c = a.coordinates, d = -1, e = c.length, f, g, i;
				while (++d < e) {
					f = c[d], g = -1, i = f.length, b.push("M");
					while (++g < i)
					b.push(h(f[g]), "L");
					b[b.length - 1] = "Z"
				}
				return b.join("")
			},
			MultiPolygon : function(a) {
				var b = [], c = a.coordinates, d = -1, e = c.length, f, g, i, j, k, l;
				while (++d < e) {
					f = c[d], g = -1, i = f.length;
					while (++g < i) {
						j = f[g], k = -1, l = j.length - 1, b.push("M");
						while (++k < l)
						b.push(h(j[k]), "L");
						b[b.length - 1] = "Z"
					}
				}
				return b.join("")
			},
			GeometryCollection : function(a) {
				var b = [], c = a.geometries, e = -1, f = c.length;
				while (++e < f)
				b.push(d(i, c[e]));
				return b.join("")
			}
		}, j = {
			FeatureCollection : function(a) {
				var b = 0, c = a.features, e = -1, f = c.length;
				while (++e < f)
				b += d(j, c[e]);
				return b
			},
			Feature : function(a) {
				return d(j, a.geometry)
			},
			Point : c,
			MultiPoint : c,
			LineString : c,
			MultiLineString : c,
			Polygon : function(a) {
				return k(a.coordinates)
			},
			MultiPolygon : function(a) {
				var b = 0, c = a.coordinates, d = -1, e = c.length;
				while (++d < e)
				b += k(c[d]);
				return b
			},
			GeometryCollection : function(a) {
				var b = 0, c = a.geometries, e = -1, f = c.length;
				while (++e < f)
				b += d(j, c[e]);
				return b
			}
		}, m = {
			Feature : function(a) {
				return d(m, a.geometry)
			},
			Polygon : function(a) {
				var b = l(a.coordinates);
				return [b[0] / b[2], b[1] / b[2]]
			},
			MultiPolygon : function(a) {
				var b = 0, c = a.coordinates, d, e = 0, f = 0, g = 0, h = -1, i = c.length;
				while (++h < i) d = l(c[h]), e += d[0], f += d[1], g += d[2];
				return [e / g, f / g]
			}
		};
		return g.projection = function(a) {
			return f = a, g
		}, g.area = function(a) {
			return d(j, a)
		}, g.centroid = function(a) {
			return d(m, a)
		}, g.pointRadius = function(c) {
			return typeof c == "function" ? a = c : ( a = +c, e = b(a)), g
		}, g
	}, d3.geo.bounds = function(a) {
		var b = Infinity, c = Infinity, d = -Infinity, f = -Infinity;
		return e(a, function(a, e) {
			a < b && ( b = a), a > d && ( d = a), e < c && ( c = e), e > f && ( f = e)
		}), [[b, c], [d, f]]
	};
	var f = {
		Feature : g,
		FeatureCollection : h,
		LineString : i,
		MultiLineString : j,
		MultiPoint : i,
		MultiPolygon : k,
		Point : l,
		Polygon : m
	};
	d3.geo.greatCircle = function() {
		function f(e, f) {
			var g = b.call(this, e, f), h = c.call(this, e, f), i = g[0] * a, j = g[1] * a, k = h[0] * a, l = h[1] * a, m = Math.cos(i), n = Math.sin(i), o = Math.cos(j), p = Math.sin(j), q = Math.cos(k), r = Math.sin(k), s = Math.cos(l), t = Math.sin(l), e = Math.acos(p * t + o * s * Math.cos(k - i)), u = Math.sin(e), v = e / (d - 1), w = -v, x = [], f = -1;
			while (++f < d) {
				w += v;
				var y = Math.sin(e - w) / u, z = Math.sin(w) / u, A = y * o * m + z * s * q, B = y * o * n + z * s * r, C = y * p + z * t;
				x[f] = [Math.atan2(B, A) / a, Math.atan2(C, Math.sqrt(A * A + B * B)) / a]
			}
			return x
		}

		var b = n, c = o, d = 100, e = 6371;
		return f.source = function(a) {
			return arguments.length ? ( b = a, f) : b
		}, f.target = function(a) {
			return arguments.length ? ( c = a, f) : c
		}, f.n = function(a) {
			return arguments.length ? ( d = +a, f) : d
		}, f.radius = function(a) {
			return arguments.length ? ( e = +a, f) : e
		}, f.distance = function(d, f) {
			var g = b.call(this, d, f), h = c.call(this, d, f), i = g[0] * a, j = g[1] * a, k = h[0] * a, l = h[1] * a, m = Math.sin((l - j) / 2), n = Math.sin((k - i) / 2), o = m * m + Math.cos(j) * Math.cos(l) * n * n;
			return e * 2 * Math.atan2(Math.sqrt(o), Math.sqrt(1 - o))
		}, f
	}
}();
if (!org)
	var org = {};
org.polymaps || (org.polymaps = {}), function(a) {
	function d(b) {
		var c = b.indexOf(":");
		return c < 0 ? b : {
			space : a.ns[b.substring(0, c)],
			local : b.substring(c + 1)
		}
	}

	function e(a) {
		for (var b = 0; b < e.maps.length; b++)
			e.maps[b].resize()
	}

	function f(a) {
		return 360 / Math.PI * Math.atan(Math.exp(a * Math.PI / 180)) - 90
	}

	function g(a) {
		return 180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + a * Math.PI / 360))
	}

	function i(a, b) {
		if (a.row > b.row) {
			var c = a;
			a = b, b = c
		}
		return {
			x0 : a.column,
			y0 : a.row,
			x1 : b.column,
			y1 : b.row,
			dx : b.column - a.column,
			dy : b.row - a.row
		}
	}

	function j(a, b, c, d, e) {
		var f = Math.max(c, Math.floor(b.y0)), g = Math.min(d, Math.ceil(b.y1));
		if (a.x0 == b.x0 && a.y0 == b.y0 ? a.x0 + b.dy / a.dy * a.dx < b.x1 : a.x1 - b.dy / a.dy * a.dx < b.x0) {
			var h = a;
			a = b, b = h
		}
		var i = a.dx / a.dy, j = b.dx / b.dy, k = a.dx > 0, l = b.dx < 0;
		for (var m = f; m < g; m++) {
			var n = i * Math.max(0, Math.min(a.dy, m + k - a.y0)) + a.x0, o = j * Math.max(0, Math.min(b.dy, m + l - b.y0)) + b.x0;
			e(Math.floor(o), Math.ceil(n), m)
		}
	}

	function k(a, b, c, d, e, f) {
		var g = i(a, b), h = i(b, c), k = i(c, a);
		if (g.dy > h.dy) {
			var l = g;
			g = h, h = l
		}
		if (g.dy > k.dy) {
			var l = g;
			g = k, k = l
		}
		if (h.dy > k.dy) {
			var l = h;
			h = k, k = l
		}
		g.dy && j(k, g, d, e, f), h.dy && j(k, h, d, e, f)
	}
	a.version = "2.5.0";
	var c = {
		x : 0,
		y : 0
	};
	a.ns = {
		svg : "http://www.w3.org/2000/svg",
		xlink : "http://www.w3.org/1999/xlink"
	}, a.id = function() {
		var a = 0;
		return function() {
			return ++a
		}
	}(), a.svg = function(b) {
		return document.createElementNS(a.ns.svg, b)
	}, a.transform = function(a, b, c, d, e, f) {
		var g = {}, h, i, j;
		return arguments.length || ( a = 1, c = 0, e = 0, b = 0, d = 1, f = 0), g.zoomFraction = function(e) {
			return arguments.length ? ( i = e, h = Math.floor(i + Math.log(Math.sqrt(a * a + b * b + c * c + d * d)) / Math.LN2), j = Math.pow(2, -h), g) : i
		}, g.apply = function(g) {
			var i = Math.pow(2, -g.zoom), j = Math.pow(2, g.zoom - h);
			return {
				column : (a * g.column * i + c * g.row * i + e) * j,
				row : (b * g.column * i + d * g.row * i + f) * j,
				zoom : g.zoom - h
			}
		}, g.unapply = function(g) {
			var i = Math.pow(2, -g.zoom), j = Math.pow(2, g.zoom + h);
			return {
				column : (g.column * i * d - g.row * i * c - e * d + f * c) / (a * d - b * c) * j,
				row : (g.column * i * b - g.row * i * a - e * b + f * a) / (c * b - d * a) * j,
				zoom : g.zoom + h
			}
		}, g.toString = function() {
			return "matrix(" + [a * j, b * j, c * j, d * j].join(" ") + " 0 0)"
		}, g.zoomFraction(0)
	}, a.cache = function(a, b) {
		function j(a) {
			i--, b && b(a),
			delete e[a.key];
			if (a.next)
				a.next.prev = a.prev;
			else if ( g = a.prev)
				g.next = null;
			if (a.prev)
				a.prev.next = a.next;
			else if ( f = a.next)
				f.prev = null
		}

		function k() {
			for (var a = g; i > h; a = a.prev) {
				if (!a)
					break;
				if (a.lock)
					continue;
				j(a)
			}
		}

		var c = {}, d = {}, e = {}, f = null, g = null, h = 64, i = 0;
		return c.peek = function(a) {
			return e[[a.zoom, a.column, a.row].join("/")]
		}, c.load = function(b, c) {
			var h = [b.zoom, b.column, b.row].join("/"), j = e[h];
			return j ? (j.prev && (j.prev.next = j.next, j.next ? j.next.prev = j.prev : g = j.prev, j.prev = null, j.next = f, f.prev = j, f = j), j.lock = 1, d[h] = j, j) : ( j = {
				key : h,
				column : b.column,
				row : b.row,
				zoom : b.zoom,
				next : f,
				prev : null,
				lock : 1
			}, a.call(null, j, c), d[h] = e[h] = j, f ? f.prev = j : g = j, f = j, i++, j)
		}, c.unload = function(a) {
			if ( a in d) {
				var b = d[a];
				return b.lock = 0,
				delete d[a], b.request && b.request.abort(!1) && j(b), b
			}
			return !1
		}, c.locks = function() {
			return d
		}, c.size = function(a) {
			return arguments.length ? ( h = a, k(), c) : h
		}, c.flush = function() {
			return k(), c
		}, c.clear = function() {
			for (var a in e) {
				var h = e[a];
				h.request && h.request.abort(!1), b && b(e[a]), h.lock && (h.lock = 0, h.element.parentNode.removeChild(h.element))
			}
			return d = {}, e = {}, f = g = null, i = 0, c
		}, c
	}, a.url = function(b) {
		function e(e) {
			var f = e.zoom < 0 ? 1 : 1 << e.zoom, g = e.column;
			if (d)
				g = e.column % f, g < 0 && (g += f);
			else if (g < 0 || g >= f)
				return null;
			return b.replace(/{(.)}/g, function(b, d) {
				switch(d) {
					case"S":
						return c[(Math.abs(e.zoom) + e.row + g) % c.length];
					case"Z":
						return e.zoom;
					case"X":
						return g;
					case"Y":
						return e.row;
					case"B":
						var f = a.map.coordinateLocation({
							row : e.row,
							column : g,
							zoom : e.zoom
						}), h = a.map.coordinateLocation({
							row : e.row + 1,
							column : g + 1,
							zoom : e.zoom
						}), i = Math.ceil(Math.log(e.zoom) / Math.LN2);
						return h.lat.toFixed(i) + "," + f.lon.toFixed(i) + "," + f.lat.toFixed(i) + "," + h.lon.toFixed(i)
				}
				return d
			})
		}

		var c = [], d = !0;
		return e.template = function(a) {
			return arguments.length ? ( b = a, e) : b
		}, e.hosts = function(a) {
			return arguments.length ? ( c = a, e) : c
		}, e.repeat = function(a) {
			return arguments.length ? ( d = a, e) : d
		}, e
	}, a.dispatch = function(a) {
		var b = {};
		return a.on = function(c, d) {
			var e = b[c] || (b[c] = []);
			for (var f = 0; f < e.length; f++)
				if (e[f].handler == d)
					return a;
			return e.push({
				handler : d,
				on : !0
			}), a
		}, a.off = function(c, d) {
			var e = b[c];
			if (e)
				for (var f = 0; f < e.length; f++) {
					var g = e[f];
					if (g.handler == d) {
						g.on = !1, e.splice(f, 1);
						break
					}
				}
			return a
		},
		function(c) {
			var d = b[c.type];
			if (!d)
				return;
			d = d.slice();
			for (var e = 0; e < d.length; e++) {
				var f = d[e];
				f.on && f.handler.call(a, c)
			}
		}

	}, a.queue = function() {
		function e() {
			if (c >= d || !b.length)
				return;
			c++, b.pop()()
		}

		function f(a) {
			for (var c = 0; c < b.length; c++)
				if (b[c] == a)
					return b.splice(c, 1), !0;
			return !1
		}

		function g(a, d, g) {
			function i() {
				h = new XMLHttpRequest, g && h.overrideMimeType(g), h.open("GET", a, !0), h.onreadystatechange = function(a) {
					h.readyState == 4 && (c--, h.status < 300 && d(h), e())
				}, h.send(null)
			}

			function j(a) {
				return f(i) ? !0 : a && h ? (h.abort(), !0) : !1
			}

			var h;
			return b.push(i), e(), {
				abort : j
			}
		}

		function h(a, b, c) {
			return g(a, function(a) {
				a.responseText && b(a.responseText)
			}, c)
		}

		function i(a, b) {
			return g(a, function(a) {
				a.responseText && b(JSON.parse(a.responseText))
			}, "application/json")
		}

		function j(a, b) {
			return g(a, function(a) {
				a.responseXML && b(a.responseXML)
			}, "application/xml")
		}

		function k(d, g, h) {
			function j() {
				i = document.createElement("img"), i.onerror = function() {
					c--, e()
				}, i.onload = function() {
					c--, h(i), e()
				}, i.src = g, d.setAttributeNS(a.ns.xlink, "href", g)
			}

			function k(a) {
				return f(j) ? !0 : a && i ? (i.src = "about:", !0) : !1
			}

			var i;
			return b.push(j), e(), {
				abort : k
			}
		}

		var b = [], c = 0, d = 6;
		return {
			text : h,
			xml : j,
			json : i,
			image : k
		}
	}(), a.map = function() {
		function A() {
			r && (o < r[0] ? o = r[0] : o > r[1] && ( o = r[1])), p = o - ( o = Math.round(o)), q = Math.pow(2, p)
		}

		function B() {
			if (!z)
				return;
			var a = 45 / Math.pow(2, o + p - 3), b = Math.max(Math.abs(u * l.x + t * l.y), Math.abs(w * l.x + v * l.y)), c = f(x - b * a / m.y), d = f(y + b * a / m.y);
			n.lat = Math.max(c, Math.min(d, n.lat));
			var e = Math.max(Math.abs(u * l.y + t * l.x), Math.abs(w * l.y + v * l.x)), g = z[0].lon - e * a / m.x, h = z[1].lon + e * a / m.x;
			n.lon = Math.max(g, Math.min(h, n.lon))
		}

		var d = {}, i, j, k = c, l = c, m = {
			x : 256,
			y : 256
		}, n = {
			lat : 37.76487,
			lon : -122.41948
		}, o = 12, p = 0, q = 1, r = [1, 18], s = 0, t = 1, u = 0, v = 1, w = 0, x = -180, y = 180, z = [{
			lat : f(x),
			lon : -Infinity
		}, {
			lat : f(y),
			lon : Infinity
		}];
		d.locationCoordinate = function(b) {
			var c = a.map.locationCoordinate(b), d = Math.pow(2, o);
			return c.column *= d, c.row *= d, c.zoom += o, c
		}, d.coordinateLocation = a.map.coordinateLocation, d.coordinatePoint = function(a, b) {
			var c = Math.pow(2, o - b.zoom), d = Math.pow(2, o - a.zoom), e = (b.column * c - a.column * d) * m.x * q, f = (b.row * c - a.row * d) * m.y * q;
			return {
				x : l.x + t * e - u * f,
				y : l.y + u * e + t * f
			}
		}, d.pointCoordinate = function(a, b) {
			var c = Math.pow(2, o - a.zoom), d = (b.x - l.x) / q, e = (b.y - l.y) / q;
			return {
				column : a.column * c + (v * d - w * e) / m.x,
				row : a.row * c + (w * d + v * e) / m.y,
				zoom : o
			}
		}, d.locationPoint = function(a) {
			var b = Math.pow(2, o + p - 3) / 45, c = (a.lon - n.lon) * b * m.x, d = (g(n.lat) - g(a.lat)) * b * m.y;
			return {
				x : l.x + t * c - u * d,
				y : l.y + u * c + t * d
			}
		}, d.pointLocation = function(a) {
			var b = 45 / Math.pow(2, o + p - 3), c = (a.x - l.x) * b, d = (a.y - l.y) * b;
			return {
				lon : n.lon + (v * c - w * d) / m.x,
				lat : f(g(n.lat) - (w * c + v * d) / m.y)
			}
		};
		var C = a.svg("rect");
		return C.setAttribute("visibility", "hidden"), C.setAttribute("pointer-events", "all"), d.container = function(a) {
			return arguments.length ? ( i = a, i.setAttribute("class", "map"), i.appendChild(C), d.resize()) : i
		}, d.focusableParent = function() {
			for (var a = i; a; a = a.parentNode)
				if (a.tabIndex >= 0)
					return a;
			return window
		}, d.mouse = function(b) {
			var c = (i.ownerSVGElement || i).createSVGPoint();
			if (h < 0 && (window.scrollX || window.scrollY)) {
				var d = document.body.appendChild(a.svg("svg"));
				d.style.position = "absolute", d.style.top = d.style.left = "0px";
				var e = d.getScreenCTM();
				h = !e.f && !e.e, document.body.removeChild(d)
			}
			return h ? (c.x = b.pageX, c.y = b.pageY) : (c.x = b.clientX, c.y = b.clientY), c.matrixTransform(i.getScreenCTM().inverse())
		}, d.size = function(a) {
			return arguments.length ? ( j = a, d.resize()) : k
		}, d.resize = function() {
			return j ? ( k = j, e.remove(d)) : (C.setAttribute("width", "100%"), C.setAttribute("height", "100%"), b = C.getBBox(), k = {
				x : b.width,
				y : b.height
			}, e.add(d)), C.setAttribute("width", k.x), C.setAttribute("height", k.y), l = {
				x : k.x / 2,
				y : k.y / 2
			}, B(), d.dispatch({
				type : "resize"
			}), d
		}, d.tileSize = function(a) {
			return arguments.length ? ( m = a, d.dispatch({
				type : "move"
			}), d) : m
		}, d.center = function(a) {
			return arguments.length ? ( n = a, B(), d.dispatch({
				type : "move"
			}), d) : n
		}, d.panBy = function(a) {
			var b = 45 / Math.pow(2, o + p - 3), c = a.x * b, e = a.y * b;
			return d.center({
				lon : n.lon + (w * e - v * c) / m.x,
				lat : f(g(n.lat) + (w * c + v * e) / m.y)
			})
		}, d.centerRange = function(a) {
			return arguments.length ? ( z = a, z ? ( x = z[0].lat > -90 ? g(z[0].lat) : -Infinity, y = z[0].lat < 90 ? g(z[1].lat) : Infinity) : ( x = -Infinity, y = Infinity), B(), d.dispatch({
				type : "move"
			}), d) : z
		}, d.zoom = function(a) {
			return arguments.length ? ( o = a, A(), d.center(n)) : o + p
		}, d.zoomBy = function(a, b, c) {
			if (arguments.length < 2)
				return d.zoom(o + p + a);
			arguments.length < 3 && ( c = d.pointLocation(b)), o = o + p + a, A();
			var e = d.locationPoint(c);
			return d.panBy({
				x : b.x - e.x,
				y : b.y - e.y
			})
		}, d.zoomRange = function(a) {
			return arguments.length ? ( r = a, d.zoom(o + p)) : r
		}, d.extent = function(a) {
			if (!arguments.length)
				return [d.pointLocation({
					x : 0,
					y : k.y
				}), d.pointLocation({
					x : k.x,
					y : 0
				})];
			var b = d.locationPoint(a[0]), c = d.locationPoint(a[1]), e = Math.max((c.x - b.x) / k.x, (b.y - c.y) / k.y), f = d.pointLocation({
				x : (b.x + c.x) / 2,
				y : (b.y + c.y) / 2
			});
			return o = o + p - Math.log(e) / Math.LN2, A(), d.center(f)
		}, d.angle = function(a) {
			return arguments.length ? ( s = a, t = Math.cos(s), u = Math.sin(s), v = Math.cos(-s), w = Math.sin(-s), B(), d.dispatch({
				type : "move"
			}), d) : s
		}, d.add = function(a) {
			return a.map(d), d
		}, d.remove = function(a) {
			return a.map(null), d
		}, d.dispatch = a.dispatch(d), d
	}, e.maps = [], e.add = function(a) {
		for (var b = 0; b < e.maps.length; b++)
			if (e.maps[b] == a)
				return;
		e.maps.push(a)
	}, e.remove = function(a) {
		for (var b = 0; b < e.maps.length; b++)
			if (e.maps[b] == a) {
				e.maps.splice(b, 1);
				return
			}
	}, window.addEventListener("resize", e, !1), window.addEventListener("load", e, !1), a.map.locationCoordinate = function(a) {
		var b = 1 / 360;
		return {
			column : (a.lon + 180) * b,
			row : (180 - g(a.lat)) * b,
			zoom : 0
		}
	}, a.map.coordinateLocation = function(a) {
		var b = 45 / Math.pow(2, a.zoom - 3);
		return {
			lon : b * a.column - 180,
			lat : f(180 - b * a.row)
		}
	};
	var h = /WebKit/.test(navigator.userAgent) ? -1 : 0;
	a.layer = function(b, d) {
		function r(a) {
			var b = p[0].nextSibling;
			for (; o < a; o++) {
				m.insertBefore(p[-4], b), m.insertBefore(p[2], b), m.insertBefore(p[1], b);
				var c = p[-4];
				for (var d = -4; d < 2; )
					p[d] = p[++d];
				p[d] = c
			}
		}

		function s(a) {
			var b = p[0].nextSibling;
			for (; o > a; o--) {
				m.insertBefore(p[-1], b), m.insertBefore(p[2], p[-4]);
				var c = p[2];
				for (var d = 2; d > -4; )
					p[d] = p[--d];
				p[d] = c
			}
		}

		function t() {
			function D(b) {
				var c = b.zoom, d = c < 0 ? 1 : 1 << c, e = b.column % d, f = b.row;
				return e < 0 && (e += d), {
					locationPoint : function(b) {
						var d = a.map.locationCoordinate(b), g = Math.pow(2, c - d.zoom);
						return {
							x : t.x * (g * d.column - e),
							y : t.y * (g * d.row - f)
						}
					}
				}
			}

			function K(a, b, c) {
				var d = x.zoom, e = 2 - B, g = 4 + B;
				for (var h = a; h < b; h++) {
					var i = f.load({
						column : h,
						row : c,
						zoom : d
					}, D);
					if (!i.ready && !(i.key in F)) {
						i.proxyRefs = {};
						var j, k, l;
						for (var m = 1; m <= e; m++) {
							k = !0;
							for (var n = 0, o = 1 << m; n <= o; n++)
								for (var p = 0; p <= o; p++)
									l = f.peek( j = {
										column : (h << m) + p,
										row : (c << m) + n,
										zoom : d + m
									}), l && l.ready ? (F[l.key] = f.load(j), l.proxyCount++, i.proxyRefs[l.key] = l) : k = !1;
							if (k)
								break
						}
						if (!k)
							for (var m = 1; m <= g; m++) {
								l = f.peek( j = {
									column : h >> m,
									row : c >> m,
									zoom : d - m
								});
								if (l && l.ready) {
									F[l.key] = f.load(j), l.proxyCount++, i.proxyRefs[l.key] = l;
									break
								}
							}
					}
					F[i.key] = i
				}
			}

			var b = e.map(), d = b.zoom(), j = d - ( d = Math.round(d)), l = b.size(), q = b.angle(), t = b.tileSize(), u = b.locationCoordinate(b.center());
			if (o != d) {
				o < d ? r(d) : o > d ? s(d) : o = d;
				for (var v = -4; v <= 2; v++) {
					var w = p[v];
					w.setAttribute("class", "zoom" + (v < 0 ? "" : "+") + v + " zoom" + (d + v)), w.setAttribute("transform", "scale(" + Math.pow(2, -v) + ")")
				}
			}
			m.setAttribute("transform", "translate(" + l.x / 2 + "," + l.y / 2 + ")" + ( q ? "rotate(" + q / Math.PI * 180 + ")" : "") + ( j ? "scale(" + Math.pow(2, j) + ")" : "") + ( n ? n.zoomFraction(j) : ""));
			var x = b.pointCoordinate(u, c), y = b.pointCoordinate(u, {
				x : l.x,
				y : 0
			}), z = b.pointCoordinate(u, l), A = b.pointCoordinate(u, {
				x : 0,
				y : l.y
			});
			!j && !q && !n && (u.column = (Math.round(t.x * u.column) + (l.x & 1) / 2) / t.x, u.row = (Math.round(t.y * u.row) + (l.y & 1) / 2) / t.y), n && ( x = n.unapply(x), y = n.unapply(y), z = n.unapply(z), A = n.unapply(A), u = n.unapply(u));
			var B = i ? i(x.zoom) - x.zoom : 0;
			if (B) {
				var C = Math.pow(2, B);
				x.column *= C, x.row *= C, y.column *= C, y.row *= C, z.column *= C, z.row *= C, A.column *= C, A.row *= C, x.zoom = y.zoom = z.zoom = A.zoom += B
			}
			var E = f.locks(), F = {};
			for (var G in E)
			E[G].proxyCount = 0;
			if (h && B > -5 && B < 3) {
				var H = x.zoom < 0 ? 1 : 1 << x.zoom;
				if (g)
					k(x, y, z, 0, H, K), k(z, A, x, 0, H, K);
				else {
					var I = Math.floor((x.column + z.column) / 2), J = Math.max(0, Math.min(H - 1, Math.floor((y.row + A.row) / 2))), v = Math.min(4, x.zoom);
					I = I >> v << v, J = J >> v << v, K(I, I + 1, J)
				}
			}
			for (var G in F) {
				var L = F[G], C = Math.pow(2, L.level = L.zoom - u.zoom);
				L.element.setAttribute("transform", "translate(" + (L.x = t.x * (L.column - u.column * C)) + "," + (L.y = t.y * (L.row - u.row * C)) + ")")
			}
			for (var G in E)
			if (!( G in F)) {
				var L = f.unload(G);
				L.element.parentNode.removeChild(L.element),
				delete L.proxyRefs
			}
			for (var G in F) {
				var L = F[G];
				L.element.parentNode != p[L.level] && (p[L.level].appendChild(L.element), e.show && e.show(L))
			}
			f.flush(), e.dispatch({
				type : "move"
			})
		}

		function u(a) {
			if (a.tile.proxyRefs) {
				for (var b in a.tile.proxyRefs) {
					var c = a.tile.proxyRefs[b];
					--c.proxyCount <= 0 && f.unload(b) && c.element.parentNode.removeChild(c.element)
				}
				delete a.tile.proxyRefs
			}
		}

		var e = {}, f = e.cache = a.cache(b, d).size(512), g = !0, h = !0, i, j, l, m = a.svg("g"), n, o, p = {};
		m.setAttribute("class", "layer");
		for (var q = -4; q <= -1; q++)
			p[q] = m.appendChild(a.svg("g"));
		for (var q = 2; q >= 1; q--)
			p[q] = m.appendChild(a.svg("g"));
		return p[0] = m.appendChild(a.svg("g")), e.map = function(a) {
			if (!arguments.length)
				return l;
			if (l) {
				if (l == a)
					return m.parentNode.appendChild(m), e;
				l.off("move", t).off("resize", t), m.parentNode.removeChild(m)
			}
			return l = a, l && (l.container().appendChild(m), e.init && e.init(m), l.on("move", t).on("resize", t), t()), e
		}, e.container = function() {
			return m
		}, e.levels = function() {
			return p
		}, e.id = function(a) {
			return arguments.length ? ( j = a, m.setAttribute("id", a), e) : j
		}, e.visible = function(a) {
			return arguments.length ? (( h = a) ? m.removeAttribute("visibility") : m.setAttribute("visibility", "hidden"), l && t(), e) : h
		}, e.transform = function(a) {
			return arguments.length ? ( n = a, l && t(), e) : n
		}, e.zoom = function(a) {
			return arguments.length ? ( i = typeof a == "function" || a == null ? a : function() {
				return a
			}, l && t(), e) : i
		}, e.tile = function(a) {
			return arguments.length ? ( g = a, l && t(), e) : g
		}, e.reload = function() {
			return f.clear(), l && t(), e
		}, e.dispatch = a.dispatch(e), e.on("load", u), e
	}, a.image = function() {
		function d(d) {
			var e = d.element = a.svg("image"), f = b.map().tileSize();
			e.setAttribute("preserveAspectRatio", "none"), e.setAttribute("width", f.x), e.setAttribute("height", f.y);
			if ( typeof c == "function") {
				e.setAttribute("opacity", 0);
				var g = c(d);
				g != null ? d.request = a.queue.image(e, g, function(a) {
					delete d.request, d.ready = !0, d.img = a, e.removeAttribute("opacity"), b.dispatch({
						type : "load",
						tile : d
					})
				}) : (d.ready = !0, b.dispatch({
					type : "load",
					tile : d
				}))
			} else
				d.ready = !0, c != null && e.setAttributeNS(a.ns.xlink, "href", c), b.dispatch({
					type : "load",
					tile : d
				})
		}

		function e(a) {
			a.request && a.request.abort(!0)
		}

		var b = a.layer(d, e), c;
		return b.url = function(d) {
			return arguments.length ? ( c = typeof d == "string" && /{.}/.test(d) ? a.url(d) : d, b.reload()) : c
		}, b
	}, a.geoJson = function(b) {
		function n(a) {
			var b = {
				lat : 0,
				lon : 0
			};
			return function(c) {
				b.lat = c[1], b.lon = c[0];
				var d = a(b);
				return c.x = d.x, c.y = d.y, d
			}
		}

		function o(a, b) {
			return a && a.type in q && q[a.type](a, b)
		}

		function r(a, b, c) {
			return a.type in s && s[a.type](a, b, c)
		}

		function t(d, f) {
			function h(a) {
				var e = [];
				a.next && (d.request = b(a.next.href, h));
				switch(a.type) {
					case"FeatureCollection":
						for (var i = 0; i < a.features.length; i++) {
							var j = a.features[i], k = o(j.geometry, f);
							k && e.push({
								element : g.appendChild(k),
								data : j
							})
						}
						break;
					case"Feature":
						var k = o(a.geometry, f);
						k && e.push({
							element : g.appendChild(k),
							data : a
						});
						break;
					default:
						var k = o(a, f);
						k && e.push({
							element : g.appendChild(k),
							data : {
								type : "Feature",
								geometry : a
							}
						})
				}
				d.ready = !0, e.push.apply(d.features, e), c.dispatch({
					type : "load",
					tile : d,
					features : e
				})
			}

			var g = d.element = a.svg("g");
			d.features = [], f = n(f(d).locationPoint), e != null ? d.request = b( typeof e == "function" ? e(d) : e, h) : h({
				type : "FeatureCollection",
				features : m || []
			})
		}

		function u(a) {
			a.request && a.request.abort(!0)
		}

		function v() {
			var a = c.map().zoom(), b = c.cache.locks(), d, e, f, g, h, i, j;
			if (k == "fixed") {
				for (d in b)
				if (( e = b[d]).scale != a) {
					j = "scale(" + Math.pow(2, e.zoom - a) + ")", g = -1, h = ( f = e.features).length;
					while (++g < h)r(( i = f[g]).data.geometry, i.element, j);
					e.scale = a
				}
			} else
				for (d in b) {
					g = -1, h = ( f = ( e = b[d]).features).length;
					while (++g < h)r(( i = f[g]).data.geometry, i.element, "");
					delete e.scale
				}
		}

		var c = a.layer(t, u), d = c.container(), e, f = !0, g = "org.polymaps." + a.id(), h = "url(#" + g + ")", i = d.insertBefore(a.svg("clipPath"), d.firstChild), j = i.appendChild(a.svg("rect")), k = "auto", l = null, m;
		d.setAttribute("fill-rule", "evenodd"), i.setAttribute("id", g), arguments.length || ( b = a.queue.json);
		var q = {
			Point : function(b, c) {
				var d = c(b.coordinates), e = a.svg("circle");
				return e.setAttribute("r", 4.5), e.setAttribute("transform", "translate(" + d.x + "," + d.y + ")"), e
			},
			MultiPoint : function(b, c) {
				var d = a.svg("g"), e = b.coordinates, f, g, h = -1, i = e.length;
				while (++h < i) g = d.appendChild(a.svg("circle")), g.setAttribute("r", 4.5), g.setAttribute("transform", "translate(" + ( f = c(e[h])).x + "," + f.y + ")");
				return d
			},
			LineString : function(b, c) {
				var d = a.svg("path"), e = ["M"], f = b.coordinates, g, h = -1, i = f.length;
				while (++h < i)
				e.push(( g = c(f[h])).x, ",", g.y, "L");
				e.pop();
				if (!e.length)
					return;
				return d.setAttribute("d", e.join("")), d
			},
			MultiLineString : function(b, c) {
				var d = a.svg("path"), e = [], f = b.coordinates, g, h = -1, i, j = f.length, k;
				while (++h < j) {
					g = f[h], i = -1, k = g.length, e.push("M");
					while (++i < k)
					e.push(( p = c(g[i])).x, ",", p.y, "L");
					e.pop()
				}
				if (!e.length)
					return;
				return d.setAttribute("d", e.join("")), d
			},
			Polygon : function(b, c) {
				var d = a.svg("path"), e = [], f = b.coordinates, g, h = -1, i, j = f.length, k;
				while (++h < j) {
					g = f[h], i = -1, k = g.length - 1, e.push("M");
					while (++i < k)
					e.push(( p = c(g[i])).x, ",", p.y, "L");
					e[e.length - 1] = "Z"
				}
				if (!e.length)
					return;
				return d.setAttribute("d", e.join("")), d
			},
			MultiPolygon : function(b, c) {
				var d = a.svg("path"), e = [], f = b.coordinates, g, h, i = -1, j, k, l = f.length, m, n;
				while (++i < l) {
					g = f[i], j = -1, m = g.length;
					while (++j < m) {
						h = g[j], k = -1, n = h.length - 1, e.push("M");
						while (++k < n)
						e.push(( p = c(h[k])).x, ",", p.y, "L");
						e[e.length - 1] = "Z"
					}
				}
				if (!e.length)
					return;
				return d.setAttribute("d", e.join("")), d
			},
			GeometryCollection : function(b, c) {
				var d = a.svg("g"), e = -1, f = b.geometries, g = f.length, h;
				while (++e < g) h = o(f[e], c), h && d.appendChild(h);
				return d
			}
		}, s = {
			Point : function(a, b, c) {
				var d = a.coordinates;
				b.setAttribute("transform", "translate(" + d.x + "," + d.y + ")" + c)
			},
			MultiPoint : function(a, b, c) {
				var d = a.coordinates, e = -1, f = h.length, g = b.firstChild, h;
				while (++e < f) h = d[e], g.setAttribute("transform", "translate(" + h.x + "," + h.y + ")" + c), g = g.nextSibling
			}
		};
		c.url = function(b) {
			return arguments.length ? ( e = typeof b == "string" && /{.}/.test(b) ? a.url(b) : b, e != null && ( m = null), typeof e == "string" && c.tile(!1), c.reload()) : e
		}, c.features = function(a) {
			if (!arguments.length)
				return m;
			if ( m = a)
				e = null, c.tile(!1);
			return c.reload()
		}, c.clip = function(a) {
			if (!arguments.length)
				return f;
			f && d.removeChild(i), ( f = a) && d.insertBefore(i, d.firstChild);
			var b = c.cache.locks();
			for (var e in b)
			f ? b[e].element.setAttribute("clip-path", h) : b[e].element.removeAttribute("clip-path");
			return c
		};
		var w = c.tile;
		c.tile = function(a) {
			return arguments.length && !a && c.clip(a), w.apply(c, arguments)
		};
		var x = c.map;
		return c.map = function(a) {
			if (a && j) {
				var b = a.tileSize();
				j.setAttribute("width", b.x), j.setAttribute("height", b.y)
			}
			return x.apply(c, arguments)
		}, c.scale = function(a) {
			return arguments.length ? (( k = a) ? c.on("move", v) : c.off("move", v), c.map() && v(), c) : k
		}, c.show = function(a) {
			return f ? a.element.setAttribute("clip-path", h) : a.element.removeAttribute("clip-path"), c.dispatch({
				type : "show",
				tile : a,
				features : a.features
			}), c
		}, c.reshow = function() {
			var a = c.cache.locks();
			for (var b in a)
			c.show(a[b]);
			return c
		}, c
	}, a.dblclick = function() {
		function e(a) {
			var d = c.zoom();
			a.shiftKey ? d = Math.ceil(d) - d - 1 : d = 1 - d + Math.floor(d), b === "mouse" ? c.zoomBy(d, c.mouse(a)) : c.zoomBy(d)
		}

		var a = {}, b = "mouse", c, d;
		return a.zoom = function(c) {
			return arguments.length ? ( b = c, a) : b
		}, a.map = function(b) {
			if (!arguments.length)
				return c;
			c && (d.removeEventListener("dblclick", e, !1), d = null);
			if ( c = b)
				d = c.container(), d.addEventListener("dblclick", e, !1);
			return a
		}, a
	}, a.drag = function() {
		function e(a) {
			if (a.shiftKey)
				return;
			d = {
				x : a.clientX,
				y : a.clientY
			}, b.focusableParent().focus(), a.preventDefault(), document.body.style.setProperty("cursor", "move", null)
		}

		function f(a) {
			if (!d)
				return;
			b.panBy({
				x : a.clientX - d.x,
				y : a.clientY - d.y
			}), d.x = a.clientX, d.y = a.clientY
		}

		function g(a) {
			if (!d)
				return;
			f(a), d = null, document.body.style.removeProperty("cursor")
		}

		var a = {}, b, c, d;
		return a.map = function(d) {
			if (!arguments.length)
				return b;
			b && (c.removeEventListener("mousedown", e, !1), c = null);
			if ( b = d)
				c = b.container(), c.addEventListener("mousedown", e, !1);
			return a
		}, window.addEventListener("mousemove", f, !1), window.addEventListener("mouseup", g, !1), a
	}, a.wheel = function() {
		function i(a) {
			f = null
		}

		function l(a) {
			var c = a.wheelDelta || -a.detail, h;
			if (c)
				if (d) {
					try {
						k.scrollTop = 1e3, k.dispatchEvent(a), c = 1e3 - k.scrollTop
					} catch(j) {
					}
					c *= .005
				} else {
					var l = Date.now();
					l - b > 200 ? ( c = c > 0 ? 1 : -1, b = l) : c = 0
				}
			if (c)
				switch(e) {
					case"mouse":
						h = g.mouse(a), f || ( f = g.pointLocation(h)), g.off("move", i).zoomBy(c, h, f).on("move", i);
						break;
					case"location":
						g.zoomBy(c, g.locationPoint(f), f);
						break;
					default:
						g.zoomBy(c)
				}
			return a.preventDefault(), !1
		}

		var a = {}, b = 0, c = 0, d = !0, e = "mouse", f, g, h, j = document.createElement("div"), k = document.createElement("div");
		return k.style.visibility = "hidden", k.style.top = "0px", k.style.height = "0px", k.style.width = "0px", k.style.overflowY = "scroll", j.style.height = "2000px", k.appendChild(j), document.body.appendChild(k), a.smooth = function(b) {
			return arguments.length ? ( d = b, a) : d
		}, a.zoom = function(b, c) {
			return arguments.length ? ( e = b, f = c, g && (e == "mouse" ? g.on("move", i) : g.off("move", i)), a) : e
		}, a.map = function(b) {
			if (!arguments.length)
				return g;
			g && (h.removeEventListener("mousemove", i, !1), h.removeEventListener("mousewheel", l, !1), h.removeEventListener("MozMousePixelScroll", l, !1), h = null, g.off("move", i));
			if ( g = b)
				e == "mouse" && g.on("move", i), h = g.container(), h.addEventListener("mousemove", i, !1), h.addEventListener("mousewheel", l, !1), h.addEventListener("MozMousePixelScroll", l, !1);
			return a
		}, a
	}, a.arrow = function() {
		function j(a) {
			if (a.ctrlKey || a.altKey || a.metaKey)
				return;
			var e = Date.now(), i = 0, j = 0;
			switch(a.keyCode) {
				case 37:
					b.left || ( c = e, b.left = 1, b.right || ( i = g));
					break;
				case 39:
					b.right || ( c = e, b.right = 1, b.left || ( i = -g));
					break;
				case 38:
					b.up || ( c = e, b.up = 1, b.down || ( j = g));
					break;
				case 40:
					b.down || ( c = e, b.down = 1, b.up || ( j = -g));
					break;
				default:
					return
			}
			(i || j) && h.panBy({
				x : i,
				y : j
			}), !d && b.left | b.right | b.up | b.down && ( d = setInterval(m, f)), a.preventDefault()
		}

		function k(a) {
			c = Date.now();
			switch(a.keyCode) {
				case 37:
					b.left = 0;
					break;
				case 39:
					b.right = 0;
					break;
				case 38:
					b.up = 0;
					break;
				case 40:
					b.down = 0;
					break;
				default:
					return
			}
			d && !(b.left | b.right | b.up | b.down) && ( d = clearInterval(d)), a.preventDefault()
		}

		function l(a) {
			switch(a.charCode) {
				case 45:
				case 95:
					h.zoom(Math.ceil(h.zoom()) - 1);
					break;
				case 43:
				case 61:
					h.zoom(Math.floor(h.zoom()) + 1);
					break;
				default:
					return
			}
			a.preventDefault()
		}

		function m() {
			if (!h)
				return;
			if (Date.now() < c + e)
				return;
			var a = (b.left - b.right) * g, d = (b.up - b.down) * g;
			(a || d) && h.panBy({
				x : a,
				y : d
			})
		}

		var a = {}, b = {
			left : 0,
			right : 0,
			up : 0,
			down : 0
		}, c = 0, d, e = 250, f = 50, g = 16, h, i;
		return a.map = function(b) {
			if (!arguments.length)
				return h;
			h && (i.removeEventListener("keypress", l, !1), i.removeEventListener("keydown", j, !1), i.removeEventListener("keyup", k, !1), i = null);
			if ( h = b)
				i = h.focusableParent(), i.addEventListener("keypress", l, !1), i.addEventListener("keydown", j, !1), i.addEventListener("keyup", k, !1);
			return a
		}, a.speed = function(b) {
			return arguments.length ? ( g = b, a) : g
		}, a
	}, a.hash = function() {
		function g() {
			var a = f(d);
			b !== a && location.replace( b = a)
		}

		function h() {
			if (location.hash === b)
				return;
			e(d, ( b = location.hash).substring(1)) && g()
		}

		var a = {}, b, c = 90 - 1e-8, d, e = function(a, b) {
			var d = b.split("/").map(Number);
			if (d.length < 3 || d.some(isNaN))
				return !0;
			var e = a.size();
			a.zoomBy(d[0] - a.zoom(), {
				x : e.x / 2,
				y : e.y / 2
			}, {
				lat : Math.min(c, Math.max(-c, d[1])),
				lon : d[2]
			})
		}, f = function(a) {
			var b = a.center(), c = a.zoom(), d = Math.max(0, Math.ceil(Math.log(c) / Math.LN2));
			return "#" + c.toFixed(2) + "/" + b.lat.toFixed(d) + "/" + b.lon.toFixed(d)
		};
		return a.map = function(b) {
			if (!arguments.length)
				return d;
			d && (d.off("move", g), window.removeEventListener("hashchange", h, !1));
			if ( d = b)
				d.on("move", g), window.addEventListener("hashchange", h, !1), location.hash ? h() : g();
			return a
		}, a.parser = function(b) {
			return arguments.length ? ( e = b, a) : e
		}, a.formatter = function(b) {
			return arguments.length ? ( f = b, a) : f
		}, a
	}, a.touch = function() {
		function j(a) {
			var b = -1, d = a.touches.length, e = Date.now();
			if (d == 1 && e - f < 300) {
				var j = c.zoom();
				c.zoomBy(1 - j + Math.floor(j), c.mouse(a.touches[0])), a.preventDefault()
			}
			f = e, g = c.zoom(), h = c.angle();
			while (++b < d) e = a.touches[b], i[e.identifier] = c.pointLocation(c.mouse(e))
		}

		function k(b) {
			switch(b.touches.length) {
				case 1:
					var d = b.touches[0];
					c.zoomBy(0, c.mouse(d), i[d.identifier]), b.preventDefault();
					break;
				case 2:
					var d = b.touches[0], f = b.touches[1], j = c.mouse(d), k = c.mouse(f), l = {
						x : (j.x + k.x) / 2,
						y : (j.y + k.y) / 2
					}, m = a.map.locationCoordinate(i[d.identifier]), n = a.map.locationCoordinate(i[f.identifier]), o = {
						row : (m.row + n.row) / 2,
						column : (m.column + n.column) / 2,
						zoom : 0
					}, p = a.map.coordinateLocation(o);
					c.zoomBy(Math.log(b.scale) / Math.LN2 + g - c.zoom(), l, p), e && c.angle(b.rotation / 180 * Math.PI + h), b.preventDefault()
			}
		}

		var b = {}, c, d, e = !1, f = 0, g, h, i = {};
		return window.addEventListener("touchmove", k, !1), b.rotate = function(a) {
			return arguments.length ? ( e = a, b) : e
		}, b.map = function(a) {
			if (!arguments.length)
				return c;
			c && (d.removeEventListener("touchstart", j, !1), d = null);
			if ( c = a)
				d = c.container(), d.addEventListener("touchstart", j, !1);
			return b
		}, b
	}, a.interact = function() {
		var b = {}, c = a.drag(), d = a.wheel(), e = a.dblclick(), f = a.touch(), g = a.arrow();
		return b.map = function(a) {
			return c.map(a), d.map(a), e.map(a), f.map(a), g.map(a), b
		}, b
	}, a.compass = function() {
		function v(a) {
			return c.setAttribute("class", "compass active"), n || ( n = setInterval(w, i)), o && s.panBy(o), g = Date.now(), F(a)
		}

		function w() {
			o && Date.now() > g + h && s.panBy(o)
		}

		function x(a) {
			if (a.shiftKey)
				return q = {
					x0 : s.mouse(a)
				}, s.focusableParent().focus(), F(a)
		}

		function y(a) {
			if (!q)
				return;
			q.x1 = s.mouse(a), r.setAttribute("x", Math.min(q.x0.x, q.x1.x)), r.setAttribute("y", Math.min(q.x0.y, q.x1.y)), r.setAttribute("width", Math.abs(q.x0.x - q.x1.x)), r.setAttribute("height", Math.abs(q.x0.y - q.x1.y)), r.removeAttribute("display")
		}

		function z(a) {
			c.setAttribute("class", "compass"), q && (q.x1 && (s.extent([s.pointLocation({
				x : Math.min(q.x0.x, q.x1.x),
				y : Math.max(q.x0.y, q.x1.y)
			}), s.pointLocation({
				x : Math.max(q.x0.x, q.x1.x),
				y : Math.min(q.x0.y, q.x1.y)
			})]), r.setAttribute("display", "none")), q = null), n && (clearInterval(n), n = 0)
		}

		function A(a) {
			return function() {
				a ? this.setAttribute("class", "active") : this.removeAttribute("class"), o = a
			}
		}

		function B(a) {
			return function(b) {
				c.setAttribute("class", "compass active");
				var d = s.zoom();
				return s.zoom(a < 0 ? Math.ceil(d) - 1 : Math.floor(d) + 1), F(b)
			}
		}

		function C(a) {
			return function(b) {
				return s.zoom(a), F(b)
			}
		}

		function D() {
			this.setAttribute("class", "active")
		}

		function E() {
			this.removeAttribute("class")
		}

		function F(a) {
			return a.stopPropagation(), a.preventDefault(), !1
		}

		function G(b) {
			var c = Math.SQRT1_2 * e, d = e * .7, f = e * .2, g = a.svg("g"), h = g.appendChild(a.svg("path")), i = g.appendChild(a.svg("path"));
			return h.setAttribute("class", "direction"), h.setAttribute("pointer-events", "all"), h.setAttribute("d", "M0,0L" + c + "," + c + "A" + e + "," + e + " 0 0,1 " + -c + "," + c + "Z"), i.setAttribute("class", "chevron"), i.setAttribute("d", "M" + f + "," + (d - f) + "L0," + d + " " + -f + "," + (d - f)), i.setAttribute("pointer-events", "none"), g.addEventListener("mousedown", v, !1), g.addEventListener("mouseover", A(b), !1), g.addEventListener("mouseout", A(null), !1), g.addEventListener("dblclick", F, !1), g
		}

		function H(b) {
			var c = e * .4, d = c / 2, f = a.svg("g"), g = f.appendChild(a.svg("path")), h = f.appendChild(a.svg("path")), i = f.appendChild(a.svg("path")), j = f.appendChild(a.svg("path"));
			return g.setAttribute("class", "back"), g.setAttribute("d", "M" + -c + ",0V" + -c + "A" + c + "," + c + " 0 1,1 " + c + "," + -c + "V0Z"), h.setAttribute("class", "direction"), h.setAttribute("d", g.getAttribute("d")), i.setAttribute("class", "chevron"), i.setAttribute("d", "M" + -d + "," + -c + "H" + d + (b > 0 ? "M0," + (-c - d) + "V" + -d : "")), j.setAttribute("class", "fore"), j.setAttribute("fill", "none"), j.setAttribute("d", g.getAttribute("d")), f.addEventListener("mousedown", B(b), !1), f.addEventListener("mouseover", D, !1), f.addEventListener("mouseout", E, !1), f.addEventListener("dblclick", F, !1), f
		}

		function I(b) {
			var c = e * .2, d = e * .4, f = a.svg("g"), g = f.appendChild(a.svg("rect")), h = f.appendChild(a.svg("path"));
			return g.setAttribute("pointer-events", "all"), g.setAttribute("fill", "none"), g.setAttribute("x", -d), g.setAttribute("y", -0.75 * d), g.setAttribute("width", 2 * d), g.setAttribute("height", 1.5 * d), h.setAttribute("class", "chevron"), h.setAttribute("d", "M" + -c + ",0H" + c), f.addEventListener("mousedown", C(b), !1), f.addEventListener("dblclick", F, !1), f
		}

		function J() {
			var a = e + 6, b = a, f = s.size();
			switch(j) {
				case"top-left":
					break;
				case"top-right":
					a = f.x - a;
					break;
				case"bottom-left":
					b = f.y - b;
					break;
				case"bottom-right":
					a = f.x - a, b = f.y - b
			}
			c.setAttribute("transform", "translate(" + a + "," + b + ")"), r.setAttribute("transform", "translate(" + -a + "," + -b + ")");
			for (var g in d)g == s.zoom() ? d[g].setAttribute("class", "active") : d[g].removeAttribute("class")
		}

		function K() {
			while (c.lastChild)
			c.removeChild(c.lastChild);
			c.appendChild(r);
			if (m != "none") {
				p = c.appendChild(a.svg("g")), p.setAttribute("class", "pan");
				var b = p.appendChild(a.svg("circle"));
				b.setAttribute("class", "back"), b.setAttribute("r", e);
				var g = p.appendChild(G({
					x : 0,
					y : -f
				}));
				g.setAttribute("transform", "rotate(0)");
				var h = p.appendChild(G({
					x : f,
					y : 0
				}));
				h.setAttribute("transform", "rotate(90)");
				var i = p.appendChild(G({
					x : 0,
					y : f
				}));
				i.setAttribute("transform", "rotate(180)");
				var n = p.appendChild(G({
					x : -f,
					y : 0
				}));
				n.setAttribute("transform", "rotate(270)");
				var o = p.appendChild(a.svg("circle"));
				o.setAttribute("fill", "none"), o.setAttribute("class", "fore"), o.setAttribute("r", e)
			} else
				p = null;
			if (k != "none") {
				l = c.appendChild(a.svg("g")), l.setAttribute("class", "zoom");
				var q = -0.5;
				if (k == "big") {
					d = {};
					for (var t = s.zoomRange()[0], q = 0; t <= s.zoomRange()[1]; t++, q++)
						(d[t] = l.appendChild(I(t))).setAttribute("transform", "translate(0," + -(q + .75) * e * .4 + ")")
				}
				var u = m == "none" ? .4 : 2;
				l.setAttribute("transform", "translate(0," + e * (/^top-/.test(j) ? u + (q + .5) * .4 : -u) + ")"), l.appendChild(H(1)).setAttribute("transform", "translate(0," + -(q + .5) * e * .4 + ")"), l.appendChild(H(-1)).setAttribute("transform", "scale(-1)")
			} else
				l = null;
			J()
		}

		var b = {}, c = a.svg("g"), d = {}, e = 30, f = 16, g = 0, h = 250, i = 50, j = "top-left", k = "small", l, m = "small", n, o, p, q, r = a.svg("rect"), s, t, u;
		return c.setAttribute("class", "compass"), r.setAttribute("class", "back fore"), r.setAttribute("pointer-events", "none"), r.setAttribute("display", "none"), b.radius = function(a) {
			return arguments.length ? ( e = a, s && K(), b) : e
		}, b.speed = function(a) {
			return arguments.length ? ( f = a, b) : e
		}, b.position = function(a) {
			return arguments.length ? ( j = a, s && K(), b) : j
		}, b.pan = function(a) {
			return arguments.length ? ( m = a, s && K(), b) : m
		}, b.zoom = function(a) {
			return arguments.length ? ( k = a, s && K(), b) : k
		}, b.map = function(a) {
			if (!arguments.length)
				return s;
			s && (t.removeEventListener("mousedown", x, !1), t.removeChild(c), t = null, u.removeEventListener("mousemove", y, !1), u.removeEventListener("mouseup", z, !1), u = null, s.off("move", J).off("resize", J));
			if ( s = a)
				t = s.container(), t.appendChild(c), t.addEventListener("mousedown", x, !1), u = t.ownerDocument.defaultView, u.addEventListener("mousemove", y, !1), u.addEventListener("mouseup", z, !1), s.on("move", J).on("resize", J), K();
			return b
		}, b
	}, a.grid = function() {
		function f(b) {
			var f, g = e.firstChild, h = d.size(), i = d.pointLocation(c), j = d.pointLocation(h), k = Math.pow(2, 4 - Math.round(d.zoom()));
			i.lat = Math.floor(i.lat / k) * k, i.lon = Math.ceil(i.lon / k) * k;
			for (var l; ( l = d.locationPoint(i).x) <= h.x; i.lon += k)
				g || ( g = e.appendChild(a.svg("line"))), g.setAttribute("x1", l), g.setAttribute("x2", l), g.setAttribute("y1", 0), g.setAttribute("y2", h.y), g = g.nextSibling;
			for (var m; ( m = d.locationPoint(i).y) <= h.y; i.lat -= k)
				g || ( g = e.appendChild(a.svg("line"))), g.setAttribute("y1", m), g.setAttribute("y2", m), g.setAttribute("x1", 0), g.setAttribute("x2", h.x), g = g.nextSibling;
			while (g) {
				var n = g.nextSibling;
				e.removeChild(g), g = n
			}
		}

		var b = {}, d, e = a.svg("g");
		return e.setAttribute("class", "grid"), b.map = function(a) {
			if (!arguments.length)
				return d;
			d && (e.parentNode.removeChild(e), d.off("move", f).off("resize", f));
			if ( d = a)
				d.on("move", f).on("resize", f), d.container().appendChild(e), d.dispatch({
					type : "move"
				});
			return b
		}, b
	}, a.stylist = function() {
		function f(d) {
			var f = d.features.length, g = b.length, h = c.length, i, j, k, l, m, n, o;
			for ( n = 0; n < f; ++n) {
				if (!( k = ( i = d.features[n]).element))
					continue;
				j = i.data;
				for ( o = 0; o < g; ++o)
					m = ( l = b[o]).value, typeof m == "function" && ( m = m.call(null, j)), m == null ? l.name.local ? k.removeAttributeNS(l.name.space, l.name.local) : k.removeAttribute(l.name) : l.name.local ? k.setAttributeNS(l.name.space, l.name.local, m) : k.setAttribute(l.name, m);
				for ( o = 0; o < h; ++o)
					m = ( l = c[o]).value, typeof m == "function" && ( m = m.call(null, j)), m == null ? k.style.removeProperty(l.name) : k.style.setProperty(l.name, m, l.priority);
				if ( m = e) {
					typeof m == "function" && ( m = m.call(null, j));
					while (k.lastChild)
					k.removeChild(k.lastChild);
					m != null && k.appendChild(a.svg("title")).appendChild(document.createTextNode(m))
				}
			}
		}

		var b = [], c = [], e;
		return f.attr = function(a, c) {
			return b.push({
				name : d(a),
				value : c
			}), f
		}, f.style = function(a, b, d) {
			return c.push({
				name : a,
				value : b,
				priority : arguments.length < 3 ? null : d
			}), f
		}, f.title = function(a) {
			return e = a, f
		}, f
	}
}(org.polymaps);
var arc = function(a) {
	return d3.svg.arc().startAngle(function(b) {
		return (b.d - a.width) * Math.PI / 180
	}).endAngle(function(b) {
		return (b.d + a.width) * Math.PI / 180
	}).innerRadius(a.from).outerRadius(function(b) {
		return a.to(b)
	})
}, speedToColorScale = d3.scale.linear().domain([5, 25]).range(["hsl(220, 70%, 90%)", "hsl(220, 70%, 30%)"]).interpolate(d3.interpolateHsl), probabilityToColorScale = d3.scale.linear().domain([0, .2]).range(["hsl(0, 70%, 99%)", "hsl(0, 70%, 40%)"]).interpolate(d3.interpolateHsl), visWidth = 200, probabilityToRadiusScale = d3.scale.linear().domain([0, .15]).range([34, visWidth - 20]).clamp(!0), speedToRadiusScale = d3.scale.linear().domain([0, 20]).range([34, visWidth - 20]).clamp(!0), windroseArcOptions = {
	width : 5,
	from : 34,
	to : probabilityToRadius
}, windspeedArcOptions = {
	width : 5,
	from : 34,
	to : speedToRadius
}, smallArcScale = d3.scale.linear().domain([0, .15]).range([5, 30]).clamp(!0), smallArcOptions = {
	width : 15,
	from : 5,
	to : function(a) {
		return smallArcScale(a.p)
	}
}, stationDb = null, map = null, po = typeof org != "undefined" ? org.polymaps : null, selectedMonthControl = null
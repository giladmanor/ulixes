var Ulixes = function(server, auth, dataHandler) {

	this.open = function(uid) {
		self.auth.uuid = uid;
		self.get(self.auth);
	};

	this.get = function(d) {
		send("get", d || {});
	};

	this.set = function(code, value) {
		send("set", {
			code : code,
			value : value,
			with_info : true
		});
	};

	this.read = function(id) {
		send("read", {
			id : id,
			with_info : true
		});
	};
	
	this.set_response = function(formDOM){
		var valuesToSubmit = formToObject(formDOM);
		$.extend(valuesToSubmit, {with_info : true});
		console.log("CTS>>>" );
		send("cta", valuesToSubmit);
		console.log("<<<CTS" );
		
	};
	
	var formToObject = function(formDom){
		var o = {};
	    var a = formDom.serializeArray();
	    $.each(a, function() {
	        if (o[this.name] !== undefined) {
	            if (!o[this.name].push) {
	                o[this.name] = [o[this.name]];
	            }
	            o[this.name].push(this.value || '');
	        } else {
	            o[this.name] = this.value || '';
	        }
	    });
	    return o;
	};

	var send = function(action, data) {
		$.extend(data, self.auth);
		$.ajax({
			type : "POST",
			dataType : "jsonp",
			url : self.server + "api/" + action,
			data : data,
			success : function(data) {
				self.dataHandler(data, self.server);
			}
		});
	};
	
	var defaultDataHandler = function(data) {

		function plotBadges(data) {
			//clean badges
			$(".ulixes-badge").each(function() {
				$(this).text("");
			});
			data.badges.map(function(k) {
				$(".ulixes-badge-" + k.placeholder).append("<img height='40' width='40' src='http://bozz.wikibrains.com/" + k.icon + "' title='" + k.name + "'>");
			});
		}

		function plotScores(data) {
			data.scores.map(function(k) {
				$(".ulixes-score-card" + k.code).text(k.value);
			});
		}

		function message(id, data) {
			return '<li class="list-group"><a href="#" style="float:right" onclick="ulixes.read(' + id + ');return false;">X</a>' 
			+ '<p class="list-group-item-text">' + data.message 
			+ '</p></li>';
		}

		function plotNotifications(data) {
			$('.ulixes-announcements').text("");
			$('.ulixes-announcements-count').text(data.announcements ? data.announcements.length : 0);
			data.announcements.map(function(k) {
				$('.ulixes-announcements').append(message(k.id, k.data));
			});
			if (data.announcements.length == 0) {
				$('.ulixesNotifications').hide();
			}else{
				$('.ulixesNotifications').show();
			}
		}

		//console.log("defaultDataHandler");
		plotBadges(data);
		plotScores(data);
		plotNotifications(data);
	};

	// INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT INIT
	var self = this;
	this.auth = auth;
	this.server = server;

	if (( typeof dataHandler === "undefined") || !dataHandler) {
		this.dataHandler = defaultDataHandler;
	} else {
		this.dataHandler = dataHandler;
	}

};


var GraphController = function(options) {
	this.options = {
		links : [],

	};
	this.options = options;

	this.setEntryPoint = function(formDOM) {
		send(formDOM,function(d){});
	};

	this.listEntryPoints = function() {

	};
	
	this.openNodeForm = function(node){
		get(node.id,function(d){
			nodeFormDOM.toggle('fast');
		});
	};
	
	this.openEdgeForm = function(edge){
		get(edge.id,function(d){
			linkFormDOM.toggle('fast');
		});
	};
	
	var get = function(entity,id,successFunction) {
		var valuesToSubmit = formDOM.serialize();
		$.ajax({
			url : formDOM.attr('action'), //sumbits it to the given url of the form
			data : valuesToSubmit,
			dataType : "JSON" // you want a difference between normal and ajax-calls, and json is standard
		}).success(function(json) {
			successFunction(json);
		});
	};

	var send = function(formDOM,successFunction) {
		var valuesToSubmit = formDOM.serialize();
		$.ajax({
			url : formDOM.attr('action'), //sumbits it to the given url of the form
			data : valuesToSubmit,
			dataType : "JSON" // you want a difference between normal and ajax-calls, and json is standard
		}).success(function(json) {
			successFunction(json);
		});
	};

};

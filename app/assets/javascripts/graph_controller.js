var GraphController = function(options) {
	var graph;
	var self = this;
	
	this.options = {
		links : [],

	};
	this.options = options;

	this.setEntryPoint = function(formDOMO) {
		formDOMO.attr('action',"/graph/set_node");
		send(formDOMO,function(d){
			console.log("this just happend", d);
			refreshGraph(d);
		}, "JSON");
	};
	
	this.setEdge = function(formDOMO) {
		formDOMO.attr('action',"/graph/set_edge");
		send(formDOMO,function(d){
			console.log("this just happend", d);
			refreshGraph(d);
		}, "JSON");
	};

	this.listEntryPoints = function() {

	};
	
	this.openNodeForm = function(node){
		get("node",node,function(d){
			openForm("node",d);
		});
	};
	
	this.openEdgeForm = function(edge){
		get("edge",edge,function(d){
			openForm("edge",d);
		});
	};
	
	this.saveRule = function(formDOMO){
		console.log("saveRule");
		formDOMO.attr('action',"/graph/set_rule");
		send(formDOMO,function(d){
			console.log("saveRule this just happend", d);
			openForm("node",d);
		}, "html");
	};
	
	this.saveCode = function(formDOMO){
		formDOMO.attr('action',"/graph/set_code");
		send(formDOMO,function(d){
			console.log("this just happend", d);
		}, "html");
	};
	
	this.renameOrSubmitLabel = function(chxbDOMO, smDOMO){
		if(chxbDOMO.is(':checked')){
			smDOMO.removeClass("btn-default");
			smDOMO.addClass("btn-danger");
			smDOMO.text("Delete?");
		}else{
			smDOMO.removeClass("btn-danger");
			smDOMO.addClass("btn-default");
			smDOMO.text("Rename");
		}
	};
	
	////////////////////////////////////////////////////////////
	var refreshGraph = function(data){
		$('.graph-goes-here').html("");
		console.log(this);
		graph = new Graph(data.nodes,data.links,self.openNodeForm,self.openEdgeForm);
	};
	
	var get = function(entity,data,successFunction) {
		$.ajax({
			url : "/graph/get_"+entity,
			data : data
			//dataType : "JSON" // you want a difference between normal and ajax-calls, and json is standard
		}).success(function(json) {
			successFunction(json);
		});
	};

	var send = function(formDOM,successFunction, dataType) {
		var valuesToSubmit = formDOM.serialize();
		$.ajax({
			url : formDOM.attr('action'), //sumbits it to the given url of the form
			data : valuesToSubmit,
			dataType : dataType || "JSON" // you want a difference between normal and ajax-calls, and json is standard
		}).success(function(json) {
			successFunction(json);
		});
	};

	graph = new Graph(options.nodes,options.links,this.openNodeForm,this.openEdgeForm);
};

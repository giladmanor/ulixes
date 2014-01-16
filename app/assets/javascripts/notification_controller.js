var NotificationController = function(options) {
	var self = this;
	
	this.options = options;

	this.checkName = function(id, name){
		get("check_name",{id:id,name:name},function(d){
			if(d.valid){
				$("#notificationNameInput").addClass("has-success");
			}else{
				$("#notificationNameInput").addClass("has-error");
			}
		});
	};
	
	
	////////////////////////////////////////////////////////////
	
	var get = function(action,data,successFunction) {
		$.ajax({
			url : "/notification/"+action,
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
};

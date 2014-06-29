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
	
	
	this.messageContentForm = function(formDOMO){
		formDOMO.attr('action',"/notification/get_message_content_form");
		send(formDOMO,function(d){
			$("#messageFormatHolder").html(d);
		}, "html");
	};
	
	this.removeLanguage = function(formDOMO,index){
		formDOMO.attr('action',"/notification/get_message_content_form");
		var input = $("<input>").attr("type", "hidden").attr("name", "remove_index").val(index);
		formDOMO.append($(input));
		send(formDOMO,function(d){
			$("#messageFormatHolder").html(d);
		}, "html");
	};
	
	this.save = function(formDOMO){
		formDOMO.attr('action',"/set/notification");
		formDOMO.submit();
	};
	
	this.cancel = function(){
		window.location = "/list/Notification";
	};
	
	this.showPreview = function(q) {
		$('#previewBox').modal('show');
		console.log("preview: ",q);
		$('#previewContent').html(q);
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
		console.log("SEND::: ",valuesToSubmit);
		$.ajax({
			url : formDOM.attr('action'), //sumbits it to the given url of the form
			data : valuesToSubmit,
			dataType : dataType || "JSON" // you want a difference between normal and ajax-calls, and json is standard
		}).success(function(json) {
			successFunction(json);
		});
	};
};

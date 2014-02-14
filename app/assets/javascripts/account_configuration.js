var AccountConfiguration = {
	generate_key : function(domObj,len) {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";

		for (var i = 0; i < len; i++){
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
			
			
		$(domObj).val(text);
	},
	ulixes_tracker : function() {
		$.ajax({
			url : "/admin/get_client_tracker",
			data : {},
			dataType : "text" // you want a difference between normal and ajax-calls, and json is standard
		}).success(function(res) {
			$('#code_generator_result').text(res);
		});
	},
	ulixes_conf : function() {
		$('#code_generator_result').text("ulixes_conf Not Ready Yet");
	},
	ulixes_client : function() {
		$('#code_generator_result').text("ulixes_client Not Ready Yet");
	}
};

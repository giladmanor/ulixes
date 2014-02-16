var AccountCreator = {
	validate_login : function(login) {
		$.ajax({
			url : "/admin/is_login_unique",
			data : {login:login},
			dataType : "json" // you want a difference between normal and ajax-calls, and json is standard
		}).success(function(res) {
			if(res.unique){
				$("#login_name").addClass("has-error");
			}else{
				$("#login_name").removeClass("has-error");
			}
		});
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

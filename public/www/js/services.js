var service = {
	server:"http://10.0.0.5",
	post : function(action, data, onSuccess) {
		$.ajax({
			type : "POST",
			url : service.server + action,
			crossDomain : true,
			data : data,
			success : onSuccess,
			error : function(e) {
				alert('Something went wrong!');
				console.log(e);
			}
		});
	},
	getMenu:function(){
		service.post("/json/menu",{},function(d){
			
			console.log(d);
		});
	},
	login:function(){
		service.post("/json/login",{login:"a",password:"a"},function(d){
			
			console.log(d);
		});
	},
};

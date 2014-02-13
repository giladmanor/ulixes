var AccountConfiguration = {
	generate_key : function(domObj,len) {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";

		for (var i = 0; i < len; i++){
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
			
			
		$(domObj).val(text);
	},
	uri : function(url) {
		if (url.indexOf("dbpedia.org") != -1) {
			return url.replace("/resource/", "/data/") + ".json";
		} else {
			return url;
		}
	}
};

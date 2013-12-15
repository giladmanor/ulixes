var makeRule = function(domObj, condition_obj) {
	var mapKeyArray = function(a) {
		res = [];
		console.log("XXX", a);
		$.each(a, function(key, value) {
			res.push(key);
		});
		return res;
	};

	var getNextList = function(line, condition_obj) {
		var next_item = [];
		console.log("LINE::::", line);
		console.log("--------------------------------------");
		path = condition_obj;
		for (var item in line) {
			console.log("item<<", line[item]);
			console.log("path<<", path);
			path = path[line[item]] || [];
		}
		console.log("path::::", path);
		next_item = path;

		if (!$.isArray(next_item)) {
			console.log("choose::: ", next_item, "by", line[line.length - 1]);
			next_item = mapKeyArray(path);
		}

		console.log("--------------------------------------");
		return next_item;
	};

	var reline = function(domObj, condition_obj) {
		domObj.tagit({
			availableTags : getNextList(domObj.tagit("assignedTags"), condition_obj)
		});
	};
	
	domObj.tagit({

		// Options
		//fieldName : "skills",
		availableTags : mapKeyArray(condition_obj),
		autocomplete : {
			delay : 0,
			minLength : 0
		},
		showAutocompleteOnFocus : true,
		removeConfirmation : false,
		caseSensitive : true,
		allowDuplicates : false,
		allowSpaces : false,
		readOnly : false,
		tagLimit : null,
		singleField : false,
		singleFieldDelimiter : ',',
		singleFieldNode : null,
		tabIndex : null,
		placeholderText : null,

		// Events
		beforeTagAdded : function(event, ui) {

		},
		afterTagAdded : function(event, ui) {
			reline(domObj, condition_obj);
		},
		beforeTagRemoved : function(event, ui) {
			reline(domObj, condition_obj);
		},
		onTagExists : function(event, ui) {
			console.log(4, ui.tag);
		},
		onTagClicked : function(event, ui) {
			console.log(5, ui.tag);
		},
		onTagLimitExceeded : function(event, ui) {
			console.log(6, ui.tag);
		}
	});
};

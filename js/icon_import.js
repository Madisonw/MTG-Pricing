


var set_data = {};
couch.setDatabase("sets");
couch.get({
	url : "/_design/search/_view/by_name",
	includeDocs : true,
	callback : function(resp) {
		$(resp.body.rows).each(function() {
			set_data[this.key] = this.value
		})
		var sc = $("#search_container")
		for (set in set_data) {
			$(sc).append(
				$("<img />",{src:set_data[set].imgURL,alt:set+", "+set_data[set].longname}),
				$("<br />")
			)
		}
	}
})


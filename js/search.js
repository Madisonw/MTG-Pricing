
(function($) {
	couch.setDatabase("cards");
	var searchbox = $("#MTG-pricing-search"),
		search_results = $("#search_results"),
		val,params,html;
	function render_results(results) {
		var oResult;
		$(search_results).empty();
		
		$(results).each(function() {
			oResult = $("<div />",{
				card_id : this._id,
				text : this.key
			})
			$(search_results).append(oResult);
		});
	}
	$(searchbox).keyup(function() {
		val = $(this).val();
		if (!val.length) {
			render_results([]);
			return false;
		}
		params = "?startkey=\""+val+"\"&endkey=\""+val+"\ufff0\"&limit=8";
		
		couch.get({
			url : "/_design/search/_view/by_name"+params,
			includeDocs : true,
			callback : function(resp) {
				render_results(resp.body.rows);
			}
		});
	})
}(jQuery))




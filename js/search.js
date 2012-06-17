
(function($) {
	couch.setDatabase("cards");
	var searchbox = $("#MTG-pricing-search"),
		search_results = $("#search_results"),
		pricing_container = $("#pricing_results"),
		set_data={},val,params;
	function render_search_results(results) {
		var oResult;
		$(search_results).empty().show();
		$(pricing_container).hide();
		$(results).each(function() {
			oResult = $("<div />",{
				text : this.key
			})
			
			$(search_results).append(oResult);
			$(oResult).data("id",this.id);
		});
	}
	function mana(symbol) {
		var subc = (symbol!=="X" && isNaN(parseInt(symbol,10)))?symbol:"num";
		return $("<span />",{
			"class" : "mana "+subc,
			"text" : (subc==="num")?symbol:""
		})
	}
	function render_card_data(card) {
		console.log(card);
		$(search_results).hide();
		$(pricing_container).empty().show()
		.append($("<h2 />",{text:card.name+" ("+card.manacost+")"}));
		
		for (set in card.sets) {
			$(pricing_container).append(
				$("<div />",{"class":"set"}).append(
					$("<img />",{src:set_data[set].imgURL,alt:set}),
					$("<span />",{text:set_data[set].longname}),
					$("<span />",{text:"$1.00","class":"pricing"})
					
				)
			)
		}
	}
	couch.setDatabase("sets");
	couch.get({
		url : "/_design/search/_view/by_name",
		includeDocs : true,
		callback : function(resp) {
			$(resp.body.rows).each(function() {
				set_data[this.key] = this.value
			})
		}
	})
	couch.setDatabase("cards");
	$(searchbox).keyup(function() {
		val = $(this).val();
		if (!val.length) {
			render_search_results([]);
			return false;
		}
		params = "?startkey=\""+val+"\"&endkey=\""+val+"\ufff0\"&limit=8";
		
		couch.get({
			url : "/_design/search/_view/by_name"+params,
			includeDocs : true,
			callback : function(resp) {
				render_search_results(resp.body.rows);
			}
		});
	}).focus();
	
	$(search_results).click(function(event) {
		var selected_id = $(event.target).data("id"),
			card;
		couch.get({
			url : "/"+selected_id,
			callback : function(resp) {
				card = resp.body;
				render_card_data(card);
			}
		})
	})
}(jQuery))




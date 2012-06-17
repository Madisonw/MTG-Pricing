
$.ajax({
	type : "get",
	url : "js/cards.xml",
	dataType : "xml",
	success : push_into_db
});
couch.setDatabase("cards");
function push_into_db(xml) {
	var xml_sets = $(xml).find("sets set");
	var xml_cards = $(xml).find("cards card");
	
	var set_objs = [];
	var card_objs = [];
	var oChildren,
		oObj;
	$(xml_sets).each(function() {
		oChildren = $(this).children();
		oObj = {};
		$(oChildren).each(function() {
			oObj[$(this)[0].tagName] = $(this).text();
		})
		set_objs.push(oObj);
	})
	$(xml_cards).each(function() {
		oChildren = $(this).children();
		oObj = {};
		$(oChildren).each(function() {
			if ($(this)[0].tagName!=="set") {
				oObj[$(this)[0].tagName] = $(this).text();
			}
		})
		oObj.sets = {};
		$($(this).find("set")).each(function() {
			oObj.sets[$(this).text()] = $(this).attr("picURL");
		})
		card_objs.push(oObj);
	})
	var it_obj = card_objs;
	var index = 0, entry;
	function push_data() {
		entry = it_obj[index];
		if (!entry) {
			console.log(entry,index);
			return false;
		}
		index++;
		couch.post({
			data : entry
		})
		setTimeout(push_data,10);
	}
	//push_data();
}


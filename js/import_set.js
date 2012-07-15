$.ajax({
	type : "get",
	url : "js/cards.xml",
	dataType : "xml",
	success : find_set_cards
});
couch.setDatabase("cards");
var target_set = "M13"
function find_set_cards(xml) {
	var xml_cards = $(xml).find("cards card"), card_objs = [];
	var cards_in_db = {};
	$(xml_cards).each(function() {
		oObj = {};
		oObj.sets = {};
		$($(this).find("set")).each(function() {
			oSet = $(this).text()
			oObj.sets[$(this).text()] = $(this).attr("picURL");
		})
		oChildren = $(this).children();
		$(oChildren).each(function() {
			if ($(this)[0].tagName !== "set") {
				oObj[$(this)[0].tagName] = $(this).text();
			}
		})
		if (oObj.sets[target_set]) {
			card_objs.push(oObj);
		}
	})
	var card_index = 0;
	var reprints = [];
	var new_cards = [];

	function is_card_in_db() {
		var card = card_objs[card_index];
		if (!card) {
			//console.log(reprints);
			handle_reprints(reprints, new_cards);
			return true;
		}
		couch.get({
			url : '/_design/search/_view/by_name?startkey="' + card.name + '"&endkey="' + card.name + '\ufff0"&limit=1',
			callback : function(resp, success) {
				var oCard;
				if (resp.body.rows.length) {
					oCard = resp.body.rows[0];
					reprints.push({
						id : oCard.id,
						picURL : card.sets[target_set]
					})
				} else {
					new_cards.push(card);
				}
				card_index++;
				setTimeout(is_card_in_db, 1);
			}
		});
	}

	is_card_in_db()

}

function handle_reprints(reprints, new_cards) {
	var card_docs = [];
	var card_index = 0;
	function get_card() {
		var card = reprints[card_index];
		if (!card) {
			insert_docs(card_docs, new_cards);
			return true;
		}
		couch.get({
			url : '/' + card.id,
			callback : function(resp, success) {
				var oCard = resp.body;
				oCard.sets[target_set] = card.picURL
				card_docs.push(oCard);
				card_index++;
				setTimeout(get_card, 1);
			}
		});
	}

	get_card();
}

function insert_docs(existingDocs, newDocs) {

	var all_docs = existingDocs.concat(newDocs);
	var card_index = 0;
	function push_card() {
		var card = all_docs[card_index];
		if (!card) {
			alert("all done importing " + target_set + " cards.");
			return false;
		}
		function callback() {
			card_index++;
			setTimeout(push_card,1);
		}
		function edit_doc(doc) {
			couch.put({
				id : doc._id,
				data : doc,
				callback : callback
			});
		}

		function insert_doc(doc) {
			couch.post({
				data: doc,
				callback: callback
			});
		}

		if (card._id) {
			edit_doc(card);
		} else {
			insert_doc(card);
		}
	}
	push_card();
}


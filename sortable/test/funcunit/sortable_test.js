module("phui/sortable", { 
	setup: function(){
        S.open("//phui/sortable/sortable.html");
	}
})

test("adding an item", function(){
	S("#drag").dragTo(".sortable:eq(1)").dragTo("#away");
	
	$(".sortable:eq(1)").text(function(text){
		ok(/SOMETHING ELSE/.test(text), "Something else in page")
	})
})

module("phui/sortable", { 
	setup: function(){
        S.open("//phui/sortable/sortable.html");
	}
})

test("adding an item", function(){
	S("#drag").dragTo(".sortable:eq(1)").dragTo("#away");
	
	S(".sortable:eq(1)").text(function(text){
		ok(/SOMETHING ELSE/.test(text), "Something else in page")
	})
})
test("moving items", function(){
	S(".sortable:eq(0)").dragTo(".sortable:eq(2)");
	//make sure it's in a new order
	S(".sortable:eq(0)").text(function(text){
		ok(/Second/.test(text), "Second is first")
	})
	S(".sortable:eq(1)").text(function(text){
		ok(/First/.test(text), "First is second")
	})
	S(".sortable:eq(2)").text(function(text){
		ok(/Third/.test(text), "Third stays the same")
	})
})

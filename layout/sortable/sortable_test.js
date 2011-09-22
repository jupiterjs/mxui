steal('funcunit').then(function(){
module("mxui/sortable", { 
	setup: function(){
        S.open("//mxui/layout/sortable/sortable.html");
	}
})

test("adding an item", function(){
	S("#drag")
		.drag(".sortable:eq(1)")
		.drag("#away", function(){
			ok(/SOMETHING ELSE/.test( S(".sortable:eq(2)").text() ) )
		});

})
test("moving items", function(){
	
	S(".sortable:eq(0)").drag(".sortable:eq(1)", function(){
		ok(/Second/.test(S(".sortable:eq(0)").text()), "Second is first")
		
		ok(/First/.test(S(".sortable:eq(1)").text()), "First is second")
		
		ok(/Third/.test(S(".sortable:eq(2)").text()), "Third stays the same")
	});


});
})

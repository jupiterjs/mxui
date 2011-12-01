steal('funcunit').then(function(){
module("mxui/sortable", { 
	setup: function(){
        S.open("//mxui/layout/sortable/sortable.html");
	}
})

test("adding an item (horizontal)", function(){
	S("#drag")
		.drag(".sortable:eq(1)")
		.drag("#away", function(){
			ok(/SOMETHING ELSE/.test( S(".sortable:eq(2)").text() ) )
		});

})

test("moving items (horizontal)", function(){
	S(".sortable:eq(0)").drag(".sortable:eq(1)", function(){
		ok(/Second/.test(S(".sortable:eq(0)").text()), "Second is first")
		ok(/First/.test(S(".sortable:eq(1)").text()), "First is second")
		ok(/Third/.test(S(".sortable:eq(2)").text()), "Third stays the same")
	});
});

test("adding a group of items", function(){
	S("#groupDrag")
		.drag("#sortable2 .sortable:eq(1)")
		.drag("#away", function(){
			ok(/GROUP DRAG PARENT/.test( S("#sortable2 .sortable:eq(2)").text() ) )
			ok(/GROUP CHILD 1/.test( S("#sortable2 .sortable:eq(3)").text() ) )
			ok(/GROUP CHILD 2/.test( S("#sortable2 .sortable:eq(4)").text() ) )
		});
});


test("adding an item (vertical)", function(){
	S("#vertDrag")
		.drag("#sortable3 .sortable:eq(1)")
		.drag("#away", function(){
			ok(/GO VERTICAL/.test( S("#sortable3 .sortable:eq(2)").text() ) )
		});
})

test("moving items (vertical)", function(){
	S("#sortable3 .sortable:eq(0)").drag("#sortable3 .sortable:eq(1)", function(){
		ok(/Second/.test(S("#sortable3 .sortable:eq(0)").text()), "Second is first")
		ok(/First/.test(S("#sortable3 .sortable:eq(1)").text()), "First is second")
		ok(/Third/.test(S("#sortable3 .sortable:eq(2)").text()), "Third stays the same")
	});
});

})

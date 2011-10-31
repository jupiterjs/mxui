steal.plugins("funcunit/qunit",'jquery/dom/fixture','mxutil/rpc').then(function(){

	module("rpchub")
	test("rpchub works", function(){
		stop(3000)
		$.rpc("Event.findAll",{thing: 5},function(events){
			
			ok(events.length,"we got events")
			setTimeout(function(){start()},1000) //lets do the next test in a second
		}, null,
		"//mxutil/rpc/fixtures/Event.findAll.json")
		setTimeout(function(){
			$.rpc("Event.findOne",{thing: 5},function(event){
				ok(event.id,"only 1 thing");
				equals($.rpc.numberOfRequests,1, "right number of requests made");
			}, null,
			"//mxutil/rpc/fixtures/Event.findOne.json")
		},3)
		
		
	})
	
	test("rpchub works twice", function(){
		stop(1000)
		$.rpc("Event.findAll",{thing: 5},function(events){
			start();
			ok(events.length,"we got events")
	
		}, null,
		"//mxutil/rpc/fixtures/Event.findAll.json")
		setTimeout(function(){
			$.rpc("Event.findOne",{thing: 5},function(event){
				ok(event.id,"only 1 thing");
				equals($.rpc.numberOfRequests,2,"right number of requests");
			}, null,
			"//mxutil/rpc/fixtures/Event.findOne.json")
		},3)
		
		
	})

});

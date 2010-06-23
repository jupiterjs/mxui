module("phui/grid", { 
	setup: function(){
        S.open("//phui/grid.html");
		S(".resource_1").exists();
	}
})

test("sorting", function(){
	S(".users_count-column-header a").exists().click();
	S.wait(20)
	S(".body tr:eq(5)").exists();
	
	var order = []
	S('.body tr:eq(0) td:eq(4)').text(function(text){
		order.push(parseInt(text))
	})
	S('.body tr:eq(4) td:eq(4)').text(function(text){
		order.push(parseInt(text))
	})
	S('.body tr:eq(8) td:eq(4)').text(function(text){
		order.push(parseInt(text))
		
		var sorted = order.sort();
		
		same(order, sorted, "they seem sorted");
		order = [];
	})
	
	S(".users_count-column-header a").click();
	S.wait(20)
	S(".body tr:eq(5)").exists();
	
	S('.body tr:eq(0) td:eq(4)').text(function(text){
		order.push(parseInt(text))
	})
	S('.body tr:eq(4) td:eq(4)').text(function(text){
		order.push(parseInt(text))
	})
	S('.body tr:eq(8) td:eq(4)').text(function(text){
		order.push(parseInt(text))
		
		var sorted = order.sort().reverse();
		
		same(order, sorted, "they seem reversed");
	})
	
})

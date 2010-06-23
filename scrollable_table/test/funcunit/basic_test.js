module("scrollable_table test", { 
	setup: function(){
        S.open("//phui/scrollable_table/scrollable_table.html");
	}
})

test("Copy Test", function(){
	S("h1").text(function(val){
		equals(val, "Welcome to JavaScriptMVC 3.0!","welcome text");
	})
})
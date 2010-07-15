module("resizer test", { 
	setup: function(){
        S.open("//phui/resizer/resizer.html");
	}
})

test("Copy Test", function(){
	S("h1").text(function(val){
		equals(val, "Welcome to JavaScriptMVC 3.0!","welcome text");
	})
})
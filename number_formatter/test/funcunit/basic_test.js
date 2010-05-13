module("number_formatter test", { 
	setup: function(){
        S.open("//phui/number_formatter/number_formatter.html");
	}
})

test("Copy Test", function(){
	S("h1").text(function(val){
		equals(val, "Welcome to JavaScriptMVC 3.0!","welcome text");
	})
})
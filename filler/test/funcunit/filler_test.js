module("filler")


test("filler testing works", function(){

        S.open("file:/C:/Users/Jupiter/development/callcenter/phui/filler/filler.html");
		S.wait(10, function(){
			ok(true, "things working");
		})

})
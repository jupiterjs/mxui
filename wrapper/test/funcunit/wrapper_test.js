module("wrapper")


test("wrapper testing works", function(){

        S.open("file:/C:/Users/Jupiter/development/callcenter/phui/wrapper/wrapper.html");
		S.wait(10, function(){
			ok(true, "things working");
		})

})
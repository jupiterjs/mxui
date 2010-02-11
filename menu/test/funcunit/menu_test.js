module("menu")


test("menu testing works", function(){

        S.open("file:/C:/Development/steal/jupiter/menu/menu.html");
		S.wait(10, function(){
			ok(true, "things working");
		})

})
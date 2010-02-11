module("navigation")


test("navigation testing works", function(){

        S.open("file:/c:/Development/steal/jupiter/navigation/navigation.html");
		S.wait(10, function(){
			ok(true, "things working");
		})

})
module("navigation")


test("navigation testing works", function(){

        S.open("file:/c:/Development/jmvc/jupiter/navigation/navigation.html");
		S.wait(10, function(){
			ok(true, "things working");
		})

})
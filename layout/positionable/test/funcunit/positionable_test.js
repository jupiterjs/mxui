module("positionable")


test("positionable testing works", function(){

        S.open("file:/C:/Development/steal/jupiter/positionable/positionable.html");
		S.wait(10, function(){
			ok(true, "things working");
		})

})
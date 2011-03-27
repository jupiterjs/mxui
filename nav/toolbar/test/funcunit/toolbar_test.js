module("toolbar")


test("toolbar testing works", function(){

        S.open("file:/C:/Development/steal/toolbar/toolbar.html");
		S.wait(10, function(){
			ok(true, "things working");
		})

})
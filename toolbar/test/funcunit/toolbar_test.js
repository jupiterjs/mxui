module("toolbar")


test("toolbar testing works", function(){

        S.open("file:/C:/Development/jmvc/toolbar/toolbar.html");
		S.wait(10, function(){
			ok(true, "things working");
		})

})
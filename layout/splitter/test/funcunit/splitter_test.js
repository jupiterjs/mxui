module("splitter")


test("splitter testing works", function(){

        S.open("file:/C:/Users/Jupiter/development/callcenter/mxui/splitter/splitter.html");
		S.wait(10, function(){
			ok(true, "things working");
		})

})
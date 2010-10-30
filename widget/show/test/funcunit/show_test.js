module("show")


test("show testing works", function(){

        S.open("file:/C:/Users/Jupiter/development/callcenter/mxui/widget/show/show.html");
		S.wait(10, function(){
			ok(true, "things working");
		})

})
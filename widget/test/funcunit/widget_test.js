module("widget")


test("widget testing works", function(){

        S.open("file:/C:/Users/Jupiter/development/callcenter/phui/widget/widget.html");
		S.wait(10, function(){
			ok(true, "things working");
		})

})
module("textbox")


test("textbox testing works", function(){

        S.open("file:/C:/Users/Jupiter/development/callcenter/phui/widget/textbox/textbox.html");
		S.wait(10, function(){
			ok(true, "things working");
		})

})
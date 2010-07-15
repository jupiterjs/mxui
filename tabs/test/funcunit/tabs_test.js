module("tabs")


test("tabs testing works", function(){

        S.open("file:/c:/Users/Jupiter/development/framework/phui/tabs/tabs.html");
		S.wait(10, function(){
			ok(true, "things working");
		})

})
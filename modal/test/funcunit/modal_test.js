module("modal")


test("modal testing works", function(){

        S.open("file:/C:/Users/Jupiter/development/framework/phui/modal/modal.html");
		S.wait(10, function(){
			ok(true, "things working");
		})

})
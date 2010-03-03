module("block")


test("block testing works", function(){

        S.open("file:/C:/Users/Jupiter/development/framework/phui/block/block.html");
		S.wait(10, function(){
			ok(true, "things working");
		})

})
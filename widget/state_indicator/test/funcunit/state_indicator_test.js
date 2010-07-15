module("state_indicator")


test("state_indicator testing works", function(){

        S.open("file:/D:/Work/pinhooklabs/clients/cashnet/gitrepo/phui/widget/state_indicator/state_indicator.html");
		S.wait(10, function(){
			ok(true, "things working");
		})

})
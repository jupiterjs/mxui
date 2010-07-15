module("dropdown")


test("dropdown testing works", function(){

        S.open("file:/D:/Work/pinhooklabs/clients/cashnet/gitrepo/phui/widget/dropdown/dropdown.html");
		S.wait(10, function(){
			ok(true, "things working");
		})

})
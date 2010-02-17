module("form")


test("form testing works", function(){

        S.open("file:/D:/Work/pinhooklabs/clients/cashnet/gitrepo/phui/form/form.html");
		S.wait(10, function(){
			ok(true, "things working");
		})

})
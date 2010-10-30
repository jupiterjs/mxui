module("textarea")


test("textarea testing works", function(){

        S.open("file:/D:/Work/pinhooklabs/clients/cashnet/gitrepo/mxui/widget/textarea/textarea.html");
		S.wait(10, function(){
			ok(true, "things working");
		})

})
module("group_editable")


test("group_editable testing works", function(){

        S.open("file:/D:/Work/pinhooklabs/clients/cashnet/gitrepo/phui/widget/group_editable/group_editable.html");
		S.wait(10, function(){
			ok(true, "things working");
		})

})
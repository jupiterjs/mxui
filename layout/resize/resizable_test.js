steal.plugins('funcunit').then(function(){

module("resize",{
	setup : function(){
		S.open("//mxui/resize/resize.html");
	}
})


test("resizable testing works", function(){

        
	S.wait(10, function(){
		ok(true, "things working");
	})

});

})
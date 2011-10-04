steal('funcunit').then(function(){

module("Mxui.Data.Tree", { 
	setup: function(){
		S.open("//mxui/data/tree/tree.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Mxui.Data.Tree Demo","demo text");
});


});
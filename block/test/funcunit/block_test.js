module("phui/block test",{ 
	setup: function(){
        S.open("//phui/block/block.html");
		S("#blocker").exists();
	}
})

test("Block Test", function(){
    
	S("#blocker").exists();
	S("#blocker").width( function(width) {
		ok(/0/.test(width), "Initial blocker width is correct.") 
	} );
	S("#blocker").width( function(height) {
		ok(/0/.test(height), "Initial blocker height is correct.") 
	} );
	
	S("#block").click()
	
	S("#blocker").waitOffset( function(offset) {
		return (offset.left == 0 && offset.top == 0)
	} );
	var winWidth, 
		winHeight
	S(S.window).width(function(w){
		winWidth = w;
	})
	S(S.window).height(function(h){
		winHeight = h;
	})
	
    S("#blocker").width( function(w){
		equals(w, winWidth,"width is correct")
	});
	S("#blocker").height( function(h){
		equals(h, winHeight,"height is correct")
	});
	S("#blocker").css( "zIndex", function(zIndex) {
		equals(zIndex,  9999, "zIndex is high")
	} );	

})
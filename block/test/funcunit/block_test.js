module("phui/block test",{ 
	setup: function(){
        S.open("//phui/block/block.html");
		S("#blocker").exists();
	}
})

test("Block Test", function(){
    
	S('#text').exists();
	S('#text').text(function(val){
		ok(/Click the Show Text button./.test(val), "Initial text for phui/block test is correct.")
	});
	
	S('button[name=showText]').exists();	
	S('button[name=showText]').click();
	S('#text').text(function(val){
		ok(/You were able to click the button!/.test(val), "Text for phui/block test after Show Text button clicked is correct.")
	});
	
	S('button[name=reset]').exists();	
	S('button[name=reset]').click();
	S('#text').text(function(val){
		ok(/Click the Show Text button./.test(val), "Text for phui/block test after Reset button clicked is correct.")
	});	
	
	S('#block').exists();	
	S('#block').click();	

    S("button[name=showText]").waitCss( "zIndex", function( zIndex ) {
	    ok( S("#blocker").css( "zIndex" ) > zIndex, "Blocker's z-index is higher than Show Text's." );	
	} );
	
	S("#blocker").waitCss( "width", function( width ) {
		ok( width == $(window).width(), "Blocker width is set correctly to window's width." );
	} );
	S("#blocker").waitCss( "height", function( height ) {
		ok( height == $(window).height(), "Blocker height is set correctly to window's height." );		 
	} );	

})
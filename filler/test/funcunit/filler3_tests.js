module("phui/filler test",{ 
	setup: function(){
        S.open("//phui/filler/filler3.html");
		S("#filler_tests").exists();
	}
})

test("Filler Tests", function(){
	/* Vertical height adjustment tests */
	S("#contentV").exists();
	S("#contentV").height( function( height ) {
		ok(/236/.test( height ), "Initial height for vertical test correct.")
	} );
	
	S("button[name=adjustHeight]").click();
	S("#contentV").height( function( height ) {
		ok(/396/.test( height ), "Correct height after first height adjustment.")
	} );	
	
	S("button[name=adjustHeight]").click();
	S("#contentV").height( function( height ) {
		ok(/236/.test( height ), "Correct height after second height adjustment.")
	} );	
	
	/* Horizontal height adjustment tests */
	S("#contentH").exists();
	S("#contentH").width( function( width ) {
		ok(/320/.test( width ), "Initial width for horizontal test correct.")
	} );
	
	S("button[name=adjustWidth]").click();
	S("#contentH").width( function( width ) {
		ok(/480/.test( width ), "Correct height after first width adjustment.")
	} );
	
	S("button[name=adjustWidth]").click();
	S("#contentH").width( function( width ) {
		ok(/320/.test( width ), "Correct height after second width adjustment.")
	} );		
})

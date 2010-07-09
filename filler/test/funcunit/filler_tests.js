module("phui/filler test",{ 
	setup: function(){
        S.open("//phui/filler/filler.html");
	}
})

test("Filler Tests", function(){
	/* No Pading/No Borders */
	S("a#run").exists();
	S("a#run").click();
	
	S("table td:eq(0) .fill").waitHeight( function( height ) {
		ok(/18/.test( height ), "Initial height for no padding/no borders tests correct.")
	} );
	S("table td:eq(0) .ui-resizable-handle").dragTo({ x: "+10", y: "+10" })
	S("table td:eq(0) .fill").waitHeight( function( height ) {
		ok(/18/.test( height ), "Initial height for no padding/no borders tests correct.")
	} );
})


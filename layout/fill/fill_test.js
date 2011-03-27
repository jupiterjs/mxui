steal.plugins('funcunit').then(function(){
	
module("mxui/layout/fill test",{ 
	setup: function(){
        S.open("//mxui/layout/fill/fill.html");
	}
})

test("Filler Tests", function(){
	/* No Pading/No Borders */
	var height1,
		height2,
		height3,
		withinAPixel = function(a, b){
			return  a >= b -1 && a <= b+1;
		};
		
	S(function(){
		height1 = S("#fill1 .fill").height();
		height2 = S("#fill2 .fill").height()
		height3 = S("#fill3 .fill").height()
	})

	S("a#run").click(function(){
		var height = S("#fill1 .fill").height()
		ok(withinAPixel(height1, height),"heights are close");
		height= height1;
	});
	
	
	S("#fill1 .ui-resizable-se").drag("+0 +50");
	S("#fill2 .ui-resizable-se").drag("+0 +50");
	S("#fill3 .ui-resizable-se").drag("+0 +50", function(){
		
		ok(withinAPixel(height1+50, S("#fill1 .fill").height()),"heights are close")
		
		ok(withinAPixel(height2+50, S("#fill2 .fill").height()),"heights are close")
		
		ok(withinAPixel(height3+50, S("#fill3 .fill").height()),"heights are close")
	});
	
})

module("mxui/fill test",{ 
	setup: function(){
        S.open("//mxui/layout/fill/fill3.html");
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

	
})

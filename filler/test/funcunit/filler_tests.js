module("phui/filler test",{ 
	setup: function(){
        S.open("//phui/filler/filler.html");
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


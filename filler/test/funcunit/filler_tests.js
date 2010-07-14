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
	S("#fill1 .fill").height(function(hght){
		height1= hght
	})
	S("#fill2 .fill").height(function(hght){
		height2= hght
	})
	S("#fill3 .fill").height(function(hght){
		height3= hght
	})
	S("a#run").click();
	
	S("#fill1 .fill").height(function(hght){
		ok(withinAPixel(height1, hght),"heights are close");
		height1 = hght;
	})
	
	S("#fill1 .ui-resizable-se").dragTo("+0x+50");
	S("#fill2 .ui-resizable-se").dragTo("+0x+50");
	S("#fill3 .ui-resizable-se").dragTo("+0x+50");
	
	S("#fill1 .fill").height(function(hght){
		ok(withinAPixel(height1+50, hght),"heights are close")
	})
	
	S("#fill2 .fill").height(function(hght){
		ok(withinAPixel(height2+50, hght),"heights are close")
	})
	S("#fill3 .fill").height(function(hght){
		ok(withinAPixel(height3+50, hght),"heights are close")
	})
})


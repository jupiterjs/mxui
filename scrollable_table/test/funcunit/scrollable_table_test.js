module("phui/scrollable_test", { 
	setup: function(){
        S.open("//phui/scrollable_table/scrollable_table.html");
		
		// helps compare columns
		this.compareCols = function(i, size){
			var width;
			
			S(".header th:eq("+i+")").outerWidth(function(outer){
				width = outer
			})
			
			
			S("#table tr:first td:eq("+i+")").outerWidth(function(outer){
				if(i == size -1){
					ok(outer < width,"Last is bigger")
				}else{
					equals(outer, width, ""+i+" columns widths match")
				}
			})
		}
	}
})

test("columns are the right size", function(){
	var compareCols = this.compareCols;
	
	S("#scrollable").click();
	S.wait(100);
	//check columns are right
	
	S(".header th").size(function(size){
		var sizes = [];
		for(var i =0; i < size; i++){
			compareCols(i, size);
		}
	})
	S.wait(1,function(){
		ok(true, "assertions make people feel better")
	})
});

test("horizontal scroll", function(){
	S("#scrollable").click();
	S.wait(100);
	
	S('.scrollBody').scrollLeft(100);
	S('.header').waitScrollLeft(100);
	S.wait(1,function(){
		ok(true, "assertions make people feel better")
	})
})

test("resize test", function(){
	S("#scrollable").click();
	S.wait(100);
	S("#resize").click();
	S.wait(100);
	S.wait(1,function(){
		ok(true, "assertions make people feel better")
	})
})
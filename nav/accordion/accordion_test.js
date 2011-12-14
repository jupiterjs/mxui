steal('funcunit',function(){

	module("Mxui.Nav.Accordion", { 
		setup: function(){
			S.open("//mxui/nav/accordion/accordion.html");
			S('.mxui_nav_accordion').exists();
		}
	});
	
	test("Click Second Header and Verify Accordion Expanded", function(){
		S('h3:eq(1)').click().wait(200, function(){
			console.log('holler')
		});
		ok(S('.content:eq(1)').visible() , 'second header expanded' );
	 });
	 
	test('Click Second Header and check if the First Header Contents Collapsed',function(){
		S('h3:eq(1)').click().wait(200,function(){
			equal(S('.content:first').css('display'), 'none', 'first heada collaspeddd');
		});
	});
		
 	test("Verify Resize Resizes Accordion", function(){
		var prevHeight = S('.content:eq(0)').height();
		S('#resize').click().wait(200,function(){ 
			equal(S('.content:eq(0)').height() > prevHeight, true, "Resize Worked");
		});
 	});
		
 
 	test("Verify Scrolling on Detail when Resize Short Enough", function(){
 		equal(S('.content').get(0).scrollHeight,S('.content').get(0).clientHeight );
 		
 		S('#resize_scroll').click().wait(200,function(){
 			ok(true, (S('.content').get(0).clientHeight) + " test "  );
 			equal( (S('.content').get(0).scrollHeight > S('ul.content').get(0).clientHeight ), true);
 		});
 		 
 	});
 
	
 	test("Verify Scrolling on Detail Disappeared when Resize Even Shorter Enough", function(){
 		equal(S('ul.content').get(0).scrollHeight,S('ul.content').get(0).clientHeight);
 		
 		S('#resize_scroll').click().wait(200,function(){
 			equal(S('ul.content').get(0).scrollHeight > S('ul.content').get(0).clientHeight, true);
 		});
 		
 		S('#resize_unscroll').click().wait(200,function(){
 			equal(S('ul.content').get(0).scrollHeight,S('ul.content').get(0).clientHeight);
 		});
 		 
 	});
 	
 	
});
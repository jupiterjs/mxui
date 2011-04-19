steal.plugins('funcunit').then(function(){

	module("MXUI.Layout.Split", { 
		setup: function(){
			S.open("//mj/ui/split/split.html");
			S('.mxui_layout_split').exists();
		}
	});
	
	test("Add Panel",function(){
		S('#add').click();
		S('#container').find('#new').exists();
  	});
	
	test("Remove Panel",function(){ 
		S('#remove').click().wait(2000,function(){
			equal(S('#container').find('.panel:visible').size(), 2);
		});
 	});
	
	test("Resize Panels",function(){
		var container = S('#container');
		var firstPanel = container.find('.panel:eq(0)');
		var prevWidth = firstPanel.width();
		
		container.find('.splitter:eq(0)').drag('+10 0').wait(1000,function(){
			equal(firstPanel.width() != prevWidth, true);
		});
  	});
	
	test("Hide Last",function(){  
		S('#hide').click().wait(1000,function(){
			S('#container').find('.panel:last').invisible()
		});
	});

	test("Collaspe Panel",function(){
		S('#container').find('.right-collaspe').click().wait(1000,function(){
			
			S('#container').find('.panel:last').invisible();
			
		});
  	});
});
steal('funcunit').then(function(){

	module("MXUI.Layout.Split", { 
		setup: function(){
			S.open("//mxui/layout/split/split.html");
			S('.mxui_layout_split').exists();
			S.wait(10); // so things can get settled ...
		}
	});
	
	var verticalTest = function(name, container, num){
	
	
		test("vertical "+name+" add / remove panel", function(){
			var lastWidth = S(container+' .panel:eq(2)').width();
			
			
			S('.add:visible:eq('+num+")").click();
			S(container).find('.add').exists();
			S(container+' .add').width(150, function(){
				ok(true, "we keep original width of inserted")
			})
			
			S('.remove:visible:eq('+num+")").click();
			S(container+' .add').missing();
			S(container+' .panel:eq(2)').width(function(width){
				return Math.abs(width - lastWidth) <= 2
			}, 1000, function(){
				ok(true, "set back to original width " + lastWidth)
			})
		});
		
		test("vertical "+name+" resize parent", function(){
			//make sure panels resize proportionally 
			var widths, heights;
			S(container+' .panel:eq(2)').visible(function(){
				widths = [S(container+' .panel:eq(0)').width(), 
							  S(container+' .panel:eq(1)').width(), 
							  S(container+' .panel:eq(2)').width()];
				heights = [S(container+' .panel:eq(0)').height(), 
						   S(container+' .panel:eq(1)').height(), 
						   S(container+' .panel:eq(2)').height()];
			})
			
			S('.ui-resizable-e:eq('+num+")").drag("+60 +0", function(){
			
				for (var i = 0; i < widths.length; i++) {
					var width = S(container+' .panel:eq(' + i + ')').width()
					ok(Math.abs(width - widths[i] - 20) <= 5, "widths about equal " + width + "," + widths[i] + " " + Math.abs(width - widths[i] - 20))
				}
				
			});
			
			// make sure the heights go up (there are a few pixels of 'fuzz' )
			S('.ui-resizable-s:eq('+num+")").drag("+0 +23", function(){
			
				for (var i = 0; i < heights.length; i++) {
					var height = S(container+' .panel:eq(' + i + ')').height()
					equals(height, heights[i] + 23, "heights set " + height + "," + heights[i])
				}
				
			})
			
		});
		
		test("vertical "+name+" collapse and expand", function(){
			var widths, left, right;
			S(container+' .panel:eq(2)').visible(function(){
				widths = [S(container+' .panel:eq(0)').width(), 
						  S(container+' .panel:eq(1)').width(), 
						  S(container+' .panel:eq(2)').width()];
			})
			S(container+' .collapser').click(function(){
				left = S(container+' .panel:eq(0)').width()
				right = S(container+' .panel:eq(1)').width();
				ok(Math.abs(left - right) <= 2, "left and right about equal");
				ok(Math.abs(widths[0] + widths[2] / 2 - left) <= 3, "left consumes ");
				ok(Math.abs(widths[1] + widths[2] / 2 - right) <= 3, "right consumes ");
			});
			// make sure they fill in about equal ..
			
			S(container+' .collapser').click(function(){
				var width2 = [S(container+' .panel:eq(0)').width(), 
								S(container+' .panel:eq(1)').width(), 
								S(container+' .panel:eq(2)').width()]
				for (var i = 0; i < widths.length; i++) {
					ok(Math.abs(widths[i] - width2[i]) <= 3, " " + i + " panel about equal");
				}
			});
		})
		
	};
	verticalTest("floating","#container", 0);
	verticalTest("absolute","#container2", 1);
	
	test("vertical absolute - second  splitter position",function(){
		S('#container2 .splitter:eq(1)').visible(function(){
			var second = S('#container2 .panel:eq(1)'),
				offset = second.offset(),
				outer = second.outerWidth();
			equals(S('#container2 .splitter:eq(1)').offset().left, offset.left+outer, "right position");
		})
	});
	
	test("panel keeps min width when resized", function(){
		S('#container_min_width').visible(function(){
			S('#container_min_width .splitter:first').drag('-500 +0', function(){
				var panelWidth = S('#container_min_width .panel:first').width();
				ok(panelWidth >= 100, "panel keeps min-width");
			});
		});
	});
	
	test("panel keeps min width when container resized", function(){
		S('#container_min_width').visible(function(){
			S('#container_min_width .ui-resizable-e').drag('-1000 +0', function(){
				var panelWidth = S('#container_min_width .panel:first').width();
				ok(panelWidth >= 100, "panel keeps min-width");
			});
		});
	});
	
	/*
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
  	});*/
});
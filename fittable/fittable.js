steal.plugins('jquery/dom/dimensions').then(function($){
	
	var target, minHeight;
	
		fittable = $.fn.phui_fittable = function(options){
			// check if we have all necessary data before doing the work
			target = options.target,
			minHeight = options.minHeight;
				
			if( !target || !minHeight ) {
				return;
			}
			
			// make element absolute positioned	
			$(this).css("position", "absolute");	
			target.after( $(this) );		
			
			$(this).bind('move', {fittable: this}, fittable.move );
				
			return this;	
		};
	
		$.extend(fittable,{
			move : function(ev){
				var el = $(this),
					windowHeight = $(window).height(),
					height = el.outerHeight(),
					targetHeight = target.outerHeight(),
					targetTop = target.offset().top,
					targetLeft = target.offset().left,
					targetBottom = targetTop - targetHeight,
					spaceAvailableBellow = windowHeight - targetBottom,
					spaceAvailableAbove = targetTop,
					bellowPosition = { top: targetTop + targetHeight, left: targetLeft },
					abovePosition = { top: targetTop - height, left: targetLeft };
					
					
				// If the element can be positioned without scrolling below target, draw it
				if (spaceAvailableBellow >= height) {
					el.offset( bellowPosition );
				} else if( spaceAvailableBellow >= minHeight ) { // If the dropdown can be positioned with scrolling greater than min height, draw it
					el.height(spaceAvailableBellow);
					el.css( "overflow","scroll" ); 
					el.offset( bellowPosition );
				} else if (spaceAvailableAbove > spaceAvailableBellow) { // If the space above is greater than the space below, draw it above
					el.height(spaceAvailableAbove);
					el.css( "overflow","auto" ); 
					el.offset( abovePosition );
				} else if (spaceAvailableAbove <= spaceAvailableBellow) { //  If the space above is less than the space below, draw it to fit in the space remaining
					el.height(spaceAvailableAbove);
					el.css( "overflow","auto" ); 
					el.offset( abovePosition );					
				}
			}
		});	
		
});
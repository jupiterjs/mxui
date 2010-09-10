steal.plugins('jquery/dom/dimensions').then(function($){
	
	$.fn.scrollableParent = function(){
		var el = this[0], parent = el;
		while ((parent = parent.parentNode) && parent != document.body) {
			if (parent.scrollHeight != parent.offsetHeight) {
				return $(parent);
			}
		}
	}
	
	var fakeWindow = { 
		offset: function() { 
			return { left:0, top:0} 
		},
		height: function(){
			return $(window).height()
		},
		scrollTop: function() {
			return $(window).scrollTop()
		} 
	};
	
	var	fit = function( el, of, within ){
			var op = of.scrollableParent() || fakeWindow,
				spaceAvailableAbove = Math.abs(op.offset().top - of.offset().top) - op.scrollTop(),
				spaceAvailableBellow = op.height() - of.offset().top - of.outerHeight(),
				bellowPosition = { top: of.offset().top + of.outerHeight(), left: of.offset().left };
			
			// use it to calculate element's new height
			var newAboveHeight = spaceAvailableAbove,
				newBellowHeight = spaceAvailableBellow;	 												
				
			// If the element can be positioned without scrolling below target, draw it
			if (spaceAvailableBellow >= el.outerHeight()) {
				el.offset( bellowPosition );
			} else if( spaceAvailableBellow >= within ) { 
				// If the element can be positioned with scrolling greater than min height, draw it
				el.height( newBellowHeight );
				el.css( "overflow","auto" ); 
				el.offset( bellowPosition );
			} else if (spaceAvailableAbove > spaceAvailableBellow) { 
				// If the space above is greater than the space below, draw it above
				el.height( newAboveHeight );
				el.css( "overflow","auto" ); 
				el.offset( { top: of.offset().top - el.outerHeight(), left: of.offset().left } );
			} else if (spaceAvailableAbove <= spaceAvailableBellow) { 
				//  If the space above is less than the space below, draw it to fit in the space remaining
				el.height( newBellowHeight );
				el.css( "overflow","auto" ); 
				el.offset( bellowPosition );					
			}
	}	
	
	$.fn.fit = function(options){
			// check if we have all necessary data before doing the work
			var of = options.of,
				within = options.within;
				
			if( !of || !within ) {
				return;
			}
			
			// make element absolute positioned	
			$(this).css("position", "absolute");			
			
			fit( $(this), of, within );
				
			return this;	
		};
		
});
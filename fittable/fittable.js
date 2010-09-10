steal.plugins('jquery/dom/dimensions').then(function($){
	
	$.fn.scrollableParent = function(){
		var el = this[0], parent = el;
		while ((parent = parent.parentNode) && parent != document.body) {
			if (parent.scrollHeight != parent.offsetHeight) {
				return $(parent);
			}
		}
	}
	
		fittable = $.fn.phui_fittable = function(options){
			// check if we have all necessary data before doing the work
			var t = options.target,
				minH = options.minHeight;
				
			if( !t || !minH ) {
				return;
			}
			
			// make element absolute positioned	
			$(this).css("position", "absolute");	
			t.after( $(this) );		
			
			$(this).bind('move', {fittable: this, t:t, minH:minH}, fittable.move );
			//if this element is removed, take it out
			this.bind('destroyed',{filler: this}, function(ev){
				ev.fittable.removeClass('phui_fittable')
				$(options.parent).unbind('move', fittable.move);
			});
			this.addClass('phui_fittable');
				
			return this;	
		};
	
		$.extend(fittable,{
			move : function(ev){
				var t = ev.data.t, minH = ev.data.minH, el = $(this),
					op = t.scrollableParent() || $(window),
					spaceAvailableAbove = Math.abs(op.offset().top - t.offset().top) - op.scrollTop(),
					spaceAvailableBellow = op.height() - t.offset().top - t.outerHeight(),
					bellowPosition = { top: t.offset().top + t.outerHeight(), left: t.offset().left };
				
				// use it to calculate element's new height
				var newAboveHeight = spaceAvailableAbove,
					newBellowHeight = spaceAvailableBellow;	 												
					
				// If the element can be positioned without scrolling below target, draw it
				if (spaceAvailableBellow >= el.outerHeight()) {
					el.offset( bellowPosition );
				} else if( spaceAvailableBellow >= minH ) { 
					// If the element can be positioned with scrolling greater than min height, draw it
					el.height( newBellowHeight );
					el.css( "overflow","auto" ); 
					el.offset( bellowPosition );
				} else if (spaceAvailableAbove > spaceAvailableBellow) { 
					// If the space above is greater than the space below, draw it above
					el.height( newAboveHeight ); 
					el.offset( { top: t.offset().top - el.outerHeight(), left: t.offset().left } );
				} else if (spaceAvailableAbove <= spaceAvailableBellow) { 
					//  If the space above is less than the space below, draw it to fit in the space remaining
					el.height( newBellowHeight );
					el.css( "overflow","auto" ); 
					el.offset( bellowPosition );					
				}
			}
		});	
		
});
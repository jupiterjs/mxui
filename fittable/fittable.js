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
		outerHeight: function(){
			return $(window).height()
		},
		scrollTop: function() {
			return $(window).scrollTop()
		}
	};
	
	var	fit = function( dropdown, combobox, within ){
			var scrollableParent = combobox.scrollableParent(),
				spaceAvailableAbove,
				spaceAvailableBelow,
				belowPosition,
				
				comboOff = combobox.offset(),
				comboHeight = combobox.outerHeight(),
				
				dropHeight = dropdown.outerHeight()
			
			if(scrollableParent) {
				var scrollStyles = scrollableParent.curStyles(
					"borderTopWidth",
					"paddingTop",
					"paddingBottom"
					)
				
				var scrollableOff = scrollableParent.offset(),
					scrollTop = scrollableOff.top + parseInt(scrollStyles.borderTopWidth);// + 
									//parseInt(scrollStyles.paddingTop);
							
					scrollBottom = scrollTop + scrollableParent.height() + parseInt(scrollStyles.paddingTop) +
						parseInt(scrollStyles.paddingBottom) ;
					
				spaceAvailableAbove = comboOff.top - scrollTop;
				spaceAvailableBelow = scrollBottom - (comboOff.top+ comboHeight);		
			} else {
				spaceAvailableAbove = comboOff.top;
				spaceAvailableBelow = $(window).height() - (comboOff.top+ comboHeight);	
			}	 												
			belowPosition = {top: comboOff.top+ comboHeight, left: comboOff.left}
				
			// If the element can be positioned without scrolling below target, draw it
			if (spaceAvailableBelow >= dropHeight) {
				dropdown.offset( belowPosition );
			} else if( spaceAvailableBelow >= within ) { 
				// If the element can be positioned with scrolling greater than min height, draw it
				dropdown.outerHeight( spaceAvailableBelow );
				dropdown.css( "overflow","auto" ); 
				dropdown.offset( belowPosition );
			} else if (spaceAvailableAbove > spaceAvailableBelow) { 
				// If the space above is greater than the space below, draw it above
				if(spaceAvailableAbove >= dropHeight ){
					
					dropdown.offset( { top: comboOff.top - dropHeight, left: comboOff.left } );
					
				}else{
					//we have to shrink it
					dropdown.outerHeight( spaceAvailableAbove );
					dropdown.css( "overflow","auto" ); 
					dropdown.offset( { top: comboOff.top - spaceAvailableAbove, left: comboOff.left } );
				}
			} else if (true) { 
				//  If the space above is less than the space below, draw it to fit in the space remaining
				dropdown.outerHeight( spaceAvailableBelow );
				dropdown.css( "overflow","auto" ); 
				dropdown.offset( belowPosition );					
			}
			dropdown.css("opacity",1);
	}	
	
	$.fn.fit = function(options){
			// check if we have all necessary data before doing the work
			var of = options.of,
				within = options.within;
				
			if( !of || !within ) {
				return;
			}
			
			// make element absolute positioned	
	
			
			fit( $(this), of, within );
				
			return this;	
		};
		
});
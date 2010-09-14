steal.plugins('jquery/dom/dimensions').then(function($){
	
	$.fn.scrollableParent = function(){
		var el = this[0], parent = el;
		while ((parent = parent.parentNode) && parent != document.body) {
			if (parent.scrollHeight != parent.offsetHeight) {
				return $(parent);
			}
		}
	}
	
	var	fit = function( dropdown, combobox, within, maxHeight ){
			dropdown.css({
				"opacity": 0,
				"height": "",
				"top" : "0px",
				"left" : "0px"
			});
			var scrollableParent = combobox.scrollableParent(),
				spaceAvailableAbove,
				spaceAvailableBelow,
				belowPosition,
				fitAbove = false,
				
				comboOff = combobox.offset(),
				comboHeight = combobox.outerHeight(),
				
				dropHeight = dropdown.outerHeight();
				if (maxHeight) {
					dropHeight = dropHeight > maxHeight ? maxHeight : dropHeight;
					dropdown.height(dropHeight);
				}
			
			if(scrollableParent) {
				var scrollStyles = scrollableParent.curStyles(
					"borderTopWidth",
					"paddingTop",
					"paddingBottom"
					)
				
				var borderNormalizer = {
						"thin": 1,
						"medium": 2,
						"thick": 4
					},
					borderTopWidth = parseInt( scrollStyles.borderTopWidth ) || 
									borderNormalizer[ scrollStyles.borderTopWidth ]; 
				
				var scrollableOff = scrollableParent.offset(),
					scrollTop = scrollableOff.top + borderTopWidth;// + 
									//parseInt(scrollStyles.paddingTop);
							
					scrollBottom = scrollTop + scrollableParent.height() + parseInt(scrollStyles.paddingTop) +
						parseInt(scrollStyles.paddingBottom) ;
					
				spaceAvailableAbove = comboOff.top - scrollTop;
				spaceAvailableBelow = scrollBottom - (comboOff.top+ comboHeight);		
			} else {
				spaceAvailableAbove = comboOff.top - $(window).scrollTop();
				spaceAvailableBelow = $(window).scrollTop()+$(window).height() - (comboOff.top+ comboHeight);	
			}	 												
			belowPosition = {top: comboOff.top+ comboHeight, left: comboOff.left}
				
			// If the element can be positioned without scrolling below target, draw it
			if (spaceAvailableBelow >= dropHeight) {
				dropdown.css({
					top: belowPosition.top+"px",
					left: belowPosition.left+"px"
				});
			} else if( spaceAvailableBelow >= within ) { 
				// If the element can be positioned with scrolling greater than min height, draw it
				dropdown.outerHeight( spaceAvailableBelow );
				dropdown.css({
					overflow:"auto",
					top: belowPosition.top+"px",
					left: belowPosition.left+"px"
				});
			} else if (spaceAvailableAbove > spaceAvailableBelow) { 
				// If the space above is greater than the space below, draw it above
				if(spaceAvailableAbove >= dropHeight ){
					
					dropdown.css({
						top: (comboOff.top - dropHeight)+"px",
						left: comboOff.left+"px"
					});
				}else{
					//we have to shrink it
					dropdown.outerHeight( spaceAvailableAbove );
					dropdown.css({
						overflow:"auto",
						top: (comboOff.top - spaceAvailableAbove)+"px",
						left: comboOff.left+"px"
					});
				}
				fitAbove = true;
			} else if (true) { 
				//  If the space above is less than the space below, draw it to fit in the space remaining
				dropdown.outerHeight( spaceAvailableBelow );
				dropdown.css({
					overflow:"auto",
					top: belowPosition.top+"px",
					left: belowPosition.left+"px"
				});				
			}
			dropdown.css("opacity",1);
			
			return fitAbove;
	}	
	
	$.fn.fit = function(options){
			// check if we have all necessary data before doing the work
			var of = options.of,
				within = options.within,
				maxHeight = options.maxHeight;
				
			if( !of || !within ) {
				return;
			}
			
			// make element absolute positioned	
	
			
			var fitAbove = fit( this, of, within, maxHeight );
			
			$.data( this[0], 'fitAbove', fitAbove);
				
			return this;	
		};
		
});
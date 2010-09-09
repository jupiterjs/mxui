steal.plugins('jquery/dom/dimensions').then(function($){
	
	var fittable = $.fn.phui_fittable = function(options){
		// check if we have all necessary data before doing the work
		var el = $(this),
		 	target = options.target,
			minHeight = options.minHeight;
			
		if( !target || !minHeight ) {
			return;
		}
		
		// If the element can be positioned without scrolling below target, draw it		
		el.css("position","absolute");
		target.after( el );		
	}
		
});
/**
 * @class Mxui.Nav.Accordion
 */
steal('jquery/controller',
	  'jquery/dom/dimensions',
	  'jquery/event/drag',
	  'jquery/event/resize',
	  function($){

/**
 * @class Mxui.Nav.Accordion
 * @parent Mxui
 */
$.Controller("Mxui.Nav.Accordion",{
	defaults : {
		title : "h3",
		animationSpeed : "slow",
		currentClassName : "current",
		activeClassName: "ui-state-active",
		hoverClassName: "ui-state-hover",
		activateFirstByDefault: true,
		clickToActivate: true
	},
	listensTo : ["insert","resize"]
},{
	init : function()
	{
		// Initially add Title classes for title and hide the content.
		var title = this.options.title,
			children = this.element.children().each(function(){
				var el = $(this);
				if(!el.is(title)){
					el.hide();
				}else{
					el.addClass('ui-helper-reset ui-state-default');
				}
			});
			
		// Select first content element, since children.eq(0) is title, and trigger show and resize height.
		if(this.options.activateFirstByDefault){
			this.setActive(children.eq(0));
		}
		
		//- Fixes problems with scrollbars when expanding/collasping elements
		this.element.css('overflow', 'hidden');
	},
	currentContent : function(){
		return this.element.children(':visible').not(this.options.title)
	},
	/**
	 * Draws the current in the right spot. Triggered initially or when resized.
	 * @param children
	 */
	setHeight : function(children)
	{
		// Get only titles pre-defined in defaults either from param or current class object.
		var titles = (children || this.element.children() ).filter(this.options.title);
		
		// Initial proposed height for current content area.
		var ul_height = 0,
			content = this.currentContent();
		
		// Set current div height to match parent first.
		//this.element.height($(this.element).parent().height());
		
		// Make sure current height is not fixed to prevent double scroll bar.
		content.height('');
		
		// Calculate the allowed height after subtracting all titles height if not using scrollbar.
		if(titles && titles.length > 0){
			ul_height = this.calculateRemainder(titles);
		}
		// Minimum height for ul area to be 50, if allowed height more than 50, use the allowed height to push remaing titles to the bottom.
		if(ul_height > 50){
			content.outerHeight(ul_height);
		}
	},
	
	/**
	 * Sets
	 * Does the default actions for showing one 
	 * but not animating.  Used to set default entry.
	 * 
	 * @param {Object} el
	 * @param {Array} arguments to pass to trigger.
	 */
	setActive:function(el, args)
	{
		var next = el.next();
		
		this.current = el;
		if( !next.is(this.options.title) ) {
			next.triggerHandler("show", args)
			next.show();
		}
		
		el.addClass(this.options.currentClassName).addClass(this.options.activeClassName);
		this.setHeight();
	},
	
	/**
	 * Occurs when title was clicked. 
	 * @param {Object} elm
	 * @param {Object} event
	 */
	"{title} click" : function(elm, event)
	{		
		if(this.options.clickToActivate){
			this.expand.apply(this, arguments);
		}
	},
	
	/**
	 * Activate was triggered.  Doing this to standardized the app's event system.
	 */
	"{title} activate":function()
	{
		this.expand.apply(this, arguments);
	},
	
	/**
	 * Expand the content of the title that was clicked.
	 * @param el
	 */
	expand : function(el)
	{
		var next = el.next();
		// If we don't have one selected by default
		if(!this.current || next.is(this.options.title) ) {
			
			this.current && this.current
				.removeClass(this.options.currentClassName)
				.removeClass(this.options.activeClassName);
			
			this.setActive(el, arguments);
			return;
		}
		
		// If proposed content for expansion is already expanded, no need to recalculate.
		if( el[0] === this.current[0] ){
			//this.current.find('.activated').removeClass('activated selected');
			
			//this.current.triggerHandler("show");
			
			//- active class name could have been removed by a child active item
			//if(!el.hasClass(this.options.activeClassName)){
			el.addClass(this.options.currentClassName).addClass(this.options.activeClassName);
			//}
			
			return;
		}
		
		//we need to 'knock out' the top border / margin / etc proportinally ...
		var newHeight = this.calculateRemainder(null, el),
			oldContent = this.element.children(':visible').not(this.options.title),
			newContent = el.next().show().height(0).trigger("show", arguments),
			oldH3 = this.current;
			
		//- toggle the classes
		newContent.find('.activated').removeClass('activated selected');
		oldH3.removeClass(this.options.currentClassName).removeClass(this.options.activeClassName);
		el.addClass(this.options.currentClassName).addClass(this.options.activeClassName);
		

		// Animation closing the existing expanded content and removed class for title, then expand the new one.
		oldContent.stop(true, true).animate({outerHeight: "0px"},{
			complete : function(){
				$(this).hide();
				newContent.outerHeight(newHeight);
			},
			step : function(val, ani){
				//- the height will be 0 if there is more accoridans that height available, 
				//- then we just want to do a auto height.
				if(newHeight <= 0){
					newContent.css('height', 'auto')
				} else {
					newContent.outerHeight(newHeight*ani.pos);
				}
			},
			duration : this.options.animationSpeed
		});
		
		this.current = el;
	},
	
	/**
	 * Calculate the allowed height left after subtracting height from all the titles.
	 * @param titles
	 * @param element resizing
	 * @returns
	 */
	calculateRemainder : function(titles, el)
	{
		var total = this.element.height(),
			options = this.options;
			
		//- find the available space minus the accordian headers.
		(titles || this.element.children(this.options.title) )
				.each(function(){
					total -= $(this).outerHeight(true);
				});
		return total;
	},
	
	/**
	 * Occurs when resize was triggered.
	 */
	resize : function()
	{
		clearTimeout(this._resizeTimeout);
		var self = this;
		this._resizeTimeout = setTimeout(function(){
			self.setHeight();
		}, 10);
	},
	
	/**
	 * Occurs when insert was triggered.
	 */
	insert : function()
	{
		this.setHeight();
	},
	
	/**
	 * Remove hover class on mouse out event.
	 * @param el
	 */
	"{title} mouseleave" : function(el)
	{
		el.removeClass(this.options.hoverClassName);
	},
	
	/**
	 * Add hover class on mouse in event.
	 * @param el
	 */
	"{title} mouseenter" : function(el)
	{
		el.addClass(this.options.hoverClassName);
	},
	
	/**
	 * Occurs when an item was dropped over a title.
	 * @param el
	 */
	"{title} dropover" : function(el)
	{
		this._timer = setTimeout(this.callback('titleOver', el),200);
	},
	
	/**
	 * Occurs when an item was dropped out.
	 * @param el
	 */
	"{title} dropout" : function(el)
	{
		clearTimeout(this._timer);
	},
	
	/**
	 * Expand the content for the title having a drop over event triggered.
	 * @param el
	 */
	titleOver : function(el)
	{
		this.expand(el);
	}
});

});
steal.plugins('jquery/controller',
			  'jquery/event/drag/limit',
			  'jquery/dom/dimensions').css('split').then(function($){
	
	/**
	 * 
	 * MXUI.Layout.Split is a splitter control that will split two or more elements
	 * and allow the end-user to size the elements using a 'splitter bar'.
	 * 
	 * It allows for floating and absolutely positioned elements ,although, 
	 * floating is higher performance.
	 * 
	 * It tries to auto-detect whether it should be vertical or horizontal but
	 * sometimes it's not able to so you might have to pass the direction in the options.
	 * 
	 * Example Usage:
	 * $('.parent).mxui_layout_split();
	 * <div class='parent'><div class='panel'><div class='panel'></div>
	 * 
	 * API Notes:
	 * 
	 * To hide panels by default, apply the 'hidden' css class to the panel.
	 * 
	 * To make a panel collapsible, apply the 'collapsible' css class to the panel. 
	 * Currently you can't have 2 collasible panels beside each other. 
	 * E.g. <div class='collapsible'><div class='split'><div class='collapsible'> Only one or the other can be collapsible.
	 * 
	 */
	$.Controller.extend("MXUI.Layout.Split",
	{
		defaults : {
			active : "active",
			hover : "split-hover",
			splitter : "splitter",
			direction : null,
			dragDistance: 5,
			panelClass : null
		},
		listensTo : ["insert","remove"],
		directionMap : {
			vertical: {
				dim: "width",
				cap: "Width",
				outer: "outerWidth",
				pos: "left",
				dragDir: "horizontal"
			},
			horizontal : {
				dim : "height",
				cap : "Height",
				outer : "outerHeight",
				pos: "top",
				dragDir: "vertical"
			}
		}
	},
	{
		/**
		 * Init method called by JMVC base controller.
		 */
		init : function()
		{
			var c = this.panels();
			
			//- Determine direction.  
			//- TODO: Figure out better way to measure this since if its floating the panels and the 
			//- width of the combined panels exceeds the parent container, it won't determine this correctly.
			if(!this.options.direction){
				this.options.direction = c.eq(0).position().top == c.eq(1).position().top ? 
					"vertical" : "horizontal";
			}
			
			$.Drag.distance = this.options.dragDistance;
			this.dirs = this.Class.directionMap[this.options.direction];
			this.usingAbsPos = c.eq(0).css('position') == "absolute";
			this.initalSetup(c);
		},
		/**
		 * Sizes the split bar and split elements initally.  This is different from size in that fact
		 * that intial size retains the elements widths and resizes what can't fit to be within the parent dims.
		 * @param {Object} c
		 */
		initalSetup:function(c)
		{
			//- Insert the splitter bars
			for(var i=0; i < c.length - 1; i++){	
				var $c = $(c[i]);	
				$c.after("<div class='" + this.options.direction.substr(0,1) + "splitter splitter'>");
				
				//- Append Collapser Anchors
				if($c.hasClass('collapsible')){
					$c.next().append("<a class='left-collapse collapser' href='javascript://'>Expand/Collapse</a>");
				}
				else if($(c[i + 1]).hasClass('collapsible')){
					$c.next().append("<a class='right-collapse collapser' href='javascript://'>Expand/Collapse</a>");
				}
				
			}
			
			var splitters = this.element.children(".splitter")
				splitterDim = splitters[this.dirs.outer](),
				total  = this.element[this.dirs.dim]() - splitterDim * (c.length - 1),
				pHeight = this.element.height();
			
			//- If its vertical, we need to set the height of the split bar
			if (this.options.direction == "vertical") {
				splitters.height(pHeight);
			}
			
			//- Size the elements				  
			for(var i=0; i < c.length; i++){
				var $c = $(c[i]);
				var cdim = $c[this.dirs.outer]();
				// store in data for faster lookup
				$c.data("split-min-"+this.dirs.dim,parseInt( $c.css('min-'+this.dirs.dim) ));
				
				if(cdim > total){
					cdim = total;
				}
				
				$c[this.dirs.dim](cdim).addClass("split");
				this.repositionAbsoluteElms(c, i, splitters, splitterDim);
				
				//- If its a vertical split, we need to size all the elms height to be the same.
				if(this.options.direction == "vertical"){
					$c.height(pHeight);
				}
				
				total = total - cdim;
			}
		},
		panels : function(){
			return this.element.children(( this.options.panelClass ? "."+ this.options.panelClass :"")+":not(.splitter):visible")
		},
		/**
		 * Adds hover class to splitter bar.
		 * @param {Object} el
		 * @param {Object} ev
		 */
        ".splitter mouseenter" : function(el, ev)
		{
            el.addClass(this.options.hover)
        },
		
		/**
		 * Removes hover class from splitter bar.
		 * @param {Object} el
		 * @param {Object} ev
		 */
        ".splitter mouseleave" : function(el, ev)
		{
            el.removeClass(this.options.hover)
        },
		
		/**
		 * Drag down event for the '.splitter' split bar.
		 * @param {Object} el
		 * @param {Object} ev
		 */
		".splitter dragdown" : function(el, ev)
		{
			ev.preventDefault();
		},
		
		/**
		 * Drag init event for the '.splitter' split bar.
		 * @param {Object} el
		 * @param {Object} ev
		 * @param {Object} drag
		 */
		".splitter draginit" : function(el, ev, drag)
		{
			drag.noSelection();
			drag.limit(this.element);
			// limit motion to one direction
			drag[this.dirs.dragDir]();
			//drag.ghost()
			el.addClass("move").addClass(this.options.hover);
			this.currentOffset = el.offset();
			this.currentNext = el.next()[this.dirs.dim]();
			this.currentPrev = el.prev()[this.dirs.dim]();
			this.dragging = true;
		},
		".splitter dragmove" : function(el, ev, drag){
			var newOffset =  drag.location[this.dirs.pos](),
				prevOffset = this.currentOffset[this.dirs.pos],
				delta = newOffset - prevOffset || 0 ,
				prev = el.prev(),
				next = el.next(),
				prevD = this.currentPrev
				nextD = this.currentNext,
				prevMin = prev.data("split-min-"+this.dirs.dim),
				nextMin = next.data("split-min-"+this.dirs.dim);
			
			// we need to check the 'getting smaller' side
			if(delta > 0 && ( nextD - delta <  nextMin) ) {
				ev.preventDefault();
				return;
			} else if(delta < 0 && ( prevD + delta <  prevMin) ) {
				ev.preventDefault();
				return;
			}
			
			// make sure we can't go smaller than the right's min

			
			if(delta > 0){
				next[this.dirs.dim]( nextD - delta);
				prev[this.dirs.dim]( prevD + delta);
			}else{
				prev[this.dirs.dim]( prevD + delta);
				next[this.dirs.dim]( nextD - delta);
			}
			
			if(this.usingAbsPos){
				el.css(this.dirs.pos, newOffset);
				var off = {};
				off[this.dirs.pos] = newOffset+el[this.dirs.outer]()
				next.offset(off);
				//next.css(this.dirs.pos, el.position().left + el[this.dirs.outer]()+"px");
			}

			
			setTimeout(function(){
				//$(window).resize()
				prev.triggerHandler("resize")
				next.triggerHandler("resize")
			},1)
		},
		/**
		 * Drag end event for the '.splitter' split bar.
		 * @param {Object} el
		 * @param {Object} ev
		 * @param {Object} drag
		 */
		".splitter dragend" : function(el, ev, drag)
		{
			this.dragging = false;
			drag.selection();
			setTimeout(function(){
				$(window).resize()
			},1)
		},
		
		/**
		 * Resizes the panels.
		 * @param {Object} el
		 * @param {Object} ev
		 * @param {Object} data
		 */
		resize : function(el, ev, data)
		{
			//if not visible do nothing
			if(!this.element.is(":visible")){
				return;
			}
			
			if( !(data && data.force === true) && ! this.forceNext){
				var h = this.element.height(), w = this.element.width()
				if (this.oldHeight == h && this.oldWidth == w) {
					ev.stopPropagation();
					return;
				}
				this.oldHeight = h;
				this.oldWidth = w;
			}
			
			this.forceNext = false;
			this.size(null, null, data && data.keep);
		},
		
		/**
		 * Inserts a new splitter.
		 * @param {Object} el
		 * @param {Object} ev
		 */
		insert : function(el, ev)
		{
			ev.stopPropagation();
			
			if (ev.target.parentNode != this.element[0]) {
				return;
			}
			
			var target = $(ev.target),
				prevElm = target.prev();
				
			target.addClass("split");
			target.before("<div class='" + this.options.direction.substr(0,1) + "splitter splitter'/>");
			
			//- Append Collapser Anchors
			if(target.hasClass('collapsible')){
				target.prev().append("<a class='right-collapse collapser' href='javascript://'>Expand/Collapse</a>");
			}
			
			this.size(null, true, target);
			
			if(this.options.direction == "vertical"){
				var splitBar = target.prev(),
					pHeight = this.element.height();
				
				splitBar.height(pHeight);
				target.height(pHeight);
			}
		},
		
		/**
		 * If an element is removed from this guy, react to it.
		 * @param {Object} el
		 * @param {Object} ev
		 */
		remove : function(el, ev)
		{
			if (ev.target.parentNode != this.element[0]) {
				return;
			}
			
			var target = $(ev.target);
			
			//remove the splitter before us
			var prev = target.prev(), next;
			if(prev.length && prev.hasClass('splitter')){
				prev.remove();
			}else {
				next = target.next();
				if(next.hasClass('splitter'))
					next.remove();
			}
			
			//what if I am already not visible .. I should note that
			if(!this.element.is(':visible')){
				this.forceNext = true;
			}
			
			this.size(this.panels().not(target), true);
			
			target.remove();
		},
		
		
		
		/**
		 * Occurs when the split bar's collapser was clicked to toggle visibility of a panel.
		 * @param {Object} el
		 * @param {Object} event
		 */
		".collapser click":function(el,event)
		{
			var splitBar = el.parent(),
				prevElm = splitBar.prev(),
				nextElm = splitBar.next(),
				elmToTakeActionOn = prevElm.hasClass('collapsible') ? prevElm : nextElm,
				elmIsHidden = !elmToTakeActionOn.is(':visible');
				
			if(elmIsHidden){
				this.showPanel(elmToTakeActionOn);
			} else {
				this.hidePanel(elmToTakeActionOn, true);
			}
			
			elmToTakeActionOn.toggleClass('collapsed');
			el.toggleClass('left-collapse').toggleClass('right-collapse');
		},
		
		/**
		 * Shows a panel that is currently hidden.
		 * @param {Object} panel
		 * @param {Object} width
		 */
		showPanel:function(panel, width)
		{
			if(!panel.is(':visible')){
				
				if(width){
					panel.width(width);
				}

				panel.removeClass('hidden');
				
				var prevElm = panel.prev();
				if(prevElm.hasClass('splitter')){
					prevElm.removeClass('hidden');
				} else {
					//- if it was hidden by start, it didn't get a 
					//- splitter added so we need to add one here
					panel.before("<div class='" + this.options.direction.substr(0,1) + "splitter splitter'/>");
					
					//- Append Collapser Anchors
					if(prevElm.hasClass('collapsible')){
						panel.prev().append("<a class='left-collapse collapser' href='javascript://'>Expand/Collapse</a>");
					}
					else if(panel.hasClass('collapsible')){
						panel.prev().append("<a class='right-collapse collapser' href='javascript://'>Expand/Collapse</a>");
					}
				}
				
				this.size(null, false, panel);
				
				//-trigger window resize for inner elms
				$(window).resize();
			}
		},
		
		/**
		 * Hides a panel that is currently visible.
		 * @param {Object} panel
		 * @param {Object} keepSplitter
		 */
		hidePanel:function(panel, keepSplitter)
		{
			if(panel.is(':visible') || panel.hasClass('collapsed')) {
				panel.addClass('hidden');
				
				if(!keepSplitter){
					panel.prev().addClass('hidden');
				}
				
				this.size();
				
				//-trigger window resize for inner elms
				$(window).resize();
			}
		},
		/**
		 * Takes elements and animates them to the right size
		 * 
		 * @param {jQuery} [els] child elements
		 * @param {Boolean} [animate] animate the change
		 * @param {jQuery} [keep] keep this element's width / height the same
		 */
		size : function(els, animate, keep)
		{
			els = els || this.panels();
			
			var splitters = this.element.children(".splitter:visible"),
				splitterDim = splitters[this.dirs.outer](),
				total  = this.element[this.dirs.dim]() - (splitterDim * splitters.length),
				// rounding remainder
				remainder = 0;
			
			//makes els the right height
			if(keep){
				els = els.not(keep);
				total = total - $(keep)[this.dirs.outer]() ;
			}
			// round down b/c some browsers don't like fractional dimensions
			total = Math.floor(total);
			
			//calculate current percentage of height
			var dims = [], sum = 0;
			for(var i =0; i < els.length; i++){
				var $c = $(els[i]), 
					dim = $c[this.dirs.outer](true);
				dims.push(dim)
				sum += dim;
			}
			
			var increase = total / sum, 
				keepSized = false,
				curLeft = 0;
			
			
			//resize splitters to new height if vertical (horizontal will automatically be the right width)
			var pHeight = this.element.height(), 
				pWidth = this.element.width();
			
			if(this.options.direction == "vertical"){
				splitters.height(pHeight);
			}
			
			// Adjust widths for each pane and account for rounding
			for (var i = 0; i < els.length; i++) {
				
				var $c = $(els[i]), 
					dim = dims[i],
					newDim = (dim * increase) +remainder,
					newDimFloor = i === els.length -1 ? total : Math.floor(newDim);
				
				// save the remainder (might be used on the next element)
				remainder = newDim - newDimFloor;
				// save the total remaining, used on the last element
				total = total - newDimFloor;	
				
				var newDims = this.options.direction == "horizontal" ? {
					outerHeight: newDimFloor,
					outerWidth: pWidth
				} : {
					outerWidth: newDimFloor,
					outerHeight: pHeight
				};
				
				if (animate && !this.usingAbsPos) {
					$c.animate(newDims, "fast", function(){
						$(this).triggerHandler('resize');
						
						if (keep && !keepSized) {
							keep.triggerHandler('resize')
							keepSized = true;
						}
					});
				}
				else {
					$c.outerHeight(newDims.outerHeight).outerWidth(newDims.outerWidth).triggerHandler('resize');
				}
				// adjust positions if absolutely positioned
				if ( this.usingAbsPos ) {
					//set splitter in the right spot
					$c.css(this.dirs.pos,curLeft )
					splitters.eq(i).css(this.dirs.pos, curLeft+newDimFloor)
				}
				// move the next location
				curLeft = curLeft+ newDimFloor + splitterDim;
			}

		},
		
		/**
		 * Repositions the absolutely positioned elements on a resize.
		 * @param {Object} els
		 * @param {Object} i
		 * @param {Object} splitters
		 * @param {Object} splitterDim
		 */
		repositionAbsoluteElms:function(els, i, splitters, splitterDim)
		{
			if (this.usingAbsPos && i > 0) {
				var prev = $(els[i - 1]), 
					prevPos = prev.position()[this.dirs.pos], 
					prevDim = prev[this.dirs.dim](),
					newOff = prevPos + prevDim;
					
				//- If we are absolute position, we need to move the next elm over to fit the split bar
				$(els[i]).css(this.dirs.pos, (newOff + splitterDim));

				//- If they panels are absolute position, we have to set the splitters offset correctly
				if (i <= splitters.length) {
					splitters.eq(i - 1).css(this.dirs.pos, newOff).css("position", "absolute");
				}
			}
		}
	})
})

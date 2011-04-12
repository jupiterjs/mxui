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
			child_class_names : "split",
			active : "active",
			hover : "split-hover",
			splitter : "splitter",
			direction : null,
			dragDistance: 5
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
			var c = this.element.children(":visible");
			
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
			drag[this.dirs.dragDir]();
			drag.ghost().addClass("move").addClass(this.options.hover);
			this.dragging = true;
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
			
			var newOffset =  drag.movingElement.position()[this.dirs.pos],
				prevOffset = el.position()[this.dirs.pos],
				offset = newOffset - prevOffset || 0 ,
				prev = el.prev(),
				next = drag.movingElement.next(),
				prevD = prev[this.dirs.dim]()
				nextD = next[this.dirs.dim]();
				
			//make sure we can't go to 0 dim
			if(nextD - offset < 0){
				offset = nextD - offset
			}
			
			if(prevD + offset < 0){
				offset = prevD + offset
			}
			
			//do the shrinking one first
			if(offset > 0){
				next[this.dirs.dim]( nextD - offset);
				prev[this.dirs.dim]( prevD + offset);
			}else{
				prev[this.dirs.dim]( prevD + offset);
				next[this.dirs.dim]( nextD - offset);
			}
			
			if(this.usingAbsPos){
				el.css(this.dirs.pos, newOffset);
				next.css(this.dirs.pos, newOffset + el[this.dirs.outer]());
			}

			drag.selection();
			setTimeout(function(){
				$(window).resize()
				prev.triggerHandler("resize")
				next.triggerHandler("resize")
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
			
			this.size(this.element.children(":not(.splitter):visible").not(target), true);
			
			target.remove();
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
			
			var splitterDim = this.element.children(".splitter")[this.dirs.outer](),
							  total  = this.element[this.dirs.dim]() - splitterDim * (c.length - 1),
							  pHeight = this.element.height(),
							  splitters = this.element.children(".splitter");
			
			//- If its vertical, we need to set the height of the split bar
			if (this.options.direction == "vertical") {
				splitters.height(pHeight);
			}
			
			//- Size the elements				  
			for(var i=0; i < c.length; i++){
				var $c = $(c[i]);
				var cdim = $c[this.dirs.outer]();
				
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
		 * Takes elements and animates them to the right size based on the drag.
		 * @param {Object} els
		 */
		size : function(els, animate, keep)
		{
			els = els || this.element.children(":not(.splitter):visible");
			
			//makes els the right height
			if(keep){
				els = els.not(keep)
			}
			var splitters = this.element.children(".splitter:visible"),
				splitterDim = splitters[this.dirs.outer](),
				total  = this.element[this.dirs.dim]() - (splitterDim * splitters.length);
			
			if(keep){
				total = total - $(keep)[this.dirs.outer]();
			}
			
			//calculate current percentage of height
			var dims = [], sum = 0;
			for(var i =0; i < els.length; i++){
				var $c = $(els[i]), 
					dim = $c[this.dirs.outer](true);
				dims.push(dim)
				sum += dim;
			}
			
			var increase = total / sum, keepSized = false;
			if (increase == 1.0) {
				els.each(function(){
					$(this).triggerHandler('resize')
				});
				return;
			}
			
			//go through and resize
			var pHeight = this.element.height(), pWidth = this.element.width();
			if(this.options.direction == "vertical"){
				this.element.children('.splitter').height(pHeight);
			}
			// Adjust widths for each pane to account for rounding
			var adj = els.length + (keep ? keep.length : 0);
			for (var i = 0; i < els.length; i++) {
				var $c = $(els[i]), dim = dims[i];
				
				var newDim = this.options.direction == "horizontal" ? {
					outerHeight: Math.floor(dim * increase) + (adj--),
					outerWidth: pWidth
				} : {
					outerWidth: Math.floor(dim * increase) + (adj--),
					outerHeight: pHeight
				};
				
				if (animate && !this.usingAbsPos) {
					$c.animate(newDim, "fast", function(){
						$(this).triggerHandler('resize');
						
						if (keep && !keepSized) {
							keep.triggerHandler('resize')
							keepSized = true;
						}
					});
				}
				else {
					$c.outerHeight(newDim.outerHeight).outerWidth(newDim.outerWidth).triggerHandler('resize');
				}
			}
			
			//- we need to reitterate through and set the absolute position'd elms position now
			if (this.usingAbsPos){
				els = this.element.children(":not(.splitter)");
				for(var i =0; i < els.length; i++){
					this.repositionAbsoluteElms(els, i, splitters, splitterDim);
				}
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

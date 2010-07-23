steal.plugins('jquery/dom/dimensions','jquery/event/resize').then(function($){	
	//evil things we should ignore
	var matches = /script|td/,
	
	// if we are trying to fill the page
	isThePage = function(el){
		return el === document ||
				   el === document.documentElement ||
				   el === window ||
				   el === document.body
	},
	//if something lets margins bleed through
	bleeder = function(el){
		if(el[0] == window){
			return false;
		}
		var styles = el.curStyles('borderBottomWidth','paddingBottom')
		return !parseInt(styles.borderBottomWidth) && !parseInt(styles.paddingBottom)
	},
	//gets the bottom of this element
	bottom = function(el, offset){
		//where offsetTop starts
		return el.outerHeight()+offset(el);
	}
	pageOffset = function(el){
		return el.offset().top
	},
	offsetTop = function(el){
		return el[0].offsetTop;
	},
	
	filler = $.fn.phui_filler = function(options){
		options || (options = {});
		options.parent || (options.parent = $(this).parent())
		if(isThePage(options.parent[0])){
			options.parent = $(window)
		}
		
		$(options.parent).bind('resize',{filler: this},filler.parentResize);
		//if this element is removed, take it out
		this.bind('destroyed', function(){
			$(options.parent).unbind('resize', filler.parentResize)
		})
	};
	$.extend(filler,{
		parentResize : function(ev){
			var parent = $(this),
				isWindow = this == window,
				container = (isWindow ? $(document.body) : parent)
				offset = ev.data.filler.offsetParent() == parent.offsetParent() ? offsetTop : pageOffset
				//if the parent bleeds margins, we don't care what the last element's margin is
				isBleeder = bleeder(parent),
				children = container.children().filter(function(){
					if (matches.test(this.nodeName.toLowerCase()))
						return false;
					var get = $.curStyles(this, ['position','display']);
					return get.position !== "absolute" && get.position !== "fixed" &&
						   get.display !== "none" && !jQuery.expr.filters.hidden(this)
				}),
				first = children.eq(0),
				firstOffset = offset(first),
				last = children.eq(-1),
				parentHeight = parent.height();
				
			if(!isBleeder){
				//temporarily add a small div to use to figure out the 'bleed-through' margin
				//of the last element
				var last = $('<div/>').css({
					height: "0px",
					lineHeight: "0px",
					overflow: "hidden"
				}).appendTo(container);
				
			}
			// the current size the content is taking up
			var currentSize = bottom(last, offset) - firstOffset,
			// what the difference between the parent height and what we are going to take up is
				delta = parentHeight - currentSize,
			// the current height of the object
				fillerHeight = ev.data.filler.height();
			
			//adjust the height
			ev.data.filler.height(fillerHeight + delta)
			
			//remove the temporary element
			if (!isBleeder) {
				last.remove();
			}
			ev.data.filler.triggerHandler('resize');
		}
	});
	
})

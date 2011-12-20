steal('jquery/controller',
	'jquery/event/drop',
	'jquery/event/drag/limit',
	'jquery/event/default',
	'jquery/event/drag/scroll').then(function($){
	
	// Constants for scroll direction
	var HORIZONTAL = 'horizontal',
		VERTICAL = 'vertical';

	/**
	 * @class Mxui.Layout.Sortable
	 * @parent Mxui
	 * @test mxui/layout/sortable/funcunit.html
	 * 
	 * @description Makes a sortable control that can accept outside draggables.
	 * 
	 * Makes a sortable control that can accept outside draggables.
	 * This is useful for making lists that can be added to, removed 
	 * from, or re-ordered.
	 * 
	 * ## Basic Example
	 * 
	 * If you have the following html:
	 * 
	 *		<div id='vegetables'>
	 *			<div class='sortable'>Carrots</div>
	 *			<div class='sortable'>Onions</div>
	 *			<div class='sortable'>Lettuce</div>
	 *		</div>
	 * 
	 * The following will make the list sortable:
	 * 
	 *     $('#vegetables').mxui_layout_sortable()
	 * 
	 * Additionally, you can set up draggable items:
	 * 
	 *		<div id='draggables'>
	 *			<div class='draggable'>Potatoes</div>
	 *			<div class='draggable'>Peppers</div>
	 *			<div class='draggable'>Beans</div>
	 *		</div>
	 *
	 * Then make them draggable:
	 * 
	 *     $('.draggable').bind("draginit",function(){})
	 * 
	 * This will allow you to have the list of items that can be re-ordered, 
	 * but you can also add new items by dragging them into the list.
	 * 
	 * ## Demo
	 * 
	 * @demo mxui/layout/sortable/demo.html
	 * 
	 * ## How it works
	 * 
	 * When re-ordering items, the drag position of the item is monitored. When 
	 * the item is dragged past the midpoint of the next item (as determined by 
	 * [Mxui.Layout.Sortable.prototype.where where]), they have their spots 
	 * swapped.
	 *
	 * When injecting new items, the item is dragged over the list and creates a 
	 * clone of the new item using the `makePlaceHolder` option method. The clone 
	 * has its visibility hidden until the new item is dropped into the list.
	 *
	 * ## Using a custom placeholder
	 * 
	 * By default, the dragged element will be cloned and injected into the list.
	 * This process can be overridden by setting a custom `makePlaceHolder` 
	 * option method.
	 *
	 * 	$("#vegetables").mxui_layout_sortable({
	 *			makePlaceHolder : function(el, ev, drop, drag){
	 *				return drag.element.clone().css({
	 *					"backgroundColor" : "blue",
	 *					"visibility" : "hidden",
	 *					"position" : "",
	 *					"float" : "left"
	 *				});
	 *			}
	 * 	});
	 *
	 * ## Injecting a group of elements with a single drag
	 *
	 * Multiple items can be injected into the list while dragging a single item 
	 * by changing the `makePlaceHolder` option method to return more than one 
	 * placeholder.
	 *
	 * 	$("#vegetables").mxui_layout_sortable({
	 *			makePlaceHolder : function(el, ev, drop, drag){
	 *				var css = {
	 *							"visibility":"hidden",
	 *							"position" : "",
	 *							"float" : "left"
	 *						},
	 *						placeholders = $(drag.movingElement).clone().css(css);
	 *				$.each($.find('.draggables').not(drag.movingElement), function(i, child) {
	 *					placeholders = placeholders.add($(child).clone().css(css));
	 *				});
	 *				return placeholders;
	 *			}
	 * 	});
	 * 
	 * @constructor
	 * 
	 * @param {HTMLElement} el
	 * @param {Object} [options] Values to configure
	 * the behavior of sortable:
	 * 
	 * - `makePlaceHolder` - A function used to create a placeholder clone of 
	 * 		dragged element.
	 * - `sortable` - The name of the class to be used for sortable items.
	 * - `direction` - The direction with which to constrain dragging within 
	 *		the list: `"horizontal"` (default) or `"vertical"`.
	 * - `scrolls` - The element to scroll as the size of the list changes.
	 * - `scrollOptions` - Additional scrolling options.
	 *
	 * @return {mxui.layout.sortable}
	 */
	$.Controller("Mxui.Layout.Sortable",{
		defaults:{
			//makes a placeholder for the element dragged over
			makePlaceHolder : function(el, ev, drop, drag){
				return drag.element.clone().css({
					"visibility":"hidden",
					"position" : "",
					"float" : this.direction === VERTICAL ? "none" : "left"
				})
			},
			sortable : ".sortable",
			direction: HORIZONTAL,
			scrolls : null,
			scrollOptions: {}
		}
	},
	/** 
	 * @prototype
	 */
	{
		"{sortable} dragdown" : function(el, ev){
			ev.preventDefault();
		},
		
		"{sortable} draginit" : function(el, ev, drag){
			//make sure we can't move it out
			if(this.options.scrolls){
				drag.scrolls(this.options.scrolls, this.options.scrollOptions);
			}
			
			drag.limit(this.element);
			drag[this.options.direction]();
			//clone the drag and hide placehodler
			var clone = el.clone().addClass("sortable-placeholder").css("visibility","hidden")
			el.after(clone)
			el.css("position","absolute");
			
			el.trigger("sortable.start")
		},
		"{sortable} dragend" : function(el){
			el.css({
				"position": "",
				left: "",
				top: ""
			})
			el.trigger("sortable.end")
		},
		/**
		 * 
		 */
		"dropover" : function(el, ev, drop, drag){

			if(!this.element.has(drag.element).length){
				
				// we probably need the ability to cancel this ...
				
				
				// make the placholder element
				var placeholder = this.options.makePlaceHolder(el, ev, drop, drag)
					.addClass("sortable-placeholder")
					.removeAttr("id")
					
				// figure out where to put it
				var res = this.where(ev);
				
				
				var ev = $.Event("sortable.addPlaceholder");
				
				this.element.trigger( ev , [drag, placeholder]);
				// place it
				if(! ev.isDefaultPrevented()) {
					res.el[res.pos](placeholder);
				}
				
				
				
			}
		},
		"dropout" : function(el, ev, drop, drag){
			if(!this.element.has(drag.element).length){
				
				// remove the placeholder
				this.find(".sortable-placeholder").remove();
				
				
				// let people know it
				this.element.trigger("sortable.removePlaceholder")
			}
			
		},
		"dropmove" : function(el, ev, drop, drag){
			//if moving element is not already in my element ... I need to create a placeholder
			var res = this.where(ev,drag.movingElement),
				placeholder = this.find(".sortable-placeholder")

			if($.inArray(res.el[0], placeholder) === -1){
				placeholder.detach()
				res.el[res.pos](placeholder)
			}
		},
		/**
		 * Returns where the element should be placed within the list.
		 * @param {Object} ev 	The drag event.
		 * @param {Object} [not]	Elements that should not be considered sortable.
		 * @return {object} Positioning object
		 * 
		 * - `el` - The element to position the placeholder relative to.
		 * - `pos` - The injection method (`before|append|after`).
		 */
		where : function(ev, not){
			var sortables = this.find(this.options.sortable).not(not || []),
				sortable,
				isVertical = this.options.direction === VERTICAL,
				page = isVertical ? 'pageY' : 'pageX',
				position = isVertical ? 'top' : 'left',
				dimension = isVertical ? 'height' : 'width';

			for(var i=0; i < sortables.length; i++){
				//check if cursor is past 1/2 way
				sortable =  $(sortables[i]);
				if (ev[page] < Math.floor(sortable.offset()[position]+sortable[dimension]()/2)) {
					return {
						pos: "before",
						el: sortable
					}
				}
			}
			if(!sortables.length){
				return {
						pos: "append",
						el: this.element
					}
			}
			//check if it is at the end ...
			if (ev[page] >= Math.floor(sortable.offset()[position]+sortable[dimension]()/2)) {
				return {
						pos: "after",
						el: sortable
					}
			}
		},
		"dropon" : function(el, ev, drop, drag){
			// if we started in the sortable
			if(this.element.has(drag.element).length){
				// put drag element where it goes
				this.find(".sortable-placeholder").replaceWith(drag.element)
			}else{
				//show the placeholder
				this.find(".sortable-placeholder").css({
					"visibility": "",
					top: "",
					left: ""
				}).removeClass("sortable-placeholder").addClass("sortable")
			}
			this.element.trigger("change")
		},
		"dropend" : function(el, ev, drop, drag){
			// set back to normal
			this.find(".sortable-placeholder").remove();
		}
	})
	
})
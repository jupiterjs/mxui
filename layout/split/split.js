steal('./split.css',
	'jquery/controller',
	'jquery/event/drag/limit', 
	'jquery/dom/dimensions', 
	'jquery/event/key', 
	'jquery/event/resize',
function( $ ) {

	/**
	 * @class Mxui.Layout.Split
	 * @parent Mxui
	 * @test mxui/layout/split/funcunit.html
	 * 
	 * @description Makes a splitter widget.
	 * 
	 * The splitter widget manages a container whose content "panels" can be independently resized. It
	 * does this by inserting a "splitter bar" between each panel element, which can be dragged or
	 * optionally collapsed.
	 * 
	 * Panel elements can be added or removed from the container at any time using ordinary DOM manipulation.
	 * The spliter widget will automatically adjust the splitter bars anytime a `resize` event is triggered.
	 * 
	 * The splitter widget will try to auto-detect whether it should operate in `vertical` or `horizontal`
	 * mode by inspecting the positions of its first two elements. If the panels can wrap due to floating
	 * content, or the container does not have two elements at initialization time, this check may be
	 * unreliable, so just pass the direction in the options.
	 * 
	 * ## Basics
	 * 
	 * Suppose you have this HTML:
	 *
	 *     <div id="container">
	 *       <div class="panel">Content 1</div>
	 *       <div class="panel">Content 2</div>
	 *       <div class="panel">Content 3</div>
	 *     </div>
	 * 
	 * The following will create the splitter widget:
	 * 
	 *     $('#container').mxui_layout_split();
	 * 
	 * You can also provide the direction explicitly:
	 * 
	 *     $('#container').mxui_layout_split({ direction: 'vertical' });
	 * 
	 * The `direction` parameter refers to the splitter bar: `vertical` bars mean that the panels are arranged
	 * from left-to-right, and `horizontal` bars mean the panels are arranged from top-to-bottom.
	 * 
	 * To indicate that a panel should be collapsible, simply apply the <code>collapsible</code> CSS class
	 * to the panel.
	 * 
	 * ## Styling
	 * 
	 * The splitter widget uses a number of CSS classes that permit fine-grained control over the look
	 * and feel of various elements. The most commonly used are the following:
	 * 
	 *   - `.mxui_layout_split`: the container itself
	 *     - `.splitter`: splitter bars
	 *     - `.vsplitter`: only vertical splitter bars
	 *     - `.hsplitter`: only horizontal splitter bars
	 *     - `.collapser`: collapser buttons
	 *     - `.left-collapse`: only left collapser buttons
	 *     - `.right-collapse`: only right collapser buttons
	 * 
	 * You can see the standard styles for the splitter widget
	 * [https://github.com/jupiterjs/mxui/blob/master/layout/split/split.css here].
	 * 
	 * Additionally, the `panelClass` initialization option allows you to specify which subelements of
	 * the container should be interpreted as panel elements, and the `hover` option specifies a CSS class
	 * which will be applied to a splitter when the user hovers over it.
	 * 
	 * ## Events
	 * 
	 * The splitter widget responds to the [jQuery.event.special.resize resize] event by performing a quick
	 * check to see if any panel elements have been inserted or removed, and updating its internal
	 * state to reflect the changes. Simply add or remove whatever panel elements you wish from the DOM
	 * using any appropriate jQuery methods, and then trigger the `resize` event on it:
	 * 
	 *     var container = $('#container');
	 *     container.append($('<div class="panel">New Content</div>'));
	 *     container.find('.panel:first').remove();
	 *     container.resize();
	 * 
	 * ## Demo
	 * 
	 * @demo mxui/layout/split/demo.html
	 * 
	 * ## More Examples
	 * 
	 * For some larger, more complex examples, see [//mxui/layout/split/split.html here].
	 * 
	 * @param {HTMLElement} element an HTMLElement or jQuery-wrapped element.
	 * @param {Object} options options to set on the split:
	 * 
	 *   - __hover__ (def. `"split-hover"`) - CSS class to apply to a splitter when the mouse enters it
	 *   - __direction__ - whether the panel layout is `"vertical"` or `"horizontal"` (see above)
	 *   - __dragDistance__ (def. `5`) - maximum number of pixels away from the slider to initiate a drag
	 *   - __panelClass__ - CSS class that indicates a child element is a panel of this container
	 *      					(by default any child is considered a panel)
	 * @return {Mxui.Layout.Split}  
	 */
	$.Controller.extend("Mxui.Layout.Split",
	/** 
	 * @static
	 */
	{
		defaults: {
			active: "active",
			hover: "split-hover",
			splitter: "splitter",
			direction: null,
			dragDistance: 5,
			panelClass: null
		},
		listensTo: ['resize'],
		directionMap: {
			vertical: {
				dim: "width",
				cap: "Width",
				outer: "outerWidth",
				pos: "left",
				dragDir: "horizontal"
			},
			horizontal: {
				dim: "height",
				cap: "Height",
				outer: "outerHeight",
				pos: "top",
				dragDir: "vertical"
			}
		}
	},
	/** 
	 * @prototype
	 */
	{
		/**
		 * @hide
		 * Init method called by JMVC base controller.
		 */
		init: function() {
			var c = this.panels();

			//- Determine direction.  
			//- TODO: Figure out better way to measure this since if its floating the panels and the 
			//- width of the combined panels exceeds the parent container, it won't determine this correctly.
			if (!this.options.direction ) {
				this.options.direction = c.eq(0).position().top == c.eq(1).position().top ? "vertical" : "horizontal";
			}

			$.Drag.distance = this.options.dragDistance;
			this.dirs = this.Class.directionMap[this.options.direction];
			this.usingAbsPos = c.eq(0).css('position') == "absolute";
			if(this.usingAbsPos){

				if(!/absolute|relative|fixed/.test(this.element.css('position'))){
					this.element.css('position','relative')
				}
			}
			
			this.element.css('overflow', 'hidden');
			this.initalSetup(c);
		},

		/**
		 * @hide
		 * Sizes the split bar and split elements initially.  This is 
		 * different from size in that fact
		 * that initial size retains the elements widths and resizes 
		 * what can't fit to be within the parent dims.
		 * @param {Object} c
		 */
		initalSetup: function( c ) {
			//- Insert the splitter bars
			for ( var i = 0; i < c.length - 1; i++ ) {
				var $c = $(c[i]);
				$c.after(this.splitterEl(
					$c.hasClass('collapsible') ? "left" : ($(c[i + 1]).hasClass('collapsible') ? "right" : undefined)));
			}

			var splitters = this.element.children(".splitter"),
				splitterDim = splitters[this.dirs.outer](),
				// why is this calculated and not used
				total = this.element[this.dirs.dim]() - splitterDim * (c.length - 1),
				pHeight = this.element.height();


			//- If its vertical, we need to set the height of the split bar
			if ( this.options.direction == "vertical" ) {
				splitters.height(pHeight);
			}

			//- Size the elements				  
			for ( var i = 0; i < c.length; i++ ) {
				var $c = $(c[i]);
				// store in data for faster lookup
				$c.data("split-min-" + this.dirs.dim, parseInt($c.css('min-' + this.dirs.dim)));


				$c.addClass("split");
			}

			//- Keep track of panels so that resize event is aware of panels that have been added/removed
			this._cachedPanels = this.panels().get();

			this.size();
		},

		/**
		 * @hide
		 * Appends a split bar.
		 * @param {Object} dir
		 */
		splitterEl: function( dir ) {
			var splitter = $("<div class='" + this.options.direction.substr(0, 1) + "splitter splitter' tabindex='0'>")
							.css("position", this.usingAbsPos ? "absolute" : "relative");

			if ( dir ) {
				splitter.append("<a class='" + dir + "-collapse collapser' href='javascript://'></a>")
			}

			return splitter;
		},

		/**
		 * Returns all the panels managed by this controller.
		 * 
		 * Given a `container`, iterate over its panels and collect their content:
		 * 
		 *     var content = '';
		 *     container.mxui_layout_split('panels').each(function(el){
		 *       content += el.text();
		 *     });
		 * 
		 * @return {jQuery} Returns a jQuery-wrapped nodelist of elements that are panels of this container.
		 */
		panels: function() {
			return this.element.children((this.options.panelClass ? "." + this.options.panelClass : "") + ":not(.splitter):visible")
		},

		".splitter mouseenter": function( el, ev ) {
			if (!this.dragging ) {
				el.addClass(this.options.hover)
			}
		},

		".splitter mouseleave": function( el, ev ) {
			if (!this.dragging ) {
				el.removeClass(this.options.hover)
			}
		},

		".splitter keydown": function( el, ev ) {
			var offset = el.offset();
			switch ( ev.keyName() ) {
			case 'right':
				this.moveTo(el, offset.left + 1);
				break;
			case 'left':
				this.moveTo(el, offset.left - 1);
				break;
			case '\r':
				this.toggleCollapse(el);
				break;
			}
		},

		".splitter draginit": function( el, ev, drag ) {
			drag.noSelection();
			drag.limit(this.element);

			// limit motion to one direction
			drag[this.dirs.dragDir]();
			var hoverClass = this.options.hover;
			el.addClass("move").addClass(this.options.hover);
			this.moveCache = this._makeCache(el);
			
			if(this.moveCache.next.hasClass('collapsed') 
			|| this.moveCache.prev.hasClass('collapsed')){
				el.addClass('disabled');
				drag.cancel();
				
				setTimeout(function(){ el.removeClass('disabled')
										 .removeClass("move")
										 .removeClass(hoverClass); }, 800);
			} else {
				this.dragging = true;
			}
		},

		/**
		 * @hide
		 * Internal method for getting the cache info for an element
		 * @param {Object} el
		 */
		_makeCache: function( el ) {
			var next = el.next(),
				prev = el.prev();
			return {
				offset: el.offset()[this.dirs.pos],
				next: next,
				prev: prev,
				nextD: next[this.dirs.dim](),
				prevD: prev[this.dirs.dim]()
			};
		},

		/**
		 * @hide
		 * Moves a slider to a specific offset in the page
		 * @param {jQuery} el
		 * @param {Number} newOffset The location in the page in the direction the slider moves
		 * @param {Object} [cache] A cache of dimensions data to make things run faster (esp for drag/drop). It looks like
		 * 
		 *     {
		 *       offset: {top: 200, left: 200},
		 *       prev: 400, // width or height of the previous element
		 *       next: 200  // width or height of the next element
		 *     }
		 * @return {Boolean} false if unable to move
		 */
		moveTo: function( el, newOffset, cache ) {
			cache = cache || this._makeCache(el);

			var prevOffset = cache.offset,
				delta = newOffset - prevOffset || 0,
				prev = cache.prev,
				next = cache.next,
				prevD = cache.prevD,
				nextD = cache.nextD,
				prevMin = prev.data("split-min-" + this.dirs.dim),
				nextMin = next.data("split-min-" + this.dirs.dim);

			// we need to check the 'getting smaller' side
			if ( delta > 0 && (nextD - delta < nextMin) ) {
				return false;
			} else if ( delta < 0 && (prevD + delta < prevMin) ) {
				return false;
			}

			// make sure we can't go smaller than the right's min
			if ( delta > 0 ) {
				next[this.dirs.dim](nextD - delta);
				prev[this.dirs.dim](prevD + delta);
			} else {
				prev[this.dirs.dim](prevD + delta);
				next[this.dirs.dim](nextD - delta);
			}

			if ( this.usingAbsPos ) {
				//- Sets the split bar element's offset relative to parents
				var newOff = $(el).offset();
				newOff[this.dirs.pos] = newOffset;
				el.offset(newOff);
				
				//- Sets the next elements offset relative to parents
				var off = next.offset();
				off[this.dirs.pos] = newOffset + el[this.dirs.outer]();
				next.offset(off);
			}

			// this can / should be throttled
			clearTimeout(this._moveTimer);
			this._moveTimer = setTimeout(function() {
				prev.trigger("resize",[false]);
				next.trigger("resize",[false]);
			}, 1);
		},

		".splitter dragmove": function( el, ev, drag ) {
			var moved = this.moveTo(el, drag.location[this.dirs.pos](), this.moveCache)

			if ( moved === false ) {
				ev.preventDefault();
			}
		},

		".splitter dragend": function( el, ev, drag ) {
			this.dragging = false;
			el.removeClass(this.options.hover)
			drag.selection();
		},

		/**
		 * @hide
		 * Resizes the panels.
		 * @param {Object} el
		 * @param {Object} ev
		 * @param {Object} data
		 */
		resize: function( el, ev, data ) {
			if(!this.element.is(":visible")){
				return;
			}
			
			var changed = this.refresh(),
				refreshed = ( !! changed.inserted.length || changed.removed ),
				keepEl = data && data.keep;
			if ( ! keepEl && changed.inserted.length ){
				// if no keep element was provided, and at least one element was inserted,
				// keep the first inserted element's dimensions/position
				keepEl = $(changed.inserted.get(0));
			}
			
			// if not visible do nothing
			if (!this.element.is(":visible") ) {
				this.oldHeight = this.oldWidth = 0;
				return;
			}

			if (!(data && data.force === true) && !this.forceNext && !refreshed) {
				var h = this.element.height(),
					w = this.element.width();
				if ( this.oldHeight == h && this.oldWidth == w && !this.needsSize) {
					ev.stopPropagation();
					return;
				}
				this.oldHeight = h;
				this.oldWidth = w;
			}

			this.forceNext = false;
			this.size(null, null, keepEl, false);
		},

		/**
		 * @hide
		 * Refresh the state of the container by handling any panels that have been added or removed.
		 */
		refresh: function(){
			var changed = {
				inserted: this.insert(),
				removed: this.remove()
			};
			this._cachedPanels = this.panels().get();
			return changed;
		},

		/**
		 * @hide
		 * Handles the insertion of new panels into the container.
		 * @param {jQuery} panel
		 */
		insert: function(){
			var self = this,
				//cached = this._cachedPanels,
				panels = this.panels().get(),
				inserted = [];
			
			$.each(panels, function(_, panel){
				panel = $(panel);
				
				if( !panel.hasClass('split') ){
					panel.before(self.splitterEl(panel.hasClass('collapsible') && 'right'))
						.addClass('split')
					
					inserted.push(panel);
					
					if ( self.options.direction == 'vertical' ) {
						var splitBar = panel.prev(),
							pHeight = self.element.height();

						splitBar.height(pHeight);
						panel.height(pHeight);
					}
				}
			});
			
			return $(inserted);
		},
		
		/**
		 * @hide
		 * Handles the removal of a panel from the container.
		 * @param {jQuery} panel
		 */
		remove: function(){
			var self = this,
				splitters = this.element.children('.splitter'),
				removed = [];
			
			$.each(splitters, function(_, splitter){
				splitter = $(splitter);
				
				var prev = $(splitter).prev(),
					next = $(splitter).next();
				
				if( !prev.length || !next.length || next.hasClass('splitter') ){
					removed.push( splitter[0] );
				}
			});
			
			if( removed.length ){
				$(removed).remove();
				return true;
			}
		},

		".collapser click": function( el, event ) {
			this.toggleCollapse(el.parent());
		},

		/**
		 * @hide
		 * Given a splitter bar element, collapses the appropriate panel.
		 * @param {Object} el
		 */
		toggleCollapse: function( splitBar ) {
			// check the next and prev element should be collapsed
			var prevElm = splitBar.prev(),
				nextElm = splitBar.next(),
				elmToTakeActionOn = (prevElm.hasClass('collapsible') && prevElm) || (nextElm.hasClass('collapsible') && nextElm);
			if (!elmToTakeActionOn ) {
				return;
			}

			if (!elmToTakeActionOn.is(':visible') ) {
				this.showPanel(elmToTakeActionOn);
			} else {
				this.hidePanel(elmToTakeActionOn, true);
			}

			elmToTakeActionOn.toggleClass('collapsed');
			splitBar.children().toggleClass('left-collapse').toggleClass('right-collapse');
		},

		/**
		 * Shows a panel that is currently hidden.
		 * 
		 * Given some `container`, cause its last panel to be shown:
		 * 
		 *     container.mxui_layout_split('showPanel', container.find('.panel:last'));
		 *
		 * @param {Object} panel
		 * @param {Object} width
		 */
		showPanel: function( panel, width ) {
			if (!panel.is(':visible') ) {

				if ( width ) {
					panel.width(width);
				}

				panel.show();

				var prevElm = panel.prev();
				if ( prevElm.hasClass('splitter') ) {
					prevElm.show();
				} else {
					//- if it was hidden by start, it didn't get a 
					//- splitter added so we need to add one here
					panel.before(this.splitterEl(
					prevElm.hasClass('collapsible') ? "left" : (
					panel.hasClass('collapsible') ? "right" : undefined)));
				}

				this.size(null, false, panel);
			}
		},

		/**
		 * Hides a panel that is currently visible.
		 * 
		 * Given some `container`, cause its last panel to be hidden:
		 * 
		 *     container.mxui_layout_split('hidePanel', container.find('.panel:last'));
		 *
		 * @param {Object} panel
		 * @param {Object} keepSplitter
		 */
		hidePanel: function( panel, keepSplitter ) {
			if ( panel.is(':visible') || panel.hasClass('collapsed') ) {
				panel.hide();

				if (!keepSplitter ) {
					panel.prev().hide();
				}

				this.size();
			}
		},

		/**
		 * @hide
		 * Takes elements and animates them to the right size.
		 * @param {jQuery} [els] child elements
		 * @param {Boolean} [animate] animate the change
		 * @param {jQuery} [keep] keep this element's width / height the same
		 * @param {Boolean} [resizePanels] resize the panels or not.
		 */
		size: function( els, animate, keep, resizePanels ) {
			els = els || this.panels();
			resizePanels = resizePanels == undefined ? true : false;

			var space = this.element[this.dirs.dim](),
				splitters = this.element.children(".splitter:visible"),
				splitterDim = splitters[this.dirs.outer](),
				total = space - (splitterDim * splitters.length),
				// rounding remainder
				remainder = 0,
				dims = [],
				newDims = [],
				sum = 0,
				i, $c, dim, increase, keepSized = false,
				curLeft = 0,
				index, rawDim, newDim, pHeight = this.element.height(),
				pWidth = this.element.width(),
				length, 
				start,
				keepIndex = keep ? els.index(keep[0]) : -1;

			// if splitters are filling the entire width, it probably means the 
			// style has not loaded
			// this should be fixed by steal, but IE sucks
			if(splitterDim === space){
				this.needsSize = true;
				return;
			} else {
				this.needsSize = false;
			}

			// adjust total by the dimensions of the element whose size we want to keep
			if ( keep ) {
				total = total - $(keep)[this.dirs.outer]();
			}

			length = els.length;
			start = Math.floor(Math.random() * length);

			// round down b/c some browsers don't like fractional dimensions
			total = Math.floor(total);

			//calculate current percentage of height
			for ( i = 0; i < length; i++ ) {
				$c = $(els[i]);
				dim = $c[this.dirs.outer](true);
				dims.push(dim);
				if( keepIndex !== i ) {
					sum += dim;
				}
			}

			increase = total / sum;

			// this randomly adjusts sizes so scaling is approximately equal
			for ( i = start; i < length + start; i++ ) {
				index = i >= length ? i - length : i;
				dim = dims[index];
				rawDim = (dim * increase) + remainder;
				newDim = (i == length + start - 1 ? total : Math.round(rawDim));
				
				if (keepIndex == i) {
					// if we're keeping this element's size, use the original dimensions
					newDims[index] = dim;
				} else {
					// use the adjusted dimensions
					newDims[index] = newDim;
					total = total - newDim;
				}
			}

			//resize splitters to new height if vertical (horizontal will automatically be the right width)
			if ( this.options.direction == "vertical" ) {
				splitters.height(pHeight);
			}

			// Adjust widths for each pane and account for rounding
			for ( i = 0; i < length; i++ ) {
				$c = $(els[i]);

				var minWidth = $c.data("split-min-width") || 0,
					minHeight = $c.data("split-min-height") || 0,
					dim = this.options.direction == "horizontal" ? {
						outerHeight: Math.max( newDims[i], minHeight ),
						outerWidth: Math.max( pWidth, minWidth )
					} : {
						outerWidth: Math.max( newDims[i], minWidth ),
						outerHeight: Math.max( pHeight, minHeight )
					};

				if ( animate && !this.usingAbsPos ) {
					$c.animate(dim, "fast", function() {
						if ( resizePanels ) {
							$(this).trigger('resize', [false]);
						}

						if ( keep && !keepSized ) {
							keep.trigger('resize', [false])
							keepSized = true;
						}
					});
				}
				else {
					$c.outerHeight(dim.outerHeight).outerWidth(dim.outerWidth);

					if ( resizePanels ) {
						$c.trigger('resize', [false]);
					}
				}

				// adjust positions if absolutely positioned
				if ( this.usingAbsPos ) {
					//set splitter in the right spot
					$c.css(this.dirs.pos, curLeft)
					splitters.eq(i).css(this.dirs.pos, curLeft + newDims[i])
				}

				// move the next location
				curLeft = curLeft + newDims[i] + splitterDim;
			}
		}
	})
})

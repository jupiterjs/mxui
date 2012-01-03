steal('jquery/controller', 'jquery/event/resize', 'mxui/layout/positionable', './modal.css').then(function($){
	/**
	 * @class Mxui.Layout.Modal
	 * @parent Mxui
	 * @test mxui/layout/modal/funcunit.html
	 * 
	 * @description A basic modal implementation. 
	 * A basic modal implementation. 
	 * 
	 * ## Use
	 *
	 * Call `mxui_layout_modal` method on any jQuery object.
	 *
	 *		$('#modal').mxui_layout_modal();
	 *
	 * This will take the jQuery object and place it centered
	 * on the window. If you want an overlay over the page behind the modal, use
	 * the overlay option:
	 *
	 *		$('modal').mxui_layout_modal({
	 *			overlay: true
	 *		});
	 *
	 * This will create <div class="mxui_layout_modal-overlay"></div> element 
	 * and display it over the page. Default CSS applied to the overlay is:
	 * 
	 *		.mxui_layout_modal-overlay {
	 *			background: rgba(0,0,0,0.5);
	 *			position: fixed;
	 *			top: 0;
	 *			bottom: 0;
	 *			right: 0;
	 *			left: 0;
	 *		}
	 *
	 * You can either overwrite that CSS in your stylesheet, or you
	 * can use pass the overlay class as an option to the mxui_layout_modal:
	 *
	 *		$('modal').mxui_layout_modal({
	 *			overlay: true, 
	 *			overlayClass: 'my-overlay-class'
	 *		});
	 *
	 * Alternatively, if you'd like to use a custom element as your overlay,
	 * simply pass it in the overlay option:
	 *
	 *		$('modal').mxui_layout_modal({
	 *			overlay: $(".custom_overlay")
	 *		});
	 *
	 * By default modals will be hidden and left in the DOM after you trigger "hide"
	 * on the modal element. If you want to destroy the modal (and overlay) you can pass
	 * true to the destroyOnHide option:
	 *
	 *		$('modal').mxui_layout_modal({
	 *			destroyOnHide: true
	 *		});
	 *
	 * You can hide or destroy the modal by pressing the "Escape" key or by clicking on
	 * the overlay element (if overlay exists).
	 *
	 * Modals can also be attached to an element rather than the window using
	 * the `of` option.
	 *
	 *		$('modal').mxui_layout_modal({
	 *			of : $("#box"),
	 *			overlay: true
	 *		});
	 *
	 * Modal windows can be stacked one on top of another. If modal has overlay, it will
	 * cover the existing modal windows. If you use the "Escape" key to hide the modals
	 * they will be hidden one by one in the reverse order they were created.
	 *
	 * ## Demo
	 * @demo mxui/layout/modal/modal.html
	 * @constructor
	 * 
	 * @param {Object} [options] Values to configure the behavior of modal:
	 * 
	 *	- `overlay` - An element to block the screen behind the modal. When
	 *	clicked, the modal closes.
	 *		- `{Boolean}` - If true an overlay will be created and used.
	 *		- `{HTMLElement}` - If an element is passed, that element will be
	 *		used as the overlay. This is useful for implementing custom
	 *		overlays.
	 *	- `overlayClass` - `{String}` - A class name to be added to the overlay element.
	 *	- `of` - `{HTMLElement}` - The element you would like the modal to be applied to. The
	 *	default is the `window`.
	 *	- `destroyOnHide` - `{Boolean}` - If `true`, the modal will be
	 *	destroyed when it's `hide` method is called.
	 *
	 * @return {mxui.layout.modal}
	 */
	
	/* Starting z-index for modals. We use stack variable to keep open models in order */
	
	var zIndex = 9999, stack = [];
	
	Mxui.Layout.Positionable("Mxui.Layout.Modal", {
		defaults: {
			// Mxui.Layout.Positionable options
			my: 'center center',
			at: 'center center',
			of: window,
			// destroy modal when hide is triggered
			destroyOnHide : false,
			// show overlay if true
			overlay: false,
			// class that will be applied to the overlay element
			overlayClass : "mxui_layout_modal-overlay"
		},
		listensTo: ["show", "hide", "move"]
	}, 
	/*
	 * @prototype
	 */
	{
		setup: function(el, options) {
			var opts = $.extend({}, this.Class.defaults, options)
			if ( opts.overlay ) {
				if ( opts.overlay === true ) {
					options.overlayElement = $('<div />', {
						"class" : opts.overlayClass
					});
				} else if ( opts.overlay.jquery ) {
					options.overlayElement = opts.overlay;
					options.overlayElement.addClass( opts.overlayClass );
				}

				if ( $.isWindow( opts.of ) ) {
					$(document.body).append( options.overlayElement.detach() )
					options.overlayPosition = "fixed";
					//console.log( 'here', options );
				} else {
					opts.of.css("position", "relative").append( options.overlayElement.detach() )
					options.overlayPosition = "absolute";
					//console.log( 'there', options );
				}


				//console.log( options.overlayElement, options.overlayElement.parent() );
				options.overlayElement.hide()

			}
			this._super.apply(this, [el, options])
		},
		init : function(){
			this._super.apply(this, arguments);
			this.stackId = "modal-" + (new Date()).getTime();
			this.show();
		},
		update : function(options){
			if(options && options.overlay === true && typeof this.options.overlayElement == 'undefined'){
				var klass = options.overlayClass || this.options.overlayClass;
				options.overlayElement = $('<div class="'+klass+'"></div>');
				$('body').append(options.overlayElement.hide())
			} else if(options && options.overlay === false && typeof this.options.overlayElement != 'undefined'){
				this.options.overlayElement.remove();
				delete this.options.overlayElement;
			}
			this._super(options);
			this.show();
		},
		destroy : function(){
			if(typeof this.options.overlayElement != "undefined"){
				this.options.overlayElement.remove();
			}
			this._super.apply(this, arguments)
		},
		/**
		 * Hide modal element and overlay if overlay exists
		 */
		hide : function(){
			if(this.options.destroyOnHide){
				this.element.remove();
			} else {
				this.element.css('display', 'none');
				if(this.options.overlay){
					$('.' + this.options.overlayClass).hide();
				}
			}
			stack.splice(stack.indexOf(this.stackId), 1);
		},
		/**
		 * Show modal element and overlay if overlay exists
		 */
		show : function(){
			if($.inArray(this.stackId, this.Class.stack) == -1){
				stack.unshift(this.stackId);
			} else {
				stack.splice(stack.indexOf(this.stackId), 1);
				stack.unshift(this.stackId);
			}
			if ( this.options.overlayElement ){
				this.options.overlayElement.show().css({
					'z-index': ++zIndex, 
					position: this.options.overlayPosition
				})
			}
			this.element.css({'display': 'block', 'z-index': ++zIndex});
			this._super();
			this.element.css('position', this.options.overlayPosition );
			this.closeOnEscapeCb = this.callback(this.closeOnEscape);
		},
		"{document} keyup" : function(el, ev){
			if(this.element.css('display') == "block" && ev.which == 27 && stack[0] == this.stackId){
				this.element.trigger('hide');
				ev.stopImmediatePropagation();
			}
		},
		"{overlayElement} click" : function(el, ev){
			this.hide();
		},
		// Reposition the modal on window resize
		"{window} resize" : function(el, ev){
			this.move();
		}
	})
})

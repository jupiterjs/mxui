steal('jquery/controller',
	'mxui/layout/positionable',
	'mxui/layout/bgiframe',
	'mxui/layout/fill').then(function($){
	/**
	 * @class Mxui.Layout.Block
	 * @parent Mxui
	 * @plugin mxui/block
	 * @test mxui/layout/block/funcunit.html
	 * 
	 * Blocks the browser screen or element from user interaction.
	 * 
	 * Sometimes it is necessary to block the browser from user interaction such as when a spinner image
	 * is giving the user feedback that a request for data is taking place. Mxui.Block attaches to an 
	 * element sets its width and height to the window's width and height and sets its z-index to a 
	 * configurable value (default is 9999).
	 * 
	 * To block the browser screen just attach Mxui.Block to an element you
	 * wish to act as a blocker:
	 * 
	 *		$("#blocker").mxui_layout_block();
	 *
	 * If you'd like to block a specifc element, simply pass it as the argument
	 * to the Mxui.Block call:
	 *
	 *		$("#blocker").mxui_layout_block( $("#parent") );
	 *
	 * You can also simply pass a string selector as the argument to determine
	 * the parent
	 *
	 *		$("#blocker").mxui_layout_block("#parent");
	 *
	 * 
	 * @demo mxui/layout/block/block.html
	 */	
	$.Controller("Mxui.Layout.Block", {
		defaults : {
			zIndex: 9999
		},
		listensTo: ['show','hide']
	}, {
		setup: function( el, option ) {
			var parent;
			if ( option && ( $.isWindow( option ) || option.jquery )) {
				parent = option;
			} else if ( ({}).toString.call( option ) == "[object String]" ) {
				parent = $( option );
			} else {
				parent = el.parent();
			}

			this._super(el, {
				parent : parent
			});
		},
		init : function() {

			this.element.show().mxui_layout_positionable();

			// If the block element is styled with a width or height of zero,
			// this will still work
			if ( ! this.element.is(":visible") ) {
				this.element.css({
					height: "1px",
					width: "1px"
				});
			}

			if ( ! $.isWindow( this.options.parent )) {
				// If its an element, make sure it's relatively positioned
				this.options.parent.css("position", "relative");
				// Put the block inside of the parent if it's not
				if ( ! $.contains( this.options.parent[0], this.element[0] ) ) {
					this.options.parent.append( this.element.detach() );
				}
			}

			this.element
				.css({
					top: "0px", 
					left: "0px" , 
					zIndex: this.options.zIndex
				})
				.mxui_layout_fill({
					all: true, 
					parent: this.options.parent
				})
				.mxui_layout_bgiframe();	
			
		},
		update : function(options){
			this._super(options);
			this.element.show().resize()
		}
	})
})

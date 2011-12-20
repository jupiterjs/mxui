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
	 * Blocks the browser screen from user interaction.
	 * 
	 * Sometimes it is necessary to block the browser from user interaction such as when a spinner image
	 * is giving the user feedback that a request for data is taking place. Mxui.Block attaches to an 
	 * element sets its width and height to the window's width and height and sets its z-index to a 
	 * configurable value (default is 9999).
	 * 
	 * To block the browser screen just attach Mxui.Block to an element you wish to act as a blocker and
	 * trigger the `show` event.
	 * 
	 * 		$("#blocker").mxui_block().trigger('show')	
	 * 
	 * @demo mxui/layout/block/block.html
	 */	
	$.Controller("Mxui.Layout.Block", 
	{
		defaults : {
			zIndex: 9999
		},
		listensTo: ['show','hide']
	},{
		init : function(){

			this.element.show().mxui_layout_positionable();

			// If the block element is styled with a width or height of zero,
			// this will still work
			if ( ! this.element.is(":visible") ) {
				this.element.css({
					height: "1px",
					width: "1px"
				});
			}

			this.element
				.css({
					top: "0px", 
					left: "0px" , 
					zIndex: this.options.zIndex
				})
				.mxui_layout_fill({
					all: true, 
					parent: window
				})
				.mxui_layout_bgiframe();	
			
		}
	})
})

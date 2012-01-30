steal('jquery/controller', './input_watermark.css')
	.then(function($)
{

	/**
	 * Watermark Plugin to allow a input box to have default text and then removed when a user focuses in on the element.
	 */
	$.Controller.extend("MXUI.Form.InputWatermark",
	{
		defaults:
		{
			defaultText: "Enter text here",
			replaceCurrent: false,
			replaceOnFocus: false,
			replaceOnType: true,
			verticalAlign: 'middle' //top or middle
		}
	},
	{
		/**
		 * Wrap a div around it for password.
		 * @param {Object} el
		 * @param {Object} options
		 */
		setup:function(el, options)
		{
			var $el = $(el).wrap('<div>'),
				parent = $el.parent();
				
			this.input = $el;
			this.watermark = $('<span class="watermark" />').appendTo(parent);
			
			this._super(parent, options);
		},
		
		/**
		 * Init called by jmvc base controller.  Add some css and set the text.
		 */
		init : function()
		{
			this.watermark.text(this.options.defaultText);
			
			//- clone the inputs styles we care about like font stuff
			this.watermark.css({
				left: parseInt(this.input.css('padding-left')) + 4, //- add 3 cuz its cursor sits on top of text
				fontSize: this.input.css('font-size'),
				lineHeight: this.input.css('line-height'),
				fontWeight: this.input.css('font-weight'),
				width: this.input.css('width')
			});
			
			//- set this after, we have all the css... this would be better but can't seem to get it perfect
			switch(this.options.verticalAlign){
				case 'top':
					this.watermark.css('top', this.input.position().top + 4);
					break;
				case 'middle':
					this.watermark.css('top', (this.element.height() - this.watermark.outerHeight()) / 2);
					break;
			}
			
			var current = this.input.val();
			if(current == null || current == "" || this.options.replaceCurrent){
				this.watermark.show();
				
				if(this.options.replaceCurrent){
					this.input.val('');
				}
			}
		},
		
		/**
		 * Resets the input back to orig state.
		 */
		reset:function()
		{
			this.watermark.show();
		},
		
		/**
		 * Binds on the input box for when it is focused to remove default text and remove the blurred text.
		 * @param {Object} el
		 * @param {Object} ev
		 */
		"focusin" : function(el, ev)
		{
			if(this.options.replaceOnFocus && this.input.val() === ""){
				this.watermark.hide();
			}
		},
		
		/**
		 * when a user clicks the watermark text, stop the event and focus the input.
		 * @param {Object} elm
		 * @param {Object} event
		 */
		".watermark click":function(elm,event)
		{
			event.preventDefault();
			this.input.focus();
		},
		
		/**
		 * Listens for keydown on the input.
		 * @param {Object} el
		 * @param {Object} ev
		 */
		"keydown":function(el,ev)
		{
			var ignoreKeys = [8,13,16,17,18,20,27,37,38,39,40,46,224];
			if(this.options.replaceOnType){
				if ( ! ( $.inArray(ev.which, ignoreKeys ) >=0 ) ){
					this.watermark.hide();
				}
			}
		},
		
		/**
		 * change listens for changes of value that might be caught from a auto-complete action just clicked.
		 * @param el
		 * @param ev
		 */
		"change":function(el,ev)
		{
			this.showHideWatermark();
		},

		/**
		 * keydown and keyup handlers together provide a smoother watermark experience
		 * @param el
		 * @param ev
		 */
		"keyup" : function (el,ev){
			if(this.options.replaceOnType){
				this.showHideWatermark();
			}
		},
		
		/**
		 * Show/Hides the watermark based on the value of the input box.
		 */
		showHideWatermark:function()
		{
			if(this.input.val() !== ""){
				this.watermark.hide();
			} else {
				this.watermark.show();
			}
		},

		/**
		* Binds on the input box for when it is blurred.  
		* Adds the blurred class and inputs the default text if none was provided by the user.
		* @param {Object} el The event target element.
		* @param {Object} ev The event being fired.
		*/
		"focusout" : function(el, ev)
		{
			if(this.input.val() === ""){
				this.reset();
			}
		},
		
		/**
		 * to hide the watermark, can be used invoked from outside the plugin.
		 */
		hideWatermark : function (){
			this.watermark.hide();
		}
	});
});

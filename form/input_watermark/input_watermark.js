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
			replaceCurrent: false
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
			var $el = $(el).wrap('<div>');
			this.input = $el;
			this._super($el.parent(), options);
		},
		
		/**
		 * Init called by jmvc base controller.  Add some css and set the text.
		 */
		init : function()
		{
			//- passwords need to be replaced w/ text boxes
			if(this.input.is(':password')){
				var origElmHtml = this.element.html();
				this.passwordElm = $(origElmHtml);
				this.textElm = $(origElmHtml.replace(/type=["']?password["']?/i, 'type="text"'));
			}
			
			var current = this.input.val();
			if(current == null || current == "" || this.options.replaceCurrent){
				//- if we are a password, we have to swap inputs.
				if(this.passwordElm){
					this.input.replaceWith(this.textElm);
					this.input = this.find('input[type=text]');
				}
				
				this.input.addClass('blurred default');
				this.input.val(this.options.defaultText);
			}
		},
		
		/**
		 * Resets the input back to orig state.
		 */
		reset:function()
		{
			//- if we are a password, we have to swap inputs.
			if(this.passwordElm){
				this.input.replaceWith(this.textElm);
				this.input = this.find('input[type=text]');
			}
			
			this.input.val(this.options.defaultText).addClass('blurred default');
		},
		
		/**
		 * Binds on the input box for when it is focused to remove default text and remove the blurred text.
		 * @param {Object} el
		 * @param {Object} ev
		 */
		"focusin" : function(el, ev)
		{
			if(this.input.val() == this.options.defaultText){
				//- if we are a password, we have to swap inputs.
				if(this.passwordElm){
					this.input.replaceWith(this.passwordElm);
					this.input = this.find('input[type=password]');
				}
				
				this.input.focus();
				this.input.val("");
				this.input.removeClass('default');
			}
			
			this.input.removeClass('blurred');
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
		}
	});
});

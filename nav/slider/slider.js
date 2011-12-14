steal('jquery/controller', 
              'jquery/event/drag/limit', 
              'jquery/event/drag/step').then(function( $ ) {

	/**
	 * @class Mxui.Nav.Slider
	 * @parent Mxui
	 *
	 * @description Converts an input into a slider with `min`, `max` and `interval` options.
	 * Converts an input into a slider with `min`, `max` and `interval` options.
	 *
	 *		$("#slider").mxui_nav_slider({
	 *			interval: 1, 
	 *			min: 1, 
	 *			max: 10, 
	 *			val: 5
	 *		});
	 *
	 * ## Demo
	 * @demo mxui/nav/slider/slider.html
	 */
	$.Controller("Mxui.Nav.Slider", 
		/**
		 * @static
		 */
	{
		/**
		 * Default options
		 *
		 * - `min` - Minimum slider value. Default is `0`
		 * - `max` - Maximum slider value. Default is `10`
		 * - `interval` - The amount by which the slider will adjust. Default is `1`
		 */
		defaults: {
			min: 0,
			max: 10,
			// if the slider is contained in the parent
			contained : true
		}
	}, 
	/**
	 * @prototype
	 */
	{
		init: function() {
			this.element.css({
				position: 'relative'
			})
			if ( this.options.val ) {
				this.val(this.options.val)
			}
		},
		getDimensions: function() {
			var spots = this.options.max - this.options.min,
				parent = this.element.parent(),
				outerWidth = this.element.outerWidth();
			this.widthToMove = parent.width();
			if(this.options.contained){
				this.widthToMove = this.widthToMove - outerWidth
			}else{
				//this.widthToMove = this.widthToMove + outerWidth
			}
			this.widthOfSpot = this.widthToMove / spots;
			var styles = parent.curStyles("borderLeftWidth", "paddingLeft"),
				leftSpace = parseInt(styles.borderLeftWidth) + parseInt(styles.paddingLeft) || 0
				this.leftStart = parent.offset().left + leftSpace -
				(this.options.contained ? 0 : Math.round(outerWidth / 2));
		},
		"draginit": function( el, ev, drag ) {
			this.getDimensions();
			drag.limit(this.element.parent(), this.options.contained ? undefined : "width")
				.step(this.widthOfSpot, this.element.parent());
		},
		"dragend": function( el, ev, drag ) {
			var left = this.element.offset().left - this.leftStart;
			var spot = Math.round(left / this.widthOfSpot);
			this.element.trigger("change", spot + this.options.min)
		},
		val: function( value ) {
			this.getDimensions();
			if ( value !== undefined) {
				//move slider into place
				this.element.offset({
					left: this.leftStart + Math.round((value - this.options.min) * this.widthOfSpot)
				})
				this.element.trigger("change", value)
			} else {
				var left = this.element.offset().left - this.spaceLeft;
				return Math.round(this.leftStart / this.widthOfSpot) + this.options.min;
			}
		}
	})

});

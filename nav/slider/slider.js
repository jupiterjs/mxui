steal(
	'jquery/controller', 
	'jquery/event/drag/limit', 
	'jquery/event/drag/step'
).then(function( $ ) {

	/**
	 * @class Mxui.Nav.Slider
	 * @test mxui/nav/slider/slider_test.js
	 * @parent Mxui
	 *
	 * @description Creates a slider with `min`, `max` and `interval` options.
	 * Creates a slider with `min`, `max` and `interval` options.
	 *
	 *		<div class="container">
	 *			<div id="slider"></div>
	 *		</div>
	 *
	 * You can create a slider with the following code:
	 *
	 *		$("#slider").mxui_nav_slider({
	 *			interval: 1, 
	 *			min: 1, 
	 *			max: 10, 
	 *			val: 4
	 *		});
	 *
	 *	The targeted element then becomes a draggable box within the bounding
	 *	box of it's parent element. You can then call the val method to
	 *	retrieve it's current value:
	 *
	 *		$("#slider").mxui_nav_slider("val"); // 4
	 *
	 *	You can also use the `val` method as a setter:
	 *
	 *		$("#slider").mxui_nav_slider("val", 6);
	 *
	 *	Alternatively, you can subscribe to the `change` event on the slider,
	 *	which will pass the value as the second argument to the event handler.
	 *
	 *		$("#slider").change(function( e, value ) {
	 *			value; // 6
	 *		});
	 *
	 * ## Demo
	 * @demo mxui/nav/slider/slider.html
	 *
	 * @param {Object} options - An object literal describing the range,
	 * interval and starting value of the slider
	 */
	$.Controller("Mxui.Nav.Slider", 
		/**
		 * @hide
		 * @static
		 */
	{
		defaults: {
			min: 0,
			max: 10,
			// if the slider is contained in the parent
			contained : true
		}
	}, 
	/**
	 * @hide
	 * @prototype
	 */
	{
		init: function() {
			this.element.css("position", 'relative')
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
		"dragmove": function( el, ev, drag ) {
			var left = this.element.offset().left - this.leftStart;
			var spot = Math.round(left / this.widthOfSpot);
			this.element.trigger("change", spot + this.options.min)
		},
		/**
		 * @param {Number} value - Optional. The new value for the slider. If
		 * omitted, the current value is returned.
		 * @return {Number}
		 */
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

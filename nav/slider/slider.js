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
	 * Given the following markup:
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
	 *
	 *	- `min` {Number} - The minimum value the slider can go down to.
	 *	- `max` {Number} - The maximum value the slider can go up to.
	 *	- `interval` {Number} - The step size that the slider should increment
	 *	by when being moved.	
	 *	- `val` {Number} - The initial starting value of the slider.
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
	 * @prototype
	 */
	{
		init: function() {
			this.element.css("position", 'relative')
			if ( this.options.val ) {
				this.val( this.options.val )
			}
		},
		resize: function() {
			this.updatePosition();
		},
		getDimensions: function() {
			var spots = this.options.max - this.options.min,
				parent = this.element.parent(),
				outerWidth = this.element.outerWidth(),
				styles, leftSpace;

			this.widthToMove = parent.width() - outerWidth;
			this.widthOfSpot = this.widthToMove / spots;

			styles = parent.curStyles("borderLeftWidth", "paddingLeft");
			leftSpace = parseInt(styles.borderLeftWidth) + parseInt(styles.paddingLeft) || 0;
			this.leftStart = parent.offset().left + leftSpace - (this.options.contained ? 0 : Math.round(outerWidth / 2));
		},
		"draginit": function( el, ev, drag ) {
			this.getDimensions();
			drag.limit(this.element.parent(), this.options.contained ? undefined : "width")
				.step(this.widthOfSpot, this.element.parent());
		},
		"dragmove": function( el, ev, drag ) {
			this.determineValue();
			this.element.trigger( "changing", this.value )
		},
		"dragend": function( el, ev, drag ) {
			this.element.trigger( "change", this.value )
		},
		determineValue : function() {
			var left = this.element.offset().left - this.leftStart;
			var spot = Math.round(left / this.widthOfSpot);
			this.value = spot + this.options.min;
		},
		updatePosition: function() {
			this.getDimensions();
			this.element.offset({
				left: this.leftStart + Math.round((this.value - this.options.min) * this.widthOfSpot)
			})
		},
		/**
		 * @param {Number} value - Optional. The new value for the slider. If
		 * omitted, the current value is returned.
		 * @return {Number}
		 */
		val: function( value ) {
			if ( value !== undefined) {
				this.value = value;
				this.updatePosition();
				setTimeout(this.proxy(function() {
					this.element.trigger("change", value)
				}), 0);
			} else {
				return this.value;
			}
		}
	})

});

steal.plugins('jquery/controller', 
              'jquery/event/drag/limit', 
              'jquery/event/drag/step').then(function( $ ) {

	$.Controller("Mxui.Slider", {
		defaults: {
			min: 0,
			max: 10
		}
	}, {
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
				parent = this.element.parent();
			this.widthToMove = parent.width() - this.element.outerWidth();
			this.widthOfSpot = this.widthToMove / spots;
			var styles = parent.curStyles("borderLeftWidth", "paddingLeft"),
				leftSpace = parseInt(styles.borderLeftWidth) + parseInt(styles.paddingLeft) || 0
				this.leftStart = parent.offset().left + leftSpace;
		},
		"draginit": function( el, ev, drag ) {
			this.getDimensions();
			drag.limit(this.element.parent()).step(this.widthOfSpot, this.element.parent());
		},
		"dragend": function( el, ev, drag ) {
			var left = this.element.offset().left - this.leftStart;
			var spot = Math.round(left / this.widthOfSpot);
			this.element.trigger("change", spot + this.options.min)
		},
		val: function( value ) {
			this.getDimensions();
			if ( value ) {
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
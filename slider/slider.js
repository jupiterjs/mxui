steal.plugins('jquery/controller',
		      'jquery/event/drag/limit',
			  'jquery/event/drag/step').then(function($){

	$.Controller("Mxui.Slider",{
		init : function(){
			this.element.css({
				position: 'relative'
			})
			this.options.spots = this.options.max - this.options.min + 1;
			if(this.options.val){
				this.val(this.options.val)
			}
		},
		getDimensions : function(){
			var parent = this.element.parent();
			this.widthToMove = parent.width() - this.element.outerWidth();
			this.widthOfSpot = this.widthToMove  / this.options.spots;
			var styles = parent.curStyles("borderLeftWidth","paddingLeft");
			this.spaceLeft = parseInt( styles.borderLeftWidth ) + parseInt( styles.paddingLeft )|| 0;
		},
		"draginit" : function(el, ev, drag){
			this.getDimensions();
			drag.limit(this.element.parent())
				.step(this.widthOfSpot, this.element.parent());
		},
		"dragend" : function(el, ev, drag){
			var left =  this.element.offset().left - this.spaceLeft;
			var spot = Math.round( left / this.widthOfSpot );
			this.element.trigger("change", spot)
		},
		val : function(value){
			this.getDimensions();
			if(value){
				//move slider into place
				this.element.offset({
					left: this.element.parent().offset().left+this.spaceLeft+Math.round( value*this.widthOfSpot )
				})
			}else{
				var left =  this.element.offset().left - this.spaceLeft;
				return Math.round( left / this.widthOfSpot );
			}
		}
	})

});
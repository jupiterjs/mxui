steal.plugins('jquery/controller').then(function($){
	$.Controller.extend("Phui.Spinner",{
		defaults: {
			enableUp : true,
			enableDown : true,
		}
	},
	{
		init : function(){
			this.element.html('<div class="spinner-button up "></div><div class="spinner-button down"></div>');
			this.upEnabled(this.options.enableUp);
			this.downEnabled(this.options.enableDown)
		},
		upEnabled : function(enable){
			return this.enabled("Up",enable)
		},
		downEnabled : function(enable){
			return this.enabled("Down",enable)
		},
		enabled : function(direction, enable){
			if(enable === undefined){ //getter
				return this.element.find('.enabled'+direction).length > 0
			}
			var el = this.element.find("."+direction.toLowerCase())
			if(enable){
				el.addClass("enabled"+direction).attr('tabindex',0)
			}else{
				el.removeClass("enabled"+direction).removeAttr('tabindex')
			}
		},
		".spinner-button click" : function(el){
			if(/enabled/.test(el[0].className))
				this.element.trigger( el.hasClass("up") ? "increment" : "decrement" );
		},
		".spinner-button keypress" : function(el, ev){
			if(ev.keyCode == 13 && /enabled/.test(el[0].className))
				this.element.trigger( el.hasClass("up") ? "increment" : "decrement" );
		}
	})
})

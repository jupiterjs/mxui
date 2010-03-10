steal.plugins('jquery/controller','phui/positionable','phui/bgiframe','phui/filler').then(function($){
	$.Controller.extend("Phui.Block", 
	{
		defaults : {
			types : [Phui.Positionable, Phui.Bgiframe, Phui.Filler({all: true, parent: $(window)})],
			zIndex: 9999
		},
		listensTo: ['show','hide']
	},{
		init : function(){
			this.element.show().mixin.apply(this.element, this.options.types);
			if(!this.element.is(":visible")){
				this.element.css({height: "1px", width: "1px"})
			}
			this.element.hide().css({top: "0px", left: "0px" , zIndex: this.options.zIndex})
			if(this.options.show){
				this.element.trigger('show')
			}
		},
		show : function(){
			var el = this.element.show();
			setTimeout(function(){
				el.trigger('resize')
			}, 13)
		},
		hide : function(){
			this.hide();
		}
		
	})
})

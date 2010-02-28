steal.plugins('jquery/controller').then(function($){
	$.Controller.extend("Phui.Filler",
	{
		listensTo : ["show"]
	},
	{
		init : function(el, parent){
			this.parent = parent || this.element.parent()
			if(this.parent[0] === document.body || this.parent[0] === document.documentElement)
				this.parent = $(window)
			//listen on parent's resize
			this.parent_resize = this.callback('parentResize')
			//console.log("listening on ", this.parent[0])
			this.parent.bind('resize', this.parent_resize)
			this.parent.trigger("resize");
		},
		parentResize : function(ev){
			//only if target was me
			//console.log(ev.target)
			if(ev.target == this.parent[0] && this.element.is(":visible")){
				var p = this.parent,
			    height = this.parent.height(),
				el = this.element[0];
				
				this.element.parent().children().each(function(){
					var $jq = $(this)
					if(this != el && this.nodeName.toLowerCase() != 'script' && $jq.is(":visible")){
						height = height - $jq.outerHeight(true)
					}
					
				})
				
				//subtract borders and margin
				$.each(['Top','Bottom'], function(){
					height -= parseFloat(jQuery.curCSS( el, "padding" + this, true)) || 0;
					height -= parseFloat(jQuery.curCSS( el, "border" + this + "Width", true)) || 0;
				})
					
				this.element.height(height).trigger('resize');
				
				
			}
			
		},
		show : function(el, ev){
			//resize after show ... needs a shown
			var element = this.parent;
			setTimeout(function(){
				element.trigger("resize");
			},100)
			//this.element.trigger("resize");
		},
		destroy : function(){
			this.parent.unbind('resize', this.parent_resize)
			this.parent = null;
		}
	})
})

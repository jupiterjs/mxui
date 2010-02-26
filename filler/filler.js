steal.plugins('jquery/controller').then(function($){
	$.Controller.extend("Phui.Filler", {
		init : function(el, parent){
			this.parent = parent || this.element.parent()
			if(this.parent[0] === document.body || this.parent[0] === document.documentElement)
				this.parent = $(window)
			//listen on parent's resize
			this.parent_resize = this.callback('parentResize')
			this.parent.bind('resize', this.parent_resize)
			this.parentResize();
		},
		parentResize : function(){
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
		},
		destroy : function(){
			this.parent.unbind('resize', this.parent_resize)
			this.parent = null;
		}
	})
})

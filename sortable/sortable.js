steal.plugins('jquery/controller','jquery/event/drop','jquery/event/drag/limit','jquery/event/default').then(function($){
	$.Controller.extend("Phui.Sortable",{
		defaults:{
			//makes a placeholder for the element dragged over
			makePlaceHolder : function(el){
				return el.clone().css({
					"visibility":"hidden",
					"position" : "",
					"float" : "left"
				})
			}
		}
	},{
		".sortable draginit" : function(el, ev, drag){
			//drag.ghost(); //move a ghost
			//el.hide();
			drag.limit(this.element);
			
			var clone = el.clone().addClass("sortable-placeholder").css("visibility","hidden")
			el.after(clone)
			el.css("position","absolute")
			drag.horizontal();
		},
		".sortable dragend" : function(el){
			el.css({
				"position": "",
				left: ""
			})
		},
		"dropover" : function(el, ev, drop, drag){

			if(!this.element.has(drag.element).length){
				this.element.triggerDefault("sortable:addPlaceholder")
				var placeholder = this.options.makePlaceHolder(drag.element).addClass("sortable-placeholder")
				var res = this.where(ev);
				res.el[res.pos](placeholder)
			}
			
		},
		"dropout" : function(el, ev, drop, drag){
			if(!this.element.has(drag.element).length){
				this.find(".sortable-placeholder").remove();
				this.element.triggerDefault("sortable:removePlaceholder")
			}
			
		},
		"dropmove" : function(el, ev, drop, drag){
			//if moving element is not already in my element ... I need to create a placeholder
			var res = this.where(ev,drag.movingElement),
				placeholder = this.find(".sortable-placeholder")

			if(res.el[0] != placeholder[0]){
				placeholder.remove()
				res.el[res.pos](placeholder)
			}
		},
		where : function(ev, not){
			var sortables = this.find(".sortable").not(not || []),
				sortable;

			for(var i=0; i < sortables.length; i++){
				//check if cursor is past 1/2 way
				sortable =  $(sortables[i]);
				if (ev.pageX < sortable.offset().left+sortable.width()/2) {
					return {
						pos: "before",
						el: sortable
					}
				}
			}
			if(!sortables.length){
				return {
						pos: "append",
						el: this.element
					}
			}
			//check if it is at the end ...
			if (ev.pageX >= sortable.offset().left+sortable.width()/2) {
				return {
						pos: "after",
						el: sortable
					}
			}
		},
		"dropon" : function(el, ev, drop, drag){
			if(this.element.has(drag.element).length){
				this.find(".sortable-placeholder").replaceWith(drag.element)
			}else{
				this.find(".sortable-placeholder").css("visibility","").removeClass("sortable-placeholder").addClass("sortable")
			}
			this.element.trigger("change")
		}
	})
	
})
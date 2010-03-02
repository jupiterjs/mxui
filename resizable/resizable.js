steal.plugins('jquery/controller','phui/wrapper','jquery/event/drag','jquery/dom/dimensions','phui/filler')
     .then(function(){
	 	$.Controller.extend("Phui.Resizable",{
			defaults : {
				minHeight: 10,
				minWidth: 10,
				handles : 'e, s, se'
			}
		},
		{
			setup : function(el, options){
				var diff = $(el).phui_wrapper()[0]
				this._super(diff, options)
				if(diff != el){
					this.original = $(el).phui_filler(); //set to fill
				}
			},
			init : function(el, options){
				//draw in resizeable
				this.element.prepend("<div class='ui-resizable-e ui-resizable-handle'/><div class='ui-resizable-s ui-resizable-handle'/><div class='ui-resizable-se ui-resizable-handle'/>")
			},
			".ui-resizable-s dragstart" : function(el, ev, drag){
				ev.stopPropagation();
				drag.vertical()
			},
			".ui-resizable-s dragmove" : function(el, ev, drag){
				var top = drag.location.y();
				
				var start = this.element.offset().top;
				var outerHeight = top-start
				if(outerHeight < this.options.minHeight){
					outerHeight = this.options.minHeight
					drag.location.y(start+this.options.minWidth)
				}
				this.element.outerHeight(outerHeight).trigger("resize")
			},
			".ui-resizable-e dragstart" : function(el, ev, drag){
				ev.stopPropagation();
				drag.horizontal()
			},
			".ui-resizable-e dragmove" : function(el, ev, drag){
				var left = drag.location.x();
				
				var start = this.element.offset().left;
				var outerWidth = left-start
				if(outerHeight < this.options.minWidth){
					outerWidth = this.options.minWidth
					drag.location.y(start+this.options.outerWidth)
				}
				this.element.outerWidth(outerWidth).trigger("resize")
			}
		})
		
	 })

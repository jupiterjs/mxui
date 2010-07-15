steal.plugins('jquery/controller').then(function($){
	$.Controller.extend("Phui.Tree",
	{
		defaults : {
			lastNode: "last-child",
			rootNode: "root-node",
			hasChildren : "has-children",
			child_selector: "li"
		},
		listensTo: ["default.show","default.hide","show","hide"]
	},
	//prevent deselecting old, instead toggle
	{
		init : function(){
			this.element.addClass(this.options.rootNode)
			var self= this;
			this.styleUL(this.element)

		},
		styleUL : function(ul){
			var options = this.options;
			ul.find(options.child_selector).each(function(){
				var $t = $(this);
				if(!$t.next().length)
					$t.addClass(options.lastNode);
				
				var c = $t.children();
				if(c.length > 1){
					c.eq(-1).hide()
					$t.addClass(options.hasChildren)
				}
				if(c.length == 0 ){
					$t.html("<a>"+$t.text()+"</a>")
				}
					
			});
			return ul;
		},
		
		/**
		 * By default this listens to "li click"
		 * Triggers deselect to get the party started.
		 */
		"{child_selector} {select_event}" : function(el, ev){
			if($(ev.target).closest("a").length){
				ev.preventDefault();
			}
			ev.stopPropagation();
			//make sure we aren't already active
			if(el.hasClass(this.options.active)){
				$(el).trigger("deselect")
			}else{
				$(el).trigger("select")
			}
			ev.stopPropagation();
		},
		"{child_selector} default.deselect" : function(el, ev){
			//Hide this guy
			$(ev.target).closest(this.options.child_selector)
				.removeClass(this.options.active)
				.removeClass(this.options.selected)
				.children("ul").hide();
		},
		"{child_selector} default.select" : function(el, ev){
		   $(ev.target).closest(this.options.child_selector)
				.addClass(this.options.active)
				.addClass(this.options.selected).children("ul").show();
		},
		
		"default.hide" : function(el, ev){
			if(ev.target == this.element[0]){
				var old = this.sub(this.element.find("."+this.options.active).removeClass(this.options.active));
				old && old.triggerDefaults("hide")
				this.element.hide();
			}
			
		},
		/**
		 * By default, shows the child element.
		 */
		"default.show" : function(el, ev){
		   if(ev.target == this.element[0]){
				this.element.show();
		   }
			
		}
		
	})
})

steal.plugins('phui/menuable').then(function($){
	//problem with this is it will search and find everything ...
	Phui.Menuable.extend("Phui.Tabs",{
		init : function(){
			this._super.apply(this, arguments);
			
			var selected = this.find(this.options.child_selector+"."+this.options.active)
			selected = selected.length ? selected : this.find(this.options.child_selector+":first")
			var self = this;
			//make sure everything is deactivated ...
			this.find(this.options.child_selector).each(function(){
				var sub = self.sub($(this))
				if(! sub.triggerHandled("hide")){
					$(sub).hide();
				}
			})
			selected.trigger("activate")
			return this.element;
		},
		/**
		 * Gets the sub element from the href, or just the order of things.
		 * @param {Object} el
		 */
		sub : function(el){
			var a = el.find("a[href]"), c
			if(a.length){
				c = $(a.attr('href'))
				if(c.length)
					return c;
			}
			return this.element.nextAll().eq(el.index())
			
			
		},
		/**
		 * Overwritten for performance
		 */
		calculateSubmenuPosition : function(){
		
		}
	})
	/*Phui.Tabs({
       class_names: "ui-tabs ui-widget ui-widget-content ui-corner-all",
       child_class_names: "ui-state-default ui-corner-top",
       button_class_names: "ui-state-default ui-corner-all",
	   tabs_container_class : "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all",
	   active : "ui-state-active",
	   selected  : "ui-tabs-selected",
	   types : [Phui.UI.Highlight]
   }).
   extend("Phui.UI.Tabs",{})*/
})

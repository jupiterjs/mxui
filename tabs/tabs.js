steal.plugins('phui/menu').then(function($){
	var p =Phui;
	
	$.Controller.extend("Phui.Tab",{listensTo: ["default.show","default.hide"]},{
		"default.show" : function(){
			this.element.show()
		},
		"default.hide" : function(){
			this.element.hide()
		}
	})
	//problem with this is it will search and find everything ...
	p.Menu({
		child_types: Phui.Tab,
		tabs_container_class : "",
		types : []
	}).extend("Phui.Tabs",{
		init : function(){
			var MyClass = this.Class,
				selected,
				options = this.options;
			
			this.element.mixin.apply(this.element, this.options.types).addClass(this.options.class_names).
					find(this.options.child_selector).
					addClass(this.options.child_class_names).each(function(){
						var el = $(this)
						if(!selected && el.hasClass(options.active)){
							selected = el;
						}
					})
			this.element.children('ul').addClass(this.options.tabs_container_class)
			this.element.children("div").each(function(){
						$(this).mixin(options.child_types);	
			}).trigger('hide')
			selected = selected || $(this.element.find(this.options.child_selector)[0])
			selected.trigger("select")
			
			return this.element;
		},
		sub : function(el){
			return this.element.find(el.find('a').attr('href'))
		},
		/**
		 * Overwritten for performance
		 */
		calculateSubmenuPosition : function(){
			
		}
	})
	Phui.Tabs({
       class_names: "ui-tabs ui-widget ui-widget-content ui-corner-all",
       child_class_names: "ui-state-default ui-corner-top",
       button_class_names: "ui-state-default ui-corner-all",
	   tabs_container_class : "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all",
	   active : "ui-state-active",
	   selected  : "ui-tabs-selected",
	   types : [Phui.UI.Highlight]
   }).
   extend("Phui.UI.Tabs",{})
})

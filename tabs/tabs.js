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
		CHILD_TYPES: Phui.Tab,
		TABS_CONAINER_CLASS : "",
		TYPES : []
	}).extend("Phui.Tabs",{
		init : function(element, level){
			var MyClass = this.Class;
			var selected;
			
			
			
			this.element.mixin.apply(this.element, this.Class.TYPES).addClass(this.Class.CLASS_NAMES).
					find(this.Class.CHILD_SELECTOR).
					addClass(this.Class.CHILD_CLASS_NAMES).each(function(){
						var el = $(this)
						if(!selected && el.hasClass(MyClass.ACTIVE_STATE)){
							selected = el;
						}
					})
			this.element.children('ul').addClass(this.Class.TABS_CONAINER_CLASS)
			this.element.children("div").each(function(){
						$(this).mixin(MyClass.CHILD_TYPES);	
			}).trigger('hide')
			selected = selected || $(this.element.find(this.Class.CHILD_SELECTOR)[0])
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
       CLASS_NAMES: "ui-tabs ui-widget ui-widget-content ui-corner-all",
       CHILD_CLASS_NAMES: "ui-state-default ui-corner-top",
       BUTTON_CLASS_NAMES: "ui-state-default ui-corner-all",
	   TABS_CONAINER_CLASS : "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all",
	   ACTIVE_STATE : "ui-state-active",
	   SELECTED_STATE  : "ui-tabs-selected",
	   TYPES : [Phui.UI.Highlight]
   }).
   extend("Phui.UI.Tabs",{})
})

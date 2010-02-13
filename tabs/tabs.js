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
		TYPES: Phui.Tab
	}).extend("Phui.Tabs",{
		init : function(element, level){
			var MyClass = this.Class;
			var selected;
			this.element.addClass(this.Class.CLASS_NAMES).
					find(this.Class.CHILD_SELECTOR).
					addClass(this.Class.CHILD_CLASS_NAMES).each(function(){
						var el = $(this)
						if(!selected && el.hasClass(MyClass.ACTIVE_STATE)){
							selected = el;
						}
					})
			
			this.element.children("div").each(function(){
						$(this).mixin(MyClass.TYPES);	
			}).trigger('hide')
			selected = selected || $(this.element.find(this.Class.CHILD_SELECTOR)[0])
			selected.trigger("select")
			
			return this.element;
		},
		sub : function(el){
			return this.element.find(el.find('a').attr('href'))
		}
	})
	
})

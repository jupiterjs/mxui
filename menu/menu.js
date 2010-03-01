steal.apps('phui/positionable','jquery/event/default','jquery/event/hover').then(function($){
	

	$.Controller.extend('Phui.Menu',
	{
		defaults : {
			types : [],
			select_event : "click",
			child_selector : "li",
			class_names : "", //ui-widget-content ui-menu ui-widget ui-corner-all
			child_class_names : "", //ui-menu-item ui-state-default
			apply_types_to_top : false, 
            active : "active",
			selected : "selected"
		},
		listensTo : ["default.show","default.hide"]
	},
	{
		init : function(){
			var MyClass = this.Class;
			var options = this.options;
			options.level = (options.level == null ? 0 : options.level+1);
			if(options.level > 0 || this.options.apply_types_to_top){
				this.element.mixin.apply(this.element, this.options.types).hide()
			}
			return this.element.addClass(this.options.class_names+" ui-menu-"+options.level).
					children(this.options.child_selector).
					addClass(this.options.child_class_names).
					each(function(){
						var el = $(this);
						el.data("menu-element", el.find(">ul, >.ui-menu").each(function(){
							new MyClass(this, {level: options.level})  
						}));
						
					})
			
			//create sub menus
		},
		"{child_selector} {select_event}" : function(el, ev){
            if($(ev.target).closest("a").length){
				ev.preventDefault();
			}
				
			//make sure we aren't already active
			if(el.hasClass(this.options.active)){
				return;
			}
			
			$(el).trigger("deselect")
		},
		"{child_selector} default.deselect" : function(el, ev){
		  //check if I have an li active
		  this.hideOld() //huh
		  el.trigger("select")
		},
		hideOld : function(){
			var active = this.find("."+this.options.active);
			if(active.length){
				var old = this.sub(active.removeClass(this.options.active).removeClass(this.options.selected))
				old && old.trigger("hide")
			}
		},
		/**
		 * Returns the sub-menu from this item
		 */
		sub : function(el){
			return el.data("menu-element");
		},
		"{child_selector} default.select" : function(el, ev){
		   var me = this.sub(el)
		   if (me.length) {
			 me.trigger("show", this.calculateSubmenuPosition(el, ev) )
		   }
		   el.addClass(this.options.selected)
		   el.addClass(this.options.active)
		},
		calculateSubmenuPosition : function(el, ev){
			return el;
		},
		"default.hide" : function(el, ev){
			 if(ev.target == this.element[0]){
			 	var old = this.sub(this.element.find("."+this.options.active).removeClass(this.options.active));
				old && old.trigger("hide")
				this.element.hide();
			 }
			
		},
		"default.show" : function(el, ev){
		   if(ev.target == this.element[0])
		   	this.element.show();
		}
   })

   $.Controller.extend("Phui.Highlight",
   {
       defaults: {
           child_selector : "li",
           hover : "hover"
       }
   },
   {
       "{child_selector} mouseenter" : function(el){
           el.addClass(this.options.hover)
       },
       "{child_selector} mouseleave" : function(el){
           el.removeClass(this.options.hover)
       }
   })
   Phui.Highlight({HOVER_CLASS : "ui-state-hover"}).extend("Phui.UI.Highlight")
   
   Phui.Menu({
			types : [Phui.Positionable({my :"left top", at: "right top"}), Phui.UI.Highlight],
			select_event : "hoverenter",
			child_selector : "li",
			class_names : "ui-widget-content ui-menu ui-widget ui-corner-all",
			child_class_names : "ui-menu-item ui-state-default", 
			apply_types_to_top : true,
            active : "ui-state-active"
	}).extend("Phui.UI.Menu")
   
   
   
});
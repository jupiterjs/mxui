steal.apps('phui/positionable','jquery/event/default','jquery/event/hover').then(function($){
	

	$.Controller.extend('Phui.Menu',
	{
		defaults : {
			TYPES : [],
			SELECT_TRIGGER : "click",
			CHILD_SELECTOR : "li",
			CLASS_NAMES : "", //ui-widget-content ui-menu ui-widget ui-corner-all
			CHILD_CLASS_NAMES : "", //ui-menu-item ui-state-default
			POSITION_TOP : true,
            ACTIVE_STATE : "active",
			SELECTED_STATE : "selected"
		},
		listensTo : ["default.show","default.hide"]
	},
	{
		init : function(element, level){
			var MyClass = this.Class;
			level = (level == null ? 0 : level+1);
			if(level > 0 || this.Class.POSITION_TOP){
				this.element.mixin.apply(this.element, this.Class.TYPES).hide()
			}
			return this.element.addClass(this.Class.CLASS_NAMES+" ui-menu-"+level).
					children(this.Class.CHILD_SELECTOR).
					addClass(this.Class.CHILD_CLASS_NAMES).
					each(function(){
						var el = $(this);
						el.data("menu-element", el.find(">ul, >.ui-menu").each(function(){
							new MyClass(this, level)  
						}));
						
					})
			
			//create sub menus
		},
		"{CHILD_SELECTOR} {SELECT_TRIGGER}" : function(el, ev){
            if($(ev.target).closest("a").length){
				ev.preventDefault();
			}
				
			//make sure we aren't already active
			if(el.hasClass(this.Class.ACTIVE_STATE)){
				return;
			}
			
			$(el).trigger("deselect")
		},
		"{CHILD_SELECTOR} default.deselect" : function(el, ev){
		  //check if I have an li active
		  this.hideOld() //huh
		  el.trigger("select")
		},
		hideOld : function(){
			var active = this.find("."+this.Class.ACTIVE_STATE);
			if(active.length){
				var old = this.sub(active.removeClass(this.Class.ACTIVE_STATE).removeClass(this.Class.SELECTED_STATE))
				old && old.trigger("hide")
			}
		},
		/**
		 * Returns the sub-menu from this item
		 */
		sub : function(el){
			return el.data("menu-element");
		},
		"{CHILD_SELECTOR} default.select" : function(el, ev){
		   var me = this.sub(el)
		   if (me.length) {
			 me.trigger("show",this.calculateSubmenuPosition(el, ev) )
		   }
		   el.addClass(this.Class.SELECTED_STATE)
		   el.addClass(this.Class.ACTIVE_STATE)
		},
		calculateSubmenuPosition : function(el, ev){
			var off = el.offset();
			off.left =off.left+ el.outerWidth();
			return off;
		},
		"default.hide" : function(el, ev){
			 if(ev.target == this.element[0]){
			 	var old = this.sub(this.element.find("."+this.Class.ACTIVE_STATE).removeClass(this.Class.ACTIVE_STATE));
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
           CHILD_SELECTOR : "li",
           HOVER_CLASS : "hover"
       }
   },
   {
       "{CHILD_SELECTOR} mouseenter" : function(el){
           el.addClass(this.Class.HOVER_CLASS)
       },
       "{CHILD_SELECTOR} mouseleave" : function(el){
           el.removeClass(this.Class.HOVER_CLASS)
       }
   })
   Phui.Highlight({HOVER_CLASS : "ui-state-hover"}).extend("Phui.UI.Highlight")
   
   Phui.Menu({
			TYPES : [Phui.Positionable, Phui.UI.Highlight],
			SELECT_TRIGGER : "hoverenter",
			CHILD_SELECTOR : "li",
			CLASS_NAMES : "ui-widget-content ui-menu ui-widget ui-corner-all",
			CHILD_CLASS_NAMES : "ui-menu-item ui-state-default", 
			POSITION_TOP : true,
            ACTIVE_STATE : "ui-state-active"
	}).extend("Phui.UI.Menu")
   
   
   
});
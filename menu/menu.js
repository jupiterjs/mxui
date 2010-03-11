steal.apps('phui/positionable','jquery/event/default','jquery/event/hover').then(function($){
	
	/**
	 * A general Menu System.
	 * 1. Listens for 'click' on 'li' elements (configurable)
	 * 2. Triggers "deselect" on that li.
	 * 3. By Default on "deselect" 
	 * 			triggers "hide" on the old submenu.  
	 * 				If hide is prevented -> stops.
	 * 			removes selected styling on old li
	 * 			triggers "select" on that li
	 * 4. By Default on "select"
	 * 			triggers "show" on the new submenu
	 * 			adds selected styling on li
	 * 
	 * The menu also listens to the following by default:
	 * "hide" -> hides the menu
	 * "show" -> shows the menu
	 */
	$.Controller.extend('Phui.Menu',
	{
		defaults : {
			/**
			 * A list of other types we want to mixin to each menu
			 */
			types : [],
			/**
			 * The default event to listen to
			 */
			select_event : "click",
			/**
			 * The default menu button selector
			 */
			child_selector : "li",
			/**
			 * Class names to provide each menu
			 */
			class_names : "", //ui-widget-content ui-menu ui-widget ui-corner-all
			/**
			 * Class names to provide each menu button
			 */
			child_class_names : "",
			/**
			 * If you want the top level menu to have 'types' mixed in.
			 */
			apply_types_to_top : false, 
			/**
			 * The active className
			 */
			active : "active",
			/**
			 * The selected className
			 */
			selected : "selected"
		},
		listensTo : ["default.show","default.hide"]
	},
	{
		/**
		 * Setup
		 */
		init : function(){
			var MyClass = this.Class;
			var options = this.options;
			
			//Menus are often nested, we want to know how deep we are
			options.level = (options.level == null ? 0 : options.level+1);
			
			//If we are a submenu or we want the top menu to also have types 
			if(options.level > 0 || this.options.apply_types_to_top){
				//mixin types and hide
				this.element.mixin.apply(this.element, this.options.types).hide()
			}
					//add pretty class names
			return this.element.addClass(this.options.class_names+" ui-menu-"+options.level).
					//get the menu buttons
					children(this.options.child_selector).
					//add pretty names to menu buttons
					addClass(this.options.child_class_names).
					each(function(){
						//for each menu button, save a reference to its sub ul in data.
						//we save a sub reference, b/c menus are pulled apart from their parent menu
						//in the dom
						var el = $(this);
						el.data("menu-element", el.find(">ul, >.ui-menu").each(function(){
							//for each sub menu (which there should only be 1 per menu button,
							//recursively create a new clas
							new MyClass(this, {level: options.level})  
						}));
						
					})
			
			//create sub menus
		},
		/**
		 * By default this listens to "li click"
		 * Triggers deselect to get the party started.
		 */
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
		/**
		 * Checks if it was ok to hide the old submenu, if it is
		 * -> triggers "select"
		 */
		"{child_selector} default.deselect" : function(el, ev){
		  //check if I have an li active
		  if(this.hideOld(ev))
			el.trigger("select")
		},
		/**
		 * Will try to hide the submenu.  It will return true if the submenu allowed it.
		 * @return {Boolean} false if the submenu canceled "hide"
		 */
		hideOld : function(ev){
			//Find who is currently active.
			var active = this.find("."+this.options.active+":first"),
				oldSubMenu,
				result;
			
			//If we have something active
			if(active.length){
				//Find the submenu element
				oldSubmenu = this.sub(active);
				if(oldSubmenu){
					//trigger a hide on the submenu, see if it went OK.
					result = oldSubmenu.triggerDefault("hide", ev);
					if(result){
						//if hide went ok, remove 'active' styling.
						active.removeClass(this.options.active).removeClass(this.options.selected)
					}
					return result;
				}
			}
			return true;
		},
		/**
		 * Returns the sub-menu from this item
		 */
		sub : function(el){
			return el.data("menu-element");
		},
		/**
		 * By default, finds the sub-menu for an LI, triggers show on it,
		 * then adds "active" styles.
		 */
		"{child_selector} default.select" : function(el, ev){
		   var me = this.sub(el)
		   if (me.length) {
			 me.triggerDefault("show", this.calculateSubmenuPosition(el, ev) )
		   }
		   el.addClass(this.options.selected)
		   el.addClass(this.options.active)
		},
		/**
		 * Returns where a sub-menu element should be positioned from.
		 */
		calculateSubmenuPosition : function(el, ev){
			return el;
		},
		/**
		 * Checks if we are the target for the hide, and hides any active submenus.
		 * This could check that those submenu hides are ok, but doesnt .... yet.
		 */
		"default.hide" : function(el, ev){
			 if(ev.target == this.element[0]){
				var old = this.sub(this.element.find("."+this.options.active).removeClass(this.options.active));
				old && old.triggerDefault("hide")
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
   /**
    * Adds basic higlighting.
    */
   $.Controller.extend("Phui.Highlight",
   {
	   defaults: {
		   child_selector : "li",
		   hover_class : "hover"
	   }
   },
   {
	   "{child_selector} mouseenter" : function(el){
		   el.addClass(this.options.hover_class)
	   },
	   "{child_selector} mouseleave" : function(el){
		   el.removeClass(this.options.hover_class)
	   }
   })
   /**
    * jQuery.UI themed highlighting
    */
   Phui.Highlight({hover_class : "ui-state-hover"}).extend("Phui.UI.Highlight")
   
   /**
    * Phui.UI.Menu is a jQuery.UI themed menu.
    */
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